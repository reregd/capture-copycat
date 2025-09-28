import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calculator, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const InputField = ({ label, type = "text", value, onChange, placeholder, step, min, max }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={step}
      min={min}
      max={max}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const DiagnosticSuccession = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('patrimoine');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const [patrimoine, setPatrimoine] = useState({
    immobilier: 500000,
    financier: 200000,
    professionnel: 100000,
    dettes: 50000
  });

  const [situation, setSituation] = useState({
    statutMarital: "Marié",
    regimeMatrimonial: "Communauté réduite",
    nombreEnfants: 2,
    donationsAntérieures: 0
  });

  const [beneficiaires, setBeneficiaires] = useState({
    conjoint: true,
    enfants: true,
    autresBeneficiaires: 0,
    partConjoint: 50,
    partEnfants: 50
  });

  const calculateSuccession = () => {
    const patrimoineNet = patrimoine.immobilier + patrimoine.financier + patrimoine.professionnel - patrimoine.dettes;

    let abattementConjoint = 80724;
    let abattementParEnfant = 100000;

    const partConjoint = (patrimoineNet * beneficiaires.partConjoint) / 100;
    const partEnfants = patrimoineNet - partConjoint;
    const partParEnfant = situation.nombreEnfants > 0 ? partEnfants / situation.nombreEnfants : 0;

    const droitsConjoint = Math.max(0, partConjoint - abattementConjoint);
    const droitsParEnfant = Math.max(0, partParEnfant - abattementParEnfant);

    const tauxConjoint = droitsConjoint > 0 ? (droitsConjoint <= 8072 ? 0.05 : 0.10) : 0;
    const tauxEnfant = droitsParEnfant > 0 ? (
      droitsParEnfant <= 8072 ? 0.05 :
      droitsParEnfant <= 12109 ? 0.10 :
      droitsParEnfant <= 15932 ? 0.15 :
      droitsParEnfant <= 552324 ? 0.20 : 0.40
    ) : 0;

    const impotConjoint = droitsConjoint * tauxConjoint;
    const impotParEnfant = droitsParEnfant * tauxEnfant;
    const impotTotalEnfants = impotParEnfant * situation.nombreEnfants;

    const impotTotal = impotConjoint + impotTotalEnfants;

    return {
      patrimoineNet,
      partConjoint,
      partEnfants,
      partParEnfant,
      droitsConjoint,
      droitsParEnfant,
      impotConjoint,
      impotParEnfant,
      impotTotalEnfants,
      impotTotal,
      tauxMoyenSuccession: (impotTotal / patrimoineNet) * 100
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculateSuccession();
    setResults(calculatedResults);
    setShowResults(true);
  };

  if (showResults && results) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResults(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux paramètres
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Estimation des droits de succession</h1>
            <p className="text-muted-foreground">Calcul des droits de succession à partir de votre situation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Répartition du patrimoine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.patrimoineNet.toLocaleString()} €</div>
                <div className="text-sm text-gray-600">Patrimoine net à transmettre</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Part du conjoint:</span>
                  <span className="font-medium">{results.partConjoint.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Part des enfants:</span>
                  <span className="font-medium">{results.partEnfants.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Part par enfant:</span>
                  <span className="font-medium">{results.partParEnfant.toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                Droits de succession
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{results.impotTotal.toLocaleString()} €</div>
                <div className="text-sm text-gray-600">Total des droits de succession</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Droits sur part conjoint:</span>
                  <span className="font-medium text-red-600">{results.impotConjoint.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Droits par enfant:</span>
                  <span className="font-medium text-red-600">{results.impotParEnfant.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Total enfants:</span>
                  <span className="font-medium text-red-600">{results.impotTotalEnfants.toLocaleString()} €</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span>Taux moyen:</span>
                    <span className="font-medium">{results.tauxMoyenSuccession.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Détail des calculs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Conjoint</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Part reçue:</span>
                    <span>{results.partConjoint.toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Abattement:</span>
                    <span>-80 724 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base taxable:</span>
                    <span>{results.droitsConjoint.toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Droits dus:</span>
                    <span className="text-red-600">{results.impotConjoint.toLocaleString()} €</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Enfants (par enfant)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Part reçue:</span>
                    <span>{results.partParEnfant.toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Abattement:</span>
                    <span>-100 000 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base taxable:</span>
                    <span>{results.droitsParEnfant.toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Droits dus:</span>
                    <span className="text-red-600">{results.impotParEnfant.toLocaleString()} €</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/simulateurs')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux simulateurs
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Diagnostic Succession</h1>
          <p className="text-muted-foreground">Estimer la transmission et les droits de succession à partir d'une situation simplifiée</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patrimoine">Patrimoine</TabsTrigger>
          <TabsTrigger value="situation">Situation</TabsTrigger>
          <TabsTrigger value="beneficiaires">Bénéficiaires</TabsTrigger>
        </TabsList>

        <TabsContent value="patrimoine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Composition du patrimoine
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Patrimoine immobilier (€)"
                  type="number"
                  value={patrimoine.immobilier}
                  onChange={(e) => setPatrimoine({...patrimoine, immobilier: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Patrimoine financier (€)"
                  type="number"
                  value={patrimoine.financier}
                  onChange={(e) => setPatrimoine({...patrimoine, financier: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Patrimoine professionnel (€)"
                  type="number"
                  value={patrimoine.professionnel}
                  onChange={(e) => setPatrimoine({...patrimoine, professionnel: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Dettes (€)"
                  type="number"
                  value={patrimoine.dettes}
                  onChange={(e) => setPatrimoine({...patrimoine, dettes: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between font-semibold">
                  <span>Patrimoine net:</span>
                  <span>{(patrimoine.immobilier + patrimoine.financier + patrimoine.professionnel - patrimoine.dettes).toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="situation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Situation familiale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Statut marital"
                  value={situation.statutMarital}
                  onChange={(value) => setSituation({...situation, statutMarital: value})}
                  options={[
                    { value: "Marié", label: "Marié(e)" },
                    { value: "Pacsé", label: "Pacsé(e)" },
                    { value: "Concubinage", label: "Concubinage" },
                    { value: "Célibataire", label: "Célibataire" },
                    { value: "Divorcé", label: "Divorcé(e)" },
                    { value: "Veuf", label: "Veuf/Veuve" }
                  ]}
                />
                <SelectField
                  label="Régime matrimonial"
                  value={situation.regimeMatrimonial}
                  onChange={(value) => setSituation({...situation, regimeMatrimonial: value})}
                  options={[
                    { value: "Communauté réduite", label: "Communauté réduite aux acquêts" },
                    { value: "Communauté universelle", label: "Communauté universelle" },
                    { value: "Séparation de biens", label: "Séparation de biens" },
                    { value: "Participation aux acquêts", label: "Participation aux acquêts" }
                  ]}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nombre d'enfants"
                  type="number"
                  value={situation.nombreEnfants}
                  onChange={(e) => setSituation({...situation, nombreEnfants: parseInt(e.target.value) || 0})}
                  min="0"
                  max="10"
                />
                <InputField
                  label="Donations antérieures (€)"
                  type="number"
                  value={situation.donationsAntérieures}
                  onChange={(e) => setSituation({...situation, donationsAntérieures: parseFloat(e.target.value) || 0})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beneficiaires" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" />
                Répartition entre bénéficiaires
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={beneficiaires.conjoint}
                    onChange={(e) => setBeneficiaires({...beneficiaires, conjoint: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Conjoint survivant</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={beneficiaires.enfants}
                    onChange={(e) => setBeneficiaires({...beneficiaires, enfants: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Enfants</label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Part du conjoint (%)"
                  type="number"
                  value={beneficiaires.partConjoint}
                  onChange={(e) => setBeneficiaires({...beneficiaires, partConjoint: parseFloat(e.target.value) || 0})}
                  min="0"
                  max="100"
                />
                <InputField
                  label="Part des enfants (%)"
                  type="number"
                  value={beneficiaires.partEnfants}
                  onChange={(e) => setBeneficiaires({...beneficiaires, partEnfants: parseFloat(e.target.value) || 0})}
                  min="0"
                  max="100"
                />
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">ℹ️ Information</h4>
                <p className="text-sm text-yellow-700">
                  Cette simulation utilise les abattements et barèmes 2024.
                  Pour une étude précise, consultez un notaire ou un conseiller en gestion de patrimoine.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg" className="px-8">
          <Calculator className="h-4 w-4 mr-2" />
          Calculer les droits de succession
        </Button>
      </div>
    </div>
  );
};

export default DiagnosticSuccession;