/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

/* ===== PARTICLES ===== */
const particlesContainer = document.getElementById('particles');
const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b'];

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 5 + 2;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const left = Math.random() * 100;
  const duration = Math.random() * 15 + 10;
  const delay = Math.random() * 10;
  p.style.cssText = `
    width:${size}px; height:${size}px;
    background:${color};
    left:${left}%;
    animation-duration:${duration}s;
    animation-delay:-${delay}s;
    box-shadow: 0 0 ${size*2}px ${color};
  `;
  particlesContainer.appendChild(p);
}

for (let i = 0; i < 50; i++) createParticle();

/* ===== SCROLL TO CHAPTER ===== */
function scrollToChapter(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 90;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/* ===== INTERSECTION OBSERVER: Animate cards in ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.example-card, .chapter-card, .info-c').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

/* ===== QUIZ DATA ===== */
const quizData = [
  {
    q: "A car uses a convex mirror as a rear-view mirror. What kind of image does it produce?",
    options: ["Real, inverted, magnified", "Virtual, erect, diminished", "Real, erect, diminished", "Virtual, inverted, magnified"],
    ans: 1,
    exp: "Convex mirrors always form virtual, erect and diminished images — giving drivers a wider field of view."
  },
  {
    q: "A straw looks bent in a glass of water. This is due to:",
    options: ["Reflection", "Diffraction", "Refraction", "Dispersion"],
    ans: 2,
    exp: "Light bends (refraction) when moving from water (denser) to air (rarer), making the straw appear bent."
  },
  {
    q: "Which lens is used to correct Myopia (short-sightedness)?",
    options: ["Convex lens", "Concave lens", "Bifocal lens", "Cylindrical lens"],
    ans: 1,
    exp: "Concave (diverging) lens spreads rays outward so they focus correctly on the retina, not in front of it."
  },
  {
    q: "The sky appears blue because of:",
    options: ["Reflection of ocean water", "Rayleigh Scattering of sunlight", "Absorption by ozone", "Total internal reflection"],
    ans: 1,
    exp: "Shorter (blue) wavelengths scatter more (∝ 1/λ⁴) — our eyes receive scattered blue light from all directions."
  },
  {
    q: "A 100 W bulb glows for 10 hours. Electrical energy consumed is:",
    options: ["100 kWh", "10 kWh", "1 kWh", "0.1 kWh"],
    ans: 2,
    exp: "E = P × t = 100 W × 10 h = 1000 Wh = 1 kWh (one unit of electricity)."
  },
  {
    q: "Which rule is used to determine the direction of force on a current-carrying conductor in a magnetic field?",
    options: ["Right-Hand Thumb Rule", "Fleming's Right-Hand Rule", "Fleming's Left-Hand Rule", "Lenz's Law"],
    ans: 2,
    exp: "Fleming's Left-Hand Rule: thumb → force/motion, index → B field, middle finger → current direction."
  },
  {
    q: "Optical fibres work on the principle of:",
    options: ["Regular refraction", "Dispersion", "Total Internal Reflection", "Diffraction"],
    ans: 2,
    exp: "Light undergoes total internal reflection at the core-cladding boundary, propagating along the fibre length."
  },
  {
    q: "Ohm's Law states: V = IR. If resistance doubles and voltage stays same, current will:",
    options: ["Double", "Remain same", "Halve", "Become zero"],
    ans: 2,
    exp: "I = V/R. If R doubles, I = V/(2R) = half the original current."
  },
  {
    q: "Which energy conversion happens in a solar cell?",
    options: ["Chemical → Electrical", "Mechanical → Electrical", "Light → Electrical", "Heat → Electrical"],
    ans: 2,
    exp: "Photovoltaic (solar) cells directly convert light energy (photons) into electrical energy."
  },
  {
    q: "Faraday's Law of Electromagnetic Induction states that induced EMF is proportional to:",
    options: ["Current in the coil", "Rate of change of magnetic flux", "Resistance of the coil", "Temperature of the conductor"],
    ans: 1,
    exp: "ε = −N × ΔΦ/Δt. The greater the rate of change of magnetic flux, the greater the induced EMF."
  }
];

/* ===== QUIZ ENGINE ===== */
let currentQ = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const q = quizData[currentQ];
  const pct = (currentQ / quizData.length) * 100;
  document.getElementById('quiz-prog-bar').style.width = pct + '%';

  const html = `
    <div class="quiz-q-num">Question ${currentQ + 1} of ${quizData.length}</div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options">
      ${q.options.map((opt, i) => `
        <button class="quiz-option" onclick="selectAnswer(${i})" id="opt-${i}">${opt}</button>
      `).join('')}
    </div>
    <div id="quiz-feedback"></div>
    <div class="quiz-next" id="quiz-next" style="display:none;">
      <button class="btn btn-primary" onclick="nextQuestion()">
        ${currentQ < quizData.length - 1 ? 'Next Question →' : 'See Results 🏆'}
      </button>
    </div>
  `;
  document.getElementById('quiz-content').innerHTML = html;
  answered = false;
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQ];
  const buttons = document.querySelectorAll('.quiz-option');
  buttons.forEach(b => b.disabled = true);

  const feedback = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next');

  if (idx === q.ans) {
    score++;
    buttons[idx].classList.add('correct');
    feedback.className = 'quiz-feedback correct-fb';
    feedback.innerHTML = `✅ <strong>Correct!</strong> ${q.exp}`;
  } else {
    buttons[idx].classList.add('wrong');
    buttons[q.ans].classList.add('correct');
    feedback.className = 'quiz-feedback wrong-fb';
    feedback.innerHTML = `❌ <strong>Incorrect.</strong> The right answer is <strong>${q.options[q.ans]}</strong>. ${q.exp}`;
  }

  nextBtn.style.display = 'block';
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= quizData.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult() {
  document.getElementById('quiz-box').classList.add('hidden');
  document.getElementById('quiz-box').style.display = 'none';
  const resultEl = document.getElementById('quiz-result');
  resultEl.classList.remove('hidden');

  const pct = (score / quizData.length) * 100;
  let icon, title, desc;

  if (pct === 100) {
    icon = '🏆'; title = 'Perfect Score!';
    desc = `You aced it! ${score}/${quizData.length} correct. You clearly understand how physics applies to the real world!`;
  } else if (pct >= 70) {
    icon = '🌟'; title = 'Great Job!';
    desc = `${score}/${quizData.length} correct (${pct}%). Solid understanding — review the ones you missed.`;
  } else if (pct >= 50) {
    icon = '📚'; title = 'Good Effort!';
    desc = `${score}/${quizData.length} correct (${pct}%). Keep revising the applied examples above to strengthen your concepts.`;
  } else {
    icon = '💪'; title = 'Keep Practising!';
    desc = `${score}/${quizData.length} correct. Go through the applied examples section and try again — you'll get there!`;
  }

  document.getElementById('result-icon').textContent = icon;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-desc').textContent = desc;
}

function restartQuiz() {
  currentQ = 0; score = 0; answered = false;
  document.getElementById('quiz-result').classList.add('hidden');
  const qbox = document.getElementById('quiz-box');
  qbox.classList.remove('hidden');
  qbox.style.display = '';
  renderQuestion();
}

// Init quiz
renderQuestion();

/* ===== SMOOTH NAV LINK CLICKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    navLinks.classList.remove('open');
  });
});
