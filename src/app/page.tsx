'use client';

import { useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PortfolioChart } from '@/components/charts/portfolio-chart';

export default function Home() {
  const { portfolio, loading, error, fetchPortfolio, filters, setFilters } = useAppStore();

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const filteredHoldings = useMemo(() => {
    if (!portfolio) return [];
    return portfolio.holdings
      .filter(h => !filters.platform || h.platform === filters.platform)
      .filter(h => !filters.type || h.type === filters.type)
      .sort((a, b) => {
        if (filters.sortBy === 'symbol') {
          return filters.sortOrder === 'asc' ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
        }
        const aVal = filters.sortBy === 'pnl' ? a.pnl : a.currentValue;
        const bVal = filters.sortBy === 'pnl' ? b.pnl : b.currentValue;
        return filters.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
  }, [portfolio, filters]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen">Error: {error}</div>;
  if (!portfolio) return <div className="flex justify-center items-center min-h-screen">No data</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Investment Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{portfolio.totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{portfolio.holdings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${portfolio.holdings.reduce((sum, h) => sum + h.pnl, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{portfolio.holdings.reduce((sum, h) => sum + h.pnl, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Portfolio Spread by Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioChart holdings={portfolio.holdings} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>P&L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.holdings.map((h, i) => (
                <TableRow key={i}>
                  <TableCell>{h.symbol}</TableCell>
                  <TableCell>{h.platform}</TableCell>
                  <TableCell>{h.type}</TableCell>
                  <TableCell>{h.quantity}</TableCell>
                  <TableCell>₹{h.currentValue.toLocaleString()}</TableCell>
                  <TableCell className={h.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ₹{h.pnl.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-center">
        <Button onClick={fetchPortfolio} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
    </div>
  );
}
