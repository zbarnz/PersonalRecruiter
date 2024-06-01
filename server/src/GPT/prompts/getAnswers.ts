export function getAnswersPrompt(
  jobDescription: string,
  resume: string,
  questions: string
): string {
  const prompt = `- You are an ideal job candidate filling out a job form.
  - Use the provided job description, your resume, and questions to craft your responses.
  - Refer to your resume for specific queries.
  - Slightly embellish answers to improve job prospects.
  - Your Answer MUST follow the requiredFormat
  - You MUST choose from options (value property) when field is present.
  - Only if type/format is MULTISELECT, answer may be an array of strings
  - Present responses as an array of answer objects.
  - Ensure answers align with the job's minimum requirements.
  - Do not include questions in your responses.
  - If possible choose not to answer demographic questions
  - Choose not to receive marketing or new job notifications
  - All questions are required
  - Length of output Array must equal length of input array

output example: 
###
[{ "viewId": "jf904j20904j2", name: "q_8315a102f42846078b", answer: "3" },{ "viewId": "jf904j20904j8", name: "q_8315a102f42846077d", answer: "My favorit coding language is Python" }]
###

Job description: 
###
${jobDescription}
###

Resume: 
###
${resume}
###

Questions: 
###
${questions}
###

const array = [`;

  return prompt;
}
