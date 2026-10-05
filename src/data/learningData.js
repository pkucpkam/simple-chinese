export const LEARNING_LEVELS = [
  {
    id: 'hsk1-foundation',
    code: 'HSK 1',
    title: 'Nền tảng giao tiếp',
    description: 'Xây phát âm chuẩn, nhận diện chữ Hán và hình thành vốn câu cơ bản.',
    weeks: 12,
    stages: [
      {
        id: 'stage-1',
        phase: 1,
        weeks: 'Tuần 1-2',
        title: 'Phát âm & Pinyin',
        description: 'Nắm thanh mẫu, vận mẫu, bốn thanh điệu, thanh nhẹ và luyện nghe nhại.',
        color: '#1ed760',
        skills: ['initials', 'finals', 'tones', 'tone-sandhi'],
        goals: [
          'Đọc được bảng thanh mẫu và vận mẫu',
          'Phân biệt và bắt chước được 4 thanh điệu',
          'Áp dụng biến điệu của 不, 一 và thanh 3',
        ],
        actions: [
          { id: 'pinyin-chart', label: 'Học bảng Pinyin', detail: 'Thanh mẫu, vận mẫu và thanh điệu', to: '/pinyin', icon: 'languages', minutes: 15 },
          { id: 'tone-rules', label: 'Ôn quy tắc biến điệu', detail: 'Không, một và thanh 3 liên tiếp', to: '/pinyin', icon: 'sparkles', minutes: 10 },
          { id: 'tone-listening', label: 'Nghe và nhại lại', detail: 'Luyện âm mẫu bằng TTS', to: '/listen', icon: 'volume', minutes: 10 },
        ],
      },
      {
        id: 'stage-2',
        phase: 2,
        weeks: 'Tuần 3-4',
        title: 'Chữ Hán & giao tiếp đầu tiên',
        description: 'Làm quen nét, thứ tự nét, bộ thủ và những câu giới thiệu đầu tiên.',
        color: '#539df5',
        skills: ['strokes', 'radicals', 'numbers', 'greetings'],
        goals: [
          'Nhận diện 15-20 bộ thủ thông dụng',
          'Viết được chữ cơ bản theo đúng thứ tự nét',
          'Đếm 1-100 và giới thiệu bản thân',
        ],
        actions: [
          { id: 'character-writing', label: 'Luyện thứ tự nét', detail: 'Viết và xem lại từng chữ', to: '/write', icon: 'pen', minutes: 15 },
          { id: 'first-words', label: 'Tạo bộ từ đầu tiên', detail: 'Đại từ, số đếm, chào hỏi', to: '/vocab', icon: 'book', minutes: 15 },
          { id: 'first-listening', label: 'Nghe câu giao tiếp', detail: 'Nghe và chọn nghĩa', to: '/listen', icon: 'volume', minutes: 10 },
        ],
      },
      {
        id: 'stage-3',
        phase: 3,
        weeks: 'Tuần 5-8',
        title: 'Từ vựng & ngữ pháp nền',
        description: 'Học theo chủ đề, luyện câu mẫu và ôn từ bằng lặp lại ngắt quãng.',
        color: '#ffa42b',
        skills: ['vocabulary', 'grammar', 'spaced-review'],
        goals: [
          'Tích lũy 25-40 từ mới mỗi tuần',
          'Nắm 是, 有, 在, 不/没, 吗, 的, 了 và lượng từ 个',
          'Ôn lại từ cũ trước khi học nội dung mới',
        ],
        actions: [
          { id: 'topic-vocabulary', label: 'Học từ theo chủ đề', detail: 'Gia đình, thời gian, ăn uống, nơi chốn', to: '/vocab', icon: 'book', minutes: 15 },
          { id: 'grammar-basics', label: 'Luyện ngữ pháp nền', detail: 'Câu hỏi, phủ định và trợ từ', to: '/grammar', icon: 'graduation', minutes: 15 },
          { id: 'spaced-review', label: 'Ôn từ đến hạn', detail: 'Củng cố bằng flashcard', to: '/vocab', icon: 'refresh', minutes: 10 },
        ],
      },
      {
        id: 'stage-4',
        phase: 4,
        weeks: 'Tuần 9-12',
        title: 'Luyện đề & nghe hiểu',
        description: 'Làm quen định dạng HSK 1, nghe hội thoại ngắn và thi thử có bấm giờ.',
        color: '#f3727f',
        skills: ['mock-exam', 'listening', 'timed-practice'],
        goals: [
          'Hoàn thành đề mẫu nghe và đọc HSK 1',
          'Đọc to lại hội thoại ngắn mỗi ngày',
          'Ghi lại và ôn các từ thường trả lời sai',
        ],
        actions: [
          { id: 'mock-exam', label: 'Làm đề thử HSK 1', detail: 'Nghe, đọc và làm bài có giờ', to: '/exam', icon: 'clipboard', minutes: 25 },
          { id: 'daily-listening', label: 'Nghe hội thoại ngắn', detail: 'Nghe, chọn đáp án và đọc lại', to: '/listen', icon: 'volume', minutes: 15 },
          { id: 'mistake-review', label: 'Ôn lỗi sai', detail: 'Bổ sung từ cần học lại', to: '/progress', icon: 'chart', minutes: 10 },
        ],
      },
    ],
  },
]

export const STUDY_RHYTHM = [
  { id: 'review', label: 'Ôn từ cũ', detail: 'Flashcard đến hạn', minutes: 10, icon: 'refresh', to: '/vocab' },
  { id: 'new-content', label: 'Học nội dung mới', detail: 'Theo mục tiêu tuần hiện tại', minutes: 15, icon: 'book', to: '/grammar' },
  { id: 'listen-speak', label: 'Nghe & nói', detail: 'Nghe rồi nhại lại thành tiếng', minutes: 10, icon: 'volume', to: '/listen' },
]
