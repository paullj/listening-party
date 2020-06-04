<script>
  import play from '../../assets/play-fill.svg';
  import pause from '../../assets/pause-fill.svg';
  //   import skip from '../../assets/skip-forward-fill.svg';

  const isPlaying = true;
</script>

<div class="max-w-xs mx-auto">
  <div
    class="w-full bg-black rounded-lg shadow-xl"
    style="padding-bottom: 100%" />
  <div class="flex items-center justify-around px-16 mt-4">
    <div>
      <img
        class="w-16 h-16"
        src={isPlaying ? play : pause}
        alt="{isPlaying ? 'play' : 'pause'} icon" />
    </div>
    <!-- <div>
      <img class="w-12 h-12" src={skip} alt="skip icon" />
    </div> -->
  </div>
</div>
