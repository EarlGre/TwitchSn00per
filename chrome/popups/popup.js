var slider;
var volumeslider;
var output;
var volumeoutput;

// Query the change of the preview mode
function changePreviewMode(isImagePreviewMode){
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "update_imagePreviewMode", isImagePreviewMode: isImagePreviewMode})
    });
    chrome.runtime.sendMessage({action: "bg_update_imagePreviewMode", detail: isImagePreviewMode}, function(response) {

    });
}

// Query the change of the directory preview
function changeDirectoryPreviewMode(isDirpEnabled){
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "update_directoryPreviewMode", isDirpEnabled: isDirpEnabled})
    });
    chrome.runtime.sendMessage({action: "bg_update_directoryPreviewMode", detail: isDirpEnabled}, function(response) {

    });
}

// Query the change of the preview size 
function changePreviewSize(width) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "update_previewSize", width: width})
    });
    chrome.runtime.sendMessage({action: "bg_update_previewSize", detail: width + "px"}, function(response) {

    });
}

// Query the change of the volume
function changeVolumeSize(volume) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "update_volumeSize", volume: volume})
    });
    chrome.runtime.sendMessage({action: "bg_update_volumeSize", detail: volume + "%"}, function(response) {

    });
}

// Update the preview size display in popup
function setSliderAndViewValues(value) {
    slider.value = value ? value:0;
    var trueValue = parseInt(slider.value) + 200;
    output.innerHTML = trueValue + "px";
}

//Update the volume display in popup
function setVolumeValues(value) {
    volumeslider.value = value ? value:69;
    volumeoutput.innerHTML = volumeslider.value + "%";
}

//DOM content updates
document.addEventListener('DOMContentLoaded', function () {

    chrome.runtime.sendMessage({action: "bg_popup_opened", detail: "popup.html"}, function(response) {

    });

    //when the window has finished loading
    window.onload = function() {
        var previewModeCheckbox = document.getElementById('TP_popup_preview_mode_checkbox');
        // Retrieve saved values
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
        // Retrieve saved values
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

        // Retrieve saved values
        try {
            chrome.storage.sync.get('previewSize', function(result) {
                if (typeof result.previewSize == 'undefined') {
                    setSliderAndViewValues(220);
                } else {
                    setSliderAndViewValues(result.previewSize.width);
                }
            });
        } catch (e) {
            setSliderAndViewValues(null);
        }

        // Call update function when slider values has changed
        slider.onchange = function() {
            changePreviewSize(this.value);
        }

        // Display update
        slider.oninput = function() {
            var trueValue = parseInt(this.value) + 200;
            output.innerHTML = trueValue + "px";
        }

        volumeslider = document.getElementById("TP_popup_volume_mixer_input_slider");
        volumeoutput = document.getElementById("TP_popup_volume_mixer_display");
        volumeslider.min = 0;
        volumeslider.max = 100;

        // Retrieve saved values
        try {
            chrome.storage.sync.get('volume', function(result) {
                if (typeof result.volume == 'undefined') {
                    setVolumeValues(69);
                } else {
                    setVolumeValues(result.volume);
                }
            });
        } catch (e) {
            setVolumeValues(null);
        }

        // Call update function when slider values has changed
        volumeslider.onchange = function() {
            changeVolumeSize(this.value);
        }

        // Display update
        volumeslider.oninput = function() {
            volumeoutput.innerHTML = this.value + "%";
        }
    }
});
