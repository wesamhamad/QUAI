<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>{{ __('messages.quiz_page_title') }}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <script>
    // Game configuration - minimal data passed to frontend
    window.gameConfig = {
      courseCode: @json($code ?? $courseCode ?? null),
      attachmentKey: @json($attachmentKey ?? null),
      studentId: @json($studentId ?? null),
      csrfToken: '{{ csrf_token() }}'
    };
    console.log('🎮 Game Config:', window.gameConfig);
  </script>
  <script src="{{ asset('vendor/tailwindcss/tailwind.js') }}"></script>
  <style>
    html,body{height:100%}
    body{margin:0;overflow:hidden;background:linear-gradient(to bottom,#6bd4ff,#b9ffa9)}
    .game{position:relative;width:100vw;height:100vh;background:url('/game/images/bg.PNG') repeat-x bottom;background-size:cover;overflow:hidden}
    .character{width:100px;height:100px;background:url('/game/images/char.PNG') no-repeat center/contain;position:absolute;bottom:100px;left:100px;z-index:10;transition:transform .1s ease;filter:drop-shadow(2px 2px 4px rgba(0,0,0,.3))}
    .character.jumping{animation:characterJump .6s ease-out}
    @keyframes characterJump{0%{transform:rotate(0) scale(1)}50%{transform:rotate(10deg) scale(1.1)}100%{transform:rotate(0) scale(1)}}
    .qblock{width:72px;height:72px;border-radius:10px;background:linear-gradient(145deg,#f7b733,#f4d03f);border:5px solid #b57f1b;box-shadow:0 8px 0 #9a6a12,0 12px 30px rgba(0,0,0,.3);position:relative;animation:qblock-idle 1.5s ease-in-out infinite}
    .qblock::before{content:'?';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:42px;color:#2b1d06;text-shadow:0 2px #ffeaa7,2px 0 #ffeaa7,-2px 0 #ffeaa7,0 -2px #ffeaa7}
    .qblock.bump{animation:qblock-bump .22s ease-out}
    @keyframes qblock-idle{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
    @keyframes qblock-bump{0%{transform:translateY(0) scale(1)}50%{transform:translateY(-16px) scale(1.1)}100%{transform:translateY(0) scale(1)}}
    .q-bubble{max-width:min(92vw,680px);min-width:320px;max-height:32vh;overflow-y:auto;padding:20px 28px;border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.98) 0%,rgba(248,250,252,.98) 100%);border:4px solid #2b1d06;color:#1a1a1a;font-weight:600;font-size:19px;direction:rtl;text-align:center;line-height:1.7;box-shadow:0 8px 32px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.8);white-space:pre-wrap;word-break:break-word;opacity:0;transform:translateY(12px) scale(.95);transition:opacity .3s ease,transform .3s cubic-bezier(.34,1.56,.64,1);position:relative}
    .q-bubble::after{content:'';position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:16px solid transparent;border-right:16px solid transparent;border-top:20px solid rgba(248,250,252,.98);filter:drop-shadow(0 3px 0 #2b1d06)}
    .q-bubble.show{opacity:1;transform:none}
    .q-bubble .question-text{font-size:20px;font-weight:700;color:#1a1a1a;margin-top:8px}
    .difficulty-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:50px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;box-shadow:0 3px 12px rgba(0,0,0,.15);animation:badge-pulse 2s ease-in-out infinite}
    @keyframes badge-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
    .floaty{animation:floaty 2.8s ease-in-out infinite}
    @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
    .glass{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
    .answer-tile{background:linear-gradient(135deg,#ff7043 0%,#ff5722 50%,#f4511e 100%);position:relative;overflow:hidden;transition:all .2s cubic-bezier(.34,1.56,.64,1)}
    .answer-tile::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:left .5s}
    .answer-tile:hover::before{left:100%}
    .answer-tile:hover{transform:translateY(-6px) scale(1.02);box-shadow:0 10px 0 #9a6a12,0 16px 30px rgba(0,0,0,.35)}
    .answer-tile:active{transform:translateY(2px) scale(0.98)}
    .answer-hit{background:linear-gradient(135deg,#66bb6a 0%,#4CAF50 50%,#43a047 100%)!important;animation:correct-pop .4s ease-out}
    .answer-wrong{background:linear-gradient(135deg,#ef5350 0%,#f44336 50%,#e53935 100%)!important;animation:wrong-shake .4s ease-out}
    @keyframes correct-pop{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}}
    @keyframes wrong-shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
    .answer-container{background:linear-gradient(180deg,rgba(255,255,255,.85) 0%,rgba(255,255,255,.75) 100%);border:2px solid rgba(255,255,255,.5)}
    #lives img{transition:transform .2s;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))}
    #lives img:hover{transform:scale(1.15)}
    .life-lost{animation:life-lost .5s ease-out}
    @keyframes life-lost{0%{transform:scale(1);opacity:1}50%{transform:scale(1.3);opacity:.5}100%{transform:scale(0);opacity:0}}
    #score{text-shadow:2px 2px 0 #000,0 0 10px rgba(255,215,0,.5)}
    .coin-pop{animation:coin-pop .3s ease-out}
    @keyframes coin-pop{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}

    /* Countdown Overlay Animations */
    .countdown-number{
      animation:countdown-pulse 1s ease-in-out infinite;
      filter:drop-shadow(0 0 40px rgba(255,200,0,.6));
    }
    @keyframes countdown-pulse{
      0%,100%{transform:scale(1);opacity:1}
      50%{transform:scale(1.1);opacity:.9}
    }
    .countdown-number.pop{
      animation:countdown-pop .4s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes countdown-pop{
      0%{transform:scale(0.3);opacity:0}
      60%{transform:scale(1.2)}
      100%{transform:scale(1);opacity:1}
    }
    .countdown-number.go{
      animation:countdown-go .6s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes countdown-go{
      0%{transform:scale(0.5) rotate(-10deg);opacity:0}
      50%{transform:scale(1.3) rotate(5deg)}
      100%{transform:scale(1) rotate(0);opacity:1}
    }
    .countdown-dot.active{
      background:linear-gradient(to right,#fbbf24,#f59e0b)!important;
      animation:dot-pop .3s ease-out;
      box-shadow:0 0 15px rgba(251,191,36,.8);
    }
    @keyframes dot-pop{
      0%{transform:scale(1)}
      50%{transform:scale(1.5)}
      100%{transform:scale(1)}
    }
    #countdownOverlay.fade-out{
      animation:overlay-fade .5s ease-out forwards;
    }
    @keyframes overlay-fade{
      0%{opacity:1;transform:scale(1)}
      100%{opacity:0;transform:scale(1.1);pointer-events:none}
    }
    .countdown-ring{
      position:absolute;
      width:300px;height:300px;
      top:50%;left:50%;
      margin-top:-150px;margin-left:-150px;
      border:8px solid transparent;
      border-top-color:#fbbf24;
      border-radius:50%;
      animation:ring-spin 1s linear infinite;
    }
    @keyframes ring-spin{
      0%{transform:rotate(0deg)}
      100%{transform:rotate(360deg)}
    }
  </style>
</head>
<body class="select-none">
  <div id="game" class="game">
    <div id="character" class="character"></div>

    <div class="absolute top-24 left-1/2 -translate-x-1/2 z-20 w-[360px] h-6 rounded-full overflow-hidden shadow-lg bg-black/25 border-2 border-white/30 backdrop-blur-sm">
      <div id="progressFill" class="h-full w-0 rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 shadow-inner"></div>
    </div>

    <div class="absolute top-4 left-4 z-20 flex items-center gap-4">
      <div id="lives" class="flex gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20"></div>
      <div id="score" class="text-2xl font-extrabold text-yellow-300 bg-black/30 backdrop-blur-sm px-5 py-2 rounded-2xl border border-white/20 shadow-lg">🪙 Coins: 0</div>
    </div>

    <div id="jumpCount" class="absolute top-4 right-4 z-20 text-white text-xl font-bold bg-black/30 backdrop-blur-sm px-5 py-2 rounded-2xl border border-white/20 shadow-lg">Jump: 0 🌟</div>

    <div id="timer" class="absolute top-4 right-44 z-20 bg-black/35 backdrop-blur-sm text-white px-5 py-2 rounded-2xl shadow-lg font-bold text-base border border-white/20">
      <div id="timerLabel" class="flex items-center gap-2">⏱️ <span>0s</span></div>
      <div class="mt-2 w-48 h-2 rounded-full overflow-hidden bg-white/30">
        <div id="timerFill" class="h-full w-full transition-all duration-100 bg-gradient-to-r from-rose-400 via-orange-500 to-amber-400"></div>
      </div>
    </div>

    <!-- Animated Countdown Overlay -->
    <div id="countdownOverlay" class="absolute inset-0 z-[999] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-md">
      <div class="text-center relative">
        <h1 class="text-4xl md:text-5xl font-extrabold text-white mb-8 animate-pulse drop-shadow-lg">🎮 {{ __('messages.quiz_get_ready') }}</h1>
        <div class="relative inline-block">
          <!-- Spinning ring -->
          <div class="countdown-ring"></div>
          <div class="countdown-ring" style="animation-delay:-0.5s;border-top-color:#f97316;width:280px;height:280px;left:10px;top:10px"></div>
          <!-- Number -->
          <div id="countdownNumber" class="countdown-number text-[180px] md:text-[220px] font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 leading-none drop-shadow-2xl relative z-10">3</div>
        </div>
        <p class="text-xl md:text-2xl text-white/80 mt-8 font-semibold">{{ __('messages.quiz_controls_hint') }}</p>
      </div>
      <div class="absolute bottom-20 flex gap-4">
        <div class="countdown-dot w-5 h-5 rounded-full bg-white/30 transition-all duration-300"></div>
        <div class="countdown-dot w-5 h-5 rounded-full bg-white/30 transition-all duration-300"></div>
        <div class="countdown-dot w-5 h-5 rounded-full bg-white/30 transition-all duration-300"></div>
      </div>
    </div>

    <div id="countdown" class="absolute z-20 top-20 left-1/2 -translate-x-1/2 max-w-[90vw] text-3xl font-extrabold text-white text-center bg-gradient-to-r from-sky-500 to-blue-600 border-4 border-white/50 px-8 py-4 rounded-3xl shadow-2xl backdrop-blur-sm hidden"></div>

    <div id="questionUI" class="absolute z-30 top-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 hidden">
      <div id="qBlock" class="qblock" aria-hidden="true"></div>
      <div id="qBubble" role="dialog" aria-live="polite" dir="rtl" class="q-bubble"></div>
    </div>

    <div id="answerContainer" class="answer-container absolute z-20 bottom-52 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] max-w-5xl flex flex-wrap justify-center gap-4 p-4 rounded-3xl shadow-2xl glass"></div>

    <div id="gameOverScreen" class="hidden absolute inset-0 z-[1000] bg-black/85 backdrop-blur-sm items-center justify-center">
      <div class="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-12 py-12 rounded-3xl text-center text-white shadow-2xl border-4 border-white/20 transform transition-all duration-300 scale-100">
        <h2 id="gameOverTitle" class="text-4xl font-extrabold mb-4 drop-shadow-lg">Game Over!</h2>
        <p id="gameOverMessage" class="mb-8 text-xl opacity-90">Better luck next time!</p>
        <button id="playAgainBtn" class="px-8 py-4 rounded-2xl bg-white text-indigo-700 font-extrabold text-lg hover:bg-yellow-300 hover:scale-105 transition-all duration-200 shadow-lg">🔄 {{ __('messages.quiz_replay') }}</button>
      </div>
    </div>
  </div>

  <audio id="win-sound"  src="https://cdn.pixabay.com/download/audio/2021/08/04/audio_8c5e6f8c25.mp3" preload="auto"></audio>
  <audio id="jump-sound" src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_774dbe5f94.mp3" preload="auto"></audio>
  <audio id="coin-sound" src="https://www.soundjay.com/misc/sounds/coin-drop-4.wav" preload="auto"></audio>

  <script>
    // =========================================
    // DOM Elements
    // =========================================
    const character=document.getElementById("character");
    const countdown=document.getElementById("countdown");
    const answerContainer=document.getElementById("answerContainer");
    const scoreDisplay=document.getElementById("score");
    const jumpCountDisplay=document.getElementById("jumpCount");
    const livesDisplay=document.getElementById("lives");
    const progressFill=document.getElementById("progressFill");
    const gameOverScreen=document.getElementById("gameOverScreen");
    const timerLabel=document.getElementById("timerLabel");
    const timerFillEl=document.getElementById("timerFill");
    const gameEl=document.getElementById("game");
    const questionUI=document.getElementById("questionUI");
    const qBubble=document.getElementById("qBubble");
    const qBlock=document.getElementById("qBlock");

    // Event delegation for answer clicks
    answerContainer.addEventListener('click',(e)=>{const el=e.target.closest('.answer');if(el)handleAnswerClick(el)});

    // =========================================
    // Game State (UI-only state)
    // =========================================
    let velocityY=0,gravity=1,isJumping=false,canDoubleJump=false;
    let jumpCount=0,lives=3,score=0;
    let keys={},gameStarted=false,moveSpeed=12;
    let totalQuestions=0,currentQuestionIndex=0,questionActive=false,hasAnswered=false;
    let answerCooldown=false;

    // =========================================
    // API Client - All game logic via backend
    // =========================================
    const { courseCode, attachmentKey, studentId, csrfToken } = window.gameConfig;
    let gameSessionId = null;
    let currentQuestion = null;
    let questionStartTime = null;

    const GameAPI = {
      baseUrl: '/api/game',

      async request(endpoint, options = {}) {
        // Always prepend baseUrl for relative endpoints
        const url = `${this.baseUrl}${endpoint}`;
        console.log('🌐 GameAPI request:', options.method || 'GET', url);

        try {
          const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrfToken,
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'application/json',
              ...options.headers
            }
          });

          console.log('📡 Response status:', response.status);

          if (!response.ok) {
            const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
            console.error('❌ API error:', error);
            throw new Error(error.message || 'API request failed');
          }

          const data = await response.json();
          console.log('✅ API response:', data);
          return data;
        } catch (e) {
          console.error('❌ Request failed:', e);
          throw e;
        }
      },

      async startGame() {
        console.log('🎮 Starting game with:', { courseCode, attachmentKey });
        const result = await this.request('/start', {
          method: 'POST',
          body: JSON.stringify({ course_code: courseCode, attachment_key: attachmentKey })
        });
        if (result.success) {
          gameSessionId = result.data.session_id;
          totalQuestions = result.data.total_questions;
          lives = result.data.lives;
          console.log('🎮 Game started! Session:', gameSessionId, 'Questions:', totalQuestions);
        }
        return result;
      },

      async getQuestion() {
        if (!gameSessionId) throw new Error('No active game session');
        return this.request(`/${gameSessionId}/question`);
      },

      async submitAnswer(questionId, answerIndex, timeTaken) {
        if (!gameSessionId) throw new Error('No active game session');
        return this.request(`/${gameSessionId}/answer`, {
          method: 'POST',
          body: JSON.stringify({ question_id: questionId, answer_index: answerIndex, time_taken: timeTaken })
        });
      },

      async handleTimeout(questionId) {
        if (!gameSessionId) throw new Error('No active game session');
        return this.request(`/${gameSessionId}/timeout`, {
          method: 'POST',
          body: JSON.stringify({ question_id: questionId })
        });
      },

      async endGame() {
        if (!gameSessionId) throw new Error('No active game session');
        return this.request(`/${gameSessionId}/end`, { method: 'POST' });
      }
    };

    // =========================================
    // Play Time Tracking (kept for analytics)
    // =========================================
    let sessionStartMs = null;
    let sentMinutes = 0;
    let heartbeatId = null;

    function minutesSinceStart(){
      if(!sessionStartMs) return 0;
      return Math.floor((Date.now()-sessionStartMs)/60000);
    }

    async function postPlayMinutes(minutes,{keepalive=false}={}){
      try{
        if(!studentId) return;
        if(!minutes || minutes<1) return;
        await fetch('/api/record-play-time',{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN':csrfToken,
            'X-Requested-With':'XMLHttpRequest'
          },
          body: JSON.stringify({student_id: studentId, minutes}),
          keepalive
        });
      }catch(e){console.error('record-play-time failed',e)}
    }

    function flushPlayTime(reason,opts={}){
      const total=minutesSinceStart();
      let delta=total - sentMinutes;
      if((reason==='end' || reason==='pagehide' || reason==='hidden') && sessionStartMs){
        if(total<1 && total>0) delta = 1;
      }
      if(delta>=1){
        postPlayMinutes(delta,opts);
        sentMinutes += delta;
      }
    }

    window.addEventListener('beforeunload',()=>flushPlayTime('pagehide',{keepalive:true}));
    window.addEventListener('pagehide',()=>flushPlayTime('pagehide',{keepalive:true}));
    document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden'){ flushPlayTime('hidden',{keepalive:true}); }})

    // =========================================
    // UI Helper Functions
    // =========================================

    // Difficulty labels and colors
    const difficultyLabels = {
      easy: { ar: '🟢 سهل', en: '🟢 Easy', color: 'bg-emerald-500' },
      medium: { ar: '🟡 متوسط', en: '🟡 Medium', color: 'bg-amber-500' },
      hard: { ar: '🔴 صعب', en: '🔴 Hard', color: 'bg-rose-500' }
    };

    // Detect if question is in Arabic
    function isArabic(text) {
      const arabicPattern = /[\u0600-\u06FF]/;
      return arabicPattern.test(text);
    }

    let previousLives = lives;
    function updateLivesDisplay(){
      const currentHearts = livesDisplay.children.length;
      // If losing a life, animate the last heart
      if(currentHearts > lives && currentHearts > 0){
        const lastHeart = livesDisplay.lastChild;
        if(lastHeart){
          lastHeart.classList.add('life-lost');
          setTimeout(()=>lastHeart.remove(), 400);
        }
      } else {
        // Full rebuild (initial or gaining lives)
        livesDisplay.innerHTML='';
        for(let i=0;i<lives;i++){
          const img=document.createElement('img');
          img.src='https://static.vecteezy.com/system/resources/thumbnails/054/978/926/small/game-heart-pixelated-free-png.png';
          img.alt='❤';
          img.className='w-9 h-9 transition-transform duration-200';
          img.style.animationDelay = `${i * 0.1}s`;
          livesDisplay.appendChild(img);
        }
      }
      previousLives = lives;
    }
    function updateProgress(){progressFill.style.width=(currentQuestionIndex/totalQuestions)*100+'%'}

    // =========================================
    // Question Display (UI only - data from API)
    // =========================================
    async function showQuestion(){
      try {
        // Get next question from backend API
        console.log('📝 Fetching next question...');
        const response = await GameAPI.getQuestion();
        console.log('📝 Question response:', response);

        if (!response.success) {
          console.log('📝 Game over - no more questions or error:', response.message || 'Unknown');
          endGame();
          return;
        }

        if (!response.data || !response.data.question) {
          console.error('📝 Invalid response structure - missing data.question:', response);
          endGame();
          return;
        }

        currentQuestion = response.data.question;
        currentQuestionIndex = response.data.current_index;
        console.log('📝 Current question:', currentQuestion);

        // Update game state from server
        lives = response.data.lives;
        score = response.data.score;
        totalQuestions = response.data.total_questions;

        questionActive=true;hasAnswered=false;

        // UI updates
        countdown.classList.add('opacity-0');
        questionUI.classList.remove('hidden');
        qBlock.classList.add('bump');
        setTimeout(()=>qBlock.classList.remove('bump'),180);

        // Start timing this question
        questionStartTime = Date.now();

        // Get difficulty info
        const diff = currentQuestion.difficulty || 'medium';
        const diffInfo = difficultyLabels[diff] || difficultyLabels.medium;
        const isAr = isArabic(currentQuestion.question);
        const diffLabel = isAr ? diffInfo.ar : diffInfo.en;
        const questionText = currentQuestion.question || '(Question text not found)';

        // Build question UI
        const fragment = document.createDocumentFragment();

        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'mb-3';
        const badge = document.createElement('span');
        badge.className = `difficulty-badge text-white ${diffInfo.color}`;
        badge.textContent = diffLabel;
        badgeDiv.appendChild(badge);
        fragment.appendChild(badgeDiv);

        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-text';
        questionDiv.textContent = questionText;
        fragment.appendChild(questionDiv);

        qBubble.innerHTML = '';
        qBubble.appendChild(fragment);

        // Build answer buttons
        const answerFragment = document.createDocumentFragment();
        if(Array.isArray(currentQuestion.options)){
          currentQuestion.options.forEach((opt,i)=>{
            const el=document.createElement('button');
            el.className='answer answer-tile text-white font-extrabold text-base leading-snug rounded-2xl px-6 py-5 min-w-[150px] max-w-[280px] flex-1 shadow-[0_6px_0_#b84a00,0_12px_24px_rgba(0,0,0,0.35)] border-4 border-yellow-400/80 cursor-pointer';
            el.textContent=opt;
            el.dataset.index=i;
            answerFragment.appendChild(el);
          });
        }
        answerContainer.innerHTML = '';
        answerContainer.appendChild(answerFragment);

        requestAnimationFrame(()=>qBubble.classList.add('show'));
        updateProgress();
        updateLivesDisplay();
        scoreDisplay.textContent='🪙 Coins: '+score;
        startQuestionTimer();
      } catch(e) {
        console.error('Failed to get question:', e);
        endGame();
      }
    }

    // =========================================
    // Answer Handling (sends to API)
    // =========================================
    async function handleAnswerClick(targetEl,fromTimeout=false){
      if(!questionActive||hasAnswered||answerCooldown)return;
      hasAnswered=true;
      character.classList.add('jumping');
      setTimeout(()=>character.classList.remove('jumping'),600);

      const answerTime = questionStartTime ? (Date.now() - questionStartTime) / 1000 : 15;
      const answerIndex = fromTimeout ? -1 : Number(targetEl?.dataset?.index ?? -1);

      try {
        // Submit answer to backend API
        const response = await GameAPI.submitAnswer(
          currentQuestionIndex,
          answerIndex,
          answerTime
        );

        if (response.success) {
          const result = response.data;

          // Update UI based on server response
          if (result.is_correct && targetEl) {
            targetEl.classList.add('answer-hit');
            score = result.score;
            scoreDisplay.textContent='🪙 Coins: '+score;
            scoreDisplay.classList.add('coin-pop');
            setTimeout(()=>scoreDisplay.classList.remove('coin-pop'),300);
            document.getElementById('coin-sound').play().catch(()=>{});
          } else if (targetEl) {
            targetEl.classList.add('answer-wrong');
          }

          // Update lives from server
          lives = result.lives;
          updateLivesDisplay();

          // Check if game over
          if (result.game_over) {
            stopQuestionTimer();
            setTimeout(endGame, 500);
          } else {
            stopQuestionTimer();
            setTimeout(nextQuestion, 500);
          }
        }
      } catch(e) {
        console.error('Failed to submit answer:', e);
        stopQuestionTimer();
        setTimeout(nextQuestion, 500);
      }
    }

    function nextQuestion(){
      currentQuestionIndex++;
      answerCooldown=true;
      setTimeout(()=>{ answerCooldown=false; },3000);
      requestAnimationFrame(showQuestion);
    }

    // =========================================
    // Game End (calls API to finalize)
    // =========================================
    async function endGame(){
      gameStarted=false;
      stopQuestionTimer();
      flushPlayTime('end');

      try {
        // End game via API - this records performance on backend
        const response = await GameAPI.endGame();

        if (response.success) {
          const result = response.data;
          score = result.correct_answers;
          totalQuestions = result.total_questions;
        }
      } catch(e) {
        console.error('Failed to end game:', e);
      }

      const t=document.getElementById('gameOverTitle');
      const m=document.getElementById('gameOverMessage');
      if(lives<=0){
        t.textContent='{{ __('messages.quiz_game_over') }}';
        m.textContent=`{{ __('messages.quiz_score_message', ['score' => '__SCORE__', 'total' => '__TOTAL__']) }}`.replace('__SCORE__', score).replace('__TOTAL__', totalQuestions);
      } else {
        t.textContent='{{ __('messages.quiz_congrats') }}';
        m.textContent=`{{ __('messages.quiz_win_message', ['total' => '__TOTAL__', 'score' => '__SCORE__']) }}`.replace('__TOTAL__', totalQuestions).replace('__SCORE__', score);
        document.getElementById('win-sound').play().catch(()=>{});
      }
      gameOverScreen.classList.remove('hidden');
      gameOverScreen.classList.add('flex');
    }

    document.addEventListener('keydown',e=>{
      keys[e.key]=true;
      if(e.key===' '||e.key==='ArrowUp'||e.key==='w'){
        e.preventDefault();
        if(!isJumping){
          velocityY=18;isJumping=true;canDoubleJump=true;
          jumpCount=1;jumpCountDisplay.textContent='🦘 Jump: '+jumpCount;
          document.getElementById('jump-sound').play().catch(()=>{})
        }else if(canDoubleJump){
          velocityY=16;canDoubleJump=false;
          jumpCount=2;jumpCountDisplay.textContent='🦘 Jump: '+jumpCount;
          document.getElementById('jump-sound').play().catch(()=>{})
        }
      }
    });
    document.addEventListener('keyup',e=>{keys[e.key]=false});

    // =========================================
    // Game Initialization (starts via API)
    // =========================================
    const countdownOverlay = document.getElementById('countdownOverlay');
    const countdownNumber = document.getElementById('countdownNumber');
    const countdownDots = document.querySelectorAll('.countdown-dot');

    async function startCountdown(){
      // Initialize game session via API
      try {
        const response = await GameAPI.startGame();
        if (!response.success) {
          console.error('Failed to start game:', response.message);
          countdownOverlay.innerHTML = '<div class="text-white text-2xl">{{ __('messages.quiz_failed_to_start') }}</div>';
          return;
        }

        console.log('🎮 Game session started:', gameSessionId);
        console.log('📊 Total questions:', totalQuestions);
      } catch(e) {
        console.error('Failed to initialize game:', e);
        countdownOverlay.innerHTML = '<div class="text-white text-2xl">{{ __('messages.quiz_failed_to_start') }}</div>';
        return;
      }

      // Animated countdown sequence
      let t = 3;

      // Function to animate each number
      function animateNumber(num) {
        countdownNumber.classList.remove('pop', 'go');
        void countdownNumber.offsetWidth; // Force reflow

        if (num > 0) {
          countdownNumber.textContent = num;
          countdownNumber.classList.add('pop');
          // Activate corresponding dot (reverse order: 3=first, 2=second, 1=third)
          const dotIndex = 3 - num;
          if (countdownDots[dotIndex]) {
            countdownDots[dotIndex].classList.add('active');
          }
        } else {
          countdownNumber.textContent = '🚀';
          countdownNumber.classList.add('go');
          // Activate all dots
          countdownDots.forEach(dot => dot.classList.add('active'));
        }
      }

      // Start with 3
      animateNumber(3);

      const iv = setInterval(() => {
        t--;
        if (t > 0) {
          animateNumber(t);
        } else if (t === 0) {
          animateNumber(0);
        } else {
          clearInterval(iv);

          // Fade out overlay
          countdownOverlay.classList.add('fade-out');

          setTimeout(() => {
            countdownOverlay.style.display = 'none';
            gameStarted = true;
            if (!sessionStartMs) sessionStartMs = Date.now();
            if (!heartbeatId) heartbeatId = setInterval(() => flushPlayTime('heartbeat'), 60000);
            updateLivesDisplay();
            showQuestion();
          }, 500);
        }
      }, 1000);
    }

    let lastTs=0,questionTimerId=null,questionTimeMs=15000,timeLeftMs=questionTimeMs;
    function loop(ts){
      if(!gameStarted){requestAnimationFrame(loop);return}
      const dt=Math.min(32,ts-lastTs||16);lastTs=ts;
      let x=character.offsetLeft;
      if(keys['ArrowLeft']||keys['a'])x-=moveSpeed;
      if(keys['ArrowRight']||keys['d'])x+=moveSpeed;
      x=Math.max(0,Math.min(gameEl.clientWidth-character.clientWidth,x));
      character.style.left=x+'px';

      velocityY-=gravity;
      character.style.bottom=(parseInt(getComputedStyle(character).bottom)+velocityY)+'px';
      const groundY=100;
      if(parseInt(getComputedStyle(character).bottom)<=groundY){
        character.style.bottom=groundY+'px';
        velocityY=0;isJumping=false
      }

      if(questionActive&&!hasAnswered){
        const cRect=character.getBoundingClientRect();
        const els=answerContainer.querySelectorAll('.answer');
        for(const el of els){
          const r=el.getBoundingClientRect();
          const overlap=!(cRect.right<r.left||cRect.left>r.right||cRect.bottom<r.top||cRect.top>r.bottom);
          if(overlap){handleAnswerClick(el);break}
        }
      }
      requestAnimationFrame(loop)
    }

    function startQuestionTimer(){
      stopQuestionTimer();
      timeLeftMs=questionTimeMs;
      updateTimerUI();
      questionTimerId=setInterval(async ()=>{
        timeLeftMs-=100;
        if(timeLeftMs<=0){
          stopQuestionTimer();
          // Handle timeout via API
          try {
            const response = await GameAPI.handleTimeout(currentQuestionIndex);
            if (response.success) {
              lives = response.data.lives;
              updateLivesDisplay();

              // Show correct answer visually
              const correctIdx = currentQuestion?.correctIndex ?? 0;
              const target = answerContainer.querySelector(`.answer[data-index="${correctIdx}"]`);
              if (target) target.classList.add('answer-hit');

              if (response.data.game_over) {
                setTimeout(endGame, 500);
              } else {
                setTimeout(nextQuestion, 500);
              }
            }
          } catch(e) {
            console.error('Timeout handling failed:', e);
            handleAnswerClick(null, true);
          }
        } else {
          updateTimerUI();
        }
      },100);
    }

    function stopQuestionTimer(){
      if(questionTimerId){
        clearInterval(questionTimerId);
        questionTimerId=null;
      }
    }

    function updateTimerUI(){
      const sec=Math.ceil(timeLeftMs/1000);
      timerLabel.textContent=`⏱️ ${sec}s`;
      const pct=Math.max(0,Math.min(100,(timeLeftMs/questionTimeMs)*100));
      timerFillEl.style.width=pct+'%';
    }

    requestAnimationFrame(loop);
    document.getElementById('playAgainBtn').addEventListener('click',()=>location.reload());
    startCountdown();
  </script>
</body>
</html>