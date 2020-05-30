<script>
  import { Router, Route } from 'svelte-routing';

  // import Party from './routes/Party.svelte';
  import Home from './routes/Home.svelte';
</script>

<Router>
  <!-- <Route path="/party/:id">
    <Party />
  </Route> -->
  <Route path="/">
    <Home />
  </Route>
  <Route path="*">Not found</Route>
</Router>
