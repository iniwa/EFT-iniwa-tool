const CompMemoStims = {
    template: `
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4">名前</th>
                <th style="width: 40%;">効果 (メリット)</th>
                <th style="width: 40%;">副作用・注意点</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start ps-4 fw-bold text-blue">M.U.L.E.</td>
                <td>重量制限 <span class="text-green">+50%</span> (900s)</td>
                <td class="text-muted-dark">Health -0.1/s, 被ダメ +9%</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-warning">Obdolbos 2</td>
                <td>全スキル <span class="text-green">+20</span> (1800s)<br>重量制限 <span class="text-green">+45%</span></td>
                <td class="text-warning">副作用ほぼ無し。<br><small>※入手難・高価・最強</small></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-info">2A2-(b-TG)</td>
                <td>
                    重量制限 <span class="text-green">+15%</span> (900s)<br>
                    Perception/Attention <span class="text-green">+10</span>
                </td>
                <td class="text-muted-dark">Hydration -0.1/s (副作用小)</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-info">L1 (Norepinephrine)</td>
                <td>
                    Strength <span class="text-green">+20</span> (120s)<br>
                    <small class="text-muted">「プチM.U.L.E.」として機能</small>
                </td>
                <td class="text-muted-dark">Hydration/Energy -0.4/s (30s)</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-info">SJ6</td>
                <td>スタミナ最大値 <span class="text-green">+30</span><br>回復速度 <span class="text-green">+2.0/s</span></td>
                <td class="text-muted-dark">画面揺れ、トンネル視界 (終了時)</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-info">Trimadol</td>
                <td>
                    スタミナ回復 <span class="text-green">+3.0/s</span><br>
                    Strength/Endurance <span class="text-green">+10</span>
                </td>
                <td class="text-red">Energy/Hydration -1.0/s (180s)<br><small>※食事必須</small></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-info">Meldonin</td>
                <td>Strength <span class="text-green">+10</span> (900s)<br>被ダメージ軽減 -10%</td>
                <td class="text-muted-dark">Energy/Hydration -0.1/s</td>
            </tr>
        </tbody>
    </table>
    `
};