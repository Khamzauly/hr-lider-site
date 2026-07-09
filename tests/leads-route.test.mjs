import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('lead API imports every validation helper it uses', () => {
  const source = readFileSync(new URL('../app/api/leads/route.js', import.meta.url), 'utf8');
  const validationImport = source.match(/import \{([^}]+)\} from '\.\.\/\.\.\/\.\.\/lib\/validation\.js';/);

  assert.ok(validationImport, 'lead route must import validation helpers');
  assert.match(source, /\bcleanString\(/, 'lead route uses cleanString for name validation');
  assert.match(validationImport[1], /\bcleanString\b/, 'lead route must import cleanString');
});
