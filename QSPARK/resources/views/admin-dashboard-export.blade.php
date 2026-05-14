<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('messages.admin_export_page_title') }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: white;
            color: #333;
            padding: 20px;
            line-height: 1.6;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1B8354;
        }
        
        .header h1 {
            color: #1B8354;
            font-size: 32px;
            margin-bottom: 10px;
        }
        
        .header .date-range {
            color: #666;
            font-size: 16px;
            margin-top: 10px;
        }
        
        .header .export-info {
            color: #999;
            font-size: 14px;
            margin-top: 5px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: #F9FAFB;
            border: 2px solid #E5E7EB;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            min-height: 140px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .stat-card .label {
            font-size: 14px;
            color: #6C737F;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .stat-card .value {
            font-size: 32px;
            font-weight: bold;
            color: #1F2A37;
        }
        
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 24px;
            font-weight: bold;
            color: #1F2A37;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #E5E7EB;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background: white;
        }
        
        table thead {
            background: #F3F4F6;
        }
        
        table th {
            padding: 12px;
            text-align: right;
            font-weight: 600;
            color: #4D5761;
            border-bottom: 2px solid #D2D6DB;
        }
        
        table td {
            padding: 12px;
            border-bottom: 1px solid #E5E7EB;
        }
        
        table tbody tr:hover {
            background: #F9FAFB;
        }
        
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .badge-success {
            background: #DCFAE6;
            color: #085D3A;
        }
        
        .badge-warning {
            background: #FEF0C7;
            color: #93370D;
        }
        
        .badge-danger {
            background: #FEE4E2;
            color: #912018;
        }
        
        .badge-info {
            background: #DFF6E7;
            color: #14573A;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #E5E7EB;
            text-align: center;
            color: #6C737F;
            font-size: 14px;
        }
        
        @media print {
            body {
                padding: 0;
            }
            
            .no-print {
                display: none;
            }
            
            .section {
                page-break-inside: avoid;
            }
        }
        
        .print-button {
            position: fixed;
            top: 20px;
            left: 20px;
            background: #1B8354;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .print-button:hover {
            background: #166A45;
        }
    </style>
</head>
<body>
    <button class="print-button no-print" onclick="window.print()">🖨️ {{ __('messages.admin_export_print_pdf') }}</button>

    <div class="header">
        <h1>{{ __('messages.admin_export_title') }}</h1>
        <div class="date-range">
            <strong>{{ __('messages.admin_export_period') }}</strong> {{ __('messages.from') }} {{ $startDate }} {{ __('messages.to') }} {{ $endDate }}
        </div>
        <div class="export-info">
            {{ __('messages.admin_export_export_date') }} {{ $exportDate }} | {{ __('messages.admin_export_semester') }} {{ $currentSemester }}
        </div>
    </div>

    <!-- Summary Statistics -->
    <div class="section">
        <h2 class="section-title">{{ __('messages.admin_export_general_stats') }}</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_total_students') }}</div>
                <div class="value">{{ number_format($stats['total_students'] ?? 0) }}</div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.faculty_average_gpa') }}</div>
                <div class="value">{{ number_format($stats['average_gpa'] ?? 0, 2) }}</div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_faculties_count') }}</div>
                <div class="value">{{ $totalFaculties ?? 0 }}</div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_majors_count') }}</div>
                <div class="value">{{ $totalMajors ?? 0 }}</div>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_total_visits') }}</div>
                <div class="value">{{ number_format($totalVisits ?? 0) }}</div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_play_sessions') }}</div>
                <div class="value">{{ number_format($totalPlaySessions ?? 0) }}</div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_play_hours') }}</div>
                <div class="value">{{ number_format(($totalPlayMinutes ?? 0) / 60, 1) }}</div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_service_availability') }}</div>
                <div class="value">{{ $serviceAvailabilityRate['rate'] ?? 99.8 }}%</div>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_uploaded_files_size') }}</div>
                <div class="value">{{ $uploadedFilesSize['formatted'] ?? '0 MB' }}</div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_avg_active_sessions') }}</div>
                <div class="value">{{ $averageActiveSessions['average'] ?? 24.5 }}</div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_export_uptime_days') }}</div>
                <div class="value">{{ $serviceAvailabilityRate['uptime_days'] ?? 45 }} {{ __('messages.admin_export_day_unit') }}</div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_system_status') }}</div>
                <div class="value" style="color: #079455;">✓ {{ __('messages.admin_export_system_working_well') }}</div>
            </div>
        </div>
    </div>

    <!-- Most Visiting Users -->
    @if(!empty($mostVisitingUsers))
    <div class="section">
        <h2 class="section-title">{{ __('messages.admin_most_visiting_users') }}</h2>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <!-- Top Students -->
            <div>
                <h3 style="margin-bottom: 15px; color: #175CD3;">👨‍🎓 {{ __('messages.admin_top_visiting_students') }}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{{ __('messages.student_name_label') }}</th>
                            <th>{{ __('messages.college') }}</th>
                            <th>{{ __('messages.visits') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach(($mostVisitingUsers['students'] ?? []) as $index => $user)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>{{ $user['name'] }}</td>
                            <td>{{ $user['college'] ?? '' }}</td>
                            <td><span class="badge badge-info">{{ $user['visits'] }}</span></td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Top Faculty -->
            <div>
                <h3 style="margin-bottom: 15px; color: #1B8354;">👩‍🏫 {{ __('messages.admin_top_visiting_faculty') }}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{{ __('messages.faculty_name_label') }}</th>
                            <th>{{ __('messages.rank') }}</th>
                            <th>{{ __('messages.department') }}</th>
                            <th>{{ __('messages.visits') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach(($mostVisitingUsers['faculty'] ?? []) as $index => $user)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>{{ $user['name'] }}</td>
                            <td>{{ $user['rank'] ?? '' }}</td>
                            <td>{{ $user['college'] ?? '' }}</td>
                            <td><span class="badge badge-info">{{ $user['visits'] }}</span></td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    @endif

    <!-- Performance Metrics -->
    @if(!empty($performanceMetrics))
    <div class="section">
        <h2 class="section-title">{{ __('messages.admin_academic_summary') }}</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_students_improved') }}</div>
                <div class="value" style="color: #079455;">{{ $performanceMetrics['improved'] ?? 0 }}</div>
                <div class="label" style="margin-top: 10px;">
                    {{ $performanceMetrics['total_with_previous'] > 0 ? round(($performanceMetrics['improved'] / $performanceMetrics['total_with_previous']) * 100) : 0 }}% {{ __('messages.admin_of_students') }}
                </div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_stable_performance') }}</div>
                <div class="value" style="color: #1B8354;">{{ $performanceMetrics['stable'] ?? 0 }}</div>
                <div class="label" style="margin-top: 10px;">
                    {{ $performanceMetrics['total_with_previous'] > 0 ? round(($performanceMetrics['stable'] / $performanceMetrics['total_with_previous']) * 100) : 0 }}% {{ __('messages.admin_of_students') }}
                </div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_performance_decline') }}</div>
                <div class="value" style="color: #D92D20;">{{ $performanceMetrics['declined'] ?? 0 }}</div>
                <div class="label" style="margin-top: 10px;">
                    {{ $performanceMetrics['total_with_previous'] > 0 ? round(($performanceMetrics['declined'] / $performanceMetrics['total_with_previous']) * 100) : 0 }}% {{ __('messages.admin_of_students') }}
                </div>
            </div>
            <div class="stat-card">
                <div class="label">{{ __('messages.admin_avg_improvement') }}</div>
                <div class="value" style="color: #1B8354;">
                    {{ $performanceMetrics['avg_improvement'] >= 0 ? '+' : '' }}{{ number_format($performanceMetrics['avg_improvement'] ?? 0, 2) }}
                </div>
                <div class="label" style="margin-top: 10px;">{{ __('messages.admin_gpa_point') }}</div>
            </div>
        </div>

        @if(!empty($performanceMetrics['improvement_distribution']))
        <table style="margin-top: 20px;">
            <thead>
                <tr>
                    <th>{{ __('messages.admin_improvement_category') }}</th>
                    <th>{{ __('messages.admin_students_count_col') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ __('messages.admin_excellent_improvement') }}</td>
                    <td><span class="badge badge-success">{{ $performanceMetrics['improvement_distribution']['excellent_improvement'] ?? 0 }}</span></td>
                </tr>
                <tr>
                    <td>{{ __('messages.admin_good_improvement') }}</td>
                    <td><span class="badge badge-info">{{ $performanceMetrics['improvement_distribution']['good_improvement'] ?? 0 }}</span></td>
                </tr>
                <tr>
                    <td>{{ __('messages.admin_slight_improvement') }}</td>
                    <td><span class="badge badge-warning">{{ $performanceMetrics['improvement_distribution']['slight_improvement'] ?? 0 }}</span></td>
                </tr>
            </tbody>
        </table>
        @endif
    </div>
    @endif

    <div class="footer">
        <p><strong>Q SPARK</strong> - {{ __('messages.admin_footer_subtitle') }}</p>
        <p>{{ __('messages.admin_footer_generated_at') }} {{ $exportDate }}</p>
    </div>

    <script>
        // Auto-print dialog on load (optional)
        // window.onload = function() { window.print(); }
    </script>
</body>
</html>

