import { state } from '../../stores/state';
import users from '../../stores/users';
import { PartyEventType, PartyState } from '../../constants';

export const playTrack = () => {
  state.set(PartyState.Play);
  users.send(PartyEventType.ChangeState, PartyState.Play);
};
