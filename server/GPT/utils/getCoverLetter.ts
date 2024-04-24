import { getCoverLetterPrompt } from "../prompts/getCoverLetter";
import { coverLetter } from "../../src/apply_assets/coverletter";

import { sanitizeFilename } from "../../lib/utils/parsing";
import { compileHTMLtoPDF } from "../../lib/utils/pdf";

import { User } from "../../entity/User";
import { Listing } from "../../entity/Listing";

import { getListingByIdHelper } from "../../controllers/listing";
import { getUserHelper } from "../../controllers/user";

import { GPTText } from "../index";

import { Response, Request } from "express";

import path from "path";

export async function generateCoverLetter(
  user: User,
  listing: Listing
): Promise<{ clPath: string; clText: string }> {
  if (
    user &&
    user.summarizedResume &&
    listing &&
    listing.summarizedJobDescription
  ) {
    const prompt = getCoverLetterPrompt(
      user.summarizedResume,
      listing.summarizedJobDescription
    );

    let retries: number = 0;
    let completionText: string;
    let clPath: string;

    ({ text: completionText } = await GPTText(
      prompt,
      user,
      undefined,
      undefined,
      listing
    ));

    function removePlaceholders(input: string): string {
      return input.replace(/\[.*?\]/g, "");
    }

    let parsedText = removePlaceholders(completionText).replace(/\n/g, "<br>");

    console.log("GPT Attempt #:" + retries);

    const clFolder = path.join(
      __dirname,
      "../../../../src/otherApplyAssets/cover_letters/"
    );

    const clFileName = sanitizeFilename(
      (listing.company || "Zach_Barnes") +
        "_" +
        listing.title +
        "_resume_" +
        listing.jobListingId +
        ".pdf"
    );

    clPath = clFolder + clFileName;

    const clHTML = coverLetter(
      parsedText,
      user.firstName + " " + user.lastName,
      user.phone,
      user.email,
      user.website
    );

    await compileHTMLtoPDF(clHTML, clPath);

    return { clPath, clText: completionText };
  } else {
    throw new Error("User or listing missing summarization");
  }
}
