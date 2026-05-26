import React, { useEffect, useRef, useState } from 'react';

// スプレッドシート（CSV）の12種類データ ＋ ユーザー指定のGoogleドライブ画像URLを完璧にマッピング
const AROMA_DATA = {
  lavender: {
    name: 'ラベンダー',
    english: 'Lavender',
    category: 'フローラル系',
    trouble: '日々のタスクや仕事のプレッシャー、焦り',
    wantToBe: '張り詰めた心を落ち着かせてリラックスしたい',
    desc: '心身をリラックスさせ、不安を和らげます。',
    reference: '就寝前のベッドサイドでの芳香浴や、緊張する本番前にハンカチに1滴垂らして使うのがおすすめです。',
    properties: ['プレッシャー緩和', '深い睡眠', '安心感'],
    color: 'from-purple-500 via-indigo-500 to-purple-600',
    iconBg: 'bg-purple-100 text-purple-700',
    emoji: '🪻',
    image: 'https://drive.google.com/uc?export=view&id=15Cnsz-XThTT8GTQOVrUR0yq6X3FfDi0z', 
    scenes: ['スマホを置いて眠りにつく前の30分', '大切な発表を控えた移動時間', '一日の終わり、お風呂上がりの休息タイム']
  },
  bergamot: {
    name: 'ベルガモット',
    english: 'Bergamot',
    category: 'シトラス系',
    trouble: '対人関係の気疲れ、SNSのノイズ、気分の塞ぎ込み',
    wantToBe: 'もやもやを解消し、気持ちを前向きに切り替えたい',
    desc: 'ストレスを和らげ、気持ちを前向きにします。',
    reference: 'アールグレイの香り付けにも使われる、フルーティーで気品ある柑橘。※肌に使用した状態で日光を浴びると、赤みなどのシミを招く「光毒性」があります。昼間の肌への使用は避け、お部屋での使用をメインに。',
    properties: ['気持ちの安定', '気分転換', '光毒性注意⚠️'],
    color: 'from-amber-400 via-emerald-500 to-teal-600',
    iconBg: 'bg-yellow-100 text-yellow-700',
    emoji: '🍊',
    image: 'https://drive.google.com/uc?export=view&id=1z4wiZlYhb20SXLF0kQZ8ILQwbA9586wk',
    scenes: ['夕方に仕事や作業が一区切りついたとき', 'SNSを見すぎて少し疲れたとき', '人と会う前のマインドリフレッシュに']
  },
  peppermint: {
    name: 'ペパーミント',
    english: 'Peppermint',
    category: 'ミント系',
    trouble: '長時間の作業やデスクワークによる集中力低下・眠気',
    wantToBe: '眠気を吹き飛ばして、頭をシャキッとクリアにしたい',
    desc: '眠気を覚まし、集中力を高めます。',
    reference: 'メントールの突き抜ける清涼感が、脳の働きを活性化させます。深夜の作業や、長時間のパソコン作業の強い味方です。※皮膚への刺激が強いため、お肌への直接塗布は避けてください。',
    properties: ['仕事・勉強のお供', '眠気撃退', '集中力UP'],
    color: 'from-cyan-400 via-teal-400 to-blue-500',
    iconBg: 'bg-cyan-100 text-cyan-700',
    emoji: '🌿',
    image: 'https://drive.google.com/uc?export=view&id=1TDNr26-WXoV2X4neMqWyNBfHR8fMC7KM',
    scenes: ['仕事をスタートする直前', '会議や運転前の眠気覚ましに', '溜まったタスクを片付け始めるとき']
  },
  lemongrass: {
    name: 'レモングラス',
    english: 'Lemongrass',
    category: 'ハーブ系',
    trouble: '立ち仕事や外出、繰り返しの家事による身体的な疲労感',
    wantToBe: '重だるい身体をリセットし、元気を取り戻したい',
    desc: '疲れた気分をリフレッシュさせます。',
    reference: 'レモンのような清涼感とエネルギッシュなハーブ調の香りが、疲れた身体を力強く活性化させます。忙しい一日の終わりや、スポーツの後のリフレッシュに最適です。',
    properties: ['疲労回復', '活力を出す', '爽快な空気'],
    color: 'from-yellow-400 via-lime-500 to-emerald-500',
    iconBg: 'bg-lime-100 text-lime-700',
    emoji: '🍋',
    image: 'https://drive.google.com/uc?export=view&id=1dhaTl-YIc_4Lj72Kj3jDs4CrM-vi1D1e',
    scenes: ['身体をたくさん動かした後のシャワー', '残業が終わって, 帰宅した夜', '疲れが残っていて身体が重いと感じる朝']
  },
  lemon: {
    name: 'レモン',
    english: 'Lemon',
    category: 'シトラス系',
    trouble: '朝どんよりして起きられない、午前中の気分を切り替えたい',
    wantToBe: '頭の中を爽快に切り替えて、すっきりと一日を始めたい',
    desc: '爽やかな香りで気分転換におすすめです。',
    reference: 'フレッシュなもぎたての香りは、脳をスッキリ目覚めさせます。※ベルガモット同様に「光毒性」があるため、朝起きた瞬間に部屋全体の空気をリフレッシュするディフューザーでの使用がおすすめです。',
    properties: ['朝のスッキリ', '気分の切り替え', '光毒性注意⚠️'],
    color: 'from-yellow-300 via-amber-400 to-yellow-500',
    iconBg: 'bg-yellow-600 text-yellow-500',
    emoji: '🍋',
    image: 'https://drive.google.com/uc?export=view&id=1IneXK6rwEYAvsuK7slFdzlJB26y67uQs',
    scenes: ['アラームが鳴った直後の換気時に', '一日のスケジュールを確認する朝の時間', '頭がボーッとする休日の昼下がり']
  },
  geranium: {
    name: 'ゼラニウム',
    english: 'Geranium',
    category: 'フローラル系',
    trouble: '対人関係のストレス、感情の揺らぎやリズムの乱れ',
    wantToBe: 'イライラや落ち込みを和らげて、心を安定させたい',
    desc: '気持ちのバランスを整え、穏やかな気分に導きます。',
    reference: 'バラに似た甘さと逆の瑞々しい爽やかさを併せ持つゼラニウムは、ストレスからくる自律神経の乱れを穏やかに整えてくれます。',
    properties: ['自律神経の乱れに', '情緒の安定', 'バランス調整'],
    color: 'from-fuchsia-400 via-rose-400 to-pink-500',
    iconBg: 'bg-fuchsia-100 text-fuchsia-700',
    emoji: '🌸',
    image: 'https://drive.google.com/uc?export=view&id=1LDrMR7_bMwfNtAowQVzqlu8FhkITJ2Ox',
    scenes: ['なんとなく心が落ち着かない夕暮れ時', '一人暮らしの部屋で少し寂しさを感じたとき', 'お風呂の中でセルフマッサージをするお供に']
  },
  clarysage: {
    name: 'クラリセージ',
    english: 'Clary Sage',
    category: 'ハーブ系',
    trouble: '周期的な心身の不調や、それに伴う極端な情緒不安定',
    wantToBe: 'リズムの乱れを温かく労り、穏やかで安心できる時間を過ごしたい',
    desc: '心を落ち着かせ、リラックスした時間をサポートします。',
    reference: 'ナッツ調の甘みを含んだ温かい香りで、イライラして自分を責めてしまいそうなときに心を優しく包み込んでくれます。※妊娠中やアルコール摂取直後のご使用は避けてください。',
    properties: ['周期的な不調に', '深い安心感', 'お腹の重さに'],
    color: 'from-teal-400 via-indigo-500 to-emerald-600',
    iconBg: 'bg-indigo-100 text-indigo-700',
    emoji: '🌱',
    image: 'https://drive.google.com/uc?export=view&id=1EJWCIQWuMtsdKnRfBdY0dHJqa516VI--',
    scenes: ['どうしても気分や体調が乗らない日の夜', '温かい飲み物を飲みながら過ごす時間', 'ヨガや軽いストレッチで心身をほぐすとき']
  },
  teatree: {
    name: 'ティーツリー',
    english: 'Tea Tree',
    category: 'ウッディ・ハーブ系',
    trouble: '部屋や仕事場の空気がこもっている、マルチタスクによる頭のキャパオーバー',
    wantToBe: '空間を一気にリセットし、思考をスッキリクリアにさせたい',
    desc: 'すっきりとした香りで集中したい時におすすめです。',
    reference: '強力な抗ウイルス作用を持つ清潔な香りは、部屋の空気をクリアにするだけでなく、情報過多でパンク寸前の脳をすっきりと整理するのにも役立ちます。',
    properties: ['脳内デトックス', '空間の空気清浄', '清潔な生活'],
    color: 'from-green-400 via-emerald-500 to-teal-600',
    iconBg: 'bg-green-100 text-green-700',
    emoji: '🧴',
    image: 'https://drive.google.com/uc?export=view&id=1bWBzGM2nePGQcCmfqNcHHpWFFVTBttBS',
    scenes: ['部屋や仕事用のデスクまわりを掃除するとき', '何時間もパソコンと向き合った後のリフレッシュに', '帰宅直後のルームスプレーに']
  },
  eucalyptus: {
    name: 'ユーカリ',
    english: 'Eucalyptus',
    category: 'ウッド系',
    trouble: 'エアコンによる乾燥、のどや鼻のムズムズ、息苦しさや浅い呼吸',
    wantToBe: 'のどの通りをスッキリさせて、気持ちの良い深呼吸をしたい',
    desc: '爽快感のある香りで気分をリフレッシュします。',
    reference: 'スーッとする1,8シネオール成分が、のどや鼻の不快感を和らげます。長時間お部屋にこもっていて息苦しさを感じたときにも有効です。※粘膜への刺激が強いため直接触れないよう注意。',
    properties: ['呼吸スッキリ', '花粉・エアコン対策', '空気の入れ替え'],
    color: 'from-teal-300 via-cyan-400 to-emerald-600',
    iconBg: 'bg-teal-100 text-teal-700',
    emoji: '🐨',
    image: 'https://drive.google.com/uc?export=view&id=1gPXdIAigQjEUuymCB7AUPQSRBPFiPcyA',
    scenes: ['冷暖房でお部屋の空気がこもっているとき', 'お風呂の床に1滴落として、温かいシャワーの蒸気とともに', 'のどや鼻をすっきりさせたい起床時']
  },
  citronella: {
    name: 'シトロネラ',
    english: 'Citronella',
    category: 'シトラス-ハーブ系',
    trouble: '嫌な生活臭、クローゼットの湿気、アウトドア時の虫除け対策',
    wantToBe: '嫌なニオイをオフにし、さわやかで清潔な空間を整えたい',
    desc: '爽やかな香りで空間を心地よく整えます。',
    reference: 'レモンに似たすっきりとした香りに、昆虫が嫌うシトロネラール成分を豊富に含みます。アウトドアの天然虫除けスプレーや、靴箱・お部屋干しの気になるニオイ対策に。',
    properties: ['野外活動のお供', '天然の虫除け', '湿気・部屋の消臭'],
    color: 'from-lime-400 via-green-500 to-emerald-600',
    iconBg: 'bg-lime-100 text-green-800',
    emoji: '🌾',
    image: 'https://drive.google.com/uc?export=view&id=1osUv_wjBHTVg4A37Jp0cmDx3giTBmknW',
    scenes: ['アウトドア活動やガーデニングを始める前', '部屋干しをしていてお部屋のニオイが気になるととき', '玄関や湿気がこもりやすい靴箱に']
  },
  sandalwood: {
    name: 'サンダルウッド',
    english: 'Sandalwood',
    category: 'ウッディ系',
    trouble: '情報の見すぎで常に脳がパンク状態、雑念が多く目の前のことに没頭できない',
    wantToBe: 'スマホを一時的に置いて、深い静寂の中で自分の本心と向き合いたい',
    desc: '深みのある香りで心を穏やかにします。',
    reference: '日本では「白檀（びゃくだん）」として親しまれる深みのある木のお香の香り。精神を深くグランディング（地に足をつけ、自分を取り戻す）させ、静かな読書や瞑想の時間に深い集中をもたらします。',
    properties: ['デジタルデトックス', '瞑想とマインドフルネス', '白檀 of 深い静寂'],
    color: 'from-amber-600 via-amber-800 to-amber-950',
    iconBg: 'bg-amber-100 text-amber-800',
    emoji: '🪵',
    image: 'https://drive.google.com/uc?export=view&id=1r9wOEmIyx0n3vRGP7OMo0flIlImO4S8E',
    scenes: ['スマホを別の部屋に置いて本を読み始めるとき', 'ヨガやストレッチ、夜の瞑想の時間に', '静かな環境で今後のライフプランを練りたい夜']
  },
  rose: {
    name: 'ローズ',
    english: 'Rose',
    category: 'フローラル系',
    trouble: '仕事や対人関係での挫折・落ち込み、つい他人と比べてへこんでしまう',
    wantToBe: '自分自身を最高に労い、愛して、幸福感と自信で満たしてあげたい',
    desc: '華やかな香りで優雅な気分を演出します。',
    reference: '「香りの女王」と呼ばれる贅沢なダマスクローズの香りは、傷ついた自己肯定感を優しく引き上げ、ありのままのあなたで素晴らしいことを思い出させてくれます。',
    properties: ['自己肯定感の向上', '頑張った日のご褒美', '絶対的幸福感'],
    color: 'from-rose-400 via-pink-500 to-rose-600',
    iconBg: 'bg-rose-100 text-rose-700',
    emoji: '🌹',
    image: 'https://drive.google.com/uc?export=view&id=1dYEV9R8b2ouPpGJGYOlpVLrMNX7xuKaO',
    scenes: ['大変だった大きなタスクが一段落した夜', '自分を少し贅沢に甘やかしてあげたいお風呂上がりのケア', '大切な日の朝、自分のモチベーションを高める準備タイム']
  }
};

// すべての人の日常に寄り添う 4段階（3ラリー）の対話フロー定義
const ADVISOR_FLOW = {
  // --- STEP 1: 大分類の悩み選択（対話1回目） ---
  start: {
    step: 1,
    speaker: 'ノア',
    text: `こんにちは🌿 あなたの心に静かに寄り添うアロマコンパニオンの「ノア」です。\n\nお仕事、家事、日々の役割、そして人間関係…毎日本当にお疲れ様です。よく頑張っていらっしゃいますね。\n\nまずはここで、大きく一度深呼吸。今のあなたの心の調子を、ノアに教えてくれませんか？`,
    choices: [
      { id: 'q_stress', num: '1', label: '1️⃣ ストレスを感じる', reply: 'ストレス、たくさん抱え込んでしまっていたのですね。毎日やることが多すぎて、心がパンパンになってしまっているのかもしれません。話してくれてありがとうございます。' },
      { id: 'q_anxiety', num: '2', label: '2️⃣ 不安や緊張がある', reply: '不安や緊張ですね。心がキュッと強張って、落ち着かない状態なのはつらいですよね。物事に真剣に向き合っている素敵な証拠です。' },
      { id: 'q_fatigue', num: '3', label: '3️⃣ 身体がクタクタ', reply: '身体も心もクタクタですね。立ち仕事やデスクワークなど、いつも本当にタフに乗り切っていて偉いです。身体が「休んで」とサインを出しているのかもしれません。' },
      { id: 'q_motivation', num: '4', label: '4️⃣ 集中力が出ない', reply: '集中力が出なくて焦ってしまうのですね。「やらなきゃいけないのに手が動かない」…そのもどかしい焦り、よく分かります。自分を責めないでくださいね。' },
      { id: 'q_sleep', num: '5', label: '5️⃣ 眠りにつけない', reply: '夜が来るのが不安になったり、布団に入っても脳がずっと覚醒している状態ですね。明日の予定がチラついて余計に焦っちゃいますよね。' }
    ]
  },

  // --- STEP 2: 共感と状況の深掘り質問（対話2回目） ---
  q_stress: {
    step: 2,
    speaker: 'ノア',
    text: `そのストレスは、どのような場面からきているものが一番近いですか？教えてもらえると、よりぴったりな香りを調香できます🌿`,
    choices: [
      { id: 'stress_busy', num: '1', label: '📅 タスクの山や締め切りに追われて一息つく暇がない', nextAroma: 'lavender', reply: '時間に追われるプレッシャーは心を磨耗させますよね。脳の緊張をほぐす必要がありますね。' },
      { id: 'stress_down', num: '2', label: '💬 対人関係、日々の付き合い、家庭や職場でもやもやしている', nextAroma: 'bergamot', reply: '人間関係は、相手の些細な言動でずっともやもやが残ってしまいますよね。' },
      { id: 'stress_stuffy', num: '3', label: '📱 SNSを見すぎて他人の充実した生活と自分を比べて疲れてしまう', nextAroma: 'teatree', reply: 'SNS疲れですね。他人のストーリーと自分の現実を比べてしまうと、脳がどんどん疲弊してしまいます。' }
    ]
  },

  q_anxiety: {
    step: 2,
    speaker: 'ノア',
    text: `張り詰めた不安と緊張ですね。今、どのような出来事に心がキュッと縛り付けられてしまっていますか？`,
    choices: [
      { id: 'anxiety_unstable', num: '1', label: '💼 仕事や環境の変化、将来の不透明さに正解が見えなくて不安', nextAroma: 'geranium', reply: 'これからの不安ですね。先の正解がないように思えて、底知れない焦りを感じますよね。' },
      { id: 'anxiety_tense', num: '2', label: '🎤 大切なプレゼン、商談、発表などの緊張する本番を控えている', nextAroma: 'lavender', reply: '本番への緊張ですね。失敗したらどうしよう、とドキドキして心拍数が上がっちゃいますよね。' },
      { id: 'anxiety_confidence', num: '3', label: '😢 誰かと比べて自分には得意なことも何もない気がして、自信がない', nextAroma: 'rose', reply: '自信をなくしてしまっているのですね。大丈夫、あなたにはあなただけの素晴らしいペースと価値が100%ありますよ。' }
    ]
  },

  q_fatigue: {
    step: 2,
    speaker: 'ノア',
    text: `身体がクタクタになるまで動いていらっしゃったのですね。お疲れ様です。今、特にどの部分に重荷を感じていますか？`,
    choices: [
      { id: 'fatigue_heavy', num: '1', label: '🏃‍♂️ 長時間の立ち仕事、移動、外出の繰り返しで身体全体が重い', nextAroma: 'lemongrass', reply: '身体の疲れですね。頑張ってご自身の身体を働かせた証拠です。本当にお疲れ様です。' },
      { id: 'fatigue_rhythm', num: '2', label: '🌙 夜型の生活や不規則な就寝・起床で、生活リズムが崩れてだるい', nextAroma: 'clarysage', reply: '生活リズムの崩れですね。自律神経や体調リズムが乱れると、なんとなくずっと重だるさが消えませんよね。' },
      { id: 'fatigue_body', num: '3', label: '💻 パソコンやスマホの画面を凝視しすぎて、目と頭が重い', nextAroma: 'eucalyptus', reply: 'デスクワークによる頭の疲れですね。ブルーライトを浴びすぎて脳内がパンパンになっていますね。' }
    ]
  },

  q_motivation: {
    step: 2,
    speaker: 'ノア',
    text: `机に向かってもどうしても別の作業に逃げてしまって、自己嫌悪になったりしますよね。でも、それは脳のエネルギーが一時的に空っぽなだけなんです。自分を責めないでくださいね。\n\nアロマの香りで、ここからどのような状態に意識をチェンジさせたいですか？`,
    choices: [
      { id: 'mot_focus', num: '1', label: '🎯 スマホの通知など、周りの雑音を消して目の前のタスクに没頭したい', nextAroma: 'peppermint', reply: '目の前の集中ですね。余計なノイズをシャットアウトして、一気に片付けてしまいましょう！' },
      { id: 'mot_wakeup', num: '2', label: '☀️ 朝早く活動したいときや、仕事はじめの眠気を吹き飛ばしてスッキリしたい', nextAroma: 'lemon', reply: '朝のスッキリ覚醒ですね。どんよりした脳に刺激を与えて、クリアな思考を呼び戻しましょう。' },
      { id: 'mot_fresh', num: '3', label: '🍃 ずっと同じ部屋にこもっていて息が詰まるので、空間の雰囲気を変えたい', nextAroma: 'citronella', reply: 'どんよりした空気の浄化ですね。窓をガラッと開けて、新しい風を入れ込むように香りで満たしましょう。' }
    ]
  },

  q_sleep: {
    step: 2,
    speaker: 'ノア',
    text: `布団に入っても目が冴えてしまうのは非常ついらいですよね。スパイラルを香りで優しく断ち切りましょう。眠れない最大の原因はどれに近いですか？`,
    choices: [
      { id: 'sleep_thinking', num: '1', label: '💭 今日あった出来事の反省や、明日以降の心配事で頭がぐるぐる動き続ける', nextAroma: 'lavender', reply: 'ぐるぐる思考の不安ですね。今考えても仕方がないことは、香りのヴェールに預けて脳をオフにしましょう。' },
      { id: 'sleep_noise', num: '2', label: '📱 デジタルによる脳の興奮ですね。脳内の情報ノイズを、ウッディな静寂 of 香りでリセットしましょう。', nextAroma: 'sandalwood', reply: 'デジタルによる脳の興奮ですね。脳内の情報ノイズを、ウッディな静寂 of 香りでリセットしましょう。' },
      { id: 'sleep_hormone', num: '3', label: '❄️ 心がざわざわして身体の芯の冷えやイライラがあり、落ち着いて眠れない', nextAroma: 'clarysage', reply: '焦りや体調リズムの乱れですね。芯から心と身体の緊張をゆるめ、温かい休息にいざないましょう。' }
    ]
  },

  // --- STEP 3: なりたい気分の選択（対話3回目） ---
  step3_question: {
    step: 3,
    speaker: 'ノア',
    text: `教えてくれてありがとうございます。あなたの日常や心の状況、しっかり伝わってきました。\n\n本当によく、これまで一人でその気持ちに折り合いをつけて頑張ってきましたね。偉いですよ。もう無理に気張らなくても大丈夫。\n\n最後に、今日のあなたが「こうなれたら一番心が軽くなるな」と感じる理想の状態を教えてください。`,
    choices: [
      { id: 'want_calm', num: '1', label: '🕊️ 焦りから解放され、深く穏やかに落ち着きたい', offset: 'calm' },
      { id: 'want_refresh', num: '2', label: '🍃 淀んだ気分を吹き飛ばし、明るく前向きに切り替えたい', offset: 'refresh' },
      { id: 'want_heal', num: '3', label: '💖 やさしく愛あるハグに包まれたように、幸福感で満たされたい', offset: 'heal' }
    ]
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('diagnose');
  const [currentNode, setCurrentNode] = useState('start');
  const [history, setHistory] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [libraryFilter, setLibraryFilter] = useState('すべて');
  const [diagnoseState, setDiagnoseState] = useState({
    category: null,
    detail: null,
    desired: null,
    tempAroma: null,
    freeTextAnswer: '',
  });

  const bottomRef = useRef(null);

  useEffect(() => {
    if (history.length === 0) {
      const initialMsgs = [
        {
          type: 'bot',
          speaker: 'ノア',
          text: '🌿 ようこそ、Botanical Companion へ。\n当サービスは、植物のやさしい香りを通じて、毎日を一生懸命に生きるあなたの心と身体にそっと寄り添うアロマ提案プログラムです。'
        },
        {
          type: 'bot',
          speaker: '注意事項',
          text: '⚠️ 【ご利用 of 前に】\n当サービスはセルフケアとしてのリラクゼーションを提案するものであり、医療行為や医学的な診断・治療に代わるものではありません。'
        }
      ];
      setHistory(initialMsgs);
      triggerBotQuestion('start', 1000, initialMsgs);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [history, isTyping]);

  const addMessage = (type, text, speaker = '') => {
    setHistory(prev => [...prev, { type, text, speaker }]);
  };

  const triggerBotQuestion = (nodeKey, delay = 1000, currentHistory = null) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const node = ADVISOR_FLOW[nodeKey];
      if (node) {
        const msg = { type: 'bot', speaker: node.speaker, text: node.text };
        if (currentHistory) {
          setHistory([...currentHistory, msg]);
        } else {
          setHistory(prev => [...prev, msg]);
        }
        setCurrentNode(nodeKey);
      }
    }, delay);
  };

  const handleSelect = (choiceId, label, replyText = '') => {
    addMessage('user', label, 'あなた');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (currentNode === 'start') {
        if (choiceId === 'q_other') {
          addMessage('bot', 'ノア', '日々のお悩みや、こうなりたいという思いを、自由にここに綴ってみてくださいね。ノアがしっかり受け止めます。');
          setDiagnoseState(prev => ({ ...prev, category: 'free' }));
          setCurrentNode('free_input');
        } else {
          if (replyText) {
            addMessage('bot', 'ノア', `${replyText}\nもう少し詳しく教えていただけますか？🌿`);
          }
          setDiagnoseState(prev => ({ ...prev, category: choiceId }));
          triggerBotQuestion(choiceId, 600);
        }
      } 
      else if (currentNode === 'q_stress' || currentNode === 'q_anxiety' || currentNode === 'q_fatigue' || currentNode === 'q_motivation' || currentNode === 'q_sleep') {
        const selectedChoice = ADVISOR_FLOW[currentNode].choices.find(c => c.id === choiceId);
        const tempAroma = selectedChoice ? selectedChoice.nextAroma : 'lavender';
        
        if (replyText) {
          addMessage('bot', 'ノア', `${replyText}`);
        }
        
        setDiagnoseState(prev => ({ 
          ...prev, 
          detail: choiceId,
          tempAroma: tempAroma
        }));

        triggerBotQuestion('step3_question', 800);
      }
      else if (currentNode === 'step3_question') {
        setDiagnoseState(prev => ({ ...prev, desired: choiceId }));
        addMessage('bot', 'ノア', '教えてくれてありがとうございました。\n\n理想の気分に合わせた「とっておきの香り」を調香いたしました。どうぞ受け取ってください…🌿✨');
        
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          let matchedAroma = diagnoseState.tempAroma || 'lavender';
          
          if (choiceId === 'want_calm' && (matchedAroma === 'peppermint' || matchedAroma === 'lemon')) {
            matchedAroma = 'lavender';
          } else if (choiceId === 'want_heal' && matchedAroma === 'citronella') {
            matchedAroma = 'rose';
          }
          
          setSelectedKey(matchedAroma);
          setCurrentNode('result');
        }, 1500);
      }
    }, 800);
  };

  const detectAromaFromText = (text) => {
    const t = text.toLowerCase();
    if (t.includes('ストレス') || t.includes('不安') || t.includes('イライラ') || t.includes('焦') || t.includes('落ち着き') || t.includes('リラックス') || t.includes('プレッシャー') || t.includes('締め切り') || t.includes('レポート') || t.includes('発表') || t.includes('試験') || t.includes('仕事') || t.includes('会社') || t.includes('タスク')) return 'lavender';
    if (t.includes('落ち込') || t.includes('前向き') || t.includes('ふさぎ') || t.includes('もやもや') || t.includes('沈み') || t.includes('寂し') || t.includes('人間関係') || t.includes('サークル') || t.includes('バイト') || t.includes('sns') || t.includes('ツイッター') || t.includes('インスタ') || t.includes('対人')) return 'bergamot';
    if (t.includes('集中') || t.includes('眠気') || t.includes('勉強') || t.includes('仕事') || t.includes('作業') || t.includes('気が散') || t.includes('テスト') || t.includes('パソコン') || t.includes('徹夜') || t.includes('運転')) return 'peppermint';
    if (t.includes('疲れ') || t.includes('だる') || t.includes('疲労') || t.includes('元気') || t.includes('活動') || t.includes('限界') || t.includes('立ち仕事') || t.includes('家事') || t.includes('クタクタ')) return 'lemongrass';
    if (t.includes('朝') || t.includes('目覚め') || t.includes('起き') || t.includes('シャキッと') || t.includes('起床') || t.includes('二度寝')) return 'lemon';
    if (t.includes('緊張') || t.includes('ドキドキ') || t.includes('プレゼン') || t.includes('商談') || t.includes('面接') || t.includes('就活') || t.includes('発表') || t.includes('人前') || t.includes('本番')) return 'geranium';
    if (t.includes('女性') || t.includes('生理') || t.includes('リズム') || t.includes('穏やか') || t.includes('波') || t.includes('pms') || t.includes('月経') || t.includes('体調')) return 'clarysage';
    if (t.includes('空気') || t.includes('清潔') || t.includes('消臭') || t.includes('部屋') || t.includes('におい') || t.includes('すっきりさせ') || t.includes('片付け') || t.includes('散らか') || t.includes('お掃除')) return 'teatree';
    if (t.includes('鼻') || t.includes('のど') || t.includes('不快') || t.includes('風邪') || t.includes('呼吸') || t.includes('花粉') || t.includes('つらい') || t.includes('鼻づまり') || t.includes('エアコン') || t.includes('乾燥')) return 'eucalyptus';
    if (t.includes('虫') || t.includes('蚊') || t.includes('アウトドア') || t.includes('キャンプ') || t.includes('野外') || t.includes('合宿') || t.includes('バーベキュー') || t.includes('湿気')) return 'citronella';
    if (t.includes('雑念') || t.includes('瞑想') || t.includes('静寂') || t.includes('ヨガ') || t.includes('マインドフルネス') || t.includes('お香') || t.includes('デジタルデトックス') || t.includes('読書') || t.includes('本')) return 'sandalwood';
    if (t.includes('自信') || t.includes('幸福') || t.includes('贅沢') || t.includes('自己肯定') || t.includes('高揚') || t.includes('美') || t.includes('ご褒美') || t.includes('愛し') || t.includes('ハグ')) return 'rose';
    return 'lavender';
  };

  const handleFreeTextSubmit = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    addMessage('user', trimmed, 'あなた');
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const matchedKey = detectAromaFromText(trimmed);
      addMessage('bot', 'ノア', `言葉にしていただき、ありがとうございます。これだけで、脳の重荷が軽くなりますよ。本当に毎日頑張っていますね。\n\nお悩みから、今のあなたを優しく包む最適な香りを導き出しました。どうぞ参考に。🍃`);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setSelectedKey(matchedKey);
        setDiagnoseState(prev => ({ ...prev, freeTextAnswer: trimmed, tempAroma: matchedKey }));
        setCurrentNode('result');
      }, 1500);
    }, 1200);
  };

  const handleInputSubmit = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const node = ADVISOR_FLOW[currentNode];
    if (!node) return;

    const found = node.choices.find(choice => {
      return trimmed === choice.num || 
             trimmed.includes(choice.num) || 
             choice.label.includes(trimmed);
    });

    if (found) {
      setInputText('');
      handleSelect(found.id, found.label, found.reply);
    } else {
      addMessage('user', trimmed, 'あなた');
      setInputText('');
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage('bot', 'ノア', '提示されている選択肢の番号を入力して送信するか、ボタンを直接タップしてくださいね。');
      }, 600);
    }
  };

  const toggleFavorite = (key) => {
    setFavorites(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const resetDiagnosis = () => {
    const initialMsgs = [
      {
        type: 'bot',
        speaker: 'ノア',
        text: 'おかえりなさい🌿 またお話しできて嬉しいです。今のあなたの調子はどうですか？\n\n力を抜いて、気になるものを選んで教えてくださいね。'
      }
    ];
    setHistory(initialMsgs);
    setSelectedKey(null);
    setInputText('');
    setIsTyping(false);
    setDiagnoseState({
      category: null,
      detail: null,
      desired: null,
      tempAroma: null,
      freeTextAnswer: '',
    });
    triggerBotQuestion('start', 800, initialMsgs);
  };

  // Googleドライブ画像へのアクセス用直リンクを解析生成 (安全なlh3形式を使用)
  const getGoogleDriveDirectLink = (url) => {
    if (!url) return '';
    let id = '';
    if (url.includes('id=')) {
      const match = url.match(/id=([^&]+)/);
      if (match) id = match[1];
    } else if (url.includes('/d/')) {
      const parts = url.split('/d/');
      if (parts[1]) {
        id = parts[1].split('/')[0];
      }
    }
    if (id) {
      return `https://lh3.googleusercontent.com/d/${id}`;
    }
    return url;
  };

  const categories = ['すべて', ...new Set(Object.values(AROMA_DATA).map(a => a.category))];

  return (
    <div className="max-w-md mx-auto min-h-screen md:min-h-[820px] md:my-6 flex flex-col bg-slate-50 md:rounded-3xl overflow-hidden shadow-2xl border border-emerald-100/30 animate-fade-in font-sans">
      
      {/* ボタニカル・ヘッダー */}
      <header className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 text-center shadow-lg shrink-0 relative">
        <div className="absolute top-3.5 left-4 text-emerald-300 text-2xl animate-pulse">🌿</div>
        <div className="absolute top-3.5 right-4 text-emerald-200/40 text-xs font-semibold">Noa is online</div>
        <h1 className="text-xl font-extrabold tracking-wider flex items-center justify-center gap-1">
          <span>Botanical Companion</span>
        </h1>
        <p className="text-[11px] text-emerald-100/90 mt-0.5 tracking-wide font-medium">
          心と身体に優しく寄り添うパーソナル・アロマダイアログ
        </p>
      </header>

      {/* タブナビゲーション */}
      <div className="flex bg-white border-b border-slate-100 text-sm font-medium shrink-0 shadow-sm z-10">
        <button
          onClick={() => { setActiveTab('diagnose'); }}
          className={`flex-1 py-3 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'diagnose'
              ? 'border-emerald-600 text-emerald-800 font-bold bg-emerald-50/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
          }`}
        >
          <span className="text-base">🔮</span> ノアと対話
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 py-3 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'library'
              ? 'border-emerald-600 text-emerald-800 font-bold bg-emerald-50/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
          }`}
        >
          <span className="text-base">📖</span> アロマ図鑑
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-3 text-center transition-all border-b-2 flex items-center justify-center gap-1.5 relative ${
            activeTab === 'favorites'
              ? 'border-emerald-600 text-emerald-800 font-bold bg-emerald-50/20'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
          }`}
        >
          <span className="text-base">💚</span> お気に入り
          {favorites.length > 0 && (
            <span className="absolute top-2 right-3 bg-emerald-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm animate-bounce">
              {favorites.length}
            </span>
          )}
        </button>
      </div>

      {/* メインエリア */}
      <div className="flex-1 overflow-y-auto bg-slate-50/40 p-4 flex flex-col min-h-0">
        
        {/* ===================== Tab 1: 対話チャット画面 ===================== */}
        {activeTab === 'diagnose' && (
          <div className="flex flex-col flex-1 justify-between gap-4">
            <div className="space-y-4 flex-1">
              {history.map((msg, index) => {
                const isUser = msg.type === 'user';
                const isWarn = msg.speaker === '注意事項';
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
                  >
                    {!isUser && (
                      <span className="text-[10px] text-emerald-800 font-bold mb-1 pl-2 flex items-center gap-1">
                        {isWarn ? '⚠️' : '🍃'} {msg.speaker}
                      </span>
                    )}
                    {isUser && (
                      <span className="text-[10px] text-slate-400 font-bold mb-1 pr-2">
                        👤 あなた
                      </span>
                    )}
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm transition-all whitespace-pre-line ${
                        isUser
                          ? 'bg-emerald-700 text-white rounded-tr-none shadow-emerald-700/10 font-medium'
                          : isWarn
                          ? 'bg-amber-50 text-amber-900 border border-amber-200/60 rounded-tl-none text-xs font-semibold'
                          : 'bg-white text-slate-800 border border-emerald-100/50 rounded-tl-none shadow-slate-100 font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-emerald-800 font-bold mb-1 pl-2 flex items-center gap-1">
                    🍃 ノアが考え中...
                  </span>
                  <div className="bg-white border border-emerald-100/50 rounded-2xl rounded-tl-none p-3 shadow-sm flex space-x-1.5 items-center animate-pulse">
                    <span className="block w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="block w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="block w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 mt-auto space-y-3 shrink-0">
              {currentNode !== 'result' && currentNode !== 'free_input' && !isTyping && ADVISOR_FLOW[currentNode] && (
                <div className="space-y-3 animate-slide-up">
                  
                  {/* 初期の選択肢は1画面にすっきり収まるように2カラムグリッドで表示 */}
                  <div className="grid grid-cols-2 gap-2 pr-1">
                    {ADVISOR_FLOW[currentNode].choices.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id, item.label, item.reply)}
                        className="text-left p-3 rounded-2xl border border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-50/20 text-slate-700 hover:text-emerald-950 font-semibold text-xs transition-all active:scale-[0.98] shadow-sm flex items-center justify-between group"
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform leading-relaxed">{item.label}</span>
                        <span className="text-[10px] text-slate-300 group-hover:text-emerald-600 shrink-0 ml-1">➜</span>
                      </button>
                    ))}
                  </div>

                  {/* 「その他（自由記述）」は、スクロール外の「特別な常時可視化ボタン」として独立配置 */}
                  {currentNode === 'start' && (
                    <button
                      onClick={() => handleSelect('q_other', '📝 自由に相談する（自由記述）')}
                      className="w-full p-3 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/80 text-emerald-800 hover:text-emerald-950 font-bold text-xs transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>✍️ 自由に言葉でノアに相談する（自由記述フォームへ）</span>
                    </button>
                  )}

                  {/* 通常時の簡易送信フォーム */}
                  <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleInputSubmit();
                      }}
                      placeholder="番号を入力して送信もできます"
                      className="flex-1 bg-transparent px-3 py-1.5 text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleInputSubmit}
                      className="bg-emerald-800 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-900 transition shadow"
                    >
                      送信
                    </button>
                  </div>
                </div>
              )}

              {currentNode === 'free_input' && !isTyping && (
                <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-md space-y-3 animate-slide-up">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold">📋 お悩みをノアに直接話す</span>
                    <button onClick={resetDiagnosis} className="text-xs text-slate-400 hover:text-slate-600 font-medium">リセット</button>
                  </div>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="例：最近、仕事のプレッシャーや忙しさで、夜も焦ってしまってなかなか眠りにつくことができません…"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none h-24 text-slate-700 leading-relaxed"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentNode('start');
                        setInputText('');
                      }}
                      className="flex-1 border border-slate-200 text-slate-500 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                    >
                      戻る
                    </button>
                    <button
                      onClick={handleFreeTextSubmit}
                      disabled={!inputText.trim()}
                      className="flex-[2] bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold tracking-wider transition shadow-md"
                    >
                      ノアに分析してもらう 🌿
                    </button>
                  </div>
                </div>
              )}

              {currentNode === 'result' && selectedKey && !isTyping && AROMA_DATA[selectedKey] && (
                <div className="space-y-4 animate-scale-up">
                  {/* 提案結果詳細カード */}
                  <div className="bg-white border border-emerald-100/70 rounded-3xl p-5 shadow-xl relative overflow-hidden">
                    <div className={`absolute -right-10 -top-10 w-24 h-24 rounded-full bg-gradient-to-br ${AROMA_DATA[selectedKey].color} opacity-20 blur-md`} />
                    
                    {/* 写真/SVG植物イラストコンテナ */}
                    <div className="w-full h-44 -mx-5 -mt-5 mb-4 overflow-hidden relative border-b border-slate-100 bg-slate-50 flex items-center justify-center">
                      <img 
                        src={getGoogleDriveDirectLink(AROMA_DATA[selectedKey].image)}
                        alt={AROMA_DATA[selectedKey].name}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                        referrerPolicy="no-referrer"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent flex items-end p-4 pointer-events-none w-full">
                        <span className="text-white text-[10px] font-bold bg-emerald-700/95 px-2 py-0.5 rounded tracking-wider shadow-sm">
                          {AROMA_DATA[selectedKey].category}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h2 className="text-xl font-black text-slate-800 mt-0.5 flex items-center gap-2">
                          <span>{AROMA_DATA[selectedKey].emoji} {AROMA_DATA[selectedKey].name}</span>
                        </h2>
                        <span className="text-xs text-slate-400 font-bold block pl-1">{AROMA_DATA[selectedKey].english}</span>
                      </div>
                      
                      <button 
                        onClick={() => toggleFavorite(selectedKey)}
                        className="p-2 rounded-full hover:bg-emerald-50/50 transition-all border border-slate-100 bg-white shadow-sm flex items-center justify-center"
                        title="お気に入りに追加"
                      >
                        <span className="text-lg transition-transform active:scale-125">
                          {favorites.includes(selectedKey) ? '💚' : '🤍'}
                        </span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-emerald-50/40 p-3 rounded-2xl space-y-0.5">
                        <p className="text-[10px] text-emerald-800 font-bold tracking-wider">✨ 期待される効果</p>
                        <p className="text-[13px] text-slate-700 leading-relaxed font-bold">
                          {AROMA_DATA[selectedKey].desc}
                        </p>
                      </div>

                      <div className="border-l-4 border-emerald-600 pl-3 space-y-1 bg-slate-50/60 py-2 rounded-r-2xl pr-2">
                        <p className="text-[10px] text-emerald-800 font-bold tracking-wider">💡 提案の理由</p>
                        <p className="text-[12px] text-slate-600 leading-relaxed font-semibold">
                          「{AROMA_DATA[selectedKey].trouble}」を抱え、「{AROMA_DATA[selectedKey].wantToBe}」になりたいと感じている今のあなたには、{AROMA_DATA[selectedKey].name}の自然パワーがぴったりです。
                        </p>
                        <p className="text-[11px] text-slate-500 italic mt-1 leading-relaxed font-medium">
                          ℹ️ {AROMA_DATA[selectedKey].reference}
                        </p>
                      </div>

                      <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 block mb-1">🛀 おすすめの使用シーン</span>
                        <ul className="list-none text-[11px] text-slate-600 space-y-1 pl-1 font-medium">
                          {AROMA_DATA[selectedKey].scenes.map((scene, i) => (
                            <li key={i} className="flex items-start gap-1 leading-relaxed">
                              <span className="text-emerald-500">✦</span>
                              <span>{scene}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {AROMA_DATA[selectedKey].properties.map((tag, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-600 text-[9px] px-2.5 py-0.5 rounded font-bold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-[9px] text-slate-400 space-y-1 leading-relaxed">
                      <p className="font-bold text-slate-500">⚠️ 【安心・安全に使うための注意点】</p>
                      <p>・アロマオイル（精油）は医薬品ではありません。無理のない範囲で生活に取り入れてみてください。</p>
                      <p>・レモンやベルガモットなどは、使用後に紫外線に当たると肌にシミや赤みを引き起こす<b>「光毒性」</b>があります。肌に使用した後の外出は避けてください。</p>
                    </div>
                  </div>

                  <button
                    onClick={resetDiagnosis}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold text-xs tracking-wider transition shadow-md"
                  >
                    🔄 最初からもう一度対話する
                  </button>
                </div>
              )}

            </div>
            <div ref={bottomRef} />
          </div>
        )}

        {/* ===================== Tab 2: アロマ図鑑 ===================== */}
        {activeTab === 'library' && (
          <div className="space-y-4 animate-fade-in flex flex-col h-full">
            <div className="flex justify-between items-center shrink-0">
              <p className="text-xs text-slate-500 font-bold font-mono">アロマ調香薬箱 (全{Object.keys(AROMA_DATA).length}種類)</p>
            </div>
            
            <div className="flex flex-wrap gap-1 border-b border-slate-100 pb-2 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLibraryFilter(cat)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                    libraryFilter === cat
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid gap-3 overflow-y-auto pr-1 flex-1 pb-4">
              {Object.keys(AROMA_DATA)
                .filter(key => libraryFilter === 'すべて' || AROMA_DATA[key].category === libraryFilter)
                .map((key) => {
                  const aroma = AROMA_DATA[key];
                  const isFav = favorites.includes(key);
                  return (
                    <div key={key} className="bg-white rounded-2xl border border-emerald-100/50 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col relative animate-scale-up">
                      
                      <div className="w-full h-32 overflow-hidden relative bg-slate-50 flex items-center justify-center">
                        <img 
                          src={getGoogleDriveDirectLink(aroma.image)} 
                          alt={aroma.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-3 justify-between pointer-events-none w-full">
                          <div className="text-white">
                            <span className="text-[9px] font-bold bg-emerald-800/90 px-2 py-0.5 rounded tracking-wider block w-max mb-1 shadow-sm">
                              {aroma.category}
                            </span>
                            <h3 className="font-extrabold text-sm flex items-center gap-1.5 filter drop-shadow-sm">
                              <span>{aroma.emoji} {aroma.name}</span>
                              <span className="text-xs font-normal opacity-85">({aroma.english})</span>
                            </h3>
                          </div>
                        </div>
                        {/* お気に入りボタン */}
                        <button
                          onClick={() => toggleFavorite(key)}
                          className="absolute top-3 right-3 text-base hover:scale-110 transition shrink-0 bg-white/50 hover:bg-white/80 p-1.5 rounded-full shadow-sm backdrop-blur-sm z-10"
                        >
                          {isFav ? '💚' : '🤍'}
                        </button>
                      </div>

                      <div className="p-4 font-sans">
                        <div className="space-y-2 text-xs text-slate-600 font-medium">
                          <p className="leading-relaxed">
                            <span className="font-bold text-slate-700 block text-[9px] tracking-wider text-emerald-800 uppercase">📋 日常の悩み:</span>
                            {aroma.trouble}
                          </p>
                          <p className="leading-relaxed">
                            <span className="font-bold text-slate-700 block text-[9px] tracking-wider text-emerald-800 uppercase">🎯 目指したい状態:</span>
                            {aroma.wantToBe}
                          </p>
                          <p className="leading-relaxed">
                            <span className="font-bold text-slate-700 block text-[9px] tracking-wider text-emerald-800 uppercase">✨ 期待される効果:</span>
                            {aroma.desc}
                          </p>
                          <p className="bg-emerald-50/20 border border-emerald-100/30 p-2.5 rounded-xl text-slate-600 text-[10px] leading-relaxed font-semibold">
                            <span className="font-bold text-emerald-800 block text-[9px] mb-0.5">💡 活用のアドバイス・安全性:</span>
                            {aroma.reference}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                          <div className="flex flex-wrap gap-1 max-w-[70%]">
                            {aroma.properties.map((prop, i) => (
                              <span key={i} className="bg-slate-50 text-[9px] text-slate-500 border border-slate-100 px-2 py-0.5 rounded font-semibold">
                                #{prop}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedKey(key);
                              setActiveTab('diagnose');
                              setCurrentNode('result');
                            }}
                            className="text-[10px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-sm"
                          >
                            ノアと話す
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ===================== Tab 3: お気に入りリスト ===================== */}
        {activeTab === 'favorites' && (
          <div className="space-y-4 animate-fade-in flex flex-col h-full">
            {favorites.length === 0 ? (
              <div className="text-center py-20 px-6 flex-1 flex flex-col items-center justify-center">
                <span className="text-5xl block mb-4 animate-pulse">🌿</span>
                <p className="text-sm text-slate-500 font-bold">お気に入りの香りはまだありません</p>
                <p className="text-xs text-slate-400 mt-2 max-w-[280px] leading-relaxed font-medium">
                  ノアとの対話や、アロマ図鑑からお好みの香りを💚に登録していただくと、保存されます。
                </p>
                <button
                  onClick={() => { setActiveTab('diagnose'); resetDiagnosis(); }}
                  className="mt-6 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  さっそくノアと診断を始める
                </button>
              </div>
            ) : (
              <div className="space-y-3 flex flex-col h-full">
                <p className="text-xs text-slate-500 font-bold shrink-0">
                  あなたのお気に入りの香り ({favorites.length}件)
                </p>
                <div className="grid gap-2 overflow-y-auto pr-1 flex-1 pb-4">
                  {favorites.map((key) => {
                    const aroma = AROMA_DATA[key];
                    if (!aroma) return null;
                    return (
                      <div key={key} className="bg-white rounded-2xl p-4 border border-emerald-100/40 shadow-sm flex items-center justify-between animate-scale-up hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-1 bg-slate-50 rounded-xl">{aroma.emoji}</span>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">
                              {aroma.name} <span className="text-[10px] text-slate-400 font-normal">({aroma.english})</span>
                            </h4>
                            <p className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded w-max mt-1">
                              {aroma.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedKey(key);
                              setActiveTab('diagnose');
                              setCurrentNode('result');
                            }}
                            className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition"
                          >
                            詳細を見る
                          </button>
                          <button
                            onClick={() => toggleFavorite(key)}
                            className="p-1 hover:scale-110 transition text-lg bg-slate-50 rounded-xl hover:bg-slate-100"
                          >
                            💚
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}