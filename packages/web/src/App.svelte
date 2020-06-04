<script>
  import { Router, Route } from 'svelte-routing';
  import './utils/graphql';

  import Party from './modules/party/Party.svelte';
  import Home from './modules/home/Home.svelte';
  import Modal from './modules/shared/Modal.svelte';
</script>

<Modal>
  <Router>
    <Route path="/party/:id">
      <Party />
    </Route>
    <Route path="/">
      <Home />
    </Route>
    <Route path="*">Not found</Route>
  </Router>
</Modal>
