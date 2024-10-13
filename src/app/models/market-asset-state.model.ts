import { MarketAsset } from './market-asset';

export interface MarketAssetInfo {
  time: string;
  price: number;
}

export interface MarketAssetStateModel {
  selectedMarketAsset: MarketAsset;
  symbolIcon: string;
  selectedMarketAssetInfo: MarketAssetInfo;
  historyData: MarketAssetInfo[];
}
