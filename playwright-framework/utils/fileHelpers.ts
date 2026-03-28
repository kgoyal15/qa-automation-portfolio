import * as fs from 'fs';
import * as path from 'path';

/**
 * Read and parse a JSON test-data file from /tests/data/.
 */
export function loadTestData<T>(filename: string): T {
  const filePath = path.join('tests', 'data', filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Test data file not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

/**
 * Write data to a JSON file (useful for capturing dynamic data mid-test).
 */
export function saveTestData(filename: string, data: unknown): void {
  const dir = path.join('tests', 'data', 'generated');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Ensure a directory exists, creating it recursively if needed.
 */
export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}
