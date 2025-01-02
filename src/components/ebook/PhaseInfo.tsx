interface PhaseInfoProps {
  phase: number;
}

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

export const PhaseInfo = ({ phase }: PhaseInfoProps) => {
  const currentPhaseInfo = phaseInfo[phase as keyof typeof phaseInfo];

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
        {currentPhaseInfo.title}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        {currentPhaseInfo.description}
      </p>
    </>
  );
};