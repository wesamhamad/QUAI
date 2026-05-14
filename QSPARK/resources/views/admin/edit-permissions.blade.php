@extends('layouts.app')

@section('title', __('messages.edit_permissions_page_title', ['role' => $role === 'admin' ? __('messages.role_admin') : ($role === 'faculty' ? __('messages.role_faculty') : __('messages.role_student'))]))

@section('content')
<div class="p-6 space-y-6">
    {{-- Header --}}
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
            <a href="{{ route('admin.roles') }}" class="p-2 hover:bg-gray-100 rounded-lg transition">
                <svg class="w-6 h-6 text-gray-600 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
            </a>
            <div>
                <h2 class="text-3xl font-extrabold">{{ __('messages.edit_permissions_title_prefix') }}
                    <span class="@if($role === 'admin') text-dga-primary-600 @elseif($role === 'faculty') text-green-600 @else text-dga-primary-600 @endif">
                        @if($role === 'admin') {{ __('messages.role_admin') }} @elseif($role === 'faculty') {{ __('messages.role_faculty') }} @else {{ __('messages.role_student') }} @endif
                    </span>
                </h2>
                <p class="text-gray-500 mt-1">{{ __('messages.edit_permissions_subtitle') }}</p>
            </div>
        </div>
    </div>

    {{-- Success/Error Messages --}}
    @if(session('success'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3" id="successAlert">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>{{ session('success') }}</span>
        </div>
    @endif

    @if(session('error'))
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <span>{{ session('error') }}</span>
        </div>
    @endif

    {{-- Permissions Form --}}
    <form action="{{ route('admin.permissions.update', ['role' => $role]) }}" method="POST" id="permissionsForm">
        @csrf
        @method('PUT')
        
        <div class="bg-white rounded-2xl shadow overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 
                @if($role === 'admin') bg-dga-primary-50 
                @elseif($role === 'faculty') bg-green-50 
                @else bg-dga-primary-50 
                @endif">
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-bold 
                        @if($role === 'admin') text-dga-primary-800 
                        @elseif($role === 'faculty') text-green-800 
                        @else text-dga-primary-800 
                        @endif">
                        <svg class="w-6 h-6 inline-block ml-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                        </svg>
                        {{ __('messages.available_permissions') }}
                    </h3>
                    <span class="text-sm text-gray-500">
                        {{ count(array_filter($rolePermissions)) }} {{ __('messages.permissions_active_count_word_of') }} {{ count($availablePermissions) }} {{ __('messages.permissions_active_count_of') }}
                    </span>
                </div>
            </div>

            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    @foreach($availablePermissions as $key => $label)
                        @php
                            $isEnabled = $rolePermissions[$key] ?? false;
                            $isCritical = in_array($key, ['access_admin_dashboard', 'manage_users', 'manage_roles']);
                        @endphp
                        <div class="flex items-center justify-between p-4 rounded-xl border 
                            {{ $isEnabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200' }}
                            hover:shadow-md transition-all duration-200">
                            <div class="flex items-center gap-3">
                                @if($isCritical)
                                    <span class="text-dga-primary-500" title="{{ __('messages.critical_permission') }}">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                                        </svg>
                                    </span>
                                @endif
                                <label for="perm_{{ $key }}" class="text-sm font-medium text-gray-700 cursor-pointer">
                                    {{ $label }}
                                </label>
                            </div>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" 
                                       name="permissions[]" 
                                       value="{{ $key }}" 
                                       id="perm_{{ $key }}"
                                       class="sr-only peer"
                                       {{ $isEnabled ? 'checked' : '' }}
                                       @if($isCritical && $role === 'admin') data-critical="true" @endif>
                                <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 
                                    peer-focus:ring-blue-300 rounded-full peer 
                                    peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                                    after:start-[2px] after:bg-white after:border-gray-300 after:border 
                                    after:rounded-full after:h-5 after:w-5 after:transition-all 
                                    peer-checked:bg-green-500"></div>
                            </label>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Action Buttons --}}
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <a href="{{ route('admin.roles') }}"
                   class="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition font-medium">
                    {{ __('messages.cancel') }}
                </a>
                <button type="submit" 
                        class="px-6 py-2.5 text-white rounded-xl font-medium transition
                            @if($role === 'admin') bg-dga-primary-600 hover:bg-dga-primary-700 
                            @elseif($role === 'faculty') bg-green-600 hover:bg-green-700 
                            @else bg-dga-primary-600 hover:bg-dga-primary-700 
                            @endif">
                    <svg class="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    {{ __('messages.save_changes') }}
                </button>
            </div>
        </div>
    </form>

    {{-- Warning Note --}}
    <div class="bg-dga-primary-50 border border-dga-primary-200 rounded-xl p-4">
        <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-dga-primary-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div>
                <h4 class="font-bold text-dga-primary-800">{{ __('messages.important_warning') }}</h4>
                <p class="text-sm text-dga-primary-700 mt-1">
                    {{ __('messages.permissions_warning_message') }}
                </p>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
document.getElementById('permissionsForm').addEventListener('submit', function(e) {
    const criticalCheckboxes = document.querySelectorAll('input[data-critical="true"]:not(:checked)');
    if (criticalCheckboxes.length > 0 && '{{ $role }}' === 'admin') {
        const confirmed = confirm('{{ __('messages.critical_permission_remove_warning') }}');
        if (!confirmed) {
            e.preventDefault();
        }
    }
});

// Auto-hide success message
setTimeout(() => {
    const alert = document.getElementById('successAlert');
    if (alert) {
        alert.style.transition = 'opacity 0.5s';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
    }
}, 3000);
</script>
@endpush
@endsection

