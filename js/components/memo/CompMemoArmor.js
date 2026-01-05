const CompMemoArmor = {
    template: `
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4">材質</th>
                <th style="width: 12%;">種別 (Class)</th>
                <th style="width: 15%;">修理時の耐久減少</th>
                <th style="width: 15%;">被弾脆さ</th>
                <th style="width: 25%;">特徴・備考</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start ps-4 text-blue fw-bold">
                    UHMWPE<br><span class="small text-muted">超高分子量ポリエチレン</span>
                </td>
                <td class="text-center text-info">Light</td>
                <td class="text-center text-green">極小</td>
                <td class="text-center text-green">小</td>
                <td class="text-muted-dark">
                    <span class="text-blue">最強素材</span>。軽く、壊れにくく、修理もしやすい。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Aramid<br><span class="small text-muted">アラミド (繊維)</span>
                </td>
                <td class="text-center text-info">Light</td>
                <td class="text-center text-green">小</td>
                <td class="text-center text-green">極小</td>
                <td class="text-muted-dark">
                    ソフトアーマーに多い。耐久が減りにくい。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Combined<br><span class="small text-muted">複合材</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-green">小～中</td>
                <td class="text-center">小</td>
                <td class="text-muted-dark">バランス型。多くのリグやヘルメットで使用。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Titanium<br><span class="small text-muted">チタン</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-green">小</td>
                <td class="text-center">小～中</td>
                <td class="text-muted-dark">修理効率が良く、硬さのバランスも良い。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Aluminium<br><span class="small text-muted">アルミニウム</span>
                </td>
                <td class="text-center text-info">Light</td>
                <td class="text-center text-green">小</td>
                <td class="text-center text-orange">中</td>
                <td class="text-muted-dark">修理はしやすいが、撃たれると少し脆い。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Armor Steel<br><span class="small text-muted">防弾鋼板</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-green">極小</td>
                <td class="text-center text-red">大</td>
                <td class="text-muted-dark">
                    <span class="text-red">非常に重い</span>。何度でも直せるが、脆い。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-red fw-bold">
                    Ceramic<br><span class="small text-muted">セラミック</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-red">大</td>
                <td class="text-center text-red">大</td>
                <td class="text-muted-dark">
                    重い・脆い・直らない。使い捨て前提。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-red">
                    Glass<br><span class="small text-muted">防弾ガラス</span>
                </td>
                <td class="text-center text-muted">-</td>
                <td class="text-center text-red">大</td>
                <td class="text-center text-red">大</td>
                <td class="text-muted-dark">バイザー等。修理すると視界が悪化しやすい。</td>
            </tr>
        </tbody>
    </table>
    <div class="p-2 small text-muted border-top border-secondary ms-2 me-2 mt-2">
        <ul class="mb-0 ps-3">
            <li><strong>修理時の耐久減少:</strong> 「小」や「極小」であるほど、修理しても最大耐久値が減りにくい（優秀）。</li>
            <li><strong>被弾脆さ:</strong> 「小/極小」＝耐久値が減りにくい（優秀）。「大」＝数発で耐久がゼロになりやすい（脆い）。</li>
            <li><strong>種別:</strong> Heavy Armorは移動速度や旋回速度へのデバフが大きい傾向がある。</li>
        </ul>
    </div>
    `
};