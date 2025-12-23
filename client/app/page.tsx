"use client";

import { useState, useEffect } from "react";
import { Login } from "../components/Login";
import { Dashboard } from "../components/Dashboard";
import { FormBuilder } from "../components/FormBuilder";
import { FormViewer } from "../components/FormViewer";
import { ResponsesViewer } from "../components/ResponsesViewer";
import { User, Form, Response } from "@/types/form";
import { loginUser } from "@/lib/api";

const mockForms: Form[] = [
  {
    id: "1",
    title: "Customer Feedback Survey",
    description: "Help us improve our services",
    createdBy: "1",
    createdAt: "2024-01-15",
    published: true,
    questions: [
      { id: "q1", type: "text", title: "What is your name?", required: true },
      {
        id: "q2",
        type: "multiple-choice",
        title: "How satisfied are you?",
        required: true,
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
      },
      {
        id: "q3",
        type: "textarea",
        title: "Additional comments",
        required: false,
      },
    ],
  },
  {
    id: "2",
    title: "Event Registration",
    description: "Register for our upcoming event",
    createdBy: "1",
    createdAt: "2024-01-20",
    published: true,
    questions: [
      { id: "q1", type: "text", title: "Full Name", required: true },
      { id: "q2", type: "text", title: "Email Address", required: true },
      {
        id: "q3",
        type: "dropdown",
        title: "Preferred Session",
        required: true,
        options: ["Morning", "Afternoon", "Evening"],
      },
      {
        id: "q4",
        type: "checkbox",
        title: "Topics of Interest",
        required: false,
        options: ["Technology", "Business", "Marketing", "Design"],
      },
    ],
  },
];

const mockResponses: Response[] = [
  {
    id: "1",
    formId: "1",
    submittedAt: "2024-01-16T10:30:00",
    answers: { q1: "Alice Smith", q2: "Very Satisfied", q3: "Great service!" },
  },
  {
    id: "2",
    formId: "1",
    submittedAt: "2024-01-16T14:20:00",
    answers: { q1: "Bob Johnson", q2: "Satisfied", q3: "" },
  },
  {
    id: "3",
    formId: "2",
    submittedAt: "2024-01-21T09:15:00",
    answers: {
      q1: "Carol White",
      q2: "carol@example.com",
      q3: "Morning",
      q4: ["Technology", "Design"],
    },
  },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [forms, setForms] = useState<Form[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [view, setView] = useState<
    "dashboard" | "builder" | "viewer" | "responses"
  >("dashboard");
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedForms = localStorage.getItem("forms");
    const storedResponses = localStorage.getItem("responses");

    if (storedForms) {
      setForms(JSON.parse(storedForms));
    } else {
      setForms(mockForms);
    }

    if (storedResponses) {
      setResponses(JSON.parse(storedResponses));
    } else {
      setResponses(mockResponses);
    }
  }, []);

  //  current user
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const res = await loginUser({ email, password });

    if (!res.success) {
      throw new Error("Invalid email or password");
    }
    setCurrentUser(res.user);
    localStorage.setItem("currentUser", JSON.stringify(res.user));
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setView("dashboard");
  };

  const handleCreateForm = () => {
    setEditingFormId(null);
    setView("builder");
  };

  const handleEditForm = (formId: string) => {
    setEditingFormId(formId);
    setView("builder");
  };

  const handleSaveForm = (form: Form) => {
    if (editingFormId) {
      setForms(forms.map((f) => (f.id === editingFormId ? form : f)));
    } else {
      setForms([...forms, form]);
    }
    setView("dashboard");
  };

  const handleDeleteForm = (formId: string) => {
    setForms(forms.filter((f) => f.id !== formId));
    setResponses(responses.filter((r) => r.formId !== formId));
  };

  const handleViewForm = (formId: string) => {
    setSelectedFormId(formId);
    setView("viewer");
  };

  const handleViewResponses = (formId: string) => {
    setSelectedFormId(formId);
    setView("responses");
  };

  const handleSubmitResponse = (response: Response) => {
    setResponses([...responses, response]);
  };

  const handleTogglePublish = (formId: string) => {
    setForms(
      forms.map((f) =>
        f.id === formId ? { ...f, published: !f.published } : f
      )
    );
  };

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
          forms={forms.filter((f) => f.createdBy === currentUser.id)}
          responses={responses}
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
          responses={responses.filter((r) => r.formId === selectedFormId)}
          onBack={() => setView("dashboard")}
        />
      )}
    </div>
  );
}
