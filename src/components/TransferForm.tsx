
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createTransfer } from "@/lib/api";
import type { Transfer } from "@/types";

interface TransferFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (transfer: Transfer) => void;
}

const TransferForm = ({ open, onOpenChange, onSuccess }: TransferFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    productName: "",
    quantity: 1,
    fromLocation: "",
    toLocation: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "quantity" ? parseInt(value) || 0 : value }));
  };

  const handleLocationChange = (location: string, field: "fromLocation" | "toLocation") => {
    setFormData((prev) => ({ ...prev, [field]: location }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.fromLocation || !formData.toLocation) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill all required fields",
      });
      return;
    }
    
    if (formData.fromLocation === formData.toLocation) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Source and destination locations cannot be the same",
      });
      return;
    }

    try {
      setLoading(true);
      const newTransfer = await createTransfer({
        ...formData,
        status: "pending",
      });
      
      toast({
        title: "Transfer Created",
        description: "The transfer has been successfully created.",
      });
      
      onSuccess(newTransfer);
      onOpenChange(false);
      setFormData({
        productName: "",
        quantity: 1,
        fromLocation: "",
        toLocation: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create transfer",
      });
    } finally {
      setLoading(false);
    }
  };

  const locations = ["Main Warehouse", "Store A", "Store B", "Production Unit"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Inventory Transfer</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="fromLocation">From Location</Label>
            <Select 
              value={formData.fromLocation} 
              onValueChange={(value) => handleLocationChange(value, "fromLocation")}
            >
              <SelectTrigger id="fromLocation">
                <SelectValue placeholder="Select source location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="toLocation">To Location</Label>
            <Select 
              value={formData.toLocation} 
              onValueChange={(value) => handleLocationChange(value, "toLocation")}
            >
              <SelectTrigger id="toLocation">
                <SelectValue placeholder="Select destination location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferForm;
