<script>
  import { onMount, onDestroy, getContext } from 'svelte';
  import { navigate } from 'svelte-routing';

  import me from '../../stores/user';
  import peers from '../../stores/peers';
  import party from '../../stores/party';

  import Player from '../player/Player.svelte';
  import ChangeNameModal from '../login/ChangeNameModal.svelte';
  // import HostPartyModal from '../host/HostPartyModal.svelte';

  import search from '../../assets/search-line.svg';
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

  export let id;
  const { open } = getContext('modal');

  onMount(async () => {
    const doesPartyExist = await party.get(id);
  
    unsubscribeCandidate = subscribe(RECEIVE_CANDIDATE_SUBSCRIPTION, ({ receiveCandidate }) => {
      const { from, candidate } = receiveCandidate;
      if (from.id === $me.id) {
        console.log('from me');
      } else {
        peers.get(from.id).connection.receiveCandidate(JSON.parse(candidate));
      }
    }, { variables: { to: id } });
  
    unsubscribeOffer = subscribe(RECEIVE_OFFER_SUBSCRIPTION, ({ receiveOffer }) => {
      const { from, offer } = receiveOffer;
      console.log(`received offer from ${from}`);

      const peer = peers.add(from);
      peer.connection.sendAnswer(JSON.parse(offer), from.id);
      console.log(`sent answer back to ${from}`);
    }, { variables: { me: $me.id } });
  
    unsubscribeAnswer = subscribe(RECEIVE_ANSWER_SUBSCRIPTION, ({ receiveAnswer }) => {
      const { from, answer } = receiveAnswer;
      peers.get(from).connection.receiveAnswer(JSON.parse(answer));

      console.log(`received answer from ${from}`);
    }, { variables: { me: $me.id } });

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

  onDestroy(() => {
    party.leave();
  
    unsubscribeCandidate();
    unsubscribeOffer();
    unsubscribeAnswer();
  
    $peers.forEach((peer) => {
      peer.close();
    });
  });
</script>

<div class="pt-4 pb-16 sm:flex">
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
        {#each $peers as peer}
          <div class="inline-block w-8 h-8 -ml-1 border-2 rounded-full border-background bg-secondary">
            <p class="text-center uppercase align-middle text-background">{peer.name[0]}</p>
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
  <div class="px-4 mt-4">
    <!-- Queue -->
    <div class="relative border-4 rounded-lg focus-within:shadow-outline border-secondary">
      <img class="absolute w-6 h-full ml-2" src={search} alt="listening party logo" />
      <input type="text" class="w-full h-12 pl-12 pr-2 bg-transparent focus:outline-none" />
    </div>
  </div>
</div>
