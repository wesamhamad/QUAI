// Recommendations Page Translations
window.recommendationsTranslations = {
    ar: {
        // Timeline periods
        'one_week_period': 'أسبوع واحد',
        'one_month_period': 'شهر واحد',
        'six_months_period': '6 أشهر',
        'one_year_period': 'سنة واحدة',
        'pre_graduation_period': 'ما قبل التخرج',
        
        // Common labels
        'goals_label': '🎯 الأهداف:',
        'focus_areas_label': '📌 مجالات التركيز:',
        'path_label': 'المسار',
        'steps_label': 'الخطوات',
        'duration_label': 'المدة',
        'week_label': 'الأسبوع',
        'tasks_label': 'المهام',
        'expected_hours_label': 'الساعات المتوقعة',
        'goal_label': 'الهدف',
        'target_label': 'الهدف المستهدف',
        'deadline_label': 'الموعد النهائي',
        'action_steps_label': 'خطوات العمل',
        'area_label': 'المجال',
        'action_plan_label': 'خطة العمل',
        'resource_label': 'المورد',
        'type_label': 'النوع',
        'description_label': 'الوصف',
        'technique_label': 'التقنية',
        'how_to_apply_label': 'كيفية التطبيق',
        'hours': 'ساعات',
        'provider_label': 'الجهة المانحة:',
        'benefits_label': 'الفوائد:',
        'company_label': 'الشركة:',
        'learn_more_btn': 'اعرف المزيد',
    },
    en: {
        // Timeline periods
        'one_week_period': 'One Week',
        'one_month_period': 'One Month',
        'six_months_period': '6 Months',
        'one_year_period': 'One Year',
        'pre_graduation_period': 'Pre-Graduation',
        
        // Common labels
        'goals_label': '🎯 Goals:',
        'focus_areas_label': '📌 Focus Areas:',
        'path_label': 'Path',
        'steps_label': 'Steps',
        'duration_label': 'Duration',
        'week_label': 'Week',
        'tasks_label': 'Tasks',
        'expected_hours_label': 'Expected Hours',
        'goal_label': 'Goal',
        'target_label': 'Target',
        'deadline_label': 'Deadline',
        'action_steps_label': 'Action Steps',
        'area_label': 'Area',
        'action_plan_label': 'Action Plan',
        'resource_label': 'Resource',
        'type_label': 'Type',
        'description_label': 'Description',
        'technique_label': 'Technique',
        'how_to_apply_label': 'How to Apply',
        'hours': 'hours',
        'provider_label': 'Provider:',
        'benefits_label': 'Benefits:',
        'company_label': 'Company:',
        'learn_more_btn': 'Learn More',
    }
};

// Update recommendations page content based on locale
function updateRecommendationsContent(locale) {
    const trans = window.recommendationsTranslations[locale] || window.recommendationsTranslations.en;
    
    // Update all elements with data-rec-translate attribute
    document.querySelectorAll('[data-rec-translate]').forEach(element => {
        const key = element.getAttribute('data-rec-translate');
        if (trans[key]) {
            element.textContent = trans[key];
        }
    });
}

// Auto-update when language changes
if (typeof window.updatePageContent !== 'undefined') {
    const originalUpdate = window.updatePageContent;
    window.updatePageContent = function(locale) {
        originalUpdate(locale);
        updateRecommendationsContent(locale);
    };
} else {
    window.updatePageContent = updateRecommendationsContent;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentLocale = document.documentElement.lang || 'ar';
    updateRecommendationsContent(currentLocale);
});

