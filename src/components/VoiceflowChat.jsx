import { useEffect } from 'react';

const VoiceflowChat = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.voiceflow.com/widget/bundle.mjs';
    script.onload = () => {
      window.voiceflow.chat.load({
        verify: { projectID: '69f4e6d91f10522cf61ce8ef' }, 
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'production'
      });
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup if necessary, although usually widget stays
    };
  }, []);

  return null;
};

export const openVoiceflowChat = () => {
  if (window.voiceflow && window.voiceflow.chat) {
    window.voiceflow.chat.open();
  } else {
    console.warn('Voiceflow widget not loaded yet');
  }
};

export default VoiceflowChat;
