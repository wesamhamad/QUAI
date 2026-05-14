<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Mario Quiz Game - {{ $courseName ?? __('messages.quiz_default_title') }}</title>
    
    <!-- React Game CSS -->
    <link rel="stylesheet" href="{{ asset('game-react/assets/index.css') }}?v={{ @filemtime(public_path('game-react/assets/index.css')) }}">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            overflow: hidden;
            font-family: 'Arial', sans-serif;
        }
        
        #root {
            width: 100vw;
            height: 100vh;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    
    <!-- Pass Laravel data to React -->
    <script>
        window.GAME_DATA = {
            questions: @json($questions ?? []),
            groupedQuestions: @json($groupedQuestions ?? null),
            courseCode: @json($courseCode ?? 'TEST'),
            courseId: @json($courseId ?? null),
            courseName: @json($courseName ?? __('messages.quiz_default_title')),
            studentId: @json($studentId ?? null),
            attachmentKey: @json($attachmentKey ?? null),
            csrfToken: '{{ csrf_token() }}'
        };
    </script>
    
    <!-- React Game JS -->
    <script type="module" src="{{ asset('game-react/assets/index.js') }}?v={{ @filemtime(public_path('game-react/assets/index.js')) }}"></script>

    <!-- Live study-minutes logger: polls today's accumulated play minutes so the
         value can be observed ticking up while a session is running. -->
    <script>
      (function () {
        const url = '{{ url('/api/game/today-minutes') }}';
        const csrfToken = '{{ csrf_token() }}';

        async function logTodayMinutes(reason) {
          try {
            const res = await fetch(url, {
              headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': csrfToken },
              credentials: 'same-origin',
            });
            if (!res.ok) {
              console.warn('[study_minutes_today] fetch failed', res.status);
              return;
            }
            const json = await res.json();
            console.log('[study_minutes_today]', reason, json.data);
          } catch (e) {
            console.warn('[study_minutes_today] error', e);
          }
        }

        logTodayMinutes('on-load');
        setInterval(() => logTodayMinutes('poll'), 15000);
      })();
    </script>
</body>
</html>

