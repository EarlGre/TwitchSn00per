(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;
i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();
    a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;
    a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-190295961-1', 'auto');

ga('set', 'checkProtocolTask', null);
ga('send', 'pageview', 'main');

var HEART_BEAT_INTERVAL_MS = 325000;
var lastHeartBeat = new Date().getTime() - HEART_BEAT_INTERVAL_MS;

chrome.runtime.onInstalled.addListener(function(details) {
    var manifestData = chrome.runtime.getManifest();
    var appVer = "v" + manifestData.version;
    
    if (details.reason === "install")
    {
        ga('send', 'event', 'ts_install', 'ts_install-' + appVer, 'ts_install-' + appVer);
    } else {
        if (details.reason === "update") {

           /* if (details.previousVersion !== "1.5.3.0") {
                chrome.storage.sync.set({'hasConfirmedUpdatePopup': false}, function() {

                });
            }*/


           /* if (details.previousVersion === "1.5.1.6") {
                chrome.tabs.create({url:"../popups/updatePopup.html"});
                ga('send', 'event', 'updatePopup_show-' + appVer, 'updatePopup_show-' + appVer, 'updatePopup_show-' + appVer);
            }*/
            ga('send', 'event', 'updated-' + appVer, 'updated-' + appVer, 'updated-' + appVer);
        }
    }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    switch(msg.action) {
        case "bg_update_imagePreviewMode":
            ga('send', 'event', 'preview_mode', 'change', msg.detail ? "image":"video");
            break;
        case "bg_update_directoryPreviewMode":
            ga('send', 'event', 'dirp_mode', 'change', msg.detail ? "dirp_ON":"dirp_OFF");
            break;
        case "bg_update_previewSize":
            ga('send', 'event', 'preview_size', 'change', msg.detail);
            break;
        case "bg_update_volumeSize":
            ga('send', 'event', 'volume_size', 'change', msg.detail);
            break;
        case "bg_popup_opened":
            ga('send', 'event', 'popup_opened', 'popup.html', 'popup.html');
            break;
        case "bg_pip_started":
            ga('send', 'event', 'pip_started', 'pip_started', 'pip_started');
            break;
        case "appStart":
            ga('send', 'event', 'appStart', 'content.js', msg.detail);
            break;
        default:
    }
    sendResponse({ result: "any response from background" });
    return true;
});