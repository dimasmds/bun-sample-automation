import { describe, test, expect } from 'bun:test';
import { join } from 'node:path';
import { findFolderBaseOnFile, parseArgs, readProjectConfig } from './utils';

function getSampleProjectPath(sample: string) {
  return join(process.cwd(), 'samples', sample);
}

describe('utils', () => {
  describe('readProjectConfig', () => {
    test('should throw error when project config is not found', () => {
      const projectPath = getSampleProjectPath('no-project-config');

      expect(readProjectConfig(projectPath)).rejects.toThrow();
    });

    test('should return ProjectConfig correctly', async () => {
      const projectPath = getSampleProjectPath('with-project-config');

      const result = await readProjectConfig(projectPath);

      expect(result.id).toEqual('project-1');
      expect(result.submitterName).toEqual('John Doe');
    });
  });

  describe('findFolderBaseOnFile', async () => {
    test('should return null when looked up file is not found', async () => {
      const projectPath = getSampleProjectPath('no-project-config');

      const result = await findFolderBaseOnFile(projectPath, 'main.js');

      expect(result).toEqual(null);
    });

    test('should return folder path when looked up file and is found', async () => {
      const projectPath = getSampleProjectPath('looking-up-main-js');

      const result = await findFolderBaseOnFile(projectPath, 'main.js');

      expect(result).toEqual(`${projectPath}/project`);
    });
  });

  describe('parseArgs', async () => {
    test('should throw error when argument not contain --path', async () => {
      const argv = [];

      expect(() => parseArgs(argv)).toThrowError();
    });

    test('should use path value when argument not contain --report', async () => {
      const projectPath = '/some/where/to/locate';
      const argv = ['compiler', 'file', '--path', projectPath];

      const { path, report } = parseArgs(argv);

      expect(path).toEqual(projectPath);
      expect(report).toEqual(projectPath);
    });

    test('should return report and path correctly', () => {
      const projectPath = '/some/where/to/project/path';
      const reportPath = '/some/where/to/report/path';
      const argv = ['compiler', 'file', '--path', projectPath, '--report', reportPath];

      const { path, report } = parseArgs(argv);

      expect(path).toEqual(projectPath);
      expect(report).toEqual(reportPath);
    });
  });
});
