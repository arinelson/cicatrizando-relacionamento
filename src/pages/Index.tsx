import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="max-w-2xl text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Cicatrizando Relacionamentos
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Descubra em qual fase da sua jornada de cura você está e receba um guia personalizado para ajudar na sua recuperação.
        </p>
        <Button
          onClick={() => navigate("/quiz")}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          Começar Minha Jornada
        </Button>
      </div>
    </div>
  );
};

export default Index;