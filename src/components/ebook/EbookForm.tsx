import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface EbookFormProps {
  phase: number;
  ebook: { id: string; file_path: string } | null;
}

export const EbookForm = ({ phase, ebook }: EbookFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          phase: phase,
          ebook_id: ebook?.id // Using id instead of file_path
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

  return (
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
  );
};