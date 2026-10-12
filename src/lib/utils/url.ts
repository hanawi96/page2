/** Chỉ cho phép chuyển hướng tới đường dẫn nội bộ, chặn open redirect (`//evil.com`, `https://...`). */
export function safeRedirectPath(target: string | null | undefined, fallback = '/'): string {
	if (!target || !target.startsWith('/') || target.startsWith('//') || target.includes('\\'))
		return fallback;
	return target;
}
