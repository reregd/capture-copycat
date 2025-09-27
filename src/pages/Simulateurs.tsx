import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const simulators = [
  {
    id: 1,
    title: "Profil investisseur complet",
    description: "Évaluer les préférences de placement financier en matière de durabilité ou critères ESG (Environnemental, Social et Gouvernance).",
    color: "border-l-brand-blue bg-brand-blue/5",
    iconColor: "border-brand-blue",
  },
  {
    id: 2,
    title: "Simulateur assurance vie",
    description: "Étudier la valorisation d'un contrat d'assurance vie et l'impact des rachats ou d'une sortie en rentes",
    color: "border-l-brand-cyan bg-brand-cyan/5",
    iconColor: "border-brand-cyan",
  },
  {
    id: 3,
    title: "Simulateur Immobilier",
    description: "Simuler un investissement immobilier en location nue ou meublé",
    color: "border-l-brand-purple bg-brand-purple/5",
    iconColor: "border-brand-purple",
  },
  {
    id: 4,
    title: "Simulateur PER",
    description: "Estimer l'incidence de la mise en place d'un PER et de sa sortie",
    color: "border-l-brand-pink bg-brand-pink/5",
    iconColor: "border-brand-pink",
  },
  {
    id: 5,
    title: "Diagnostic Impôt sur le revenu",
    description: "Effectuer un calcul rapide de l'impôt sur le revenu et sélectionner des investissements pour l'optimiser",
    color: "border-l-brand-green bg-brand-green/5",
    iconColor: "border-brand-green",
  },
  {
    id: 6,
    title: "Simulateur Crédit",
    description: "Effectuez une simulation de prêt",
    color: "border-l-brand-cyan bg-brand-cyan/5",
    iconColor: "border-brand-cyan",
  },
  {
    id: 7,
    title: "Diagnostic statut et rémunération du dirigeant",
    description: "Simuler un changement de statut de dirigeant et l'arbitrage entre le salaire et les dividendes",
    color: "border-l-brand-orange bg-brand-orange/5",
    iconColor: "border-brand-orange",
  },
  {
    id: 8,
    title: "Diagnostic Retraite",
    description: "Évaluer rapidement le montant de la pension de retraite",
    color: "border-l-brand-lime bg-brand-lime/5",
    iconColor: "border-brand-lime",
  },
  {
    id: 9,
    title: "Simulateur SCI",
    description: "Comparer la location d'un immeuble dans le cadre d'une SCI à l'IR ou à l'IS",
    color: "border-l-brand-red bg-brand-red/5",
    iconColor: "border-brand-red",
  },
  {
    id: 10,
    title: "Diagnostic Succession",
    description: "Estimer la transmission et les droits de succession à partir d'une situation simplifiée",
    color: "border-l-brand-pink bg-brand-pink/5",
    iconColor: "border-brand-pink",
  },
  {
    id: 11,
    title: "Diagnostic Impôt sur la fortune immobilière",
    description: "Effectuer un calcul rapide de l'IFI et sélectionner des investissements pour l'optimiser",
    color: "border-l-brand-lime bg-brand-lime/5",
    iconColor: "border-brand-lime",
  },
  {
    id: 12,
    title: "Diagnostic Fiscalité des plus-values immobilières",
    description: "Calculer la plus-value immobilière et l'impôt qui en résulte",
    color: "border-l-brand-pink bg-brand-pink/5",
    iconColor: "border-brand-pink",
  },
  {
    id: 13,
    title: "Simulateur Capacité d'Acquisition",
    description: "Simulateur Capacité d'Acquisition",
    color: "border-l-brand-blue bg-brand-blue/5",
    iconColor: "border-brand-blue",
  },
  {
    id: 14,
    title: "Simulateur Rente Viagère",
    description: "Estimer le montant d'une rente ou le capital à constituer pour l'obtention d'une rente souhaitée",
    color: "border-l-brand-cyan bg-brand-cyan/5",
    iconColor: "border-brand-cyan",
  },
  {
    id: 15,
    title: "Simulateur Épargne",
    description: "Estimez rapidement l'évolution de votre épargne",
    color: "border-l-brand-pink bg-brand-pink/5",
    iconColor: "border-brand-pink",
  },
  {
    id: 16,
    title: "Simulateur Frais de notaire",
    description: "Estimez les frais de notaire liés à l'acquisition d'un bien immobilier",
    color: "border-l-brand-pink bg-brand-pink/5",
    iconColor: "border-brand-pink",
  },
];

export default function Simulateurs() {
  const navigate = useNavigate();

  const handleSimulatorClick = (simulatorId: number) => {
    if (simulatorId === 1) { // Profil investisseur complet
      navigate("/simulateur-profil-investisseur");
    } else if (simulatorId === 2) { // Simulateur assurance vie
      navigate("/simulateur-assurance-vie");
    }
    // Autres simulateurs à implémenter plus tard
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Simulateurs</h1>
        <p className="text-muted-foreground">Réaliser des simulations rapides sans ouvrir un dossier</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {simulators.map((simulator) => (
          <Card
            key={simulator.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${simulator.color} border-l-4`}
            onClick={() => handleSimulatorClick(simulator.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                    {simulator.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {simulator.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}