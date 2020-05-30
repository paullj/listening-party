<script>
  import { link } from 'svelte-routing';
  import logo from '../assets/radio-fill.svg';
  import githubLogo from '../assets/github-fill.svg';
</script>

<div class="pt-8 pb-16 ">
  <nav class="relative flex items-center justify-between max-w-screen-lg px-6 mx-auto xl:max-w-screen-xl">
    <div class="flex items-center flex-1">
      <div class="flex items-center justify-between w-full">
        <a class="flex items-center" href="/" use:link>
          <img class="w-6 h-6" src={logo} alt="listening party logo" />
          <span class="ml-2 text-xl font-bold text-primary">ListeningParty.fm</span>
        </a>
        <div class="flex items-center space-x-4 sm:space-x-8">
          <a class="" href="/about" use:link>
            <span class="text-base text-primary">About</span>
          </a>
          <a class="flex items-center" href="https://github.com/paullj/listening-party">
            <img class="w-6 h-6" src={githubLogo} alt="github repo" />
          </a>
        </div>
      </div>
    </div>
  </nav>
  <div class="max-w-screen-lg px-6 mx-auto mt-8 xl:max-w-screen-xl sm:mt-12 md:mt-20 xl:mt-24">
    <div class="w-full md:w-3/5 lg:w-1/2 md:mr-auto">
      <div class="text-sm font-semibold tracking-wide uppercase xl:text-base">In Development</div>
      <h2 class="mt-1 text-4xl font-extrabold leading-tight tracking-tight sm:leading-none sm:text-5xl xl:text-6xl">
        Listen to music
        <br class="hidden md:inline" />
        <span class="text-secondary">with your friends</span>
        <br class="hidden md:inline" />
        effortlessly.
      </h2>
      <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
        Host or join a party and add tracks from
        <b>Youtube*</b>
        to a shared queue.
      </p>
      <div class="mt-10 space-y-2 sm:space-y-0 sm:space-x-4 sm:flex sm:items-center">
        <a
          class="block w-full px-12 py-3 text-lg font-medium text-center rounded-lg shadow-sm bg-primary text-background"
          href="/host"
          use:link
        >
          Host
        </a>
        <div class="w-full py-2 text-sm font-semibold tracking-wide text-center uppercase xl:text-base">Or</div>
        <form class="flex w-full space-x-2" on:submit={() => alert('test')}>
          <div class="flex-grow w-full bg-white border-4 rounded-lg shadow-inner focus-within:shadow-outline">
            <input
              id="party-code"
              type="text"
              class="block h-full px-4 font-mono bg-transparent focus:outline-none"
              placeholder="Party code"
            />
          </div>
          <button
            type="submit"
            class="block px-12 py-3 text-lg font-medium text-center rounded-lg shadow-sm bg-primary text-background"
          >
            Join
          </button>
        </form>
      </div>
      <div class="mt-4 text-xs tracking-wide xl:text-sm">* Spotify and Soundcloud coming soon</div>
    </div>
  </div>
</div>
