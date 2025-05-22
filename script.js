const slides = Array.from(document.querySelectorAll('.slide'));
let idx = 0;

// Utility to show slide i
function showSlide(i) {
  slides.forEach(s => s.classList.remove('active'));
  slides[i].classList.add('active');
  idx = i;
}

// Start button (Slide 1)
document.getElementById('startBtn').onclick = () => showSlide(1);

// Next buttons
document.querySelectorAll('.nextBtn').forEach(btn =>
  btn.onclick = () => showSlide(idx + 1)
);

// ICON interaction on Slide 2
const correctIconId = 'icon-date';
document.querySelectorAll('.icon').forEach(icon => {
  icon.onclick = () => {
    if (icon.id === correctIconId) {
      showSlide(2);
      recognition.stop();
    } else {
      alert('Try again!');
    }
  };
});

// === Speech Recognition ===
let recognition;
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRec();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.onresult = (evt) => {
    const spoken = evt.results[evt.resultIndex][0].transcript.trim().toLowerCase();
    console.log('Heard:', spoken);

    // If on slide 1 and user said "start"
    if (idx === 0 && spoken.includes('start')) {
      showSlide(1);
    }
    // If on slide 2 and user said "date"
    if (idx === 1 && spoken.includes('date')) {
      showSlide(2);
    }
    // Next slides: listen for "next"
    if (spoken.includes('next') && idx > 0) {
      showSlide(idx + 1);
    }
  };
  recognition.start();
} else {
  console.warn('SpeechRecognition API not supported in this browser.');
}
