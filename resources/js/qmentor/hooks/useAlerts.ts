import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * التنبيهات — the platform alerts the risk engine wrote for the signed-in
 * student (GET /api/qmentor/risk/alerts) and marking one read
 * (POST /api/qmentor/risk/alerts/{id}/read). The server decides whose alerts:
 * the caller's own student id, or the demo student for a super admin.
 */
export interface RiskAlert {
  id: number;
  kind: string;
  level_from: number | null;
  level_to: number | null;
  score: number | null;
  top_factors: { id?: string; label: string; evidence?: string }[] | null;
  confidential: boolean;
  created_at: string;
  read_at: string | null;
  response: string | null;
}

export interface RiskAlertsPayload {
  student_id: string | null;
  unread: number;
  alerts: RiskAlert[];
}

function csrf(): string | undefined {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
}

export function useRiskAlerts() {
  const query = useQuery({
    queryKey: ['qmentor', 'risk', 'alerts'],
    queryFn: async (): Promise<{ data: RiskAlertsPayload | null; source: 'api' | 'unavailable' }> => {
      const res = await fetch('/api/qmentor/risk/alerts', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
      if (!res.ok) return { data: null, source: 'unavailable' };
      const body = await res.json();
      return { data: (body.data ?? null) as RiskAlertsPayload | null, source: body.source === 'api' ? 'api' : 'unavailable' };
    },
    retry: false,
    staleTime: 60 * 1000,
  });
  return {
    data: query.data?.data ?? null,
    source: query.data?.source ?? 'unavailable',
    isLoading: query.isLoading,
  };
}

export function useMarkAlertRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, response }: { id: number; response?: string }) => {
      const token = csrf();
      const res = await fetch(`/api/qmentor/risk/alerts/${id}/read`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(token ? { 'X-CSRF-TOKEN': token } : {}) },
        body: JSON.stringify(response ? { response } : {}),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['qmentor', 'risk', 'alerts'] }); },
  });
}
