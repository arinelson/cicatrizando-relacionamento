import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QuizOption } from "@/components/QuizOption";
import { ProgressBar } from "@/components/ProgressBar";
import { questions } from "@/data/questions";
import { useToast } from "@/components/ui/use-toast";

const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    // Load saved progress from localStorage
    const savedAnswers = localStorage.getItem("quiz_answers");
    const savedQuestion = localStorage.getItem("current_question");
    
    if (savedAnswers && savedQuestion) {
      setAnswers(JSON.parse(savedAnswers));
      setCurrentQuestion(parseInt(savedQuestion));
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage
    if (answers.length > 0) {
      localStorage.setItem("quiz_answers", JSON.stringify(answers));
      localStorage.setItem("current_question", currentQuestion.toString());
    }
  }, [answers, currentQuestion]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) {
      toast({
        title: "Por favor, selecione uma opção",
        variant: "destructive",
      });
      return;
    }

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      // Calculate result
      const phase = calculatePhase(newAnswers);
      navigate(`/results?phase=${phase}`);
      // Clear localStorage
      localStorage.removeItem("quiz_answers");
      localStorage.removeItem("current_question");
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
    }
  };

  const calculatePhase = (answers: number[]) => {
    const sum = answers.reduce((acc, curr) => acc + curr, 0);
    const average = sum / answers.length;
    
    if (average < 1) return 1;
    if (average < 2) return 2;
    return 3;
  };

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
        <ProgressBar current={currentQuestion + 1} total={questions.length} />
        
        <h2 className="text-2xl font-bold mt-6 mb-8">{question.text}</h2>
        
        <div className="space-y-4">
          {question.options.map((option, index) => (
            <QuizOption
              key={index}
              text={option}
              selected={selectedOption === index}
              onClick={() => handleOptionSelect(index)}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6"
          >
            {currentQuestion === questions.length - 1 ? "Ver Resultado" : "Próxima"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;