
<?php
    $__routeName = \Illuminate\Support\Facades\Route::currentRouteName() ?: 'q-decision.recommendations';
    $__routeParams = request()->route() ? request()->route()->parameters() : [];
?>
<div class="ai-quarters">
    <span class="lbl">عرض بيانات الربع:</span>
    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $quarters; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $q): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <a href="<?php echo e(route($__routeName, array_merge($__routeParams, ['q' => $key]))); ?>"
           class="ai-quarter-tab <?php echo e($activeQuarter === $key ? 'active' : ''); ?>">
            <span class="qt"><?php echo e($q['label']); ?></span>
            <span class="qr"><?php echo e($q['range']); ?></span>
        </a>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    <span class="demo-flag">بيانات تجريبية — ليست بيانات حقيقية</span>
</div>
<?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/q-decision/_quarter-selector.blade.php ENDPATH**/ ?>