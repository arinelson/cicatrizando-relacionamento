import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="w-full max-w-2xl text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-primary mb-6">
          Obrigado!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Seu eBook está a caminho! Confira seu email para começar a próxima etapa da sua jornada de superação.
        </p>

        <p className="text-lg text-gray-500 mb-8">
          Não se esqueça de verificar sua caixa de spam caso não encontre o email na caixa de entrada.
        </p>

        <Button
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6"
        >
          Voltar para o Início
        </Button>
      </div>
    </div>
  );
};

export default ThankYou;