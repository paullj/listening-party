import { skipTrack } from './modules/player/skipTrack';

export enum PartyState {
  Play = 'PLAY',
  Pause = 'PAUSE',
  Stop = 'STOP'
}

export enum PartyEventType {
  AddToQueue = 'ADD_TO_QUEUE',
  ChangeState = 'CHANGE_STATE',
  SkipTrack = 'SKIP_TRACK'
}
