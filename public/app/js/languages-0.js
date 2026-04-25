
// ══════════════ LANGUAGE MODULE DATA ══════════════
window.LT_LANGUAGES = {
  yoruba: {
    name:'Yorùbá', flag:'🌴', color:'#dc2626',
    intro:'Yorùbá is a tonal language spoken across south-western Nigeria. Every word\'s meaning depends on its tone — high (́), mid (unmarked), and low (̀).',
    greetings:[
      {yor:'Ẹ káàrọ̀',         en:'Good morning',          note:'Used from dawn until about 11am'},
      {yor:'Ẹ káàsán',         en:'Good afternoon',        note:'From about noon until 4pm'},
      {yor:'Ẹ kú àárọ̀',       en:'Hello (morning form)',  note:'Respectful, any time in morning'},
      {yor:'Báwo ni?',         en:'How are you?',          note:'Informal'},
      {yor:'Mo wà dáadáa',     en:'I am fine',             note:'Standard reply'},
      {yor:'Ẹ ṣé',             en:'Thank you',             note:'Very common'},
      {yor:'Jọ̀ọ́',              en:'Please',                note:''},
      {yor:'Ẹ káàbọ̀',          en:'Welcome',               note:'When receiving someone'},
      {yor:'Ó dàbọ̀',           en:'Goodbye',               note:'Literally "until we meet"'},
    ],
    phrases:[
      {yor:'Orúkọ mi ni…',     en:'My name is…'},
      {yor:'Ṣé o ti jẹun?',    en:'Have you eaten?'},
      {yor:'Mo fẹ́ràn ẹ',       en:'I love you'},
      {yor:'Mo nílò iranlọ́wọ́',  en:'I need help'},
      {yor:'Níbo ni ó wà?',    en:'Where is it?'},
    ],
    tip:'Tip: Pay attention to tone marks. "Okó" (hoe) and "Òkó" (penis) look similar but mean different things — tone matters.'
  },
  igbo: {
    name:'Igbo', flag:'🌿', color:'#059669',
    intro:'Igbo is spoken across south-eastern Nigeria. Greetings are central to Igbo culture — skipping them is considered rude.',
    greetings:[
      {yor:'Ndeewo',           en:'Hello / greetings',     note:'Respectful, universal'},
      {yor:'Ụtụtụ ọma',        en:'Good morning',          note:''},
      {yor:'Ehihie ọma',       en:'Good afternoon',        note:''},
      {yor:'Mgbede ọma',       en:'Good evening',          note:''},
      {yor:'Kedu?',            en:'How are you?',          note:'Most common greeting'},
      {yor:'Ọ dị mma',         en:'I am fine',             note:'Standard reply'},
      {yor:'Daalụ',            en:'Thank you',             note:''},
      {yor:'Biko',             en:'Please',                note:''},
      {yor:'Ka ọ dị',          en:'Goodbye',               note:'Literally "so be it"'},
    ],
    phrases:[
      {yor:'Aha m bụ…',        en:'My name is…'},
      {yor:'I rigọla?',        en:'Have you eaten?'},
      {yor:'A hụrụ m gị n\'anya',en:'I love you'},
      {yor:'Enyere m aka',     en:'Help me'},
      {yor:'Ebee ka ọ dị?',    en:'Where is it?'},
    ],
    tip:'Tip: Igbo uses subdots (ụ, ị, ọ) to mark specific vowel sounds — these change meaning, so learn to read them.'
  },
  hausa: {
    name:'Hausa', flag:'🐪', color:'#f59e0b',
    intro:'Hausa is the most widely spoken language in West Africa. It\'s the language of trade across Northern Nigeria, Niger, Cameroon and beyond.',
    greetings:[
      {yor:'Sannu',            en:'Hello',                 note:'Universal greeting'},
      {yor:'Ina kwana?',       en:'How was your night?',   note:'Morning greeting'},
      {yor:'Ina wuni?',        en:'How was your day?',     note:'Afternoon/evening'},
      {yor:'Lafiya',           en:'I am well',             note:'Standard reply'},
      {yor:'Yaya kake? / kike?',en:'How are you? (m/f)',   note:'Gender matters in Hausa'},
      {yor:'Na gode',          en:'Thank you',             note:''},
      {yor:'Don Allah',        en:'Please',                note:'Literally "for God"'},
      {yor:'Sai anjima',       en:'Goodbye (later today)', note:''},
      {yor:'Sai gobe',         en:'See you tomorrow',      note:''},
    ],
    phrases:[
      {yor:'Sunana…',          en:'My name is…'},
      {yor:'Ka ci abinci?',    en:'Have you eaten?'},
      {yor:'Ina sonka / ki',   en:'I love you (m/f)'},
      {yor:'Ina bukatar taimako',en:'I need help'},
      {yor:'Ina yake?',        en:'Where is it?'},
    ],
    tip:'Tip: Hausa makes gender distinctions — "kake" (you-male), "kike" (you-female). Using the wrong one is noticed immediately.'
  },
  pidgin: {
    name:'Nigerian Pidgin', flag:'🎵', color:'#0284c7',
    intro:'Pidgin is Nigeria\'s most democratic language — spoken by everyone from market traders to university students. No formal rules, just vibes and context.',
    greetings:[
      {yor:'How far?',         en:'How are you?',          note:'Standard casual greeting'},
      {yor:'You good?',        en:'Are you okay?',         note:'Check-in greeting'},
      {yor:'I dey',            en:'I am here / I am fine', note:'Standard reply'},
      {yor:'Wetin dey happen?',en:'What is happening?',    note:'What\'s up'},
      {yor:'Nothing much',     en:'Nothing much',          note:''},
      {yor:'Abeg',             en:'Please',                note:'Very common'},
      {yor:'Thank you o',      en:'Thank you',             note:'The "o" adds emphasis'},
      {yor:'Safe',             en:'Goodbye',               note:'Casual'},
      {yor:'See you later',    en:'See you later',         note:''},
    ],
    phrases:[
      {yor:'My name na…',      en:'My name is…'},
      {yor:'You don chop?',    en:'Have you eaten?'},
      {yor:'I like you die',   en:'I like you a lot'},
      {yor:'Help me abeg',     en:'Please help me'},
      {yor:'Where e dey?',     en:'Where is it?'},
      {yor:'No wahala',        en:'No problem'},
      {yor:'How much?',        en:'How much? (price)'},
      {yor:'E too cost',       en:'It\'s too expensive'},
    ],
    tip:'Tip: Adding "o" at the end of words adds emphasis. "Thank you o" is warmer than "Thank you". "Abeg o" means "please, seriously".'
  }
};

function langOpen(key){
  const d = window.LT_LANGUAGES[key];
  if(!d) return;
  const container = document.getElementById('langContent');
  container.style.display = 'block';
  container.innerHTML = `
    <div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:24px;padding:40px;backdrop-filter:blur(10px);">

      <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
        <span style="font-size:2rem;">${d.flag}</span>
        <div>
          <h2 style="font-family:'Bricolage Grotesque',sans-serif;font-size:1.8rem;font-weight:900;margin:0;color:#fff;">${d.name}</h2>
          <div style="color:rgba(255,255,255,.6);font-size:.85rem;">Beginner module</div>
        </div>
      </div>

      <p style="color:rgba(255,255,255,.85);font-size:1rem;line-height:1.7;margin:0 0 30px;">${d.intro}</p>

      <h3 style="color:#fbbf24;font-family:'Bricolage Grotesque',sans-serif;font-size:1.1rem;font-weight:800;margin:0 0 16px;text-transform:uppercase;letter-spacing:.05em;">Greetings</h3>
      <div style="display:grid;gap:12px;margin-bottom:30px;">
        ${d.greetings.map(g=>`
          <div style="background:rgba(255,255,255,.04);border-left:3px solid ${d.color};padding:14px 18px;border-radius:0 12px 12px 0;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:4px;flex-wrap:wrap;">
              <div style="font-size:1.05rem;font-weight:700;color:#fff;">${g.yor}</div>
              <div style="color:rgba(255,255,255,.7);font-size:.9rem;">${g.en}</div>
            </div>
            ${g.note?`<div style="color:rgba(255,255,255,.5);font-size:.75rem;font-style:italic;">${g.note}</div>`:''}
          </div>
        `).join('')}
      </div>

      <h3 style="color:#fbbf24;font-family:'Bricolage Grotesque',sans-serif;font-size:1.1rem;font-weight:800;margin:0 0 16px;text-transform:uppercase;letter-spacing:.05em;">Useful Phrases</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin-bottom:30px;">
        ${d.phrases.map(p=>`
          <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);padding:16px;border-radius:12px;">
            <div style="font-size:1rem;font-weight:700;color:#fff;margin-bottom:4px;">${p.yor}</div>
            <div style="color:rgba(255,255,255,.65);font-size:.85rem;">${p.en}</div>
          </div>
        `).join('')}
      </div>

      <div style="background:linear-gradient(135deg,${d.color}22,${d.color}11);border:1px solid ${d.color}55;border-radius:16px;padding:18px 20px;color:#fff;font-size:.9rem;line-height:1.6;">
        💡 ${d.tip}
      </div>

      <button onclick="document.getElementById('langContent').style.display='none';window.scrollTo({top:0,behavior:'smooth'})" style="margin-top:24px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#fff;padding:10px 22px;border-radius:100px;font-weight:700;font-size:.85rem;cursor:pointer;">← Back to language picker</button>
    </div>
  `;
  window.scrollTo({top:container.offsetTop-40,behavior:'smooth'});
}
