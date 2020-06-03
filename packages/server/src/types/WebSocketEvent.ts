
interface EventData {
    [x: string]: string|number|boolean|Date|EventData|EventDataArray;
}

type EventDataArray = Array<string|number|boolean|Date|EventData|EventDataArray>

enum EventType {
  Join = 'join',
  Candidate = 'send-candidate',
  Offer = 'send-offer',
  Answer = 'send-answer',
}

interface WebSocketEvent {
  type: EventType;
  data: EventData;
}

export { WebSocketEvent, EventType, EventData, EventDataArray };
