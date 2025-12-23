import { useState } from 'react';
import { Form, Response } from '../types/form';

interface FormViewerProps {
  form: Form;
  onSubmit: (response: Response) => void;
  onBack: () => void;
}

export function FormViewer({ form, onSubmit, onBack }: FormViewerProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
    if (errors[questionId]) {
      setErrors({ ...errors, [questionId]: '' });
    }
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    const current = answers[questionId] || [];
    const updated = checked
      ? [...current, option]
      : current.filter((v: string) => v !== option);
    handleChange(questionId, updated);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    form.questions.forEach(question => {
      if (question.required && !answers[question.id]) {
        newErrors[question.id] = 'This question is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    const response: Response = {
      id: Date.now().toString(),
      formId: form.id,
      submittedAt: new Date().toISOString(),
      answers,
    };
    
    onSubmit(response);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-gray-900 mb-2">Response Submitted!</h2>
          <p className="text-gray-600 mb-6">Thank you for your response.</p>
          <button
            onClick={onBack}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h1 className="text-gray-900 mb-2">{form.title}</h1>
          <p className="text-gray-600">{form.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-gray-900 mb-3">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {question.type === 'text' && (
                <input
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Your answer"
                />
              )}

              {question.type === 'textarea' && (
                <textarea
                  value={answers[question.id] || ''}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  placeholder="Your answer"
                  rows={4}
                />
              )}

              {question.type === 'multiple-choice' && (
                <div className="space-y-2">
                  {(question.options || []).map((option, index) => (
                    <label key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleChange(question.id, e.target.value)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'checkbox' && (
                <div className="space-y-2">
                  {(question.options || []).map((option, index) => (
                    <label key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(answers[question.id] || []).includes(option)}
                        onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'dropdown' && (
                <select
                  value={answers[question.id] || ''}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">Choose an option</option>
                  {(question.options || []).map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {errors[question.id] && (
                <p className="text-red-600 mt-2">{errors[question.id]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}
