
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { fetchInventory } from "@/lib/api";
import { InventoryItem } from "@/types";
import ProductTable from "@/components/ProductTable";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProductForm from "@/components/ProductForm";
import LocationSelector from "@/components/LocationSelector";

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const inventoryData = await fetchInventory();
      setProducts(inventoryData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [toast]);

  const filteredProducts = products.filter((product) => {
    // Check location filter
    if (selectedLocation !== "All Locations" && product.location !== selectedLocation) {
      return false;
    }
    
    // Check search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleEditProduct = (product: InventoryItem) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleDeleteProduct = (product: InventoryItem) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      try {
        // In a real app, we would call the API to delete the product
        // For this demo, we'll just update the local state
        setProducts(products.filter((p) => p.id !== selectedProduct.id));
        toast({
          title: "Product deleted",
          description: `${selectedProduct.name} has been removed.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete the product",
        });
      }
    }
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setEditDialogOpen(true);
  };

  const handleFormSuccess = () => {
    setEditDialogOpen(false);
    loadData();
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your product inventory
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <LocationSelector 
              onChange={handleLocationChange}
              currentLocation={selectedLocation}
              className="w-full sm:w-48"
            />
            <Button className="hover-lift" onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="h-96 w-full loading-skeleton rounded-md" />
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg glassmorphism">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={selectedProduct || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glassmorphism">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold">{selectedProduct?.name}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
};

export default Products;
