import { useState } from 'react';
import Button from '../button/Button';
import type { Lead } from '../../contexts/LeadsContextValue';

interface Props {
  lead: Lead;
}

export default function Conversation({ lead }: Props) {
  const [message, setMessage] = useState('');
  const [generated, setGenerated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    try {
      const resp = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead })
      });
      if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
      const data = await resp.json();
      setGenerated(data.text || data.output || '');
      setMessage(data.text || data.output || '');
    } catch {
        // Generic error message
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    // open mail client with generated text
    const to = lead.email || '';
    const subject = encodeURIComponent(`Grow ${lead.company || lead.name}'s website and revenue`);
    const body = encodeURIComponent(message || generated || 'Hi,\n\n');
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="conversation-component">
      <div className="mb-2">
        <label className="block text-sm text-gray-600 mb-1">Generated Outreach (STAR)</label>
        <textarea
          className="w-full min-h-[120px] border rounded p-2"
          value={message || generated || ''}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Generate a personalized outreach message"
        />
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="flex gap-2">
        <Button onClick={handleGenerate} disabled={loading || !lead}>
          {loading ? 'Generating...' : 'Generate Outreach'}
        </Button>
        <Button onClick={handleSend} disabled={!message && !generated}>Send Email</Button>
      </div>

      <details className="mt-3 text-xs text-gray-500">
        <summary>Prompt used (click to expand)</summary>
        <pre className="whitespace-pre-wrap mt-2 bg-gray-50 p-2 rounded text-xs">
{`Use STAR format (Situation, Task, Action, Result) to write a short email (3-6 paragraphs) describing what a freelancer can do to help the company scale and build their business based on the website audit. Include suggested next steps and a short result/benefit paragraph. Lead data:\nName: ${lead.name}\nCompany: ${lead.company}\nWebsite: ${lead.companyWebsite || 'N/A'}\nNotes: ${lead.notes || 'N/A'}\nWebsite audit: ${lead.websiteAudit || 'N/A'}`}
        </pre>
      </details>
    </div>
  );
}
