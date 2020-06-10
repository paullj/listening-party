<script>
  export let text = '';
  export let description = '';
</script>

<div class="mb-4 space-y-1">
  <h3 class="ml-1 text-sm font-semibold tracking-wider uppercase">{text}</h3>
  <slot />
  <p class="ml-1 text-xs font-light">{description}</p>
</div>
