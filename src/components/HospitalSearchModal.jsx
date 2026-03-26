import React, { useState, useEffect } from "react";
import ToastMessage from "./ToastMessage";

const HospitalSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndices([]);
      setToast(null);
      return;
    }
  }, [isOpen]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();

    if (query.trim().length < 2) {
      setError("Please enter at least 2 characters to search");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedIndices([]);
    setResults([]);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const targetUrl = `${baseUrl}/api/search-hospitals?query=${encodeURIComponent(query.trim())}`;
      console.log("🔍 Searching via:", targetUrl);

      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch hospitals");
      }
      const result = await response.json();
      if (result.success) {
        setResults(result.results || []);
        if (result.results?.length === 0) {
          setError("No  found for this search");
        }
      } else {
        throw new Error(result.error || "Failed to search hospitals");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIndices.length === results.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(results.map((_, index) => index));
    }
  };

  const toggleSelectRow = (index) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const handleSaveLeads = async () => {
    if (selectedIndices.length === 0) return;

    setIsSaving(true);
    setError(null);

    const payload = selectedIndices.map((index) => ({
      name: results[index].name,
      rating: results[index].rating,
      address: results[index].address,
      phoneNumber: results[index].phoneNumber,
      websiteLink: results[index].websiteLink,
      email: results[index].email,
      mapsLink: results[index].mapsLink,
    }));

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
      const targetUrl = `${baseUrl}/api/leads`;
      console.log("🚀 Calling API:", targetUrl);

      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Server responded with ${response.status}`,
        );
      }

      const result = await response.json();
      if (result.success) {
        showToast(`Successfully saved ${result.insertedCount} leads!`, "success");
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        throw new Error(result.error || "Failed to save leads");
      }
    } catch (err) {
      setError(err.message);
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <ToastMessage message={toast?.message} type={toast?.type} />
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header/Search Input */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-4"
          >
            <div className="relative flex-1 group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                🔍
              </span>
              <input
                autoFocus
                type="text"
                placeholder="Search hospitals by name, area or city... (Press Enter to search)"
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-gray-900 shadow-sm"
                value={query}
                onChange={handleQueryChange}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || query.trim().length < 2}
              className={`px-8 py-3 bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
              title="Close"
            >
              ✕
            </button>
          </form>
        </div>

        {selectedIndices.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex justify-between items-center animate-in slide-in-from-top duration-300">
            <span className="text-sm font-semibold text-blue-800">
              ✨ {selectedIndices.length} leads selected
            </span>
            <button
              onClick={handleSaveLeads}
              disabled={isSaving}
              className={`px-6 py-2 bg-blue-600 text-white font-bold rounded-lg transition-all shadow-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                "Save Selected leads"
              )}
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">
                Scraping live data from Google Maps...
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-4 w-10">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={
                          selectedIndices.length === results.length &&
                          results.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((hospital, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-blue-50/50 transition-colors group ${selectedIndices.includes(index) ? "bg-blue-50" : ""}`}
                      onClick={() => toggleSelectRow(index)}
                    >
                      <td
                        className="px-4 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          checked={selectedIndices.includes(index)}
                          onChange={() => toggleSelectRow(index)}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {hospital.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ {hospital.rating}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]"
                        title={hospital.address}
                      >
                        {hospital.address}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {hospital.phoneNumber || "No Phone"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {hospital.email || "No Email"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                        {hospital.websiteLink && hospital.websiteLink !== "No Website" ? (
                          <a
                            href={hospital.websiteLink.startsWith('http') ? hospital.websiteLink : `https://${hospital.websiteLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            Visit Website
                          </a>
                        ) : (
                          "No Website"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                        {hospital.mapsLink ? (
                          <a
                            href={hospital.mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800 hover:underline transition-colors"
                          >
                            <span>📍</span>
                            Maps Link
                          </a>
                        ) : (
                          "No Link"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                🏥
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No found
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                We couldn't find any hospitals matching "{query}". Try a
                different search term.
              </p>
            </div>
          )}

          {!isLoading && query.length < 2 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-2xl">
                🔎
              </div>
              <h3 className="text-lg font-semibold text-gray-900 font-display">
                Start searching
              </h3>
              <p className="text-gray-500">
                Type at least 2 characters to search for hospitals live.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-shake">
              <span className="text-xl">⚠️</span>
              <p className="font-medium text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalSearchModal;
