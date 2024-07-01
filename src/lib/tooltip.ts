import type { Action } from 'svelte/action';
import tippy, { type Instance, type Props } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

type TooltipProps = {
	content: string;
	duration?: number | [number | null, number | null] | undefined;
	theme?: string | undefined;
	delay?: number | [number | null, number | null] | undefined;
	offset?: [number, number];
	animation?: string | boolean | undefined;
	onTrigger?(instance: Instance<Props>, event: Event): void;
	onHide?(instance: Instance<Props>): false | void;
	trigger?: string | undefined;
};

export const tooltip: Action<HTMLDivElement, TooltipProps> = (
	node,
	{ content, duration, theme, delay, offset, animation, onTrigger, onHide, trigger }
) => {
	const instance = tippy(node, {
		content,
		duration,
		theme,
		delay,
		offset,
		animation,
		allowHTML: true,
		onTrigger,
		onHide,
		trigger
	});
	return {
		destroy() {
			instance.destroy();
		}
	};
};
