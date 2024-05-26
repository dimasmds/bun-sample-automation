import { parseArgs } from './utils';
import { main } from './grader';

const { path, report } = parseArgs(Bun.argv);
await main(path, report);
