import { join } from 'node:path';
import { Checklist, Checklists, ProjectConfig, Report } from './types';

const approvalTemplates = '<p>Selamat <strong>$submitter_name</strong>! Kamu telah lolos submission ini!';
const rejectionTemplates = '<p>Maaf <strong>$submitter_name</strong>! Kamu belum berhasil lolos dengan alasan: $reasons';

async function writeReportToJSON(report: Report, reportFolder: string) {
  const filepath = join(reportFolder, 'report.json');
  await Bun.write(filepath, JSON.stringify(report, null, 2));
}

async function buildApprovedReport(checklists: Checklists, reportFolder: string, submissionConfig: ProjectConfig) {
  const { submitterName, id } = submissionConfig;
  const message = approvalTemplates.replace('$submitter_name', submitterName);

  const report = {
    projectId: id,
    message,
    checklist: Object.keys(checklists).map((prop) => checklists[prop].key),
    passed: true,
  };

  await writeReportToJSON(report, reportFolder);
}

async function buildRejectionReport(checklists: Checklists, rejectedChecklist: Checklist[], reportPath: string, projectConfig: ProjectConfig) {
  const { submitterName, id } = projectConfig;

  const checklistKeys = rejectedChecklist.map((checklist) => checklist.key);
  const reasons = rejectedChecklist.map((checklist) => checklist.reason).filter((reason) => reason !== null);

  const message = rejectionTemplates
    .replace('$submitter_name', submitterName)
    .replace('$reasons', reasons.join(', '));

  const checklist = Object.keys(checklists)
    .map((prop) => checklists[prop])
    .filter((c) => !checklistKeys.includes(c.key))
    .map((c) => c.key);

  const report = {
    projectId: id,
    message,
    checklist,
    passed: false,
  };

  await writeReportToJSON(report, reportPath);
}

export async function buildReport(checklists: Checklists, reportPath: string, projectConfig: ProjectConfig) {
  const rejectedChecklist: Checklist[] = Object.keys(checklists)
    .filter((prop) => checklists[prop].completed === false)
    .map((prop) => ({ ...checklists[prop] }));

  if (rejectedChecklist.length > 0) {
    await buildRejectionReport(checklists, rejectedChecklist, reportPath, projectConfig);
    return;
  }

  await buildApprovedReport(checklists, reportPath, projectConfig);
}
