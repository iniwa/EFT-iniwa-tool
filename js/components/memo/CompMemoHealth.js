const CompMemoHealth = {
    template: `
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4" style="width: 15%;">名前</th>
                <th style="width: 10%;">容量</th>
                <th style="width: 10%;">総時間</th>
                <th style="width: 15%;" class="text-blue">発動ラグ</th>
                <th style="width: 15%;">1回回復量</th>
                <th style="width: 10%;">軽出血</th>
                <th style="width: 10%;">重出血</th>
                <th style="width: 8%;">骨折</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start ps-4 fw-bold text-red">Salewa</td>
                <td class="text-center">400</td>
                <td class="text-center">3.0s</td>
                <td class="text-center fw-bold text-blue">~2.2s</td>
                <td class="text-center">85</td>
                <td class="text-center">-45</td>
                <td class="text-center fw-bold">-175</td>
                <td class="text-center text-muted">×</td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">AFAK</td>
                <td class="text-center">400</td>
                <td class="text-center">3.0s</td>
                <td class="text-center text-muted">~2.5s</td>
                <td class="text-center">60</td>
                <td class="text-center">-30</td>
                <td class="text-center">-170</td>
                <td class="text-center text-muted">×</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-green">IFAK</td>
                <td class="text-center">300</td>
                <td class="text-center">3.0s</td>
                <td class="text-center text-muted">~2.5s</td>
                <td class="text-center">50</td>
                <td class="text-center">-30</td>
                <td class="text-center text-red fw-bold">-210</td>
                <td class="text-center text-muted">×</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-orange">AI-2</td>
                <td class="text-center">100</td>
                <td class="text-center">2.0s</td>
                <td class="text-center text-blue">~1.0s</td>
                <td class="text-center">50</td>
                <td class="text-center text-muted">×</td>
                <td class="text-center text-muted">×</td>
                <td class="text-center text-muted">×</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-blue">Grizzly</td>
                <td class="text-center">1800</td>
                <td class="text-center">5.0s</td>
                <td class="text-center text-red">~4.5s</td>
                <td class="text-center">175</td>
                <td class="text-center">-40</td>
                <td class="text-center">-130</td>
                <td class="text-center">-50</td>
            </tr>
        </tbody>
    </table>
    <div class="p-2 small text-muted border-top border-secondary ms-2 me-2 mt-2">
        <ul class="mb-0 ps-3">
            <li><strong>1回回復量:</strong> 1回のアニメーションで回復できるHPの上限値。</li>
            <li><strong>発動ラグ:</strong> 使用開始からHPが実際に回復するまでの時間。この直後にクリックでキャンセル可能。</li>
        </ul>
    </div>

    <div class="memo-static-header">
        手術キット (Surgery Kits)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4" style="width: 25%;">名前</th>
                <th style="width: 15%;">サイズ</th>
                <th style="width: 15%;">回数</th>
                <th style="width: 15%;">時間</th>
                <th>手術後HP減少</th>
                <th style="width: 10%;">骨折</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start ps-4">CMS Kit</td>
                <td class="text-center">2マス</td>
                <td class="text-center">5</td>
                <td class="text-center">16s</td>
                <td class="text-center text-red">大 (45-60%減)</td>
                <td class="text-center text-muted">×</td>
            </tr>
            <tr>
                <td class="text-start ps-4 text-blue">Surv12</td>
                <td class="text-center">3マス</td>
                <td class="text-center">15</td>
                <td class="text-center">20s</td>
                <td class="text-center text-green">小 (10-20%減)</td>
                <td class="text-center">〇 (-1)</td>
            </tr>
        </tbody>
    </table>
    `
};