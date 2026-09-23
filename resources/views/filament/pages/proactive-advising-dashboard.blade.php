<x-filament-panels::page>
    <style>
        .pa-page {
            direction: rtl;
            --ok: #25935F;
            --ok-soft: #EEF3F0;
            --warn: #F79009;
            --warn-soft: #FEF3E2;
            --bad: #D92D20;
            --bad-soft: #FEE4E2;
            --ink: #111927;
            --muted: #6C737F;
            --line: #E5E7EB;
            --surface: #fff;
            /* لوحة السلاسل — checked for colorblind separation and contrast on
               this surface; the marks reference the vars, never a hex, so the
               dark mode swap below re-colors every chart at once. */
            --s1: #1B8354;
            --s2: #5C7DD1;
            --s3: #B96C1F;
            --s4: #8E5FA8;
            /* A data URI cannot read currentColor, so the stroke is baked in
               per theme — %23 is a literal '#'. */
            --pa-chevron: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.75 6 6.25 11 1.75' fill='none' stroke='%236C737F' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        }
        /*
         * الوضع الداكن يأخذ درجاته الخاصة، لا نفس اللونين — نفس اختيار لوحة
         * السعة، وللسبب نفسه: #F79009 خارج نطاق إضاءة الوضع الداكن فينكسر
         * قلبه التلقائي.
         */
        :is(.dark) .pa-page {
            --ok: #34A97A;
            --warn: #DC6803;
            --ok-soft: rgba(52,169,122,0.16);
            --warn-soft: rgba(220,104,3,0.18);
            --bad: #F04438;
            --bad-soft: rgba(240,68,56,0.18);
            --ink: #f8fafc;
            --muted: #94a3b8;
            --line: #374151;
            --surface: #1f2937;
            --s1: #2EA875;
            --s2: #5B84E0;
            --s3: #C08033;
            --s4: #9A6FB8;
            --pa-chevron: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.75 6 6.25 11 1.75' fill='none' stroke='%2394a3b8' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        }

        /* ── الرأس المضغوط: عنوان + فصل + ثلاثة أرقام، والشرح مطويّ ── */
        .pa-head { margin-bottom: 1rem; }
        .pa-head-main { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.6rem 1rem; }
        .pa-head-title { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
        .pa-sem { font-size: 0.72rem; font-weight: 800; color: var(--ok); background: var(--ok-soft); border-radius: 999px; padding: 0.15rem 0.6rem; font-variant-numeric: tabular-nums; }
        .pa-head-stats { display: flex; flex-wrap: wrap; gap: 0.4rem 1.1rem; font-size: 0.76rem; color: var(--muted); }
        .pa-head-stats b { font-size: 1rem; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; margin-inline-end: 0.15rem; }
        .pa-about { margin-top: 0.5rem; font-size: 0.76rem; color: var(--muted); }
        .pa-about summary { cursor: pointer; display: inline-block; color: var(--ok); font-weight: 700; list-style: none; }
        .pa-about summary::-webkit-details-marker { display: none; }
        .pa-about summary::before { content: '›'; display: inline-block; margin-inline-end: 0.3rem; transition: transform .15s ease; }
        .pa-about[open] summary::before { transform: rotate(-90deg); }
        .pa-about p { margin: 0.4rem 0 0; line-height: 1.9; max-width: 72ch; }

        /* ── أعداد SIS ── */
        .sis-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.6rem; flex-wrap: wrap; }
        .sis-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(118px, 1fr)); gap: 0.55rem; padding: 0.35rem 0.25rem 0.5rem; }
        .sis-tile { border: 1px solid var(--line); border-radius: 12px; padding: 0.7rem 0.85rem; min-width: 0; }
        .sis-tile .v { font-size: 1.35rem; font-weight: 800; color: var(--ink); line-height: 1.15; font-variant-numeric: tabular-nums; }
        .sis-tile .l { font-size: 0.72rem; font-weight: 700; color: var(--ink); margin-top: 0.15rem; }
        .sis-tile .h { font-size: 0.66rem; color: var(--muted); margin-top: 0.1rem; }
        .sw { display: inline-block; width: 0.55rem; height: 0.55rem; border-radius: 3px; vertical-align: middle; margin-inline-end: 0.3rem; }
        .sw.sis { background: var(--s2); }
        .pa-legend { display: inline-flex; align-items: center; margin-inline-start: 0.6rem; color: var(--muted); }
        .tc-sis { display: flex; align-items: center; gap: 0.2rem; font-size: 0.7rem; color: var(--muted); padding-top: 0.5rem; margin-top: auto; border-top: 1px dashed var(--line); }
        .tc-sis b { color: var(--ink); font-weight: 800; font-variant-numeric: tabular-nums; }

        /* ── المؤشرات: المعادلة خلف زر «؟» ── */
        .kpi-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.4rem; }
        .kpi-how {
            flex: 0 0 auto; width: 1.35rem; height: 1.35rem; border-radius: 999px; line-height: 1;
            border: 1px solid var(--line); background: transparent; color: var(--muted);
            font-size: 0.72rem; font-weight: 800; cursor: pointer;
        }
        .kpi-how:hover, .kpi-how[aria-expanded="true"] { color: var(--ok); border-color: var(--ok); }
        .kpi-how:focus-visible { outline: 2px solid var(--ok); outline-offset: 2px; }

        .pa-tabs {
            position: sticky; top: 4rem; z-index: 10;
            display: flex; gap: 0.35rem; overflow-x: auto;
            padding: 0.55rem 0.15rem; margin-bottom: 1rem;
            background: rgba(255,255,255,0.92);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid var(--line);
            scrollbar-width: none;
        }
        .pa-tabs::-webkit-scrollbar { display: none; }
        :is(.dark) .pa-tabs { background: rgba(17,24,39,0.92); }
        .pa-tab {
            flex: 0 0 auto;
            display: inline-flex; align-items: center; gap: 0.4rem;
            border: 1px solid var(--line); background: var(--surface); color: var(--muted);
            border-radius: 999px; padding: 0.42rem 1rem;
            font-size: 0.78rem; font-weight: 700; cursor: pointer;
            transition: background .15s ease, color .15s ease, border-color .15s ease;
            white-space: nowrap;
        }
        .pa-tab:hover { border-color: var(--ok); color: var(--ok); }
        .pa-tab:focus-visible { outline: 2px solid var(--ok); outline-offset: 2px; }
        .pa-tab[aria-selected="true"] { background: #1B8354; border-color: #1B8354; color: #fff; }
        .pa-tab .b {
            font-size: 0.68rem; font-weight: 800; font-variant-numeric: tabular-nums;
            background: var(--ok-soft); color: var(--ink); border-radius: 999px; padding: 0.05rem 0.42rem;
        }
        .pa-tab[aria-selected="true"] .b { background: rgba(255,255,255,0.22); color: #fff; }

        .pa-controls { display: flex; flex-wrap: wrap; gap: 0.55rem; align-items: center; margin-bottom: 1.1rem; }
        .pa-chip {
            border: 1px solid var(--line); background: var(--surface); color: var(--ink);
            border-radius: 999px; padding: 0.3rem 0.85rem;
            font-size: 0.75rem; font-weight: 700; cursor: pointer;
        }
        .pa-chip[data-active="1"] { background: #1B8354; border-color: #1B8354; color: #fff; }
        /*
         * السهم يُرسم هنا لا يُترك للمتصفح.
         *
         * @tailwindcss/forms styles bare selects with a chevron pinned to
         * `right 0.5rem`, which is the *start* edge in RTL — so the arrow lands
         * on top of the first Arabic word. Restoring the padding it also sets
         * would only move the collision; the fix is to take the arrow over
         * entirely and place it at the inline end, which in RTL is the left.
         */
        .pa-select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            border: 1px solid var(--line); border-radius: 999px;
            padding-block: 0.35rem;
            padding-inline: 0.9rem 2rem;   /* the end side carries the chevron */
            font-size: 0.78rem; min-width: 170px;
            background-color: var(--surface); color: var(--ink);
            background-image: var(--pa-chevron);
            background-repeat: no-repeat;
            background-position: left 0.8rem center;
            background-size: 0.68rem auto;
            cursor: pointer;
            text-overflow: ellipsis;
        }
        /* Edge's own arrow would otherwise survive `appearance: none`. */
        .pa-select::-ms-expand { display: none; }
        .pa-select:focus-visible { outline: 2px solid #1B8354; outline-offset: 1px; }

        .pa-card {
            background: var(--surface); border: 1px solid var(--line); border-radius: 14px;
            overflow: hidden; margin-bottom: 1.15rem;
        }
        .pa-card-head { padding: 0.85rem 1.1rem; border-bottom: 1px solid var(--line); }
        .pa-card-head h3 { margin: 0; font-size: 0.95rem; font-weight: 800; color: var(--ink); }
        .pa-card-head p  { margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--muted); line-height: 1.8; }
        .pa-card-body { padding: 0.4rem 0.55rem 0.7rem; overflow-x: auto; }

        .pa-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
        .pa-table th {
            text-align: start; padding: 0.55rem 0.7rem;
            font-size: 0.72rem; font-weight: 700; color: var(--muted);
            border-bottom: 1px solid var(--line); white-space: nowrap;
        }
        .pa-table td {
            padding: 0.55rem 0.7rem; border-bottom: 1px solid var(--line);
            color: var(--ink); vertical-align: top;
        }
        .pa-table tr:last-child td { border-bottom: 0; }
        .pa-num { font-variant-numeric: tabular-nums; font-weight: 700; }
        .pa-code { font-family: ui-monospace, Menlo, monospace; font-size: 0.72rem; color: var(--muted); direction: ltr; unicode-bidi: isolate; }

        /* ── المؤشرات — نفس معاملة .sstat: الرقم كبيراً، التسمية تحته، المعادلة
           باهتة، واللون فقط حين يستحقه الرقم ── */
        .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.65rem; }
        .kpi { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 0.8rem 0.95rem; display: flex; flex-direction: column; }
        .kpi .value { font-size: 1.55rem; font-weight: 800; color: var(--ink); line-height: 1.15; font-variant-numeric: tabular-nums; }
        .kpi .value.none { font-size: 0.86rem; color: var(--warn); font-weight: 800; line-height: 1.6; padding-top: 0.25rem; }
        .kpi .label { font-size: 0.72rem; font-weight: 700; color: var(--muted); margin-top: 0.2rem; }
        .kpi .formula {
            display: block; margin-top: 0.5rem; padding-top: 0.4rem;
            border-top: 1px dashed var(--line);
            font-size: 0.66rem; color: var(--muted); line-height: 1.7;
        }
        .kpi .frac { font-variant-numeric: tabular-nums; color: var(--ink); font-weight: 700; }
        .kpi .note { display: block; margin-top: 0.3rem; font-size: 0.66rem; color: var(--muted); line-height: 1.7; }

        /* ── الشريط الفصلي — بطاقات؛ حلقة واضحة على الفصل الجاري، و«لم يُمسح
           بعد» بدل صفوف أصفار للفصل الذي لم يُقرأ ── */
        .strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(165px, 1fr)); gap: 0.75rem; padding: 0.35rem 0.25rem 0.5rem; }
        .sem {
            position: relative; background: var(--surface); border: 1px solid var(--line);
            border-radius: 12px; padding: 0.8rem 0.9rem; min-width: 0;
        }
        .sem.now { border-color: var(--ok); box-shadow: 0 0 0 3px var(--ok-soft); }
        .sem-head { display: flex; align-items: baseline; justify-content: space-between; gap: 0.4rem; }
        .sem .code { font-size: 1.15rem; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; }
        .sem dl { margin: 0.6rem 0 0; display: grid; grid-template-columns: 1fr auto; gap: 0.3rem 0.5rem; }
        .sem dt { font-size: 0.7rem; color: var(--muted); }
        .sem dd { margin: 0; font-size: 0.8rem; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; text-align: end; }
        .sem dd.na { font-weight: 700; color: var(--muted); font-size: 0.68rem; }
        .sem-unswept { margin: 0.7rem 0 0.2rem; font-size: 0.74rem; color: var(--muted); line-height: 1.7; }
        .sem-unswept b { display: block; color: var(--ink); font-weight: 800; font-size: 0.8rem; }

        /* ── الوسوم ── */
        .pill { display: inline-block; padding: 0.12rem 0.55rem; border-radius: 999px; font-size: 0.68rem; font-weight: 700; white-space: nowrap; }
        .pill.crit  { background: var(--warn-soft); color: var(--warn); }
        .pill.high  { background: var(--ok-soft); color: var(--ok); }
        .pill.med   { background: var(--line); color: var(--muted); }
        .pill.off   { background: var(--warn-soft); color: var(--warn); }
        .pill.on    { background: var(--ok-soft); color: var(--ok); }
        .pill.muted { background: var(--line); color: var(--muted); }
        .pill.tier  { background: transparent; color: var(--muted); border: 1px solid var(--line); }
        .pill.mode  { background: transparent; color: var(--ink); border: 1px solid var(--line); }

        /* ── شبكة الأسبوع ── */
        .grid-wrap { overflow-x: auto; padding: 0.5rem 0.2rem; }
        .wk { border-collapse: separate; border-spacing: 2px; font-size: 0.62rem; }
        .wk th { color: var(--muted); font-weight: 700; padding: 0.15rem 0.3rem; white-space: nowrap; }
        .wk th.hour { font-variant-numeric: tabular-nums; direction: ltr; }
        .wk td { width: 26px; height: 22px; border-radius: 4px; background: var(--ok-soft); }
        .wk td.closed  { background: repeating-linear-gradient(45deg, var(--line), var(--line) 3px, transparent 3px, transparent 6px); }
        .wk td.student { background: var(--warn); opacity: 0.55; }
        .wk td.advisor { background: var(--muted); opacity: 0.45; }
        .wk td.both    { background: var(--ink); opacity: 0.55; }
        .wk td.chosen  { background: var(--ok); box-shadow: 0 0 0 2px var(--ink); }
        .legend { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 0.6rem; font-size: 0.7rem; color: var(--muted); }
        .legend i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-inline-end: 0.3rem; vertical-align: -2px; }

        /* ── الرسوم ──
           الأشرطة أفقية لأن العناوين عربية طويلة، القيمة عند نهاية الشريط لا
           فوقه، والنص لا يلبس لون السلسلة أبداً — العلامة الملوّنة وحدها تحمل
           الهوية. */
        [x-cloak] { display: none !important; }
        .pa-chart { position: relative; padding: 0.55rem 0.65rem 0.8rem; }
        .pa-tip {
            position: absolute; z-index: 20; pointer-events: none;
            transform: translate(-50%, 0);
            background: #111927; color: #f8fafc;
            border: 1px solid #374151; border-radius: 8px;
            padding: 0.3rem 0.6rem; font-size: 0.7rem; white-space: nowrap;
            box-shadow: 0 4px 14px rgba(0,0,0,0.28); direction: rtl;
        }
        .pa-tip strong { font-weight: 800; }

        .chart-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 1.15rem; }
        .chart-cols .pa-card { margin-bottom: 0; }
        @media (max-width: 920px) { .chart-cols { grid-template-columns: 1fr; } }

        /* شريط أفقي: التسمية في البداية، الامتلاء، ثم القيمة عند نهاية الشريط.
           الزوايا مدوّرة عند طرف البيانات فقط — القاعدة تبقى قائمة. */
        .fnl-row { display: grid; grid-template-columns: 8.5rem 1fr; align-items: center; gap: 0.6rem; padding: 0.22rem 0.3rem; }
        .fnl-label { font-size: 0.72rem; font-weight: 700; color: var(--muted); }
        .fnl-track, .hbar-track { display: flex; align-items: center; gap: 0.45rem; min-height: 16px; }
        .fnl-track { min-height: 22px; }
        .fnl-fill { display: block; height: 22px; background: var(--s1); border-start-end-radius: 4px; border-end-end-radius: 4px; min-width: 2px; }
        .fnl-val, .hbar-val { font-size: 0.75rem; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; white-space: nowrap; }
        .fnl-conv { font-size: 0.66rem; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
        .fnl-note { font-size: 0.7rem; color: var(--muted); margin: 0.55rem 0.3rem 0; line-height: 1.8; }

        /* أشرطة الخطوات أزرار حقيقية: الرسم مرشِّح، ولوحة المفاتيح تصل إليه. */
        .hbar {
            display: grid; grid-template-columns: 11.5rem 1fr; align-items: center; gap: 0.6rem;
            width: 100%; border: 0; background: transparent; margin: 0;
            padding: 0.24rem 0.3rem; border-radius: 8px; cursor: pointer; text-align: start;
        }
        .hbar:hover { background: var(--ok-soft); }
        .hbar:hover .hbar-fill { filter: brightness(1.12); }
        .hbar:focus-visible { outline: 2px solid var(--s1); outline-offset: 2px; }
        .hbar-label { font-size: 0.72rem; font-weight: 700; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .hbar-fill { display: block; height: 16px; background: var(--s1); border-start-end-radius: 4px; border-end-end-radius: 4px; min-width: 2px; }
        @media (max-width: 560px) { .hbar { grid-template-columns: 7.5rem 1fr; } .fnl-row { grid-template-columns: 7rem 1fr; } }

        /* شدة واحدة مكدّسة: تدرّج لون التحذير — ترتيب لا هويات — وفواصل ٢px من
           لون السطح بين القطع. */
        .stack { display: flex; gap: 2px; height: 22px; }
        .stack i { display: block; height: 100%; background: var(--warn); border-radius: 2px; min-width: 3px; }
        .stack-legend { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 0.6rem; font-size: 0.72rem; color: var(--ink); }
        .stack-legend i { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-inline-end: 0.35rem; vertical-align: -1px; background: var(--warn); }
        .stack-legend b { font-weight: 800; font-variant-numeric: tabular-nums; }

        /* الاتجاه الزمني يُرسم بمحور زمن يساري كما تُقرأ الأرقام. */
        .trend-wrap { direction: ltr; }
        .trend-wrap svg { width: 100%; height: auto; display: block; }
        .trend-wrap text { font-size: 11px; fill: var(--muted); font-variant-numeric: tabular-nums; }
        .trend-wrap text.end { fill: var(--ink); font-weight: 700; }
        .trend-wrap .grid { stroke: var(--line); stroke-width: 1; }
        /* Every week keeps a small visible marker: a quiet week is a zero,
           and a line whose interior points vanish reads as two dates joined
           by a slope that never happened. Hover only brightens it. */
        .pt-dot { fill: var(--s1); stroke: var(--surface); stroke-width: 2; opacity: 0.55; transition: opacity 0.1s ease; }
        .pt-g:hover .pt-dot { opacity: 1; }

        /* ── صفوف قابلة للفتح ── */
        tr.pa-open { cursor: pointer; }
        tr.pa-open:hover td { background: var(--ok-soft); }
        tr.pa-open:focus-within td { background: var(--ok-soft); }
        .rowbtn {
            border: 1px solid var(--line); background: var(--surface); color: var(--ok);
            border-radius: 999px; padding: 0.18rem 0.6rem;
            font-size: 0.68rem; font-weight: 700; cursor: pointer; white-space: nowrap;
        }
        .rowbtn:hover { border-color: var(--ok); }
        .rowbtn:focus-visible { outline: 2px solid var(--ok); outline-offset: 2px; }

        /* ── بطاقات الطلاب ──
           بطاقة لكل طالب لا صف: الاسم والشدة في الرأس، جملة واحدة لكل إشارة
           مع رقمها، والموعد وزرّ واحد في الذيل. الحمولة الخام لا تُرسم هنا أبداً. */
        .sstats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.7rem; margin-bottom: 1rem; }
        .sstat { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 0.7rem 0.9rem; }
        .sstat .v { font-size: 1.45rem; font-weight: 800; color: var(--ink); line-height: 1.15; font-variant-numeric: tabular-nums; }
        .sstat .l { font-size: 0.7rem; font-weight: 700; color: var(--muted); margin-top: 0.15rem; }
        .sstat .f { font-size: 0.66rem; color: var(--muted); margin-top: 0.3rem; line-height: 1.6; }
        .sstat.bad .v { color: var(--bad); }
        .sstat.warn .v { color: var(--warn); }

        .sgrid { display: grid; grid-template-columns: 1fr; gap: 0.85rem; padding: 0.35rem 0.25rem 0.5rem; }
        @media (min-width: 720px) { .sgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 1240px) { .sgrid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

        .sc {
            display: flex; flex-direction: column; gap: 0.6rem;
            background: var(--surface); border: 1px solid var(--line); border-radius: 14px;
            padding: 0.85rem 0.95rem; cursor: pointer; min-width: 0;
            transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
        }
        .sc:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(17,25,39,0.08); border-color: var(--muted); }
        :is(.dark) .sc:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
        .sc:focus-within { border-color: var(--ok); }
        .sc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.6rem; }
        .sc-name { font-size: 0.95rem; font-weight: 800; color: var(--ink); line-height: 1.4; min-width: 0; overflow-wrap: anywhere; }
        .sc-name.none { color: var(--muted); font-weight: 700; }
        .sc-sub { font-size: 0.7rem; color: var(--muted); margin-top: 0.15rem; line-height: 1.6; }
        .sc-tags { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.3rem; flex: 0 0 auto; }
        .sc-adv { font-size: 0.74rem; color: var(--muted); display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; }
        .sc-adv b { font-weight: 700; color: var(--ink); }

        .sig-list { display: flex; flex-direction: column; gap: 0.3rem; }
        .sig {
            position: relative; border: 1px solid var(--line); border-radius: 8px;
            background: var(--surface); padding-inline-start: 0.25rem; overflow: hidden;
        }
        /* شريط الشدة عند حافة البداية: اللون هوية، والكلمة في الرأس تُقرأ */
        .sig::before {
            content: ''; position: absolute; inset-inline-start: 0; top: 0; bottom: 0;
            width: 3px; background: var(--sigc, var(--muted));
        }
        .sig.crit { --sigc: var(--bad); }
        .sig.high { --sigc: var(--warn); }
        .sig.med  { --sigc: var(--muted); }
        .sig.done { --sigc: var(--ok); opacity: 0.75; }
        /* الشريط زر عندما تكون له تفاصيل، وإلا فهو نصّ ينقر إلى البطاقة */
        .sig-btn {
            display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.6rem; align-items: center;
            width: 100%; margin: 0; border: 0; background: transparent; color: inherit; font: inherit;
            text-align: start; padding: 0.4rem 0.6rem;
        }
        button.sig-btn { cursor: pointer; }
        button.sig-btn:hover { background: var(--ok-soft); }
        button.sig-btn:focus-visible { outline: 2px solid var(--ok); outline-offset: -2px; }
        .sig-main { display: block; min-width: 0; }
        .sig-top { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }
        .sig-code {
            font-family: ui-monospace, Menlo, monospace; font-size: 0.66rem; font-weight: 700;
            color: var(--muted); direction: ltr; unicode-bidi: isolate;
            border: 1px solid var(--line); border-radius: 5px; padding: 0 0.3rem; line-height: 1.5;
        }
        .sig-h { display: block; font-size: 0.78rem; line-height: 1.55; color: var(--muted); margin-top: 0.1rem; overflow-wrap: anywhere; }
        .sig-more { display: none; }
        button.sig-btn .sig-top::after { content: '⌄'; margin-inline-start: auto; color: var(--muted); font-size: 0.85rem; line-height: 1; display: inline-block; transition: transform .15s ease; }
        button.sig-btn[aria-expanded="true"] .sig-top::after { transform: rotate(180deg); }
        .stat-tile { display: block; text-align: center; min-width: 3rem; padding-inline-start: 0.5rem; border-inline-start: 1px dashed var(--line); }
        .stat-tile .v { display: block; font-size: 1rem; font-weight: 800; line-height: 1.1; font-variant-numeric: tabular-nums; color: var(--ink); direction: ltr; unicode-bidi: isolate; }
        .stat-tile.bad .v { color: var(--bad); }
        .stat-tile.warn .v { color: var(--warn); }
        .stat-tile.ok .v { color: var(--ok); }
        .stat-tile .l { display: block; font-size: 0.6rem; color: var(--muted); font-weight: 700; margin-top: 0.15rem; white-space: nowrap; }

        /* التفاصيل — صفوف معنونة بالعربية، تُفتح بنقرة على الشريط ولا تفتح الملف */
        .sig-det { border-top: 1px dashed var(--line); margin: 0 0.7rem 0.55rem; padding-top: 0.45rem; }
        .sig-det .row { display: flex; justify-content: space-between; gap: 0.6rem; font-size: 0.8rem; line-height: 1.7; color: var(--ink); }
        .sig-det .row + .row { border-top: 1px solid var(--line); }
        .sig-det .k { min-width: 0; color: var(--muted); }
        .sig-det .k .pa-code { color: var(--ink); font-size: 0.74rem; margin-inline-end: 0.3rem; }
        .sig-det .val { font-variant-numeric: tabular-nums; font-weight: 700; text-align: end; flex: 0 0 auto; max-width: 55%; overflow-wrap: anywhere; }
        .sig-det .lbl { font-size: 0.68rem; color: var(--muted); margin-bottom: 0.25rem; }

        .sc-more {
            border: 1px dashed var(--line); background: transparent; color: var(--ok);
            border-radius: 10px; padding: 0.4rem 0.7rem; font-size: 0.74rem; font-weight: 700;
            cursor: pointer; width: 100%; text-align: center;
        }
        .sc-more:hover { background: var(--ok-soft); }
        .sc-more:focus-visible { outline: 2px solid var(--ok); outline-offset: 1px; }

        .sc-foot { display: flex; justify-content: space-between; align-items: center; gap: 0.6rem; margin-top: auto; padding-top: 0.6rem; border-top: 1px solid var(--line); flex-wrap: wrap; }
        .sc-foot .when { font-size: 0.7rem; color: var(--muted); font-variant-numeric: tabular-nums; margin-inline-start: 0.35rem; }

        @media (prefers-reduced-motion: reduce) {
            .sc { transition: none; }
            .sc:hover { transform: none; }
        }

        /* ── ملف الطالب — اللوح المنزلق ── */
        .pa-overlay { position: fixed; inset: 0; background: rgba(17,25,39,0.45); z-index: 40; }
        .pa-drawer {
            position: fixed; top: 0; bottom: 0; inset-inline-start: 0;
            width: min(30rem, 94vw); background: var(--surface); color: var(--ink);
            z-index: 41; overflow-y: auto;
            border-inline-end: 1px solid var(--line);
            box-shadow: 0 0 40px rgba(0,0,0,0.25);
            animation: pa-slide 0.2s ease both;
        }
        /* inline-start في صفحة RTL هو اليمين، فالانزلاق يبدأ من خارجه. */
        @keyframes pa-slide { from { transform: translateX(100%); } to { transform: none; } }
        .drawer-head {
            position: sticky; top: 0; z-index: 2;
            display: flex; justify-content: space-between; align-items: flex-start; gap: 0.6rem;
            background: var(--surface); border-bottom: 1px solid var(--line);
            padding: 0.9rem 1.1rem;
        }
        .drawer-head h3 { margin: 0; font-size: 1rem; font-weight: 800; color: var(--ink); }
        .pa-x {
            flex: 0 0 auto; width: 1.9rem; height: 1.9rem; line-height: 1;
            border: 1px solid var(--line); background: var(--surface); color: var(--muted);
            border-radius: 999px; font-size: 0.95rem; cursor: pointer;
        }
        .pa-x:hover { color: var(--ink); border-color: var(--muted); }
        .pa-x:focus-visible { outline: 2px solid var(--ok); outline-offset: 2px; }
        .drawer-sec { padding: 0.85rem 1.1rem; border-bottom: 1px solid var(--line); }
        .drawer-sec:last-child { border-bottom: 0; }
        .drawer-sec h4 { margin: 0 0 0.55rem; font-size: 0.8rem; font-weight: 800; color: var(--ink); }
        .drawer-empty { margin: 0; font-size: 0.74rem; color: var(--muted); line-height: 1.9; }
        .dcard { border: 1px solid var(--line); border-radius: 10px; padding: 0.55rem 0.65rem; margin-bottom: 0.55rem; font-size: 0.75rem; color: var(--ink); }
        .dcard:last-child { margin-bottom: 0; }
        .dmeta { font-size: 0.68rem; color: var(--muted); margin-top: 0.2rem; line-height: 1.7; }

        /* الخط الزمني: أيقونة لكل نوع، ولونها بحسب القناة عبر ‎--tlc. */
        .tl { list-style: none; margin: 0; padding: 0; padding-inline-start: 1.55rem; position: relative; }
        .tl::before {
            content: ''; position: absolute; top: 0.6rem; bottom: 0.6rem;
            inset-inline-start: 0.6rem; width: 2px; background: var(--line); border-radius: 2px;
        }
        .tl-item { position: relative; padding: 0.3rem 0.5rem 0.85rem; border-radius: 8px; }
        .tl-item:last-child { padding-bottom: 0.3rem; }
        /* فشلٌ صامت يُقرأ نجاحاً — القطعة الفاشلة تُصبغ لا تُهمس. */
        .tl-item.failed { background: var(--bad-soft); }
        .tl-dot {
            position: absolute; inset-inline-start: -1.55rem; top: 0.32rem;
            width: 1.3rem; height: 1.3rem; border-radius: 999px;
            display: flex; align-items: center; justify-content: center;
            background: var(--surface);
            border: 2px solid var(--tlc, var(--muted)); color: var(--tlc, var(--muted));
        }
        .tl-dot svg { width: 0.72rem; height: 0.72rem; }
        .tl-head { font-size: 0.76rem; font-weight: 800; color: var(--ink); }
        .tl-meta { font-size: 0.68rem; color: var(--muted); margin-top: 0.15rem; line-height: 1.7; }
        .tl-detail { font-size: 0.7rem; color: var(--ink); margin-top: 0.25rem; line-height: 1.7; }
        .tl-item.failed .tl-detail { color: var(--bad); font-weight: 700; }
        .pill.bad { background: var(--bad-soft); color: var(--bad); }

        /* هيكل التحميل — يظهر أثناء جلب الملف فلا تُفتح نافذة فارغة فجأة. */
        .pa-skel {
            position: fixed; top: 0; bottom: 0; inset-inline-start: 0;
            width: min(30rem, 94vw); background: var(--surface); z-index: 42;
            border-inline-end: 1px solid var(--line); padding: 1.2rem 1.1rem;
        }
        .pa-skel .bone { height: 14px; border-radius: 6px; background: var(--line); margin-bottom: 0.75rem; animation: pa-pulse 1.2s ease-in-out infinite; }
        @keyframes pa-pulse { 50% { opacity: 0.45; } }

        @media (prefers-reduced-motion: reduce) {
            .pa-drawer, .pa-skel .bone { animation: none; }
            .pt-dot, .pa-tab, .hbar-fill { transition: none; }
        }

        .pa-empty { padding: 1.6rem 0.8rem; text-align: center; font-size: 0.82rem; color: var(--muted); line-height: 1.9; }
        .pa-note {
            border-inline-start: 3px solid var(--ok); background: var(--ok-soft);
            border-radius: 10px; padding: 0.75rem 1rem; margin: 0 0 1rem;
            font-size: 0.78rem; line-height: 1.9; color: var(--ink);
        }
        .pa-warn {
            border-inline-start: 3px solid var(--warn); background: var(--warn-soft);
            border-radius: 10px; padding: 0.75rem 1rem; margin: 0 0 1rem;
            font-size: 0.78rem; line-height: 1.9; color: var(--ink);
        }
        /* المسافات بين أقسام اللوحة تأتي من gap واحد لا من هوامش متفرّقة، فلا
           يجتمع هامشان بين بطاقتين ولا يغيب الهامش تحت الأخيرة. */
        .pa-panel { display: flex; flex-direction: column; gap: 1.1rem; animation: pa-fade .18s ease both; }
        .pa-panel > * { margin-bottom: 0 !important; margin-top: 0 !important; }
        @keyframes pa-fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) { .pa-panel { animation: none; } }

        /* ── الترقيم ── */
        .pager {
            display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.6rem;
            padding: 0.55rem 0.7rem; border-top: 1px solid var(--line);
        }
        .pager.top { border-top: 0; border-bottom: 1px solid var(--line); }
        .pager-range { font-size: 0.76rem; color: var(--muted); font-variant-numeric: tabular-nums; }
        .pager-range b { color: var(--ink); font-weight: 800; }
        .pager-pages { margin-inline-start: 0.25rem; }
        .pager-ctl { display: flex; align-items: center; gap: 0.5rem; }
        .pager-per { min-width: 0; padding-block: 0.28rem; font-size: 0.72rem; }
        .pager-btns { display: inline-flex; gap: 0.3rem; }
        .pager-btn {
            width: 2rem; height: 2rem; border-radius: 999px;
            border: 1px solid var(--line); background: var(--surface); color: var(--ink);
            display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .pager-btn svg { width: 1rem; height: 1rem; }
        .pager-btn:hover:not(:disabled) { border-color: var(--ok); color: var(--ok); }
        .pager-btn:focus-visible { outline: 2px solid var(--ok); outline-offset: 2px; }
        .pager-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── بطاقات الخطوات ── */
        .tgrid { display: grid; grid-template-columns: 1fr; gap: 0.85rem; padding: 0.35rem 0.25rem 0.5rem; }
        @media (min-width: 720px) { .tgrid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 1240px) { .tgrid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        .tc {
            display: flex; flex-direction: column; gap: 0.55rem; min-width: 0;
            width: 100%; margin: 0; text-align: start; font: inherit; color: inherit;
            background: var(--surface); border: 1px solid var(--line); border-radius: 14px;
            padding: 0.95rem 1rem; cursor: pointer;
            transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
        }
        .tc:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(17,25,39,0.08); border-color: var(--muted); }
        :is(.dark) .tc:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
        .tc:focus-visible { outline: 2px solid var(--ok); outline-offset: 2px; }
        .tc.off { cursor: default; background: transparent; border-style: dashed; }
        .tc.off:hover { transform: none; box-shadow: none; border-color: var(--line); }
        .tc.off .tc-label { color: var(--muted); }
        .tc-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; }
        .tc-tags { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 0.3rem; flex: 0 0 auto; }
        .tc-label { font-size: 0.9rem; font-weight: 800; color: var(--ink); line-height: 1.5; min-width: 0; overflow-wrap: anywhere; }
        .tc-hero { display: flex; align-items: flex-end; gap: 0.45rem; }
        .tc-hero .v { font-size: 1.7rem; font-weight: 800; color: var(--ink); line-height: 1.1; font-variant-numeric: tabular-nums; }
        .tc-hero .l { font-size: 0.7rem; color: var(--muted); font-weight: 700; padding-bottom: 0.2rem; }
        .tc-hero .tc-bars { margin-inline-start: auto; width: 4.5rem; }
        .tc-off { display: block; font-size: 0.76rem; font-weight: 700; color: var(--warn); line-height: 1.6; }
        /* الشريط المصغّر: درجة واحدة، ≤24px، فواصل 2px، الفصل الجاري أغمق */
        .tc-bars { display: flex; align-items: flex-end; gap: 2px; height: 24px; }
        .tc-bars i { display: block; flex: 1 1 0; min-height: 2px; background: var(--s1); opacity: 0.35; border-radius: 2px 2px 0 0; }
        .tc-bars i.now { opacity: 1; }
        .tc-bars-l { display: flex; gap: 2px; margin-top: 0.15rem; }
        .tc-bars-l span { flex: 1 1 0; text-align: center; font-size: 0.6rem; color: var(--muted); font-variant-numeric: tabular-nums; direction: ltr; }
        .tc-bars-l span.now { color: var(--ink); font-weight: 800; }
        .tc-what { font-size: 0.74rem; color: var(--muted); line-height: 1.7; margin-top: auto; }
        .tc-what b { color: var(--ink); font-weight: 700; }

        /* ── بطاقات المواعيد ── */
        .ac-time { display: flex; align-items: baseline; gap: 0.5rem; flex-wrap: wrap; }
        .ac-time .day { font-size: 1.05rem; font-weight: 800; color: var(--ink); }
        .ac-time .clock { font-size: 1.35rem; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; direction: ltr; unicode-bidi: isolate; }
        .ac-time .date { font-size: 0.72rem; color: var(--muted); font-variant-numeric: tabular-nums; direction: ltr; unicode-bidi: isolate; }
        .ac-why { font-size: 0.78rem; color: var(--ink); line-height: 1.7; border-inline-start: 3px solid var(--line); padding-inline-start: 0.6rem; }
        .ac-why b { font-weight: 700; color: var(--muted); }
        .ac-why.none { color: var(--muted); }
        .ac-meta { font-size: 0.72rem; color: var(--muted); display: flex; flex-wrap: wrap; gap: 0.35rem 0.6rem; align-items: center; }

        /* البطاقة المختصرة: وقت، حالة، طالب، مرشد — والباقي في النافذة. */
        .sc.ac { gap: 0.6rem; }
        .sc.ac.is-held { border-inline-start: 4px solid var(--ok); }
        .ac-state { display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; }
        .ac-who { margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
        .ac-who div { min-width: 0; }
        .ac-who dt { font-size: 0.66rem; color: var(--muted); margin: 0; }
        .ac-who dd { margin: 0.1rem 0 0; font-size: 0.82rem; font-weight: 700; color: var(--ink); overflow-wrap: anywhere; line-height: 1.5; }
        .sc.ac:focus-visible { outline: 2px solid var(--ok); outline-offset: 2px; }

        /* نافذة الموعد: منتصف الشاشة، لا لوح جانبي — قراءة محضر أطول من قراءة ملف. */
        .pa-modal-wrap { position: fixed; inset: 0; z-index: 41; display: flex; align-items: center; justify-content: center; padding: 1rem; pointer-events: none; }
        .pa-modal {
            pointer-events: auto; width: min(44rem, 100%); max-height: min(92vh, 60rem); overflow-y: auto;
            background: var(--surface); color: var(--ink); border: 1px solid var(--line); border-radius: 16px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.28); animation: pa-pop 0.18s ease both;
        }
        @keyframes pa-pop { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: none; } }
        .pa-modal .drawer-head { border-radius: 16px 16px 0 0; }
        .pa-modal .mhead-sub { font-size: 0.72rem; color: var(--muted); margin-top: 0.2rem; line-height: 1.7; }
        .m-time { display: flex; align-items: baseline; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
        .m-time .day { font-size: 1rem; font-weight: 800; }
        .m-time .clock { font-size: 1.5rem; font-weight: 800; font-variant-numeric: tabular-nums; direction: ltr; unicode-bidi: isolate; }
        .m-time .date { font-size: 0.74rem; color: var(--muted); direction: ltr; unicode-bidi: isolate; }
        .m-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem 1rem; margin: 0; }
        @media (min-width: 640px) { .m-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        .m-grid dt { font-size: 0.66rem; color: var(--muted); }
        .m-grid dd { margin: 0.1rem 0 0; font-size: 0.8rem; font-weight: 700; color: var(--ink); overflow-wrap: anywhere; }
        .m-minutes { margin: 0; font-size: 0.82rem; line-height: 1.95; color: var(--ink); white-space: pre-line; }
        .m-recs { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45rem; counter-reset: rec; }
        .m-recs li {
            counter-increment: rec; position: relative; padding: 0.55rem 0.7rem; padding-inline-start: 2.2rem;
            border: 1px solid var(--line); border-radius: 10px; font-size: 0.8rem; line-height: 1.75; background: var(--ok-soft);
        }
        .m-recs li::before {
            content: counter(rec); position: absolute; inset-inline-start: 0.6rem; top: 0.55rem;
            width: 1.25rem; height: 1.25rem; border-radius: 999px; background: var(--ok); color: #fff;
            font-size: 0.68rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
        }
        .m-outs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }
        @media (min-width: 640px) { .m-outs { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
        .m-out { border: 1px solid var(--line); border-radius: 10px; padding: 0.5rem 0.6rem; }
        .m-out .l { font-size: 0.64rem; color: var(--muted); }
        .m-out .v { font-size: 1rem; font-weight: 800; color: var(--ink); font-variant-numeric: tabular-nums; margin-top: 0.1rem; }
        .m-out .v.up { color: var(--ok); }
        .m-out .v.down { color: var(--bad); }
        .m-pending { margin: 0; font-size: 0.76rem; color: var(--muted); line-height: 1.9; border: 1px dashed var(--line); border-radius: 10px; padding: 0.6rem 0.75rem; }
        .m-foot { display: flex; justify-content: space-between; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
        .m-foot .rowbtn.primary { background: var(--ok); color: #fff; border-color: var(--ok); }
        @media (prefers-reduced-motion: reduce) { .pa-modal { animation: none; } }

        /* ── الجدولة: الشبكة بطاقة، والدليل صف واضح فوقها ── */
        .wk-legend { display: flex; flex-wrap: wrap; gap: 0.5rem 0.9rem; padding: 0.55rem 0.7rem; border-bottom: 1px solid var(--line); font-size: 0.72rem; color: var(--ink); }
        .wk-legend i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-inline-end: 0.3rem; vertical-align: -2px; }
        .wk-legend .win { margin-inline-start: auto; color: var(--muted); font-variant-numeric: tabular-nums; }
        .wk th.day { text-align: start; padding-inline-end: 0.5rem; }
        .sch-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.6rem; }


        @media (prefers-reduced-motion: reduce) { .tc { transition: none; } .tc:hover { transform: none; } }
    </style>

    {{--
        ══════════════════════════════════════════════════════════════════════
        الإرشاد الأكاديمي الاستباقي — the redesigned board.

        The legacy <style> above stays: the dossier / appointment / pager /
        SIS-summary partials are written against it. Everything under `.mc`
        below is the new layer: a command bar that states the scope in words,
        a filter rail that visibly acts (loading state + baseline delta), a
        journey nav that IS the funnel, and one calm panel per stage.
        ══════════════════════════════════════════════════════════════════════
    --}}
    <style>
        .mc { --r: 18px; --r-sm: 12px; --shadow: 0 1px 2px rgba(17,25,39,.05), 0 8px 24px -12px rgba(17,25,39,.12); }
        .mc * { box-sizing: border-box; }
        .mc .sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
        .mc [x-cloak] { display: none !important; }
        .mc .num { font-variant-numeric: tabular-nums; }
        .mc .hero-num { font-variant-numeric: proportional-nums; letter-spacing: -0.02em; }

        /* ── شريط القيادة ── */
        .mc-cmd { position: relative; overflow: hidden; border-radius: var(--r); background: linear-gradient(135deg, #0F3D2A 0%, #1B5C3E 55%, #24744C 100%); color: #fff; padding: 1.35rem 1.5rem 1.15rem; box-shadow: var(--shadow); margin-bottom: 0.9rem; }
        .mc-cmd::before { content: ''; position: absolute; inset: 0; background: radial-gradient(90% 120% at 100% 0%, rgba(255,255,255,.14), transparent 55%), radial-gradient(60% 80% at 0% 100%, rgba(255,255,255,.08), transparent 60%); pointer-events: none; }
        .mc-cmd-grid { position: relative; display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 2fr); gap: 1.2rem 2rem; align-items: stretch; }
        @media (max-width: 960px) { .mc-cmd-grid { grid-template-columns: 1fr; } }
        .mc-kicker { display: inline-flex; align-items: center; gap: .45rem; font-size: .7rem; font-weight: 800; letter-spacing: .04em; opacity: .85; text-transform: uppercase; }
        .mc-kicker .dot { width: .5rem; height: .5rem; border-radius: 999px; background: #7EE2B0; box-shadow: 0 0 0 4px rgba(126,226,176,.25); animation: mc-pulse 2.4s ease-in-out infinite; }
        @keyframes mc-pulse { 0%,100% { box-shadow: 0 0 0 3px rgba(126,226,176,.25);} 50% { box-shadow: 0 0 0 7px rgba(126,226,176,.08);} }
        .mc-title { margin: .35rem 0 .25rem; font-size: 1.55rem; font-weight: 900; line-height: 1.25; }
        .mc-scope { display: flex; flex-wrap: wrap; gap: .4rem; margin-top: .55rem; }
        .mc-scope .chip { display: inline-flex; align-items: center; gap: .35rem; font-size: .72rem; font-weight: 700; padding: .28rem .7rem; border-radius: 999px; background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18); backdrop-filter: blur(4px); }
        .mc-scope .chip.hot { background: rgba(255,255,255,.92); color: #0F3D2A; }
        .mc-scope .chip .x { border: 0; background: transparent; color: inherit; cursor: pointer; font-weight: 900; line-height: 1; padding: 0 .1rem; opacity: .7; }
        .mc-scope .chip .x:hover { opacity: 1; }
        .mc-lead { margin: .6rem 0 0; font-size: .78rem; line-height: 1.8; opacity: .85; max-width: 46ch; }
        .mc-heroes { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .6rem; align-content: start; }
        @media (max-width: 640px) { .mc-heroes { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        .mc-hero { border-radius: var(--r-sm); background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.16); padding: .8rem .9rem .7rem; min-width: 0; }
        .mc-hero .l { font-size: .7rem; font-weight: 700; opacity: .8; }
        .mc-hero .v { font-size: 1.9rem; font-weight: 900; line-height: 1.1; margin-top: .15rem; }
        .mc-hero .d { font-size: .68rem; opacity: .85; margin-top: .25rem; min-height: 1.1em; }
        .mc-hero .d b { font-weight: 800; }
        .mc-hero .bar { height: 4px; border-radius: 999px; background: rgba(255,255,255,.18); margin-top: .5rem; overflow: hidden; }
        .mc-hero .bar i { display: block; height: 100%; background: #7EE2B0; border-radius: 999px; transition: width .5s ease; }
        .mc-cmd .about { position: relative; margin-top: .9rem; font-size: .74rem; opacity: .85; }
        .mc-cmd .about summary { cursor: pointer; list-style: none; display: inline-flex; align-items: center; gap: .3rem; font-weight: 700; }
        .mc-cmd .about summary::-webkit-details-marker { display: none; }
        .mc-cmd .about p { margin: .4rem 0 0; line-height: 1.85; max-width: 78ch; }

        /* ── مسطرة المرشّحات ── */
        .mc-rail { position: sticky; top: 4rem; z-index: 12; display: flex; flex-wrap: wrap; align-items: center; gap: .5rem .6rem; padding: .6rem .7rem; margin-bottom: .9rem; border-radius: 14px; background: rgba(255,255,255,.88); backdrop-filter: blur(10px); border: 1px solid var(--line); box-shadow: 0 6px 18px -14px rgba(17,25,39,.25); }
        :is(.dark) .mc-rail { background: rgba(31,41,55,.9); }
        .mc-rail .lbl { font-size: .68rem; font-weight: 800; color: var(--muted); margin-inline-end: .1rem; }
        .mc-seg { display: inline-flex; padding: .18rem; border-radius: 999px; background: var(--ok-soft); border: 1px solid var(--line); }
        .mc-seg button { border: 0; background: transparent; color: var(--muted); font-size: .74rem; font-weight: 800; padding: .32rem .8rem; border-radius: 999px; cursor: pointer; transition: all .15s ease; white-space: nowrap; }
        .mc-seg button:hover { color: var(--ok); }
        .mc-seg button[aria-pressed="true"] { background: var(--ok); color: #fff; box-shadow: 0 2px 6px -2px rgba(37,147,95,.5); }
        .mc-seg button small { font-weight: 600; opacity: .8; margin-inline-start: .25rem; }
        .mc-select { position: relative; }
        .mc-select select { appearance: none; -webkit-appearance: none; border: 1px solid var(--line); background: var(--surface) var(--pa-chevron) no-repeat left .65rem center / .7rem; color: var(--ink); border-radius: 999px; padding: .38rem 2rem .38rem .85rem; font-size: .74rem; font-weight: 700; max-width: 260px; cursor: pointer; }
        .mc-select select:focus-visible { outline: 2px solid var(--ok); outline-offset: 1px; }
        .mc-select select[data-active="1"] { border-color: var(--ok); background-color: var(--ok-soft); color: #0F3D2A; }
        :is(.dark) .mc-select select[data-active="1"] { color: #fff; }
        .mc-rail .grow { flex: 1 1 auto; }
        .mc-btn { display: inline-flex; align-items: center; gap: .35rem; border: 1px solid var(--line); background: var(--surface); color: var(--ink); border-radius: 999px; padding: .38rem .8rem; font-size: .72rem; font-weight: 700; cursor: pointer; transition: all .15s ease; }
        .mc-btn:hover { border-color: var(--ok); color: var(--ok); }
        .mc-btn.ghost { border-color: transparent; color: var(--muted); }
        .mc-btn:disabled { opacity: .5; cursor: default; }
        .mc-live { display: inline-flex; align-items: center; gap: .4rem; font-size: .7rem; font-weight: 800; color: var(--ok); }
        .mc-live .spin { width: .85rem; height: .85rem; border-radius: 999px; border: 2px solid var(--ok-soft); border-top-color: var(--ok); animation: mc-spin .8s linear infinite; }
        @keyframes mc-spin { to { transform: rotate(360deg);} }

        /* ── المسار: المراحل كتدفّق متّصل ── */
        .mc-journey { position: relative; display: flex; align-items: stretch; gap: 0; margin-bottom: 1rem; padding: .7rem .5rem .55rem; background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); box-shadow: var(--shadow); overflow-x: auto; }
        .mc-stage { position: relative; flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; text-align: center; background: transparent; border: 0; padding: .2rem .5rem .45rem; cursor: pointer; border-radius: 12px; transition: background .18s ease; }
        .mc-stage:hover { background: var(--ok-soft); }
        .mc-stage:focus-visible { outline: 2px solid var(--ok); outline-offset: -2px; }
        /* the track: from this node's centre to the next node's centre */
        .mc-stage::before { content: ''; position: absolute; top: calc(.2rem + 1.15rem); inset-inline-start: 50%; width: 100%; height: 2px; background: var(--line); z-index: 0; transition: background .25s ease; }
        .mc-stage:last-child::before { display: none; }
        .mc-stage.done::before { background: var(--ok); }
        .mc-stage .arrow { position: absolute; top: calc(.2rem + 1.15rem - .5rem); inset-inline-end: -.5rem; width: 1rem; height: 1rem; color: var(--line); background: var(--surface); border-radius: 999px; z-index: 1; pointer-events: none; }
        .mc-stage.done .arrow { color: var(--ok); }
        .mc-stage:last-child .arrow { display: none; }
        .mc-stage .n { position: relative; z-index: 1; width: 2.3rem; height: 2.3rem; border-radius: 999px; border: 2px solid var(--line); background: var(--surface); display: grid; place-items: center; font-size: .72rem; font-weight: 900; color: var(--muted); letter-spacing: .04em; transition: all .18s ease; }
        .mc-stage:hover .n { border-color: var(--ok); color: var(--ok); }
        .mc-stage.done .n { border-color: var(--ok); color: var(--ok); background: var(--ok-soft); }
        .mc-stage[aria-selected="true"] .n { background: var(--ok); border-color: var(--ok); color: #fff; box-shadow: 0 0 0 4px var(--ok-soft); transform: scale(1.06); }
        .mc-stage .t { font-size: .8rem; font-weight: 800; color: var(--ink); margin-top: .45rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .mc-stage[aria-selected="true"] .t { color: var(--ok); }
        .mc-stage .c { display: flex; align-items: baseline; justify-content: center; gap: .3rem; margin-top: .15rem; min-height: 1.3rem; }
        .mc-stage .c b { font-size: 1.05rem; font-weight: 900; color: var(--ink); }
        .mc-stage .c span { font-size: .64rem; color: var(--muted); font-weight: 700; }
        .mc-stage[aria-selected="true"]::after { content: ''; position: absolute; bottom: 0; inset-inline: 22%; height: 3px; border-radius: 3px 3px 0 0; background: var(--ok); }
        @media (max-width: 1100px) {
            .mc-journey { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: .3rem; }
            .mc-stage::before, .mc-stage .arrow { display: none; }
        }
        @media (max-width: 560px) { .mc-journey { grid-template-columns: repeat(2, minmax(0,1fr)); } }

        /* ── اللوحة والبطاقات ── */
        .mc-panel { position: relative; transition: opacity .2s ease, filter .2s ease; }
        .mc-panel.is-loading { opacity: .55; filter: saturate(.6); pointer-events: none; }
        .mc-panel.is-loading::after { content: 'جارٍ تطبيق النطاق…'; position: sticky; top: 8rem; display: block; width: max-content; margin: 0 auto; background: var(--ink); color: var(--surface); font-size: .74rem; font-weight: 800; padding: .4rem .9rem; border-radius: 999px; z-index: 5; }
        .mc-grid { display: grid; gap: .8rem; }
        .mc-grid.c2 { grid-template-columns: repeat(2, minmax(0,1fr)); }
        .mc-grid.c3 { grid-template-columns: repeat(3, minmax(0,1fr)); }
        .mc-grid.c12 { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
        @media (max-width: 960px) { .mc-grid.c2, .mc-grid.c3, .mc-grid.c12 { grid-template-columns: 1fr; } }
        .mc-card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); box-shadow: var(--shadow); overflow: hidden; margin-bottom: .8rem; min-width: 0; }
        .mc-card > .h { display: flex; align-items: flex-start; justify-content: space-between; gap: .6rem; padding: .95rem 1.1rem .5rem; }
        .mc-card > .h h3 { margin: 0; font-size: .95rem; font-weight: 900; color: var(--ink); }
        .mc-card > .h p { margin: .15rem 0 0; font-size: .72rem; color: var(--muted); line-height: 1.7; }
        .mc-card > .b { padding: .4rem 1.1rem 1rem; }
        .mc-help { flex: 0 0 auto; width: 1.4rem; height: 1.4rem; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--muted); font-size: .72rem; font-weight: 900; cursor: pointer; }
        .mc-help:hover, .mc-help[aria-expanded="true"] { border-color: var(--ok); color: var(--ok); }
        .mc-note { font-size: .7rem; color: var(--muted); line-height: 1.75; margin: .5rem 0 0; }
        .mc-empty { text-align: center; padding: 1.6rem 1rem; color: var(--muted); font-size: .8rem; line-height: 1.8; border: 1px dashed var(--line); border-radius: var(--r-sm); }
        .mc-empty b { color: var(--ink); }

        /* ── المؤشرات ── */
        .mc-kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: .6rem; margin-bottom: .8rem; }
        .mc-kpi { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r-sm); padding: .8rem .9rem .7rem; box-shadow: var(--shadow); }
        .mc-kpi .top { display: flex; align-items: flex-start; justify-content: space-between; gap: .3rem; }
        .mc-kpi .v { font-size: 1.5rem; font-weight: 900; color: var(--ink); line-height: 1.1; }
        .mc-kpi .v.none { font-size: .8rem; color: var(--warn); font-weight: 800; padding-top: .3rem; }
        .mc-kpi .l { font-size: .72rem; font-weight: 700; color: var(--ink); margin-top: .25rem; }
        .mc-kpi .f { font-size: .66rem; color: var(--muted); line-height: 1.7; margin-top: .3rem; }
        .mc-kpi .f b { color: var(--ink); }

        /* ── القمع الأفقي ── */
        .mc-funnel { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: .5rem; }
        @media (max-width: 720px) { .mc-funnel { grid-template-columns: repeat(2, minmax(0,1fr)); } }
        .mc-fstage { position: relative; border-radius: var(--r-sm); padding: .8rem .85rem .7rem; background: var(--ok-soft); overflow: hidden; }
        .mc-fstage::after { content: ''; position: absolute; inset-inline-start: 0; bottom: 0; height: 4px; width: var(--w, 0%); background: var(--ok); opacity: var(--o, 1); border-radius: 0 999px 999px 0; }
        .mc-fstage .k { font-size: .7rem; font-weight: 800; color: var(--muted); }
        .mc-fstage .v { font-size: 1.6rem; font-weight: 900; color: var(--ink); line-height: 1.1; margin-top: .1rem; }
        .mc-fstage .c { font-size: .66rem; color: var(--muted); margin-top: .2rem; }
        .mc-fstage .c b { color: var(--ok); }
        .mc-fstage.zero .v { color: var(--muted); }

        /* ── الأشرطة الأفقية (رسم الخطوات) ── */
        .mc-bars { display: grid; gap: .3rem; }
        .mc-bar { display: grid; grid-template-columns: minmax(0, 190px) minmax(0, 1fr) 3.2rem; align-items: center; gap: .6rem; border: 0; background: transparent; padding: .28rem .35rem; border-radius: 10px; cursor: pointer; text-align: start; width: 100%; color: var(--ink); }
        .mc-bar:hover, .mc-bar:focus-visible { background: var(--ok-soft); outline: none; }
        .mc-bar .lab { font-size: .72rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mc-bar .trk { position: relative; height: 10px; border-radius: 999px; background: var(--line); overflow: hidden; }
        .mc-bar .trk i { position: absolute; inset-inline-start: 0; top: 0; bottom: 0; background: var(--s1); border-radius: 0 999px 999px 0; min-width: 4px; }
        .mc-bar .val { font-size: .78rem; font-weight: 900; text-align: end; }
        .mc-code { display: inline-block; font-size: .62rem; font-weight: 800; color: var(--muted); background: var(--ok-soft); border-radius: 6px; padding: .06rem .4rem; margin-inline-end: .3rem; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

        /* ── الشدة: شريط مكدّس ── */
        .mc-stack { display: flex; height: 16px; border-radius: 999px; overflow: hidden; gap: 2px; background: var(--line); }
        .mc-stack i { display: block; height: 100%; }
        .mc-stack-legend { display: flex; flex-wrap: wrap; gap: .5rem 1rem; margin-top: .6rem; font-size: .72rem; color: var(--muted); }
        .mc-stack-legend b { color: var(--ink); font-weight: 900; }
        .mc-stack-legend i { display: inline-block; width: .7rem; height: .7rem; border-radius: 3px; margin-inline-end: .3rem; vertical-align: -1px; }

        /* ── الاتجاه ── */
        .mc-trend svg { width: 100%; height: auto; display: block; }
        .mc-trend text { font-size: 10px; fill: var(--muted); }
        .mc-trend .grid { stroke: var(--line); stroke-width: 1; }
        .mc-trend .end { fill: var(--ink); font-weight: 800; font-size: 11px; }
        .mc-trend .pt { fill: var(--s1); stroke: var(--surface); stroke-width: 2; }

        /* ── الفصول ── */
        .mc-sems { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: .6rem; }
        .mc-sem { border: 1px solid var(--line); border-radius: var(--r-sm); padding: .75rem .85rem; }
        .mc-sem.now { border-color: var(--ok); background: linear-gradient(180deg, var(--ok-soft), transparent); }
        .mc-sem .top { display: flex; align-items: center; justify-content: space-between; gap: .4rem; margin-bottom: .4rem; }
        .mc-sem .top b { font-size: .95rem; font-weight: 900; }
        .mc-sem dl { display: grid; grid-template-columns: 1fr auto; gap: .2rem .6rem; margin: 0; font-size: .72rem; }
        .mc-sem dt { color: var(--muted); } .mc-sem dd { margin: 0; font-weight: 800; text-align: end; }
        .mc-sem .un { font-size: .7rem; color: var(--muted); line-height: 1.7; }

        /* ── قائمة الأولويات ── */
        .mc-queue { display: grid; gap: .45rem; }
        .mc-q { display: grid; grid-template-columns: 4px minmax(0,1fr) auto; gap: .7rem; align-items: center; border: 1px solid var(--line); border-radius: var(--r-sm); padding: .55rem .7rem .55rem .5rem; background: var(--surface); cursor: pointer; text-align: start; width: 100%; color: var(--ink); transition: all .15s ease; }
        .mc-q:hover { border-color: var(--ok); transform: translateX(-2px); }
        .mc-q .stripe { width: 4px; height: 100%; min-height: 2.2rem; border-radius: 999px; background: var(--muted); }
        .mc-q.crit .stripe { background: var(--bad); } .mc-q.high .stripe { background: var(--warn); } .mc-q.med .stripe { background: var(--s2); }
        .mc-q .nm { font-size: .8rem; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mc-q .why { font-size: .68rem; color: var(--muted); margin-top: .1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mc-q .st { font-size: .66rem; font-weight: 800; white-space: nowrap; }

        /* ── رادار الخطوات ── */
        .mc-radar { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: .65rem; }
        .mc-t { position: relative; display: flex; flex-direction: column; gap: .45rem; text-align: start; border: 1px solid var(--line); border-radius: var(--r-sm); background: var(--surface); padding: .8rem .9rem .75rem .9rem; cursor: pointer; transition: all .18s ease; color: var(--ink); width: 100%; box-shadow: var(--shadow); }
        .mc-t::before { content: ''; position: absolute; inset-inline-start: 0; top: 12px; bottom: 12px; width: 4px; border-radius: 0 999px 999px 0; background: var(--sc, var(--muted)); }
        .mc-t.crit { --sc: var(--bad); } .mc-t.high { --sc: var(--warn); } .mc-t.med { --sc: var(--s2); }
        .mc-t:hover:not(.off) { transform: translateY(-2px); border-color: var(--ok); }
        .mc-t:focus-visible { outline: 2px solid var(--ok); outline-offset: 2px; }
        .mc-t.off { cursor: default; border-style: dashed; background: transparent; box-shadow: none; opacity: .85; }
        .mc-t .hd { display: flex; align-items: flex-start; justify-content: space-between; gap: .4rem; }
        .mc-t .hd .lb { font-size: .78rem; font-weight: 800; line-height: 1.5; }
        .mc-t .big { display: flex; align-items: flex-end; justify-content: space-between; gap: .5rem; }
        .mc-t .big .v { font-size: 2rem; font-weight: 900; line-height: 1; }
        .mc-t .big .u { font-size: .66rem; color: var(--muted); font-weight: 700; margin-inline-start: .25rem; }
        .mc-t .spark { display: flex; align-items: flex-end; gap: 3px; height: 26px; }
        .mc-t .spark i { display: block; width: 9px; border-radius: 3px 3px 0 0; background: var(--line); }
        .mc-t .spark i.now { background: var(--s1); }
        .mc-t .sis { display: flex; align-items: center; gap: .3rem; font-size: .66rem; color: var(--muted); border-top: 1px dashed var(--line); padding-top: .4rem; margin-top: auto; }
        .mc-t .sis b { color: var(--ink); font-weight: 800; }
        .mc-t .offr { font-size: .7rem; color: var(--warn); font-weight: 700; line-height: 1.6; }
        .mc-t .det { font-size: .68rem; color: var(--muted); line-height: 1.6; }
        .mc-pill { display: inline-flex; align-items: center; gap: .25rem; font-size: .64rem; font-weight: 800; padding: .16rem .55rem; border-radius: 999px; border: 1px solid var(--line); color: var(--muted); white-space: nowrap; }
        .mc-pill.crit { background: var(--bad-soft); color: var(--bad); border-color: transparent; }
        .mc-pill.high { background: var(--warn-soft); color: #B54708; border-color: transparent; }
        :is(.dark) .mc-pill.high { color: #FDB022; }
        .mc-pill.med { background: rgba(92,125,209,.14); color: var(--s2); border-color: transparent; }
        .mc-pill.on { background: var(--ok-soft); color: var(--ok); border-color: transparent; }
        .mc-pill.off { background: var(--line); color: var(--muted); border-color: transparent; }
        .mc-details { border: 1px solid var(--line); border-radius: var(--r-sm); padding: .2rem .9rem; margin-bottom: .8rem; }
        .mc-details summary { cursor: pointer; font-size: .78rem; font-weight: 800; color: var(--ink); padding: .5rem 0; list-style: none; display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
        .mc-details summary::-webkit-details-marker { display: none; }
        .mc-details summary small { font-weight: 600; color: var(--muted); }
        .mc-details .pa-card { border: 0; box-shadow: none; margin: 0; }

        /* ── الطلاب ── */
        .mc-students { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: .7rem; }
        .mc-s { position: relative; display: flex; flex-direction: column; gap: .55rem; border: 1px solid var(--line); border-radius: var(--r); background: var(--surface); padding: .9rem 1rem .8rem 1.05rem; cursor: pointer; transition: all .18s ease; box-shadow: var(--shadow); }
        .mc-s::before { content: ''; position: absolute; inset-inline-start: 0; top: 14px; bottom: 14px; width: 4px; border-radius: 0 999px 999px 0; background: var(--sc, var(--muted)); }
        .mc-s.crit { --sc: var(--bad); } .mc-s.high { --sc: var(--warn); } .mc-s.med { --sc: var(--s2); }
        .mc-s:hover { transform: translateY(-2px); border-color: var(--ok); }
        .mc-s .top { display: flex; align-items: flex-start; justify-content: space-between; gap: .5rem; }
        .mc-s .nm { font-size: .92rem; font-weight: 900; line-height: 1.35; }
        .mc-s .nm.none { color: var(--muted); font-weight: 700; }
        .mc-s .sub { font-size: .68rem; color: var(--muted); margin-top: .15rem; }
        .mc-s .tags { display: flex; flex-wrap: wrap; gap: .3rem; justify-content: flex-end; }
        .mc-s .adv { display: flex; flex-wrap: wrap; align-items: center; gap: .3rem .5rem; font-size: .7rem; color: var(--muted); }
        .mc-s .adv b { color: var(--ink); }
        .mc-sigs { display: grid; gap: .3rem; }
        .mc-sig { border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
        .mc-sig.crit { border-inline-start: 3px solid var(--bad); } .mc-sig.high { border-inline-start: 3px solid var(--warn); } .mc-sig.med { border-inline-start: 3px solid var(--s2); } .mc-sig.done { border-inline-start: 3px solid var(--ok); opacity: .75; }
        .mc-sig .row { display: flex; align-items: center; justify-content: space-between; gap: .5rem; width: 100%; padding: .4rem .6rem; background: transparent; border: 0; text-align: start; color: var(--ink); cursor: pointer; }
        .mc-sig .row.static { cursor: inherit; }
        .mc-sig .hl { font-size: .72rem; font-weight: 700; line-height: 1.5; min-width: 0; }
        .mc-sig .hl small { display: block; font-size: .62rem; color: var(--ok); font-weight: 800; margin-top: .1rem; }
        .mc-sig .stat { flex: 0 0 auto; text-align: center; border-radius: 8px; padding: .2rem .5rem; background: var(--ok-soft); min-width: 3rem; }
        .mc-sig .stat.bad { background: var(--bad-soft); } .mc-sig .stat.warn { background: var(--warn-soft); }
        .mc-sig .stat .v { display: block; font-size: .85rem; font-weight: 900; line-height: 1.1; }
        .mc-sig .stat .l { display: block; font-size: .58rem; color: var(--muted); font-weight: 700; }
        .mc-sig .det { padding: .3rem .7rem .55rem; border-top: 1px dashed var(--line); font-size: .68rem; }
        .mc-sig .det .lbl { color: var(--muted); font-weight: 800; margin-bottom: .2rem; }
        .mc-sig .det .r { display: flex; justify-content: space-between; gap: .5rem; padding: .12rem 0; }
        .mc-sig .det .r .val { font-weight: 800; }
        .mc-more { border: 0; background: transparent; color: var(--ok); font-size: .7rem; font-weight: 800; cursor: pointer; text-align: start; padding: .1rem .2rem; }
        .mc-s .foot { display: flex; align-items: center; justify-content: space-between; gap: .5rem; padding-top: .5rem; border-top: 1px solid var(--line); font-size: .68rem; color: var(--muted); }
        .mc-s .foot .go { border: 0; background: var(--ok); color: #fff; border-radius: 999px; padding: .32rem .8rem; font-size: .7rem; font-weight: 800; cursor: pointer; }
        .mc-sstats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: .55rem; margin-bottom: .8rem; }
        .mc-sstat { border: 1px solid var(--line); border-radius: var(--r-sm); padding: .7rem .85rem; background: var(--surface); }
        .mc-sstat .v { font-size: 1.45rem; font-weight: 900; line-height: 1.1; }
        .mc-sstat .l { font-size: .7rem; font-weight: 700; margin-top: .15rem; }
        .mc-sstat .f { font-size: .64rem; color: var(--muted); margin-top: .1rem; }
        .mc-sstats-note { font-size: .7rem; line-height: 1.85; color: var(--muted); margin: -.4rem 0 .9rem; }
        .mc-sstat.bad .v { color: var(--bad); } .mc-sstat.warn .v { color: #B54708; }
        :is(.dark) .mc-sstat.warn .v { color: #FDB022; }

        /* ── المواعيد ── */
        .mc-apts { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: .65rem; }
        .mc-a { display: grid; grid-template-columns: 4.8rem minmax(0, 1fr); gap: .8rem; align-items: start; border: 1px solid var(--line); border-radius: var(--r); padding: .85rem .95rem; background: var(--surface); cursor: pointer; transition: all .18s ease; box-shadow: var(--shadow); text-align: start; color: var(--ink); width: 100%; }
        .mc-a:hover { transform: translateY(-2px); border-color: var(--ok); }
        .mc-a.held { border-color: var(--ok); }
        .mc-a.future { border-right: 4px solid var(--s2); }
        .mc-a { direction: rtl; }
        .mc-a .cal { display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 12px; background: var(--ok-soft); text-align: center; padding: .5rem .3rem; min-height: 4.6rem; }
        .mc-a .cal .d { font-size: .64rem; font-weight: 800; color: var(--ok); }
        .mc-a .cal .t { font-size: 1.05rem; font-weight: 900; line-height: 1.15; direction: ltr; }
        .mc-a .cal .dt { font-size: .6rem; color: var(--muted); font-weight: 700; margin-top: .15rem; direction: ltr; }
        .mc-a .who { display: block; min-width: 0; }
        .mc-a .who .ln { display: flex; align-items: baseline; gap: .35rem; font-size: .72rem; line-height: 1.7; min-width: 0; }
        .mc-a .who .ln .k { color: var(--muted); flex: 0 0 auto; }
        .mc-a .who .ln b { font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }
        .mc-a .tags { display: flex; flex-wrap: wrap; gap: .3rem; margin-top: .45rem; }
        .mc-a .hint { display: block; font-size: .66rem; color: var(--muted); margin-top: .4rem; }

        /* ── الجدولة ── */
        .mc-why { border-inline-start: 3px solid var(--ok); background: var(--ok-soft); border-radius: 10px; padding: .6rem .8rem; font-size: .76rem; line-height: 1.8; }
        .mc-why.none { border-color: var(--line); background: transparent; color: var(--muted); }
        .mc-legend { display: flex; flex-wrap: wrap; gap: .4rem .9rem; font-size: .68rem; color: var(--muted); padding: .2rem 0 .6rem; }
        .mc-legend i { display: inline-block; width: .8rem; height: .8rem; border-radius: 3px; vertical-align: -2px; margin-inline-end: .3rem; }
        .mc-alts { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: .55rem; }
        .mc-alt { border: 1px solid var(--line); border-radius: var(--r-sm); padding: .7rem .8rem; }
        .mc-alt .w { font-size: .88rem; font-weight: 900; }
        .mc-alt .r { font-size: .68rem; color: var(--muted); line-height: 1.7; margin-top: .3rem; }

        /* ── الأثر ── */
        /* ── الأثر: قبل ← بعد لكل طالب قِيس ──
           Redesigned from an unlabeled dumbbell (two dots on a bare line, no
           scale, no legend) to one that names its own axis: a shared 0–5
           ruler drawn once above the list so every row's dot position means
           something without re-reading it, a legend spelling out what each
           dot color is, and the actual before/after numbers written out in
           words on every row rather than left to position-reading alone. */
        .mc-imp-legend { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem 1.1rem; font-size: .68rem; color: var(--muted); margin: .2rem 0 .7rem; }
        .mc-imp-legend .sw { display: inline-flex; align-items: center; gap: .35rem; white-space: nowrap; }
        .mc-imp-legend .sw i { width: .6rem; height: .6rem; border-radius: 999px; display: inline-block; flex: 0 0 auto; }
        .mc-imp-legend .sw i.before { background: var(--muted); }
        .mc-imp-legend .sw i.after.up { background: var(--ok); }
        .mc-imp-legend .sw i.after.down { background: var(--bad); }
        .mc-imp-ruler { display: grid; grid-template-columns: minmax(0, 11rem) minmax(0,1fr) 5.2rem; gap: .8rem; margin-bottom: .3rem; }
        .mc-imp-ruler .t { position: relative; height: 14px; }
        .mc-imp-ruler .t span { position: absolute; top: 0; transform: translateX(50%); font-size: .62rem; color: var(--muted); font-variant-numeric: tabular-nums; }
        .mc-imp-rows { display: grid; gap: .5rem; }
        .mc-imp-row { display: grid; grid-template-columns: minmax(0, 11rem) minmax(0,1fr) 5.2rem; gap: .8rem; align-items: center; border: 1px solid var(--line); border-radius: 12px; padding: .55rem .7rem; }
        .mc-imp-row .who { min-width: 0; }
        .mc-imp-row .who .nm { font-size: .76rem; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mc-imp-row .who .id { font-size: .64rem; color: var(--muted); margin-top: .1rem; }
        .mc-imp-row .mid { min-width: 0; }
        .mc-imp-row .vals { font-size: .72rem; font-weight: 700; margin-bottom: .35rem; display: flex; align-items: center; gap: .35rem; white-space: nowrap; color: var(--muted); }
        .mc-imp-row .vals b { color: var(--ink); font-weight: 800; }
        .mc-imp-row .vals b.up { color: var(--ok); } .mc-imp-row .vals b.down { color: var(--bad); }
        .mc-imp-row .scale { position: relative; height: 16px; }
        .mc-imp-row .scale i.tick { position: absolute; top: -1px; width: 1px; height: 7px; background: var(--line); }
        .mc-imp-row .scale i.axis { position: absolute; inset-inline: 0; top: 50%; height: 1px; background: var(--line); }
        .mc-imp-row .scale i.seg { position: absolute; top: 50%; height: 3px; transform: translateY(-50%); background: var(--ok); border-radius: 999px; }
        .mc-imp-row .scale i.seg.down { background: var(--bad); }
        .mc-imp-row .scale i.dot { position: absolute; top: 50%; width: 9px; height: 9px; border-radius: 999px; transform: translate(50%, -50%); border: 2px solid var(--surface); box-shadow: 0 0 0 1px var(--line); }
        .mc-imp-row .scale i.dot.before { background: var(--muted); }
        .mc-imp-row .scale i.dot.after.up { background: var(--ok); }
        .mc-imp-row .scale i.dot.after.down { background: var(--bad); }
        .mc-imp-row .delta { display: flex; flex-direction: column; align-items: flex-end; gap: .3rem; }
        .mc-imp-row .delta .d { display: inline-flex; align-items: center; gap: .2rem; font-size: .84rem; font-weight: 900; color: var(--ok); font-variant-numeric: tabular-nums; }
        .mc-imp-row .delta .d.down { color: var(--bad); }
        @media (max-width: 640px) {
            .mc-imp-ruler { display: none; }
            .mc-imp-row { grid-template-columns: 1fr; row-gap: .4rem; }
            .mc-imp-row .delta { flex-direction: row; align-items: center; justify-content: flex-start; }
        }

        @media (prefers-reduced-motion: reduce) { .mc * { transition: none !important; animation: none !important; } }
    </style>

    @php
        $fmt = fn ($n) => number_format((int) $n);
        $tabs = $this->tabs();
        $tab = $this->tab;
        $current = collect($tabs)->firstWhere('key', $tab) ?? $tabs[0];
        $semester = $this->currentSemester();
        $strip = $this->getStrip();
        $counts = $this->getCounts();
        $baseline = $this->getBaselineCounts();
        $scoped = $this->scopedToOwnCaseload();
        $ownId = $this->ownAdvisorId();
        $options = $this->getFilterOptions();
        $gap = $this->getSchedulableGap();
        $sev = fn (string $s) => match ($s) { 'critical' => 'crit', 'high' => 'high', default => 'med' };
        $semList = $this->data()->semesters();
        $advisorLabel = $this->advisorFilterLabel();
        $filterTargets = 'semester, advisorFilter, facultyFilter, tab, trigger, page, perPage, setSemester, filterByTrigger, clearTriggerFilter, clearFilters, refreshData, student';
        $pct = fn (int $n, int $d) => $d > 0 ? (int) round($n / $d * 100) : 0;
        // Alpine tooltip shared by every chart.
        $tipData = '{ tip: null,'
            .' show(e, n, v) {'
            .' const r = e.currentTarget.getBoundingClientRect();'
            .' const c = this.$root.getBoundingClientRect();'
            .' this.tip = { n, v, x: Math.min(Math.max(r.left - c.left + r.width / 2, 70), c.width - 70), y: r.bottom - c.top + 6 };'
            .' },'
            .' hide() { this.tip = null } }';
        $stageIndex = ['overview' => '00', 'triggers' => '01', 'students' => '02', 'appointments' => '03', 'scheduling' => '04', 'impact' => '05'];
    @endphp

    <div class="pa-page mc">

        {{-- ═══════════ شريط القيادة ═══════════ --}}
        <section class="mc-cmd" aria-label="ملخّص النطاق">
            <div class="mc-cmd-grid">
                <div>
                    <h2 class="mc-title">الفصل {{ $semester }} — {{ $scoped ? 'قائمتك الإرشادية' : ($advisorLabel ? 'مرشد واحد' : ($this->facultyFilter !== '' ? 'كلية واحدة' : 'الجامعة كلها')) }}</h2>
                    <div class="mc-scope">
                        @if ($scoped)
                            <span class="chip">نطاقك: طلابك</span>
                        @endif
                        @if ($advisorLabel)
                            <span class="chip hot">المرشد: {{ $advisorLabel }} <button type="button" class="x" wire:click="$set('advisorFilter', '')" aria-label="إزالة مرشّح المرشد">✕</button></span>
                        @endif
                        @if ($this->facultyFilter !== '')
                            <span class="chip hot">الكلية: {{ $this->facultyFilter }} <button type="button" class="x" wire:click="$set('facultyFilter', '')" aria-label="إزالة مرشّح الكلية">✕</button></span>
                        @endif
                        @if ($this->trigger !== '')
                            <span class="chip hot">الخطوة: {{ $this->triggerFilterLabel() }} <button type="button" class="x" wire:click="clearTriggerFilter" aria-label="إزالة مرشّح الخطوة">✕</button></span>
                        @endif
                        @if (! $this->isFiltered() && ! $scoped)
                            <span class="chip">بلا مرشّحات — الأرقام لكل الجامعة</span>
                        @endif
                    </div>
                    <p class="mc-lead">
                        {{-- the count follows config: a new step must not leave this sentence a step behind --}}
                        {{ count((array) config('advising.triggers', [])) }} خطوة تقرأ سجل الطالب كل ليلة؛ ما تجده يتحوّل إلى موعد في أول فراغ مشترك مع مرشده.
                        هذه اللوحة تجيب: هل نجد الطلاب الصحيحين، وهل تُفسَّر الجدولة لمن سيجلس في اللقاء.
                    </p>
                    <details class="about">
                        <summary>› كيف أقرأ الأرقام؟</summary>
                        <p>الخطوة التي لا يتوفّر مصدرها تُكتب «معطّلة» لا صفراً. النسبة ذات القاسم الصفري تُكتب «لا بيانات» لا ٠٪.
                        الأثر يبقى فارغاً حتى ينعقد لقاء ويُعاد قياس إشارته — لأن كل ما عداه يقيس الجهد لا الأثر.
                        أعداد SIS في أسفل الصفحات على مستوى الجامعة ولا تتأثر بمرشّح المرشد.</p>
                    </details>
                </div>

                <div class="mc-heroes" aria-label="أرقام النطاق">
                    @php
                        $heroes = [
                            ['k' => 'signal_students', 'l' => 'طالباً برصد', 'hint' => 'ظهرت له إشارة واحدة على الأقل'],
                            ['k' => 'appointments', 'l' => 'موعداً محسوباً', 'hint' => 'وُجد فراغ مشترك وحُجز'],
                            ['k' => 'dispatched', 'l' => 'أُرسل فعلاً', 'hint' => 'وصل تقويم الطالب والمرشد'],
                            ['k' => 'held', 'l' => 'انعقد', 'hint' => 'لقاء تمّ وسُجّل'],
                        ];
                        $heroMax = max(1, (int) ($counts['signal_students'] ?? 0));
                    @endphp
                    @foreach ($heroes as $h)
                        @php $v = (int) ($counts[$h['k']] ?? 0); $bv = $baseline !== null ? (int) ($baseline[$h['k']] ?? 0) : null; @endphp
                        <div class="mc-hero" wire:key="hero-{{ $h['k'] }}" title="{{ $h['hint'] }}">
                            <div class="l">{{ $h['l'] }}</div>
                            <div class="v hero-num">{{ $fmt($v) }}</div>
                            <div class="d">
                                @if ($bv !== null)
                                    من <b>{{ $fmt($bv) }}</b> في الجامعة{{ $bv > 0 ? ' · '.$pct($v, $bv).'٪' : '' }}
                                @elseif ($loop->index > 0)
                                    {{ $heroMax > 0 && $v > 0 ? $pct($v, $heroMax).'٪ من المرصودين' : '—' }}
                                @else
                                    {{ $h['hint'] }}
                                @endif
                            </div>
                            <div class="bar" aria-hidden="true"><i style="width: {{ $loop->index === 0 ? ($bv ? $pct($v, max(1,$bv)) : 100) : $pct($v, $heroMax) }}%"></i></div>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>

        @unless ($this->isReady())
            <div class="pa-warn">
                <strong>جداول الإرشاد غير منشأة على هذه النسخة.</strong>
                شغّل <span class="pa-code">php artisan migrate</span> ثم مسح الرصد الليلي. اللوحة تُرسم فارغةً عمداً بدل أصفار تُقرأ كنتيجة.
            </div>
        @endunless

        @if ($scoped && $ownId === '')
            <div class="pa-warn">
                <strong>لا يمكن تحديد قائمتك الإرشادية.</strong>
                حسابك لا يحمل رقماً وظيفياً يطابق سجلات الإرشاد — اللوحة تُغلق على لا شيء لا على الجميع.
            </div>
        @endif

        {{-- ═══════════ مسطرة المرشّحات ═══════════ --}}
        <div class="mc-rail" role="search" aria-label="نطاق اللوحة">
            <span class="lbl">الفصل</span>
            <div class="mc-seg" role="group" aria-label="الفصل الدراسي">
                @foreach ($semList as $s)
                    <button type="button" wire:key="sem-btn-{{ $s['code'] }}" wire:click="setSemester('{{ $s['code'] }}')"
                            aria-pressed="{{ $s['code'] === $semester ? 'true' : 'false' }}">
                        {{ $s['code'] }}@if ($s['current'])<small>الجاري</small>@endif
                    </button>
                @endforeach
            </div>

            @unless ($scoped)
                <span class="lbl">النطاق</span>
                <div class="mc-select">
                    <label class="sr-only" for="pa-advisor">المرشد</label>
                    <select id="pa-advisor" wire:model.live="advisorFilter" data-active="{{ $this->advisorFilter !== '' ? 1 : 0 }}">
                        <option value="">كل المرشدين ({{ $fmt(count($options['advisors'])) }})</option>
                        @foreach ($options['advisors'] as $a)
                            <option value="{{ $a['id'] }}">{{ $a['label'] }} — {{ $fmt($a['students']) }} طالباً{{ $a['schedulable'] ? '' : ' · بلا جدول' }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="mc-select">
                    <label class="sr-only" for="pa-faculty">الكلية</label>
                    <select id="pa-faculty" wire:model.live="facultyFilter" data-active="{{ $this->facultyFilter !== '' ? 1 : 0 }}">
                        <option value="">كل الكليات ({{ $fmt(count($options['faculties'])) }})</option>
                        @foreach ($options['faculties'] as $f)
                            <option value="{{ $f['name'] }}">{{ $f['name'] }} — {{ $fmt($f['students']) }}</option>
                        @endforeach
                    </select>
                </div>
            @endunless

            @if ($this->isFiltered())
                <button type="button" class="mc-btn ghost" wire:click="clearFilters">مسح المرشّحات ✕</button>
            @endif

            <span class="grow"></span>

            <span class="mc-live" wire:loading.flex wire:target="{{ $filterTargets }}"><span class="spin" aria-hidden="true"></span> جارٍ التحديث</span>
            <button type="button" class="mc-btn" wire:click="refreshData" wire:loading.attr="disabled" title="أسقط النسخة المخزّنة واقرأ من الجداول مباشرة">
                <span wire:loading.remove wire:target="refreshData">↻ تحديث الأرقام</span>
                <span wire:loading wire:target="refreshData">جارٍ…</span>
            </button>
        </div>

        {{-- ═══════════ المسار: المراحل كتدفّق من الرصد إلى الأثر ═══════════ --}}
        @php $activeStage = (int) (array_search($tab, array_keys($stageIndex), true) ?: 0); @endphp
        <nav class="mc-journey" role="tablist" aria-label="مراحل الإرشاد الاستباقي">
            @foreach ($tabs as $item)
                @php $idx = (int) (array_search($item['key'], array_keys($stageIndex), true) ?: 0); @endphp
                <button type="button" role="tab" class="mc-stage {{ $idx < $activeStage ? 'done' : '' }}" wire:key="stage-{{ $item['key'] }}"
                        aria-selected="{{ $tab === $item['key'] ? 'true' : 'false' }}"
                        title="{{ $item['goal'] }}"
                        wire:click="$set('tab', '{{ $item['key'] }}')">
                    <svg class="arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 3 5 8l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <div class="n">{{ $stageIndex[$item['key']] ?? '' }}</div>
                    <div class="t">{{ $item['label'] }}</div>
                    <div class="c">
                        @if ($item['badge'] !== null)
                            <b class="num">{{ $fmt($item['badge']) }}</b><span>{{ $item['unit'] }}</span>
                        @elseif ($item['key'] === 'overview')
                            <span>الصورة كاملة</span>
                        @elseif ($item['key'] === 'scheduling')
                            <span>لماذا هذا الوقت</span>
                        @else
                            <span>ما تغيّر بعد اللقاء</span>
                        @endif
                    </div>
                </button>
            @endforeach
        </nav>

        <div class="mc-panel" role="tabpanel" aria-label="{{ $current['label'] }}" wire:key="mc-panel-{{ $tab }}"
             wire:loading.class="is-loading" wire:target="{{ $filterTargets }}">

        {{-- ═══════════════ نظرة عامة ═══════════════ --}}
        @if ($tab === 'overview')
            @php
                $funnel = $this->getFunnel();
                $tchart = $this->getTriggerChart();
                $sevSplit = $this->getSeveritySplit();
                $trend = $this->getTrend();
                $queue = $this->getPriorityStudents(6);
            @endphp

            <div class="mc-grid c12">
                <div>
                    {{-- القمع الأفقي --}}
                    <div class="mc-card">
                        <div class="h">
                            <div><h3>من الرصد إلى الانعقاد</h3><p>طلاب متمايزون في كل مرحلة — والنسبة تحويلٌ من المرحلة السابقة.</p></div>
                        </div>
                        <div class="b">
                            @if (! $funnel['available'] || ($funnel['stages'][0]['value'] ?? 0) === 0)
                                <div class="mc-empty">لا بيانات بعد — القمع يُرسم فور أول رصد في هذا الفصل.</div>
                            @else
                                @php $fmax = max(1, $funnel['stages'][0]['value']); $fops = [1, .78, .56, .38]; @endphp
                                <div class="mc-funnel">
                                    @foreach ($funnel['stages'] as $i => $stage)
                                        <div class="mc-fstage {{ $stage['value'] === 0 ? 'zero' : '' }}" wire:key="fnl-{{ $stage['key'] }}"
                                             style="--w: {{ round($stage['value'] / $fmax * 100, 2) }}%; --o: {{ $fops[$i] ?? .38 }};">
                                            <div class="k">{{ $stage['label'] }}</div>
                                            <div class="v hero-num">{{ $fmt($stage['value']) }}</div>
                                            <div class="c">
                                                @if ($stage['conversion'] !== null) <b>{{ $stage['conversion'] }}٪</b> من السابق
                                                @elseif ($i > 0) — @else كل من رُصد @endif
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            @endif
                        </div>
                    </div>

                    {{-- الإشارات بحسب الخطوة --}}
                    <div class="mc-card">
                        <div class="h">
                            <div><h3>الإشارات بحسب الخطوة</h3><p>كل شريط زر — اضغطه لفتح طلاب تلك الخطوة.</p></div>
                        </div>
                        <div class="b pa-chart" x-data="{{ $tipData }}" style="position:relative;">
                            @if ($tchart['rows'] === [] || $tchart['max'] === 0)
                                <div class="mc-empty">لا إشارات مرصودة في هذا الفصل بعد.</div>
                            @else
                                <div class="mc-bars">
                                    @foreach ($tchart['rows'] as $row)
                                        <button type="button" class="mc-bar" wire:key="tbar-{{ $row['code'] }}"
                                                wire:click="filterByTrigger('{{ $row['code'] }}')"
                                                aria-label="{{ $row['label'] }}: {{ $fmt($row['students']) }} طالباً — اضغط لعرض الطلاب"
                                                x-on:mouseenter="show($event, {{ \Illuminate\Support\Js::from($row['label']) }}, {{ \Illuminate\Support\Js::from($fmt($row['students']).' طالباً — اضغط لعرضهم') }})"
                                                x-on:mouseleave="hide()">
                                            <span class="lab"><span class="mc-code">{{ $row['code'] }}</span>{{ $row['label'] }}</span>
                                            <span class="trk">@if ($row['students'] > 0)<i style="width: {{ round($row['students'] / $tchart['max'] * 100, 2) }}%"></i>@endif</span>
                                            <span class="val num">{{ $fmt($row['students']) }}</span>
                                        </button>
                                    @endforeach
                                </div>
                            @endif
                            @if ($tchart['disabled'] > 0)
                                <p class="mc-note">{{ $fmt($tchart['disabled']) }} من الخطوات معطّلة فلا تُرسم شريطاً صفرياً — تفصيلها في «الخطوات».</p>
                            @endif
                            <div class="pa-tip" x-cloak x-show="tip" :style="tip ? `left:${tip.x}px; top:${tip.y}px` : ''"><strong x-text="tip?.n"></strong><span x-text="tip ? ' — ' + tip.v : ''"></span></div>
                        </div>
                    </div>
                </div>

                <div>
                    {{-- أولويات الآن --}}
                    <div class="mc-card">
                        <div class="h">
                            <div><h3>أولويات الآن</h3><p>أشدّ من في النطاق — من جمع خطوتين فأكثر يتقدّم الجميع.</p></div>
                            @if ($queue !== [])
                                <button type="button" class="mc-btn ghost" wire:click="$set('tab', 'students')">الكل ←</button>
                            @endif
                        </div>
                        <div class="b">
                            @if ($queue === [])
                                <div class="mc-empty">لا طالب في هذا النطاق حالياً.</div>
                            @else
                                <div class="mc-queue">
                                    @foreach ($queue as $st)
                                        @php $first = $st['signals'][0] ?? null; @endphp
                                        <button type="button" class="mc-q {{ $sev($st['severity']) }}" wire:key="q-{{ $st['student_id'] }}" wire:click="openDossier('{{ $st['student_id'] }}')">
                                            <span class="stripe" aria-hidden="true"></span>
                                            <span style="min-width:0;">
                                                <span class="nm">{{ $st['name'] ?: $st['student_id'] }}</span>
                                                <span class="why">{{ $first ? ($first['summary']['headline'] ?? $first['label']) : '' }}{{ $st['signal_count'] > 1 ? ' · +'.($st['signal_count'] - 1) : '' }}</span>
                                            </span>
                                            <span class="st">
                                                @if ($st['appointment'] === null) <span class="mc-pill off">بلا موعد</span>
                                                @else <span class="mc-pill on">{{ $st['appointment']['day_label'] }} {{ $st['appointment']['time'] }}</span> @endif
                                            </span>
                                        </button>
                                    @endforeach
                                </div>
                            @endif
                        </div>
                    </div>

                    {{-- الشدة --}}
                    <div class="mc-card">
                        <div class="h"><div><h3>الطلاب بحسب أشدّ إشارة</h3><p>كل طالب مرة واحدة تحت أسوأ إشاراته.</p></div></div>
                        <div class="b" x-data="{{ $tipData }}" style="position:relative;">
                            @if (! $sevSplit['available'] || $sevSplit['total'] === 0)
                                <div class="mc-empty">لا طلاب مرصودون في هذا الفصل بعد.</div>
                            @else
                                @php $sevSegs = [['key'=>'critical','label'=>'حرجة','c'=>'var(--bad)'],['key'=>'high','label'=>'مرتفعة','c'=>'var(--warn)'],['key'=>'medium','label'=>'متوسطة','c'=>'var(--s2)']]; @endphp
                                <div class="mc-stack" role="img" aria-label="حرجة {{ $fmt($sevSplit['critical']) }} · مرتفعة {{ $fmt($sevSplit['high']) }} · متوسطة {{ $fmt($sevSplit['medium']) }}">
                                    @foreach ($sevSegs as $seg)
                                        @if ($sevSplit[$seg['key']] > 0)
                                            <i style="width: {{ round($sevSplit[$seg['key']] / $sevSplit['total'] * 100, 2) }}%; background: {{ $seg['c'] }};" wire:key="sevseg-{{ $seg['key'] }}"
                                               x-on:mouseenter="show($event, {{ \Illuminate\Support\Js::from($seg['label']) }}, {{ \Illuminate\Support\Js::from($fmt($sevSplit[$seg['key']]).' طالباً') }})" x-on:mouseleave="hide()"></i>
                                        @endif
                                    @endforeach
                                </div>
                                <div class="mc-stack-legend">
                                    @foreach ($sevSegs as $seg)
                                        <span wire:key="sevleg-{{ $seg['key'] }}"><i style="background: {{ $seg['c'] }};" aria-hidden="true"></i>{{ $seg['label'] }} <b>{{ $fmt($sevSplit[$seg['key']]) }}</b></span>
                                    @endforeach
                                </div>
                            @endif
                            <div class="pa-tip" x-cloak x-show="tip" :style="tip ? `left:${tip.x}px; top:${tip.y}px` : ''"><strong x-text="tip?.n"></strong><span x-text="tip ? ' — ' + tip.v : ''"></span></div>
                        </div>
                    </div>

                    {{-- الإيقاع الأسبوعي --}}
                    <div class="mc-card">
                        <div class="h"><div><h3>إيقاع الرصد أسبوعياً</h3><p>إشارات كل أسبوع منذ أول رصد في الفصل.</p></div></div>
                        <div class="b mc-trend" x-data="{{ $tipData }}" style="position:relative;">
                            @if (! $trend['available'])
                                <div class="mc-empty">لا إشارات مؤرّخة في هذا الفصل بعد.</div>
                            @elseif (count($trend['points']) < 3)
                                <div class="mc-kpi" style="border:0; box-shadow:none; padding:.2rem 0;">
                                    <div class="l">إشارات الفصل حتى الآن</div>
                                    <div class="v hero-num">{{ $fmt($trend['total']) }}</div>
                                    <div class="f">خلال {{ count($trend['points']) === 1 ? 'أسبوع واحد' : 'أسبوعين' }} — يُرسم الخط بعد ثلاثة أسابيع من الرصد.</div>
                                </div>
                            @else
                                @php
                                    $pts = $trend['points']; $n = count($pts);
                                    $w = 600; $h = 170; $padL = 34; $padR = 44; $padT = 14; $padB = 26;
                                    $tmax = max(1, max(array_column($pts, 'count')));
                                    $xs = fn (int $i) => round($padL + $i * ($w - $padL - $padR) / ($n - 1), 1);
                                    $ys = fn (int $c) => round($padT + (1 - $c / $tmax) * ($h - $padT - $padB), 1);
                                    $path = ''; foreach ($pts as $i => $p) { $path .= ($i === 0 ? 'M' : ' L').$xs($i).' '.$ys($p['count']); }
                                    $baseY = $ys(0);
                                    $area = $path.' L'.$xs($n - 1).' '.$baseY.' L'.$xs(0).' '.$baseY.' Z';
                                    $lastPoint = $pts[$n - 1];
                                    $labelEvery = max(1, (int) ceil($n / 6));
                                @endphp
                                <svg viewBox="0 0 {{ $w }} {{ $h }}" role="img" aria-label="إشارات كل أسبوع — الإجمالي {{ $fmt($trend['total']) }}، وآخر أسبوع {{ $fmt($lastPoint['count']) }}">
                                    <line class="grid" x1="{{ $padL }}" x2="{{ $w - $padR }}" y1="{{ $baseY }}" y2="{{ $baseY }}" />
                                    <line class="grid" x1="{{ $padL }}" x2="{{ $w - $padR }}" y1="{{ $ys($tmax) }}" y2="{{ $ys($tmax) }}" />
                                    <text x="{{ $padL - 6 }}" y="{{ $ys($tmax) + 3.5 }}" text-anchor="end">{{ $tmax }}</text>
                                    <path d="{{ $area }}" fill="var(--s1)" opacity="0.10" />
                                    <path d="{{ $path }}" fill="none" stroke="var(--s1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
                                    @foreach ($pts as $i => $p)
                                        @if ($i % $labelEvery === 0 || $i === $n - 1)
                                            <text x="{{ $xs($i) }}" y="{{ $h - 8 }}" text-anchor="middle">{{ $p['label'] }}</text>
                                        @endif
                                        <g wire:key="ptg-{{ $i }}">
                                            <circle cx="{{ $xs($i) }}" cy="{{ $ys($p['count']) }}" r="12" fill="transparent"
                                                    x-on:mouseenter="show($event, {{ \Illuminate\Support\Js::from('أسبوع '.$p['label']) }}, {{ \Illuminate\Support\Js::from($fmt($p['count']).' إشارة') }})" x-on:mouseleave="hide()" />
                                            <circle class="pt" cx="{{ $xs($i) }}" cy="{{ $ys($p['count']) }}" r="{{ $i === $n - 1 ? 4.5 : 3 }}" />
                                        </g>
                                    @endforeach
                                    <text class="end" x="{{ $xs($n - 1) + 8 }}" y="{{ $ys($lastPoint['count']) + 4 }}">{{ $lastPoint['count'] }}</text>
                                </svg>
                            @endif
                            <div class="pa-tip" x-cloak x-show="tip" :style="tip ? `left:${tip.x}px; top:${tip.y}px` : ''"><strong x-text="tip?.n"></strong><span x-text="tip ? ' — ' + tip.v : ''"></span></div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- الفصول المرصودة --}}
            <div class="mc-card">
                <div class="h"><div><h3>الفصول المرصودة</h3><p>الفصل الجاري متميّز؛ الفصول المكتملة تُمسح لقياس حجم الحاجة لا لحجز مواعيد فيها.</p></div></div>
                <div class="b">
                    <div class="mc-sems">
                        @foreach ($strip as $s)
                            @php $unswept = ! $s['current'] && $s['students'] === 0 && $s['appointments'] === 0; @endphp
                            <div class="mc-sem {{ $s['current'] ? 'now' : '' }}" wire:key="sem-{{ $s['code'] }}">
                                <div class="top"><b class="num">{{ $s['code'] }}</b><span class="mc-pill {{ $s['current'] ? 'on' : '' }}">{{ $s['current'] ? 'الفصل الجاري' : 'مكتمل' }}</span></div>
                                @if ($unswept)
                                    <p class="un"><b>لم يُمسح بعد</b> — لا رصد ولا موعد لهذا الفصل.</p>
                                @else
                                    <dl>
                                        <dt>طلاب رُصدوا</dt><dd class="num">{{ $fmt($s['students']) }}</dd>
                                        <dt>خطوتان فأكثر</dt><dd class="num">{{ $fmt($s['multi']) }}</dd>
                                        <dt>مواعيد محجوزة</dt><dd class="num">{{ $fmt($s['appointments']) }}</dd>
                                        <dt>جدوى المطابقة</dt><dd class="num">{{ $s['feasibility'] === null ? 'لم تُختبر' : $s['feasibility'].'٪' }}</dd>
                                    </dl>
                                @endif
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            <details class="mc-details">
                <summary><span>أعداد الفصل {{ $semester }} من نظام SIS</span><small>على مستوى الجامعة — لا تتأثر بمرشّح المرشد</small></summary>
                @include('filament.pages.partials.advising-sis-summary', ['sis' => $this->getSisSummary(), 'fmt' => $fmt, 'semester' => $semester])
            </details>
        @endif

        {{-- ═══════════════ الخطوات ═══════════════ --}}
        @if ($tab === 'triggers')
            @php
                $trigRows = $this->getTriggers();
                $sis = $this->getSisSummary();
                $semCodes = $this->data()->semesterCodes();
                $semIndex = array_search($semester, $semCodes, true);
                $semIndex = $semIndex === false ? 0 : $semIndex;
                $trigMax = max(1, ...array_map(fn ($t) => $t['available'] ? max($t['semesters'] ?: [0]) : 0, $trigRows));
                $onCount = count(array_filter($trigRows, fn ($t) => $t['available']));
                $offCount = count($trigRows) - $onCount;
                $firing = count(array_filter($trigRows, fn ($t) => $t['available'] && (int) ($t['semesters'][$semIndex] ?? 0) > 0));
            @endphp

            <div class="mc-sstats">
                <div class="mc-sstat"><div class="v hero-num">{{ $fmt(count($trigRows)) }}</div><div class="l">خطوة مسجّلة</div><div class="f">تقرأ سجل الطالب ليلاً</div></div>
                <div class="mc-sstat"><div class="v hero-num" style="color:var(--ok);">{{ $fmt($onCount) }}</div><div class="l">تعمل</div><div class="f">مصدرها متاح</div></div>
                <div class="mc-sstat {{ $offCount > 0 ? 'warn' : '' }}"><div class="v hero-num">{{ $fmt($offCount) }}</div><div class="l">بانتظار مصدرها</div><div class="f">تُكتب «معطّلة» لا صفراً</div></div>
                <div class="mc-sstat"><div class="v hero-num">{{ $fmt($firing) }}</div><div class="l">رصدت أحداً في {{ $semester }}</div><div class="f">في النطاق الحالي</div></div>
            </div>

            <div class="mc-card">
                <div class="h">
                    <div><h3>رادار الخطوات — الفصل {{ $semester }}</h3><p>الرقم الكبير: طلاب النطاق الذين أطلقوا الخطوة. الأعمدة الصغيرة: الفصول {{ implode(' · ', $semCodes) }}. اضغط بطاقةً لعرض طلابها.</p></div>
                </div>
                <div class="b">
                    <div class="mc-radar">
                        @foreach ($trigRows as $t)
                            @php $sisT = $sis['ok'] ? ($sis['by_trigger'][$t['code']] ?? null) : null; $n0 = (int) ($t['semesters'][$semIndex] ?? 0); @endphp
                            @if ($t['available'])
                                <button type="button" class="mc-t {{ $sev($t['severity']) }}" wire:key="trg-{{ $t['code'] }}"
                                        wire:click="filterByTrigger('{{ $t['code'] }}')"
                                        aria-label="{{ $t['label'] }}: {{ $fmt($n0) }} طالباً — اضغط لعرض الطلاب">
                            @else
                                <div class="mc-t off {{ $sev($t['severity']) }}" wire:key="trg-{{ $t['code'] }}" aria-disabled="true">
                            @endif
                                <div class="hd">
                                    <span class="lb"><span class="mc-code">{{ $t['code'] }}</span>{{ $t['label'] }}</span>
                                    <span class="mc-pill {{ $sev($t['severity']) }}">{{ $t['severity_label'] }}</span>
                                </div>
                                @if ($t['available'])
                                    <div class="big">
                                        <span><span class="v hero-num">{{ $fmt($n0) }}</span><span class="u">طالباً</span></span>
                                        <span class="spark" aria-hidden="true">
                                            @foreach ($semCodes as $i => $code)
                                                @php $nn = (int) ($t['semesters'][$i] ?? 0); @endphp
                                                <i class="{{ $i === $semIndex ? 'now' : '' }}" style="height: {{ max(3, round($nn / $trigMax * 26)) }}px;" title="{{ $code }}: {{ $fmt($nn) }}"></i>
                                            @endforeach
                                        </span>
                                    </div>
                                    <span class="det">{{ $t['detects'] }}</span>
                                @else
                                    <span class="offr">{{ $t['unavailable_reason'] }}</span>
                                    <span class="det">{{ $t['detects'] }}</span>
                                @endif
                                @if ($sisT !== null)
                                    <span class="sis"><i class="sw sis" aria-hidden="true"></i><b class="num">{{ $fmt($sisT['value']) }}</b> في SIS — {{ $sisT['caption'] }}</span>
                                @endif
                            @if ($t['available']) </button> @else </div> @endif
                        @endforeach
                    </div>
                </div>
            </div>

            <details class="mc-details">
                <summary><span>أعداد الفصل {{ $semester }} من نظام SIS</span><small>على مستوى الجامعة — لا تتأثر بمرشّح المرشد</small></summary>
                @include('filament.pages.partials.advising-sis-summary', ['sis' => $sis, 'fmt' => $fmt, 'semester' => $semester])
            </details>
        @endif

        {{-- ═══════════════ الطلاب ═══════════════ --}}
        @if ($tab === 'students')
            @php
                $studentsPage = $this->getStudentsPage();
                $students = $studentsPage['items'];
                $paged = $studentsPage['last_page'] > 1;
                $shown = count($students);
                $multiCount = count(array_filter($students, fn ($s) => $s['multi']));
                $criticalCount = count(array_filter($students, fn ($s) => $s['severity'] === 'critical'));
                $unbookedCount = count(array_filter($students, fn ($s) => $s['appointment'] === null));
                $pageNote = $paged ? 'في هذه الصفحة' : null;
                $steps = fn (int $n) => match (true) { $n === 1 => 'خطوة واحدة', $n === 2 => 'خطوتان', $n <= 10 => "{$n} خطوات", default => "{$n} خطوة" };
                $moreSteps = fn (int $n) => match (true) { $n === 1 => '+1 خطوة أخرى', $n === 2 => '+2 خطوتان أخريان', $n <= 10 => "+{$n} خطوات أخرى", default => "+{$n} خطوة أخرى" };
                $visibleSignals = 3;
            @endphp

            @if ($students !== [])
                <div class="mc-sstats">
                    <div class="mc-sstat"><div class="v hero-num">{{ $fmt($studentsPage['total']) }}</div><div class="l">طلاب مرصودون</div>@if ($paged)<div class="f">{{ $fmt($shown) }} منهم في هذه الصفحة</div>@endif</div>
                    <div class="mc-sstat"><div class="v hero-num">{{ $fmt($multiCount) }}</div><div class="l">بخطوتين فأكثر</div>@if ($pageNote)<div class="f">{{ $pageNote }}</div>@endif</div>
                    <div class="mc-sstat {{ $criticalCount > 0 ? 'bad' : '' }}"><div class="v hero-num">{{ $fmt($criticalCount) }}</div><div class="l">حرجة</div>@if ($pageNote)<div class="f">{{ $pageNote }}</div>@endif</div>
                    <div class="mc-sstat {{ $unbookedCount > 0 ? 'warn' : '' }}"><div class="v hero-num">{{ $fmt($unbookedCount) }}</div><div class="l">بلا موعد</div>@if ($pageNote)<div class="f">{{ $pageNote }}</div>@endif</div>
                </div>

                {{-- How the four numbers relate — asked for explicitly: the reader
                     was adding «طلاب مرصودون» to «حرجة» and expecting the header. --}}
                <p class="mc-sstats-note">
                    «طلاب مرصودون» هو العدد نفسه في رأس الصفحة ({{ $fmt($counts['signal_students'] ?? 0) }} في هذا النطاق): كل طالب ظهرت له إشارة واحدة على الأقل.
                    الثلاثة الباقية شرائح منه لا إضافات إليه: «حرجة» من يلزمه تدخّل الآن، ومن دونها متابعة في المنطقة المرتفعة والمتوسطة؛
                    «بخطوتين فأكثر» من اجتمعت عليه أكثر من إشارة؛ «بلا موعد» من لم يُوجد له فراغ مشترك مع مرشده بعد.
                    @if ($paged)
                        الأرقام الثلاثة تُحسب على هذه الصفحة ({{ $fmt($shown) }} طالباً) لا على النطاق كله.
                    @else
                        كل طلاب النطاق ({{ $fmt($studentsPage['total']) }}) معروضون أدناه في صفحة واحدة.
                    @endif
                    @if ($this->trigger !== '')
                        النطاق مقيّد بالخطوة «{{ $this->triggerFilterLabel() }}»، ورأس الصفحة يتبع القيد نفسه.
                    @endif
                </p>
            @endif

            <div class="mc-card" id="std-grid">
                <div class="h">
                    <div>
                        <h3>{{ $this->studentsHeading() }} — {{ $fmt($studentsPage['total']) }} في الفصل {{ $semester }}</h3>
                        <p>الأكثر خطوات والأشدّ أولاً. اضغط بطاقةً لفتح الملف والإجراءات، أو إشارةً لتفاصيلها.</p>
                    </div>
                    @if ($this->trigger !== '')
                        <button type="button" class="mc-btn" wire:click="clearTriggerFilter">الخطوة: {{ $this->triggerFilterLabel() }} ✕</button>
                    @endif
                </div>
                <div class="b">
                    @if ($paged) @include('filament.pages.partials.advising-pager', ['pg' => $studentsPage, 'anchor' => 'std-grid', 'unit' => 'طالباً', 'pos' => 'top']) @endif
                    @if ($students === [])
                        <div class="mc-empty">
                            @if ($this->trigger !== '') لا طالب لديه إشارة مفتوحة من خطوة «{{ $this->triggerFilterLabel() }}» في هذا النطاق.
                            @else <b>لا طالب في هذا النطاق حالياً.</b> @endif
                            @if ($scoped && $ownId === '') <br>السبب أن قائمتك الإرشادية لم تُحدَّد، لا أن طلابك بلا إشارات. @endif
                        </div>
                    @else
                        <div class="mc-students">
                            @foreach ($students as $st)
                                <article class="mc-s {{ $sev($st['severity']) }}" wire:key="std-{{ $st['student_id'] }}" wire:click="openDossier('{{ $st['student_id'] }}')" x-data="{ all: false }">
                                    <div class="top">
                                        <div style="min-width:0;">
                                            <div class="nm {{ $st['name'] ? '' : 'none' }}">{{ $st['name'] ?: 'بلا اسم مسجّل' }}</div>
                                            <div class="sub"><span class="mc-code">{{ $st['student_id'] }}</span>{{ $st['faculty'] ? $st['faculty'].($st['major'] ? ' · '.$st['major'] : '') : '' }}</div>
                                        </div>
                                        <div class="tags">
                                            <span class="mc-pill {{ $sev($st['severity']) }}">{{ $st['severity_label'] }}</span>
                                            <span class="mc-pill">{{ $steps($st['signal_count']) }}</span>
                                        </div>
                                    </div>
                                    <div class="adv">
                                        <span>المرشد: <b>{{ $st['advisor_name'] ?: ($st['advisor_employee_id'] ?: 'غير محدّد') }}</b></span>
                                        @unless ($st['advisor_schedulable']) <span class="mc-pill off">لم يدخل — لا جدولة</span> @endunless
                                    </div>
                                    <div class="mc-sigs">
                                        @foreach ($st['signals'] as $i => $sig)
                                            @php $sum = $sig['summary']; $hasDetails = $sum['details'] !== []; $hidden = $i >= $visibleSignals; @endphp
                                            <div class="mc-sig {{ $sig['resolved'] ? 'done' : $sev($sig['severity']) }}" wire:key="sig-{{ $st['student_id'] }}-{{ $i }}" x-data="{ open: false }" @if ($hidden) x-show="all" x-cloak @endif>
                                                @if ($hasDetails)
                                                    <button type="button" class="row" x-on:click.stop="open = ! open" x-bind:aria-expanded="open" aria-label="{{ $sig['label'] }} — عرض التفاصيل">
                                                @else
                                                    <div class="row static">
                                                @endif
                                                    <span class="hl"><span class="mc-code">{{ $sig['code'] }}</span>{{ $sum['headline'] }}@if ($sig['resolved']) <span class="mc-pill on">أُغلقت</span>@endif
                                                        @if ($hasDetails)<small x-text="open ? 'إخفاء التفاصيل' : 'التفاصيل ▾'">التفاصيل ▾</small>@endif
                                                    </span>
                                                    @if ($sum['stat'] !== null)
                                                        <span class="stat {{ $sum['stat']['tone'] }}"><span class="v num">{{ $sum['stat']['value'] }}</span><span class="l">{{ $sum['stat']['label'] }}</span></span>
                                                    @endif
                                                @if ($hasDetails)
                                                    </button>
                                                    <div class="det" x-show="open" x-cloak x-on:click.stop>
                                                        <div class="lbl">{{ $sig['label'] }}</div>
                                                        @foreach ($sum['details'] as $row)
                                                            <div class="r"><span>@if ($row['code'])<span class="mc-code">{{ $row['code'] }}</span>@endif{{ $row['label'] }}</span>@if ($row['value'] !== '')<span class="val">{{ $row['value'] }}</span>@endif</div>
                                                        @endforeach
                                                    </div>
                                                @else
                                                    </div>
                                                @endif
                                            </div>
                                        @endforeach
                                        @if (count($st['signals']) > $visibleSignals)
                                            <button type="button" class="mc-more" x-show="! all" x-on:click.stop="all = true">{{ $moreSteps(count($st['signals']) - $visibleSignals) }}</button>
                                        @endif
                                    </div>
                                    <div class="foot">
                                        <span>
                                            @if ($st['appointment'] === null) <span class="mc-pill off">بلا موعد</span>
                                            @elseif ($st['appointment']['dispatched']) <span class="mc-pill on">أُرسل</span> {{ $st['appointment']['when'] }}
                                            @else <span class="mc-pill on">مجدول {{ $st['appointment']['day_label'] }} {{ $st['appointment']['time'] }}</span> محسوب فقط @endif
                                        </span>
                                        <button type="button" class="go">فتح الملف</button>
                                    </div>
                                </article>
                            @endforeach
                        </div>
                        @include('filament.pages.partials.advising-pager', ['pg' => $studentsPage, 'anchor' => 'std-grid', 'unit' => 'طالباً', 'pos' => 'bottom'])
                    @endif
                </div>
            </div>
        @endif

        {{-- ═══════════════ المواعيد ═══════════════ --}}
        @if ($tab === 'appointments')
            @php
                $appointmentsPage = $this->getAppointmentsPage();
                $appointments = $appointmentsPage['items'];
                $apPaged = $appointmentsPage['last_page'] > 1;
                $apDispatched = count(array_filter($appointments, fn ($a) => $a['dispatched']));
                $apHeld = count(array_filter($appointments, fn ($a) => $a['held'] ?? false));
                $apTeams = count(array_filter($appointments, fn ($a) => $a['mode'] === 'teams'));
                $apNote = $apPaged ? 'في هذه الصفحة' : null;
            @endphp

            @if ($appointments !== [])
                <div class="mc-sstats">
                    <div class="mc-sstat"><div class="v hero-num">{{ $fmt($appointmentsPage['total']) }}</div><div class="l">مواعيد في النطاق</div>@if ($apPaged)<div class="f">{{ $fmt(count($appointments)) }} منها في هذه الصفحة</div>@endif</div>
                    <div class="mc-sstat"><div class="v hero-num">{{ $fmt($apDispatched) }}</div><div class="l">أُرسلت فعلاً</div><div class="f">{{ $apNote ?? 'ما عداها محسوب فقط' }}</div></div>
                    <div class="mc-sstat"><div class="v hero-num">{{ $fmt($apHeld) }}</div><div class="l">انعقدت</div>@if ($apNote)<div class="f">{{ $apNote }}</div>@endif</div>
                    <div class="mc-sstat"><div class="v hero-num">{{ $fmt($apTeams) }}</div><div class="l">عن بعد — Teams</div>@if ($apNote)<div class="f">{{ $apNote }}</div>@endif</div>
                </div>
            @endif

            <div class="mc-card" id="apt-grid">
                <div class="h"><div><h3>المواعيد — {{ $fmt($appointmentsPage['total']) }} في الفصل {{ $semester }}</h3><p>مرتّبة بالأقرب زمناً. اضغط موعداً لعرض المحضر والتوصيات وسبب اختيار الوقت.</p></div></div>
                <div class="b">
                    @if ($apPaged) @include('filament.pages.partials.advising-pager', ['pg' => $appointmentsPage, 'anchor' => 'apt-grid', 'unit' => 'موعداً', 'pos' => 'top']) @endif
                    @if ($appointments === [])
                        <div class="mc-empty">
                            <b>لا موعد في هذا النطاق بعد.</b><br>
                            الموعد يُكتب حين يوجد فراغ مشترك بين جدول الطالب وجدول مرشده؛ مرشدٌ لم يدخل النظام قط لا جدول له فيبقى طلابه مرصودين بلا موعد.
                            @if ($scoped && $ownId === '') <br>والسبب هنا أن قائمتك الإرشادية لم تُحدَّد. @endif
                        </div>
                    @else
                        <div class="mc-apts">
                            @foreach ($appointments as $ap)
                                @php $apHeldOne = (bool) ($ap['held'] ?? false); @endphp
                                @php $isFuture = ! $apHeldOne && ! empty($ap['date']) && strtotime((string) $ap['date']) !== false && strtotime((string) $ap['date']) > time(); @endphp
                                <button type="button" class="mc-a {{ $apHeldOne ? 'held' : ($isFuture ? 'future' : '') }}" wire:key="apt-{{ $ap['id'] }}" wire:click="openAppointment({{ (int) $ap['id'] }})" aria-label="موعد {{ $ap['student_id'] }} — {{ $ap['day_label'] }} {{ $ap['time'] }}">
                                    <span class="cal"><span class="d">{{ $ap['day_label'] }}</span><span class="t num">{{ $ap['time'] }}</span><span class="dt num">{{ $ap['date'] }}</span></span>
                                    <span class="who">
                                        <span class="ln"><span class="k">الطالب</span><b><span class="mc-code">{{ $ap['student_id'] }}</span></b></span>
                                        <span class="ln"><span class="k">المرشد</span><b>{{ $ap['advisor_name'] ?: $ap['advisor_employee_id'] }}</b></span>
                                        <span class="tags">
                                            @if ($apHeldOne) <span class="mc-pill on">انعقد</span>
                                            @elseif ($ap['dispatched']) <span class="mc-pill on">{{ $isFuture ? 'مجدول استباقياً — أُرسل' : 'أُرسل' }}</span>
                                            @else <span class="mc-pill">{{ $isFuture ? 'مجدول استباقياً — لم يُرسل' : 'مجدول — لم يُرسل' }}</span> @endif
                                            <span class="mc-pill">{{ $ap['mode'] === 'teams' ? 'Teams' : 'حضوري' }}</span>
                                            <span class="mc-pill num" style="direction:ltr;">{{ $ap['time'] }}–{{ $ap['ends'] }}</span>
                                        </span>
                                        <span class="hint">{{ $apHeldOne ? 'اضغط لعرض المحضر والتوصيات' : 'اضغط لعرض التفاصيل' }}</span>
                                    </span>
                                </button>
                            @endforeach
                        </div>
                        @include('filament.pages.partials.advising-pager', ['pg' => $appointmentsPage, 'anchor' => 'apt-grid', 'unit' => 'موعداً', 'pos' => 'bottom'])
                    @endif
                </div>
            </div>
        @endif

        {{-- ═══════════════ الجدولة الذكية ═══════════════ --}}
        @if ($tab === 'scheduling')
            @php $sch = $this->getSchedule(); $pairs = $this->getPairs(); @endphp

            <div class="mc-card">
                <div class="h">
                    <div>
                        <h3>{{ $sch['available'] ? 'لماذا هذا الوقت بالذات' : 'شبكة الأسبوع' }}</h3>
                        @if ($sch['available'])
                            @php $ap = $sch['appointment']; @endphp
                            <p>{{ $ap['day_label'] }} {{ $ap['time'] }}–{{ $ap['ends'] }} · {{ $ap['mode_label'] }}{{ $ap['location'] ? ' · '.$ap['location'] : '' }} · {{ $ap['trigger_label'] }}</p>
                        @else
                            <p>انشغال الطالب والمرشد، والفراغ الذي اختاره المحرّك بينهما.</p>
                        @endif
                    </div>
                    @if ($pairs !== [])
                        <div class="mc-select">
                            <label class="sr-only" for="pa-student">الطالب</label>
                            <select id="pa-student" wire:model.live="student" data-active="{{ $this->student !== '' ? 1 : 0 }}">
                                <option value="">أقرب موعد في النطاق</option>
                                @foreach ($pairs as $p) <option value="{{ $p['student_id'] }}">{{ $p['label'] }}</option> @endforeach
                            </select>
                        </div>
                    @endif
                </div>
                <div class="b">
                    @if (! $sch['available'])
                        <div class="mc-empty"><b>لا شبكة تُرسم.</b><br>{{ $sch['reason'] }}</div>
                    @else
                        <div class="mc-why {{ $ap['slot_reason'] ? '' : 'none' }}">
                            <b>سبب الاختيار:</b> {{ $ap['slot_reason'] ?: 'لم يُسجَّل سبب مع هذا الموعد.' }}
                            @if ($ap['slot_score']) <span class="mc-pill">ترجيح {{ $ap['slot_score'] }}</span> @endif
                        </div>
                        @if ($sch['mask_error'])
                            <div class="pa-warn" style="margin-top:.7rem;"><strong>أقنعة الأسبوع مبنيّة على نافذة مختلفة.</strong> {{ $sch['mask_error'] }} — الشبكة تُرسم بلا طبقة الانشغال.</div>
                        @endif
                        @if (! $sch['student_mask'] || ! $sch['advisor_mask'])
                            <div class="pa-warn" style="margin-top:.7rem;">
                                @if (! $sch['student_mask'] && ! $sch['advisor_mask']) جدول الطالب وجدول المرشد لم يُبنَيا بعد.
                                @elseif (! $sch['student_mask']) جدول الطالب لم يُبنَ بعد.
                                @else جدول المرشد لم يُبنَ بعد. @endif
                                الخانات الفارغة تعني «غير معروف» لا «متفرّغ».
                            </div>
                        @endif
                    @endif
                </div>
            </div>

            @if ($sch['available'])
                <div class="mc-card">
                    <div class="h"><div><h3>شبكة الأسبوع</h3><p>النافذة {{ $sch['window']['from'] }}–{{ $sch['window']['to'] }} · اللقاء {{ $sch['window']['minutes'] }} دقيقة.</p></div></div>
                    <div class="b">
                        <div class="mc-legend">
                            <span><i style="background:var(--warn); opacity:.55;"></i>الطالب مشغول</span>
                            <span><i style="background:var(--muted); opacity:.45;"></i>المرشد مشغول</span>
                            <span><i style="background:var(--ink); opacity:.55;"></i>كلاهما</span>
                            <span><i style="background:var(--ok); box-shadow:0 0 0 2px var(--ink);"></i>الموعد المختار</span>
                            <span><i style="background:var(--ok-soft);"></i>فراغ مشترك</span>
                            <span><i style="background:var(--line);"></i>خارج النافذة / صلاة</span>
                        </div>
                        <div class="grid-wrap" aria-hidden="true">
                            <table class="wk">
                                <thead><tr><th></th>@foreach ($sch['slots'] as $slot)<th class="hour">{{ substr($slot['label'], 3) === '00' ? $slot['label'] : '' }}</th>@endforeach</tr></thead>
                                <tbody>
                                    @foreach ($sch['days'] as $day)
                                        <tr wire:key="wk-{{ $day['index'] }}"><th class="day">{{ $day['label'] }}</th>
                                            @foreach ($sch['slots'] as $slot)
                                                @php $cell = $sch['cells'][$day['index']][$slot['minute']]; @endphp
                                                <td class="{{ $cell['state'] }}" title="{{ $day['label'] }} {{ $slot['label'] }} — {{ $cell['label'] }}"></td>
                                            @endforeach
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="mc-card">
                    <div class="h"><div><h3>البدائل التي رجّحها المحرّك</h3><p>ما كان مطروحاً غير الوقت المختار — كي تكون إعادة الجدولة قراراً لا إعادة حساب.</p></div></div>
                    <div class="b">
                        @if ($sch['alternatives'] === [])
                            <div class="mc-empty">لم يُسجَّل بديل مع هذا الموعد.</div>
                        @else
                            <div class="mc-alts">
                                @foreach ($sch['alternatives'] as $i => $alt)
                                    <div class="mc-alt" wire:key="alt-{{ $i }}">
                                        <div class="w">{{ $alt['day_label'] }} {{ $alt['time'] }} @if ($alt['score'] !== null)<span class="mc-pill">ترجيح {{ $alt['score'] }}</span>@endif</div>
                                        <div class="r">{{ $alt['reason'] ?: 'لم يُسجَّل سبب مع هذا البديل.' }}</div>
                                    </div>
                                @endforeach
                            </div>
                        @endif
                    </div>
                </div>
            @endif
        @endif

        {{-- ═══════════════ الأثر ═══════════════ --}}
        @if ($tab === 'impact')
            @php $impact = $this->getImpact(); @endphp
            <div class="mc-card">
                <div class="h"><div><h3>الأثر — ما الذي تغيّر بعد اللقاء</h3><p>يُقرأ من جدول النتائج وحده، ولا يُملأ بأرقام النشاط.</p></div></div>
                <div class="b">
                    @unless ($impact['available'])
                        <div class="mc-empty"><b>لا تتوفر بيانات الأثر بعد.</b><br>الأثر يُقاس بعد لقاءٍ انعقد فعلاً ثم أُعيد فحص إشارته — ولم يُسجَّل قياس في هذا النطاق بعد.</div>
                    @else
                        <div class="mc-sstats">
                            <div class="mc-sstat {{ $impact['gpa_delta'] !== null && $impact['gpa_delta'] < 0 ? 'bad' : '' }}">
                                <div class="v hero-num">@if ($impact['gpa_delta'] === null)<span style="font-size:.8rem;color:var(--warn);">لا بيانات بعد</span>@else<span style="direction:ltr;unicode-bidi:isolate;">{{ ($impact['gpa_delta'] > 0 ? '+' : '').$impact['gpa_delta'] }}</span>@endif</div>
                                <div class="l">تغيّر المعدل</div><div class="f">وسطي (بعد − قبل) على {{ $fmt($impact['gpa_pairs']) }} حالة</div>
                            </div>
                            <div class="mc-sstat"><div class="v hero-num">{{ $impact['resolved_rate'] }}٪</div><div class="l">إشارات زال سببها</div><div class="f">{{ $fmt($impact['resolved']) }} ÷ {{ $fmt($impact['measured']) }}</div></div>
                            <div class="mc-sstat"><div class="v hero-num" style="direction:ltr;unicode-bidi:isolate;">{{ $fmt($impact['held']) }} / {{ $fmt($impact['dispatched']) }}</div><div class="l">انعقد / أُرسل</div><div class="f">قِيس أثرها {{ $fmt($impact['measured']) }} · سجّلوا بعده {{ $fmt($impact['registered_after']) }}</div></div>
                        </div>
                        @if ($impact['rows'] !== [])
                            @php $gx = fn (float $g) => round(min(5, max(0, $g)) / 5 * 100, 2); $ticks = [0, 1, 2, 3, 4, 5]; @endphp
                            <div class="drawer-sec" style="border:0; padding:.6rem .1rem 0;">
                                <h4 style="font-size:.82rem;font-weight:900;margin:0 0 .15rem;">قبل ← بعد لكل طالب قِيس</h4>
                                <p style="font-size:.68rem;color:var(--muted);margin:0;">المعدل التراكمي من ٥ عند الرصد، مقارَناً بآخر تحديث بعد اللقاء — أكبر {{ $fmt(count($impact['rows'])) }} حالات تغيّراً.</p>
                            </div>
                            <div class="mc-imp-legend">
                                <span class="sw"><i class="before" aria-hidden="true"></i>المعدل عند الرصد (قبل)</span>
                                <span class="sw"><i class="after up" aria-hidden="true"></i>بعد اللقاء — تحسّن</span>
                                <span class="sw"><i class="after down" aria-hidden="true"></i>بعد اللقاء — تراجع</span>
                            </div>
                            <div class="mc-imp-ruler" aria-hidden="true">
                                <span></span>
                                <div class="t">
                                    @foreach ($ticks as $t)
                                        <span style="right: {{ $t / 5 * 100 }}%;">{{ $t }}</span>
                                    @endforeach
                                </div>
                                <span></span>
                            </div>
                            <div class="mc-imp-rows">
                                @foreach ($impact['rows'] as $r)
                                    @php
                                        $down = $r['delta'] < 0;
                                        $l = min($gx($r['before']), $gx($r['after']));
                                        $w = abs($gx($r['after']) - $gx($r['before']));
                                        $tone = $down ? 'down' : 'up';
                                    @endphp
                                    <div class="mc-imp-row" wire:key="imp-{{ $r['student_id'] }}">
                                        <div class="who">
                                            <div class="nm">{{ $r['name'] ?: 'بلا اسم مسجّل' }}</div>
                                            <div class="id num">{{ $r['student_id'] }}</div>
                                        </div>
                                        <div class="mid">
                                            <div class="vals">
                                                <span>قبل <b>{{ number_format($r['before'], 2) }}</b></span>
                                                <span>←</span>
                                                <span>بعد <b class="{{ $tone }}">{{ number_format($r['after'], 2) }}</b></span>
                                            </div>
                                            <div class="scale" role="img"
                                                 aria-label="المعدل عند الرصد {{ number_format($r['before'], 2) }} من ٥، وبعد اللقاء {{ number_format($r['after'], 2) }} من ٥">
                                                <i class="axis" aria-hidden="true"></i>
                                                @foreach ($ticks as $t)
                                                    <i class="tick" style="right: {{ $t / 5 * 100 }}%;" aria-hidden="true"></i>
                                                @endforeach
                                                <i class="seg {{ $tone }}" style="right:{{ $l }}%;width:{{ $w }}%;" aria-hidden="true"></i>
                                                <i class="dot before" style="right:{{ $gx($r['before']) }}%;" aria-hidden="true"></i>
                                                <i class="dot after {{ $tone }}" style="right:{{ $gx($r['after']) }}%;" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                        <div class="delta">
                                            <span class="d {{ $tone }}">{{ $down ? '↓' : '↑' }} {{ ($r['delta'] > 0 ? '+' : '').number_format($r['delta'], 2) }}</span>
                                            @if ($r['resolved'])<span class="mc-pill on">زال السبب</span>@endif
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @endif
                    @endunless
                </div>
            </div>
        @endif

        </div>{{-- /mc-panel --}}

        {{-- هيكل تحميل الملف — يظهر أثناء رحلة openDossier --}}
        <div class="pa-skel" wire:loading.block wire:target="openDossier, openDossierFromAppointment" aria-hidden="true">
            <div class="bone" style="width: 55%;"></div>
            <div class="bone" style="width: 35%;"></div>
            <div class="bone" style="width: 90%; margin-top: 1.4rem;"></div>
            <div class="bone" style="width: 80%;"></div>
            <div class="bone" style="width: 85%;"></div>
            <div class="bone" style="width: 60%; margin-top: 1.4rem;"></div>
            <div class="bone" style="width: 75%;"></div>
        </div>

        {{-- هيكل تحميل نافذة الموعد --}}
        <div class="pa-modal-wrap" wire:loading.flex wire:target="openAppointment" aria-hidden="true" style="z-index:42;">
            <div class="pa-modal" style="padding:1.2rem 1.1rem;">
                <div class="bone" style="width: 45%; height:14px; border-radius:6px; background:var(--line); margin-bottom:0.75rem;"></div>
                <div class="bone" style="width: 70%; height:14px; border-radius:6px; background:var(--line); margin-bottom:0.75rem;"></div>
                <div class="bone" style="width: 90%; height:14px; border-radius:6px; background:var(--line); margin-bottom:0.75rem; margin-top:1.2rem;"></div>
                <div class="bone" style="width: 85%; height:14px; border-radius:6px; background:var(--line);"></div>
            </div>
        </div>

        @if ($this->openAppointmentId !== null && $this->dossierStudent === null)
            @include('filament.pages.partials.advising-appointment', ['appt' => $this->getAppointment(), 'fmt' => $fmt])
        @endif

        @if ($this->dossierStudent !== null)
            @include('filament.pages.partials.advising-dossier', ['dossier' => $this->getDossier(), 'fmt' => $fmt, 'sev' => $sev])
        @endif
    </div>
</x-filament-panels::page>
