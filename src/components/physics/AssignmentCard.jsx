import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import GlassCard from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, FlaskConical, Eye, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const STATUS_CONFIG = {
  active: { label: 'Active', icon: Clock, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  completed: { label: 'Completed', icon: CheckCircle2, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  expired: { label: 'Expired', icon: XCircle, color: 'bg-red-500/20 text-red-400 border-red-500/30' }
};

export default function AssignmentCard({ assignment, submissionsCount, onViewSubmissions }) {
  const cfg = STATUS_CONFIG[assignment.status] || STATUS_CONFIG.active;
  const StatusIcon = cfg.icon;

  const dueDateObj = assignment.due_date ? new Date(assignment.due_date) : null;
  const isOverdue = dueDateObj && isPast(dueDateObj) && !isToday(dueDateObj) && assignment.status === 'active';

  const completionRate = assignment.student_emails?.length
    ? Math.round((submissionsCount / assignment.student_emails.length) * 100)
    : 0;

  return (
    <GlassCard className="p-5" hover={false}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-white truncate">{assignment.title}</h3>
            <Badge className={`text-xs border ${cfg.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {cfg.label}
            </Badge>
            {isOverdue && (
              <Badge className="text-xs border bg-amber-500/20 text-amber-400 border-amber-500/30">Overdue</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-cyan-400">
            <FlaskConical className="w-3 h-3" />
            <span>{assignment.experiment_name}</span>
            {assignment.student_group_name && (
              <span className="text-slate-500 ml-2">• {assignment.student_group_name}</span>
            )}
          </div>
        </div>
      </div>

      {assignment.instructions && (
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{assignment.instructions}</p>
      )}

      {/* Progress bar */}
      {assignment.student_emails?.length > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Submissions</span>
            <span>{submissionsCount}/{assignment.student_emails.length} ({completionRate}%)</span>
          </div>
          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {assignment.student_emails?.length || 0} students
          </span>
          {dueDateObj && (
            <span className={`flex items-center gap-1 ${isOverdue ? 'text-amber-400' : ''}`}>
              <Calendar className="w-3 h-3" />
              Due {format(dueDateObj, 'MMM d, yyyy')}
            </span>
          )}
          <span className="text-slate-600">Max: {assignment.max_score || 100} pts</span>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs"
          onClick={() => onViewSubmissions(assignment)}
        >
          <Eye className="w-3 h-3 mr-1" />
          View Submissions
        </Button>
      </div>
    </GlassCard>
  );
}
