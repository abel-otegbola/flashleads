import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { LeadsContext, type Lead } from '../../../contexts/LeadsContextValue';
import { ClientsContext } from '../../../contexts/ClientsContextValue';
import Button from '../../../components/button/Button';
import LoadingIcon from '../../../assets/icons/loadingIcon';
import { useModal } from '../../../contexts/useModal';
import { Case, Letter, Phone } from '@solar-icons/react';
import Conversation from '../../../components/conversation/Conversation';
import { findLeadEmail } from '../../../helpers/emailFinder';

export default function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSingleLead, deleteLead, updateLead, leads } = useContext(LeadsContext);
  const { addClient } = useContext(ClientsContext);
  const { showModal } = useModal();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [findingEmail, setFindingEmail] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getSingleLead(id);
        if (mounted) {setLead(data)};
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
      // Try to find email first
      if (!lead.companyWebsite) {
        await showModal({ 
          title: 'No Email or Website', 
          message: 'This lead has no email address and no website to search for contacts.' 
        });
        return;
      }

      const confirmed = await showModal({
        title: 'Find Email First?',
        message: `This lead has no email address.\n\nWould you like to search for their contact email using Hunter.io before sending?`,
        showCancel: true
      });

      if (!confirmed) return;

      setFindingEmail(true);
      try {
        const success = await findLeadEmail({
          leadId: lead.id,
          companyWebsite: lead.companyWebsite,
          companyName: lead.company,
          leads,
          updateLead,
          showModal
        });

        if (success && id) {
          // Refresh the lead data to get the updated email
          const updatedLead = await getSingleLead(id);
          if (updatedLead) {
            setLead(updatedLead);
            // Now open mail client with the found email
            window.location.href = `mailto:${updatedLead.email}?subject=${encodeURIComponent('Regarding your website')}&body=${encodeURIComponent('Hi ' + updatedLead.name + ',\n\nI noticed your website and...')}`;
          }
        }
      } catch (error) {
        console.error('Error finding email:', error);
      } finally {
        setFindingEmail(false);
      }
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

  const handleConvertToClient = async () => {
    if (!lead) return;
    
    const confirmed = await showModal({ 
      title: 'Convert Lead to Client', 
      message: `Convert ${lead.name} from ${lead.company} to a client?\n\nThis will:\n• Create a new client record\n• Move them to your Clients page\n• You can then create projects for them\n\nThe lead will be removed from your leads list.`,
      showCancel: true
    });
    
    if (!confirmed) return;
    
    setConverting(true);
    try {
      // Create client from lead data
      await addClient({
        name: lead.name,
        email: lead.email,
        phone: typeof lead.phone === 'string' ? lead.phone : '',
        company: lead.company,
        location: lead.location,
        industry: lead.industry,
        status: 'active',
        totalRevenue: 0,
        linkedinUrl: lead.linkedinUrl || '',
        website: lead.companyWebsite,
        notes: lead.notes || `Converted from lead. Original value: $${lead.value.toLocaleString()}`,
        tags: lead.serviceNeeds || []
      });
      
      // Delete the lead
      await deleteLead(lead.id);
      
      await showModal({ 
        title: 'Success!', 
        message: `${lead.name} has been converted to a client!\n\nYou can now find them in the Clients section.`,
        showCancel: false
      });
      
      // Navigate to clients page
      navigate('/account/clients');
      
    } catch (error) {
      console.error('Error converting lead to client:', error);
      await showModal({ 
        title: 'Conversion Failed', 
        message: 'Failed to convert lead to client. Please try again.',
        showCancel: false
      });
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="md:p-6 p-2 min-h-screen">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className='w-full pb-2'>
          <div className='flex gap-2 items-center p-1'>
            <div className="flex items-center gap-4">
              {lead?.logoUrl ? (
              <img 
                src={lead.logoUrl} 
                alt={`${lead.company} logo`}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray/[0.1]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              ) : null}
              <div 
                className={`w-12 h-12 bg-slate-100/[0.3] rounded-full flex items-center justify-center font-bold flex-shrink-0 border border-gray/[0.1] ${lead?.logoUrl ? 'hidden' : ''}`}
              >
                {lead?.company.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold">{lead.company}</h1>
              <p className="text-sm opacity-[0.6]">{lead.industry}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button variant="secondary" className='shadow-none' onClick={handleSendEmail} disabled={findingEmail}>
              {findingEmail ? <LoadingIcon /> : <Letter />} 
              {findingEmail ? 'Finding Email...' : 'Send Email'}
            </Button>
            <Button variant="secondary" className='shadow-none' onClick={handleCall}><Phone />Call Company</Button>
            <Button 
              variant="secondary"
              className='shadow-none'
              onClick={handleConvertToClient}
              disabled={converting}
            >
              {converting ? <LoadingIcon /> : <Case />} 
              {converting ? 'Converting...' : 'Convert Lead to Client'}
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="flex flex-col md:col-span-2 bg-background border border-gray/[0.1] rounded-lg p-4">
          <Conversation lead={lead} />
        </div>
        <div className='flex flex-col gap-4 text-[14px] w-full'>
          <div className="w-full bg-background rounded-lg border border-gray/[0.2] pb-4">
            <p className="bg-gray/[0.03] px-4 py-4 font-medium mb-2 border-b border-gray/[0.2] flex items-center gap-2">
              Contacts
            </p>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Email:</span> 
              { !lead.email ? <button className='underline text-primary' onClick={() => findLeadEmail({
                leadId: lead.id,
                companyWebsite: lead.companyWebsite,
                companyName: lead.company,
                leads,
                updateLead,
                showModal
              }) }>Search for email</button> : <span className=''>{lead.email || '—'}</span> }
            </p>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Phone:</span> 
              <span className=''>{typeof lead.phone === 'string' && lead.phone ? lead.phone : '—'}</span>
            </p>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Location:</span> 
              <span className=''>{lead.location || '—'}</span>
            </p>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Website:</span> 
              <Link to={lead.companyWebsite || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs break-all">
                {lead.companyWebsite || '—'}
              </Link>
            </p>
          </div>

          <div className="bg-background rounded-lg border border-gray/[0.2] bg-background pb-4">
            <p className="bg-gray/[0.03] px-4 py-4 font-medium mb-2 border-b border-gray/[0.2] flex items-center gap-2">
              Socials
            </p>
            {[
              { label: 'LinkedIn', url: lead.linkedinUrl },
              { label: 'Twitter', url: lead.twitterUrl },
              { label: 'Facebook', url: lead.facebookUrl },
            ].map((social) => (
              <p key={social.label} className="px-4 py-1 flex flex-col">
                <span className='font-medium text-[12px] opacity-50'>{social.label}:</span>
                {social.url ? (
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs break-all">
                    {social.url}
                  </a>
                ) : (
                  <span className=''>—</span>
                )}
              </p>
            ))}
          </div>

          <div className="bg-background rounded-lg border border-gray/[0.2] bg-background pb-2">
            
            <div className="bg-gray/[0.03] flex gap-4 justify-between mb-2 p-4 border-b border-gray/[0.2]">
              <p className=" text-sm font-medium flex items-center gap-2 font-semibold"> 
                Opportunity
              </p>
            </div>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Value</span> 
              <span className=''>${lead.value || '—'}</span>
            </p>
            <p className="px-4 py-1 flex flex-col">
              <span className='font-medium text-[12px] opacity-50'>Score</span> 
              <span className=''>{lead.score || '—'}</span>
            </p>
            
          </div>
        </div>

      </div>
    </div>
  );
}
