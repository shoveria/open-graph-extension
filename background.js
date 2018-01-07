// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Called when the user clicks on the browser action.

var min = 1;
var max = 2;
var current = min;

function updateIcon() {
  chrome.browserAction.setIcon({path:'icon' + current + '.png'});
  current++;

  if (current > max)
    current = min;
}

chrome.browserAction.onClicked.addListener(updateIcon);
updateIcon(); //sets icon

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {
    file: 'analyze.js'});
  setTimeout(updateIcon, 3000); //wait 3 seconds, reset icon; info still copied to clipboard
});
