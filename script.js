/**
 * Notebook AI Studio - Modern PWA
 * A lightweight, responsive application for AI-powered learning and collaboration
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Navigation
  const navSources = document.getElementById('navSources');
  const navChat = document.getElementById('navChat');
  const navStudio = document.getElementById('navStudio');
  const navConversation = document.getElementById('navConversation');
  
  // DOM Elements - Sections
  const sectionSources = document.getElementById('section-sources');
  const sectionChat = document.getElementById('section-chat');
  const sectionStudio = document.getElementById('section-studio');
  const sectionConversation = document.getElementById('section-conversation');
  
  // DOM Elements - Conversation
  const playButton = document.getElementById('playButton');
  const joinButton = document.getElementById('joinButton');
  const conversationDisplay = document.getElementById('conversationDisplay');
  const userPrompt = document.getElementById('userPrompt');
  const userInput = document.getElementById('userInput');
  const submitResponseButton = document.getElementById('submitResponse');
  
  // DOM Elements - Sources
  const sourceUpload = document.getElementById('sourceUpload');
  const sourceList = document.getElementById('sourceList');
  const selectedSourceDiv = document.getElementById('selectedSource');
  
  // DOM Elements - Chat
  const chatInput = document.getElementById('chatInput');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const chatHistory = document.getElementById('chatHistory');
  
  // DOM Elements - Studio
  const hostsBtn = document.getElementById('hostsBtn');
  const guideBtn = document.getElementById('guideBtn');
  const briefBtn = document.getElementById('briefBtn');
  const mindmapBtn = document.getElementById('mindmapBtn');
  const studioOutput = document.getElementById('studioOutput');
  const audioSelect = document.getElementById('audioSelect');
  const audioPlayer = document.getElementById('audioPlayer');
  const ttsText = document.getElementById('ttsText');
  const speakBtn = document.getElementById('speakBtn');
  
  // DOM Elements - PWA
  const installBtn = document.getElementById('installBtn');
  const shareBtn = document.getElementById('shareBtn');
  const pushPrompt = document.getElementById('pushPrompt');
  const enablePush = document.getElementById('enablePush');
  const dismissPush = document.getElementById('dismissPush');
  
  // Application State
  let currentSegment = 0;
  let interviewRunning = false;
  let userInterrupted = false;
  let sources = []; // Store sources in memory (for demo, not persistent)
  let deferredPrompt; // For PWA install prompt
  
  // The conversation segments
  const conversationSegments = [
    { speaker: 'Sam', text: 'Welcome back to "VXI Vision," our segment where we delve into the core principles that define our operations. Today, Nora, we\'re tackling something absolutely fundamental: our Zero Tolerance Policy and its direct link to customer experience.' },
    { speaker: 'Nora', text: 'It\'s a cornerstone, Sam. The study guide clearly defines a <span class="host">Zero Tolerance (ZT) infraction</span> as a serious violation by employees against the company and customers. It demands urgent action because it encompasses everything from outright fraud to basic negligence. It directly impacts our reputation and, more importantly, our customer\'s trust.' },
    { speaker: 'Sam', text: 'So, these aren\'t minor slip-ups. We\'re talking about actions like "Slamming"—switching services without permission—or "Cramming," adding services unbeknownst to the customer. What are some of the other key examples of ZT violations that operations and quality personnel need to be acutely aware of?' },
    { speaker: 'Nora', text: 'Beyond Slamming and Cramming, we have <span class="host">Unprofessionalism/Rudeness</span>, which covers abusive language or interrupting customers. Then there\'s <span class="host">Call Avoidance</span>, where agents intentionally disconnect or prematurely transfer to avoid issues, which is a serious breach of duty. <span class="host">Misleading</span> customers with false information is also a ZT, as is an <span class="host">Abandoned Order</span>, where a sale or change request is started but not completed to manipulate metrics. These are all about protecting the customer and the integrity of our operations.' },
    { speaker: 'Sam', text: 'That list really highlights the seriousness. And the policy covers *all* Operations and Quality personnel at VXI, with sanctions ranging from suspension to dismissal depending on the severity. But how do we even detect these infractions? It can\'t just be waiting for a customer complaint, can it?' },
    { speaker: 'Nora', text: 'Exactly, Sam. While customer complaints are vital, we have multiple layers of detection. <span class="host">Transaction Monitoring</span> is a big one – listening to recorded calls, live monitoring, side-by-side. We also have <span class="host">Sales Verification</span> and <span class="host">Cancellation Verification</span> to ensure legitimacy. Then there are internal checks like <span class="host">Ops TL ratings</span>, <span class="host">CSAT/Metric scrubbing</span> to spot suspicious patterns, and even <span class="host">3rd Party Audits</span> for an unbiased external review. It\'s a multi-pronged approach designed to catch these issues proactively and reactively.' },
    { speaker: 'Sam', text: 'That\'s comprehensive. Now, let\'s pivot slightly to how we use customer feedback, particularly after a survey. What\'s the primary goal when we contact a customer who has just completed a survey?' },
    { speaker: 'Nora', text: 'The primary goal is to <span class="host">make successful contact based on their survey score</span>. For Detractors (those scoring 0-6) or Passives (7-8), a successful contact is defined as making two calls. This isn\'t just about ticking a box; it\'s about actively reaching out to understand and address their concerns.' },
    { speaker: 'Sam', text: 'And speaking of addressing concerns, the study guide talks about callback prioritization. What\'s the highest level of priority, and what does that tell us about VXI\'s focus on customer experience?' },
    { speaker: 'Nora', text: 'The highest priority is given to customers with an <span class="host">Unresolved Issue who are also Priority Customers</span>. This tells us that VXI is laser-focused on resolving outstanding problems, especially for our most important clients. It aligns perfectly with the overall goal of customer experience: retaining trust, mitigating dissatisfaction, and demonstrating that we are truly committed to solving their problems. It ensures our resources are directed where they can have the most significant impact on customer satisfaction and loyalty. And a crucial part of that is the supervisor\'s role in these callbacks. They introduce themselves from "Comcast's Customer Experience Team" and confirm the call is being recorded for quality, setting a professional and transparent tone right from the start.' },
    { speaker: 'Sam', text: 'Fascinating. It truly illustrates how the Zero Tolerance Policy isn\'t just about punitive measures, but about creating an environment where high standards lead directly to superior customer experience. Nora, thank you for this deep dive.' },
    { speaker: 'System', text: 'This concludes the hosts\' initial discussion. Now, it\'s your turn to participate in this discussion. Do you have any questions for Sam or Nora about the Zero Tolerance Policy, customer contact, or detection methods? Perhaps you\'d like to explore a hypothetical scenario or offer your own thoughts on how these policies impact daily operations? Type your question or comment and click submit!' }
  ];

  // ===== NAVIGATION FUNCTIONS =====
  
  /**
   * Show a specific section and update navigation
   * @param {string} section - Section name to show
   */
  function showSection(section) {
    // Hide all sections
    sectionSources.style.display = 'none';
    sectionChat.style.display = 'none';
    sectionStudio.style.display = 'none';
    sectionConversation.style.display = 'none';
    
    // Remove active class from all nav items
    navSources.classList.remove('active');
    navChat.classList.remove('active');
    navStudio.classList.remove('active');
    navConversation.classList.remove('active');
    
    // Show selected section and update nav
    if (section === 'sources') {
      sectionSources.style.display = 'block';
      navSources.classList.add('active');
    } else if (section === 'chat') {
      sectionChat.style.display = 'block';
      navChat.classList.add('active');
    } else if (section === 'studio') {
      sectionStudio.style.display = 'block';
      navStudio.classList.add('active');
    } else if (section === 'conversation') {
      sectionConversation.style.display = 'block';
      navConversation.classList.add('active');
    }
  }
  
  // ===== CONVERSATION FUNCTIONS =====
  
  /**
   * Display a conversation segment
   * @param {Object} segment - Conversation segment to display
   */
  function displaySegment(segment) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'slide-up');
    
    if (segment.speaker === 'System') {
      // System message
      messageDiv.innerHTML = `<div class="system-message">${segment.text}</div>`;
    } else if (segment.speaker === 'You') {
      // User message
      messageDiv.classList.add('message-user');
      messageDiv.innerHTML = `
        <div class="message-content">
          <div class="user-response">${segment.text}</div>
        </div>
        <div class="avatar avatar-user">Y</div>
      `;
    } else {
      // Host message
      messageDiv.classList.add('message-host');
      const initial = segment.speaker.charAt(0);
      messageDiv.innerHTML = `
        <div class="avatar">${initial}</div>
        <div class="message-content">
          <div class="host">${segment.speaker}:</div>
          <div>${segment.text}</div>
        </div>
      `;
    }
    
    conversationDisplay.appendChild(messageDiv);
    conversationDisplay.scrollTop = conversationDisplay.scrollHeight; // Scroll to bottom
  }
  
  /**
   * Advance the interview to the next segment
   */
  function advanceInterview() {
    if (currentSegment < conversationSegments.length && !userInterrupted) {
      displaySegment(conversationSegments[currentSegment]);
      currentSegment++;
      
      if (currentSegment === conversationSegments.length) {
        // End of host dialogue, enable user input
        joinButton.disabled = true; // No more "joining" as the hosts are done
        userPrompt.style.display = 'block';
        userInput.focus();
        interviewRunning = false;
      } else {
        // Continue interview after a short delay
        setTimeout(advanceInterview, 2000); // Reduced delay for better UX
      }
    }
  }
  
  /**
   * Handle user response in conversation
   */
  function handleUserResponse() {
    const response = userInput.value.trim();
    if (response) {
      displaySegment({ speaker: 'You', text: response });
      userInput.value = ''; // Clear input
      
      // Simulate host response based on generic interaction
      const randomHost = Math.random() < 0.5 ? 'Sam' : 'Nora';
      let hostComment;
      
      if (response.toLowerCase().includes('question') || response.toLowerCase().includes('ask')) {
        hostComment = 'That\'s an excellent question! Let me consider that for a moment...';
      } else if (response.toLowerCase().includes('agree') || response.toLowerCase().includes('true')) {
        hostComment = 'I agree! That\'s a very insightful point you\'ve made.';
      } else if (response.toLowerCase().includes('disagree') || response.toLowerCase().includes('false')) {
        hostComment = 'Interesting perspective! Could you elaborate on why you see it that way?';
      } else if (response.toLowerCase().includes('example') || response.toLowerCase().includes('scenario')) {
        hostComment = 'That\'s a great idea for a practical example! Let\'s think about how that plays out.';
      } else {
        hostComment = 'Thank you for that valuable input! It truly adds to our discussion.';
      }
      
      // Add slight delay before host response for realism
      setTimeout(() => {
        displaySegment({ speaker: randomHost, text: hostComment });
        
        // After user response, allow interaction to continue
        userInterrupted = false; // Reset for potential next interruption
        
        if (currentSegment < conversationSegments.length) {
          // If there are still host segments left, resume them after a pause
          setTimeout(advanceInterview, 2000);
        } else {
          displaySegment({ 
            speaker: 'System', 
            text: 'You\'ve reached the end of the hosts\' planned dialogue. Feel free to continue asking questions or offer comments!' 
          });
          userPrompt.style.display = 'block'; // Keep prompt visible
          userInput.focus();
        }
      }, 800);
    }
  }
  
  // ===== SOURCE MANAGEMENT FUNCTIONS =====
  
  /**
   * Get appropriate icon for file type
   * @param {string} type - MIME type of file
   * @returns {string} - Emoji icon representing file type
   */
  function getFileIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎬';
    if (type.startsWith('audio/')) return '🔊';
    if (type === 'application/pdf') return '📄';
    if (type.startsWith('text/')) return '📄';
    return '📁';
  }
  
  /**
   * Get brief description of file
   * @param {File} file - File object
   * @returns {string} - Brief description
   */
  function getBrief(file) {
    if (file.type.startsWith('image/')) return 'Image file';
    if (file.type.startsWith('video/')) return 'Video file';
    if (file.type.startsWith('audio/')) return 'Audio file';
    if (file.type === 'application/pdf') return 'PDF document';
    if (file.type.startsWith('text/')) return 'Text file';
    return 'File';
  }
  
  /**
   * Render the list of sources
   */
  function renderSources() {
    sourceList.innerHTML = '';
    
    if (sources.length === 0) {
      sourceList.innerHTML = '<p class="text-center mt-2 mb-2">No sources uploaded yet.</p>';
      return;
    }
    
    sources.forEach((src, idx) => {
      const li = document.createElement('li');
      li.classList.add('source-item', 'slide-up');
      li.innerHTML = `
        <span class="source-icon">${getFileIcon(src.file.type)}</span>
        <div class="source-info">
          <div class="source-name">${src.file.name}</div>
          <div class="source-meta">${getBrief(src.file)} · ${formatFileSize(src.file.size)}</div>
        </div>
        <button class="btn btn-sm btn-outline source-btn" data-idx="${idx}">View</button>
      `;
      sourceList.appendChild(li);
    });
    
    // Add click listeners
    document.querySelectorAll('.source-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.getAttribute('data-idx');
        showSourceDetails(idx);
      });
    });
  }
  
  /**
   * Format file size in human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted file size
   */
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
  
  /**
   * Show details of a selected source
   * @param {number} idx - Index of source in sources array
   */
  function showSourceDetails(idx) {
    const src = sources[idx];
    
    // Switch to chat section
    showSection('chat');
    
    // Display source info
    selectedSourceDiv.innerHTML = `
      <div class="selected-source-card">
        <div class="d-flex align-center gap-2">
          <span class="source-icon">${getFileIcon(src.file.type)}</span>
          <div>
            <div class="source-name">${src.file.name}</div>
            <div class="source-meta">${getBrief(src.file)} · ${formatFileSize(src.file.size)}</div>
          </div>
        </div>
      </div>
    `;
    
    // Preview based on file type
    if (src.file.type.startsWith('image/')) {
      const url = URL.createObjectURL(src.file);
      selectedSourceDiv.innerHTML += `
        <div class="source-preview mt-2">
          <img src="${url}" alt="${src.file.name}" class="source-preview-img">
        </div>
      `;
    } else if (src.file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(src.file);
      selectedSourceDiv.innerHTML += `
        <div class="source-preview mt-2">
          <audio src="${url}" controls class="source-preview-audio"></audio>
        </div>
      `;
    } else if (src.file.type.startsWith('video/')) {
      const url = URL.createObjectURL(src.file);
      selectedSourceDiv.innerHTML += `
        <div class="source-preview mt-2">
          <video src="${url}" controls class="source-preview-video"></video>
        </div>
      `;
    } else if (src.file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        selectedSourceDiv.innerHTML += `
          <div class="source-preview mt-2">
            <pre class="source-preview-text">${ev.target.result.substring(0, 500)}${ev.target.result.length > 500 ? '...' : ''}</pre>
          </div>
        `;
      };
      reader.readAsText(src.file);
    }
    
    // Clear chat history and focus input
    chatHistory.innerHTML = '';
    chatInput.focus();
  }
  
  // ===== CHAT FUNCTIONS =====
  
  /**
   * Handle sending a chat message
   */
  function handleSendChat() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('message', 'message-user', 'slide-up');
    userMessageDiv.innerHTML = `
      <div class="message-content">
        <div>${message}</div>
      </div>
      <div class="avatar avatar-user">Y</div>
    `;
    chatHistory.appendChild(userMessageDiv);
    
    // Clear input
    chatInput.value = '';
    
    // Simulate AI response (with typing indicator)
    const aiMessageDiv = document.createElement('div');
    aiMessageDiv.classList.add('message', 'message-host', 'slide-up');
    aiMessageDiv.innerHTML = `
      <div class="avatar">A</div>
      <div class="message-content">
        <div class="loading"></div>
      </div>
    `;
    chatHistory.appendChild(aiMessageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    // Simulate AI thinking and then respond
    setTimeout(() => {
      // Replace loading indicator with response
      aiMessageDiv.innerHTML = `
        <div class="avatar">A</div>
        <div class="message-content">
          <div class="host">AI Assistant:</div>
          <div>I've analyzed your request: "${message}". This is a simulated response as this is a demo application. In a full implementation, this would connect to an AI service to provide meaningful responses based on your uploaded sources.</div>
        </div>
      `;
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 1500);
  }
  
  // ===== STUDIO FUNCTIONS =====
  
  /**
   * Handle studio tool button clicks
   * @param {string} tool - Tool name
   */
  function handleStudioTool(tool) {
    studioOutput.innerHTML = `
      <div class="card p-2 slide-up">
        <h3 class="mb-1">${tool} Tool</h3>
        <p>This is a demo of the ${tool} functionality. In a full implementation, this would generate content based on your sources.</p>
        <div class="loading mt-2"></div>
      </div>
    `;
    
    // Simulate processing
    setTimeout(() => {
      let output = '';
      
      switch(tool) {
        case 'Two Hosts Conversation':
          output = `
            <h3 class="mb-1">Generated Conversation</h3>
            <div class="conversation-container">
              <div class="message message-host">
                <div class="avatar">H</div>
                <div class="message-content">
                  <div class="host">Host 1:</div>
                  <div>Welcome to our discussion on this fascinating topic!</div>
                </div>
              </div>
              <div class="message message-host">
                <div class="avatar">H</div>
                <div class="message-content">
                  <div class="host">Host 2:</div>
                  <div>I'm excited to explore this with you. Let's dive in!</div>
                </div>
              </div>
            </div>
            <p class="mt-2">This is a demo. A full implementation would generate a complete conversation based on your sources.</p>
          `;
          break;
          
        case 'Create Study Guide':
          output = `
            <h3 class="mb-1">Study Guide</h3>
            <div class="study-guide">
              <h4>1. Introduction</h4>
              <p>This would contain an overview of the topic.</p>
              <h4>2. Key Concepts</h4>
              <ul>
                <li>Concept 1: Description</li>
                <li>Concept 2: Description</li>
                <li>Concept 3: Description</li>
              </ul>
              <h4>3. Practice Questions</h4>
              <p>This section would include questions to test understanding.</p>
            </div>
            <p class="mt-2">This is a demo. A full implementation would generate a complete study guide based on your sources.</p>
          `;
          break;
          
        case 'Create Brief':
          output = `
            <h3 class="mb-1">Executive Brief</h3>
            <div class="brief">
              <h4>Summary</h4>
              <p>This would contain a concise summary of the key points.</p>
              <h4>Key Findings</h4>
              <ul>
                <li>Finding 1: Details</li>
                <li>Finding 2: Details</li>
                <li>Finding 3: Details</li>
              </ul>
              <h4>Recommendations</h4>
              <p>This section would include actionable recommendations.</p>
            </div>
            <p class="mt-2">This is a demo. A full implementation would generate a complete brief based on your sources.</p>
          `;
          break;
          
        case 'Create Mind Map':
          output = `
            <h3 class="mb-1">Mind Map</h3>
            <div class="mind-map text-center">
              <p>A visual mind map would be displayed here.</p>
              <div style="width:100%;height:200px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;margin:1rem 0;">
                <span>Mind Map Visualization</span>
              </div>
            </div>
            <p class="mt-2">This is a demo. A full implementation would generate an interactive mind map based on your sources.</p>
          `;
          break;
      }
      
      studioOutput.innerHTML = `<div class="card p-2 slide-up">${output}</div>`;
    }, 2000);
  }
  
  // ===== EVENT LISTENERS =====
  
  // Navigation
  navSources.addEventListener('click', () => showSection('sources'));
  navChat.addEventListener('click', () => showSection('chat'));
  navStudio.addEventListener('click', () => showSection('studio'));
  navConversation.addEventListener('click', () => showSection('conversation'));
  
  // Conversation
  playButton.addEventListener('click', () => {
    if (!interviewRunning) {
      conversationDisplay.innerHTML = ''; // Clear initial text
      playButton.disabled = true;
      joinButton.disabled = false;
      interviewRunning = true;
      advanceInterview();
    }
  });
  
  joinButton.addEventListener('click', () => {
    if (interviewRunning && !userInterrupted) {
      userInterrupted = true;
      joinButton.disabled = true; // Disable join button after interruption
      userPrompt.style.display = 'block';
      userInput.focus();
      
      // Add interruption messages
      displaySegment({ speaker: 'Sam', text: 'Oh, it seems we have a caller!' });
      displaySegment({ speaker: 'Nora', text: 'Welcome to the show! What\'s on your mind?' });
    }
  });
  
  submitResponseButton.addEventListener('click', handleUserResponse);
  
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter behavior (new line)
      handleUserResponse();
    }
  });
  
  // Sources
  sourceUpload.addEventListener('change', (e) => {
    for (const file of e.target.files) {
      sources.push({ file });
    }
    renderSources();
  });
  
  // Chat
  sendChatBtn.addEventListener('click', handleSendChat);
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  });
  
  // Studio
  hostsBtn.addEventListener('click', () => handleStudioTool('Two Hosts Conversation'));
  guideBtn.addEventListener('click', () => handleStudioTool('Create Study Guide'));
  briefBtn.addEventListener('click', () => handleStudioTool('Create Brief'));
  mindmapBtn.addEventListener('click', () => handleStudioTool('Create Mind Map'));
  
  // Audio
  audioSelect.addEventListener('change', () => {
    const selectedAudio = audioSelect.value;
    if (selectedAudio) {
      audioPlayer.src = selectedAudio;
      audioPlayer.load();
    }
  });
  
  speakBtn.addEventListener('click', () => {
    const text = ttsText.value.trim();
    if (text && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser or no text entered.');
    }
  });
  
  // PWA Install Prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'flex';
  });
  
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installBtn.style.display = 'none';
      }
      deferredPrompt = null;
    }
  });
  
  // Web Share API
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
  if (pushPrompt && enablePush && dismissPush) {
    if (Notification && Notification.permission === 'default') {
      setTimeout(() => { pushPrompt.style.display = 'flex'; }, 1200);
    }
    
    enablePush.addEventListener('click', () => {
      Notification.requestPermission().then(() => {
        pushPrompt.style.display = 'none';
      });
    });
    
    dismissPush.addEventListener('click', () => {
      pushPrompt.style.display = 'none';
    });
  }
  
  // Initialize the app
  renderSources();
});

