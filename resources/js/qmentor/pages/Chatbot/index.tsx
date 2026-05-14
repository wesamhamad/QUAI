import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { UserCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ConversationSidebar from './components/ConversationSidebar';
import QuickActions from './components/QuickActions';
import SmartSuggestions from './components/SmartSuggestions';
import { useSmartAdvisor } from '../../hooks/useSmartAdvisor';
import { useStudentProfile, useCurrentCourses } from '../../hooks/useStudentData';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import type { Conversation, Message, AttachmentData } from './types';

let nextMsgId = 100;

export default function Chatbot() {
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';

  const profileResult = useStudentProfile(null);
  const coursesResult = useCurrentCourses(null);

  const {
    sendMessage: sendToAdvisor,
    fetchConversations,
    fetchHistory,
    escalate,
    abort: abortStream,
    isStreaming,
    streamingContent,
    error: apiError,
    generateConversationId,
  } = useSmartAdvisor();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMsgIdRef = useRef<string | null>(null);
  const isSendingRef = useRef(false);

  const activeConv = conversations.find(c => c.id === activeConvId) ?? null;

  // Load conversations from API on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const apiConvs = await fetchConversations();
      if (cancelled) return;

      if (apiConvs.length > 0) {
        const mapped: Conversation[] = apiConvs.map(c => ({
          id: c.id,
          title: c.title || 'محادثة',
          titleEn: c.title || 'Conversation',
          lastMessage: c.last_message || '',
          lastMessageEn: c.last_message || '',
          timestamp: c.updated_at,
          pinned: false,
          archived: c.status === 'archived',
          messages: [],
        }));
        setConversations(mapped);
        setActiveConvId(mapped[0].id);

        // Load history for the first conversation
        const history = await fetchHistory(mapped[0].id);
        if (!cancelled && history.length > 0) {
          const messages: Message[] = history.map(m => ({
            id: `msg-api-${m.id}`,
            conversationId: mapped[0].id,
            role: m.role as 'user' | 'assistant',
            type: 'text' as const,
            content: m.content,
            contentEn: m.content,
            timestamp: m.created_at,
            language: /[\u0600-\u06FF]/.test(m.content) ? 'ar' as const : 'en' as const,
            status: 'read' as const,
          }));
          setConversations(prev => prev.map(c =>
            c.id === mapped[0].id ? { ...c, messages } : c
          ));
        }
      } else {
        // No API conversations - create a fresh one
        const newId = generateConversationId();
        const fresh: Conversation = {
          id: newId,
          title: 'محادثة جديدة',
          titleEn: 'New Conversation',
          lastMessage: '',
          lastMessageEn: '',
          timestamp: new Date().toISOString(),
          pinned: false,
          archived: false,
          messages: [],
        };
        setConversations([fresh]);
        setActiveConvId(newId);
      }
      setLoadingConversations(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Load history when switching conversations
  const handleSelectConversation = useCallback(async (id: string) => {
    setActiveConvId(id);
    const conv = conversations.find(c => c.id === id);
    if (conv && conv.messages.length === 0) {
      const history = await fetchHistory(id);
      if (history.length > 0) {
        const messages: Message[] = history.map(m => ({
          id: `msg-api-${m.id}`,
          conversationId: id,
          role: m.role as 'user' | 'assistant',
          type: 'text' as const,
          content: m.content,
          contentEn: m.content,
          timestamp: m.created_at,
          language: /[\u0600-\u06FF]/.test(m.content) ? 'ar' as const : 'en' as const,
          status: 'read' as const,
        }));
        setConversations(prev => prev.map(c =>
          c.id === id ? { ...c, messages } : c
        ));
      }
    }
  }, [conversations, fetchHistory]);

  // Update streaming message in real-time
  useEffect(() => {
    if (!isStreaming || !streamingContent || !streamingMsgIdRef.current) return;
    const msgId = streamingMsgIdRef.current;
    setConversations(prev => prev.map(c =>
      c.id === activeConvId
        ? {
            ...c,
            messages: c.messages.map(m =>
              m.id === msgId ? { ...m, content: streamingContent, contentEn: streamingContent } : m
            ),
          }
        : c
    ));
  }, [streamingContent, isStreaming, activeConvId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages.length, streamingContent, scrollToBottom]);

  const handleSend = useCallback(async (text: string, _attachment?: AttachmentData) => {
    if (!activeConvId || isStreaming || isSendingRef.current) return;
    isSendingRef.current = true;

    const userMsg: Message = {
      id: `msg-${++nextMsgId}`,
      conversationId: activeConvId,
      role: 'user',
      type: 'text',
      content: text,
      contentEn: text,
      timestamp: new Date().toISOString(),
      language: isAr ? 'ar' : 'en',
      status: 'sent',
    };

    // Add user message
    setConversations(prev =>
      prev.map(c =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, userMsg], lastMessage: text, lastMessageEn: text, timestamp: userMsg.timestamp }
          : c
      )
    );

    // Mark as delivered
    setTimeout(() => {
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConvId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === userMsg.id ? { ...m, status: 'delivered' as const } : m
                ),
              }
            : c
        )
      );
    }, 300);

    // Create placeholder AI message for streaming
    const aiMsgId = `msg-${++nextMsgId}`;
    streamingMsgIdRef.current = aiMsgId;

    const aiPlaceholder: Message = {
      id: aiMsgId,
      conversationId: activeConvId,
      role: 'assistant',
      type: 'text',
      content: '',
      contentEn: '',
      timestamp: new Date().toISOString(),
      language: isAr ? 'ar' : 'en',
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [
                ...c.messages.map(m =>
                  m.id === userMsg.id ? { ...m, status: 'read' as const } : m
                ),
                aiPlaceholder,
              ],
            }
          : c
      )
    );

    // Stream response from API
    try {
      const result = await sendToAdvisor(text, activeConvId);
      streamingMsgIdRef.current = null;

      // Finalize the AI message with full content
      setConversations(prev =>
        prev.map(c =>
          c.id === activeConvId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === aiMsgId
                    ? {
                        ...m,
                        content: result.content || (isAr ? 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Sorry, an error occurred. Please try again.'),
                        contentEn: result.content || 'Sorry, an error occurred. Please try again.',
                      }
                    : m
                ),
                lastMessage: result.content?.slice(0, 100) || '',
                lastMessageEn: result.content?.slice(0, 100) || '',
                // Update conversation title from first user message
                title: c.messages.length <= 2 ? text.slice(0, 40) : c.title,
                titleEn: c.messages.length <= 2 ? text.slice(0, 40) : c.titleEn,
              }
            : c
        )
      );
    } finally {
      isSendingRef.current = false;
    }
  }, [activeConvId, isAr, isStreaming, sendToAdvisor]);

  const handleEscalate = useCallback(async () => {
    if (!activeConvId) return;
    const query = isAr ? 'أريد التحدث مع مرشدي الأكاديمي' : 'I want to talk to my academic advisor';

    await escalate(
      activeConvId,
      isAr ? 'طلب استشارة من المرشد الأكاديمي' : 'Request to speak with academic advisor',
      query,
      'general'
    );

    handleSend(query);
  }, [activeConvId, isAr, escalate, handleSend]);

  const handleNewConversation = useCallback(() => {
    const newId = generateConversationId();
    const newConv: Conversation = {
      id: newId,
      title: 'محادثة جديدة',
      titleEn: 'New Conversation',
      lastMessage: '',
      lastMessageEn: '',
      timestamp: new Date().toISOString(),
      pinned: false,
      archived: false,
      messages: [],
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newId);
  }, [generateConversationId]);

  const suggestions = activeConv?.messages.length
    ? [
        { label: 'ما هي الأنظمة واللوائح؟', labelEn: 'What are the regulations?' },
        { label: 'كيف أرفع معدلي؟', labelEn: 'How to improve my GPA?' },
        { label: 'ما هي مواد الفصل القادم؟', labelEn: 'What are next semester courses?' },
      ]
    : [];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } transition-all duration-300 overflow-hidden shrink-0 hidden lg:block`}
      >
        <ConversationSidebar
          conversations={conversations}
          activeId={activeConvId}
          onSelect={handleSelectConversation}
          onNew={handleNewConversation}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 start-0 w-72 z-50">
            <ConversationSidebar
              conversations={conversations}
              activeId={activeConvId}
              onSelect={id => {
                handleSelectConversation(id);
                setSidebarOpen(false);
              }}
              onNew={() => {
                handleNewConversation();
                setSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center">
          <ChatHeader
            onToggleMinimize={() => setMinimized(!minimized)}
            minimized={minimized}
          />
          <div className="pe-3"><DataSourceBadge source="api" /></div>
        </div>

        {/* API error banner */}
        {apiError && (
          <div className="mx-4 mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-error-100 dark:bg-error-500/10 border border-error-200 dark:border-error-800 text-error-700 dark:text-error-300 text-sm">
            <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />
            <span>{t('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.', 'Connection error. Please try again.')}</span>
          </div>
        )}

        {!minimized && (
          <>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
              {activeConv && activeConv.messages.length === 0 && !loadingConversations && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-sa-500 flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-2xl">Q</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {t('مرحباً بك في المرشد الذكي', 'Welcome to Smart Advisor')}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                    {t(
                      'أنا مساعدك الأكاديمي الذكي المدعوم بالذكاء الاصطناعي. اسألني أي شيء عن دراستك!',
                      'I am your AI-powered academic assistant. Ask me anything about your studies!'
                    )}
                  </p>
                  <QuickActions onAction={handleSend} />
                </div>
              )}

              {loadingConversations && (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-8 h-8 border-2 border-sa-600 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('جارٍ تحميل المحادثات...', 'Loading conversations...')}
                  </p>
                </div>
              )}

              {activeConv?.messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} onQuickReply={handleSend} />
              ))}

              {/* Streaming indicator (when AI message placeholder is empty and still streaming) */}
              {isStreaming && streamingMsgIdRef.current && !streamingContent && (
                <div className="flex justify-start mb-4">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-sa-500 flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-xs">Q</span>
                    </div>
                    <div className="bg-sa-50 dark:bg-gray-700 rounded-2xl rounded-es-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-sa-500 animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 rounded-full bg-sa-500 animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 rounded-full bg-sa-500 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Smart suggestions */}
            {activeConv && activeConv.messages.length > 0 && !isStreaming && (
              <SmartSuggestions suggestions={suggestions} onSelect={handleSend} />
            )}

            {/* Quick actions + Escalation button */}
            {activeConv && activeConv.messages.length > 0 && !isStreaming && (
              <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-100 dark:border-gray-700/50">
                <div className="flex-1 overflow-x-auto">
                  <QuickActions onAction={handleSend} />
                </div>
                <button
                  onClick={handleEscalate}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors shrink-0 border border-amber-200 dark:border-amber-800"
                >
                  <UserCircleIcon className="w-4 h-4" />
                  {t('تحدث مع المرشد', 'Talk to Advisor')}
                </button>
              </div>
            )}

            {/* Input */}
            <ChatInput onSend={handleSend} disabled={isStreaming} />
          </>
        )}
      </div>
    </div>
  );
}
