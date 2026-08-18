'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Mail,
  Search,
  Filter,
  TrendingUp,
  Star,
  MessageSquare,
  BarChart3,
  RefreshCw,
  Trash2,
  Plus,
  DollarSign,
  FileText,
  Briefcase,
  CheckSquare,
  Tag,
  Calendar,
  Layers,
  HelpCircle,
  Play,
  Send
} from 'lucide-react';
import { api } from '../../../lib/api';

interface Customer {
  id: string;
  companyName: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  phone: string | null;
  website: string | null;
  currency: string;
  createdAt: string;
  contacts?: any[];
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
  items?: any[];
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
  items?: any[];
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
  milestones?: any[];
  tasks?: any[];
}

interface ProjectTask {
  id: string;
  name: string;
  description: string | null;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

interface Ticket {
  id: string;
  department: string;
  subject: string;
  priority: string;
  status: string;
  customerName: string;
  customerEmail: string;
  replies?: any[];
}

const stageColors: Record<string, string> = {
  NEW_LEAD: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  PROSPECT: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  QUALIFIED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  CUSTOMER: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  CHURNED: 'bg-red-500/20 text-red-300 border-red-500/40',
};

const stageLabels: Record<string, string> = {
  NEW_LEAD: 'New Lead',
  PROSPECT: 'Prospect',
  QUALIFIED: 'Qualified',
  CUSTOMER: 'Customer',
  CHURNED: 'Churned',
};

export default function CRMHubPage() {
  const [activeTab, setActiveTab] = useState<'customers' | 'billing' | 'projects' | 'tickets'>('customers');
  
  // Lists
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  
  const [loading, setLoading] = useState(true);

  // Modal / Creator states
  const [showCustModal, setShowCustModal] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custWeb, setCustWeb] = useState('');
  
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

  // Active support ticket view
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketReply, setTicketReply] = useState('');

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [custData, invData, estData, propData, projData, tickData] = await Promise.all([
        api.get<Customer[]>('/api/v1/crm/customers'),
        api.get<Invoice[]>('/api/v1/crm/invoices'),
        api.get<Estimate[]>('/api/v1/crm/estimates'),
        api.get<Proposal[]>('/api/v1/crm/proposals'),
        api.get<Project[]>('/api/v1/crm/projects'),
        api.get<Ticket[]>('/api/v1/crm/tickets'),
      ]);
      setCustomers(custData);
      setInvoices(invData);
      setEstimates(estData);
      setProposals(propData);
      setProjects(projData);
      setTickets(tickData);
    } catch (err) {
      console.error('Failed to fetch CRM records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    try {
      await api.post('/api/v1/crm/customers', {
        companyName,
        phone: custPhone,
        website: custWeb,
      });
      setCompanyName('');
      setCustPhone('');
      setCustWeb('');
      setShowCustModal(false);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

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
            taxPercent: 15 // Standard 15% VAT
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

  const handleMarkPaid = async (invId: string) => {
    try {
      await api.post(`/api/v1/crm/invoices/${invId}/pay`);
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

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !ticketReply.trim()) return;

    try {
      const res = await api.post<any>(`/api/v1/crm/tickets/${selectedTicket.id}/replies`, {
        message: ticketReply
      });
      setTicketReply('');
      // Reload active ticket structure
      const updatedTickets = await api.get<Ticket[]>('/api/v1/crm/tickets');
      setTickets(updatedTickets);
      const found = updatedTickets.find(t => t.id === selectedTicket.id);
      if (found) setSelectedTicket(found);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 min-h-screen bg-slate-950 p-6">
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
          <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <h2 className="text-sm font-bold text-white">Active Accounts Directory</h2>
            <button
              onClick={() => setShowCustModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-purple-600/25"
            >
              <UserPlus className="w-4 h-4" /> Add Company Account
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-10">
                <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
              </div>
            ) : customers.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-500 text-sm">No customers created yet.</div>
            ) : (
              customers.map(cust => (
                <div key={cust.id} className="bg-slate-900/60 border border-slate-850 p-5 rounded-2xl space-y-4 hover:border-purple-500/30 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-white text-sm">{cust.companyName}</h3>
                      <a href={cust.website || '#'} target="_blank" rel="noreferrer" className="text-[10px] text-purple-400 hover:underline">
                        {cust.website || 'No website registered'}
                      </a>
                    </div>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">{cust.currency}</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400 border-t border-slate-850 pt-3">
                    <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-500" /> {cust.phone || 'N/A'}</p>
                    <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-500" /> {cust.contacts?.[0]?.email || 'No primary contact'}</p>
                  </div>
                </div>
              ))
            )}
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
          <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-4 flex flex-col space-y-3 overflow-hidden">
            <div className="flex justify-between items-center pb-2 border-b border-slate-850">
              <span className="text-xs font-bold text-white">Ticketing Queue</span>
              <button
                onClick={() => setShowTicketModal(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Submit Ticket
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {tickets.length === 0 ? (
                <p className="text-center text-slate-500 text-xs py-10">No support tickets.</p>
              ) : (
                tickets.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-3 rounded-xl border space-y-1.5 transition ${
                      selectedTicket?.id === t.id
                        ? 'bg-purple-600/20 border-purple-500/40'
                        : 'bg-slate-950 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-white text-xs truncate max-w-[120px]">{t.subject}</span>
                      <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">{t.department}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">From: {t.customerName}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-slate-600">{t.customerEmail}</span>
                      <span className="text-[8px] font-bold text-amber-400">{t.status}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Active Ticket Chat Thread */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-850 rounded-3xl flex flex-col overflow-hidden">
            {selectedTicket ? (
              <>
                <div className="px-5 py-3.5 border-b border-slate-850 bg-slate-950/20">
                  <h3 className="font-extrabold text-white text-sm">{selectedTicket.subject}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Department: {selectedTicket.department} · Status: {selectedTicket.status}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {selectedTicket.replies?.map((rep, idx) => (
                    <div key={idx} className={`flex gap-3 ${rep.isAdminReply ? 'justify-end' : ''}`}>
                      <div className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                        rep.isAdminReply
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 rounded-tl-none'
                      }`}>
                        <span className="font-extrabold block text-[9px] text-purple-200 mb-1">{rep.senderName}</span>
                        {rep.message}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendReply} className="p-4 border-t border-slate-850 flex gap-3">
                  <input
                    type="text"
                    value={ticketReply}
                    onChange={e => setTicketReply(e.target.value)}
                    placeholder="Type reply message to client..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Reply
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
                <HelpCircle className="w-10 h-10 mb-2 text-slate-700 animate-pulse" />
                Select a ticket thread to respond
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE CUSTOMER MODAL */}
      {showCustModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">Add Company Profile</h3>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Company Phone</label>
                  <input
                    type="text"
                    placeholder="+123..."
                    value={custPhone}
                    onChange={e => setCustPhone(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={custWeb}
                    onChange={e => setCustWeb(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowCustModal(false)} className="bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/25">Save Company</button>
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
                  className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
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
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
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
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
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
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Quantity / Hours</label>
                  <input
                    type="number"
                    value={invItemQty}
                    onChange={e => setInvItemQty(e.target.value)}
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
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
                  className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
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
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
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
                    className="w-full mt-1.5 bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Routing Department</label>
                <select
                  value={ticketDept}
                  onChange={e => setTicketDept(e.target.value)}
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200"
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
                  className="w-full mt-1.5 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 text-slate-200 resize-none"
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
