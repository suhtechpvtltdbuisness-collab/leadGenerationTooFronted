import React, { useState, useEffect } from "react";
import ToastMessage from "./ToastMessage";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingLeadId, setDeletingLeadId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  const fetchLeads = async () => {
    setIsLoading(true);
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
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLead = async (lead) => {
    const leadId = lead?._id;

    if (!leadId) {
      showToast("This lead cannot be deleted because ID is missing.");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete lead "${lead.name}"? This action cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingLeadId(leadId);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(`${baseUrl}/api/leads/${leadId}`, {
        method: "DELETE",
      });

      const responseText = await response.text();
      let result = null;

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          result = null;
        }
      }

      if (!response.ok || (result && result.success === false)) {
        throw new Error(
          result?.error || `Failed to delete lead (status: ${response.status})`,
        );
      }

      setLeads((prevLeads) => prevLeads.filter((item) => item._id !== leadId));
      showToast(`Lead "${lead.name}" deleted successfully.`, "success");
    } catch (err) {
      showToast(err.message || "Failed to delete lead");
      console.error("Delete error:", err);
    } finally {
      setDeletingLeadId(null);
    }
  };

  return (
    <div className="p-8">
      <ToastMessage message={toast?.message} type={toast?.type} />

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

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading your leads...</p>
        </div>
      )}

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

      {!isLoading && !error && leads.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            👥
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No leads collected yet
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Start searching for hospitals using the search icon in the header to
            populate your leads list.
          </p>
        </div>
      )}

      {!isLoading && !error && leads.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    SR NO
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    NAME
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    RATING
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    ADDRESS
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    PHONE
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    EMAIL
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    WEBSITE
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    GOOGLE LINK
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                    DATE ADDED
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-700 text-right">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead, index) => (
                  <tr
                    key={lead._id || index}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⭐ {lead.rating}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]"
                      title={lead.address}
                    >
                      {lead.address || "No Address"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {lead.phoneNumber || "No Phone"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {lead.email || "No Email"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                      {lead.websiteLink && lead.websiteLink !== "No Website" ? (
                        <a
                          href={lead.websiteLink.startsWith('http') ? lead.websiteLink : `https://${lead.websiteLink}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          Visit Website
                        </a>
                      ) : (
                        "No Website"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                      {lead.mapsLink ? (
                        <a
                          href={lead.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 hover:underline transition-colors"
                        >
                          <span>📍</span>
                          Maps Link
                        </a>
                      ) : (
                        "No Link"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="font-medium">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(lead.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteLead(lead)}
                        disabled={deletingLeadId === lead._id || !lead._id}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title={!lead._id ? "Lead ID missing" : "Delete lead"}
                      >
                        {deletingLeadId === lead._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
