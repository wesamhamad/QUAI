"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, GitCompare, BarChart3, AlertTriangle } from "lucide-react";

interface SuggestionsProps {
  onSelect: (question: string) => void;
  className?: string;
}

const suggestionGroups = [
  {
    category: "Trends",
    icon: TrendingUp,
    color: "bg-dga-primary-50 text-dga-primary-700 border-dga-primary-200 hover:bg-dga-primary-100",
    questions: [
      "What's the trend over time?",
      "Show month-over-month growth",
      "Which period had the highest values?",
    ],
  },
  {
    category: "Comparisons",
    icon: GitCompare,
    color: "bg-dga-info-50 text-dga-info-700 border-dga-info-200 hover:bg-dga-info-100",
    questions: [
      "Show top 10 by value",
      "Compare categories side by side",
      "What's the average by group?",
    ],
  },
  {
    category: "Distributions",
    icon: BarChart3,
    color: "bg-dga-lavender-50 text-dga-lavender-700 border-dga-lavender-200 hover:bg-dga-lavender-100",
    questions: [
      "Show the distribution of values",
      "What are the most common categories?",
      "Break down by percentage",
    ],
  },
  {
    category: "Anomalies",
    icon: AlertTriangle,
    color: "bg-dga-warning-50 text-dga-warning-700 border-dga-warning-200 hover:bg-dga-warning-100",
    questions: [
      "Find outliers in the data",
      "Are there any missing values?",
      "Show unusual patterns",
    ],
  },
];

export function QuerySuggestions({ onSelect, className }: SuggestionsProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {suggestionGroups.map((group) => (
        <div key={group.category}>
          <div className="flex items-center gap-1.5 mb-2">
            <group.icon className="h-3.5 w-3.5 text-dga-gray-500" />
            <span className="text-xs font-medium text-dga-gray-500 uppercase tracking-wide">
              {group.category}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.questions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onSelect(question)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                  group.color
                )}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
