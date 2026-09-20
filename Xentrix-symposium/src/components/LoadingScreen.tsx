import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  videoSrc?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  videoSrc = '/video/video.mp4',
}) => {
  const [isDone, setIsDone] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFinish = () => {
    if (isDone) return;
    setIsDone(true);
    setTimeout(() => {
      onComplete();
    }, 600); // match framer-motion exit duration
  };

  useEffect(() => {
    // Safety timer: auto proceed after 15 seconds max so user is never stuck
    const timer = setTimeout(() => {
      handleFinish();
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuteState = !isMuted;
      videoRef.current.muted = nextMuteState;
      setIsMuted(nextMuteState);
    }
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="xentrix-video-loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] bg-[#240207] flex items-center justify-center overflow-hidden select-none"
        >
          {/* Clean Dark Maroon Background */}

          {/* Fullscreen Intro Video */}
          {!hasError ? (
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              muted={isMuted}
              playsInline
              preload="auto"
              onCanPlay={() => setIsLoading(false)}
              onPlay={() => setIsLoading(false)}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleFinish}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
              className="w-full h-full object-cover relative z-10"
            />
          ) : (
            /* Fallback Card if video fails to load or path not found yet */
            <div className="relative z-10 text-center p-8 space-y-6 max-w-md bg-maroon-950/90 backdrop-blur-xl border border-gold-500/40 rounded-2xl shadow-2xl">
              <div className="text-xs uppercase tracking-[0.4em] text-gold-400 font-black font-outfit">
                National Level Technical Symposium
              </div>
              <h2 className="font-heading text-4xl font-extrabold text-white tracking-wider">
                XenTriX '26
              </h2>
              <p className="text-sm text-maroon-100 font-outfit">
                Place your intro video file into <code className="text-gold-300 bg-black/40 px-2 py-1 rounded">public/video/video.mp4</code> to customize this intro screen.
              </p>
              <button
                onClick={handleFinish}
                className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-maroon-950 font-black rounded-xl shadow-md transition-all font-outfit border border-gold-300"
              >
                Enter Website ➔
              </button>
            </div>
          )}

          {/* Buffering Indicator */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#240207]/80 backdrop-blur-sm space-y-4">
              <div className="w-12 h-12 border-4 border-maroon-700/40 border-t-gold-400 rounded-full animate-spin" />
              <div className="text-xs font-outfit font-black text-gold-200 uppercase tracking-widest">
                Loading XenTriX Experience...
              </div>
            </div>
          )}

          {/* Controls Overlay */}
          {!hasError && (
            <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 sm:p-8">
              {/* Top Bar: Title & Mute Toggle */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3 bg-maroon-950/90 backdrop-blur-md px-4 py-2 rounded-full border border-gold-400/30 shadow-md pointer-events-auto">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold-400" />
                  <span className="text-xs font-black font-outfit tracking-widest text-white uppercase">
                    XenTriX '26
                  </span>
                  <span className="text-[10px] text-gold-200 font-outfit uppercase tracking-wider hidden sm:inline">
                    | Intro Presentation
                  </span>
                </div>

                {/* Sound Toggle Button */}
                <button
                  onClick={toggleMute}
                  className="pointer-events-auto flex items-center space-x-2 bg-maroon-950/90 hover:bg-maroon-900 backdrop-blur-md text-white px-4 py-2 rounded-full border border-gold-400/30 hover:border-gold-400 transition-all duration-300 shadow-md group"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-maroon-200 group-hover:text-gold-400 transition-colors" />
                      <span className="text-xs font-outfit font-semibold text-maroon-200 group-hover:text-white">
                        Unmute
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-gold-400" />
                      <span className="text-xs font-outfit font-semibold text-white">
                        Sound On
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Section: Progress Line & Skip Intro Button */}
              <div className="w-full space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={handleFinish}
                    className="pointer-events-auto group flex items-center space-x-2 bg-gold-500 hover:bg-gold-400 text-maroon-950 px-5 py-2.5 rounded-full border border-gold-300 shadow-md transition-all duration-300 active:scale-95 font-black"
                  >
                    <span className="text-xs font-outfit font-black tracking-widest uppercase">
                      Skip Intro
                    </span>
                    <SkipForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Clean Progress Line */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-maroon-700 via-gold-500 to-gold-400 rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

