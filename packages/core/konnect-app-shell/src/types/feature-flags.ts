import { LDFlagValue } from 'launchdarkly-js-client-sdk'

/* eslint-disable no-unused-vars */
export enum FeatureFlags {
  MultiGeo = 'kp-14-multi-geo',
  MeshManager = 'KHCP-5485-mesh-manager',
}

export interface LaunchDarklyFeatureFlag {
  key: FeatureFlags | string
  value: LDFlagValue
  defaultValue?: LDFlagValue
}
