const CompMemoTraders = {
    template: `
    <div class="p-2 small text-secondary border-bottom border-secondary ms-2 me-2 mt-2">
        <strong>Level:</strong> プレイヤーレベル / <strong>Rep:</strong> 親密度 / <strong>Sales:</strong> 取引額 (売買合計)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="text-start ps-4" style="width: 15%;">Name</th>
                <th style="width: 28%;" class="text-center text-info">LL 2</th>
                <th style="width: 28%;" class="text-center text-warning">LL 3</th>
                <th style="width: 28%;" class="text-center text-success">LL 4 (Max)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-start ps-4 fw-bold">Prapor</td>
                <td class="text-center"><span class="text-muted">Lv</span> 15 / <span class="text-muted">Rep</span> 0.20<br><span class="text-blue">1.1 M ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 26 / <span class="text-muted">Rep</span> 0.35<br><span class="text-blue">2.7 M ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 36 / <span class="text-muted">Rep</span> 0.50<br><span class="text-blue">3.4 M ₽</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Therapist</td>
                <td class="text-center"><span class="text-muted">Lv</span> 14 / <span class="text-muted">Rep</span> 0.15<br><span class="text-blue">600 k ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 24 / <span class="text-muted">Rep</span> 0.30<br><span class="text-blue">1.0 M ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 37 / <span class="text-muted">Rep</span> 0.60<br><span class="text-blue">1.6 M ₽</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Skier</td>
                <td class="text-center"><span class="text-muted">Lv</span> 15 / <span class="text-muted">Rep</span> 0.20<br><span class="text-blue">1.2 M ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 28 / <span class="text-muted">Rep</span> 0.40<br><span class="text-blue">2.4 M ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 38 / <span class="text-muted">Rep</span> 0.75<br><span class="text-blue">3.9 M ₽</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Peacekeeper</td>
                <td class="text-center"><span class="text-muted">Lv</span> 14 / <span class="text-muted">Rep</span> 0.00<br><span class="text-green">$ 11 k</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 23 / <span class="text-muted">Rep</span> 0.30<br><span class="text-green">$ 25 k</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 37 / <span class="text-muted">Rep</span> 0.60<br><span class="text-green">$ 32 k</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Mechanic</td>
                <td class="text-center"><span class="text-muted">Lv</span> 20 / <span class="text-muted">Rep</span> 0.15<br><span class="text-blue">1.1 M ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 30 / <span class="text-muted">Rep</span> 0.30<br><span class="text-blue">2.4 M ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 40 / <span class="text-muted">Rep</span> 0.60<br><span class="text-blue">3.7 M ₽</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Ragman</td>
                <td class="text-center"><span class="text-muted">Lv</span> 17 / <span class="text-muted">Rep</span> 0.00<br><span class="text-blue">1.1 M ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 32 / <span class="text-muted">Rep</span> 0.30<br><span class="text-blue">2.4 M ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 42 / <span class="text-muted">Rep</span> 0.60<br><span class="text-blue">3.7 M ₽</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold">Jaeger</td>
                <td class="text-center"><span class="text-muted">Lv</span> 15 / <span class="text-muted">Rep</span> 0.20<br><span class="text-blue">840 k ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 22 / <span class="text-muted">Rep</span> 0.35<br><span class="text-blue">1.6 M ₽</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 33 / <span class="text-muted">Rep</span> 0.50<br><span class="text-blue">2.5 M ₽</span></td>
            </tr>
            <tr>
                <td class="text-start ps-4 fw-bold text-info">Ref</td>
                <td class="text-center"><span class="text-muted">Lv</span> 15 / <span class="text-muted">Rep</span> 0.25<br><span class="text-secondary">-</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 25 / <span class="text-muted">Rep</span> 0.50<br><span class="text-secondary">-</span></td>
                <td class="text-center"><span class="text-muted">Lv</span> 35 / <span class="text-muted">Rep</span> 1.20<br><span class="text-secondary">-</span></td>
            </tr>
        </tbody>
    </table>
    `
};