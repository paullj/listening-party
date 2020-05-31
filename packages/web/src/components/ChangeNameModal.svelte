<script>
  import user from '../store/user';
  import { getContext } from 'svelte';

  let newName = $user.name;

  const { close } = getContext('modal');

  const handleSubmit = () => {
    if (newName) {
      user.changeName(newName);
      close();
    }
  };
</script>

<form class="flex w-full space-x-2" on:submit={handleSubmit}>
  <div class="flex-grow w-full bg-white border-4 rounded-lg shadow-inner focus-within:shadow-outline">
    <input
      id="party-code"
      type="text"
      required
      class="block h-full px-4 bg-transparent focus:outline-none"
      placeholder="Enter your name"
      bind:value={newName} />
  </div>
  <button
    type="submit"
    class="block px-12 py-3 text-lg font-medium text-center rounded-lg shadow-sm bg-primary text-background">
    Join
  </button>
</form>
