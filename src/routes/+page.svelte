<script lang="ts">
	import { PUBLIC_RELEASE_URL } from '$env/static/public';
	import { detectOS, type OS } from '$lib/detectOS';
	import DownloadIcon from '$lib/DownloadIcon.svelte';
	import GithubIcon from '$lib/GithubIcon.svelte';
	import Logo from '$lib/Logo.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let userOS = $state<OS>('unknown');
	$effect(() => {
		(async () => {
			userOS = await detectOS();
		})();
	});

	let hoverSound = $state<HTMLAudioElement>();
	onMount(() => {
		hoverSound = new Audio('/elephant.mp3');
		hoverSound.preload = 'auto';
	});

	const play = () => {
		console.log('play', hoverSound);
		if (hoverSound) {
			hoverSound.currentTime = 0;
			hoverSound.play();
		}
	};

	const assetForOs = $derived.by(() => {
		const release = data.release;
		if (release instanceof Error) {
			return release;
		}
		if (!release.assets) return undefined;

		switch (userOS) {
			case 'windows':
				return (
					release.assets.find((asset) => asset.name.endsWith('.exe')) ??
					release.assets.find((asset) => asset.name.endsWith('.msi'))
				);
			case 'mac-arm':
				return release.assets.find((asset) => asset.name.endsWith('aarch64.dmg'));
			case 'mac-intel':
				return release.assets.find((asset) => asset.name.endsWith('x64.dmg'));
			case 'linux':
				return release.assets.find((asset) => asset.name.endsWith('.AppImage'));
		}
	});
</script>

<main class="flex flex-col m-auto items-center gap-4 p-4">
	<Logo />
	<h1 class="sm:text-7xl text-5xl">PGditor</h1>
	<p class="sm:text-xl text-md text-center">
		A minimalistic, fast & beautiful app to manager your Postgres databases<br />
		(and it's free & open source)
	</p>
	<div class="flex items-center gap-6 flex-wrap justify-center">
		{#if !(data.release instanceof Error) && !(assetForOs instanceof Error) && assetForOs !== undefined}
			<a
				class="btn main text-xl"
				onmouseenter={play}
				onclick={play}
				href={assetForOs.browser_download_url}
			>
				<DownloadIcon />
				{#if userOS === 'mac-arm' || userOS === 'mac-intel'}
					Download for Mac
				{:else if userOS === 'windows'}
					Download for Windows
				{:else if userOS === 'linux'}
					Download for Linux
				{/if}
			</a>
		{/if}
		<a class="btn secondary text-lg" href="https://github.com/jeremt/pgditor" target="_blank"
			><GithubIcon /> View on Github</a
		>
	</div>
	<small class="text-fg-2">
		{#if !(data.release instanceof Error)}
			{#if data.release.prerelease}
				<span class="badge">Prerelease</span> |
			{/if}
			<span>Published on {new Date(data.release.published_at).toLocaleDateString()}</span> |
			<a target="_blank" href={data.release.html_url} class="btn-main">{data.release.tag_name}</a>
		{/if}
	</small>
</main>

<style>
	@keyframes pulse {
		0% {
			scale: 1;
		}
		50% {
			scale: 0.95;
		}
		100% {
			scale: 1;
		}
	}
	a.btn {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		flex-shrink: 0;
		text-wrap: nowrap;
		align-items: center;
		font-weight: bold;
		border-radius: var(--radius-btn);
		cursor: pointer;
		outline: none;
		border: none;
		height: var(--input-height);
		padding-inline: 0.8em;
		transition: 0.3s all;
		&.main {
			color: var(--color-bg);
			background-color: var(--color-fg);
			background-image: linear-gradient(transparent, var(--color-gold));
			animation: pulse 1s infinite ease-in-out;
		}
		&.secondary {
			color: var(--color-fg);
			background-color: var(--color-bg-1);
		}
		&:disabled {
			opacity: 0.3;
			cursor: default;
			pointer-events: none;
		}
		&:hover,
		&:focus-visible {
			translate: 0 -0.1rem;
		}
		&:active {
			translate: 0 0.15em;
		}
	}
</style>
