# 🏮 Simple Chinese — Ứng Dụng Tự Học & Luyện Thi HSK

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-v6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Simple Chinese** là nền tảng web hiện đại hỗ trợ người học tiếng Trung tự học từ vựng, rèn luyện kỹ năng nghe, tập viết chữ Hán, nắm vững ngữ pháp và thi thử mô phỏng đề thi HSK (tập trung HSK 1 – HSK 3).

📘 **Manual học tập:** [manual.md](manual.md)
📘 **Đặc tả phát triển:** [docs/desctiption/step1.md](docs/desctiption/step1.md)
📘 **Kế hoạch triển khai chi tiết:** [docs/desctiption/step2.md](docs/desctiption/step2.md)

</div>

---

## 📑 Mục lục

- [🏮 Simple Chinese — Ứng Dụng Tự Học \& Luyện Thi HSK](#-simple-chinese--ứng-dụng-tự-học--luyện-thi-hsk)
  - [📑 Mục lục](#-mục-lục)
  - [🌟 Tính năng nổi bật](#-tính-năng-nổi-bật)
    - [0. Học Hán ngữ Bính âm (Pinyin)](#0-học-hán-ngữ-bính-âm-pinyin)
    - [1. Quản lý \& Học từ vựng](#1-quản-lý--học-từ-vựng)
    - [2. Luyện nghe phản xạ](#2-luyện-nghe-phản-xạ)
    - [3. Tập viết chữ Hán tương tác](#3-tập-viết-chữ-hán-tương-tác)
    - [4. Luyện tập ngữ pháp](#4-luyện-tập-ngữ-pháp)
    - [5. Thi thử HSK mô phỏng](#5-thi-thử-hsk-mô-phỏng)
    - [6. Thống kê \& Theo dõi tiến độ](#6-thống-kê--theo-dõi-tiến-độ)
  - [🛠 Công nghệ sử dụng](#-công-nghệ-sử-dụng)
  - [📂 Cấu trúc thư mục](#-cấu-trúc-thư-mục)
  - [🚀 Cài đặt \& Chạy ứng dụng](#-cài-đặt--chạy-ứng-dụng)
    - [Yêu cầu môi trường](#yêu-cầu-môi-trường)
    - [Các bước cài đặt](#các-bước-cài-đặt)
  - [📖 Hướng dẫn sử dụng chi tiết](#-hướng-dẫn-sử-dụng-chi-tiết)
  - [💡 Lưu ý về tính năng âm thanh (Speech Synthesis)](#-lưu-ý-về-tính-năng-âm-thanh-speech-synthesis)

---

## 🌟 Tính năng nổi bật

### 0. Học Hán ngữ Bính âm (Pinyin)
- **Bảng âm thanh tương tác**: Đầy đủ 23 Thanh mẫu (Initials), 24 Vận mẫu (Finals) và 5 Thanh điệu (Tones).
- **Bộ lọc thông minh**: Phân loại theo âm bật hơi, âm uốn lưỡi, âm mặt lưỡi, âm đầu lưỡi, vận mẫu đơn/kép/mũi.
- **Mẹo phát âm cho người Việt**: Hướng dẫn chi tiết khẩu hình miệng, độ mở vòm họng và vị trí đặt lưỡi.
- **Luyện nghe phản xạ (Audio Quiz)**: Bài tập trắc nghiệm phân biệt các cặp âm dễ nhầm (p/b, q/j, zh/ch, s/sh, thanh 1/4).
- **Cẩm nang biến điệu (Tone Sandhi)**: Quy tắc 3+3 -> 2+3, biến điệu của "不" và "一", quy tắc bỏ dấu 2 chấm của "ü".

### 1. Quản lý & Học từ vựng
- **Thẻ Flashcard thông minh**: Hiển thị Hán tự, phiên âm Pinyin, nghĩa tiếng Việt, phân loại từ loại và câu ví dụ sinh động.
- **Bộ lọc đa năng**: Lọc từ vựng theo cấp độ HSK (HSK 1, 2, 3), theo trạng thái ghi nhớ hoặc tìm kiếm nhanh theo ký tự/Pinyin/nghĩa.
- **Thêm/Sửa/Xóa từ vựng**: Dễ dàng tùy chỉnh và bổ sung vốn từ riêng.
- **Import hàng loạt (Bulk Import)**: Nhập nhanh danh sách từ vựng qua văn bản định dạng TSV/CSV.
- **Phát âm chuẩn**: Tích hợp Web Speech API giúp nghe phát âm mẫu giọng đọc tiếng Trung phổ thông chuẩn.

### 2. Luyện nghe phản xạ
- **Tùy biến phiên luyện tập**: Chọn số câu hỏi (5, 10, 20 câu), lọc theo cấp độ HSK và tùy chỉnh tốc độ phát âm (0.75x, 1.0x, 1.25x).
- **Hình thức trắc nghiệm nghe**: Nghe từ/câu và chọn đáp án chính xác trong danh sách lựa chọn.
- **Báo cáo kết quả chi tiết**: Xem lại các câu đúng/sai, nghe lại câu sai và xem phân tích tỷ lệ chính xác.

### 3. Tập viết chữ Hán tương tác
- **Tích hợp Hanzi Writer**: Thư viện mô phỏng thứ tự nét bút tiêu chuẩn hàng đầu.
- **Chế độ xem mẫu (Animation)**: Hiển thị hoạt ảnh thứ tự từng nét viết (Stroke order).
- **Chế độ tự luyện viết (Interactive Quiz)**: Cho phép dùng chuột hoặc màn hình cảm ứng để viết trực tiếp trên canvas; hệ thống tự động kiểm tra và chấm độ chuẩn xác từng nét.
- **Phản hồi tức thì**: Báo lỗi khi sai nét, hỗ trợ gợi ý (hint) khi gặp chữ khó.

### 4. Luyện tập ngữ pháp
- **Hệ thống điểm ngữ pháp trọng tâm**: Phân cấp theo từng level HSK từ cơ bản đến nâng cao.
- **Giải thích chi tiết kèm ví dụ**: Cấu trúc công thức, phân tích cách dùng và các cặp câu ví dụ song ngữ.
- **Bài tập tương tác**: Trắc nghiệm ngữ pháp, điền khuyết và sắp xếp trật tự từ trong câu.

### 5. Thi thử HSK mô phỏng
- **Cấu trúc đề chuẩn**: Mô phỏng bài thi HSK với các phần thi Nghe hiểu, Đọc hiểu và Viết.
- **Bộ đếm giờ thi thực tế**: Có đồng hồ đếm ngược và cảnh báo sắp hết giờ.
- **Bảng điểm & Đánh giá**: Tổng kết điểm từng phần, phân loại Đạt/Chưa đạt và cung cấp đáp án kèm giải thích chi tiết.

### 6. Thống kê & Theo dõi tiến độ
- **Activity Calendar (Heatmap)**: Bản đồ nhiệt thể hiện sự chăm chỉ học tập qua từng ngày trong năm.
- **Biểu đồ trực quan (Recharts)**: Theo dõi số từ đã học, thời lượng học tập theo tuần/tháng.
- **Phân bổ kỹ năng (Skill Breakdown)**: Đo lường mức độ thành thạo giữa các kỹ năng: Nghe, Đọc, Viết, Ngữ pháp.
- **Tiến độ theo cấp độ**: Tỷ lệ hoàn thành mục tiêu của từng cấp độ HSK 1, HSK 2, HSK 3.

---

## 🛠 Công nghệ sử dụng

| Công nghệ | Mục đích sử dụng |
| :--- | :--- |
| **React 18** | Thư viện UI cốt lõi xây dựng giao diện Single Page Application (SPA) |
| **Vite 5** | Build tool siêu nhanh cho môi trường phát triển và đóng gói tối ưu |
| **Tailwind CSS v4** | Framework tiện ích CSS hiện đại, tối ưu giao diện responsive, trực quan |
| **React Router v6** | Quản lý điều hướng và định tuyến các trang trong ứng dụng |
| **Hanzi Writer** | Canvas hiển thị hoạt họa nét bút và chấm điểm luyện viết chữ Hán |
| **Recharts** | Thư viện vẽ biểu đồ phân tích tiến độ, năng lực và hoạt động học tập |
| **Lucide React** | Bộ icon SVG hiện đại, tinh gọn |
| **Web Speech API** | Công nghệ Text-to-Speech (TTS) đọc mẫu phát âm tiếng Trung bản ngữ |

---

## 📂 Cấu trúc thư mục

```text
simple-chinese/
├── public/                 # Static assets
├── src/
│   ├── components/         # Các component dùng chung
│   │   └── Layout/
│   │       ├── AppShell.jsx    # Khung layout chính (Header, Sidebar, Content)
│   │       └── Navbar.jsx      # Thanh điều hướng ứng dụng
│   │
│   ├── features/           # Các module chức năng theo nghiệp vụ
│   │   ├── vocab/          # Quản lý từ vựng & Flashcard
│   │   │   ├── VocabManager.jsx
│   │   │   ├── VocabList.jsx
│   │   │   ├── VocabCard.jsx
│   │   │   ├── VocabForm.jsx
│   │   │   ├── BulkImport.jsx
│   │   │   └── mockData.js
│   │   ├── listening/      # Luyện nghe & Phản xạ âm thanh
│   │   │   ├── ListeningPractice.jsx
│   │   │   ├── SessionSetup.jsx
│   │   │   ├── ListeningSession.jsx
│   │   │   ├── ResultScreen.jsx
│   │   │   └── useSpeech.js
│   │   ├── writing/        # Luyện viết chữ Hán (HanziWriter)
│   │   │   ├── WritingPractice.jsx
│   │   │   ├── HanziWriterCanvas.jsx
│   │   │   ├── WritingSetup.jsx
│   │   │   ├── WritingSession.jsx
│   │   │   └── WritingResult.jsx
│   │   ├── grammar/        # Luyện tập ngữ pháp & Bài tập
│   │   │   ├── GrammarPractice.jsx
│   │   │   ├── GrammarList.jsx
│   │   │   ├── GrammarDetail.jsx
│   │   │   ├── ExerciseComponents.jsx
│   │   │   └── mockGrammar.js
│   │   ├── exam/           # Đề thi thử HSK mô phỏng
│   │   │   ├── MockExam.jsx
│   │   │   ├── ExamIntro.jsx
│   │   │   ├── ExamSession.jsx
│   │   │   ├── ExamSection.jsx
│   │   │   ├── ExamTimer.jsx
│   │   │   ├── ExamResult.jsx
│   │   │   └── mockExamData.js
│   │   └── progress/       # Báo cáo & Thống kê tiến độ
│   │       ├── ProgressDashboard.jsx
│   │       ├── ActivityCalendar.jsx
│   │       ├── ActivityChart.jsx
│   │       ├── SkillBreakdown.jsx
│   │       ├── HskProgress.jsx
│   │       ├── StatsCards.jsx
│   │       └── mockProgressData.js
│   │
│   ├── App.jsx             # Thiết lập định tuyến Router
│   ├── main.jsx            # Entry point của React
│   └── index.css           # Cấu hình Tailwind CSS & Custom styles
│
├── index.html              # Template HTML chính
├── package.json            # Thông tin dự án & dependencies
├── vite.config.js          # Cấu hình Vite & Tailwind plugin
└── README.md               # Tài liệu dự án
```

---

## 🚀 Cài đặt & Chạy ứng dụng

### Yêu cầu môi trường
- **Node.js**: Phiên bản `>= 18.0.0`
- **npm** hoặc **yarn** / **pnpm**

### Các bước cài đặt

1. **Clone repository (hoặc mở thư mục dự án):**
   ```bash
   git clone https://github.com/your-username/simple-chinese.git
   cd simple-chinese
   ```

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

3. **Khởi chạy môi trường phát triển (Development Server):**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ mặc định: `http://localhost:5173/`

4. **Đóng gói ứng dụng (Production Build):**
   ```bash
   npm run build
   ```

5. **Xem trước bản đóng gói (Preview Build):**
   ```bash
   npm run preview
   ```

---

## 📖 Hướng dẫn sử dụng chi tiết

| Trang | Đường dẫn | Chức năng chính |
| :--- | :--- | :--- |
| **Từ vựng** | `/vocab` | Xem kho từ HSK 1–3, lật Flashcard, nghe audio, thêm từ mới hoặc import từ file. |
| **Luyện nghe** | `/listen` | Chọn số lượng câu và tốc độ, nghe phát âm và chọn nghĩa tương ứng. |
| **Tập viết** | `/write` | Chọn ký tự cần viết, xem mẫu nét và tự viết trực tiếp trên bảng vẽ tương tác. |
| **Ngữ pháp** | `/grammar` | Xem lý thuyết ngữ pháp trọng tâm theo cấp độ và làm bài tập củng cố. |
| **Thi thử** | `/exam` | Tham gia bài thi thử HSK có tính thời gian thực và xem phân tích kết quả sau thi. |
| **Tiến độ** | `/progress` | Xem bản đồ học tập (streak), phân tích kỹ năng và biểu đồ tăng trưởng số từ vựng. |

---

## 💡 Lưu ý về tính năng âm thanh (Speech Synthesis)

- Tính năng phát âm sử dụng **Web Speech API** tích hợp sẵn của trình duyệt.
- Để có trải nghiệm tốt nhất với giọng đọc tiếng Trung (`zh-CN`), bạn nên sử dụng trình duyệt hiện đại như **Google Chrome**, **Microsoft Edge** hoặc **Brave** đã cài đặt gói ngôn ngữ Text-to-Speech tiếng Trung trên hệ điều hành.

---