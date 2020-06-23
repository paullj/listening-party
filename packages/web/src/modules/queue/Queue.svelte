<script>
  import { addToQueue } from '../queue/addToQueue';

  import { searchTerm, searchResults } from '../../stores/search';
  import { queue } from '../../stores/queue';

  import Track from '../queue/Track.svelte';
</script>

<div class="flex-grow max-h-full min-h-0 overflow-x-hidden overflow-y-auto">
  {#if $searchTerm}
    {#await $searchResults}
      <p>searching...</p>
    {:then results}
      {#each results as track}
        <Track {track}>
          <button on:click={() => addToQueue(track)}>Add</button>
        </Track>
      {/each}
    {/await}
  {:else}
    {#each $queue as track, i}
      <Track {track}>
        <div slot="initial">{i + 1}</div>
      </Track>
    {/each}
  {/if}
</div>
