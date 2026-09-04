/**
 * Mock HSK3 Exam Data
 * Structure: 3 sections — Listening / Reading / Writing
 * Simplified for UI demo (real HSK3: 40/30/10 questions)
 */

export const EXAM_SECTIONS = [
  {
    id: 'listening',
    label: '听力',
    labelEn: 'Listening',
    questionCount: 10,
    timeLimitSec: 10 * 60, // 10 minutes
    icon: '🎧',
    color: '#1ed760',
    description: 'Listen to words and sentences, then answer questions.',
    instruction: 'For this demo, the Chinese text is shown. Select the correct answer.',
  },
  {
    id: 'reading',
    label: '阅读',
    labelEn: 'Reading',
    questionCount: 10,
    timeLimitSec: 10 * 60,
    icon: '📖',
    color: '#539df5',
    description: 'Read sentences and passages, then answer questions.',
    instruction: 'Read carefully and choose the best answer.',
  },
  {
    id: 'writing',
    label: '书写',
    labelEn: 'Writing',
    questionCount: 5,
    timeLimitSec: 5 * 60,
    icon: '✍️',
    color: '#ffa42b',
    description: 'Arrange words into correct sentences.',
    instruction: 'Arrange the given words to form a grammatically correct sentence.',
  },
]

// ─── LISTENING questions ──────────────────────────────────────────────────────
export const LISTENING_QUESTIONS = [
  {
    id: 'l1', type: 'meaning',
    prompt: '环境',
    pinyin: 'huán jìng',
    options: ['Economy', 'Environment', 'Experience', 'Education'],
    answer: 'Environment',
    explanation: '环境 (huán jìng) means "environment / surroundings".',
  },
  {
    id: 'l2', type: 'meaning',
    prompt: '影响',
    pinyin: 'yǐng xiǎng',
    options: ['To complete', 'To influence', 'To develop', 'To compare'],
    answer: 'To influence',
    explanation: '影响 means "to influence / influence".',
  },
  {
    id: 'l3', type: 'sentence-meaning',
    prompt: '他已经把作业做完了。',
    pinyin: 'Tā yǐjīng bǎ zuòyè zuòwán le.',
    options: [
      'He is doing his homework now.',
      'He already finished his homework.',
      'He forgot to do his homework.',
      'He needs help with homework.',
    ],
    answer: 'He already finished his homework.',
    explanation: '已经…了 = already + completed action.',
  },
  {
    id: 'l4', type: 'meaning',
    prompt: '机会',
    pinyin: 'jī huì',
    options: ['Machine', 'Opportunity', 'Result', 'Problem'],
    answer: 'Opportunity',
    explanation: '机会 (jī huì) = opportunity / chance.',
  },
  {
    id: 'l5', type: 'sentence-meaning',
    prompt: '虽然天气很冷，但是她还是去跑步了。',
    pinyin: 'Suīrán tiānqì hěn lěng, dànshì tā háishì qù pǎobù le.',
    options: [
      'She went running because it was cold.',
      'She didn\'t go running because it was cold.',
      'Although it was cold, she still went running.',
      'She went running and it got cold.',
    ],
    answer: 'Although it was cold, she still went running.',
    explanation: '虽然…但是 = "Although…but/still".',
  },
  {
    id: 'l6', type: 'meaning',
    prompt: '重要',
    pinyin: 'zhòng yào',
    options: ['Heavy', 'Important', 'Busy', 'Difficult'],
    answer: 'Important',
    explanation: '重要 (zhòng yào) = important.',
  },
  {
    id: 'l7', type: 'sentence-meaning',
    prompt: '如果明天不下雨，我们就去爬山。',
    pinyin: "Rúguǒ míngtiān bù xià yǔ, wǒmen jiù qù páshān.",
    options: [
      'We will go hiking if it rains tomorrow.',
      'We went hiking yesterday.',
      'If it doesn\'t rain tomorrow, we\'ll go hiking.',
      'It rained, so we didn\'t go hiking.',
    ],
    answer: "If it doesn't rain tomorrow, we'll go hiking.",
    explanation: '如果…就 = "If…then".',
  },
  {
    id: 'l8', type: 'meaning',
    prompt: '发展',
    pinyin: 'fā zhǎn',
    options: ['To start', 'To develop', 'To finish', 'To change'],
    answer: 'To develop',
    explanation: '发展 (fā zhǎn) = to develop / development.',
  },
  {
    id: 'l9', type: 'sentence-meaning',
    prompt: '因为他努力工作，所以得到了提升。',
    pinyin: 'Yīnwèi tā nǔlì gōngzuò, suǒyǐ dédào le tíshēng.',
    options: [
      'He worked hard but didn\'t get promoted.',
      'Because he worked hard, he got promoted.',
      'He was promoted so he worked harder.',
      'He didn\'t work hard enough.',
    ],
    answer: 'Because he worked hard, he got promoted.',
    explanation: '因为…所以 = "Because…therefore".',
  },
  {
    id: 'l10', type: 'meaning',
    prompt: '认为',
    pinyin: 'rèn wéi',
    options: ['To know', 'To think / believe', 'To remember', 'To understand'],
    answer: 'To think / believe',
    explanation: '认为 (rèn wéi) = to think / to believe.',
  },
]

// ─── READING questions ────────────────────────────────────────────────────────
export const READING_QUESTIONS = [
  {
    id: 'r1', type: 'fill-blank',
    prompt: '他___去过中国，所以他的汉语说得很好。',
    blank: '___',
    options: ['已经', '正在', '应该', '可能'],
    answer: '已经',
    explanation: '已经 = "already". He has already been to China.',
  },
  {
    id: 'r2', type: 'fill-blank',
    prompt: '这个问题___重要，我们一定要认真解决。',
    blank: '___',
    options: ['很', '是很', '非常', '也'],
    answer: '非常',
    explanation: '非常 = "extremely". Both 很 and 非常 can work but 非常 is more emphatic for HSK3.',
  },
  {
    id: 'r3', type: 'match',
    prompt: 'Which sentence correctly uses 比?',
    options: [
      '今天比昨天热。',
      '今天热比昨天。',
      '比今天昨天热。',
      '今天昨天比热。',
    ],
    answer: '今天比昨天热。',
    explanation: 'A + 比 + B + Adjective: 今天(A) 比 昨天(B) 热(Adj).',
  },
  {
    id: 'r4', type: 'fill-blank',
    prompt: '她学习汉语___三年了，进步很大。',
    blank: '___',
    options: ['已经', '还是', '正在', '虽然'],
    answer: '已经',
    explanation: '已经…了 expresses that something has been ongoing or has reached a state.',
  },
  {
    id: 'r5', type: 'true-false',
    prompt: 'Read: 小明虽然生病了，但是他还是来上课了。\n\nStatement: Xiao Ming did NOT come to class because he was sick.',
    options: ['True', 'False'],
    answer: 'False',
    explanation: '虽然…但是 = "although…but/still". He WAS sick but still came to class.',
  },
  {
    id: 'r6', type: 'match',
    prompt: 'Choose the correct sentence:',
    options: [
      '我正在学习的时候他来了。',
      '我正在的学习时候他来了。',
      '我学习正在的时候他来了。',
      '正在我学习时候他来了。',
    ],
    answer: '我正在学习的时候他来了。',
    explanation: '正在 + Verb: 正在学习. 的时候 = "when/while".',
  },
  {
    id: 'r7', type: 'fill-blank',
    prompt: '___你有问题，就来找我。',
    blank: '___',
    options: ['因为', '如果', '虽然', '所以'],
    answer: '如果',
    explanation: '如果 = "if". 如果…就 = "if…then".',
  },
  {
    id: 'r8', type: 'true-false',
    prompt: 'Read: 这家餐厅的菜比那家贵，但是味道更好。\n\nStatement: The food at this restaurant tastes better than the other.',
    options: ['True', 'False'],
    answer: 'True',
    explanation: '更好 = "even better". The sentence says the taste is better.',
  },
  {
    id: 'r9', type: 'match',
    prompt: 'Which is grammatically correct?',
    options: [
      '因为下雨了所以我没出去。',
      '所以我没出去因为下雨了。',
      '我没出去因为下雨了所以。',
      '因为下雨了，所以我没出去。',
    ],
    answer: '因为下雨了，所以我没出去。',
    explanation: 'A comma separates the 因为 clause from the 所以 clause.',
  },
  {
    id: 'r10', type: 'fill-blank',
    prompt: '他说得汉语越来越___了。',
    blank: '___',
    options: ['好', '坏', '慢', '少'],
    answer: '好',
    explanation: '越来越好 = "better and better". His Chinese keeps improving.',
  },
]

// ─── WRITING questions ────────────────────────────────────────────────────────
export const WRITING_QUESTIONS = [
  {
    id: 'w1', type: 'arrange',
    instruction: 'Arrange into a correct sentence:',
    words: ['他', '比', '我', '高', '一点儿', '。'],
    answer: '他比我高一点儿。',
    explanation: 'A(他) + 比 + B(我) + Adj(高) + degree(一点儿).',
  },
  {
    id: 'w2', type: 'arrange',
    instruction: 'Arrange into a correct sentence:',
    words: ['虽然', '她', '很', '忙', '，', '但是', '她', '来', '了', '。'],
    answer: '虽然她很忙，但是她来了。',
    explanation: '虽然 + clause + 但是 + clause.',
  },
  {
    id: 'w3', type: 'arrange',
    instruction: 'Arrange into a correct sentence:',
    words: ['如果', '你', '努力', '，', '就', '会', '成功', '。'],
    answer: '如果你努力，就会成功。',
    explanation: '如果 + condition + 就 + result.',
  },
  {
    id: 'w4', type: 'arrange',
    instruction: 'Arrange into a correct sentence:',
    words: ['因为', '他', '生病', '了', '，', '所以', '没', '来', '。'],
    answer: '因为他生病了，所以没来。',
    explanation: '因为 + reason + 所以 + result.',
  },
  {
    id: 'w5', type: 'arrange',
    instruction: 'Arrange into a correct sentence:',
    words: ['我', '正在', '学习', '汉语', '呢', '。'],
    answer: '我正在学习汉语呢。',
    explanation: 'Subject + 正在 + Verb + Object + 呢 (progressive).',
  },
]

export const ALL_QUESTIONS = {
  listening: LISTENING_QUESTIONS,
  reading: READING_QUESTIONS,
  writing: WRITING_QUESTIONS,
}
