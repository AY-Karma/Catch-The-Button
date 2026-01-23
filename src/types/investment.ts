export interface Holding {
  symbol: string;
  quantity: number;
  currentValue: number;
  pnl: number;
  type: 'stock' | 'mf' | 'futures' | 'options';
  platform: 'kite' | 'groww';
}

export interface Portfolio {
  totalValue: number;
  holdings: Holding[];
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
}