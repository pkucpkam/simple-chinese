/**
 * Mock grammar data — HSK 1/2/3 grammar points with exercises.
 * Exercise types: 'multiple-choice' | 'fill-blank' | 'arrange'
 */

export const GRAMMAR_POINTS = [
  // ─── HSK 1 ───────────────────────────────────────────────
  {
    id: 'hsk1-shi',
    hsk: 1,
    pattern: '是 (shì)',
    title: '"To be" — Subject + 是 + Noun',
    summary: 'The verb 是 links a subject to a noun or noun phrase. Unlike English "to be", 是 is not used with adjectives.',
    explanation: `Use 是 to say what something or someone IS:
• 我是学生。(I am a student.)
• 她是老师。(She is a teacher.)
• 这是我的书。(This is my book.)

⚠️ Do NOT use 是 before adjectives. Say 他很高 (He is tall), NOT 他是高。`,
    examples: [
      { zh: '我是中国人。', pinyin: 'Wǒ shì Zhōngguórén.', en: 'I am Chinese.' },
      { zh: '他是我的朋友。', pinyin: 'Tā shì wǒ de péngyǒu.', en: 'He is my friend.' },
      { zh: '这不是我的手机。', pinyin: 'Zhè bù shì wǒ de shǒujī.', en: 'This is not my phone.' },
    ],
    exercises: [
      {
        id: 'shi-e1',
        type: 'multiple-choice',
        question: 'Which sentence is correct?',
        options: ['他是很高。', '他是高。', '他很高。', '他高是。'],
        answer: '他很高。',
        explanation: '是 is not used with adjectives. Use 很 instead: 他很高 (He is tall).',
      },
      {
        id: 'shi-e2',
        type: 'fill-blank',
        question: '我 ___ 学生。(I am a student.)',
        answer: '是',
        hint: 'Use the verb that means "to be"',
        explanation: '是 is the verb "to be" in Chinese.',
      },
      {
        id: 'shi-e3',
        type: 'arrange',
        question: 'Arrange: a teacher / she / is',
        words: ['她', '是', '老师', '。'],
        answer: '她是老师。',
        explanation: 'Word order: Subject + 是 + Noun.',
      },
      {
        id: 'shi-e4',
        type: 'multiple-choice',
        question: 'How do you say "This is not my bag"?',
        options: ['这不是我的包。', '这是不我的包。', '不这是我的包。', '这是我的不包。'],
        answer: '这不是我的包。',
        explanation: '不 goes directly before the verb 是 to negate it.',
      },
    ],
  },
  {
    id: 'hsk1-ma',
    hsk: 1,
    pattern: '吗 (ma)',
    title: 'Yes/No Questions with 吗',
    summary: 'Add 吗 to the end of any statement to turn it into a yes/no question. No word order change needed.',
    explanation: `Simply add 吗 at the end of a sentence:
• 你是学生。→ 你是学生吗？(Are you a student?)
• 他喜欢咖啡。→ 他喜欢咖啡吗？(Does he like coffee?)

To answer: just say 是 (yes) or 不是 / 不 (no).`,
    examples: [
      { zh: '你好吗？', pinyin: 'Nǐ hǎo ma?', en: 'How are you? (Are you well?)' },
      { zh: '你是老师吗？', pinyin: 'Nǐ shì lǎoshī ma?', en: 'Are you a teacher?' },
      { zh: '她去学校吗？', pinyin: 'Tā qù xuéxiào ma?', en: 'Is she going to school?' },
    ],
    exercises: [
      {
        id: 'ma-e1',
        type: 'fill-blank',
        question: '你喜欢音乐 ___？(Do you like music?)',
        answer: '吗',
        hint: 'Question particle that goes at the end',
        explanation: '吗 turns any statement into a yes/no question.',
      },
      {
        id: 'ma-e2',
        type: 'arrange',
        question: 'Make a question: drink / do you / tea / want to?',
        words: ['你', '喝', '茶', '吗', '？'],
        answer: '你喝茶吗？',
        explanation: 'Keep the statement word order and add 吗 at the end.',
      },
      {
        id: 'ma-e3',
        type: 'multiple-choice',
        question: 'Where does 吗 go in a question?',
        options: ['At the beginning', 'After the subject', 'At the end of the sentence', 'Before the verb'],
        answer: 'At the end of the sentence',
        explanation: '吗 always comes at the very end of the sentence.',
      },
    ],
  },
  {
    id: 'hsk1-ye',
    hsk: 1,
    pattern: '也 (yě)',
    title: '"Also / Too" — Subject + 也 + Verb',
    summary: '也 means "also" or "too". It always comes BEFORE the verb, never at the end of the sentence like English "too".',
    explanation: `Place 也 directly before the verb phrase:
• 我喜欢音乐，他也喜欢音乐。(I like music, he also likes music.)
• 我也是学生。(I am also a student.)

⚠️ Never put 也 at the end: ✗ 我喜欢音乐也。`,
    examples: [
      { zh: '我也去。', pinyin: 'Wǒ yě qù.', en: 'I am also going.' },
      { zh: '她也学汉语。', pinyin: 'Tā yě xué Hànyǔ.', en: 'She also studies Chinese.' },
      { zh: '他也不喜欢。', pinyin: 'Tā yě bù xǐhuān.', en: 'He also doesn\'t like it.' },
    ],
    exercises: [
      {
        id: 'ye-e1',
        type: 'multiple-choice',
        question: 'Where does 也 go in 他 ___ 是老师?',
        options: ['Before 是', 'After 是', 'After 老师', 'Before 他'],
        answer: 'Before 是',
        explanation: '也 always appears directly before the verb.',
      },
      {
        id: 'ye-e2',
        type: 'fill-blank',
        question: '我学习汉语，她 ___ 学习汉语。(She also studies Chinese.)',
        answer: '也',
        hint: '"Also" in Chinese, placed before the verb',
        explanation: '也 goes before the verb 学习.',
      },
      {
        id: 'ye-e3',
        type: 'arrange',
        question: 'Arrange: he / Chinese / also / studies',
        words: ['他', '也', '学', '汉语', '。'],
        answer: '他也学汉语。',
        explanation: 'Subject + 也 + Verb + Object.',
      },
    ],
  },

  // ─── HSK 2 ───────────────────────────────────────────────
  {
    id: 'hsk2-le',
    hsk: 2,
    pattern: '了 (le)',
    title: 'Completed Action — Verb + 了',
    summary: '了 after a verb marks a completed action. It does not simply mean "past tense" — it signals completion.',
    explanation: `Place 了 directly after the verb:
• 我吃了。(I have eaten / I ate.)
• 他买了一本书。(He bought a book.)
• 我们走了。(We left.)

Negation — use 没 (not 不) and drop 了:
• 我没吃。(I didn't eat / haven't eaten.)
• 他没买书。(He didn't buy a book.)`,
    examples: [
      { zh: '我喝了咖啡。', pinyin: 'Wǒ hē le kāfēi.', en: 'I drank coffee.' },
      { zh: '她走了。', pinyin: 'Tā zǒu le.', en: 'She left.' },
      { zh: '我没看电影。', pinyin: 'Wǒ méi kàn diànyǐng.', en: 'I didn\'t watch the movie.' },
    ],
    exercises: [
      {
        id: 'le-e1',
        type: 'fill-blank',
        question: '我昨天吃 ___ 很多。(I ate a lot yesterday.)',
        answer: '了',
        hint: 'Completion marker placed after the verb',
        explanation: '了 directly follows the verb to indicate the action is complete.',
      },
      {
        id: 'le-e2',
        type: 'multiple-choice',
        question: 'How do you say "I didn\'t go"?',
        options: ['我不去了。', '我没去。', '我了没去。', '我去不了。'],
        answer: '我没去。',
        explanation: 'For negation of completed actions, use 没 (not 不) and drop 了.',
      },
      {
        id: 'le-e3',
        type: 'arrange',
        question: 'Arrange: bought / he / a phone',
        words: ['他', '买', '了', '一', '部', '手机', '。'],
        answer: '他买了一部手机。',
        explanation: 'Subject + Verb + 了 + Object.',
      },
      {
        id: 'le-e4',
        type: 'multiple-choice',
        question: 'Which sentence correctly uses 了?',
        options: ['我了喜欢她。', '我喜欢了她。', '我喜欢她了。', '了我喜欢她。'],
        answer: '我喜欢她了。',
        explanation: 'With stative verbs like 喜欢, 了 goes at the end and signals a change of state.',
      },
    ],
  },
  {
    id: 'hsk2-bi',
    hsk: 2,
    pattern: '比 (bǐ)',
    title: 'Comparison — A + 比 + B + Adjective',
    summary: '比 is used to compare two things. The adjective describes the difference, and degree words like 更/还 can strengthen the comparison.',
    explanation: `Structure: A + 比 + B + Adjective
• 我比他高。(I am taller than him.)
• 这个比那个贵。(This one is more expensive than that one.)

Add 更 (gèng = even more) or 还 (hái = still):
• 他比我还高。(He is even taller than me.)

Negation — use 没有:
• 我没有他高。(I am not as tall as him.)`,
    examples: [
      { zh: '今天比昨天热。', pinyin: 'Jīntiān bǐ zuótiān rè.', en: 'Today is hotter than yesterday.' },
      { zh: '苹果比香蕉贵。', pinyin: 'Píngguǒ bǐ xiāngjiāo guì.', en: 'Apples are more expensive than bananas.' },
      { zh: '她没有我高。', pinyin: 'Tā méiyǒu wǒ gāo.', en: 'She is not as tall as me.' },
    ],
    exercises: [
      {
        id: 'bi-e1',
        type: 'multiple-choice',
        question: 'How do you say "Chinese is harder than English"?',
        options: [
          '汉语比英语难。',
          '汉语英语比难。',
          '比汉语英语难。',
          '汉语难比英语。',
        ],
        answer: '汉语比英语难。',
        explanation: 'Structure: A(汉语) + 比 + B(英语) + Adjective(难).',
      },
      {
        id: 'bi-e2',
        type: 'fill-blank',
        question: '他 ___ 我大三岁。(He is 3 years older than me.)',
        answer: '比',
        hint: 'Comparison word',
        explanation: 'A + 比 + B + Adjective + amount.',
      },
      {
        id: 'bi-e3',
        type: 'arrange',
        question: 'Arrange: this restaurant / that one / cheaper / is than',
        words: ['这', '家', '餐厅', '比', '那', '家', '便宜', '。'],
        answer: '这家餐厅比那家便宜。',
        explanation: 'A(这家餐厅) + 比 + B(那家) + Adj(便宜).',
      },
    ],
  },
  {
    id: 'hsk2-zhengzai',
    hsk: 2,
    pattern: '正在 (zhèngzài)',
    title: 'Progressive — 正在 + Verb (+ 呢)',
    summary: '正在 indicates an action happening right now, similar to English "-ing". 呢 can be added at the end for emphasis.',
    explanation: `Structure: Subject + 正在 + Verb (+ Object) (+ 呢)
• 我正在学习。(I am studying right now.)
• 他们正在吃饭呢。(They are eating right now.)
• 她正在看书。(She is reading.)

Note: 在 alone can also mark ongoing actions:
• 我在学习。(I am studying.)`,
    examples: [
      { zh: '我正在看电视。', pinyin: 'Wǒ zhèngzài kàn diànshì.', en: 'I am watching TV.' },
      { zh: '他正在打电话呢。', pinyin: 'Tā zhèngzài dǎ diànhuà ne.', en: 'He is on the phone right now.' },
      { zh: '孩子们正在玩儿。', pinyin: 'Háizimen zhèngzài wánr.', en: 'The children are playing.' },
    ],
    exercises: [
      {
        id: 'zhengzai-e1',
        type: 'fill-blank',
        question: '她 ___ 做作业。(She is doing homework right now.)',
        answer: '正在',
        hint: 'Progressive marker meaning "right now"',
        explanation: '正在 placed before the verb shows an action in progress.',
      },
      {
        id: 'zhengzai-e2',
        type: 'multiple-choice',
        question: 'Where does 正在 go?',
        options: ['Before the subject', 'Before the verb', 'After the verb', 'At the end'],
        answer: 'Before the verb',
        explanation: 'Subject + 正在 + Verb — 正在 always precedes the verb.',
      },
      {
        id: 'zhengzai-e3',
        type: 'arrange',
        question: 'Arrange: sleeping / the baby / is right now',
        words: ['宝宝', '正在', '睡觉', '呢', '。'],
        answer: '宝宝正在睡觉呢。',
        explanation: 'Subject + 正在 + Verb + 呢.',
      },
    ],
  },

  // ─── HSK 3 ───────────────────────────────────────────────
  {
    id: 'hsk3-suiran',
    hsk: 3,
    pattern: '虽然…但是 (suīrán…dànshì)',
    title: '"Although…but" — Concession',
    summary: 'This paired conjunction expresses a concession. Note: Chinese uses BOTH parts (unlike English where "but" alone can suffice).',
    explanation: `Structure: 虽然 + Clause 1, 但是/可是 + Clause 2
• 虽然很贵，但是质量很好。(Although it's expensive, the quality is good.)
• 虽然他很忙，但是他还是来了。(Although he was busy, he still came.)

Both clauses can share the same subject, or have different subjects.
可是 (kěshì) can replace 但是 for a slightly softer tone.`,
    examples: [
      { zh: '虽然下雨，但是我还是去了。', pinyin: 'Suīrán xià yǔ, dànshì wǒ háishì qù le.', en: 'Although it rained, I still went.' },
      { zh: '虽然他不喜欢，但是他吃了。', pinyin: 'Suīrán tā bù xǐhuān, dànshì tā chī le.', en: 'Although he didn\'t like it, he ate it.' },
      { zh: '虽然路很远，但是风景很美。', pinyin: 'Suīrán lù hěn yuǎn, dànshì fēngjǐng hěn měi.', en: 'Although the road is long, the scenery is beautiful.' },
    ],
    exercises: [
      {
        id: 'suiran-e1',
        type: 'fill-blank',
        question: '___ 他很累，但是他继续工作。(Although he was tired, he kept working.)',
        answer: '虽然',
        hint: '"Although" — first half of the pair',
        explanation: '虽然 starts the concessive clause, 但是 introduces the main point.',
      },
      {
        id: 'suiran-e2',
        type: 'multiple-choice',
        question: 'Complete: 虽然天气很冷，___ 他还是去游泳了。',
        options: ['所以', '因为', '但是', '如果'],
        answer: '但是',
        explanation: '虽然…但是 is a fixed pair — "although…but".',
      },
      {
        id: 'suiran-e3',
        type: 'arrange',
        question: 'Arrange: she / although / she still passed / studied little',
        words: ['虽然', '她', '学习', '少', '，', '但是', '她', '还是', '通过', '了', '。'],
        answer: '虽然她学习少，但是她还是通过了。',
        explanation: 'Concessive clause first, then the unexpected result.',
      },
      {
        id: 'suiran-e4',
        type: 'multiple-choice',
        question: 'Which is grammatically correct?',
        options: [
          '但是天气很冷虽然他出去了。',
          '虽然天气很冷，但是他出去了。',
          '他出去了虽然，但是天气很冷。',
          '天气虽然很冷但是，他出去了。',
        ],
        answer: '虽然天气很冷，但是他出去了。',
        explanation: '虽然 clause must come first, then 但是 clause.',
      },
    ],
  },
  {
    id: 'hsk3-yinwei',
    hsk: 3,
    pattern: '因为…所以 (yīnwèi…suǒyǐ)',
    title: '"Because…therefore" — Cause & Effect',
    summary: 'This pair expresses cause and effect. Both conjunctions are usually stated, making the logic explicit.',
    explanation: `Structure: 因为 + Reason, 所以 + Result
• 因为下雨，所以我没有出去。(Because it rained, I didn't go out.)
• 因为他努力，所以他成功了。(Because he worked hard, he succeeded.)

You can use either part alone in casual speech:
• 因为下雨。/ 所以我没出去。`,
    examples: [
      { zh: '因为我肚子饿，所以我吃了很多。', pinyin: 'Yīnwèi wǒ dùzi è, suǒyǐ wǒ chī le hěn duō.', en: 'Because I was hungry, I ate a lot.' },
      { zh: '因为她生病了，所以她没来。', pinyin: 'Yīnwèi tā shēngbìng le, suǒyǐ tā méi lái.', en: 'Because she was sick, she didn\'t come.' },
      { zh: '因为这本书很有趣，所以我看了两遍。', pinyin: 'Yīnwèi zhè běn shū hěn yǒuqù, suǒyǐ wǒ kàn le liǎng biàn.', en: 'Because this book is interesting, I read it twice.' },
    ],
    exercises: [
      {
        id: 'yinwei-e1',
        type: 'multiple-choice',
        question: 'Choose the correct completion: 因为天气很好，___我们去公园了。',
        options: ['虽然', '但是', '所以', '如果'],
        answer: '所以',
        explanation: '因为…所以 = because…therefore. 所以 introduces the result.',
      },
      {
        id: 'yinwei-e2',
        type: 'fill-blank',
        question: '___ 他学习很认真，所以考试得了满分。(Because he studied seriously, he got full marks.)',
        answer: '因为',
        hint: '"Because" — introduces the reason',
        explanation: '因为 introduces the reason/cause.',
      },
      {
        id: 'yinwei-e3',
        type: 'arrange',
        question: 'Arrange: he was late / because / so / he missed the train',
        words: ['因为', '他', '迟到', '了', '，', '所以', '他', '没', '赶上', '火车', '。'],
        answer: '因为他迟到了，所以他没赶上火车。',
        explanation: 'Cause first (因为), then effect (所以).',
      },
    ],
  },
  {
    id: 'hsk3-ruguo',
    hsk: 3,
    pattern: '如果…就 (rúguǒ…jiù)',
    title: '"If…then" — Conditionals',
    summary: '如果 introduces a condition, and 就 introduces the result. 就 stays close to the verb in the result clause.',
    explanation: `Structure: 如果 + Condition, (Subject) + 就 + Result
• 如果你来，我就很高兴。(If you come, I will be happy.)
• 如果明天不下雨，我们就去爬山。(If it doesn't rain tomorrow, we'll go hiking.)

Note: 就 cannot start a sentence — it needs something before it (subject or adverb).`,
    examples: [
      { zh: '如果你有问题，就告诉我。', pinyin: 'Rúguǒ nǐ yǒu wèntí, jiù gàosù wǒ.', en: 'If you have a question, just tell me.' },
      { zh: '如果他不来，我们就自己去。', pinyin: 'Rúguǒ tā bù lái, wǒmen jiù zìjǐ qù.', en: 'If he doesn\'t come, we\'ll go ourselves.' },
      { zh: '如果你努力，就会成功。', pinyin: 'Rúguǒ nǐ nǔlì, jiù huì chénggōng.', en: 'If you work hard, you will succeed.' },
    ],
    exercises: [
      {
        id: 'ruguo-e1',
        type: 'fill-blank',
        question: '如果你努力，___ 会成功。(If you work hard, you will succeed.)',
        answer: '就',
        hint: '"Then" — result marker in the second clause',
        explanation: '就 introduces the result/consequence clause.',
      },
      {
        id: 'ruguo-e2',
        type: 'multiple-choice',
        question: 'Where does 就 go in the result clause?',
        options: ['At the very end', 'Before the verb/adjective', 'After the object', 'At the beginning of the sentence'],
        answer: 'Before the verb/adjective',
        explanation: '就 comes before the verb or predicate in the result clause.',
      },
      {
        id: 'ruguo-e3',
        type: 'arrange',
        question: 'Arrange: if / it rains / we / won\'t go',
        words: ['如果', '下雨', '，', '我们', '就', '不', '去', '了', '。'],
        answer: '如果下雨，我们就不去了。',
        explanation: 'Condition (如果) + Result (就).',
      },
      {
        id: 'ruguo-e4',
        type: 'multiple-choice',
        question: 'Which is a correct conditional sentence?',
        options: [
          '就你来，如果我高兴。',
          '如果你来，我就高兴。',
          '你如果来，高兴就我。',
          '我高兴如果，你就来。',
        ],
        answer: '如果你来，我就高兴。',
        explanation: '如果 clause first → 就 + result.',
      },
    ],
  },
]

export const HSK_LEVELS_GRAMMAR = [1, 2, 3]

export function getGrammarByHsk(hsk) {
  return hsk === 'all'
    ? GRAMMAR_POINTS
    : GRAMMAR_POINTS.filter(g => g.hsk === Number(hsk))
}
