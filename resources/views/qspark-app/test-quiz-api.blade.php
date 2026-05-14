<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz API Test - QSpark</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .button { padding: 10px 20px; margin: 10px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .button:hover { background: #005a87; }
        .button:disabled { background: #ccc; cursor: not-allowed; }
        .output { background: #f8f9fa; padding: 15px; border-radius: 4px; white-space: pre-wrap; font-family: monospace; max-height: 400px; overflow-y: auto; border: 1px solid #e9ecef; }
        .error { background: #ffe6e6; border-color: #ff9999; }
        .success { background: #e6ffe6; border-color: #99ff99; }
        .warning { background: #fff3cd; border-color: #ffeaa7; }
        .input-group { margin: 10px 0; }
        .input-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .input-group input, .input-group textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        .status { padding: 10px; border-radius: 4px; margin: 10px 0; }
        .loading { opacity: 0.6; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Quiz API Test - QSpark</h1>
        <p>This page helps debug the quiz generation API endpoints.</p>
        
        <div class="section">
            <h2>Authentication Status</h2>
            <div id="authStatus" class="status">
                @if(session('qspark_token'))
                    <div class="success">✅ Token found in session</div>
                @else
                    <div class="error">❌ No token found in session. Please <a href="/fetch-token">get a token</a> first.</div>
                @endif
            </div>
        </div>
        
        <div class="section">
            <h2>Step 1: Generate Quiz</h2>
            <p>Test the quiz generation endpoint</p>
            <div class="input-group">
                <label>Quiz URL:</label>
                <input type="text" id="quizUrl" value="https://api-test.qu.edu.sa/api/v2/courses/_478399_1/contents/_3634321_1/attachments/_5188772_1/generate-quiz" style="font-size: 12px;">
            </div>
            <button class="button" onclick="testGenerateQuiz()" id="generateBtn">Generate Quiz</button>
            <div id="generateOutput" class="output"></div>
        </div>
        
        <div class="section">
            <h2>Step 2: Get Quiz Results</h2>
            <p>Test the quiz results endpoint (requires thread_id from step 1)</p>
            <div class="input-group">
                <label>Thread ID:</label>
                <input type="text" id="threadIdInput" placeholder="Enter thread_id from step 1">
            </div>
            <button class="button" onclick="testGetQuizResults()" id="resultsBtn">Get Quiz Results</button>
            <button class="button" onclick="pollQuizResults()" id="pollBtn">Poll Results (Auto)</button>
            <div id="resultsOutput" class="output"></div>
        </div>
        
        <div class="section">
            <h2>Step 3: Parse Questions</h2>
            <p>Test question parsing from API response</p>
            <div class="input-group">
                <label>API Response:</label>
                <textarea id="responseInput" placeholder="Paste API response here" rows="5"></textarea>
            </div>
            <button class="button" onclick="testParseQuestions()">Parse Questions</button>
            <div id="parseOutput" class="output"></div>
        </div>
        
        <div class="section">
            <h2>Step 4: Test Instruction Detection</h2>
            <p>Test if the system correctly identifies instruction messages</p>
            <button class="button" onclick="testInstructionDetection()">Test Instruction Detection</button>
            <div id="instructionOutput" class="output"></div>
        </div>

        <div class="section">
            <h2>Debug Information</h2>
            <div id="debugInfo" class="output">
                Session Token: {{ session('qspark_token') ? 'Present' : 'Missing' }}
                User Agent: <span id="userAgent"></span>
                Current Time: <span id="currentTime"></span>
            </div>
        </div>
    </div>

    <script>
        const token = @json(session('qspark_token'));
        let currentThreadId = null;
        let pollInterval = null;

        // Update debug info
        document.getElementById('userAgent').textContent = navigator.userAgent;
        document.getElementById('currentTime').textContent = new Date().toISOString();

        function log(elementId, message, type = 'info') {
            const element = document.getElementById(elementId);
            const timestamp = new Date().toLocaleTimeString();
            element.textContent += `[${timestamp}] ${message}\n`;
            
            element.className = `output`;
            if (type === 'error') element.className += ' error';
            else if (type === 'success') element.className += ' success';
            else if (type === 'warning') element.className += ' warning';
            
            element.scrollTop = element.scrollHeight;
        }

        function clearLog(elementId) {
            document.getElementById(elementId).textContent = '';
        }

        async function testGenerateQuiz() {
            const btn = document.getElementById('generateBtn');
            const url = document.getElementById('quizUrl').value;
            
            if (!token) {
                log('generateOutput', 'Error: No authentication token available', 'error');
                return;
            }
            
            clearLog('generateOutput');
            btn.disabled = true;
            btn.textContent = 'Generating...';
            
            try {
                log('generateOutput', `Starting quiz generation for URL: ${url}`);
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        adaptive_learning: true
                    })
                });
                
                log('generateOutput', `Response status: ${response.status} ${response.statusText}`);
                log('generateOutput', `Content-Type: ${response.headers.get('content-type')}`);
                
                const responseText = await response.text();
                log('generateOutput', `Raw response (${responseText.length} chars): ${responseText.substring(0, 500)}${responseText.length > 500 ? '...' : ''}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${responseText}`);
                }
                
                const data = JSON.parse(responseText);
                log('generateOutput', `Parsed response: ${JSON.stringify(data, null, 2)}`, 'success');
                
                if (data.thread_id) {
                    currentThreadId = data.thread_id;
                    document.getElementById('threadIdInput').value = currentThreadId;
                    log('generateOutput', `Thread ID saved: ${currentThreadId}`, 'success');
                }
                
            } catch (error) {
                log('generateOutput', `Error: ${error.message}`, 'error');
                console.error('Generate quiz error:', error);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Generate Quiz';
            }
        }

        async function testGetQuizResults() {
            const btn = document.getElementById('resultsBtn');
            const threadId = document.getElementById('threadIdInput').value || currentThreadId;
            
            if (!token) {
                log('resultsOutput', 'Error: No authentication token available', 'error');
                return;
            }
            
            if (!threadId) {
                log('resultsOutput', 'Error: No thread_id provided', 'error');
                return;
            }
            
            clearLog('resultsOutput');
            btn.disabled = true;
            btn.textContent = 'Getting Results...';
            
            try {
                log('resultsOutput', `Getting quiz results for thread: ${threadId}`);
                
                const response = await fetch(`https://api-test.qu.edu.sa/api/v2/courses/get-quiz-result?thread_id=${threadId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });
                
                log('resultsOutput', `Response status: ${response.status} ${response.statusText}`);
                log('resultsOutput', `Content-Type: ${response.headers.get('content-type')}`);
                
                const responseText = await response.text();
                log('resultsOutput', `Raw response (${responseText.length} chars): ${responseText.substring(0, 500)}${responseText.length > 500 ? '...' : ''}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${responseText}`);
                }
                
                const data = JSON.parse(responseText);
                log('resultsOutput', `Parsed response: ${JSON.stringify(data, null, 2)}`, 'success');
                
                // Try to extract questions
                const questions = extractQuestionsFromPayload(data);
                if (questions && questions.length > 0) {
                    log('resultsOutput', `Successfully extracted ${questions.length} questions:`, 'success');
                    log('resultsOutput', JSON.stringify(questions, null, 2));
                } else {
                    log('resultsOutput', 'No questions found in response', 'warning');
                }
                
            } catch (error) {
                log('resultsOutput', `Error: ${error.message}`, 'error');
                console.error('Get quiz results error:', error);
            } finally {
                btn.disabled = false;
                btn.textContent = 'Get Quiz Results';
            }
        }

        async function pollQuizResults() {
            const btn = document.getElementById('pollBtn');
            const threadId = document.getElementById('threadIdInput').value || currentThreadId;
            
            if (!threadId) {
                log('resultsOutput', 'Error: No thread_id provided for polling', 'error');
                return;
            }
            
            if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
                btn.textContent = 'Poll Results (Auto)';
                return;
            }
            
            clearLog('resultsOutput');
            btn.textContent = 'Stop Polling';
            
            let attempts = 0;
            const maxAttempts = 20;
            
            pollInterval = setInterval(async () => {
                attempts++;
                
                if (attempts > maxAttempts) {
                    clearInterval(pollInterval);
                    pollInterval = null;
                    btn.textContent = 'Poll Results (Auto)';
                    log('resultsOutput', 'Polling stopped: Maximum attempts reached', 'warning');
                    return;
                }
                
                try {
                    log('resultsOutput', `Polling attempt ${attempts}/${maxAttempts}...`);
                    
                    const response = await fetch(`https://api-test.qu.edu.sa/api/v2/courses/get-quiz-result?thread_id=${threadId}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Accept": "application/json"
                        }
                    });
                    
                    if (!response.ok) {
                        log('resultsOutput', `Attempt ${attempts}: HTTP ${response.status}`, 'warning');
                        return;
                    }
                    
                    const responseText = await response.text();
                    const data = JSON.parse(responseText);

                    log('resultsOutput', `Attempt ${attempts}: ${JSON.stringify(data, null, 2)}`);

                    if (!data.success) {
                        log('resultsOutput', `Attempt ${attempts}: Not successful yet, continuing...`, 'warning');
                        return;
                    }

                    const raw = data?.message ?? data?.data ?? data;

                    // Check if this is an instruction message
                    const isInstructionMessage = typeof raw === 'string' && (
                        raw.includes('Read the attached PDF') ||
                        raw.includes('First detect the content language') ||
                        (raw.includes('generate') && raw.includes('questions') && !raw.includes('"question"'))
                    );

                    if (isInstructionMessage) {
                        log('resultsOutput', `Attempt ${attempts}: Received instruction message, continuing to poll...`, 'warning');
                        log('resultsOutput', `Message: ${raw.substring(0, 200)}...`);
                        return;
                    }

                    const questions = extractQuestionsFromPayload(data);
                    if (questions && questions.length > 0) {
                        clearInterval(pollInterval);
                        pollInterval = null;
                        btn.textContent = 'Poll Results (Auto)';
                        log('resultsOutput', `SUCCESS! Found ${questions.length} questions:`, 'success');
                        log('resultsOutput', JSON.stringify(questions, null, 2));
                    } else {
                        log('resultsOutput', `Attempt ${attempts}: No valid questions found, continuing...`, 'warning');
                    }
                    
                } catch (error) {
                    log('resultsOutput', `Attempt ${attempts} error: ${error.message}`, 'error');
                }
            }, 3000);
        }

        function testParseQuestions() {
            const responseText = document.getElementById('responseInput').value;

            if (!responseText) {
                log('parseOutput', 'Error: No response text provided', 'error');
                return;
            }

            clearLog('parseOutput');

            try {
                log('parseOutput', 'Parsing response text...');
                log('parseOutput', `Input (${responseText.length} chars): ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);

                // Try to parse as JSON first
                let data;
                try {
                    data = JSON.parse(responseText);
                    log('parseOutput', `Successfully parsed as JSON: ${JSON.stringify(data, null, 2)}`);
                } catch (e) {
                    log('parseOutput', `Not valid JSON, treating as text: ${e.message}`, 'warning');
                    data = responseText;
                }

                const questions = extractQuestionsFromPayload(data);
                if (questions && questions.length > 0) {
                    log('parseOutput', `Successfully extracted ${questions.length} questions:`, 'success');
                    log('parseOutput', JSON.stringify(questions, null, 2));
                } else {
                    log('parseOutput', 'No questions could be extracted from the response', 'warning');
                }

            } catch (error) {
                log('parseOutput', `Error: ${error.message}`, 'error');
                console.error('Parse questions error:', error);
            }
        }

        function testInstructionDetection() {
            clearLog('instructionOutput');

            const testCases = [
                {
                    name: 'Instruction Message 1',
                    text: 'Read the attached PDF file. First detect the content language, then generate 10 multiple-choice questions...',
                    shouldBeInstruction: true
                },
                {
                    name: 'Instruction Message 2',
                    text: 'First detect the content language, then generate questions in the same language',
                    shouldBeInstruction: true
                },
                {
                    name: 'Valid Questions JSON',
                    text: '[{"question": "What is 2+2?", "options": ["3", "4", "5"], "correctIndex": 1}]',
                    shouldBeInstruction: false
                },
                {
                    name: 'Valid Questions Object',
                    text: '{"questions": [{"question": "Test?", "options": ["A", "B"], "correctIndex": 0}]}',
                    shouldBeInstruction: false
                },
                {
                    name: 'Generate keyword without questions',
                    text: 'Please generate a report about the content',
                    shouldBeInstruction: false
                }
            ];

            testCases.forEach((testCase, index) => {
                log('instructionOutput', `\n--- Test Case ${index + 1}: ${testCase.name} ---`);
                log('instructionOutput', `Text: ${testCase.text}`);

                // Test instruction detection
                const isInstruction = testCase.text.includes('Read the attached PDF file') ||
                                     testCase.text.includes('First detect the content language') ||
                                     testCase.text.includes('generate 10 multiple-choice questions') ||
                                     (testCase.text.includes('generate') && testCase.text.includes('questions') && !testCase.text.includes('"question"') && !testCase.text.includes('['));

                const result = isInstruction === testCase.shouldBeInstruction ? 'PASS' : 'FAIL';
                const resultType = result === 'PASS' ? 'success' : 'error';

                log('instructionOutput', `Expected: ${testCase.shouldBeInstruction ? 'Instruction' : 'Not Instruction'}`, resultType);
                log('instructionOutput', `Detected: ${isInstruction ? 'Instruction' : 'Not Instruction'}`, resultType);
                log('instructionOutput', `Result: ${result}`, resultType);

                // Test question extraction
                const questions = extractQuestionsFromText(testCase.text);
                log('instructionOutput', `Questions extracted: ${questions.length}`);
            });
        }

        // Copy the same extraction functions from the main code
        function extractQuestionsFromPayload(payload) {
            if (!payload) return null;
            
            if (Array.isArray(payload)) {
                return payload.length > 0 ? payload : null;
            }
            
            if (typeof payload === 'object') {
                if (Array.isArray(payload.questions)) {
                    return payload.questions;
                }
                if (payload.data && Array.isArray(payload.data.questions)) {
                    return payload.data.questions;
                }
                if (typeof payload.message === 'string') {
                    const fromMessage = extractQuestionsFromText(payload.message);
                    if (fromMessage?.length) return fromMessage;
                }
            }
            
            return extractQuestionsFromText(String(payload));
        }

        function extractQuestionsFromText(text) {
            if (!text) return [];

            // Skip instruction messages - be more specific about detection
            const isInstructions = text.includes('Read the attached PDF file') ||
                                   text.includes('First detect the content language') ||
                                   text.includes('generate 10 multiple-choice questions') ||
                                   (text.includes('generate') && text.includes('questions') && !text.includes('"question"') && !text.includes('['));
            if (isInstructions) {
                console.log('Skipping instruction message:', text.substring(0, 100) + '...');
                return [];
            }

            // Try to extract JSON from code blocks first
            let block = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
            if (block && block[1]) {
                const parsed = tryJsonParse(block[1].trim());
                if (parsed) {
                    const q = extractQuestionsFromPayload(parsed);
                    if (Array.isArray(q) && q.length > 0) return q;
                }
            }

            // Try to parse the entire text as JSON
            let parsed = tryJsonParse(text.trim());
            if (parsed) {
                const q = extractQuestionsFromPayload(parsed);
                if (Array.isArray(q) && q.length > 0) return q;
            }

            // Try to find JSON array in the text
            const arrStart = text.indexOf('['), arrEnd = text.lastIndexOf(']');
            if (arrStart !== -1 && arrEnd > arrStart) {
                const jsonStr = text.slice(arrStart, arrEnd + 1);
                parsed = tryJsonParse(jsonStr.trim());
                if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map(q => ({
                        question: q.question || q.text || 'Question',
                        options: q.options || q.choices || ['A','B','C','D'],
                        correctIndex: q.options && q.correct_answer ? q.options.indexOf(q.correct_answer) : (typeof q.correctIndex==='number'?q.correctIndex:0),
                        type: q.type || 'enemy',
                        difficulty: q.difficulty || 'easy'
                    }));
                }
            }

            return [];
        }

        function tryJsonParse(str) {
            if (!str || typeof str !== 'string') return null;
            try { 
                const cleaned = str.trim()
                    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
                    .replace(/,\s*}/g, '}')
                    .replace(/,\s*]/g, ']');
                return JSON.parse(cleaned); 
            } catch (e) { 
                return null; 
            }
        }
    </script>
</body>
</html>
