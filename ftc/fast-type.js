document.addEventListener("DOMContentLoaded", () => {
    // Grab elements that exist in YOUR HTML
    const container   = document.querySelector(".container");
    const quoteEl     = document.getElementById("quote");
    const inputEl     = document.getElementById("input");
    const timerEl     = document.getElementById("timer");
    const speedEl     = document.getElementById("speed");
    const accuracyEl  = document.getElementById("accuracy");
    const startBtn    = document.getElementById("startBtn");
    const resetBtn    = document.getElementById("resetBtn");
  
    // Sentences to type (replace with your funny/meme lines later)
    const phrases = [
      "Cheems loves biryani more than Mondays.",
      "Gigachad types faster than his shadow.",
      "Skibidi keyboard go brrrrr right now.",
      "No bugs today, only features and caffeine.",
      "Banana debug mode: peel and reveal the error.",
      "Modify by Fatima brings the vibes, always."
    ];
  
    // Config
    const LIMIT_SECONDS = 60;        // hard limit; test also ends if user finishes early
    const COUNTDOWN_TICK_MS = 1000;  // update once per second
  
    // State
    let running = false;
    let phrase = "";
    let startTime = 0;
    let elapsedMs = 0;
    let timerId = null;
  
    // Helpers
    const pickPhrase = () => phrases[Math.floor(Math.random() * phrases.length)];
  
    function resetUI() {
      running = false;
      phrase = "";
      startTime = 0;
      elapsedMs = 0;
      clearInterval(timerId);
      timerId = null;
  
      container.classList.remove("finished");
      quoteEl.textContent = 'Click "Start" to begin typing!';
      inputEl.value = "";
      inputEl.disabled = true;
  
      timerEl.textContent = "0";
      speedEl.textContent = "0";
      accuracyEl.textContent = "0";
    }
  
    function startTest() {
      resetUI(); // clear any previous run, but we’ll override quote/input now
  
      phrase = pickPhrase();
      quoteEl.textContent = phrase;
      inputEl.disabled = false;
      inputEl.focus();
  
      running = true;
      startTime = Date.now();
      elapsedMs = 0;
  
      // Kick off the timer
      timerId = setInterval(() => {
        if (!running) return;
        elapsedMs = Date.now() - startTime;
        const sec = Math.floor(elapsedMs / 1000);
        timerEl.textContent = String(sec);
  
        if (sec >= LIMIT_SECONDS) {
          endTest("Time's up!");
        }
      }, COUNTDOWN_TICK_MS);
    }
  
    function computeAccuracy(typed, target) {
      if (typed.length === 0) return 100;
      let correct = 0;
      for (let i = 0; i < typed.length; i++) {
        if (typed[i] === target[i]) correct++;
      }
      return Math.max(0, Math.round((correct / typed.length) * 100));
    }
  
    function computeWPM(typedChars, ms) {
      if (ms <= 0) return 0;
      const words = typedChars / 5;                // standard WPM metric
      const minutes = ms / 60000;
      return Math.max(0, Math.round(words / minutes));
    }
  
    function updateLiveMetrics() {
      if (!running) return;
  
      const typed = inputEl.value;
      const acc = computeAccuracy(typed, phrase);
      const wpm = computeWPM(typed.length, Math.max(1, elapsedMs));
  
      accuracyEl.textContent = String(acc);
      speedEl.textContent = String(wpm);
  
      // Finish early if exact match
      if (typed === phrase) {
        endTest("Nice! You finished the phrase.");
      }
    }
  
    function endTest(reason) {
      if (!running) return;
      running = false;
      clearInterval(timerId);
  
      // Final metrics
      const finalElapsed = Math.max(1, elapsedMs);
      const typed = inputEl.value;
      const finalWPM = computeWPM(typed.length, finalElapsed);
      const finalACC = computeAccuracy(typed, phrase);
  
      // Show result in the quote area and lock input
      quoteEl.textContent = `${reason}  WPM: ${finalWPM} • Accuracy: ${finalACC}%`;
      inputEl.disabled = true;
  
      // Add class for fancy result background via CSS
      container.classList.add("finished");
    }
  
    // Events
    startBtn.addEventListener("click", startTest);
    resetBtn.addEventListener("click", resetUI);
    in
  