const CompMemoGrenade = {
    template: `
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4">名前</th>
                <th style="width: 25%;">起爆時間 (Fuse)</th>
                <th style="width: 25%;">爆発範囲</th>
                <th style="width: 30%;">特徴</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start ps-4 fw-bold text-red">VOG-25</td>
                <td class="text-center fw-bold text-red">2.0s</td>
                <td class="text-center">小</td>
                <td class="text-muted-dark">見えた瞬間死ぬ。自爆注意。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-red">VOG-17</td>
                <td class="text-center fw-bold text-red">3.0s</td>
                <td class="text-center">小</td>
                <td class="text-muted-dark">VOG-25より少し遅いが十分早い。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-info">V40 Mini</td>
                <td class="text-center">3.0s</td>
                <td class="text-center">極小</td>
                <td class="text-muted-dark">非常に軽く遠投可能。威力は低い。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">RGD-5</td>
                <td class="text-center">3.5s</td>
                <td class="text-center">中</td>
                <td class="text-muted-dark">標準的。安くて使いやすい。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">F-1</td>
                <td class="text-center">3.5s</td>
                <td class="text-center text-blue">大</td>
                <td class="text-muted-dark">破片がかなり遠くまで飛ぶ。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-blue">M67</td>
                <td class="text-center text-blue">5.0s</td>
                <td class="text-center text-blue">大</td>
                <td class="text-muted-dark">時間が長い＝遠投や追い出しに最適。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-info">RGN / RGO</td>
                <td class="text-center fw-bold text-info">接触 (Impact)</td>
                <td class="text-center">小 / 中</td>
                <td class="text-muted-dark">当たると即爆発。最強の殺傷兵器。</td>
            </tr>
        </tbody>
    </table>
    `
};