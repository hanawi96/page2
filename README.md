# Fanpage Manager

Webapp nội bộ quản lý và đăng bài hàng loạt lên nhiều Fanpage Facebook (Meta Graph API), chạy trên Windows localhost.

**Công nghệ:** SvelteKit 3 · Svelte 5 · TypeScript (strict) · Vanilla CSS (Design Tokens) · PostgreSQL + Drizzle ORM + pg-boss _(sẽ thêm ở các giai đoạn sau)_.

## Tiến độ

| Giai đoạn | Nội dung                                               | Trạng thái |
| --------- | ------------------------------------------------------ | ---------- |
| 1         | Khởi tạo dự án                                         | ✅ Xong    |
| 2         | Design System, layout, Dashboard, Chủ đề (dữ liệu mẫu) | ✅ Xong    |
| 3         | Database & Authentication                              | Chưa làm   |
| 4         | Kết nối Facebook                                       | Chưa làm   |
| 5         | Chủ đề & Kho bài                                       | Chưa làm   |
| 6         | Đăng thủ công + Worker                                 | Chưa làm   |
| 7         | Lịch đăng theo Page + Scheduler                        | Chưa làm   |

## Yêu cầu

- Node.js **LTS** (khuyến nghị 24.x hoặc mới hơn bản LTS).
- PostgreSQL (cần từ Giai đoạn 3).

## Lệnh thường dùng

```bash
npm install          # cài dependency
npm run dev          # chạy chế độ phát triển  -> http://localhost:5173
npm run check        # kiểm tra TypeScript / Svelte
npm run lint         # Prettier + ESLint
npm test             # unit test (Vitest)
npm run build        # build production (adapter-node)
node build           # chạy bản production sau khi build
```

## Cấu trúc

```
src/
  lib/
    styles/        tokens.css (Design System), base.css
    components/
      ui/          Button, Badge, Tabs, Toggle, Progress, Toast...
      layout/      Sidebar, Topbar
      topics/      TopicCard, TopicDetail...
    domain/        Logic nghiệp vụ thuần (topic, schedule) + test
    utils/         Hàm tiện ích + test
    stores/        Theme, Toast
    mock/          DỮ LIỆU MẪU (sẽ thay bằng database)
    config/        Cấu hình điều hướng
  routes/          Các trang
```

## Design System

Toàn bộ màu, font, spacing, bo góc, đổ bóng nằm trong `src/lib/styles/tokens.css`.
Component **không hardcode** giá trị; đổi thương hiệu bằng cách sửa nhóm `--brand-*`.
Dark/Light mode dùng thuộc tính `data-theme` trên `<html>`.
