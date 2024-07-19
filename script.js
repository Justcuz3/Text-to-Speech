const textArea = document.getElementById('text');
const highlightedTextDiv = document.getElementById('highlighted-text');
const playButton = document.getElementById('play-button');
const pauseButton = document.getElementById('pause-button');
const stopButton = document.getElementById('stop-button');
const speedInput = document.getElementById('speed');

let utterance;
let speechSynthesis = window.speechSynthesis;
let wordsArray = [];

function updateHighlightedText(currentWordIndex) {
  const html = wordsArray.map((word, index) => 
    index === currentWordIndex ? `<span class="highlight">${word}</span>` : word
  ).join(' ');
  highlightedTextDiv.innerHTML = html;
}

function handlePlay() {
  const text = textArea.value;
  const speed = parseFloat(speedInput.value);

  if (speechSynthesis.speaking) {
    speechSynthesis.cancel(); // Stop any ongoing speech
  }

  // Split text into words and store in array
  wordsArray = text.split(' ');

  // Create and configure the utterance
  utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = speed;

  // Track current word being read
  let currentWordIndex = -1;

  utterance.onboundary = (event) => {
    if (event.name === 'word') {
      currentWordIndex = wordsArray.findIndex(word => 
        text.startsWith(word, event.charIndex)
      );
      updateHighlightedText(currentWordIndex);
    }
  };

  utterance.onend = () => {
    highlightedTextDiv.innerHTML = text; // Reset highlighted text after speech ends
  };

  speechSynthesis.speak(utterance);
}

function handlePause() {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause();
  }
}

function handleStop() {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    highlightedTextDiv.innerHTML = textArea.value; // Reset highlighted text
  }
}

playButton.addEventListener('click', handlePlay);
pauseButton.addEventListener('click', handlePause);
stopButton.addEventListener('click', handleStop);
