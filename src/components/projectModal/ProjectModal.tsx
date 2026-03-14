import { useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import { CloseCircle } from "@solar-icons/react";
import Input from "../input/Input";
import Button from "../button/Button";
import { projectSchema } from "../../schema/clientSchema";
import type { Project } from "../../contexts/ClientsContextValue";
import { useOutsideClick } from "../../customHooks/useOutsideClick";
import { ClientsContext } from "../../contexts/ClientsContextValue";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Project, 'id' | 'userId' | 'createdDate'>) => Promise<void>;
  project?: Project | null;
  preselectedClientId?: string;
  title?: string;
}

export default function ProjectModal({ isOpen, onClose, onSubmit, project, preselectedClientId, title }: ProjectModalProps) {
  const modalRef = useOutsideClick(() => onClose(), false);
  const { clients } = useContext(ClientsContext);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const initialValues: Omit<Project, 'id' | 'userId' | 'createdDate'> = project ? {
    clientId: project.clientId,
    name: project.name,
    description: project.description,
    status: project.status,
    startDate: project.startDate,
    endDate: project.endDate || '',
    budget: project.budget,
    spent: project.spent,
    progress: project.progress,
  } : {
    clientId: preselectedClientId || '',
    name: '',
    description: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    budget: 0,
    spent: 0,
    progress: 0,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">{title || (project ? 'Edit Project' : 'Add New Project')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:opacity-[0.6]">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={projectSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await onSubmit(values);
                onClose();
              } catch (error) {
                console.error('Error submitting project:', error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="space-y-6">
                {/* Client Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Client *</label>
                  <select
                    name="clientId"
                    value={values.clientId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!!preselectedClientId}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100"
                  >
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} ({client.company})
                      </option>
                    ))}
                  </select>
                  {touched.clientId && errors.clientId && (
                    <p className="text-red-500 text-sm mt-1">{errors.clientId}</p>
                  )}
                </div>

                {/* Project Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <Input
                      name="name"
                      type="text"
                      placeholder="Project Name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name && errors.name ? errors.name : ''}
                    />
                    <textarea
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Project Description"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary min-h-[100px]"
                    />
                    {touched.description && errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>

                {/* Status & Dates */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                      >
                        <option value="planning">Planning</option>
                        <option value="in-progress">In Progress</option>
                        <option value="on-hold">On Hold</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <Input
                      name="startDate"
                      type="date"
                      placeholder="Start Date"
                      value={values.startDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.startDate && errors.startDate ? errors.startDate : ''}
                    />
                    <Input
                      name="endDate"
                      type="date"
                      placeholder="End Date (Optional)"
                      value={values.endDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.endDate && errors.endDate ? errors.endDate : ''}
                    />
                  </div>
                </div>

                {/* Budget & Progress */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Budget & Progress</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      name="budget"
                      type="number"
                      placeholder="Total Budget ($)"
                      value={values.budget}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.budget && errors.budget ? errors.budget : ''}
                    />
                    <Input
                      name="spent"
                      type="number"
                      placeholder="Amount Spent ($)"
                      value={values.spent}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.spent && errors.spent ? errors.spent : ''}
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">Progress: {values.progress}%</label>
                      <input
                        type="range"
                        name="progress"
                        min="0"
                        max="100"
                        value={values.progress}
                        onChange={handleChange}
                        className="w-full"
                      />
                      {touched.progress && errors.progress && (
                        <p className="text-red-500 text-sm mt-1">{errors.progress}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Saving...' : (project ? 'Update Project' : 'Add Project')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
