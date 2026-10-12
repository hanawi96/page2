# Fanpage Manager

Webapp nội bộ quản lý và đăng bài hàng loạt lên nhiều Fanpage Facebook (Meta Graph API), chạy trên Windows localhost.

**Công nghệ:** SvelteKit 3 · Svelte 5 · TypeScript (strict) · Vanilla CSS (Design Tokens) · PostgreSQL + Drizzle ORM · pg-boss _(sẽ thêm ở giai đoạn 6)_.

## Tiến độ

| Giai đoạn | Nội dung                                               | Trạng thái |
| --------- | ------------------------------------------------------ | ---------- |
| 1         | Khởi tạo dự án                                         | ✅ Xong    |
| 2         | Design System, layout, Dashboard, Chủ đề (dữ liệu mẫu) | ✅ Xong    |
| 3         | Database & Authentication                              | ✅ Xong    |
| 4         | Kết nối Facebook                                       | ✅ Xong    |
| 5         | Chủ đề & Kho bài                                       | Chưa làm   |
| 6         | Đăng thủ công + Worker                                 | Chưa làm   |
| 7         | Lịch đăng theo Page + Scheduler                        | Chưa làm   |

## Yêu cầu

- Node.js **LTS** (khuyến nghị 24.x hoặc mới hơn bản LTS).
- PostgreSQL 17.

## Thiết lập lần đầu

1. Tạo database và role riêng, rồi sao chép `.env.example` thành `.env` và điền `DATABASE_URL`, `BASE_URL`.
2. `npm run db:migrate` để tạo bảng.
3. Tạo `TOKEN_ENCRYPTION_KEY` (32 byte, mã hóa base64) theo hướng dẫn trong `.env.example`.
4. `npm run dev`, mở `/thiet-lap` để tạo tài khoản chủ sở hữu (chỉ làm được khi hệ thống chưa có người dùng).

## Kết nối Facebook

1. Trong [Meta App Dashboard](https://developers.facebook.com/apps/) mở ứng dụng, thêm sản phẩm **Facebook Login** (hoặc dùng **Facebook Login for Business** nếu ứng dụng loại Business).
2. **Valid OAuth Redirect URIs** phải khớp đúng: `http://localhost:5173/fanpage/ket-noi/callback` (đổi host khi triển khai).
3. Điền `FB_APP_ID` và `FB_APP_SECRET` vào `.env`. Ứng dụng loại Business: thêm `FB_LOGIN_CONFIG_ID` (ID của Configuration). Mặc định Graph API `v26.0`.
4. Chế độ Development: thêm tài khoản Facebook của bạn làm Admin/Developer/Tester của app, rồi khởi động lại `npm run dev`.
5. Trong app, trang **Fanpage** → **Kết nối Facebook**. Chỉ chủ sở hữu và quản trị viên kết nối được.

Đổi cấu trúc bảng: sửa `src/lib/server/db/schema/`, chạy `npm run db:generate`, rồi `npm run db:migrate`.

## Lệnh thường dùng

```bash
npm install          # cài dependency
npm run dev          # chạy chế độ phát triển  -> http://localhost:5173
npm run db:generate  # sinh migration từ schema
npm run db:migrate   # áp dụng migration vào database
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
    server/        Chỉ chạy ở server: db/ (Drizzle), auth/, services/, http/
    domain/        Logic nghiệp vụ thuần (topic, schedule, roles) + test
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
