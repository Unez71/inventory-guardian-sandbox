
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, MapPin, Filter } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { fetchPurchases } from "@/lib/api";
import { Purchase } from "@/types";

const Purchases = () => {
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        setLoading(true);
        const data = await fetchPurchases();
        setPurchases(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load purchases data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, [toast]);

  const filteredPurchases = purchases.filter((purchase) =>
    purchase.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totalAmount = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  const totalTransactions = purchases.length;
  const averagePurchaseAmount = totalAmount / totalTransactions;

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">BathStory Purchases</h1>
            <p className="text-muted-foreground">
              Manage and track all purchase transactions
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-40 md:w-60">
              <Button variant="outline" className="flex items-center gap-2 w-full">
                <MapPin className="h-4 w-4" />
                All Locations
                <span className="text-xs opacity-60">▼</span>
              </Button>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              New Purchase
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by invoice number or vendor ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-muted-foreground text-sm">Total Purchases</div>
              <div className="text-2xl font-bold">₹{totalAmount.toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-muted-foreground text-sm">Total Transactions</div>
              <div className="text-2xl font-bold">{totalTransactions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-muted-foreground text-sm">Average Purchase Amount</div>
              <div className="text-2xl font-bold">₹{Math.round(averagePurchaseAmount).toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <Card className="w-full h-96 loading-skeleton" />
        ) : (
          <div className="space-y-6">
            {filteredPurchases.map((purchase) => (
              <Card key={purchase.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-indigo-600">Invoice: {purchase.invoiceNumber}</h3>
                        <div className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">{purchase.location}</div>
                      </div>
                      <div className="mt-2 space-y-1">
                        <div className="text-sm font-medium">Total Amount</div>
                        <div className="text-xl font-bold">₹{purchase.totalAmount.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className="text-sm font-medium">Vendor ID</div>
                      <div className="text-lg">{purchase.vendorId}</div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date(purchase.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Items</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">Item</th>
                            <th className="text-center py-2 font-medium">Quantity</th>
                            <th className="text-right py-2 font-medium">Unit Price</th>
                            <th className="text-right py-2 font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchase.items.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="py-3">
                                <div className="font-medium">{item.productName}</div>
                                <div className="text-xs text-muted-foreground">Product ID: {item.productId}</div>
                              </td>
                              <td className="text-center py-3">{item.quantity}</td>
                              <td className="text-right py-3">₹{item.unitPrice}</td>
                              <td className="text-right py-3 font-medium">₹{item.total.toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Purchases;
