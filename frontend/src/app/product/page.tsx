import { Lock, RefreshCw, ChevronLeft, ChevronRight, Terminal, Plus, Play } from "lucide-react";

export default function ProductDemo() {
  return (
    <div className="flex-1 flex flex-col items-center py-12 px-6 bg-zinc-950">
      <div className="w-full max-w-6xl space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white">Live Code Environment</h1>
          <p className="text-zinc-400">Run applications instantly within our high-performance simulated browser.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          {/* Code Editor Mockup */}
          <div className="lg:col-span-1 border border-zinc-800 bg-zinc-900 rounded-xl overflow-hidden flex flex-col shadow-2xl relative">
            <div className="h-12 border-b border-zinc-800 bg-zinc-900/50 flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium text-zinc-300">index.tsx</span>
              </div>
              <button className="bg-emerald-500/10 text-emerald-400 p-1.5 rounded-md hover:bg-emerald-500/20 transition-colors">
                <Play className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-sm text-zinc-300 overflow-auto bg-[#0d0d0d]">
              <div className="text-blue-400">import</div> <div className="text-yellow-200">{"{ useState }"}</div> <div className="text-blue-400">from</div> <div className="text-green-300">"react"</div>;<br/><br/>
              <div className="text-blue-400">export default function</div> <div className="text-yellow-200">App()</div> {"{"}<br/>
              &nbsp;&nbsp;<div className="text-blue-400">const</div> [count, setCount] = <div className="text-yellow-200">useState(0)</div>;<br/><br/>
              &nbsp;&nbsp;<div className="text-blue-400">return</div> (<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-500">&lt;</span><span className="text-blue-300">div</span> <span className="text-purple-300">className</span>=<span className="text-green-300">"flex flex-col items-center justify-center h-full bg-slate-900 text-white"</span><span className="text-zinc-500">&gt;</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-500">&lt;</span><span className="text-blue-300">h1</span> <span className="text-purple-300">className</span>=<span className="text-green-300">"text-4xl font-bold mb-4"</span><span className="text-zinc-500">&gt;</span>Hello World<span className="text-zinc-500">&lt;/</span><span className="text-blue-300">h1</span><span className="text-zinc-500">&gt;</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-500">&lt;</span><span className="text-blue-300">button</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-300">onClick</span>={"() => setCount(count + 1)"}<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-300">className</span>=<span className="text-green-300">"px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-500">&gt;</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clicked {'{count}'} times<br/>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-500">&lt;/</span><span className="text-blue-300">button</span><span className="text-zinc-500">&gt;</span><br/>
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-500">&lt;/</span><span className="text-blue-300">div</span><span className="text-zinc-500">&gt;</span><br/>
              &nbsp;&nbsp;);<br/>
              {"}"}
            </div>
            
            {/* Terminal Mockup inside Editor */}
            <div className="h-48 border-t border-zinc-800 bg-[#0a0a0a] flex flex-col text-xs font-mono">
               <div className="border-b border-zinc-800/50 p-2 text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Terminal</div>
               <div className="p-3 text-zinc-400 space-y-1 overflow-auto">
                 <div className="text-zinc-500">$ npm run dev</div>
                 <div className="text-emerald-400"> ready - started server on 0.0.0.0:3000, url: http://localhost:3000</div>
                 <div className="text-zinc-500"> event - compiled client and server successfully in 1250 ms (149 modules)</div>
                 <div className="text-zinc-500"> wait  - compiling...</div>
                 <div className="text-emerald-400"> event - compiled client and server successfully in 112 ms</div>
               </div>
            </div>
          </div>

          {/* Browser Mockup */}
          <div className="lg:col-span-2 border border-zinc-800 bg-black rounded-xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {/* Browser Header */}
            <div className="h-16 flex flex-col bg-zinc-900 border-b border-zinc-800 text-sm">
              <div className="h-8 flex items-center px-4 gap-2 pt-2">
                <div className="flex gap-1.5 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/50"></div>
                </div>
                <div className="bg-zinc-800 text-zinc-300 flex items-center px-4 h-6 rounded-t-lg border border-b-0 border-zinc-700 min-w-[150px] gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  React Preview
                </div>
                <div className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 h-6 px-2 rounded flex items-center cursor-pointer">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1 flex items-center px-2 gap-2 bg-zinc-950/50">
                <button className="text-zinc-400 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="text-zinc-400 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="text-zinc-400 hover:text-zinc-200 p-1 rounded hover:bg-zinc-800">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 gap-2 mx-2">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span className="text-zinc-300 text-xs">https://demo.codemarket.dev/preview/temp-1249</span>
                </div>
              </div>
            </div>

            {/* Browser Content */}
            <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center border-t border-zinc-800/50 shadow-inner relative overflow-hidden group">
              {/* Fake Application UI */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 z-0"></div>
              
              <div className="z-10 flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl transition-transform hover:scale-105 duration-500">
                <h1 className="text-4xl font-bold text-white drop-shadow-md">Hello World</h1>
                <p className="text-blue-200 text-sm">Interactive Live Preview</p>
                <button className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-95 font-medium flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  Clicked 0 times
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
