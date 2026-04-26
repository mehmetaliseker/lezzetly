export type FeatureFlag = {
	key: string;
	enabled: boolean;
	description: string;
};

/** Backend `DefaultFeatureFlagService` ile aynı anahtar */
export const FEATURE_FLAG_PROFILE_PASSWORD_VISIBILITY = "PROFILE_PASSWORD_VISIBILITY_TOGGLE" as const;
export const FEATURE_FLAG_PROFILE_PASSWORD_CHANGE = "PROFILE_PASSWORD_CHANGE_ENABLED" as const;

export function isFeatureEnabled(flags: FeatureFlag[] | undefined, key: string): boolean {
	return flags?.find((flag) => flag.key === key)?.enabled ?? false;
}
