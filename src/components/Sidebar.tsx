
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Tag, ShoppingCart, Truck, Users, Settings, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  
  const links = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      href: "/inventory", 
      label: "Inventory", 
      icon: <Package className="h-5 w-5" /> 
    },
    { 
      href: "/purchases", 
      label: "Purchases", 
      icon: <ShoppingCart className="h-5 w-5" /> 
    },
    { 
      href: "/sales", 
      label: "Sales", 
      icon: <Tag className="h-5 w-5" /> 
    },
    { 
      href: "/transfers", 
      label: "Transfers", 
      icon: <Truck className="h-5 w-5" /> 
    },
    { 
      href: "/vendors", 
      label: "Vendors", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      href: "/settings", 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" /> 
    },
  ];

  const sidebarVariants = {
    open: { 
      width: '240px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    closed: { 
      width: '0px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
        className={cn(
          "fixed left-0 top-0 z-30 h-full flex-col border-r bg-sidebar text-sidebar-foreground md:w-60 md:translate-x-0 md:flex",
          isOpen ? "flex w-60" : "hidden w-0 -translate-x-full md:flex md:w-auto md:min-w-[60px] md:max-w-[60px]",
        )}
      >
        <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-xl">BathStory</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid gap-1 px-2">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent",
                  location.pathname === link.href && "bg-sidebar-accent font-medium"
                )}
              >
                {link.icon}
                <span className={cn(
                  "transition-opacity duration-200",
                  !isOpen && "md:opacity-0"
                )}>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t border-sidebar-border p-4">
          <Link
            to="/help"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent"
          >
            <HelpCircle className="h-5 w-5" />
            <span className={cn(
              "transition-opacity duration-200",
              !isOpen && "md:opacity-0"
            )}>Help & Support</span>
          </Link>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
