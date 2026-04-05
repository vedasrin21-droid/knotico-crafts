import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type RequestStatus = "pending" | "reviewed" | "responded";

interface CustomRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  product_type: string;
  description: string;
  quantity: number;
  timeline: string | null;
  status: RequestStatus;
  created_at: string;
}

const statusColors: Record<RequestStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  responded: "bg-green-100 text-green-800",
};

export default function AdminRequests() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const { data } = await supabase.from("custom_order_requests").select("*").order("created_at", { ascending: false });
    setRequests((data as CustomRequest[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id: string, status: RequestStatus) => {
    const { error } = await supabase.from("custom_order_requests").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status updated" });
      fetchRequests();
    }
  };

  if (!isAdmin) return <div className="container mx-auto px-4 py-20 text-center"><p>Access Denied</p></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">← Dashboard</Link>
      <h1 className="font-heading text-3xl font-bold text-foreground mt-1 mb-6">Custom Requests</h1>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-lg bg-card border border-border animate-pulse" />)}</div>
      ) : requests.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">No custom requests yet</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="rounded-xl bg-card border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{req.name}</p>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${statusColors[req.status]}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{req.email}{req.phone ? ` · ${req.phone}` : ""}</p>
                  <p className="text-sm mt-2"><span className="font-medium">Type:</span> {req.product_type} · <span className="font-medium">Qty:</span> {req.quantity}</p>
                  {req.timeline && <p className="text-sm text-muted-foreground"><span className="font-medium">Timeline:</span> {req.timeline}</p>}
                  <p className="text-sm text-muted-foreground mt-2">{req.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(req.created_at).toLocaleDateString()}</p>
                </div>
                <select
                  value={req.status}
                  onChange={(e) => updateStatus(req.id, e.target.value as RequestStatus)}
                  className="text-xs border border-border rounded-md px-2 py-1 bg-background"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="responded">Responded</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
