
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PageTransition from "@/components/PageTransition";
import { fetchTransfers, updateTransfer } from "@/lib/api";
import { Transfer } from "@/types";
import { CalendarIcon, ArrowRightIcon, Plus } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";
import TransferForm from "@/components/TransferForm";

const Transfers = () => {
  const { toast } = useToast();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const loadTransfers = async () => {
      try {
        setLoading(true);
        const data = await fetchTransfers();
        setTransfers(data);
        setFilteredTransfers(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load transfers data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTransfers();
  }, [toast]);

  useEffect(() => {
    if (selectedLocation === "All Locations") {
      setFilteredTransfers(transfers);
    } else {
      setFilteredTransfers(
        transfers.filter(
          (transfer) => 
            transfer.fromLocation === selectedLocation || 
            transfer.toLocation === selectedLocation
        )
      );
    }
  }, [selectedLocation, transfers]);

  const handleCompleteTransfer = async (id: string) => {
    try {
      const updatedTransfer = await updateTransfer(id, { status: 'completed' });
      setTransfers(transfers.map(transfer => 
        transfer.id === id ? updatedTransfer : transfer
      ));
      toast({
        title: "Transfer Completed",
        description: "The transfer has been marked as completed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update transfer status",
      });
    }
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  const handleAddNewTransfer = (newTransfer: Transfer) => {
    setTransfers([newTransfer, ...transfers]);
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Transfers</h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-40 md:w-60">
              <LocationSelector 
                onChange={handleLocationChange} 
                currentLocation={selectedLocation}
              />
            </div>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setFormOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="h-32 w-full loading-skeleton" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransfers.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground py-8">No transfers found for the selected location.</p>
              </Card>
            ) : (
              filteredTransfers.map((transfer) => (
                <Card key={transfer.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{transfer.productName}</h3>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground gap-2">
                        <span className="capitalize">{transfer.fromLocation}</span>
                        <ArrowRightIcon className="h-3 w-3" />
                        <span className="capitalize">{transfer.toLocation}</span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{new Date(transfer.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold">{transfer.quantity}</span>
                        <span className="text-sm ml-1">pieces</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          transfer.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transfer.status}
                        </div>
                        {transfer.status === 'pending' && (
                          <Button 
                            className="bg-green-600 hover:bg-green-700 text-white" 
                            size="sm"
                            onClick={() => handleCompleteTransfer(transfer.id)}
                          >
                            Complete Transfer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
        
        <TransferForm 
          open={formOpen} 
          onOpenChange={setFormOpen} 
          onSuccess={handleAddNewTransfer} 
        />
      </div>
    </PageTransition>
  );
};

export default Transfers;
