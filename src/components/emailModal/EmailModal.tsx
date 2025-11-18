import { useEffect, useContext } from "react";
import { Formik, Form } from "formik";
import { CloseCircle } from "@solar-icons/react";
import Input from "../input/Input";
import Button from "../button/Button";
import { emailSchema } from "../../schema/clientSchema";
import type { Email } from "../../contexts/ClientsContextValue";
import { useOutsideClick } from "../../customHooks/useOutsideClick";
import { ClientsContext } from "../../contexts/ClientsContextValue";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Email, 'id' | 'userId' | 'sentDate'>) => Promise<void>;
  preselectedClientId?: string;
  prefilledSubject?: string;
  prefilledBody?: string;
  emailType?: 'general' | 'invoice' | 'estimate' | 'follow-up' | 'milestone';
  relatedDocumentId?: string;
  title?: string;
}

export default function EmailModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  preselectedClientId,
  prefilledSubject,
  prefilledBody,
  emailType = 'general',
  relatedDocumentId,
  title 
}: EmailModalProps) {
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

  const initialValues: Omit<Email, 'id' | 'userId' | 'sentDate'> = {
    clientId: preselectedClientId || '',
    subject: prefilledSubject || '',
    body: prefilledBody || '',
    type: emailType,
    relatedId: relatedDocumentId || '',
  };

  const emailTemplates = {
    general: {
      subject: 'Following up on our conversation',
      body: 'Hi [Client Name],\n\nI wanted to follow up on our recent conversation.\n\nBest regards,\n[Your Name]'
    },
    invoice: {
      subject: 'Invoice [Invoice Number] from [Company Name]',
      body: 'Hi [Client Name],\n\nPlease find attached your invoice for the services provided.\n\nInvoice Number: [Invoice Number]\nAmount Due: $[Amount]\nDue Date: [Due Date]\n\nIf you have any questions, please don\'t hesitate to reach out.\n\nBest regards,\n[Your Name]'
    },
    estimate: {
      subject: 'Estimate [Estimate Number] for Your Project',
      body: 'Hi [Client Name],\n\nThank you for your interest in working with us. Please find attached the estimate for your project.\n\nEstimate Number: [Estimate Number]\nTotal: $[Amount]\nValid Until: [Expiry Date]\n\nPlease review and let me know if you have any questions.\n\nBest regards,\n[Your Name]'
    },
    'follow-up': {
      subject: 'Following up on [Topic]',
      body: 'Hi [Client Name],\n\nI hope this email finds you well. I wanted to follow up on [Topic].\n\n[Details]\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name]'
    },
    milestone: {
      subject: 'Project Milestone Update: [Milestone Name]',
      body: 'Hi [Client Name],\n\nI wanted to update you on a project milestone.\n\nMilestone: [Milestone Name]\nStatus: [Status]\nCompletion Date: [Date]\n\nPlease let me know if you have any questions.\n\nBest regards,\n[Your Name]'
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">{title || 'Send Email'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={emailSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await onSubmit(values);
                onClose();
              } catch (error) {
                console.error('Error sending email:', error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Recipient */}
                <div>
                  <label className="block text-sm font-medium mb-2">To *</label>
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
                        {client.name} ({client.email})
                      </option>
                    ))}
                  </select>
                  {touched.clientId && errors.clientId && (
                    <p className="text-red-500 text-sm mt-1">{errors.clientId}</p>
                  )}
                </div>

                {/* Email Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email Type</label>
                  <select
                    name="type"
                    value={values.type}
                    onChange={(e) => {
                      const newType = e.target.value as keyof typeof emailTemplates;
                      setFieldValue('type', newType);
                      // Optionally apply template if fields are empty
                      if (!values.subject && !values.body) {
                        setFieldValue('subject', emailTemplates[newType].subject);
                        setFieldValue('body', emailTemplates[newType].body);
                      }
                    }}
                    onBlur={handleBlur}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="general">General</option>
                    <option value="invoice">Invoice</option>
                    <option value="estimate">Estimate</option>
                    <option value="follow-up">Follow Up</option>
                    <option value="milestone">Milestone</option>
                  </select>
                </div>

                {/* Template Button */}
                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      const template = emailTemplates[values.type as keyof typeof emailTemplates];
                      setFieldValue('subject', template.subject);
                      setFieldValue('body', template.body);
                    }}
                    className="w-full"
                  >
                    Load Template
                  </Button>
                </div>

                {/* Subject */}
                <div>
                  <Input
                    name="subject"
                    type="text"
                    placeholder="Email Subject"
                    value={values.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.subject && errors.subject ? errors.subject : ''}
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium mb-2">Message *</label>
                  <textarea
                    name="body"
                    value={values.body}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary min-h-[300px] font-mono text-sm"
                  />
                  {touched.body && errors.body && (
                    <p className="text-red-500 text-sm mt-1">{errors.body}</p>
                  )}
                </div>

                {/* Related Document ID (hidden) */}
                <input type="hidden" name="relatedId" value={values.relatedId} />

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This email will be saved in the client's communication history. 
                    {values.type !== 'general' && values.relatedId && (
                      <span> It will be linked to the related {values.type} document.</span>
                    )}
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
                    {isSubmitting ? 'Sending...' : 'Send Email'}
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
