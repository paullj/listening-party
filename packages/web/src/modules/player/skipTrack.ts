import { state } from '../../stores/state';
import users from '../../stores/users';
import { PartyEventType, PartyState } from '../../constants';
import { queue } from '../../stores/queue';
import { get } from 'svelte/store';

export const skipTrack = () => {
  queue.next();
  users.send(PartyEventType.SkipTrack, null);
};
