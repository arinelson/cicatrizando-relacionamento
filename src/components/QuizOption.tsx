import { cn } from "@/lib/utils";

interface QuizOptionProps {
  text: string;
  selected: boolean;
  onClick: () => void;
}

export const QuizOption = ({ text, selected, onClick }: QuizOptionProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "quiz-option",
        selected && "selected"
      )}
    >
      {text}
    </div>
  );
};