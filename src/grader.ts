import { findFolderBaseOnFile, readProjectConfig } from './utils';
import { $ } from 'bun';
import extract from 'esprima-extract-comments';
import { spawn } from 'node:child_process';
import { buildChecklist } from './checklists';
import { buildReport } from './reports';
import { join } from 'node:path';

async function getPackageJsonPath(submissionPath: string): Promise<string> {
  return await findFolderBaseOnFile(submissionPath, 'package.json');
}

async function getMainJSPath(submissionPath: string): Promise<string> {
  return await findFolderBaseOnFile(submissionPath, 'main.js');
}

async function isMainJSContainSubmitterIdComment(mainJSPath: string, submitterId: number): Promise<boolean> {
  const filepath = join(mainJSPath, 'main.js');
  const content = await Bun.file(filepath).text();
  const token = extract(content, {});

  if (token.length < 1) {
    return false;
  }

  const comments = token.map((t) => t.value.trim());

  return comments.includes(String(submitterId));
}

async function installDependencies(projectPath: string): Promise<void> {
  await $`bun install`
    .cwd(projectPath)
    .quiet();
}

function runApp(mainJsPath: string) {
  const filepath = join(mainJsPath, 'main.js');
  /**
   * Bug
   * not using Bun.spawn because child hard to kill
   */
  return spawn(Bun.which('bun'), ['run', filepath]);
}

async function waitUntilPortOpen(port: number, timeout: number) {
  if (timeout <= 0) {
    return;
  }

  const sleepTime = 100;
  const { stdout } = await $`lsof -i -P -n | grep "${port} (LISTEN)"`.quiet();
  const result = stdout.toString('utf-8');

  if (result.trim() === '') {
    await Bun.sleep(sleepTime);
    const nextTimeout = timeout - (sleepTime * 2);
    return waitUntilPortOpen(port, nextTimeout);
  }
}

async function fetchContent() {
  try {
    return await fetch('http://localhost:5000/');
  } catch {
    return null;
  }
}

function checkIsResponseHTML(response: Response) {
  return response.headers.get('Content-Type').includes('html');
}

async function checkIsContainH1AndSubmitterId(response: Response, submitterId: number) {
  const responseText = await response.text();
  const trimmedText = responseText.trim().replace(' ', '');
  const expectedText = `<h1>${submitterId}</h1>`;

  return trimmedText.includes(expectedText);
}

export async function main(path: string, report: string) {
  const checklists = buildChecklist(false);
  const projectConfig = await readProjectConfig(path);

  const projectPath = await getPackageJsonPath(path);

  // checking package.json
  if (projectPath === null) {
    checklists.containPackageJson.reason = 'Kami tidak dapat menemukan berkas package.json pada submission Anda.';
    await buildReport(checklists, report, projectConfig);
    return;
  }

  checklists.containPackageJson.completed = true;


  // checking main.js
  const mainJsPath = await getMainJSPath(projectPath);

  if (mainJsPath === null) {
    checklists.containMainJs.reason = 'Kami tidak dapat menemukan berkas main.js pada submission Anda.';
    await buildReport(checklists, report, projectConfig);
    return;
  }

  checklists.containMainJs.completed = true;

  // checking comment in main.js
  const { submitterId } = projectConfig;
  const commentCheck = await isMainJSContainSubmitterIdComment(mainJsPath, submitterId);

  if (!commentCheck) {
    checklists.mainJSContainStudentID.reason = 'Kami tidak dapat menemukan komentar yang ditulis pada main.js sesuai dengan submitter id';
  } else {
    checklists.mainJSContainStudentID.completed = true;
  }

  // installing dependencies
  await installDependencies(projectPath);

  // running app
  const childProcess = runApp(mainJsPath);

  // wait port to open
  await waitUntilPortOpen(5000, 5_000);

  // fetch content
  const response = await fetchContent();

  if (response === null) {
    checklists.appPortShould5000.reason = 'Kami gagal mengakses aplikasmu. Pastikan kamu menggunakan port 5000.';
    await buildReport(checklists, report, projectConfig);
    return;
  }

  checklists.appPortShould5000.completed = true;


  // Check Response Type
  const isResponseHTML = checkIsResponseHTML(response);

  if (!isResponseHTML) {
    checklists.rootShouldShowingHTML.reason = 'Response dari aplikasimu tidak berupa HTML';
  } else {
    checklists.rootShouldShowingHTML.completed = true;
  }

  // Check Response Content
  const isContentContainSubmitterId = await checkIsContainH1AndSubmitterId(response, submitterId);

  if (!isContentContainSubmitterId) {
    checklists.htmlShouldContainH1AndStudentId.reason = 'Response dari aplikasimu tidak menampilkan submitter id yang dibungkus dengan element h1';
  } else {
    checklists.htmlShouldContainH1AndStudentId.completed = true;
  }

  // Stop App
  childProcess.kill('SIGKILL');

  // Report
  await buildReport(checklists, report, projectConfig);
}
