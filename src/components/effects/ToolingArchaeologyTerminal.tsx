import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, CornerDownLeft, Sparkles } from 'lucide-react';

type ToolingTab = 'nvim' | 'cargo' | 'bun' | 'mcp' | 'matrix' | 'fastfetch';

interface LogEntry {
  type: 'command' | 'output' | 'error' | 'success';
  text: string;
}

export const ToolingArchaeologyTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolingTab>('nvim');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [customLogs, setCustomLogs] = useState<LogEntry[]>([]);
  const [isTypingAnim, setIsTypingAnim] = useState(false);
  const [cargoProgress, setCargoProgress] = useState(0);
  const [mcpPing, setMcpPing] = useState(0.4);

  const viewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synthesizer: Procedural Mechanical Keyboard Switch Sound (Cherry MX Clack)
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playKeyClack = useCallback((pitchVariance = 1.0) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. High transient switch-click pop (8ms)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2200 * pitchVariance, now);
      osc.frequency.exponentialRampToValueAtTime(350 * pitchVariance, now + 0.012);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.012);

      // 2. Damped mechanical case resonance / thud (22ms)
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(320 * pitchVariance, now);
      thudOsc.frequency.exponentialRampToValueAtTime(90 * pitchVariance, now + 0.024);

      thudGain.gain.setValueAtTime(0.07, now);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);

      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start(now);
      thudOsc.stop(now + 0.024);
    } catch {
      // Audio context policy fallback
    }
  }, [getAudioContext, soundEnabled]);

  // Execute terminal preset mode
  const selectTab = useCallback((tab: ToolingTab) => {
    playKeyClack(1.1);
    setActiveTab(tab);
    setCustomLogs([]);

    if (tab === 'cargo') {
      setCargoProgress(0);
      let p = 0;
      const interval = setInterval(() => {
        p += 20;
        setCargoProgress(Math.min(p, 100));
        if (p >= 100) clearInterval(interval);
      }, 70);
    }

    if (tab === 'mcp') {
      setMcpPing(+(0.2 + Math.random() * 0.4).toFixed(2));
    }
  }, [playKeyClack]);

  // Handle command execution from the interactive CLI prompt
  const handleRunCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    playKeyClack(0.9);
    const newLogs: LogEntry[] = [...customLogs, { type: 'command', text: trimmed }];

    const lower = trimmed.toLowerCase();
    if (lower === 'clear') {
      setCustomLogs([]);
      setInputValue('');
      return;
    } else if (lower === 'help') {
      newLogs.push({
        type: 'output',
        text: 'Available commands: nvim, cargo, bun, mcp, fastfetch, matrix, clear',
      });
    } else if (lower === 'nvim' || lower === ':wq' || lower === 'vim') {
      selectTab('nvim');
      setInputValue('');
      return;
    } else if (lower.includes('cargo') || lower === 'rust') {
      selectTab('cargo');
      setInputValue('');
      return;
    } else if (lower.includes('bun') || lower === 'test') {
      selectTab('bun');
      setInputValue('');
      return;
    } else if (lower.includes('mcp')) {
      selectTab('mcp');
      setInputValue('');
      return;
    } else if (lower === 'matrix') {
      selectTab('matrix');
      setInputValue('');
      return;
    } else if (lower === 'fastfetch' || lower === 'neofetch') {
      selectTab('fastfetch');
      setInputValue('');
      return;
    } else {
      newLogs.push({
        type: 'error',
        text: `zsh: command not found: ${trimmed}. Try 'help', 'nvim', 'cargo', 'bun', 'mcp'`,
      });
    }

    setCustomLogs(newLogs);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playKeyClack(0.95 + Math.random() * 0.15);
    if (e.key === 'Enter') {
      handleRunCommand(inputValue);
    }
  };

  // Scroll internal terminal viewport only, never scrolling the browser page
  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [customLogs, activeTab]);

  return (
    <div className="w-full max-w-sm rounded-xl overflow-hidden bg-[#0a0c10]/95 border border-white/10 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30 flex flex-col font-mono select-none">
      {/* -------------------------------------------------------------
          1. TERMINAL WINDOW HEADER (Kitty / Neovim styling)
          ------------------------------------------------------------- */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-white/[0.07] text-[10px]">
        {/* Window control pips */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 border border-rose-400/40 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 border border-amber-400/40 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-400/40 inline-block" />
          <span className="ml-2 text-titanium-400 font-semibold tracking-wide hidden xs:inline">
            nvim ~/{activeTab === 'nvim' ? 'init.lua' : activeTab}
          </span>
        </div>

        {/* Git & LSP Telemetry */}
        <div className="flex items-center gap-2 text-titanium-500">
          <span className="flex items-center gap-1 text-[9px] text-titanium-400">
            <span className="text-cyan-400 font-bold">⎇</span> main
          </span>
          <span className="flex items-center gap-1 text-[9px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>LSP: 0.8ms</span>
          </span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          2. TERMINAL VIEWPORT (Syntax Buffer & Interactive Displays)
          ------------------------------------------------------------- */}
      <div
        ref={viewportRef}
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        className="relative w-full h-[190px] p-3 overflow-y-auto overflow-x-hidden bg-[#08090d] text-titanium-300 text-[11px] leading-relaxed cursor-text scrollbar-thin scrollbar-thumb-white/10"
      >
        {/* Mode 1: Neovim Lua Configuration Buffer */}
        {activeTab === 'nvim' && (
          <div className="space-y-0.5">
            <div className="text-titanium-500 italic text-[10px]">
              -- ~/.config/nvim/lua/hunain/init.lua
            </div>
            <div className="flex items-center">
              <span className="w-5 text-titanium-600 select-none text-[10px]">1</span>
              <span className="text-purple-400">vim.g</span>.<span className="text-cyan-300">mapleader</span> = <span className="text-emerald-400">" "</span>
            </div>
            <div className="flex items-center">
              <span className="w-5 text-titanium-600 select-none text-[10px]">2</span>
              <span className="text-purple-400">vim.keymap</span>.<span className="text-cyan-300">set</span>(<span className="text-emerald-400">"n"</span>, <span className="text-emerald-400">"&lt;leader&gt;pv"</span>, <span className="text-blue-400">vim.cmd</span>.Ex)
            </div>
            <div className="flex items-center">
              <span className="w-5 text-titanium-600 select-none text-[10px]">3</span>
              <span className="text-titanium-500 italic">-- Model Context Protocol Bridge</span>
            </div>
            <div className="flex items-center">
              <span className="w-5 text-titanium-600 select-none text-[10px]">4</span>
              <span className="text-purple-400">require</span>(<span className="text-emerald-400">"mcp-hub"</span>).<span className="text-cyan-300">setup</span>({`{`}
            </div>
            <div className="flex items-center">
              <span className="w-5 text-titanium-600 select-none text-[10px]">5</span>
              <span className="ml-2 text-titanium-400">transport</span> = <span className="text-emerald-400">"stdio"</span>,
            </div>
            <div className="flex items-center">
              <span className="w-5 text-titanium-600 select-none text-[10px]">6</span>
              <span className="ml-2 text-titanium-400">agents</span> = {`{`} <span className="text-emerald-400">"claude"</span>, <span className="text-emerald-400">"gemini"</span> {`}`},
            </div>
            <div className="flex items-center">
              <span className="w-5 text-titanium-600 select-none text-[10px]">7</span>
              {`})`} <span className="inline-block w-2 h-3.5 bg-cyan-400/80 animate-pulse ml-1 align-middle" />
            </div>
            <div className="mt-2 text-[10px] text-cyan-400/80 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Treesitter: Tree-sitter-rust &amp; lua active</span>
            </div>
          </div>
        )}

        {/* Mode 2: Rust SIMD Cargo Benchmark */}
        {activeTab === 'cargo' && (
          <div className="space-y-1 text-[10.5px]">
            <div className="text-titanium-400">
              <span className="text-cyan-400 font-bold">$</span> cargo bench --bench simd_throughput
            </div>
            <div className="text-emerald-400">
              Compiling oxidizer v0.14.2 (SIMD AVX-512 release)
            </div>
            <div className="py-1">
              <div className="text-titanium-400 text-[10px] mb-0.5 flex justify-between">
                <span>Benchmarking token_stream:</span>
                <span className="text-cyan-300">{cargoProgress}%</span>
              </div>
              <div className="w-full bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-150"
                  style={{ width: `${cargoProgress}%` }}
                />
              </div>
            </div>
            {cargoProgress >= 100 && (
              <div className="space-y-0.5 text-titanium-300">
                <div className="text-emerald-300 font-bold">
                  ✓ Finished 1,420,000 ops/sec
                </div>
                <div className="text-[10px] text-titanium-400">
                  mean: <span className="text-cyan-300 font-mono">0.34 μs</span> (±0.02 μs) | allocs: <span className="text-purple-300">0 bytes (zero-copy)</span>
                </div>
                <div className="text-[9.5px] text-titanium-500">
                  Target: x86_64-unknown-linux-musl • L1 Cache hit: 99.4%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 3: Bun High-Speed Runtime Test */}
        {activeTab === 'bun' && (
          <div className="space-y-1 text-[10.5px]">
            <div className="text-titanium-400">
              <span className="text-cyan-400 font-bold">$</span> bun test --bail
            </div>
            <div className="space-y-0.5 pt-0.5">
              <div className="text-emerald-400 flex items-center justify-between">
                <span>✓ telemetry.test.ts (4 tests)</span>
                <span className="text-titanium-500 text-[9px]">0.9ms</span>
              </div>
              <div className="text-emerald-400 flex items-center justify-between">
                <span>✓ neural_bridge.test.ts (8 tests)</span>
                <span className="text-titanium-500 text-[9px]">0.6ms</span>
              </div>
              <div className="text-emerald-400 flex items-center justify-between">
                <span>✓ mcp_protocol.test.ts (12 tests)</span>
                <span className="text-titanium-500 text-[9px]">1.4ms</span>
              </div>
            </div>
            <div className="pt-1.5 border-t border-white/[0.08] text-[10px] flex items-center justify-between">
              <span className="text-emerald-300 font-bold">24 pass, 0 fail</span>
              <span className="text-cyan-300 font-bold">Ran in 2.9ms</span>
            </div>
            <div className="text-[9.5px] text-titanium-500">
              Engine: JavaScriptCore (JSC) • 14x faster than Node.js v20
            </div>
          </div>
        )}

        {/* Mode 4: Model Context Protocol Inspector */}
        {activeTab === 'mcp' && (
          <div className="space-y-1 text-[10.5px]">
            <div className="text-titanium-400">
              <span className="text-cyan-400 font-bold">$</span> mcp-cli inspect --transport stdio
            </div>
            <div className="text-purple-400 text-[10px]">
              → {`{"jsonrpc":"2.0","method":"tools/list"}`}
            </div>
            <div className="text-cyan-300 text-[10px]">
              ← {`{"result":{"tools":["read_ast","cargo_check","eval"]}}`}
            </div>
            <div className="pt-1 text-[10px] space-y-0.5">
              <div className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Protocol: MCP v2024-11-05 (Healthy)</span>
              </div>
              <div className="text-titanium-400">
                Transport: <span className="text-cyan-300">stdio</span> • Latency: <span className="text-emerald-400">{mcpPing}ms</span>
              </div>
              <div className="text-[9.5px] text-titanium-500">
                Connected Clients: Claude Desktop, Gemini Agentic Core
              </div>
            </div>
          </div>
        )}

        {/* Mode 5: Bonus Matrix Digital Rain Effect */}
        {activeTab === 'matrix' && (
          <div className="space-y-0.5 text-emerald-400 font-mono text-[10px] tracking-widest overflow-hidden">
            <div>01001000 01010101 01001110 01000001 01001001 01001110</div>
            <div className="text-emerald-300">W A K E   U P ,   N E O . . .</div>
            <div>THE MATRIX HAS YOU // AGENTIC SIMULATION ONLINE</div>
            <div className="text-emerald-500/80">01100011 01101111 01100100 01101001 01101110 01100111</div>
            <div className="text-cyan-400 mt-1">
              [✓] Access Granted. Interactive Shell Initialized.
            </div>
          </div>
        )}

        {/* Mode 6: Fastfetch Dev Rig Specs */}
        {activeTab === 'fastfetch' && (
          <div className="space-y-0.5 text-[10px]">
            <div className="text-cyan-400 font-bold">hunain@archlinux-dev</div>
            <div className="text-titanium-500">----------------------</div>
            <div><span className="text-purple-400 font-bold">OS:</span> Arch Linux x86_64</div>
            <div><span className="text-purple-400 font-bold">Host:</span> Custom Obsidian Rig</div>
            <div><span className="text-purple-400 font-bold">Kernel:</span> 6.10.8-zen1-hardened</div>
            <div><span className="text-purple-400 font-bold">Shell:</span> zsh 5.9 (pure prompt)</div>
            <div><span className="text-purple-400 font-bold">Editor:</span> Neovim 0.10.1 (Lua/Treesitter)</div>
            <div><span className="text-purple-400 font-bold">Uptime:</span> 342 days, 18 hours</div>
          </div>
        )}

        {/* Custom CLI Output logs if user typed anything */}
        {customLogs.map((log, i) => (
          <div key={i} className="mt-1">
            {log.type === 'command' && (
              <div className="text-titanium-400">
                <span className="text-cyan-400 font-bold">hunain@arch:~$</span> {log.text}
              </div>
            )}
            {log.type === 'output' && <div className="text-titanium-300 text-[10px]">{log.text}</div>}
            {log.type === 'error' && <div className="text-rose-400 text-[10px]">{log.text}</div>}
            {log.type === 'success' && <div className="text-emerald-400 text-[10px]">{log.text}</div>}
          </div>
        ))}

        {/* Ambient CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.14)_50%)] bg-[length:100%_3px] pointer-events-none" />
      </div>

      {/* -------------------------------------------------------------
          3. NEOVIM STATUSLINE (Authentic Powerline styling)
          ------------------------------------------------------------- */}
      <div className="flex items-center justify-between px-2 py-1 bg-white/[0.04] border-t border-white/[0.07] text-[9.5px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[9px] border border-cyan-500/30">
            {activeTab === 'nvim' ? 'NORMAL' : activeTab.toUpperCase()}
          </span>
          <span className="text-titanium-400 hidden xs:inline">
            {activeTab === 'nvim' ? 'init.lua' : `${activeTab}.out`}
          </span>
          <span className="text-titanium-600"></span>
          <span className="text-titanium-500 text-[9px]">[utf-8]</span>
        </div>
        <div className="flex items-center gap-2 text-titanium-500 text-[9px]">
          <span>100%</span>
          <span>ln {activeTab === 'nvim' ? '7:1' : '1:1'}</span>
        </div>
      </div>

      {/* -------------------------------------------------------------
          4. INTERACTIVE PROMPT INPUT (Typeable CLI Prompt)
          ------------------------------------------------------------- */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-[#07080b] border-t border-white/[0.06] text-xs">
        <span className="text-cyan-400 text-[11px] font-bold select-none">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type 'help', 'cargo', 'bun', 'mcp'..."
          className="w-full bg-transparent text-titanium-200 placeholder-titanium-600/70 text-[11px] focus:outline-none font-mono"
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => handleRunCommand(inputValue)}
            className="text-cyan-400 hover:text-cyan-300 p-0.5 cursor-pointer"
            title="Execute command"
          >
            <CornerDownLeft className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* -------------------------------------------------------------
          5. QUICK ACTION PILLS & AUDIO TOGGLE
          ------------------------------------------------------------- */}
      <div className="flex items-center justify-between px-2.5 py-2 bg-white/[0.02] border-t border-white/[0.06] text-[10px]">
        {/* Preset pill triggers */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
          <button
            type="button"
            onClick={() => selectTab('nvim')}
            className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
              activeTab === 'nvim'
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200'
                : 'bg-white/[0.03] border-white/10 text-titanium-400 hover:text-titanium-200 hover:bg-white/[0.06]'
            }`}
            title="View Neovim Lua Configuration"
          >
            nvim
          </button>

          <button
            type="button"
            onClick={() => selectTab('cargo')}
            className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
              activeTab === 'cargo'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                : 'bg-white/[0.03] border-white/10 text-titanium-400 hover:text-titanium-200 hover:bg-white/[0.06]'
            }`}
            title="Run Rust SIMD Benchmark"
          >
            cargo
          </button>

          <button
            type="button"
            onClick={() => selectTab('bun')}
            className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
              activeTab === 'bun'
                ? 'bg-pink-500/20 border-pink-500/40 text-pink-200'
                : 'bg-white/[0.03] border-white/10 text-titanium-400 hover:text-titanium-200 hover:bg-white/[0.06]'
            }`}
            title="Run Bun Test Suite"
          >
            bun
          </button>

          <button
            type="button"
            onClick={() => selectTab('mcp')}
            className={`px-2 py-0.5 rounded border transition-all cursor-pointer ${
              activeTab === 'mcp'
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-200'
                : 'bg-white/[0.03] border-white/10 text-titanium-400 hover:text-titanium-200 hover:bg-white/[0.06]'
            }`}
            title="Inspect Model Context Protocol"
          >
            mcp
          </button>
        </div>

        {/* Mechanical Switch Audio Toggle */}
        <button
          type="button"
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) playKeyClack(1.2);
          }}
          className={`p-1.5 rounded-md border transition-all cursor-pointer ml-1.5 ${
            soundEnabled
              ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.2)]'
              : 'bg-white/[0.03] border-white/10 text-titanium-500 hover:text-titanium-300'
          }`}
          title={soundEnabled ? 'Mute mechanical keyboard sounds' : 'Enable tactile mechanical switch sound'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
