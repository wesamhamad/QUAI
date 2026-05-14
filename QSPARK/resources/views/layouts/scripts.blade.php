<script>
// Pre-load translations for instant switching
window.translations = {
    'ar': @json(__('messages', [], 'ar')),
    'en': @json(__('messages', [], 'en'))
};

// Global language switcher function
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

// Search functionality
function performSearch(query) {
    clearHighlights();
    
    if (!query.trim()) return;
    
    const searchableElements = document.querySelectorAll('h2, h3, h4, span, p, td, div:not(script):not(style)');
    
    searchableElements.forEach(element => {
        if (element.children.length === 0) {
            const text = element.textContent;
            if (text.toLowerCase().includes(query.toLowerCase())) {
                highlightText(element, query);
            }
        }
    });
}

function highlightText(element, query) {
    const text = element.textContent;
    const regex = new RegExp(`(${query})`, 'gi');
    const highlightedText = text.replace(regex, '<mark class="bg-yellow-300 px-1 rounded">$1</mark>');
    element.innerHTML = highlightedText;
    element.classList.add('search-highlighted');
}

function clearHighlights() {
    document.querySelectorAll('.search-highlighted').forEach(element => {
        element.innerHTML = element.textContent;
        element.classList.remove('search-highlighted');
    });
}

function updatePageContent(locale) {
    const translations = window.translations[locale];
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    document.querySelectorAll('.number, .time, .date, .percentage, [class*="font-bold"], [class*="text-"]').forEach(element => {
        if (element.textContent.match(/\d/)) {
            element.classList.add('en-numbers');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    readNotifications.forEach(id => {
        const notification = document.querySelector(`[data-id="${id}"]`);
        if (notification) {
            const dot = notification.querySelector('.notification-dot');
            const markReadBtn = notification.querySelector('.mark-read-btn');
            const deleteBtn = notification.querySelector('.delete-btn');
            
            if (dot) dot.style.display = 'none';
            if (markReadBtn) markReadBtn.style.display = 'none';
            if (deleteBtn) deleteBtn.classList.remove('hidden');
            notification.classList.add('opacity-60', 'bg-gray-50');
        }
    });
    
    updateNotificationBadge();
});

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('notificationsDropdown');
    const notificationButton = event.target.closest('[onclick="toggleNotifications()"]');
    
    if (!notificationButton && !dropdown.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});
</script>
