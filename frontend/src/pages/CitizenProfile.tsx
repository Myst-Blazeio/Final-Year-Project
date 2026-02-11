
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { User, Phone, Mail, FileText } from "lucide-react";

const CitizenProfile = () => {
  const { user } = useAuth();

  if (!user) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg shadow-sm p-8 official-card">
          <div className="flex items-center gap-4 mb-8 border-b pb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {user.full_name || user.username}
              </h1>
              <p className="text-muted-foreground">Citizen Profile</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Username
                </label>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded border">
                  <User size={16} className="text-gray-500" />
                  <span className="font-semibold">{user.username}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Aadhar Number
                </label>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded border">
                  <FileText size={16} className="text-gray-500" />
                  <span className="font-semibold">{user.aadhar || "N/A"}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Phone Number
                </label>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded border">
                  <Phone size={16} className="text-gray-500" />
                  <span className="font-semibold">{user.phone || "N/A"}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">
                  Email
                </label>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded border">
                  <Mail size={16} className="text-gray-500" />
                  <span className="font-semibold">{user.email || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CitizenProfile;
