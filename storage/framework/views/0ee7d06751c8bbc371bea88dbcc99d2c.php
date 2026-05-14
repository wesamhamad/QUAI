<?php $__env->startSection('title', 'التقرير الذاتي - QUAI'); ?>
<?php $__env->startSection('page-title', 'التقرير الذاتي'); ?>

<?php $__env->startPush('styles'); ?>
<style>
    .ai-page { direction: rtl; max-width: var(--q-content-max); margin: 0 auto; padding: var(--q-space-4); }

    .ai-hero {
        background: linear-gradient(135deg, #027A48 0%, #054F31 60%, #027A48 100%);
        color: #f8fafc; border-radius: 16px;
        padding: 1.5rem 1.75rem; margin-bottom: 1.5rem;
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
    .ai-section-count { font-size: 0.72rem; color: #64748b; font-weight: 600; }

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
        grid-column: 1 / -1;
        border: 1px solid #fcd34d;
        background:
            radial-gradient(circle at top right, rgba(252,211,77,0.10), transparent 55%),
            linear-gradient(180deg, #fffbeb 0%, #ffffff 60%);
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

    [data-theme="dark"] .ai-section { background: rgba(255,255,255,0.02); }
    [data-theme="dark"] .ai-section-head { background: rgba(255,255,255,0.02); }
    [data-theme="dark"] .ai-rec { background: rgba(255,255,255,0.02); }
    [data-theme="dark"] .ai-section-meta h2 { color: #6ee7b7; }
    [data-theme="dark"] .ai-rec h3 { color: #6ee7b7; }
</style>

<?php $__env->stopPush(); ?>

<?php $__env->startSection('content'); ?>
<div class="ai-page">
    <div class="ai-hero">
        <span class="ai-tag">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 4.5L19 9l-4.5 1.5L13 15l-1.5-4.5L7 9l4.5-1.5L13 3z"/>
            </svg>
            AI INSIGHTS · توصيات مشتقة من بياناتك المباشرة
        </span>
        <h1>توصيات الذكاء الاصطناعي</h1>
        <p>هذه التوصيات مستخرجة من قواعد البيانات الحية. تنقسم التوصيات إلى ثلاث طبقات:
            <strong style="color:#fca5a5">عاجل</strong> ·
            <strong style="color:#fbbf24">استباقي</strong> ·
            <strong style="color:#86efac">استراتيجي</strong>.
        </p>
    </div>

    <div class="ai-priority-legend">
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $priorityMeta; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $meta): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item">
                <span class="swatch" style="background: <?php echo e($meta['color']); ?>;"></span>
                <span><strong><?php echo e($meta['label']); ?></strong> — <?php echo e($meta['description']); ?></span>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    </div>

    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $sections; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $section): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <section class="ai-section" id="ai-<?php echo e($section['id']); ?>">
            <div class="ai-section-head">
                <div class="ai-section-icon" style="background: <?php echo e($section['accent']); ?>;">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                </div>
                <div class="ai-section-meta">
                    <span class="dash-tag">المصدر: <?php echo e($section['dashboard']); ?></span>
                    <h2><?php echo e($section['dashboard']); ?></h2>
                    <div class="subtitle"><?php echo e($section['subtitle']); ?></div>
                </div>
                <div class="ai-section-count"><?php echo e(count($section['recommendations'])); ?> توصية</div>
            </div>

            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(count($section['recommendations']) === 0): ?>
                <div class="ai-empty">لا توجد توصيات قابلة للتنفيذ في هذه اللوحة حالياً — البيانات ضمن المعدّل المتوقع.</div>
            <?php else: ?>
                <div class="ai-recs">
                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $section['recommendations']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $rec): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <?php $pm = $priorityMeta[$rec['priority']] ?? $priorityMeta['strategic']; ?>
                        <article class="ai-rec <?php echo e(empty($rec['quote']) ? '' : 'has-quote'); ?>">
                            <div class="ai-rec-head">
                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(! empty($rec['quote'])): ?>
                                    <span class="voice-tag">
                                        <span class="pulse"></span>
                                        مرشح بواسطة الذكاء الاصطناعي · صوت طالب
                                    </span>
                                <?php else: ?>
                                    <span class="ai-rec-tag" style="background: <?php echo e($pm['bg']); ?>; color: <?php echo e($pm['color']); ?>;">
                                        <?php echo e($pm['label']); ?>

                                    </span>
                                <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(! empty($rec['metric'])): ?>
                                    <span class="ai-rec-metric"><?php echo e($rec['metric']); ?></span>
                                <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                            </div>

                            <h3><?php echo e($rec['title']); ?></h3>

                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(! empty($rec['quote'])): ?>
                                <div class="quote-card">
                                    <div class="qc-head">
                                        <span class="qc-status">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            بانتظار التنفيذ
                                        </span>
                                    </div>
                                    <div class="qc-body"><?php echo e($rec['quote']['body']); ?></div>
                                    <div class="qc-foot">
                                        <span class="qc-reacts">
                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                                            </svg>
                                            <?php echo e(number_format($rec['quote']['reactions'])); ?>

                                        </span>
                                        <span>
                                            <span class="qc-author"><?php echo e($rec['quote']['author']); ?></span>
                                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(! empty($rec['quote']['date'])): ?>· <?php echo e($rec['quote']['date']); ?><?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                        </span>
                                    </div>
                                </div>
                            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

                            <div class="field">
                                <strong>الملاحظة</strong>
                                <?php echo e($rec['observation']); ?>

                            </div>
                            <div class="field">
                                <strong>التوصية</strong>
                                <?php echo e($rec['action']); ?>

                            </div>
                            <div class="field">
                                <strong>الأثر المتوقع</strong>
                                <?php echo e($rec['impact']); ?>

                            </div>
                        </article>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                </div>
            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
        </section>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
</div>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.dashboard', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/q-decision/self-report.blade.php ENDPATH**/ ?>