import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { WebSocketMessage } from '../models/web-socket.model';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  public messages$?: Observable<WebSocketMessage>;
  private webSocket$?: WebSocketSubject<unknown>;

  public connect(token: string): Observable<WebSocketMessage> {
    this.webSocket$ = webSocket(
      `wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=${token}`
    );
    return this.webSocket$.asObservable() as Observable<WebSocketMessage>;
  }

  public sendMessage(instrumentId: string): void {
    this.webSocket$?.next({
      type: 'l1-subscription',
      id: '1',
      instrumentId,
      provider: 'simulation',
      subscribe: true,
      kinds: ['ask', 'bid', 'last'],
    });
  }

  public disconnect(): void {
    this.webSocket$?.complete();
  }
}
