<script lang="ts">
	import { clamp } from 'lodash-es';
	import { onMount } from 'svelte';

	type Props = {
		trackColorBase: string;
		trackColor: string;
		startingValue?: number;
		min?: number;
		max?: number;
		step?: number;
		onChange?(value: number): void;
		onAfterChange?(value: number): void;
		sliderTrackClass?: string;
		sliderThumbClass?: string;
		class?: string;
	};
	let {
		min = 0,
		max = 100,
		startingValue = 0,
		step = 1,
		onChange,
		onAfterChange,
		sliderTrackClass,
		sliderThumbClass,
		trackColorBase,
		trackColor,
		...restProps
	}: Props = $props();
	let thumbRef = $state<HTMLDivElement | null>(null);
	let trackRef = $state<HTMLDivElement | null>(null);
	let ratio = $state((startingValue - min) / (max - min));
	let value = $derived(Math.round((ratio * (max - min) + min) / step) * step);
	let tracking = $state(false);
	let trackWidth = $state(0);
	let thumbWidth = $state(0);

	const handleMouseMove = (e: MouseEvent) => {
		e.preventDefault();
		if (!trackRef) return;
		const { left, width } = trackRef.getBoundingClientRect();
		const distance = e.clientX - left;
		const round = step / (max - min);
		ratio = clamp(Math.round(distance / width / round) * round, 0, 1);
	};
	const handleTouchMove = (e: TouchEvent) => {
		if (!trackRef) return;
		const { left, width } = trackRef.getBoundingClientRect();
		const distance = e.touches[0].clientX - left;
		const round = step / (max - min);
		ratio = clamp(Math.round(distance / width / round) * round, 0, 1);
	};
	$effect(() => {
		if (onChange && value) onChange(value);
	});

	$effect(() => {
		ratio = (startingValue - min) / (max - min);
	});

	onMount(() => {
		trackWidth = trackRef?.getBoundingClientRect().width ?? 0;
		thumbWidth = thumbRef?.getBoundingClientRect().width ?? 0;
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={restProps.class}
	onmousedown={(e) => {
		e.preventDefault();
		handleMouseMove(e);
		window.addEventListener('mousemove', handleMouseMove);
		tracking = true;
	}}
	ontouchstart={(e) => {
		handleTouchMove(e);
		window.addEventListener('touchmove', handleTouchMove);
		tracking = true;
	}}
>
	<div class="w-full h-full touch-none">
		<div class="w-full h-full relative">
			<div class="absolute left-0 top-1/2 -translate-y-1/2 w-full" bind:this={trackRef}>
				<div
					class={sliderTrackClass}
					style="background: linear-gradient(90deg, {trackColor} {ratio *
						100}%, {trackColorBase} {ratio * 100}%"
				></div>
			</div>
			<div
				class="absolute top-1/2 -translate-y-1/2 z-[999]"
				style="left:{ratio * (trackWidth - thumbWidth)}px"
				bind:this={thumbRef}
			>
				<div class={sliderThumbClass}></div>
			</div>
		</div>
	</div>
</div>

<svelte:window
	onmouseup={() => {
		if (tracking) {
			window.removeEventListener('mousemove', handleMouseMove);
			if (onAfterChange) onAfterChange(value);
			tracking = false;
		}
	}}
	ontouchend={() => {
		if (tracking) {
			window.removeEventListener('touchmove', handleTouchMove);
			if (onAfterChange) onAfterChange(value);
			tracking = false;
		}
	}}
	onresize={() => {
		trackWidth = trackRef?.getBoundingClientRect().width ?? 0;
	}}
/>
