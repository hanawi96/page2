/** Địa chỉ Meta dùng chung cho mọi lời gọi; phiên bản Graph API lấy từ env `FB_GRAPH_VERSION`. */
export const FB_GRAPH_ORIGIN = 'https://graph.facebook.com';
export const FB_DIALOG_ORIGIN = 'https://www.facebook.com';

export const FB_REQUEST_TIMEOUT_MS = 15_000;

/** Số Page lấy mỗi lượt khi phân trang `/me/accounts`, và số lượt tối đa để không lặp vô hạn. */
export const FB_PAGES_PER_REQUEST = 100;
export const FB_MAX_PAGE_REQUESTS = 20;

/** Đường dẫn Facebook chuyển người dùng về sau khi đăng nhập; phải khai báo trong "Valid OAuth Redirect URIs". */
export const FB_CALLBACK_PATH = '/fanpage/ket-noi/callback';
