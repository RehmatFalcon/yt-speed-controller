let playbackRate = localStorage.getItem("playback-speed");
if(!playbackRate) playbackRate = 1;
playbackRate = parseFloat(playbackRate).toFixed(2);
chrome.webNavigation.onCompleted.addListener(function() {
    chrome.tabs.executeScript({
        code: `
        function GetPlayer() { return document.querySelector(".video-stream.html5-main-video"); }
        function SetPlaybackRate(rate) {
          let player = GetPlayer();
          if(player) player.playbackRate = rate;
        }
        function GetDomPlayerRate() {
          let player = GetPlayer();
          if(player) return player.playbackRate;
          else return 1;
        }
        SetPlaybackRate(${playbackRate});
        function SyncDomSpeed() {
           chrome.runtime.sendMessage({speed: GetDomPlayerRate()});
        }
        setInterval(SyncDomSpeed, 5000);
        `
      });
      chrome.browserAction.setBadgeText({text: `${playbackRate}`});
}, {url: [{urlMatches : 'https://www.youtube.com/'}]});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {           
    if (request.speed) {
      playbackRate = parseFloat(request.speed).toFixed(2);
      localStorage.setItem("playback-speed", playbackRate);
      chrome.browserAction.setBadgeText({text: `${playbackRate}`});
      chrome.tabs.executeScript({
        code: `
         (typeof SetPlaybackRate === 'function') && SetPlaybackRate(${request.speed});
        `
      });
      sendResponse();
    }    
  });