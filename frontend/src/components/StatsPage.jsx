import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";

export default function StatsPage() {
  const { code } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get(`/links/${code}`)
      .then((res) => setStats(res.data))
      .catch(() => setStats(null));
  }, [code]);

  if (!stats)
    return <p className="p-6">Not found.</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-3">Stats for: {code}</h1>

      <p><strong>URL:</strong> {stats.target_url}</p>
      <p><strong>Total Clicks:</strong> {stats.total_clicks}</p>
      <p><strong>Last Clicked:</strong> {stats.last_clicked || "Never"}</p>
    </div>
  );
}
