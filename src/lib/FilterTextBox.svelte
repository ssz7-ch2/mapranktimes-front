<script lang="ts">
	import { onMount } from 'svelte';
	import { debounce } from 'lodash-es';
	import { stringToFilter } from './utils/stringToFilter';
	import { filter, filterOn, filterString } from '../stores';

	type Props = {
		class?: string;
	};

	let { ...restProps }: Props = $props();
	let value = $state('');

	const updateFilter = debounce((line: string) => {
		const { filterString: newFilterString, filter: newFilter } = stringToFilter(line);
		if (newFilterString != $filterString) {
			$filter = newFilter;
			$filterString = newFilterString;
		}
		if (line.length > 0) $filterOn = true;
	}, 500);

	onMount(() => {
		const localFilterString = localStorage.getItem('filter');
		if (localFilterString !== null) {
			value = localFilterString;
			const { filterString: newFilterString, filter: newFilter } =
				stringToFilter(localFilterString);
			$filter = newFilter;
			$filterString = newFilterString;
		}
	});
</script>

<div class={`font-mono2 ${restProps.class ?? ''}`}>
	<input
		class=" text-neutral-400 focus:text-neutral-300 bg-inherit appearance-none border border-neutral-600 focus:border-neutral-400 placeholder-neutral-700 rounded-[4px] py-1.5 px-3.5 focus:outline-none focus:shadow-outline lowercase w-full text-center md:text-left"
		id="username"
		type="text"
		placeholder="Filter"
		spellCheck={false}
		autoComplete="off"
		{value}
		oninput={(e) => {
			value = e.currentTarget.value;
			updateFilter(e.currentTarget.value);
		}}
	/>
</div>
