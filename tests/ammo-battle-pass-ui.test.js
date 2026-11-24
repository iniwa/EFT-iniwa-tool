import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const ammoView = await readFile(new URL('../src/components/AmmoChart.vue', import.meta.url), 'utf8');
const routes = await readFile(new URL('../src/router/index.js', import.meta.url), 'utf8');

test('ammo trader and crafting indicators use accessible emoji symbols', () => {
  assert.match(ammoView, /role="img" aria-label="[^"]+" title="[^"]+">&#x1F6D2;<\/span>/);
  assert.match(ammoView, /role="img" aria-label="[^"]+" title="[^"]+">&#x1F527;<\/span>/);
  assert.doesNotMatch(ammoView, />cart<\/span>|>wrench<\/span>/);
});

test('the retired Battle Pass is no longer routed', () => {
  assert.doesNotMatch(routes, /battle-pass|BattlePassView/);
});
