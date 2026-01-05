const CompMemoWeapon = {
    template: `
    <div class="memo-static-header">
        AR / DMR (Assault Rifles & Marksman)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="weapon-col-caliber">口径</th>
                <th class="weapon-col-name text-start ps-3">武器名</th>
                <th class="weapon-col-desc ps-3">特徴・運用メモ</th>
            </tr>
        </thead>
        <tbody>
            <tr class="memo-caliber-row">
                <td rowspan="7" class="weapon-col-caliber border-end border-secondary">
                    7.62x51mm<br><span class="small text-muted">NATO</span>
                </td>
                <td class="text-blue fw-bold ps-3">SR-25</td>
                <td class="text-muted-dark">
                    7.62x51mmの中でも非常に扱いやすく、メタ武器の1つ。リコイルの戻りが早く、連射しても当てやすい。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3 text-secondary">RSASS</td>
                <td class="text-muted-dark">
                    SR-25のほぼ上位互換。性能は最強クラスだが、本体価格が非常に高い。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-3 fw-bold">RFB</td>
                <td class="text-muted-dark">
                    非常に安価で入手性が良い。カスタム幅は狭いが、コスパ良く7.62x51mmを撃てる。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-3 fw-bold">M1A</td>
                <td class="text-muted-dark">
                    SR-25等と違い<span class="text-blue">50発マガジン</span>が使用可能。対多数や制圧射撃に強いが、エルゴは低くなりやすい。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">MDR 7.62</td>
                <td class="text-muted-dark">
                    この大口径を<span class="text-blue">フルオート</span>で撃てる強武器。SCAR-Hに比べエルゴは高いが、反動は強め。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SCAR-H</td>
                <td class="text-muted-dark">
                    反動はマイルドで制御しやすいが、エルゴが低く、構えや取り回しが重くなりやすい。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SA-58</td>
                <td class="text-muted-dark">
                    近距離の火力は凄まじいが、反動が強烈すぎて中距離以降の制御は困難。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="3" class="weapon-col-caliber border-end border-secondary">
                    7.62x39mm
                </td>
                <td class="text-blue fw-bold ps-3">RD-704</td>
                <td class="text-muted-dark">
                    非常にコンパクトでエルゴが高い。全長が短く、サプレッサーを付けても取り回しが良い。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">Mk47 Mutant</td>
                <td class="text-muted-dark">
                    RD-704より連射速度が速く、精度も良いが少し重い。「火力でねじ伏せる」ならこちら。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">AKMN / 103 / 104</td>
                <td class="text-muted-dark">
                    大口径弾を撃てる発射台として優秀。104はカービンモデルで取り回しが良い。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="5" class="weapon-col-caliber border-end border-secondary">
                    5.56x45mm<br><span class="small text-muted">NATO</span>
                </td>
                <td class="text-blue fw-bold ps-3">AUG A3</td>
                <td class="text-muted-dark">
                    純正状態で性能が高く、カスタム費用が安い。<span class="text-blue">コスパ最強</span>の5.56mm枠。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">MDR 5.56</td>
                <td class="text-muted-dark">
                    7.62版と同じく取り回しが良い。5.56mm枠の中ではリコイルが素直で扱いやすい。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SCAR-L</td>
                <td class="text-muted-dark">
                    反動が非常にマイルド。レートが遅く(650RPM)近距離の撃ち合いは弱めだが、中距離で当てやすい。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">M4A1 / HK416</td>
                <td class="text-muted-dark">
                    お金をかけてフルカスタムすれば最強だが、中途半端なカスタムだと弱い。上級者向け。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">ADAR / TX-15</td>
                <td class="text-muted-dark">
                    セミオート運用前提のAR。安価に5.56mmを運用できる。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="3" class="weapon-col-caliber border-end border-secondary">
                    5.45x39mm
                </td>
                <td class="text-blue fw-bold ps-3">NL-545</td>
                <td class="text-muted-dark">
                    <span class="text-blue">5.45mmの最強銃</span>。M4と同じ高レート(800RPM)で撃て、反動も非常にマイルド。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SAG AK-545</td>
                <td class="text-muted-dark">
                    非常に安価なセミオート。精度が高く、最序盤にオススメ。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">AK-74N / 74M</td>
                <td class="text-muted-dark">
                    5.45mmのスタンダード。弾の入手性が比較的良い。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    9x39mm
                </td>
                <td class="text-blue fw-bold ps-3">AS VAL / VSS</td>
                <td class="text-muted-dark">
                    消音器内蔵。900RPMの高レートと高貫通弾(SP-6/BP)により近距離火力はトップクラス。弾速が遅く遠距離は困難。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    .300 Blackout
                </td>
                <td class="text-blue fw-bold ps-3">SIG MCX</td>
                <td class="text-muted-dark">
                    高レートで近距離火力が高い。CBJ弾が貫通・ダメージ共に優秀だが、入手は中盤以降(Peacekeeper)。
                </td>
            </tr>
            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    12.7x55mm
                </td>
                <td class="fw-bold ps-3">ASh-12</td>
                <td class="text-muted-dark">
                    専用のPS12B弾は4アーマーだったらワンパンで倒せる。近距離特化のロマン砲。弾はPraporから入手。
                </td>
            </tr>
        </tbody>
    </table>

    <div class="memo-static-header">
        SMG / PDW (Submachine Guns)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="weapon-col-caliber">口径</th>
                <th class="weapon-col-name text-start ps-3">武器名</th>
                <th class="weapon-col-desc ps-3">特徴・運用メモ</th>
            </tr>
        </thead>
        <tbody>
            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    4.6x30mm
                </td>
                <td class="text-blue fw-bold ps-3">MP7A1 / A2</td>
                <td class="text-muted-dark">
                    高レート・低反動・高貫通の3拍子が揃った強武器。店売りの<span class="text-white">FMJ SX</span>で十分強い。
                    最強弾の<span class="text-blue">AP SX</span>はクラフト/拾いのみだが、クラス5/6も貫通する。
                </td>
            </tr>
            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    5.7x28mm
                </td>
                <td class="text-blue fw-bold ps-3">P90</td>
                <td class="text-muted-dark">
                    デフォルトで50発マガジンを持ち、リロードを挟まず連戦しやすい。
                    弾は<span class="text-white">SS190</span>等が優秀。弾込めが遅いのが難点。
                </td>
            </tr>
            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    .45 ACP
                </td>
                <td class="text-start ps-3 fw-bold">Vector .45</td>
                <td class="text-muted-dark">
                    1100RPMという圧倒的連射速度。近距離火力は最強クラスだが弾持ちが悪い。
                    <span class="text-white">AP弾</span>で溶かすか、<span class="text-white">RIP/Hydra-Shok</span>で足を狙う。
                </td>
            </tr>
            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    9x19mm
                </td>
                <td class="text-start ps-3 fw-bold">Vector 9mm</td>
                <td class="text-muted-dark">
                    950RPM。.45より少し遅いが、50連ドラムマガジンがあり継戦能力が高い。
                    <span class="text-white">AP 6.3</span>や<span class="text-blue">PBP (7N31)</span>を使う。
                </td>
            </tr>
        </tbody>
    </table>
    `
};