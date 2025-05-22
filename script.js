// script.js
document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    const joinButton = document.getElementById('joinButton');
    const conversationDisplay = document.getElementById('conversationDisplay');
    const userPrompt = document.getElementById('userPrompt');
    const userInput = document.getElementById('userInput');
    const submitResponseButton = document.getElementById('submitResponse');

    let currentSegment = 0;
    let interviewRunning = false;
    let userInterrupted = false;

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
        { speaker: 'Nora', text: 'The highest priority is given to customers with an <span class="host">Unresolved Issue who are also Priority Customers</span>. This tells us that VXI is laser-focused on resolving outstanding problems, especially for our most important clients. It aligns perfectly with the overall goal of customer experience: retaining trust, mitigating dissatisfaction, and demonstrating that we are truly committed to solving their problems. It ensures our resources are directed where they can have the most significant impact on customer satisfaction and loyalty. And a crucial part of that is the supervisor\'s role in these callbacks. They introduce themselves from "Comcast’s Customer Experience Team" and confirm the call is being recorded for quality, setting a professional and transparent tone right from the start.' },
        { speaker: 'Sam', text: 'Fascinating. It truly illustrates how the Zero Tolerance Policy isn\'t just about punitive measures, but about creating an environment where high standards lead directly to superior customer experience. Nora, thank you for this deep dive.' },
        { speaker: 'System', text: 'This concludes the hosts\' initial discussion. Now, it\'s your turn to participate in this discussion. Do you have any questions for Sam or Nora about the Zero Tolerance Policy, customer contact, or detection methods? Perhaps you\'d like to explore a hypothetical scenario or offer your own thoughts on how these policies impact daily operations? Type your question or comment and click submit!' }
    ];

    function displaySegment(segment) {
        const p = document.createElement('p');
        if (segment.speaker === 'System') {
            p.innerHTML = segment.text;
            p.classList.add('system-message');
        } else {
            p.innerHTML = `<span class="host">${segment.speaker}:</span> ${segment.text}`;
        }
        conversationDisplay.appendChild(p);
        conversationDisplay.scrollTop = conversationDisplay.scrollHeight; // Scroll to bottom
    }

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
                setTimeout(advanceInterview, 6000); // Adjust delay as needed
            }
        }
    }

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
            conversationDisplay.innerHTML += '<p><span class="host">Sam:</span> Oh, it seems we have a caller!</p>';
            conversationDisplay.innerHTML += '<p><span class="host">Nora:</span> Welcome to the show! What\'s on your mind?</p>';
            conversationDisplay.scrollTop = conversationDisplay.scrollHeight;
            // Stop further host dialogue for now
            // The advanceInterview will naturally stop if userInterrupted is true
        }
    });

    submitResponseButton.addEventListener('click', () => {
        handleUserResponse();
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Allow Shift+Enter for new lines
            e.preventDefault(); // Prevent default Enter behavior (new line)
            handleUserResponse();
        }
    });

    function handleUserResponse() {
        const response = userInput.value.trim();
        if (response) {
            displaySegment({ speaker: 'You', text: `<span class="user-response">${response}</span>` });
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
            displaySegment({ speaker: randomHost, text: hostComment });

            // You can add more complex AI logic here if this were a backend interaction
            // For this frontend-only example, it's a generic response.

            // After user response, allow interaction to continue (if hosts still have lines or
            // if we want to prompt for more user input)
            userInterrupted = false; // Reset for potential next interruption if needed
            if (currentSegment < conversationSegments.length) {
                // If there are still host segments left, resume them after a pause
                setTimeout(advanceInterview, 4000); // Resume hosts after user's turn
            } else {
                displaySegment({ speaker: 'System', text: 'You\'ve reached the end of the hosts\' planned dialogue. Feel free to continue asking questions or offer comments!' });
                userPrompt.style.display = 'block'; // Keep prompt visible
                userInput.focus();
            }
        }
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
    navSources.addEventListener('click', () => showSection('sources'));
    navChat.addEventListener('click', () => showSection('chat'));
    navStudio.addEventListener('click', () => showSection('studio'));

    // PWA Install Prompt
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
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

    sourceUpload.addEventListener('change', (e) => {
      for (const file of e.target.files) {
        sources.push({ file });
      }
      renderSources();
    });

    function showSourceDetails(idx) {
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
});
