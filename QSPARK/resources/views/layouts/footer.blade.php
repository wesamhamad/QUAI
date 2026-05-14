<footer class="bg-white border-t px-6 py-4 mt-auto">
  <div class="flex justify-between items-center text-sm text-gray-600">
    <div>
      <span>&copy; {{ date('Y') }} Q SPARK - <span data-translate="all_rights_reserved">{{ __('messages.all_rights_reserved') }}</span></span>
    </div>
    <div class="flex gap-4">
      <a href="https://www.qu.edu.sa/policies/privacy-policy/" target="_blank" rel="noopener noreferrer" class="hover:text-gray-800 transition" data-translate="privacy_policy">{{ __('messages.privacy_policy') }}</a>
      <button type="button" onclick="window.openTermsModal && window.openTermsModal('view')" class="hover:text-gray-800 transition cursor-pointer bg-transparent border-0 p-0 font-inherit" data-translate="terms_of_service">{{ __('messages.terms_of_service') }}</button>
      <a href="https://www.qu.edu.sa/technical-support/" target="_blank" rel="noopener noreferrer" class="hover:text-gray-800 transition" data-translate="support">{{ __('messages.support') }}</a>
    </div>
  </div>
</footer>
