import * as v from 'valibot';
import { FB_GRAPH_ORIGIN, FB_REQUEST_TIMEOUT_MS } from '#lib/config/facebook.js';
import { getEnv } from '#lib/server/env.js';
import { ExternalApiError } from '#lib/server/errors.js';
import { FacebookApiError } from './errors.js';

const GraphErrorSchema = v.object({
	error: v.object({
		message: v.string(),
		code: v.number()
	})
});

interface GraphGetOptions {
	/** Truyền token qua tham số `access_token` (đúng như tài liệu Meta). */
	token?: string;
	params?: Record<string, string>;
}

/**
 * Điểm duy nhất gọi Graph API (GET). Có timeout, ánh xạ lỗi và validate phản hồi bằng Valibot.
 * Không bao giờ đưa URL/token vào thông báo lỗi.
 */
export async function graphGet<TSchema extends v.GenericSchema>(
	schema: TSchema,
	path: string,
	options: GraphGetOptions = {}
): Promise<v.InferOutput<TSchema>> {
	const url = new URL(`${FB_GRAPH_ORIGIN}/${getEnv().FB_GRAPH_VERSION}/${path}`);
	for (const [key, value] of Object.entries(options.params ?? {})) url.searchParams.set(key, value);
	if (options.token) url.searchParams.set('access_token', options.token);

	let response: Response;
	try {
		response = await fetch(url, { signal: AbortSignal.timeout(FB_REQUEST_TIMEOUT_MS) });
	} catch (cause) {
		throw new ExternalApiError(undefined, { cause });
	}

	const body: unknown = await response.json().catch(() => null);

	if (!response.ok) {
		const parsedError = v.safeParse(GraphErrorSchema, body);
		if (parsedError.success) {
			const { code, message } = parsedError.output.error;
			throw new FacebookApiError(code, message);
		}
		throw new ExternalApiError(undefined, { cause: new Error(`HTTP ${response.status}`) });
	}

	const parsed = v.safeParse(schema, body);
	if (!parsed.success) {
		throw new ExternalApiError('Facebook trả về dữ liệu không đúng định dạng.', {
			cause: new Error(parsed.issues.map((issue) => issue.message).join('; '))
		});
	}
	return parsed.output;
}
