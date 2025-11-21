<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/space-grotesk';
	import '@fontsource/space-mono/400.css';
	import '@fontsource/space-mono/700.css';

	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>PGditor</title>
</svelte:head>

{@render children()}
