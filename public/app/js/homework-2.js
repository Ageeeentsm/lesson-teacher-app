
// ══════════════ GAME OVERLAY HELPERS ══════════════
function kOpenGame(title, sub){
  document.getElementById('kGameTitle').textContent = title;
  document.getElementById('kGameSub').textContent = sub;
  document.getElementById('kGameOverlay').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function kCloseGame(){
  document.getElementById('kGameOverlay').style.display = 'none';
  document.body.style.overflow = '';
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

function kAwardStars(count){
  var el = document.getElementById('kStarsVal');
  if (el) {
    var cur = parseInt(el.textContent) || 0;
    el.textContent = cur + count;
    el.style.transform = 'scale(1.3)';
    setTimeout(function(){ el.style.transform = ''; }, 300);
  }
}

function kSpeakText(text){
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  }
}

// ══════════════ GAME 1: MATCHING ══════════════
function kPlayMatch(){
  kOpenGame('🎯 Matching Game', 'Match the picture to the word!');
  kMatchStart();
}

function kMatchStart(){
  var lessons = kLessons[kCat] || kLessons.phonics;
  var shuffled = lessons.slice().sort(function(){ return Math.random() - 0.5; }).slice(0, 6);
  window._kMatch = {
    pairs: shuffled,
    flipped: [],
    matched: [],
    moves: 0,
    startTime: Date.now(),
    cardOrder: null
  };
  kMatchRender();
}

function kMatchRender(){
  var m = window._kMatch;
  var cards = [];
  for (var i = 0; i < m.pairs.length; i++) {
    cards.push({ type: 'emoji', val: m.pairs[i].e, pair: i });
    cards.push({ type: 'word', val: m.pairs[i].w, pair: i });
  }
  if (!m.cardOrder) {
    m.cardOrder = [];
    for (var j = 0; j < cards.length; j++) m.cardOrder.push(j);
    m.cardOrder.sort(function(){ return Math.random() - 0.5; });
  }

  var body = document.getElementById('kGameBody');
  var html = '';
  html += '<div style="display:flex;justify-content:space-between;background:rgba(255,255,255,.05);padding:14px 18px;border-radius:16px;margin-bottom:16px;">';
  html += '<div><div style="color:rgba(255,255,255,.5);font-size:.7rem;font-weight:700;text-transform:uppercase;">Moves</div><div style="color:#fbbf24;font-size:1.5rem;font-weight:900;font-family:\'Bricolage Grotesque\',sans-serif;">' + m.moves + '</div></div>';
  html += '<div><div style="color:rgba(255,255,255,.5);font-size:.7rem;font-weight:700;text-transform:uppercase;">Matched</div><div style="color:#10b981;font-size:1.5rem;font-weight:900;font-family:\'Bricolage Grotesque\',sans-serif;">' + m.matched.length + '/' + m.pairs.length + '</div></div>';
  html += '<button onclick="kMatchStart();kMatchRender()" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);padding:8px 16px;border-radius:100px;font-size:.82rem;font-weight:700;cursor:pointer;">🔄 Restart</button>';
  html += '</div>';

  html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;">';
  for (var k = 0; k < m.cardOrder.length; k++) {
    var idx = m.cardOrder[k];
    var card = cards[idx];
    var isFlipped = m.flipped.indexOf(idx) !== -1;
    var isMatched = m.matched.indexOf(card.pair) !== -1;
    var show = isFlipped || isMatched;
    var bg = isMatched ? 'linear-gradient(135deg,#10b981,#34d399)' : (show ? '#fff' : 'linear-gradient(135deg,#1e40af,#3b82f6)');
    var content = show ? (card.type === 'emoji' ? card.val : '<div style="font-size:.95rem;color:' + (isMatched ? '#fff' : '#0a1628') + ';font-weight:900;font-family:\'Bricolage Grotesque\',sans-serif;">' + card.val + '</div>') : '?';
    var fontSize = (card.type === 'emoji' && show) ? '3rem' : (show ? '.95rem' : '1.8rem');
    var color = show ? (isMatched ? '#fff' : '#0a1628') : 'rgba(255,255,255,.4)';
    var disabledAttr = (isMatched || isFlipped) ? 'disabled' : '';
    var cursor = (isMatched || isFlipped) ? 'default' : 'pointer';
    html += '<button onclick="kMatchFlip(' + idx + ')" ' + disabledAttr + ' style="aspect-ratio:1;background:' + bg + ';border:none;border-radius:16px;font-size:' + fontSize + ';color:' + color + ';font-weight:900;cursor:' + cursor + ';box-shadow:0 4px 12px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;">' + content + '</button>';
  }
  html += '</div>';

  body.innerHTML = html;

  if (m.matched.length === m.pairs.length) {
    setTimeout(function(){
      var time = Math.round((Date.now() - m.startTime) / 1000);
      var stars = Math.max(1, Math.min(3, Math.floor(30 - m.moves / 2)));
      kAwardStars(stars);
      var winHtml = '<div style="background:linear-gradient(135deg,rgba(16,185,129,.2),rgba(34,211,149,.1));border:1px solid rgba(16,185,129,.4);border-radius:20px;padding:30px;text-align:center;margin-top:16px;">';
      winHtml += '<div style="font-size:4rem;margin-bottom:8px;">🎉</div>';
      winHtml += '<div style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:1.6rem;font-weight:900;color:#fff;margin-bottom:8px;">You Win!</div>';
      winHtml += '<div style="color:#6ee7b7;margin-bottom:16px;">Completed in ' + m.moves + ' moves · ' + time + ' seconds</div>';
      var starHtml = '';
      for (var s = 0; s < 3; s++) starHtml += (s < stars ? '⭐' : '☆');
      winHtml += '<div style="font-size:2.5rem;margin-bottom:16px;">' + starHtml + '</div>';
      winHtml += '<div style="display:flex;gap:10px;justify-content:center;">';
      winHtml += '<button onclick="kMatchStart();kMatchRender()" style="background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#0a1628;border:none;padding:12px 24px;border-radius:100px;font-weight:800;cursor:pointer;">🔄 Play Again</button>';
      winHtml += '<button onclick="kCloseGame()" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);padding:12px 24px;border-radius:100px;font-weight:700;cursor:pointer;">Done</button>';
      winHtml += '</div></div>';
      body.innerHTML += winHtml;
    }, 400);
  }
}

function kMatchFlip(idx){
  var m = window._kMatch;
  if (m.flipped.length >= 2) return;
  var cards = [];
  for (var i = 0; i < m.pairs.length; i++) {
    cards.push({ type: 'emoji', val: m.pairs[i].e, pair: i });
    cards.push({ type: 'word', val: m.pairs[i].w, pair: i });
  }
  if (m.flipped.indexOf(idx) !== -1 || m.matched.indexOf(cards[idx].pair) !== -1) return;
  m.flipped.push(idx);
  kMatchRender();

  if (m.flipped.length === 2) {
    m.moves++;
    var a = m.flipped[0], b = m.flipped[1];
    if (cards[a].pair === cards[b].pair) {
      setTimeout(function(){
        m.matched.push(cards[a].pair);
        m.flipped = [];
        kSpeakText(m.pairs[cards[a].pair].w);
        kMatchRender();
      }, 600);
    } else {
      setTimeout(function(){
        m.flipped = [];
        kMatchRender();
      }, 900);
    }
  }
}

// ══════════════ GAME 2: PICTURE QUIZ ══════════════
function kPlayQuiz(){
  kOpenGame('❓ Picture Quiz', 'What is this? Choose the right word!');
  kQuizStart();
}

function kQuizStart(){
  var lessons = kLessons[kCat] || kLessons.phonics;
  if (lessons.length < 4) {
    document.getElementById('kGameBody').innerHTML = '<div style="text-align:center;color:rgba(255,255,255,.7);padding:40px;">Not enough items in this category. Try Phonics or Animals!</div>';
    return;
  }
  window._kQuiz = {
    questions: lessons.slice().sort(function(){ return Math.random() - 0.5; }).slice(0, Math.min(10, lessons.length)),
    index: 0,
    score: 0,
    wrong: 0
  };
  kQuizRender();
}

function kQuizRender(){
  var q = window._kQuiz;
  var lessons = kLessons[kCat] || kLessons.phonics;
  if (q.index >= q.questions.length) {
    var body = document.getElementById('kGameBody');
    var stars = q.score >= q.questions.length - 1 ? 3 : (q.score >= q.questions.length * 0.6 ? 2 : 1);
    kAwardStars(stars);
    var starStr = '';
    for (var i = 0; i < 3; i++) starStr += (i < stars ? '⭐' : '☆');
    var msg = q.score === q.questions.length ? 'Perfect score! 🌟' : (q.score >= q.questions.length * 0.6 ? 'Great job! Keep practising.' : 'Good try! Play again to improve.');
    body.innerHTML = '<div style="background:linear-gradient(135deg,rgba(16,185,129,.15),rgba(34,211,149,.05));border:1px solid rgba(16,185,129,.4);border-radius:20px;padding:30px;text-align:center;">' +
      '<div style="font-size:4rem;margin-bottom:8px;">🎉</div>' +
      '<div style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:1.6rem;font-weight:900;color:#fff;margin-bottom:8px;">Quiz Complete!</div>' +
      '<div style="color:#6ee7b7;font-size:1.1rem;margin-bottom:4px;">You got ' + q.score + ' out of ' + q.questions.length + ' right</div>' +
      '<div style="color:rgba(255,255,255,.5);font-size:.9rem;margin-bottom:16px;">' + msg + '</div>' +
      '<div style="font-size:2.5rem;margin-bottom:16px;">' + starStr + '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;">' +
      '<button onclick="kQuizStart()" style="background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#0a1628;border:none;padding:12px 24px;border-radius:100px;font-weight:800;cursor:pointer;">🔄 Play Again</button>' +
      '<button onclick="kCloseGame()" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);padding:12px 24px;border-radius:100px;font-weight:700;cursor:pointer;">Done</button>' +
      '</div></div>';
    return;
  }

  var current = q.questions[q.index];
  var wrongs = lessons.filter(function(l){ return l.w !== current.w; }).sort(function(){ return Math.random() - 0.5; }).slice(0, 3);
  var options = [current].concat(wrongs).sort(function(){ return Math.random() - 0.5; });

  var pct = ((q.index + 1) / q.questions.length) * 100;
  var html = '';
  html += '<div style="background:rgba(255,255,255,.05);padding:12px 18px;border-radius:100px;margin-bottom:20px;display:flex;align-items:center;gap:14px;">';
  html += '<div style="flex:1;height:8px;background:rgba(255,255,255,.1);border-radius:100px;overflow:hidden;"><div style="height:100%;background:linear-gradient(90deg,#fbbf24,#f59e0b);width:' + pct + '%;"></div></div>';
  html += '<div style="color:#fbbf24;font-weight:800;font-size:.9rem;">' + (q.index + 1) + '/' + q.questions.length + '</div></div>';
  html += '<div style="background:#fff;border-radius:32px;padding:30px;text-align:center;margin-bottom:20px;box-shadow:0 12px 32px rgba(0,0,0,.3);">';
  html += '<div style="width:180px;height:180px;margin:0 auto 16px;background:' + current.c + ';border-radius:28px;display:flex;align-items:center;justify-content:center;font-size:5.5rem;">' + current.e + '</div>';
  html += '<div style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:1.4rem;font-weight:800;color:#1e40af;">What is this?</div>';
  html += '<button onclick="kSpeakText(\'' + current.w + '\')" style="margin-top:12px;background:rgba(30,64,175,.1);color:#1e40af;border:2px solid rgba(30,64,175,.2);padding:8px 18px;border-radius:100px;font-weight:700;font-size:.85rem;cursor:pointer;">🔊 Hear the word</button>';
  html += '</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">';
  for (var i = 0; i < options.length; i++) {
    html += '<button onclick="kQuizAnswer(\'' + options[i].w.replace(/'/g, "\\'") + '\')" style="background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.15);color:#fff;padding:18px;border-radius:16px;font-family:\'Bricolage Grotesque\',sans-serif;font-size:1.1rem;font-weight:800;cursor:pointer;">' + options[i].w + '</button>';
  }
  html += '</div>';

  document.getElementById('kGameBody').innerHTML = html;
  kSpeakText(current.w);
}

function kQuizAnswer(answer){
  var q = window._kQuiz;
  var current = q.questions[q.index];
  var correct = current.w === answer;
  if (correct) {
    q.score++;
    kSpeakText('Well done!');
  } else {
    q.wrong++;
    kSpeakText('Try again next time');
  }
  var nextLabel = q.index + 1 < q.questions.length ? 'Next Question →' : 'See Results';
  document.getElementById('kGameBody').innerHTML =
    '<div style="text-align:center;padding:40px 20px;">' +
    '<div style="font-size:6rem;margin-bottom:16px;">' + (correct ? '🎉' : '💭') + '</div>' +
    '<div style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:1.8rem;font-weight:900;color:' + (correct ? '#10b981' : '#fbbf24') + ';margin-bottom:8px;">' + (correct ? 'Correct!' : 'Not quite!') + '</div>' +
    '<div style="color:rgba(255,255,255,.85);font-size:1rem;margin-bottom:4px;">' + (correct ? "You're getting it!" : 'This is a <strong>' + current.w + '</strong>') + '</div>' +
    '<div style="font-size:3rem;margin:14px 0;">' + current.e + '</div>' +
    '<button onclick="window._kQuiz.index++;kQuizRender()" style="background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#0a1628;border:none;padding:14px 30px;border-radius:100px;font-weight:800;font-size:1rem;cursor:pointer;">' + nextLabel + '</button>' +
    '</div>';
}

// ══════════════ GAME 3: SING-ALONG ══════════════
var SONGS = {
  abc: {
    title: 'ABC Song', emoji: '🔤', color: '#1e40af',
    lines: [
      { text: 'A, B, C, D, E, F, G', say: 'A B C D E F G' },
      { text: 'H, I, J, K, L, M, N, O, P', say: 'H I J K L M N O P' },
      { text: 'Q, R, S, T, U, V', say: 'Q R S T U V' },
      { text: 'W, X, Y, and Z', say: 'W X Y and Z' },
      { text: 'Now I know my A B Cs', say: 'Now I know my A B Cs' },
      { text: "Next time won't you sing with me?", say: "Next time won't you sing with me" }
    ]
  },
  count: {
    title: 'Counting Song', emoji: '🔢', color: '#059669',
    lines: [
      { text: 'One, two, buckle my shoe', say: 'One two buckle my shoe' },
      { text: 'Three, four, knock at the door', say: 'Three four knock at the door' },
      { text: 'Five, six, pick up sticks', say: 'Five six pick up sticks' },
      { text: 'Seven, eight, lay them straight', say: 'Seven eight lay them straight' },
      { text: 'Nine, ten, a big fat hen!', say: 'Nine ten a big fat hen' }
    ]
  },
  body: {
    title: 'Head, Shoulders, Knees and Toes', emoji: '🧠', color: '#dc2626',
    lines: [
      { text: 'Head, shoulders, knees and toes', say: 'Head shoulders knees and toes' },
      { text: 'Knees and toes!', say: 'Knees and toes' },
      { text: 'Head, shoulders, knees and toes', say: 'Head shoulders knees and toes' },
      { text: 'Knees and toes!', say: 'Knees and toes' },
      { text: 'And eyes and ears and mouth and nose', say: 'And eyes and ears and mouth and nose' },
      { text: 'Head, shoulders, knees and toes', say: 'Head shoulders knees and toes' }
    ]
  },
  colors: {
    title: 'Colours of the Rainbow', emoji: '🌈', color: '#f59e0b',
    lines: [
      { text: 'Red and yellow and pink and green', say: 'Red and yellow and pink and green' },
      { text: 'Purple and orange and blue', say: 'Purple and orange and blue' },
      { text: 'I can sing a rainbow', say: 'I can sing a rainbow' },
      { text: 'Sing a rainbow too!', say: 'Sing a rainbow too' }
    ]
  }
};

function kPlaySing(){
  kOpenGame('🎵 Sing-Along', 'Learn with songs!');
  kSingMenu();
}

function kSingMenu(){
  var html = '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;">';
  for (var key in SONGS) {
    var s = SONGS[key];
    html += '<button onclick="kSingStart(\'' + key + '\')" style="background:linear-gradient(135deg,' + s.color + ',' + s.color + '88);border:none;color:#fff;padding:28px 20px;border-radius:24px;cursor:pointer;font-family:inherit;box-shadow:0 8px 24px ' + s.color + '44;">';
    html += '<div style="font-size:3rem;margin-bottom:10px;">' + s.emoji + '</div>';
    html += '<div style="font-family:\'Bricolage Grotesque\',sans-serif;font-weight:900;font-size:1.05rem;margin-bottom:4px;">' + s.title + '</div>';
    html += '<div style="font-size:.8rem;opacity:.85;">Tap to sing!</div>';
    html += '</button>';
  }
  html += '</div>';
  document.getElementById('kGameBody').innerHTML = html;
}

function kSingStart(key){
  var song = SONGS[key];
  window._kSing = { song: song, index: 0, isPlaying: false };
  kSingRender();
}

function kSingRender(){
  var s = window._kSing;
  var song = s.song;
  var html = '<button onclick="kSingStop();kSingMenu()" style="background:none;border:none;color:rgba(255,255,255,.6);font-size:.85rem;cursor:pointer;margin-bottom:14px;">← Choose another song</button>';
  html += '<div style="background:linear-gradient(135deg,' + song.color + ',' + song.color + 'aa);border-radius:32px;padding:36px 24px;text-align:center;color:#fff;margin-bottom:20px;min-height:280px;display:flex;flex-direction:column;justify-content:center;">';
  html += '<div style="font-size:4rem;margin-bottom:16px;">' + song.emoji + '</div>';
  html += '<div style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:1.1rem;font-weight:700;margin-bottom:20px;opacity:.9;">' + song.title + '</div>';
  for (var i = 0; i < song.lines.length; i++) {
    var fs = i === s.index ? '1.5rem' : '.95rem';
    var fw = i === s.index ? '900' : '600';
    var cl = i === s.index ? '#fff' : 'rgba(255,255,255,.5)';
    html += '<div id="kSingLine' + i + '" style="font-family:\'Bricolage Grotesque\',sans-serif;font-size:' + fs + ';font-weight:' + fw + ';color:' + cl + ';margin:6px 0;transition:all .3s;">' + song.lines[i].text + '</div>';
  }
  html += '</div>';
  html += '<div style="display:flex;gap:10px;justify-content:center;">';
  html += '<button onclick="kSingPlay()" id="kSingBtn" style="background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#0a1628;border:none;padding:14px 30px;border-radius:100px;font-weight:800;font-size:1rem;cursor:pointer;">▶️ Play Song</button>';
  html += '<button onclick="kSingStop();window._kSing.index=0;kSingRender()" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);padding:14px 24px;border-radius:100px;font-weight:700;cursor:pointer;">🔄 Restart</button>';
  html += '</div>';
  document.getElementById('kGameBody').innerHTML = html;
}

function kSingPlay(){
  var s = window._kSing;
  if (s.isPlaying) {
    kSingStop();
    return;
  }
  s.isPlaying = true;
  var btn = document.getElementById('kSingBtn');
  if (btn) btn.innerHTML = '⏸️ Pause';
  kSingNextLine();
}

function kSingStop(){
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (window._kSing) {
    window._kSing.isPlaying = false;
    var btn = document.getElementById('kSingBtn');
    if (btn) btn.innerHTML = '▶️ Play Song';
  }
}

function kSingNextLine(){
  var s = window._kSing;
  if (!s || !s.isPlaying) return;
  if (s.index >= s.song.lines.length) {
    kSingStop();
    kAwardStars(2);
    s.index = 0;
    kSingRender();
    setTimeout(function(){
      var body = document.getElementById('kGameBody');
      if (body) body.insertAdjacentHTML('afterbegin',
        '<div style="background:linear-gradient(135deg,rgba(16,185,129,.2),rgba(34,211,149,.1));border:1px solid rgba(16,185,129,.4);border-radius:16px;padding:16px;text-align:center;margin-bottom:14px;"><div style="font-size:2rem;">🎉</div><div style="font-weight:800;color:#6ee7b7;margin:4px 0;">You finished the song!</div><div style="font-size:1.3rem;">⭐⭐</div></div>');
    }, 300);
    return;
  }
  kSingRender();
  var line = s.song.lines[s.index];
  if (window.speechSynthesis) {
    var utter = new SpeechSynthesisUtterance(line.say);
    utter.rate = 0.85;
    utter.pitch = 1.2;
    utter.onend = function(){
      if (!s.isPlaying) return;
      s.index++;
      setTimeout(kSingNextLine, 200);
    };
    window.speechSynthesis.speak(utter);
  } else {
    setTimeout(function(){ s.index++; kSingNextLine(); }, 2000);
  }
}

// ══════════════ GAME 4: CHESS TEACHER ══════════════
var CHESS_PIECES = {
  K: { w: '♔', b: '♚', name: 'King' },
  Q: { w: '♕', b: '♛', name: 'Queen' },
  R: { w: '♖', b: '♜', name: 'Rook' },
  B: { w: '♗', b: '♝', name: 'Bishop' },
  N: { w: '♘', b: '♞', name: 'Knight' },
  P: { w: '♙', b: '♟', name: 'Pawn' }
};

var CHESS_LESSONS = [
  { id: 'intro', title: 'Welcome to Chess!',
    teacher: "Hello! Chess is a great game. The board has 64 squares — 32 light and 32 dark. Each player has 16 pieces. The goal is to trap the opponent's King!",
    board: 'start', highlight: [], showButtons: ['next'], question: null },
  { id: 'board', title: 'The Board',
    teacher: "Look carefully. Rows are called ranks (1 to 8). Columns are called files (a to h). The light square is always on the bottom-right!",
    board: 'empty', highlight: [], showButtons: ['next'], question: null },
  { id: 'king', title: 'Meet the King ♔',
    teacher: "This is the King — the most important piece! The King moves ONE square in any direction. Protect him always!",
    board: 'king-demo', highlight: ['c3','c4','c5','d3','d5','e3','e4','e5'], showButtons: ['next'], question: null },
  { id: 'queen', title: 'Meet the Queen ♕',
    teacher: "The Queen is the strongest piece! She moves any number of squares — horizontally, vertically, or diagonally. Treasure her!",
    board: 'queen-demo', highlight: ['d1','d2','d3','d5','d6','d7','d8','a4','b4','c4','e4','f4','g4','h4','a1','b2','c3','e5','f6','g7','h8','a7','b6','c5','e3','f2','g1'], showButtons: ['next'], question: null },
  { id: 'rook', title: 'Meet the Rook ♖',
    teacher: "The Rook moves in straight lines — up, down, left, right. Any number of squares. Two rooks working together are very powerful.",
    board: 'rook-demo', highlight: ['d1','d2','d3','d5','d6','d7','d8','a4','b4','c4','e4','f4','g4','h4'], showButtons: ['next'], question: null },
  { id: 'bishop', title: 'Meet the Bishop ♗',
    teacher: "The Bishop moves only diagonally. Each bishop stays on one colour for the whole game! If it starts on a light square, it only moves on light squares.",
    board: 'bishop-demo', highlight: ['a1','b2','c3','e5','f6','g7','h8','a7','b6','c5','e3','f2','g1'], showButtons: ['next'], question: null },
  { id: 'knight', title: 'Meet the Knight ♘',
    teacher: "The Knight is tricky! It moves in an L-shape: 2 squares one way, then 1 square sideways. It is the only piece that can jump over others!",
    board: 'knight-demo', highlight: ['c2','e2','b3','f3','b5','f5','c6','e6'], showButtons: ['next'], question: null },
  { id: 'pawn', title: 'Meet the Pawn ♙',
    teacher: "The Pawn is the small soldier! It moves ONE square forward. On its first move, it can move 2 squares. It captures diagonally. When it reaches the end, it becomes a Queen!",
    board: 'pawn-demo', highlight: ['d3','d4'], showButtons: ['next'], question: null },
  { id: 'quiz1', title: 'Quick Question!',
    teacher: "Which piece moves in an L-shape?",
    board: 'empty', highlight: [], showButtons: [],
    question: { options: ['King', 'Queen', 'Knight', 'Bishop'], correct: 2,
      correctSay: 'Excellent! The Knight moves in an L-shape and can jump over pieces.',
      wrongSay: 'Think again! Which piece can jump over others?' } },
  { id: 'quiz2', title: 'Quick Question!',
    teacher: "Which is the MOST powerful piece?",
    board: 'empty', highlight: [], showButtons: [],
    question: { options: ['Rook', 'Queen', 'Bishop', 'King'], correct: 1,
      correctSay: 'Correct! The Queen is the most powerful piece because she can move in any direction.',
      wrongSay: 'Close! The Queen moves in any direction — that makes her the most powerful.' } },
  { id: 'check', title: 'Check and Checkmate!',
    teacher: "When your King is attacked, that's CHECK — you must protect him! When he's attacked and cannot escape, that's CHECKMATE — game over! You win by checkmating your opponent.",
    board: 'checkmate-demo', highlight: ['e1'], showButtons: ['next'], question: null },
  { id: 'practice', title: "You're Ready!",
    teacher: "Fantastic! You know all 6 pieces and the goal of chess. Now try playing! Use the Practice Board below. Remember: protect your King, use your Queen wisely, and have fun!",
    board: 'start', highlight: [], showButtons: ['practice', 'restart'], question: null }
];


function kPlayInstrument(){
  kOpenGame('Music Instruments', 'Learn and play real instruments!');
  window._kInstrument = 'piano';
  kInstrumentRender();
}

var __kAudioCtx = null;
function kGetAudioCtx(){
  if(!__kAudioCtx) __kAudioCtx = new (window.AudioContext||window.webkitAudioContext)();
  return __kAudioCtx;
}

function kPlayTone(freq, type, dur, vol){
  try{
    var ctx = kGetAudioCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type||'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol||0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+(dur||0.5));
    osc.start(); osc.stop(ctx.currentTime+(dur||0.5));
    var nd = document.getElementById('kNoteDisplay');
    if(nd){ nd.textContent = kNoteLabel(freq); setTimeout(function(){nd.textContent='';},600); }
  }catch(e){}
}

function kNoteLabel(f){
  var notes=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  var n=Math.round(12*Math.log2(f/261.63));
  return notes[((n%12)+12)%12]+(4+Math.floor(n/12));
}

function kInstrumentRender(){
  var inst = window._kInstrument||'piano';
  var body = document.getElementById('kGameBody');
  
  var tabs = [{id:'piano',label:'Piano',col:'#2563eb'},{id:'guitar',label:'Guitar',col:'#b45309'},{id:'drums',label:'Drums',col:'#7c3aed'},{id:'violin',label:'Violin',col:'#dc2626'}];
  var html = '<div id="kNoteDisplay" style="text-align:center;font-size:1.8rem;font-weight:900;color:#fbbf24;min-height:44px;margin-bottom:8px;font-family:Bricolage Grotesque,sans-serif;letter-spacing:.05em;"></div>';
  html += '<div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;">';
  tabs.forEach(function(t){
    var active = t.id===inst;
    html += '<button onclick="window._kInstrument=\''+t.id+'\';kInstrumentRender()" style="padding:8px 16px;border-radius:100px;font-weight:700;font-size:.85rem;cursor:pointer;border:2px solid '+(active?t.col:'rgba(255,255,255,.2)')+';background:'+(active?t.col:'transparent')+';color:white;transition:all .2s;">'+t.label+'</button>';
  });
  html += '</div>';

  if(inst==='piano'){
    var whites=[{n:'C4',f:261.63},{n:'D4',f:293.66},{n:'E4',f:329.63},{n:'F4',f:349.23},{n:'G4',f:392},{n:'A4',f:440},{n:'B4',f:493.88},{n:'C5',f:523.25}];
    var blacks=[{n:'C#4',f:277.18,pos:0},{n:'D#4',f:311.13,pos:1},{n:'F#4',f:369.99,pos:3},{n:'G#4',f:415.3,pos:4},{n:'A#4',f:466.16,pos:5}];
    html += '<div style="background:#1a2332;border-radius:16px;padding:14px;margin-bottom:14px;text-align:center;">';
    html += '<div style="display:inline-block;position:relative;user-select:none;">';
    html += '<div style="display:flex;gap:2px;">';
    whites.forEach(function(k,i){
      html += '<div onclick="kPlayTone('+k.f+',\'triangle\')" style="width:44px;height:130px;background:white;border-radius:0 0 8px 8px;cursor:pointer;border:1px solid #ccc;display:flex;align-items:flex-end;justify-content:center;padding-bottom:6px;transition:background .05s;font-size:9px;color:#9ca3af;font-weight:700;" onmousedown="this.style.background=\'#e8e4ff\'" onmouseup="this.style.background=\'white\'" onmouseleave="this.style.background=\'white\'>'+k.n+'</div>';
    });
    html += '</div>';
    html += '<div style="position:absolute;top:0;left:2px;right:2px;height:82px;pointer-events:none;">';
    blacks.forEach(function(k){
      var left = k.pos*46 + 28;
      html += '<div onclick="event.stopPropagation();kPlayTone('+k.f+',\'triangle\')" style="position:absolute;left:'+left+'px;width:28px;height:82px;background:#1e293b;border-radius:0 0 5px 5px;cursor:pointer;pointer-events:all;transition:background .05s;z-index:2;" onmousedown="this.style.background=\'#4b5563\'" onmouseup="this.style.background=\'#1e293b\'" onmouseleave="this.style.background=\'#1e293b\'"></div>';
    });
    html += '</div></div></div>';
    html += '<p style="text-align:center;font-size:.82rem;color:rgba(255,255,255,.5);margin-bottom:8px;">Tap the keys to play notes!</p>';
  
  } else if(inst==='guitar'){
    var gStrings=[{n:'E2',f:82.41,c:'#d97706'},{n:'A2',f:110,c:'#b45309'},{n:'D3',f:146.83,c:'#f59e0b'},{n:'G3',f:196,c:'#059669'},{n:'B3',f:246.94,c:'#2563eb'},{n:'E4',f:329.63,c:'#7c3aed'}];
    html += '<div style="background:#1a2332;border-radius:16px;padding:16px;margin-bottom:14px;">';
    html += '<p style="color:rgba(255,255,255,.6);font-size:.8rem;margin-bottom:12px;text-align:center;">Tap a string to pluck it!</p>';
    gStrings.forEach(function(s){
      html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
      html += '<span style="font-size:.72rem;color:rgba(255,255,255,.4);width:22px;text-align:right;font-weight:700;">'+s.n+'</span>';
      html += '<div onclick="kPlayTone('+s.f+',\'sawtooth\',0.8,0.15)" style="flex:1;height:4px;background:'+s.c+';cursor:pointer;border-radius:2px;transition:height .1s;" onmousedown="this.style.height=\'8px\'" onmouseup="this.style.height=\'4px\'" onmouseleave="this.style.height=\'4px\'"></div>';
      html += '</div>';
    });
    html += '</div>';
  
  } else if(inst==='drums'){
    var pads=[{n:'Kick',f:60,t:'sine',c:'#1d4ed8'},{n:'Snare',f:200,t:'square',c:'#dc2626'},{n:'Hi-Hat',f:800,t:'square',c:'#d97706'},{n:'Tom Hi',f:120,t:'sine',c:'#7c3aed'},{n:'Tom Lo',f:90,t:'sine',c:'#059669'},{n:'Crash',f:600,t:'square',c:'#0e7490'}];
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px;">';
    pads.forEach(function(p){
      html += '<div onclick="kPlayTone('+p.f+',\''+p.t+'\',0.3,0.6)" style="background:'+p.c+';border-radius:14px;padding:22px 10px;text-align:center;cursor:pointer;font-weight:900;font-size:.9rem;color:white;transition:transform .1s;user-select:none;" onmousedown="this.style.transform=\'scale(.94)\'" onmouseup="this.style.transform=\'scale(1)\'" onmouseleave="this.style.transform=\'scale(1)\'">'+p.n+'</div>';
    });
    html += '</div>';
  
  } else if(inst==='violin'){
    var vNotes=[{n:'G3',f:196},{n:'A3',f:220},{n:'B3',f:246.94},{n:'C4',f:261.63},{n:'D4',f:293.66},{n:'E4',f:329.63},{n:'F4',f:349.23},{n:'G4',f:392}];
    html += '<div style="background:#1a2332;border-radius:16px;padding:16px;margin-bottom:14px;">';
    html += '<p style="color:rgba(255,255,255,.6);font-size:.8rem;margin-bottom:12px;text-align:center;">Bow the violin strings!</p>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';
    vNotes.forEach(function(n){
      html += '<button onclick="kPlayTone('+n.f+',\'sawtooth\',0.6,0.18)" style="padding:12px 16px;border-radius:10px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:white;cursor:pointer;font-weight:700;font-size:.9rem;font-family:inherit;transition:background .1s;" onmouseover="this.style.background=\'rgba(220,38,38,.3)\'" onmouseout="this.style.background=\'rgba(255,255,255,.08)\'">'+n.n+'</button>';
    });
    html += '</div></div>';
  }

  html += '<div style="background:rgba(255,255,255,.04);border-radius:14px;padding:12px 16px;font-size:.82rem;color:rgba(255,255,255,.6);line-height:1.6;text-align:center;">Each instrument has a different sound. Experiment and have fun making music!</div>';
  body.innerHTML = html;
}

function kPlayChess(){
  kOpenGame('♟️ Chess Teacher', 'Learn chess step by step');
  window._kChess = { lesson: 0, stars: 0, mode: 'lesson' };
  kChessRender();
}

function kChessRender(){
  var c = window._kChess;
  if (c.mode === 'practice') {
    kChessPracticeRender();
    return;
  }
  var lesson = CHESS_LESSONS[c.lesson];
  var body = document.getElementById('kGameBody');

  var html = '<div style="display:flex;gap:4px;margin-bottom:16px;">';
  for (var i = 0; i < CHESS_LESSONS.length; i++) {
    var bg = i < c.lesson ? '#10b981' : (i === c.lesson ? '#fbbf24' : 'rgba(255,255,255,.1)');
    html += '<div style="flex:1;height:6px;background:' + bg + ';border-radius:100px;"></div>';
  }
  html += '</div>';

  html += '<div style="background:linear-gradient(135deg,#1e40af,#3b82f6);border-radius:20px;padding:20px 22px;margin-bottom:20px;display:flex;gap:14px;align-items:flex-start;">';
  html += '<div style="font-size:2.2rem;flex-shrink:0;">👩‍🏫</div>';
  html += '<div><div style="font-family:\'Bricolage Grotesque\',sans-serif;font-weight:900;color:#fff;font-size:1.05rem;margin-bottom:4px;">' + lesson.title + '</div>';
  html += '<div style="color:rgba(255,255,255,.92);font-size:.92rem;line-height:1.55;">' + lesson.teacher + '</div></div></div>';

  html += '<div id="kChessBoard" style="background:#0a1628;border-radius:16px;padding:10px;margin-bottom:16px;">';
  html += kChessBoardHTML(lesson.board, lesson.highlight);
  html += '</div>';

  if (lesson.question) {
    html += '<div style="background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.25);border-radius:16px;padding:18px;margin-bottom:16px;">';
    html += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">';
    for (var qi = 0; qi < lesson.question.options.length; qi++) {
      html += '<button onclick="kChessAnswer(' + qi + ')" style="background:rgba(255,255,255,.08);border:2px solid rgba(255,255,255,.15);color:#fff;padding:14px;border-radius:12px;font-family:\'Bricolage Grotesque\',sans-serif;font-size:1rem;font-weight:800;cursor:pointer;">' + lesson.question.options[qi] + '</button>';
    }
    html += '</div></div>';
  }

  html += '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">';
  if (c.lesson > 0) html += '<button onclick="kChessPrev()" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);padding:12px 22px;border-radius:100px;font-weight:700;cursor:pointer;">← Back</button>';
  if (lesson.showButtons.indexOf('next') !== -1) html += '<button onclick="kChessNext()" style="background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#0a1628;border:none;padding:12px 26px;border-radius:100px;font-weight:800;cursor:pointer;">Next →</button>';
  if (lesson.showButtons.indexOf('practice') !== -1) html += '<button onclick="kChessStartPractice()" style="background:linear-gradient(135deg,#10b981,#34d399);color:#fff;border:none;padding:12px 26px;border-radius:100px;font-weight:800;cursor:pointer;">Play Chess Now!</button>';
  if (lesson.showButtons.indexOf('restart') !== -1) html += '<button onclick="window._kChess.lesson=0;kChessRender()" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);padding:12px 22px;border-radius:100px;font-weight:700;cursor:pointer;">🔄 Restart</button>';
  html += '</div>';

  body.innerHTML = html;

  if (lesson.teacher && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(lesson.teacher);
    u.rate = 0.9; u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  }
}

function kChessBoardHTML(type, highlights){
  var files = ['a','b','c','d','e','f','g','h'];
  var board = {};
  if (type === 'start') {
    var back = ['R','N','B','Q','K','B','N','R'];
    for (var i = 0; i < 8; i++) {
      board[files[i] + '1'] = { p: back[i], c: 'w' };
      board[files[i] + '2'] = { p: 'P', c: 'w' };
      board[files[i] + '7'] = { p: 'P', c: 'b' };
      board[files[i] + '8'] = { p: back[i], c: 'b' };
    }
  } else if (type === 'king-demo') board['d4'] = { p: 'K', c: 'w' };
  else if (type === 'queen-demo') board['d4'] = { p: 'Q', c: 'w' };
  else if (type === 'rook-demo') board['d4'] = { p: 'R', c: 'w' };
  else if (type === 'bishop-demo') board['d4'] = { p: 'B', c: 'w' };
  else if (type === 'knight-demo') board['d4'] = { p: 'N', c: 'w' };
  else if (type === 'pawn-demo') board['d2'] = { p: 'P', c: 'w' };
  else if (type === 'checkmate-demo') {
    board['e1'] = { p: 'K', c: 'w' };
    board['e8'] = { p: 'R', c: 'b' };
    board['d8'] = { p: 'K', c: 'b' };
  }

  var html = '<div style="display:grid;grid-template-columns:20px repeat(8,1fr);gap:0;max-width:400px;margin:0 auto;">';
  for (var r = 8; r >= 1; r--) {
    html += '<div style="color:rgba(255,255,255,.4);font-size:.65rem;display:flex;align-items:center;justify-content:center;">' + r + '</div>';
    for (var f = 0; f < 8; f++) {
      var sq = files[f] + r;
      var light = (f + r) % 2 === 1;
      var isHighlight = highlights && highlights.indexOf(sq) !== -1;
      var piece = board[sq];
      var bg = isHighlight ? (light ? '#fbbf24' : '#d97706') : (light ? '#f0d9b5' : '#b58863');
      var content = piece ? CHESS_PIECES[piece.p][piece.c] : '';
      var color = piece && piece.c === 'b' ? '#0a1628' : '#fff';
      var shadow = piece && piece.c === 'w' ? '0 1px 2px rgba(0,0,0,.4)' : 'none';
      html += '<div style="aspect-ratio:1;background:' + bg + ';display:flex;align-items:center;justify-content:center;font-size:clamp(1.4rem,4.5vw,2.4rem);color:' + color + ';text-shadow:' + shadow + ';">' + content + '</div>';
    }
  }
  html += '<div></div>';
  for (var fi = 0; fi < files.length; fi++) {
    html += '<div style="color:rgba(255,255,255,.4);font-size:.65rem;text-align:center;padding-top:2px;">' + files[fi] + '</div>';
  }
  html += '</div>';
  return html;
}

function kChessNext(){
  var c = window._kChess;
  if (c.lesson < CHESS_LESSONS.length - 1) {
    c.lesson++;
    kChessRender();
  }
}

function kChessPrev(){
  var c = window._kChess;
  if (c.lesson > 0) {
    c.lesson--;
    kChessRender();
  }
}

function kChessAnswer(choice){
  var c = window._kChess;
  var lesson = CHESS_LESSONS[c.lesson];
  var correct = choice === lesson.question.correct;

  if (correct) {
    c.stars++;
    kAwardStars(1);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(lesson.question.correctSay);
      u.rate = 0.95; u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
    document.getElementById('kGameBody').insertAdjacentHTML('afterbegin',
      '<div style="background:linear-gradient(135deg,#10b981,#34d399);border-radius:16px;padding:18px;text-align:center;margin-bottom:12px;color:#fff;"><div style="font-size:2.2rem;">🎉</div><div style="font-family:\'Bricolage Grotesque\',sans-serif;font-weight:900;font-size:1.1rem;margin-top:4px;">Correct! +1 ⭐</div></div>');
    setTimeout(kChessNext, 2000);
  } else {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      var u2 = new SpeechSynthesisUtterance(lesson.question.wrongSay);
      u2.rate = 0.95; u2.pitch = 1.1;
      window.speechSynthesis.speak(u2);
    }
    document.getElementById('kGameBody').insertAdjacentHTML('afterbegin',
      '<div style="background:linear-gradient(135deg,#f59e0b,#dc2626);border-radius:16px;padding:18px;text-align:center;margin-bottom:12px;color:#fff;"><div style="font-size:2.2rem;">💭</div><div style="font-family:\'Bricolage Grotesque\',sans-serif;font-weight:900;font-size:1.05rem;margin-top:4px;">Try again!</div></div>');
  }
}

function kChessStartPractice(){
  window._kChess.mode = 'practice';
  window._kChessBoard = kChessInitBoard();
  window._kChessTurn = 'w';
  window._kChessSelected = null;
  kChessPracticeRender();
}

function kChessInitBoard(){
  var back = ['R','N','B','Q','K','B','N','R'];
  var files = ['a','b','c','d','e','f','g','h'];
  var board = {};
  for (var i = 0; i < 8; i++) {
    board[files[i] + '1'] = { p: back[i], c: 'w' };
    board[files[i] + '2'] = { p: 'P', c: 'w' };
    board[files[i] + '7'] = { p: 'P', c: 'b' };
    board[files[i] + '8'] = { p: back[i], c: 'b' };
  }
  return board;
}

function kChessPracticeRender(){
  var board = window._kChessBoard;
  var turn = window._kChessTurn;
  var selected = window._kChessSelected;
  var files = ['a','b','c','d','e','f','g','h'];
  var validMoves = selected ? kChessValidMoves(selected, board) : [];

  var turnBg = turn === 'w' ? '#fff' : '#0a1628';
  var turnName = turn === 'w' ? 'White' : 'Black';
  var html = '<div style="display:flex;justify-content:space-between;background:rgba(255,255,255,.05);padding:14px 18px;border-radius:16px;margin-bottom:16px;">';
  html += '<div style="display:flex;align-items:center;gap:10px;"><div style="width:28px;height:28px;border-radius:50%;background:' + turnBg + ';border:2px solid #fbbf24;"></div><div style="color:#fff;font-weight:800;">' + turnName + "'s turn</div></div>";
  html += '<button onclick="kChessStartPractice()" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);padding:8px 16px;border-radius:100px;font-size:.82rem;font-weight:700;cursor:pointer;">🔄 Reset</button></div>';

  html += '<div style="background:#0a1628;border-radius:16px;padding:10px;margin-bottom:16px;"><div style="display:grid;grid-template-columns:20px repeat(8,1fr);gap:0;max-width:440px;margin:0 auto;">';
  for (var r = 8; r >= 1; r--) {
    html += '<div style="color:rgba(255,255,255,.4);font-size:.65rem;display:flex;align-items:center;justify-content:center;">' + r + '</div>';
    for (var f = 0; f < 8; f++) {
      var sq = files[f] + r;
      var light = (f + r) % 2 === 1;
      var piece = board[sq];
      var isSelected = sq === selected;
      var isValid = validMoves.indexOf(sq) !== -1;
      var bg = isSelected ? '#3b82f6' : (isValid ? (light ? '#86efac' : '#22c55e') : (light ? '#f0d9b5' : '#b58863'));
      var content = piece ? CHESS_PIECES[piece.p][piece.c] : (isValid ? '•' : '');
      var textColor = piece ? (piece.c === 'b' ? '#0a1628' : '#fff') : '#0a1628';
      var shadow = piece && piece.c === 'w' ? '0 1px 2px rgba(0,0,0,.4)' : 'none';
      html += '<div onclick="kChessClickSquare(\'' + sq + '\')" style="aspect-ratio:1;background:' + bg + ';display:flex;align-items:center;justify-content:center;font-size:clamp(1.5rem,5vw,2.6rem);color:' + textColor + ';cursor:pointer;text-shadow:' + shadow + ';transition:background .15s;">' + content + '</div>';
    }
  }
  html += '<div></div>';
  for (var fi = 0; fi < files.length; fi++) {
    html += '<div style="color:rgba(255,255,255,.4);font-size:.65rem;text-align:center;padding-top:2px;">' + files[fi] + '</div>';
  }
  html += '</div></div>';

  var hint = selected ? ('<strong style="color:#fbbf24;">Selected: ' + selected + '.</strong> Tap a green square to move, or tap the same piece to deselect.') : 'Click any of your pieces to see where they can move. Green squares show valid moves!';
  html += '<div style="background:rgba(255,255,255,.04);border-radius:16px;padding:16px;margin-bottom:16px;text-align:center;font-size:.85rem;color:rgba(255,255,255,.8);line-height:1.6;">' + hint + '</div>';
  html += '<div style="display:flex;gap:10px;justify-content:center;"><button onclick="window._kChess.mode=\'lesson\';kChessRender()" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2);padding:12px 24px;border-radius:100px;font-weight:700;cursor:pointer;">← Back to Lessons</button></div>';

  document.getElementById('kGameBody').innerHTML = html;
}

function kChessClickSquare(sq){
  var board = window._kChessBoard;
  var turn = window._kChessTurn;
  var selected = window._kChessSelected;
  var piece = board[sq];

  if (selected) {
    if (sq === selected) {
      window._kChessSelected = null;
      kChessPracticeRender();
      return;
    }
    var validMoves = kChessValidMoves(selected, board);
    if (validMoves.indexOf(sq) !== -1) {
      board[sq] = board[selected];
      delete board[selected];
      var rank = parseInt(sq[1]);
      if (board[sq].p === 'P' && (rank === 8 || rank === 1)) board[sq].p = 'Q';
      window._kChessSelected = null;
      window._kChessTurn = turn === 'w' ? 'b' : 'w';
      if (window.speechSynthesis) {
        var u = new SpeechSynthesisUtterance('Good move!');
        u.rate = 1.1; u.pitch = 1.2;
        window.speechSynthesis.speak(u);
      }
      kChessPracticeRender();
    } else if (piece && piece.c === turn) {
      window._kChessSelected = sq;
      kChessPracticeRender();
    }
  } else {
    if (piece && piece.c === turn) {
      window._kChessSelected = sq;
      kChessPracticeRender();
    }
  }
}

function kChessValidMoves(sq, board){
  var piece = board[sq];
  if (!piece) return [];
  var files = ['a','b','c','d','e','f','g','h'];
  var f = files.indexOf(sq[0]);
  var r = parseInt(sq[1]);
  var moves = [];

  function tryMove(ff, rr) {
    if (ff < 0 || ff > 7 || rr < 1 || rr > 8) return 'out';
    var target = files[ff] + rr;
    var p = board[target];
    if (!p) { moves.push(target); return 'empty'; }
    if (p.c !== piece.c) { moves.push(target); return 'capture'; }
    return 'block';
  }

  function slide(df, dr) {
    var ff = f + df, rr = r + dr;
    while (ff >= 0 && ff <= 7 && rr >= 1 && rr <= 8) {
      var res = tryMove(ff, rr);
      if (res === 'block' || res === 'capture') break;
      ff += df; rr += dr;
    }
  }

  switch (piece.p) {
    case 'K':
      for (var df = -1; df <= 1; df++) {
        for (var dr = -1; dr <= 1; dr++) {
          if (df === 0 && dr === 0) continue;
          tryMove(f + df, r + dr);
        }
      }
      break;
    case 'Q':
      slide(1,0); slide(-1,0); slide(0,1); slide(0,-1);
      slide(1,1); slide(1,-1); slide(-1,1); slide(-1,-1);
      break;
    case 'R':
      slide(1,0); slide(-1,0); slide(0,1); slide(0,-1);
      break;
    case 'B':
      slide(1,1); slide(1,-1); slide(-1,1); slide(-1,-1);
      break;
    case 'N':
      var kn = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
      for (var ki = 0; ki < kn.length; ki++) tryMove(f + kn[ki][0], r + kn[ki][1]);
      break;
    case 'P':
      var dir = piece.c === 'w' ? 1 : -1;
      var start = piece.c === 'w' ? 2 : 7;
      if (!board[files[f] + (r+dir)]) {
        moves.push(files[f] + (r+dir));
        if (r === start && !board[files[f] + (r+2*dir)]) moves.push(files[f] + (r+2*dir));
      }
      var caps = [-1, 1];
      for (var ci = 0; ci < caps.length; ci++) {
        var tf = f + caps[ci], tr = r + dir;
        if (tf >= 0 && tf <= 7 && tr >= 1 && tr <= 8) {
          var t = board[files[tf] + tr];
          if (t && t.c !== piece.c) moves.push(files[tf] + tr);
        }
      }
      break;
  }
  return moves;
}
