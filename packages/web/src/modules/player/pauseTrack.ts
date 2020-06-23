import { state } from '../../stores/state';
import users from '../../stores/users';
import { PartyEventType, PartyState } from '../../constants';

export const pauseTrack = () => {
  state.set(PartyState.Pause);
  users.send(PartyEventType.ChangeState, PartyState.Pause);
};
