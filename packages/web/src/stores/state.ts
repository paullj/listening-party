import { writable } from 'svelte/store';
import { PartyState } from '../constants';

export const state = writable(PartyState.Stop);
