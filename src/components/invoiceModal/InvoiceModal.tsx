import { useEffect, useContext } from "react";
import { Formik, Form, FieldArray } from "formik";
import { CloseCircle, AddCircle, CloseSquare } from "@solar-icons/react";
import Input from "../input/Input";
import Button from "../button/Button";
import { invoiceSchema } from "../../schema/clientSchema";
import type { Invoice, InvoiceItem } from "../../contexts/ClientsContextValue";
import { useOutsideClick } from "../../customHooks/useOutsideClick";
import { ClientsContext } from "../../contexts/ClientsContextValue";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Invoice, 'id' | 'userId' | 'createdDate'>) => Promise<void>;
  invoice?: Invoice | null;
  preselectedClientId?: string;
  preselectedProjectId?: string;
  title?: string;
}

export default function InvoiceModal({ isOpen, onClose, onSubmit, invoice, preselectedClientId, preselectedProjectId, title }: InvoiceModalProps) {
  const modalRef = useOutsideClick(() => onClose(), false);
  const { clients, projects } = useContext(ClientsContext);

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

  const generateInvoiceNumber = () => {
    const date = new Date();
    return `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`;
  };

  const initialValues: Omit<Invoice, 'id' | 'userId' | 'createdDate'> = invoice ? {
    clientId: invoice.clientId,
    projectId: invoice.projectId,
    invoiceNumber: invoice.invoiceNumber,
    status: invoice.status,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    paidDate: invoice.paidDate || '',
    subtotal: invoice.subtotal,
    tax: invoice.tax,
    total: invoice.total,
    items: invoice.items,
    notes: invoice.notes || '',
  } : {
    clientId: preselectedClientId || '',
    projectId: preselectedProjectId || '',
    invoiceNumber: generateInvoiceNumber(),
    status: 'draft',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paidDate: '',
    subtotal: 0,
    tax: 0,
    total: 0,
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    notes: '',
  };

  const calculateItemAmount = (quantity: number, rate: number) => quantity * rate;
  const calculateSubtotal = (items: InvoiceItem[]) => items.reduce((sum, item) => sum + item.amount, 0);
  const calculateTotal = (subtotal: number, tax: number) => subtotal + tax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">{title || (invoice ? 'Edit Invoice' : 'Create Invoice')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={invoiceSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await onSubmit(values);
                onClose();
              } catch (error) {
                console.error('Error submitting invoice:', error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Invoice Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div>
                      <label className="block text-sm font-medium mb-2">Project (Optional)</label>
                      <select
                        name="projectId"
                        value={values.projectId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!!preselectedProjectId}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100"
                      >
                        <option value="">Select Project</option>
                        {projects.filter(p => !values.clientId || p.clientId === values.clientId).map(project => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input
                      name="invoiceNumber"
                      type="text"
                      placeholder="Invoice Number"
                      value={values.invoiceNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.invoiceNumber && errors.invoiceNumber ? errors.invoiceNumber : ''}
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      name="issueDate"
                      type="date"
                      placeholder="Issue Date"
                      value={values.issueDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.issueDate && errors.issueDate ? errors.issueDate : ''}
                    />
                    <Input
                      name="dueDate"
                      type="date"
                      placeholder="Due Date"
                      value={values.dueDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.dueDate && errors.dueDate ? errors.dueDate : ''}
                    />
                    {values.status === 'paid' && (
                      <Input
                        name="paidDate"
                        type="date"
                        placeholder="Paid Date"
                        value={values.paidDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.paidDate && errors.paidDate ? errors.paidDate : ''}
                      />
                    )}
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Line Items</h3>
                  </div>
                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <div className="space-y-3">
                        {values.items.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                              <div className="md:col-span-5">
                                <input
                                  name={`items.${index}.description`}
                                  type="text"
                                  placeholder="Description"
                                  value={item.description}
                                  onChange={(e) => {
                                    setFieldValue(`items.${index}.description`, e.target.value);
                                  }}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <input
                                  name={`items.${index}.quantity`}
                                  type="number"
                                  placeholder="Qty"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const quantity = parseFloat(e.target.value) || 0;
                                    setFieldValue(`items.${index}.quantity`, quantity);
                                    const amount = calculateItemAmount(quantity, item.rate);
                                    setFieldValue(`items.${index}.amount`, amount);
                                    const subtotal = calculateSubtotal([...values.items.slice(0, index), { ...item, amount }, ...values.items.slice(index + 1)]);
                                    setFieldValue('subtotal', subtotal);
                                    setFieldValue('total', calculateTotal(subtotal, values.tax));
                                  }}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <input
                                  name={`items.${index}.rate`}
                                  type="number"
                                  placeholder="Rate"
                                  value={item.rate}
                                  onChange={(e) => {
                                    const rate = parseFloat(e.target.value) || 0;
                                    setFieldValue(`items.${index}.rate`, rate);
                                    const amount = calculateItemAmount(item.quantity, rate);
                                    setFieldValue(`items.${index}.amount`, amount);
                                    const subtotal = calculateSubtotal([...values.items.slice(0, index), { ...item, amount }, ...values.items.slice(index + 1)]);
                                    setFieldValue('subtotal', subtotal);
                                    setFieldValue('total', calculateTotal(subtotal, values.tax));
                                  }}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <input
                                  type="text"
                                  value={`$${item.amount.toFixed(2)}`}
                                  disabled
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                                />
                              </div>
                              <div className="md:col-span-1 flex items-center">
                                {values.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      remove(index);
                                      setTimeout(() => {
                                        const newItems = values.items.filter((_, i) => i !== index);
                                        const subtotal = calculateSubtotal(newItems);
                                        setFieldValue('subtotal', subtotal);
                                        setFieldValue('total', calculateTotal(subtotal, values.tax));
                                      }, 0);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <CloseSquare size={20} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => push({ description: '', quantity: 1, rate: 0, amount: 0 })}
                          className="w-full"
                        >
                          <AddCircle size={20} className="mr-2" />
                          Add Line Item
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3 max-w-sm ml-auto">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Subtotal:</span>
                      <span className="text-lg">${values.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="font-medium">Tax:</span>
                      <input
                        name="tax"
                        type="number"
                        value={values.tax}
                        onChange={(e) => {
                          const tax = parseFloat(e.target.value) || 0;
                          setFieldValue('tax', tax);
                          setFieldValue('total', calculateTotal(values.subtotal, tax));
                        }}
                        className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-right"
                      />
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-2xl text-primary">${values.total.toFixed(2)}</span>
                    </div>
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
                    placeholder="Add any notes for this invoice..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary min-h-[80px]"
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
                    {isSubmitting ? 'Saving...' : (invoice ? 'Update Invoice' : 'Create Invoice')}
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
