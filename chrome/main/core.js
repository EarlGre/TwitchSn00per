var previewDiv = null;
var isImagePreviewMode = true;
var isDirpEnabled = true;
var twitchIframe;
var PREVIEWDIV_WIDTH = 0;
var PREVIEWDIV_HEIGHT = 0;
var isHovering = false;
var lastHoveredCardEl = null;
var TP_PREVIEW_DIV_CLASSNAME = "twitch_previews_previewDiv";
var clearVidPlayInterval = null;
var volumeLevel = 0;

function isStreamerOnline(navCardEl) {
    return !!(navCardEl.querySelector('.tw-channel-status-indicator--live') || navCardEl.querySelector('.tw-svg__asset--videorerun') || !navCardEl.querySelector('.side-nav-card__avatar--offline'));
}

function getPreviewOfflineImageUrl() {
    return "url('" + chrome.runtime.getURL('../images/tp_offline.jpg') + "')";
}

function getPreviewImageUrl(navCardEl) {
        return "url('https://static-cdn.jtvnw.net/previews-ttv/live_user_" + navCardEl.href.substr(navCardEl.href.lastIndexOf("/") + 1) + "-" + PREVIEWDIV_WIDTH + "x" + Math.round(PREVIEWDIV_HEIGHT) + ".jpg?" + navCardEl.lastImageLoadTimeStamp + "')";
}

function getPreviewStreamUrl(navCardEl) {
   // return "https://player.twitch.tv/?channel=" + navCardEl.href.substr(navCardEl.href.lastIndexOf("/") + 1) + "&!controls&muted";
    //return "https://player.twitch.tv/?channel=" + navCardEl.href.substr(navCardEl.href.lastIndexOf("/") + 1) + "&muted&parent=twitch.tv";
    return "https://player.twitch.tv/?channel=" + navCardEl.href.substr(navCardEl.href.lastIndexOf("/") + 1) + "&parent=twitch.tv&muted=true";
}

// creates the video player, helper function
function createIframeElement() {
    var iframe = document.createElement("Iframe");
    iframe.borderColor = "#232323";
    // iframe.style.borderRadius = "5px";
    iframe.classList.add('animated');
    return iframe;
}

// creates the div container, helper function
function createPreviewDiv(cssClass) {
    var previewDiv = document.createElement("div");
    previewDiv.classList.add(cssClass);
    previewDiv.classList.add("animated");
    previewDiv.style.position = "fixed";
    previewDiv.style.zIndex = "9";
    previewDiv.style.backgroundSize = "cover";
    previewDiv.style.backgroundColor = "#000";
    previewDiv.style.borderRadius = "5px";

    return previewDiv;
}

// creates a container when the mouse is hovered over one of the live streams. It then displays the stream inside this container
function createAndShowDirectoryPreview() {
    previewDiv = createPreviewDiv(TP_PREVIEW_DIV_CLASSNAME);
    previewDiv.style.position = "absolute";
    previewDiv.style.left = "6px";
    previewDiv.style.top = "-6px";
    var calculatedSize = lastHoveredCardEl.getBoundingClientRect();//getCalculatedPreviewSizeByWidth(document.querySelector(".root-scrollable").getBoundingClientRect().width * 0.35);
    previewDiv.style.width = calculatedSize.width + PREVIEWDIV_WIDTH + "px";
    previewDiv.style.height = calculatedSize.height + PREVIEWDIV_HEIGHT + "px";
    previewDiv.style.display = "block";

    if(isStreamerOnline(lastHoveredCardEl)) {
        previewDiv.style.backgroundImage = getPreviewImageUrl(lastHoveredCardEl);
        twitchIframe = createIframeElement();
        if(isImagePreviewMode) {
            twitchIframe.width = calculatedSize.width + PREVIEWDIV_WIDTH + "px";
            twitchIframe.height = calculatedSize.height + PREVIEWDIV_HEIGHT + "px";
            twitchIframe.src = getPreviewStreamUrl(lastHoveredCardEl);
            previewDiv.style.visibility = "hidden";
        } else {
            twitchIframe.width = calculatedSize.width + "px";
            twitchIframe.height = calculatedSize.height + "px";
            if (twitchIframe) { // in case its from directory and user in image mode.
                twitchIframe.style.display = 'none';
                previewDiv.style.visibility = "block";
            }
        }
        previewDiv.appendChild(twitchIframe);
    } else {
        previewDiv.style.backgroundImage = getPreviewOfflineImageUrl();
        twitchIframe = createIframeElement();
        twitchIframe.width = calculatedSize.width + PREVIEWDIV_WIDTH + "px";
        twitchIframe.height = calculatedSize.height + PREVIEWDIV_HEIGHT + "px";
        twitchIframe.style.display = "none";
        previewDiv.appendChild(twitchIframe);
    }
    
    // when the mouse leaves the preview window, the preview will stop displaying
    previewDiv.onmouseleave = function () {
        isHovering = false;
        clearExistingPreviewDivs(TP_PREVIEW_DIV_CLASSNAME);
    }

    lastHoveredCardEl.parentElement.parentElement.appendChild(previewDiv);

    // if the preview is out of the viewport, shift the preview over to the left
    isOut = isOutOfViewport(previewDiv);
    if(isOut.right) {
        previewDiv.style.left = "-" + (PREVIEWDIV_WIDTH - 6) + "px";
        
        // if the preview is out of the viewport on the left or right side, it will default to original size
        isOut = isOutOfViewport(previewDiv)
        if (isOut.left) {
            previewDiv.style.left = "6px";
            previewDiv.style.width = calculatedSize.width + "px";
            previewDiv.style.height = calculatedSize.height + "px";
            twitchIframe.width = calculatedSize.width + "px";
            twitchIframe.height = calculatedSize.height + "px";
        }
    }
}

// waits for the video player to load, then displays the video player.
function waitForVidPlayAndShow(navCardEl, isFromDirectory) {
    try {
        clearVidPlayInterval = setInterval(function (){
                previewDiv.style.visibility = "visible";
                twitchIframe.style.visibility = "visible";
                clearInterval(clearVidPlayInterval);
                clearVidPlayInterval = null;
        }, 300);

    } catch (e) {

    }
}

// removes the overlay of the twitch video player. This includes the title, buttons, ect.
function clearOverlays(navCardEl, isFromDirectory) {
    try {
        // var vpo = twitchIframe.contentDocument.getElementsByClassName('video-player__overlay')[0];
        //  vpo.parentNode.removeChild(vpo);
        var vpo1 = twitchIframe.contentDocument.getElementsByClassName('top-bar tw-absolute tw-flex tw-flex-grow-1 tw-justify-content-between tw-left-0 tw-right-0 tw-top-0')[0];
        var vpo2 = twitchIframe.contentDocument.getElementsByClassName('player-controls__right-control-group tw-align-items-center tw-flex tw-flex-grow-1 tw-justify-content-end')[0];
        var vpo3 = twitchIframe.contentDocument.getElementsByClassName('volume-slider__slider-container')[0];
        vpo1.parentNode.removeChild(vpo1);
        vpo2.parentNode.removeChild(vpo2);
        vpo3.parentNode.removeChild(vpo3);

        // event listener to control the volume when the volume button is clicked
        var muteButton = twitchIframe.contentDocument.getElementsByClassName("ScCoreButton-sc-1qn4ixc-0 ixBesj tw-button-icon tw-button-icon--overlay tw-core-button")[1];
        var volumeElement = twitchIframe.contentDocument.getElementsByTagName("video")[0];
        muteButton.addEventListener("click", function() { 
            setTimeout(() => {
                volumeElement.volume = volumeLevel / 100;
            }, 100);
        });

        waitForVidPlayAndShow(navCardEl, isFromDirectory);
    } catch (e) {

    }

}

// Mouse listeners are used to find out if the video should be previewed or not
function setDirectoryMouseOverListeners(navCardEl) {
    
    // when the mouse is over a channel card, it will run a function that displays the preview and removes the overlay
    navCardEl.onmouseover = function () {
        if (previewDiv) {
            clearExistingPreviewDivs(TP_PREVIEW_DIV_CLASSNAME);
        }
        isHovering = true;
        lastHoveredCardEl = navCardEl;

        // if (isImagePreviewMode == false) {
        //     return;
        // }
        createAndShowDirectoryPreview();

        setTimeout(function () {
            if (twitchIframe && twitchIframe.contentDocument && twitchIframe.contentDocument.querySelector('video')) {
                if (isStreamerOnline(lastHoveredCardEl)) {
                    clearOverlays(navCardEl, true);
                }
            }
        }, 1000)

    };

    // when the mouse leaves the channel card, the preview will stop displaying
    navCardEl.onmouseleave = function () {
        if (previewDiv && previewDiv.style.visibility === "hidden") {
            clearExistingPreviewDivs(TP_PREVIEW_DIV_CLASSNAME);
            isHovering = false;
        }
    }

}

// For each twitch link in the directory, it will set a listener for the mouse
function refreshDirectoryNavCardsListAndListeners() {
    var directoryNavCards = document.querySelectorAll('a[data-a-target="preview-card-image-link"]');
    for (var i = 0; i < directoryNavCards.length; i++) {
        setDirectoryMouseOverListeners(directoryNavCards[i]);
    }
}

// if the directory page is open, then call the function that listens for mouseover events
function setDirectoryCardsListeners() {
    if (isDirpEnabled) {
        //if (document.querySelector('div[data-target="directory-container"]')) {
        if (document.querySelector('.common-centered-column')) {
            //setDirectoryMutationObserver();
            refreshDirectoryNavCardsListAndListeners();
        }
    }
}

// this function removes the live stream container for each twitch live stream
function clearExistingPreviewDivs(className, isFromPip) {
    var previewDivs = document.getElementsByClassName(className);
    for (var i = 0; i < previewDivs.length; i++) {
        if (previewDivs[i]) {
            previewDivs[i].parentNode.removeChild(previewDivs[i]);
        }
    }
}

// creates an object that listens for changes in the DOM. Sets the listeners for the cards
var titleMutationObserver = new MutationObserver(function(mutations) {
    setTimeout(function (){
        setDirectoryCardsListeners();
    },1000);
});

// refreshs the listeners when they browse to a different section in the directory
function setTitleMutationObserverForDirectoryCardsRefresh() {
    titleMutationObserver.observe(document.getElementsByTagName('title')[0], {
        childList: true,
        subtree: true
    });
}

// sets the preview mode to image or video
function setViewMode() {
    try {
        chrome.storage.sync.get('isImagePreviewMode', function(result) {
            if (typeof result.isImagePreviewMode == 'undefined') {
                isImagePreviewMode = true;
            } else {
                if(isImagePreviewMode) {
                    if (isImagePreviewMode !== result.isImagePreviewMode) {
                        onPreviewModeChange(result.isImagePreviewMode, false);
                    }
                } else {
                    isImagePreviewMode = result.isImagePreviewMode;
                }
            }
        });
    } catch (e) {
        onPreviewModeChange(true, false);
    }
}

// changes the preview mode and saves it to google storage
function onPreviewModeChange(imagePreviewMode, saveToStorage) {
    isImagePreviewMode = imagePreviewMode;
    clearExistingPreviewDivs(TP_PREVIEW_DIV_CLASSNAME);

    if (saveToStorage) {
        chrome.storage.sync.set({'isImagePreviewMode': imagePreviewMode}, function() {

        });
    }
}

// sets the preview size from google sync
function setPreviewSizeFromStorage() {
    if (previewDiv) {
        clearExistingPreviewDivs(TP_PREVIEW_DIV_CLASSNAME);
    }

    try {
        chrome.storage.sync.get('previewSize', function(result) {
            if (typeof result.previewSize == 'undefined') {
                setPreviewSize(getCalculatedPreviewSizeByWidth(PREVIEWDIV_WIDTH));
            } else {
                setPreviewSize(result.previewSize);
            }
        });
    } catch (e) {
        setPreviewSize(getCalculatedPreviewSizeByWidth(PREVIEWDIV_WIDTH));
    }
}

// get the calculated size
function getCalculatedPreviewSizeByWidth (width) {
    return {
        width: 1 * width,
        height: 0.5636363636363636 * width
    };
}

// set the preview size
function setPreviewSize(previewSizeObj) {
    PREVIEWDIV_WIDTH = previewSizeObj.width;
    PREVIEWDIV_HEIGHT = previewSizeObj.height;
}

// changes the preview size
function onPreviewSizeChange(width) {
    clearExistingPreviewDivs(TP_PREVIEW_DIV_CLASSNAME);
    var previewSizeObj = getCalculatedPreviewSizeByWidth(width);
    setPreviewSize(previewSizeObj);

    chrome.storage.sync.set({'previewSize': previewSizeObj}, function() {
    });
}

function setVolumeSizeFromStorage() {
    try {
        chrome.storage.sync.get('volume', function(result) {
            if (typeof result.volume == 'undefined') {
                setVolumeValues(69);
            } else {
                setVolumeValues(result.volume);
            }
        });
    } catch (e) {
        setVolumeValues(69);
    }
}

// changes the volume size
function setVolumeValues(volume) {
    volumeLevel = volume;
}

// saves the volume size
function onVolumeChange(volume) {
    setVolumeValues(volume);

    chrome.storage.sync.set({'volume': volume}, function() {
    });
}

// finds out if the displaying preview is in the viewport
var isOutOfViewport = function (elem) {

	// Get element's bounding
	var bounding = elem.getBoundingClientRect();

	// Check if it's out of the viewport on each side
	var out = {};
	out.top = bounding.top < 0;
	out.left = bounding.left < 0;
	out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
	out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
	out.any = out.top || out.left || out.bottom || out.right;
	out.all = out.top && out.left && out.bottom && out.right;
	return out;
};

// listens for changes made on the extension popup page
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    switch(msg.action) {
        case "update_imagePreviewMode":
            onPreviewModeChange(msg.isImagePreviewMode, true);
            break;
        case "update_previewSize":
            onPreviewSizeChange(msg.width);
            break;
        case "update_volumeSize":
            onVolumeChange(msg.volume);
            break;
    }
});

// when the page is fully loaded, run all of the functions
window.addEventListener('load', (event) => {
    setTimeout(function() {
        setViewMode();
        setPreviewSizeFromStorage();
        setVolumeSizeFromStorage();
        setTitleMutationObserverForDirectoryCardsRefresh()
        refreshDirectoryNavCardsListAndListeners()
    }, 2000);
});
