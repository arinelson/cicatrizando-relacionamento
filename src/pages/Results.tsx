import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
  const [userData, setUserData] = useState<{ name: string } | null>(null);
  const [ebook, setEbook] = useState<{ title: string; file_path: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    // Fetch ebook information
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

      // Create download link
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = ebook.title + '.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

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
          {userData?.name ? `Olá ${userData.name}, ` : ""}
          {currentPhaseInfo.description}
        </p>

        {ebook ? (
          <div className="bg-muted p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Seu eBook está pronto:
            </h2>
            <p className="text-lg text-primary font-medium mb-6">
              {ebook.title}
            </p>
            <Button
              onClick={handleDownload}
              className="w-full bg-primary hover:bg-primary/90 text-white py-6"
            >
              Baixar eBook Agora
            </Button>
          </div>
        ) : (
          <div className="bg-muted p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">
              eBook não disponível
            </h2>
            <p className="text-gray-600">
              Desculpe, o eBook para esta fase ainda não está disponível.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;