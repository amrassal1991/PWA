// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Audio player functionality
    const audioSelect = document.getElementById('audioSelect');
    const audioPlayer = document.getElementById('audioPlayer');
    const ttsText = document.getElementById('ttsText');
    const speakBtn = document.getElementById('speakBtn');
    
    // Set up audio selection
    if (audioSelect && audioPlayer) {
        audioSelect.addEventListener('change', () => {
            const selectedAudio = audioSelect.value;
            if (selectedAudio) {
                audioPlayer.src = selectedAudio;
                audioPlayer.load();
            }
        });
    }
    
    // Text-to-Speech functionality
    if (speakBtn && ttsText) {
        speakBtn.addEventListener('click', () => {
            const text = ttsText.value.trim();
            if (text && 'speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(utterance);
            } else {
                alert('Text-to-speech is not supported in your browser or text is empty.');
            }
        });
    }

    // Studio buttons
    const hostsBtn = document.getElementById('hostsBtn');
    const guideBtn = document.getElementById('guideBtn');
    const briefBtn = document.getElementById('briefBtn');
    const mindmapBtn = document.getElementById('mindmapBtn');
    const studioOutput = document.getElementById('studioOutput');
    
    if (hostsBtn) {
        hostsBtn.addEventListener('click', () => {
            studioOutput.innerHTML = '<p>Two hosts conversation feature will be available soon!</p>';
        });
    }
    
    if (guideBtn) {
        guideBtn.addEventListener('click', () => {
            studioOutput.innerHTML = '<p>Study guide creation feature will be available soon!</p>';
        });
    }
    
    if (briefBtn) {
        briefBtn.addEventListener('click', () => {
            studioOutput.innerHTML = '<p>Brief creation feature will be available soon!</p>';
        });
    }
    
    if (mindmapBtn) {
        mindmapBtn.addEventListener('click', () => {
            studioOutput.innerHTML = '<p>Mind map creation feature will be available soon!</p>';
        });
    }

    // Section navigation logic
    const navSources = document.getElementById('navSources');
    const navChat = document.getElementById('navChat');
    const navStudio = document.getElementById('navStudio');
    const sectionSources = document.getElementById('section-sources');
    const sectionChat = document.getElementById('section-chat');
    const sectionStudio = document.getElementById('section-studio');

    function showSection(section) {
      sectionSources.style.display = 'none';
      sectionChat.style.display = 'none';
      sectionStudio.style.display = 'none';
      navSources.classList.remove('active');
      navChat.classList.remove('active');
      navStudio.classList.remove('active');
      if (section === 'sources') {
        sectionSources.style.display = 'block';
        navSources.classList.add('active');
      } else if (section === 'chat') {
        sectionChat.style.display = 'block';
        navChat.classList.add('active');
      } else if (section === 'studio') {
        sectionStudio.style.display = 'block';
        navStudio.classList.add('active');
      }
    }
    
    if (navSources && navChat && navStudio) {
        navSources.addEventListener('click', () => showSection('sources'));
        navChat.addEventListener('click', () => showSection('chat'));
        navStudio.addEventListener('click', () => showSection('studio'));
    }

    // PWA Install Prompt
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
      // Hide the button initially
      installBtn.style.display = 'none';
      
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        // Show the install button
        installBtn.style.display = 'flex';
        
        // Log that the install prompt was captured
        console.log('Install prompt captured and ready');
      });
      
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          // Show the install prompt
          deferredPrompt.prompt();
          
          // Wait for the user to respond to the prompt
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response to the install prompt: ${outcome}`);
          
          if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            installBtn.style.display = 'none';
          } else {
            console.log('User dismissed the install prompt');
          }
          
          // Clear the saved prompt
          deferredPrompt = null;
        } else {
          // If the app is already installed or running in standalone mode
          alert('This app is already installed or cannot be installed on this device/browser.');
        }
      });
      
      // Check if the app is already installed
      window.addEventListener('appinstalled', (e) => {
        console.log('App was successfully installed');
        installBtn.style.display = 'none';
      });
      
      // Check if already in standalone mode (PWA)
      if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        console.log('App is running in standalone mode (installed)');
        installBtn.style.display = 'none';
      }
    }

    // Web Share API (Share Button)
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn && navigator.share) {
      shareBtn.style.display = 'flex';
      shareBtn.addEventListener('click', () => {
        navigator.share({
          title: document.title,
          text: 'Check out this Notebook AI Studio!',
          url: window.location.href
        });
      });
    } else if (shareBtn) {
      shareBtn.style.display = 'none';
    }

    // Push Notification Prompt
    const pushPrompt = document.getElementById('pushPrompt');
    const enablePush = document.getElementById('enablePush');
    const dismissPush = document.getElementById('dismissPush');
    if (pushPrompt && enablePush && dismissPush) {
      if (Notification && Notification.permission === 'default') {
        setTimeout(() => { pushPrompt.style.display = 'flex'; }, 1200);
      }
      enablePush.onclick = () => {
        Notification.requestPermission().then(() => {
          pushPrompt.style.display = 'none';
        });
      };
      dismissPush.onclick = () => {
        pushPrompt.style.display = 'none';
      };
    }

    // File upload and source management
    const sourceUpload = document.getElementById('sourceUpload');
    const sourceList = document.getElementById('sourceList');
    const selectedSourceDiv = document.getElementById('selectedSource');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatHistory = document.getElementById('chatHistory');

    // Store sources in memory (for demo, not persistent)
    let sources = [];

    function getFileIcon(type) {
      if (type.startsWith('image/')) return '🖼️';
      if (type.startsWith('video/')) return '🎬';
      if (type.startsWith('audio/')) return '🔊';
      if (type === 'application/pdf') return '📄';
      if (type.startsWith('text/')) return '📄';
      return '📁';
    }

    function getBrief(file) {
      if (file.type.startsWith('image/')) return 'Image file';
      if (file.type.startsWith('video/')) return 'Video file';
      if (file.type.startsWith('audio/')) return 'Audio file';
      if (file.type === 'application/pdf') return 'PDF document';
      if (file.type.startsWith('text/')) return 'Text file';
      return 'File';
    }

    function renderSources() {
      if (!sourceList) return;
      
      sourceList.innerHTML = '';
      sources.forEach((src, idx) => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.gap = '0.5rem';
        li.style.marginBottom = '0.5rem';
        li.innerHTML = `<span style="font-size:1.5rem;">${getFileIcon(src.file.type)}</span> <button class="source-btn" data-idx="${idx}" style="flex:1;text-align:left;background:none;border:none;color:#1a237e;font-weight:600;cursor:pointer;">${src.file.name}</button> <span style="font-size:0.9em;color:#888;">${getBrief(src.file)}</span>`;
        sourceList.appendChild(li);
      });
      // Add click listeners
      document.querySelectorAll('.source-btn').forEach(btn => {
        btn.onclick = (e) => {
          const idx = btn.getAttribute('data-idx');
          showSourceDetails(idx);
        };
      });
    }

    if (sourceUpload) {
      sourceUpload.addEventListener('change', (e) => {
        for (const file of e.target.files) {
          sources.push({ file });
        }
        renderSources();
      });
    }

    function showSourceDetails(idx) {
      if (!selectedSourceDiv || !sources[idx]) return;
      
      const src = sources[idx];
      // Show a brief in a modal or in the chat section for now
      showSection('chat');
      selectedSourceDiv.innerHTML = `<b>Selected:</b> ${getFileIcon(src.file.type)} ${src.file.name}<br><i>${getBrief(src.file)}</i>`;
      // Optionally, preview image/audio/video/text
      if (src.file.type.startsWith('image/')) {
        const url = URL.createObjectURL(src.file);
        selectedSourceDiv.innerHTML += `<br><img src="${url}" style="max-width:100%;max-height:200px;border-radius:8px;margin-top:0.5rem;">`;
      } else if (src.file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(src.file);
        selectedSourceDiv.innerHTML += `<br><audio src="${url}" controls style="width:100%;margin-top:0.5rem;"></audio>`;
      } else if (src.file.type.startsWith('video/')) {
        const url = URL.createObjectURL(src.file);
        selectedSourceDiv.innerHTML += `<br><video src="${url}" controls style="width:100%;max-height:200px;margin-top:0.5rem;border-radius:8px;"></video>`;
      } else if (src.file.type.startsWith('text/')) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          selectedSourceDiv.innerHTML += `<pre style="background:#f5f5f5;padding:0.5rem;border-radius:6px;max-height:120px;overflow:auto;margin-top:0.5rem;">${ev.target.result.substring(0, 500)}</pre>`;
        };
        reader.readAsText(src.file);
      }
    }
    
    // Chat functionality
    if (sendChatBtn && chatInput && chatHistory) {
      sendChatBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
          // Add user message to chat
          chatHistory.innerHTML += `<div style="margin-bottom:0.8rem;"><b>You:</b> ${message}</div>`;
          chatInput.value = '';
          
          // Simulate AI response (in a real app, this would call an API)
          setTimeout(() => {
            chatHistory.innerHTML += `<div style="margin-bottom:0.8rem;background:#f0f4ff;padding:0.5rem;border-radius:6px;"><b>AI:</b> I'm a demo AI assistant. Your message has been received, but I'm not connected to a real AI backend yet.</div>`;
            chatHistory.scrollTop = chatHistory.scrollHeight;
          }, 1000);
          
          chatHistory.scrollTop = chatHistory.scrollHeight;
        }
      });
      
      // Allow Enter key to send message
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendChatBtn.click();
        }
      });
    }
});
