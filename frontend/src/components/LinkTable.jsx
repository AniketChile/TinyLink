import { api } from "../api";
import { Link } from "react-router-dom";

export default function LinksTable({ links, refresh }) {
  const del = async (code) => {
    await api.delete(`/links/${code}`);
    refresh();
  };

  return (
    <table className="w-full border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Code</th>
          <th className="p-2">URL</th>
          <th className="p-2">Clicks</th>
          <th className="p-2">Last Clicked</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {links.map((l) => (
          <tr key={l.code}>
            <td className="p-2">{l.code}</td>
            <td className="p-2 truncate">{l.target_url}</td>
            <td className="p-2">{l.total_clicks}</td>
            <td className="p-2">{l.last_clicked || "-"}</td>
            <td className="p-2 space-x-2">
              <Link
                to={`/code/${l.code}`}
                className="text-blue-600 underline"
              >
                Stats
              </Link>

              <button
                className="text-red-600 underline"
                onClick={() => del(l.code)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
