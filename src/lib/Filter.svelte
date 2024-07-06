<script lang="ts">
	import { filterOn, filterString } from '../stores';
	import FilterTextBox from './FilterTextBox.svelte';
	import ToggleSwitch from './ToggleSwitch.svelte';
</script>

<div class="flex flex-row gap-5 mb-3 md:mb-5 w-full items-center justify-center">
	<div class="hidden md:block">
		<ToggleSwitch
			switchWidth={40}
			color="#FFDD55"
			bind:value={$filterOn}
			class="font-mono whitespace-nowrap gap-3"
			condition={() => $filterString !== null}
		>
			<p class="select-none pt-[1.6px]">Enable Filter</p>
		</ToggleSwitch>
	</div>

	<FilterTextBox class="w-full md:w-96 text-lg" />
</div>
