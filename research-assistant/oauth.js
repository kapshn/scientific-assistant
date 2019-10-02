// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

window.onload = function () {
    document.getElementById('sign-in-button').addEventListener('click', function () {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            // код работы с полученым токеном

            //проверка получения токена
            console.log("token: ", token);
        });
    });
};