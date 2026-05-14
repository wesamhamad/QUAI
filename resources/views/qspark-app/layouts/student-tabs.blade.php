{{--
  Student top navigation tabs — replaces the icon-only side menu for students.
  Each tab links to a student page; the active tab is highlighted in DGA green.
--}}
@php
  $studentTabs = [
    ['route' => 'qspark.dashboard.student',                'label' => __('messages.nav_student_dashboard'), 'active' => ['qspark.dashboard.student']],
    ['route' => 'qspark.dashboard.student.grades',         'label' => __('messages.nav_grades'),            'active' => ['qspark.dashboard.student.grades', 'qspark.dashboard.student.blackboard.grades']],
    ['route' => 'qspark.dashboard.student.courses',        'label' => __('messages.courses'),               'active' => ['qspark.dashboard.student.courses']],
    ['route' => 'qspark.dashboard.student.recommendations','label' => __('messages.nav_recommendations'),   'active' => ['qspark.dashboard.student.recommendations*']],
    ['route' => 'qspark.dashboard.student.chat',           'label' => __('messages.nav_ai_assistant'),      'active' => ['qspark.dashboard.student.chat*']],
  ];
@endphp

<nav class="bg-white border-b border-dga-gray-200 px-6 shadow-sm">
  <div class="flex items-center gap-2 overflow-x-auto py-3">
    @foreach($studentTabs as $tab)
      @php($isActive = request()->routeIs(...$tab['active']))
      <a href="{{ route($tab['route']) }}"
         @class([
           'whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors',
           'bg-dga-primary-500 text-white shadow-sm' => $isActive,
           'text-dga-gray-600 hover:bg-dga-primary-50 hover:text-dga-primary-700' => ! $isActive,
         ])>
        {{ $tab['label'] }}
      </a>
    @endforeach
  </div>
</nav>
