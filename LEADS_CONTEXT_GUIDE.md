# LeadsContext Usage Guide

## Overview
The LeadsContext provides CRUD operations for managing leads with Firebase Firestore. It follows the same pattern as AuthContext.

## Setup
The LeadsProvider is already wrapped around your app in `App.tsx`:

```tsx
<AuthProvider>
  <LeadsProvider>
    <Routes>...</Routes>
  </LeadsProvider>
</AuthProvider>
```

## Using LeadsContext

### Import and Use
```tsx
import { useContext } from "react";
import { LeadsContext } from "../../../contexts/LeadsContextValue";

function MyComponent() {
  const { leads, loading, error, addLead, updateLead, deleteLead, refreshLeads } = useContext(LeadsContext);
  
  // Your component logic
}
```

### Available Properties and Methods

#### `leads: Lead[]`
Array of all leads for the current user. Automatically fetched when user logs in.

#### `loading: boolean`
True when any Firebase operation is in progress.

#### `error: string | null`
Error message if any operation fails.

#### `addLead(leadData)`
Add a new lead to Firestore.

```tsx
const handleAddLead = async () => {
  try {
    await addLead({
      name: "John Doe",
      company: "Acme Corp",
      email: "john@acme.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      status: "new",
      value: 5000,
      industry: "Technology",
      score: 85
    });
    // Lead added successfully
  } catch (error) {
    // Handle error
  }
};
```

#### `updateLead(id, updates)`
Update an existing lead.

```tsx
const handleUpdateStatus = async (leadId: string) => {
  try {
    await updateLead(leadId, { 
      status: "contacted",
      score: 90
    });
    // Lead updated successfully
  } catch (error) {
    // Handle error
  }
};
```

#### `deleteLead(id)`
Delete a lead from Firestore.

```tsx
const handleDeleteLead = async (leadId: string) => {
  try {
    await deleteLead(leadId);
    // Lead deleted successfully
  } catch (error) {
    // Handle error
  }
};
```

#### `refreshLeads()`
Manually refresh leads from Firestore (usually not needed as it auto-fetches).

```tsx
const handleRefresh = async () => {
  await refreshLeads();
};
```

## Lead Interface

```typescript
interface Lead {
  id: string;                    // Firestore document ID
  name: string;                  // Lead's full name
  company: string;               // Company name
  email: string;                 // Contact email
  phone: string;                 // Phone number
  location: string;              // Geographic location
  status: "new" | "contacted" | "qualified" | "negotiating" | "won" | "lost";
  value: number;                 // Potential project value in USD
  industry: string;              // Industry/sector
  score: number;                 // Lead quality score (0-100)
  addedDate: string;             // ISO date string
  userId: string;                // User who owns this lead
}
```

## Firebase Structure

Leads are stored in Firestore under the `leads` collection:

```
leads/
  {leadId}/
    name: "John Doe"
    company: "Acme Corp"
    email: "john@acme.com"
    phone: "+1 (555) 123-4567"
    location: "New York, NY"
    status: "new"
    value: 5000
    industry: "Technology"
    score: 85
    userId: "user123"
    addedDate: Timestamp
```

## Security Rules (Firestore)

Add these rules to your Firestore to ensure users can only access their own leads:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leads/{leadId} {
      // Users can only read/write their own leads
      allow read, write: if request.auth != null && 
                          request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
                    resource.data.userId == request.auth.uid;
    }
  }
}
```

## Example: Complete Component

```tsx
import { useContext, useState } from "react";
import { LeadsContext } from "../contexts/LeadsContextValue";

export default function LeadsPage() {
  const { leads, loading, addLead, updateLead, deleteLead } = useContext(LeadsContext);
  const [newLeadName, setNewLeadName] = useState("");

  const handleAdd = async () => {
    await addLead({
      name: newLeadName,
      company: "New Company",
      email: "contact@company.com",
      phone: "+1 (555) 000-0000",
      location: "City, State",
      status: "new",
      value: 5000,
      industry: "Technology",
      score: 75
    });
    setNewLeadName("");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Leads ({leads.length})</h1>
      
      <input 
        value={newLeadName} 
        onChange={(e) => setNewLeadName(e.target.value)}
        placeholder="Lead name"
      />
      <button onClick={handleAdd}>Add Lead</button>

      <ul>
        {leads.map(lead => (
          <li key={lead.id}>
            {lead.name} - {lead.company} ({lead.status})
            <button onClick={() => updateLead(lead.id, { status: "contacted" })}>
              Mark Contacted
            </button>
            <button onClick={() => deleteLead(lead.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Notes

- Leads are automatically fetched when the user logs in
- All operations require the user to be authenticated
- The context handles optimistic UI updates (local state updated immediately)
- Firebase errors are caught and stored in the `error` property
- Use `loading` to show loading states during operations
