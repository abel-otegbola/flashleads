import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LeadsContext, type Lead } from '../../../contexts/LeadsContextValue';
import Button from '../../../components/button/Button';
import LoadingIcon from '../../../assets/icons/loadingIcon';
import { useModal } from '../../../contexts/useModal';

export default function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSingleLead, auditWebsite } = useContext(LeadsContext);
  const { showModal } = useModal();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getSingleLead(id);
        if (mounted) setLead(data);
      } catch (err) {
        console.error('Error fetching lead details', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, getSingleLead]);

  if (loading) return (
    <div className="p-6">
      <LoadingIcon />
    </div>
  );

  if (!lead) return (
    <div className="p-6">
      <p>Lead not found.</p>
      <Button onClick={() => navigate('/account/leads')}>Back to Leads</Button>
    </div>
  );

  const handleSendEmail = async () => {
    if (!lead.email) {
      await showModal({ title: 'No Email', message: 'This lead has no email address.' });
      return;
    }
    // Open mail client
    window.location.href = `mailto:${lead.email}?subject=${encodeURIComponent('Regarding your website')}&body=${encodeURIComponent('Hi ' + lead.name + ',\n\nI noticed your website and...')}`;
  };

  const handleCall = async () => {
    if (!lead.phone) {
      await showModal({ title: 'No Phone', message: 'This lead has no phone number.' });
      return;
    }
    window.location.href = `tel:${lead.phone}`;
  };

  const handleCreateProject = async () => {
    await showModal({ title: 'Create Project', message: 'Create project flow not yet implemented.' });
  };

  const handleCreateOffer = async () => {
    await showModal({ title: 'Create Offer', message: 'Create offer flow not yet implemented.' });
  };

  const handleCreateContract = async () => {
    await showModal({ title: 'Create Contract', message: 'Create contract flow not yet implemented.' });
  };

  const handleAuditWebsite = async () => {
    if (!lead.companyWebsite) {
      await showModal({ title: 'No Website', message: 'This lead has no website set.' });
      return;
    }
    try {
      await auditWebsite(lead.id, lead.companyWebsite);
      await showModal({ title: 'Audit Started', message: 'Website audit started. Check lead details after a moment.' });
    } catch (err) {
      console.error(err);
      await showModal({ title: 'Audit Failed', message: 'Failed to start audit.' });
    }
  };

  return (
    <div className="p-6 bg-gray-100/[0.05] min-h-screen">
      <div className="flex flex-wrap gap-6 items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">{lead.name}</h1>
          <p className="text-sm text-gray-600">{lead.company} — {lead.industry}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/account/leads')}>Back</Button>
          <Button onClick={handleSendEmail}>Send Email</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-500/[0.2] bg-white">
          <p className="text-sm text-gray-500 mb-2">Contact</p>
          <p className="font-medium">{lead.email || '—'}</p>
          <p className="font-medium">{lead.phone || '—'}</p>
          <p className="text-sm text-gray-500 mt-2">Location</p>
          <p>{lead.location}</p>
          <p className="text-sm text-gray-500 mt-2">Website</p>
          <p>{lead.companyWebsite || '—'}</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-500/[0.2] bg-white">
          <p className="text-sm text-gray-500 mb-2">Opportunity</p>
          <p className="font-medium">Status: {lead.status}</p>
          <p className="font-medium">Value: ${lead.value?.toLocaleString() || 0}</p>
          <p className="font-medium">Score: {lead.score}</p>
          <div className="mt-4 flex gap-2">
            <Button size='small' onClick={handleCall} variant="secondary">Call</Button>
            <Button size='small' onClick={handleCreateProject}>Create Project</Button>
            <Button size='small' onClick={handleCreateOffer}>Create Offer</Button>
            <Button size='small' onClick={handleCreateContract}>Contract</Button>
          </div>
          <div className="mt-4">
            <Button size='small' variant="secondary" onClick={handleAuditWebsite}>Audit Website</Button>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg border border-gray-500/[0.2] bg-white">
        <h3 className="font-semibold mb-2">Notes</h3>
        <p className="text-sm text-gray-700">{lead.notes || 'No notes yet.'}</p>
      </div>
    </div>
  );
}
