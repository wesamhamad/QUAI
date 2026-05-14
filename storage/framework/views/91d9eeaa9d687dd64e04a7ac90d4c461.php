<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title><?php echo $__env->yieldContent('title', 'QUAI - منصة الذكاء الاصطناعي'); ?></title>

    
    <?php echo $__env->make('partials.meta-og', ['ogTitle' => trim(View::yieldContent('og-title')) ?: null], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    
    <script>
        (function(){var t=localStorage.getItem('quai-theme');if(t)document.documentElement.setAttribute('data-theme',t);})();
    </script>

    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet">
    <?php echo $__env->yieldPushContent('styles'); ?>
</head>
<body>
    
    <?php echo $__env->make('layouts.partials.page-loader', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    <div class="q-dashboard">
        
        <?php echo $__env->make('layouts.partials.sidebar', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

        
        <div class="q-main">
            <?php echo $__env->make('layouts.partials.topbar', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

            <main class="<?php echo $__env->yieldContent('content-class', 'q-content'); ?>">
                <?php echo $__env->yieldContent('content'); ?>
            </main>
        </div>

        
        <div class="q-overlay" id="sidebarOverlay"></div>
    </div>

    
    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(auth()->guard()->check()): ?>
        <?php echo $__env->make('digital-record._loader', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

    
    <script>
        // Theme toggle
        (function() {
            function updateIcons() {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                document.querySelectorAll('.q-icon-sun').forEach(el => el.style.display = isDark ? 'block' : 'none');
                document.querySelectorAll('.q-icon-moon').forEach(el => el.style.display = isDark ? 'none' : 'block');
            }
            updateIcons();

            document.getElementById('themeToggle')?.addEventListener('click', () => {
                const html = document.documentElement;
                const next = (html.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', next);
                localStorage.setItem('quai-theme', next);
                updateIcons();
            });
        })();

        // User dropdown
        (function() {
            const btn = document.getElementById('userMenuBtn');
            const dropdown = document.getElementById('userDropdown');
            if (!btn || !dropdown) return;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            });
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#userMenu')) dropdown.classList.remove('open');
            });
        })();
    </script>

    <?php echo $__env->yieldPushContent('scripts'); ?>
</body>
</html>
<?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/layouts/dashboard.blade.php ENDPATH**/ ?>