<?php

namespace App\QSpark\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SubmitAnswerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'question_id' => 'required|integer|min:0',
            'answer_index' => 'required|integer|min:0|max:3',
            'time_taken' => 'required|numeric|min:0|max:60',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'question_id.required' => 'Question ID is required.',
            'question_id.integer' => 'Question ID must be an integer.',
            'answer_index.required' => 'Answer index is required.',
            'answer_index.integer' => 'Answer index must be an integer.',
            'answer_index.min' => 'Answer index must be between 0 and 3.',
            'answer_index.max' => 'Answer index must be between 0 and 3.',
            'time_taken.required' => 'Time taken is required.',
            'time_taken.numeric' => 'Time taken must be a number.',
            'time_taken.min' => 'Time taken cannot be negative.',
            'time_taken.max' => 'Time taken cannot exceed 60 seconds.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}

