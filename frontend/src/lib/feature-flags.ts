export type FeatureFlag = {
	key: string;
	enabled: boolean;
	description: string;
};

export function isFeatureEnabled(flags: FeatureFlag[] | undefined, key: string): boolean {
	return flags?.find((flag) => flag.key === key)?.enabled ?? false;
}
