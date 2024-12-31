import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const phaseInfo = {
  1: {
    title: "Fase 1: Entendendo a Dor",
    description: "Você está na fase inicial do processo de cura. É normal sentir dor intensa e confusão neste momento. Nosso eBook vai te ajudar a compreender melhor seus sentimentos e começar sua jornada de recuperação.",
    ebook: "Guia para Compreender suas Emoções após um Término"
  },
  2: {
    title: "Fase 2: Desvinculando-se do Passado",
    description: "Você está no processo de desapego. Já consegue entender melhor seus sentimentos, mas ainda precisa de ajuda para se libertar completamente do passado. Nosso eBook vai te dar ferramentas práticas para isso.",
    ebook: "Guia para Libertar-se do Passado e Recomeçar"
  },
  3: {
    title: "Fase 3: Reconstruindo sua Força",
    description: "Você já avançou muito em sua jornada de cura! Agora é hora de fortalecer ainda mais sua autoestima e preparar-se para novas possibilidades. Nosso eBook vai te ajudar nesta fase de reconstrução.",
    ebook: "Guia para Fortalecer sua Autoestima e Abraçar Novos Começos"
  }
};

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const phase = parseInt(searchParams.get("phase") || "1");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Por favor, preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    
    toast({
      title: "Sucesso!",
      description: "Seu eBook foi enviado para seu email."
    });

    // Navigate to thank you page
    navigate("/thank-you");
  };

  const info = phaseInfo[phase as keyof typeof phaseInfo];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          {info.title}
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          {info.description}
        </p>

        <div className="bg-muted p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Seu eBook Gratuito:
          </h2>
          <p className="text-lg text-primary font-medium">
            {info.ebook}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nome *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email *
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Telefone (opcional)
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white py-6"
          >
            Receber meu eBook Gratuito
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Results;