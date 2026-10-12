import * as v from 'valibot';
import { FB_DIALOG_ORIGIN } from '#lib/config/facebook.js';
import { FB_REQUIRED_PERMISSIONS } from '#lib/domain/facebook.js';
import { graphGet } from './client.js';
import { getFacebookConfig } from './config.js';

const TokenResponseSchema = v.object({
	access_token: v.string(),
	// Token không hạn thì Facebook không trả `expires_in`.
	expires_in: v.optional(v.number())
});

export interface UserToken {
	token: string;
	expiresAt: Date | null;
}

/**
 * Địa chỉ hộp thoại đăng nhập Facebook (luồng thủ công, `response_type=code`).
 * Nguồn: https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow
 * `auth_type=rerequest` để hỏi lại các quyền người dùng từng từ chối.
 * Ứng dụng Login for Business: `config_id` thay cho `scope`
 * (https://developers.facebook.com/docs/facebook-login/facebook-login-for-business).
 */
export function buildLoginUrl(state: string): string {
	const config = getFacebookConfig();
	const url = new URL(`${FB_DIALOG_ORIGIN}/${config.version}/dialog/oauth`);
	url.searchParams.set('client_id', config.appId);
	url.searchParams.set('redirect_uri', config.redirectUri);
	url.searchParams.set('state', state);
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('auth_type', 'rerequest');

	if (config.loginConfigId) {
		url.searchParams.set('config_id', config.loginConfigId);
		url.searchParams.set('override_default_response_type', 'true');
	} else {
		url.searchParams.set('scope', FB_REQUIRED_PERMISSIONS.join(','));
	}
	return url.toString();
}

function toUserToken(response: v.InferOutput<typeof TokenResponseSchema>): UserToken {
	const expiresAt = response.expires_in ? new Date(Date.now() + response.expires_in * 1000) : null;
	return { token: response.access_token, expiresAt };
}

/** Đổi `code` (gọi từ server vì cần App Secret) lấy token ngắn hạn của người dùng. */
export async function exchangeCodeForToken(code: string): Promise<string> {
	const config = getFacebookConfig();
	const response = await graphGet(TokenResponseSchema, 'oauth/access_token', {
		params: {
			client_id: config.appId,
			client_secret: config.appSecret,
			redirect_uri: config.redirectUri,
			code
		}
	});
	return response.access_token;
}

/** Đổi token ngắn hạn lấy token dài hạn (~60 ngày); token Page lấy từ đây thì không hết hạn. */
export async function exchangeForLongLivedToken(shortToken: string): Promise<UserToken> {
	const config = getFacebookConfig();
	const response = await graphGet(TokenResponseSchema, 'oauth/access_token', {
		params: {
			grant_type: 'fb_exchange_token',
			client_id: config.appId,
			client_secret: config.appSecret,
			fb_exchange_token: shortToken
		}
	});
	return toUserToken(response);
}
