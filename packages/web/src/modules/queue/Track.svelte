<script>
  // import LazyImage from '../shared/LazyImage.svelte';

  export let track;
  const formatTime = (ms) => {
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    let secs = Math.floor((ms % (1000 * 60)) / 1000);
    if (secs < 10) {
      secs = '0' + secs;
    }

    return `${mins}:${secs}`;
  };
</script>

<li class="flex items-center justify-between flex-auto py-2 space-x-4 rounded">

  <div class="whitespace-no-wrap">
    <slot name="initial" />
  </div>
  <div class="flex-shrink-0 w-12 h-12 overflow-hidden bg-gray-900 rounded">
    {#if track.albumCover}
      <img src={track.albumCover} alt="{track.album} cover art" />
      <!-- <LazyImage src={track.albumCover} alt="{track.album} cover art" /> -->
    {/if}
  </div>
  <div class="flex-grow truncate">
    {#if track.title}
      <p class="text-sm font-semibold truncate">{track.title}</p>
    {/if}
    {#if track.artist}
      <p class="text-sm font-light truncate">{track.artist}</p>
    {/if}
  </div>
  {#if track.duration}
    <p class="font-light text-md">{formatTime(track.duration)}</p>
  {/if}

  <div class="mr-5 whitespace-no-wrap">
    <slot />
  </div>
</li>
