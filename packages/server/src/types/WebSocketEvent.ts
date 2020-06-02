
export interface EventData {
    [x: string]: string|number|boolean|Date|EventData|EventDataArray;
}

export type EventDataArray = Array<string|number|boolean|Date|EventData|EventDataArray>


export enum EventType {
  Join = 'join',
  Candidate = 'send-candidate',
  Offer = 'send-offer',
  Answer = 'send-answer',
}

export interface WebSocketEvent {
  type: EventType;
  data: EventData;
}