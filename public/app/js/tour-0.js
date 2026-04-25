/* ════════════════════════════════════════════════════════════════
   LESSON TEACHER — FUTURISTIC HELP SYSTEM v2
   ─────────────────────────────────────────────
   • Stylish glassmorphic overlay with gradient glow + particles
   • Animated step-through walkthrough with progress dots
   • Floating Help button (toggle on/off) with pulse halo
   • Per-section help (lesson, objective, exam-centre, homework,
     essay, parent, guidance, classroom, kids, languages)
   • Persists "don't show again" preference per kind
   • Backward compatible: openLtTour, maybeShowLtTour, hideLtHelpFab
   • Closes on outside click, ESC key, or close button
   ════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  // ───────── Storage keys (one per kind) ─────────
  var STORAGE_PREFIX = 'lt_help_seen_v2_';

  // ───────── Help content for every section ─────────
  // Each entry: { title, subtitle, accent, accent2, icon, steps:[{ico,h,t}] }
  var GUIDES = {
    lesson: {
      title: 'How your Lesson works',
      subtitle: 'A complete guide to your AI tutor',
      accent: '#3b82f6',
      accent2: '#8b5cf6',
      icon: '📖',
      steps: [
        { ico:'📖', h:'Read the full lesson',     t:'Lesson Teacher writes the entire lesson for you — clear definitions, Nigerian examples, and worked questions, level-matched to your class.' },
        { ico:'👩‍🏫', h:'Ask the Tutor anything',  t:'Tap "Ask Tutor" on the right to ask any question you don\'t understand. You can speak with the mic or type.' },
        { ico:'⚡', h:'Use the quick tools',       t:'Buttons like Explain, Example, WAEC Q, Worked, and Again give you instant help on the current paragraph.' },
        { ico:'📝', h:'Try the quiz',              t:'A short quiz appears at the end. Score well to mark the topic complete and earn XP.' },
        { ico:'⬇️', h:'Download for offline',      t:'Tap Download Notes to save the full lesson as a clean PDF you can read anywhere — great for revision.' },
        { ico:'🔁', h:'Navigate topics easily',    t:'Use Prev / Next at the bottom to move between topics. Your progress is saved automatically.' }
      ]
    },
    objective: {
      title: 'How Objective Questions work',
      subtitle: 'Master multiple-choice exams',
      accent: '#10b981',
      accent2: '#06b6d4',
      icon: '🎯',
      steps: [
        { ico:'🎯', h:'Pick the best option',      t:'Each question has options A, B, C, D (and E for some boards). Tap the option you think is correct.' },
        { ico:'⏱️', h:'Watch the timer',            t:'Real exam mode is timed — practise pacing yourself like the real WAEC, NECO, or JAMB paper.' },
        { ico:'💡', h:'Instant explanations',      t:'In Practice mode you see exactly why an answer is right (or wrong) after each question — that is how you learn fast.' },
        { ico:'📊', h:'Score & feedback',           t:'When you finish, you get your score, which questions you missed, and a topic breakdown so you know what to revise.' },
        { ico:'🆘', h:'Stuck? Tap Help',            t:'The Help button on the side opens this guide again any time you need it.' }
      ]
    },
    'exam-centre': {
      title: 'Welcome to the Exam Centre',
      subtitle: 'WAEC · NECO · JAMB · BECE · CE',
      accent: '#f59e0b',
      accent2: '#ef4444',
      icon: '🏆',
      steps: [
        { ico:'🎓', h:'Pick your exam board',       t:'Start by choosing WAEC, NECO, JAMB, BECE, or Common Entrance — each board has its own format and question style.' },
        { ico:'📚', h:'Choose your subject',        t:'Use the search bar to find your subject quickly. We have past papers from 2015 to the most recent year.' },
        { ico:'📄', h:'Select a paper',             t:'Different papers test different things — Objective (Paper 1), Theory (Paper 2), or full mock papers. Pick what you want to practise.' },
        { ico:'📅', h:'Year focus',                  t:'Filter by year so you can practise the most recent past questions or revisit older classics.' },
        { ico:'🚀', h:'Sit the exam',                t:'Click Start — answer questions, get instant feedback in Practice mode, or full timed conditions in Exam mode.' }
      ]
    },
    classroom: {
      title: 'Welcome to Your Classroom',
      subtitle: 'Your personal AI study space',
      accent: '#3b82f6',
      accent2: '#8b5cf6',
      icon: '🏫',
      steps: [
        { ico:'📚', h:'Pick a subject to begin',    t:'Tap any subject card on the welcome screen — your lesson opens at the current week of your school term.' },
        { ico:'📋', h:'Topics in the sidebar',       t:'After picking a subject, the left sidebar shows every topic for the term. Jump to any topic you like.' },
        { ico:'⚡', h:'Earn XP & build streaks',    t:'Complete topics and quizzes to earn XP and grow your daily learning streak. The badge in the top bar tracks it live.' },
        { ico:'🔧', h:'More tools in "More"',        t:'Open the More section in the sidebar for Homework Helper, Essay Practice, Parent Hub, Career Guidance, and Languages.' },
        { ico:'📝', h:'Practise for exams',          t:'Open Exam Prep in the sidebar for WAEC, NECO, and JAMB past-paper practice — your real exam preparation lives there.' },
        { ico:'🎙️', h:'Talk to your tutor',         t:'Tap the mic in the chat to speak. The voice toggle (🔊) lets the tutor read replies aloud — perfect for revision walks.' }
      ]
    },
    homework: {
      title: 'Homework Helper Guide',
      subtitle: 'Snap, paste, or type — get a teaching answer',
      accent: '#10b981',
      accent2: '#3b82f6',
      icon: '📷',
      steps: [
        { ico:'🏷️', h:'Set your class first',       t:'Tap the class pill at the top so the helper teaches at your level — JSS 1 explanations differ from SS 3.' },
        { ico:'📷', h:'Snap a photo',                t:'Use Camera to snap your homework page. The AI reads the printed or handwritten question.' },
        { ico:'📋', h:'Or paste / type the question', t:'Type or paste the question directly. You can also upload a file if you prefer.' },
        { ico:'🎓', h:'Read the teaching answer',    t:'You will get the answer plus a clear explanation in tutor style — never just the final answer.' },
        { ico:'💬', h:'Ask follow-up questions',      t:'Did not understand a step? Ask the tutor to explain it differently — using simpler words or a Nigerian example.' }
      ]
    },
    essay: {
      title: 'Essay Practice Guide',
      subtitle: 'Get marked to WAEC criteria',
      accent: '#f59e0b',
      accent2: '#fbbf24',
      icon: '✍️',
      steps: [
        { ico:'📝', h:'Pick or paste a question',    t:'Choose a sample WAEC-style essay question, or paste your own. The mode (Narrative, Argumentative, Letter, etc.) sets the marking style.' },
        { ico:'⏱️', h:'Write under timed mode',      t:'Practise writing within the time limit — exactly like the real exam. The timer trains your speed.' },
        { ico:'🤖', h:'AI marks it instantly',        t:'When you submit, you get a score across Content, Organisation, Expression, and Mechanics — the same WAEC rubric.' },
        { ico:'💡', h:'Get specific suggestions',     t:'You see exactly which sentences to improve, weak grammar spots, and missed points. Apply them and rewrite.' },
        { ico:'🔁', h:'Rewrite and improve',          t:'Use the suggestions, rewrite, and submit again. Watch your score climb — that is how you reach A1.' }
      ]
    },
    parent: {
      title: 'Parent Hub Guide',
      subtitle: 'Family support, in one place',
      accent: '#d97706',
      accent2: '#f59e0b',
      icon: '👨‍👩‍👧',
      steps: [
        { ico:'📊', h:'See progress at a glance',    t:'Track which subjects your child studies, their XP, streaks, and which topics have been completed.' },
        { ico:'📅', h:'Weekly summaries',             t:'Get a tidy summary of what was learnt this week, time spent, and any topics they struggled with.' },
        { ico:'🎯', h:'Help them set goals',          t:'Set simple weekly goals together — number of topics, exam subjects to practise, or essays to attempt.' },
        { ico:'💬', h:'Tips for parents',              t:'Read short, practical tips on supporting school work without taking over — Nigerian context, real advice.' }
      ]
    },
    guidance: {
      title: 'Career Guidance Guide',
      subtitle: 'Universities, courses, scholarships',
      accent: '#2563eb',
      accent2: '#0ea5e9',
      icon: '🎓',
      steps: [
        { ico:'🎯', h:'Find courses that fit you',    t:'Tell the system your favourite subjects and strengths — it suggests university courses that match.' },
        { ico:'🏛️', h:'Explore Nigerian universities', t:'Browse federal, state, and private universities. See entry requirements and JAMB cut-off marks per course.' },
        { ico:'🌍', h:'International options',          t:'Discover study-abroad routes, country guides, and what subjects you need for the courses you want.' },
        { ico:'💰', h:'Scholarships & funding',         t:'See available scholarships, deadlines, and exactly what you need to apply. Plan early — scholarships close fast.' }
      ]
    },
    kids: {
      title: 'Kids Mode Guide',
      subtitle: 'Fun, safe learning for primary',
      accent: '#ec4899',
      accent2: '#f97316',
      icon: '🧒',
      steps: [
        { ico:'🎨', h:'Tap a colourful subject',      t:'Big buttons, bright colours — pick a subject and the lesson opens with simple words and fun examples.' },
        { ico:'🌟', h:'Earn stars & badges',           t:'Finish a lesson or quiz to collect stars. Build a collection — it makes practice exciting.' },
        { ico:'🎤', h:'Speak to learn',                 t:'Kids can press the mic and talk — the tutor listens, replies kindly, and reads things aloud.' },
        { ico:'👨‍👩‍👧', h:'Safe for all ages',         t:'No ads, no scary content, no chat with strangers — just learning, drawn for kids.' }
      ]
    },
    languages: {
      title: 'Languages Guide',
      subtitle: 'Yoruba, Igbo, Hausa & more',
      accent: '#10b981',
      accent2: '#06b6d4',
      icon: '🌍',
      steps: [
        { ico:'🗣️', h:'Pick your language',            t:'Choose Yoruba, Igbo, Hausa, French, or any of the supported languages — start at your level.' },
        { ico:'📚', h:'Learn the basics',                t:'Greetings, numbers, family words, common phrases — clear lessons with how to pronounce each word.' },
        { ico:'🔊', h:'Hear the pronunciation',          t:'Tap any word to hear it spoken correctly — repeat aloud to build your speaking confidence.' },
        { ico:'📝', h:'Practise with quizzes',           t:'Quick games and quizzes lock in what you have learnt — short, fun, and effective.' }
      ]
    }
  };

  // ───────── Inject styles once ─────────
  function injectStyles(){
    if (document.getElementById('lt-help-styles-v2')) return;
    var s = document.createElement('style');
    s.id = 'lt-help-styles-v2';
    s.textContent = [
      /* ── Backdrop ── */
      '.lth-back{position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(ellipse at center,rgba(15,23,42,.85),rgba(2,6,15,.95));backdrop-filter:blur(14px) saturate(120%);-webkit-backdrop-filter:blur(14px) saturate(120%);animation:lthFadeIn .35s cubic-bezier(.16,1,.3,1)}',
      '.lth-back.closing{animation:lthFadeOut .25s ease-in forwards}',

      /* Animated grid background */
      '.lth-back::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);background-size:48px 48px;-webkit-mask-image:radial-gradient(ellipse at center,black 30%,transparent 75%);mask-image:radial-gradient(ellipse at center,black 30%,transparent 75%);animation:lthGridDrift 30s linear infinite;pointer-events:none}',

      /* Particles */
      '.lth-particles{position:absolute;inset:0;overflow:hidden;pointer-events:none}',
      '.lth-particle{position:absolute;width:4px;height:4px;border-radius:50%;background:var(--lth-accent,#3b82f6);box-shadow:0 0 14px var(--lth-accent,#3b82f6);opacity:.7;animation:lthFloat var(--lth-dur,12s) ease-in-out infinite;animation-delay:var(--lth-delay,0s)}',

      /* ── Card ── */
      '.lth-card{position:relative;width:100%;max-width:520px;max-height:calc(100vh - 40px);overflow:hidden;display:flex;flex-direction:column;border-radius:24px;background:linear-gradient(160deg,rgba(20,28,46,.96),rgba(10,16,30,.98));border:1px solid rgba(255,255,255,.08);box-shadow:0 30px 90px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.04),0 0 80px var(--lth-glow,rgba(59,130,246,.15));font-family:"Plus Jakarta Sans","Inter",system-ui,sans-serif;color:#fff;animation:lthCardIn .5s cubic-bezier(.16,1,.3,1)}',
      '.lth-back.closing .lth-card{animation:lthCardOut .25s ease-in forwards}',

      /* Gradient border glow on top */
      '.lth-card::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--lth-accent,#3b82f6),var(--lth-accent2,#8b5cf6),var(--lth-accent,#3b82f6),transparent);background-size:200% 100%;animation:lthShimmer 4s linear infinite;border-radius:24px 24px 0 0;pointer-events:none}',

      /* Inner glow */
      '.lth-card::after{content:"";position:absolute;inset:0;border-radius:24px;background:radial-gradient(circle at 50% -10%,var(--lth-glow,rgba(59,130,246,.15)),transparent 60%);pointer-events:none}',

      /* ── Header ── */
      '.lth-head{position:relative;z-index:1;padding:22px 24px 16px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-shrink:0}',
      '.lth-head-l{display:flex;gap:14px;align-items:flex-start;flex:1;min-width:0}',
      '.lth-icon-wrap{position:relative;width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;background:linear-gradient(135deg,var(--lth-accent,#3b82f6),var(--lth-accent2,#8b5cf6));box-shadow:0 8px 24px var(--lth-glow,rgba(59,130,246,.4));flex-shrink:0;animation:lthIconPulse 3s ease-in-out infinite}',
      '.lth-icon-wrap::before{content:"";position:absolute;inset:-4px;border-radius:18px;background:linear-gradient(135deg,var(--lth-accent,#3b82f6),var(--lth-accent2,#8b5cf6));opacity:.3;filter:blur(10px);z-index:-1}',
      '.lth-head-text{min-width:0;flex:1}',
      '.lth-title{font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:1.18rem;line-height:1.2;letter-spacing:-.01em;margin:0 0 4px;color:#fff;background:linear-gradient(135deg,#fff,#cbd5e1);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}',
      '.lth-sub{font-size:.78rem;color:rgba(255,255,255,.55);font-weight:500;letter-spacing:.01em}',
      '.lth-close{flex-shrink:0;width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.7);cursor:pointer;font-size:1rem;transition:all .2s;display:flex;align-items:center;justify-content:center;font-family:inherit}',
      '.lth-close:hover{background:rgba(255,255,255,.1);color:#fff;transform:rotate(90deg)}',

      /* ── Progress dots ── */
      '.lth-dots{position:relative;z-index:1;display:flex;gap:6px;padding:14px 24px 0;flex-shrink:0}',
      '.lth-dot{flex:1;height:4px;border-radius:100px;background:rgba(255,255,255,.08);overflow:hidden;position:relative;transition:all .3s}',
      '.lth-dot.done{background:rgba(255,255,255,.18)}',
      '.lth-dot.active{background:rgba(255,255,255,.08)}',
      '.lth-dot.active::after{content:"";position:absolute;left:0;top:0;height:100%;width:100%;background:linear-gradient(90deg,var(--lth-accent,#3b82f6),var(--lth-accent2,#8b5cf6));animation:lthFill .55s cubic-bezier(.16,1,.3,1) forwards;border-radius:100px}',
      '.lth-dot.done::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--lth-accent,#3b82f6),var(--lth-accent2,#8b5cf6));border-radius:100px}',

      /* ── Body ── */
      '.lth-body{position:relative;z-index:1;padding:18px 24px 4px;overflow-y:auto;flex:1;min-height:0;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent}',
      '.lth-body::-webkit-scrollbar{width:6px}',
      '.lth-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:10px}',

      /* Step (one at a time, animated swap) */
      '.lth-step{display:flex;gap:16px;align-items:flex-start;padding:18px;background:linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.015));border:1px solid rgba(255,255,255,.07);border-radius:16px;animation:lthStepIn .4s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}',
      '.lth-step::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,var(--lth-accent,#3b82f6),var(--lth-accent2,#8b5cf6));opacity:.8}',
      '.lth-step-ico{flex-shrink:0;width:46px;height:46px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:13px;box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}',
      '.lth-step-text{flex:1;min-width:0}',
      '.lth-step-num{font-family:"JetBrains Mono",monospace;font-size:.65rem;color:var(--lth-accent,#3b82f6);font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px;display:block}',
      '.lth-step-h{font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:1rem;color:#fff;margin-bottom:6px;line-height:1.3}',
      '.lth-step-t{font-size:.86rem;color:rgba(255,255,255,.7);line-height:1.55}',

      /* ── Footer ── */
      '.lth-foot{position:relative;z-index:1;padding:16px 24px 20px;border-top:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;flex-shrink:0;background:linear-gradient(180deg,transparent,rgba(0,0,0,.15))}',
      '.lth-check{display:flex;align-items:center;gap:8px;font-size:.78rem;color:rgba(255,255,255,.55);cursor:pointer;user-select:none;font-weight:500}',
      '.lth-check input{accent-color:var(--lth-accent,#3b82f6);cursor:pointer;width:14px;height:14px}',
      '.lth-check:hover{color:rgba(255,255,255,.8)}',

      '.lth-btns{display:flex;gap:8px;align-items:center}',
      '.lth-btn{font-family:"Bricolage Grotesque",sans-serif;font-weight:700;font-size:.82rem;padding:10px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#fff;cursor:pointer;transition:all .2s;white-space:nowrap;display:inline-flex;align-items:center;gap:6px}',
      '.lth-btn:hover:not(:disabled){background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.18)}',
      '.lth-btn:disabled{opacity:.35;cursor:not-allowed}',
      '.lth-btn-primary{background:linear-gradient(135deg,var(--lth-accent,#3b82f6),var(--lth-accent2,#8b5cf6));border-color:transparent;box-shadow:0 8px 24px var(--lth-glow,rgba(59,130,246,.4))}',
      '.lth-btn-primary:hover:not(:disabled){filter:brightness(1.12);transform:translateY(-1px);box-shadow:0 12px 30px var(--lth-glow,rgba(59,130,246,.5))}',

      /* ── Floating Help button (FAB) ── */
      '.lth-fab{position:fixed;bottom:22px;left:22px;z-index:9997;width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--lth-accent,#3b82f6),var(--lth-accent2,#8b5cf6));color:#fff;font-size:1.4rem;font-weight:900;font-family:"Bricolage Grotesque",sans-serif;box-shadow:0 10px 30px var(--lth-glow,rgba(59,130,246,.4)),inset 0 0 0 1px rgba(255,255,255,.12);transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s,background .3s;animation:lthFabIn .5s cubic-bezier(.16,1,.3,1)}',
      '.lth-fab:hover{transform:translateY(-3px) scale(1.06);box-shadow:0 15px 40px var(--lth-glow,rgba(59,130,246,.55))}',
      '.lth-fab:active{transform:translateY(-1px) scale(.98)}',
      '.lth-fab.open{transform:rotate(45deg);background:linear-gradient(135deg,#475569,#64748b)}',
      '.lth-fab.open:hover{transform:rotate(45deg) scale(1.06)}',

      /* Pulse halo */
      '.lth-fab::before{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid var(--lth-accent,#3b82f6);opacity:.6;animation:lthHalo 2.4s ease-out infinite;pointer-events:none}',
      '.lth-fab::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid var(--lth-accent2,#8b5cf6);opacity:.4;animation:lthHalo 2.4s ease-out infinite;animation-delay:1.2s;pointer-events:none}',
      '.lth-fab.open::before,.lth-fab.open::after{display:none}',

      /* Floating tooltip on FAB */
      '.lth-fab-tip{position:fixed;bottom:34px;left:84px;z-index:9996;font-size:.78rem;color:rgba(255,255,255,.85);background:rgba(15,23,42,.95);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.1);box-shadow:0 6px 20px rgba(0,0,0,.4);font-family:"Plus Jakarta Sans",sans-serif;font-weight:600;pointer-events:none;opacity:0;transform:translateX(-6px);transition:all .25s;white-space:nowrap}',
      '.lth-fab-tip::before{content:"";position:absolute;left:-5px;top:50%;transform:translateY(-50%);border-width:5px 5px 5px 0;border-style:solid;border-color:transparent rgba(15,23,42,.95) transparent transparent}',
      '.lth-fab:hover ~ .lth-fab-tip{opacity:1;transform:translateX(0)}',

      /* ── Animations ── */
      '@keyframes lthFadeIn{from{opacity:0}to{opacity:1}}',
      '@keyframes lthFadeOut{from{opacity:1}to{opacity:0}}',
      '@keyframes lthCardIn{from{opacity:0;transform:translateY(20px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}',
      '@keyframes lthCardOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(10px) scale(.97)}}',
      '@keyframes lthStepIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}',
      '@keyframes lthShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}',
      '@keyframes lthFill{from{width:0%}to{width:100%}}',
      '@keyframes lthIconPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}',
      '@keyframes lthHalo{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.6);opacity:0}}',
      '@keyframes lthFabIn{from{opacity:0;transform:scale(0) rotate(-180deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}',
      '@keyframes lthGridDrift{from{background-position:0 0,0 0}to{background-position:48px 48px,48px 48px}}',
      '@keyframes lthFloat{0%,100%{transform:translate(0,0)}25%{transform:translate(20px,-30px)}50%{transform:translate(-15px,-50px)}75%{transform:translate(-25px,-20px)}}',

      /* ── Mobile ── */
      '@media (max-width:560px){',
      '.lth-card{max-width:100%;border-radius:20px}',
      '.lth-head{padding:18px 18px 14px}',
      '.lth-body{padding:14px 18px 4px}',
      '.lth-foot{padding:14px 18px 16px}',
      '.lth-title{font-size:1.05rem}',
      '.lth-step{padding:14px;gap:12px}',
      '.lth-step-ico{width:40px;height:40px;font-size:1.3rem}',
      '.lth-step-h{font-size:.92rem}',
      '.lth-step-t{font-size:.82rem}',
      '.lth-fab{width:48px;height:48px;font-size:1.25rem;bottom:16px;left:16px}',
      '.lth-fab-tip{display:none}',
      '.lth-btn{padding:9px 14px;font-size:.78rem}',
      '.lth-check{font-size:.74rem}',
      '}',

      /* Reduce motion */
      '@media (prefers-reduced-motion:reduce){',
      '.lth-back,.lth-card,.lth-step,.lth-fab,.lth-icon-wrap,.lth-particle{animation:none !important}',
      '.lth-card::before{animation:none}',
      '.lth-fab::before,.lth-fab::after{display:none}',
      '}'
    ].join('');
    document.head.appendChild(s);
  }

  // ───────── State ─────────
  var state = { kind:null, step:0, guide:null, total:0 };

  // ───────── Helpers ─────────
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(c){
      return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c];
    });
  }

  function hexToGlow(hex, alpha){
    if (!hex || hex.charAt(0) !== '#') return 'rgba(59,130,246,.35)';
    var h = hex.substring(1);
    if (h.length === 3) h = h.charAt(0)+h.charAt(0)+h.charAt(1)+h.charAt(1)+h.charAt(2)+h.charAt(2);
    var r = parseInt(h.substring(0,2),16);
    var g = parseInt(h.substring(2,4),16);
    var b = parseInt(h.substring(4,6),16);
    return 'rgba('+r+','+g+','+b+','+(alpha||0.35)+')';
  }

  function close(){
    var back = document.getElementById('lth-overlay');
    if (!back) return;
    back.classList.add('closing');
    setTimeout(function(){ if (back.parentNode) back.parentNode.removeChild(back); }, 240);
    var fab = document.getElementById('lth-fab');
    if (fab) fab.classList.remove('open');
    document.removeEventListener('keydown', onKey);
  }

  function buildParticles(accent){
    var html = '';
    for (var i=0; i<14; i++){
      var x = Math.random()*100;
      var y = 60 + Math.random()*40;
      var d = 8 + Math.random()*10;
      var dl = Math.random()*8;
      var sz = 2 + Math.random()*4;
      html += '<div class="lth-particle" style="left:'+x+'%;top:'+y+'%;width:'+sz+'px;height:'+sz+'px;--lth-accent:'+accent+';--lth-dur:'+d+'s;--lth-delay:-'+dl+'s"></div>';
    }
    return html;
  }

  function renderStep(){
    var body = document.querySelector('#lth-overlay .lth-body');
    if (!body) return;
    var s = state.guide.steps[state.step];
    body.innerHTML = ''
      + '<div class="lth-step">'
      +   '<div class="lth-step-ico">'+escapeHtml(s.ico)+'</div>'
      +   '<div class="lth-step-text">'
      +     '<span class="lth-step-num">Step '+(state.step+1)+' of '+state.total+'</span>'
      +     '<div class="lth-step-h">'+escapeHtml(s.h)+'</div>'
      +     '<div class="lth-step-t">'+escapeHtml(s.t)+'</div>'
      +   '</div>'
      + '</div>';
    var dots = document.querySelectorAll('#lth-overlay .lth-dot');
    for (var i=0; i<dots.length; i++){
      dots[i].classList.remove('active','done');
      if (i < state.step) dots[i].classList.add('done');
      else if (i === state.step) dots[i].classList.add('active');
    }
    var prev = document.getElementById('lth-prev');
    var next = document.getElementById('lth-next');
    if (prev) prev.disabled = state.step === 0;
    if (next) next.textContent = (state.step === state.total - 1) ? 'Got it ✓' : 'Next →';
  }

  function go(dir){
    var newStep = state.step + dir;
    if (newStep < 0) return;
    if (newStep >= state.total){
      var dont = document.getElementById('lth-dont');
      if (dont && dont.checked && state.kind){
        try{ localStorage.setItem(STORAGE_PREFIX + state.kind, '1'); }catch(e){}
      }
      close();
      return;
    }
    state.step = newStep;
    renderStep();
  }

  function onKey(e){
    if (!document.getElementById('lth-overlay')) return;
    if (e.key === 'Escape'){ e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight'){ e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft'){ e.preventDefault(); go(-1); }
  }

  // ───────── Open the help overlay ─────────
  window.openLtTour = function(kind){
    var guide = GUIDES[kind];
    if (!guide) return;
    injectStyles();
    close();
    state = { kind: kind, step: 0, guide: guide, total: guide.steps.length };

    var dotsHtml = '';
    for (var i=0; i<state.total; i++) dotsHtml += '<div class="lth-dot"></div>';

    var glow = hexToGlow(guide.accent, 0.35);

    var back = document.createElement('div');
    back.id = 'lth-overlay';
    back.className = 'lth-back';
    back.style.setProperty('--lth-accent', guide.accent);
    back.style.setProperty('--lth-accent2', guide.accent2 || guide.accent);
    back.style.setProperty('--lth-glow', glow);

    back.innerHTML = ''
      + '<div class="lth-particles">'+buildParticles(guide.accent)+'</div>'
      + '<div class="lth-card" role="dialog" aria-modal="true" aria-labelledby="lth-title">'
      +   '<div class="lth-head">'
      +     '<div class="lth-head-l">'
      +       '<div class="lth-icon-wrap">'+escapeHtml(guide.icon)+'</div>'
      +       '<div class="lth-head-text">'
      +         '<div class="lth-title" id="lth-title">'+escapeHtml(guide.title)+'</div>'
      +         '<div class="lth-sub">'+escapeHtml(guide.subtitle)+'</div>'
      +       '</div>'
      +     '</div>'
      +     '<button class="lth-close" data-act="close" aria-label="Close help">✕</button>'
      +   '</div>'
      +   '<div class="lth-dots">'+dotsHtml+'</div>'
      +   '<div class="lth-body"></div>'
      +   '<div class="lth-foot">'
      +     '<label class="lth-check"><input type="checkbox" id="lth-dont"> Don\'t show again</label>'
      +     '<div class="lth-btns">'
      +       '<button class="lth-btn" id="lth-prev" data-act="prev">← Back</button>'
      +       '<button class="lth-btn lth-btn-primary" id="lth-next" data-act="next">Next →</button>'
      +     '</div>'
      +   '</div>'
      + '</div>';

    document.body.appendChild(back);
    renderStep();

    var fab = document.getElementById('lth-fab');
    if (fab) fab.classList.add('open');

    back.addEventListener('click', function(e){
      var t = e.target;
      var act = t && t.getAttribute && t.getAttribute('data-act');
      if (act === 'close'){ close(); }
      else if (act === 'prev'){ go(-1); }
      else if (act === 'next'){ go(1); }
      else if (t === back){ close(); }
    });

    document.addEventListener('keydown', onKey);
  };

  // ───────── Floating toggle button ─────────
  function buildFab(kind){
    injectStyles();
    var existing = document.getElementById('lth-fab');
    if (existing) existing.remove();
    var existingTip = document.getElementById('lth-fab-tip');
    if (existingTip) existingTip.remove();

    var guide = GUIDES[kind];
    if (!guide) return;

    var btn = document.createElement('button');
    btn.id = 'lth-fab';
    btn.className = 'lth-fab';
    btn.title = 'Help & guide';
    btn.setAttribute('aria-label', 'Toggle help guide');
    btn.setAttribute('data-kind', kind);
    btn.style.setProperty('--lth-accent', guide.accent);
    btn.style.setProperty('--lth-accent2', guide.accent2 || guide.accent);
    btn.style.setProperty('--lth-glow', hexToGlow(guide.accent, 0.45));
    btn.innerHTML = '<span style="display:inline-block;line-height:1">?</span>';

    var tip = document.createElement('div');
    tip.id = 'lth-fab-tip';
    tip.className = 'lth-fab-tip';
    tip.textContent = 'Need help?';

    btn.addEventListener('click', function(){
      var open = document.getElementById('lth-overlay');
      if (open){ close(); }
      else { window.openLtTour(kind); }
    });

    document.body.appendChild(btn);
    document.body.appendChild(tip);
  }

  // ───────── Public entry: maybe show tour, always add FAB ─────────
  window.maybeShowLtTour = function(kind){
    if (!GUIDES[kind]) return;
    buildFab(kind);
    var seen = false;
    try{ seen = (localStorage.getItem(STORAGE_PREFIX + kind) === '1'); }catch(e){}
    if (seen) return;
    setTimeout(function(){ window.openLtTour(kind); }, 400);
  };

  // ───────── Public entry: just show FAB without auto-tour ─────────
  window.showLtHelpFab = function(kind){
    if (!GUIDES[kind]) return;
    buildFab(kind);
  };

  // ───────── Public entry: hide FAB ─────────
  window.hideLtHelpFab = function(){
    var el = document.getElementById('lth-fab');
    if (el) el.remove();
    var tip = document.getElementById('lth-fab-tip');
    if (tip) tip.remove();
    close();
  };

  // ───────── Page-aware FAB attachment ─────────
  function detectActivePage(){
    var pages = document.querySelectorAll('.page.active');
    if (!pages.length) return null;
    return pages[0].id;
  }

  function pageToHelpKind(pageId){
    switch(pageId){
      case 'pg-classroom': return 'classroom';
      case 'pg-exam':      return 'exam-centre';
      case 'pg-homework':  return 'homework';
      case 'pg-essay':     return 'essay';
      case 'pg-parent':    return 'parent';
      case 'pg-guidance':  return 'guidance';
      case 'pg-kids':      return 'kids';
      case 'pg-languages': return 'languages';
      default: return null;
    }
  }

  function startPageWatcher(){
    var lastPage = detectActivePage();
    var lastKind = pageToHelpKind(lastPage);
    if (lastKind) buildFab(lastKind);

    setInterval(function(){
      var current = detectActivePage();
      if (current === lastPage) return;
      lastPage = current;
      var kind = pageToHelpKind(current);
      if (!kind){
        // Pages without a help kind (landing, beta) → remove FAB
        var el = document.getElementById('lth-fab');
        if (el) el.remove();
        var tip = document.getElementById('lth-fab-tip');
        if (tip) tip.remove();
        lastKind = null;
        return;
      }
      // Don't override the lesson/objective FAB while still in classroom — they are more contextual
      var existing = document.getElementById('lth-fab');
      var existingKind = existing ? existing.getAttribute('data-kind') : null;
      if (current === 'pg-classroom' && (existingKind === 'lesson' || existingKind === 'objective')){
        return;
      }
      buildFab(kind);
      lastKind = kind;
    }, 600);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', startPageWatcher);
  } else {
    startPageWatcher();
  }

})();
