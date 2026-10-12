import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { getEnv } from '#lib/server/env.js';

/** Định danh khóa nằm trong chuỗi mã hóa để sau này xoay khóa mà vẫn giải mã được dữ liệu cũ. */
const KEY_ID = 'k1';
const ALGORITHM = 'aes-256-gcm';
const IV_BYTES = 12;

function defaultKey(): Buffer {
	return Buffer.from(getEnv().TOKEN_ENCRYPTION_KEY, 'base64');
}

/** Mã hóa token thành chuỗi `keyId.iv.tag.dữ-liệu` (base64url) để lưu vào DB. */
export function encryptToken(plain: string, key: Buffer = defaultKey()): string {
	const iv = randomBytes(IV_BYTES);
	const cipher = createCipheriv(ALGORITHM, key, iv);
	const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
	const parts = [iv, cipher.getAuthTag(), data].map((part) => part.toString('base64url'));
	return [KEY_ID, ...parts].join('.');
}

/** Giải mã chuỗi do `encryptToken` tạo ra; ném lỗi nếu chuỗi bị sửa hoặc sai khóa. */
export function decryptToken(payload: string, key: Buffer = defaultKey()): string {
	const [keyId, iv, tag, data] = payload.split('.');
	if (keyId !== KEY_ID || !iv || !tag || !data) throw new Error('Chuỗi token mã hóa không hợp lệ');

	const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'base64url'));
	decipher.setAuthTag(Buffer.from(tag, 'base64url'));
	return Buffer.concat([
		decipher.update(Buffer.from(data, 'base64url')),
		decipher.final()
	]).toString('utf8');
}
