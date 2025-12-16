export interface FeatureFlags {
  enableUsers: boolean;
}

export interface RuntimeAppConfig {
  apiBaseUrl: string;
  featureFlags: FeatureFlags;
}
