import { join } from 'node:path';
import { promises as fsPromises } from 'node:fs';
import { parseArgs as _parseArgs } from 'util';
import { ProjectConfig } from './types';

const { readdir } = fsPromises;

export function parseArgs(args: string[]) {
  const { values } = _parseArgs({
    args,
    options: {
      path: {
        type: 'string',
        required: true,
      },
      report: {
        type: 'string',
        required: false,
      }
    },
    allowPositionals: true,
    strict: true,
  });

  if (!values.path) {
    throw new Error('you should pass the --path argument to the given project path');
  }

  if (!values.report) {
    values.report = values.path;
  }

  return values;
}

export async function readProjectConfig(projectPath: string): Promise<ProjectConfig> {
  const filepath = join(projectPath, 'project-config.json');
  return await Bun.file(filepath).json();
}

export async function findFolderBaseOnFile(folder: string, filename: string): Promise<string> {
  const files = await readdir(folder);
  const filteredFiles = files.filter((f) => f !== 'node_modules');

  if (filteredFiles.includes(filename)) {
    return folder;
  }

  return Promise.any(
    filteredFiles.map((fileOrDir) => findFolderBaseOnFile(join(folder, fileOrDir), filename))
  ).catch(() => Promise.resolve(null));
}
