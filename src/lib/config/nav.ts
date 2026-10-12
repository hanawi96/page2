import type { RouteId } from '$app/types';
import {
	CalendarDays,
	Flag,
	FolderOpen,
	Layers,
	LayoutGrid,
	RefreshCw,
	ScrollText,
	Settings
} from '@lucide/svelte';
import type { Component } from 'svelte';

export interface NavItem {
	/** Route ID của SvelteKit (kèm nhóm), dùng với `resolve()` để ra đường dẫn thật. */
	route: RouteId;
	label: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: Component<any>;
}

export const navItems: readonly NavItem[] = [
	{ route: '/(app)', label: 'Tổng quan', icon: LayoutGrid },
	{ route: '/(app)/fanpage', label: 'Fanpage', icon: Flag },
	{ route: '/(app)/kho-noi-dung', label: 'Kho nội dung', icon: FolderOpen },
	{ route: '/(app)/chu-de', label: 'Chủ đề', icon: Layers },
	{ route: '/(app)/lich-dang', label: 'Lịch đăng', icon: CalendarDays },
	{ route: '/(app)/tu-dong-dang', label: 'Tự động đăng', icon: RefreshCw },
	{ route: '/(app)/lich-su', label: 'Lịch sử', icon: ScrollText },
	{ route: '/(app)/cai-dat', label: 'Cài đặt', icon: Settings }
];
