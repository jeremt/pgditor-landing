export type OS = 'mac-arm' | 'mac-intel' | 'windows' | 'linux' | 'unknown';
export const detectOS = async (): Promise<OS> => {
	// 1. Modern API (Chrome, Edge, Brave)
	if ('userAgentData' in navigator && navigator.userAgentData !== undefined) {
		const uaData = navigator.userAgentData;
		const platform = uaData.platform.toLowerCase();

		if (platform === 'macos') {
			try {
				const hints = await uaData.getHighEntropyValues(['architecture']);
				return hints.architecture === 'arm' ? 'mac-arm' : 'mac-intel';
			} catch {
				return 'mac-intel'; // Fallback
			}
		} else if (platform === 'windows') {
			return 'windows';
		} else if (platform === 'linux') {
			return 'linux';
		}
	}
	// 2. Fallback for Safari/Firefox (using frozen UA string + Feature Detection)
	else {
		const ua = navigator.userAgent;
		if (ua.includes('Macintosh')) {
			// Detect Silicon vs Intel via GPU rendering name
			const canvas = document.createElement('canvas');
			const gl = canvas.getContext('webgl');
			const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
			const renderer = debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
			return renderer.includes('Apple') && !renderer.includes('Intel') ? 'mac-arm' : 'mac-intel';
		} else if (ua.includes('Windows')) {
			return 'windows';
		} else if (ua.includes('Linux')) {
			return 'linux';
		}
	}
	return 'unknown';
};
