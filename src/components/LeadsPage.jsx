import React, { useState, useEffect } from "react";
import ToastMessage from "./ToastMessage";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingLeadId, setDeletingLeadId] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    setSelectedIds([]);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(`${baseUrl}/api/leads`);
      const data = await response.json();
      if (data.success) {
        setLeads(data.leads || []);
      } else {
        throw new Error(data.error || "Failed to fetch leads");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Single delete ── */
  const handleDeleteLead = async (lead) => {
    const leadId = lead?._id;
    if (!leadId) {
      showToast("This lead cannot be deleted because ID is missing.");
      return;
    }
    if (!window.confirm(`Delete lead "${lead.name}"? This action cannot be undone.`)) return;

    setDeletingLeadId(leadId);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(`${baseUrl}/api/leads/${leadId}`, { method: "DELETE" });
      const responseText = await response.text();
      let result = null;
      if (responseText) {
        try { result = JSON.parse(responseText); } catch { result = null; }
      }
      if (!response.ok || (result && result.success === false)) {
        throw new Error(result?.error || `Failed to delete lead (status: ${response.status})`);
      }
      setLeads((prev) => prev.filter((item) => item._id !== leadId));
      setSelectedIds((prev) => prev.filter((id) => id !== leadId));
      showToast(`Lead "${lead.name}" deleted successfully.`, "success");
    } catch (err) {
      showToast(err.message || "Failed to delete lead");
    } finally {
      setDeletingLeadId(null);
    }
  };

  /* ── Bulk delete ── */
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Delete ${selectedIds.length} selected lead${selectedIds.length > 1 ? "s" : ""}? This action cannot be undone.`
      )
    )
      return;

    setIsBulkDeleting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(`${baseUrl}/api/leads`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || (result && result.success === false)) {
        throw new Error(result?.error || `Server responded with ${response.status}`);
      }

      const deletedCount = result?.deletedCount ?? selectedIds.length;
      setLeads((prev) => prev.filter((lead) => !selectedIds.includes(lead._id)));
      setSelectedIds([]);
      showToast(`${deletedCount} lead${deletedCount > 1 ? "s" : ""} deleted successfully.`, "success");
    } catch (err) {
      showToast(err.message || "Failed to delete leads");
      console.error("Bulk delete error:", err);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  /* ── Selection helpers ── */
  const validLeads = leads.filter((l) => l._id);
  const allSelected = validLeads.length > 0 && selectedIds.length === validLeads.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(validLeads.map((l) => l._id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8">
      <ToastMessage message={toast?.message} type={toast?.type} />

      {/* ── Page Header ── */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-sm text-gray-500">
            View and manage all your collected hospital leads
          </p>
        </div>
        <button
          onClick={fetchLeads}
          className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          title="Refresh Data"
        >
          🔄
        </button>
      </div>

      {/* ── Bulk-action bar ── */}
      {selectedIds.length > 0 && (
        <div className="mb-4 px-5 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between animate-in slide-in-from-top duration-300 shadow-sm">
          <span className="text-sm font-semibold text-red-700">
            🗑️ {selectedIds.length} lead{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedIds([])}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              Clear selection
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              {isBulkDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>🗑️ Delete {selectedIds.length} Selected</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading your leads...</p>
        </div>
      )}

      {/* ── Error ── */}
      {!isLoading && error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-xl text-center">
          <p className="font-bold mb-2">⚠️ Error</p>
          <p>{error}</p>
          <button
            onClick={fetchLeads}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && !error && leads.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            👥
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No leads collected yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Start searching for hospitals using the search icon in the header to populate your leads list.
          </p>
        </div>
      )}

      {/* ── Table ── */}
      {!isLoading && !error && leads.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {/* Select-all checkbox */}
                  <th className="px-4 py-3 w-10 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      checked={allSelected}
                      ref={(el) => { if (el) el.indeterminate = someSelected; }}
                      onChange={toggleSelectAll}
                      title={allSelected ? "Deselect all" : "Select all"}
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">SR NO</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[160px]">NAME</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">RATING</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[200px]">ADDRESS</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">PHONE</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[140px]">EMAIL</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[110px]">WEBSITE</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[110px]">GOOGLE LINK</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">DATE ADDED</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead, index) => {
                  const isSelected = selectedIds.includes(lead._id);
                  return (
                    <tr
                      key={lead._id || index}
                      className={`hover:bg-blue-50/40 transition-colors group ${isSelected ? "bg-red-50/60" : ""}`}
                    >
                      {/* Row checkbox */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          disabled={!lead._id}
                          className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer disabled:cursor-not-allowed"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(lead._id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-medium whitespace-nowrap">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">{lead.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ {lead.rating || "—"}
                        </span>
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-gray-600 truncate max-w-[220px]"
                        title={lead.address}
                      >
                        {lead.address || "No Address"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-medium whitespace-nowrap">
                        {lead.phoneNumber || "No Phone"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-medium whitespace-nowrap">
                        {lead.email || "No Email"}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                        {lead.websiteLink && lead.websiteLink !== "No Website" ? (
                          <a
                            href={lead.websiteLink.startsWith("http") ? lead.websiteLink : `https://${lead.websiteLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            Visit Website
                          </a>
                        ) : (
                          <span className="text-gray-400">No Website</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                        {lead.mapsLink ? (
                          <a
                            href={lead.mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 hover:underline transition-colors"
                          >
                            <span>📍</span>Maps Link
                          </a>
                        ) : (
                          <span className="text-gray-400">No Link</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        <div className="font-medium">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {new Date(lead.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteLead(lead)}
                          disabled={deletingLeadId === lead._id || !lead._id || isBulkDeleting}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          title={!lead._id ? "Lead ID missing" : "Delete lead"}
                        >
                          {deletingLeadId === lead._id ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
