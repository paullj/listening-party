<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { dispatcher } from '../utils/WebSocketDispatcher';
  import { joinParty } from '../modules/party/joinParty';
  import me from '../store/user';

  import Player from '../components/player/Player.svelte';
  import ChangeNameModal from '../components/ChangeNameModal.svelte';

  import search from '../assets/search-line.svg';
  import peers from '../store/peers';

  onMount(() => {
    const { open } = getContext('modal');
    joinParty('test');

    if (!$me.name) {
      open({
        component: ChangeNameModal,
        options: {
          closeButton: false,
          closeOnEsc: false
        },
        callbacks: {
          onClose: () => {
            dispatcher.send('join', {
              roomId: 'test room',
              username: $me.name
            });
          }
        }
      });
    } else {
      dispatcher.send('join', {
        roomId: 'test room',
        username: $me.name
      });
    }
  });

  onDestroy(() => {
    $peers.forEach(peer => {
      peer.close();
    });
  });
</script>

<div class="pt-4 pb-16 sm:flex">
  <div class="px-6">
    <!-- Sidebar -->
    <div class="flex items-center justify-between space-x-2">
      <div>
        <h1 class="text-3xl font-bold">🎉 Party Name</h1>
      </div>
      <div class="flex overflow-hidden">
        <div class="inline-block w-8 h-8 border-2 rounded-full border-background bg-primary">
          <p class="text-center uppercase align-middle text-background">{$me.name[0]}</p>
        </div>

        {#each $peers as peer}
          <div class="inline-block w-8 h-8 -ml-1 border-2 rounded-full border-background bg-secondary">
            <p class="text-center uppercase align-middle text-background">G</p>
          </div>
        {/each}

      </div>
    </div>
    <!-- 
    <ul class="flex space-x-1">
      <li class="px-2 py-1 text-xs font-medium leading-none rounded-full bg-secondary text-background">Rock</li>
      <li class="px-2 py-1 text-xs font-medium leading-none rounded-full bg-secondary text-background">Blues</li>
      <li class="px-2 py-1 text-xs font-medium leading-none rounded-full bg-secondary text-background">Country</li>
    </ul> -->
  </div>
  <div class="px-4 mt-4">
    <!-- Player -->
    <Player />
  </div>
  <div class="px-4 mt-4">
    <!-- Queue -->
    <div class="relative border-4 rounded-lg focus-within:shadow-outline border-secondary">
      <img class="absolute w-6 h-full ml-2" src={search} alt="listening party logo" />
      <input type="text" class="w-full h-12 pl-12 pr-2 bg-transparent focus:outline-none" />
    </div>
  </div>
</div>
