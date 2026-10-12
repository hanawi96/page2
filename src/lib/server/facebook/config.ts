import { FB_CALLBACK_PATH } from '#lib/config/facebook.js';
import { getEnv } from '#lib/server/env.js';
import { AppError } from '#lib/server/errors.js';

export interface FacebookConfig {
	appId: string;
	appSecret: string;
	version: string;
	/** Có giá trị khi ứng dụng dùng Facebook Login for Business. */
	loginConfigId: string | undefined;
	redirectUri: string;
}

/** Lấy cấu hình Facebook; thiếu App ID/Secret thì báo lỗi dễ hiểu thay vì sập cả ứng dụng. */
export function getFacebookConfig(): FacebookConfig {
	const env = getEnv();
	if (!env.FB_APP_ID || !env.FB_APP_SECRET) {
		throw new AppError(
			'Chưa cấu hình Facebook App. Hãy điền FB_APP_ID và FB_APP_SECRET trong file .env rồi khởi động lại.',
			503
		);
	}

	return {
		appId: env.FB_APP_ID,
		appSecret: env.FB_APP_SECRET,
		version: env.FB_GRAPH_VERSION,
		loginConfigId: env.FB_LOGIN_CONFIG_ID,
		redirectUri: new URL(FB_CALLBACK_PATH, env.BASE_URL).toString()
	};
}
