
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";
import { fetchVendors } from "@/lib/api";
import { Vendor } from "@/types";
import { Phone, Mail, Edit, Plus, Search } from "lucide-react";
import VendorForm from "@/components/VendorForm";

const Vendors = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoading(true);
        const data = await fetchVendors();
        setVendors(data);
        setFilteredVendors(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load vendors data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVendors();
  }, [toast]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredVendors(
        vendors.filter(
          (vendor) =>
            vendor.name.toLowerCase().includes(query) ||
            (vendor.location && vendor.location.toLowerCase().includes(query)) ||
            (vendor.email && vendor.email.toLowerCase().includes(query)) ||
            (vendor.phone && vendor.phone.includes(query))
        )
      );
    } else {
      setFilteredVendors(vendors);
    }
  }, [searchQuery, vendors]);

  const handleAddNewVendor = (newVendor: Vendor) => {
    setVendors([newVendor, ...vendors]);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
            <p className="text-muted-foreground">
              Manage your vendors and suppliers
            </p>
          </div>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setFormOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="h-32 w-full loading-skeleton" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVendors.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground py-8">
                  {searchQuery ? "No vendors found matching your search." : "No vendors found. Add one to get started."}
                </p>
              </Card>
            ) : (
              filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-700">{vendor.name}</h3>
                      <p className="text-sm text-muted-foreground">{vendor.location || "Location not specified"}</p>
                      <div className="mt-3 flex flex-col space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{vendor.phone || "No phone number"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{vendor.email || "No email address"}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Vendor ID: </span>
                        <span className="font-mono text-indigo-600">{vendor.id}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button variant="outline" size="sm" className="gap-1 hover:bg-indigo-50">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
        
        <VendorForm 
          open={formOpen} 
          onOpenChange={setFormOpen} 
          onSuccess={handleAddNewVendor} 
        />
      </div>
    </PageTransition>
  );
};

export default Vendors;
