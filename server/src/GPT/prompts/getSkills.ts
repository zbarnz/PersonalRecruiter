export function getSkillsPrompt(
  jobDescription: string,
  skills: string[]
): string {
  const prompt = `Given a job description and a list of my existing skills, curate a list of hard skills that meet the following requirements. 
  1. List MUST fit job hard skill requirements. 
  2. If necessary, pad list with some of my skills
  3. Include ONLY Technical/hard skills. 
  4. Present the results as a JavaScript array without additional explanations. 
  5. Array length must be between 9 and 16

Job Description:
###
${jobDescription}
###
My skills:
###
${skills}
###

const newArray = `;

  return prompt;
}
