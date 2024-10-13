import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { map, Observable } from 'rxjs';
import { MarketAsset } from '../../models/market-asset';
import { MarketAssetState } from '../../services/market-asset.state';
import { ApiService } from '../../services/rest-api.service';
import { WebSocketService } from '../../services/web-socket.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-market-assets-picker',
  templateUrl: './market-assets-picker.component.html',
  styleUrl: './market-assets-picker.component.less',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
})
export class MarketAssetsPicker implements OnInit {
  public _marketAssets$?: Observable<MarketAsset[]>;
  public _selectedMarketAsset?: MarketAsset;

  constructor(
    private apiService: ApiService,
    private state: MarketAssetState,
    private webSocketService: WebSocketService
  ) {}

  public ngOnInit(): void {
    this._marketAssets$ = this.apiService
      .getMarketAssets()
      .pipe(map((val) => val.data));
  }

  public _changeMarketAsset(event: MatOptionSelectionChange): void {
    if (event.isUserInput) {
      this._selectedMarketAsset = event.source.value;
    }
  }

  public _subscribeMarketAsset(): void {
    if (this._selectedMarketAsset) {
      this.state.set('selectedMarketAsset', () => this._selectedMarketAsset!);
      this.webSocketService.subscribeMarketData(this._selectedMarketAsset.id);
    }
  }
}
