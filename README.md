# Pocket Grimoire — public beta

Unofficial Vampire Survivors companion: evolution recipes, run planning, unlock tracking, a connected codex and spoiler-aware guides. Not affiliated with or endorsed by poncle.

[Open the companion](https://szambaik.github.io/hentire-survivor/)

## Beta status

- Full existing Hungarian guide; **English preview**, not a complete translation. Untranslated long-form content remains Hungarian, with an explicit notice.
- Original book identity and PWA icons, no personal portrait in the current site.
- Saves remain in the same browser under the existing storage keys. No account, first-party analytics or cloud sync.
- Spoiler gates for late-game progression, secrets and Red Death; individual secret solutions still require disclosure. Names and recipes can appear in search.
- New visitors have no assumed unlocks or DLC ownership.
- Game data is an earlier compilation, **not newly verified against every current game version**. The UI revision date is not a data-verification date.
- No payment or donations. **Third-party artwork rights are not cleared by this release.**

## Development

Node.js 22 or newer. No runtime package installation required.

```sh
node source/build-hentire.js
node tests/library.test.cjs
node tests/public-beta.test.cjs
```

`source/` contains the editable templates and scripts. The build embeds JavaScript, CSS, branding and fonts in `index.html`. Game images still use wiki URLs. The manifest, service worker and install icons are the PWA support files. A web server is needed for service workers and normal browser testing; a file preview is not a supported PWA environment.

## Feedback

[Open a GitHub issue](https://github.com/szambaik/hentire-survivor/issues/new/choose). A GitHub account is required and reports are public. Include your device/browser, game version, affected item and reproduction steps. Do not attach personal data or a full save.

## Before wider promotion

1. Complete and review English long-form translations.
2. Audit current game data and document version coverage.
3. Verify artwork provenance and obtain appropriate permissions, including for a free public app. See [ASSET-RIGHTS.md](ASSET-RIGHTS.md).
4. Check name/domain/trademark availability before treating Pocket Grimoire as a settled commercial brand.
5. Test with 10–20 players. No community announcements have been posted by this release.

## Historical privacy

The current site has been depersonalized. Earlier Git commits contained personal branding and embedded imagery. A normal commit does **not** remove those from repository history or external caches. History rewriting/purging has not been performed; it requires a separate, coordinated decision.
