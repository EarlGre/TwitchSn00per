var slider;
var volumeslider;
var output;
var volumeoutput;


function changePreviewMode(isImagePreviewMode){
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "update_imagePreviewMode", isImagePreviewMode: isImagePreviewMode})
    });
    chrome.runtime.sendMessage({action: "bg_update_imagePreviewMode", detail: isImagePreviewMode}, function(response) {

    });
}

function changeDirectoryPreviewMode(isDirpEnabled){
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "update_directoryPreviewMode", isDirpEnabled: isDirpEnabled})
    });
    chrome.runtime.sendMessage({action: "bg_update_directoryPreviewMode", detail: isDirpEnabled}, function(response) {

    });
}

// function changeChannelPointsClickerMode(isChannelPointsClickerEnabled){
//     chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {action: "update_ChannelPointsClickerMode", isChannelPointsClickerEnabled: isChannelPointsClickerEnabled})
//     });
//     chrome.runtime.sendMessage({action: "bg_update_ChannelPointsClickerMode", detail: isChannelPointsClickerEnabled}, function(response) {

//     });
// }

// function changeIsErrRefreshEnabled(isErrRefreshEnabled){
//     chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {action: "update_isErrRefreshEnabled", isErrRefreshEnabled: isErrRefreshEnabled})
//     });
//     chrome.runtime.sendMessage({action: "bg_update_isErrRefreshEnabled", detail: isErrRefreshEnabled}, function(response) {

//     });
// }

function changePreviewSize(width) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "update_previewSize", width: width})
    });
    chrome.runtime.sendMessage({action: "bg_update_previewSize", detail: width + "px"}, function(response) {

    });
}

function changeVolumeSize(width) {

}

function setSliderAndViewValues(value) {
    slider.value = value ? value:0;
    output.innerHTML = slider.value + "px";
}

function setVolumeValues(value) {
    volumeslider.value = value ? value:70;
    volumeoutput.innerHTML = volumeslider.value + "%";
}

document.addEventListener('DOMContentLoaded', function () {

    chrome.runtime.sendMessage({action: "bg_popup_opened", detail: "popup.html"}, function(response) {

    });

    window.onload = function() {
        var previewModeCheckbox = document.getElementById('TP_popup_preview_mode_checkbox');
        if(previewModeCheckbox) {
            chrome.storage.sync.get('isImagePreviewMode', function(result) {
                previewModeCheckbox.checked = typeof result.isImagePreviewMode == 'undefined' ? false : !result.isImagePreviewMode;
            });
            previewModeCheckbox.addEventListener('change', (event) => {
                if (event.target.checked) {
                    changePreviewMode(false);
                } else {
                    changePreviewMode(true);
                }
            });
        }

        var directoryPreviewCheckbox = document.getElementById('TP_popup_directory_preview_mode_checkbox');
        if(directoryPreviewCheckbox) {
            chrome.storage.sync.get('isDirpEnabled', function(result) {
                directoryPreviewCheckbox.checked = typeof result.isDirpEnabled == 'undefined' ? true : result.isDirpEnabled;
            });
            directoryPreviewCheckbox.addEventListener('change', (event) => {
                if (event.target.checked) {
                    changeDirectoryPreviewMode(true);
                } else {
                    changeDirectoryPreviewMode(false);
                }
            });
        }

    slider = document.getElementById("TP_popup_preview_size_input_slider");
    output = document.getElementById("TP_popup_preview_size_display");
    slider.min = 0;
    slider.max = 500;

    try {
        chrome.storage.sync.get('previewSize', function(result) {
            if (typeof result.previewSize == 'undefined') {
                setSliderAndViewValues(0);
            } else {
                setSliderAndViewValues(result.previewSize.width);
            }
        });
    } catch (e) {
        setSliderAndViewValues(null);
    }

    slider.onchange = function() {
        changePreviewSize(this.value);
    }

    slider.oninput = function() {
        output.innerHTML = this.value + "px";
    }

    volumeslider = document.getElementById("TP_popup_volume_mixer_input_slider");
    volumeoutput = document.getElementById("TP_popup_volume_mixer_display");
    volumeslider.min = 0;
    volumeslider.max = 100;

    try {
        chrome.storage.sync.get('volume', function(result) {
            if (typeof result.previewSize == 'undefined') {
                setVolumeValues(69);
            } else {
                setVolumeValues(result.volume.width);
            }
        });
    } catch (e) {
        setVolumeValues(null);
    }

    volumeslider.onchange = function() {
        changeVolumeSize(this.value);
    }

    volumeslider.oninput = function() {
        volumeoutput.innerHTML = this.value + "%";
    }

    // var donate_btn = document.getElementById('tp_popup_donate_btn');
    // donate_btn.addEventListener('click', (event) => {
    //     chrome.runtime.sendMessage({action: "bg_donate_btn_click", detail: ""}, function(response) {

    //     });
    // });

    // var rate_btn = document.getElementById('tp_popup_rate_btn');
    // rate_btn.addEventListener('click', (event) => {
    //     chrome.tabs.create({url:"https://chrome.google.com/webstore/detail/twitch-previews/hpmbiinljekjjcjgijnlbmgcmoonclah/reviews/"});
    //     chrome.runtime.sendMessage({action: "bg_rate_btn_click", detail: ""}, function(response) {

    //     });
    // });

    // var share_btn = document.getElementById('tp_popup_share_btn');
    // share_btn.addEventListener('click', (event) => {
    //     chrome.tabs.create({url:"https://chrome.google.com/webstore/detail/twitch-previews/hpmbiinljekjjcjgijnlbmgcmoonclah/"});
    //     chrome.runtime.sendMessage({action: "bg_share_btn_click", detail: ""}, function(response) {

    //     });
    // });
    }
});
