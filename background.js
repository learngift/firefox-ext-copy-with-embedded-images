browser.contextMenus.create({
  id: "copy-embed",
  title: "Copier avec images embarquées",
  contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy-embed") {
    browser.tabs.sendMessage(tab.id, {action: "copyWithImages"});
  }
});
