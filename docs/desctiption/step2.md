# Phát triển chi tiết: checklist kỹ thuật và kiến trúc triển khai HSK 1

> Tài liệu này kế thừa từ [step1.md](./step1.md) và chuyển đặc tả sang kế hoạch phát triển thực tế cho dự án. Mục tiêu là giữ được nguyên tắc: data-driven, mobile-first, offline-first, và tối ưu cho tiến độ người học.

---

## 1. Kết luận kiểm tra nhanh

Dự án hiện có nền tảng tốt về mặt UI/route/module:

- React + Vite + React Router đã cấu hình rõ ràng.
- Các module chủ chốt đã có sẵn: `vocab`, `listen`, `write`, `grammar`, `exam`, `progress`, `pinyin`, `learn`.
- Cấu trúc chức năng đã đúng hướng theo app học tiếng Trung.

Tuy nhiên, hiện tại repo còn thiếu các lớp sau để đáp ứng đúng đặc tả HSK 1:

1. Data layer tách biệt giữa nội dung chuẩn và dữ liệu người dùng.
2. Mô hình schema chuẩn cho từ, câu, hội thoại, ngữ pháp, unit, exercise.
3. Script validate/build content và kiểm tra độ phủ HSK.
4. Hệ thống SRS + Firestore + offline cache.
5. Pinyin normalization + testing cho số->dấu và chuẩn hóa đầu vào.
6. Lưu trữ và phân tích dữ liệu học tập theo `stats/daily_*`.
7. Thiết lập test và CI cơ bản.

Nói cách khác: phiên bản hiện tại đang ở mức “UI demo / prototype”, chưa phải “product HSK 1 hoàn chỉnh theo step1”.

---

## 2. Mục tiêu phát triển theo từng giai đoạn

### P0 — Nền tảng nội dung (1 tuần)

Mục tiêu:
- Chốt chuẩn HSK: 2.0 hoặc 3.0.
- Chuẩn hóa dữ liệu từ hệ thống và unit map.
- Xây dựng content schema + validator.
- Chuẩn bị audio & sentence data.

Công việc bắt buộc:
- Tạo `src/lib/content/schema.ts` để định nghĩa `Word`, `Sentence`, `Dialogue`, `GrammarPoint`, `Exercise`.
- Tạo `src/data/hsk1/*.json` hoặc `public/content/hsk1/*.json`.
- Tạo script `scripts/validate-content.js` cho các kiểm tra:
  - từ HSK bước 1 phải thuộc đúng 1 unit
  - không có từ nào thiếu `pinyin`/`meaningVi`/`exampleIds`
  - `unitId` tồn tại
  - `exercise` có `skill` và `answer`
- Tạo `scripts/build-content.js` cho build content từ JSON đầu vào thành bundle dùng runtime.

Đầu ra cần có:
- `unit-map.json`
- `words.json`
- `sentences.json`
- `grammar.json`
- `exercises.json`
- `index.json`

---

### P1 — Lõi học tập (3-4 tuần)

Mục tiêu:
- Cấu trúc lộ trình học từ module đến lesson.
- Lesson player với trạng thái lưu dở.
- Engine bài tập render theo type.
- Flashcard & SRS tích hợp.

Công việc bắt buộc:

#### 2.1 Lesson path
- Xây dựng `LearningPath` theo cấu trúc module/unit/lesson.
- Mỗi lesson có `status`: `locked`, `active`, `completed`.
- Tính `% complete` dựa trên số bài exercise trong lesson.
- Lưu luồng học vào localStorage hoặc Firestore.

#### 2.2 Exercise engine
- Tạo `src/lib/exercise-engine.ts` với hàm:
  - `evaluateExercise(exercise, answer)`
  - trả về `{ correct, feedback, explanationVi }`
- Mỗi kiểu bài có render riêng:
  - `mcq_meaning`
  - `mcq_hanzi`
  - `listen_choose`
  - `type_pinyin`
  - `fill_blank`
  - `order_words`
  - `match_pairs`
  - `translate_pick`

#### 2.3 Flashcard + SRS
- Giữ nguyên module flashcard hiện có nhưng chuyển sang model `WordRef`.
- Thêm `cardKind` và `reviewLog` theo schema.
- Tạo `srs.ts` chứa:
  - `createCardFromWord(wordRef, kind)`
  - `scheduleReview(card, rating)`
  - `isMastered(card)`
  - `isLeech(card)`

#### 2.4 Pinyin Lab
- Xử lý `normalizePinyin()` và `syllableToMarked()` theo đặc tả ở mục 6.1, 6.2, 6.3.
- Tạo unit test cho các trường hợp đúng:
  - `hao3 → hǎo`
  - `liu2 → liú`
  - `gui4 → guì`
  - `zou3 → zǒu`
  - `lv4 → lǜ`
  - `xie4 → xiè`
  - `ma → ma`

---

### P2 — Kỹ năng nâng cao (3 tuần)

Mục tiêu:
- Bài nghe, đọc hiểu, ngữ pháp, writing, mock exam.
- Tích hợp unit content đầy đủ.

Công việc bắt buộc:

#### 2.5 Listening
- Tạo `useSpeech` dạng audio driven.
- Hỗ trợ các dạng:
  - nghe chọn từ
  - nghe câu đúng/sai
  - nghe chọn hình
  - nghe hội thoại
  - nghe chép
- Bật transcript sau khi nộp bài.

#### 2.6 Reading / hover Ruby
- Tạo component `RubyText` hiển thị `<ruby><rt>...</rt></ruby>`.
- Dùng `tokens` và `wordId` để show `pinyin + nghĩa + thêm từ` khi hover/tap.

#### 2.7 Grammar
- Tạo trang `GrammarDetail` theo `GrammarPoint`.
- Mỗi điểm ngữ pháp có:
  - pattern
  - explanationMd
  - commonMistakes
  - exampleSentenceIds
  - exerciseIds

#### 2.8 Writing (tùy chọn nhưng nên có)
- Tích hợp `hanzi-writer` cho 3 mode: xem mẫu, luyện theo nét, tự viết.
- Ghi attempt vào `attempts` với `skill: "writing"`.

---

### P3 — Đánh giá & Dashboard (2-3 tuần)

Mục tiêu:
- Thi thử HSK 1 và history.
- Dashboard tiến độ.
- Sổ lỗi sai / review queue.

Công việc bắt buộc:

#### 2.9 Mock Exam
- Tạo ngân hàng đề tối thiểu 3 đề.
- Mỗi đề có sections theo cấu hình `ExamConfig`.
- Cho đồng hồ đếm ngược theo phần, nộp tự động khi hết giờ.
- Lưu kết quả và báo cáo chi tiết.

#### 2.10 Dashboard
- Tính `coverage`, `streak`, `studyMs`, `newCards`, `reviews`, `bySkill`, `history`.
- Hiển thị heatmap 90 ngày.
- Đánh dấu `leech` và từ yếu.

#### 2.11 Wrong review log
- Khi làm sai, từ đó được đưa vào `Ôn lỗi sai`.
- `attempts` ghi lại câu sai và `review queue` dựa trên `wordIds`.

---

## 3. Kiến trúc file cần bổ sung

### 3.1 Thư mục mới nên tạo

```text
src/
  lib/
    pinyin.ts
    srs.ts
    content-loader.ts
    exercise-engine.ts
    normalize.ts
    firestore.ts
  data/
    hsk1/
      index.json
      unit-map.json
      words.json
      sentences.json
      dialogues.json
      grammar.json
      exercises.json
  features/
    learning/
    pinyin/
    vocab/
    listening/
    reading/
    grammar/
    writing/
    exam/
    dashboard/
    import/
  hooks/
    useLocalProgress.ts
    useAudio.ts
  services/
    contentService.ts
    firestoreService.ts
    reviewService.ts
  types/
    hsk.ts
```

### 3.2 Tách lớp dữ liệu rõ ràng

- `src/data/hsk1/*`: nội dung tĩnh, chỉ đọc
- `src/services/*`: loader + adapter
- `src/lib/*`: logic thuần, dễ test
- `src/features/*`: UI/điều khiển giao diện
- `src/hooks/*`: logic hiển thị và lifecycle

Điểm cốt lõi là không để logic nghiệp vụ quá lẫn trong component.

---

## 4. Kiến trúc dữ liệu cần triển khai

### 4.1 Schema chuẩn

```ts
export type Skill = 'vocab' | 'pinyin' | 'listening' | 'reading' | 'grammar' | 'writing'

export interface Word {
  id: string
  hanzi: string
  pinyin: string
  hanViet?: string
  pos: string[]
  meaningVi: string[]
  levels: Record<string, number | null>
  unitId?: string
  exampleIds: string[]
  audio?: string
  mnemonic?: string
  tags: string[]
  source: 'system' | 'user'
}

export interface ReviewLog {
  cardId: string
  at: string
  rating: 1 | 2 | 3 | 4
  prevInterval: number
  newInterval: number
  timeMs: number
}
```

### 4.2 Quy tắc dữ liệu

- Một từ có thể có nhiều `levels` theo chuẩn HSK khác nhau.
- Một `hanzi` có nhiều cách đọc sẽ được lưu như nhiều `Word` riêng nếu `pinyin` khác nhau.
- `unitId` phải phục vụ cho toàn bộ lọc và dashboard.
- `wordId` luôn phải ổn định và không tái sinh theo lần nhập.

---

## 5. Quy trình triển khai trong code

### 5.1 Định nghĩa service đầu vào

- `contentService.loadUnit(unitId)`
- `contentService.loadWord(wordId)`
- `contentService.searchWords(query)`
- `reviewService.createReviewLog(card, rating)`
- `reviewService.computeNextInterval(card, rating)`

### 5.2 Trạng thái app

Nên dùng React state hoặc context theo kiểu:

- `AppState` chứa:
  - `currentUser`
  - `syllabus`
  - `learningProgress`
  - `cards`
  - `stats`
  - `settings`

Không nên để toàn bộ dữ liệu học tập nằm rải trong component.

---

## 6. Độ ưu tiên công việc thực tế

### Ưu tiên A — bắt buộc trước khi ra mắt

- `pinyin.ts`: normalize + syllable mapping
- validation script + unit tests
- data model `Word`, `Exercise`, `Unit`
- flashcard SRS logic
- lesson state persistence
- basic mock exam flow

### Ưu tiên B — cần có để chuẩn HSK 1

- `RubyText` reading hover
- grammar pages + error explanations
- listening exercises
- wrong review queue
- dashboard analytics

### Ưu tiên C — mở rộng sau này

- Firebase/auth
- offline sync + PWA
- AI pronunciation check
- HSK 2/3 content pack
- FSRS migration

---

## 7. Test strategy bắt buộc

### 7.1 Unit test

- `syllableToMarked` cho mọi case có trong đặc tả
- `normalizePinyin` cho dạng số/dấu/khoảng trắng
- `scheduleReview` cho SM-2
- `evaluateExercise` cho đúng/sai trong MCQ
- `coverage` tính % từ HSK đã học

### 7.2 Integration test

- Mở lesson, làm vài câu, thoát ra, vào lại đúng chỗ
- Tạo thẻ mới và lên lịch ôn đúng theo interval
- Từ sai được lưu vào `Ôn lỗi sai`
- Dashboard cập nhật đúng khi có thay đổi

### 7.3 E2E nhẹ

- flow: chọn lesson → làm exercise → hoàn thành → mở lại lesson
- flow: nhập từ mới → xuất CSV → dashboard nhận đúng dữ liệu

---

## 8. Rủi ro cần quản lý

1. Rủi ro dữ liệu HSK: chuẩn 2.0/3.0 khác nhau -> cần tách config và source rõ ràng.
2. Rủi ro audio: chữ đa âm cần nghe kiểm tra thủ công.
3. Rủi ro bản quyền: hình minh họa & audio cần kiểm tra giấy phép trước khi phát hành.
4. Rủi ro UX: nếu không có state persistence, người dùng sẽ mất tiến độ khi thoát app.
5. Rủi ro performance: không nên load hết dữ liệu HSK một lúc; phải lazy-load theo unit.

---

## 9. Mốc nghiệm thu theo sprint

### Sprint 1: foundation
- content schema và validation ok
- pinyin helper test pass
- mock lesson track works

### Sprint 2: core learning loop
- lesson player complete
- flashcard + SRS complete
- wrong review queue works

### Sprint 3: skill modules
- listening, grammar, reading
- at least 1 unit playable end-to-end

### Sprint 4: assessment + dashboard
- 3 mock exams
- dashboard goals + heatmap
- coverage and streak computed

---

## 10. Khuyến nghị triển khai cụ thể cho repo hiện tại

Dựa trên repo đang có, nên ưu tiên làm theo thứ tự:

1. Bổ sung `src/lib/pinyin.ts` và unit test.
2. Tạo `src/types/hsk.ts` và `src/data/hsk1/`.
3. Implement `LessonPlayer`/`learning state`.
4. Chuyển `VocabManager` sang `WordRef` data flow.
5. Cập nhật `ProgressDashboard` để dựa trên `stats` thay vì mock data nhúng.
6. Tạo `MockExam` theo cấu hình và lưu lịch sử.

Điều này giúp repo chuyển nhanh từ “prototype UI” sang “mô hình học tập có dữ liệu và tiến độ thật”.

---

## 11. Kết luận

Repo hiện có đủ “hình khối” để phát triển app HSK 1, nhưng cần đóng các lớp kỹ thuật quan trọng theo đúng đặc tả ở step1. Nếu triển khai đúng thứ tự trên, dự án sẽ đi từ demo sang được dùng thực tế mà không phá vỡ cấu trúc hiện có.

Lộ trình phù hợp nhất là:

- Step 1: content + pinyin + state foundation
- Step 2: lesson flow + SRS
- Step 3: listening/grammar/reading
- Step 4: exam + dashboard + analytics

Đây là chuỗi tạo ra sản phẩm có tính học tập thực sự, thay vì chỉ là một giao diện “luyện tiếng Trung đẹp mắt”.
