@extends('qspark::layouts.app')

@section('title', __('messages.ai_assistant') . ' - Q SPARK')

@push('styles')
<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    /* Mobile: let the card grow with content and the page scroll naturally,
       so the messages area never gets crushed by the stacked prompt buttons. */
    min-height: calc(100vh - 2rem);
    min-height: calc(100dvh - 2rem);
  }

  @media (min-width: 768px) {
    /* Desktop/tablet: lock to the viewport for an app-like fixed layout. */
    .chat-container {
      height: calc(100vh - 3rem);
      height: calc(100dvh - 3rem);
      min-height: 0;
    }
  }

  .chat-header {
    background: linear-gradient(135deg, #25935F 0%, #166A45 100%);
    border-radius: 1rem 1rem 0 0;
    padding: 1.25rem 1.5rem;
    color: white;
    flex-shrink: 0;
  }

  .chat-messages {
    flex: 1 1 auto;
    min-height: 12rem;
    overflow-y: auto;
    padding: 1.5rem;
    background: #F9FAFB;
    scroll-behavior: smooth;
  }

  .chat-content {
    direction: rtl;
    text-align: right;
  }

  .chat-content p {
    margin: 0;
    line-height: 1.7;
  }

  .chat-content p + p {
    margin-top: 0.75rem;
  }

  .chat-content strong {
    font-weight: 700;
    color: #14573A;
  }

  .chat-content .chat-list {
    margin: 0.75rem 0;
    padding-right: 1.5rem;
    padding-left: 0;
  }

  .chat-content ul.chat-list {
    list-style-type: disc;
  }

  .chat-content ol.chat-list {
    list-style-type: decimal;
  }

  .chat-content .chat-list li {
    margin: 0.5rem 0;
    line-height: 1.6;
  }

  .user-message {
    direction: rtl;
    text-align: right;
  }

  .message-bubble {
    max-width: 75%;
    border-radius: 1.25rem;
    padding: 1rem 1.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .ai-bubble {
    background: white;
    border-top-right-radius: 0.25rem;
  }

  .user-bubble {
    background: linear-gradient(135deg, #17B26A 0%, #079455 100%);
    color: white;
    border-top-left-radius: 0.25rem;
  }

  .chat-choice-area {
    padding: 1rem 1.5rem;
    background: white;
    border-top: 1px solid #E5E7EB;
    border-radius: 0 0 1rem 1rem;
    flex-shrink: 0;
  }

  .prompt-button {
    background: white;
    border: 2px solid #E5E7EB;
    border-radius: 0.875rem;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    line-height: 1.4;
    color: #1F2A37;
    text-align: right;
    cursor: pointer;
    direction: rtl;
    transition: all 0.15s ease;
  }

  .prompt-button:hover:not(:disabled) {
    border-color: #25935F;
    background: #F3FCF6;
    transform: translateY(-1px);
  }

  .prompt-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .typing-indicator span {
    animation: bounce 1.4s infinite ease-in-out;
  }

  .typing-indicator span:nth-child(1) { animation-delay: 0s; }
  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }
</style>
@endpush

@section('content')
<div class="p-4 md:p-6">
  <div class="chat-container bg-white rounded-2xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="chat-header">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <a href="{{ route('qspark.dashboard.student') }}" class="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </a>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold">{{ __('messages.ai_assistant') }}</h1>
              <p class="text-sm text-blue-100">{{ __('messages.chat_subtitle') }}</p>
            </div>
          </div>
        </div>
        <button id="clearChat" class="p-2 hover:bg-white/10 rounded-lg transition-colors" title="{{ __('messages.clear_chat') }}">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Messages -->
    <div id="chatMessages" class="chat-messages">
      <div class="flex gap-4 mb-6">
        <div class="w-10 h-10 bg-dga-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div class="message-bubble ai-bubble">
          <div class="chat-content text-gray-700">
            <p><strong>{{ __('messages.chat_hello') }} {{ $studentName }}! 👋</strong></p>
            <p>{{ __('messages.chat_pick_prompt') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Choice grid (no free-text input) -->
    <div class="chat-choice-area">
      <div id="promptGrid" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        @foreach($prompts as $id => $text)
          <button type="button" class="prompt-button" data-prompt-id="{{ $id }}" data-prompt-text="{{ $text }}">
            {{ $text }}
          </button>
        @endforeach
      </div>
      <p class="text-xs text-gray-400 mt-3 text-center">{{ __('messages.chat_disclaimer') }}</p>
    </div>
  </div>
</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function () {
  const chatMessages = document.getElementById('chatMessages');
  const promptGrid   = document.getElementById('promptGrid');
  const clearChat    = document.getElementById('clearChat');
  const sendUrl      = @json(route('qspark.dashboard.student.chat.send'));
  const csrfToken    = @json(csrf_token());

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function addMessage(content, isUser) {
    const wrap = document.createElement('div');
    wrap.className = 'flex gap-4 mb-4' + (isUser ? ' flex-row-reverse' : '');

    const avatar = document.createElement('div');
    avatar.className = 'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ' +
      (isUser ? 'bg-green-500' : 'bg-dga-primary-500');
    avatar.innerHTML = isUser
      ? '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
      : '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble ' + (isUser ? 'user-bubble' : 'ai-bubble');
    bubble.innerHTML = isUser
      ? '<div class="user-message">' + escapeHtml(content) + '</div>'
      : '<div class="chat-content text-gray-700">' + content + '</div>';

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addLoading() {
    const wrap = document.createElement('div');
    wrap.id = 'loadingIndicator';
    wrap.className = 'flex gap-4 mb-4';
    wrap.innerHTML = `
      <div class="w-10 h-10 bg-dga-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      </div>
      <div class="message-bubble ai-bubble">
        <div class="typing-indicator flex gap-1">
          <span class="w-2 h-2 bg-dga-primary-500 rounded-full"></span>
          <span class="w-2 h-2 bg-dga-primary-500 rounded-full"></span>
          <span class="w-2 h-2 bg-dga-primary-500 rounded-full"></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeLoading() {
    const el = document.getElementById('loadingIndicator');
    if (el) el.remove();
  }

  function setButtonsDisabled(disabled) {
    promptGrid.querySelectorAll('.prompt-button').forEach(b => b.disabled = disabled);
  }

  async function sendPrompt(promptId, promptText) {
    addMessage(promptText, true);
    setButtonsDisabled(true);
    addLoading();

    try {
      const res = await fetch(sendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'Accept': 'application/json',
        },
        body: JSON.stringify({ prompt_id: promptId }),
      });

      removeLoading();
      const data = await res.json();

      if (data.success && data.response) {
        addMessage(data.response, false);
      } else {
        addMessage('<p class="text-red-500">' + (data.error || @json(__('messages.chat_error_retry'))) + '</p>', false);
      }
    } catch (err) {
      removeLoading();
      addMessage('<p class="text-red-500">' + @json(__('messages.chat_connection_error')) + '</p>', false);
    } finally {
      setButtonsDisabled(false);
    }
  }

  promptGrid.addEventListener('click', function (e) {
    const btn = e.target.closest('.prompt-button');
    if (!btn || btn.disabled) return;
    sendPrompt(btn.dataset.promptId, btn.dataset.promptText);
  });

  clearChat.addEventListener('click', function () {
    chatMessages.querySelectorAll('.flex.gap-4:not(:first-child)').forEach(el => el.remove());
  });
});
</script>
@endpush
