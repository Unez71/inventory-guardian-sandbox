import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchInventory } from "@/lib/api";

interface LocationSelectorProps {
  onChange: (location: string) => void;
  locations?: string[];
  currentLocation?: string;
  className?: string;
}

const LocationSelector = ({ 
  onChange, 
  locations: propLocations,
  currentLocation = "All Locations",
  className
}: LocationSelectorProps) => {
  const [selected, setSelected] = useState(currentLocation);
  const [locations, setLocations] = useState<string[]>(propLocations || ["All Locations"]);

  useEffect(() => {
    // If locations are provided as props, use them
    if (propLocations) {
      return;
    }
    
    // Otherwise, fetch locations from inventory items
    const fetchLocations = async () => {
      try {
        const inventoryData = await fetchInventory();
        const uniqueLocations = [...new Set(inventoryData.map(item => item.location))];
        setLocations(["All Locations", ...uniqueLocations]);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    
    fetchLocations();
  }, [propLocations]);

  // Update selected value when currentLocation prop changes
  useEffect(() => {
    setSelected(currentLocation);
  }, [currentLocation]);

  const handleLocationChange = (location: string) => {
    setSelected(location);
    onChange(location);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`flex items-center gap-2 w-full ${className}`}>
          <MapPin className="h-4 w-4" />
          {selected}
          <span className="text-xs opacity-60 ml-auto">▼</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {locations.map((location) => (
          <DropdownMenuItem
            key={location}
            onClick={() => handleLocationChange(location)}
            className={selected === location ? "bg-accent" : ""}
          >
            {location}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationSelector;
