"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { InsightCard } from "@/components/insights/insight-card";
import { TrendChart } from "@/components/insights/trend-chart";
import { AnomalyAlert } from "@/components/insights/anomaly-alert";
import { Badge } from "@/components/ui/badge";
import {
  getAnalysis,
  queryData,
  type AnalysisResult,
  type Insight,
  type ChartConfig,
} from "@/lib/api";
import {
  Sparkles,
  Brain,
  TrendingUp,
  GitCompare,
  AlertTriangle,
  BarChart3,
  Loader2,
  Send,
  RefreshCw,
} from "lucide-react";

export default function InsightsPage() {
  const params = useParams();
  const datasetId = params.id as string;

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NL query state
  const [query, setQuery] = useState("");
  const [queryAnswer, setQueryAnswer] = useState<string | null>(null);
  const [querying, setQuerying] = useState(false);

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetId]);

  async function fetchAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const result = await getAnalysis(datasetId);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleQuery(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setQuerying(true);
    setQueryAnswer(null);
    try {
      const result = await queryData(datasetId, query);
      setQueryAnswer(result.answer);
    } catch {
      setQueryAnswer("Failed to process query. Please try again.");
    } finally {
      setQuerying(false);
    }
  }

  // Categorize insights
  const overviewInsights =
    analysis?.insights.filter((i) => i.type === "overview") ?? [];
  const correlationInsights =
    analysis?.insights.filter((i) => i.type === "correlation") ?? [];
  const anomalyInsights =
    analysis?.insights.filter(
      (i) => i.type === "data_quality" || i.type === "high_cardinality"
    ) ?? [];
  const distributionInsights =
    analysis?.insights.filter(
      (i) => i.type === "distribution" || i.type === "categorical"
    ) ?? [];

  // Build trend chart data from numeric distribution insights
  const trendCharts = buildTrendCharts(distributionInsights);

  // Chart recommendations
  const chartRecommendations = analysis?.suggested_charts ?? [];

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-dga-primary-500" />
            <p className="mt-4 text-sm text-dga-gray-500">
              AI is analyzing your data...
            </p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-dga-error-500" />
            <p className="mt-4 text-sm text-dga-error-600">{error}</p>
            <button
              onClick={fetchAnalysis}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-dga-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-dga-primary-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Analysis
            </button>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-8 pb-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-dga-gray-900 flex items-center gap-2">
              <Brain className="h-6 w-6 text-dga-primary-600" />
              AI Insights
            </h1>
            <p className="mt-1 text-sm text-dga-gray-500">
              Automated analysis and recommendations for your dataset
            </p>
          </div>
          <button
            onClick={fetchAnalysis}
            className="inline-flex items-center gap-2 rounded-lg border border-dga-gray-200 bg-white px-3 py-2 text-sm font-medium text-dga-gray-700 hover:bg-dga-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Re-analyze
          </button>
        </div>

        {/* AI Summary */}
        <section>
          <SectionHeader icon={Sparkles} title="AI Summary" />
          <div className="mt-3 rounded-lg border border-dga-primary-200 bg-gradient-to-r from-dga-primary-50 to-white p-5">
            {overviewInsights.map((insight, i) => (
              <p key={i} className="text-sm text-dga-gray-700 leading-relaxed">
                {insight.description}
              </p>
            ))}
            {overviewInsights.length === 0 && (
              <p className="text-sm text-dga-gray-500">
                No overview insights generated.
              </p>
            )}
            <div className="mt-3 flex gap-3 text-xs text-dga-gray-500">
              <span>
                {analysis?.insights.length ?? 0} insights found
              </span>
              <span>
                {chartRecommendations.length} charts recommended
              </span>
            </div>
          </div>
        </section>

        {/* Key Findings */}
        <section>
          <SectionHeader icon={TrendingUp} title="Key Findings" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {distributionInsights.map((insight, i) => (
              <InsightCard
                key={i}
                type={insight.type}
                title={insight.title}
                description={insight.description}
                importance={insight.importance}
              />
            ))}
            {distributionInsights.length === 0 && (
              <p className="text-sm text-dga-gray-500 col-span-2">
                No distribution or categorical insights detected.
              </p>
            )}
          </div>
        </section>

        {/* Trend Detection */}
        {trendCharts.length > 0 && (
          <section>
            <SectionHeader icon={TrendingUp} title="Trend Detection" />
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              {trendCharts.map((chart, i) => (
                <TrendChart
                  key={i}
                  title={chart.title}
                  description={chart.description}
                  data={chart.data}
                  annotation={chart.annotation}
                />
              ))}
            </div>
          </section>
        )}

        {/* Correlation Highlights */}
        {correlationInsights.length > 0 && (
          <section>
            <SectionHeader icon={GitCompare} title="Correlation Highlights" />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {correlationInsights.map((insight, i) => (
                <InsightCard
                  key={i}
                  type={insight.type}
                  title={insight.title}
                  description={insight.description}
                  importance={insight.importance}
                />
              ))}
            </div>
          </section>
        )}

        {/* Anomaly Alerts */}
        {anomalyInsights.length > 0 && (
          <section>
            <SectionHeader icon={AlertTriangle} title="Anomaly Alerts" />
            <div className="mt-3 space-y-3">
              {anomalyInsights.map((insight, i) => (
                <AnomalyAlert
                  key={i}
                  title={insight.title}
                  description={insight.description}
                  severity={
                    insight.importance === "high"
                      ? "high"
                      : insight.importance === "medium"
                      ? "medium"
                      : "low"
                  }
                />
              ))}
            </div>
          </section>
        )}

        {/* Chart Recommendations */}
        {chartRecommendations.length > 0 && (
          <section>
            <SectionHeader icon={BarChart3} title="Recommended Charts" />
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {chartRecommendations.slice(0, 9).map((chart, i) => (
                <ChartRecommendationCard key={i} chart={chart} />
              ))}
            </div>
          </section>
        )}

        {/* Natural Language Query */}
        <section>
          <SectionHeader icon={Brain} title="Ask Your Data" />
          <form onSubmit={handleQuery} className="mt-3 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about your data..."
              className="flex-1 rounded-lg border border-dga-gray-200 px-4 py-2.5 text-sm text-dga-gray-900 placeholder:text-dga-gray-400 focus:border-dga-primary-500 focus:outline-none focus:ring-1 focus:ring-dga-primary-500"
            />
            <button
              type="submit"
              disabled={querying || !query.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-dga-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-dga-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {querying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Ask
            </button>
          </form>
          {queryAnswer && (
            <div className="mt-3 rounded-lg border border-dga-gray-200 bg-dga-gray-50 p-4">
              <p className="text-sm text-dga-gray-700 leading-relaxed whitespace-pre-wrap">
                {queryAnswer}
              </p>
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}

// --- Helper components ---

function SectionHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-dga-gray-900">
      <Icon className="h-5 w-5 text-dga-primary-600" />
      {title}
    </h2>
  );
}

const chartTypeLabels: Record<string, string> = {
  histogram: "Histogram",
  bar: "Bar Chart",
  scatter: "Scatter Plot",
  line: "Line Chart",
  pie: "Pie Chart",
  area: "Area Chart",
  heatmap: "Heatmap",
};

const chartTypeBadgeVariant: Record<string, "primary" | "info" | "success" | "warning"> = {
  histogram: "primary",
  bar: "info",
  scatter: "success",
  line: "warning",
  pie: "primary",
  area: "info",
  heatmap: "success",
};

function ChartRecommendationCard({ chart }: { chart: ChartConfig }) {
  return (
    <div className="rounded-lg border border-dga-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-dga-gray-900 line-clamp-1">
          {chart.title}
        </h4>
        <Badge variant={chartTypeBadgeVariant[chart.chart_type] ?? "primary"}>
          {chartTypeLabels[chart.chart_type] ?? chart.chart_type}
        </Badge>
      </div>
      <p className="text-xs text-dga-gray-500 line-clamp-2">
        {chart.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1">
        {chart.columns?.map((col) => (
          <span
            key={col}
            className="inline-flex items-center rounded bg-dga-gray-100 px-2 py-0.5 text-xs text-dga-gray-600"
          >
            {col}
          </span>
        ))}
        {chart.aggregation && (
          <span className="inline-flex items-center rounded bg-dga-lavender-50 px-2 py-0.5 text-xs text-dga-lavender-700">
            {chart.aggregation}
          </span>
        )}
      </div>
    </div>
  );
}

// Build simple trend visualization data from distribution insights
function buildTrendCharts(
  insights: Insight[]
): {
  title: string;
  description: string;
  data: { name: string; value: number }[];
  annotation?: { value: number; label: string };
}[] {
  return insights
    .filter((i) => i.type === "distribution" && i.description.includes("skewness="))
    .slice(0, 4)
    .map((insight) => {
      const match = insight.description.match(/skewness=([-\d.]+)/);
      const skewness = match ? parseFloat(match[1]) : 0;
      // Generate illustrative distribution shape
      const points = 10;
      const data = Array.from({ length: points }, (_, i) => {
        const x = i / (points - 1);
        // Skewed normal approximation
        const base = Math.exp(-Math.pow((x - 0.5 + skewness * 0.15) * 3, 2));
        return {
          name: `${Math.round(x * 100)}%`,
          value: Math.round(base * 100),
        };
      });

      return {
        title: insight.title,
        description: insight.description,
        data,
        annotation:
          Math.abs(skewness) > 1.5
            ? { value: 50, label: `Skew: ${skewness.toFixed(1)}` }
            : undefined,
      };
    });
}
