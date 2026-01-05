const CompMemoStims = {
    template: `
    <component :is="'style'">
        /* このコンポーネント専用の幅設定 */
        .stim-col-name   { width: 140px; font-weight: bold; }
        .stim-col-effect { width: 50%; }
        .stim-col-side   { width: 30%; color: #94a3b8; font-size: 0.9em; }
    </component>

    <div class="memo-static-header">
        💪 身体強化・重量・戦闘 (Physical & Combat)
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
                <td>重量制限 <span class="text-green">+50%</span> (900s)</td>
                <td>Health -0.1/s, 被ダメ +9%</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-blue">SJ6 (青)</td>
                <td>
                    スタミナ最大値 <span class="text-green">+30</span><br>
                    回復速度 <span class="text-green">+2.0/s</span> (240s)
                </td>
                <td>トンネル視界、手の震え<br><small>※長距離移動の定番</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-warning">Obdolbos 2</td>
                <td>
                    全スキル <span class="text-green">+20</span> (1800s)<br>
                    重量制限 <span class="text-green">+45%</span> <small class="text-muted">(筋力UP効果)</small>
                </td>
                <td class="text-warning">副作用ほぼ無し。<br><small>※入手難・高価・最強</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-red">PNB (16)</td>
                <td>
                    Strength <span class="text-green">+20</span>, HP回復 +3/s<br>
                    <span class="text-green">被ダメージ軽減</span> (40s)
                </td>
                <td>効果終了後に体力減少<br><small>※戦闘用として非常に強力</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">Trimadol</td>
                <td>
                    スタミナ回復速度 <span class="text-green">+3.0/s</span><br>
                    Strength/Endurance +10
                </td>
                <td><span class="text-red">Energy/Hydration激減</span><br><small>※食事必須。SJ6と併用で無限ダッシュ</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">Meldonin</td>
                <td>
                    Strength <span class="text-green">+10</span>, Endurance +20<br>
                    <span class="text-green">被ダメージ -10%</span> (900s)
                </td>
                <td>Energy/Hydration -0.1/s<br><small>※頭に打たれた時の即死率減</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">L1</td>
                <td>
                    Strength/Endurance <span class="text-green">+20</span> (120s)<br>
                    <small class="text-muted">「プチM.U.L.E.」として機能</small>
                </td>
                <td>Hydration/Energy -0.4/s<br><span class="text-orange">効果時間が短い (2分)</span></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">SJ1 (赤)</td>
                <td>
                    Strength/Endurance/Stress <span class="text-green">+20</span><br>
                    (180s)
                </td>
                <td>被ダメージ +10%<br><small>※開幕ダッシュ等に</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">2A2-(b-TG)</td>
                <td>
                    重量制限 <span class="text-green">+15%</span> (900s)<br>
                    Metabolism +20
                </td>
                <td>Hydration -0.1/s (副作用小)<br><small>※効果は控えめだが安価</small></td>
            </tr>
        </tbody>
    </table>

    <div class="memo-static-header">
        🚑 医療・回復・止血 (Health & Regen)
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
                <td>
                    <span class="text-green">HP持続回復 +6.5/s</span> (60s)<br>
                    <small>瀕死から一瞬で全快する最強回復薬</small>
                </td>
                <td>Energy -0.5/s (20s)<br>副作用は軽微。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-warning">Propital (黄)</td>
                <td>
                    HP持続回復 <span class="text-green">+1.0/s</span> (300s)<br>
                    <span class="text-blue">鎮痛効果 (240s)</span>
                </td>
                <td>トンネル視界 (終了時)<br><small>※戦闘前の常用に最適</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">AHF1-M</td>
                <td>
                    <span class="text-green">即座に止血</span> (即効性)<br>
                    新たな出血防止 (60s)
                </td>
                <td>Hydration -0.2/s<br><small>※Zagustinより早いが効果短い</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold" style="color: #d8b4fe;">Zagustin (紫)</td>
                <td>
                    <span class="text-green">全ての出血を止める</span><br>
                    新たな出血もしない (180s)
                </td>
                <td>Hydration -0.8/s (50s)<br>水分減少が激しいので注意。</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">Perfotoran<br><small class="text-muted">(Blue Blood)</small></td>
                <td>
                    <span class="text-green">止血 ＋ 解毒 ＋ 鎮痛 (60s)</span><br>
                    HP回復 +350 (合計)
                </td>
                <td>副作用ほぼ無し。<br><small>※Propitalの上位互換的性能</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">Adrenaline</td>
                <td>
                    鎮痛 (60s) + HP小回復<br>
                    反動制御・リロード速度UP
                </td>
                <td>Energy/Hydration減少 (小)<br><small>※安価な戦闘用バフ</small></td>
            </tr>
        </tbody>
    </table>

    <div class="memo-static-header">
        ✨ 特殊・生存・ユーティリティ (Survival & Utility)
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
                <td>
                    <span class="text-green">Energy/Hydration 回復</span> (10分)<br>
                    サーマル対策 (体温低下 -4℃)
                </td>
                <td>終了後に<span class="text-red">体温上昇 (+6℃)</span><br><small>※デバフで逆に熱くなるので注意</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-info">SJ9 (TGLabs)</td>
                <td>
                    <span class="text-green">体温を下げる</span> (-7℃)<br>
                    サーマルに映らなくなる (420s)
                </td>
                <td>被ダメージ +5%<br>Metabolism -20</td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold">3-(b-TG)</td>
                <td>
                    Attention/Perception <span class="text-green">+10</span><br>
                    Strength +10 (240s)
                </td>
                <td>Energy/Hydration -0.3/s (30s)<br><small>※漁り(ルート)速度と聴覚UP</small></td>
            </tr>
            <tr>
                <td class="stim-col-name text-start ps-3 fw-bold text-muted">Obdolbos</td>
                <td>
                    <span class="text-warning">ランダムな効果</span> (ガチャ)<br>
                    <small>※スキルLvが爆増することもあれば、デメリットのみの場合も</small>
                </td>
                <td><span class="text-red">高リスク</span><br>突然死は無くなったが注意。</td>
            </tr>
        </tbody>
    </table>
    `
};