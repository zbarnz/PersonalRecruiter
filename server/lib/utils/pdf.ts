import html_to_pdf from "html-pdf-node";

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

export async function compileHTMLtoPDF(coverLetter: string): Promise<Buffer> {
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
  return generatedPdfBuffer;
}
