import { fetchLatestRelease } from '$lib/githubApi';

export const load = async () => {
	return {
		release: await fetchLatestRelease('jeremt', 'pgditor')
	};
};
