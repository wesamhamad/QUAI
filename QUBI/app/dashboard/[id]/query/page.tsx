"use client";

import { useParams } from "next/navigation";
import { Brain } from "lucide-react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ChatInterface } from "@/components/query/chat-interface";

export default function QueryPage() {
  const params = useParams();
  const datasetId = params.id as string;

  return (
    <PageWrapper>
      <div className="pb-4">
        {/* Page Header */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-dga-gray-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-dga-primary-600" />
            Ask Your Data
          </h1>
          <p className="mt-1 text-sm text-dga-gray-500">
            Ask questions about your dataset in plain English
          </p>
        </div>

        {/* Chat Interface */}
        <ChatInterface datasetId={datasetId} />
      </div>
    </PageWrapper>
  );
}
