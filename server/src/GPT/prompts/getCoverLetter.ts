export function getCoverLetterPrompt(resume: string, jobDescription: string) {
  const prompt = `Based on the details from the resume and job description provided, generate a personalized and compelling cover letter in the first person. This cover letter should highlight my qualifications, experience, and enthusiasm for the role, reflecting my voice and story. The Cover letter should meet the requirements for the position. Start the cover letter with "Dear Hiring Manager," and end with "Sincerely" and then my name. This is a final draft.
  
  Resume:
  ###
  ${resume}
  ###

  Job Description:
  ###
  ${jobDescription}
  ###

  const coverLetter = '
  `;

  return prompt;
}
