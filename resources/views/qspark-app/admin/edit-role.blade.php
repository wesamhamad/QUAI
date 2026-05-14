@extends('qspark::layouts.app')

@section('title', __('messages.edit_role_page_title'))

@section('content')
<div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-3xl font-extrabold">
            {{ __('messages.users_with_role') }}
            <span class="px-3 py-1 inline-flex text-lg leading-5 font-semibold rounded-full
                @if($role === 'admin') bg-dga-primary-100 text-dga-primary-800
                @elseif($role === 'faculty') bg-green-100 text-green-800
                @else bg-dga-primary-100 text-dga-primary-800
                @endif">
                @if($role === 'admin')
                    {{ __('messages.role_admin') }}
                @elseif($role === 'faculty')
                    {{ __('messages.role_faculty') }}
                @else
                    {{ __('messages.role_student') }}
                @endif
            </span>
        </h2>
        <a href="{{ route('qspark.admin.roles') }}" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition">
            <i class="fas fa-arrow-right ml-2"></i> {{ __('messages.back_to_roles') }}
        </a>
    </div>

    <div class="bg-white rounded-2xl shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-2xl font-bold">{{ __('messages.users_list_title') }} ({{ $usersWithRole->total() }})</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.tbl_name') }}</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.tbl_email') }}</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.tbl_username') }}</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.tbl_registration_date') }}</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.tbl_actions') }}</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($usersWithRole as $user)
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ $user->arabic_full_name ?? $user->english_full_name ?? __('messages.not_available') }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-500">{{ $user->email ?? __('messages.not_available') }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-500">{{ $user->username ?? __('messages.not_available') }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 number">
                                {{ $user->created_at->format('Y-m-d') }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="{{ route('qspark.admin.users.edit', $user->id) }}" class="text-dga-primary-600 hover:text-dga-primary-900">{{ __('messages.edit_action') }}</a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                                {{ __('messages.no_users_with_role') }}
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="px-6 py-4 border-t border-gray-200">
            {{ $usersWithRole->links() }}
        </div>
    </div>
</div>
@endsection
