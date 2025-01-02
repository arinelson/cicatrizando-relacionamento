import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { questions } from "@/data/questions";
import ProgressBar from "@/components/ProgressBar";
import QuizOption from "@/components/QuizOption";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const phase = calculatePhase(newAnswers);
      navigate("/results", { state: { phase } });
    }
  };

  const calculatePhase = (userAnswers: number[]) => {
    const sum = userAnswers.reduce((acc, curr) => acc + curr, 0);
    const average = sum / userAnswers.length;

    if (average <= 0.7) return 1;
    if (average <= 1.4) return 2;
    return 3;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="w-full max-w-2xl">
        <ProgressBar progress={progress} />
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {currentQuestion.text}
          </h2>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <QuizOption
                key={index}
                text={option}
                onClick={() => handleOptionSelect(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;