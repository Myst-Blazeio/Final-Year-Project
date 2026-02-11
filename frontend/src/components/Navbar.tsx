import React from "react";
import { useAuth } from "../context/AuthContext";

import { Shield } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();

  // Police logic is largely irrelevant now as police have their own portal, 
  // but keeping basic checks if we ever link back or share this nav.
  // Actually, Police Portal uses backend templates, so this Navbar is ONLY for Citizen/Public.
  
  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md select-none">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo is always non-clickable and distinct */}
        <span className="text-2xl font-extrabold tracking-wide cursor-default select-none font-serif flex items-center gap-2">
          <Shield size={28} strokeWidth={2.5} />
          Sahayta
        </span>

        <div className="space-x-4 flex items-center">
          {user && (
            <>
              {role === "police" && (
                <span className="hidden"></span> // Placeholder or just remove
              )}

              <button
                onClick={logout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition backdrop-blur-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
