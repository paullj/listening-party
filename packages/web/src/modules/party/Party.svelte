<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { navigate } from 'svelte-routing';

  import me from '../../stores/me';
  import users from '../../stores/users';
  import party from '../../stores/party';
  import search from '../../stores/search';

  import ChangeNameModal from '../login/ChangeNameModal.svelte';
  import Player from '../player/Player.svelte';
  import Search from '../shared/Search.svelte';
  import Track from '../shared/Track.svelte';
  // import HostPartyModal from '../host/HostPartyModal.svelte';
  import { subscribeToCandidate } from './subscribeToCandidates';
  import { subscribeToOffer } from './subscribeToOffer';
  import { subscribeToAnswer } from './subscribeToAnswer';

  let unsubscribeCandidate, unsubscribeOffer, unsubscribeAnswer;
  let query;

  export let id;

  const { open } = getContext('modal');

  onMount(async () => {
    const doesPartyExist = await party.get(id);

    unsubscribeCandidate = subscribeToCandidate();
    unsubscribeOffer = subscribeToOffer();
    unsubscribeAnswer = subscribeToAnswer();

    if (doesPartyExist) {
      open({
        component: ChangeNameModal,
        options: {
          closeButton: false,
          closeOnEsc: false
        },
        callbacks: {
          onClose: () => party.join(id)
        }
      });
    } else {
      open({
        message: 'Party not found!',
        callbacks: {
          onClose: () => navigate('/')
        }
      });
    }
  });

  const cleanup = () => {
    party.leave();

    unsubscribeCandidate();
    unsubscribeOffer();
    unsubscribeAnswer();

    $users.forEach((peer) => {
      peer.close();
    });
  };

  onDestroy(() => {
    cleanup();
  });
</script>

<div class="pt-4 pb-16 sm:flex" on:unload={() => cleanup()}>
  <div class="px-6">
    <!-- Sidebar -->
    <div class="flex items-center justify-between space-x-2">
      <div>
        <h1 class="text-3xl font-bold">🎉 {$party ? $party.name : 'Loading'}</h1>
      </div>
      <div class="flex overflow-hidden">
        {#if $me.name}
          <div class="inline-block w-8 h-8 border-2 rounded-full border-background bg-primary">
            <p class="text-center uppercase align-middle text-background">{$me.name[0]}</p>
          </div>
        {/if}
        {#each $users as client}
          <div class="inline-block w-8 h-8 -ml-1 border-2 rounded-full border-background bg-secondary">
            <p class="text-center uppercase align-middle text-background">{client.name[0]}</p>
          </div>
        {/each}
      </div>
    </div>
    <!-- 
    <ul class="flex space-x-1">
      <li class="px-2 py-1 text-xs font-medium leading-none rounded-full bg-secondary text-background">Rock</li>
      <li class="px-2 py-1 text-xs font-medium leading-none rounded-full bg-secondary text-background">Blues</li>
      <li class="px-2 py-1 text-xs font-medium leading-none rounded-full bg-secondary text-background">Country</li>
    </ul>
    -->
  </div>
  <div class="px-4 mt-4">
    <!-- Player -->
    <Player />
  </div>
  <div class="flex flex-col flex-grow min-h-0">
    <Search bind:query />
    <div class="flex-grow max-h-full min-h-0 overflow-x-hidden overflow-y-auto">
      {#if query}
        {#each $search as track}
          <Track {track}>
            <button on:click={() => users.send('add-to-queue', track)}>Add</button>
          </Track>
        {/each}
      {:else}
        <!-- {#each $queue as track, i}
          <Track {track}>
            <div slot="initial">{i + 1}</div>
          </Track>
        {/each} -->
      {/if}
    </div>
  </div>
</div>
