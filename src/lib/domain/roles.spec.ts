import { describe, expect, it } from 'vitest';
import {
	assignableRoles,
	canManageMember,
	canManagePages,
	canManageUsers,
	isAssignableRole
} from './roles';

describe('assignableRoles', () => {
	it('chủ sở hữu gán được admin và editor', () => {
		expect(assignableRoles('owner')).toEqual(['admin', 'editor']);
	});

	it('admin chỉ gán được editor', () => {
		expect(assignableRoles('admin')).toEqual(['editor']);
	});

	it('editor không gán được vai trò nào', () => {
		expect(assignableRoles('editor')).toEqual([]);
	});
});

describe('canManageMember', () => {
	it('chủ sở hữu quản lý mọi người trừ chủ sở hữu khác', () => {
		expect(canManageMember('owner', 'admin')).toBe(true);
		expect(canManageMember('owner', 'editor')).toBe(true);
		expect(canManageMember('owner', 'owner')).toBe(false);
	});

	it('admin chỉ quản lý editor', () => {
		expect(canManageMember('admin', 'editor')).toBe(true);
		expect(canManageMember('admin', 'admin')).toBe(false);
		expect(canManageMember('admin', 'owner')).toBe(false);
	});

	it('editor không quản lý ai', () => {
		expect(canManageMember('editor', 'editor')).toBe(false);
	});
});

describe('canManagePages', () => {
	it('chỉ owner và admin kết nối Facebook', () => {
		expect(canManagePages('owner')).toBe(true);
		expect(canManagePages('admin')).toBe(true);
		expect(canManagePages('editor')).toBe(false);
	});
});

describe('canManageUsers / isAssignableRole', () => {
	it('chỉ owner và admin quản lý người dùng', () => {
		expect(canManageUsers('owner')).toBe(true);
		expect(canManageUsers('admin')).toBe(true);
		expect(canManageUsers('editor')).toBe(false);
	});

	it('không cho gán vai trò owner qua form', () => {
		expect(isAssignableRole('editor')).toBe(true);
		expect(isAssignableRole('owner')).toBe(false);
		expect(isAssignableRole('hacker')).toBe(false);
	});
});
