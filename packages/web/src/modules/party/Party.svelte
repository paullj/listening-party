<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { navigate } from 'svelte-routing';

  import me from '../../stores/me';
  import users from '../../stores/users';
  import party from '../../stores/party';
  import search from '../../stores/search';

  import Player from '../player/Player.svelte';
  import ChangeNameModal from '../login/ChangeNameModal.svelte';
  import Search from '../shared/Search.svelte';
  import Track from '../shared/Track.svelte';
  // import HostPartyModal from '../host/HostPartyModal.svelte';
  import { subscribe } from '../../utils/graphqlClient';

  const RECEIVE_CANDIDATE_SUBSCRIPTION = `
    subscription ReceiveCandidate($to: ID!){
      receiveCandidate(to: $to) {
        from {
          id
          name
        }
        candidate
      }
    }`;

  const RECEIVE_OFFER_SUBSCRIPTION = `
    subscription ReceiveOffer($me: ID!){
      receiveOffer(me: $me) {
        from {
          id
          name
        }
        offer
      }
    }`;

  const RECEIVE_ANSWER_SUBSCRIPTION = `
    subscription ReceiveAnswer($me: ID!){
      receiveAnswer(me: $me) {
        from {
          id
          name
        }
        answer
      }
    }`;

  let unsubscribeCandidate, unsubscribeOffer, unsubscribeAnswer;
  let query;

  export let id;

  const { open } = getContext('modal');

  onMount(async () => {
    const doesPartyExist = await party.get(id);

    unsubscribeCandidate = subscribe(
      RECEIVE_CANDIDATE_SUBSCRIPTION,
      ({ receiveCandidate }) => {
        const { from, candidate } = receiveCandidate;
        if (from.id !== $me.id) {
          const client = users.get(from.id);
          if (client) {
            const iceCandidate = new RTCIceCandidate(JSON.parse(candidate));
            client.peer.receiveCandidate(iceCandidate);
          }
          console.log(`received candidate from ${from.name}`);
        }
      },
      { variables: { to: id } }
    );

    unsubscribeOffer = subscribe(
      RECEIVE_OFFER_SUBSCRIPTION,
      ({ receiveOffer }) => {
        const { from, offer } = receiveOffer;
        console.log(`received offer from ${from.name}`);
        const client = users.add(from);
        client.peer.sendAnswer(JSON.parse(offer), from.id);

        console.log(`sent answer back to ${from.name}`);
      },
      { variables: { me: $me.id } }
    );

    unsubscribeAnswer = subscribe(
      RECEIVE_ANSWER_SUBSCRIPTION,
      ({ receiveAnswer }) => {
        const { from, answer } = receiveAnswer;
        const client = users.get(from.id);
        if (client) {
          client.peer.receiveAnswer(JSON.parse(answer));
        }
        console.log(`received answer from ${from.name}`);
      },
      { variables: { me: $me.id } }
    );

    if (doesPartyExist) {
      open({
        component: ChangeNameModal,
        options: {
          closeButton: false,
          closeOnEsc: false,
        },
        callbacks: {
          onClose: () => party.join(id),
        },
      });
    } else {
      open({
        message: 'Party not found!',
        callbacks: {
          onClose: () => navigate('/'),
        },
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
            <button on:click={() => addTrackToQueue(track)}>Add</button>
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
