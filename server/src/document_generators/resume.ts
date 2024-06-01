import puppeteer from "puppeteer";
import fs from "fs";

import resume, {
  TemplateFunction,
  TemplateName,
  ResumeData,
} from "resume-lite";

export async function resumeGenerator(
  template: TemplateName,
  resumeData: ResumeData
): Promise<Buffer> {
  //test generate call
  const html = resume.generate(template, resumeData);

  try {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });

    const height = await page.evaluate(
      () => document.documentElement.scrollHeight
    );

    const buffer = await page.pdf({
      width: "8.27in", // A4 width in inches
      height,
      printBackground: true,
    });

    const outputDir = "test_output";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Close all the pages and disconnect from the browser
    await page.close();
    await browser.close();

    return buffer;
  } catch (error) {
    throw new Error(error as any);
  }
}
