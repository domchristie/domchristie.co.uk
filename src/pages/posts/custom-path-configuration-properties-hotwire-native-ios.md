---
title: Custom Path Configuration Properties in Hotwire Native iOS
pubDate: 2025-06-02 13:39:24
emoji: 📱
tags:
  - hotwire
  - turbo-native
  - hotwire-native
  - swift
---

Path Configuration rules in Hotwire Native provides a way for customising how a view is displayed for a particular URL pattern. Out-the-box it supports customising:

- the view's `context` (e.g. modal screen)
- the view's `presentation` i.e. how it impacts the navigation stack
- functional tweaks, such as "Done" and "Back" button display

The documentation also states: <q>You are free to add more [rule] properties as your app needs</q>, yet it doesn't mention how you can access them, or how you might use them. So after a bit of digging, and some pointers from Joe Masilotti, here's what I've discovered…

You can access the properties that match a given URL with the following:

```swift
Hotwire.config.pathConfiguration.properties(for: url)
```

And then to use this to customise a web view, subclass `HotwireWebViewController`. For example, to hide the navigation bar on a `/login` page, your path configuration might look like this:

```json
{
    "settings": {},
    "rules": [
        {
            "patterns": ["/login"],
            "properties": {
                "navigation_bar_hidden": true
            }
        }
    ]
}
```

With your custom view:

```swift
import HotwireNative

class AppWebViewController: HotwireWebViewController {
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        let properties = Hotwire.config.pathConfiguration.properties(for: currentVisitableURL)
        let navHidden = properties["navigation_bar_hidden"] as? Bool ?? false
        navigationController?.setNavigationBarHidden(navHidden, animated: false)
    }
}
```

Then configure Hotwire to use this view by default, e.g. in `AppDelegate`:

```swift
Hotwire.config.defaultViewController = { url in
    AppWebViewController(url: url)
}
```
