<?php

namespace Database\Seeders\QSpark;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StudentQsparkRequestsSeeder extends Seeder
{
    public function run(): void
    {
        $csvFile = database_path('seeders/data/student_qspark_requests.csv');
        
        if (!file_exists($csvFile)) {
            $this->command->error("CSV file not found: {$csvFile}");
            return;
        }

        $handle = fopen($csvFile, 'r');
        $header = fgetcsv($handle, 0, ","); // Comma-separated
        
        // Debug: Show what columns we found
        $this->command->info("CSV columns found: " . implode(', ', $header));
        
        while (($row = fgetcsv($handle, 0, ",")) !== false) {
            $data = array_combine($header, $row);
            
            DB::table('student_qspark_requests')->insert([
                'student_id' => $data['student_id'],
                'qspark_id' => $data['skill_id'], // Using skill_id column as qspark_id
                'duration_unit' => $data['duration_unit'],
                'duration' => $data['duration'],
                'start_at' => Carbon::createFromFormat('d/m/Y', $data['start_at'])->format('Y-m-d'),
                'finish_at' => Carbon::createFromFormat('d/m/Y', $data['finish_at'])->format('Y-m-d'),
                'attachments' => $data['attachments'] ?: null,
                'status' => $data['status'],
                'notes' => $data['notes'] === 'NULL' ? null : $data['notes'],
                'deleted_at' => $data['deleted_at'] === 'NULL' ? null : $data['deleted_at'],
                'created_at' => Carbon::createFromFormat('d/m/Y H:i', $data['created_at']),
                'updated_at' => Carbon::createFromFormat('d/m/Y H:i', $data['updated_at']),
            ]);
        }
        
        fclose($handle);
    }
}
