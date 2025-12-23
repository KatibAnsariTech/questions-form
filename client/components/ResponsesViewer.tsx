import { useState, useEffect } from "react";
import { Form, Response } from "../types/form";
import { getResponsesByForm } from "@/lib/api";
import { toast } from "sonner";

interface ResponsesViewerProps {
  form: Form;
  onBack: () => void;
}

export function ResponsesViewer({ form, onBack }: ResponsesViewerProps) {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResponses();
  }, [form.id]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const data = await getResponsesByForm(form.id);
      setResponses(data);
    } catch (error: any) {
      console.error("Error fetching responses:", error);
      toast.error(error.response?.data?.message || "Failed to fetch responses");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (responses.length === 0) return;

    // Create CSV header
    const headers = [
      "Submitted At",
      "Email",
      ...form.questions.map((q) => q.title),
    ];
    const csvRows = [headers.join(",")];

    // Add data rows
    responses.forEach((response) => {
      const dateStr = response.createdAt || response.submittedAt;
      const row = [
        new Date(dateStr).toLocaleString(),
        `"${response.submittedBy || "Anonymous"}"`,
        ...form.questions.map((q) => {
          const answer = response.answers[q.id];
          if (Array.isArray(answer)) {
            return `"${answer.join(", ")}"`;
          }
          return `"${answer || ""}"`;
        }),
      ];
      csvRows.push(row.join(","));
    });

    // Download
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title.replace(/\s+/g, "_")}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatAnswer = (answer: any) => {
    if (Array.isArray(answer)) {
      return answer.join(", ");
    }
    return answer || "-";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
          {responses.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={fetchResponses}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                title="Refresh responses"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export CSV
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-gray-900 mb-2">{form.title}</h1>
          <p className="text-gray-600">{responses.length} responses</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Loading responses...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No responses yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Individual Responses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-4">Individual Responses</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-700">
                        Submitted
                      </th>
                      <th className="text-left py-3 px-4 text-gray-700">
                        Email
                      </th>
                      {form.questions.map((question) => (
                        <th
                          key={question.id}
                          className="text-left py-3 px-4 text-gray-700"
                        >
                          {question.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {responses.map((response) => (
                      <tr
                        key={response.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(
                            response.createdAt || response.submittedAt
                          ).toLocaleDateString()}{" "}
                          <br />
                          {new Date(
                            response.createdAt || response.submittedAt
                          ).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {response.submittedBy || "Anonymous"}
                        </td>
                        {form.questions.map((question) => (
                          <td
                            key={question.id}
                            className="py-3 px-4 text-gray-700"
                          >
                            {formatAnswer(response.answers[question.id])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
