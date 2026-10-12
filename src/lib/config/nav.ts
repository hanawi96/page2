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
	href:
		| '/'
		| '/fanpage'
		| '/kho-noi-dung'
		| '/chu-de'
		| '/lich-dang'
		| '/tu-dong-dang'
		| '/lich-su'
		| '/cai-dat';
	label: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: Component<any>;
}

export const navItems: readonly NavItem[] = [
	{ href: '/', label: 'Tổng quan', icon: LayoutGrid },
	{ href: '/fanpage', label: 'Fanpage', icon: Flag },
	{ href: '/kho-noi-dung', label: 'Kho nội dung', icon: FolderOpen },
	{ href: '/chu-de', label: 'Chủ đề', icon: Layers },
	{ href: '/lich-dang', label: 'Lịch đăng', icon: CalendarDays },
	{ href: '/tu-dong-dang', label: 'Tự động đăng', icon: RefreshCw },
	{ href: '/lich-su', label: 'Lịch sử', icon: ScrollText },
	{ href: '/cai-dat', label: 'Cài đặt', icon: Settings }
];
