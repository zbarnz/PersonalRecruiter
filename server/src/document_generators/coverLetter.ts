import { User, UserApplicantConfig } from "../entity";

export function coverLetter(
  coverLetter: string,
  user: User,
  userApplicantConfig: UserApplicantConfig
): string {
  const formattedText = coverLetter.replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Zach Barnes CL</title>
  </head>
  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333;">
      <div style="width: 80%; margin: 0 auto; padding: 20px; text-align: left;">
          <div style=" border-bottom: #333 1px solid; margin-bottom: .3em; ">
              <h1 style="margin: 0;  margin-bottom: .5em; color: #004E89;">${
                userApplicantConfig.firstName +
                " " +
                userApplicantConfig.lastName
              }</h1>
          </div>
        <div style="display: flex; align-items: center; margin-top: 1em; margin-bottom: 3em; font-size: small; color: #696969;">
            <p style="margin: 0;">${userApplicantConfig.phone}</p>
            <span style="margin: 0 1em;">•</span>
            <p style="margin: 0;">${userApplicantConfig.email}</p>
            ${
              userApplicantConfig.website &&
              `<span style="margin: 0 1em;">•</span>`
            }
            <p style="margin: 0;">${userApplicantConfig.website}</p>
        </div>
          <div style="line-height: 1.6;">
            ${formattedText}
          </div>
          </div>
      </div>
  </body>
  </html>
`;
}
