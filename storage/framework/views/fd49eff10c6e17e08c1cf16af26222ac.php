
<?php
    $ogTitle       = $ogTitle       ?? 'QUAI — منصة الذكاء الاصطناعي | جامعة القصيم';
    $ogDescription = $ogDescription ?? 'منصة الذكاء الاصطناعي في جامعة القصيم — تطبيقات ذكية موحّدة للطلبة وأعضاء هيئة التدريس عبر تسجيل دخول واحد.';
    $ogUrl         = $ogUrl         ?? url()->current();
    $ogImage       = asset('images/og-preview.png') . '?v=1';
?>


<meta property="og:type" content="website">
<meta property="og:site_name" content="QUAI · جامعة القصيم">
<meta property="og:locale" content="ar_SA">
<meta property="og:title" content="<?php echo e($ogTitle); ?>">
<meta property="og:description" content="<?php echo e($ogDescription); ?>">
<meta property="og:url" content="<?php echo e($ogUrl); ?>">
<meta property="og:image" content="<?php echo e($ogImage); ?>">
<meta property="og:image:secure_url" content="<?php echo e($ogImage); ?>">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="QUAI — منصة الذكاء الاصطناعي، جامعة القصيم">


<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?php echo e($ogTitle); ?>">
<meta name="twitter:description" content="<?php echo e($ogDescription); ?>">
<meta name="twitter:image" content="<?php echo e($ogImage); ?>">


<meta name="description" content="<?php echo e($ogDescription); ?>">
<link rel="icon" type="image/png" href="<?php echo e(asset('images/qu-icon.png')); ?>">
<link rel="apple-touch-icon" href="<?php echo e(asset('images/qu-icon.png')); ?>">
<?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/partials/meta-og.blade.php ENDPATH**/ ?>