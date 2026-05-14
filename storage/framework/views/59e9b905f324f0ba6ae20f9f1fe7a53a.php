<?php $__env->startSection('title', 'توصيات الذكاء الاصطناعي - QUAI'); ?>
<?php $__env->startSection('page-title', 'توصيات الذكاء الاصطناعي'); ?>

<?php $__env->startPush('styles'); ?>
    <?php echo $__env->make('q-decision._dashboard-styles', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
<?php $__env->stopPush(); ?>

<?php $__env->startSection('content'); ?>
<div class="ai-page">
    <div class="ai-hero">
        <span class="ai-tag">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 4.5L19 9l-4.5 1.5L13 15l-1.5-4.5L7 9l4.5-1.5L13 3z"/>
            </svg>
            AI INSIGHTS · توصيات مشتقة من بيانات اللوحات
        </span>
        <h1>توصيات الذكاء الاصطناعي</h1>
        <p>توصيات قابلة للتنفيذ مشتقة من لوحات المؤشرات الست. تنقسم إلى ثلاث طبقات:
            <strong style="color:#fca5a5">عاجل</strong> ·
            <strong style="color:#fbbf24">استباقي</strong> ·
            <strong style="color:#86efac">استراتيجي</strong>.
        </p>
    </div>

    <?php echo $__env->make('q-decision._quarter-selector', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    <div class="ai-priority-legend">
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $priorityMeta; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $pmeta): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="item">
                <span class="swatch" style="background: <?php echo e($pmeta['color']); ?>;"></span>
                <span><strong><?php echo e($pmeta['label']); ?></strong> — <?php echo e($pmeta['description']); ?></span>
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
                <span class="ai-section-count"><?php echo e(count($section['recommendations'])); ?> توصية</span>
            </div>
            <?php echo $__env->make('q-decision._rec-cards', ['recommendations' => $section['recommendations']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        </section>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.dashboard', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/q-decision/recommendations.blade.php ENDPATH**/ ?>