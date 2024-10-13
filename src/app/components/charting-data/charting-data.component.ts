import { formatDate } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { MarketAssetState } from '../../services/market-asset.state';

import { HIGHCHARTS_MODULES } from 'angular-highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { EmptyContentComponent } from '../shared/empty-content/empty-content.component';

@Component({
  selector: 'app-charting-data',
  templateUrl: './charting-data.component.html',
  styleUrl: './charting-data.component.less',
  standalone: true,
  imports: [HighchartsChartModule, EmptyContentComponent],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [NoDataToDisplay] },
  ],
})
export class ChartingDataComponent implements OnInit {
  public _highcharts: typeof Highcharts = Highcharts;
  public _chartOptions: Highcharts.Options = {
    series: [{ type: 'line' }],
    data: {},
    credits: undefined,
    title: undefined,
    yAxis: {
      title: {
        text: 'Price',
      },
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      labels: {
        formatter: function () {
          return formatDate(this.value, "MMM d '<br/>'hh:mm:ss aa", 'en-US');
        },
      },
    },
    tooltip: {
      formatter: function () {
        const date = formatDate(
          this.point.category,
          'MMM d, hh:mm:ss aa',
          'en-US'
        );
        const symbol = this.series.options.custom?.['symbol'];
        return `Time: ${date} </br> Price: ${symbol}${this.y}`;
      },
    },
  };
  public _updateChart: boolean = true;
  public _noData = true;
  private destroyRef = inject(DestroyRef);

  constructor(private state: MarketAssetState) {}

  public ngOnInit(): void {
    this.state
      .select('historyData')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this._noData = !data.length;
        this._chartOptions.series = [
          {
            type: 'line',
            data: data.map((d) => d.price),
            custom: {
              symbol: this.state.get('symbolIcon'),
            },
          },
        ];
        this._chartOptions.xAxis = {
          ...this._chartOptions.xAxis,
          categories: data.map((d) => d.time),
        };
        this._updateChart = true;
      });
  }
}
