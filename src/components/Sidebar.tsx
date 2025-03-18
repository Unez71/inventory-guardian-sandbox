
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Package, Tag, Users, Settings, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  
  const links = [
    { 
      href: "/dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      href: "/products", 
      label: "Products", 
      icon: <Package className="h-5 w-5" /> 
    },
    { 
      href: "/categories", 
      label: "Categories", 
      icon: <Tag className="h-5 w-5" /> 
    },
    { 
      href: "/users", 
      label: "Users", 
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
          onClick={() => {}}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
        className={cn(
          "fixed left-0 top-0 z-30 h-full flex-col border-r bg-sidebar text-sidebar-foreground md:w-60 md:translate-x-0 md:flex",
          isOpen ? "flex w-60" : "hidden w-0 -translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-xl">Inventory Guardian</span>
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
                <span>{link.label}</span>
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
            <span>Help & Support</span>
          </Link>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
