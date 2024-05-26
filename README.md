# Dummy Auto-grader for grading JavaScript (Server) Project
> This project was created to try Bun as a replacement for Node.js for everyday tasks.

## Setup Project
1. Clone this repository.
2. Install the dependencies: `bun install`.
3. Run the test: `bun run test`.
4. Make sure all tests pass.
5. Compile to binary by using: `bun run compile`.

## Run Grading Process
- Using Bun command: `bun start -- --path <project-path> --report <report-output-path>`
- Using single-execution binary: `app --path <project-path> --report <report-output-path>`

## Criteria for Automatically Graded Node.js Project
- Contains `package.json`.
- Contains a `main.js` file.
- The `main.js` file must contain a comment with the sender's `id`.
- The root of the `main.js` application must display HTML.
- The port must be set to 5000.
- The HTML file must contain an h1 element with the sender's `id`.
