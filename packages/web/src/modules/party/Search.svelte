<script>
import { searchTerm } from '../../stores/search';
import searchIcon from '../../assets/search-line.svg';
</script>

<div class="px-4 mt-4">
  <div class="relative border-4 rounded-lg focus-within:shadow-outline border-secondary">
    <img class="absolute w-6 h-full ml-2" src={searchIcon} alt="listening party logo" />
    <input
      type="text"
      placeholder="Search for a track or artist"
      class="w-full h-12 pl-12 pr-2 bg-transparent focus:outline-none"
      bind:value={$searchTerm} />
  </div>
</div>
                 