'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Plus,
  Scissors,
  ExternalLink,
  Trash2,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertCircle,
  Copy,
  Download,
  FileText,
  MapPin,
  Laptop,
  Chrome
} from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';

interface ShortLink {
  id: string;
  originalUrl: string;
  shortSlug: string;
  clicksCount: number;
  createdAt: string;
}

export default function ShortenerPage() {
  const { activeWorkspaceId } = useAuth();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedSlug, setCopiedSlug] = useState('');

  // Selected link for detailed metrics
  const [selectedLink, setSelectedLink] = useState<ShortLink | null>(null);
  const [metrics, setMetrics] = useState<any>(null);

  // Fetch list of links
  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/v1/links', {
        headers: {
          'x-workspace-id': activeWorkspaceId || ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setLinks(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [activeWorkspaceId]);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/v1/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': activeWorkspaceId || ''
        },
        body: JSON.stringify({ originalUrl, customSlug })
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('Short URL created successfully!');
        setOriginalUrl('');
        setCustomSlug('');
        fetchLinks();
      } else {
        setError(data.error || 'Failed to shorten URL');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this short link?')) return;
    try {
      const res = await fetch(`/api/v1/links/${id}`, {
        method: 'DELETE',
        headers: {
          'x-workspace-id': activeWorkspaceId || ''
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchLinks();
        if (selectedLink?.id === id) {
          setSelectedLink(null);
          setMetrics(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async (link: ShortLink) => {
    setSelectedLink(link);
    setMetrics(null);
    try {
      const res = await fetch(`/api/v1/links/${link.id}/analytics`, {
        headers: {
          'x-workspace-id': activeWorkspaceId || ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setMetrics(data.data.metrics);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, slug: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(''), 2000);
  };

  const backendHost = 'https://flowsuite.amanasuite.com'; // Redirect resolves at public backend API port

  return (
    <div className="p-6 space-y-6 text-slate-100 min-h-screen bg-slate-950">
      {/* Page Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Scissors className="w-6 h-6 text-blue-500 animate-pulse" /> URL Shortener & File Links
          </h1>
          <p className="text-xs text-slate-400">Shorten custom destination paths, share dynamic files, and analyze traffic sources.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create Link Form & List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Form */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Shorten a Destination Link
            </h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {success}
              </div>
            )}

            <form onSubmit={handleShorten} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Destination URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/very/long/destination/url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-blue-500 transition text-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Custom Slug (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. promo-aug"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-blue-500 transition text-slate-200"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="md:col-span-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-95 text-white font-bold p-3 rounded-xl text-xs transition"
              >
                {loading ? 'Shortening...' : 'Generate Short Link'}
              </button>
            </form>
          </div>

          {/* Links List Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="font-bold text-white text-xs">Shortened Redirect Links</h3>
            </div>
            {links.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No short links created in this workspace yet. Generate your first above!
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {links.map((link) => (
                  <div key={link.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-blue-400">/{link.shortSlug}</span>
                        <button
                          onClick={() => copyToClipboard(`${backendHost}/s/${link.shortSlug}`, link.shortSlug)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                          title="Copy short link"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {copiedSlug === link.shortSlug && (
                          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Copied</span>
                        )}
                      </div>
                      <p className="text-slate-500 truncate max-w-sm" title={link.originalUrl}>
                        {link.originalUrl}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Total Clicks</span>
                        <span className="font-bold text-white text-sm">{link.clicksCount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fetchAnalytics(link)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl transition"
                          title="View Analytics"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="p-2 bg-slate-800/60 hover:bg-red-500/20 text-red-400 rounded-xl transition"
                          title="Delete Link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Analytics Panel */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-6">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" /> Link Performance Audit
          </h3>

          {!selectedLink ? (
            <div className="text-center text-slate-500 py-16 text-xs">
              Select a short link from the list to populate visitor metrics and geolocations.
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Selected Link</span>
                <span className="font-black text-blue-400">/{selectedLink.shortSlug}</span>
                <span className="text-[10px] text-slate-400 block mt-1 truncate">{selectedLink.originalUrl}</span>
              </div>

              {!metrics ? (
                <div className="text-center text-slate-500 py-8 text-xs">
                  Loading click telemetry data...
                </div>
              ) : (
                <div className="space-y-6 text-xs">
                  {/* Top Countries */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-200 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-400" /> Top Countries
                    </h4>
                    {Object.keys(metrics.countries).length === 0 ? (
                      <p className="text-slate-500 text-[10px]">No geographic data available yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {Object.entries(metrics.countries).map(([country, count]: any) => (
                          <div key={country} className="space-y-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-slate-300 font-semibold">{country}</span>
                              <span className="text-white font-bold">{count} clicks</span>
                            </div>
                            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${(count / selectedLink.clicksCount) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Devices & Browsers */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Browsers */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Chrome className="w-3.5 h-3.5 text-purple-400" /> Browsers
                      </h4>
                      {Object.entries(metrics.browsers).map(([browser, count]: any) => (
                        <div key={browser} className="flex justify-between text-[10px] border-b border-slate-800/60 pb-1">
                          <span className="text-slate-400">{browser}</span>
                          <span className="text-white font-bold">{count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Devices */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Laptop className="w-3.5 h-3.5 text-amber-400" /> Devices
                      </h4>
                      {Object.entries(metrics.devices).map(([device, count]: any) => (
                        <div key={device} className="flex justify-between text-[10px] border-b border-slate-800/60 pb-1">
                          <span className="text-slate-400">{device}</span>
                          <span className="text-white font-bold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline Logs */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" /> Click Timeline Log
                    </h4>
                    {Object.entries(metrics.timeline).map(([date, count]: any) => (
                      <div key={date} className="flex justify-between text-[10px] border-b border-slate-800/60 pb-1">
                        <span className="text-slate-400">{date}</span>
                        <span className="text-slate-200 font-bold">{count} hits</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
