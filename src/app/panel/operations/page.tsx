'use client';

import { useState } from 'react';
import { Users, BookOpen, BarChart3, MessageSquare, ListChecks, Target, FileText, Newspaper, Calendar, Plus, Upload, Search, TrendingUp, TrendingDown, DollarSign, Mail, Eye, MousePointer, AlertCircle, CheckCircle, Clock, Trash2, Edit3 } from 'lucide-react';

type Tab = 'subscribers' | 'reports' | 'knowledge' | 'surveys' | 'tasks' | 'goals' | 'expenses' | 'newsfeed' | 'events';

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('subscribers');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'subscribers', label: 'Subscribers', icon: <Users className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'knowledge', label: 'Knowledge Base', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'surveys', label: 'Surveys', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'tasks', label: 'Staff Tasks', icon: <ListChecks className="w-4 h-4" /> },
    { id: 'goals', label: 'Goals', icon: <Target className="w-4 h-4" /> },
    { id: 'expenses', label: 'Expenses', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'newsfeed', label: 'Newsfeed', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Operations Hub</h1>
            <p className="text-slate-400 text-sm">Subscribers · Reports · Knowledge Base · Surveys · Staff Ops</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'subscribers' && <SubscribersTab />}
      {activeTab === 'reports' && <ReportsTab />}
      {activeTab === 'knowledge' && <KnowledgeTab />}
      {activeTab === 'surveys' && <SurveysTab />}
      {activeTab === 'tasks' && <TasksTab />}
      {activeTab === 'goals' && <GoalsTab />}
      {activeTab === 'expenses' && <ExpensesTab />}
      {activeTab === 'newsfeed' && <NewsfeedTab />}
      {activeTab === 'events' && <EventsTab />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIBERS TAB
// ─────────────────────────────────────────────────────────────────────────────

function SubscribersTab() {
  const [showNewList, setShowNewList] = useState(false);
  const [listName, setListName] = useState('');
  const [search, setSearch] = useState('');

  const mockLists = [
    { id: '1', name: 'Newsletter Subscribers', _count: { subscribers: 2847 }, createdAt: '2024-01-15' },
    { id: '2', name: 'Product Updates', _count: { subscribers: 1203 }, createdAt: '2024-02-01' },
    { id: '3', name: 'VIP Customers', _count: { subscribers: 392 }, createdAt: '2024-03-10' },
    { id: '4', name: 'Bangladesh Leads', _count: { subscribers: 758 }, createdAt: '2024-04-05' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Subscribers', value: '5,200', icon: <Users className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
          { label: 'Active Lists', value: '4', icon: <ListChecks className="w-5 h-5" />, color: 'from-emerald-500 to-teal-600' },
          { label: 'Avg. Open Rate', value: '38.2%', icon: <Eye className="w-5 h-5" />, color: 'from-violet-500 to-purple-600' },
          { label: 'Click Rate', value: '12.4%', icon: <MousePointer className="w-5 h-5" />, color: 'from-orange-500 to-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search lists..."
            className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-64"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-white transition-colors">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button
            onClick={() => setShowNewList(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors"
          >
            <Plus className="w-4 h-4" /> New List
          </button>
        </div>
      </div>

      {/* New List Form */}
      {showNewList && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex gap-3">
          <input
            value={listName}
            onChange={e => setListName(e.target.value)}
            placeholder="List name (e.g. Weekly Newsletter)"
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors">Create</button>
          <button onClick={() => setShowNewList(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-400 transition-colors">Cancel</button>
        </div>
      )}

      {/* Lists Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h3 className="font-semibold text-white">Subscriber Lists</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-6 py-3 text-xs text-slate-400 uppercase tracking-wider">List Name</th>
              <th className="text-left px-6 py-3 text-xs text-slate-400 uppercase tracking-wider">Subscribers</th>
              <th className="text-left px-6 py-3 text-xs text-slate-400 uppercase tracking-wider">Created</th>
              <th className="text-left px-6 py-3 text-xs text-slate-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockLists.map(list => (
              <tr key={list.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="font-medium text-white text-sm">{list.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white font-semibold">{list._count.subscribers.toLocaleString()}</span>
                  <span className="text-slate-400 text-xs ml-1">contacts</span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm">{list.createdAt}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded text-xs hover:bg-blue-600/30 transition-colors">View</button>
                    <button className="px-3 py-1 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded text-xs hover:bg-emerald-600/30 transition-colors">Send</button>
                    <button className="p-1 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS TAB
// ─────────────────────────────────────────────────────────────────────────────

function ReportsTab() {
  const [reportType, setReportType] = useState<'sales' | 'expenses' | 'leads' | 'campaigns'>('sales');

  const kpis = [
    { label: 'Monthly Revenue', value: '$24,850', change: '+18.2%', up: true, icon: <DollarSign className="w-5 h-5" />, color: 'from-emerald-500 to-teal-600' },
    { label: 'Total Expenses', value: '$8,320', change: '-4.1%', up: false, icon: <TrendingDown className="w-5 h-5" />, color: 'from-orange-500 to-red-500' },
    { label: 'Net Profit', value: '$16,530', change: '+24.7%', up: true, icon: <TrendingUp className="w-5 h-5" />, color: 'from-blue-500 to-violet-600' },
    { label: 'New Leads', value: '143', change: '+31.5%', up: true, icon: <Users className="w-5 h-5" />, color: 'from-violet-500 to-purple-600' },
  ];

  const salesData = [
    { month: 'Jan', amount: 12000 }, { month: 'Feb', amount: 18500 }, { month: 'Mar', amount: 15200 },
    { month: 'Apr', amount: 22100 }, { month: 'May', amount: 19800 }, { month: 'Jun', amount: 24850 },
  ];
  const maxAmount = Math.max(...salesData.map(d => d.amount));

  const invoices = [
    { id: 'INV-001', customer: 'Acme Corp', amount: 4200, status: 'PAID', date: '2024-06-01' },
    { id: 'INV-002', customer: 'Beta Ltd', amount: 1850, status: 'UNPAID', date: '2024-06-05' },
    { id: 'INV-003', customer: 'Gamma Inc', amount: 3300, status: 'PAID', date: '2024-06-10' },
    { id: 'INV-004', customer: 'Delta Co', amount: 920, status: 'OVERDUE', date: '2024-05-15' },
    { id: 'INV-005', customer: 'Echo GmbH', amount: 6100, status: 'PAID', date: '2024-06-18' },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white mb-3`}>
              {kpi.icon}
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-xs text-slate-400 mt-1">{kpi.label}</p>
            <span className={`text-xs font-medium mt-2 inline-block ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>{kpi.change} vs last month</span>
          </div>
        ))}
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-2">
        {(['sales', 'expenses', 'leads', 'campaigns'] as const).map(type => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${reportType === type ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Sales Chart */}
      {reportType === 'sales' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6">Revenue (Last 6 Months)</h3>
          <div className="flex items-end gap-4 h-48">
            {salesData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-400">${(d.amount / 1000).toFixed(1)}k</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all"
                  style={{ height: `${(d.amount / maxAmount) * 160}px` }}
                />
                <span className="text-xs text-slate-400">{d.month}</span>
              </div>
            ))}
          </div>

          {/* Recent Invoices */}
          <div className="mt-8">
            <h4 className="text-sm font-medium text-slate-300 mb-4">Recent Invoices</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                  <th className="text-left pb-2">Invoice</th>
                  <th className="text-left pb-2">Customer</th>
                  <th className="text-left pb-2">Amount</th>
                  <th className="text-left pb-2">Status</th>
                  <th className="text-left pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                    <td className="py-3 text-slate-300 font-mono">{inv.id}</td>
                    <td className="py-3 text-white">{inv.customer}</td>
                    <td className="py-3 text-white font-semibold">${inv.amount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        inv.status === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' :
                        inv.status === 'OVERDUE' ? 'bg-red-500/20 text-red-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>{inv.status}</span>
                    </td>
                    <td className="py-3 text-slate-400">{inv.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leads Report */}
      {reportType === 'leads' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-6">Leads by Stage</h3>
          <div className="space-y-4">
            {[
              { stage: 'NEW', count: 43, color: 'bg-blue-500' },
              { stage: 'CONTACTED', count: 31, color: 'bg-violet-500' },
              { stage: 'QUALIFIED', count: 24, color: 'bg-amber-500' },
              { stage: 'PROPOSAL', count: 18, color: 'bg-orange-500' },
              { stage: 'WON', count: 12, color: 'bg-emerald-500' },
              { stage: 'LOST', count: 8, color: 'bg-red-500' },
            ].map(s => (
              <div key={s.stage}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-300">{s.stage}</span>
                  <span className="text-sm font-semibold text-white">{s.count} leads</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${(s.count / 43) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWLEDGE BASE TAB
// ─────────────────────────────────────────────────────────────────────────────

function KnowledgeTab() {
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const articles = [
    { id: '1', title: 'How to connect your social accounts', views: 1243, helpful: 89, notHelpful: 4, category: 'Getting Started' },
    { id: '2', title: 'Setting up your first email campaign', views: 892, helpful: 74, notHelpful: 6, category: 'Marketing' },
    { id: '3', title: 'Managing customer invoices and billing', views: 634, helpful: 61, notHelpful: 2, category: 'CRM' },
    { id: '4', title: 'API Integration Guide', views: 421, helpful: 45, notHelpful: 8, category: 'Developer' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Knowledge Base</h2>
          <p className="text-slate-400 text-sm">Create helpful articles for your clients and team</p>
        </div>
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {showEditor && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 space-y-4">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Article title..."
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-lg font-medium"
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your article content here... (Markdown supported)"
            rows={10}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none font-mono text-sm"
          />
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors">Publish Article</button>
            <button onClick={() => setShowEditor(false)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-400 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {articles.map(article => (
          <div key={article.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded mb-2 inline-block">{article.category}</span>
                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{article.title}</h3>
              </div>
              <div className="flex gap-2 ml-4">
                <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.views.toLocaleString()} views</span>
              <span className="flex items-center gap-1 text-emerald-400"><CheckCircle className="w-3 h-3" /> {article.helpful} helpful</span>
              <span className="flex items-center gap-1 text-red-400"><AlertCircle className="w-3 h-3" /> {article.notHelpful} not helpful</span>
              <span>Score: {Math.round((article.helpful / (article.helpful + article.notHelpful)) * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SURVEYS TAB
// ─────────────────────────────────────────────────────────────────────────────

function SurveysTab() {
  const surveys = [
    { id: '1', title: 'Customer Satisfaction Q2 2024', responses: 247, questions: 8, isPublic: true, closedAt: null },
    { id: '2', title: 'Product Feature Feedback', responses: 89, questions: 5, isPublic: true, closedAt: null },
    { id: '3', title: 'Staff Engagement Survey', responses: 23, questions: 12, isPublic: false, closedAt: '2024-06-01' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Surveys</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors">
          <Plus className="w-4 h-4" /> Create Survey
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {surveys.map(survey => (
          <div key={survey.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/30 transition-colors">
            <div className="flex justify-between mb-3">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${survey.closedAt ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {survey.closedAt ? 'Closed' : 'Active'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${survey.isPublic ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                {survey.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
            <h3 className="font-semibold text-white text-sm mb-4">{survey.title}</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-800 rounded-lg p-2">
                <p className="text-lg font-bold text-white">{survey.responses}</p>
                <p className="text-xs text-slate-400">Responses</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-2">
                <p className="text-lg font-bold text-white">{survey.questions}</p>
                <p className="text-xs text-slate-400">Questions</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded text-xs hover:bg-blue-600/30 transition-colors">Results</button>
              <button className="flex-1 py-1.5 bg-slate-700 text-slate-300 rounded text-xs hover:bg-slate-600 transition-colors">Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TASKS TAB
// ─────────────────────────────────────────────────────────────────────────────

function TasksTab() {
  const tasks = [
    { id: '1', title: 'Follow up with Delta Co invoice', priority: 'HIGH', status: 'TODO', dueDate: '2024-06-25' },
    { id: '2', title: 'Prepare Q3 marketing campaign brief', priority: 'MEDIUM', status: 'IN_PROGRESS', dueDate: '2024-06-30' },
    { id: '3', title: 'Review new client contracts', priority: 'URGENT', status: 'TODO', dueDate: '2024-06-22' },
    { id: '4', title: 'Update knowledge base articles', priority: 'LOW', status: 'DONE', dueDate: '2024-06-20' },
    { id: '5', title: 'Schedule team sync meeting', priority: 'MEDIUM', status: 'DONE', dueDate: '2024-06-18' },
  ];

  const priorityColor: Record<string, string> = {
    LOW: 'bg-slate-700 text-slate-300',
    MEDIUM: 'bg-blue-500/20 text-blue-400',
    HIGH: 'bg-orange-500/20 text-orange-400',
    URGENT: 'bg-red-500/20 text-red-400',
  };

  const statusIcon: Record<string, React.ReactNode> = {
    TODO: <Clock className="w-4 h-4 text-slate-400" />,
    IN_PROGRESS: <AlertCircle className="w-4 h-4 text-blue-400" />,
    DONE: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Staff Tasks</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className={`bg-slate-900 border rounded-xl px-5 py-4 flex items-center gap-4 hover:border-slate-700 transition-colors ${task.status === 'DONE' ? 'border-slate-800/50 opacity-60' : 'border-slate-800'}`}>
            <div className="flex-shrink-0">{statusIcon[task.status]}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.status === 'DONE' ? 'line-through text-slate-500' : 'text-white'}`}>{task.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">Due: {task.dueDate}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${priorityColor[task.priority]}`}>{task.priority}</span>
            <button className="p-1 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GOALS TAB
// ─────────────────────────────────────────────────────────────────────────────

function GoalsTab() {
  const goals = [
    { id: '1', title: 'Q2 Revenue Target', type: 'REVENUE', targetValue: 50000, currentValue: 38420, color: '#10b981', deadline: '2024-06-30' },
    { id: '2', title: 'New Lead Acquisitions', type: 'LEADS', targetValue: 200, currentValue: 143, color: '#6366f1', deadline: '2024-06-30' },
    { id: '3', title: 'Campaign Send Count', type: 'TASKS', targetValue: 10, currentValue: 7, color: '#f59e0b', deadline: '2024-06-30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Goals Tracking</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {goals.map(goal => {
          const pct = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
          const circumference = 2 * Math.PI * 40;
          return (
            <div key={goal.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center hover:border-slate-700 transition-colors">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={goal.color} strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - pct / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{Math.round(pct)}%</span>
                </div>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{goal.title}</h3>
              <p className="text-xs text-slate-400 mb-3">{goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Deadline: {goal.deadline}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPENSES TAB
// ─────────────────────────────────────────────────────────────────────────────

function ExpensesTab() {
  const expenses = [
    { id: '1', name: 'AWS Server Costs', category: 'Infrastructure', amount: 320, date: '2024-06-01', billable: false },
    { id: '2', name: 'Design Tool Subscription', category: 'Software', amount: 49, date: '2024-06-05', billable: false },
    { id: '3', name: 'Client Meeting Travel', category: 'Travel', amount: 185, date: '2024-06-12', billable: true },
    { id: '4', name: 'SMS API Credits', category: 'Marketing', amount: 75, date: '2024-06-15', billable: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Expenses</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors">
          <Plus className="w-4 h-4" /> Add Expense
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase">
              <th className="text-left px-6 py-3">Name</th>
              <th className="text-left px-6 py-3">Category</th>
              <th className="text-left px-6 py-3">Amount</th>
              <th className="text-left px-6 py-3">Date</th>
              <th className="text-left px-6 py-3">Billable</th>
              <th className="text-left px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td className="px-6 py-4 text-white text-sm font-medium">{exp.name}</td>
                <td className="px-6 py-4"><span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded">{exp.category}</span></td>
                <td className="px-6 py-4 text-white font-semibold">${exp.amount}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{exp.date}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded ${exp.billable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                    {exp.billable ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-1 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWSFEED TAB
// ─────────────────────────────────────────────────────────────────────────────

function NewsfeedTab() {
  const [postContent, setPostContent] = useState('');

  const posts = [
    { id: '1', authorId: 'Admin', content: '🎉 We just onboarded our 100th client! Thank you team for the incredible work this quarter. Big milestone!', likesCount: 12, createdAt: '2024-06-18 09:30' },
    { id: '2', authorId: 'Marketing', content: '📣 The new email marketing feature with GrapesJS drag-drop builder is now live! Check the Marketing panel for all new tools.', likesCount: 8, createdAt: '2024-06-17 14:15' },
    { id: '3', authorId: 'Admin', content: '📊 Q2 revenue target achieved at 76.8%. Great progress! Let\'s push to 100% by end of month.', likesCount: 5, createdAt: '2024-06-16 11:00' },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-semibold text-white">Company Newsfeed</h2>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
          placeholder="Share a company update, announcement, or milestone..."
          rows={3}
          className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
        />
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800">
          <div className="flex gap-2">
            <button className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors">📎 Attach</button>
          </div>
          <button disabled={!postContent.trim()} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-lg text-xs font-medium text-white transition-colors">
            Post Update
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                {post.authorId[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{post.authorId}</p>
                <p className="text-xs text-slate-500">{post.createdAt}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{post.content}</p>
            <div className="flex gap-4 mt-3 pt-3 border-t border-slate-800">
              <button className="text-xs text-slate-400 hover:text-emerald-400 transition-colors">❤️ {post.likesCount} Likes</button>
              <button className="text-xs text-slate-400 hover:text-white transition-colors">💬 Comment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENTS TAB
// ─────────────────────────────────────────────────────────────────────────────

function EventsTab() {
  const events = [
    { id: '1', title: 'Q3 Planning Meeting', startAt: '2024-07-01 10:00', endAt: '2024-07-01 12:00', color: '#6366f1', location: 'Conference Room A', isPublic: true },
    { id: '2', title: 'Client Demo — Acme Corp', startAt: '2024-07-03 14:00', endAt: '2024-07-03 15:00', color: '#10b981', location: 'Zoom', isPublic: false },
    { id: '3', title: 'Company Anniversary Celebration', startAt: '2024-07-15 18:00', endAt: '2024-07-15 21:00', color: '#f59e0b', location: 'Main Office', isPublic: true },
    { id: '4', title: 'Marketing Campaign Launch', startAt: '2024-07-20 09:00', endAt: '2024-07-20 10:00', color: '#ef4444', location: 'Online', isPublic: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Company Events</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-medium text-white transition-colors">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex gap-4 hover:border-slate-700 transition-colors">
            <div className="w-1 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-white text-sm">{event.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${event.isPublic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                  {event.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {event.startAt}</span>
                {event.location && <span>📍 {event.location}</span>}
              </div>
            </div>
            <button className="p-1.5 text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
