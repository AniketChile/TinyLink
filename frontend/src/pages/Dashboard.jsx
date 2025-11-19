import { useEffect, useState } from "react";
import { api } from "../api";
import AddLinkForm from "../components/AddLinkForm";
import LinksTable from "../components/LinkTable";

export default function Dashboard() {
  const [links, setLinks] = useState([]);

  const loadLinks = async () => {
    const res = await api.get("/links");
    setLinks(res.data);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <div className="p-6 mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">TinyLink Dashboard</h1>
      <AddLinkForm onCreated={loadLinks} />
      <LinksTable links={links} refresh={loadLinks} />
    </div>
  );
}
