import { AutoApply, GPTLog, Listing, User } from "../entity";

import { logger } from "../../lib/logger/pino.config";

import {
  ChatCompletion,
  ChatCompletionCreateParamsBase,
  ChatCompletionMessage,
} from "openai/resources/chat/completions";
import { encoding_for_model, Tiktoken } from "tiktoken";

import { createApplyHelper } from "../controllers/autoApply";
import {
  createGPTLogHelper,
  setGPTLogAsFailedHelper,
} from "../controllers/gPTLog";

import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const GPT_API_KEY = process.env.GPT_API_KEY;
const GPT_MODEL = process.env.GPT_MODEL;

const openai = new OpenAI({
  apiKey: GPT_API_KEY,
});

export async function GPTText( //TODO change args to options obj
  prompt: string,
  user?: User,
  prevLogId?: number | null,
  autoApply?: AutoApply,
  listing?: Listing,
  forceModel?: string,
  systemPrompt?: string,
  systemFlag?: boolean
): Promise<{ text: string; prevLogId: number }> {
  try {
    let model: ChatCompletionCreateParamsBase["model"] =
      GPT_MODEL as ChatCompletionCreateParamsBase["model"];
    let completionText: ChatCompletionMessage;
    let encoder: Tiktoken;

    if (prevLogId) {
      await setGPTLogAsFailedHelper(prevLogId);
    }

    if (forceModel) {
      model = forceModel;
    }

    if (!model || model == "gpt-3.5-turbo-1106") {
      encoder = encoding_for_model("gpt-3.5-turbo");
    } else {
      encoder = encoding_for_model("gpt-4");
    }

    if (!listing) {
      throw new Error(
        "GPT call not associated with listing. This is a serious error"
      );
    }

    const tokensArray = encoder.encode(prompt);
    const estimatedTokenCount = tokensArray.length;

    if (model && model.includes("gpt-4") && estimatedTokenCount > 5000) {
      if (autoApply) {
        // Check if autoApply is defined
        autoApply.failedFlag = true;
        autoApply.failedReason = "GPT Prompt too expensive";
        await createApplyHelper(autoApply);
      }

      throw new Error(
        `GPT prompt too expensive: \n estimated token count: ${estimatedTokenCount} \n prompt: ${[
          prompt,
        ]}`
      );
    }

    if (!model) {
      model = "gpt-3.5-turbo-1106";
    }

    const messages = [{ role: "user", content: prompt }];

    if (systemPrompt) {
      messages.unshift({ role: "system", content: systemPrompt });
    }

    logger.info("Starting GPT call");
    const completion: ChatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt || "" },
        { role: "user", content: prompt },
      ],
      model: model,
    });
    logger.info("Ending GPT call");

    const gptLog = new GPTLog();
    gptLog.input = prompt;
    gptLog.response = completion;
    gptLog.completionTokens = completion?.usage?.completion_tokens || null;
    gptLog.promptTokens = completion?.usage?.prompt_tokens || null;
    gptLog.prevAttemptId = prevLogId || null;
    gptLog.model = model;
    gptLog.listing = listing;
    gptLog.user = user || null;
    gptLog.systemFlag = systemFlag || false;
    gptLog.createdAt = new Date(Math.floor(Date.now()));

    logger.info("saving GPT log");
    const savedLog = await createGPTLogHelper(gptLog);

    completionText = completion.choices[0].message;

    if (completionText && completionText.content) {
      return {
        text: completionText.content,
        prevLogId: savedLog.id, // Assuming 'id' is the identifier for the saved log
      };
    } else {
      throw new Error(
        "Failed to generate GPT completion text or content is empty."
      );
    }
  } catch (err) {
    throw new Error("GPT call failed");
  }
}
