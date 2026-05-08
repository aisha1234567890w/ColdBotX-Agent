import { useEffect, useState, useRef } from 'react';
import Vapi from '@vapi-ai/web';

const PUBLIC_KEY = "322dff09-cafb-428d-b876-7b7b614ea5ba";
const ASSISTANT_ID = "9c5ca913-4622-4e72-9eef-26bb88997b40";

export default function VapiAssistant() {
  const [vapi, setVapi] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    const vapiInstance = new Vapi(PUBLIC_KEY);
    setVapi(vapiInstance);

    vapiInstance.on('call-start', () => {
      setIsCalling(true);
      console.log('Vapi Call Started');
    });

    vapiInstance.on('call-end', () => {
      setIsCalling(false);
      setIsSpeaking(false);
      setVolume(0);
      console.log('Vapi Call Ended');
    });

    vapiInstance.on('speech-start', () => {
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      setIsSpeaking(false);
    });

    vapiInstance.on('volume-level', (level) => {
        // level is typically 0 to 1
        setVolume(level);
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi Error:', error);
      setIsCalling(false);
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const handleToggleCall = () => {
    if (isCalling) {
      vapi.stop();
    } else {
      vapi.start(ASSISTANT_ID);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {!isCalling ? (
        <button
          onClick={handleToggleCall}
          className="group relative flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <div className="text-2xl">📞</div>
          <span className="text-xl">Call to Book Table</span>
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      ) : (
        <div className="flex flex-col items-center animate-fade-in w-full">
          {/* Agent Avatar Area */}
          <div className="relative mb-12">
            <div className={`w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl z-10 relative border-4 border-white dark:border-gray-800 ${isSpeaking ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                <span className="text-5xl">🤖</span>
            </div>
            
            {/* Pulsing rings when speaking */}
            {isSpeaking && (
                <>
                    <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-[-10px] bg-purple-500 rounded-full animate-ping opacity-10" style={{ animationDelay: '0.2s' }}></div>
                </>
            )}
          </div>

          {/* Voice Visualizer (WhatsApp style) */}
          <div className="flex items-center justify-center gap-1 h-16 mb-8 w-full max-w-xs">
            {[...Array(15)].map((_, i) => {
              // Create dynamic heights based on volume and random jitter
              const baseHeight = isCalling ? 8 : 4;
              const volFactor = isSpeaking ? volume * 50 : 0;
              const randomFactor = isSpeaking ? Math.random() * 10 : 0;
              const height = baseHeight + volFactor + randomFactor;
              
              return (
                <div 
                  key={i}
                  className={`w-1.5 rounded-full bg-gradient-to-t from-indigo-500 to-purple-500 transition-all duration-100`}
                  style={{ height: `${Math.max(4, height)}px` }}
                />
              );
            })}
          </div>

          <div className="text-gray-600 dark:text-gray-300 font-medium mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {isSpeaking ? "Agent is speaking..." : "Listening..."}
          </div>

          <button
            onClick={handleToggleCall}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <span>End Call</span>
            <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
          </button>
        </div>
      )}
    </div>
  );
}
