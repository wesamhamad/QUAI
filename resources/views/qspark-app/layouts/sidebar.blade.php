<aside class="w-14 sm:w-20 bg-white border-l border-dga-gray-200 rtl:border-l-0 rtl:border-r flex flex-col items-center py-3 sm:py-4 space-y-4 sm:space-y-6 shadow-sm rtl:order-last shrink-0">
  {{-- Collapse Button --}}
  <a href="javascript:void(0)"
    class="bg-white w-8 h-8 rounded-full shadow flex items-center justify-center hover:bg-gray-200 transition cursor-pointer">
    <svg class="w-4 h-4 text-gray-600 rtl:rotate-180" fill="currentColor" viewBox="0 0 24 24">
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
    </svg>
  </a>

  <div class="flex flex-col items-center space-y-6">
    @if(auth()->check())
      @if(auth()->user()->isAdmin())
        {{-- Admin Sidebar - 3 Menu Items Only --}}

        {{-- 1. Dashboard (لوحة التحكم) --}}
        <a href="{{ route('qspark.admin.dashboard') }}"
           class="{{ request()->routeIs('qspark.admin.dashboard*') ? 'bg-dga-primary-100' : '' }} p-3 rounded-full hover:scale-110 transition cursor-pointer"
           title="{{ __('messages.dashboard') }}">
          <svg class="w-5 h-5 {{ request()->routeIs('qspark.admin.dashboard*') ? 'text-dga-primary-600' : 'text-dga-gray-700' }}" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        </a>

        {{-- 2. Roles and Permissions --}}
        <a href="{{ route('qspark.admin.roles') }}"
           class="{{ request()->routeIs('qspark.admin.roles*') || request()->routeIs('qspark.admin.permissions*') ? 'bg-dga-primary-100' : '' }} p-3 rounded-full hover:scale-110 transition cursor-pointer"
           title="{{ __('messages.nav_roles_permissions') }}">
          <svg class="w-5 h-5 {{ request()->routeIs('qspark.admin.roles*') || request()->routeIs('qspark.admin.permissions*') ? 'text-dga-primary-600' : 'text-dga-gray-700' }}" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
          </svg>
        </a>

        {{-- 3. Users Control --}}
        <a href="{{ route('qspark.admin.users') }}"
           class="{{ request()->routeIs('qspark.admin.users*') ? 'bg-dga-primary-100' : '' }} p-3 rounded-full hover:scale-110 transition cursor-pointer"
           title="{{ __('messages.nav_users_management') }}">
          <svg class="w-5 h-5 {{ request()->routeIs('qspark.admin.users*') ? 'text-dga-primary-600' : 'text-dga-gray-700' }}" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        </a>

      @elseif(auth()->user()->isFaculty())
        {{-- Faculty Sidebar --}}
        <a href="{{ route('qspark.faculty.dashboard') }}"
           class="{{ request()->routeIs('qspark.faculty.dashboard') ? 'bg-dga-primary-100' : '' }} p-3 rounded-full hover:scale-110 transition cursor-pointer"
           title="{{ __('messages.dashboard') }}">
          <svg class="w-5 h-5 {{ request()->routeIs('qspark.faculty.dashboard') ? 'text-dga-primary-600' : 'text-dga-gray-700' }}" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        </a>
        <a href="{{ route('qspark.faculty.students') }}"
           class="{{ request()->routeIs('qspark.faculty.students*') ? 'bg-dga-primary-100' : '' }} p-3 rounded-full hover:scale-110 transition cursor-pointer"
           title="{{ __('messages.nav_student_list') }}">
          <svg class="w-5 h-5 {{ request()->routeIs('qspark.faculty.students*') ? 'text-dga-primary-600' : 'text-dga-gray-700' }}" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
          </svg>
        </a>
        <a href="{{ route('qspark.faculty.reports') }}"
           class="{{ request()->routeIs('qspark.faculty.reports') ? 'bg-dga-primary-100' : '' }} p-3 rounded-full hover:scale-110 transition cursor-pointer"
           title="{{ __('messages.nav_reports') }}">
          <svg class="w-5 h-5 {{ request()->routeIs('qspark.faculty.reports') ? 'text-dga-primary-600' : 'text-dga-gray-700' }}" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
        </a>

      @else
        {{-- Student Sidebar --}}
        <a href="{{ route('qspark.dashboard.student') }}"
           class="{{ request()->routeIs('qspark.dashboard.student') ? 'bg-dga-primary-100' : '' }} p-3 rounded-full hover:scale-110 transition cursor-pointer"
           title="{{ __('messages.dashboard') }}">
          <svg class="w-5 h-5 {{ request()->routeIs('qspark.dashboard.student') ? 'text-dga-primary-600' : 'text-dga-gray-700' }}" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        </a>
        <a href="{{ route('qspark.dashboard.student.courses') }}"
           class="{{ request()->routeIs('qspark.dashboard.student.courses') ? 'bg-dga-primary-100' : '' }} p-3 rounded-full hover:scale-110 transition cursor-pointer"
           title="{{ __('messages.courses') }}">
          <svg class="w-5 h-5 {{ request()->routeIs('qspark.dashboard.student.courses') ? 'text-dga-primary-600' : 'text-dga-gray-700' }}" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 6v15h18V6H3zm16 13H5V8h14v11zM9 10h2v6H9v-6zm4 0h2v6h-2v-6z" />
          </svg>
        </a>
        <a href="{{ route('qspark.calendar.index') }}"
           class="{{ request()->routeIs('qspark.calendar.index') ? 'bg-dga-primary-100' : '' }} p-3 rounded-full hover:scale-110 transition cursor-pointer"
           title="{{ __('messages.calendar') }}">
          <svg class="w-5 h-5 {{ request()->routeIs('qspark.calendar.index') ? 'text-dga-primary-600' : 'text-dga-gray-700' }}" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-1.99.9-1.99 2L3 21c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM19 21H5V8h14v13zM7 7h10v2H7V7z" />
          </svg>
        </a>
        <a href="{{ route('qspark.dashboard.student.recommendations') }}"
           class="{{ request()->routeIs('qspark.dashboard.student.recommendations') ? 'bg-dga-primary-100' : '' }} p-3 rounded-full hover:scale-110 transition cursor-pointer"
           title="{{ __('messages.recommendations_title') }}">
          <svg class="w-5 h-5 {{ request()->routeIs('qspark.dashboard.student.recommendations') ? 'text-dga-primary-600' : 'text-dga-gray-700' }}" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </a>
      @endif
    @else
      {{-- Guest Sidebar (fallback) --}}
      <a href="/" class="bg-dga-primary-100 p-3 rounded-full hover:scale-110 transition cursor-pointer">
        <svg class="w-5 h-5 text-dga-primary-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </a>
    @endif
  </div>
</aside>