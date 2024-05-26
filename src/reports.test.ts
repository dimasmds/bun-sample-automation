import { describe, beforeEach, test, expect } from 'bun:test';
import { buildChecklist } from './checklists';
import { join } from 'node:path';
import { buildReport } from './reports';
import { readProjectConfig } from './utils';
import { Checklists } from './types';

function getSampleProjectPath(sample: string) {
  return join(process.cwd(), 'samples', sample);
}

async function readReport(projectPath: string) {
  const filename = join(projectPath, 'report.json');
  const file = Bun.file(filename);

  return file.json();
}

describe('reports', () => {
  describe('buildReport', () => {
    let checklists: Checklists;

    beforeEach(() => {
      checklists = buildChecklist();
    });

    test('should generate failed report correctly', async () => {
      // Arrange
      checklists.containPackageJson.completed = false;
      checklists.containPackageJson.reason = 'we cannot find the package.json of your project';
      const projectPath = getSampleProjectPath('with-project-config');
      const projectConfig = await readProjectConfig(projectPath);

      // Action
      await buildReport(checklists, projectPath, projectConfig);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(false);
      expect(report.checklist.includes(checklists.containPackageJson.key)).toEqual(false);
    });

    test('should generate success report correctly', async () => {
      // Arrange
      const projectPath = getSampleProjectPath('with-project-config');
      const projectConfig = await readProjectConfig(projectPath);

      // Action
      await buildReport(checklists, projectPath, projectConfig);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(true);
    });
  });
});
