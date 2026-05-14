<?php if (isset($component)) { $__componentOriginal166a02a7c5ef5a9331faf66fa665c256 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal166a02a7c5ef5a9331faf66fa665c256 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'filament-panels::components.page.index','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('filament-panels::page'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
    <?php echo $__env->make('q-decision._dashboard-styles', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    
    <div class="ai-quarters">
        <span class="lbl">عرض بيانات الربع:</span>
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $quarters; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $q): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <button type="button" wire:click="setQuarter('<?php echo e($key); ?>')"
                    class="ai-quarter-tab <?php echo e($activeQuarter === $key ? 'active' : ''); ?>">
                <span class="qt"><?php echo e($q['label']); ?></span>
                <span class="qr"><?php echo e($q['range']); ?></span>
            </button>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
        <span class="demo-flag">بيانات تجريبية — ليست بيانات حقيقية</span>
    </div>

    <p style="font-size:.88rem;color:#6b7280;margin:-.5rem 0 0;">
        توصيات قابلة للتنفيذ مشتقة من لوحات المؤشرات الست — مصنّفة إلى ثلاث طبقات أولوية.
    </p>

    
    <div class="ai-kpis" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $priorityMeta; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $pmeta): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="ai-kpi">
                <div class="k-label" style="display:flex;align-items:center;gap:.4rem;">
                    <span style="width:.7rem;height:.7rem;border-radius:4px;background:<?php echo e($pmeta['color']); ?>;"></span>
                    <?php echo e($pmeta['label']); ?>

                </div>
                <div class="k-hint" style="color:#6b7280;margin-top:.5rem;"><?php echo e($pmeta['description']); ?></div>
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
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal166a02a7c5ef5a9331faf66fa665c256)): ?>
<?php $attributes = $__attributesOriginal166a02a7c5ef5a9331faf66fa665c256; ?>
<?php unset($__attributesOriginal166a02a7c5ef5a9331faf66fa665c256); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal166a02a7c5ef5a9331faf66fa665c256)): ?>
<?php $component = $__componentOriginal166a02a7c5ef5a9331faf66fa665c256; ?>
<?php unset($__componentOriginal166a02a7c5ef5a9331faf66fa665c256); ?>
<?php endif; ?>
<?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/filament/pages/ai-recommendations.blade.php ENDPATH**/ ?>