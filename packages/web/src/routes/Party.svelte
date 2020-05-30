<script>
  import Player from '../components/player/Player.svelte';

  import search from '../assets/search-line.svg';
  import broadcast from '../assets/broadcast-fill.svg';
</script>

<div class="pt-6 pb-16 sm:flex">
  <div class="px-6">
    <!-- Sidebar -->
    <div class="flex items-center justify-between space-x-2">
      <div>
        <h1 class="text-3xl font-bold">
          <img class="inline w-8 h-8 pb-1" src={broadcast} alt="broadcast icon" />
          Party Name
        </h1>
      </div>
      <div class="flex overflow-hidden">
        <img
          class="inline-block w-8 h-8 border-2 rounded-full border-background"
          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
        <img
          class="inline-block w-8 h-8 -ml-1 border-2 rounded-full border-background"
          src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
        <img
          class="inline-block w-8 h-8 -ml-1 border-2 rounded-full border-background"
          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
          alt=""
        />
        <img
          class="inline-block w-8 h-8 -ml-1 border-2 rounded-full border-background"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt=""
        />
      </div>
    </div>

    <ul class="flex space-x-1">
      <li class="px-2 py-1 text-xs font-medium leading-none rounded-full bg-secondary text-background">Rock</li>
      <li class="px-2 py-1 text-xs font-medium leading-none rounded-full bg-secondary text-background">Blues</li>
      <li class="px-2 py-1 text-xs font-medium leading-none rounded-full bg-secondary text-background">Country</li>
    </ul>
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
