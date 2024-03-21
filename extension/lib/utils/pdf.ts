import * as fs from "fs/promises";
import * as html_to_pdf from "html-pdf-node";
import { File } from "html-pdf-node";
import { PDFDocument } from "pdf-lib";



// Utility function to promisify the generatePdf function
function generatePdfPromise(
  file: html_to_pdf.File,
  options?: html_to_pdf.Options
): Promise<Buffer> {
  if (!options) {
    options = {}; // Assign a default empty object if options is undefined
  }

  return new Promise((resolve, reject) => {
    html_to_pdf.generatePdf(file, options, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

async function compileResumeToPDF(
  improvedResume: string,
  pageToAppendPath: string,
  outputPath: string
): Promise<void> {
  try {
    const improvedResumeContent = improvedResume; // this is your string containing HTML

    // Create a File object as expected by the generatePdfPromise function
    const improvedResumeFile: File = {
      content: improvedResumeContent, // set the HTML content as the content property
    };

    const generatedPdfBuffer = await generatePdfPromise(improvedResumeFile, {
      format: "A4",
    });

    await fs.writeFile("output.pdf", generatedPdfBuffer);
    console.log("the PDF has been saved");

    // Load the original PDF
    const originalPdfDoc = await PDFDocument.load(generatedPdfBuffer);

    // Load the PDF with the page we want to append
    const pageToAppendBytes = await fs.readFile(pageToAppendPath);
    const pageToAppendDoc = await PDFDocument.load(pageToAppendBytes);

    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create();

    // Extract the first page of the original PDF
    const copiedPages = await newPdfDoc.copyPages(originalPdfDoc, [0]);

    // Add the first page to the new document
    newPdfDoc.addPage(copiedPages[0]);

    // Copy the page we want to append to the new document
    const [newPage] = await newPdfDoc.copyPages(pageToAppendDoc, [0]);
    newPdfDoc.addPage(newPage);

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await newPdfDoc.save();

    // Write the modified PDF to the file system
    await fs.writeFile(outputPath, pdfBytes);
  } catch (err) {
    console.log(err);
  }
}

async function compileHTMLtoPDF(coverLetter: string, outputPath: string) {
  // Create a File object for the generatePdfPromise function
  const contentObj = {
    content: coverLetter, // Set the HTML content
  };

  // Generate PDF buffer from HTML content
  const generatedPdfBuffer = await generatePdfPromise(contentObj, {
    format: "A4",
    margin: { bottom: "1cm", top: "1cm" },
  });

  // Write the generated PDF to the file system
  await fs.writeFile(outputPath, generatedPdfBuffer);
  console.log("The PDF has been saved");
}