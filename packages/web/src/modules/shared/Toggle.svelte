<script>
  export let id = '';
  export let checked = false;
  export let disabled = false;
</script>

<label for={id}>
  <div class="relative inline-block align-middle bg-transparent cursor-pointer select-none switch">
    <input {id} name={id} type="checkbox" class="sr-only" {disabled} bind:checked />
    <div
      class="{checked ? 'transform transition-colors bg-secondary' : ''} w-12 h-6 rounded-full shadow-inner bg-primary
      focus:shadow-outline" />
    <div
      class="{checked ? 'transform translate-x-full border-secondary' : ''} absolute top-0 left-0 w-6 h-6 transition-all
      duration-300 ease-in-out bg-white border-2 rounded-full border-primary " />
  </div>
</label>
