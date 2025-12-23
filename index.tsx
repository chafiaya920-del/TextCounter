/**
 * TextCounter.pro Analysis Engine v2.5
 * Optimized for High-Traffic SEO UI
 */

const textInput = document.getElementById('text-input') as HTMLTextAreaElement;
const dropZone = document.getElementById('view-tool'); // Parent section for drag-drop
const dropOverlay = document.getElementById('drop-overlay') as HTMLDivElement;

// Display Metrics
const resChars = document.getElementById('res-chars');
const resWords = document.getElementById('res-words');
const resSentences = document.getElementById('res-sentences');
const resTime = document.getElementById('res-time');

// Platform Displays
const valGoogle = document.getElementById('val-google');
const valTwitter = document.getElementById('val-twitter');
const valAi = document.getElementById('val-ai');

// Buttons
const btnClear = document.getElementById('btn-clear');
const btnCopy = document.getElementById('btn-copy');
const btnTitle = document.getElementById('btn-titlecase');
const btnClean = document.getElementById('btn-clean');

/**
 * The core engine: Runs on every keystroke
 */
function runAnalysis() {
  const text = textInput.value || '';

  // 1. Precise Character Count
  const charCount = text.length;

  // 2. High-Traffic Word Count logic (Matches Industry Standards)
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // 3. Structural Stats
  const sentences = text.split(/[.!?]+(?:\s|$)/).filter(s => s.trim().length > 0);
  const readingMinutes = Math.ceil(wordCount / 225);

  // Update DOM (Top Bar)
  if (resChars) resChars.textContent = charCount.toLocaleString();
  if (resWords) resWords.textContent = wordCount.toLocaleString();
  if (resSentences) resSentences.textContent = sentences.length.toLocaleString();
  if (resTime) resTime.textContent = `${readingMinutes}m`;

  // Update Platform Limits (SEO Section)
  updateLimit(valGoogle, charCount, 160);
  updateLimit(valTwitter, charCount, 280);
  updateLimit(valAi, charCount, 4000);
}

function updateLimit(el: HTMLElement | null, count: number, limit: number) {
  if (!el) return;
  el.textContent = `${count.toLocaleString()} / ${limit.toLocaleString()}`;
  
  const parent = el.closest('.platform-pill');
  if (!parent) return;

  parent.classList.remove('border-amber-400', 'bg-amber-50', 'border-red-400', 'bg-red-50');

  if (count > limit) {
    parent.classList.add('border-red-400', 'bg-red-50');
  } else if (count > limit * 0.9) {
    parent.classList.add('border-amber-400', 'bg-amber-50');
  }
}

/**
 * Text Formatting Handlers
 */
btnClear?.addEventListener('click', () => {
  textInput.value = '';
  runAnalysis();
  textInput.focus();
});

btnCopy?.addEventListener('click', () => {
  if (!textInput.value) return;
  navigator.clipboard.writeText(textInput.value).then(() => {
    const original = btnCopy.textContent;
    btnCopy.textContent = "COPIED!";
    btnCopy.classList.replace('bg-indigo-600', 'bg-emerald-600');
    setTimeout(() => {
      btnCopy.textContent = original;
      btnCopy.classList.replace('bg-emerald-600', 'bg-indigo-600');
    }, 1500);
  });
});

btnTitle?.addEventListener('click', () => {
  textInput.value = textInput.value.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
  runAnalysis();
});

btnClean?.addEventListener('click', () => {
  textInput.value = textInput.value.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  runAnalysis();
});

textInput?.addEventListener('input', runAnalysis);

/**
 * Pro Drag & Drop Logic
 */
dropZone?.addEventListener('dragover', (e) => {
  e.preventDefault();
  if (dropOverlay) dropOverlay.style.opacity = '1';
});

dropZone?.addEventListener('dragleave', () => {
  if (dropOverlay) dropOverlay.style.opacity = '0';
});

dropZone?.addEventListener('drop', (e) => {
  e.preventDefault();
  if (dropOverlay) dropOverlay.style.opacity = '0';
  
  const file = e.dataTransfer?.files[0];
  if (file && (file.type === 'text/plain' || file.name.endsWith('.txt'))) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      textInput.value = ev.target?.result as string;
      runAnalysis();
    };
    reader.readAsText(file);
  }
});

// Init
runAnalysis();