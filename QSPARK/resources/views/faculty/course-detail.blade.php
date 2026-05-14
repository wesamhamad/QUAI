@extends('layouts.app')

@section('title', ($course->course_name ?? __('messages.course_details_default')) . ' - Q SPARK')

@section('content')
<div class="p-6 max-w-7xl mx-auto">
  <!-- Breadcrumb -->
  <div class="mb-6 flex items-center gap-2 text-sm text-gray-500">
    <a href="{{ route('faculty.dashboard') }}" class="hover:text-dga-primary-600">{{ __('messages.breadcrumb_dashboard') }}</a>
    <span>/</span>
    <a href="{{ route('faculty.courses') }}" class="hover:text-dga-primary-600">{{ __('messages.breadcrumb_my_courses') }}</a>
    <span>/</span>
    <span class="text-gray-800 font-medium">{{ $course->course_code ?? __('messages.course_word') }}</span>
  </div>

  <!-- Course Header -->
  <div class="bg-gradient-to-r from-dga-primary-500 to-dga-primary-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold mb-2">{{ $course->course_name ?? __('messages.not_available') }}</h1>
        <p class="text-blue-100 text-lg">{{ $course->course_code ?? 'N/A' }}</p>
        <div class="flex items-center gap-4 mt-4 text-sm text-blue-100">
          <span>{{ __('messages.semester_label') }} {{ $currentSemester ?? __('messages.undefined_value') }}</span>
          <span>•</span>
          <span>{{ __('messages.campus_label') }} {{ $course->campus_name ?? __('messages.undefined_value') }}</span>
          <span>•</span>
          <span>{{ __('messages.section_label') }} {{ $course->section ?? 'N/A' }}</span>
        </div>
      </div>
      @if($blackboard)
        <span class="bg-green-400 text-green-900 text-sm font-bold px-3 py-1.5 rounded-full">
          ✓ {{ __('messages.connected_to_blackboard') }}
        </span>
      @else
        <span class="bg-yellow-400 text-dga-primary-900 text-sm font-bold px-3 py-1.5 rounded-full">
          {{ __('messages.sis_data_only') }}
        </span>
      @endif
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Main Content -->
    <div class="lg:col-span-2 space-y-6">
  

      <!-- Course Contents Tree -->
      @if(count($contents) > 0)
      <div class="bg-white rounded-2xl shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg class="w-6 h-6 text-dga-primary-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
          </svg>
          {{ __('messages.course_contents') }}
        </h2>
        <div class="space-y-2" id="contents-tree">
          @foreach($contents as $content)
            @php
              $hasChildren = $content['hasChildren'] ?? false;
              $handler = $content['contentHandler']['id'] ?? '';
              $isFolder = str_contains($handler, 'folder');
              $isFile = str_contains($handler, 'file') || str_contains($handler, 'document');
              $contentId = $content['id'] ?? '';
            @endphp
            <div class="content-item border border-gray-200 rounded-xl overflow-hidden" data-content-id="{{ $contentId }}">
              <div class="p-3 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition {{ $hasChildren ? 'folder-toggle' : '' }}"
                   @if($hasChildren) data-folder-id="{{ $contentId }}" @endif>
                <div class="flex items-center gap-3">
                  @if($isFolder)
                    <span class="folder-icon text-xl">📁</span>
                  @elseif($isFile)
                    <span class="text-xl">📄</span>
                  @else
                    <span class="text-xl">📋</span>
                  @endif
                  <p class="font-medium text-gray-800">{{ $content['title'] ?? __('messages.content_word') }}</p>
                  @if($hasChildren)
                    <span class="expand-icon text-gray-400 text-sm">▶</span>
                  @endif
                </div>
                @if(isset($content['contentHandler']['file']))
                  <a href="{{ route('courses.blackboard.download', ['externalId' => $blackboard['id'] ?? '', 'contentId' => $contentId, 'attachmentId' => $contentId]) }}"
                     target="_blank" class="text-dga-primary-600 hover:text-dga-primary-800 text-sm font-medium">
                    {{ __('messages.download') }}
                  </a>
                @endif
              </div>
              @if($hasChildren)
                <div class="children-container hidden bg-white border-t border-gray-200" data-parent-id="{{ $contentId }}">
                  <div class="p-3 text-center text-gray-500 loading-indicator">
                    <span class="animate-pulse">{{ __('messages.loading_files') }}</span>
                  </div>
                </div>
              @endif
            </div>
          @endforeach
        </div>
      </div>

      <script>
        document.addEventListener('DOMContentLoaded', function() {
          const courseId = '{{ $blackboard['id'] ?? '' }}';
          const externalId = '{{ $blackboard['courseId'] ?? $blackboard['externalId'] ?? '' }}';

          document.querySelectorAll('.folder-toggle').forEach(folder => {
            folder.addEventListener('click', async function() {
              const folderId = this.dataset.folderId;
              const container = this.nextElementSibling;
              const expandIcon = this.querySelector('.expand-icon');
              const folderIcon = this.querySelector('.folder-icon');

              if (container.classList.contains('hidden')) {
                container.classList.remove('hidden');
                if (expandIcon) expandIcon.textContent = '▼';
                if (folderIcon) folderIcon.textContent = '📂';

                // Load children if not already loaded
                if (container.querySelector('.loading-indicator')) {
                  try {
                    const response = await fetch(`/api/blackboard/course/${courseId}/content/${folderId}/children`);
                    const data = await response.json();

                    if (data.success && data.data && data.data.length > 0) {
                      container.innerHTML = renderChildren(data.data, courseId);
                      // Re-attach event listeners for nested folders
                      attachFolderListeners(container);
                    } else {
                      container.innerHTML = '<div class="p-3 text-center text-gray-400 text-sm">{{ __('messages.no_content_available') }}</div>';
                    }
                  } catch (error) {
                    container.innerHTML = '<div class="p-3 text-center text-red-500 text-sm">{{ __('messages.load_error') }}</div>';
                  }
                }
              } else {
                container.classList.add('hidden');
                if (expandIcon) expandIcon.textContent = '▶';
                if (folderIcon) folderIcon.textContent = '📁';
              }
            });
          });

          function renderChildren(children, courseId) {
            const courseCode = '{{ $course->course_code ?? '' }}';
            return '<div class="space-y-1 p-2">' + children.map(child => {
              const hasChildren = child.hasChildren || false;
              const handler = child.contentHandler?.id || '';
              const isFolder = handler.includes('folder');
              const isFile = handler.includes('file') || handler.includes('document');
              const isPdfLink = handler.includes('externallink') && (child.title || '').toLowerCase().includes('pdf');
              const icon = isFolder ? '📁' : (isFile || isPdfLink ? '📄' : '📋');
              const file = child.contentHandler?.file;
              const externalUrl = child.contentHandler?.url || '';

              let actionButtons = '';
              if (file) {
                actionButtons = `<a href="/courses/blackboard/${courseId}/content/${child.id}/attachment/${child.id}" target="_blank" class="text-dga-primary-600 hover:text-dga-primary-800 text-sm font-medium">{{ __('messages.download') }}</a>`;
              }
              // Add generate questions button for PDF links
              if (isPdfLink && externalUrl) {
                actionButtons = `
                  <div class="flex items-center gap-2">
                    <a href="${externalUrl}" target="_blank" class="text-dga-primary-600 hover:text-dga-primary-800 text-sm font-medium">{{ __('messages.open_pdf') }}</a>
                    <button class="generate-questions-btn px-2 py-1 bg-dga-primary-600 text-white text-xs rounded-lg hover:bg-dga-primary-700 transition"
                            data-content-id="${child.id}"
                            data-content-title="${child.title || ''}"
                            data-pdf-url="${externalUrl}"
                            data-course-code="${courseCode}"
                            data-course-id="${courseId}"
                            data-external-id="${externalId}">
                      🤖 {{ __('messages.generate_questions') }}
                    </button>
                  </div>
                `;
              }

              return `
                <div class="content-item border border-gray-100 rounded-lg overflow-hidden mr-4" data-content-id="${child.id}">
                  <div class="p-2 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition ${hasChildren ? 'folder-toggle' : ''}"
                       ${hasChildren ? `data-folder-id="${child.id}"` : ''}>
                    <div class="flex items-center gap-2">
                      <span class="${isFolder ? 'folder-icon' : ''} text-lg">${icon}</span>
                      <p class="text-sm text-gray-700">${child.title || '{{ __('messages.content_word') }}'}</p>
                      ${hasChildren ? '<span class="expand-icon text-gray-400 text-xs">▶</span>' : ''}
                    </div>
                    ${actionButtons}
                  </div>
                  ${hasChildren ? `<div class="children-container hidden bg-white border-t border-gray-100" data-parent-id="${child.id}"><div class="p-2 text-center text-gray-500 loading-indicator text-sm"><span class="animate-pulse">{{ __('messages.loading_files') }}</span></div></div>` : ''}
                </div>
              `;
            }).join('') + '</div>';
          }

          function attachFolderListeners(container) {
            container.querySelectorAll('.folder-toggle').forEach(folder => {
              folder.addEventListener('click', async function(e) {
                e.stopPropagation();
                const folderId = this.dataset.folderId;
                const childContainer = this.nextElementSibling;
                const expandIcon = this.querySelector('.expand-icon');
                const folderIcon = this.querySelector('.folder-icon');

                if (childContainer.classList.contains('hidden')) {
                  childContainer.classList.remove('hidden');
                  if (expandIcon) expandIcon.textContent = '▼';
                  if (folderIcon) folderIcon.textContent = '📂';

                  if (childContainer.querySelector('.loading-indicator')) {
                    try {
                      const response = await fetch(`/api/blackboard/course/${courseId}/content/${folderId}/children`);
                      const data = await response.json();

                      if (data.success && data.data && data.data.length > 0) {
                        childContainer.innerHTML = renderChildren(data.data, courseId);
                        attachFolderListeners(childContainer);
                        attachGenerateButtonListeners(childContainer);
                      } else {
                        childContainer.innerHTML = '<div class="p-2 text-center text-gray-400 text-sm">{{ __('messages.no_content_available') }}</div>';
                      }
                    } catch (error) {
                      childContainer.innerHTML = '<div class="p-2 text-center text-red-500 text-sm">{{ __('messages.load_error') }}</div>';
                    }
                  }
                } else {
                  childContainer.classList.add('hidden');
                  if (expandIcon) expandIcon.textContent = '▶';
                  if (folderIcon) folderIcon.textContent = '📁';
                }
              });
            });
          }

          // Attach listeners to generate questions buttons
          function attachGenerateButtonListeners(container) {
            container.querySelectorAll('.generate-questions-btn').forEach(btn => {
              btn.addEventListener('click', async function(e) {
                e.stopPropagation();
                const contentId = this.dataset.contentId;
                const contentTitle = this.dataset.contentTitle;
                const pdfUrl = this.dataset.pdfUrl;
                const courseCode = this.dataset.courseCode;
                const courseId = this.dataset.courseId;

                await generateQuestionsFromPdf(this, contentId, contentTitle, pdfUrl, courseCode, courseId);
              });
            });
          }

          // Generate questions from PDF
          async function generateQuestionsFromPdf(btn, contentId, contentTitle, pdfUrl, courseCode, courseId) {
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="animate-spin inline-block">⏳</span> {{ __('messages.generating_questions') }}';

            try {
              const response = await fetch('/faculty/generate-questions', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                  'Accept': 'application/json'
                },
                body: JSON.stringify({
                  content_id: contentId,
                  content_title: contentTitle,
                  pdf_url: pdfUrl,
                  course_code: courseCode,
                  course_id: courseId
                })
              });

              const data = await response.json();

              if (data.success) {
                if (data.already_exists) {
                  alert(`{{ __('messages.questions_already_exist') }} (${data.questions_count} {{ __('messages.question_word') }})`);
                } else {
                  alert(`{{ __('messages.questions_generated_success_prefix') }} ${data.questions_count} {{ __('messages.questions_generated_success_suffix') }}`);
                  location.reload();
                }
              } else {
                alert(data.message || '{{ __('messages.error_generating_questions') }}');
              }
            } catch (error) {
              console.error('Error generating questions:', error);
              alert('{{ __('messages.server_connection_error') }}');
            } finally {
              btn.disabled = false;
              btn.innerHTML = originalText;
            }
          }
        });
      </script>
      @endif

      <!-- Student-Generated Questions Section - Modern Design -->
      @php
        // Real per-course stats computed by the controller from seeded QuizQuestion
        // records (demo seeds 15 AI-generated questions per course, course-specific).
        $totalQuestions = $questionStats['total'] ?? 0;
        $easyCount = $questionStats['easy'] ?? 0;
        $mediumCount = $questionStats['medium'] ?? 0;
        $hardCount = $questionStats['hard'] ?? 0;
        $notExportedCount = $questionStats['new'] ?? 0;
        $exportedCount = max(0, $totalQuestions - $notExportedCount);
      @endphp

      <div class="bg-gradient-to-br from-dga-primary-50 via-white to-dga-primary-50 rounded-2xl shadow-lg overflow-hidden border border-purple-100">
        <!-- Header Section with Gradient -->
        <div class="bg-gradient-to-r from-dga-primary-600 via-dga-primary-600 to-dga-primary-600 p-6 text-white">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold">{{ __('messages.student_generated_questions') }}</h2>
                <p class="text-purple-100 text-sm mt-0.5">{{ __('messages.ai_generated_subtitle') }}</p>
              </div>
            </div>
            @if($notExportedCount > 0)
              <button type="button" id="exportQuestionsBtn"
                      class="flex items-center gap-2 px-5 py-2.5 bg-white text-dga-primary-700 rounded-xl hover:bg-dga-primary-50 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      data-course-code="{{ $course->course_code }}">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
                </svg>
                {{ __('messages.export_word') }} ({{ $notExportedCount }})
              </button>
            @endif
          </div>
        </div>

        <!-- Statistics Cards -->
        @if($totalQuestions > 0)
        <div class="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-white/80 border-b border-purple-100">
          <div class="bg-gradient-to-br from-dga-primary-500 to-dga-primary-600 rounded-xl p-3 text-white text-center shadow-md">
            <div class="text-2xl font-black">{{ $totalQuestions }}</div>
            <div class="text-xs text-purple-100 font-medium">{{ __('messages.total_questions') }}</div>
          </div>
          <div class="bg-gradient-to-br from-emerald-400 to-dga-primary-500 rounded-xl p-3 text-white text-center shadow-md">
            <div class="text-2xl font-black">{{ $easyCount }}</div>
            <div class="text-xs text-emerald-100 font-medium">{{ __('messages.difficulty_easy') }}</div>
          </div>
          <div class="bg-gradient-to-br from-amber-400 to-dga-primary-500 rounded-xl p-3 text-white text-center shadow-md">
            <div class="text-2xl font-black">{{ $mediumCount }}</div>
            <div class="text-xs text-amber-100 font-medium">{{ __('messages.difficulty_medium') }}</div>
          </div>
          <div class="bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl p-3 text-white text-center shadow-md">
            <div class="text-2xl font-black">{{ $hardCount }}</div>
            <div class="text-xs text-rose-100 font-medium">{{ __('messages.difficulty_hard') }}</div>
          </div>
          <div class="bg-gradient-to-br from-blue-400 to-dga-primary-500 rounded-xl p-3 text-white text-center shadow-md">
            <div class="text-2xl font-black">{{ $notExportedCount }}</div>
            <div class="text-xs text-blue-100 font-medium">{{ __('messages.status_new') }}</div>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 p-4 bg-white/60 border-b border-purple-100 overflow-x-auto">
          <button type="button" data-filter="all" class="filter-btn active px-4 py-2 rounded-full text-sm font-medium bg-dga-primary-600 text-white transition-all duration-200 whitespace-nowrap">
            {{ __('messages.filter_all') }} ({{ $totalQuestions }})
          </button>
          <button type="button" data-filter="new" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-dga-primary-50 hover:text-dga-primary-600 border border-gray-200 transition-all duration-200 whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5">
              <span class="w-2 h-2 bg-dga-primary-500 rounded-full animate-pulse"></span>
              {{ __('messages.status_new') }} ({{ $notExportedCount }})
            </span>
          </button>
          <button type="button" data-filter="exported" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 transition-all duration-200 whitespace-nowrap">
            {{ __('messages.filter_exported') }} ({{ $exportedCount }})
          </button>
          <div class="h-6 w-px bg-gray-300 mx-1"></div>
          <button type="button" data-filter="easy" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-dga-primary-50 hover:text-dga-primary-600 border border-gray-200 transition-all duration-200 whitespace-nowrap">
            {{ __('messages.difficulty_easy') }} ({{ $easyCount }})
          </button>
          <button type="button" data-filter="medium" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-dga-primary-50 hover:text-dga-primary-600 border border-gray-200 transition-all duration-200 whitespace-nowrap">
            {{ __('messages.difficulty_medium') }} ({{ $mediumCount }})
          </button>
          <button type="button" data-filter="hard" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200 transition-all duration-200 whitespace-nowrap">
            {{ __('messages.difficulty_hard') }} ({{ $hardCount }})
          </button>
        </div>
        @endif

        <!-- Questions Container -->
        <div class="p-5">
          @if($totalQuestions > 0)
            <div class="space-y-4" id="questions-container">
              @foreach($questions as $index => $question)
                <div class="question-card group bg-white rounded-2xl border-2 border-transparent hover:border-dga-primary-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                     data-question-id="{{ $question->id }}"
                     data-difficulty="{{ $question->difficulty }}"
                     data-exported="{{ $question->exported_at ? 'true' : 'false' }}">

                  <!-- Question Header Bar -->
                  <div class="flex items-center justify-between px-5 py-3 {{ $question->difficulty === 'easy' ? 'bg-gradient-to-r from-dga-primary-50 to-dga-primary-50' : ($question->difficulty === 'medium' ? 'bg-gradient-to-r from-dga-primary-50 to-dga-primary-50' : 'bg-gradient-to-r from-rose-50 to-red-50') }}">
                    <div class="flex items-center gap-3 flex-wrap">
                      <!-- Question Number Badge -->
                      <div class="w-10 h-10 rounded-xl {{ $question->difficulty === 'easy' ? 'bg-dga-primary-500' : ($question->difficulty === 'medium' ? 'bg-dga-primary-500' : 'bg-rose-500') }} text-white flex items-center justify-center font-black text-lg shadow-lg">
                        {{ $index + 1 }}
                      </div>

                      <!-- Difficulty Badge -->
                      <span class="px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm
                        {{ $question->difficulty === 'easy' ? 'bg-dga-primary-500 text-white' : '' }}
                        {{ $question->difficulty === 'medium' ? 'bg-dga-primary-500 text-white' : '' }}
                        {{ $question->difficulty === 'hard' ? 'bg-rose-500 text-white' : '' }}">
                        {{ $question->difficulty === 'easy' ? __('messages.easy_with_star') : ($question->difficulty === 'medium' ? __('messages.medium_with_stars') : __('messages.hard_with_stars')) }}
                      </span>

                      @if($question->topic)
                        <span class="px-3 py-1.5 bg-dga-primary-100 text-dga-primary-700 text-xs font-medium rounded-lg flex items-center gap-1">
                          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
                          </svg>
                          {{ $question->topic }}
                        </span>
                      @endif

                      <!-- Status Badge -->
                      @if($question->exported_at)
                        <span class="px-3 py-1.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-lg flex items-center gap-1">
                          <svg class="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                          {{ __('messages.exported_status') }}
                        </span>
                      @else
                        <span class="px-3 py-1.5 bg-dga-primary-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 animate-pulse">
                          <span class="w-1.5 h-1.5 bg-white rounded-full"></span>
                          {{ __('messages.status_new') }}
                        </span>
                      @endif
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex items-center gap-2 relative z-10">
                      <a href="{{ route('faculty.questions.edit', $question->id) }}"
                         class="p-2.5 bg-dga-primary-100 text-dga-primary-600 hover:bg-dga-primary-200 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                         title="{{ __('messages.edit_question') }}">
                        <svg class="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                      </a>
                      <button type="button"
                              onclick="window.openQuestionDelete({{ $question->id }})"
                              class="p-2.5 bg-red-100 text-red-500 hover:bg-red-200 rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                              title="{{ __('messages.delete_question') }}">
                        <svg class="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Question Content -->
                  <div class="p-5">
                    <!-- Question Text -->
                    <p class="text-gray-800 text-lg font-semibold mb-4 leading-relaxed question-text">{{ $question->question }}</p>

                    <!-- Options Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      @foreach($question->options as $optIndex => $option)
                        <div class="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 {{ $optIndex == $question->correct_index ? 'bg-gradient-to-r from-dga-primary-50 to-dga-primary-50 border-2 border-dga-primary-300 shadow-sm' : 'bg-gray-50 border-2 border-transparent hover:border-gray-200' }}">
                          <span class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl text-sm font-black shadow-sm
                            {{ $optIndex == $question->correct_index ? 'bg-gradient-to-br from-dga-primary-500 to-dga-primary-600 text-white' : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600' }}">
                            {{ chr(65 + $optIndex) }}
                          </span>
                          <span class="flex-1 text-sm {{ $optIndex == $question->correct_index ? 'text-dga-primary-800 font-semibold' : 'text-gray-700' }}">
                            {{ $option }}
                          </span>
                          @if($optIndex == $question->correct_index)
                            <div class="flex-shrink-0 w-7 h-7 bg-dga-primary-500 rounded-full flex items-center justify-center shadow-md">
                              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                              </svg>
                            </div>
                          @endif
                        </div>
                      @endforeach
                    </div>

                    <!-- Question Meta Footer -->
                    <div class="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <div class="flex items-center gap-4">
                        @if($question->student)
                          <span class="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded-lg">
                            <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                            {{ $question->student->arabic_name ?? $question->student->english_name ?? $question->student_id ?? __('messages.student_default_label') }}
                          </span>
                        @endif
                        <span class="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded-lg">
                          <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                          </svg>
                          {{ $question->created_at->format('Y-m-d H:i') }}
                        </span>
                      </div>
                      @if($question->edited_at)
                        <span class="flex items-center gap-1.5 text-dga-primary-600 bg-dga-primary-50 px-2.5 py-1.5 rounded-lg">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                          {{ __('messages.edited_at_prefix') }} {{ $question->edited_at->format('Y-m-d H:i') }}
                        </span>
                      @endif
                    </div>
                  </div>
                </div>
              @endforeach
            </div>

            <!-- Pagination -->
            @if($questions->hasPages())
              <div class="mt-6 flex justify-center">
                <nav class="flex items-center gap-1">
                  {{-- Previous Page Link --}}
                  @if($questions->onFirstPage())
                    <span class="px-3 py-2 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                    </span>
                  @else
                    <a href="{{ $questions->previousPageUrl() }}" class="px-3 py-2 text-dga-primary-600 bg-dga-primary-50 hover:bg-dga-primary-100 rounded-lg transition">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
                    </a>
                  @endif

                  {{-- Page Numbers --}}
                  @foreach($questions->getUrlRange(max(1, $questions->currentPage() - 2), min($questions->lastPage(), $questions->currentPage() + 2)) as $page => $url)
                    @if($page == $questions->currentPage())
                      <span class="px-4 py-2 bg-gradient-to-r from-dga-primary-600 to-dga-primary-600 text-white rounded-lg font-bold shadow">{{ $page }}</span>
                    @else
                      <a href="{{ $url }}" class="px-4 py-2 text-gray-700 bg-white hover:bg-dga-primary-50 rounded-lg border border-gray-200 transition">{{ $page }}</a>
                    @endif
                  @endforeach

                  {{-- Next Page Link --}}
                  @if($questions->hasMorePages())
                    <a href="{{ $questions->nextPageUrl() }}" class="px-3 py-2 text-dga-primary-600 bg-dga-primary-50 hover:bg-dga-primary-100 rounded-lg transition">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                    </a>
                  @else
                    <span class="px-3 py-2 text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                    </span>
                  @endif
                </nav>
              </div>
              <div class="mt-3 text-center text-sm text-gray-500">
                {{ __('messages.pagination_showing_prefix') }} {{ $questions->firstItem() }} - {{ $questions->lastItem() }} {{ __('messages.pagination_of') }} {{ $questions->total() }} {{ __('messages.question_word') }}
              </div>
            @endif

            <!-- No Results Message (Hidden by default) -->
            <div id="no-filter-results" class="hidden text-center py-12">
              <div class="w-20 h-20 mx-auto mb-4 bg-dga-primary-100 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
              <p class="text-lg font-medium text-gray-600">{{ __('messages.no_questions_match_filter') }}</p>
              <button type="button" class="mt-4 px-4 py-2 bg-dga-primary-600 text-white rounded-xl hover:bg-dga-primary-700 transition" onclick="document.querySelector('[data-filter=all]').click()">
                {{ __('messages.show_all_questions') }}
              </button>
            </div>
          @else
            <!-- Empty State - Modern Design -->
            <div class="text-center py-16">
              <div class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-dga-primary-100 to-dga-primary-100 rounded-2xl flex items-center justify-center shadow-lg">
                <svg class="w-12 h-12 text-dga-primary-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800 mb-2">{{ __('messages.no_generated_questions_for_course') }}</h3>
              <p class="text-gray-500 max-w-md mx-auto">
                {{ __('messages.no_questions_hint_prefix') }} <span class="font-semibold text-dga-primary-600">"{{ __('messages.no_questions_hint_button') }}"</span> {{ __('messages.no_questions_hint_suffix') }}
              </p>
            </div>
          @endif
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="space-y-6">
      <!-- Quick Actions -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <h3 class="font-bold text-gray-800 mb-4">{{ __('messages.quick_actions') }}</h3>
        <div class="space-y-3">
          <a href="{{ route('faculty.students') }}?course={{ $course->course_code }}"
             class="flex items-center gap-3 p-3 bg-dga-primary-50 rounded-xl hover:bg-dga-primary-100 transition text-dga-primary-700">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
            <span>{{ __('messages.view_course_students') }}</span>
          </a>
          <a href="{{ route('faculty.reports') }}"
             class="flex items-center gap-3 p-3 bg-dga-primary-50 rounded-xl hover:bg-dga-primary-100 transition text-dga-primary-700">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            <span>{{ __('messages.performance_reports') }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Delete Confirmation Modal -->
<div id="deleteConfirmModal" class="fixed inset-0 z-50 hidden overflow-y-auto">
  <div class="flex items-center justify-center min-h-screen px-4">
    <div class="fixed inset-0 bg-black/50 transition-opacity" id="deleteModalBackdrop"></div>
    <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full z-10 p-6">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">{{ __('messages.delete_question') }}</h3>
        <p class="text-gray-600 mb-6">{{ __('messages.delete_question_confirm') }}</p>
        <input type="hidden" id="deleteQuestionId">
        <div class="flex justify-center gap-3">
          <button type="button" id="cancelDeleteBtn" class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition font-medium">
            {{ __('messages.cancel') }}
          </button>
          <button type="button" id="confirmDeleteBtn" class="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium">
            {{ __('messages.confirm_delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection

@section('scripts')
<script>
// Global function for delete
window.openQuestionDelete = function(questionId) {
  document.getElementById('deleteQuestionId').value = questionId;
  const deleteModal = document.getElementById('deleteConfirmModal');
  if (deleteModal) {
    deleteModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const deleteModal = document.getElementById('deleteConfirmModal');

  // Delete modal close handlers
  document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
  document.getElementById('deleteModalBackdrop').addEventListener('click', closeDeleteModal);

  function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  document.getElementById('confirmDeleteBtn').addEventListener('click', async function() {
    const questionId = document.getElementById('deleteQuestionId').value;

    this.disabled = true;
    this.textContent = '{{ __('messages.deleting') }}';

    try {
      const response = await fetch(`/faculty/questions/${questionId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        closeDeleteModal();
        document.querySelector(`[data-question-id="${questionId}"]`).remove();
      } else {
        alert(data.error || '{{ __('messages.delete_error') }}');
      }
    } catch (error) {
      alert('{{ __('messages.server_connection_error') }}');
    } finally {
      this.disabled = false;
      this.textContent = '{{ __('messages.confirm_delete') }}';
    }
  });

  function showError(msg) {
    document.getElementById('formError').textContent = msg;
    document.getElementById('formError').classList.remove('hidden');
    document.getElementById('formSuccess').classList.add('hidden');
  }

  function showSuccess(msg) {
    document.getElementById('formSuccess').textContent = msg;
    document.getElementById('formSuccess').classList.remove('hidden');
    document.getElementById('formError').classList.add('hidden');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Export questions handler
  const exportBtn = document.getElementById('exportQuestionsBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async function() {
      const courseCode = this.dataset.courseCode;
      const originalText = this.innerHTML;

      this.disabled = true;
      this.innerHTML = '<span class="animate-spin">⏳</span> {{ __('messages.exporting') }}';

      try {
        const response = await fetch(`/faculty/courses/${courseCode}/questions/export`, {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Download the file
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `quiz_questions_${courseCode}_${new Date().toISOString().slice(0,10)}.doc`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();

          // Show success and reload to update UI
          alert('{{ __('messages.export_success') }}');
          location.reload();
        } else {
          const data = await response.json();
          alert(data.message || '{{ __('messages.export_error') }}');
        }
      } catch (error) {
        console.error('Export error:', error);
        alert('{{ __('messages.server_connection_error') }}');
      } finally {
        this.disabled = false;
        this.innerHTML = originalText;
      }
    });
  }

  // Filter functionality for questions
  const filterBtns = document.querySelectorAll('.filter-btn');
  const questionCards = document.querySelectorAll('.question-card');
  const noResultsDiv = document.getElementById('no-filter-results');
  const questionsContainer = document.getElementById('questions-container');

  if (filterBtns.length > 0 && questionCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.dataset.filter;

        // Update active state
        filterBtns.forEach(b => {
          b.classList.remove('active', 'bg-dga-primary-600', 'text-white');
          b.classList.add('bg-white', 'text-gray-600', 'border', 'border-gray-200');
        });
        this.classList.add('active', 'bg-dga-primary-600', 'text-white');
        this.classList.remove('bg-white', 'text-gray-600', 'border', 'border-gray-200');

        // Filter questions
        let visibleCount = 0;
        questionCards.forEach(card => {
          const difficulty = card.dataset.difficulty;
          const exported = card.dataset.exported === 'true';
          let show = false;

          switch(filter) {
            case 'all':
              show = true;
              break;
            case 'new':
              show = !exported;
              break;
            case 'exported':
              show = exported;
              break;
            case 'easy':
            case 'medium':
            case 'hard':
              show = difficulty === filter;
              break;
          }

          if (show) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.3s ease-out';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Show/hide no results message
        if (noResultsDiv && questionsContainer) {
          if (visibleCount === 0) {
            questionsContainer.style.display = 'none';
            noResultsDiv.classList.remove('hidden');
          } else {
            questionsContainer.style.display = '';
            noResultsDiv.classList.add('hidden');
          }
        }
      });
    });
  }
});

// Add CSS animation for filter
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .filter-btn.active {
    box-shadow: 0 4px 12px rgba(37, 147, 95, 0.3);
  }
  .question-card {
    animation: fadeIn 0.4s ease-out;
  }
`;
document.head.appendChild(style);
</script>
@endsection
