import { hash, verify } from '@node-rs/argon2';

// Mặc định của @node-rs/argon2 là Argon2id với tham số theo khuyến nghị OWASP.
export function hashPassword(password: string): Promise<string> {
	return hash(password);
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
	try {
		return await verify(passwordHash, password);
	} catch {
		// Hash hỏng/không đúng định dạng: coi như không khớp thay vì làm sập luồng đăng nhập.
		return false;
	}
}

let dummyHash: Promise<string> | undefined;

/**
 * Xác minh với hash giả khi không tìm thấy tài khoản, để thời gian phản hồi
 * không tiết lộ email nào tồn tại.
 */
export async function burnPasswordCheck(password: string): Promise<void> {
	dummyHash ??= hashPassword('mat-khau-gia-de-can-bang-thoi-gian');
	await verifyPassword(await dummyHash, password);
}
