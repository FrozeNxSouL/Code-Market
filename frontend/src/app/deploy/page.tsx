import { CloudUpload, FolderGit2, Server, Blocks, CheckCircle2, Copy } from "lucide-react";

export default function DeployPage() {
  return (
    <div className="flex-1 flex flex-col items-center py-16 px-6 bg-zinc-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl z-10 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-2">Deploy your next big idea.</h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Upload your project or connect a repository and go live to the world in seconds. No configuration required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Import Setup Options */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Blocks className="w-5 h-5 text-indigo-400" />
              1. Source Configuration
            </h2>
            
            <div className="group cursor-pointer border border-zinc-800 bg-zinc-900/40 p-6 rounded-2xl hover:bg-zinc-800/60 hover:border-indigo-500/50 transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                    <FolderGit2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Import Git Repository</h3>
                    <p className="text-sm text-zinc-500">Continuous deployment for every push.</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg border border-zinc-700 transition">Connect</button>
              </div>
            </div>

             <div className="group border border-zinc-800 border-dashed bg-zinc-900/20 p-8 rounded-2xl text-center hover:bg-zinc-900/40 hover:border-zinc-600 transition-all cursor-pointer">
              <div className="w-14 h-14 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-zinc-700/50 transition-colors">
                <CloudUpload className="w-6 h-6 text-zinc-400" />
              </div>
              <h3 className="font-medium text-white mb-1">Upload a ZIP file</h3>
              <p className="text-sm text-zinc-500 mb-4">Drag and drop your bundled project here.</p>
              <button className="px-5 py-2 text-sm bg-white hover:bg-zinc-200 text-black font-semibold rounded-full shadow-lg shadow-white/5 transition-transform active:scale-95">Browse Files</button>
            </div>
          </div>

          {/* Deployment Status / Preview Panel */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
               <Server className="w-5 h-5 text-emerald-400" />
               2. Status
            </h2>

            <div className="border border-zinc-800 bg-black p-6 rounded-2xl shadow-xl flex flex-col h-full min-h-[400px]">
              
              <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full blur-[2px]"></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full absolute inset-0"></div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Project Status</p>
                    <p className="text-sm font-medium text-white">Ready to deploy</p>
                  </div>
                </div>
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all">
                  Deploy
                </button>
              </div>

              <div className="flex-1 border border-zinc-800/50 rounded-xl bg-[#09090b] p-4 text-sm font-mono flex flex-col relative overflow-hidden">
                 <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
                 
                 <div className="flex items-center gap-2 text-zinc-500 mb-2">
                   <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                   Initializing deployment environment...
                 </div>
                 <div className="flex items-center gap-2 text-zinc-600 mb-2 pl-6">
                   Using Node.js v20.x environment
                 </div>
                 <div className="flex items-center gap-2 text-zinc-600 mb-2 pl-6">
                   Waiting for project source...
                 </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-zinc-800/50 pt-4">
                <p className="text-zinc-500 text-sm">Deployment URL</p>
                <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-zinc-400 text-sm opacity-50 cursor-not-allowed">
                  https://waiting-project.codemarket.dev
                  <Copy className="w-3.5 h-3.5 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
