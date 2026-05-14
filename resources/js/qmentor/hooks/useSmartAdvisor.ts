import { useState, useCallback, useRef } from 'react';

const API_BASE = '/api/v1/smart-advisor';

function getCsrfToken(): string {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
}

function generateUUID(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export interface AdvisorConversation {
  id: string;
  title: string;
  last_message: string;
  updated_at: string;
  status: string;
}

export interface AdvisorMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

interface StreamChunk {
  content: string;
  done: boolean;
  error?: boolean;
  blocked?: boolean;
}

export function useSmartAdvisor() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  /**
   * Send a message and stream the response via SSE.
   * Returns the full response text when done.
   */
  const sendMessage = useCallback(async (
    message: string,
    conversationId: string,
    onChunk?: (content: string, fullText: string) => void,
  ): Promise<{ content: string; error?: boolean; blocked?: boolean }> => {
    // Abort any in-progress stream
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsStreaming(true);
    setStreamingContent('');
    setError(null);

    let fullText = '';
    let wasBlocked = false;
    let hadError = false;

    try {
      const response = await fetch(`${API_BASE}/chat-stream`, {
        method: 'POST',
        credentials: 'same-origin',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify({ message, conversation_id: conversationId }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const chunk: StreamChunk = JSON.parse(data);

            if (chunk.blocked) {
              wasBlocked = true;
              fullText = chunk.content;
              setStreamingContent(fullText);
              onChunk?.(chunk.content, fullText);
              continue;
            }

            if (chunk.error) {
              hadError = true;
              continue;
            }

            if (chunk.content && !chunk.done) {
              fullText += chunk.content;
              setStreamingContent(fullText);
              onChunk?.(chunk.content, fullText);
            }
          } catch {
            // skip unparseable chunks
          }
        }
      }

      return { content: fullText, error: hadError, blocked: wasBlocked };
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return { content: fullText };
      }
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      return { content: '', error: true };
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, []);

  /**
   * Fetch conversation list from the API.
   */
  const fetchConversations = useCallback(async (): Promise<AdvisorConversation[]> => {
    try {
      const res = await fetch(`${API_BASE}/conversations`, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json.conversations ?? json.data ?? [];
    } catch {
      return [];
    }
  }, []);

  /**
   * Fetch message history for a conversation.
   */
  const fetchHistory = useCallback(async (conversationId: string): Promise<AdvisorMessage[]> => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${conversationId}/history`, {
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json.messages ?? json.data ?? [];
    } catch {
      return [];
    }
  }, []);

  /**
   * Archive (delete) a conversation.
   */
  const archiveConversation = useCallback(async (conversationId: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${conversationId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
      });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  /**
   * Escalate to a human advisor.
   */
  const escalate = useCallback(async (
    conversationId: string,
    subject: string,
    details: string,
    category: string = 'general',
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/escalate`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          subject,
          details,
          category,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    sendMessage,
    fetchConversations,
    fetchHistory,
    archiveConversation,
    escalate,
    abort,
    isStreaming,
    streamingContent,
    error,
    generateConversationId: generateUUID,
  };
}
