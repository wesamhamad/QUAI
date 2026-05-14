<?php $__env->startSection('title', 'توصيات الذكاء الاصطناعي - QUAI'); ?>
<?php $__env->startSection('page-title', 'توصيات الذكاء الاصطناعي'); ?>
<?php $__env->startSection('content-class', 'q-content fi-bg'); ?>

<?php $__env->startPush('styles'); ?>
    <?php echo $__env->make('q-decision._dashboard-styles', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
<?php $__env->stopPush(); ?>

<?php $__env->startSection('content'); ?>
<div class="ai-page">
    <div class="fi-header">
        <h1>توصيات الذكاء الاصطناعي</h1>
        <p>توصيات قابلة للتنفيذ مشتقة من لوحات المؤشرات الست — مصنّفة إلى ثلاث طبقات أولوية.</p>
    </div>

    <?php echo $__env->make('q-decision._quarter-selector', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    
    <div class="ai-kpis" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $priorityMeta; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $pmeta): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="ai-kpi">
                <div class="k-label" style="display:flex;align-items:center;gap:0.4rem;">
                    <span style="width:0.7rem;height:0.7rem;border-radius:4px;background:<?php echo e($pmeta['color']); ?>;"></span>
                    <?php echo e($pmeta['label']); ?>

                </div>
                <div class="k-hint" style="color:#6b7280;margin-top:0.5rem;"><?php echo e($pmeta['description']); ?></div>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    </div>

    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $sections; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $section): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="fi-section" id="ai-<?php echo e($section['id']); ?>">
            <div class="fi-section-head">
                <span class="dot" style="background: <?php echo e($section['accent']); ?>;"></span>
                <h2><?php echo e($section['dashboard']); ?></h2>
                <span class="count"><?php echo e(count($section['recommendations'])); ?> توصية</span>
            </div>
            <?php echo $__env->make('q-decision._rec-cards', ['recommendations' => $section['recommendations']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.dashboard', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/q-decision/recommendations.blade.php ENDPATH**/ ?>