import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MarketAssetStateModel } from '../../models/market-asset-state.model';
import { MarketAssetState } from '../../services/market-asset.state';

@Component({
  selector: 'app-market-data',
  templateUrl: './market-data.component.html',
  styleUrl: './market-data.component.less',
  standalone: true,
  imports: [DatePipe, AsyncPipe],
})
export class MarketDataComponent implements OnInit {
  public _state$?: Observable<MarketAssetStateModel>;

  constructor(private state: MarketAssetState) {}

  public ngOnInit(): void {
    this._state$ = this.state.select();
  }
}
