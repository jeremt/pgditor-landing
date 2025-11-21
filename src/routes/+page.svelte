<script lang="ts">
	import { PUBLIC_RELEASE_URL } from '$env/static/public';
	import DownloadIcon from '$lib/DownloadIcon.svelte';
	import GithubIcon from '$lib/GithubIcon.svelte';
	import Logo from '$lib/Logo.svelte';
	import { onMount } from 'svelte';

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
</script>

<main class="flex flex-col m-auto items-center gap-4 p-4">
	<Logo />
	<h1 class="text-7xl">PGditor</h1>
	<p class="text-xl text-center">
		An open source, minimalistic, and fast editor to work with your Postgres databases.
	</p>
	<div class="flex items-center gap-6">
		<a class="btn main text-xl" onmouseenter={play} onclick={play} href={PUBLIC_RELEASE_URL}
			><DownloadIcon /> Download for Mac</a
		>
		<span>or</span>
		<a class="btn secondary text-lg" href="https://github.com/jeremt/pgditor" target="_blank"
			><GithubIcon /> View on Github</a
		>
	</div>
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
