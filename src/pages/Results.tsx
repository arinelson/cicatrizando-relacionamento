import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const phaseInfo = {
  1: {
    title: "Fase 1: Entendendo a Dor",
    description: "Você está na fase inicial do processo de cura. É normal sentir dor intensa e confusão neste momento. Este eBook vai te ajudar a compreender melhor seus sentimentos e começar sua jornada de recuperação."
  },
  2: {
    title: "Fase 2: Desvinculando-se do Passado",
    description: "Você está no processo de desapego. Já consegue entender melhor seus sentimentos, mas ainda precisa de ajuda para se libertar completamente do passado. Este eBook vai te dar ferramentas práticas para isso."
  },
  3: {
    title: "Fase 3: Reconstruindo sua Força",
    description: "Você já avançou muito em sua jornada de cura! Agora é hora de fortalecer ainda mais sua autoestima e preparar-se para novas possibilidades. Este eBook vai te ajudar nesta fase de reconstrução."
  }
};

const Results = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const phase = parseInt(searchParams.get("phase") || "1");
  const [ebook, setEbook] = useState<{ title: string; file_path: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        const { data, error } = await supabase
          .from('ebooks')
          .select('title, file_path')
          .eq('phase', phase)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          toast({
            title: "eBook não encontrado",
            description: "Não foi possível encontrar o eBook para esta fase",
            variant: "destructive"
          });
          return;
        }

        setEbook(data);
      } catch (error) {
        console.error('Error fetching ebook:', error);
        toast({
          title: "Erro ao carregar o eBook",
          description: "Por favor, tente novamente mais tarde",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEbook();
  }, [phase, toast]);

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
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          phase: phase,
          ebook_id: ebook?.file_path
        });

      if (error) throw error;

      await handleDownload();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro ao salvar seus dados",
        description: "Por favor, tente novamente",
        variant: "destructive"
      });
    }
  };

  const handleDownload = async () => {
    if (!ebook?.file_path) {
      toast({
        title: "eBook não disponível",
        description: "O eBook para esta fase ainda não está disponível",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('ebooks')
        .download(ebook.file_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = ebook.file_path;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download iniciado!",
        description: "Seu eBook está sendo baixado.",
      });

      // Navigate to thank you page
      navigate("/thank-you");
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erro ao baixar o eBook",
        description: "Por favor, tente novamente",
        variant: "destructive"
      });
    }
  };

  const currentPhaseInfo = phaseInfo[phase as keyof typeof phaseInfo];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 md:p-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          {currentPhaseInfo.title}
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          {currentPhaseInfo.description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
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
            Baixar eBook Gratuito
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Results;