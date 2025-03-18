
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/StatsCard";
import { fetchStats, fetchSales, fetchPurchases, fetchTransfers } from "@/lib/api";
import { Stats, Sale, Purchase, Transfer } from "@/types";
import { Package, ShoppingCart, Tag, AlertTriangle } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Link } from "react-router-dom";

// Demo chart data
const salesData = [
  { date: "2023-01-01", value: 14000 },
  { date: "2023-02-01", value: 10000 },
  { date: "2023-03-01", value: 15000 },
  { date: "2023-04-01", value: 9780 },
  { date: "2023-05-01", value: 6890 },
  { date: "2023-06-01", value: 8390 },
  { date: "2023-07-01", value: 11490 },
  { date: "2023-08-01", value: 7000 },
  { date: "2023-09-01", value: 9780 },
  { date: "2023-10-01", value: 12890 },
  { date: "2023-11-01", value: 8390 },
  { date: "2023-12-01", value: 11490 },
];

const stockData = [
  { date: "2023-01-01", value: 30000 },
  { date: "2023-02-01", value: 35500 },
  { date: "2023-03-01", value: 39000 },
  { date: "2023-04-01", value: 36500 },
  { date: "2023-05-01", value: 33000 },
  { date: "2023-06-01", value: 28500 },
  { date: "2023-07-01", value: 26800 },
  { date: "2023-08-01", value: 27200 },
  { date: "2023-09-01", value: 31600 },
  { date: "2023-10-01", value: 36100 },
  { date: "2023-11-01", value: 40500 },
  { date: "2023-12-01", value: 45000 },
];

const formatIndianRupee = (value: number) => {
  return `₹${value.toLocaleString('en-IN')}`;
};

const Dashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
  const [recentTransfers, setRecentTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, salesData, purchasesData, transfersData] = await Promise.all([
          fetchStats(),
          fetchSales(),
          fetchPurchases(),
          fetchTransfers(),
        ]);
        setStats(statsData);
        setRecentSales(salesData.slice(0, 2));
        setRecentPurchases(purchasesData.slice(0, 2));
        setRecentTransfers(transfersData.slice(0, 2));
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your inventory management system
            </p>
          </div>
          <div className="relative inline-block">
            <Button variant="outline" className="flex items-center gap-2">
              All Locations
              <span className="text-xs opacity-60">▼</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="h-4 w-24 loading-skeleton rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-7 w-16 loading-skeleton rounded" />
                  <div className="mt-2 h-4 w-32 loading-skeleton rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Sales"
              value={formatIndianRupee(stats?.totalSales || 0)}
              icon={Tag}
              trend="up"
              trendValue="12% from last month"
            />
            <StatsCard
              title="Total Purchases"
              value={formatIndianRupee(stats?.totalPurchases || 0)}
              icon={ShoppingCart}
              trend="neutral"
              trendValue="No change"
            />
            <StatsCard
              title="Total Inventory"
              value={stats?.totalInventory?.toString() || "0"}
              icon={Package}
              trend="up"
              trendValue="15 new items"
            />
            <StatsCard
              title="Low Stock Items"
              value={stats?.lowStockItems?.toString() || "0"}
              icon={AlertTriangle}
              trend="down"
              trendValue="3 less than last week"
              className={stats?.lowStockItems ? "border-orange-200 bg-orange-50 dark:bg-transparent dark:border-orange-900" : ""}
            />
          </div>
        )}

        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="sales">Sales Overview</TabsTrigger>
            <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), "MMM")}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `₹${value/1000}k`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']}
                      labelFormatter={(date) => format(new Date(date), "MMMM yyyy")}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stockData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--secondary-foreground))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(new Date(date), "MMM")}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value/1000}k`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value.toLocaleString('en-IN')} units`, 'Stock']}
                      labelFormatter={(date) => format(new Date(date), "MMMM yyyy")}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--secondary-foreground))"
                      fillOpacity={1}
                      fill="url(#colorStock)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Recent Transfers</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-4">
                {recentTransfers.map((transfer) => (
                  <div key={transfer.id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{transfer.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {transfer.quantity} units from {transfer.fromLocation} to {transfer.toLocation}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium self-start ${
                        transfer.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transfer.status}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(transfer.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/transfers">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Transfers
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{sale.customerName}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatIndianRupee(sale.totalAmount)} - {sale.location}
                        </div>
                      </div>
                      <div className="text-sm text-right">
                        {new Date(sale.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/sales">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Sales
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Recent Purchases</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-4">
                {recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">Invoice: {purchase.invoiceNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatIndianRupee(purchase.totalAmount)} - {purchase.location}
                        </div>
                      </div>
                      <div className="text-sm text-right">
                        {new Date(purchase.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link to="/purchases">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Purchases
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
