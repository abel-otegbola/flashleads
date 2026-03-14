import { useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import { CloseCircle } from "@solar-icons/react";
import Input from "../input/Input";
import Button from "../button/Button";
import { milestoneSchema } from "../../schema/clientSchema";
import type { Milestone } from "../../contexts/ClientsContextValue";
import { useOutsideClick } from "../../customHooks/useOutsideClick";
import { ClientsContext } from "../../contexts/ClientsContextValue";

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Milestone, 'id' | 'userId' | 'createdDate'>) => Promise<void>;
  milestone?: Milestone | null;
  preselectedProjectId?: string;
  title?: string;
}

export default function MilestoneModal({ isOpen, onClose, onSubmit, milestone, preselectedProjectId, title }: MilestoneModalProps) {
  const modalRef = useOutsideClick(() => onClose(), false);
  const { projects } = useContext(ClientsContext);

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

  const initialValues: Omit<Milestone, 'id' | 'userId' | 'createdDate'> = milestone ? {
    projectId: milestone.projectId,
    title: milestone.title,
    description: milestone.description,
    dueDate: milestone.dueDate,
    completed: milestone.completed,
    completedDate: milestone.completedDate || '',
    amount: milestone.amount || 0,
  } : {
    projectId: preselectedProjectId || '',
    title: '',
    description: '',
    dueDate: '',
    completed: false,
    completedDate: '',
    amount: 0,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">{title || (milestone ? 'Edit Milestone' : 'Add Milestone')}</h2>
          <button onClick={onClose} className="text-gray/ hover:opacity-[0.6]">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={milestoneSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await onSubmit(values);
                onClose();
              } catch (error) {
                console.error('Error submitting milestone:', error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Project Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Project *</label>
                  <select
                    name="projectId"
                    value={values.projectId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!!preselectedProjectId}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100"
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {touched.projectId && errors.projectId && (
                    <p className="text-red-500 text-sm mt-1">{errors.projectId}</p>
                  )}
                </div>

                {/* Milestone Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Milestone Details</h3>
                  <div className="space-y-4">
                    <Input
                      name="title"
                      type="text"
                      placeholder="Milestone Title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.title && errors.title ? errors.title : ''}
                    />
                    <textarea
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Milestone Description"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary min-h-[100px]"
                    />
                    {touched.description && errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>

                {/* Dates & Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Timeline & Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="dueDate"
                      type="date"
                      placeholder="Due Date"
                      value={values.dueDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.dueDate && errors.dueDate ? errors.dueDate : ''}
                    />
                    {values.completed && (
                      <Input
                        name="completedDate"
                        type="date"
                        placeholder="Completed Date"
                        value={values.completedDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.completedDate && errors.completedDate ? errors.completedDate : ''}
                      />
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="completed"
                      checked={values.completed}
                      onChange={(e) => {
                        setFieldValue('completed', e.target.checked);
                        if (e.target.checked && !values.completedDate) {
                          setFieldValue('completedDate', new Date().toISOString().split('T')[0]);
                        } else if (!e.target.checked) {
                          setFieldValue('completedDate', '');
                        }
                      }}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label className="text-sm font-medium">Mark as Completed</label>
                  </div>
                </div>

                {/* Amount (Optional) */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment (Optional)</h3>
                  <Input
                    name="amount"
                    type="number"
                    placeholder="Milestone Payment Amount ($)"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.amount && errors.amount ? errors.amount : ''}
                  />
                  <p className="text-sm opacity-[0.6] mt-2">
                    Enter an amount if this milestone is tied to a payment.
                  </p>
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
                    {isSubmitting ? 'Saving...' : (milestone ? 'Update Milestone' : 'Add Milestone')}
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
