<script>
  import YoutubePlayer from './YoutubePlayer.svelte';
  import { nowPlaying } from '../../stores/queue';

  import play from '../../assets/play-fill.svg';
  import pause from '../../assets/pause-fill.svg';
  import skip from '../../assets/skip-forward-fill.svg';

  const isPlaying = true;
</script>

<div class="w-full max-w-xs mx-auto bg-black rounded-lg shadow-xl">
  {#if $nowPlaying}
    <YoutubePlayer />
  {:else}
    <div class="w-full" style="padding-bottom: 100%" />
  {/if}
  <div class="flex items-center justify-around px-16 mt-4">
    <div />
    <div>
      <img class="w-16 h-16" src={isPlaying ? play : pause} alt="{isPlaying ? 'play' : 'pause'} icon" />
    </div>
    <div>
      <img class="w-12 h-12" src={skip} alt="skip icon" />
    </div>
  </div>
</div>
