<script>
  import { getContext, onMount } from 'svelte';
  import user from '../../stores/user';

  import Toggle from '../shared/Toggle.svelte';
  import Label from '../shared/Label.svelte';

  let newName;
  let partyName;
  let isPublic = true;

  const { close } = getContext('modal');

  onMount(() => {
    const unsubscribe = user.subscribe(user => (newName = user.name));

    return () => {
      unsubscribe();
    };
  });

  const handleSubmit = () => {
    // const oldName = $user.name;
    // if (!oldName) {
    //   login(newName);
    // } else if (newName !== oldName) {
    //   user.changeName(newName);
    // }
    close();
  };
</script>

<div class="px-4 pt-4 pb-2">
  <!-- <h2 class="mb-2 text-xl font-semibold">Host a party</h2> -->
  <form class="w-full" on:submit|preventDefault={handleSubmit}>
    <Label text="Name" description="What do you want others to see you as?">
      <div class="flex-grow w-full h-10 bg-white border-4 rounded-lg shadow-inner focus-within:shadow-outline">
        <input
          type="text"
          required
          class="block w-full h-full px-4 bg-transparent focus:outline-none"
          placeholder="Enter your name"
          bind:value={newName} />
      </div>
    </Label>
    <hr class="my-8" />
    <Label text="Party Name" description="Kinda self expanatory">
      <div class="flex-grow w-full h-10 bg-white border-4 rounded-lg shadow-inner focus-within:shadow-outline">
        <input
          type="text"
          required
          class="block w-full h-full px-4 bg-transparent focus:outline-none"
          placeholder={newName ? newName + "'s Party" : 'Not a party just a get together'}
          bind:value={partyName} />
      </div>
    </Label>
    <Label text="Public" description="Is this party public or private?">
      <Toggle bind:checked={isPublic} id="is-public" />
    </Label>
    <div class="w-full mt-8">
      <button
        type="submit"
        class="block px-12 py-3 mx-auto text-lg font-medium text-center rounded-lg shadow-sm bg-primary text-background">
        Host
      </button>
    </div>
  </form>
</div>
