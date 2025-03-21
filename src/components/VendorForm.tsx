
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createVendor } from "@/lib/api";
import type { Vendor } from "@/types";

interface VendorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (vendor: Vendor) => void;
}

const VendorForm = ({ open, onOpenChange, onSuccess }: VendorFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [vendorId, setVendorId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Vendor name is required",
      });
      return;
    }

    try {
      setLoading(true);
      const newVendor = await createVendor(formData);
      
      // Update the vendor ID
      setVendorId(newVendor.id);
      
      toast({
        title: "Vendor Created",
        description: `Vendor "${newVendor.name}" has been successfully created with ID: ${newVendor.id}`,
      });
      
      onSuccess(newVendor);
      onOpenChange(false);
      setFormData({
        name: "",
        location: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create vendor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glassmorphism">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name">Vendor Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter vendor name"
              required
              className="focus-visible:ring-indigo-500"
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter vendor location"
              className="focus-visible:ring-indigo-500"
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="focus-visible:ring-indigo-500"
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="focus-visible:ring-indigo-500"
            />
          </div>
          
          {vendorId && (
            <div className="mt-2 text-sm border border-indigo-100 bg-indigo-50 p-3 rounded">
              <span className="font-semibold">Vendor ID: </span>
              <span className="font-mono">{vendorId}</span>
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
              {loading ? "Creating..." : "Create Vendor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VendorForm;
