// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// Handler of extension button
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.windows.create({
        // Just use the full URL if you need to open an external page
        url: chrome.runtime.getURL("popup.html"),
        type: "popup", // window without toolbar
        state: "maximized",
    });
});

