# Kong NPM Registry Token Setup

## Setup Steps

1. Navigate to the `NPM Konginc` resource within the Shared vault in 1Password
1. Copy the value of the `Read Token`
1. Ensure the `NPM_TOKEN` environment variable is set to the value of the `Read Token` within your shell environment.
It is recommended to set `NPM_TOKEN` somewhat permanently by exporting the env var in your `.zshrc`, `.bashrc`, or `.bash_profile` file:

```bash
export NPM_TOKEN="[TOKEN_VALUE]"
```
