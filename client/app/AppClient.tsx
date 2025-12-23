"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Login } from "../components/Login";
import { Dashboard } from "../components/Dashboard";
import { FormBuilder } from "../components/FormBuilder";
import { FormViewer } from "../components/FormViewer";
import { ResponsesViewer } from "../components/ResponsesViewer";
import { User, Form, Response } from "@/types/form";
import {
  loginUser,
  getFormsByUser,
  getFormById,
  createForm as createFormAPI,
  updateForm as updateFormAPI,
  deleteForm as deleteFormAPI,
  submitResponse as submitResponseAPI
} from "@/lib/api";
import { toast } from "sonner";

export default function App() {
  const searchParams = useSearchParams();
  const formIdFromUrl = searchParams.get("formId");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(false);
  const [publicForm, setPublicForm] = useState<Form | null>(null);
  const [view, setView] = useState<
    "dashboard" | "builder" | "viewer" | "responses"
  >("dashboard");
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);

  // Load current user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch forms when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchForms();
    }
  }, [currentUser]);

  // Fetch public form if formId is in URL
  useEffect(() => {
    if (formIdFromUrl) {
      fetchPublicForm(formIdFromUrl);
    }
  }, [formIdFromUrl]);

  const fetchPublicForm = async (formId: string) => {
    try {
      setLoading(true);
      const data = await getFormById(formId);
      if (data.published) {
        setPublicForm(data);
      } else {
        toast.error("This form is not published");
      }
    } catch (error: any) {
      console.error("Error fetching form:", error);
      toast.error("Form not found");
    } finally {
      setLoading(false);
    }
  };


  const fetchForms = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const data = await getFormsByUser(currentUser.id);
      setForms(data);
    } catch (error: any) {
      console.error("Error fetching forms:", error);
      toast.error(error.response?.data?.message || "Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await loginUser({ email, password });

      if (!res.success) {
        throw new Error("Invalid email or password");
      }

      const user = { ...res.user, token: res.token };
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setView("dashboard");
    setForms([]);
    toast.success("Logged out successfully");
  };

  const handleCreateForm = () => {
    setEditingFormId(null);
    setView("builder");
  };

  const handleEditForm = (formId: string) => {
    setEditingFormId(formId);
    setView("builder");
  };

  const handleSaveForm = async (form: Form) => {
    if (!currentUser) return;

    try {
      setLoading(true);

      if (editingFormId) {
        // Update existing form
        await updateFormAPI(editingFormId, form);
        toast.success("Form updated successfully!");
      } else {
        // Create new form
        const formData = {
          ...form,
          createdBy: currentUser.id
        };
        await createFormAPI(formData);
        toast.success("Form created successfully!");
      }

      // Refresh forms list
      await fetchForms();
      setView("dashboard");
    } catch (error: any) {
      console.error("Error saving form:", error);
      toast.error(error.response?.data?.message || "Failed to save form");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    try {
      setLoading(true);
      await deleteFormAPI(formId);
      toast.success("Form deleted successfully!");

      // Refresh forms list
      await fetchForms();
    } catch (error: any) {
      console.error("Error deleting form:", error);
      toast.error(error.response?.data?.message || "Failed to delete form");
    } finally {
      setLoading(false);
    }
  };

  const handleViewForm = (formId: string) => {
    setSelectedFormId(formId);
    setView("viewer");
  };

  const handleViewResponses = (formId: string) => {
    setSelectedFormId(formId);
    setView("responses");
  };

  const handleSubmitResponse = async (response: Response) => {
    try {
      setLoading(true);
      await submitResponseAPI(response);
      toast.success("Response submitted successfully!");
      // Don't redirect immediately - let FormViewer show success state
    } catch (error: any) {
      console.error("Error submitting response:", error);
      toast.error(error.response?.data?.message || "Failed to submit response");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;

    try {
      setLoading(true);
      await updateFormAPI(formId, { ...form, published: !form.published });
      toast.success(
        `Form ${!form.published ? "published" : "unpublished"} successfully!`
      );

      // Refresh forms list
      await fetchForms();
    } catch (error: any) {
      console.error("Error toggling publish:", error);
      toast.error(error.response?.data?.message || "Failed to update form");
    } finally {
      setLoading(false);
    }
  };

  // Public form view (no authentication required)
  if (publicForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FormViewer
          form={publicForm}
          onSubmit={handleSubmitResponse}
          onBack={() => {
            setPublicForm(null);
            window.location.href = "/";
          }}
        />
      </div>
    );
  }

  // Show loading state while fetching public form
  if (formIdFromUrl && loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading form...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const selectedForm = selectedFormId
    ? forms.find((f) => f.id === selectedFormId)
    : null;
  const editingForm = editingFormId
    ? forms.find((f) => f.id === editingFormId)
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {view === "dashboard" && (
        <Dashboard
          user={currentUser}
          forms={forms}
          onLogout={handleLogout}
          onCreateForm={handleCreateForm}
          onEditForm={handleEditForm}
          onDeleteForm={handleDeleteForm}
          onViewForm={handleViewForm}
          onViewResponses={handleViewResponses}
          onTogglePublish={handleTogglePublish}
        />
      )}
      {view === "builder" && (
        <FormBuilder
          user={currentUser}
          existingForm={editingForm}
          onSave={handleSaveForm}
          onCancel={() => setView("dashboard")}
        />
      )}
      {view === "viewer" && selectedForm && (
        <FormViewer
          form={selectedForm}
          onSubmit={handleSubmitResponse}
          onBack={() => setView("dashboard")}
        />
      )}
      {view === "responses" && selectedForm && (
        <ResponsesViewer
          form={selectedForm}
          onBack={() => setView("dashboard")}
        />
      )}
    </div>
  );
}
