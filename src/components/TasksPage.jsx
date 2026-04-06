import React, { useState, useEffect, useRef } from "react";
import ToastMessage from "./ToastMessage";
import { getTasks, createTask, updateTask, deleteTask, bulkDeleteTasks, updateTasksStatusBulk } from "../service";

/* ─────────────────────────────────────────────
   Utility helpers
───────────────────────────────────────────── */
const getStatusColor = (status) => {
  switch (status) {
    case "To Do":      return { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500"   };
    case "In Progress":return { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" };
    case "Done":       return { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500"  };
    case "Cancelled":  return { bg: "bg-red-100",    text: "text-red-700",    dot: "bg-red-500"    };
    default:           return { bg: "bg-gray-100",   text: "text-gray-700",   dot: "bg-gray-400"   };
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":   return { bg: "bg-red-100",    text: "text-red-700"    };
    case "Medium": return { bg: "bg-orange-100", text: "text-orange-700" };
    case "Low":    return { bg: "bg-green-100",  text: "text-green-700"  };
    default:       return { bg: "bg-gray-100",   text: "text-gray-600"   };
  }
};



/* ─────────────────────────────────────────────
   Static seed data (simulates fetched tasks)
───────────────────────────────────────────── */
const TODAY = new Date().toISOString().split("T")[0];

const SEED_TASKS = [
  { _id: "t0a", title: "Kick-off call with Innovate Corp",  assignee: "Sarah Chen",      phone: "(555) 987-6543", email: "sarah.chen@innovatecorp.com",  dueDate: TODAY,        status: "To Do",       priority: "High",   source: "LinkedIn Ad"    },
  { _id: "t0b", title: "Send onboarding docs to Benry",     assignee: "Emily Rodriguez", phone: "(555) 741-8520", email: "benry.pams@techsolution.com",  dueDate: TODAY,        status: "In Progress", priority: "Medium", source: "Referral"       },
  { _id: "t1",  title: "Follow up with Sarah Chen",         assignee: "Mike Johnson",    phone: "(555) 123-4567", email: "sarah.c@techsolutions.com",    dueDate: "2026-04-05", status: "To Do",       priority: "High",   source: "LinkedIn Ad"    },
  { _id: "t2",  title: "Send proposal to Innovate Corp",    assignee: "Emily Rodriguez", phone: "(555) 234-5678", email: "mjohnson@innovate.com",         dueDate: "2026-04-06", status: "In Progress", priority: "Medium", source: "Website Form"   },
  { _id: "t3",  title: "Review Growth Partners contract",   assignee: "David Lee",       phone: "(555) 345-6789", email: "emily@growthpartners.co",       dueDate: "2026-04-07", status: "Done",        priority: "Low",    source: "Referral"       },
  { _id: "t4",  title: "Cold call Future Systems leads",    assignee: "Mike Johnson",    phone: "(555) 456-7890", email: "david.lee@futuresystems.io",    dueDate: "2026-04-08", status: "To Do",       priority: "High",   source: "Email Campaign" },
  { _id: "t5",  title: "Schedule demo with Tech Solutions", assignee: "Sarah Chen",      phone: "(555) 123-4567", email: "sarah.c@techsolutions.com",    dueDate: "2026-04-09", status: "In Progress", priority: "Medium", source: "LinkedIn Ad"    },
  { _id: "t6",  title: "Update CRM with new contacts",     assignee: "Emily Rodriguez", phone: "(555) 234-5678", email: "mjohnson@innovate.com",         dueDate: "2026-04-10", status: "To Do",       priority: "Low",    source: "Website Form"   },
  { _id: "t7",  title: "Prepare onboarding materials",     assignee: "David Lee",       phone: "(555) 345-6789", email: "emily@growthpartners.co",       dueDate: "2026-04-11", status: "Done",        priority: "Medium", source: "Referral"       },
  { _id: "t8",  title: "Audit email campaign results",     assignee: "Sarah Chen",      phone: "(555) 456-7890", email: "emily@growthpartners.com",      dueDate: "2026-04-12", status: "Cancelled",   priority: "Low",    source: "Email Campaign" },
  { _id: "t9",  title: "Negotiate deal with Benry Pams",   assignee: "Mike Johnson",    phone: "(555) 345-6789", email: "david.@techsolution.com",       dueDate: "2026-04-13", status: "Done",        priority: "High",   source: "Referral"       },
];

const BLANK_FORM = {
  title: "",
  assignee: "",
  phone: "",
  email: "",
  dueDate: "",
  status: "To Do",
  priority: "Medium",
  source: "Referral",
  notes: "",
};

const STATUS_OPTIONS   = ["To Do", "In Progress", "Done", "Cancelled"];
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];
const SOURCE_OPTIONS   = ["LinkedIn Ad", "Website Form", "Referral", "Email Campaign"];
const ITEMS_PER_PAGE   = 5;

/* ═══════════════════════════════════════════════
   TasksPage component
═══════════════════════════════════════════════ */
const TasksPage = () => {
  const [tasks,          setTasks         ] = useState(SEED_TASKS);
  const [search,         setSearch        ] = useState("");
  const [filterStatus,   setFilterStatus  ] = useState("All");
  const [showFilter,     setShowFilter    ] = useState(false);
  const [currentPage,    setCurrentPage   ] = useState(1);
  const [selectedIds,    setSelectedIds   ] = useState([]);
  const [toast,          setToast         ] = useState(null);
  const [showModal,      setShowModal     ] = useState(false);
  const [editingTask,    setEditingTask   ] = useState(null);
  const [form,           setForm          ] = useState(BLANK_FORM);
  const [deletingId,     setDeletingId    ] = useState(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isLoading,      setIsLoading     ] = useState(false);
  const [error,          setError         ] = useState(null);
  const [bulkStatus,     setBulkStatus    ] = useState("To Do");
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const filterRef = useRef(null);

  /* Auto-dismiss toast */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  /* Close filter dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilter(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Initial fetch from backend */
  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const remoteTasks = await getTasks();
        if (Array.isArray(remoteTasks) && remoteTasks.length > 0) {
          setTasks(remoteTasks);
        }
      } catch (err) {
        setError(err.message || "Failed to load tasks from server");
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const showToast = (message, type = "error") => setToast({ message, type });

  /* ── Derived stats ── */
  const totalTasks      = tasks.length;
  const newToday        = tasks.filter(t => {
    const d = new Date(t.dueDate);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  }).length;
  const inProgressCount = tasks.filter(t => t.status === "In Progress").length;
  const doneCount       = tasks.filter(t => t.status === "Done").length;
  const completionRate  = totalTasks > 0 ? ((doneCount / totalTasks) * 100).toFixed(1) + "%" : "0%";

  /* ── Filter & search ── */
  const filtered = tasks.filter(t => {
    const matchSearch = (
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.assignee.toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated   = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  /* ── Selection helpers ── */
  const validIds   = paginated.filter(t => t._id).map(t => t._id);
  const allSelected = validIds.length > 0 && validIds.every(id => selectedIds.includes(id));
  const someSelected = selectedIds.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(prev => prev.filter(id => !validIds.includes(id)));
    else             setSelectedIds(prev => [...new Set([...prev, ...validIds])]);
  };

  const toggleRow = (id) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  /* ── Add / Edit modal ── */
  const openAdd = () => {
    setEditingTask(null);
    setForm(BLANK_FORM);
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setForm({
      title:    task.title,
      assignee: task.assignee,
      phone:    task.phone || "",
      email:    task.email || "",
      dueDate:  task.dueDate,
      status:   task.status,
      priority: task.priority,
      source:   task.source,
      notes:    task.notes || "",
    });
    setShowModal(true);
  };

  const handleFormChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.title.trim()) { showToast("Task title is required."); return; }
    if (!form.assignee.trim()) { showToast("Assignee is required."); return; }
    if (!form.dueDate) { showToast("Due date is required."); return; }

    try {
      const payload = {
        title: form.title.trim(),
        assignee: form.assignee.trim(),
        phone: form.phone || undefined,
        email: form.email || undefined,
        source: form.source,
        dueDate: form.dueDate,
        status: form.status,
        priority: form.priority,
        notes: form.notes?.trim() || "",
      };

      if (editingTask && editingTask._id) {
        const updated = await updateTask(editingTask._id, payload);
        const updatedTask = updated && updated._id ? updated : { ...editingTask, ...payload };
        setTasks(prev => prev.map(t =>
          t._id === editingTask._id ? updatedTask : t
        ));
        showToast("Task updated successfully.", "success");
      } else {
        const created = await createTask(payload);
        const createdTask = created && created._id ? created : { _id: `t${Date.now()}`, ...payload };
        setTasks(prev => [createdTask, ...prev]);
        showToast("Task added successfully.", "success");
      }
      setShowModal(false);
    } catch (err) {
      showToast(err.message || "Failed to save task");
    }
  };

  /* ── Single delete ── */
  const handleDelete = async (task) => {
    setDeletingId(task._id);
    try {
      await deleteTask(task._id);
      setTasks(prev => prev.filter(t => t._id !== task._id));
      setSelectedIds(prev => prev.filter(id => id !== task._id));
      showToast(`Task "${task.title}" deleted.`, "success");
    } catch (err) {
      showToast(err.message || "Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Bulk delete ── */
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected task${selectedIds.length > 1 ? "s" : ""}? This cannot be undone.`)) return;
    setIsBulkDeleting(true);
    try {
      const deletedCount = await bulkDeleteTasks(selectedIds);
      setTasks(prev => prev.filter(t => !selectedIds.includes(t._id)));
      setSelectedIds([]);
      showToast(`${deletedCount} task${deletedCount > 1 ? "s" : ""} deleted.`, "success");
      setCurrentPage(1);
    } catch (err) {
      showToast(err.message || "Failed to delete tasks");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  /* ── Bulk status update (PATCH) ── */
  const handleBulkStatusUpdate = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Update status to "${bulkStatus}" for ${selectedIds.length} selected task${selectedIds.length > 1 ? "s" : ""}?`)) return;

    setIsBulkUpdating(true);
    try {
      await updateTasksStatusBulk({ ids: selectedIds, status: bulkStatus });
      setTasks(prev => prev.map(task =>
        selectedIds.includes(task._id)
          ? { ...task, status: bulkStatus }
          : task
      ));
      showToast(`Updated ${selectedIds.length} task${selectedIds.length > 1 ? "s" : ""} to "${bulkStatus}".`, "success");
    } catch (err) {
      showToast(err.message || "Failed to update task status");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  /* ── Import / Export stubs ── */
  const handleImport = () => showToast("Import feature coming soon.", "success");
  const handleExport = () => {
    const csv = [
      ["Title", "Assignee", "Phone", "Email", "Due Date", "Status", "Priority", "Source"],
      ...tasks.map(t => [t.title, t.assignee, t.phone || "", t.email || "", t.dueDate, t.status, t.priority, t.source]),
    ].map(row => row.map(v => `"${v}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "tasks.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Tasks exported successfully.", "success");
  };

  /* ────────────────────────────────────────────
     Render
  ──────────────────────────────────────────── */
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      <ToastMessage message={toast?.message} type={toast?.type} />

      {/* ── Page Title ── */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Tasks Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Manage and track all your team tasks</p>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Tasks",      value: totalTasks,     icon: "☰",  iconBg: "bg-blue-50",   iconColor: "text-blue-600"  },
          { label: "New Tasks Today",  value: newToday,       icon: "📝", iconBg: "bg-green-50",  iconColor: "text-green-600" },
          { label: "In Progress",      value: inProgressCount,icon: "✉️", iconBg: "bg-yellow-50", iconColor: "text-yellow-600"},
          { label: "Completion Rate",  value: completionRate, icon: "🌐", iconBg: "bg-purple-50", iconColor: "text-purple-600"},
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1 truncate">{card.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{card.value}</p>
            </div>
            <div className={`shrink-0 w-8 h-8 sm:w-10 sm:h-10 ${card.iconBg} rounded-lg flex items-center justify-center text-base sm:text-lg ${card.iconColor} ml-2`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ── Action Toolbar ── */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-[280px]">
          {/* Add Task */}
          <button
            onClick={openAdd}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            <span className="text-base">+</span> Add Task
          </button>
          {/* Import */}
          <button
            onClick={handleImport}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            <span>⬇️</span> Import
          </button>
          {/* Export */}
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            <span>⬆️</span> Export
          </button>
          {/* Filter dropdown */}
          <div className="relative flex-1 sm:flex-none" ref={filterRef}>
            <button
              onClick={() => setShowFilter(v => !v)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
            >
              <span>🔽</span> Filter {filterStatus !== "All" && `(${filterStatus})`}
            </button>
            {showFilter && (
              <div className="absolute left-0 top-11 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 min-w-[160px]">
                <p className="text-[10px] uppercase text-gray-400 font-bold mb-2 px-1">Status</p>
                {["All", ...STATUS_OPTIONS].map(s => (
                  <button
                    key={s}
                    onClick={() => { setFilterStatus(s); setCurrentPage(1); setShowFilter(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium mb-0.5 transition-colors ${
                      filterStatus === s ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-auto flex-1 max-w-full sm:max-w-[300px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search Tasks..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
          />
        </div>
      </div>


      {/* ── Bulk actions bar ── */}
      {selectedIds.length > 0 && (
        <div className="mb-4 px-5 py-3 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <span className="text-sm font-semibold text-blue-800">
            ✨ {selectedIds.length} task{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {/* Bulk status update */}
            <div className="flex items-center gap-2">
              <select
                value={bulkStatus}
                onChange={e => setBulkStatus(e.target.value)}
                className="px-3 py-1.5 border border-blue-200 rounded-lg text-xs sm:text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={handleBulkStatusUpdate}
                disabled={isBulkUpdating}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
              >
                {isBulkUpdating ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating...</>
                ) : (
                  <>Update Status</>
                )}
              </button>
            </div>

            {/* Divider */}
            <span className="hidden sm:inline-block w-px h-6 bg-blue-200" />

            {/* Bulk delete */}
            <button onClick={() => setSelectedIds([])} className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 font-medium">
              Clear selection
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="inline-flex items-center gap-2 px-5 py-1.5 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
            >
              {isBulkDeleting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</>
              ) : (
                <>🗑️ Delete {selectedIds.length} Selected</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Tasks List</h2>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl">📝</div>
            <p className="text-gray-500 font-medium">No tasks found</p>
            <button onClick={openAdd} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-semibold hover:bg-blue-700 transition-all">
              + Add Your First Task
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={allSelected}
                        ref={el => { if (el) el.indeterminate = someSelected; }}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    {["Name", "Assignee", "Phone", "Email", "Source", "Due Date", "Status", "Actions"].map(col => (
                      <th key={col} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map((task) => {
                    const statusStyle   = getStatusColor(task.status);
                    const priorityStyle = getPriorityColor(task.priority);
                    const isSelected    = selectedIds.includes(task._id);

                    return (
                      <tr
                        key={task._id}
                        className={`hover:bg-blue-50/40 transition-colors group ${isSelected ? "bg-blue-50/60" : ""}`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(task._id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* Title */}
                        <td className="px-4 py-3 min-w-[200px]">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[220px]" title={task.title}>
                            {task.title}
                          </p>
                          <span className={`mt-0.5 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${priorityStyle.bg} ${priorityStyle.text}`}>
                            {task.priority}
                          </span>
                        </td>

                        {/* Assignee */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee)}&background=2563eb&color=fff&size=32`}
                              alt={task.assignee}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-gray-700 font-medium">{task.assignee}</span>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {task.phone || <span className="text-gray-400">—</span>}
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          {task.email
                            ? <a href={`mailto:${task.email}`} className="text-blue-600 hover:underline">{task.email}</a>
                            : <span className="text-gray-400">—</span>}
                        </td>

                        {/* Source */}
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{task.source}</td>

                        {/* Due Date */}
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                        </td>

                        {/* Status badge */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                            {task.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(task)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(task)}
                              disabled={deletingId === task._id || isBulkDeleting}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              {deletingId === task._id ? "..." : "🗑️"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} tasks
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ⟨|
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 rounded text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 rounded text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  |⟩
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ════════════════════════
          Add / Edit Task Modal
      ════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl leading-none"
            >
              ×
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => handleFormChange("title", e.target.value)}
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Assignee <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.assignee}
                  onChange={e => handleFormChange("assignee", e.target.value)}
                  placeholder="Assignee name"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Due Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => handleFormChange("dueDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status & Priority row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => handleFormChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={e => handleFormChange("priority", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {PRIORITY_OPTIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Phone & Email row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => handleFormChange("phone", e.target.value)}
                    placeholder="(555) 000-0000"
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => handleFormChange("email", e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Source */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Source</label>
                <select
                  value={form.source}
                  onChange={e => handleFormChange("source", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {SOURCE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => handleFormChange("notes", e.target.value)}
                  placeholder="Add any context or next steps for this task"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all shadow"
              >
                {editingTask ? "Save Changes" : "Add Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
