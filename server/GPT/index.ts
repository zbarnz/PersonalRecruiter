import { User } from "../entity/User";
import { Listing } from "../entity/Listing";
import { AutoApply } from "../entity/AutoApply";
import { GPTLog } from "../entity/GPTLog";

import {
  ChatCompletionCreateParamsBase,
  ChatCompletionMessage,
  ChatCompletion,
} from "openai/resources/chat/completions";
import {
  get_encoding,
  encoding_for_model,
  Tiktoken,
  TiktokenModel,
} from "tiktoken";

import {
  setGPTLogAsFailedHelper,
  createGPTLogHelper,
} from "../controllers/gPTLog";
import { createApplyHelper } from "../controllers/autoApply";

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const GPT_API_KEY = process.env.GPT_API_KEY;
const GPT_MODEL = process.env.GPT_MODEL;

const openai = new OpenAI({
  apiKey: GPT_API_KEY,
});

export async function GPTText( //TODO change args to options obj
  prompt: string,
  user?: User,
  prevLogId?: number,
  autoApply?: AutoApply,
  listing?: Listing,
  forceModel?: string,
  systemPrompt?: string,
  systemFlag?: boolean
): Promise<{ text: string; prevLogId: number }> {
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

  if (!listing || !listing.id) {
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

  console.log("Starting GPT call");
  const completion: ChatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt || "" },
      { role: "user", content: prompt },
    ],
    model: model,
  });
  console.log("Ending GPT call");

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
  gptLog.createdAt = Math.floor(Date.now() / 1000);

  const savedLog = await createGPTLogHelper(gptLog);

  completionText = completion.choices[0].message;

  if (completionText && completionText.content) {
    return {
      text: completionText.content,
      prevLogId: savedLog.id, // Assuming 'id' is the identifier for the saved log
    };
  } else {
    throw new Error("Failed to generate completion text or content is empty.");
  }
}
