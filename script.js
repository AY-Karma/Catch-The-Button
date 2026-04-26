const scene = document.getElementById("scene");
const button = document.getElementById("escapeButton");
const timer = document.getElementById("timer");
const startScreen = document.getElementById("startScreen");
const startGameButton = document.getElementById("startGameButton");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const difficultyGrid = document.getElementById("difficultyGrid");
const tauntScreen = document.getElementById("tauntScreen");
const tauntTimeValue = document.getElementById("tauntTimeValue");
const tauntMode = document.getElementById("tauntMode");
const tauntText = document.getElementById("tauntText");
const restartButton = document.getElementById("restartButton");
const homeButton = document.getElementById("homeButton");
const tauntSubtext = document.getElementById("tauntSubtext");
const tauntSign = document.getElementById("tauntSign");
const tauntLight = document.getElementById("tauntLight");

const difficultyProfiles = {
  noob: {
    radiusScale: 0.52,
    travelBoost: -72,
    randomSwing: -1.1,
    randomDistance: -0.42,
    motionEase: -0.1,
    edgeBias: 2.05,
  },
  amateur: {
    radiusScale: 0.66,
    travelBoost: -44,
    randomSwing: -0.78,
    randomDistance: -0.28,
    motionEase: -0.07,
    edgeBias: 1.45,
  },
  pro: {
    radiusScale: 1.08,
    travelBoost: 24,
    randomSwing: 0.22,
    randomDistance: 0.08,
    motionEase: 0.015,
    edgeBias: -0.15,
  },
  god: {
    radiusScale: 1.2,
    travelBoost: 48,
    randomSwing: 0.46,
    randomDistance: 0.16,
    motionEase: 0.04,
    edgeBias: -0.38,
  },
};

const taunts = [
  "Thirty seconds and you still committed to this.",
  "That much focus for one button is a rough look.",
  "You really spent all that time proving a point.",
  "The button is disappointed that this worked.",
  "An entire chase, and this was the victory lap.",
  "This is what persistence looks like when misapplied."
];

const endScreenHeadlines = {
  noob: {
    under10: "Move on to Amateur, Buddy",
    under30: "Are you an UNC??",
    over30: "Just close the lid and fix your life already",
  },
  amateur: {
    under10: "Alright... you might actually belong here.",
    under30: "Comfort zone detected. Still trying?",
    over30: "Graduation was an option, you know.",
  },
  pro: {
    under10: "Okay, that was clean. Respect.",
    under30: "Pro? Or just lucky this time?",
    over30: "That title is looking a bit... rented.",
  },
  god: {
    under10: "That was unreal. Seriously impressive.",
    under30: "Well played. That's no easy feat.",
    over30: "You held your ground. This mode isn't forgiving.",
  },
};

const state = {
  x: window.innerWidth / 2,
  y: window.innerHeight * 0.72,
  targetX: window.innerWidth / 2,
  targetY: window.innerHeight * 0.72,
  pointerX: window.innerWidth / 2,
  pointerY: window.innerHeight / 2,
  buttonWidth: 192,
  buttonHeight: 74,
  lastPointerMoveAt: 0,
  pointerActive: false,
  copyHidden: false,
  timerStarted: false,
  timerStartAt: 0,
  gameStarted: false,
  theme: "dark",
  difficulty: "noob",
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatElapsed(seconds) {
  return seconds.toFixed(2).padStart(5, "0");
}

function getElapsedSeconds() {
  if (!state.timerStarted) {
    return 0;
  }

  return (performance.now() - state.timerStartAt) / 1000;
}

function getProfile() {
  return difficultyProfiles[state.difficulty];
}

function getHeadlineForResult(difficulty, elapsed) {
  const copy = endScreenHeadlines[difficulty];
  if (elapsed < 10) {
    return copy.under10;
  }
  if (elapsed < 30) {
    return copy.under30;
  }
  return copy.over30;
}

function updateThemeUI() {
  const isLight = state.theme === "light";
  document.body.classList.toggle("light-mode", isLight);
  themeToggle.setAttribute("aria-checked", String(isLight));
  themeLabel.textContent = isLight ? "Light Mode" : "Dark Mode";
}

function updateDifficultyUI() {
  const options = difficultyGrid.querySelectorAll(".difficulty-option");
  options.forEach((option) => {
    option.classList.toggle("active", option.dataset.difficulty === state.difficulty);
  });
}

function measureButton() {
  const rect = button.getBoundingClientRect();
  state.buttonWidth = rect.width;
  state.buttonHeight = rect.height;
}

function setInitialPosition() {
  measureButton();
  state.x = window.innerWidth / 2;
  state.y = window.innerHeight * 0.72;
  state.targetX = state.x;
  state.targetY = state.y;
  state.pointerX = window.innerWidth / 2;
  state.pointerY = window.innerHeight / 2;
  state.pointerActive = false;
  state.lastPointerMoveAt = 0;
  state.copyHidden = false;
  state.timerStarted = false;
  state.timerStartAt = 0;
  timer.textContent = "00.00";
  button.style.left = state.x + "px";
  button.style.top = state.y + "px";
}

function updatePointerState() {
  const elapsed = performance.now() - state.lastPointerMoveAt;
  state.pointerActive = elapsed < 180;
}

function startTimerIfNeeded() {
  if (!state.timerStarted) {
    state.timerStarted = true;
    state.timerStartAt = performance.now();
  }
}

function pickEscapeTarget(pointerX, pointerY, strength) {
  const profile = getProfile();
  const padding = 18;
  const minX = state.buttonWidth / 2 + padding;
  const maxX = window.innerWidth - state.buttonWidth / 2 - padding;
  const minY = state.buttonHeight / 2 + padding;
  const maxY = window.innerHeight - state.buttonHeight / 2 - padding;
  const awayAngle = Math.atan2(state.y - pointerY || Math.random() - 0.5, state.x - pointerX || Math.random() - 0.5);
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const centerAngle = Math.atan2(centerY - state.y, centerX - state.x);
  const travel = 90 + profile.travelBoost + strength * 170;
  let best = {
    x: clamp(state.x + Math.cos(awayAngle) * travel, minX, maxX),
    y: clamp(state.y + Math.sin(awayAngle) * travel, minY, maxY),
    score: -Infinity,
  };

  for (let i = 0; i < 14; i += 1) {
    const randomSwing = (Math.random() - 0.5) * clamp(1.8 + profile.randomSwing, 0.5, 2.6);
    const mix = clamp(0.28 + Math.random() * 0.28, 0.18, 0.52);
    const angle = awayAngle * (1 - mix) + centerAngle * mix + randomSwing;
    const distance = travel * clamp(0.82 + Math.random() * (0.65 + profile.randomDistance), 0.62, 1.55);
    const candidateX = clamp(state.x + Math.cos(angle) * distance, minX, maxX);
    const candidateY = clamp(state.y + Math.sin(angle) * distance, minY, maxY);
    const pointerDistance = Math.hypot(candidateX - pointerX, candidateY - pointerY);
    const edgeClearance = Math.min(candidateX - minX, maxX - candidateX, candidateY - minY, maxY - candidateY);
    const centerDistance = Math.hypot(candidateX - centerX, candidateY - centerY);
    const score = pointerDistance + edgeClearance * (1.9 + profile.edgeBias) - centerDistance * 0.18 + Math.random() * 24;

    if (score > best.score) {
      best = { x: candidateX, y: candidateY, score };
    }
  }

  state.targetX = best.x;
  state.targetY = best.y;
}

function evade(pointerX, pointerY) {
  if (!state.gameStarted) {
    return;
  }

  const profile = getProfile();
  const dx = state.x - pointerX;
  const dy = state.y - pointerY;
  const distance = Math.hypot(dx, dy);
  const activeRadius = Math.max(160, Math.min(window.innerWidth, window.innerHeight) * (0.34 * profile.radiusScale));

  if (distance >= activeRadius) {
    return;
  }

  const strength = (activeRadius - distance) / activeRadius;
  pickEscapeTarget(pointerX, pointerY, strength);
}

function animate() {
  updatePointerState();
  const profile = getProfile();
  const motionEase = clamp(0.22 + profile.motionEase, 0.09, 0.28);

  state.x += (state.targetX - state.x) * motionEase;
  state.y += (state.targetY - state.y) * motionEase;
  button.style.left = state.x + "px";
  button.style.top = state.y + "px";

  if (state.timerStarted) {
    timer.textContent = formatElapsed(getElapsedSeconds());
  }

  requestAnimationFrame(animate);
}

function beginGame() {
  state.gameStarted = true;
  startScreen.classList.add("hidden");
  tauntScreen.classList.remove("active");
  setInitialPosition();
}

function goHome() {
  state.gameStarted = false;
  tauntScreen.classList.remove("active");
  startScreen.classList.remove("hidden");
  setInitialPosition();
}

function showEndScreen() {
  if (!state.gameStarted || tauntScreen.classList.contains("active")) {
    return;
  }

  const elapsed = getElapsedSeconds();
  tauntTimeValue.textContent = formatElapsed(elapsed);
  tauntMode.textContent = "Mode: " + state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);
  tauntText.textContent = getHeadlineForResult(state.difficulty, elapsed);

  if (elapsed >= 30) {
    tauntSubtext.textContent = taunts[Math.floor(Math.random() * taunts.length)];
    tauntSign.textContent = "- Button";
  } else {
    tauntSubtext.textContent = "";
    tauntSign.textContent = "";
  }

  tauntLight.textContent = state.theme === "light" ? "Touch Grass - Light Mode Loser" : "";
  tauntScreen.classList.add("active");
}

function handlePointerLikeMove(x, y) {
  if (!state.gameStarted) {
    return;
  }

  startTimerIfNeeded();
  state.lastPointerMoveAt = performance.now();
  state.copyHidden = true;
  state.pointerX = x;
  state.pointerY = y;
  evade(x, y);
}

themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  updateThemeUI();
});

difficultyGrid.addEventListener("click", (event) => {
  const option = event.target.closest(".difficulty-option");
  if (!option) {
    return;
  }

  state.difficulty = option.dataset.difficulty;
  updateDifficultyUI();
});

startGameButton.addEventListener("click", beginGame);
restartButton.addEventListener("click", beginGame);
homeButton.addEventListener("click", goHome);

scene.addEventListener("pointermove", (event) => {
  handlePointerLikeMove(event.clientX, event.clientY);
});

scene.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  if (!touch) {
    return;
  }

  handlePointerLikeMove(touch.clientX, touch.clientY);
}, { passive: true });

scene.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  if (!touch) {
    return;
  }

  handlePointerLikeMove(touch.clientX, touch.clientY);
}, { passive: true });

button.addEventListener("pointerenter", () => {
  if (!state.gameStarted) {
    return;
  }
});

button.addEventListener("touchstart", () => {
  if (!state.gameStarted) {
    return;
  }
}, { passive: true });

button.addEventListener("pointerdown", (event) => {
  if (!state.gameStarted) {
    return;
  }

  event.preventDefault();
  showEndScreen();
});

button.addEventListener("click", () => {
  showEndScreen();
});

window.addEventListener("resize", () => {
  setInitialPosition();
});

updateThemeUI();
updateDifficultyUI();
setInitialPosition();
requestAnimationFrame(animate);
