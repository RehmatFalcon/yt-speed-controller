const speedRangeElm = document.querySelector("#speed-range");
const speedBoxElm = document.querySelector("#speed-box");
speedRangeElm.addEventListener('input', e => updateSpeed(parseFloat(e.target.value).toFixed(2)));
speedBoxElm.addEventListener('input',e => updateSpeed(e.target.value));
function updateSpeed(value) {
    speedRangeElm.value = value;
    speedBoxElm.value = value;
    localStorage.setItem("playback-speed", value);
    chrome.runtime.sendMessage({speed: value});
}
document.addEventListener("DOMContentLoaded", () => {
    const value = localStorage.getItem("playback-speed");
    if (value) {
        speedBoxElm.value = value;
    }
    else speedBoxElm.value = 1;
    speedBoxElm.dispatchEvent(new Event("input"));
});