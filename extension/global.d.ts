type IndeedApplyButtonAttributes = {
  postUrl: string;
  jk: string;
  jobTitle: string;
  questions: string;
  onappliedstatus: string;
  jobCompanyName: string;
  recentsearchquery: string;
  jobUrl: string;
  onready: string;
  resume: string;
  jobMeta: string;
  pingbackUrl: string;
  noButtonUI: string;
  jobId: string;
  apiToken: string;
  jobLocation: string;
  continueUrl: string;
};

type Question = {
  viewId: string;
  name: string;
  question: string;
  min: string;
  max: string;
  requiredFormat: string;
  characterLimit: string;
  options: Array<{ value: string; label: string }>;
};

interface NavigateMessage {
  action: "navigate";
  url: string;
  tabId: number;
  navId: string;
}
interface Window {
  _initialData: any; // You can replace `any` with a more specific type tailored to your data
}

type Documents = {
  coverLetter: { buffer: Buffer | null; text: string | null } | null;
  resume: Buffer | null;
  answeredQuestions: any[] | null;
};
