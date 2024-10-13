import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { WebSocketMessage } from '../models/web-socket.model';
import { getMarketDataMessage } from '../config/web-socket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  public messages$?: Observable<WebSocketMessage>;
  private webSocket$?: WebSocketSubject<unknown>;
  private currentSubscribedInstrumentId?: string;

  public connect(token: string): Observable<WebSocketMessage> {
    this.webSocket$ = webSocket(
      `wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=${token}`
    );
    return this.webSocket$.asObservable() as Observable<WebSocketMessage>;
  }

  public subscribeMarketData(instrumentId: string): void {
    // unsubscribe from previous market data subscription
    if (this.currentSubscribedInstrumentId) {
      this.webSocket$?.next(
        getMarketDataMessage(this.currentSubscribedInstrumentId, false)
      );
    }
    this.currentSubscribedInstrumentId = instrumentId;
    this.webSocket$?.next(getMarketDataMessage(instrumentId));
  }

  public disconnect(): void {
    this.webSocket$?.complete();
  }
}
