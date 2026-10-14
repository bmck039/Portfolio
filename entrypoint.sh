#!/usr/bin/env bash
# Starts the web server and, when a tunnel is configured, cloudflared next to it.
# If either one exits the container stops, so Docker's restart policy brings
# both back up together.
set -euo pipefail

config="${CLOUDFLARED_CONFIG:-/etc/cloudflared/config.yml}"

/app/server &
pids=($!)

if [[ -f "$config" ]]; then
	if [[ ! -r "$config" ]]; then
		echo "entrypoint: $config is not readable by uid $(id -u)" >&2
		exit 1
	fi
	cloudflared tunnel --no-autoupdate --config "$config" run &
	pids+=($!)
elif [[ -n "${TUNNEL_TOKEN:-}" ]]; then
	# Dashboard-managed tunnel: cloudflared reads the token from TUNNEL_TOKEN.
	cloudflared tunnel --no-autoupdate run &
	pids+=($!)
else
	echo "entrypoint: no $config and no TUNNEL_TOKEN, running without a tunnel" >&2
fi

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
