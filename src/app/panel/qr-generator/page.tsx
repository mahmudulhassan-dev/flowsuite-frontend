'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode as QrIcon,
  Plus,
  Trash2,
  Copy,
  Download,
  CheckCircle,
  AlertCircle,
  Link,
  Phone,
  Mail,
  Wifi,
  MapPin,
  FileText,
  DollarSign,
  Share2,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';

interface QrRecord {
  id: string;
  name: string;
  type: string;
  config: any;
  scansCount: number;
  createdAt: string;
}

export default function QrGeneratorPage() {
  const { activeWorkspaceId } = useAuth();
  const [qrs, setQrs] = useState<QrRecord[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('URL');
  
  // Custom QR Content Configs
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiAuth, setWifiAuth] = useState('WPA');
  const [waPhone, setWaPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');

  // Styles Config
  const [fgColor, setFgColor] = useState('#2563eb'); // blue-600
  const [bgColor, setBgColor] = useState('#ffffff');
  const [margin, setMargin] = useState(10);
  const [logoUrl, setLogoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchQrs = async () => {
    try {
      const res = await fetch('/api/v1/qr', {
        headers: {
          'x-workspace-id': activeWorkspaceId || ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setQrs(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQrs();
  }, [activeWorkspaceId]);

  // Generate QR content string based on type
  const getQrContent = () => {
    switch (type) {
      case 'URL': return url;
      case 'PHONE': return `tel:${phone}`;
      case 'EMAIL': return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`;
      case 'WIFI': return `WIFI:S:${wifiSsid};T:${wifiAuth};P:${wifiPassword};;`;
      case 'WHATSAPP': return `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`;
      default: return text || 'FlowSuite QR';
    }
  };

  // Draw QR code to canvas with custom colors & logo overlays
  const drawQrCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const qrData = getQrContent();
    const qrServerUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=${margin}&data=${encodeURIComponent(qrData)}`;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = qrServerUrl;

    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, 300, 300);

      // Draw base QR code
      ctx.drawImage(img, 0, 0, 300, 300);

      // Apply custom colors (composite operations)
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = fgColor;
      ctx.fillRect(0, 0, 300, 300);

      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 300, 300);

      // Reset composite operation for logo overlay
      ctx.globalCompositeOperation = 'source-over';

      // Draw custom logo in center if provided
      if (logoUrl) {
        const logo = new Image();
        logo.crossOrigin = 'anonymous';
        logo.src = logoUrl;
        logo.onload = () => {
          const logoSize = 60;
          const x = (300 - logoSize) / 2;
          const y = (300 - logoSize) / 2;

          // Draw background rounded box for logo
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.roundRect(x - 5, y - 5, logoSize + 10, logoSize + 10, 10);
          ctx.fill();

          ctx.drawImage(logo, x, y, logoSize, logoSize);
        };
      }
    };
  };

  // Redraw canvas on config changes
  useEffect(() => {
    drawQrCanvas();
  }, [type, url, text, phone, email, emailSubject, wifiSsid, wifiPassword, wifiAuth, waPhone, waMessage, fgColor, bgColor, margin, logoUrl]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const config = { url, text, phone, email, emailSubject, wifiSsid, wifiPassword, wifiAuth, waPhone, waMessage, fgColor, bgColor, margin, logoUrl };
      const res = await fetch('/api/v1/qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': activeWorkspaceId || ''
        },
        body: JSON.stringify({ name, type, config })
      });
      const data = await res.json();

      if (data.success) {
        setSuccess('QR Code saved successfully!');
        setName('');
        fetchQrs();
      } else {
        setError(data.error || 'Failed to save QR Code');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this QR code config?')) return;
    try {
      const res = await fetch(`/api/v1/qr/${id}`, {
        method: 'DELETE',
        headers: {
          'x-workspace-id': activeWorkspaceId || ''
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchQrs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name || 'flowsuite-qr'}.png`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6 text-slate-100 min-h-screen bg-slate-950">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-900">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <QrIcon className="w-6 h-6 text-purple-500 animate-bounce" /> QR Code Generator
          </h1>
          <p className="text-xs text-slate-400">Generate static & dynamic QR codes, customize gradients, branding, and track scanning history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Creator & Customizer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-400" /> Create QR Code Config
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

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">QR Code Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WiFi Code / Website QR"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">QR Template Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                  >
                    <option value="URL">Website Link (URL)</option>
                    <option value="TEXT">Plain Text</option>
                    <option value="PHONE">Phone Dialer</option>
                    <option value="EMAIL">Email Form</option>
                    <option value="WIFI">WiFi Network Access</option>
                    <option value="WHATSAPP">WhatsApp Link</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Inputs based on type */}
              <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-850">
                {type === 'URL' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400">Target URL</label>
                    <input
                      type="url"
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                    />
                  </div>
                )}

                {type === 'TEXT' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400">Plain Text Message</label>
                    <textarea
                      required
                      rows={3}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter custom text notes..."
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                    />
                  </div>
                )}

                {type === 'PHONE' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+8801XXXXXXXXX"
                      className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                    />
                  </div>
                )}

                {type === 'EMAIL' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Receiver Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="support@flowsuite.com"
                        className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Subject (Optional)</label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Inquiry"
                        className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                      />
                    </div>
                  </div>
                )}

                {type === 'WIFI' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">SSID Name</label>
                      <input
                        type="text"
                        required
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        placeholder="MyHomeWiFi"
                        className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Password</label>
                      <input
                        type="password"
                        required
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="WiFiPassword123"
                        className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Auth Network</label>
                      <select
                        value={wifiAuth}
                        onChange={(e) => setWifiAuth(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">No password (Open)</option>
                      </select>
                    </div>
                  </div>
                )}

                {type === 'WHATSAPP' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Phone Number (intl)</label>
                      <input
                        type="tel"
                        required
                        value={waPhone}
                        onChange={(e) => setWaPhone(e.target.value)}
                        placeholder="8801XXXXXXXXX"
                        className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-400">Pre-fill Message</label>
                      <input
                        type="text"
                        value={waMessage}
                        onChange={(e) => setWaMessage(e.target.value)}
                        placeholder="Hello, I want info"
                        className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Styles customizer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <Palette className="w-3 h-3 text-purple-400" /> Foreground Color
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded border-none outline-none cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-semibold text-slate-300">{fgColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <Palette className="w-3 h-3 text-slate-400" /> Background Color
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded border-none outline-none cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-semibold text-slate-300">{bgColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3 text-blue-400" /> Overlay Logo URL
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://.../my-logo.png"
                    className="w-full bg-slate-950 border border-slate-850 text-xs p-2 rounded-xl outline-none focus:border-purple-500 text-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold p-3 rounded-xl text-xs transition"
              >
                {loading ? 'Saving...' : 'Save QR Configuration'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Canvas Live Preview & List */}
        <div className="space-y-6">
          {/* Live Preview Card */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="font-bold text-white text-xs self-start">Live QR Code Rendering</h3>
            
            <div className="p-3 bg-white rounded-3xl shadow-xl border border-slate-800">
              <canvas ref={canvasRef} width={300} height={300} className="w-48 h-48 rounded" />
            </div>

            <p className="text-[10px] text-slate-500">
              Rendered dynamic pixels with active foreground/background parameters.
            </p>

            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold p-3 rounded-xl text-xs transition border border-slate-700"
            >
              <Download className="w-4 h-4" /> Download PNG Image
            </button>
          </div>

          {/* Saved Configurations List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/40">
              <h3 className="font-bold text-white text-xs">Saved QR Configurations</h3>
            </div>
            {qrs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No configurations saved yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {qrs.map((qr) => (
                  <div key={qr.id} className="p-3 flex justify-between items-center gap-4 text-[11px]">
                    <div>
                      <span className="font-bold text-slate-200 block">{qr.name}</span>
                      <span className="text-[9px] font-semibold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {qr.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setName(qr.name);
                          setType(qr.type);
                          if (qr.config.url) setUrl(qr.config.url);
                          if (qr.config.text) setText(qr.config.text);
                          if (qr.config.phone) setPhone(qr.config.phone);
                          if (qr.config.email) setEmail(qr.config.email);
                          if (qr.config.emailSubject) setEmailSubject(qr.config.emailSubject);
                          if (qr.config.wifiSsid) setWifiSsid(qr.config.wifiSsid);
                          if (qr.config.wifiPassword) setWifiPassword(qr.config.wifiPassword);
                          if (qr.config.wifiAuth) setWifiAuth(qr.config.wifiAuth);
                          if (qr.config.waPhone) setWaPhone(qr.config.waPhone);
                          if (qr.config.waMessage) setWaMessage(qr.config.waMessage);
                          if (qr.config.fgColor) setFgColor(qr.config.fgColor);
                          if (qr.config.bgColor) setBgColor(qr.config.bgColor);
                          if (qr.config.logoUrl) setLogoUrl(qr.config.logoUrl);
                        }}
                        className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded"
                        title="Load configuration"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(qr.id)}
                        className="p-1.5 bg-slate-800 text-red-400 hover:bg-red-500/10 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
