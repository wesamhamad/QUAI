"use client";

import * as React from "react";
import { Send, Trash2, Brain, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryData, type QueryResult } from "@/lib/api";
import { QueryResultRenderer } from "./query-result";
import { QuerySuggestions } from "./suggestions";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  result?: QueryResult;
  timestamp: Date;
}

interface ChatInterfaceProps {
  datasetId: string;
  className?: string;
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-dga-primary-400 animate-bounce [animation-delay:0ms]" />
      <span className="h-2 w-2 rounded-full bg-dga-primary-400 animate-bounce [animation-delay:150ms]" />
      <span className="h-2 w-2 rounded-full bg-dga-primary-400 animate-bounce [animation-delay:300ms]" />
    </div>
  );
}

export function ChatInterface({ datasetId, className }: ChatInterfaceProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  async function handleSubmit(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await queryData(datasetId, trimmed);
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        result,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          err instanceof Error
            ? `Sorry, I couldn't process that query: ${err.message}`
            : "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSubmit(input);
  }

  function handleSuggestionSelect(question: string) {
    setInput(question);
    inputRef.current?.focus();
  }

  function clearConversation() {
    setMessages([]);
    setInput("");
  }

  const hasMessages = messages.length > 0;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-dga-gray-200 bg-white",
        className
      )}
      style={{ height: "calc(100vh - 180px)", minHeight: "500px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-dga-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-dga-primary-50 p-1.5">
            <Brain className="h-4 w-4 text-dga-primary-600" />
          </div>
          <span className="text-sm font-semibold text-dga-gray-900">
            AI Data Assistant
          </span>
        </div>
        {hasMessages && (
          <button
            type="button"
            onClick={clearConversation}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-dga-gray-500 hover:bg-dga-gray-50 hover:text-dga-gray-700 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!hasMessages && (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-3 rounded-full bg-dga-primary-50 p-4 w-fit">
                <Brain className="h-8 w-8 text-dga-primary-500" />
              </div>
              <h3 className="text-base font-semibold text-dga-gray-900">
                Ask anything about your data
              </h3>
              <p className="mt-1 text-sm text-dga-gray-500 max-w-md">
                Type a question in plain English or choose a suggestion below
              </p>
            </div>
            <QuerySuggestions
              onSelect={handleSuggestionSelect}
              className="max-w-2xl"
            />
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "assistant" && (
              <div className="mt-1 shrink-0 rounded-full bg-dga-primary-50 p-1.5 h-fit">
                <Brain className="h-4 w-4 text-dga-primary-600" />
              </div>
            )}
            <div
              className={cn(
                "rounded-xl px-4 py-3 max-w-[85%]",
                msg.role === "user"
                  ? "bg-dga-primary-50 text-dga-gray-900"
                  : "bg-dga-gray-50 text-dga-gray-900"
              )}
            >
              {msg.role === "user" ? (
                <p className="text-sm">{msg.content}</p>
              ) : msg.result ? (
                <QueryResultRenderer result={msg.result} />
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              )}
              <p className="mt-1.5 text-[10px] text-dga-gray-400">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {msg.role === "user" && (
              <div className="mt-1 shrink-0 rounded-full bg-dga-gray-100 p-1.5 h-fit">
                <User className="h-4 w-4 text-dga-gray-600" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="mt-1 shrink-0 rounded-full bg-dga-primary-50 p-1.5 h-fit">
              <Brain className="h-4 w-4 text-dga-primary-600" />
            </div>
            <div className="rounded-xl bg-dga-gray-50 px-4 py-3">
              <LoadingDots />
              <p className="mt-1 text-[10px] text-dga-gray-400">
                Analyzing your data...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion chips when there are messages */}
      {hasMessages && (
        <div className="border-t border-dga-gray-100 px-4 py-2">
          <div className="flex flex-wrap gap-1.5">
            {["Show top 10 by value", "What's the trend?", "Find anomalies", "Summarize the data"].map(
              (q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSuggestionSelect(q)}
                  className="rounded-full border border-dga-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-dga-gray-500 hover:bg-dga-gray-50 hover:text-dga-gray-700 transition-colors"
                >
                  {q}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <form
        onSubmit={handleFormSubmit}
        className="border-t border-dga-gray-200 px-4 py-3"
      >
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your data..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-dga-gray-200 px-4 py-2.5 text-sm text-dga-gray-900 placeholder:text-dga-gray-400 focus:border-dga-primary-500 focus:outline-none focus:ring-1 focus:ring-dga-primary-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-dga-primary-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-dga-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
