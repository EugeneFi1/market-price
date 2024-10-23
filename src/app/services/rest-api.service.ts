import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FINCHARTS_ROUTES } from '../config/routes';
import { MarketAsset } from '../models/market-asset';
import { MarketAssetInfo } from '../models/market-asset-state.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  public getToken(
    username: string,
    password: string
  ): Observable<{ access_token: string }> {
    let body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', 'app-cli');
    body.set('username', username);
    body.set('password', password);

    return this.httpClient.post<{ access_token: string }>(
      FINCHARTS_ROUTES.GET_TOKEN,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  }

  public getMarketAssets(): Observable<{ data: MarketAsset[] }> {
    return this.httpClient.get<{ data: MarketAsset[] }>(
      FINCHARTS_ROUTES.INSTRUMENTS_LIST
    );
  }

  public getHistory(instrumentId: string): Observable<MarketAssetInfo[]> {
    let params = new HttpParams()
      .set('instrumentId', instrumentId)
      .set('provider', 'oanda')
      .set('interval', '1')
      .set('periodicity', 'minute')
      .set('barsCount', '10');

    return this.httpClient
      .get<MarketAssetInfo[]>(FINCHARTS_ROUTES.HISTORY, {
        params,
      })
      .pipe(
        map((res) =>
          // @ts-ignore
          res.data.map((d) => ({
            price: d.v,
            time: d.t,
          }))
        )
      );
  }
}
