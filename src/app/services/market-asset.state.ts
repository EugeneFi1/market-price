import { RxState } from '@rx-angular/state';
import { MarketAssetStateModel } from '../models/market-asset-state.model';
import { Injectable } from '@angular/core';
import { ApiService } from './rest-api.service';
import { filter, map, Observable, switchMap, tap, timestamp } from 'rxjs';
import icons from 'currency-icons';
import { WebSocketMessage } from '../models/web-socket.model';

@Injectable({
  providedIn: 'root',
})
export class MarketAssetState extends RxState<MarketAssetStateModel> {
  constructor(private apiService: ApiService) {
    super();

    this.connect(
      'historyData',
      this.select('selectedMarketAsset').pipe(
        switchMap((selectedAsset) =>
          this.apiService.getHistory(selectedAsset.id)
        )
      )
    );

    this.connect(
      'symbolIcon',
      this.select('selectedMarketAsset').pipe(
        map((selectedAsset) => icons[selectedAsset.currency]!.symbol)
      )
    );
  }

  public connectSelectedMarketAssetInfo(
    source: Observable<WebSocketMessage>
  ): void {
    this.connect(
      'selectedMarketAssetInfo',
      source.pipe(
        filter((message) => message.type === 'l1-update'),
        map((message) => message['last'] || message['bid'] || message['ask']),
        map((data) => ({
          price: data!.price,
          time: data!.timestamp,
        }))
      )
    );
  }
}
