import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LeadsContext, type Lead } from '../../../contexts/LeadsContextValue';
import Button from '../../../components/button/Button';
import LoadingIcon from '../../../assets/icons/loadingIcon';
import { useModal } from '../../../contexts/useModal';
import { AltArrowLeft, Book, Case, HandMoney, Letter, MoneyBag, Phone, User } from '@solar-icons/react';
import Input from '../../../components/input/Input';
import { ChatDots } from '@solar-icons/react/ssr';

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
        if (mounted) {setLead(data); console.log(data)};
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
    <div className="md:p-6 p-2 bg-gray-100/[0.05] min-h-screen">
      <button onClick={() => navigate('/account/leads')}><AltArrowLeft size={20} /></button>
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className='w-full py-2'>
          <div className='flex gap-2 items-center p-1'>
            <p className='w-[60px] h-[60px] bg-gradient-to-tr from-blue-500 to-purple-600 text-white rounded-[10px] outline outline-offset-2 outline-primary/[0.3] flex items-center justify-center'>{lead.name.charAt(0) + lead.name.charAt(1)}</p>
            <div>
              <h1 className="text-xl font-semibold">{lead.name}</h1>
              <p className="text-sm text-gray-600">{lead.company} — {lead.industry}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2 flex-wrap text-[12px]">
            <button className='bg-white flex items-center gap-1 cursor-pointer hover:text-primary p-[2px] px-2 border border-gray-500/[0.1] hover:border-primary rounded' onClick={handleSendEmail}><Letter /> Send Email</button>
            <button className='bg-white flex items-center gap-1 cursor-pointer hover:text-primary p-[2px] px-2 border border-gray-500/[0.1] hover:border-primary rounded' onClick={handleCall}><Phone />Call Company</button>
            <button className='bg-white flex items-center gap-1 cursor-pointer hover:text-primary p-[2px] px-2 border border-gray-500/[0.1] hover:border-primary rounded' onClick={handleCreateProject}><Case /> Create Project</button>
            <button className='bg-white flex items-center gap-1 cursor-pointer hover:text-primary p-[2px] px-2 border border-gray-500/[0.1] hover:border-primary rounded' onClick={handleCreateContract}><MoneyBag />Create Contract</button>
          </div>
        </div>
        <div className="flex gap-2">
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className='flex flex-col gap-4'>
          <div className="bg-white rounded-lg border border-gray-500/[0.2] bg-white">
            <p className="text-sm px-4 py-4 text-gray-500 mb-2 border-b border-gray-500/[0.2] flex items-center gap-2">
              <span className='p-2 border border-gray-500/[0.1] rounded bg-gray-200/[0.05] font-semibold'><User /> </span> 
              Contacts
            </p>
            <p className="px-4 py-2 font-medium flex items-center justify-between text-[12px]">
              <span className='text-gray-500 w-[40%]'>Email:</span> 
              <span className='text-right'>{lead.email || '—'}</span>
            </p>
            <p className="px-4 py-2 font-medium flex items-center justify-between text-[12px]">
              <span className='text-gray-500 w-[40%]'>Phone:</span> <span className='text-right'>{lead.phone || '—'}</span>
            </p>
            <p className="px-4 py-2 font-medium flex items-center justify-between text-[12px]">
              <span className='text-gray-500 w-[40%]'>Location:</span> 
              <span className='text-right'>{lead.location || '—'}</span>
            </p>
            <p className="px-4 py-2 font-medium flex items-center justify-between text-[12px]">
              <span className='text-gray-500 w-[40%]'>Website:</span> 
              <span className='text-right'>{lead.companyWebsite || '—'}</span>
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-500/[0.2] bg-white pb-2">
            
            <div className="flex gap-4 justify-between mb-2 p-4 border-b border-gray-500/[0.2]">
              
              <p className="text-sm text-gray-500 flex items-center gap-2 font-semibold"> 
                <span className='p-2 border border-gray-500/[0.1] rounded bg-gray-200/[0.05] font-semibold'><HandMoney /> </span> 
                Opportunity
              </p>
              <button className="text-[10px] text-primary font-semibold hover:border border-transparent rounded hover:border-primary p-2 leading-0 py-1" onClick={handleAuditWebsite}>Audit Website</button>
            </div>
            <p className="px-4 py-2 font-medium flex items-center justify-between text-[12px]">
              <span className='text-gray-500 w-[40%]'>Status</span> 
              <span className='text-right'>{lead.status || '—'}</span>
            </p>
            <p className="px-4 py-2 font-medium flex items-center justify-between text-[12px]">
              <span className='text-gray-500 w-[40%]'>Value</span> 
              <span className='text-right'>${lead.value || '—'}</span>
            </p>
            <p className="px-4 py-2 font-medium flex items-center justify-between text-[12px]">
              <span className='text-gray-500 w-[40%]'>Score</span> 
              <span className='text-right'>{lead.score || '—'}</span>
            </p>
            
            <div className="mx-4 my-2 p-2 px-4 rounded font-medium border border-gray-500/[0.2] bg-[url('/bg-cover.svg')] flex flex-col text-[12px]">
              <span className='text-gray-500 w-[40%]'>Website Audit Result</span> 
              <div className='grid grid-cols-4 gap-8 text-[10px] my-2'>
                <div>
                  <p>performance:</p>
                  <div className='flex h-[8px] bg-white rounded-full border border-gray-500/[0.09]'>
                    <span 
                      className={`h-[6px] rounded-full`}
                      style={{ width: `${lead.websiteAudit?.performanceScore}%`, backgroundColor: +(lead.websiteAudit?.performanceScore || 0) > 70 ? "green" : +(lead.websiteAudit?.performanceScore || 0) > 49 ? "orange" : "red" }}
                      ></span>
                  </div>
                  <p className="font-semibold">{lead.websiteAudit?.performanceScore}%</p>
                </div>
                <div>
                  <p>SEO:</p>
                  <div className='flex h-[8px] bg-white rounded-full border border-gray-500/[0.09]'>
                    <span 
                      className={`h-[6px] rounded-full`}
                      style={{ width: `${lead.websiteAudit?.seoScore}%`, backgroundColor: +(lead.websiteAudit?.seoScore || 0) > 70 ? "green" : +(lead.websiteAudit?.seoScore || 0) > 49 ? "orange" : "red" }}
                      ></span>
                  </div>
                  <p className="font-semibold">{lead.websiteAudit?.seoScore}%</p>
                </div>
                <div>
                  <p>Design:</p>
                  <div className='flex h-[8px] bg-white rounded-full border border-gray-500/[0.09]'>
                    <span 
                      className={`h-[6px] rounded-full`}
                      style={{ width: `${lead.websiteAudit?.designScore}%`, backgroundColor: +(lead.websiteAudit?.designScore || 0) > 70 ? "green" : +(lead.websiteAudit?.designScore || 0) > 49 ? "orange" : "red" }}
                      ></span>
                  </div>
                  <p className="font-semibold">{lead.websiteAudit?.designScore}%</p>
                </div>
                <div>
                  <p>Mobile:</p>
                  <div className='flex h-[8px] bg-white rounded-full border border-gray-500/[0.09]'>
                    <span 
                      className={`h-[6px] rounded-full`}
                      style={{ width: `${lead.websiteAudit?.mobileScore}%`, backgroundColor: +(lead.websiteAudit?.mobileScore || 0) > 70 ? "green" : +(lead.websiteAudit?.mobileScore || 0) > 49 ? "orange" : "red" }}
                      ></span>
                  </div>
                  <p className="font-semibold">{lead.websiteAudit?.mobileScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col bg-white rounded-lg border border-gray-500/[0.2] bg-white">
          <p className="text-sm px-4 py-4 text-gray-500 mb-2 border-b border-gray-500/[0.2] flex items-center gap-2 font-semibold"> 
            <span className='p-2 border border-gray-500/[0.1] rounded bg-gray-200/[0.05] font-semibold'><ChatDots /> </span> 
            Conversations
          </p>

          <div className='p-4 flex flex-col gap-4 justify-between flex-1'>
            <div className='flex-1 min-h-[240px] overflow-y-auto'>

            </div>
            <div className="p-[8px] py-1 flex items-center bg-white rounded-lg border border-gray-500/[0.1]">
              <Input className='flex-1 py-0 leading-0 border-none' placeholder='Write a message' />
              <Button className='border-[2px]'>Send</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-gray-500/[0.2] bg-white">
        <h3 className="text-sm px-4 py-4 text-gray-500 mb-2 border-b border-gray-500/[0.2] flex items-center gap-2 font-semibold">
          <span className='p-2 border border-gray-500/[0.1] rounded bg-gray-200/[0.05] font-semibold'><Book /> </span>
          Notes
        </h3>
        <p className="text-sm text-gray-700 p-4">{lead.notes || 'No notes yet.'}</p>
      </div>
    </div>
  );
}
