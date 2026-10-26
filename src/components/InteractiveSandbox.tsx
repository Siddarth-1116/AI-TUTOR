import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, HelpCircle, ArrowRight, Activity, Zap } from 'lucide-react';

interface InteractiveSandboxProps {
  onAskTutorAboutConcept?: (conceptQuestion: string) => void;
}

export const InteractiveSandbox: React.FC<InteractiveSandboxProps> = ({
  onAskTutorAboutConcept,
}) => {
  const [activeSim, setActiveSim] = useState<'neural' | 'bayes'>('neural');

  // Neural Sandbox States
  const [x1, setX1] = useState<number>(0.8);
  const [x2, setX2] = useState<number>(-0.4);
  const [w1, setW1] = useState<number>(1.5);
  const [w2, setW2] = useState<number>(-2.0);
  const [bias, setBias] = useState<number>(0.3);
  const [activationFn, setActivationFn] = useState<'relu' | 'sigmoid' | 'tanh'>('sigmoid');
  const [isPulsing, setIsPulsing] = useState<boolean>(true);
  const [pulsePhase, setPulsePhase] = useState<number>(0);

  // Animation pulse loop for signal flow
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setPulsePhase((prev) => (prev + 0.03) % 1);
      animId = requestAnimationFrame(animate);
    };
    if (isPulsing) {
      animId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPulsing]);

  // Math calculations for Neural Network
  const linearSum = x1 * w1 + x2 * w2 + bias;
  let activationOutput = 0;
  if (activationFn === 'sigmoid') {
    activationOutput = 1 / (1 + Math.exp(-linearSum));
  } else if (activationFn === 'relu') {
    activationOutput = Math.max(0, linearSum);
  } else if (activationFn === 'tanh') {
    activationOutput = Math.tanh(linearSum);
  }

  // Bayes Sandbox States
  const [prior, setPrior] = useState<number>(0.01); // 1%
  const [sensitivity, setSensitivity] = useState<number>(0.95); // True positive 95%
  const [falsePositive, setFalsePositive] = useState<number>(0.05); // False positive 5%

  // Bayes calculation
  const pEvidence = prior * sensitivity + (1 - prior) * falsePositive;
  const posterior = (prior * sensitivity) / (pEvidence || 0.0001);

  // Canvas Decision Boundary 2D plot
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (activeSim !== 'neural') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Draw coordinate grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // axes
    const midX = width / 2;
    const midY = height / 2;

    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, height);
    ctx.stroke();

    // Decision Boundary: w1 * x1 + w2 * x2 + bias = 0  => x2 = (-w1 * x1 - bias) / w2
    if (Math.abs(w2) > 0.001) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const scale = 40; // pixels per unit
      for (let px = 0; px <= width; px += 4) {
        const simX1 = (px - midX) / scale;
        const simX2 = (-w1 * simX1 - bias) / w2;
        const py = midY - simX2 * scale;
        if (px === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }

    // Draw current input point (x1, x2)
    const scale = 40;
    const ptX = midX + x1 * scale;
    const ptY = midY - x2 * scale;

    ctx.fillStyle = activationOutput > 0.5 ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(ptX, ptY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [x1, x2, w1, w2, bias, activationFn, activeSim, activationOutput]);

  const handleResetNeural = () => {
    setX1(0.8);
    setX2(-0.4);
    setW1(1.5);
    setW2(-2.0);
    setBias(0.3);
    setActivationFn('sigmoid');
  };

  return (
    <div className="space-y-6">
      {/* Simulation Selector Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span>Interactive Conceptual Sandbox</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manipulate parameters in real time to build visceral mathematical and systemic intuition.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSim('neural')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSim === 'neural'
                ? 'bg-slate-800 text-amber-300 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Neural Activation Mechanics
          </button>
          <button
            onClick={() => setActiveSim('bayes')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSim === 'bayes'
                ? 'bg-slate-800 text-amber-300 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bayesian Inference Shift
          </button>
        </div>
      </div>

      {activeSim === 'neural' ? (
        /* Two-Zone Layout as mandated by references/6_education_simulations.md */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Zone: Visual Interactive Stage (7 cols on lg) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                ARCHITECTURE: SINGLE-NEURON HYPERPLANE (2 INPUTS)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPulsing(!isPulsing)}
                  className="p-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5"
                  title={isPulsing ? 'Pause Signal Pulse' : 'Resume Signal Pulse'}
                >
                  {isPulsing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPulsing ? 'Live Signal' : 'Paused'}</span>
                </button>
                <button
                  onClick={handleResetNeural}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                  title="Reset to Defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Neural SVG Signal Network */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center overflow-hidden min-h-[280px]">
              <svg className="w-full h-48 max-w-lg" viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>

                {/* Connection lines from Inputs to Summation Node */}
                {/* Line 1 (x1 to Sum) */}
                <line
                  x1="80"
                  y1="50"
                  x2="250"
                  y2="100"
                  stroke={w1 >= 0 ? '#0284c7' : '#ef4444'}
                  strokeWidth={Math.min(6, Math.max(1.5, Math.abs(w1) * 2))}
                  strokeOpacity="0.8"
                />
                {/* Line 2 (x2 to Sum) */}
                <line
                  x1="80"
                  y1="150"
                  x2="250"
                  y2="100"
                  stroke={w2 >= 0 ? '#0284c7' : '#ef4444'}
                  strokeWidth={Math.min(6, Math.max(1.5, Math.abs(w2) * 2))}
                  strokeOpacity="0.8"
                />
                {/* Bias line into Sum */}
                <line
                  x1="250"
                  y1="20"
                  x2="250"
                  y2="75"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                {/* Line from Sum to Output */}
                <line
                  x1="275"
                  y1="100"
                  x2="420"
                  y2="100"
                  stroke="url(#activeGrad)"
                  strokeWidth="4"
                />

                {/* Pulsing signal particles along wires */}
                {isPulsing && (
                  <>
                    <circle
                      cx={80 + (250 - 80) * pulsePhase}
                      cy={50 + (100 - 50) * pulsePhase}
                      r="4"
                      fill="#38bdf8"
                    />
                    <circle
                      cx={80 + (250 - 80) * pulsePhase}
                      cy={150 + (100 - 150) * pulsePhase}
                      r="4"
                      fill="#38bdf8"
                    />
                    <circle
                      cx={275 + (420 - 275) * pulsePhase}
                      cy={100}
                      r="4.5"
                      fill="#34d399"
                    />
                  </>
                )}

                {/* Input Node 1 */}
                <circle cx="80" cy="50" r="22" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
                <text x="80" y="47" textAnchor="middle" fill="#93c5fd" fontSize="11" fontFamily="JetBrains Mono">
                  x₁
                </text>
                <text x="80" y="62" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="JetBrains Mono">
                  {x1.toFixed(2)}
                </text>

                {/* Input Node 2 */}
                <circle cx="80" cy="150" r="22" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
                <text x="80" y="147" textAnchor="middle" fill="#93c5fd" fontSize="11" fontFamily="JetBrains Mono">
                  x₂
                </text>
                <text x="80" y="162" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="JetBrains Mono">
                  {x2.toFixed(2)}
                </text>

                {/* Bias Marker */}
                <rect x="235" y="6" width="30" height="18" rx="4" fill="#581c87" stroke="#c084fc" strokeWidth="1" />
                <text x="250" y="19" textAnchor="middle" fill="#f5d0fe" fontSize="10" fontFamily="JetBrains Mono">
                  b={bias.toFixed(1)}
                </text>

                {/* Summation Node (Σ) */}
                <circle cx="250" cy="100" r="25" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
                <text x="250" y="97" textAnchor="middle" fill="#fde68a" fontSize="14" fontWeight="bold">
                  Σ
                </text>
                <text x="250" y="112" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="JetBrains Mono">
                  z={linearSum.toFixed(2)}
                </text>

                {/* Output Activation Node (f) */}
                <circle
                  cx="420"
                  cy="100"
                  r="25"
                  fill="#064e3b"
                  stroke={activationOutput > 0.5 ? '#10b981' : '#ef4444'}
                  strokeWidth="3"
                />
                <text x="420" y="96" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontFamily="JetBrains Mono">
                  ŷ=σ(z)
                </text>
                <text x="420" y="112" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="JetBrains Mono">
                  {activationOutput.toFixed(3)}
                </text>
              </svg>

              {/* Status callout */}
              <div className="w-full flex items-center justify-between text-xs px-2 pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 font-mono">
                  State: {activationOutput > 0.5 ? (
                    <span className="text-emerald-400 font-semibold">● ACTIVE CLASSIFICATION (CLASS 1)</span>
                  ) : (
                    <span className="text-rose-400 font-semibold">▲ INHIBITED / DORMANT (CLASS 0)</span>
                  )}
                </span>
                <span className="text-slate-400 font-mono">
                  Affine: z = ({w1.toFixed(1)}×{x1.toFixed(1)}) + ({w2.toFixed(1)}×{x2.toFixed(1)}) + {bias.toFixed(1)} = <strong className="text-white">{linearSum.toFixed(2)}</strong>
                </span>
              </div>
            </div>

            {/* Decision Boundary 2D Canvas & Geometric Intuition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                <div className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>2D Decision Plane (x₁, x₂)</span>
                  <span className="text-[11px] text-amber-400 font-mono">w₁x₁ + w₂x₂ + b = 0</span>
                </div>
                <div className="flex items-center justify-center py-1">
                  <canvas
                    ref={canvasRef}
                    width={220}
                    height={160}
                    className="border border-slate-800/80 rounded bg-slate-900/50"
                  />
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                  <span>Orange line = Boundary</span>
                  <span>Point = Current (x₁, x₂)</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-white">Mathematical Takeaway</span>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    A single neuron is geometrically an <em>affine hyperplane</em> splitting space. The weights <code className="text-amber-300">w₁, w₂</code> dictate the normal orientation of the hyperplane, while the bias <code className="text-amber-300">b</code> shifts it away from the origin.
                  </p>
                </div>
                {onAskTutorAboutConcept && (
                  <button
                    onClick={() => onAskTutorAboutConcept('Explain geometrically why a single linear neuron cannot solve the XOR problem.')}
                    className="mt-3 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium text-left"
                  >
                    <span>Ask AI Tutor: "Why can't this solve XOR?"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Zone: Control & Concept Deck (5 cols on lg) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight pb-2 border-b border-slate-800">
              Parameter Calibration
            </h3>

            {/* Activation Function selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Non-Linear Activation Function f(z)
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
                {(['sigmoid', 'relu', 'tanh'] as const).map((fn) => (
                  <button
                    key={fn}
                    onClick={() => setActivationFn(fn)}
                    className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                      activationFn === fn
                        ? 'bg-slate-800 text-amber-300 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {fn.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Input x1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Input Feature x₁</span>
                <span className="font-mono text-amber-300 font-semibold">{x1.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.05"
                value={x1}
                onChange={(e) => setX1(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-2.0</span>
                <span>0.0</span>
                <span>+2.0</span>
              </div>
            </div>

            {/* Slider 2: Input x2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Input Feature x₂</span>
                <span className="font-mono text-amber-300 font-semibold">{x2.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.05"
                value={x2}
                onChange={(e) => setX2(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-2.0</span>
                <span>0.0</span>
                <span>+2.0</span>
              </div>
            </div>

            {/* Slider 3: Weight w1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Synaptic Weight w₁</span>
                <span className="font-mono text-cyan-300 font-semibold">{w1.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={w1}
                onChange={(e) => setW1(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-3.0 (Inhibitory)</span>
                <span>0.0</span>
                <span>+3.0 (Excitatory)</span>
              </div>
            </div>

            {/* Slider 4: Weight w2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Synaptic Weight w₂</span>
                <span className="font-mono text-cyan-300 font-semibold">{w2.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={w2}
                onChange={(e) => setW2(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-3.0</span>
                <span>0.0</span>
                <span>+3.0</span>
              </div>
            </div>

            {/* Slider 5: Bias b */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Threshold Bias b</span>
                <span className="font-mono text-purple-300 font-semibold">{bias.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={bias}
                onChange={(e) => setBias(parseFloat(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-3.0 (Harder to fire)</span>
                <span>+3.0 (Easier to fire)</span>
              </div>
            </div>

            {/* Active Intuition Card */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Observation</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {w1 * x1 > 0 ? 'Weight w₁ amplifies signal x₁ positively.' : 'Weight w₁ suppresses signal x₁ into the negative regime.'} Notice how shifting bias <code className="text-purple-300">b</code> shifts the entire plane without rotating it.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Bayes Theorem Simulation */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            <span className="text-xs font-mono text-slate-400">
              PROBABILITY UPDATE: MEDICAL DIAGNOSTIC & BASE RATE ENGINE
            </span>

            {/* Visual Urn / Population Split Graph */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 space-y-4">
              <div className="text-center">
                <span className="text-xs text-slate-400">POSTERIOR PROBABILITY GIVEN POSITIVE TEST P(H|E)</span>
                <div className="text-4xl font-extrabold text-amber-400 font-mono tabular-nums mt-1">
                  {(posterior * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {posterior < 0.2
                    ? 'Despite high test accuracy, low base rate makes false positives dominate!'
                    : 'High base rate or near-zero false positive rate makes evidence reliable.'}
                </p>
              </div>

              {/* Comparative Visual Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-300 font-mono">
                  <span>True Positives: {((prior * sensitivity) * 100).toFixed(2)}%</span>
                  <span>False Positives: {(((1 - prior) * falsePositive) * 100).toFixed(2)}%</span>
                </div>
                <div className="h-6 w-full bg-slate-800 rounded-md overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${(posterior * 100).toFixed(1)}%` }}
                    title="True Positives"
                  />
                  <div
                    className="bg-rose-500 h-full transition-all duration-300"
                    style={{ width: `${((1 - posterior) * 100).toFixed(1)}%` }}
                    title="False Positives"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-xs" />
                    <span>True Positive Fraction</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-rose-500 rounded-xs" />
                    <span>False Positive Noise</span>
                  </span>
                </div>
              </div>

              {/* Formula Render */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 font-mono text-center">
                P(Disease | +Test) = [ P(+ | Disease) · P(Disease) ] / P(+Test) = [ {(sensitivity).toFixed(2)} · {(prior).toFixed(3)} ] / {(pEvidence).toFixed(4)} = <strong className="text-amber-400">{(posterior).toFixed(3)}</strong>
              </div>
            </div>

            {onAskTutorAboutConcept && (
              <button
                onClick={() => onAskTutorAboutConcept('Explain why the Base Rate Fallacy tricks doctors and juries using a simple 10,000 person grid analogy.')}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <span>Ask AI Tutor: "Explain the Base Rate Fallacy with a grid analogy"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight pb-2 border-b border-slate-800">
              Bayesian Parameters
            </h3>

            {/* Slider 1: Prior */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Prior Prevalence P(H)</span>
                <span className="font-mono text-amber-300 font-semibold">{(prior * 100).toFixed(2)}%</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.2"
                step="0.002"
                value={prior}
                onChange={(e) => setPrior(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.1% (Rare)</span>
                <span>10%</span>
                <span>20% (Common)</span>
              </div>
            </div>

            {/* Slider 2: Sensitivity */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Test Sensitivity P(E|H)</span>
                <span className="font-mono text-emerald-300 font-semibold">{(sensitivity * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.0"
                step="0.01"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>70%</span>
                <span>95%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Slider 3: False Positive Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">False Positive Rate P(E|¬H)</span>
                <span className="font-mono text-rose-300 font-semibold">{(falsePositive * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.15"
                step="0.005"
                value={falsePositive}
                onChange={(e) => setFalsePositive(parseFloat(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.1%</span>
                <span>5%</span>
                <span>15%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
