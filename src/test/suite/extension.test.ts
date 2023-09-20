import * as assert from 'assert';
import * as path from 'path';
import { generateStructure } from '../../functions/generate-structure';
import { shouldExclude } from '../../functions/should-exclude';

suite('Extension Test Suite', () => {
  test('generateStructure should return correct structure', () => {
    const testFolderPath = path.resolve(
      __dirname,
      '../../../src/test/suite/testFolder'
    );
    const exclude = ['.git'];
    const structure = generateStructure(testFolderPath, 0, exclude);
    const expectedStructure = `├── README.md
└── src
  ├── app.ts
  └── index.ts
`;

    assert.strictEqual(structure, expectedStructure);
  });

  test('shouldExclude should return true for excluded patterns', () => {
    const patterns = ['.git', 'node_modules'];
    assert.strictEqual(shouldExclude('.git', patterns), true);
    assert.strictEqual(shouldExclude('node_modules', patterns), true);
    assert.strictEqual(shouldExclude('src', patterns), false);
  });
});
