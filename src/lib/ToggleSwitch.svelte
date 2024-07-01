<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		switchWidth: number;
		color: string;
		value: boolean;
		class?: string;
		condition?: () => boolean;
		children: Snippet;
	};
	let {
		switchWidth,
		color,
		value = $bindable(),
		condition,
		children,
		...restProps
	}: Props = $props();

	let isOn = $state(value);

	const onclick = () => {
		// only change value to true if condition is true
		value = !isOn && (condition?.() ?? true);
		isOn = !isOn;
	};

	$effect(() => {
		isOn = value;
	});
</script>

<button
	class={`flex flex-row items-center cursor-pointer ${restProps.class ?? ''}`}
	{onclick}
	type="button"
>
	<div style="width:{switchWidth}px" class="relative flex flex-row items-center justify-center">
		<span
			style="height:{switchWidth * 0.37}px; width:{switchWidth *
				0.75}px; background-color:{color}; opacity: {isOn
				? 0.5
				: 0.4}; filter: {`saturate(${isOn ? 1 : 0})`}"
			class="rounded-full transition-all duration-75"
		></span>
		<span
			style="height:{switchWidth * 0.5}px; width:{switchWidth *
				0.5}px; background-color:{color}; filter: {`saturate(${isOn ? 1 : 0})`}; left:{isOn
				? `${switchWidth * 0.5}px`
				: 0}"
			class="absolute rounded-full z-10 transition-all duration-75"
		></span>
	</div>
	{@render children()}
</button>
