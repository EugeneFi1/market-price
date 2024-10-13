export interface WebSocketMessage {
    type: string;
    last?: { price: number; timestamp: string };
    bid?: { price: number; timestamp: string };
    ask?: { price: number; timestamp: string };
  }