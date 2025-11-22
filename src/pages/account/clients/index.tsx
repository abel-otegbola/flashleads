import { useState, useContext } from "react";
import { 
  UserCircle, 
  Buildings, 
  MapPoint, 
  AddCircle, 
  Pen, 
  TrashBin2,
  Letter,
  DollarMinimalistic,
  Folder,
  Widget,
  ServerMinimalistic
} from "@solar-icons/react";
import { ClientsContext } from "../../../contexts/ClientsContextValue";
import type { Client } from "../../../contexts/ClientsContextValue";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import ClientModal from "../../../components/clientModal/ClientModal";
import EmailModal from "../../../components/emailModal/EmailModal";
import SearchBar from "../../../components/search/searchBar";

const statusColors = {
  active: "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-700 border-gray-200",
  prospect: "bg-blue-100 text-blue-700 border-blue-200",
  past: "bg-orange-100 text-orange-700 border-orange-200"
};

export default function Clients() {
  const { 
    clients, 
    clientsLoading, 
    addClient, 
    updateClient, 
    deleteClient,
    getClientProjects,
    getClientInvoices,
    getClientEstimates,
    sendEmail
  } = useContext(ClientsContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  
  // Modal states
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClient = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client? This will also delete all related projects, invoices, and estimates.')) {
      await deleteClient(id);
    }
  };

  const getClientStats = (client: Client) => {
    const projects = getClientProjects(client.id);
    const invoices = getClientInvoices(client.id);
    const estimates = getClientEstimates(client.id);
    
    const totalInvoiced = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
    
    const pendingInvoices = invoices.filter(inv => ['sent', 'overdue'].includes(inv.status)).length;
    
    return {
      projectsCount: projects.length,
      activeProjects: projects.filter(p => p.status === 'in-progress').length,
      totalInvoiced,
      pendingInvoices,
      estimatesCount: estimates.length,
    };
  };

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const prospects = clients.filter(c => c.status === 'prospect').length;
  const totalRevenue = clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);

  return (
    <div className="p-4 md:p-6 bg-gray-100/[0.05]">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-12 justify-between">
        <div>
          <h1 className="text-2xl font-medium mb-2">Clients</h1>
          <p className="text-gray-600">Manage your client relationships and track projects</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => {
              setEditingClient(null);
              setIsClientModalOpen(true);
            }} 
            className="flex items-center gap-2"
          >
            <AddCircle size={20} />
            Add Client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <div className="flex flex-col gap-3 mb-2">
              <p className="text-sm opacity-[0.5]">Total Clients</p>
              <p className="text-2xl font-medium">{totalClients}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <div className="flex flex-col gap-3 mb-2">
              <p className="text-sm opacity-[0.5]">Active Clients</p>
              <p className="text-2xl font-medium">{activeClients}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <div className="flex flex-col gap-3 mb-2">
              <p className="text-sm opacity-[0.5]">Prospects</p>
              <p className="text-2xl font-medium">{prospects}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <div className="flex flex-col gap-3 mb-2">
              <p className="text-sm opacity-[0.5]">Total Revenue</p>
              <p className="text-2xl font-medium">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200/[0.2] border-b-transparent rounded-t-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200/[0.2] rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactive</option>
              <option value="past">Past Client</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-lg border ${view === 'grid' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200'}`}
            >
              <Widget size={20} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg border ${view === 'list' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200'}`}
            >
              <ServerMinimalistic size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => {
            const stats = getClientStats(client);
            return (
              <div key={client.id} className="bg-white border border-gray-200/[0.2] rounded-b-lg p-6 hover:shadow-lg transition-shadow">
                {/* Client Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <p className="text-sm opacity-[0.5] flex items-center gap-1">
                        <Buildings size={14} />
                        {client.company}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${statusColors[client.status]}`}>
                    {client.status}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                  <p className="text-sm opacity-[0.5] flex items-center gap-2">
                    <Letter size={14} />
                    {client.email}
                  </p>
                  {client.phone && (
                    <p className="text-sm opacity-[0.5] flex items-center gap-2">
                      <span>📞</span>
                      {client.phone}
                    </p>
                  )}
                  {client.location && (
                    <p className="text-sm opacity-[0.5] flex items-center gap-2">
                      <MapPoint size={14} />
                      {client.location}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">Projects</p>
                    <p className="text-lg font-semibold">{stats.projectsCount}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">Revenue</p>
                    <p className="text-lg font-semibold">${client.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedClient(client)}
                    className="flex-1 px-3 py-2 border border-gray-200/[0.2] rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-1"
                  >
                    <Folder size={16} />
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setIsEmailModalOpen(true);
                    }}
                    className="px-3 py-2 border border-primary text-primary rounded-lg hover:bg-blue-50 text-sm"
                  >
                    <Letter size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingClient(client);
                      setIsClientModalOpen(true);
                    }}
                    className="px-3 py-2 border border-gray-200/[0.2] rounded-lg hover:bg-gray-50 text-sm"
                  >
                    <Pen size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm"
                  >
                    <TrashBin2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clients List View */}
      {view === 'list' && (
        <div className="bg-white border border-gray-200/[0.2] rounded-b-lg overflow-hidden md:w-full w-[90vw]">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Projects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map(client => {
                const stats = getClientStats(client);
                return (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{client.name}</p>
                          <p className="text-sm opacity-[0.5]">{client.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{client.email}</p>
                      {client.phone && <p className="text-sm opacity-[0.5]">{client.phone}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full border ${statusColors[client.status]}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">{stats.projectsCount}</p>
                      <p className="text-xs text-gray-600">{stats.activeProjects} active</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">${client.totalRevenue.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="View details"
                        >
                          <Folder size={18} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingClient(client);
                            setIsClientModalOpen(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Edit client"
                        >
                          <Pen size={18} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="p-1 hover:bg-red-50 rounded"
                          title="Delete client"
                        >
                          <TrashBin2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <UserCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                {clientsLoading ? 'Loading clients...' : 'No clients found matching your criteria'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State for Grid View */}
      {view === 'grid' && filteredClients.length === 0 && (
        <div className="flex flex-col items-center text-center py-12 bg-white border border-gray-200/[0.2] rounded-b-lg">
          <UserCircle size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">
            {clientsLoading ? 'Loading clients...' : 'No clients found'}
          </p>
          {!clientsLoading && searchQuery === '' && statusFilter === 'all' && (
            <Button onClick={() => {
              setEditingClient(null);
              setIsClientModalOpen(true);
            }}>
              <AddCircle size={18} />
              Add Your First Client
            </Button>
          )}
        </div>
      )}

      {/* Modals */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setEditingClient(null);
        }}
        onSubmit={async (values) => {
          if (editingClient) {
            await updateClient(editingClient.id, values);
          } else {
            await addClient(values);
          }
        }}
        client={editingClient}
      />

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setSelectedClient(null);
        }}
        onSubmit={async (values) => {
          await sendEmail(values);
        }}
        preselectedClientId={selectedClient?.id}
      />
    </div>
  );
}
