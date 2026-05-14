@extends('qspark::layouts.app')

@section('title', __('messages.roles_management_page_title'))

@section('content')
<div class="p-4 sm:p-6 space-y-6">
    <h2 class="text-2xl sm:text-3xl font-extrabold">{{ __('messages.roles_management_title') }}</h2>

    @if(session('success'))
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
            {{ session('success') }}
        </div>
    @endif

    <div class="bg-white rounded-2xl shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-2xl font-bold">{{ __('messages.available_roles') }}</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.tbl_role') }}</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.tbl_users_count') }}</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.tbl_description') }}</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.tbl_actions') }}</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($roles as $role)
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                    @if($role->role === 'admin') bg-dga-primary-100 text-dga-primary-800
                                    @elseif($role->role === 'faculty') bg-green-100 text-green-800
                                    @else bg-dga-primary-100 text-dga-primary-800
                                    @endif">
                                    @if($role->role === 'admin')
                                        {{ __('messages.role_admin_with_label') }}
                                    @elseif($role->role === 'faculty')
                                        {{ __('messages.role_faculty_with_label') }}
                                    @else
                                        {{ __('messages.role_student_with_label') }}
                                    @endif
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900 number">{{ $role->users_count }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-500">
                                    @if($role->role === 'admin')
                                        {{ __('messages.role_admin_desc') }}
                                    @elseif($role->role === 'faculty')
                                        {{ __('messages.role_faculty_desc') }}
                                    @else
                                        {{ __('messages.role_student_desc') }}
                                    @endif
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3 space-x-reverse">
                                <a href="{{ route('qspark.admin.permissions.edit', ['role' => $role->role]) }}"
                                   class="inline-flex items-center px-3 py-1.5 bg-dga-primary-100 text-dga-primary-700 rounded-lg hover:bg-dga-primary-200 transition">
                                    <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                                    </svg>
                                    {{ __('messages.manage_permissions') }}
                                </a>
                                <a href="{{ route('qspark.admin.roles.edit', ['id' => $role->role]) }}"
                                   class="inline-flex items-center px-3 py-1.5 bg-dga-primary-100 text-dga-primary-700 rounded-lg hover:bg-dga-primary-200 transition">
                                    <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                                    </svg>
                                    {{ __('messages.view_users') }}
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                                {{ __('messages.no_roles') }}
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
