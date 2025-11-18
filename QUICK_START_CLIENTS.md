# Quick Start: Clients Management System

## 🚀 Getting Started

Your FlashLeads CRM now has a complete clients management system with modals for managing all aspects of client relationships.

### 1. Start the Application

```bash
# Start both development server and proxy
npm run dev:all

# Or start them separately:
npm run dev        # Frontend (Vite)
npm run dev:server # Backend proxy (Express)
```

The app will run on:
- **Frontend**: http://localhost:5173 (or another port if 5173 is in use)
- **Backend Proxy**: http://localhost:3001

### 2. Navigate to Clients Page

1. Sign in to your account
2. Click **"Clients"** in the sidebar
3. You'll see the clients dashboard with stats and filters

---

## 📋 Complete Workflow Examples

### Example 1: Add a New Client

1. Click **"Add Client"** button (top right)
2. Fill in the form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Phone**: +1 555-0123
   - **Company**: Acme Corp
   - **Location**: San Francisco, CA
   - **Industry**: Technology (select from dropdown)
   - **Status**: Prospect
   - **Total Revenue**: 0
   - **Tags**: startup, tech (comma-separated)
3. Click **"Add Client"**
4. Client appears in the grid/list view

### Example 2: Edit an Existing Client

1. Find the client in grid or list view
2. Click the **edit icon** (pen)
3. Update any fields (e.g., change status to "Active")
4. Click **"Update Client"**
5. Changes are saved immediately

### Example 3: Send an Email to Client

1. Find the client in the view
2. Click the **email icon** (envelope)
3. Select email type (e.g., "Follow Up")
4. Click **"Load Template"** to use a pre-built template
5. Customize subject and body
6. Click **"Send Email"**
7. Email is saved in client's history

### Example 4: Delete a Client

1. Find the client
2. Click the **delete icon** (trash)
3. Confirm deletion in the dialog
4. Client is removed from the system

---

## 🎯 Available Features

### Client Management
- ✅ Add new clients with comprehensive details
- ✅ Edit existing client information
- ✅ Delete clients (with confirmation)
- ✅ View clients in grid or list view
- ✅ Filter by status (All, Active, Prospect, Inactive, Past)
- ✅ Search by name, company, or email
- ✅ Track total revenue per client
- ✅ Add tags for organization
- ✅ Store LinkedIn and website URLs

### Email Communication
- ✅ Send emails to clients
- ✅ Use pre-built email templates
- ✅ Template types: General, Invoice, Estimate, Follow-up, Milestone
- ✅ Email history tracking
- ✅ Link emails to related documents

### Dashboard Stats
- ✅ Total clients count
- ✅ Active clients count
- ✅ Prospects count
- ✅ Total revenue across all clients

---

## 🔧 Modal Components Available

All modals are built and ready to use:

1. **ClientModal** - Add/Edit clients
2. **ProjectModal** - Manage projects (ready for integration)
3. **InvoiceModal** - Create invoices (ready for integration)
4. **EstimateModal** - Generate estimates (ready for integration)
5. **EmailModal** - Send emails (integrated)
6. **MilestoneModal** - Track milestones (ready for integration)

---

## 📊 Next Steps to Expand

### 1. Add Projects Feature

Create a projects page and integrate:
```tsx
<ProjectModal
  isOpen={isOpen}
  onClose={onClose}
  onSubmit={addProject}
  preselectedClientId={clientId}
/>
```

Features:
- Link projects to clients
- Track budget and spending
- Monitor progress (0-100%)
- Set timelines

### 2. Add Invoice Management

Create an invoices page:
```tsx
<InvoiceModal
  isOpen={isOpen}
  onClose={onClose}
  onSubmit={addInvoice}
  preselectedClientId={clientId}
  preselectedProjectId={projectId}
/>
```

Features:
- Auto-generate invoice numbers
- Dynamic line items
- Auto-calculate totals
- Track payment status
- Send invoices via email

### 3. Add Estimate Creation

Similar to invoices:
```tsx
<EstimateModal
  isOpen={isOpen}
  onClose={onClose}
  onSubmit={addEstimate}
  preselectedClientId={clientId}
/>
```

Features:
- Professional estimates
- Expiry dates
- Approval tracking
- Convert to invoice

### 4. Add Milestone Tracking

For project management:
```tsx
<MilestoneModal
  isOpen={isOpen}
  onClose={onClose}
  onSubmit={addMilestone}
  preselectedProjectId={projectId}
/>
```

Features:
- Project milestones
- Due dates
- Completion tracking
- Optional payments

---

## 🔐 Firebase Setup

Make sure you have the following Firestore collections:

1. **clients** - Client information
2. **projects** - Project details
3. **milestones** - Project milestones
4. **invoices** - Invoice records
5. **estimates** - Estimate records
6. **client_emails** - Email history

### Security Rules

Copy these rules to your Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Clients collection
    match /clients/{clientId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
    }
    
    // Projects collection
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
    }
    
    // Milestones collection
    match /milestones/{milestoneId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
    }
    
    // Invoices collection
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
    }
    
    // Estimates collection
    match /estimates/{estimateId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
    }
    
    // Client emails collection
    match /client_emails/{emailId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 🐛 Troubleshooting

### "Port already in use" error
If you see this error, another process is using port 5173 or 3001:
```bash
# Kill process on Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or just let Vite use another port (it will auto-detect)
```

### Modals not opening
Check browser console for errors. Make sure:
- Modal state is properly initialized
- onClick handlers are bound correctly
- Context providers are wrapped correctly in App.tsx

### Data not saving to Firebase
Verify:
- Firebase credentials in `.env` file
- Security rules are deployed
- User is authenticated
- Network tab shows successful API calls

### Email not sending
Currently, emails are only saved to the database. To actually send emails:
1. Integrate SendGrid or Mailgun
2. Update `sendEmail` function in ClientsContext
3. Add API credentials to `.env`

---

## 📚 Documentation

For detailed information, see:
- **CLIENTS_WORKFLOW_COMPLETE.md** - Complete modal documentation
- **CLIENTS_CONTEXT_GUIDE.md** - Context API and Firebase setup
- **PROXY_SETUP_GUIDE.md** - Apollo API proxy configuration

---

## ✨ Tips & Best Practices

1. **Use Tags**: Organize clients with tags like "VIP", "tech", "startup"
2. **Update Revenue**: Keep totalRevenue current for accurate stats
3. **Link Everything**: Connect projects to clients, invoices to projects
4. **Email Templates**: Customize templates to match your brand voice
5. **Track Status**: Update client status as relationships progress
6. **Regular Backups**: Export Firestore data regularly

---

## 🎉 You're All Set!

Your clients management system is ready to use. Start by adding your first client and explore all the features!

**Need Help?**
- Check the documentation files
- Review the code comments
- Test each feature systematically

**Happy Managing! 🚀**
