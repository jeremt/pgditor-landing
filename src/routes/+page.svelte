<script lang="ts">
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

	let currentImg = $state(1);
	$effect(() => {
		setInterval(() => {
			if (currentImg === 6) {
				currentImg = 1;
			} else {
				currentImg += 1;
			}
		}, 5000);
	});
</script>

<section id="intro" class="flex flex-col mx-auto items-center gap-4 px-4 pt-36">
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
			<a target="_blank" href={data.release.html_url} class="btn-main underline"
				>{data.release.tag_name}</a
			>
		{/if}
	</small>
	{#if userOS === 'mac-arm' || userOS === 'mac-intel'}
		<div class="text-sm text-error bg-bg text-center border border-error p-4 rounded-2xl">
			⚠️ Well, I dont want to give Apple 100$/year to share my app for free.<br />
			So, to use the app on mac, you might have to run this in your terminal after install:<br />
			<code class="bg-bg-1 px-1 rounded-md">xattr -cr /Applications/PGditor.app</code>
		</div>
	{/if}
	<div class="rounded-2xl p-2 border border-bg-1 flex flex-col bg-bg mt-4">
		<div class="flex gap-1 pb-1">
			<div class="rounded-full bg-bg-1 sm:w-3 sm:h-3 w-2 h-2"></div>
			<div class="rounded-full bg-bg-1 sm:w-3 sm:h-3 w-2 h-2"></div>
			<div class="rounded-full bg-bg-1 sm:w-3 sm:h-3 w-2 h-2"></div>
		</div>
		<img
			class="screenshot border border-bg-1 rounded-xl max-w-full w-3xl"
			src="/{currentImg}.webp"
			alt="Table view"
		/>
	</div>
	<div class="flex gap-2">
		{#each [1, 2, 3, 4, 5, 6] as i}
			<button
				class="rounded-full cursor-pointer w-3 h-3"
				class:bg-fg={currentImg === i}
				class:bg-bg-1={currentImg !== i}
				aria-label="i"
				onclick={() => (currentImg = i)}
			></button>
		{/each}
	</div>
</section>

<section id="features" class="flex flex-col mx-auto items-center gap-4 px-4 pt-24">
	<h2 class="font-bold text-3xl">Everything you need to manage your databases</h2>
	<p class="pb-4">Powerful features while maintaining simplicity and ease of use.</p>
	<div class="grid">
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				style:transform="rotate(90deg)"
				><path d="M9 2v6"></path><path d="M15 2v6"></path><path d="M12 17v5"></path><path
					d="M5 8h14"
				></path><path d="M6 11V8h12v3a6 6 0 1 1-12 0Z"></path></svg
			>
			<h3>Manage connections</h3>
			<p>Save multiple database connections and easily switch between databases.</p>
		</div>
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-search"
				><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg
			>
			<h3>Quick search</h3>
			<p>Quickly navigate through your tables, views and schemas.</p>
		</div>
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-square-terminal"
				><path d="m7 11 2-2-2-2"></path><path d="M11 13h4"></path><rect
					width="18"
					height="18"
					x="3"
					y="3"
					rx="2"
					ry="2"
				></rect></svg
			>
			<h3>SQL Query Editor</h3>
			<p>Built-in SQL editor syntax highlighting, and auto-complete.</p>
		</div>
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-file"
				><path
					d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
				></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path></svg
			>
			<h3>File sync</h3>
			<p>Save and import your SQL queries directly on your local filesystem.</p>
		</div>
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-braces"
				><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"></path><path
					d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"
				></path></svg
			>
			<h3>JSON Editor</h3>
			<p>Edit your json and jsonb data with a powerful VSCode-like editor.</p>
		</div>
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-link-2"
				><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line
					x1="8"
					x2="16"
					y1="12"
					y2="12"
				></line></svg
			>
			<h3>Search foreign key</h3>
			<p>Interactive foreign key selection with table visualization.</p>
		</div>
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-command"
				><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
				></path></svg
			>
			<h3>Command palette</h3>
			<p>Perform action with fast shortcuts and use command palette for quick actions.</p>
		</div>
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-funnel"
				><path
					d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"
				></path></svg
			>
			<h3>Visual filters</h3>
			<p>Filter your data with a visual editor or by writing where statments.</p>
		</div>
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="lucide lucide-download"
				><path d="M12 15V3"></path><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path
					d="m7 10 5 5 5-5"
				></path></svg
			>
			<h3>Export data</h3>
			<p>Export your table or data selection in JSON, CSV and SQL.</p>
		</div>
	</div>
</section>
<section id="features" class="flex flex-col mx-auto items-center gap-4 px-4 pt-36 pb-16">
	<h2 class="font-bold text-3xl">Want to help the project?</h2>
	<p class="pb-4 max-w-xl text-center">
		It's still a very early stage project, so the best way to help is to give it a try and report
		some bugs or suggest features through <a
			class="underline"
			href="https://github.com/jeremt/pgditor/issues"
			target="_blank"
		>
			issues
		</a>.
	</p>
	<p class="pb-4 max-w-xl text-center">
		You can also give it a star <a
			target="_blank"
			class="underline"
			href="https://github.com/jeremt/pgditor">on Github</a
		> if you feel like it :)
	</p>
</section>

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
		padding-inline: 1em;
		transition: 0.3s all;
		&.main {
			color: var(--color-bg);
			background-color: var(--color-fg);
			&:hover {
				background-color: var(--color-gold);
			}
			animation: pulse 1s infinite ease-in-out;
		}
		&.secondary {
			color: var(--color-fg);
			background-color: var(--color-bg-1);
			&:hover {
				background-color: var(--color-bg-2);
			}
		}
		&:disabled {
			opacity: 0.3;
			cursor: default;
			pointer-events: none;
		}
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	img.screenshot {
		animation: fade 0.5s ease-in-out;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		@media (max-width: 50rem) {
			grid-template-columns: repeat(2, 1fr);
		}
		@media (max-width: 35rem) {
			grid-template-columns: 1fr;
		}
		max-width: 55rem;
		width: 100%;
		gap: 1rem;
		margin-inline: auto;

		& > div {
			display: flex;
			gap: 0.5rem;
			flex-direction: column;
			padding: 1.5rem;
			border-radius: 1rem;
			border: 1px solid var(--color-bg-1);
			background-color: var(--color-bg);
			& > svg {
				width: 2rem;
				height: 2rem;
			}
			& > h3 {
				padding-top: 0.5rem;
				font-weight: bold;
				font-size: 1.2rem;
			}
		}
	}
</style>
