@extends('layouts.app')

@section('title', __('messages.edit_question_page_title'))

@section('content')
<div class="min-h-screen bg-gradient-to-br from-dga-primary-50 via-dga-primary-50 to-dga-primary-50 py-8">
  <div class="container mx-auto px-4 max-w-4xl">
    
    <!-- Header -->
    <div class="mb-8">
      <a href="{{ route('faculty.courses.view', $question->course_code) }}" 
         class="inline-flex items-center gap-2 text-dga-primary-600 hover:text-dga-primary-800 mb-4 transition">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        <span>{{ __('messages.back_to_course') }}</span>
      </a>
      
      <div class="bg-white rounded-2xl shadow-xl p-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gradient-to-br from-dga-primary-500 to-dga-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-800">{{ __('messages.edit_question_page_title') }}</h1>
            <p class="text-gray-500">{{ $course->course_name ?? $question->course_code }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <form id="editQuestionForm" class="bg-white rounded-2xl shadow-xl overflow-hidden">
      @csrf
      <input type="hidden" name="_method" value="PUT">
      
      <!-- Question Text -->
      <div class="p-6 border-b border-gray-100">
        <label class="block text-lg font-bold text-gray-800 mb-3">{{ __('messages.question_text') }}</label>
        <textarea name="question" rows="4" required
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-dga-primary-500 resize-none text-lg transition"
                  placeholder="{{ __('messages.question_text_placeholder') }}">{{ $question->question }}</textarea>
      </div>

      <!-- Options Section -->
      <div class="p-6 border-b border-gray-100 bg-gray-50">
        <div class="flex items-center justify-between mb-4">
          <label class="text-lg font-bold text-gray-800">{{ __('messages.options_label') }}</label>
          <button type="button" id="addOptionBtn" 
                  class="px-4 py-2 bg-dga-primary-600 text-white rounded-xl hover:bg-dga-primary-700 transition flex items-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            {{ __('messages.add_option') }}
          </button>
        </div>
        
        <div id="optionsContainer" class="space-y-3">
          @foreach($question->options as $index => $option)
          <div class="option-row flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-gray-200" data-index="{{ $index }}">
            <span class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-dga-primary-500 to-dga-primary-600 text-white rounded-xl font-bold text-lg shadow">
              {{ chr(65 + $index) }}
            </span>
            <input type="text" name="options[]" value="{{ $option }}" required
                   class="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-dga-primary-500 transition">
            <button type="button" class="remove-option-btn p-2 text-red-500 hover:bg-red-50 rounded-lg transition {{ count($question->options) <= 2 ? 'opacity-50 cursor-not-allowed' : '' }}">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
          @endforeach
        </div>
      </div>

      <!-- Correct Answer -->
      <div class="p-6 border-b border-gray-100">
        <label class="block text-lg font-bold text-gray-800 mb-3">{{ __('messages.correct_answer') }}</label>
        <select name="correct_index" id="correctIndexSelect"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-dga-primary-500 transition text-lg">
          @foreach($question->options as $index => $option)
          <option value="{{ $index }}" {{ $question->correct_index == $index ? 'selected' : '' }}>
            {{ chr(65 + $index) }} - {{ Str::limit($option, 50) }}
          </option>
          @endforeach
        </select>
      </div>

      <!-- Difficulty & Topic -->
      <div class="p-6 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-lg font-bold text-gray-800 mb-3">{{ __('messages.difficulty_level') }}</label>
          <div class="flex gap-3">
            @foreach(['easy' => __('messages.difficulty_easy'), 'medium' => __('messages.difficulty_medium'), 'hard' => __('messages.difficulty_hard')] as $value => $label)
            <label class="flex-1">
              <input type="radio" name="difficulty" value="{{ $value }}" class="sr-only peer" {{ $question->difficulty == $value ? 'checked' : '' }}>
              <div class="p-3 text-center border-2 rounded-xl cursor-pointer transition
                {{ $value == 'easy' ? 'peer-checked:bg-dga-primary-500 peer-checked:text-white peer-checked:border-dga-primary-500 hover:border-dga-primary-300' : '' }}
                {{ $value == 'medium' ? 'peer-checked:bg-dga-primary-500 peer-checked:text-white peer-checked:border-dga-primary-500 hover:border-dga-primary-300' : '' }}
                {{ $value == 'hard' ? 'peer-checked:bg-rose-500 peer-checked:text-white peer-checked:border-rose-500 hover:border-rose-300' : '' }}
                border-gray-200">
                {{ $label }}
              </div>
            </label>
            @endforeach
          </div>
        </div>
        
        <div>
          <label class="block text-lg font-bold text-gray-800 mb-3">{{ __('messages.topic_optional') }}</label>
          <input type="text" name="topic" value="{{ $question->topic }}"
                 class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-dga-primary-500 transition"
                 placeholder="{{ __('messages.topic_placeholder') }}">
        </div>
      </div>

      <!-- Messages -->
      <div id="formMessages" class="hidden p-4 mx-6 mt-6 rounded-xl"></div>

      <!-- Actions -->
      <div class="p-6 bg-gray-50 flex items-center justify-between">
        <a href="{{ route('faculty.courses.view', $question->course_code) }}" 
           class="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium">
          {{ __('messages.cancel') }}
        </a>
        <button type="submit" id="saveBtn"
                class="px-8 py-3 bg-gradient-to-r from-dga-primary-600 to-dga-primary-600 text-white rounded-xl hover:from-dga-primary-700 hover:to-dga-primary-700 transition font-bold shadow-lg flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
          </svg>
          {{ __('messages.save_changes') }}
        </button>
      </div>
    </form>

  </div>
</div>
@endsection

@section('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('editQuestionForm');
  const optionsContainer = document.getElementById('optionsContainer');
  const addOptionBtn = document.getElementById('addOptionBtn');
  const correctIndexSelect = document.getElementById('correctIndexSelect');
  const formMessages = document.getElementById('formMessages');
  const saveBtn = document.getElementById('saveBtn');

  // Update option letters and select
  function updateOptions() {
    const rows = optionsContainer.querySelectorAll('.option-row');
    rows.forEach((row, index) => {
      row.dataset.index = index;
      row.querySelector('span').textContent = String.fromCharCode(65 + index);
    });

    // Update correct answer select
    correctIndexSelect.innerHTML = '';
    rows.forEach((row, index) => {
      const input = row.querySelector('input[name="options[]"]');
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${String.fromCharCode(65 + index)} - ${input.value.substring(0, 50)}`;
      correctIndexSelect.appendChild(option);
    });

    // Update remove buttons
    const removeButtons = optionsContainer.querySelectorAll('.remove-option-btn');
    removeButtons.forEach(btn => {
      if (rows.length <= 2) {
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.disabled = true;
      } else {
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.disabled = false;
      }
    });
  }

  // Add option
  addOptionBtn.addEventListener('click', function() {
    const rows = optionsContainer.querySelectorAll('.option-row');
    if (rows.length >= 6) {
      showMessage('{{ __('messages.max_options_message') }}', 'error');
      return;
    }

    const newIndex = rows.length;
    const div = document.createElement('div');
    div.className = 'option-row flex items-center gap-3 bg-white p-3 rounded-xl border-2 border-gray-200';
    div.dataset.index = newIndex;
    div.innerHTML = `
      <span class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-dga-primary-500 to-dga-primary-600 text-white rounded-xl font-bold text-lg shadow">
        ${String.fromCharCode(65 + newIndex)}
      </span>
      <input type="text" name="options[]" required
             class="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-dga-primary-500 transition"
             placeholder="{{ __('messages.enter_option_text') }}">
      <button type="button" class="remove-option-btn p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      </button>
    `;
    optionsContainer.appendChild(div);
    updateOptions();
    div.querySelector('input').focus();
  });

  // Remove option (event delegation)
  optionsContainer.addEventListener('click', function(e) {
    const removeBtn = e.target.closest('.remove-option-btn');
    if (removeBtn && !removeBtn.disabled) {
      const rows = optionsContainer.querySelectorAll('.option-row');
      if (rows.length > 2) {
        removeBtn.closest('.option-row').remove();
        updateOptions();
      }
    }
  });

  // Update select on input change
  optionsContainer.addEventListener('input', function(e) {
    if (e.target.name === 'options[]') {
      updateOptions();
    }
  });

  // Show message
  function showMessage(msg, type) {
    formMessages.textContent = msg;
    formMessages.className = `p-4 mx-6 mt-6 rounded-xl ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
    formMessages.classList.remove('hidden');
  }

  // Form submit
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const options = Array.from(optionsContainer.querySelectorAll('input[name="options[]"]')).map(i => i.value.trim()).filter(v => v);
    if (options.length < 2) {
      showMessage('{{ __('messages.min_options_message') }}', 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> {{ __('messages.saving') }}';

    try {
      const response = await fetch('/faculty/questions/{{ $question->id }}', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': '{{ csrf_token() }}',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          question: form.querySelector('textarea[name="question"]').value,
          options: options,
          correct_index: parseInt(correctIndexSelect.value),
          difficulty: form.querySelector('input[name="difficulty"]:checked').value,
          topic: form.querySelector('input[name="topic"]').value || null
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showMessage('{{ __('messages.save_success') }}', 'success');
        setTimeout(() => {
          window.location.href = '{{ route("faculty.courses.view", $question->course_code) }}';
        }, 1500);
      } else {
        showMessage(data.error || data.message || '{{ __('messages.save_error') }}', 'error');
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg> {{ __('messages.save_changes') }}';
      }
    } catch (error) {
      showMessage('{{ __('messages.server_connection_error') }}', 'error');
      saveBtn.disabled = false;
      saveBtn.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg> {{ __('messages.save_changes') }}';
    }
  });
});
</script>
@endsection

