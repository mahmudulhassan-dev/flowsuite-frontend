'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, Users,
  FileText, ShoppingCart, RefreshCw, ArrowUpRight, Target, PieChart
} from 'lucide-react';
import { api } from '../../../lib/api';

interface SalesReport {
  totalRevenue: number; totalInvoices: number; paidInvoices: number;
  unpaidInvoices: number; overdueAmount: number;
  topCustomers: { name: string; total: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}
interface ExpenseReport {
  totalExpenses: number;
  byCategory: { category: string; total: number }[];
  recent: { name: string; amount: number; currency: string; date: string; category: string }[];
}
interface LeadsReport {
  totalLeads: number;
  byStage: { stage: string; count: number }[];
  conversionRate: number; newThisMonth: number;
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'expenses' | 'leads'>('sales');
  const [salesData, setSalesData] = useState<SalesReport | null>(null);
  const [expenseData, setExpenseData] = useState<ExpenseReport | null>(null);
  const [leadsData, setLeadsData] = useState<LeadsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => { loadReport(); }, [activeTab, dateRange]);

  const loadReport = async () => {
    setLoading(true);
    try {
      if (activeTab === 'sales') {
        const data = await api.get<SalesReport>(`/api/v1/reports/sales?days=${dateRange}`);
        setSalesData(data);
      } else if (activeTab === 'expenses') {
        const data = await api.get<ExpenseReport>(`/api/v1/reports/expenses?days=${dateRange}`);
        setExpenseData(data);
      } else {
        const data = await api.get<LeadsReport>(`/api/v1/reports/leads?days=${dateRange}`);
        setLeadsData(data);
      }
    } catch (err) { console.error('Failed to load report:', err); }
    finally { setLoading(false); }
  };

  const stageColors: Record<string, string> = {
    NEW_LEAD: 'bg-blue-500', PROSPECT: 'bg-purple-500', QUALIFIED: 'bg-amber-500',
    CUSTOMER: 'bg-emerald-500', CHURNED: 'bg-red-500',
  };
  const catColors = ['bg-purple-500','bg-blue-500','bg-emerald-500','bg-amber-500','bg-red-500','bg-pink-500'];

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30"><BarChart3 className="w-6 h-6" /></div>
          <div>
            <h1 className="text-lg font-bold text-white">Business Reports</h1>
            <p className="text-slate-400 text-xs">Sales · Expenses · Lead Funnel Analytics</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
            <option value="7">Last 7 days</option><option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option><option value="365">Last year</option>
          </select>
          {(['sales','expenses','leads'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab===tab?'bg-blue-600 text-white':'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'}`}>
              {tab==='sales'?'💰 Sales':tab==='expenses'?'🧾 Expenses':'🎯 Leads'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 text-blue-500 animate-spin" /></div>
      ) : (
        <>
          {activeTab==='sales' && salesData && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {label:'Total Revenue',value:`$${salesData.totalRevenue.toLocaleString()}`,icon:DollarSign,c:'text-emerald-400',bg:'bg-emerald-500/10 border-emerald-500/30'},
                  {label:'Total Invoices',value:salesData.totalInvoices,icon:FileText,c:'text-blue-400',bg:'bg-blue-500/10 border-blue-500/30'},
                  {label:'Paid Invoices',value:salesData.paidInvoices,icon:TrendingUp,c:'text-purple-400',bg:'bg-purple-500/10 border-purple-500/30'},
                  {label:'Overdue Amount',value:`$${salesData.overdueAmount.toLocaleString()}`,icon:TrendingDown,c:'text-red-400',bg:'bg-red-500/10 border-red-500/30'},
                ].map(k=>(
                  <div key={k.label} className={`${k.bg} border rounded-2xl p-4 space-y-2`}>
                    <k.icon className={`w-4 h-4 ${k.c}`} />
                    <div className={`text-xl font-black ${k.c}`}>{k.value}</div>
                    <div className="text-slate-400 text-[11px]">{k.label}</div>
                  </div>
                ))}
              </div>
              {salesData.monthlyRevenue.length>0 && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400"/> Monthly Revenue</h3>
                  <div className="flex items-end gap-2 h-40">
                    {salesData.monthlyRevenue.map((m,i)=>{
                      const max=Math.max(...salesData.monthlyRevenue.map(x=>x.revenue),1);
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          <span className="text-[9px] text-slate-500 opacity-0 group-hover:opacity-100">${m.revenue.toLocaleString()}</span>
                          <div className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-purple-500 transition-all" style={{height:`${Math.max((m.revenue/max)*100,3)}%`}}/>
                          <span className="text-[9px] text-slate-500">{m.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {salesData.topCustomers.length>0 && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-purple-400"/> Top Customers</h3>
                  {salesData.topCustomers.map((c,i)=>(
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 w-4">{i+1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-white font-semibold">{c.name}</span>
                          <span className="text-xs text-emerald-400">${c.total.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full" style={{width:`${(c.total/Math.max(salesData.topCustomers[0]?.total,1))*100}%`}}/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab==='expenses' && expenseData && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
                  <ShoppingCart className="w-8 h-8 text-red-400"/>
                  <div className="text-3xl font-black text-red-400">${expenseData.totalExpenses.toLocaleString()}</div>
                  <div className="text-slate-400 text-xs">Total Expenses</div>
                </div>
                <div className="col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2"><PieChart className="w-4 h-4 text-amber-400"/> By Category</h3>
                  {expenseData.byCategory.map((cat,i)=>{
                    const pct=expenseData.totalExpenses>0?(cat.total/expenseData.totalExpenses)*100:0;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${catColors[i%catColors.length]}`}/>
                        <div className="flex-1">
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[11px] text-white">{cat.category||'Other'}</span>
                            <span className="text-[11px] text-slate-400">${cat.total.toLocaleString()} ({pct.toFixed(1)}%)</span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full">
                            <div className={`h-full ${catColors[i%catColors.length]} rounded-full`} style={{width:`${pct}%`}}/>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800"><h3 className="text-sm font-bold text-white">Recent Expenses</h3></div>
                <div className="divide-y divide-slate-800/60">
                  {expenseData.recent.length===0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">No expenses in this period</div>
                  ) : expenseData.recent.map((e,i)=>(
                    <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-800/30">
                      <div>
                        <p className="text-xs font-semibold text-white">{e.name}</p>
                        <p className="text-[10px] text-slate-500">{e.category} · {new Date(e.date).toLocaleDateString()}</p>
                      </div>
                      <span className="text-sm font-bold text-red-400">{e.currency} {e.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab==='leads' && leadsData && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {label:'Total Leads',value:leadsData.totalLeads,icon:Target,c:'text-blue-400',bg:'bg-blue-500/10 border-blue-500/30'},
                  {label:'New This Month',value:leadsData.newThisMonth,icon:Users,c:'text-purple-400',bg:'bg-purple-500/10 border-purple-500/30'},
                  {label:'Conversion Rate',value:`${leadsData.conversionRate.toFixed(1)}%`,icon:TrendingUp,c:'text-emerald-400',bg:'bg-emerald-500/10 border-emerald-500/30'},
                  {label:'Customers',value:leadsData.byStage.find(s=>s.stage==='CUSTOMER')?.count??0,icon:ArrowUpRight,c:'text-amber-400',bg:'bg-amber-500/10 border-amber-500/30'},
                ].map(k=>(
                  <div key={k.label} className={`${k.bg} border rounded-2xl p-4 space-y-2`}>
                    <k.icon className={`w-4 h-4 ${k.c}`}/>
                    <div className={`text-2xl font-black ${k.c}`}>{k.value}</div>
                    <div className="text-slate-400 text-[11px]">{k.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">Lead Funnel</h3>
                {leadsData.byStage.map((stage,i)=>{
                  const max=Math.max(...leadsData.byStage.map(s=>s.count),1);
                  const pct=(stage.count/max)*100;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{stage.stage.replace('_',' ')}</span>
                        <span className="text-slate-400">{stage.count} leads</span>
                      </div>
                      <div className="h-6 bg-slate-800 rounded-lg overflow-hidden">
                        <div className={`h-full ${stageColors[stage.stage]||'bg-slate-500'} rounded-lg flex items-center justify-end pr-2 text-[10px] text-white font-bold`} style={{width:`${Math.max(pct,5)}%`}}>
                          {pct.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
