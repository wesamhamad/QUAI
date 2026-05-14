{{-- Shared styles for the Q-Decision pages — styled to match the production Filament admin dashboards. --}}
<style>
    /* Full-bleed light background like a Filament panel page */
    .fi-bg { background: #f9fafb; }
    [data-theme="dark"] .fi-bg { background: #0f1117; }

    .ai-page {
        direction: rtl;
        max-width: 1600px;
        margin: 0 auto;
        font-family: 'IBM Plex Sans Arabic', sans-serif;
    }

    /* Page header (Filament page heading) */
    .fi-header { margin-bottom: 1.5rem; }
    .fi-header h1 { font-size: 1.6rem; font-weight: 800; color: #111827; margin: 0; letter-spacing: -0.01em; }
    .fi-header p { font-size: 0.9rem; color: #6b7280; margin: 0.35rem 0 0; }
    [data-theme="dark"] .fi-header h1 { color: #f9fafb; }
    [data-theme="dark"] .fi-header p { color: #9ca3af; }

    /* Shared Filament-style card */
    .fi-card {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    [data-theme="dark"] .fi-card { background: #15181f; border-color: #262a33; }

    /* Quarter selector — Filament filter bar */
    .ai-quarters {
        display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;
        background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem;
        padding: 0.75rem 1rem; margin-bottom: 1.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .ai-quarters .lbl { font-size: 0.82rem; font-weight: 600; color: #374151; margin-inline-end: 0.4rem; }
    .ai-quarter-tab {
        display: inline-flex; flex-direction: column; align-items: flex-start;
        padding: 0.4rem 0.85rem; border-radius: 0.5rem; text-decoration: none;
        border: 1px solid #e5e7eb; background: #ffffff; transition: all 0.15s ease; min-width: 132px;
    }
    .ai-quarter-tab .qt { font-size: 0.82rem; font-weight: 700; color: #374151; }
    .ai-quarter-tab .qr { font-size: 0.66rem; color: #9ca3af; }
    .ai-quarter-tab:hover { border-color: #16a34a; background: #f0fdf4; }
    .ai-quarter-tab.active { background: #16a34a; border-color: #16a34a; }
    .ai-quarter-tab.active .qt, .ai-quarter-tab.active .qr { color: #ffffff; }
    .ai-quarters .demo-flag {
        margin-inline-start: auto; font-size: 0.68rem; font-weight: 600; color: #92400e;
        background: #fffbeb; border: 1px solid #fde68a; padding: 0.28rem 0.65rem; border-radius: 0.5rem;
    }
    [data-theme="dark"] .ai-quarters { background: #15181f; border-color: #262a33; }
    [data-theme="dark"] .ai-quarter-tab { background: #1c2029; border-color: #262a33; }
    [data-theme="dark"] .ai-quarter-tab .qt { color: #e5e7eb; }
    [data-theme="dark"] .ai-quarters .lbl { color: #d1d5db; }

    /* Section heading (Filament widget group heading with dot) */
    .fi-section { margin-bottom: 2rem; }
    .fi-section-head { display: flex; align-items: center; gap: 0.55rem; margin-bottom: 1rem; }
    .fi-section-head .dot { width: 0.6rem; height: 0.6rem; border-radius: 9999px; flex-shrink: 0; }
    .fi-section-head h2 { font-size: 1.05rem; font-weight: 700; color: #111827; margin: 0; }
    .fi-section-head .sub { font-size: 0.78rem; color: #9ca3af; }
    .fi-section-head .count { margin-inline-start: auto; font-size: 0.75rem; color: #6b7280; font-weight: 600; }
    [data-theme="dark"] .fi-section-head h2 { color: #f3f4f6; }

    /* KPI / Stats cards */
    .ai-kpis {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        gap: 1.25rem; margin-bottom: 1.5rem;
    }
    .ai-kpi {
        background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem;
        padding: 1.25rem 1.35rem; box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .ai-kpi .k-label { font-size: 0.8rem; font-weight: 600; color: #6b7280; }
    .ai-kpi .k-value { font-size: 1.85rem; font-weight: 800; color: #111827; margin: 0.45rem 0 0.35rem; line-height: 1.1; }
    .ai-kpi .k-value .k-unit { font-size: 0.85rem; font-weight: 600; color: #9ca3af; margin-inline-start: 0.25rem; }
    .ai-kpi .k-hint { font-size: 0.78rem; line-height: 1.55; font-weight: 500; }
    .kpi-green  .k-hint { color: #16a34a; }
    .kpi-blue   .k-hint { color: #0284c7; }
    .kpi-amber  .k-hint { color: #d97706; }
    .kpi-red    .k-hint { color: #dc2626; }
    .kpi-violet .k-hint { color: #7c3aed; }
    .kpi-slate  .k-hint { color: #64748b; }
    [data-theme="dark"] .ai-kpi { background: #15181f; border-color: #262a33; }
    [data-theme="dark"] .ai-kpi .k-value { color: #f9fafb; }
    [data-theme="dark"] .ai-kpi .k-label { color: #9ca3af; }

    /* Charts grid */
    .ai-charts { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; margin-bottom: 1.5rem; }
    .ai-chart-card {
        background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem;
        padding: 1.35rem 1.4rem 1.4rem; box-shadow: 0 1px 2px rgba(0,0,0,0.04);
    }
    .ai-chart-card.full { grid-column: 1 / -1; }
    .ai-chart-card h4 { font-size: 0.98rem; font-weight: 700; color: #1f2937; margin: 0; }
    .ai-chart-card .c-sub { font-size: 0.74rem; color: #9ca3af; margin: 0.2rem 0 0.9rem; }
    .ai-chart-canvas-wrap { position: relative; height: 280px; }
    .ai-chart-card.full .ai-chart-canvas-wrap { height: 320px; }
    [data-theme="dark"] .ai-chart-card { background: #15181f; border-color: #262a33; }
    [data-theme="dark"] .ai-chart-card h4 { color: #f3f4f6; }
    @media (max-width: 820px) { .ai-charts { grid-template-columns: 1fr; } .ai-chart-card.full { grid-column: auto; } }

    /* Data table (Filament table) */
    .ai-table-card {
        background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem;
        overflow-x: auto; box-shadow: 0 1px 2px rgba(0,0,0,0.04); margin-bottom: 1.5rem;
    }
    .ai-table-card .t-head { font-size: 0.95rem; font-weight: 700; color: #1f2937; padding: 1rem 1.35rem; border-bottom: 1px solid #e5e7eb; }
    .ai-table { width: 100%; min-width: 520px; border-collapse: collapse; font-size: 0.82rem; }
    .ai-table th { text-align: right; font-weight: 600; color: #6b7280; padding: 0.7rem 1.35rem; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
    .ai-table td { padding: 0.75rem 1.35rem; border-bottom: 1px solid #f3f4f6; color: #374151; }
    .ai-table tr:last-child td { border-bottom: none; }
    .ai-table tbody tr:hover { background: #f9fafb; }
    [data-theme="dark"] .ai-table-card { background: #15181f; border-color: #262a33; }
    [data-theme="dark"] .ai-table-card .t-head { color: #f3f4f6; border-color: #262a33; }
    [data-theme="dark"] .ai-table th { background: #1c2029; color: #9ca3af; border-color: #262a33; }
    [data-theme="dark"] .ai-table td { color: #d1d5db; border-color: #262a33; }
    [data-theme="dark"] .ai-table tbody tr:hover { background: #1c2029; }

    /* Recommendations */
    .ai-recs-head { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
    .ai-recs-head .dot { width: 0.6rem; height: 0.6rem; border-radius: 9999px; background: #d97706; }
    .ai-recs-head span.lbl { font-size: 1.05rem; font-weight: 700; color: #111827; }
    .ai-recs-head .cnt { margin-inline-start: auto; font-size: 0.75rem; color: #6b7280; font-weight: 600; }
    [data-theme="dark"] .ai-recs-head span.lbl { color: #f3f4f6; }

    .ai-recs { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr)); gap: 1.25rem; }
    .ai-rec {
        background: #ffffff; border: 1px solid #e5e7eb; border-radius: 0.75rem;
        padding: 1.25rem 1.35rem; box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        display: flex; flex-direction: column; gap: 0.65rem; transition: box-shadow 0.18s ease;
    }
    .ai-rec:hover { box-shadow: 0 4px 14px -4px rgba(15,23,42,0.10); }
    .ai-rec-head { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
    .ai-rec-tag { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.72rem; font-weight: 700; padding: 0.22rem 0.6rem; border-radius: 0.375rem; }
    .ai-rec-metric { font-size: 0.72rem; font-weight: 600; color: #475569; background: #f1f5f9; padding: 0.2rem 0.55rem; border-radius: 0.375rem; border: 1px solid #e2e8f0; }
    .ai-rec h3 { font-size: 0.98rem; font-weight: 700; color: #111827; margin: 0; line-height: 1.45; }
    .ai-rec .field { font-size: 0.85rem; line-height: 1.6; color: #374151; }
    .ai-rec .field strong { display: inline-block; font-size: 0.7rem; font-weight: 700; color: #9ca3af; letter-spacing: 0.03em; text-transform: uppercase; margin-bottom: 0.15rem; }
    .ai-rec .field + .field { border-top: 1px dashed #e5e7eb; padding-top: 0.6rem; }
    .ai-empty { padding: 2rem; text-align: center; color: #9ca3af; font-size: 0.88rem; background: #ffffff; border: 1px dashed #e5e7eb; border-radius: 0.75rem; }
    [data-theme="dark"] .ai-rec { background: #15181f; border-color: #262a33; }
    [data-theme="dark"] .ai-rec h3 { color: #f3f4f6; }
    [data-theme="dark"] .ai-rec .field { color: #d1d5db; }
    [data-theme="dark"] .ai-empty { background: #15181f; border-color: #262a33; }

    .ai-rec.has-quote {
        grid-column: 1 / -1; border-color: #fcd34d;
        background: linear-gradient(180deg, #fffbeb 0%, #ffffff 55%);
    }
    .ai-rec.has-quote .voice-tag { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.72rem; font-weight: 700; color: #92400e; background: #fef3c7; border: 1px solid #fcd34d; padding: 0.24rem 0.7rem; border-radius: 0.375rem; }
    .ai-rec.has-quote .voice-tag .pulse { width: 0.5rem; height: 0.5rem; border-radius: 9999px; background: #f59e0b; box-shadow: 0 0 0 0 rgba(245,158,11,0.6); animation: aiPulse 1.8s ease-out infinite; }
    @keyframes aiPulse { 0% { box-shadow: 0 0 0 0 rgba(245,158,11,0.6); } 70% { box-shadow: 0 0 0 8px rgba(245,158,11,0); } 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); } }
    .ai-rec .quote-card { margin-top: 0.25rem; background: #ffffff; border: 1px solid #fde68a; border-radius: 0.625rem; padding: 1rem 1.1rem 0.85rem; }
    .ai-rec .quote-card .qc-head { display: flex; justify-content: flex-end; margin-bottom: 0.5rem; }
    .ai-rec .quote-card .qc-status { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.72rem; font-weight: 600; color: #92400e; background: #fef3c7; border: 1px solid #fcd34d; padding: 0.2rem 0.6rem; border-radius: 0.375rem; }
    .ai-rec .quote-card .qc-body { font-size: 1.02rem; line-height: 1.85; color: #1f2937; text-align: right; font-weight: 500; margin-bottom: 0.75rem; }
    .ai-rec .quote-card .qc-foot { display: flex; align-items: center; justify-content: space-between; font-size: 0.76rem; color: #6b7280; border-top: 1px dashed #e5e7eb; padding-top: 0.55rem; }
    .ai-rec .quote-card .qc-foot .qc-reacts { display: inline-flex; align-items: center; gap: 0.3rem; background: #fffbeb; color: #92400e; border: 1px solid #fde68a; padding: 0.16rem 0.55rem; border-radius: 9999px; font-weight: 700; }
    .ai-rec .quote-card .qc-foot .qc-author { font-weight: 700; color: #1f2937; }
    [data-theme="dark"] .ai-rec.has-quote { background: #1d1a12; border-color: #5c4813; }
    [data-theme="dark"] .ai-rec .quote-card { background: #15181f; border-color: #5c4813; }
    [data-theme="dark"] .ai-rec .quote-card .qc-body { color: #f3f4f6; }
</style>
