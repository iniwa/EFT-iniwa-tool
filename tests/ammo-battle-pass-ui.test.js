import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const ammoView = await readFile(new URL('../src/components/AmmoChart.vue', import.meta.url), 'utf8');
const battlePassView = await readFile(new URL('../src/components/BattlePassView.vue', import.meta.url), 'utf8');
const battlePassRoute = await readFile(new URL('../src/router/index.js', import.meta.url), 'utf8');
const battlePassData = await readFile(new URL('../src/data/battlePass.js', import.meta.url), 'utf8');

test('ammo trader and crafting indicators use accessible emoji symbols', () => {
  assert.match(ammoView, /role="img" aria-label="[^"]+" title="[^"]+">&#x1F6D2;<\/span>/);
  assert.match(ammoView, /role="img" aria-label="[^"]+" title="[^"]+">&#x1F527;<\/span>/);
  assert.doesNotMatch(ammoView, />cart<\/span>|>wrench<\/span>/);
});

test('Battle Pass document feature and shared data remain without the reward catalog UI', () => {
  assert.match(battlePassView, /aria-labelledby="documents-heading"/);
  assert.match(battlePassView, /filteredDocuments/);
  assert.doesNotMatch(battlePassView, /rewards-heading|filteredRewards|BATTLE_PASS_REWARD_CATEGORIES|BATTLE_PASS_REWARDS/);
  assert.match(battlePassRoute, /path: '\/battle-pass'[\s\S]*?component: \(\) => import\('\.\.\/components\/BattlePassView\.vue'\)/);
  assert.match(battlePassData, /export const BATTLE_PASS_DOCUMENTS =/);
  assert.match(battlePassData, /export const BATTLE_PASS_REWARDS =/);
  assert.match(battlePassData, /export const BATTLE_PASS_REWARD_CATEGORIES =/);
});
