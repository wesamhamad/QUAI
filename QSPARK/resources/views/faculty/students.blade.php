@extends('layouts.app')

@section('title', 'قائمة الطلاب - Q SPARK')

@section('content')
<div class="p-6 space-y-6">
    <h2 class="text-3xl font-extrabold">قائمة الطلاب</h2>

    <div class="bg-white rounded-2xl shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-xl font-bold">جميع الطلاب</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الطالب</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المقررات</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    @forelse($students as $student)
                        <tr class="hover:bg-gray-50 transition">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900 number">{{ $student->student_id ?? 'غير متوفر' }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">{{ $student->student_name ?? 'غير متوفر' }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-500">{{ $student->student_email ?? 'غير متوفر' }}</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-wrap gap-1">
                                    @if(isset($student->courses) && is_array($student->courses))
                                        @foreach($student->courses as $course)
                                            <span class="px-2 py-1 text-xs bg-dga-primary-100 text-dga-primary-800 rounded-full whitespace-nowrap">
                                                {{ $course->course_code ?? 'N/A' }}
                                            </span>
                                        @endforeach
                                    @else
                                        <span class="text-xs text-gray-400">لا توجد مقررات</span>
                                    @endif
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                                لا يوجد طلاب
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="px-6 py-4 border-t border-gray-200">
            {{ $students->links() }}
        </div>
    </div>
</div>
@endsection