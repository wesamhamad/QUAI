@extends('qspark::layouts.app')

@section('title', __('messages.student_list_page_title'))

@section('content')
<div class="p-3 sm:p-6 space-y-4 sm:space-y-6">
    <h2 class="text-xl sm:text-3xl font-extrabold">{{ __('messages.student_list_heading') }}</h2>

    <div class="bg-white rounded-2xl shadow overflow-hidden">
        <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 class="text-base sm:text-xl font-bold">{{ __('messages.all_students') }}</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-3 sm:px-6 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.student_number') }}</th>
                        <th class="px-3 sm:px-6 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.student_name_label') }}</th>
                        <th class="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.student_email_label') }}</th>
                        <th class="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('messages.courses') }}</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($students as $student)
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap align-top">
                                <div class="text-xs sm:text-sm font-medium text-gray-900 number">{{ $student->student_id ?? __('messages.not_available') }}</div>
                            </td>
                            <td class="px-3 sm:px-6 py-3 sm:py-4 align-top">
                                <div class="text-xs sm:text-sm font-medium text-gray-900 break-words">{{ $student->student_name ?? __('messages.not_available') }}</div>
                                {{-- On phones, surface email + courses inline since the dedicated columns are hidden. --}}
                                <div class="md:hidden text-[11px] text-gray-500 mt-1 break-all">{{ $student->student_email ?? '' }}</div>
                                <div class="sm:hidden flex flex-wrap gap-1 mt-1">
                                    @if(isset($student->courses) && is_array($student->courses))
                                        @foreach($student->courses as $course)
                                            <span class="px-1.5 py-0.5 text-[10px] bg-dga-primary-100 text-dga-primary-800 rounded-full whitespace-nowrap">
                                                {{ $course->course_code ?? 'N/A' }}
                                            </span>
                                        @endforeach
                                    @endif
                                </div>
                            </td>
                            <td class="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap align-top">
                                <div class="text-sm text-gray-500">{{ $student->student_email ?? __('messages.not_available') }}</div>
                            </td>
                            <td class="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 align-top">
                                <div class="flex flex-wrap gap-1">
                                    @if(isset($student->courses) && is_array($student->courses))
                                        @foreach($student->courses as $course)
                                            <span class="px-2 py-1 text-xs bg-dga-primary-100 text-dga-primary-800 rounded-full whitespace-nowrap">
                                                {{ $course->course_code ?? 'N/A' }}
                                            </span>
                                        @endforeach
                                    @else
                                        <span class="text-xs text-gray-400">{{ __('messages.no_courses_short') }}</span>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-3 sm:px-6 py-4 text-center text-gray-500">
                                {{ __('messages.no_students_found') }}
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
            {{ $students->links() }}
        </div>
    </div>
</div>
@endsection