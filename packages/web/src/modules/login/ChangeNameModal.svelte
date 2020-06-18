<script>
  import { getContext, onMount } from 'svelte';
  import me from '../../stores/me';
  import Label from '../shared/Label.svelte';

  let newName;

  const { close } = getContext('modal');

  onMount(() => {
    const unsubscribe = me.subscribe(me => (newName = me.name));

    return () => {
      unsubscribe();
    };
  });

  const handleSubmit = () => {
    if (newName !== $me.name) {
      me.setName(newName);
    }
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
    <div class="w-full mt-8">
      <button
        type="submit"
        class="block px-12 py-3 mx-auto text-lg font-medium text-center rounded-lg shadow-sm bg-primary text-background">
        Continue
      </button>
    </div>
  </form>
</div>
