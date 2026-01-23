import axios from 'axios';
import { Holding, Portfolio } from '@/types/investment';

// Mock data for demo - replace with real Kite API calls
export const getKiteHoldings = async (): Promise<Holding[]> => {
  // Real implementation:
  // const response = await axios.get('https://api.kite.trade/portfolio/holdings', {
  //   headers: { Authorization: `token ${apiKey}:${accessToken}` }
  // });
  // return response.data.net.map(item => ({
  //   symbol: item.tradingsymbol,
  //   quantity: item.quantity,
  //   currentValue: item.last_price * item.quantity,
  //   pnl: item.pnl,
  //   type: item.product === 'CNC' ? 'stock' : item.instrument_type.toLowerCase(),
  //   platform: 'kite'
  // }));

  return [
    { symbol: 'RELIANCE', quantity: 10, currentValue: 25000, pnl: 500, type: 'stock', platform: 'kite' },
    { symbol: 'TCS', quantity: 5, currentValue: 15000, pnl: -200, type: 'stock', platform: 'kite' },
  ];
};

export const getKitePortfolio = async (): Promise<Portfolio> => {
  const holdings = await getKiteHoldings();
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  return { totalValue, holdings };
};