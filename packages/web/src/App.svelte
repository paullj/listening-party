<script>
  import { Router, Route } from 'svelte-routing';
  import './utils/graphql';

  import Party from './routes/Party.svelte';
  import Home from './routes/Home.svelte';
  import Modal from './components/Modal.svelte';
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
