import { useState, useRef } from 'react';
import { Play } from 'lucide-react';

export function ProductDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="py-24 bg-black/40 border-y border-white/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">See Sentrix in Action</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          See how Sentrix scans and explains frontend risks.
        </p>

        <div className="max-w-4xl mx-auto relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
          
          {/* Video Card */}
          <div className="relative aspect-video bg-black/80 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              controls={isPlaying}
              playsInline
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
            >
              <source src="/demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play Overlay */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors cursor-pointer group/btn"
                onClick={handlePlay}
              >
                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover/btn:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
