interface NavigatorUAData {
	readonly brands: { brand: string; version: string }[];
	readonly mobile: boolean;
	readonly platform: string;
	getHighEntropyValues(hints: string[]): Promise<Record<string, unknown>>;
}

interface Navigator {
	readonly userAgentData?: NavigatorUAData;
}
