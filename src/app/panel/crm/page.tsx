'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Users, UserPlus, Phone, Mail, Search, Filter, RefreshCw, Trash2, Plus, 
  DollarSign, FileText, Briefcase, Download, Upload, ShoppingBag, Globe, 
  MapPin, Check, X, ShieldAlert, Languages, Award, Target, Activity, 
  Calendar, Receipt, CreditCard, ChevronRight, Sliders, Play, AlertCircle
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

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityLabel: string | null;
  createdAt: string;
  ipAddress: string | null;
}

interface CrmGoal {
  id: string;
  title: string;
  type: string;
  targetValue: number;
  currentValue: number;
  deadline: string | null;
  color: string;
}

interface RecurringInvoice {
  id: string;
  customerId: string;
  customer?: Customer;
  invoicePrefix: string;
  period: string;
  cycleCount: number;
  nextRunAt: string;
  total: number;
  isActive: boolean;
}

interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  note: string | null;
  billable: boolean;
}

export default function CRMHubPage() {
  const [activeTab, setActiveTab] = useState<'customers' | 'billing' | 'projects' | 'tickets' | 'activity' | 'goals' | 'recurring' | 'expenses'>('customers');
  
  // Master lists
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [groups, setGroups] = useState<CustomerGroup[]>([]);
  
  // Phase 3 tabs lists
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [goals, setGoals] = useState<CrmGoal[]>([]);
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Search/Filters
  const [search, setSearch] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCustModal, setShowCustModal] = useState(false);
  const [formTab, setFormTab] = useState<'details' | 'address'>('details');
  const [companyName, setCompanyName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custWeb, setCustWeb] = useState('');
  const [custCurrency, setCustCurrency] = useState('USD');
  const [custLanguage, setCustLanguage] = useState('English');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [showAddGroupInline, setShowAddGroupInline] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [contactFirst, setContactFirst] = useState('');
  const [contactLast, setContactLast] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
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

  // New forms modallers
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalType, setGoalType] = useState('REVENUE');
  const [goalTarget, setGoalTarget] = useState('5000');
  const [goalColor, setGoalColor] = useState('#7c3aed');

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expName, setExpName] = useState('');
  const [expCat, setExpCat] = useState('Marketing');
  const [expAmt, setExpAmt] = useState('150');

  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [recCust, setRecCust] = useState('');
  const [recPeriod, setRecPeriod] = useState('MONTHLY');
  const [recAmt, setRecAmt] = useState('99');

  const csvInputRef = useRef<HTMLInputElement | null>(null);

  const loadCRMData = async () => {
    try {
      setLoading(true);
      const [custRes, invData, projData, tickData, groupData, actData, goalData, recData, expData] = await Promise.all([
        api.get<{ customers: Customer[] }>(`/api/v1/crm/customers?search=${search}&groupId=${selectedGroupFilter}`),
        api.get<Invoice[]>('/api/v1/crm/invoices'),
        api.get<Project[]>('/api/v1/crm/projects'),
        api.get<Ticket[]>('/api/v1/crm/tickets'),
        api.get<CustomerGroup[]>('/api/v1/crm/groups'),
        api.get<ActivityLog[]>('/api/v1/crm/activity'),
        api.get<CrmGoal[]>('/api/v1/crm/goals'),
        api.get<RecurringInvoice[]>('/api/v1/crm/recurring-invoices'),
        api.get<Expense[]>('/api/v1/crm/expenses')
      ]);

      setCustomers(custRes.customers || []);
      setInvoices(invData || []);
      setProjects(projData || []);
      setTickets(tickData || []);
      setGroups(groupData || []);
      setActivities(actData || []);
      setGoals(goalData || []);
      setRecurringInvoices(recData || []);
      setExpenses(expData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCRMData();
  }, [search, selectedGroupFilter]);

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
      setShowCustModal(false);
      loadCRMData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    try {
      await api.post('/api/v1/crm/goals', {
        title: goalTitle,
        type: goalType,
        targetValue: parseFloat(goalTarget),
        color: goalColor
      });
      setGoalTitle('');
      setShowGoalModal(false);
      loadCRMData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName.trim()) return;
    try {
      await api.post('/api/v1/crm/expenses', {
        name: expName,
        category: expCat,
        amount: parseFloat(expAmt),
        date: new Date().toISOString()
      });
      setExpName('');
      setShowExpenseModal(false);
      loadCRMData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRecurring = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recCust) return;
    try {
      await api.post('/api/v1/crm/recurring-invoices', {
        customerId: recCust,
        period: recPeriod,
        subtotal: parseFloat(recAmt),
        taxTotal: 0,
        total: parseFloat(recAmt),
        items: [{ description: 'Recurring Workspace Plan License', quantity: 1, rate: parseFloat(recAmt) }]
      });
      setShowRecurringModal(false);
      loadCRMData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Company Name', 'Phone', 'Website', 'Currency', 'Active'];
    const rows = [headers.join(',')];
    customers.forEach(c => {
      rows.push([`"${c.companyName}"`, `"${c.phone||''}"`, `"${c.website||''}"`, `"${c.currency}"`, `"${c.active?'Active':'Inactive'}"`].join(','));
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `crm_customers_${Date.now()}.csv`);
    link.click();
  };

  return (
    <div className="space-y-6 text-slate-100 min-h-screen bg-slate-950 p-6">
      
      {/* Top header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-[32px] border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              CRM & Workspace Business Hub
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">Operations</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Manage Clients, Invoicing, recurring schedules, and track business expenditures.</p>
          </div>
        </div>
        <button
          onClick={loadCRMData}
          className="flex items-center gap-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Data
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl flex flex-wrap gap-1">
        {[
          { id: 'customers', label: '👥 Clients' },
          { id: 'billing', label: '💳 Billing' },
          { id: 'projects', label: '💼 Projects' },
          { id: 'tickets', label: '🎫 Tickets' },
          { id: 'activity', label: '📜 Activity Log' },
          { id: 'goals', label: '🎯 Target Goals' },
          { id: 'recurring', label: '🔄 Recurring Invoices' },
          { id: 'expenses', label: '🧾 Expenses' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 text-[11px] font-extrabold py-2.5 rounded-xl transition ${
              activeTab === tab.id
                ? 'bg-purple-600/20 border border-purple-500/40 text-purple-300'
                : 'text-slate-400 hover:text-purple-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-900/60 p-4 border border-slate-850 rounded-3xl">
            <div className="flex gap-2">
              <button onClick={() => setShowCustModal(true)} className="bg-purple-650 hover:bg-purple-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1">
                <Plus className="w-4 h-4" /> New Customer
              </button>
              <button onClick={handleExportCSV} className="bg-slate-850 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 border border-slate-800">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600"
              />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-850">
                <tr>
                  <th className="p-3">Company Name</th>
                  <th className="p-3">Primary Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Currency</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {customers.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-slate-500">No customers found.</td></tr>
                ) : (
                  customers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-800/10">
                      <td className="p-3 font-bold text-white">{c.companyName}</td>
                      <td className="p-3 font-mono text-slate-400">{c.contacts?.[0]?.email || '--'}</td>
                      <td className="p-3 text-slate-400">{c.phone || '--'}</td>
                      <td className="p-3 font-mono">{c.currency}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-850 text-slate-500'}`}>
                          {c.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: BILLING */}
      {activeTab === 'billing' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 overflow-hidden">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Invoice Ledger</h3>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-850">
                <tr>
                  <th className="p-3">Invoice No</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {invoices.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-slate-500">No invoices generated.</td></tr>
                ) : (
                  invoices.map(inv => (
                    <tr key={inv.id}>
                      <td className="p-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                      <td className="p-3">{inv.customer?.companyName}</td>
                      <td className="p-3 text-slate-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                      <td className="p-3 text-slate-200 font-mono font-bold">{inv.total.toFixed(2)} {inv.currency}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length === 0 ? (
            <p className="col-span-full text-center text-slate-500 py-10 text-xs">No projects registered.</p>
          ) : (
            projects.map(p => (
              <div key={p.id} className="bg-slate-900/60 border border-slate-850 p-5 rounded-3xl space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white text-sm">{p.name}</h3>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">{p.status}</span>
                </div>
                <p className="text-[11px] text-slate-400">{p.description || 'No description provided.'}</p>
                <p className="text-[10px] text-slate-500">Client: {p.customer?.companyName}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB: TICKETS */}
      {activeTab === 'tickets' && (
        <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-5 space-y-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-850">
              <tr>
                <th className="p-3">Department</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Customer Email</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-855 text-slate-300">
              {tickets.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-500">No helpdesk tickets opened.</td></tr>
              ) : (
                tickets.map(t => (
                  <tr key={t.id}>
                    <td className="p-3 font-bold">{t.department}</td>
                    <td className="p-3 text-white font-medium">{t.subject}</td>
                    <td className="p-3 text-amber-400">{t.priority}</td>
                    <td className="p-3 text-slate-500 font-mono">{t.customerEmail}</td>
                    <td className="p-3">
                      <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">{t.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: ACTIVITY LOG */}
      {activeTab === 'activity' && (
        <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Activity className="w-4 h-4 text-purple-400" /> Audit Activity Logs</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Global ledger tracking CRM profile operations, invoicing dispatches, and logins.</p>
          </div>
          <div className="space-y-2">
            {activities.length === 0 ? (
              <p className="text-slate-500 text-xs py-5 text-center">No system activities logged.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs hover:border-slate-800">
                  <div className="space-y-1">
                    <p className="font-semibold text-white">
                      <span className="text-purple-400 uppercase font-black mr-2 text-[9px] border border-purple-500/20 px-1.5 py-0.5 rounded bg-purple-500/5">{act.action}</span>
                      {act.entityType}: {act.entityLabel || 'Item'}
                    </p>
                    <p className="text-[10px] text-slate-500">IP address: {act.ipAddress || '127.0.0.1'}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(act.createdAt).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 6: GOALS */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-white">CRM Goals & Targets</h2>
              <p className="text-[10px] text-slate-500">Track targets for revenue generation, lead count, and project completions.</p>
            </div>
            <button
              onClick={() => setShowGoalModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Define Goal Target
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.length === 0 ? (
              <p className="col-span-full text-center text-slate-500 py-10 text-xs">No active targets defined.</p>
            ) : (
              goals.map((g) => {
                const goalPct = Math.min(100, (g.currentValue / g.targetValue) * 100);
                return (
                  <div key={g.id} className="bg-slate-900/60 border border-slate-850 p-5 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white text-sm">{g.title}</h4>
                        <span className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-wider">{g.type} Goal</span>
                      </div>
                      <Target className="w-5 h-5 text-indigo-400" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Current: {g.currentValue.toLocaleString()}</span>
                        <span className="text-slate-300 font-bold">Target: {g.targetValue.toLocaleString()} ({goalPct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                        <div className="h-full rounded-full transition-all" style={{ width: `${goalPct}%`, backgroundColor: g.color }} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 7: RECURRING BILLING */}
      {activeTab === 'recurring' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-white">Recurring Invoice Schedules</h2>
              <p className="text-[10px] text-slate-500">Automate repeat invoices (Daily, Weekly, Monthly, Yearly) for workspace subscribers.</p>
            </div>
            <button
              onClick={() => setShowRecurringModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Setup Recurring Invoice
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-850">
                <tr>
                  <th className="p-3">Client</th>
                  <th className="p-3">Period</th>
                  <th className="p-3">Total Sum</th>
                  <th className="p-3">Next Dispatch Date</th>
                  <th className="p-3">Schedules Cycle</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {recurringInvoices.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-10 text-slate-500">No active recurring profiles configured.</td></tr>
                ) : (
                  recurringInvoices.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-800/10">
                      <td className="p-3 font-bold text-white">Client Company</td>
                      <td className="p-3 text-purple-400 font-bold text-[10px] font-mono">{rec.period}</td>
                      <td className="p-3 font-bold text-slate-200 font-mono">${rec.total.toFixed(2)}</td>
                      <td className="p-3 text-slate-400 font-mono">{new Date(rec.nextRunAt).toLocaleDateString()}</td>
                      <td className="p-3 font-mono">{rec.cycleCount} cycles dispatched</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rec.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-850 text-slate-500'}`}>
                          {rec.isActive ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <div>
              <h2 className="text-sm font-bold text-white">Business Expenses & Expenditures</h2>
              <p className="text-[10px] text-slate-500">Track and log office rents, software licenses, domain costs, and marketing ads spend.</p>
            </div>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Log Expenditure
            </button>
          </div>

          <div className="bg-slate-900/60 border border-slate-805 rounded-3xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-850">
                <tr>
                  <th className="p-3">Name / Label</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Cost Amount</th>
                  <th className="p-3">Logged Date</th>
                  <th className="p-3">Billable status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {expenses.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-slate-500">No expenses logged yet.</td></tr>
                ) : (
                  expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-800/10">
                      <td className="p-3 font-bold text-white">{e.name}</td>
                      <td className="p-3 font-bold text-indigo-400 text-[10px] uppercase">{e.category}</td>
                      <td className="p-3 font-mono font-bold text-rose-400">{e.currency} {e.amount.toLocaleString()}</td>
                      <td className="p-3 text-slate-400 font-mono">{new Date(e.date).toLocaleDateString()}</td>
                      <td className="p-3 text-[10px] font-bold text-slate-500">{e.billable ? 'Billable to Client' : 'Internal cost'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {showCustModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-slate-855 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">📂 Add New Customer Profile</h3>
              <button onClick={() => setShowCustModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">Company Name *</label>
                  <input type="text" required placeholder="Acme Inc" value={companyName} onChange={e => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">VAT / TIN Number</label>
                  <input type="text" placeholder="VAT-1002" value={vatNumber} onChange={e => setVatNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">Phone Number</label>
                  <input type="text" placeholder="+8801700..." value={custPhone} onChange={e => setCustPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">Website URL</label>
                  <input type="text" placeholder="https://domain.com" value={custWeb} onChange={e => setCustWeb(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white" />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-850">
                <button type="button" onClick={() => setShowCustModal(false)} className="bg-slate-800 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/25">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEFINE GOAL MODAL */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-855 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Target className="w-4 h-4 text-purple-400" /> Define Target Goal</h3>
              <button onClick={() => setShowGoalModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold">Goal Title</label>
                <input type="text" required placeholder="e.g. Q3 Sales Revenue Target" value={goalTitle} onChange={e => setGoalTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Goal Metric Type</label>
                  <select value={goalType} onChange={e => setGoalType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="REVENUE">Revenue ($)</option>
                    <option value="LEADS">Leads Captured</option>
                    <option value="TASKS">Staff Tasks Completed</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Target Value</label>
                  <input type="number" value={goalTarget} onChange={e => setGoalTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowGoalModal(false)} className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs">Define Target</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG EXPENDITURE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-855 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Receipt className="w-4 h-4 text-rose-400" /> Log Office Expenditure</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold">Item Name / Vendor</label>
                <input type="text" required placeholder="e.g. AWS Cloud servers billing" value={expName} onChange={e => setExpName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Cost Category</label>
                  <select value={expCat} onChange={e => setExpCat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="Marketing">Marketing Spend</option>
                    <option value="Infrastructure">Servers & Infrastructure</option>
                    <option value="Office Rents">Office Rent / Utility</option>
                    <option value="Staff Salaries">Staff Salary</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Amount Cost ($)</label>
                  <input type="number" value={expAmt} onChange={e => setExpAmt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs">Log Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SETUP RECURRING MODAL */}
      {showRecurringModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center border-b border-slate-855 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5"><Calendar className="w-4 h-4 text-purple-400" /> Setup Recurring Profile</h3>
              <button onClick={() => setShowRecurringModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateRecurring} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 font-bold">Select Client</label>
                <select required value={recCust} onChange={e => setRecCust(e.target.value)}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white">
                  <option value="">Select Customer...</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Interval Period</label>
                  <select value={recPeriod} onChange={e => setRecPeriod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
                    <option value="DAILY">Daily dispatch</option>
                    <option value="WEEKLY">Weekly dispatch</option>
                    <option value="MONTHLY">Monthly dispatch</option>
                    <option value="YEARLY">Yearly dispatch</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Amount per cycle ($)</label>
                  <input type="number" value={recAmt} onChange={e => setRecAmt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowRecurringModal(false)} className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-650 text-white font-bold px-4 py-2.5 rounded-xl text-xs">Setup Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
