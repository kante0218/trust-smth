#!/bin/bash
cd "$(dirname "$0")"
git add -A
git commit -m "Update site: $(date '+%Y-%m-%d %H:%M')"
vercel --prod --yes
