<script>
  import { playTrack } from './playTrack';
  import { pauseTrack } from './pauseTrack';

  import { nowPlaying } from '../../stores/queue';
  import { state } from '../../stores/state';

  import YoutubePlayer from './YoutubePlayer.svelte';

  import { PartyState } from '../../constants';
  import play from '../../assets/play-fill.svg';
  import pause from '../../assets/pause-fill.svg';
  import skip from '../../assets/skip-forward-fill.svg';

  const toggleState = () => {
    if ($state !== PartyState.Play) {
      playTrack();
    } else {
      pauseTrack();
    }
  };
</script>

<div class="w-full max-w-xs mx-auto">
  <div class="bg-black rounded-lg shadow-xl">
    {#if $nowPlaying && $state !== PartyState.Stop}
      <YoutubePlayer />
    {:else}
      <div class="w-full" style="padding-bottom: 100%" />
    {/if}
  </div>
  <div class="flex items-center justify-around px-16 mt-4">
    <div />
    <button on:click={toggleState}>
      <img
        class="w-16 h-16"
        src={$state === PartyState.Play ? pause : play}
        alt="{$state === PartyState.Play ? 'pause' : 'play'} icon" />
    </button>
    <div>
      <img class="w-12 h-12" src={skip} alt="skip icon" />
    </div>
  </div>
</div>
