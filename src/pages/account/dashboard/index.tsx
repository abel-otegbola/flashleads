import { useContext, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LeadsContext } from "../../../contexts/LeadsContextValue";
import { ClientsContext } from "../../../contexts/ClientsContextValue";

// Types
interface StatCardProps {
  title: string;
  value: string | number;
  label: string;
  colorScheme: 'blue' | 'green' | 'purple' | 'orange';
  icon: React.ReactNode;
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

interface QuickStatProps {
  label: string;
  value: string | number;
  color: string;
}

// Constants
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const COLOR_SCHEMES = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
  },
};

// Icons
const ICONS = {
  user: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  ),
  dollar: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  trend: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  ),
};

// Components
function StatCard({ title, value, label, colorScheme, icon }: StatCardProps) {
  const colors = COLOR_SCHEMES[colorScheme];
  
  return (
    <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colors.bg} rounded-lg ${colors.text}`}>
          {icon}
        </div>
        <span className={`text-xs ${colors.bg} ${colors.text} px-2 py-1 rounded-full`}>
          {label}
        </span>
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
    </div>
  );
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="bg-white dark:bg-dark-bg rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function QuickStat({ label, value, color }: QuickStatProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className={`font-semibold text-${color}-600`}>{value}</span>
    </div>
  );
}

interface TableColumn<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage: string;
}

function DataTable<T>({ title, columns, data, emptyMessage }: DataTableProps<T>) {
  return (
    <div className="bg-white dark:bg-dark-bg rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      {column.accessor(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { leads } = useContext(LeadsContext);
  const { clients } = useContext(ClientsContext);

  // Helper to filter by current month
  const isCurrentMonth = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const totalClients = clients.length;
    
    const leadsValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const clientsValue = clients.reduce((sum, client) => sum + (client.totalRevenue || 0), 0);
    const totalRevenue = leadsValue + clientsValue;

    const wonLeads = leads.filter(l => l.status === 'won').length;
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;

    const newLeadsThisMonth = leads.filter(l => isCurrentMonth(l.addedDate)).length;
    const newClientsThisMonth = clients.filter(c => isCurrentMonth(c.addedDate)).length;
    const hotLeads = leads.filter(l => l.score >= 85).length;
    const avgLeadScore = leads.length > 0 ? (leads.reduce((sum, l) => sum + l.score, 0) / leads.length).toFixed(1) : 0;

    return { 
      totalLeads, 
      totalClients, 
      totalRevenue, 
      conversionRate,
      newLeadsThisMonth,
      newClientsThisMonth,
      hotLeads,
      avgLeadScore
    };
  }, [leads, clients]);

  // Lead status distribution
  const leadStatusData = useMemo(() => {
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));
  }, [leads]);

  // Monthly trends (last 6 months)
  const monthlyTrends = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const now = new Date();
    
    return months.map((month, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      
      const monthLeads = leads.filter(lead => {
        const leadDate = new Date(lead.addedDate);
        return leadDate.getMonth() === monthDate.getMonth() && 
               leadDate.getFullYear() === monthDate.getFullYear();
      }).length;

      const monthClients = clients.filter(client => {
        const clientDate = new Date(client.addedDate);
        return clientDate.getMonth() === monthDate.getMonth() && 
               clientDate.getFullYear() === monthDate.getFullYear();
      }).length;

      return {
        month,
        leads: monthLeads,
        clients: monthClients
      };
    });
  }, [leads, clients]);

  // Lead score distribution
  const scoreDistribution = useMemo(() => {
    const ranges = [
      { name: '0-25', min: 0, max: 25 },
      { name: '26-50', min: 26, max: 50 },
      { name: '51-75', min: 51, max: 75 },
      { name: '76-100', min: 76, max: 100 }
    ];

    return ranges.map(range => ({
      name: range.name,
      count: leads.filter(l => l.score >= range.min && l.score <= range.max).length
    }));
  }, [leads]);

  // Recent clients for table
  const recentClients = useMemo(() => {
    return [...clients]
      .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
      .slice(0, 5);
  }, [clients]);

  // Stat cards configuration
  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      label: 'Leads',
      colorScheme: 'blue' as const,
      icon: ICONS.user,
    },
    {
      title: 'Active Clients',
      value: stats.totalClients,
      label: 'Clients',
      colorScheme: 'green' as const,
      icon: ICONS.users,
    },
    {
      title: 'Total Value',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      label: 'Revenue',
      colorScheme: 'purple' as const,
      icon: ICONS.dollar,
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      label: 'Rate',
      colorScheme: 'orange' as const,
      icon: ICONS.trend,
    },
  ];

  // Quick stats configuration
  const quickStats = [
    { label: 'New Leads (This Month)', value: stats.newLeadsThisMonth, color: 'blue' },
    { label: 'New Clients (This Month)', value: stats.newClientsThisMonth, color: 'green' },
    { label: 'Hot Leads (Score > 85)', value: stats.hotLeads, color: 'orange' },
    { label: 'Avg Lead Score', value: stats.avgLeadScore, color: 'purple' },
  ];

  // Table columns configuration
  const clientColumns: TableColumn<typeof recentClients[0]>[] = [
    {
      header: 'Name',
      accessor: (client) => <div className="text-sm font-medium">{client.name}</div>
    },
    {
      header: 'Company',
      accessor: (client) => <div className="text-sm text-gray-600 dark:text-gray-400">{client.company}</div>
    },
    {
      header: 'Email',
      accessor: (client) => <div className="text-sm text-gray-600 dark:text-gray-400">{client.email}</div>
    },
    {
      header: 'Status',
      accessor: (client) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          client.status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
        }`}>
          {client.status}
        </span>
      )
    },
    {
      header: 'Revenue',
      accessor: (client) => (
        <div className="text-sm font-medium">${client.totalRevenue?.toLocaleString() || 0}</div>
      )
    },
    {
      header: 'Added Date',
      accessor: (client) => (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(client.addedDate).toLocaleDateString()}
        </div>
      )
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of your leads and clients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <ChartCard title="Monthly Trends">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="leads" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Leads"
              />
              <Line 
                type="monotone" 
                dataKey="clients" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Clients"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Lead Status Distribution */}
        <ChartCard title="Lead Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leadStatusData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Score Distribution */}
        <ChartCard title="Lead Score Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Quick Stats */}
        <ChartCard title="Quick Stats">
          <div className="space-y-4">
            {quickStats.map((stat, index) => (
              <QuickStat key={index} {...stat} />
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent Clients Table */}
      <DataTable
        title="Recent Clients"
        columns={clientColumns}
        data={recentClients}
        emptyMessage="No clients yet. Start adding clients to see them here!"
      />
    </div>
  );
}
