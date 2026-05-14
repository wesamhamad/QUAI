@extends('layouts.app')

@section('title', __('messages.edit_user_page_title'))

@section('content')
<div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-3xl font-extrabold">{{ __('messages.edit_user_title') }}</h2>
        <a href="{{ route('admin.users') }}" class="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition">
            {{ __('messages.back_to_list') }}
        </a>
    </div>

    @if(session('success'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
            {{ session('success') }}
        </div>
    @endif

    @if($errors->any())
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            <ul class="list-disc list-inside">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="bg-white rounded-2xl shadow p-6">
        <form method="POST" action="{{ route('admin.users.update', $user->id) }}" class="space-y-6">
            @csrf
            @method('PUT')

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Arabic Full Name -->
                <div>
                    <label for="arabic_full_name" class="block text-sm font-medium text-gray-700 mb-2">
                        {{ __('messages.arabic_full_name') }}
                    </label>
                    <input type="text" 
                           name="arabic_full_name" 
                           id="arabic_full_name" 
                           value="{{ old('arabic_full_name', $user->arabic_full_name) }}"
                           class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

                <!-- English Full Name -->
                <div>
                    <label for="english_full_name" class="block text-sm font-medium text-gray-700 mb-2">
                        {{ __('messages.english_full_name') }}
                    </label>
                    <input type="text" 
                           name="english_full_name" 
                           id="english_full_name" 
                           value="{{ old('english_full_name', $user->english_full_name) }}"
                           class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

                <!-- Email -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        {{ __('messages.email') }} <span class="text-red-500">*</span>
                    </label>
                    <input type="email" 
                           name="email" 
                           id="email" 
                           value="{{ old('email', $user->email) }}"
                           required
                           class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                </div>

                <!-- Username -->
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                        {{ __('messages.username_label') }}
                    </label>
                    <input type="text" 
                           name="username" 
                           id="username" 
                           value="{{ old('username', $user->username) }}"
                           readonly
                           class="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed">
                    <p class="text-xs text-gray-500 mt-1">{{ __('messages.username_readonly_note') }}</p>
                </div>

                <!-- Role -->
                <div>
                    <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
                        {{ __('messages.role') }} <span class="text-red-500">*</span>
                    </label>
                    <select name="role" 
                            id="role" 
                            required
                            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="student" {{ old('role', $user->role) === 'student' ? 'selected' : '' }}>{{ __('messages.role_student') }}</option>
                        <option value="faculty" {{ old('role', $user->role) === 'faculty' ? 'selected' : '' }}>{{ __('messages.role_faculty') }}</option>
                        <option value="admin" {{ old('role', $user->role) === 'admin' ? 'selected' : '' }}>{{ __('messages.role_admin') }}</option>
                    </select>
                </div>

                <!-- UUID (Read-only) -->
                <div>
                    <label for="uuid" class="block text-sm font-medium text-gray-700 mb-2">
                        UUID
                    </label>
                    <input type="text" 
                           name="uuid" 
                           id="uuid" 
                           value="{{ $user->uuid }}"
                           readonly
                           class="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed">
                    <p class="text-xs text-gray-500 mt-1">{{ __('messages.uuid_unique_id_note') }}</p>
                </div>
            </div>

            <!-- User Info -->
            <div class="bg-gray-50 rounded-xl p-4">
                <h3 class="font-bold text-lg mb-3">{{ __('messages.additional_info') }}</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <span class="text-gray-600">{{ __('messages.registration_date') }}</span>
                        <span class="font-semibold number">{{ $user->created_at->format('Y-m-d H:i') }}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">{{ __('messages.last_updated') }}</span>
                        <span class="font-semibold number">{{ $user->updated_at->format('Y-m-d H:i') }}</span>
                    </div>
                    <div>
                        <span class="text-gray-600">{{ __('messages.user_id_label') }}</span>
                        <span class="font-semibold number">{{ $user->id }}</span>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4">
                <a href="{{ route('admin.users') }}"
                   class="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600 transition">
                    {{ __('messages.cancel') }}
                </a>
                <button type="submit"
                        class="bg-dga-primary-600 text-white px-6 py-2 rounded-xl hover:bg-dga-primary-700 transition">
                    {{ __('messages.save_changes') }}
                </button>
            </div>
        </form>
    </div>
</div>
@endsection

