@extends('layouts.app')

@section('title', 'Cache Status')

@section('content')
<div class="p-6">
    <div class="bg-white rounded-lg shadow-lg">
        <div class="p-6 border-b border-gray-200">
            <h1 class="text-2xl font-bold text-gray-900">Cache Status</h1>
            <p class="text-gray-600 mt-2">Monitor and manage the application cache system</p>
        </div>

        <div class="p-6">
            <!-- Cache Configuration -->
            <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="text-sm font-medium text-gray-500">Cache Store</div>
                        <div class="text-lg font-semibold text-gray-900">{{ $cacheStore }}</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="text-sm font-medium text-gray-500">Cache Prefix</div>
                        <div class="text-lg font-semibold text-gray-900">{{ $cachePrefix }}</div>
                    </div>
                </div>
            </div>

            <!-- Cache Statistics -->
            <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="text-sm font-medium text-gray-500">Estimated Cache Keys</div>
                    <div class="text-lg font-semibold text-gray-900">{{ $stats['estimated_keys'] }}</div>
                </div>
            </div>

            <!-- Sample Cache Keys -->
            <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Sample Cache Keys</h2>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cache Key
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Size (bytes)
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            @foreach($stats['sample_keys'] as $key)
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                    {{ Str::limit($key['key'], 60) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    @if($key['exists'])
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Cached
                                        </span>
                                    @else
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Not Cached
                                        </span>
                                    @endif
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ number_format($key['size']) }}
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Cache Management -->
            <div class="mb-8">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Cache Management</h2>
                <div class="flex space-x-4">
                    <button onclick="clearCache('views')" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Clear View Cache
                    </button>
                    <button onclick="clearCache('all')" 
                            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Clear All Cache
                    </button>
                    <button onclick="location.reload()" 
                            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Refresh Status
                    </button>
                </div>
            </div>

            @if(isset($stats['error']))
            <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="text-red-800">
                    <strong>Error:</strong> {{ $stats['error'] }}
                </div>
            </div>
            @endif
        </div>
    </div>
</div>

<script>
function clearCache(type) {
    if (confirm(`Are you sure you want to clear ${type} cache?`)) {
        fetch('/cache/clear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({ type: type })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
    }
}
</script>
@endsection
