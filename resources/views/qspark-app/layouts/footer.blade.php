<footer class="bg-white border-t px-4 sm:px-6 py-4 mt-auto">
  <div class="text-center text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md py-1.5 px-3 mb-3" dir="rtl">
    هذه نسخة تجريبية (Demo) وليست النسخة الأصلية
  </div>
  <div class="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-sm text-gray-600 text-center sm:text-left">
    <div>
      <span>&copy; {{ date('Y') }} Q SPARK - <span data-translate="all_rights_reserved">{{ __('messages.all_rights_reserved') }}</span></span>
    </div>
    <div class="flex flex-wrap justify-center gap-x-4 gap-y-1">
      <a href="https://www.qu.edu.sa/policies/privacy-policy/" target="_blank" rel="noopener noreferrer" class="hover:text-gray-800 transition" data-translate="privacy_policy">{{ __('messages.privacy_policy') }}</a>
      <button type="button" onclick="window.openTermsModal && window.openTermsModal('view')" class="hover:text-gray-800 transition cursor-pointer bg-transparent border-0 p-0 font-inherit" data-translate="terms_of_service">{{ __('messages.terms_of_service') }}</button>
      <a href="https://www.qu.edu.sa/technical-support/" target="_blank" rel="noopener noreferrer" class="hover:text-gray-800 transition" data-translate="support">{{ __('messages.support') }}</a>
    </div>
  </div>
</footer>
