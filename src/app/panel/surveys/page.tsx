'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText, Plus, Search, RefreshCw, Trash2, Eye, Share2, 
  Check, X, Award, BarChart3, Users, HelpCircle, ArrowRight,
  Shield, CheckSquare, MessageSquare, AlertCircle, Copy
} from 'lucide-react';
import { api } from '../../../lib/api';

interface Survey {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  createdAt: string;
  _count?: {
    responses: number;
    questions: number;
  };
}

interface SurveyQuestion {
  id: string;
  surveyId: string;
  questionText: string;
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'RATING';
  options: string[];
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: any;
  respondentEmail: string | null;
  createdAt: string;
  ipAddress: string | null;
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Creation State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  
  // Custom simple questions list inside creation modal
  const [questions, setQuestions] = useState<{ text: string; type: 'TEXT' | 'MULTIPLE_CHOICE' | 'RATING' }[]>([
    { text: 'How satisfied are you with our SaaS workspace features?', type: 'RATING' },
    { text: 'What is your primary use case for FlowSuite?', type: 'TEXT' }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState<'TEXT' | 'MULTIPLE_CHOICE' | 'RATING'>('TEXT');

  // Response viewing State
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);

  // Share link
  const [shareSurvey, setShareSurvey] = useState<Survey | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      const data = await api.get<Survey[]>('/api/v1/knowledge/surveys');
      setSurveys(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = async (surveyId: string) => {
    try {
      setLoadingResponses(true);
      const data = await api.get<SurveyResponse[]>(`/api/v1/knowledge/surveys/${surveyId}/responses`);
      setResponses(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResponses(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const handleCreateSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.post('/api/v1/knowledge/surveys', {
        title,
        description: desc || null,
        isPublic,
        questions: questions.map((q, idx) => ({
          questionText: q.text,
          type: q.type,
          order: idx + 1,
          options: q.type === 'MULTIPLE_CHOICE' ? ['Yes', 'No', 'Maybe'] : []
        }))
      });
      
      setTitle('');
      setDesc('');
      setIsPublic(true);
      setQuestions([
        { text: 'How satisfied are you with our SaaS workspace features?', type: 'RATING' },
        { text: 'What is your primary use case for FlowSuite?', type: 'TEXT' }
      ]);
      setShowCreateModal(false);
      loadSurveys();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSurvey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this survey and all responses?')) return;
    try {
      await api.delete(`/api/v1/knowledge/surveys/${id}`);
      if (activeSurvey?.id === id) {
        setActiveSurvey(null);
        setResponses([]);
      }
      loadSurveys();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    setQuestions(prev => [...prev, { text: newQuestionText, type: newQuestionType }]);
    setNewQuestionText('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const filteredSurveys = surveys.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    (s.description && s.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-slate-100 min-h-screen bg-slate-950 p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-[32px] border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              Customer Surveys & NPS Feedbacks
              <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono font-bold">Smart Poll</span>
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Collect client NPS score responses, build custom surveys, and analyze answers.</p>
          </div>
        </div>
        <button
          onClick={loadSurveys}
          className="flex items-center gap-2 bg-slate-900 border border-slate-850 text-slate-400 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Surveys
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Survey list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 border border-slate-850 rounded-2xl">
            <div className="relative flex-1 max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text" placeholder="Search surveys..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-650 hover:bg-purple-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" /> Create Survey Form
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full py-10 flex justify-center"><RefreshCw className="w-7 h-7 text-purple-500 animate-spin" /></div>
            ) : filteredSurveys.length === 0 ? (
              <div className="col-span-full border border-slate-850 bg-slate-900/10 rounded-2xl py-12 text-center text-slate-500 text-xs">
                No active survey campaigns.
              </div>
            ) : (
              filteredSurveys.map((sv) => (
                <div 
                  key={sv.id}
                  className={`bg-slate-900/60 border p-5 rounded-3xl space-y-4 flex flex-col justify-between hover:border-purple-500/30 transition-all ${
                    activeSurvey?.id === sv.id ? 'border-purple-600 ring-1 ring-purple-600/35 bg-purple-950/5' : 'border-slate-850'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-bold bg-slate-950 px-2.5 py-0.5 rounded border border-slate-850">
                        📋 {sv._count?.questions || 0} Questions
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${sv.isPublic ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        {sv.isPublic ? 'Public' : 'Closed'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-white text-sm leading-snug">{sv.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{sv.description || 'No description provided.'}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-850 pt-3.5">
                    <span className="text-[10px] text-slate-500 font-bold font-mono">🗳️ {sv._count?.responses || 0} responses</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setActiveSurvey(sv);
                          loadResponses(sv.id);
                        }}
                        className="bg-slate-950 hover:bg-slate-900 border border-slate-850 text-indigo-400 px-3 py-1.5 rounded-xl text-[10px] font-extrabold transition"
                      >
                        Responses
                      </button>
                      <button
                        onClick={() => setShareSurvey(sv)}
                        className="bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 p-1.5 rounded-xl transition"
                        title="Share Survey Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSurvey(sv.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-1.5 rounded-xl"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Responses viewer */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="border-b border-slate-850 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-purple-400" /> Response Analytics Hub
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">{activeSurvey ? `Viewing responses for: ${activeSurvey.title}` : 'Select a survey to view client answers'}</p>
          </div>

          {!activeSurvey ? (
            <div className="py-20 text-center text-slate-600 text-xs">
              <Users className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <span>Select response button on the left cards to load survey analytics list.</span>
            </div>
          ) : loadingResponses ? (
            <div className="py-10 flex justify-center"><RefreshCw className="w-7 h-7 text-purple-500 animate-spin" /></div>
          ) : responses.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No client responses captured yet for this survey.
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {responses.map((resp, idx) => (
                <div key={resp.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span className="font-bold text-white">Respondent #{responses.length - idx}</span>
                    <span>{new Date(resp.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {resp.respondentEmail && (
                    <p className="text-[10px] text-purple-400 font-mono">Email: {resp.respondentEmail}</p>
                  )}

                  {/* Answers render */}
                  <div className="space-y-1 pt-1 border-t border-slate-900 text-[11px]">
                    {Object.entries(resp.answers || {}).map(([qKey, answer]: any) => (
                      <div key={qKey} className="space-y-0.5">
                        <p className="text-slate-500 font-bold">Question: {qKey}</p>
                        <p className="text-slate-300 pl-2">Answer: <span className="text-white font-medium">{String(answer)}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* CREATE SURVEY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h3 className="text-base font-extrabold text-white">Create Survey Form</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleCreateSurvey} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">Survey Title *</label>
                  <input
                    type="text" required placeholder="e.g. Q3 Customer Satisfaction Poll" value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold block">Status Visibility</label>
                  <select
                    value={isPublic ? 'public' : 'private'} onChange={e => setIsPublic(e.target.value === 'public')}
                    className="w-full bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="public">🌐 Public Link access</option>
                    <option value="private">🔒 Closed / Internal only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold block">Description / Invite Message</label>
                <input
                  type="text" placeholder="Please take 1 minute to share feedback." value={desc} onChange={e => setDesc(e.target.value)}
                  className="w-full mt-1 bg-slate-955 border border-slate-750 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Questions authoring list */}
              <div className="border-t border-slate-850 pt-3.5 space-y-3">
                <h4 className="text-xs font-bold text-purple-400">❓ Survey Questions ({questions.length})</h4>
                
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {questions.map((q, idx) => (
                    <div key={idx} className="bg-slate-955 p-2.5 rounded-lg border border-slate-850 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white">{q.text}</p>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold mt-1 inline-block">{q.type}</span>
                      </div>
                      <button
                        type="button" onClick={() => handleRemoveQuestion(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add dynamic question creator row */}
                <div className="bg-slate-955 p-3 rounded-xl border border-slate-850 flex flex-col md:flex-row gap-2">
                  <input
                    type="text" placeholder="Add custom question text..." value={newQuestionText} onChange={e => setNewQuestionText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-750 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <select
                    value={newQuestionType} onChange={e => setNewQuestionType(e.target.value as any)}
                    className="bg-slate-900 border border-slate-750 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    <option value="TEXT">Short Answer Text</option>
                    <option value="RATING">Rating scale (1-5)</option>
                    <option value="MULTIPLE_CHOICE">Yes/No MCQ option</option>
                  </select>
                  <button
                    type="button" onClick={handleAddQuestion}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
                  >
                    + Add Q
                  </button>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-850">
                <button type="button" onClick={() => setShowCreateModal(false)} className="bg-slate-800 text-slate-300 font-bold px-4 py-2.5 rounded-xl text-xs">Cancel</button>
                <button type="submit" className="bg-purple-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-purple-600/25">Deploy Survey</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {shareSurvey && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 w-full max-w-lg space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5"><Share2 className="w-4 h-4" /> Share Poll Link</h3>
              <button onClick={() => setShareSurvey(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-slate-400">Share this link directly to client chats or dispatch in broadcasts to fetch feedback responses.</p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between font-mono text-[10px] text-white">
              <span className="truncate">https://flowsuite.amanasuite.com/api/v1/public/surveys/{shareSurvey.id}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://flowsuite.amanasuite.com/api/v1/public/surveys/${shareSurvey.id}`);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="text-indigo-400 hover:text-white"
              >
                {copiedLink ? 'Copied!' : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setShareSurvey(null)} className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
