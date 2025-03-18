
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MapPin } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { fetchInventory } from "@/lib/api";
import { InventoryItem } from "@/types";

const Inventory = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadInventory = async () => {
      try {
        setLoading(true);
        const data = await fetchInventory();
        setInventory(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load inventory data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [toast]);

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">BathStory Inventory</h1>
            <p className="text-muted-foreground">
              Manage and track all products across locations
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
              New Product
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products by name or description..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="h-64 w-full loading-skeleton" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredInventory.map((item) => (
              <Card key={item.id} className="overflow-hidden p-6 flex flex-col">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                    </div>
                    <div className="text-xl font-bold">
                      {item.quantity}
                      <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-sm">
                    Unit Price: <span className="font-semibold">₹{item.unitPrice}</span>
                  </p>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className={
                        item.inStock
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="default" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Add Stock
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Inventory;
