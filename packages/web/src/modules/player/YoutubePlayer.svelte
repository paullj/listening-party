<script context="module">
  let isPlayerReady = false;
</script>

<script>
  import { onMount } from 'svelte';
  const youtubeApiSource = 'https://www.youtube.com/iframe_api';
  
  let player;
  let isPlaying;

  onMount(() => {
    if (!isScriptLoaded(youtubeApiSource)) {
      const tag = document.createElement('script');
      tag.src = youtubeApiSource;
      const rootScript = document.getElementsByTagName('script')[0];
      rootScript.parentNode.insertBefore(tag, rootScript);
    }
    window.onYouTubeIframeAPIReady = function () {
      window.dispatchEvent(new Event('youtubePlayerReady'));
    };
    window.addEventListener('youtubePlayerReady', function () {
      if (isPlayerReady === false) {
        isPlayerReady = true;
        createPlayer();
      }
    });
  });

  const isScriptLoaded = (url = '') => {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
      if (scripts[i].src === url) return true;
    }
    return false;
  };

  const onStateChange = (event) => {
    // console.log(event);
  };

  const createPlayer = (videoId) => {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      player = new YT.Player('player', {
        videoId,
        playerVars: {
          origin: window.location.origin,
          controls: 0,
          disablekb: 1,
          iv_load_policy: 3,
          modestbranding: 1,
          fs: 0
        },
        events: {
          onReady: (event) => resolve(event),
          onStateChange,
          onError: (error) => console.log(error)
        }
      });
    });
  };

  export const setById = async (videoId) => {
    if (player) player.loadVideoById(videoId, 0);
  };

  export const play = async () => {
    if (!player) await createPlayer();

    isPlaying = isPlaying ? player.pauseVideo() : player.playVideo();
  };
</script>

<div class="relative w-full" style="padding-top: 100%">
  <div id="player" class="absolute inset-0 w-full h-full bg-black" />
</div>
