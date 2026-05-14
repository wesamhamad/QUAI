@extends('layouts.app')

@section('title', __('messages.permissions_page_title'))

@section('content')
<div class="p-6 space-y-6">
    <h2 class="text-3xl font-extrabold">{{ __('messages.permissions_management') }}</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @foreach($permissions as $role => $rolePermissions)
            <div class="bg-white rounded-2xl shadow overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200
                    @if($role === 'admin') bg-dga-primary-50
                    @elseif($role === 'faculty') bg-green-50
                    @else bg-dga-primary-50
                    @endif">
                    <h3 class="text-xl font-bold
                        @if($role === 'admin') text-dga-primary-800
                        @elseif($role === 'faculty') text-green-800
                        @else text-dga-primary-800
                        @endif">
                        @if($role === 'admin')
                            <i class="fas fa-user-shield ml-2"></i> {{ __('messages.role_admin') }}
                        @elseif($role === 'faculty')
                            <i class="fas fa-chalkboard-teacher ml-2"></i> {{ __('messages.role_faculty') }}
                        @else
                            <i class="fas fa-user-graduate ml-2"></i> {{ __('messages.role_student') }}
                        @endif
                    </h3>
                </div>

                <div class="p-6">
                    <ul class="space-y-3">
                        @foreach($rolePermissions as $permission => $enabled)
                            <li class="flex items-center justify-between">
                                <span class="text-sm text-gray-700">
                                    @switch($permission)
                                        @case('access_admin_dashboard')
                                            {{ __('messages.perm_access_admin_dashboard') }}
                                            @break
                                        @case('access_faculty_dashboard')
                                            {{ __('messages.perm_access_faculty_dashboard') }}
                                            @break
                                        @case('access_student_dashboard')
                                            {{ __('messages.perm_access_student_dashboard') }}
                                            @break
                                        @case('manage_users')
                                            {{ __('messages.perm_manage_users') }}
                                            @break
                                        @case('manage_roles')
                                            {{ __('messages.perm_manage_roles') }}
                                            @break
                                        @case('manage_courses')
                                            {{ __('messages.perm_manage_courses') }}
                                            @break
                                        @case('view_students')
                                            {{ __('messages.perm_view_students') }}
                                            @break
                                        @case('generate_questions')
                                            {{ __('messages.perm_generate_questions') }}
                                            @break
                                        @case('view_analytics')
                                            {{ __('messages.perm_view_analytics') }}
                                            @break
                                        @case('export_reports')
                                            {{ __('messages.perm_export_reports') }}
                                            @break
                                        @case('play_games')
                                            {{ __('messages.perm_play_games') }}
                                            @break
                                        @case('view_progress')
                                            {{ __('messages.perm_view_progress') }}
                                            @break
                                        @case('take_quizzes')
                                            {{ __('messages.perm_take_quizzes') }}
                                            @break
                                        @default
                                            {{ $permission }}
                                    @endswitch
                                </span>
                                @if($enabled)
                                    <span class="text-green-500"><i class="fas fa-check-circle"></i></span>
                                @else
                                    <span class="text-red-500"><i class="fas fa-times-circle"></i></span>
                                @endif
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        @endforeach
    </div>

    <div class="bg-dga-primary-50 border border-dga-primary-200 rounded-xl p-4 mt-6">
        <div class="flex items-start">
            <i class="fas fa-info-circle text-dga-primary-500 mt-1 ml-3"></i>
            <div>
                <h4 class="font-bold text-dga-primary-800">{{ __('messages.note_label') }}</h4>
                <p class="text-sm text-dga-primary-700">
                    {{ __('messages.permissions_note') }}
                </p>
            </div>
        </div>
    </div>
</div>
@endsection
