#!/bin/sh
# Runs at Claude Code start on Mac when `node` isn't found: installs Node.js LTS once,
# then copies the status line script with the new node. The Mac asks once for the password.
case "$(uname -s)" in Darwin) ;; *) exit 0 ;; esac
config="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
marker="$config/.status-bar-node-install"
[ -e "$marker" ] && exit 0
mkdir -p "$config" && date > "$marker"

if command -v brew >/dev/null 2>&1; then
  brew install node >/dev/null 2>&1
else
  version=$(curl -fsSL https://nodejs.org/dist/index.json | tr '{' '\n' | grep -v '"lts":false' | grep -o '"version":"v[0-9.]*"' | head -1 | cut -d'"' -f4)
  pkg="${TMPDIR:-/tmp}/node-$version.pkg"
  [ -n "$version" ] && curl -fsSL -o "$pkg" "https://nodejs.org/dist/$version/node-$version.pkg" &&
    osascript -e "do shell script \"installer -pkg '$pkg' -target /\" with administrator privileges" >/dev/null 2>&1
  rm -f "$pkg"
fi

for node in /opt/homebrew/bin/node /usr/local/bin/node; do
  if [ -x "$node" ]; then
    "$node" "$(dirname "$0")/copy-statusline.cjs"
    echo '{"systemMessage":"Node.js is installed for the status bar. Close and reopen Claude Code to see it."}'
    exit 0
  fi
done
echo '{"systemMessage":"The status bar needs Node.js, and the install did not finish. Install Node.js LTS from https://nodejs.org, then reopen Claude Code."}'
exit 0
