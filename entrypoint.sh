#!/usr/bin/env bash
# Starts the web server and, once tunnel settings are present, cloudflared next
# to it. If either one exits the container stops, so Docker's restart policy
# brings both back up together.
set -euo pipefail

config="${CLOUDFLARED_CONFIG:-/etc/cloudflared/config.yml}"
token_file="${CLOUDFLARED_TOKEN_FILE:-/etc/cloudflared/token}"

require_readable() {
	if [[ ! -r "$1" ]]; then
		echo "entrypoint: $1 is not readable by uid $(id -u)" >&2
		exit 1
	fi
}

# Which tunnel settings are present, if any. config.yml wins over a token.
tunnel_mode() {
	if [[ -f "$config" ]]; then
		echo config
	elif [[ -f "$token_file" ]]; then
		echo token
	elif [[ -n "${TUNNEL_TOKEN:-}" ]]; then
		echo env
	fi
}

run_tunnel() {
	case "$1" in
	config)
		# Locally-managed tunnel: config.yml plus its credentials file.
		require_readable "$config"
		exec cloudflared tunnel --no-autoupdate --config "$config" run
		;;
	token)
		# Dashboard-managed tunnel with its token saved in a file.
		require_readable "$token_file"
		exec cloudflared tunnel --no-autoupdate run --token-file "$token_file"
		;;
	env)
		# Dashboard-managed tunnel: cloudflared reads the token from TUNNEL_TOKEN.
		exec cloudflared tunnel --no-autoupdate run
		;;
	esac
}

/app/server &
pids=($!)

# The tunnel settings are mounted from the host, so they can appear after the
# container has started. Until they do, check every few seconds, then start
# cloudflared without needing a restart.
(
	mode="$(tunnel_mode)"
	if [[ -z "$mode" ]]; then
		echo "entrypoint: no tunnel settings yet; cloudflared will start when $token_file or $config appears" >&2
		while [[ -z "$mode" ]]; do
			sleep 5
			mode="$(tunnel_mode)"
		done
		echo "entrypoint: found tunnel settings, starting cloudflared" >&2
	fi
	run_tunnel "$mode"
) &
pids+=($!)

stopping=false
trap 'stopping=true; kill "${pids[@]}" 2>/dev/null' TERM INT

status=0
wait -n "${pids[@]}" || status=$?
kill "${pids[@]}" 2>/dev/null || true
wait || true

if $stopping; then
	exit 0
fi
# The server or the tunnel died on its own: always report a failure.
exit $((status == 0 ? 1 : status))
