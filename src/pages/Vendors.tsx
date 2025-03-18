
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";
import { fetchVendors } from "@/lib/api";
import { Vendor } from "@/types";
import { Phone, Mail, Edit } from "lucide-react";

const Vendors = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        setLoading(true);
        const data = await fetchVendors();
        setVendors(data);
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

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Add Vendor
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="h-32 w-full loading-skeleton" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <Card key={vendor.id} className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground">{vendor.location}</p>
                    <div className="mt-3 flex flex-col space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{vendor.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
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

export default Vendors;
