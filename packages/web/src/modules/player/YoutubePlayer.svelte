<script context="module">
  let isPlayerReady = false;
  const youtubeApiSource = 'https://www.youtube.com/iframe_api';

  const isScriptLoaded = (url = '') => {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
      if (scripts[i].src === url) return true;
    }
    return false;
  };

  if (!isScriptLoaded(youtubeApiSource)) {
    const tag = document.createElement('script');
    tag.src = youtubeApiSource;
    const rootScript = document.getElementsByTagName('script')[0];
    rootScript.parentNode.insertBefore(tag, rootScript);
  }
  window.onYouTubeIframeAPIReady = () => {
    isPlayerReady = true;
  };
</script>

<script>
  import { onMount } from 'svelte';
  import { nowPlaying } from '../../stores/queue';
  import { state } from '../../stores/state';
  import { PartyState } from '../../constants';
  
  let player;

  onMount(async () => {
    if (isPlayerReady) {
      await createPlayer();
    }

    const unsubscribeNowPlaying = nowPlaying.subscribe((value) => {
      if (value && value.providerId) {
        setById(value.providerId);
      } else {
        stop();
      }
    });
    const unsubscribeState = state.subscribe((value) => {
      switch (value) {
        case PartyState.Play:
          play();
          break;
        case PartyState.Pause:
          pause();
          break;
        default:
          stop();
          break;
      }
    });

    return () => {
      unsubscribeNowPlaying();
      unsubscribeState();
    };
  });

  const onStateChange = (event) => {
    // console.log(event);
  };

  const createPlayer = (videoId) => {
    return new Promise((resolve) => {
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
          onError: (error) => console.error(error)
        }
      });
    });
  };

  export const setById = async (videoId) => {
    if (player) {
      player.loadVideoById(videoId, 0);
    } else {
      createPlayer(videoId);
    }
    $state === PartyState.Play ? play() : stop();
};

  export const play = async () => {
    if (!player) {
      await createPlayer();
    }
    player.playVideo();
  };
  
  export const pause = async () => {
    if (!player) {
      await createPlayer();
    }
    player.pauseVideo();
  };
  
  export const stop = async () => {
    if (!player) {
      await createPlayer();
    }
    player.stopVideo();
  };
</script>

<div class="relative w-full cursor-not-allowed pointer-events-none" style="padding-top: 100%">
  <div id="player" class="absolute inset-0 w-full h-full bg-black rounded-lg" />
</div>
