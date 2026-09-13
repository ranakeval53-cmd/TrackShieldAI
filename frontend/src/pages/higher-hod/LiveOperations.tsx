import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { BreadcrumbContext } from '../../components/layout/BreadcrumbContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { IncidentSimulateModal } from '../../components/modals/IncidentSimulateModal';
import {
  AlertOctagon,
  Bot,
  Train,
  Clock,
  Sparkles,
  Check,
  RotateCw,
  Zap,
  Radio,
  Hammer,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const LiveOperations: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulateModalOpen, setSimulateModalOpen] = useState(false);
  const [reoptimizing, setReoptimizing] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/live/events');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleReoptimize = async (eventId: string) => {
    setReoptimizing(true);
    try {
      const res = await api.post(`/live/reoptimize-schedule?event_id=${eventId}`);
      alert(`CP-SAT Re-optimization Authorized!\n${res.data.message}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert('Failed to authorize re-optimization');
    } finally {
      setReoptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <BreadcrumbContext
        title="Live Railway Operations & Dynamic Re-planning"
        subpath="Real-Time Network Incident Response & CP-SAT Live Rescheduling"
        actionButton={
          <button
            type="button"
            onClick={() => setSimulateModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition animate-pulse"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Simulate Incident / Anomaly</span>
          </button>
        }
      />

      {/* Dynamic Re-Planning Pipeline Diagram */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Live Dynamic Re-planning Pipeline
        </h4>
        <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-700 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-slate-500">Existing Schedule</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="text-red-700 font-extrabold">Emergency Problem</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="text-blue-700">AI Re-analysis</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="text-amber-700">Conflict Detection</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="text-purple-700">CP-SAT Re-optimization</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="text-emerald-700">New Recommended Schedule</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            Higher HOD Approval
          </span>
        </div>
      </div>

      {/* Active Incidents Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>Active Operations Incidents & Emergency Interventions</span>
        </h3>

        {events.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-400">
            ✓ No active railway emergencies on network corridors.
          </div>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              className={`p-5 rounded-xl border shadow-sm transition-all ${
                ev.status === 'ACTIVE'
                  ? 'border-red-300 bg-red-50/30'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">{ev.event_id}</span>
                  <StatusBadge status={ev.severity} size="sm" />
                  <StatusBadge status={ev.status} size="sm" />
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                <h4 className="text-sm font-extrabold text-slate-900">{ev.title}</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{ev.description}</p>
                <div className="text-xs text-slate-500">
                  Corridor Section: <strong>{ev.corridor_name}</strong> • Asset: <strong>{ev.asset_name}</strong>
                </div>

                {/* AI Re-planning Recommendation Box */}
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950 uppercase tracking-wider">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <span>AI Re-planning Recommendation:</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {ev.ai_plan_suggested}
                  </p>
                </div>
              </div>

              {/* Higher HOD Decision Controls */}
              {ev.status === 'ACTIVE' && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-slate-500 italic">
                    * Never automatically publishes schedule without Higher HOD sign-off.
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={reoptimizing}
                      onClick={() => handleReoptimize(ev.event_id)}
                      className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-4 h-4" />
                      <span>{reoptimizing ? 'Re-optimizing...' : 'Authorize Re-optimization & Create Emergency Block'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <IncidentSimulateModal
        isOpen={simulateModalOpen}
        onClose={() => setSimulateModalOpen(false)}
        onSuccess={() => {
          fetchEvents();
        }}
      />
    </div>
  );
};
