<header class="bg-white border-b border-dga-gray-200 px-6 py-4 shadow-sm flex justify-between items-center">
  <div class="flex items-center gap-2">
    <a href="#" class="hover:opacity-80 transition cursor-pointer">
      <img src="https://www.qu.edu.sa/wp-content/uploads/2025/02/qu_icon.webp" alt="logo" class="w-8 h-8">
    </a>
    <h1 class="text-xl font-bold">Q SPARK</h1>
  </div>

  <div class="flex-1 mx-12">
    <div class="bg-dga-gray-100 flex items-center rounded-full px-4 py-2 border-0">
      <input type="text" placeholder="{{ __('messages.search_placeholder') }}" 
        id="searchInput" oninput="performSearch(this.value)"
        class="bg-transparent outline-none text-sm w-full border-0 focus:ring-0">
      <a href="#" class="hover:scale-110 transition cursor-pointer">
        <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5L20.5 19l-5-5zM10 14a4 4 0 110-8 4 4 0 010 8z" />
        </svg>
      </a>
    </div>
  </div>

  <div class="flex items-center gap-4">
    @if(config('app.demo_mode') && auth()->user()?->role === 'student')
      @php($demoStudents = \App\Support\DemoStudents::all())
      @php($demoStudentId = \App\Support\DemoStudents::currentId())
      <div class="flex items-center gap-1" title="{{ app()->getLocale() == 'ar' ? 'تبديل الطالب (وضع العرض)' : 'Switch student (demo)' }}">
        <svg class="w-4 h-4 text-dga-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <select onchange="if(this.value) window.location.href=this.value"
          class="text-sm bg-dga-gray-100 border-0 rounded-full px-3 py-1.5 outline-none focus:ring-1 focus:ring-dga-primary-500 cursor-pointer">
          @foreach($demoStudents as $sid => $persona)
            <option value="{{ route('qspark.demo.switch-student', $sid) }}" @selected($sid === $demoStudentId)>
              {{ $persona['label'] }} — {{ $sid }}
            </option>
          @endforeach
        </select>
      </div>
    @endif
    {{-- Language switcher removed — demo is Arabic-only. --}}
    <div class="flex items-center gap-2">
      <img src="{{ asset('vendor/avatars/female-avatar.svg') }}" alt="profile" class="w-10 h-10 rounded-full border">
      <span class="font-medium">
        {{ app()->getLocale() == 'ar' ? ($studentArabicName ?? 'غير متوفر') : ($studentEnglishName ?? 'Not Available') }}
      </span>
      
      <!-- Logout Button -->
      <a href="{{ route('qspark.logout') }}" 
         class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition" 
         title="{{ app()->getLocale() == 'ar' ? 'تسجيل الخروج' : 'Logout' }}"
         onclick="return confirm('{{ app()->getLocale() == 'ar' ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?' }}')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
      </a>
    </div>
  </div>
</header>
