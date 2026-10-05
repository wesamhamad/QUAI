@extends('qspark::layouts.app')

@section('title', $code . ' - ' . __('messages.course_content'))

@php
    // Demo fallback: when no Blackboard files are returned (no live token in
    // the /qspark-demo iframe), render a fixed set of dummy course materials
    // so the page always shows content + a working "Take Quiz" entry point.
    $useDummyFiles = empty($files);
    $demoQuizUrl   = url('/qspark/react-game-test');
    if ($useDummyFiles) {
        $__isEn = app()->getLocale() === 'en';
        $files = $__isEn ? [
            ['contentTitle' => 'Course introduction',           'fileName' => 'lecture-01-intro.pdf',        'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
            ['contentTitle' => 'Lecture 1 — Concepts',          'fileName' => 'lecture-02-concepts.pdf',     'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
            ['contentTitle' => 'Lecture 2 — Applications',      'fileName' => 'lecture-03-applications.pdf', 'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
            ['contentTitle' => 'Chapter 1 exercises',           'fileName' => 'exercises-ch1.pdf',           'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
            ['contentTitle' => 'Case study',                    'fileName' => 'case-study.pdf',              'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
            ['contentTitle' => 'Midterm exam review',           'fileName' => 'midterm-review.pdf',          'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
        ] : [
            ['contentTitle' => 'مقدمة المقرر',                  'fileName' => 'lecture-01-intro.pdf',        'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
            ['contentTitle' => 'المحاضرة الأولى — المفاهيم',    'fileName' => 'lecture-02-concepts.pdf',     'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
            ['contentTitle' => 'المحاضرة الثانية — التطبيقات',  'fileName' => 'lecture-03-applications.pdf', 'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
            ['contentTitle' => 'تمارين الفصل الأول',            'fileName' => 'exercises-ch1.pdf',           'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
            ['contentTitle' => 'حالة دراسية',                   'fileName' => 'case-study.pdf',              'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
            ['contentTitle' => 'مراجعة الاختبار النصفي',        'fileName' => 'midterm-review.pdf',          'demoQuizUrl' => $demoQuizUrl, 'downloadUrl' => '#'],
        ];
    }
@endphp

@section('content')
<div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
  <div class="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-dga-primary-500 to-dga-primary-600 text-white grid place-items-center shadow-lg shadow-indigo-500/20">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>
        </div>
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800">
          {{ $code }} <span class="mx-2 text-dga-primary-500/60">/</span>
          <span data-translate="course_content" class="bg-gradient-to-r from-dga-primary-600 to-dga-primary-600 bg-clip-text text-transparent">{{ __('messages.course_content') }}</span>
        </h2>
      </div>

      <div class="flex flex-wrap gap-3">
        <a href="{{ $useDummyFiles ? $demoQuizUrl : route('qspark.courses.quiz', $code) }}"
           {{ $useDummyFiles ? 'target=_top' : '' }}
           class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all duration-200 {{ count($files) > 0 ? 'bg-gradient-to-r from-dga-primary-500 to-dga-primary-600 hover:to-dga-primary-700 hover:shadow-lg hover:-translate-y-0.5 ring-1 ring-indigo-500/20' : 'bg-slate-300 cursor-not-allowed disabled-link' }}"
           {{ count($files) == 0 ? 'data-disabled=true' : '' }}>
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>
          <span>{{ __('messages.quiz') }}</span>
        </a>

        @if(!empty($blackboardCourseId))
          <button id="downloadAllBtn"
                  data-download-all="{{ $blackboardCourseId }}"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all duration-200 {{ count($files) > 0 ? 'bg-gradient-to-r from-dga-primary-500 to-dga-primary-600 hover:to-dga-primary-700 hover:shadow-lg hover:-translate-y-0.5 ring-1 ring-emerald-500/20' : 'bg-slate-300 cursor-not-allowed' }} disabled:opacity-60 disabled:cursor-not-allowed"
                  {{ count($files) == 0 ? 'disabled data-disabled=true' : '' }}>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5,20H19V18H5V20M19,9H15V3H9V9H5L12,16L19,9Z"/></svg>
            <span>{{ __('messages.download_all') }}</span>
          </button>
        @else
          <a href="{{ count($files) > 0 ? route('qspark.courses.downloadAll', $code) : '#' }}"
             class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all duration-200 {{ count($files) > 0 ? 'bg-gradient-to-r from-dga-primary-500 to-dga-primary-600 hover:to-dga-primary-700 hover:shadow-lg hover:-translate-y-0.5 ring-1 ring-emerald-500/20' : 'bg-slate-300 cursor-not-allowed disabled-link' }}"
             {{ count($files) == 0 ? 'data-disabled=true' : '' }}>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5,20H19V18H5V20M19,9H15V3H9V9H5L12,16L19,9Z"/></svg>
            <span>{{ __('messages.download_all') }}</span>
          </a>
        @endif
      </div>
    </div>

    <div id="loadingState" class="{{ $useDummyFiles ? 'hidden ' : '' }}flex flex-col items-center justify-center py-20">
      <div class="relative">
        <div class="w-16 h-16 border-4 border-dga-primary-200 rounded-full animate-pulse"></div>
        <div class="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p class="mt-6 text-slate-600 font-medium animate-pulse">{{ __('messages.loading_files') }}</p>
      <div class="mt-4 flex gap-1">
        <div class="w-2 h-2 bg-dga-primary-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
        <div class="w-2 h-2 bg-dga-primary-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
        <div class="w-2 h-2 bg-dga-primary-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
      </div>
    </div>

    <div id="filesGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 {{ $useDummyFiles ? '' : 'hidden' }}">
      @forelse($files as $index => $file)
        @php
          $cardColors = [
            // [card border tint, icon/download gradient] — cycle through SA green shades
            ['bg-white/70 backdrop-blur-xl border-dga-primary-200/60', 'from-dga-primary-400 to-dga-primary-600'],
            ['bg-white/70 backdrop-blur-xl border-dga-primary-300/50', 'from-dga-primary-600 to-dga-primary-800'],
            ['bg-white/70 backdrop-blur-xl border-dga-primary-200/60', 'from-dga-primary-500 to-dga-primary-700'],
            ['bg-white/70 backdrop-blur-xl border-dga-primary-300/50', 'from-dga-primary-700 to-dga-primary-900'],
          ];
          $colors = $cardColors[$index % count($cardColors)];
          $placeholderTitles = ['ultraDocumentBody', 'Untitled', 'Unknown Content'];
          $rawTitle = trim((string) ($file['contentTitle'] ?? ''));
          $fileName = trim((string) ($file['fileName'] ?? ''));
          $titleIsMeaningful = $rawTitle !== '' && !in_array($rawTitle, $placeholderTitles, true);
          $displayName = $titleIsMeaningful ? $rawTitle : ($fileName ?: 'Unknown File');
          $showSubtitle = $fileName !== '' && $fileName !== $displayName;
        @endphp

        <div class="group rounded-2xl p-5 border {{ $colors[0] }} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-start gap-4">
            <div class="shrink-0 p-3 rounded-xl text-white shadow-lg bg-gradient-to-br {{ $colors[1] }}">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>
            </div>
            <div class="min-w-0 w-full">
              <div class="flex items-center justify-between gap-3">
                <h3 class="font-semibold text-base text-slate-900 truncate" title="{{ $displayName }}">{{ $displayName }}</h3>
                <span class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/></svg>
                  {{ __('messages.recently_added') }}
                </span>
              </div>
              @if($showSubtitle)
                <p class="mt-1 text-sm text-slate-500 truncate">{{ $fileName }}</p>
              @endif
            </div>
          </div>

          <div class="mt-5 flex items-center gap-2">
            @if(isset($file['demoQuizUrl']))
              <a href="{{ $file['demoQuizUrl'] }}" target="_top"
                 class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3,3V21H21V3M19,19H5V5H19M17,7H7V9H17M17,11H7V13H17M13,15H7V17H13"/></svg>
                <span>{{ __('messages.take_quiz') }}</span>
              </a>
            @elseif(isset($file['generateQuizUrl']))
              <button
                class="quiz-btn flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-dga-primary-500 to-dga-primary-600 hover:to-dga-primary-700 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                data-quiz-url="{{ $file['generateQuizUrl'] }}"
                data-course-code="{{ $code }}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3,3V21H21V3M19,19H5V5H19M17,7H7V9H17M17,11H7V13H17M13,15H7V17H13"/></svg>
                <span>{{ __('messages.quiz') }}</span>
              </button>

              {{-- Export Button - only shown if quiz URL exists --}}
              <button
                class="export-btn inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white bg-dga-primary-700 hover:bg-dga-primary-800 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                data-quiz-url="{{ $file['generateQuizUrl'] }}"
                data-course-code="{{ $code }}"
                title="{{ __('messages.export_quiz') }}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z"/></svg>
                <span class="sr-only">{{ __('messages.export_short') }}</span>
              </button>
            @endif

            @if(isset($file['downloadUrl']))
              <button
                class="download-btn flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r {{ $colors[1] }} hover:brightness-110 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                data-download-url="{{ $file['downloadUrl'] }}"
                data-file-name="{{ $file['fileName'] }}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5,20H19V18H5V20M19,9H15V3H9V9H5L12,16L19,9Z"/></svg>
                <span class="sr-only">{{ __('messages.download') }}</span>
              </button>
            @endif
          </div>
        </div>
      @empty
        <div class="col-span-full">
          <div class="text-center py-20 bg-white/60 rounded-2xl border border-slate-200">
            <div class="mx-auto w-20 h-20 bg-slate-100 rounded-full grid place-items-center mb-4">
              <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ __('messages.no_files') }}</h3>
            <p class="text-slate-500">{{ __('messages.no_files_description') }}</p>
          </div>
        </div>
      @endforelse
    </div>

    {{-- Pagination --}}
    @if(isset($totalPages) && $totalPages > 1)
    <div class="flex items-center justify-center gap-2 mt-8">
      {{-- Previous Button --}}
      @if($currentPage > 1)
        <a href="?page={{ $currentPage - 1 }}"
           class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
          <svg class="w-4 h-4 rtl:rotate-180" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          <span>{{ __('messages.previous') }}</span>
        </a>
      @endif

      {{-- Page Numbers --}}
      <div class="flex items-center gap-1">
        @for($i = 1; $i <= $totalPages; $i++)
          @if($i == $currentPage)
            <span class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-dga-primary-500 to-dga-primary-600">
              {{ $i }}
            </span>
          @elseif($i == 1 || $i == $totalPages || abs($i - $currentPage) <= 2)
            <a href="?page={{ $i }}"
               class="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
              {{ $i }}
            </a>
          @elseif(abs($i - $currentPage) == 3)
            <span class="text-slate-400">...</span>
          @endif
        @endfor
      </div>

      {{-- Next Button --}}
      @if($currentPage < $totalPages)
        <a href="?page={{ $currentPage + 1 }}"
           class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200">
          <span>{{ __('messages.next') }}</span>
          <svg class="w-4 h-4 rtl:rotate-180" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
        </a>
      @endif
    </div>

    <p class="text-center text-sm text-slate-500 mt-4">
      {{ __('messages.page') }} {{ $currentPage }} {{ __('messages.of') }} {{ $totalPages }}
    </p>
    @endif
  </div>
</div>

<div id="successToast" class="fixed top-4 right-4 bg-dga-primary-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50">
  <div class="flex items-center gap-2">
    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
    <span id="toastMessage"></span>
  </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('vendor/sweetalert2/sweetalert2.all.min.js') }}"></script>
<script>
(() => {
  'use strict';

  const serverToken = @json(session('qspark_token'));
  const token = serverToken || localStorage.getItem('auth_token') || '';

  function showToast(message, type='success') {
    let bar = document.getElementById('successToast');
    let msg = document.getElementById('toastMessage');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'successToast';
      bar.className = 'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 z-50 text-white';
      bar.innerHTML = '<span id="toastMessage"></span>';
      document.body.appendChild(bar);
      msg = document.getElementById('toastMessage');
    }
    bar.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 text-white ${type==='success'?'bg-dga-primary-500':'bg-rose-500'}`;
    msg.textContent = message;
    bar.classList.remove('translate-x-full');
    setTimeout(() => bar.classList.add('translate-x-full'), 3000);
  }

  function isSameOrigin(url) {
    try { return new URL(url, window.location.href).origin === window.location.origin; }
    catch { return false; }
  }

  async function singleDownload(btn) {
    if (!btn || btn.disabled) return;

    const url = btn.dataset.downloadUrl;
    const name = btn.dataset.fileName || 'file';
    const original = btn.innerHTML;

    console.log('=== SINGLE FILE DOWNLOAD START ===');
    console.log('Download URL:', url);
    console.log('File name:', name);

    // Cross-origin URLs (e.g. signed Blackboard bbcswebdav links) cannot be
    // fetched directly due to CORS, so navigate via a hidden anchor and let
    // the browser handle the download natively.
    if (!isSameOrigin(url)) {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      showToast(@json(__('messages.download_success')), 'success');
      return;
    }

    if (!token) { showToast(@json(__('messages.auth_token_not_found')), 'error'); return; }

    try {
      btn.disabled = true;
      btn.innerHTML = '<div class="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></div>';

      console.log('Making GET request to download endpoint...');
      const res = await fetch(url, {
        credentials: 'include',  // Include session cookies for auth
        headers: { 'Accept': 'application/octet-stream' }
      });

      console.log('Download response status:', res.status);
      console.log('Download response headers:', Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        console.error('Download failed with status:', res.status);
        const errorText = await res.text().catch(() => 'Unable to read error response');
        console.error('Download error response body:', errorText);
        throw new Error(res.status);
      }

      const blob = await res.blob();
      console.log('Downloaded blob size:', blob.size, 'bytes');
      console.log('Downloaded blob type:', blob.type);

      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href; a.download = name;
      document.body.appendChild(a); a.click();
      URL.revokeObjectURL(href); a.remove();

      console.log('File download triggered successfully');
      showToast(@json(__('messages.download_success')), 'success');
    } catch (e) {
      console.error('=== DOWNLOAD ERROR ===');
      console.error('Download error details:', e);
      console.error('Error message:', e.message);
      console.error('Error stack:', e.stack);
      showToast(@json(__('messages.download_error')), 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
      console.log('=== SINGLE FILE DOWNLOAD END ===');
    }
  }

  function parseQuestions(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'object') {
      if (Array.isArray(raw.questions)) return raw.questions;
      if (raw.data && Array.isArray(raw.data.questions)) return raw.data.questions;
      if (typeof raw.message === 'string') return parseQuestions(raw.message);
    }
    const text = String(raw);
    const codeBlocks = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (codeBlocks?.[1]) {
      try { const p = JSON.parse(codeBlocks[1]); if (Array.isArray(p)) return p; } catch {}
    }
    const arrMatch = text.match(/\[[\s\S]*\]/);
    if (arrMatch) {
      try { const p = JSON.parse(arrMatch[0]); if (Array.isArray(p)) return p; } catch {}
    }
    return [];
  }

  async function startQuiz(btn) {
    if (!btn || btn.disabled) return;

    // Get data attributes - try multiple methods
    let quizUrl = btn.getAttribute('data-quiz-url') || btn.dataset.quizUrl;
    let courseCode = btn.getAttribute('data-course-code') || btn.dataset.courseCode;
    const original = btn.innerHTML;

    console.log('=== QUIZ GENERATION START (SERVER-SIDE) ===');
    console.log('Button element:', btn);
    console.log('Button outerHTML:', btn.outerHTML);
    console.log('All data attributes:', btn.dataset);
    console.log('Quiz URL (raw):', quizUrl);
    console.log('Course Code (raw):', courseCode);

    // Try to decode if URL-encoded
    if (quizUrl && quizUrl.includes('%')) {
      try {
        quizUrl = decodeURIComponent(quizUrl);
        console.log('Quiz URL (decoded):', quizUrl);
      } catch (e) {
        console.log('Could not decode quiz URL');
      }
    }

    if (!quizUrl || !courseCode) {
      console.error('Missing required data attributes on button');
      console.error('Button HTML:', btn.outerHTML);
      Swal.fire({
        icon: 'error',
        title: @json(__('messages.error')),
        text: 'Missing required parameters: quiz_url and course_code',
        confirmButtonColor: '#25935F'
      });
      return;
    }

    try {
      btn.disabled = true;
      btn.innerHTML = '<div class="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin mr-2"></div>{{ __("messages.preparing") }}...';

      // Step-by-step progress so the user sees forward motion while the
      // backend (download → upload → OpenAI) blocks. Steps advance on a
      // realistic timeline; jumpToStep(3) is called the moment we get the
      // success response and the redirect fires.
      const STEP_LABELS = [
        @json(__('messages.quiz_step_pull')),
        @json(__('messages.quiz_step_extract')),
        @json(__('messages.quiz_step_generate')),
        @json(__('messages.quiz_step_ready')),
      ];
      const STEP_COUNTER_LABEL = @json(__('messages.quiz_step_counter'));
      const STEP_COUNTER_OF = @json(__('messages.quiz_step_of'));

      const renderStepHtml = (active) => {
        const total = STEP_LABELS.length;
        const visible = Math.min(active, total - 1);
        const percent = Math.min(100, Math.max(0, Math.round(((active >= total ? total : active + 0.5) / total) * 100)));
        const counterText = active >= total
          ? `${STEP_COUNTER_LABEL} ${total} ${STEP_COUNTER_OF} ${total}`
          : `${STEP_COUNTER_LABEL} ${visible + 1} ${STEP_COUNTER_OF} ${total}`;

        const stepRows = STEP_LABELS.map((label, i) => {
          const state = i < active ? 'done' : (i === active ? 'now' : 'todo');
          const isLast = i === total - 1;

          let circle;
          if (state === 'done') {
            circle = `<div style="
              width:36px;height:36px;border-radius:9999px;
              background:linear-gradient(135deg,#17B26A,#079455);
              color:#fff;display:grid;place-items:center;
              box-shadow:0 6px 14px -4px rgba(37, 147, 95,.45);
              flex-shrink:0;
            ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>`;
          } else if (state === 'now') {
            circle = `<div style="
              width:36px;height:36px;border-radius:9999px;
              background:linear-gradient(135deg,#25935F,#25935F);
              display:grid;place-items:center;flex-shrink:0;
              animation:qsprk-pulse 1.8s ease-in-out infinite;
            ">
              <div style="
                width:18px;height:18px;border-radius:9999px;
                border:2.5px solid rgba(255,255,255,.95);border-top-color:transparent;
                animation:qsprk-spin 0.85s linear infinite;
              "></div>
            </div>`;
          } else {
            circle = `<div style="
              width:36px;height:36px;border-radius:9999px;
              background:#F9FAFB;border:2px solid #E5E7EB;
              color:#9DA4AE;display:grid;place-items:center;
              font-size:13px;font-weight:700;flex-shrink:0;
            ">${i + 1}</div>`;
          }

          const labelColor = state === 'todo' ? '#9DA4AE' : (state === 'done' ? '#1F2A37' : '#166A45');
          const labelWeight = state === 'now' ? '700' : (state === 'todo' ? '500' : '600');
          const rowBg = state === 'now'
            ? 'background:linear-gradient(135deg,rgba(37, 147, 95,.07),rgba(37, 147, 95,.07));border:1px solid rgba(37, 147, 95,.14);'
            : 'border:1px solid transparent;';

          const connector = !isLast ? `<div style="
            width:2px;height:18px;margin-inline-start:27px;
            background:${state === 'done' ? 'linear-gradient(180deg,#17B26A,#ABEFC6)' : '#E5E7EB'};
            border-radius:9999px;transition:background 400ms ease;
          "></div>` : '';

          return `
            <div style="display:flex;align-items:center;gap:14px;padding:10px 12px;border-radius:12px;${rowBg}transition:all 300ms ease">
              ${circle}
              <div style="color:${labelColor};font-weight:${labelWeight};font-size:14px;line-height:1.45;flex:1">${label}</div>
            </div>
            ${connector}
          `;
        }).join('');

        return `
          <div style="text-align:start;direction:rtl;font-family:inherit">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
              <span style="font-size:12px;font-weight:600;color:#25935F;letter-spacing:.02em">${counterText}</span>
              <span style="font-size:12px;font-weight:700;color:#166A45;font-variant-numeric:tabular-nums">${percent}%</span>
            </div>
            <div style="height:6px;background:#F3FCF6;border-radius:9999px;overflow:hidden;display:flex;margin-bottom:20px">
              <div style="height:100%;width:${percent}%;background:linear-gradient(90deg,#25935F,#25935F,#54C08A);border-radius:9999px;transition:width 500ms cubic-bezier(.4,0,.2,1);box-shadow:0 2px 6px -1px rgba(37, 147, 95,.4)"></div>
            </div>
            <div style="display:flex;flex-direction:column;gap:2px">
              ${stepRows}
            </div>
          </div>
          <style>
            @keyframes qsprk-spin{to{transform:rotate(360deg)}}
            @keyframes qsprk-pulse{
              0%,100%{box-shadow:0 0 0 0 rgba(37, 147, 95,.35),0 6px 14px -4px rgba(37, 147, 95,.4)}
              50%{box-shadow:0 0 0 8px rgba(37, 147, 95,0),0 6px 14px -4px rgba(37, 147, 95,.4)}
            }
          </style>
        `;
      };

      let currentStep = 0;
      const updateStep = (s) => {
        currentStep = s;
        Swal.update({ html: renderStepHtml(s) });
      };

      Swal.fire({
        title: @json(__('messages.preparing_quiz')),
        html: renderStepHtml(0),
        allowOutsideClick: false,
        showConfirmButton: false,
        width: '460px',
        padding: '1.5rem',
        customClass: { popup: 'qsprk-quiz-progress' },
      });

      // Advance through the visible steps on a realistic timeline.
      // 0 → 1 (extract) at 4s, 1 → 2 (generate) at 12s. Step 3 is set
      // explicitly when the response arrives.
      const stepTimers = [
        setTimeout(() => { if (currentStep < 1) updateStep(1); }, 4000),
        setTimeout(() => { if (currentStep < 2) updateStep(2); }, 12000),
      ];
      const clearStepTimers = () => stepTimers.forEach(clearTimeout);

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      console.log('CSRF Token found:', !!csrfToken);
      console.log('CSRF Token value:', csrfToken ? csrfToken.substring(0, 10) + '...' : 'null');

      const requestData = {
        quiz_url: quizUrl,
        course_code: courseCode
      };

      console.log('Making POST request to server-side quiz generation controller...');
      console.log('Request data:', requestData);

      const response = await fetch('/quiz/generate-from-file', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      console.log('Server response status:', response.status);
      console.log('Server response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error('Server-side quiz generation failed with status:', response.status);
        console.error('Response status text:', response.statusText);

        let errorData;
        try {
          const responseText = await response.text();
          console.error('Raw error response:', responseText);
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = { message: `Server error: ${response.status} ${response.statusText}` };
        }

        console.error('Parsed error data:', errorData);
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server success response:', data);

      if (!data.success) {
        console.error('Quiz generation was not successful:', data);
        throw new Error('quiz_unavailable');
      }

      console.log(`Quiz generated successfully! ${data.questions_count} questions created.`);
      console.log('Redirecting to quiz page:', data.redirect_url);

      clearStepTimers();
      updateStep(3);
      // Brief pause so the user sees the "ready" tick before redirecting
      setTimeout(() => {
        Swal.close();
        window.location.href = data.redirect_url;
      }, 350);

    } catch (e) {
      console.error('=== QUIZ GENERATION ERROR ===');
      console.error('Quiz error details:', e);
      console.error('Error message:', e.message);
      console.error('Error stack:', e.stack);
      clearStepTimers();
      Swal.close();
      Swal.fire({
        icon: 'info',
        title: @json(__('messages.quiz_generator_maintenance')),
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#25935F',
        allowOutsideClick: true
      });
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
      console.log('=== QUIZ GENERATION END ===');
    }
  }

  async function downloadAll(btn) {
    if (!btn || btn.disabled) return;
    const courseId = @json($code);
    const blackboardCourseId = btn.dataset.downloadAll;
    const original = btn.innerHTML;

    try {
      btn.disabled = true;
      btn.innerHTML = '<div class="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin mr-2"></div>Preparing...';
      const res = await fetch(`/courses/${encodeURIComponent(courseId)}/download-all-api`);
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href; a.download = `${blackboardCourseId || courseId}_materials.zip`;
      document.body.appendChild(a); a.click();
      URL.revokeObjectURL(href); a.remove();
      showToast(@json(__('messages.download_success')), 'success');
    } catch (e) {
      console.error('Download all error:', e);
      showToast(@json(__('messages.download_error')), 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }

  // Extract attachment key from quiz URL
  function extractAttachmentKey(quizUrl) {
    const match = quizUrl.match(/courses\/([^\/]+)\/contents\/([^\/]+)\/attachments\/([^\/]+)/);
    if (match) {
      return `${match[1]}_${match[2]}_${match[3]}`;
    }
    return null;
  }

  async function exportQuiz(btn) {
    if (!btn || btn.disabled) return;

    const quizUrl = btn.getAttribute('data-quiz-url') || btn.dataset.quizUrl;
    const courseCode = btn.getAttribute('data-course-code') || btn.dataset.courseCode;
    const original = btn.innerHTML;

    if (!quizUrl || !courseCode) {
      showToast(@json(__('messages.missing_info')), 'error');
      return;
    }

    const attachmentKey = extractAttachmentKey(quizUrl);
    if (!attachmentKey) {
      showToast(@json(__('messages.invalid_link')), 'error');
      return;
    }

    try {
      btn.disabled = true;
      btn.innerHTML = '<div class="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin"></div>';

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const response = await fetch('/quiz/export-for-student', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json, application/msword'
        },
        body: JSON.stringify({
          course_code: courseCode,
          attachment_key: attachmentKey
        })
      });

      // Check if response is JSON (error) or file (success)
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        // It's an error response
        const data = await response.json();
        if (data.already_exported) {
          Swal.fire({
            icon: 'warning',
            title: @json(__('messages.already_exported')),
            text: data.message,
            confirmButtonColor: '#25935F'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: @json(__('messages.error')),
            text: data.message || @json(__('messages.export_error_occurred')),
            confirmButtonColor: '#25935F'
          });
        }
        return;
      }

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // It's a file download
      const blob = await response.blob();
      const disposition = response.headers.get('content-disposition');
      let fileName = `quiz_${courseCode}_${Date.now()}.doc`;
      if (disposition) {
        const match = disposition.match(/filename="(.+)"/);
        if (match) fileName = match[1];
      }

      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(href);
      a.remove();

      // Mark button as exported
      btn.classList.remove('from-dga-primary-500', 'to-dga-primary-600', 'hover:to-orange-700');
      btn.classList.add('from-gray-400', 'to-gray-500', 'cursor-not-allowed');
      btn.setAttribute('data-exported', 'true');
      btn.title = @json(__('messages.already_exported'));

      showToast(@json(__('messages.export_quiz_success')), 'success');

    } catch (e) {
      console.error('Export error:', e);
      showToast(@json(__('messages.export_error_occurred')), 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }

  document.addEventListener('click', (e) => {
    const disabledEl = e.target.closest('[data-disabled="true"], .disabled-link, button[disabled]');
    if (disabledEl) {
      e.preventDefault();
      showToast(@json(__('messages.no_files_available_action')), 'error');
      return;
    }

    const dl = e.target.closest('.download-btn');
    if (dl) { e.preventDefault(); singleDownload(dl); return; }

    const quiz = e.target.closest('.quiz-btn');
    if (quiz) { e.preventDefault(); startQuiz(quiz); return; }

    const exp = e.target.closest('.export-btn');
    if (exp) {
      e.preventDefault();
      if (exp.getAttribute('data-exported') === 'true') {
        Swal.fire({
          icon: 'warning',
          title: @json(__('messages.already_exported')),
          text: @json(__('messages.already_exported_desc')),
          confirmButtonColor: '#25935F'
        });
        return;
      }
      exportQuiz(exp);
      return;
    }

    const all = e.target.closest('#downloadAllBtn');
    if (all && all.dataset.downloadAll) { e.preventDefault(); downloadAll(all); return; }
  });

  document.querySelectorAll('.cursor-not-allowed,[data-disabled="true"]').forEach(el => {
    el.title = @json(__('messages.no_files_available'));
  });

  // AJAX loading - always load files via AJAX for instant page display
  // Skipped in dummy/demo mode so the server-rendered fallback content stays.
  @if(!empty($externalId) && !$useDummyFiles)
  (function loadFilesAjax() {
    const loadingEl = document.getElementById('loadingState');
    const gridEl = document.getElementById('filesGrid');
    const paginationEl = document.getElementById('paginationControls');
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 1;

    const cardColors = [
      // Cycle through SA green shades so each card gets its own tone
      ['bg-white/70 backdrop-blur-xl border-dga-primary-200/60', 'from-dga-primary-400 to-dga-primary-600'],
      ['bg-white/70 backdrop-blur-xl border-dga-primary-300/50', 'from-dga-primary-600 to-dga-primary-800'],
      ['bg-white/70 backdrop-blur-xl border-dga-primary-200/60', 'from-dga-primary-500 to-dga-primary-700'],
      ['bg-white/70 backdrop-blur-xl border-dga-primary-300/50', 'from-dga-primary-700 to-dga-primary-900'],
    ];

    fetch(`{{ route("qspark.api.course.files", $courseId) }}?page=${page}`, {
      credentials: 'include',
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(r => r.json())
    .then(data => {
      loadingEl.classList.add('hidden');

      // Debug: Log the API response to see what we're getting
      console.log('=== AJAX FILES RESPONSE ===');
      console.log('Full response:', JSON.stringify(data, null, 2));
      console.log('Files array:', data.files);
      if (data.files && data.files.length > 0) {
        data.files.forEach((file, idx) => {
          console.log(`File ${idx}:`, {
            contentTitle: file.contentTitle,
            fileName: file.fileName,
            downloadUrl: file.downloadUrl,
            generateQuizUrl: file.generateQuizUrl,
            hasQuizUrl: !!file.generateQuizUrl
          });
        });
      }

      if (data.success && data.files && data.files.length > 0) {
        const courseCode = data.code || '{{ $code }}';
        let html = '';
        const placeholderTitles = ['ultraDocumentBody', 'Untitled', 'Unknown Content'];
        data.files.forEach((file, idx) => {
          const colors = cardColors[idx % cardColors.length];
          const rawTitle = (file.contentTitle || '').trim();
          const fileName = (file.fileName || '').trim();
          const titleIsMeaningful = rawTitle && !placeholderTitles.includes(rawTitle);
          const name = titleIsMeaningful ? rawTitle : (fileName || 'Unknown File');
          const showSubtitle = fileName && fileName !== name;
          html += `
            <div class="group rounded-2xl p-5 border ${colors[0]} shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div class="flex items-start gap-4">
                <div class="shrink-0 p-3 rounded-xl text-white shadow-lg bg-gradient-to-br ${colors[1]}">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-slate-800 truncate text-base">${name}</h3>
                  ${showSubtitle ? `<p class="text-xs text-slate-500 mt-0.5">${fileName}</p>` : ''}
                </div>
              </div>
              <div class="flex gap-2 mt-4">
                ${file.generateQuizUrl ? `<button class="quiz-btn flex-1 text-center py-2 px-3 rounded-lg bg-gradient-to-r from-dga-primary-500 to-dga-primary-600 hover:to-dga-primary-700 text-white text-sm font-medium shadow hover:shadow-lg transition" data-quiz-url="${file.generateQuizUrl}" data-course-code="${courseCode}">{{ __('messages.quiz') }}</button>` : ''}
                ${file.generateQuizUrl ? `<button class="export-btn text-center py-2 px-3 rounded-lg bg-dga-primary-700 hover:bg-dga-primary-800 text-white text-sm font-medium shadow hover:shadow-lg transition" data-quiz-url="${file.generateQuizUrl}" data-course-code="${courseCode}" title="{{ __('messages.export_quiz') }}"><svg class="w-4 h-4 inline" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12,19L8,15H10.5V12H13.5V15H16L12,19Z"/></svg></button>` : ''}
                ${file.downloadUrl ? `<button class="download-btn flex-1 text-center py-2 px-3 rounded-lg bg-gradient-to-r ${colors[1]} text-white text-sm font-medium shadow hover:brightness-110 hover:shadow-lg transition" data-download-url="${file.downloadUrl}" data-file-name="${file.fileName || 'file'}">{{ __('messages.download') }}</button>` : ''}
              </div>
            </div>`;
        });
        gridEl.innerHTML = html;
        gridEl.classList.remove('hidden');

        // Update pagination info
        if (paginationEl && data.totalPages > 1) {
          document.getElementById('pageInfo')?.remove();
          const pageInfo = document.createElement('p');
          pageInfo.id = 'pageInfo';
          pageInfo.className = 'text-center text-sm text-slate-500 mt-4';
          pageInfo.textContent = `{{ __('messages.page') }} ${data.currentPage} {{ __('messages.of') }} ${data.totalPages}`;
          paginationEl.parentNode.insertBefore(pageInfo, paginationEl.nextSibling);
        }
      } else {
        gridEl.innerHTML = `
          <div class="col-span-full text-center py-12">
            <div class="mx-auto w-20 h-20 bg-slate-100 rounded-full grid place-items-center mb-4">
              <svg class="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-1">{{ __('messages.no_files') }}</h3>
            <p class="text-slate-500">{{ __('messages.no_files_description') }}</p>
          </div>`;
        gridEl.classList.remove('hidden');
      }
    })
    .catch(err => {
      console.error('Error loading files:', err);
      loadingEl.innerHTML = `
        <div class="text-center py-12 text-red-500">
          <p>{{ __('messages.error_loading') }}</p>
          <button onclick="location.reload()" class="mt-4 px-4 py-2 bg-dga-primary-600 text-white rounded-lg hover:bg-dga-primary-700">{{ __('messages.retry') }}</button>
        </div>`;
    });
  })();
  @endif
})();
</script>
@endpush