<script setup>
// 注射器 (Stims) データ
</script>

<template>
    <div class="memo-static-header">
        身体強化・重量・戦闘 (Physical &amp; Combat)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="stim-col-name text-start ps-3">名前</th>
                <th class="stim-col-effect">効果 (メリット)</th>
                <th class="stim-col-side">副作用・注意点</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-blue">M.U.L.E.</td>
                <td>重量制限 +50% (900s)</td>
                <td>HP -0.1/s (900s、計-90)。被ダメージ+9%は旧記載・要確認。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-blue">SJ6 (青)</td>
                <td>最大スタミナ +30 / 回復 +2/s (240s)</td>
                <td>200s後から震え・トンネル視野 (40s)。長距離移動向き (目安)。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-warning">Obdolbos 2</td>
                <td>Strength / Endurance / Attention / Perception +20、重量制限 +45% (1800s)</td>
                <td class="text-warning">最大スタミナ -20 / 回復 -1/s、HP -1/s (1800s、計-1800)。継続回復が必要。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-red">PNB (16)</td>
                <td>Strength +20 / HP +3/s (40s)</td>
                <td>41s後からHealth / Vitalityスキル -20 (180s)、震え20s。旧ダメージ軽減は要確認。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">Trimadol</td>
                <td>Endurance / Strength / Attention / Stress +10、最大スタミナ +10 / 回復 +3/s (180s)</td>
                <td>Energy / Hydration -0.5/s (180s、各-90)。SJ6併用の走行は目安・要確認。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">Meldonin</td>
                <td>Strength +10 / Endurance +20 / スタミナ回復 +0.5/s (900s)</td>
                <td>遅延してEnergy / Hydration -0.1/s (900s、各-90)。旧10%ダメージ軽減は要確認。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">L1</td>
                <td>鎮痛 / Strength +20 / Endurance +10 / 最大スタミナ +30 (120s)</td>
                <td>Energy / Hydration -0.4/s (60s)。旧重量ボーナスは要確認。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">SJ1 (赤)</td>
                <td>Strength / Endurance / Stress +20 (180s)</td>
                <td>100s後からEnergy -0.2/s・Hydration -0.3/s (200s、-40 / -60)。旧被ダメージ+10%は要確認。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">2A2-(b-TG)</td>
                <td>Attention / Perception +10、重量制限 +15% (900s)</td>
                <td>Hydration -0.1/s (900s)。旧Metabolism +20は要確認。</td>
            </tr>
        </tbody>
    </table>

    <div class="memo-static-header">
        医療・回復・止血 (Health &amp; Regen)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="stim-col-name text-start ps-3">名前</th>
                <th class="stim-col-effect">効果 (メリット)</th>
                <th class="stim-col-side">副作用・注意点</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-green">eTG-c (緑)</td>
                <td>HP +6.5/s (60s、最大390の継続回復)、脳震とう治療、Energy +0.5/s (60s)</td>
                <td>65s後からEnergy -3/s (20s)、Health / Enduranceスキル -5 (60s)。即時全快ではありません。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-warning">Propital (黄)</td>
                <td>HP +1/s (300s)、鎮痛・脳震とう治療 (240s)</td>
                <td>270s後から震え・トンネル視野 (30s)。戦闘前の使用は目安。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">AHF1-M</td>
                <td>止血・出血予防 / Healthスキル +5 (60s)</td>
                <td>Hydration -0.3/s (120s、計-36)。使用2s (Zagustinと同じ)。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold" style="color: #d8b4fe;">Zagustin (紫)</td>
                <td>軽・重出血の止血と予防 (180s)</td>
                <td>遅延してHydration -1.4/s (計-56)、170s後から震え。使用2s。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">Perfotoran<br><small class="text-muted">(Blue Blood)</small></td>
                <td>毒・放射線への効果と止血、HP +1.5/s (60s、計90)</td>
                <td>遅延してHP -1.5/s / Energy -1.1/s (60s)。旧鎮痛効果は要確認。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">Adrenaline</td>
                <td>鎮痛・脳震とう治療 / Endurance・Strength +10 (60s)、HP +4/s (15s、計60)</td>
                <td>50s後からHydration -1/s / Energy -0.8/s (30s)。旧反動・リロード強化は要確認。</td>
            </tr>
        </tbody>
    </table>

    <div class="memo-static-header">
        特殊・生存・ユーティリティ (Survival &amp; Utility)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="stim-col-name text-start ps-3">名前</th>
                <th class="stim-col-effect">効果 (メリット)</th>
                <th class="stim-col-side">副作用・注意点</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-orange">SJ12 (黒)</td>
                <td>体温 -4°C、Energy / Hydration +0.1/s、Perception +30 (600s)</td>
                <td>606s後から体温 +6°C (300s)。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">SJ9 (TGLabs)</td>
                <td>6s後から体温 -7°C (300s)、Metabolism -20 (300s)</td>
                <td>HP -0.1/s・震え (420s)、遅延した痛み (120s)。サーマルで見えにくい可能性は目安・要確認。旧被ダメージ+5%も要確認。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">3-(b-TG)</td>
                <td>Attention / Perception +30、Strength +10 / スタミナ回復 +1/s (240s)</td>
                <td>220s後から震え45s、Energy -0.2/s (120s、計-24)。探索・聴覚の運用評価は目安。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-muted">Obdolbos</td>
                <td>ランダム効果。25%の確率が設定された効果もある。</td>
                <td>33%でHP回復 -600/s (600s) の致死的効果。安全な薬ではありません。</td>
            </tr>
        </tbody>
    </table>
    <p class="p-2 small text-muted mb-0">2026-10-07確認・コミュニティWiki: <a href="https://wikiwiki.jp/eft/%E5%8C%BB%E8%96%AC%E5%93%81" target="_blank" rel="noopener noreferrer">医薬品</a>。数値は医薬品表・各薬品ページの記載。旧効果が現行表にないだけでは廃止を断定できません。合計量は秒数からの計算値です。</p>
</template>

<style scoped>
/* このコンポーネント専用の幅設定 */
.stim-col-name   { width: 140px; font-weight: bold; }
.stim-col-effect { width: 50%; }
.stim-col-side   { width: 30%; color: #94a3b8; font-size: 0.9em; }
</style>
