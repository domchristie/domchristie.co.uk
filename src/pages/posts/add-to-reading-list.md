---
title: Add to Safari Reading List from Firefox
pubDate: 2022-08-21
tags:
  - macos
  - safari
  - firefox
  - chrome
  - reading list
  - applescript
---

Useful if you typically use Firefox but wish to save articles to read in Safari's Reading List (on an iPad).

1. Open the macOS Automator app
2. File menu, New, and choose Quick Action (the cog)
3. Update the following the dropdown menus:
   - Workflow receives no input
   - in Firefox
4. Click and drag the Run AppleScript action into the workflow area
5. Replace the script with the following:
   ```applescript
   -- send cmd+l and cmd+c keystrokes to FF to highlight and copy the URL
   tell application "System Events"
   keystroke "l" using {command down}
   delay 0.2
   keystroke "c" using {command down}
   delay 0.2
   key code 53 --escape
   end tell

   tell application "Safari" to add reading list item (the clipboard)
   ```
6. Save as Add to Reading List
7. Open Firefox and find an article
8. Firefox menu, Services, Add to Reading List

Adapted from: [Add Firefox URL to Reading List](https://www.alfredforum.com/topic/4778-add-firefox-url-to-reading-list/)
