import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PhaseInfo } from "@/components/ebook/PhaseInfo";
import { EbookForm } from "@/components/ebook/EbookForm";

const Results = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const phase = parseInt(searchParams.get("phase") || "1");
  const [ebook, setEbook] = useState<{ id: string; file_path: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        const { data, error } = await supabase
          .from('ebooks')
          .select('id, file_path, title')
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
        <PhaseInfo phase={phase} />
        <EbookForm phase={phase} ebook={ebook} />
      </div>
    </div>
  );
};

export default Results;