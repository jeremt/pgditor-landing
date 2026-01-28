import { catchError } from './catchError';

export type Release = {
	tag_name: string;
	published_at: string;
	html_url: string;
	prerelease: boolean;
	assets: {
		name: string;
		browser_download_url: string;
	}[];
};

export const fetchLatestRelease = async (user: string, repo: string): Promise<Release | Error> => {
	const res = await catchError(fetch(`https://api.github.com/repos/${user}/${repo}/releases`));
	if (res instanceof Error) {
		return res;
	}
	if (!res.ok) {
		return new Error('Could not fetch releases from GitHub');
	}

	const data = await catchError(res.json() as Promise<Release[]>);
	if (data instanceof Error) {
		return data;
	}
	if (!data || data.length === 0) {
		return new Error('No release');
	}
	return data[0]; // The first one is the most recent
};
