# Contributing

## Development

Make changes in `www/smart-heating-card.js` and keep the runtime copy at `custom_components/smart_heating/www/smart-heating-card.js` synchronized. Run the repository checks before committing:

```bash
python3 -m unittest discover -v
python3 -m py_compile custom_components/smart_heating/*.py
node --check www/smart-heating-card.js
cmp www/smart-heating-card.js custom_components/smart_heating/www/smart-heating-card.js
```

The GitHub Actions workflow runs the same checks automatically. Keep the integration version in `custom_components/smart_heating/manifest.json` aligned with the release tag.

## Pull requests

Describe the user-visible behavior, include tests for logic changes, and update `CHANGELOG.md` for user-facing fixes. Do not commit generated `__pycache__` files or local Home Assistant configuration.
