// Apollo.io API Integration (via Proxy Server)
// API Documentation: https://apolloio.github.io/apollo-api-docs/

const PROXY_API_URL = import.meta.env.VITE_PROXY_API_URL || 'http://localhost:3001/api/apollo';

export interface ApolloSearchParams {
  personTitles?: string[];
  personLocations?: string[];
  organizationLocations?: string[];
  organizationIndustryTagIds?: string[];
  organizationNumEmployeesRanges?: string[];
  personNotNullFields?: string[];
  page?: number;
  perPage?: number;
}

export interface ApolloContact {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  title: string;
  email: string | null;
  phone_numbers: Array<{ raw_number: string; sanitized_number: string }>;
  linkedin_url: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  organization: {
    id: string;
    name: string;
    website_url: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    facebook_url: string | null;
    primary_phone: { number: string } | null;
    industry: string | null;
    estimated_num_employees: number | null;
    city: string | null;
    state: string | null;
    country: string | null;
  };
}

export interface ApolloSearchResponse {
  contacts: ApolloContact[];
  breadcrumbs: Array<{
    label: string;
    signal_field_name: string;
    value: string;
    display_name: string;
  }>;
  pagination: {
    page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
  };
}

export interface ApolloEnrichResponse {
  person: ApolloContact;
}

/**
 * Search for contacts/leads using Apollo.io (via proxy)
 */
export async function searchLeads(params: Record<string, unknown>): Promise<ApolloSearchResponse> {
  const response = await fetch(`${PROXY_API_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to search leads');
  }

  return response.json();
}

/**
 * Enrich a contact by email to get complete information including socials (via proxy)
 */
export async function enrichContact(email: string): Promise<ApolloEnrichResponse> {
  const response = await fetch(`${PROXY_API_URL}/enrich`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to enrich contact');
  }

  return response.json();
}

/**
 * Get organization details by domain (via proxy)
 */
export async function getOrganization(domain: string) {
  const response = await fetch(`${PROXY_API_URL}/organization?domain=${encodeURIComponent(domain)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get organization');
  }

  return response.json();
}

/**
 * Convert Apollo contact to our Lead format
 */
export function apolloContactToLead(contact: ApolloContact) {
  const phone = contact.phone_numbers?.[0]?.sanitized_number || 
                contact.organization?.primary_phone?.number || 
                '';
  
  const location = [
    contact.organization?.city,
    contact.organization?.state,
    contact.organization?.country
  ].filter(Boolean).join(', ');

  return {
    name: contact.name || `${contact.first_name} ${contact.last_name}`,
    company: contact.organization?.name || 'Unknown Company',
    email: contact.email || '',
    phone: phone,
    location: location || 'Unknown',
    status: 'new' as const,
    value: 0, // User will set this
    industry: contact.organization?.industry || 'Other',
    score: 75, // Default score for Apollo leads
    // Additional fields for social profiles
    linkedinUrl: contact.linkedin_url || '',
    twitterUrl: contact.twitter_url || '',
    facebookUrl: contact.facebook_url || '',
    companyWebsite: contact.organization?.website_url || '',
    companyLinkedin: contact.organization?.linkedin_url || '',
    companyTwitter: contact.organization?.twitter_url || '',
    companyFacebook: contact.organization?.facebook_url || '',
  };
}
