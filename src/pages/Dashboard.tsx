
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatsCard from "@/components/StatsCard";
import ProductTable from "@/components/ProductTable";
import { fetchStats, fetchProducts } from "@/lib/api";
import { Stats, Product } from "@/types";
import { Package, Tag, Users, AlertTriangle } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

// Demo chart data
const salesData = [
  { date: "2023-01-01", value: 4000 },
  { date: "2023-02-01", value: 3000 },
  { date: "2023-03-01", value: 5000 },
  { date: "2023-04-01", value: 2780 },
  { date: "2023-05-01", value: 1890 },
  { date: "2023-06-01", value: 2390 },
  { date: "2023-07-01", value: 3490 },
  { date: "2023-08-01", value: 2000 },
  { date: "2023-09-01", value: 2780 },
  { date: "2023-10-01", value: 3890 },
  { date: "2023-11-01", value: 2390 },
  { date: "2023-12-01", value: 3490 },
];

const stockData = [
  { date: "2023-01-01", value: 10000 },
  { date: "2023-02-01", value: 11500 },
  { date: "2023-03-01", value: 13000 },
  { date: "2023-04-01", value: 12500 },
  { date: "2023-05-01", value: 11000 },
  { date: "2023-06-01", value: 9500 },
  { date: "2023-07-01", value: 8800 },
  { date: "2023-08-01", value: 9200 },
  { date: "2023-09-01", value: 10600 },
  { date: "2023-10-01", value: 12100 },
  { date: "2023-11-01", value: 13500 },
  { date: "2023-12-01", value: 15000 },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, productsData] = await Promise.all([
          fetchStats(),
          fetchProducts(),
        ]);
        setStats(statsData);
        setProducts(productsData);
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

  const lowStockProducts = products.filter((product) => product.stock <= 10);

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your inventory management system
          </p>
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
              title="Total Products"
              value={stats?.totalProducts || 0}
              icon={Package}
              trend="up"
              trendValue="12% from last month"
            />
            <StatsCard
              title="Categories"
              value={stats?.totalCategories || 0}
              icon={Tag}
              trend="neutral"
              trendValue="No change"
            />
            <StatsCard
              title="Users"
              value={stats?.totalUsers || 0}
              icon={Users}
              trend="up"
              trendValue="2 new this month"
            />
            <StatsCard
              title="Low Stock Items"
              value={stats?.lowStockItems || 0}
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
                      tickFormatter={(value) => `$${value}`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}`, 'Sales']}
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
                      tickFormatter={(value) => `${value}`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} units`, 'Stock']}
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Low Stock Products</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          {loading ? (
            <Card className="h-52 w-full loading-skeleton" />
          ) : (
            <ProductTable products={lowStockProducts} />
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
