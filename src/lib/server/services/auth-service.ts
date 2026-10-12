import { count, eq, sql } from 'drizzle-orm';
import { getDb } from '#lib/server/db/client.js';
import { memberships, users, workspaces } from '#lib/server/db/schema/index.js';
import { burnPasswordCheck, hashPassword, verifyPassword } from '#lib/server/auth/password.js';
import { ConflictError } from '#lib/server/errors.js';

const DEFAULT_WORKSPACE_NAME = 'Không gian của tôi';
/** Khóa advisory để hai lần thiết lập đồng thời không tạo ra hai chủ sở hữu. */
const SETUP_LOCK_KEY = 7001;

let setupCompleted = false;

/** Chưa có người dùng nào: ứng dụng cần chạy màn hình thiết lập lần đầu. */
export async function needsSetup(): Promise<boolean> {
	if (setupCompleted) return false;
	const [row] = await getDb().select({ total: count() }).from(users);
	setupCompleted = (row?.total ?? 0) > 0;
	return !setupCompleted;
}

/** Trả về id người dùng nếu đúng email/mật khẩu và tài khoản còn hoạt động; ngược lại `null`. */
export async function authenticate(email: string, password: string): Promise<string | null> {
	const [user] = await getDb()
		.select({ id: users.id, passwordHash: users.passwordHash, isActive: users.isActive })
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (!user) {
		await burnPasswordCheck(password);
		return null;
	}

	const valid = await verifyPassword(user.passwordHash, password);
	return valid && user.isActive ? user.id : null;
}

interface SetupInput {
	name: string;
	email: string;
	password: string;
}

/** Tạo chủ sở hữu đầu tiên cùng workspace mặc định. Chỉ chạy được khi chưa có người dùng nào. */
export async function setupOwner(input: SetupInput): Promise<string> {
	const passwordHash = await hashPassword(input.password);

	return getDb().transaction(async (tx) => {
		await tx.execute(sql`select pg_advisory_xact_lock(${SETUP_LOCK_KEY})`);

		const [existing] = await tx.select({ total: count() }).from(users);
		if ((existing?.total ?? 0) > 0) {
			throw new ConflictError('Hệ thống đã được thiết lập. Vui lòng đăng nhập.');
		}

		const [owner] = await tx
			.insert(users)
			.values({ email: input.email, name: input.name, passwordHash, isPlatformAdmin: true })
			.returning({ id: users.id });
		const [workspace] = await tx
			.insert(workspaces)
			.values({ name: DEFAULT_WORKSPACE_NAME })
			.returning({ id: workspaces.id });
		await tx
			.insert(memberships)
			.values({ workspaceId: workspace.id, userId: owner.id, role: 'owner' });

		setupCompleted = true;
		return owner.id;
	});
}
