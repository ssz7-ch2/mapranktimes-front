<script lang="ts">
	import type { BeatmapSet } from '$lib/types/beatmap.types';
	import ModeIcon from '../ModeIcon.svelte';
	import { getContext } from 'svelte';
	import { formatDate, secToDate, secToTime } from '../utils/date';
	import { tooltip } from '$lib/tooltip';
	import { debounce } from 'lodash-es';
	import { selectedMode, touchDevice } from '../../stores';
	import BeatmapSetInfo from './BeatmapSetInfo.svelte';
	import { audioPlayer } from '$lib/utils/audio';

	type Props = {
		beatmapSet: BeatmapSet;
	};
	let { beatmapSet }: Props = $props();
	let moreInfo = $state(false);
	const probability = getContext<number>('probability');
	const showEarly = getContext<boolean>('showEarly');
	const date =
		beatmapSet.probability !== null && beatmapSet.probability >= probability && showEarly
			? beatmapSet.rank_date_early ?? beatmapSet.rank_date
			: beatmapSet.rank_date;

	const tooltipDate =
		beatmapSet.probability !== null && beatmapSet.probability >= probability && !showEarly
			? beatmapSet.rank_date_early ?? beatmapSet.rank_date
			: beatmapSet.rank_date;

	let timeoutId = $state<NodeJS.Timeout | undefined>();

	let ref: HTMLButtonElement;

	const getDiffString = (beatmapSet: BeatmapSet) =>
		`${beatmapSet.beatmaps.filter((beatmap) => beatmap.spin > 0).length} / ${
			beatmapSet.beatmaps.length
		} Diff${beatmapSet.beatmaps.length == 1 ? '' : 's'}`;

	const handleMouse = debounce((value: boolean) => {
		moreInfo = value;
	}, 150);

	const handleMouseEnter = () => {
		if (!$touchDevice) {
			handleMouse(true);
		}
	};

	const handleMouseLeave = () => {
		if (!$touchDevice) {
			handleMouse(false);
		} else {
			moreInfo = false;
		}
	};

	const handleClick = () => {
		if ($touchDevice) moreInfo = !moreInfo;
	};
</script>

<div class="relative">
	<div class="flex flex-row w-full h-28 md:h-36 overflow-hidden rounded-[12px]">
		<!-- List Square Image -->
		<button
			class="relative flex-shrink-0 w-28 md:w-36 cursor-pointer"
			data-audio-state="paused"
			onclick={() => audioPlayer.playAudio(ref, `https://b.ppy.sh/preview/${beatmapSet.id}.mp3`)}
			bind:this={ref}
		>
			<img
				class="h-full select-none object-cover"
				src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list.jpg`}
				alt=""
			/>
			<div
				class="absolute flex items-center justify-center bg-[rgba(0,0,0,0.6)] top-0 left-0 w-full h-full play-icon"
			>
				<svg
					aria-hidden="true"
					focusable="false"
					data-prefix="fas"
					data-icon="play"
					class="w-6 md:w-7 absolute play-button"
					role="img"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 384 512"
				>
					<path
						fill="currentColor"
						d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
					/>
				</svg>
				<svg
					aria-hidden="true"
					focusable="false"
					data-prefix="fas"
					data-icon="pause"
					class="w-[23px] md:w-[27px] absolute pause-button"
					role="img"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 320 512"
				>
					<path
						fill="currentColor"
						d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"
					/>
				</svg>
			</div>
		</button>
		<div class="relative w-full h-full text-left bg-neutral-900 overflow-hidden">
			<!-- Background Cover Image -->
			<a
				href={$touchDevice ? undefined : `https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`}
				target={$touchDevice ? undefined : '_blank'}
				rel="noreferrer"
			>
				<img
					class="absolute z-0 object-cover w-full h-full blur-lg brightness-[0.3] select-none"
					src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list.jpg`}
					alt=""
				/>
			</a>
			<div
				class="flex flex-col h-full w-full justify-between absolute z-10 px-1.5 md:px-2.5 pt-1 md:pt-2 pb-1.5 md:pb-2 max-w-full pointer-events-none"
			>
				<!-- Title & Artist -->
				<a
					href={`https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`}
					target={'_blank'}
					class={$touchDevice ? 'pointer-events-auto' : undefined}
					rel="noreferrer"
				>
					<div class="flex flex-col gap-[1.6px]">
						<div class="flex gap-1">
							{#if $selectedMode === -1}
								<div class="flex items-center gap-[3px] shrink-0">
									{#each beatmapSet.beatmaps
										.reduce<number[]>((modes, beatmap) => (modes.includes(beatmap.mode) ? modes : [...modes, beatmap.mode]), [])
										.sort() as mode, i}
										<ModeIcon {mode} width={15} height={15} class="select-none overflow-hidden" />
									{/each}
								</div>
							{/if}
							<h1 class="w-min max-w-full font-bold truncate leading-min">
								{beatmapSet.title}
							</h1>
						</div>

						<h1 class="w-min max-w-full font-light text-xs truncate leading-min">
							{beatmapSet.artist}
						</h1>
					</div>
				</a>

				<!-- Mapper -->
				<h2
					class="w-min font-extralight text-[10px] whitespace-nowrap text-neutral-300 pointer-events-auto leading-min"
				>
					mapped by{' '}
					<a
						href={`https://osu.ppy.sh/users/${beatmapSet.mapper_id}`}
						target="_blank"
						rel="noreferrer"
					>
						<span class="font-medium opacity-100 text-neutral-50">{beatmapSet.mapper}</span>
					</a>
				</h2>

				<!-- Rank Date -->
				<h1
					class="w-min text-yellow font-bold text-xl whitespace-nowrap pointer-events-auto leading-min my-0.5"
					use:tooltip={{
						// TODO: figure out a better way to do this
						content: `<p class="text-center text-xs px-2 py-0.5">
                  ${
										beatmapSet.unresolved
											? 'Will be ranked when mapper resolves mod'
											: `*Rank Early Probability: ${
													beatmapSet.probability === null
														? 'Unknown'
														: (beatmapSet.probability * 100).toFixed(2) + '%'
												}`
									}
                  <br />
                  <b>
                    ${secToDate(tooltipDate).toLocaleDateString('default', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}
                  </b>${' '}
                  <span style="color: #B8D3E0">
                    ${secToDate(tooltipDate)
											.toLocaleTimeString('default', {
												hour: 'numeric',
												minute: 'numeric',
												timeZoneName: 'shortOffset'
											})
											.replace('GMT', 'UTC')}
                  </span>
                </p>`,
						theme: 'black',
						duration: [200, 150],
						delay: [450, null],
						offset: [0, 5],
						animation: 'fade',
						onTrigger: (instance) => {
							if ($touchDevice)
								timeoutId = setTimeout(() => {
									instance.hide();
								}, 3000);
						},
						onHide: () => {
							clearTimeout(timeoutId);
						},
						trigger: $touchDevice ? 'click' : 'mouseenter focus'
					}}
				>
					{beatmapSet.unresolved ? 'Unresolved mod' : formatDate(secToDate(date))}
					{#if beatmapSet.probability !== null && beatmapSet.probability >= probability}
						*
						<div class="text-[11px] font-light inline-block pl-[1px] pt-[2px] align-top">
							{(beatmapSet.probability * 100).toFixed(probability == 0 ? 2 : 0)}%
						</div>
					{/if}
				</h1>

				<!-- Diffs & Length -->
				<!-- svelte-ignore a11y_missing_content -->
				<a
					class="absolute w-full h-1/4 md:h-1/3 bottom-0 -translate-x-1.5 md:-translate-x-2.5 pointer-events-auto z-[100]"
					onclick={handleClick}
					onmouseenter={handleMouseEnter}
					onmouseleave={handleMouseLeave}
					href={$touchDevice ? undefined : `https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`}
					target={$touchDevice ? undefined : '_blank'}
					rel="noreferrer"
				></a>
				<div class="flex md:flex-col gap-2 md:gap-1 w-full pointer-events-auto">
					<!-- Diffs -->
					<div class="flex items-center gap-1.5 min-w-[88px] w-max">
						<svg
							width={18}
							height={18}
							class="select-none overflow-hidden"
							role="img"
							version="1.1"
							viewBox="0 0 300 300"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g transform="scale(1 -1)">
								<path
									d="m256.25-150c0-58.594-47.656-106.25-106.25-106.25s-106.25 47.656-106.25 106.25 47.656 106.25 106.25 106.25 106.25-47.656 106.25-106.25zm43.75 0c0 82.813-67.187 150-150 150-82.812 0-150-67.187-150-150 0-82.812 67.188-150 150-150 82.813 0 150 67.188 150 150z"
									fill="#fd5"
								/>
								<path
									d="m144.02-156.58c-13.911-1.211-23.305-9.657-29.227-21.491-6.749-13.487-7.421-29.052 1.312-43.255 4.075-7.332 8.734-11.547 15.455-14.67 3.388-1.573 6.748-2.561 11.001-3.237 2.148-0.342 4.235-0.551 6.62-0.666 0.909-0.044 2.279-0.056 3.629-0.054 32.086 0.983 59.945 18.76 75.083 44.837l-0.06-0.036c-17.555-9.603-39.566-9.689-55.573-1.679-14.34 7.175-25.715 22.08-28.24 40.251zm-39.173-71.246c-9.603 17.555-9.689 39.566-1.679 55.573 7.175 14.34 22.08 25.715 40.251 28.24-1.211 13.911-9.657 23.305-21.491 29.227-13.487 6.749-29.052 7.421-43.255-1.312-7.332-4.075-11.547-8.734-14.67-15.455-1.574-3.388-2.561-6.748-3.237-11.001-0.342-2.148-0.551-4.235-0.666-6.62-0.044-0.909-0.056-2.279-0.054-3.629 0.983-32.086 18.76-59.945 44.837-75.083-0.012 0.02-0.024 0.04-0.036 0.06zm-32.674 122.99c17.555 9.603 39.566 9.689 55.573 1.679 14.34-7.175 25.715-22.08 28.24-40.251 13.911 1.211 23.305 9.657 29.227 21.491 6.749 13.487 7.421 29.052-1.312 43.255-4.075 7.332-8.734 11.547-15.455 14.67-3.388 1.573-6.748 2.561-11.001 3.237-2.148 0.342-4.235 0.551-6.62 0.666-0.909 0.044-2.279 0.056-3.629 0.054-32.086-0.983-59.945-18.76-75.083-44.837l0.06 0.036zm122.99 32.674c9.603-17.555 9.689-39.566 1.679-55.573-7.175-14.34-22.08-25.715-40.251-28.24 1.211-13.911 9.657-23.305 21.491-29.227 13.487-6.749 29.052-7.421 43.255 1.312 7.332 4.075 11.547 8.734 14.67 15.455 1.573 3.388 2.561 6.748 3.237 11.001 0.342 2.148 0.551 4.235 0.666 6.62 0.044 0.909 0.056 2.279 0.054 3.629-0.983 32.086-18.76 59.945-44.837 75.083 0.012-0.02 0.024-0.04 0.036-0.06z"
									fill="#fd5"
								/>
							</g>
						</svg>

						<h2 class="w-min whitespace-nowrap text-xs">{getDiffString(beatmapSet)}</h2>
					</div>

					<!-- Length -->
					<div class="flex items-center gap-1.5 w-max pr-3">
						<svg
							width={18}
							height={18}
							version="1.1"
							viewBox="0 0 300 300"
							class="select-none overflow-hidden"
							role="img"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g transform="scale(1 -1)">
								<path
									d="m175-81.25c0 3.516-2.734 6.25-6.25 6.25h-12.5c-3.516 0-6.25-2.734-6.25-6.25v-68.75h-43.75c-3.516 0-6.25-2.734-6.25-6.25v-12.5c0-3.516 2.734-6.25 6.25-6.25h62.5c3.516 0 6.25 2.734 6.25 6.25v87.5zm81.25-68.75c0-58.594-47.656-106.25-106.25-106.25s-106.25 47.656-106.25 106.25 47.656 106.25 106.25 106.25 106.25-47.656 106.25-106.25zm43.75 0c0 82.813-67.187 150-150 150-82.812 0-150-67.187-150-150 0-82.812 67.188-150 150-150 82.813 0 150 67.188 150 150z"
									fill="#fd5"
								/>
							</g>
						</svg>
						<h2 class="w-min text-xs">{secToTime(beatmapSet.beatmaps[0].len)}</h2>
					</div>
				</div>
			</div>

			{#if $touchDevice}
				<button
					class="absolute text-lg flex items-center justify-center w-[28.8px] md:w-9 h-[28.8px] md:h-9 right-0 bottom-0 leading-4 opacity-50 z-30 pointer-events-none"
				>
					<span class="leading-none">ⓘ</span>
				</button>
			{/if}
		</div>
	</div>
	<BeatmapSetInfo
		beatmaps={beatmapSet.beatmaps}
		{handleMouseEnter}
		{handleMouseLeave}
		{moreInfo}
		unresolved={beatmapSet.unresolved}
	/>
</div>
