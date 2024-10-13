import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartingDataComponent } from './components/charting-data/charting-data.component';
import { MarketAssetsPicker } from './components/market-assets-picker/market-assets-picker.component';
import { MarketDataComponent } from './components/market-data/market-data.component';
import { MarketAssetState } from './services/market-asset.state';
import { ApiService } from './services/rest-api.service';
import { WebSocketService } from './services/web-socket.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MarketAssetsPicker,
    MarketDataComponent,
    ChartingDataComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent implements OnInit, OnDestroy {
  public isAuthorized = !!sessionStorage.getItem('token');

  constructor(
    private apiService: ApiService,
    private webSocketService: WebSocketService,
    private state: MarketAssetState
  ) {}

  public ngOnInit(): void {
    const token = sessionStorage.getItem('token');

    if (!token) {
      this.apiService.getToken().subscribe(({ access_token }) => {
        sessionStorage.setItem('token', access_token);
        this.connectToWebSocket(access_token);
        this.isAuthorized = true;
      });
    } else {
      this.connectToWebSocket(token);
    }
  }

  public ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

  private connectToWebSocket(token: string): void {
    const webSocketMessages = this.webSocketService.connect(token);
    this.state.connectSelectedMarketAssetInfo(webSocketMessages);
  }
}
