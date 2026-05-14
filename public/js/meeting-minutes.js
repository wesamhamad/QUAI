// Meeting Minutes JavaScript Functions
(function() {
    'use strict';

    // Private variables
    let mediaRecorder = null;
    let audioChunks = [];
    let recordingStartTime = null;
    let timerInterval = null;
    let uploadedAudioFile = null;
    let audioContext = null;
    let analyser = null;
    let animationId = null;
    let currentMeetingMinuteId = null;

    // Recording Functions
    window.startMeetingRecording = async function() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            uploadedAudioFile = new File([audioBlob], `recording_${Date.now()}.webm`, { type: 'audio/webm' });
            showUploadedFileInfo(uploadedAudioFile);
        };

        mediaRecorder.start();
        recordingStartTime = Date.now();

        // Update UI
        document.getElementById('startRecordingBtn').classList.add('hidden');
        document.getElementById('stopRecordingBtn').classList.remove('hidden');
        document.getElementById('pauseRecordingBtn').classList.remove('hidden');
        document.getElementById('recordingStatus').classList.remove('hidden');
        document.getElementById('audioVisualizer').classList.remove('hidden');

        // Start timer
        startTimer();

        // Start visualizer
        setupVisualizer(stream);

    } catch (error) {
        console.error('Error starting recording:', error);
        alert('فشل بدء التسجيل. تأكد من السماح بالوصول إلى الميكروفون.');
    }
    }

    window.stopMeetingRecording = function() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());

            // Update UI
            document.getElementById('startRecordingBtn').classList.remove('hidden');
            document.getElementById('stopRecordingBtn').classList.add('hidden');
            document.getElementById('pauseRecordingBtn').classList.add('hidden');
            document.getElementById('recordingStatus').classList.add('hidden');
            document.getElementById('audioVisualizer').classList.add('hidden');

            // Stop timer
            stopTimer();

            // Stop visualizer
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        }
    }

    window.pauseMeetingRecording = function() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
            document.getElementById('pauseRecordingBtn').innerHTML = `
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <span>استئناف</span>
            `;
        } else if (mediaRecorder && mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
            document.getElementById('pauseRecordingBtn').innerHTML = `
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
                <span>إيقاف مؤقت</span>
            `;
        }
    }

    window.handleAudioUpload = function(event) {
        const file = event.target.files[0];
        if (file) {
            handleFile(file);
        }
    }

    window.clearUploadedFile = function() {
        uploadedAudioFile = null;
        document.getElementById('audioFileInput').value = '';
        document.getElementById('uploadedFileInfo').classList.add('hidden');
    }

    window.processMeetingMinutes = async function() {
        // Validate inputs
        const title = document.getElementById('meetingTitle').value.trim();
        if (!title) {
            alert('الرجاء إدخال عنوان الاجتماع');
            return;
        }

        if (!uploadedAudioFile) {
            alert('الرجاء تسجيل أو رفع ملف صوتي أولاً');
            return;
        }

        // Show processing status
        document.getElementById('processingStatus').classList.remove('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('processMeetingBtn').disabled = true;

        try {
            // Step 1: Upload audio file
            updateProgress(10, 'رفع الملف الصوتي...');
            const formData = new FormData();
            formData.append('audio', uploadedAudioFile);
            formData.append('title', title);
            formData.append('date', document.getElementById('meetingDate').value);
            formData.append('time', document.getElementById('meetingTime').value);
            formData.append('location', document.getElementById('meetingLocation').value);
            formData.append('attendees', document.getElementById('meetingAttendees').value);

            const uploadResponse = await fetch('/api/v1/meeting-minutes/upload', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('فشل رفع الملف');
            }

            const uploadData = await uploadResponse.json();
            currentMeetingMinuteId = uploadData.meeting_minute_id;

            // Step 2: Transcribe audio using Whisper
            updateProgress(30, 'تفريغ التسجيل الصوتي...');
            await transcribeAudio(currentMeetingMinuteId);

            // Step 3: Analyze with ALLaM
            updateProgress(60, 'تحليل المحتوى بالذكاء الاصطناعي...');
            await analyzeWithALLaM(currentMeetingMinuteId);

            // Step 4: Generate document
            updateProgress(90, 'إنشاء المحضر...');
            await generateDocument(currentMeetingMinuteId);

            // Step 5: Display results
            updateProgress(100, 'اكتمل!');
            await displayResults(currentMeetingMinuteId);

        } catch (error) {
            console.error('Error processing meeting minutes:', error);
            alert('حدث خطأ أثناء معالجة المحضر: ' + error.message);
        } finally {
            document.getElementById('processMeetingBtn').disabled = false;
            setTimeout(() => {
                document.getElementById('processingStatus').classList.add('hidden');
            }, 1000);
        }
    }

    window.downloadMeetingMinutes = async function() {
        if (!currentMeetingMinuteId) {
            alert('لا يوجد محضر لتحميله');
            return;
        }

        window.location.href = `/api/v1/meeting-minutes/${currentMeetingMinuteId}/download`;
    }

    window.copyMeetingMinutes = function() {
        const content = document.getElementById('meetingMinutesContent').innerText;
        navigator.clipboard.writeText(content).then(() => {
            alert('تم نسخ المحضر');
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('فشل النسخ');
        });
    }

    window.resetMeetingMinutes = function() {
        if (confirm('هل تريد إنشاء محضر جديد؟ سيتم مسح البيانات الحالية.')) {
            // Reset all fields
            document.getElementById('meetingTitle').value = '';
            document.getElementById('meetingLocation').value = '';
            document.getElementById('meetingAttendees').value = '';
            window.clearUploadedFile();

            // Reset date and time to current
            const now = new Date();
            document.getElementById('meetingDate').valueAsDate = now;
            document.getElementById('meetingTime').value = now.toTimeString().slice(0, 5);

            // Hide results
            document.getElementById('resultsSection').classList.add('hidden');
            document.getElementById('processingStatus').classList.add('hidden');

            // Reset variables
            currentMeetingMinuteId = null;
            audioChunks = [];
        }
    }

    // Helper functions that need access to private variables
    function startTimer() {
        timerInterval = setInterval(() => {
            const elapsed = Date.now() - recordingStartTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);

            document.getElementById('recordingTimer').textContent =
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        document.getElementById('recordingTimer').textContent = '00:00:00';
    }

    function setupVisualizer(stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;

        const canvas = document.getElementById('visualizerCanvas');
        const canvasCtx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        function draw() {
            animationId = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            canvasCtx.fillStyle = 'rgb(243, 244, 246)';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height;

                const gradient = canvasCtx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
                gradient.addColorStop(0, '#3B82F6');
                gradient.addColorStop(1, '#6366F1');

                canvasCtx.fillStyle = gradient;
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        }

        draw();
    }

    function setupDragAndDrop() {
        const dropZone = document.getElementById('dropZone');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => {
                dropZone.classList.remove('dragover');
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        }, false);
    }

    function handleFile(file) {
        if (!file.type.startsWith('audio/')) {
            alert('الرجاء اختيار ملف صوتي');
            return;
        }

        uploadedAudioFile = file;
        showUploadedFileInfo(file);
    }

    function showUploadedFileInfo(file) {
        document.getElementById('uploadedFileName').textContent = file.name;
        document.getElementById('uploadedFileSize').textContent = formatFileSize(file.size);
        document.getElementById('uploadedFileInfo').classList.remove('hidden');
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    function updateProgress(percent, message) {
        document.getElementById('processingProgress').style.width = percent + '%';
        document.getElementById('processingPercent').textContent = percent + '%';
        document.getElementById('processingMessage').textContent = message;
    }

    async function transcribeAudio(meetingMinuteId) {
        const response = await fetch(`/api/v1/meeting-minutes/${meetingMinuteId}/transcribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        });

        if (!response.ok) {
            throw new Error('فشل تفريغ التسجيل');
        }

        return await response.json();
    }

    async function analyzeWithALLaM(meetingMinuteId) {
        const response = await fetch(`/api/v1/meeting-minutes/${meetingMinuteId}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                model: 'iKhalid/ALLaM:7b'
            })
        });

        if (!response.ok) {
            throw new Error('فشل تحليل المحتوى');
        }

        return await response.json();
    }

    async function generateDocument(meetingMinuteId) {
        const response = await fetch(`/api/v1/meeting-minutes/${meetingMinuteId}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        });

        if (!response.ok) {
            throw new Error('فشل إنشاء المحضر');
        }

        return await response.json();
    }

    async function displayResults(meetingMinuteId) {
        const response = await fetch(`/api/v1/meeting-minutes/${meetingMinuteId}`, {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        });

        if (!response.ok) {
            throw new Error('فشل جلب البيانات');
        }

        const data = await response.json();
        const meetingMinute = data.meeting_minute;

        // Build HTML content
        let html = `
            <h2>${meetingMinute.title}</h2>
            <div class="mb-4">
                <p><strong>التاريخ:</strong> ${meetingMinute.date || 'غير محدد'}</p>
                <p><strong>الوقت:</strong> ${meetingMinute.time || 'غير محدد'}</p>
                ${meetingMinute.location ? `<p><strong>المكان:</strong> ${meetingMinute.location}</p>` : ''}
            </div>
        `;

        if (meetingMinute.attendees && meetingMinute.attendees.length > 0) {
            html += `
                <h2>الحضور</h2>
                <ul>
                    ${meetingMinute.attendees.map(attendee => `<li>${attendee}</li>`).join('')}
                </ul>
            `;
        }

        if (meetingMinute.ai_summary) {
            html += `
                <h2>ملخص الاجتماع</h2>
                <p>${meetingMinute.ai_summary}</p>
            `;
        }

        if (meetingMinute.decisions && meetingMinute.decisions.length > 0) {
            html += `
                <h2>القرارات</h2>
                <ul>
                    ${meetingMinute.decisions.map(decision => `<li>${decision}</li>`).join('')}
                </ul>
            `;
        }

        if (meetingMinute.action_items && meetingMinute.action_items.length > 0) {
            html += `
                <h2>بنود العمل</h2>
                <ul>
                    ${meetingMinute.action_items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
        }

        document.getElementById('meetingMinutesContent').innerHTML = html;
        document.getElementById('resultsSection').classList.remove('hidden');
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof setupDragAndDrop === 'function') {
                setupDragAndDrop();
            }
        });
    } else {
        if (typeof setupDragAndDrop === 'function') {
            setupDragAndDrop();
        }
    }

})(); // End of IIFE
