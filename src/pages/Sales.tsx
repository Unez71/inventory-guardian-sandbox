
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, User, Phone, Calendar } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { fetchSales } from "@/lib/api";
import { Sale } from "@/types";
import LocationSelector from "@/components/LocationSelector";

const Sales = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true);
        const data = await fetchSales();
        setSales(data);
        setFilteredSales(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load sales data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, [toast]);

  useEffect(() => {
    let filtered = sales;
    
    // Apply location filter
    if (selectedLocation !== "All Locations") {
      filtered = filtered.filter(sale => sale.location === selectedLocation);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sale) =>
          sale.customerName.toLowerCase().includes(query) ||
          sale.customerPhone?.includes(query) ||
          sale.invoiceNumber.toLowerCase().includes(query)
      );
    }
    
    setFilteredSales(filtered);
  }, [sales, searchQuery, selectedLocation]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  // Calculate totals
  const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalTransactions = filteredSales.length;
  const averageSaleAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">BathStory Sales</h1>
            <p className="text-muted-foreground">
              Manage and track all sales transactions
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-40 md:w-60">
              <LocationSelector 
                onChange={handleLocationChange} 
                currentLocation={selectedLocation}
              />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              New Sale
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by customer name, contact, or invoice number..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
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
              <div className="text-muted-foreground text-sm">Total Sales</div>
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
              <div className="text-muted-foreground text-sm">Average Sale Amount</div>
              <div className="text-2xl font-bold">₹{Math.round(averageSaleAmount).toLocaleString('en-IN')}</div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <Card className="w-full h-96 loading-skeleton" />
        ) : filteredSales.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground py-8">No sales found for the selected criteria.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSales.map((sale) => (
              <Card key={sale.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-600">Invoice: {sale.invoiceNumber}</h3>
                      <div className="mt-4 flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{sale.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{sale.customerPhone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:text-right">
                      <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                        {sale.location}
                      </div>
                      <div className="mt-2">
                        <div className="text-3xl font-bold">₹{sale.totalAmount.toLocaleString('en-IN')}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground justify-end mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(sale.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    {sale.items.map((item, idx) => (
                      <div key={idx} className="py-2 text-sm">
                        {item.productName}
                      </div>
                    ))}
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

export default Sales;
