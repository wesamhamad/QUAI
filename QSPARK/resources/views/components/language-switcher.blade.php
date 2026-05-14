<div class="flex bg-dga-gray-100 rounded-full cursor-pointer relative z-50" id="language-switcher">
    <button onclick="switchLanguage('ar')" 
            class="px-3 py-1 text-sm font-semibold transition lang-btn {{ app()->getLocale() == 'ar' ? 'bg-dga-primary-500 text-white rounded-full' : 'text-gray-600 hover:bg-gray-300' }}"
            data-lang="ar" id="ar-btn" type="button">
        AR
    </button>
    <button onclick="switchLanguage('en')" 
            class="px-3 py-1 text-sm font-semibold transition lang-btn {{ app()->getLocale() == 'en' ? 'bg-dga-primary-500 text-white rounded-full' : 'text-gray-600 hover:bg-gray-300' }}"
            data-lang="en" id="en-btn" type="button">
        EN
    </button>
</div>

<script>
function switchLanguage(locale) {
    // Prevent multiple clicks
    if (document.querySelector('.lang-btn[disabled]')) return;
    
    // Show loading state
    const currentBtn = document.getElementById(locale + '-btn');
    const originalText = currentBtn.textContent;
    currentBtn.textContent = '...';
    currentBtn.disabled = true;
    
    // Update UI immediately
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    
    // Update button states immediately
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('bg-dga-primary-500', 'text-white', 'rounded-full');
        btn.classList.add('text-gray-600', 'hover:bg-gray-300');
    });
    
    currentBtn.classList.remove('text-gray-600', 'hover:bg-gray-300');
    currentBtn.classList.add('bg-dga-primary-500', 'text-white', 'rounded-full');
    currentBtn.textContent = originalText;
    currentBtn.disabled = false;
    
    // Update content instantly
    if (window.updatePageContent) {
        window.updatePageContent(locale);
    }
    
    // Update session in background
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    if (csrfToken) {
        fetch(`/lang/${locale}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({})
        }).catch(error => {
            console.error('Background language update failed:', error);
        });
    }
}
</script>
