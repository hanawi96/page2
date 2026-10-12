import {
	Baby,
	Heart,
	Lightbulb,
	Newspaper,
	ShoppingBag,
	Sparkles,
	Star,
	Users
} from '@lucide/svelte';
import type { Component } from 'svelte';
import type { TopicIconKey } from '#lib/domain/topic.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const topicIcons: Record<TopicIconKey, Component<any>> = {
	heart: Heart,
	baby: Baby,
	'shopping-bag': ShoppingBag,
	star: Star,
	lightbulb: Lightbulb,
	newspaper: Newspaper,
	sparkles: Sparkles,
	users: Users
};
