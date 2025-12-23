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
  questions: Question[];
  published: boolean;
}


export interface Response {
  id: string;
  formId: string;
  submittedBy: string;
  submittedAt: string;
  answers: Record<string, any>;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}
