<div class="meeting-minutes-container">
    <!-- Recording Section -->
    <div class="recording-section mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                        </svg>
                    </div>
                    <span>تسجيل الاجتماع</span>
                </h3>
                <div id="recordingTimer" class="text-3xl font-mono font-bold text-gray-400 dark:text-gray-500">00:00:00</div>
            </div>

            <!-- Recording Controls -->
            <div class="flex flex-col items-center gap-6">
                <!-- Visualizer -->
                <div id="audioVisualizer" class="w-full h-24 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl flex items-center justify-center overflow-hidden hidden">
                    <canvas id="visualizerCanvas" class="w-full h-full"></canvas>
                </div>

                <!-- Control Buttons -->
                <div class="flex gap-4">
                    <button id="startRecordingBtn" onclick="startMeetingRecording()" class="flex items-center gap-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="8"/>
                        </svg>
                        <span>بدء التسجيل</span>
                    </button>

                    <button id="stopRecordingBtn" onclick="stopMeetingRecording()" class="hidden flex items-center gap-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="6" y="6" width="12" height="12" rx="2"/>
                        </svg>
                        <span>إيقاف التسجيل</span>
                    </button>

                    <button id="pauseRecordingBtn" onclick="pauseMeetingRecording()" class="hidden flex items-center gap-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                        <span>إيقاف مؤقت</span>
                    </button>
                </div>

                <!-- Recording Status -->
                <div id="recordingStatus" class="hidden text-center">
                    <div class="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-6 py-3 rounded-full">
                        <span class="relative flex h-3 w-3">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span class="font-bold">جاري التسجيل...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Upload Section -->
    <div class="upload-section mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                </div>
                <span>أو ارفع ملف صوتي</span>
            </h3>

            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer" id="dropZone">
                <input type="file" id="audioFileInput" accept="audio/*" class="hidden" onchange="handleAudioUpload(event)">
                <label for="audioFileInput" class="cursor-pointer">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                    </svg>
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">اسحب وأفلت ملف صوتي هنا</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">أو اضغط لاختيار ملف (MP3, WAV, M4A, WebM)</p>
                </label>
            </div>

            <div id="uploadedFileInfo" class="hidden mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                        </svg>
                        <div>
                            <p class="font-bold text-gray-900 dark:text-white" id="uploadedFileName"></p>
                            <p class="text-sm text-gray-600 dark:text-gray-400" id="uploadedFileSize"></p>
                        </div>
                    </div>
                    <button onclick="clearUploadedFile()" class="text-red-600 hover:text-red-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Meeting Info Form -->
    <div class="meeting-info-section mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>
                <span>معلومات الاجتماع</span>
            </h3>

            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">عنوان الاجتماع *</label>
                    <input type="text" id="meetingTitle" class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="مثال: اجتماع فريق التطوير الأسبوعي" required>
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">التاريخ</label>
                    <input type="date" id="meetingDate" class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الوقت</label>
                    <input type="time" id="meetingTime" class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>

                <div>
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">المكان</label>
                    <input type="text" id="meetingLocation" class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="مثال: قاعة الاجتماعات الرئيسية">
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الحضور (كل اسم في سطر)</label>
                    <textarea id="meetingAttendees" rows="3" class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="أحمد محمد&#10;فاطمة علي&#10;خالد سعيد"></textarea>
                </div>
            </div>

            <!-- Process Button -->
            <div class="mt-6">
                <button id="processMeetingBtn" onclick="processMeetingMinutes()" class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>معالجة وإنشاء المحضر</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Processing Status -->
    <div id="processingStatus" class="hidden mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
                    <svg class="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">جاري المعالجة...</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4" id="processingMessage">يتم تحليل التسجيل الصوتي</p>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div id="processingProgress" class="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500" style="width: 0%"></div>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400" id="processingPercent">0%</p>
            </div>
        </div>
    </div>

    <!-- Results Section -->
    <div id="resultsSection" class="hidden">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                    <span>محضر الاجتماع</span>
                </h3>

                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <button onclick="downloadMeetingMinutes()" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <span>تحميل DOCX</span>
                    </button>

                    <button onclick="copyMeetingMinutes()" class="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                        <span>نسخ</span>
                    </button>

                    <button onclick="resetMeetingMinutes()" class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        <span>جديد</span>
                    </button>
                </div>
            </div>

            <!-- Meeting Minutes Content -->
            <div id="meetingMinutesContent" class="prose prose-lg dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900 rounded-xl p-6" dir="rtl">
                <!-- Content will be inserted here -->
            </div>
        </div>
    </div>
</div>

<style>
.meeting-minutes-container {
    direction: rtl;
}

#dropZone.dragover {
    border-color: var(--q-info);
    background-color: rgba(59, 130, 246, 0.05);
}

.prose {
    text-align: right;
}

.prose h2 {
    color: var(--q-text);
    border-bottom: 2px solid var(--q-info);
    padding-bottom: 0.5rem;
    margin-top: 2rem;
}

[data-theme="dark"] .prose h2 {
    color: var(--q-gray-100);
}

.prose ul {
    list-style-type: disc;
    padding-right: 1.5rem;
}

.prose li {
    margin-bottom: 0.5rem;
}
</style>

<script>
let mediaRecorder = null;
let audioChunks = [];
let recordingStartTime = null;
let timerInterval = null;
let uploadedAudioFile = null;
let audioContext = null;
let analyser = null;
let animationId = null;
let currentMeetingMinuteId = null;

// Set default date and time
document.addEventListener('DOMContentLoaded', function() {
    const now = new Date();
    const dateInput = document.getElementById('meetingDate');
    const timeInput = document.getElementById('meetingTime');

    if (dateInput) dateInput.valueAsDate = now;
    if (timeInput) timeInput.value = now.toTimeString().slice(0, 5);

    // Setup drag and drop
    if (typeof setupDragAndDrop === 'function') {
        setupDragAndDrop();
    }
});
</script>