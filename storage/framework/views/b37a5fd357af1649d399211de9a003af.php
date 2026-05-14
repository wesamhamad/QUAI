
<style>
    .ai-page { direction: rtl; max-width: var(--q-content-max); margin: 0 auto; padding: var(--q-space-4); }

    .ai-hero {
        background: linear-gradient(135deg, #027A48 0%, #054F31 60%, #027A48 100%);
        color: #f8fafc; border-radius: 16px;
        padding: 1.5rem 1.75rem; margin-bottom: 1.25rem;
        position: relative; overflow: hidden;
    }
    .ai-hero::after {
        content: ''; position: absolute; top: -40%; left: -10%; width: 60%; height: 200%;
        background: radial-gradient(closest-side, rgba(59,130,246,0.18), transparent 70%);
        pointer-events: none;
    }
    .ai-hero h1 { font-size: 1.5rem; font-weight: 800; margin: 0 0 0.25rem; }
    .ai-hero p { font-size: 0.875rem; color: #cbd5e1; margin: 0; }
    .ai-hero .ai-tag {
        display: inline-flex; align-items: center; gap: 0.4rem;
        background: rgba(59,130,246,0.16); color: #93c5fd;
        border: 1px solid rgba(59,130,246,0.3);
        padding: 0.25rem 0.7rem; border-radius: 9999px;
        font-size: 0.7rem; font-weight: 700; letter-spacing: 0.02em;
        margin-bottom: 0.6rem;
    }

    /* Quarter selector */
    .ai-quarters {
        display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;
        background: var(--q-card-bg, #fff); border: 1px solid var(--q-border-color, #e5e7eb);
        border-radius: 14px; padding: 0.6rem 0.8rem; margin-bottom: 1.25rem;
    }
    .ai-quarters .lbl { font-size: 0.78rem; font-weight: 700; color: #64748b; margin-inline-end: 0.3rem; }
    .ai-quarter-tab {
        display: inline-flex; flex-direction: column; align-items: flex-start;
        padding: 0.4rem 0.85rem; border-radius: 10px; text-decoration: none;
        border: 1px solid var(--q-border-color, #e5e7eb); background: var(--q-bg-secondary, #f8fafc);
        transition: all 0.18s ease; min-width: 130px;
    }
    .ai-quarter-tab .qt { font-size: 0.82rem; font-weight: 800; color: #334155; }
    .ai-quarter-tab .qr { font-size: 0.66rem; color: #94a3b8; }
    .ai-quarter-tab:hover { border-color: #1B8354; transform: translateY(-1px); }
    .ai-quarter-tab.active { background: linear-gradient(135deg, #027A48, #054F31); border-color: #027A48; }
    .ai-quarter-tab.active .qt, .ai-quarter-tab.active .qr { color: #fff; }
    .ai-quarters .demo-flag {
        margin-inline-start: auto; font-size: 0.66rem; font-weight: 700; color: #92400e;
        background: #fef3c7; border: 1px solid #fcd34d; padding: 0.22rem 0.6rem; border-radius: 9999px;
    }

    .ai-priority-legend { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 0.75rem 0 1rem; }
    .ai-priority-legend .item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: var(--q-text-secondary, #475569); }
    .ai-priority-legend .swatch { width: 0.7rem; height: 0.7rem; border-radius: 4px; }

    .ai-section {
        margin-bottom: 2rem; border-radius: 16px;
        border: 1px solid var(--q-border-color, #e5e7eb);
        background: var(--q-card-bg, #fff); overflow: hidden;
    }
    .ai-section-head {
        display: flex; align-items: center; gap: 0.85rem; padding: 1rem 1.25rem;
        background: linear-gradient(180deg, var(--q-bg-secondary, #f8fafc), var(--q-card-bg, #fff));
        border-bottom: 1px solid var(--q-border-color, #e5e7eb);
    }
    .ai-section-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
    .ai-section-meta { flex: 1; }
    .ai-section-meta .dash-tag { display: inline-block; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.04em; color: #475569; background: #f1f5f9; border: 1px solid #e2e8f0; padding: 0.15rem 0.55rem; border-radius: 9999px; margin-bottom: 0.25rem; }
    .ai-section-meta h2 { font-size: 1.05rem; font-weight: 700; color: #027A48; margin: 0; }
    .ai-section-meta .subtitle { font-size: 0.78rem; color: #64748b; margin-top: 0.15rem; }
    .ai-section-q { font-size: 0.7rem; font-weight: 700; color: #027A48; background: #D1FADF; border: 1px solid #6CE9A6; padding: 0.25rem 0.65rem; border-radius: 9999px; }
    .ai-section-count { font-size: 0.72rem; color: #64748b; font-weight: 600; }

    /* KPI cards */
    .ai-kpis { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 0.8rem; padding: 1.1rem 1.1rem 0.4rem; }
    .ai-kpi { border: 1px solid var(--q-border-color, #e5e7eb); border-radius: 12px; padding: 0.85rem 0.95rem; background: var(--q-card-bg, #fff); position: relative; overflow: hidden; }
    .ai-kpi::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 4px; background: var(--kpi-accent, #1B8354); }
    .ai-kpi .k-label { font-size: 0.74rem; font-weight: 700; color: #64748b; }
    .ai-kpi .k-value { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0.2rem 0 0.1rem; line-height: 1.15; }
    .ai-kpi .k-value .k-unit { font-size: 0.78rem; font-weight: 600; color: #94a3b8; margin-inline-start: 0.2rem; }
    .ai-kpi .k-hint { font-size: 0.7rem; color: #94a3b8; line-height: 1.5; }
    .kpi-green  { --kpi-accent: #1B8354; }
    .kpi-blue   { --kpi-accent: #0891B2; }
    .kpi-amber  { --kpi-accent: #B54708; }
    .kpi-red    { --kpi-accent: #B42318; }
    .kpi-violet { --kpi-accent: #7C3AED; }
    .kpi-slate  { --kpi-accent: #64748B; }

    /* Charts grid */
    .ai-charts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.9rem; padding: 0.8rem 1.1rem 1.1rem; }
    .ai-chart-card { border: 1px solid var(--q-border-color, #e5e7eb); border-radius: 12px; padding: 0.9rem 1rem 1rem; background: var(--q-card-bg, #fff); }
    .ai-chart-card.full { grid-column: 1 / -1; }
    .ai-chart-card h4 { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin: 0; }
    .ai-chart-card .c-sub { font-size: 0.7rem; color: #94a3b8; margin: 0.1rem 0 0.6rem; }
    .ai-chart-canvas-wrap { position: relative; height: 260px; }
    .ai-chart-card.full .ai-chart-canvas-wrap { height: 300px; }
    @media (max-width: 760px) { .ai-charts { grid-template-columns: 1fr; } .ai-chart-card.full { grid-column: auto; } }

    /* Data table */
    .ai-table-wrap { padding: 0 1.1rem 1.1rem; }
    .ai-table-card { border: 1px solid var(--q-border-color, #e5e7eb); border-radius: 12px; overflow: hidden; }
    .ai-table-card .t-head { font-size: 0.85rem; font-weight: 700; color: #0f172a; padding: 0.7rem 1rem; background: var(--q-bg-secondary, #f8fafc); border-bottom: 1px solid var(--q-border-color, #e5e7eb); }
    .ai-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
    .ai-table th { text-align: right; font-weight: 700; color: #64748b; padding: 0.55rem 0.8rem; border-bottom: 1px solid var(--q-border-color, #e5e7eb); background: var(--q-card-bg, #fff); }
    .ai-table td { padding: 0.55rem 0.8rem; border-bottom: 1px solid #f1f5f9; color: #334155; }
    .ai-table tr:last-child td { border-bottom: none; }

    /* Recommendation block */
    .ai-recs-head { display: flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1.25rem; border-top: 1px solid var(--q-border-color, #e5e7eb); background: var(--q-bg-secondary, #f8fafc); }
    .ai-recs-head span.lbl { font-size: 0.82rem; font-weight: 700; color: #B54708; }
    .ai-recs-head .cnt { margin-inline-start: auto; font-size: 0.72rem; color: #64748b; font-weight: 600; }
    .ai-recs { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 0.85rem; padding: 1.1rem; }
    .ai-rec { border: 1px solid var(--q-border-color, #e5e7eb); border-radius: 12px; padding: 0.95rem 1rem; background: var(--q-card-bg, #fff); display: flex; flex-direction: column; gap: 0.6rem; transition: box-shadow 0.2s ease, transform 0.2s ease; }
    .ai-rec:hover { box-shadow: 0 8px 24px -10px rgba(15,23,42,0.12); transform: translateY(-2px); }
    .ai-rec-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
    .ai-rec-tag { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 9999px; }
    .ai-rec-metric { font-size: 0.72rem; font-weight: 700; color: #475569; background: #f1f5f9; padding: 0.18rem 0.55rem; border-radius: 6px; border: 1px solid #e2e8f0; }
    .ai-rec h3 { font-size: 0.97rem; font-weight: 700; color: #027A48; margin: 0; line-height: 1.4; }
    .ai-rec .field { font-size: 0.84rem; line-height: 1.55; color: var(--q-text-primary, #334155); }
    .ai-rec .field strong { display: inline-block; font-size: 0.7rem; font-weight: 700; color: #64748b; letter-spacing: 0.02em; text-transform: uppercase; margin-bottom: 0.15rem; }
    .ai-rec .field + .field { border-top: 1px dashed #e2e8f0; padding-top: 0.55rem; }
    .ai-empty { padding: 1.5rem; text-align: center; color: #64748b; font-size: 0.85rem; }

    .ai-rec.has-quote {
        grid-column: 1 / -1; border: 1px solid #fcd34d;
        background: radial-gradient(circle at top right, rgba(252,211,77,0.10), transparent 55%), linear-gradient(180deg, #fffbeb 0%, #ffffff 60%);
        position: relative; overflow: hidden;
    }
    .ai-rec.has-quote::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 4px; background: linear-gradient(180deg, #f59e0b, #b45309); }
    .ai-rec.has-quote .voice-tag { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; font-weight: 800; color: #92400e; background: #fef3c7; border: 1px solid #fcd34d; padding: 0.22rem 0.7rem; border-radius: 9999px; letter-spacing: 0.02em; }
    .ai-rec.has-quote .voice-tag .pulse { width: 0.5rem; height: 0.5rem; border-radius: 9999px; background: #f59e0b; box-shadow: 0 0 0 0 rgba(245,158,11,0.6); animation: aiPulse 1.8s ease-out infinite; }
    @keyframes aiPulse { 0% { box-shadow: 0 0 0 0 rgba(245,158,11,0.6); } 70% { box-shadow: 0 0 0 10px rgba(245,158,11,0); } 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); } }
    .ai-rec .quote-card { margin-top: 0.25rem; background: #fff; border: 1px solid #fde68a; border-radius: 14px; padding: 1rem 1.1rem 0.85rem; box-shadow: 0 6px 18px -12px rgba(180,83,9,0.18); }
    .ai-rec .quote-card .qc-head { display: flex; justify-content: flex-end; margin-bottom: 0.5rem; }
    .ai-rec .quote-card .qc-status { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.72rem; font-weight: 700; color: #92400e; background: #fef3c7; border: 1px solid #fcd34d; padding: 0.2rem 0.7rem; border-radius: 9999px; }
    .ai-rec .quote-card .qc-body { font-size: 1.05rem; line-height: 1.85; color: #0f172a; text-align: right; font-weight: 500; margin-bottom: 0.75rem; position: relative; }
    .ai-rec .quote-card .qc-body::before { content: '“'; position: absolute; right: -8px; top: -18px; font-size: 2.5rem; color: #fcd34d; font-family: serif; line-height: 1; }
    .ai-rec .quote-card .qc-foot { display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: #64748b; border-top: 1px dashed #e2e8f0; padding-top: 0.55rem; }
    .ai-rec .quote-card .qc-foot .qc-reacts { display: inline-flex; align-items: center; gap: 0.3rem; background: #fffbeb; color: #92400e; border: 1px solid #fde68a; padding: 0.15rem 0.55rem; border-radius: 9999px; font-weight: 700; }
    .ai-rec .quote-card .qc-foot .qc-author { font-weight: 700; color: #0f172a; }

    [data-theme="dark"] .ai-section, [data-theme="dark"] .ai-section-head,
    [data-theme="dark"] .ai-kpi, [data-theme="dark"] .ai-chart-card,
    [data-theme="dark"] .ai-quarters, [data-theme="dark"] .ai-rec { background: rgba(255,255,255,0.02); }
    [data-theme="dark"] .ai-section-meta h2, [data-theme="dark"] .ai-rec h3 { color: #6ee7b7; }
    [data-theme="dark"] .ai-kpi .k-value { color: #f1f5f9; }
    [data-theme="dark"] .ai-chart-card h4 { color: #f1f5f9; }
</style>
<?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/q-decision/_dashboard-styles.blade.php ENDPATH**/ ?>