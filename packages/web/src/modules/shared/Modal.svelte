<script>
  import { setContext } from 'svelte';
  import { fade } from 'svelte/transition';
  import closeIcon from '../../assets/close-line.svg';

  export let closeButton = true;
  export let closeOnEsc = true;
  export let closeOnOuterClick = false;

  const defaultOptions = {
    closeButton,
    closeOnEsc,
    closeOnOuterClick
  };

  let state = { ...defaultOptions };
  let _component = null;
  let _message = null;
  let _props = null;
  let background;
  let wrap;

  let onOpen = () => {};
  let onClose = () => {};
  let onOpened = () => {};
  let onClosed = () => {};

  const open = ({ component = null, message = '', props = {}, options = {}, callbacks = {} }) => {
    _component = component;
    _message = message;
    _props = props;
    state = { ...defaultOptions, ...options };
    onOpen = callbacks.onOpen || onOpen;
    onClose = callbacks.onClose || onClose;
    onOpened = callbacks.onOpened || onOpened;
    onClosed = callbacks.onClosed || onClosed;
  };

  const close = (callback = {}) => {
    onClose = callback.onClose || onClose;
    onClosed = callback.onClosed || onClosed;
    _message = null;
    _component = null;
    _props = null;
  };

  const handleKeyup = event => {
    if ((_component || _message) && state.closeOnEsc && event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };
  const handleOuterClick = event => {
    if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) {
      event.preventDefault();
      close();
    }
  };
  setContext('modal', { open, close });
</script>

<svelte:window on:keyup={handleKeyup} />

{#if _component || _message}
  <div
    class="fixed z-40 flex flex-col justify-center w-screen h-screen bg-black bg-opacity-75"
    on:click={handleOuterClick}
    bind:this={background}>
    {#if state.closeButton}
      <button on:click={close} class="absolute top-0 right-0 z-50 w-8 h-8 mt-8 mr-8 text-white focus:outline-none">
        <img src={closeIcon} style="filter: brightness(0) invert(1);" alt="close modal button" />
        <p>(Esc)</p>
      </button>
    {/if}
    <div class="relative max-h-full m-10" bind:this={wrap}>
      <div
        class="relative w-full max-h-full mx-auto my-4 rounded-lg sm:max-w-md md:max-w-xl bg-background"
        on:introstart={onOpen}
        on:outrostart={onClose}
        transition:fade="{{ duration: 200 }}"
        on:introend={onOpened}
        on:outroend={onClosed}>
        <div style="max-height: calc(100vh - 8rem)" class="relative p-4 overflow-auto">
          {#if _component}
            <svelte:component this={_component} {..._props} />
          {:else}
            <p>{_message}</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<slot />
