import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          { 
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          }
        ]);

      if (error) throw error;

      // Store user data in localStorage for later use
      localStorage.setItem('userData', JSON.stringify(formData));
      
      // Navigate to quiz
      navigate("/quiz");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao salvar seus dados",
        description: "Por favor, tente novamente",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="max-w-2xl text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          Cicatrizando Relacionamentos
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Descubra em qual fase da sua jornada de cura você está e receba um guia personalizado para ajudar na sua recuperação.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mb-8">
          <div>
            <Input
              type="text"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Seu email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="tel"
              placeholder="Seu telefone (com DDD)"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Começar Minha Jornada
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;