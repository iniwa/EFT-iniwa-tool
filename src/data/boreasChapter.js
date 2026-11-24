// Verified milestones summarized from the current Boreas Wiki and patch notes.
export const BOREAS_CHAPTER = {
  id: 'boreas',
  title: 'Boreas',
  category: 'side',
  manualOnly: true,
  wikiLink: 'https://wikiwiki.jp/eft/' + encodeURI('ストーリータスク/Boreas'),
  wikiLabel: '日本語Wiki',
  phases: [
    {
      id: 'boreas_signal',
      title: '救難信号と船の手がかり',
      steps: [
        { id: 'boreas_contact', type: 'check', text: 'Boreasを開始し、救難信号についてMechanicに相談する' },
        { id: 'boreas_woods_repair', type: 'check', text: 'Woodsの無線設備を修理してMechanicに報告する' },
        { id: 'boreas_shipping_documents', type: 'check', text: 'LighthouseのParadigm Shipping資料を調べ、MechanicにBoreasについて聞く' },
      ],
    },
    {
      id: 'boreas_transport',
      title: '輸送手配と初回乗船',
      steps: [
        {
          id: 'boreas_transport_arranged', type: 'check', text: 'PraporとBTR Driverの手配を終え、Mechanicに報告する',
          hint: 'Falling SkiesとBTRの過去の選択によって要求が変わります。現在のゲーム内指示に従ってください。',
        },
        {
          id: 'boreas_first_boarding', type: 'check', text: 'ShorelineまたはLighthouseからIcebreakerに乗船する',
          hint: 'RagmanのPay the Fare!で入手できるSudak-tudak修理キットを使用します。',
        },
      ],
    },
    {
      id: 'boreas_investigation',
      title: '船内調査',
      steps: [
        { id: 'boreas_engine_deck', type: 'check', text: '機関室から上層への経路を調べる' },
        {
          id: 'boreas_open_superstructure', type: 'check', text: 'SZ-1で鎖を外し、船内の上層区画へ進む',
          hint: '初回帰還後、MechanicとPraporに話して爆薬の入手を進めます。',
        },
        { id: 'boreas_captain', type: 'check', text: '船長を捜索し、結果を科学者に知らせる' },
        { id: 'boreas_scientist', type: 'check', text: 'BTR Driverの依頼を進め、科学者の避難を確認する' },
        { id: 'boreas_direct_access', type: 'check', text: 'Stick to Itの一連のタスクでIcebreakerへの直行を解放する', optional: true },
      ],
    },
    {
      id: 'boreas_report',
      title: '記録回収と解析報告',
      steps: [
        { id: 'boreas_c1_drives', type: 'check', text: 'C-1区画のハードドライブ3点を持ち帰り、Mechanicに解析を依頼する' },
        { id: 'boreas_deliver_ultralink', type: 'check', text: 'レイドで入手したUltralinkを3個納品する' },
        { id: 'boreas_deliver_ram', type: 'check', text: 'レイドで入手したMemento Server RAMを4個納品する' },
        { id: 'boreas_deliver_ibx', type: 'check', text: 'レイドで入手したIBX Gigachadを2個納品する' },
        { id: 'boreas_report_received', type: 'check', text: 'ゲーム内でMechanicの解析報告を受け取ったことを確認する' },
      ],
    },
  ],
}
