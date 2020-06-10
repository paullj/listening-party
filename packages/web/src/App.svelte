<script>
  import { Router, Route } from 'svelte-routing';

  import Party from './modules/party/Party.svelte';
  import Home from './modules/home/Home.svelte';
  import Modal from './modules/shared/Modal.svelte';
</script>

<Modal>
  <Router>
    <Route path="/party/:id" let:params>
      <Party id={params.id}/>
    </Route>
    <Route path="/">
      <Home />
    </Route>
    <Route path="*">Not found</Route>
  </Router>
</Modal>
