import { useState } from 'react';
import './QuizModal.css';

const QuizModal = ({ question, blockPosition, onAnswer }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index) => {
    if (answered) return;

    setSelectedIndex(index);
    setAnswered(true);

    const isCorrect = index === question.correctIndex;

    setTimeout(() => {
      onAnswer(isCorrect, blockPosition);
    }, 1200);
  };

  const getButtonClass = (index) => {
    if (!answered) return 'quiz-option';
    if (index === question.correctIndex) return 'quiz-option quiz-option--correct';
    if (index === selectedIndex) return 'quiz-option quiz-option--wrong';
    return 'quiz-option quiz-option--disabled';
  };

  return (
    <div className="quiz-modal-overlay">
      <div className="quiz-modal">
        <div className="quiz-modal__header">
          <div className="quiz-modal__icon">❓</div>
          <h2 className="quiz-modal__title">سؤال من جامعة القصيم</h2>
        </div>

        <div className="quiz-question">
          {question.question || question.text}
        </div>

        <div className="quiz-options">
          {(question.options || question.choices || []).map((option, index) => (
            <button
              key={index}
              className={getButtonClass(index)}
              onClick={() => handleSelect(index)}
              disabled={answered}
            >
              <span className="quiz-option__letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="quiz-option__text">{option}</span>
              {answered && index === question.correctIndex && (
                <span className="quiz-option__icon">✓</span>
              )}
              {answered && index === selectedIndex && index !== question.correctIndex && (
                <span className="quiz-option__icon">✗</span>
              )}
            </button>
          ))}
        </div>

        {answered && (
          <div className={`quiz-feedback ${selectedIndex === question.correctIndex ? 'quiz-feedback--correct' : 'quiz-feedback--wrong'}`}>
            {selectedIndex === question.correctIndex ? (
              <>
                <span className="quiz-feedback__icon">🎉</span>
                <span className="quiz-feedback__text">إجابة صحيحة! أحسنت!</span>
              </>
            ) : (
              <>
                <span className="quiz-feedback__icon">😔</span>
                <span className="quiz-feedback__text">إجابة خاطئة! حاول مرة أخرى</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;

