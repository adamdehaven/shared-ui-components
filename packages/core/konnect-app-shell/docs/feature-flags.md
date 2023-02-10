# Evaluating Feature Flags

The `KonnectAppShell` automatically fetches the user's feature flags from Launch Darkly after the config and session data is successfully retrieved.

Once the user's feature flags have been fetched and the `KonnectAppShell` emits the `@ready` event, the host application can utilize the provided `evaluateFeatureFlag` helper function.


## `evaluateFeatureFlag`

> **Note**: If the `evaluateFeatureFlag` function is called before the `KonnectAppShell` emits the `@ready` event, it is highly likely the `defaultValue` will be returned.

The `evaluateFeatureFlag` function accepts two required paramters:

Parameter | Interface | Description
---------|----------|---------
`key` | `string` | The key of the Launch Darkly flag
`defaultValue` | `any` | The default value to return if the feature flag could not be fetched, does not exist, or there is an error initializing the Launch Darkly client
