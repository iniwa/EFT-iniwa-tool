const CompMemoWeapon = {
    template: `
    <component :is="'style'">
        /* カラム幅設定 (改行防止のため拡張) */
        .weapon-col-caliber { width: 120px !important; text-align: center; font-weight: bold; color: var(--memo-primary); }
        .weapon-col-mode    { width: 110px !important; text-align: center; font-size: 0.85em; }
        .weapon-col-rpm     { width: 70px !important; text-align: center; font-weight: bold; color: var(--memo-text-main); }
        .weapon-col-name    { width: 150px; font-weight: bold; }
        .weapon-col-desc    { text-align: left; }
        
        /* モード表示の色分け */
        .mode-full { color: #ef4444; } /* Full */
        .mode-semi { color: #3b82f6; } /* Semi */
        .mode-lever { color: #f59e0b; } /* Lever/Bolt */
    </component>

    <div class="memo-static-header">
        AR / DMR / LMG (Assault Rifles, Marksman & Machine Guns)
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="weapon-col-caliber">口径</th>
                <th class="weapon-col-name text-start ps-3">武器名</th>
                <th class="weapon-col-mode">Mode</th>
                <th class="weapon-col-rpm">RPM</th>
                <th class="weapon-col-desc ps-3">特徴・運用メモ</th>
            </tr>
        </thead>
        <tbody>
            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    6.8x51mm<br><span class="small text-muted">Hybrid</span>
                </td>
                <td class="text-blue fw-bold ps-3">SIG Spear</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">800</td>
                <td class="text-muted-dark">
                    <span class="text-blue">最強AR</span>。高レート・高貫通・高ダメージの全てが揃う。反動制御も優秀だが入手難易度が極めて高い。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="9" class="weapon-col-caliber border-end border-secondary">
                    7.62x51mm<br><span class="small text-muted">NATO</span>
                </td>
                <td class="fw-bold ps-3 text-secondary">RSASS</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    SR-25のほぼ上位互換。性能は最強クラスだが、本体価格が非常に高い。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">SR-25</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    メタ武器筆頭。リコイル復帰が早く、速射時の集弾性が非常に高い。迷ったらこれ。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">M60E6 / E4</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span></td>
                <td class="weapon-col-rpm">600</td>
                <td class="text-muted-dark">
                    <span class="text-blue">LMG</span>。100連発による制圧力が売り。低レートで制御しやすく、オープンボルトでジャムらない。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">MDR 7.62</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    ブルパップで取り回しが良い。反動は大きいが、エルゴが高くADSが速い。近距離も対応可。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SA-58</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    近距離火力お化け。反動が凄まじく、フルカスタム必須。中距離以遠はタップ撃ち推奨。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-3 fw-bold">M1A</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    <span class="text-blue">50発ドラム</span>運用が可能。対多数戦に強いが、全長が長くエルゴが下がりやすい。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">AK-308</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    AK操作系のまま7.62x51mmを撃てる。SA-58等と同様に反動は強烈だが、近距離火力は圧倒的。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SCAR-H</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">600</td>
                <td class="text-muted-dark">
                    低レートで反動がマイルド。制御しやすいがエルゴが低く、構えが遅いのが欠点。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-3 fw-bold">RFB</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">700</td>
                <td class="text-muted-dark">
                    高コスパ。<span class="text-green">レーザー装着が可能</span>になり弱点を克服。安価に7.62x51mmを撃てる強力な選択肢。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="4" class="weapon-col-caliber border-end border-secondary">
                    7.62x39mm
                </td>
                <td class="text-blue fw-bold ps-3">Mk47 Mutant</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    RD-704よりレートが高く、火力で押し切れる。やや重いが精度も優秀。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">RD-704</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">600</td>
                <td class="text-muted-dark">
                    非常にコンパクトで高エルゴ。サプレッサー運用でも取り回しが良く、室内戦に強い。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">AKM / 103</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">600</td>
                <td class="text-muted-dark">
                    基本形。カスタムパーツが豊富。103/104等の近代化モデルの方が性能が良い。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">RPD / RPDN</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span></td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    100連ドラム固定のLMG。オープンボルト(ジャム無)。RPDNはサイト装着可。弾幕でゴリ押す用。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="5" class="weapon-col-caliber border-end border-secondary">
                    5.56x45mm<br><span class="small text-muted">NATO</span>
                </td>
                <td class="fw-bold ps-3">M4A1 / HK416</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">800+</td>
                <td class="text-muted-dark">
                    高レートによるDPSが魅力だが、反動制御には高級パーツによるフルカスタムが必須。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">AUG A3</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">~700</td>
                <td class="text-muted-dark">
                    本体性能が高く、最低限のカスタムで実戦投入可能。<span class="text-blue">コスパ最強</span>枠。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">MDR 5.56</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    7.62版同様に取り回しが良い。5.56mmとしては低レートで、リコイル制御が非常に楽。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SCAR-L</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    低レート・低反動。近距離の撃ち合いは弱いが、中距離での当てやすさは抜群。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">ADAR / TX-15</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">800</td>
                <td class="text-muted-dark">
                    M4パーツを流用できるセミオート機。安価に5.56mmを運用したい時に。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="3" class="weapon-col-caliber border-end border-secondary">
                    5.45x39mm
                </td>
                <td class="text-blue fw-bold ps-3">NL-545</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/2/1</td>
                <td class="weapon-col-rpm">800</td>
                <td class="text-muted-dark">
                    <span class="text-blue">5.45mm最強格</span>。M4並みの高レートで、この口径の火力不足を補える。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">AK-74N / 74M</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    スタンダードな性能。弾が入手しやすく、カスタムパーツも安い。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">SAG AK-545</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    非常に安価で高精度なセミオート。リコイルがほぼ無く、序盤のスカブ狩り等に最適。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="3" class="weapon-col-caliber border-end border-secondary">
                    9x39mm
                </td>
                <td class="text-blue fw-bold ps-3">AS VAL / VSS</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">900</td>
                <td class="text-muted-dark">
                    消音器内蔵。超高レート×高貫通弾で近距離最強。弾速が遅く遠距離は苦手。耐久消耗が激しい。
                </td>
            </tr>
            <tr>
                <td class="text-blue fw-bold ps-3">SR-3M</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">900</td>
                <td class="text-muted-dark">
                    サプレッサー着脱可能なAS VAL。取り回しが良く、屋内戦で圧倒的火力を発揮する。
                </td>
            </tr>
            <tr>
                <td class="fw-bold ps-3">9A-91</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">~700</td>
                <td class="text-muted-dark">
                    廉価版9x39mm銃。カスタム幅は狭いが、安価に強力な弾薬を運用できる。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    .300 Blackout
                </td>
                <td class="text-blue fw-bold ps-3">SIG MCX</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">800</td>
                <td class="text-muted-dark">
                    M4互換の操作感。CBJ弾が強力で、サプレッサー運用時の静音性も高い。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    12.7x55mm
                </td>
                <td class="fw-bold ps-3">ASh-12</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">650</td>
                <td class="text-muted-dark">
                    近距離特化のロマン砲。PS12B弾ならクラス4アーマーを胸一撃で葬る破壊力。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    .308 ME
                </td>
                <td class="fw-bold ps-3">Marlin MXLR</td>
                <td class="weapon-col-mode"><span class="mode-lever">Lever</span></td>
                <td class="weapon-col-rpm">-</td>
                <td class="text-muted-dark">
                    レバーアクション式ライフル。連射は利かないが、独特の操作感と高い単発威力を持つ。
                </td>
            </tr>
        </tbody>
    </table>

    <div class="memo-static-header">
        SMG / PDW / Handgun
    </div>
    <table class="memo-table">
        <thead>
            <tr>
                <th class="weapon-col-caliber">口径</th>
                <th class="weapon-col-name text-start ps-3">武器名</th>
                <th class="weapon-col-mode">Mode</th>
                <th class="weapon-col-rpm">RPM</th>
                <th class="weapon-col-desc ps-3">特徴・運用メモ</th>
            </tr>
        </thead>
        <tbody>
            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    4.6x30mm
                </td>
                <td class="text-blue fw-bold ps-3">MP7A1 / A2</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">950</td>
                <td class="text-muted-dark">
                    高レート・低反動・高貫通。FMJ SXで十分強く、AP SXなら重装兵も溶かせる。A2はフォアグリップ交換可。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    5.7x28mm
                </td>
                <td class="text-blue fw-bold ps-3">P90</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">900</td>
                <td class="text-muted-dark">
                    標準で50連マガジン搭載。リロードの手間が少なく連戦に強い。給弾動作が遅い点に注意。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    .45 ACP
                </td>
                <td class="text-start ps-3 fw-bold">Vector .45</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">1100</td>
                <td class="text-muted-dark">
                    圧倒的レートで近距離最強クラス。弾消費が激しく、マガジン容量(最大30)がネック。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td rowspan="3" class="weapon-col-caliber border-end border-secondary">
                    9x19mm
                </td>
                <td class="text-start ps-3 fw-bold">Vector 9mm</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">950</td>
                <td class="text-muted-dark">
                    レートは.45より落ちるが、<span class="text-blue">50連ドラム</span>が使用可能で継戦能力が高い。AP 6.3以上推奨。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-3 fw-bold text-blue">UZI PRO</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">1150</td>
                <td class="text-muted-dark">
                    Vectorを超える超高レートSMG。非常にコンパクトで低反動。クローズドボルトのためジャム有り。
                </td>
            </tr>
            <tr>
                <td class="text-start ps-3 fw-bold text-muted">UZI (無印)</td>
                <td class="weapon-col-mode"><span class="mode-full">Full</span>/Semi</td>
                <td class="weapon-col-rpm">600</td>
                <td class="text-muted-dark">
                    旧式モデル。レートは遅いが<span class="text-green">オープンボルトでジャムらない</span>。50連マガジン使用可。
                </td>
            </tr>

            <tr class="memo-caliber-row">
                <td class="weapon-col-caliber border-end border-secondary">
                    .50 AE
                </td>
                <td class="text-start ps-3 fw-bold text-warning">Desert Eagle</td>
                <td class="weapon-col-mode"><span class="mode-semi">Semi</span></td>
                <td class="weapon-col-rpm">-</td>
                <td class="text-muted-dark">
                    <span class="text-warning">ハンドキャノン</span>。高威力の.50 AE弾を使用。ロマン溢れる一撃必殺のサイドアーム。
                </td>
            </tr>
        </tbody>
    </table>
    `
};