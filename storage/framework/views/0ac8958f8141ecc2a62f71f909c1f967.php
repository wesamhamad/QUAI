
<?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(count($recommendations) === 0): ?>
    <div class="ai-empty">لا توجد توصيات قابلة للتنفيذ في هذه اللوحة حالياً — البيانات ضمن المعدّل المتوقع.</div>
<?php else: ?>
    <div class="ai-recs">
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $recommendations; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $rec): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
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

                <div class="field"><strong>الملاحظة</strong> <?php echo e($rec['observation']); ?></div>
                <div class="field"><strong>التوصية</strong> <?php echo e($rec['action']); ?></div>
                <div class="field"><strong>الأثر المتوقع</strong> <?php echo e($rec['impact']); ?></div>
            </article>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    </div>
<?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
<?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/q-decision/_rec-cards.blade.php ENDPATH**/ ?>