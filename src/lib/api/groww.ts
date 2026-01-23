import axios from 'axios';
import { Holding, Portfolio } from '@/types/investment';

// Mock data for demo - replace with real Groww API calls
export const getGrowwHoldings = async (): Promise<Holding[]> => {
  // Real implementation:
  // const response = await axios.get('https://groww.in/api/v1/portfolio/holdings', {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // return response.data.holdings.map(item => ({
  //   symbol: item.symbol,
  //   quantity: item.quantity,
  //   currentValue: item.current_value,
  //   pnl: item.pnl,
  //   type: item.asset_type,
  //   platform: 'groww'
  // }));

  return [
    { symbol: 'INFY', quantity: 20, currentValue: 30000, pnl: 1000, type: 'stock', platform: 'groww' },
    { symbol: 'HDFC', quantity: 8, currentValue: 20000, pnl: -300, type: 'stock', platform: 'groww' },
  ];
};

export const getGrowwPortfolio = async (): Promise<Portfolio> => {
  const holdings = await getGrowwHoldings();
  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  return { totalValue, holdings };
};