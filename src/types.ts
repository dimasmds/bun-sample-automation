export type ProjectConfig = {
  id: string;
  submitterId: number;
  submitterName: string;
}

export type Report = {
  projectId: string;
  message: string;
  checklist: string[];
  passed: boolean;
}

export type Checklists = {
  containPackageJson: Checklist,
  containMainJs: Checklist,
  mainJSContainStudentID: Checklist,
  rootShouldShowingHTML: Checklist,
  appPortShould5000: Checklist,
  htmlShouldContainH1AndStudentId: Checklist,
}

export type Checklist = {
  key: string,
  completed: boolean,
  reason: string,
}
