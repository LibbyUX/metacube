# Agent notes

Notes for AI coding agents working in this repository.

## CI runner image change from October 19, 2026

On 2026-10-06, GitHub Actions printed this notice on the `Validate` workflow: "The `ubuntu-latest` label will migrate to Ubuntu 26 beginning October 19, 2026." Details: <https://github.com/actions/runner-images/issues/14748>.

All three CI jobs run on `ubuntu-latest`:

- `validate` in [`.github/workflows/validate.yml`](.github/workflows/validate.yml)
- `build` and `deploy` in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

If a workflow starts failing on or after October 19, 2026 without a related code change, suspect the runner image first:

1. Compare the runner image shown in the "Set up job" step with the last passing run.
2. To confirm, temporarily pin the failing job to `runs-on: ubuntu-24.04` and rerun it.
3. Fix the incompatibility, then return the job to `ubuntu-latest`.
