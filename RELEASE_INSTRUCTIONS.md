# Creating a GitHub Release

Follow these steps to publish the Prompt Wizard extension on GitHub:

## Quick Steps

1. **Go to Releases Page**
   - Navigate to: https://github.com/Justme017/Prompt-Wizard/releases/new

2. **Tag the Release**
   - Tag version: `v3.2.0`
   - Target: `main` branch

3. **Release Title**
   ```
   Prompt Wizard Extension v3.2.0 - Multi-API Support
   ```

4. **Description**
   - Copy and paste contents from `RELEASE_NOTES.md`

5. **Upload Assets**
   - Drag and drop: `release/prompt-wizard-extension-v3.2.0.zip`

6. **Check Boxes**
   - ✅ Set as the latest release
   - ⬜ Set as a pre-release (leave unchecked)

7. **Publish**
   - Click "Publish release" button

## After Publishing

The release will be available at:
- https://github.com/Justme017/Prompt-Wizard/releases/latest
- Direct download: https://github.com/Justme017/Prompt-Wizard/releases/download/v3.2.0/prompt-wizard-extension-v3.2.0.zip

## Update Links

After publishing, these README links will work automatically:
- Download badge will point to latest release
- Installation instructions reference the releases page

## Future Releases

To create future releases:
1. Update version in `extension/manifest.json`
2. Update `RELEASE_NOTES.md` with new changes
3. Run packaging script: `.\package-extension.ps1`
4. Create new release on GitHub
5. Upload the new ZIP file

---

## Package Contents

The ZIP file includes:
- `manifest.json` - Extension configuration (v3.2.0)
- `background.js` - Service worker (~60 lines)
- `content.js` - Main logic (~365 lines)
- `content.css` - Styles (~300 lines)
- `popup.html` - Settings UI
- `popup.js` - Settings logic (~320 lines)
- `icons/` - Extension icons (16, 32, 48, 128px)

Total size: ~45KB

---

**Created by:** Shubham Mehta  
**Repository:** https://github.com/Justme017/Prompt-Wizard  
**License:** CC BY-SA 4.0
