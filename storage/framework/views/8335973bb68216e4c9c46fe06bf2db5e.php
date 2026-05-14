<?php $__env->startSection('title', $meta['title'] . ' - QUAI'); ?>
<?php $__env->startSection('page-title', $meta['title']); ?>

<?php $__env->startPush('styles'); ?>
    <?php echo $__env->make('q-decision._dashboard-styles', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
<?php $__env->stopPush(); ?>

<?php $__env->startSection('content'); ?>
<div class="ai-page">
    <div class="ai-hero">
        <span class="ai-tag">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h2l2 5 4-13 3 8 2-4h5"/>
            </svg>
            لوحة مؤشرات · <?php echo e($quarters[$activeQuarter]['label']); ?> <?php echo e($quarters[$activeQuarter]['range']); ?>

        </span>
        <h1><?php echo e($meta['title']); ?></h1>
        <p><?php echo e($section['subtitle'] ?? 'لوحة مؤشرات تفاعلية — اختر الربع لعرض بياناته.'); ?></p>
    </div>

    <?php echo $__env->make('q-decision._quarter-selector', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    <section class="ai-section">
        <div class="ai-section-head">
            <div class="ai-section-icon" style="background: <?php echo e($meta['accent']); ?>;">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="<?php echo e($meta['icon']); ?>"/>
                </svg>
            </div>
            <div class="ai-section-meta">
                <span class="dash-tag">لوحة مؤشرات</span>
                <h2><?php echo e($meta['title']); ?></h2>
                <div class="subtitle"><?php echo e($section['subtitle'] ?? ''); ?></div>
            </div>
            <span class="ai-section-q"><?php echo e($quarters[$activeQuarter]['label']); ?> · <?php echo e($quarters[$activeQuarter]['range']); ?></span>
        </div>

        
        <div class="ai-kpis">
            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $data['kpis']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $kpi): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="ai-kpi kpi-<?php echo e($kpi['tone']); ?>">
                    <div class="k-label"><?php echo e($kpi['label']); ?></div>
                    <div class="k-value"><?php echo e($kpi['value']); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(!empty($kpi['unit'])): ?><span class="k-unit"><?php echo e($kpi['unit']); ?></span><?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?></div>
                    <div class="k-hint"><?php echo e($kpi['hint']); ?></div>
                </div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
        </div>

        
        <div class="ai-charts">
            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $data['charts']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $chart): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="ai-chart-card <?php echo e(!empty($chart['full']) ? 'full' : ''); ?>">
                    <h4><?php echo e($chart['title']); ?></h4>
                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(!empty($chart['subtitle'])): ?><div class="c-sub"><?php echo e($chart['subtitle']); ?></div><?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                    <div class="ai-chart-canvas-wrap">
                        <canvas id="chart-<?php echo e($chart['id']); ?>"></canvas>
                    </div>
                </div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
        </div>

        
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(!empty($data['table'])): ?>
            <div class="ai-table-wrap">
                <div class="ai-table-card">
                    <div class="t-head"><?php echo e($data['table']['title']); ?></div>
                    <table class="ai-table">
                        <thead>
                            <tr>
                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $data['table']['columns']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $col): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <th><?php echo e($col); ?></th>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $data['table']['rows']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $row): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr>
                                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $row; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cell): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <td><?php echo e($cell); ?></td>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

        
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($section): ?>
            <div class="ai-recs-head">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span class="lbl">توصيات الذكاء الاصطناعي</span>
                <span class="cnt"><?php echo e(count($section['recommendations'])); ?> توصية</span>
            </div>
            <?php echo $__env->make('q-decision._rec-cards', ['recommendations' => $section['recommendations']], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    </section>
</div>
<?php $__env->stopSection(); ?>

<?php $__env->startPush('scripts'); ?>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script>
(function () {
    var configs = <?php echo json_encode($data['charts'], JSON_UNESCAPED_UNICODE, 512) ?>;
    if (typeof Chart === 'undefined') return;

    Chart.defaults.font.family = "'IBM Plex Sans Arabic', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#64748b';

    function buildOptions(cfg) {
        var type = cfg.type;
        var isHorizontal = type === 'horizontalBar';
        var isStacked = type === 'stackedBar';
        var isCircular = type === 'doughnut' || type === 'pie';
        var isRadar = type === 'radar';

        var opts = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: isCircular || isRadar || (cfg.data.datasets && cfg.data.datasets.length > 1),
                    position: isCircular ? 'bottom' : 'top',
                    labels: { boxWidth: 12, padding: 10, font: { size: 10 } }
                },
                tooltip: { rtl: true, bodyFont: { size: 11 }, titleFont: { size: 11 } }
            }
        };

        if (isCircular) {
            opts.cutout = type === 'doughnut' ? '58%' : 0;
        } else if (isRadar) {
            opts.scales = { r: { ticks: { display: false }, pointLabels: { font: { size: 10 } } } };
        } else {
            opts.indexAxis = isHorizontal ? 'y' : 'x';
            opts.scales = {
                x: { stacked: isStacked, grid: { display: !isHorizontal, color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
                y: { stacked: isStacked, grid: { display: isHorizontal, color: '#f1f5f9' }, beginAtZero: true, ticks: { font: { size: 10 } } }
            };
        }
        return opts;
    }

    function chartType(t) {
        if (t === 'horizontalBar' || t === 'stackedBar') return 'bar';
        return t;
    }

    configs.forEach(function (cfg) {
        var el = document.getElementById('chart-' + cfg.id);
        if (!el) return;
        try {
            new Chart(el, { type: chartType(cfg.type), data: cfg.data, options: buildOptions(cfg) });
        } catch (e) {
            console.error('chart init failed: ' + cfg.id, e);
        }
    });
})();
</script>
<?php $__env->stopPush(); ?>

<?php echo $__env->make('layouts.dashboard', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/q-decision/dashboard.blade.php ENDPATH**/ ?>