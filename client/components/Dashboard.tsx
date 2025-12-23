import { User, Form, Response } from "../types/form";

interface DashboardProps {
  user: User;
  forms: Form[];
  responses: Response[];
  onLogout: () => void;
  onCreateForm: () => void;
  onEditForm: (formId: string) => void;
  onDeleteForm: (formId: string) => void;
  onViewForm: (formId: string) => void;
  onViewResponses: (formId: string) => void;
  onTogglePublish: (formId: string) => void;
}

export function Dashboard({
  user,
  forms,
  responses,
  onLogout,
  onCreateForm,
  onEditForm,
  onDeleteForm,
  onViewForm,
  onViewResponses,
  onTogglePublish,
}: DashboardProps) {
  const getResponseCount = (formId: string) => {
    return responses.filter((r) => r.formId === formId).length;
  };

  const copyFormLink = (formId: string) => {
    const link = `${window.location.origin}?formId=${formId}`;
    navigator.clipboard.writeText(link);
    alert("Form link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900">FormMaker</h1>
            <p className="text-gray-600">
              Welcome back,{" "}
              <span className="font-bold underline">{user.email}</span>
            </p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            > 
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">My Forms</h2>
          <button
            onClick={onCreateForm}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Form
          </button>
        </div>

        {forms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-gray-900 mb-2">No forms yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first form to start collecting responses
              </p>
              <button
                onClick={onCreateForm}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Form
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{form.title}</h3>
                    <p className="text-gray-600">{form.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      form.published ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    {form.published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span>{getResponseCount(form.id)} responses</span>
                  </div>
                  <div>{form.questions.length} questions</div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => onEditForm(form.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => onViewForm(form.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    title="Preview"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </button>
                  <button
                    onClick={() => onViewResponses(form.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                    title="Responses"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    {getResponseCount(form.id)}
                  </button>
                  <button
                    onClick={() => onTogglePublish(form.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    title="Toggle publish status"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  {form.published && (
                    <button
                      onClick={() => copyFormLink(form.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                      title="Copy link"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this form?")
                      ) {
                        onDeleteForm(form.id);
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded transition-colors ml-auto"
                    title="Delete"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
