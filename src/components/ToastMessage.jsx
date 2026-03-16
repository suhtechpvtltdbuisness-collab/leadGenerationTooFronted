import React from "react";

const ToastMessage = ({ message, type = "error" }) => {
  if (!message) return null;

  const variants = {
    success: "bg-green-50 text-green-700 border-green-200",
    error: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const classes = variants[type] || variants.info;

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`px-4 py-3 rounded-lg shadow-lg border text-sm font-semibold ${classes}`}
      >
        {message}
      </div>
    </div>
  );
};

export default ToastMessage;