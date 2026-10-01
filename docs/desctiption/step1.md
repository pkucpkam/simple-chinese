# Đặc tả phát triển: Web tự học tiếng Trung — Giai đoạn HSK 1

> Tài liệu này mô tả **cái cần xây** (nội dung, tính năng, dữ liệu, màn hình, tiêu chí nghiệm thu) cho giai đoạn HSK 1. Thiết kế theo hướng **data-driven** để sau này thêm HSK 2, HSK 3... chỉ cần thêm nội dung, không sửa code.
> Stack giả định: React (frontend) + Firebase (Auth, Firestore, Storage/Hosting, Cloud Functions tùy chọn). Module Flashcard đã có sẽ được **tái sử dụng**, tài liệu này chỉ đặc tả phần tích hợp.

---

## 0. Tóm tắt phạm vi

| Hạng mục | MVP (HSK 1) | Để sau |
|---|---|---|
| Lộ trình học (unit/lesson) | ✅ | Placement test |
| Phòng luyện Pinyin & thanh điệu | ✅ | Chấm phát âm bằng AI |
| Từ vựng + Flashcard SRS | ✅ (tái dùng) | FSRS |
| Tự thêm/nhập từ vựng của người dùng | ✅ | Chia sẻ bộ từ |
| Luyện nghe | ✅ | Dictation nâng cao |
| Ngữ pháp + bài tập | ✅ | — |
| Luyện viết (thứ tự nét) | ✅ (tùy chọn, không bắt buộc cho HSK 1) | Chấm nét nâng cao |
| Đọc hiểu (hover pinyin/nghĩa) | ✅ | — |
| Thi thử HSK 1 | ✅ | Thi thử HSK 2+ |
| Dashboard tiến độ | ✅ | Gợi ý học thích ứng |
| Luyện nói | ❌ | v2 |

**Nguyên tắc thiết kế**

1. **Nội dung tách khỏi code.** Nội dung chuẩn (HSK) là file JSON tĩnh, chỉ đọc, có version. Dữ liệu người dùng (tiến độ, thẻ SRS, từ tự thêm) nằm trong Firestore.
2. **Hai lớp từ vựng dùng chung một "hình dạng".** Từ hệ thống và từ người dùng tự thêm có cùng schema, nên Flashcard, bài tập, dashboard xử lý đồng nhất.
3. **Không hardcode con số của HSK.** Số từ, danh sách từ, cấu trúc đề thi đều đọc từ cấu hình theo phiên bản chuẩn (xem mục 1).
4. **Offline-first** khi có thể (PWA + Firestore offline cache).
5. **Mobile-first.** Phần lớn người học dùng điện thoại.
6. **Giải thích bằng tiếng Việt**, có cột **âm Hán-Việt** để người Việt nhớ từ nhanh hơn.

---

## 1. Chuẩn HSK và cấu hình phiên bản

Hiện có hai chuẩn cùng tồn tại trong năm 2026:

- **HSK 2.0:** HSK 1 có 150 từ, thi 6 cấp.
- **HSK 3.0:** HSK 1 khoảng 300 từ, 9 cấp. Một số nguồn cho biết danh sách từ HSK 1 đã được chỉnh lại trong bản cập nhật 2026 (một số từ chuyển lên HSK 2/3 hoặc bị loại), nên **số liệu giữa các nguồn không khớp**.

→ **Việc cần làm trước khi import dữ liệu:** lấy danh sách từ chính thức của đúng bản mà bạn nhắm tới (từ trang của Trung tâm Giáo dục Ngôn ngữ và Hợp tác — CLEC/Hanban, hoặc trung tâm thi bạn dùng) và đối chiếu.

### 1.1 Cấu hình syllabus

```ts
type SyllabusId = "hsk2.0" | "hsk3.0";

interface SyllabusConfig {
  id: SyllabusId;
  label: string;                  // "HSK 2.0", "HSK 3.0 (2026)"
  levels: number[];               // [1..6] hoặc [1..9]
  wordlistVersion: string;        // "2026-07", để biết đang dùng danh sách nào
  exam: Record<number, ExamConfig>; // theo level
}

interface ExamConfig {
  sections: {
    kind: "listening" | "reading" | "writing";
    questionCount: number;
    durationMin: number;
    listenPlays?: number;         // số lần phát audio mỗi câu
  }[];
  passScore?: number;
  maxScore?: number;
}
```

Gợi ý giá trị khởi tạo cho HSK 1 (**cần đối chiếu đề mẫu chính thức**):

- 20 câu nghe + 20 câu đọc; theo một bảng tham khảo của bản 3.0: nghe ≈ 12 phút, đọc 20 phút.
- HSK 2.0: thang 200, đạt 120; mỗi câu nghe phát 2 lần.

### 1.2 Một từ có thể thuộc level khác nhau theo từng chuẩn

Vì danh sách bị chỉnh, **đừng lưu một trường `level` duy nhất**. Lưu map:

```ts
levels: { "hsk2.0": 1, "hsk3.0": 2 }   // null nếu không nằm trong danh sách
```

Giao diện cho người dùng chọn chuẩn đang theo (Settings), mọi bộ lọc "HSK 1" đọc theo chuẩn đó.

---

## 2. Cấu trúc nội dung HSK 1

### 2.1 Bố cục

```
HSK 1
├─ Module 0: Nhập môn Pinyin (tuần 1–2)
├─ Module 1: Chữ Hán cơ bản (tuần 3–4)
├─ Unit 1 … Unit 10: Học theo chủ đề (tuần 3–10)
└─ Unit 11: Ôn tập + Thi thử (tuần 11–12)
```

Mỗi Unit gồm các Lesson theo thứ tự cố định:

1. **Từ vựng mới** (5–12 từ/lesson)
2. **Hội thoại** (nghe + đọc)
3. **Ngữ pháp** (1–2 điểm)
4. **Luyện tập** (8–12 bài mixed: từ, nghe, ngữ pháp)
5. **Ôn lỗi sai** (tự sinh từ lỗi vừa mắc)
6. **Tổng kết** (điểm, từ cần ôn, mở khóa lesson sau)

### 2.2 Module 0 — Pinyin

| Lesson | Nội dung |
|---|---|
| 0.1 | Tổng quan: chữ giản thể vs phồn thể, pinyin là gì, 4 thanh + thanh nhẹ |
| 0.2 | Thanh mẫu: b p m f / d t n l / g k h / j q x / zh ch sh r / z c s |
| 0.3 | Vận mẫu: a o e i u ü; ai ei ao ou; an en ang eng ong; ia ie iao iu... |
| 0.4 | Luyện 4 thanh + thanh nhẹ với âm tiết đơn |
| 0.5 | Quy tắc biến điệu và quy tắc viết pinyin (y/w, j-q-x + ü, đặt dấu thanh) |
| 0.6 | Cặp âm dễ nhầm với người Việt: zh/z, ch/c, sh/s, j/q/x, r, ü, thanh 2 vs thanh 3 |

### 2.3 Module 1 — Chữ Hán cơ bản

- 8 nét cơ bản (横 竖 撇 点 捺 提 折 钩) và quy tắc thứ tự nét (trên trước dưới, trái trước phải, ngang trước dọc...).
- 15–20 bộ thủ thông dụng (人 口 女 水 火 木 心 日 月 氵 亻 讠...) kèm nghĩa và ví dụ.
- Nhận mặt chữ đơn giản: 一二三 人 大 小 口 日 月 山 水 火 木 女 子...

### 2.4 Các Unit theo chủ đề

> Cột "Từ gợi ý" chỉ để minh họa cách nhóm, rút từ danh sách HSK 2.0. **Việc gán từ vào unit phải làm bằng script trên danh sách chính thức** (xem 2.5).

| Unit | Chủ đề | Từ gợi ý | Ngữ pháp |
|---|---|---|---|
| 1 | Chào hỏi | 你好 谢谢 再见 对不起 没关系 请 不客气 | Câu chào dạng "[người] + 好" |
| 2 | Giới thiệu bản thân | 我 你 他 她 叫 什么 名字 是 人 中国 认识 汉语 学生 老师 | 是 (câu phán đoán), 吗 (hỏi có/không), 什么, 呢 |
| 3 | Số đếm, tuổi, ngày tháng | 一…十 几 多少 岁 年 月 号 星期 | Số đếm, 几 vs 多少, cách nói ngày tháng, lượng từ 个 |
| 4 | Gia đình & bạn bè | 爸爸 妈妈 儿子 女儿 朋友 同学 | 有 / 没有, 的 (sở hữu) |
| 5 | Thời gian | 现在 点 分钟 今天 明天 昨天 上午 中午 下午 | Trạng ngữ thời gian đứng trước vị ngữ |
| 6 | Tiền & mua sắm | 钱 块 买 苹果 水果 商店 衣服 | 多少钱, 太…了, 很 |
| 7 | Ăn uống | 吃 喝 菜 茶 米饭 杯子 饭店 喜欢 想 | 想 / 喜欢 + động từ, 不 vs 没 |
| 8 | Nơi chốn & phương hướng | 在 里 前面 后面 上 下 这 那 哪儿 去 来 回 家 学校 医院 | 在 + nơi chốn, 这/那 + 是, 哪儿 |
| 9 | Hoạt động hằng ngày | 看 听 说 读 写 做 工作 学习 睡觉 打电话 电影 电视 电脑 | Động từ + tân ngữ, 了 (hoàn thành, cơ bản), 会 / 能 |
| 10 | Thời tiết & cảm giác | 天气 冷 热 下雨 怎么样 高兴 漂亮 | Tính từ làm vị ngữ với 很, 怎么样 |
| 11 | Ôn tập + Thi thử | — | — |

### 2.5 Script gán từ vào Unit (bắt buộc làm)

- Input: danh sách chính thức của chuẩn đang theo + file `unit-map.json` (từ → unitId).
- Kiểm tra tự động trong CI:
  - 100% từ của HSK 1 phải thuộc đúng 1 unit (không sót, không trùng).
  - Mỗi unit có ≥ 1 hội thoại, ≥ 1 điểm ngữ pháp, ≥ 8 bài tập.
  - Mỗi từ có đủ: pinyin, nghĩa tiếng Việt, ≥ 1 câu ví dụ, audio.
- Từ ngoài danh sách chính thức (xuất hiện trong ví dụ cho tự nhiên) gắn tag `extra`, không tính vào độ phủ HSK 1.

---

## 3. Mô hình dữ liệu

### 3.1 Nội dung tĩnh (JSON trong repo, build ra `public/content/hsk1/`)

Không đưa nội dung chuẩn vào Firestore: tốn lượt đọc, không cần ghi. Tải theo unit (lazy), cache bằng service worker.

```ts
interface Word {
  id: string;                    // ổn định, KHÔNG tái sử dụng. vd "w_000123"
  hanzi: string;                 // "学习"
  pinyin: string;                // pinyin số: "xue2 xi2"  (xem mục 6)
  hanViet?: string;              // "học tập"
  pos: string[];                 // ["v"], ["n","v"]
  meaningVi: string[];           // ["học", "học tập"]
  measureWord?: string[];        // lượng từ đi kèm (nếu là danh từ)
  levels: Record<string, number | null>;  // xem 1.2
  unitId?: string;
  exampleIds: string[];          // → Sentence.id
  audio?: string;                // đường dẫn file audio của từ
  mnemonic?: string;             // mẹo nhớ
  notes?: string;                // lưu ý dùng/nhầm lẫn
  tags: string[];                // "extra", "polyphone", ...
  source: "system";
}
```

> **Đồng âm khác nghĩa / đa âm** (好 hǎo/hào, 了 le/liǎo): mỗi cách đọc là **một `Word` riêng** với `id` riêng. Ràng buộc unique: `(hanzi, pinyin)`.

```ts
interface Character {
  hanzi: string;                 // 1 chữ
  pinyin: string[];              // các cách đọc
  hanViet?: string;
  radical?: string;
  strokeCount?: number;
  meaningVi?: string;
}

interface Sentence {
  id: string;
  hanzi: string;
  pinyin: string;                // pinyin số, tách theo âm tiết
  vi: string;
  tokens: { hanzi: string; pinyin: string; wordId?: string }[]; // phục vụ hover + ruby
  audio?: string;
  unitId?: string;
}

interface Dialogue {
  id: string;
  unitId: string;
  title: string;
  lines: { speaker: "A" | "B" | string; sentenceId: string }[];
  audio?: string;                // audio cả đoạn (nếu có)
}

interface GrammarPoint {
  id: string;
  unitId: string;
  title: string;                 // "Câu phán đoán với 是"
  pattern: string;               // "S + 是 + N"
  explanationMd: string;         // giải thích tiếng Việt, markdown
  exampleSentenceIds: string[];
  commonMistakes: { wrong: string; right: string; noteVi: string }[];
  exerciseIds: string[];
}

interface Unit {
  id: string;                    // "u01"
  order: number;
  titleVi: string;
  goalsVi: string[];             // "Sau bài này bạn có thể…"
  lessonIds: string[];
}
```

### 3.2 Bài tập — kiểu dữ liệu

Dùng discriminated union để engine render theo `type`.

```ts
type Skill = "vocab" | "pinyin" | "listening" | "reading" | "grammar" | "writing";

interface ExerciseBase {
  id: string;
  skill: Skill;
  unitId?: string;
  wordIds?: string[];            // để cập nhật SRS khi sai/đúng
  explanationVi?: string;        // hiện sau khi trả lời
}

type Exercise = ExerciseBase & (
  | { type: "mcq_meaning";   prompt: string; options: string[]; answer: number }   // chữ → nghĩa
  | { type: "mcq_hanzi";     promptVi: string; options: string[]; answer: number } // nghĩa → chữ
  | { type: "listen_choose"; audio: string; options: string[]; answer: number }    // nghe → chọn
  | { type: "listen_tf";     audio: string; imageUrl?: string; answer: boolean }   // nghe → đúng/sai
  | { type: "tone_choose";   audio: string; options: string[]; answer: number }    // nghe → thanh điệu
  | { type: "type_pinyin";   hanzi: string; answers: string[] }                    // gõ pinyin
  | { type: "match_pairs";   pairs: { left: string; right: string }[] }
  | { type: "order_words";   tokens: string[]; answer: string[] }                  // sắp xếp câu
  | { type: "fill_blank";    sentence: string; options: string[]; answer: number } // điền từ
  | { type: "translate_pick";promptVi: string; options: string[]; answer: number }
  | { type: "write_char";    hanzi: string }                                       // vẽ theo nét
);
```

### 3.3 Dữ liệu người dùng (Firestore)

```
users/{uid}                                  # hồ sơ, syllabus đang theo
users/{uid}/settings/main
users/{uid}/customWords/{wordId}             # từ tự thêm — CÙNG schema Word, source: "user"
users/{uid}/cards/{cardId}                   # trạng thái SRS
users/{uid}/reviews/{reviewId}               # log ôn tập (chỉ thêm)
users/{uid}/lessonProgress/{lessonId}
users/{uid}/attempts/{attemptId}             # bài tập + thi thử
users/{uid}/stats/daily_{yyyymmdd}           # tổng hợp theo ngày cho dashboard
```

```ts
type WordRef = { source: "system" | "user"; id: string };
type CardKind = "recognition" | "recall" | "listening";
// recognition: chữ → nghĩa | recall: nghĩa → gõ pinyin | listening: nghe → nghĩa/chữ

interface SrsCard {
  id: string;                    // `${source}_${wordId}_${kind}`
  wordRef: WordRef;
  kind: CardKind;
  state: "new" | "learning" | "review" | "relearning";
  due: Timestamp;
  intervalDays: number;
  ease: number;                  // SM-2
  reps: number;
  lapses: number;
  lastReviewAt?: Timestamp;
  suspended?: boolean;
}

interface ReviewLog {
  cardId: string;
  at: Timestamp;
  rating: 1 | 2 | 3 | 4;         // Again/Hard/Good/Easy
  prevInterval: number;
  newInterval: number;
  timeMs: number;
}

interface DailyStats {
  date: string;                  // "2026-10-01"
  newCards: number;
  reviews: number;
  correct: number;
  studyMs: number;
  bySkill: Record<Skill, { attempts: number; correct: number }>;
}
```

**Ghi chú Firestore**

- Mỗi lần ôn thẻ: dùng `writeBatch` ghi 3 chỗ (cập nhật `cards`, thêm `reviews`, `increment` vào `stats/daily_*`). Dashboard chỉ đọc vài chục doc `stats`, không quét `reviews`.
- Bật offline cache: `initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })`.
- Security rules tối thiểu:

```
match /users/{uid}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```

---

## 4. Đặc tả từng tính năng

### 4.1 Lộ trình học (Learning Path)

- Hiển thị dạng **bản đồ**: Module 0 → Module 1 → Unit 1…11. Mỗi node có trạng thái: 🔒 khóa / ▶ đang học / ✅ hoàn thành, kèm % tiến độ.
- Điều kiện hoàn thành lesson: đúng ≥ 80% bài luyện tập (cấu hình được). Hoàn thành lesson → mở lesson kế.
- Cho phép "mở khóa tự do" trong Settings (người đã biết một phần).
- Nút **"Học tiếp"** trên Home đưa thẳng tới lesson đang dở.

**Nghiệm thu**
- [ ] Thoát giữa chừng lesson rồi vào lại thì tiếp tục đúng chỗ.
- [ ] Làm sai bài nào thì bài đó vào "Sổ lỗi sai" và xuất hiện ở bước "Ôn lỗi sai".

### 4.2 Phòng luyện Pinyin (Pinyin Lab)

**Bảng pinyin tương tác**
- Lưới thanh mẫu × vận mẫu; bấm ô nào phát audio âm tiết đó (ô không tồn tại thì làm mờ).
- Bộ lọc theo nhóm (môi, đầu lưỡi, cuốn lưỡi...).

**Bài luyện thanh điệu**
- *Nghe chọn thanh:* phát âm tiết, chọn 1/2/3/4/nhẹ.
- *Cặp tối thiểu:* nghe và chọn đúng trong cặp dễ nhầm (mā/má/mǎ/mà; shī/sī; qù/xù...).
- *Nhìn đồ thị thanh điệu:* vẽ đường cao độ của 4 thanh để minh họa.
- *Gõ pinyin:* nghe → gõ (chấp nhận số hoặc dấu, xem 6.3).

**Biến điệu**
- Bài giải thích riêng cho 3+3 → 2+3, 不 và 一.

**Nghiệm thu**
- [ ] Mỗi âm tiết có audio chuẩn.
- [ ] Tab thống kê hiện tỉ lệ đúng riêng cho từng thanh (để biết bạn yếu thanh nào).

### 4.3 Từ vựng và Flashcard (tái sử dụng module hiện có)

Module Flashcard hiện tại giữ nguyên, **bổ sung các điểm tích hợp** sau:

1. **Nguồn thẻ thống nhất:** thẻ trỏ tới `WordRef` (system/user), không sao chép nội dung từ vào thẻ.
2. **Ba loại thẻ cho mỗi từ** (`recognition`, `recall`, `listening`), mở dần: ngày đầu chỉ tạo `recognition`; khi thẻ đó đạt interval ≥ 3 ngày thì tạo thêm hai loại còn lại.
3. **Giới hạn mỗi ngày** (mặc định 8 thẻ mới, tối đa ôn 100), chỉnh được trong Settings.
4. **Ghi log ôn tập** đúng schema `ReviewLog` ở mục 3.3 để dashboard dùng được.
5. **Từ "đã thuộc"** (mặc định): cả `recognition` và `listening` có interval ≥ 21 ngày. Ngưỡng nằm trong cấu hình.
6. **Leech:** thẻ sai ≥ 8 lần (lapses) bị gắn cờ, hiện gợi ý "xem mẹo nhớ / luyện viết chữ này".
7. **Thuật toán:** giữ SM-2 hiện có. Nếu muốn nâng cấp sau này có thể thay bằng FSRS mà không đổi schema (chỉ thêm trường).

**Màn hình thẻ** hiển thị: chữ Hán lớn, pinyin (theo cài đặt), nút phát audio, nghĩa tiếng Việt, âm Hán-Việt, câu ví dụ có ruby, mẹo nhớ; 4 nút đánh giá kèm khoảng thời gian dự kiến ("<10 phút / 1 ngày / 3 ngày / 7 ngày").

### 4.4 Tự thêm / nhập từ vựng (quan trọng)

Mục tiêu: người học thêm từ dần dần khi gặp, không phụ thuộc bộ dữ liệu cố định.

**Cách thêm**
1. **Thêm nhanh một từ:** gõ chữ Hán → app tự điền pinyin, nghĩa gợi ý, âm Hán-Việt → người dùng sửa → lưu.
2. **Dán danh sách:** mỗi dòng một từ. Chấp nhận các dạng: `汉字`, `汉字 | pinyin`, `汉字 | pinyin | nghĩa`.
3. **Nhập file CSV/TSV** (bao gồm file xuất từ Anki).
4. **Thêm từ từ lúc đọc/nghe:** bấm vào một từ trong bài đọc → "Thêm vào bộ từ của tôi".

**Tự điền dữ liệu**

| Trường | Cách điền |
|---|---|
| Pinyin | Thư viện `pinyin-pro` (hỗ trợ chọn cách đọc theo ngữ cảnh cho chữ đa âm) |
| Nghĩa gợi ý | Tra từ điển CC-CEDICT (bản offline đã xử lý), nghĩa tiếng Anh làm gợi ý, người dùng nhập nghĩa tiếng Việt |
| Âm Hán-Việt | Dữ liệu Unihan (trường `kVietnamese`) theo từng chữ |
| Level HSK | Tra chỉ mục từ chuẩn đang theo; không có thì để trống |

> Kiểm tra giấy phép từng nguồn trước khi dùng. CC-CEDICT là CC BY-SA (cần ghi nguồn, dữ liệu dẫn xuất cùng giấy phép).

**Luồng nhập hàng loạt**
1. Phân tích → bảng **xem trước** (mỗi dòng sửa được, có cột trạng thái: ✅ ổn / ⚠ thiếu nghĩa / 🔁 trùng).
2. **Phát hiện trùng:** nếu chữ Hán đã có trong từ hệ thống → hỏi "Liên kết tới từ HSK có sẵn" thay vì tạo bản sao; nếu trùng với từ của chính người dùng → bỏ qua hoặc gộp.
3. Xác nhận → ghi vào `customWords`, tạo thẻ SRS, chia lô ghi ≤ 500 thao tác/batch.
4. Báo kết quả: thêm X, bỏ qua Y, lỗi Z (kèm danh sách lỗi tải về được).

**Kiểm tra dữ liệu:** chữ Hán phải chứa ký tự CJK (`\u4e00-\u9fff`); độ dài tối đa hợp lý; pinyin chuẩn hóa theo mục 6.

**Nghiệm thu**
- [ ] Nhập 300 dòng trong < 10 giây (không tính tra từ điển online, vì tra offline).
- [ ] Từ tự thêm xuất hiện trong Flashcard, bài tập luyện lại, dashboard như từ hệ thống.
- [ ] Xuất toàn bộ từ tự thêm ra CSV.

### 4.5 Luyện viết (tùy chọn ở HSK 1)

HSK 1 không yêu cầu viết tay (chữ luôn có pinyin kèm trong đề), nên đây là công cụ **giúp nhớ chữ**, không bắt buộc hoàn thành lesson.

- Dùng thư viện **Hanzi Writer** (MIT) cho 3 chế độ: *xem animation*, *vẽ theo nét có gợi ý*, *tự viết không gợi ý*.
- Báo nét sai ngay; sau N lần sai thì hiện gợi ý nét tiếp theo.
- Kết quả ghi vào `attempts` với `skill: "writing"`.
- Kiểm tra giấy phép dữ liệu nét (`hanzi-writer-data`) trước khi dùng thương mại.

### 4.6 Luyện nghe

**Trình phát:** nút phát/lặp, tốc độ 0.75× / 1× , thanh tiến trình, phím tắt (Space, ←).

**Dạng bài**
- Nghe → chọn từ / nghĩa / thanh điệu
- Nghe câu → đúng/sai với hình
- Nghe câu → chọn hình
- Nghe hội thoại → chọn đáp án
- Nghe chép (gõ pinyin hoặc chữ Hán)

**Hiển thị transcript** (tắt/bật): chữ Hán / pinyin / tiếng Việt; chỉ cho xem sau khi trả lời.

**Chế độ thi:** mỗi câu phát đúng số lần quy định (HSK 2.0: 2 lần), không cho tua.

### 4.7 Đọc hiểu

- Câu/đoạn ngắn có **hover (desktop) / chạm (mobile)** để hiện pinyin + nghĩa của từng từ (dựa vào `tokens`).
- Bật/tắt pinyin: luôn hiện / chỉ hiện khi chạm / ẩn.
- Bấm từ → popup: pinyin, nghĩa, Hán-Việt, nút nghe, nút **"Thêm vào bộ từ"** (xem 4.4).

### 4.8 Ngữ pháp

- Trang giải thích: công thức (`pattern`), giải thích tiếng Việt ngắn gọn, 3–5 ví dụ có audio, **lỗi hay gặp** (sai → đúng + lý do).
- Bài tập kèm theo dùng các type: `order_words`, `fill_blank`, `translate_pick`, `mcq_*`.
- Mỗi lỗi sai hiện giải thích (`explanationVi`) và liên kết ngược về trang ngữ pháp.

### 4.9 Thi thử HSK 1

**Cấu trúc tham khảo** (theo HSK 2.0, **đối chiếu đề mẫu chính thức của bản bạn nhắm tới** vì bản 3.0 có thể khác):

| Phần | Câu | Dạng |
|---|---|---|
| Nghe 1 | 5 | Nghe câu, đối chiếu với hình: đúng/sai |
| Nghe 2 | 5 | Nghe câu, chọn hình phù hợp |
| Nghe 3 | 5 | Nghe hội thoại ngắn, chọn hình |
| Nghe 4 | 5 | Nghe câu hỏi, chọn đáp án A/B/C |
| Đọc 1 | 5 | Đối chiếu từ/hình |
| Đọc 2 | 5 | Nối câu với hình |
| Đọc 3 | 5 | Nối câu hỏi với câu trả lời |
| Đọc 4 | 5 | Điền từ vào chỗ trống |

Cấu trúc này nằm trong **cấu hình** (`ExamConfig` + danh sách `type` hỗ trợ), không hardcode.

**Hành vi**
- Có đồng hồ đếm ngược theo từng phần; hết giờ tự nộp phần đó.
- Không hiện đáp án đúng trong lúc làm; hiện sau khi nộp.
- Màn kết quả: điểm tổng, điểm theo phần, danh sách câu sai kèm giải thích, nút "Thêm từ sai vào ôn tập".
- Lưu lịch sử các lần thi để vẽ biểu đồ tiến bộ.
- Ngân hàng đề: tối thiểu 3 đề hoàn chỉnh trước khi phát hành tính năng.

**Lưu ý nội dung:** câu hỏi có hình cần **bộ hình minh họa có bản quyền rõ ràng** (tự vẽ, mua license, hoặc nguồn mở có giấy phép phù hợp).

### 4.10 Dashboard tiến độ

| Chỉ số | Cách tính |
|---|---|
| Độ phủ HSK 1 | (số từ HSK 1 đã học) / (tổng từ HSK 1 của chuẩn đang theo); song song: % đã thuộc |
| Streak | Số ngày liên tiếp có ≥ 1 hoạt động hợp lệ |
| Thời gian học | Tổng `studyMs` theo ngày/tuần |
| Từ mới / ôn mỗi ngày | Từ `stats/daily_*` |
| Độ chính xác theo kỹ năng | `bySkill` (nghe, đọc, pinyin, ngữ pháp, viết, từ vựng) |
| Lịch học (heatmap) | 90 ngày gần nhất |
| Điểm yếu | Top 10 từ sai nhiều, leech, thanh điệu hay nhầm |
| Lịch sử thi thử | Điểm từng lần |
| Mức sẵn sàng (heuristic) | Ví dụ: 40% độ phủ "đã thuộc" + 40% điểm thi thử gần nhất + 20% độ chính xác trung bình; hiển thị là **ước lượng**, không phải dự đoán chính thức |

### 4.11 Cài đặt

- Chuẩn HSK đang theo (hsk2.0 / hsk3.0).
- Hiển thị pinyin: luôn / khi chạm / ẩn; chữ giản thể (mặc định), phồn thể (v2).
- Màu thanh điệu (bật/tắt; **luôn kèm dấu thanh**, không chỉ dựa vào màu để hỗ trợ người mù màu).
- Cỡ chữ, dark mode.
- Số thẻ mới/ngày, mục tiêu phút học/ngày, nhắc học.
- Tự phát audio, tốc độ mặc định.
- Xuất / xóa dữ liệu.

---

## 5. Màn hình và luồng

| Màn hình | Nội dung chính | Trạng thái cần xử lý |
|---|---|---|
| **Home** | Nút "Học tiếp", số thẻ đến hạn, streak, mục tiêu hôm nay | Lần đầu (onboarding), không có gì cần ôn |
| **Lộ trình** | Bản đồ module/unit/lesson | Đang tải, lesson khóa |
| **Lesson Player** | Máy trạng thái: từ mới → hội thoại → ngữ pháp → luyện tập → ôn lỗi → tổng kết | Mất mạng, thoát giữa chừng (lưu nháp) |
| **Ôn tập (SRS)** | Hàng đợi thẻ đến hạn | Hết thẻ ("hôm nay xong rồi") |
| **Pinyin Lab** | Bảng pinyin, bài luyện thanh | — |
| **Từ điển/Bộ từ của tôi** | Tìm kiếm, lọc theo level/unit/nguồn, thêm/sửa/xóa, nhập hàng loạt | Danh sách trống, lỗi nhập |
| **Luyện viết** | Canvas Hanzi Writer | Thiết bị không hỗ trợ cảm ứng |
| **Luyện đọc / nghe** | Danh sách bài theo unit | — |
| **Thi thử** | Chọn đề → làm → kết quả | Hết giờ, thoát giữa chừng |
| **Dashboard** | Mục 4.10 | Chưa có dữ liệu |
| **Cài đặt** | Mục 4.11 | — |

**Onboarding (lần đầu):** chọn chuẩn HSK → chọn mục tiêu (phút/ngày, ngày thi nếu có) → hỏi "đã biết pinyin chưa?" (nếu rồi, gợi ý bỏ qua Module 0 nhưng vẫn mở được) → vào lesson đầu.

---

## 6. Xử lý Pinyin và chữ Hán (chi tiết kỹ thuật)

### 6.1 Lưu pinyin dạng số, hiển thị dạng dấu

- Lưu: `"ni3 hao3"`, `"lv4"` hoặc `"lü4"` (chuẩn hóa `v`/`u:` → `ü` khi hiển thị).
- Hiển thị: `nǐ hǎo`.
- Ưu điểm: dễ tìm kiếm, so sánh, nhập liệu.

### 6.2 Hàm đổi số → dấu

Quy tắc đặt dấu: ưu tiên `a` hoặc `e`; nếu là `ou` thì đặt trên `o`; còn lại đặt trên nguyên âm **cuối** (đúng cho `iu`, `ui`, `uo`...).

```ts
const MARKS: Record<string, string[]> = {
  a: ["ā", "á", "ǎ", "à", "a"], e: ["ē", "é", "ě", "è", "e"],
  i: ["ī", "í", "ǐ", "ì", "i"], o: ["ō", "ó", "ǒ", "ò", "o"],
  u: ["ū", "ú", "ǔ", "ù", "u"], ü: ["ǖ", "ǘ", "ǚ", "ǜ", "ü"],
};

function pickVowelIndex(s: string): number {
  let i = s.search(/[ae]/);
  if (i >= 0) return i;
  i = s.indexOf("ou");
  if (i >= 0) return i;
  for (let k = s.length - 1; k >= 0; k--) if ("iouü".includes(s[k])) return k;
  return -1;
}

export function syllableToMarked(raw: string): string {
  const m = raw.toLowerCase().match(/^([a-zü:]+?)([1-5])?$/);
  if (!m) return raw;
  const base = m[1].replace(/u:|v/g, "ü");
  const tone = m[2] ? Number(m[2]) : 5;
  const idx = pickVowelIndex(base);
  if (idx < 0) return base;
  return base.slice(0, idx) + MARKS[base[idx]][tone - 1] + base.slice(idx + 1);
}
```

Cần viết unit test tối thiểu cho: `hao3→hǎo`, `liu2→liú`, `gui4→guì`, `zou3→zǒu`, `lv4→lǜ`, `xie4→xiè`, `ma→ma`.

### 6.3 So khớp đáp án khi người dùng gõ pinyin

`normalizePinyin(input)`: bỏ khoảng trắng và dấu `'`, hạ chữ thường, đổi `v`/`u:` → `ü`, đổi chữ có dấu → dạng số, rồi so với danh sách `answers`. Chấp nhận cả `zai4jian4`, `zài jiàn`, `zai4 jian4`. Tùy chọn: cho điểm một phần khi đúng âm nhưng sai thanh (hiện thông báo "đúng âm, sai thanh").

### 6.4 Biến điệu khi hiển thị

- **Quy ước sách giáo khoa:** 不 và 一 viết theo thanh *đã biến điệu* (`bú kèqi`, `yí gè`); 3+3 vẫn viết thanh gốc (`nǐ hǎo`) dù đọc thành 2+3.
- Dữ liệu lưu thanh **như sách viết**; audio là cách đọc thực tế.

### 6.5 Ruby (pinyin trên chữ Hán)

```html
<ruby lang="zh-Hans">你<rt>nǐ</rt></ruby><ruby lang="zh-Hans">好<rt>hǎo</rt></ruby>
```

- Luôn đặt `lang="zh-Hans"` để trình duyệt chọn đúng glyph.
- Font: **Noto Sans SC** (giấy phép OFL), tự host bản đã subset, thêm fallback (`"PingFang SC", "Microsoft YaHei", sans-serif`), `font-display: swap`.
- Chế độ ẩn pinyin: dùng CSS ẩn `<rt>`, không xóa khỏi DOM (để screen reader và để bật lại nhanh).

---

## 7. Âm thanh

**Nguồn** (xếp theo chất lượng):
1. Thu âm người bản ngữ (tốt nhất; cần có thỏa thuận quyền sử dụng).
2. TTS giọng neural (Azure `zh-CN-*`, Google Cloud TTS...). **Kiểm tra điều khoản** về việc lưu và phân phối audio sinh ra.
3. `speechSynthesis` của trình duyệt (`lang="zh-CN"`) chỉ làm dự phòng, chất lượng tùy thiết bị.

**Quy trình**
- Sinh trước toàn bộ audio: mỗi từ, mỗi câu, mỗi hội thoại, mỗi âm tiết pinyin. Lưu `mp3` trên Firebase Hosting/Storage, tên theo `id`: `audio/hsk1/w/w_000123.mp3`.
- Hai tốc độ: thường và chậm (≈ 0.75×), nên sinh sẵn thay vì đổi `playbackRate` (giữ nguyên cao độ, tự nhiên hơn).
- **Chữ đa âm** (了, 的, 都, 得...): dùng SSML `<phoneme>` hoặc nhập pinyin để ép đúng cách đọc, rồi **nghe kiểm tra thủ công**.
- Chuẩn hóa âm lượng giữa các file.
- Tải trước (preload) audio của lesson đang học; cache bằng service worker.

---

## 8. Kiến trúc đề xuất

```
repo/
├─ content/hsk1/            # JSON nguồn: words, sentences, dialogues, grammar, exercises, unit-map
├─ scripts/
│  ├─ validate-content.ts   # kiểm tra schema + độ phủ (mục 2.5)
│  ├─ build-content.ts      # sinh public/content/hsk1/*.json + chỉ mục tìm kiếm
│  └─ gen-audio.ts          # sinh/đối chiếu audio
├─ src/
│  ├─ features/{path,lesson,srs,pinyin,import,listening,reading,writing,exam,dashboard}/
│  ├─ lib/{pinyin,srs,exercise-engine,content-loader,firestore}/
│  └─ ...
└─ functions/               # (tùy chọn) import nặng, sinh audio
```

- **Content loader:** tải `index.json` (danh sách unit + từ) và lazy-load chi tiết từng unit; cache bằng service worker (PWA).
- **Exercise engine:** hàm thuần nhận `Exercise` + đáp án → `{correct, feedback}`; component render theo `type`. Dễ unit test, dễ thêm dạng bài mới.
- **Auth:** cho học thử ẩn danh (Firebase anonymous), nâng cấp lên Google khi muốn đồng bộ (dùng `linkWithCredential` để giữ dữ liệu).
- **Chi phí:** nội dung tĩnh phục vụ qua CDN, chỉ dữ liệu người dùng đi qua Firestore; mỗi lượt ôn ≈ 3 ghi (xem mục 3.3).
- **Phân tích:** ghi sự kiện chính (hoàn thành lesson, bỏ dở, thi thử) để biết người học rớt ở đâu.

---

## 9. Ví dụ dữ liệu mẫu — Unit 1 (Chào hỏi)

```json
{
  "unit": { "id": "u01", "order": 1, "titleVi": "Chào hỏi",
    "goalsVi": ["Chào và đáp lời chào", "Cảm ơn, xin lỗi, tạm biệt"],
    "lessonIds": ["u01-l1", "u01-l2", "u01-l3"] },

  "words": [
    { "id": "w_000001", "hanzi": "你好", "pinyin": "ni3 hao3", "pos": ["phrase"],
      "meaningVi": ["xin chào"], "levels": { "hsk2.0": 1 }, "unitId": "u01",
      "exampleIds": ["s_000001"], "audio": "audio/hsk1/w/w_000001.mp3",
      "mnemonic": "你 = bạn, 好 = tốt → 'chúc bạn tốt lành'", "tags": [], "source": "system" },
    { "id": "w_000002", "hanzi": "谢谢", "pinyin": "xie4 xie5", "hanViet": "tạ tạ", "pos": ["v"],
      "meaningVi": ["cảm ơn"], "levels": { "hsk2.0": 1 }, "unitId": "u01",
      "exampleIds": ["s_000002"], "tags": [], "source": "system" },
    { "id": "w_000003", "hanzi": "再见", "pinyin": "zai4 jian4", "hanViet": "tái kiến", "pos": ["v"],
      "meaningVi": ["tạm biệt"], "levels": { "hsk2.0": 1 }, "unitId": "u01",
      "exampleIds": ["s_000003"], "tags": [], "source": "system" },
    { "id": "w_000004", "hanzi": "不客气", "pinyin": "bu2 ke4 qi5", "pos": ["phrase"],
      "meaningVi": ["không có gì", "đừng khách sáo"], "levels": { "hsk2.0": 1 }, "unitId": "u01",
      "exampleIds": ["s_000004"],
      "notes": "不 đọc/viết thanh 2 (bú) vì đứng trước thanh 4.", "tags": [], "source": "system" }
  ],

  "sentences": [
    { "id": "s_000001", "hanzi": "你好！", "pinyin": "ni3 hao3", "vi": "Xin chào!",
      "tokens": [{ "hanzi": "你好", "pinyin": "ni3 hao3", "wordId": "w_000001" }] },
    { "id": "s_000002", "hanzi": "谢谢你。", "pinyin": "xie4 xie5 ni3", "vi": "Cảm ơn bạn.",
      "tokens": [{ "hanzi": "谢谢", "pinyin": "xie4 xie5", "wordId": "w_000002" },
                 { "hanzi": "你", "pinyin": "ni3" }] },
    { "id": "s_000004", "hanzi": "不客气。", "pinyin": "bu2 ke4 qi5", "vi": "Không có gì.",
      "tokens": [{ "hanzi": "不客气", "pinyin": "bu2 ke4 qi5", "wordId": "w_000004" }] }
  ],

  "dialogues": [
    { "id": "d_u01_1", "unitId": "u01", "title": "Cảm ơn",
      "lines": [{ "speaker": "A", "sentenceId": "s_000002" },
                { "speaker": "B", "sentenceId": "s_000004" }] }
  ],

  "exercises": [
    { "id": "e_u01_001", "type": "mcq_meaning", "skill": "vocab", "wordIds": ["w_000003"],
      "prompt": "再见", "options": ["xin chào", "tạm biệt", "cảm ơn", "xin lỗi"], "answer": 1 },
    { "id": "e_u01_002", "type": "listen_choose", "skill": "listening", "wordIds": ["w_000002"],
      "audio": "audio/hsk1/w/w_000002.mp3", "options": ["谢谢", "再见", "你好", "不客气"], "answer": 0 },
    { "id": "e_u01_003", "type": "type_pinyin", "skill": "pinyin", "wordIds": ["w_000003"],
      "hanzi": "再见", "answers": ["zai4 jian4"] },
    { "id": "e_u01_004", "type": "match_pairs", "skill": "vocab",
      "pairs": [{ "left": "你好", "right": "xin chào" }, { "left": "谢谢", "right": "cảm ơn" },
                { "left": "再见", "right": "tạm biệt" }] }
  ]
}
```

---

## 10. Kế hoạch phát triển theo giai đoạn

> Ước lượng thô cho 1 người làm bán thời gian; điều chỉnh theo thực tế.

| Giai đoạn | Nội dung | Ước lượng |
|---|---|---|
| **P0 — Nền tảng nội dung** | Chốt chuẩn HSK, import danh sách từ, schema + script validate/build, sinh audio từ + câu | ~1 tuần (chủ yếu là nội dung) |
| **P1 — Lõi học tập** | Lộ trình + Lesson Player + exercise engine (6–8 dạng bài đầu) + tích hợp Flashcard + Pinyin Lab + Bộ từ của tôi (thêm/nhập) | 3–4 tuần |
| **P2 — Kỹ năng** | Luyện nghe, đọc hiểu (hover), ngữ pháp + bài tập, Module 0 và 1 hoàn chỉnh | 3 tuần |
| **P3 — Đánh giá** | Thi thử HSK 1 (≥ 3 đề), Dashboard, Sổ lỗi sai | 2–3 tuần |
| **P4 — Mở rộng** | Luyện viết, luyện nói, PWA offline hoàn chỉnh, mở rộng HSK 2 | tùy |

**Thứ tự nên làm để có bản dùng được sớm nhất:** P0 → Pinyin Lab + Bộ từ của tôi + Flashcard (đã có) → lesson player với Unit 1–3 → mở rộng dần nội dung song song với tính năng.

---

## 11. Tiêu chí hoàn thành (Definition of Done) cho HSK 1

- [ ] 100% từ HSK 1 của chuẩn đang chọn có: pinyin, nghĩa Việt, ≥ 1 câu ví dụ, audio.
- [ ] Mỗi unit có hội thoại, ngữ pháp, ≥ 8 bài tập, qua được script validate.
- [ ] Người dùng đi hết lộ trình từ Module 0 đến thi thử mà không gặp màn hình cụt.
- [ ] Flashcard, bài tập, dashboard đều xử lý đúng cả từ hệ thống lẫn từ tự thêm.
- [ ] Dùng tốt trên điện thoại (≥ 360px), có dark mode, phím tắt trên desktop.
- [ ] Mất mạng vẫn ôn thẻ và làm lesson đã tải; khi có mạng đồng bộ không mất dữ liệu.
- [ ] Unit test cho: đổi pinyin số → dấu, chuẩn hóa pinyin, tính SRS, chấm bài, tính độ phủ.
- [ ] Có ít nhất 3 đề thi thử hoàn chỉnh.

---

## 12. Quyết định cần chốt và rủi ro

| # | Câu hỏi | Ảnh hưởng |
|---|---|---|
| 1 | Nhắm **HSK 2.0 hay 3.0**, và dùng danh sách từ nào? | Toàn bộ nội dung, đề thi thử |
| 2 | Nguồn **audio** (thu âm hay TTS)? | Chi phí, chất lượng, giấy phép |
| 3 | Nguồn **hình minh họa** cho đề nghe/đọc? | Bản quyền, chi phí |
| 4 | Có cần đăng nhập bắt buộc, hay cho học ẩn danh? | Luồng onboarding |
| 5 | Có công khai/thương mại hóa không? | Giấy phép CC-CEDICT, dữ liệu nét, TTS |
| 6 | Giữ SM-2 hay chuyển FSRS? | Chất lượng lịch ôn (không ảnh hưởng schema) |

**Rủi ro chính**
- **Nội dung** là phần tốn công nhất (ví dụ, audio, đề thi, giải thích ngữ pháp), không phải code. Nên làm theo từng unit để có sản phẩm dùng được sớm.
- **Chuẩn HSK thay đổi** — tách cấu hình theo version ngay từ đầu để khỏi phải sửa dữ liệu hàng loạt sau này.
- **Chất lượng audio cho chữ đa âm** — phải nghe kiểm tra thủ công.
- **Giấy phép dữ liệu bên thứ ba** — kiểm tra trước khi phát hành công khai.