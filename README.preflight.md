# Trae Preflight

This folder is prepared for `wangxt-828-1`.

Use `.env` for stable local ports and compose project identity:

- APP_PORT: 18128
- API_PORT: 19128
- WEB_PORT: 20128
- DB_PORT: 21128
- REDIS_PORT: 22128

Smoke entry:

```bash
bash scripts/smoke.sh
```

The preflight files are environment scaffolding only. The generated business
project can replace or extend them when needed.
