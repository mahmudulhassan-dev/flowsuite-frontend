'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Users, UserPlus, Phone, Mail, Search, Filter, RefreshCw, Trash2, Plus, 
  DollarSign, FileText, Briefcase, Download, Upload, ShoppingBag, Globe, 
  MapPin, Check, X, ShieldAlert, Languages, Award
} from 'lucide-react';
import { api } from '../../../lib/api';

interface CustomerGroup {
  id: string;
  name: string;
}

interface CustomerGroupRelation {
  groupId: string;
  group: CustomerGroup;
}

interface CrmCustomerContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

interface Customer {
  id: string;
  companyName: string;
  vatNumber: string | null;
  phone: string | null;
  website: string | null;
  currency: string;
  language: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  shippingStreet: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingZipCode: string | null;
  shippingCountry: string | null;
  active: boolean;
  createdAt: string;
  contacts?: CrmCustomerContact[];
  groups?: CustomerGroupRelation[];
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer: Customer;
  status: 'DRAFT' | 'UNPAID' | 'PAID' | 'OVERDUE';
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  taxTotal: number;
  total: number;
}

interface Estimate {
  id: string;
  estimateNumber: string;
  customerId: string;
  customer: Customer;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED';
  issueDate: string;
  expiryDate: string;
  subtotal: number;
  taxTotal: number;
  total: number;
}

interface Proposal {
  id: string;
  subject: string;
  customerId: string | null;
  customer?: Customer;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED';
  total: number;
  expiryDate: string | null;
}

interface Project {
  id: string;
  name: string;
  customerId: string;
  customer: Customer;
  description: string | null;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED';
  startDate: string | null;
  deadline: string | null;
}

interface Ticket {
  id: string;
  department: string;
  subject: string;
  priority: string;
  status: string;
  customerName: string;
  customerEmail: string;
}

interface StatsData {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  activeContacts: number;
  inactiveContacts: number;
}

export default function CRMHubPage() {
  const [activeTab, setActiveTab] = useState<'customers' | 'billing' | 'projects' | 'tickets'>('customers');
  
  // Lists
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [groups, setGroups] = useState<CustomerGroup[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    activeContacts: 0,
    inactiveContacts: 0,
  });

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Customer Creator Form Modal (Add New Customer)
  const [showCustModal, setShowCustModal] = useState(false);
  const [formTab, setFormTab] = useState<'details' | 'address'>('details');
  const [companyName, setCompanyName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custWeb, setCustWeb] = useState('');
  const [custCurrency, setCustCurrency] = useState('USD');
  const [custLanguage, setCustLanguage] = useState('English');
  
  // Groups selection state
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showAddGroupInline, setShowAddGroupInline] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Primary Contact details
  const [contactFirst, setContactFirst] = useState('');
  const [contactLast, setContactLast] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Addresses
  const [billingStreet, setBillingStreet] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [billingCountry, setBillingCountry] = useState('');
  
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');
  const [copyBilling, setCopyBilling] = useState(false);

  // File Upload Ref for CSV
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  // Invoice creator state
  const [showInvModal, setShowInvModal] = useState(false);
  const [invCustomer, setInvCustomer] = useState('');
  const [invNumber, setInvNumber] = useState('');
  const [invItemDesc, setInvItemDesc] = useState('');
  const [invItemRate, setInvItemRate] = useState('100');
  const [invItemQty, setInvItemQty] = useState('1');

  // Ticket Modal state
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCustName, setTicketCustName] = useState('');
  const [ticketCustEmail, setTicketCustEmail] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketDept, setTicketDept] = useState('Billing');

  const loadAllData = async () => {
    try {
      setLoading(true);
      // Fetch customers with active search & group filter
      const custRes = await api.get<{
        customers: Customer[];
        stats: StatsData;
      }>(`/api/v1/crm/customers?search=${search}&groupId=${selectedGroupFilter}`);

      setCustomers(custRes.customers);
      setStats(custRes.stats);

      // Fetch other sub-module lists
      const [invData, estData, propData, projData, tickData, groupData] = await Promise.all([
        api.get<Invoice[]>('/api/v1/crm/invoices'),
        api.get<Estimate[]>('/api/v1/crm/estimates'),
        api.get<Proposal[]>('/api/v1/crm/proposals'),
        api.get<Project[]>('/api/v1/crm/projects'),
        api.get<Ticket[]>('/api/v1/crm/tickets'),
        api.get<CustomerGroup[]>('/api/v1/crm/groups'),
      ]);

      setInvoices(invData);
      setEstimates(estData);
      setProposals(propData);
      setProjects(projData);
      setTickets(tickData);
      setGroups(groupData);
    } catch (err) {
      console.error('Failed to fetch CRM records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [search, selectedGroupFilter]);

  // Synchronize billing details to shipping on check
  useEffect(() => {
    if (copyBilling) {
      setShippingStreet(billingStreet);
      setShippingCity(billingCity);
      setShippingState(billingState);
      setShippingZip(billingZip);
      setShippingCountry(billingCountry);
    }
  }, [copyBilling, billingStreet, billingCity, billingState, billingZip, billingCountry]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    try {
      await api.post('/api/v1/crm/customers', {
        companyName,
        vatNumber,
        phone: custPhone,
        website: custWeb,
        currency: custCurrency,
        language: custLanguage,
        address: billingStreet,
        city: billingCity,
        state: billingState,
        zipCode: billingZip,
        country: billingCountry,
        shippingStreet,
        shippingCity,
        shippingState,
        shippingZipCode: shippingZip,
        shippingCountry,
        groupIds: selectedGroups,
        primaryContact: {
          firstName: contactFirst,
          lastName: contactLast,
          email: contactEmail,
          phone: contactPhone,
        },
      });

      // Clear Form fields
      setCompanyName('');
      setVatNumber('');
      setCustPhone('');
      setCustWeb('');
      setContactFirst('');
      setContactLast('');
      setContactEmail('');
      setContactPhone('');
      setBillingStreet('');
      setBillingCity('');
      setBillingState('');
      setBillingZip('');
      setBillingCountry('');
      setShippingStreet('');
      setShippingCity('');
      setShippingState('');
      setShippingZip('');
      setShippingCountry('');
      setCopyBilling(false);
      setSelectedGroups([]);
      setFormTab('details');
      setShowCustModal(false);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGroupInline = async () => {
    if (!newGroupName.trim()) return;
    try {
      const res = await api.post<{ id: string; name: string }>('/api/v1/crm/groups', { name: newGroupName });
      setGroups(prev => [...prev, res]);
      setSelectedGroups(prev => [...prev, res.id]);
      setNewGroupName('');
      setShowAddGroupInline(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCustomerActive = async (id: string) => {
    try {
      await api.post(`/api/v1/crm/customers/toggle/${id}`);
      // Optimistically toggle locally first
      setCustomers(prev =>
        prev.map(c => (c.id === id ? { ...c, active: !c.active } : c))
      );
      // Reload stats
      const custRes = await api.get<{ stats: StatsData }>(`/api/v1/crm/customers?search=${search}&groupId=${selectedGroupFilter}`);
      setStats(custRes.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer? This will clear all linked records.')) return;
    try {
      await api.delete(`/api/v1/crm/customers/${id}`);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkPaid = async (invId: string) => {
    try {
      await api.post(`/api/v1/crm/invoices/${invId}/pay`);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Company Name', 'VAT Number', 'Phone', 'Website', 'Currency', 'Language', 
      'Primary Contact', 'Primary Email', 'Billing Address', 'City', 'Country', 'Status'
    ];
    
    const rows = [headers.join(',')];
    
    customers.forEach(c => {
      const primaryContact = c.contacts?.[0] ? `${c.contacts[0].firstName} ${c.contacts[0].lastName}` : 'N/A';
      const primaryEmail = c.contacts?.[0]?.email || 'N/A';
      
      const row = [
        `"${c.companyName.replace(/"/g, '""')}"`,
        `"${(c.vatNumber || '').replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        `"${(c.website || '').replace(/"/g, '""')}"`,
        `"${c.currency}"`,
        `"${(c.language || 'English').replace(/"/g, '""')}"`,
        `"${primaryContact.replace(/"/g, '""')}"`,
        `"${primaryEmail.replace(/"/g, '""')}"`,
        `"${(c.address || '').replace(/"/g, '""')}"`,
        `"${(c.city || '').replace(/"/g, '""')}"`,
        `"${(c.country || '').replace(/"/g, '""')}"`,
        `"${c.active ? 'Active' : 'Inactive'}"`
      ];
      rows.push(row.join(','));
    });
    
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_export_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const importedList = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        // Map column variations
        const mappedRow = {
          companyName: row['Company Name'] || row['Company'] || row['companyName'] || '',
          vatNumber: row['VAT Number'] || row['VAT'] || row['vatNumber'] || '',
          phone: row['Phone'] || row['phone'] || '',
          website: row['Website'] || row['website'] || '',
          currency: row['Currency'] || row['currency'] || 'USD',
          language: row['Language'] || row['language'] || 'English',
          primaryContact: row['Primary Contact'] || row['Contact'] || '',
          primaryEmail: row['Primary Email'] || row['Email'] || '',
          address: row['Billing Address'] || row['Address'] || '',
          city: row['City'] || row['city'] || '',
          country: row['Country'] || row['country'] || '',
        };

        if (mappedRow.companyName) {
          importedList.push(mappedRow);
        }
      }

      if (importedList.length === 0) {
        alert('No valid customer records found in CSV.');
        return;
      }

      try {
        const result = await api.post<{ success: boolean; count: number }>('/api/v1/crm/customers/import', {
          customers: importedList
        });
        alert(`Successfully imported ${result.count} customers!`);
        loadAllData();
      } catch (err) {
        console.error(err);
        alert('Failed to parse and upload import file.');
      }
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset uploader input
  };

  const handleSyncEcommerce = async (platform: string) => {
    try {
      const result = await api.post<{ success: boolean; count: number }>('/api/v1/crm/customers/sync-ecommerce', {
        platform
      });
      alert(`Woohoo! Synchronized ${result.count} client accounts from ${platform}!`);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Additional billing creation handlers
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invCustomer || !invNumber || !invItemDesc) return;

    try {
      await api.post('/api/v1/crm/invoices', {
        customerId: invCustomer,
        invoiceNumber: invNumber,
        items: [
          {
            description: invItemDesc,
            quantity: parseFloat(invItemQty) || 1,
            rate: parseFloat(invItemRate) || 0,
            taxPercent: 15
          }
        ]
      });
      setInvCustomer('');
      setInvNumber('');
      setInvItemDesc('');
      setShowInvModal(false);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketCustName || !ticketCustEmail || !ticketMessage) return;

    try {
      await api.post('/api/v1/crm/tickets', {
        department: ticketDept,
        subject: ticketSubject,
        customerName: ticketCustName,
        customerEmail: ticketCustEmail,
        message: ticketMessage
      });
      setTicketSubject('');
      setTicketCustName('');
      setTicketCustEmail('');
      setTicketMessage('');
      setShowTicketModal(false);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 min-h-screen bg-slate-950 p-6">
      
      {/* SEO Tags Mock Integration */}
      <title>Enterprise CRM & Contacts | FlowSuite</title>
      <meta name="description" content="Manage omnichannel CRM, customer companies, leads pipeline, groups, billing profiles, projects, and department helpdesk tickets." />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-3xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Enterprise CRM & Operations Hub
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">Perfex Engine</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Manage Customers, Invoicing, Proposals, Gantt Projects, and Support Departments</p>
          </div>
        </div>
        <button
          onClick={loadAllData}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Data
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex flex-wrap gap-1">
        {[
          { id: 'customers', label: '👥 Customers & Contacts', color: 'hover:text-purple-300' },
          { id: 'billing', label: '💳 Invoices & Payments', color: 'hover:text-emerald-300' },
          { id: 'projects', label: '💼 Projects & Gantt Tasks', color: 'hover:text-blue-300' },
          { id: 'tickets', label: '🎫 Support Departments', color: 'hover:text-amber-300' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 text-[11px] font-extrabold py-2.5 rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                : `text-slate-400 ${tab.color}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          
          {/* Stats cards modeled after Perfex CRM */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Customers', value: stats.totalCustomers, sub: 'Registered clients', color: 'text-white' },
              { label: 'Active Customers', value: stats.activeCustomers, sub: 'Live portal access', color: 'text-emerald-400' },
              { label: 'Inactive Customers', value: stats.inactiveCustomers, sub: 'Archived profiles', color: 'text-rose-400' },
              { label: 'Active Contacts', value: stats.activeContacts, sub: 'Sub-user representatives', color: 'text-purple-400' },
              { label: 'Logged In Today', value: customers.filter(c => c.active).length > 0 ? 1 : 0, sub: 'Portal activity', color: 'text-blue-400' },
            ].map(s => (
              <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-1">
                <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-slate-500">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-900/60 p-4 border border-slate-850 rounded-3xl">
            <div className="flex gap-2 w-full lg:w-auto">
              <button
                onClick={() => setShowCustModal(true)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-purple-600/25"
              >
                <Plus className="w-4 h-4" /> New Customer
              </button>
              <button
                onClick={() => csvInputRef.current?.click()}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition border border-slate-750"
              >
                <Upload className="w-4 h-4" /> Import Customers
              </button>
              <input 
                type="file" 
                ref={csvInputRef} 
                onChange={handleImportCSV} 
                accept=".csv" 
                className="hidden" 
              />
              <button
                onClick={handleExportCSV}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition border border-slate-750"
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* Sync dropdown & filters */}
            <div className="flex items-center gap-3 w-full lg:w-auto ml-auto">
              {/* E-commerce Sync Channels */}
              <div className="flex items-center gap-1 text-slate-500 text-xs mr-2">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="font-semibold text-slate-400">Sync:</span>
                <button 
                  onClick={() => handleSyncEcommerce('shopify')}
                  className="text-purple-400 hover:text-purple-300 hover:underline px-1 font-bold"
                >
                  Shopify
                </button>
                <span>|</span>
                <button 
                  onClick={() => handleSyncEcommerce('woocommerce')}
                  className="text-purple-400 hover:text-purple-300 hover:underline px-1 font-bold"
                >
                  WooCommerce
                </button>
              </div>

              {/* Group Filter */}
              <div className="relative">
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedGroupFilter}
                  onChange={e => setSelectedGroupFilter(e.target.value)}
                  className="pl-8 pr-4 py-2 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-300 focus:outline-none"
                >
                  <option value="all">All Groups</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>

              {/* Search */}
              <div className="relative flex-1 lg:max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-850">
                <tr>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3 text-left">Primary Contact</th>
                  <th className="p-3 text-left">Primary Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Groups</th>
                  <th className="p-3 text-left">Active</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      No customer company profiles matching your filters.
                    </td>
                  </tr>
                ) : (
                  customers.map(cust => (
                    <tr key={cust.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white text-sm">{cust.companyName}</div>
                        <a href={cust.website || '#'} target="_blank" rel="noreferrer" className="text-[10px] text-purple-400 hover:underline">
                          {cust.website || 'No website'}
                        </a>
                      </td>
                      <td className="p-3 font-semibold">
                        {cust.contacts?.[0] ? `${cust.contacts[0].firstName} ${cust.contacts[0].lastName}` : 'N/A'}
                      </td>
                      <td className="p-3 text-slate-400 font-mono">
                        {cust.contacts?.[0]?.email || 'N/A'}
                      </td>
                      <td className="p-3 text-slate-400">{cust.phone || 'N/A'}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {cust.groups?.map(g => (
                            <span key={g.groupId} className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-purple-500/10 text-purple-300 border border-purple-500/10">
                              {g.group.name}
                            </span>
                          ))}
                          {(!cust.groups || cust.groups.length === 0) && (
                            <span className="text-[10px] text-slate-600">None</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        {/* Toggle switch */}
                        <button
                          onClick={() => handleToggleCustomerActive(cust.id)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors border ${
                            cust.active ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-800 border-slate-700'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${cust.active ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteCustomer(cust.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVOICING & PAYMENTS */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <h2 className="text-sm font-bold text-white">Invoicing & Financial Ledger</h2>
            <button
              onClick={() => setShowInvModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/25"
            >
              <Plus className="w-4 h-4" /> Issue New Invoice
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-slate-850 text-slate-400 uppercase">
                <tr>
                  <th className="p-3 text-left">Invoice No</th>
                  <th className="p-3 text-left">Company</th>
                  <th className="p-3 text-left">Due Date</th>
                  <th className="p-3 text-left">Total Amount</th>
                  <th className="p-3 text-left">Payment Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-500">No invoices issued.</td>
                  </tr>
                ) : (
                  invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-850/30 transition">
                      <td className="p-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                      <td className="p-3 font-semibold">{inv.customer?.companyName}</td>
                      <td className="p-3 text-slate-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                      <td className="p-3 text-slate-200 font-mono font-bold">{inv.total.toFixed(2)} {inv.currency}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {inv.status === 'UNPAID' && (
                          <button
                            onClick={() => handleMarkPaid(inv.id)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <DollarSign className="w-3 h-3" /> Simulate Pay
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECTS & TASKS */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <h2 className="text-sm font-bold text-white">Workspace Project Trackers</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-500 text-sm bg-slate-900/40 border border-slate-850 rounded-2xl">No active projects.</div>
            ) : (
              projects.map(proj => (
                <div key={proj.id} className="bg-slate-900/60 border border-slate-850 p-5 rounded-3xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-white text-base">{proj.name}</h3>
                      <span className="text-[10px] text-slate-500">Client: {proj.customer?.companyName}</span>
                    </div>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40 font-bold">{proj.status}</span>
                  </div>

                  {/* Gantt date labels */}
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 border-t border-slate-850 pt-3">
                    <p>📅 Start: {proj.startDate ? new Date(proj.startDate).toLocaleDateString() : 'N/A'}</p>
                    <p>🚨 Deadline: {proj.deadline ? new Date(proj.deadline).toLocaleDateString() : 'N/A'}</p>
                  </div>

                  {/* Milestones bar */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Milestones Progress</span>
                    <div className="w-full h-2 bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600" style={{ width: '65%' }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT DEPARTMENTS */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px]">
          {/* Tickets list */}
          <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-4 flex flex-col space-y-3 overflow-hidden col-span-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-850">
              <h2 className="text-sm font-bold text-white">Active Support Tickets</h2>
              <button
                onClick={() => setShowTicketModal(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Open Ticket
              </button>
            </div>
            
            <div className="overflow-y-auto space-y-2 flex-1">
              {tickets.length === 0 ? (
                <p className="text-slate-500 text-xs text-center py-10">No tickets found.</p>
              ) : (
                tickets.map(t => (
                  <div key={t.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-slate-700 transition space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold uppercase text-[9px] tracking-wider bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{t.department}</span>
                      <span className="text-slate-400 font-mono text-[9px]">{t.customerEmail}</span>
                    </div>
                    <p className="text-white font-bold text-xs">{t.subject}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                      <span>Client: {t.customerName}</span>
                      <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">{t.priority}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL WITH DETAILS & ADDRESS TABS */}
      {showCustModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                📂 Add New Customer Profile
              </h3>
              <button onClick={() => setShowCustModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Tabs */}
            <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
              <button
                type="button"
                onClick={() => setFormTab('details')}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition ${
                  formTab === 'details' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                👤 Customer Details
              </button>
              <button
                type="button"
                onClick={() => setFormTab('address')}
                className={`flex-1 text-xs font-bold py-2 rounded-lg transition ${
                  formTab === 'address' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/20' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📍 Billing & Shipping
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 pt-2">
              
              {/* TAB 1: DETAILS */}
              {formTab === 'details' && (
                <div className="space-y-4">
                  {/* Company Name & VAT */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Company Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Corp"
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">VAT Number / TIN</label>
                      <input
                        type="text"
                        placeholder="e.g. VAT-10029302"
                        value={vatNumber}
                        onChange={e => setVatNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Phone & Website */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g. +880..."
                        value={custPhone}
                        onChange={e => setCustPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Website URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={custWeb}
                        onChange={e => setCustWeb(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Currency & Language Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Default Currency</label>
                      <select
                        value={custCurrency}
                        onChange={e => setCustCurrency(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="BDT">BDT (৳)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Default Language</label>
                      <select
                        value={custLanguage}
                        onChange={e => setCustLanguage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="English">English</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                    </div>
                  </div>

                  {/* Groups Picker with Inline Add Group */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Customer Groups</label>
                      <button
                        type="button"
                        onClick={() => setShowAddGroupInline(!showAddGroupInline)}
                        className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> New Group
                      </button>
                    </div>

                    {showAddGroupInline && (
                      <div className="flex gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 mt-1">
                        <input
                          type="text"
                          placeholder="Group name (e.g. VIP)"
                          value={newGroupName}
                          onChange={e => setNewGroupName(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddGroupInline}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                        >
                          Add
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 bg-slate-950/40 p-3 rounded-xl border border-slate-900 max-h-24 overflow-y-auto">
                      {groups.map(g => (
                        <label key={g.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedGroups.includes(g.id)}
                            onChange={() => {
                              if (selectedGroups.includes(g.id)) {
                                setSelectedGroups(prev => prev.filter(x => x !== g.id));
                              } else {
                                setSelectedGroups(prev => [...prev, g.id]);
                              }
                            }}
                            className="rounded border-slate-700 text-purple-600 focus:ring-purple-600 bg-slate-900"
                          />
                          {g.name}
                        </label>
                      ))}
                      {groups.length === 0 && (
                        <span className="text-[10px] text-slate-600 col-span-full">No customer groups created yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Primary Contact Info */}
                  <div className="border-t border-slate-850 pt-4 space-y-3">
                    <h4 className="text-xs font-bold text-purple-400">👤 Primary Contact Info</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">First Name</label>
                        <input
                          type="text"
                          placeholder="John"
                          value={contactFirst}
                          onChange={e => setContactFirst(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Last Name</label>
                        <input
                          type="text"
                          placeholder="Doe"
                          value={contactLast}
                          onChange={e => setContactLast(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Email Address</label>
                        <input
                          type="email"
                          placeholder="john.doe@acme.com"
                          value={contactEmail}
                          onChange={e => setContactEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Phone Number</label>
                        <input
                          type="text"
                          placeholder="+880..."
                          value={contactPhone}
                          onChange={e => setContactPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ADDRESSES */}
              {formTab === 'address' && (
                <div className="space-y-5">
                  
                  {/* Billing Address fields */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-purple-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Billing Address</h4>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Street Address</label>
                      <input
                        type="text"
                        placeholder="123 Corporate Way, Suite 100"
                        value={billingStreet}
                        onChange={e => setBillingStreet(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">City</label>
                        <input
                          type="text"
                          placeholder="Dhaka"
                          value={billingCity}
                          onChange={e => setBillingCity(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">State</label>
                        <input
                          type="text"
                          placeholder="Dhaka Division"
                          value={billingState}
                          onChange={e => setBillingState(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Zip Code</label>
                        <input
                          type="text"
                          placeholder="1212"
                          value={billingZip}
                          onChange={e => setBillingZip(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Country</label>
                        <input
                          type="text"
                          placeholder="Bangladesh"
                          value={billingCountry}
                          onChange={e => setBillingCountry(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Copy helper */}
                  <div className="flex items-center gap-2 p-2 bg-slate-950/40 rounded-xl border border-slate-900">
                    <input
                      type="checkbox"
                      id="copyBilling"
                      checked={copyBilling}
                      onChange={e => setCopyBilling(e.target.checked)}
                      className="rounded border-slate-700 text-purple-600 bg-slate-900"
                    />
                    <label htmlFor="copyBilling" className="text-xs text-slate-400 font-semibold cursor-pointer">
                      Same as Billing Address
                    </label>
                  </div>

                  {/* Shipping Address fields */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-purple-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Shipping Address</h4>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Street Address</label>
                      <input
                        type="text"
                        disabled={copyBilling}
                        placeholder="123 Delivery Way"
                        value={shippingStreet}
                        onChange={e => setShippingStreet(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none disabled:opacity-50"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">City</label>
                        <input
                          type="text"
                          disabled={copyBilling}
                          placeholder="Dhaka"
                          value={shippingCity}
                          onChange={e => setShippingCity(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">State</label>
                        <input
                          type="text"
                          disabled={copyBilling}
                          placeholder="Dhaka Division"
                          value={shippingState}
                          onChange={e => setShippingState(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Zip Code</label>
                        <input
                          type="text"
                          disabled={copyBilling}
                          placeholder="1212"
                          value={shippingZip}
                          onChange={e => setShippingZip(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Country</label>
                        <input
                          type="text"
                          disabled={copyBilling}
                          placeholder="Bangladesh"
                          value={shippingCountry}
                          onChange={e => setShippingCountry(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-2 justify-end pt-4 border-t border-slate-850">
                <button 
                  type="button" 
                  onClick={() => setShowCustModal(false)} 
                  className="bg-slate-850 hover:bg-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg shadow-purple-600/25"
                >
                  Save Customer Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {showInvModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Issue Invoice Ledger</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Target Client</label>
                <select
                  required
                  value={invCustomer}
                  onChange={e => setInvCustomer(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select Customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Invoice ID Number</label>
                  <input
                    type="text"
                    required
                    placeholder="INV-1002"
                    value={invNumber}
                    onChange={e => setInvNumber(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Item Description</label>
                  <input
                    type="text"
                    required
                    placeholder="Consulting Services"
                    value={invItemDesc}
                    onChange={e => setInvItemDesc(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={invItemRate}
                    onChange={e => setInvItemRate(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Quantity / Hours</label>
                  <input
                    type="number"
                    value={invItemQty}
                    onChange={e => setInvItemQty(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowInvModal(false)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/25">Submit Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TICKET MODAL */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Create Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Ticket Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Account Billing Dispute"
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Karim Ahmed"
                    value={ticketCustName}
                    onChange={e => setTicketCustName(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Customer Email</label>
                  <input
                    type="email"
                    required
                    placeholder="karim@corp.com"
                    value={ticketCustEmail}
                    onChange={e => setTicketCustEmail(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Routing Department</label>
                <select
                  value={ticketDept}
                  onChange={e => setTicketDept(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Billing">Billing & Accounting</option>
                  <option value="Technical">Technical Support</option>
                  <option value="Sales">Sales & Marketing</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Description / Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your issue..."
                  value={ticketMessage}
                  onChange={e => setTicketMessage(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowTicketModal(false)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/25">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
