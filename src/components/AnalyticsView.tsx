import React from 'react';
import { 
  BarChart2, 
  Flame, 
  Target, 
  Clock, 
  Award, 
  TrendingUp, 
  Download, 
  Zap, 
  CheckCircle,
  Brain,
  ShieldCheck
} from 'lucide-react';
import { UserAccount } from '../types';

interface AnalyticsViewProps {
  currentUser: UserAccount;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ currentUser }) => {
  const competencies = [
    { subject: 'Hyperplane Geometry & Affine Separability', mastery: 94, level: 'Mastered' },
    { subject: 'Non-Linear Activation Mechanics (ReLU, GELU)', mastery: 88, level: 'Proficient' },
    { subject: 'Loss Landscape Traversal & Gradient Descent', mastery: 82, level: 'Proficient' },
    { subject: 'Multivariate Chain Rule & Backpropagation', mastery: 74, level: 'Reinforcing' },
    { subject: 'Regularization & Generalization Invariants', mastery: 79, level: 'Proficient' },
    { subject: 'Bayesian Probability & Base Rate Fallacy', mastery: 90, level: 'Mastered' },
  ];

  const handleExportReport = () => {
    const report = `=====================================================
SYNAPSEAI COGNITIVE ANALYTICS REPORT
=====================================================
Learner ID:       ${currentUser.id}
Learner Name:     ${currentUser.name}
Institution:      ${currentUser.institution}
Active Subject:   ${currentUser.targetTopic}
Learning Style:   ${currentUser.learningStyle}
Knowledge Level:  ${currentUser.knowledgeLevel}
Date Generated:   ${new Date().toLocaleString()}

PERFORMANCE METRICS
-----------------------------------------------------
Average Mastery Score:  ${currentUser.averageMastery}%
Active Study Streak:    ${currentUser.streakDays} consecutive days
Total Study Hours:      ${currentUser.studyHours} hours
Concepts Mastered:      ${currentUser.conceptsMastered} concepts
Diagnostic Quizzes:     ${currentUser.quizzesTaken} assessments

COMPETENCY BREAKDOWN
-----------------------------------------------------
${competencies.map((c) => `- ${c.subject.padEnd(46)}: ${c.mastery}% [${c.level}]`).join('\n')}

PEDAGOGICAL RECOMMENDATION
-----------------------------------------------------
Focus next Socratic deep-dive on multivariate backpropagation dynamics.
=====================================================`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_report_${currentUser.id.replace(/[^a-z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="text-xs font-mono text-amber-400 mb-0.5">
            PERSONALIZED COGNITIVE TELEMETRY · {currentUser.id}
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Learning Analytics & Skill Matrix
          </h2>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shrink-0 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* 4 Primary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Average Mastery</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
            {currentUser.averageMastery}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Top percentile for {currentUser.knowledgeLevel}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
            {currentUser.streakDays} <span className="text-sm font-sans font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Current active retention run
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Hours</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono tabular-nums">
            {currentUser.studyHours} <span className="text-sm font-sans font-normal text-slate-400">hrs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Logged across sessions
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Concepts Mastered</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono tabular-nums">
            {currentUser.conceptsMastered}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Verified by diagnostic quizzes
          </div>
        </div>
      </div>

      {/* Competencies Progress Bars & Cognitive Style Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Competencies Column (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Competency Breakdown</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{currentUser.targetTopic}</span>
          </div>

          <div className="space-y-4">
            {competencies.map((c, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{c.subject}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400 text-[11px]">{c.level}</span>
                    <span className="text-white font-bold">{c.mastery}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      c.mastery >= 90
                        ? 'bg-emerald-400'
                        : c.mastery >= 80
                        ? 'bg-amber-400'
                        : 'bg-cyan-400'
                    }`}
                    style={{ width: `${c.mastery}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cognitive Modality & Socratic Alignment (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Cognitive Style Alignment</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Modality: {currentUser.learningStyle}</span>
                  <span className="font-mono text-amber-300 font-semibold">92% Match</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-amber-400 rounded-full w-[92%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Socratic Deduction Retention</span>
                  <span className="font-mono text-cyan-300 font-semibold">88%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-cyan-400 rounded-full w-[88%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Misconception Resolution Rate</span>
                  <span className="font-mono text-emerald-300 font-semibold">95%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-400 rounded-full w-[95%]" />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 mt-2">
              <span className="font-semibold text-amber-300 block mb-0.5">Tutor Calibration Note:</span>
              Your responses demonstrate rapid intuitive synthesis with physical metaphors. The tutor will emphasize real-world parallels in next sessions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
