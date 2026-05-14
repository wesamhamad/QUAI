<?php $__env->startSection('title', 'الطلاب — عرض هيئة التدريس'); ?>
<?php $__env->startSection('page-title', 'الطلاب'); ?>

<?php $__env->startSection('content'); ?>
<div style="max-width: var(--q-content-max); margin: 0 auto;">

    <div class="q-card" style="padding: var(--q-space-6); margin-bottom: var(--q-space-6); background: linear-gradient(135deg, #14573A 0%, #1B8354 100%); color: #fff; border-radius: var(--q-radius-2xl);">
        <h1 style="margin:0 0 var(--q-space-2) 0; font-size: var(--q-font-2xl); font-weight: 800;">طلاب الكلية</h1>
        <p style="margin:0; opacity:.9;">اختر طالبًا لاستعراض QMentor و +QSpark والسجل الرقمي ضمن صفحة واحدة بعلامات تبويب.</p>
    </div>

    <form method="get" action="<?php echo e(route('faculty.students')); ?>" style="margin-bottom: var(--q-space-5); display: flex; gap: var(--q-space-2); align-items: stretch;">
        <input
            type="text"
            name="q"
            value="<?php echo e($query); ?>"
            placeholder="ابحث بالاسم أو رقم الطالب أو التخصص..."
            style="flex:1; padding: var(--q-space-3) var(--q-space-4); border: 1px solid var(--q-border-color); border-radius: var(--q-radius-lg); font-size: var(--q-font-base);">
        <button type="submit" class="q-btn q-btn-primary" style="padding: var(--q-space-3) var(--q-space-5);">بحث</button>
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($query !== ''): ?>
            <a href="<?php echo e(route('faculty.students')); ?>" class="q-btn" style="padding: var(--q-space-3) var(--q-space-5); background: var(--q-card-bg); border: 1px solid var(--q-border-color);">مسح</a>
        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    </form>

    <div class="q-card" style="padding: 0; overflow: hidden;">
        <table style="width:100%; border-collapse: collapse; font-size: var(--q-font-sm);">
            <thead style="background: #F1F5F2;">
                <tr style="text-align: right;">
                    <th style="padding: var(--q-space-3) var(--q-space-4);">رقم الطالب</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);">الاسم</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);">الكلية</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);">التخصص</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);">المعدل</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);">المستوى</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);"></th>
                </tr>
            </thead>
            <tbody>
            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__empty_1 = true; $__currentLoopData = $students; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $s): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                <tr style="border-top: 1px solid var(--q-border-color);">
                    <td style="padding: var(--q-space-3) var(--q-space-4); font-family: monospace;" dir="ltr"><?php echo e($s['student_id']); ?></td>
                    <td style="padding: var(--q-space-3) var(--q-space-4); font-weight: 600;"><?php echo e($s['name']); ?></td>
                    <td style="padding: var(--q-space-3) var(--q-space-4);"><?php echo e($s['faculty']); ?></td>
                    <td style="padding: var(--q-space-3) var(--q-space-4);"><?php echo e($s['major']); ?></td>
                    <td style="padding: var(--q-space-3) var(--q-space-4); font-weight: 600; color: #14573A;"><?php echo e(number_format($s['gpa'], 2)); ?></td>
                    <td style="padding: var(--q-space-3) var(--q-space-4);"><?php echo e($s['level']); ?></td>
                    <td style="padding: var(--q-space-3) var(--q-space-4); text-align: left;">
                        <a href="<?php echo e(route('faculty.students.show', $s['student_id'])); ?>"
                           class="q-btn q-btn-primary"
                           style="padding: 6px 14px; font-size: var(--q-font-xs); text-decoration: none;">
                            عرض البيانات
                        </a>
                    </td>
                </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                <tr><td colspan="7" style="padding: var(--q-space-6); text-align: center; color: var(--q-text-secondary);">لا توجد نتائج للبحث.</td></tr>
            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
            </tbody>
        </table>
    </div>

    <p style="margin-top: var(--q-space-4); font-size: var(--q-font-xs); color: var(--q-text-secondary);">
        البيانات المعروضة بيانات تجريبية ثابتة للعرض فقط (لا يتم استدعاء أي خدمة خارجية).
    </p>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.dashboard', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/faculty/index.blade.php ENDPATH**/ ?>