import puppeteer from "puppeteer";
import { Page, PDFOptions } from "puppeteer";

async function generatePdf(html) {
  // we are using headless mode
  const args = ["--no-sandbox", "--disable-setuid-sandbox"];
  const pdfOptions: PDFOptions = {
    format: "A4",
    margin: { bottom: "1cm", top: "1cm" },
  };

  let buffer: Buffer;

  try {
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: args,
    });
    const page = await browser.newPage();

    if (html) {
      // We set the page content as the generated html by handlebars
      await page.setContent(html, {
        waitUntil: "networkidle0", // wait for page to load completely
      });
    }

    buffer = await page.pdf(pdfOptions);

    await browser.close();
  } catch (error) {
    throw new Error("Error generating PDF: " + error);
  }

  return buffer;
}

export async function compileHTMLtoPDF(coverLetter: string): Promise<Buffer> {
  // Create a File object for the generatePdfPromise function
  const contentObj = {
    content: coverLetter, // Set the HTML content
  };

  // Generate PDF buffer from HTML content
  const generatedPdfBuffer = await generatePdf(contentObj);

  // Write the generated PDF to the file system
  return generatedPdfBuffer;
}
