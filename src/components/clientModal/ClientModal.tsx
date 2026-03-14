import { useEffect } from "react";
import { Formik, Form } from "formik";
import { CloseCircle } from "@solar-icons/react";
import Input from "../input/Input";
import Button from "../button/Button";
import { clientSchema } from "../../schema/clientSchema";
import type { Client } from "../../contexts/ClientsContextValue";
import { useOutsideClick } from "../../customHooks/useOutsideClick";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Client, 'id' | 'userId' | 'addedDate'>) => Promise<void>;
  client?: Client | null;
  title?: string;
}

export default function ClientModal({ isOpen, onClose, onSubmit, client, title }: ClientModalProps) {
  const modalRef = useOutsideClick(() => onClose(), false);

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

  const initialValues: Omit<Client, 'id' | 'userId' | 'addedDate'> = client ? {
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    location: client.location,
    industry: client.industry,
    status: client.status,
    totalRevenue: client.totalRevenue,
    lastContact: client.lastContact,
    linkedinUrl: client.linkedinUrl || '',
    website: client.website || '',
    notes: client.notes || '',
    tags: client.tags || [],
  } : {
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    industry: '',
    status: 'prospect',
    totalRevenue: 0,
    lastContact: '',
    linkedinUrl: '',
    website: '',
    notes: '',
    tags: [],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-background rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">{title || (client ? 'Edit Client' : 'Add New Client')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:opacity-[0.6]">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={clientSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await onSubmit(values);
                onClose();
              } catch (error) {
                console.error('Error submitting client:', error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name && errors.name ? errors.name : ''}
                      />
                    </div>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && errors.email ? errors.email : ''}
                    />
                    <Input
                      name="phone"
                      type="text"
                      placeholder="Phone Number"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && errors.phone ? errors.phone : ''}
                    />
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="company"
                      type="text"
                      placeholder="Company Name"
                      value={values.company}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.company && errors.company ? errors.company : ''}
                    />
                    <Input
                      name="location"
                      type="text"
                      placeholder="Location (City, State)"
                      value={values.location}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.location && errors.location ? errors.location : ''}
                    />
                    <div>
                      <select
                        name="industry"
                        value={values.industry}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                      >
                        <option value="">Select Industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Software">Software</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Marketing">Marketing</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Education">Education</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Design">Design</option>
                        <option value="Other">Other</option>
                      </select>
                      {touched.industry && errors.industry && (
                        <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
                      )}
                    </div>
                    <div>
                      <select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                      >
                        <option value="prospect">Prospect</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="past">Past Client</option>
                      </select>
                      {touched.status && errors.status && (
                        <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Financial & Contact */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="totalRevenue"
                      type="number"
                      placeholder="Total Revenue ($)"
                      value={values.totalRevenue}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.totalRevenue && errors.totalRevenue ? errors.totalRevenue : ''}
                    />
                    <Input
                      name="lastContact"
                      type="date"
                      placeholder="Last Contact Date"
                      value={values.lastContact}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastContact && errors.lastContact ? errors.lastContact : ''}
                    />
                    <Input
                      name="linkedinUrl"
                      type="url"
                      placeholder="LinkedIn URL"
                      value={values.linkedinUrl}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.linkedinUrl && errors.linkedinUrl ? errors.linkedinUrl : ''}
                    />
                    <Input
                      name="website"
                      type="url"
                      placeholder="Website URL"
                      value={values.website}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.website && errors.website ? errors.website : ''}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notes</h3>
                  <textarea
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Add any notes about this client..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary min-h-[100px]"
                  />
                  {touched.notes && errors.notes && (
                    <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tags</h3>
                  <Input
                    name="tags"
                    type="text"
                    placeholder="Enter tags separated by commas (e.g., VIP, tech, startup)"
                    value={values.tags?.join(', ')}
                    onChange={(e) => {
                      const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                      setFieldValue('tags', tagsArray);
                    }}
                    onBlur={handleBlur}
                  />
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
                    {isSubmitting ? 'Saving...' : (client ? 'Update Client' : 'Add Client')}
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
