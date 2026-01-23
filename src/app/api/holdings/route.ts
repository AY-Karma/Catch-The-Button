import { NextResponse } from 'next/server';
import { getKitePortfolio } from '@/lib/api/kite';
import { getGrowwPortfolio } from '@/lib/api/groww';
import { Portfolio } from '@/types/investment';

export async function GET() {
  try {
    const kitePortfolio = await getKitePortfolio();
    const growwPortfolio = await getGrowwPortfolio();

    const combined: Portfolio = {
      totalValue: kitePortfolio.totalValue + growwPortfolio.totalValue,
      holdings: [...kitePortfolio.holdings, ...growwPortfolio.holdings],
    };

    return NextResponse.json(combined);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch holdings' }, { status: 500 });
  }
}