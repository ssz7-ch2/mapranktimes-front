<script lang="ts" generics="T">
	// Licensed under the GNU Affero General Public License v3.0.
	// See the LICENCE file in the repository root for full licence text.

	// converted to svelte from https://github.com/ppy/osu-web/blob/7c14ff30f2e2a3608e5d022335a946c4a3ac743a/resources/js/virtual-list/virtual-list.tsx

	import { throttle } from 'lodash-es';
	import { onMount, type Snippet } from 'svelte';

	type Props = {
		items: T[];
		itemHeight: number;
		itemBuffer?: number;
		itemSnippet: Snippet<[T[]]>;
	};

	let { items, itemHeight, itemBuffer = 0, itemSnippet }: Props = $props();

	const emptyItemBounds = { firstItemIndex: 0, lastItemIndex: 0 };

	let scrollContainer: Window | null = $state(null);
	let scrollTop = $state(0);
	let ref: HTMLDivElement;

	let { firstItemIndex, lastItemIndex } = $derived.by(() => {
		const length = items.length;
		const viewHeight = scrollContainer?.innerHeight ?? 0;

		if (length === 0 || viewHeight === 0) return emptyItemBounds;

		const scrollBottom = scrollTop + viewHeight;

		const listTop = topFromWindow(ref) - topFromWindow(scrollContainer);
		const listHeight = itemHeight * length;

		// visible portion of the list
		const listViewTop = Math.max(0, scrollTop - listTop);
		const listViewBottom = Math.max(0, Math.min(listHeight, scrollBottom - listTop));

		// visible item indexes
		const firstItemIndex = Math.max(0, Math.floor(listViewTop / itemHeight) - itemBuffer);
		const lastItemIndex = Math.min(length, Math.ceil(listViewBottom / itemHeight) + itemBuffer);

		return {
			firstItemIndex,
			lastItemIndex
		};
	});

	function topFromWindow(element: Window | HTMLElement | Element | null): number {
		if (element == null) return 0;

		const offsetTop = 'offsetTop' in element ? element.offsetTop : 0;
		const offsetParent = 'offsetParent' in element ? element.offsetParent : null;

		return offsetTop + topFromWindow(offsetParent);
	}

	const setScroll = () => (scrollTop = scrollContainer?.scrollY ?? 0);
	let throttledSetScroll = throttle(() => setScroll(), 100);

	onMount(() => {
		scrollContainer = window;
		scrollContainer.addEventListener('scroll', throttledSetScroll);

		scrollTop = scrollContainer.scrollY;

		return () => scrollContainer!.removeEventListener('scroll', throttledSetScroll);
	});

	const _items = $derived(lastItemIndex > 0 ? items.slice(firstItemIndex, lastItemIndex) : []);
	const style = $derived(
		`box-sizing:border-box; height:${items.length * itemHeight}px; padding-top:${firstItemIndex * itemHeight}px`
	);
</script>

<div bind:this={ref} {style}>
	{@render itemSnippet(_items)}
</div>
