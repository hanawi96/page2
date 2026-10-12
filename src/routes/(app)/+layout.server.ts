import { requireAuth } from '#lib/server/auth/guard.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	const { user, role } = requireAuth(locals);
	return { user: { name: user.name, email: user.email, role } };
};
