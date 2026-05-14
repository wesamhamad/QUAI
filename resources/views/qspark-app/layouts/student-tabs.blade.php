{{--
  Student top navigation tabs — replaces the icon-only side menu for students.
  Each tab links to a student page; the active tab is highlighted in DGA green.
--}}
@php
  $studentTabs = [
    ['route' => 'dashboard.student',                'label' => __('messages.nav_student_dashboard'), 'active' => ['dashboard.student']],
    ['route' => 'dashboard.student.grades',         'label' => __('messages.nav_grades'),            'active' => ['dashboard.student.grades', 'dashboard.student.blackboard.grades']],
    ['route' => 'dashboard.student.courses',        'label' => __('messages.courses'),               'active' => ['dashboard.student.courses']],
    ['route' => 'dashboard.student.recommendations','label' => __('messages.nav_recommendations'),   'active' => ['dashboard.student.recommendations*']],
    ['route' => 'dashboard.student.chat',           'label' => __('messages.nav_ai_assistant'),      'active' => ['dashboard.student.chat*']],
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
