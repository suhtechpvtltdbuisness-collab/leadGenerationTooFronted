// Centralized API service for LeadFlow
// All network calls should go through these helpers.

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://lead-generation-tool-backend.vercel.app";

const buildUrl = (path) => {
  const base = API_BASE_URL.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
};

async function parseJsonSafely(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function handleApiResponse(response, fallbackMessage) {
  const data = await parseJsonSafely(response);

  if (!response.ok || (data && data.success === false)) {
    const message =
      data?.error ||
      data?.message ||
      `${fallbackMessage} (status: ${response.status})`;
    throw new Error(message);
  }

  return data;
}

// ─────────────────────────────────────────────
// Leads APIs
// ─────────────────────────────────────────────

export async function getLeads() {
  const response = await fetch(buildUrl("/api/leads"));
  const data = await handleApiResponse(response, "Failed to fetch leads");
  return data?.leads || [];
}

export async function deleteLead(id) {
  if (!id) {
    throw new Error("Lead ID is required to delete a lead");
  }

  const response = await fetch(buildUrl(`/api/leads/${id}`), {
    method: "DELETE",
  });

  await handleApiResponse(response, "Failed to delete lead");
}

export async function bulkDeleteLeads(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("At least one lead ID is required for bulk delete");
  }

  const response = await fetch(buildUrl("/api/leads"), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  const result = await handleApiResponse(response, "Failed to delete leads");
  return result?.deletedCount ?? ids.length;
}

// ─────────────────────────────────────────────
// Tasks APIs
// ─────────────────────────────────────────────

export async function getTasks() {
  const response = await fetch(buildUrl("/api/tasks"));
  const data = await handleApiResponse(response, "Failed to fetch tasks");
  return data?.tasks || [];
}

export async function getTaskById(id) {
  if (!id) throw new Error("Task ID is required");
  const response = await fetch(buildUrl(`/api/tasks/${id}`));
  const data = await handleApiResponse(response, "Failed to fetch task");
  return data?.task || data;
}

export async function createTask(payload) {
  const response = await fetch(buildUrl("/api/tasks"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await handleApiResponse(response, "Failed to create task");
  return data?.task || data;
}

export async function updateTask(id, payload) {
  if (!id) throw new Error("Task ID is required to update a task");

  const response = await fetch(buildUrl(`/api/tasks/${id}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await handleApiResponse(response, "Failed to update task");
  return data?.task || data;
}

export async function updateTasksStatusBulk({ ids, status }) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("At least one task ID is required for bulk status update");
  }
  if (!status) {
    throw new Error("Status value is required for bulk status update");
  }

  const response = await fetch(buildUrl("/api/tasks/bulk-status"), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, status }),
  });

  const data = await handleApiResponse(response, "Failed to update tasks status");
  return data;
}

export async function deleteTask(id) {
  if (!id) throw new Error("Task ID is required to delete a task");

  const response = await fetch(buildUrl(`/api/tasks/${id}`), {
    method: "DELETE",
  });

  await handleApiResponse(response, "Failed to delete task");
}

export async function bulkDeleteTasks(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("At least one task ID is required for bulk delete");
  }

  const response = await fetch(buildUrl("/api/tasks"), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  const result = await handleApiResponse(response, "Failed to delete tasks");
  return result?.deletedCount ?? ids.length;
}

// Optional grouped export for future expansion (tasks, auth, etc.)
const api = {
  getLeads,
  deleteLead,
  bulkDeleteLeads,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTasksStatusBulk,
  deleteTask,
  bulkDeleteTasks,
};

export default api;
