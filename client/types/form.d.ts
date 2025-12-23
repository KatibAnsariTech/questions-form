export interface Question {
  id: string;
  type: 'text' | 'textarea' | 'multiple-choice' | 'checkbox' | 'dropdown';
  title: string;
  required: boolean;
  options?: string[];
}

export interface Form {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  questions: Question[];
  published: boolean;
}

export interface Response {
  id: string;
  formId: string;
  submittedAt: string;
  answers: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}
