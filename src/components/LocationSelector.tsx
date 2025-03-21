
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LocationSelectorProps {
  onChange: (location: string) => void;
  locations?: string[];
  currentLocation?: string;
  className?: string;
}

const LocationSelector = ({ 
  onChange, 
  locations = ["All Locations", "Main Warehouse", "Store A", "Store B", "Production Unit"],
  currentLocation = "All Locations",
  className
}: LocationSelectorProps) => {
  const [selected, setSelected] = useState(currentLocation);

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
