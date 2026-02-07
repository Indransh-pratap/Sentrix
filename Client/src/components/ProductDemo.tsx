import { Play } from 'lucide-react';

export function ProductDemo() {
  return (
    <section className="py-24 bg-black/40 border-y border-white/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">See Web3Guard in Action</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          A 90-second walkthrough of how Web3Guard scans and explains frontend risks.
        </p>

        <div className="max-w-4xl mx-auto relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
          
          {/* Video Placeholder Card */}
          <div className="relative aspect-video bg-black/80 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
            {/* 
              TODO: Replace with actual iframe or video tag when available.
              Example: <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" ... />
            */}
            
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform cursor-pointer backdrop-blur-sm">
                <Play className="w-8 h-8 text-green-500 ml-1" />
              </div>
              <p className="text-sm font-mono text-gray-500 uppercase tracking-wider">Demo Video Coming Soon</p>
            </div>

            {/* Fake UI Overlay for realism */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
