import { state } from '../../stores/state';
import users from '../../stores/users';
import { PartyEventType, PartyState } from '../../constants';
import { queue, nowPlaying } from '../../stores/queue';
import { get } from 'svelte/store';
import { skipTrack } from './skipTrack';

export const playTrack = () => {
  if (!get(nowPlaying)?.providerId) {
    skipTrack();
  }
  state.set(PartyState.Play);
  users.send(PartyEventType.ChangeState, PartyState.Play);
};
