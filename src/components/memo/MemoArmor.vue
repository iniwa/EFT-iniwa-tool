<script setup>
// アーマー材質の特徴データ
</script>

<template>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4">材質</th>
                <th style="width: 12%;">種別 (目安)</th>
                <th style="width: 15%;">修理時の耐久減少</th>
                <th style="width: 15%;">耐久減少倍率<br>(弾 / 爆発)</th>
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
                <td class="text-center text-green">0.3375 / 0.30</td>
                <td class="text-muted-dark">軽さと修理効率が利点 (目安)。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Aramid<br><span class="small text-muted">アラミド (繊維)</span>
                </td>
                <td class="text-center text-info">Light</td>
                <td class="text-center text-green">小</td>
                <td class="text-center text-green">0.1875 / 0.15</td>
                <td class="text-muted-dark">ソフトアーマーに多い。耐久の減りにくさが利点 (目安)。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Combined<br><span class="small text-muted">複合材</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-green">小～中</td>
                <td class="text-center">0.375 / 0.20</td>
                <td class="text-muted-dark">バランス型 (目安)。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Titanium<br><span class="small text-muted">チタン</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-green">小</td>
                <td class="text-center">0.4125 / 0.375</td>
                <td class="text-muted-dark">修理効率のよさが利点 (目安)。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Aluminium<br><span class="small text-muted">アルミニウム</span>
                </td>
                <td class="text-center text-info">Light</td>
                <td class="text-center text-green">小</td>
                <td class="text-center text-orange">0.45 / 0.45</td>
                <td class="text-muted-dark">修理しやすいが被弾時の消耗に注意 (目安)。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-white">
                    Armor Steel<br><span class="small text-muted">防弾鋼板</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-green">極小</td>
                <td class="text-center text-red">0.525 / 0.45</td>
                <td class="text-muted-dark">重い。修理時の最大耐久減少は小さめ、被弾消耗は大きめ (目安)。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-red fw-bold">
                    Ceramic<br><span class="small text-muted">セラミック</span>
                </td>
                <td class="text-center text-orange">Heavy</td>
                <td class="text-center text-red">大</td>
                <td class="text-center text-red">0.60 / 0.525</td>
                <td class="text-muted-dark">修理可能だが最大耐久の損失が大きい。短期運用が目安。</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-red">
                    Glass<br><span class="small text-muted">防弾ガラス</span>
                </td>
                <td class="text-center text-muted">-</td>
                <td class="text-center text-red">大</td>
                <td class="text-center text-red">0.60 / 0.60</td>
                <td class="text-muted-dark">バイザー等。修理後の視界悪化は旧記載・要確認。</td>
            </tr>
        </tbody>
    </table>
    <div class="p-2 small text-muted border-top border-secondary ms-2 me-2 mt-2">
        <ul class="mb-0 ps-3">
            <li><strong>修理時の耐久減少:</strong> 「小」や「極小」であるほど、修理しても最大耐久値が減りにくい（優秀）。</li>
            <li><strong>倍率:</strong> アーマー耐久への係数。人体ダメージや貫通率ではありません。</li>
            <li><strong>種別・修理:</strong> 定性的な目安。Light / Heavyは防御クラスではなく、実際の分類・ペナルティは装備ごとに確認。防御はクラス・保護部位・残耐久・弾薬にも依存します。</li>
        </ul>
    </div>
    <p class="p-2 small text-muted mb-0">2026-10-07確認・コミュニティWiki: <a href="https://wikiwiki.jp/eft/%E3%83%9C%E3%83%87%E3%82%A3%E3%82%A2%E3%83%BC%E3%83%9E%E3%83%BC" target="_blank" rel="noopener noreferrer">ボディアーマー</a> / <a href="https://wikiwiki.jp/eft/%E9%8A%83%E3%81%A8%E8%A3%85%E5%82%99%E3%81%AE%E4%BF%AE%E7%90%86" target="_blank" rel="noopener noreferrer">修理</a>。材質だけで防御性能は決まりません。</p>
</template>
