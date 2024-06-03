import { describe, expect, test } from 'bun:test';
import { join } from 'node:path';
import { main } from './grader';

function getSampleProjectPath(sample: string) {
  return join(process.cwd(), 'samples', sample);
}

async function readReport(projectPath: string) {
  const filename = join(projectPath, 'report.json');
  const file = Bun.file(filename);

  return file.json();
}

describe('graders', () => {
  describe('main', () => {
    test('should reject when not contain main.js', async () => {
      // Arrange
      const projectPath = getSampleProjectPath('rejected-not-contain-main-js');

      // Action
      await main(projectPath, projectPath);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(false);
    });

    test('should reject when not contain package.json', async () => {
      // Arrange
      const projectPath = getSampleProjectPath('rejected-not-contain-package-json');

      // Action
      await main(projectPath, projectPath);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(false);
    });

    test('should reject when root not showing html', async () => {
      // Arrange
      const projectPath = getSampleProjectPath('rejected-not-contain-package-json');

      // Action
      await main(projectPath, projectPath);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(false);
    });

    test('should reject when wrong port', async () => {
      // Arrange
      const projectPath = getSampleProjectPath('rejected-wrong-port');

      // Action
      await main(projectPath, projectPath);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(false);
    });

    test('should reject due no comment', async () => {
      // Arrange
      const projectPath = getSampleProjectPath('rejected-with-no-comment');

      // Action
      await main(projectPath, projectPath);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(false);
    });

    test('should reject wrong submitter id in comment', async () => {
      // Arrange
      const projectPath = getSampleProjectPath('rejected-wrong-submitter-id-in-comment');

      // Action
      await main(projectPath, projectPath);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(false);
    });

    test('should reject wrong submitter id in html', async () => {
      // Arrange
      const projectPath = getSampleProjectPath('rejected-wrong-submitter-id-in-html');

      // Action
      await main(projectPath, projectPath);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(false);
    });

    test('should approve when project is not nested', async () => {
      // Arrange
      const projectPath = getSampleProjectPath('approved-no-nested');

      // Action
      await main(projectPath, projectPath);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(true);
    });

    test('should approve when project with nested', async () => {
      // Arrange
      const projectPath = getSampleProjectPath('approved-with-nested');

      // Action
      await main(projectPath, projectPath);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(true);
    });

    test('should approve when project using hapi', async () => {
      // Arrange
      const projectPath = getSampleProjectPath('approved-using-hapi');

      // Action
      await main(projectPath, projectPath);

      // Assert
      const report = await readReport(projectPath);
      expect(report.passed).toEqual(true);
    });
  });
});
