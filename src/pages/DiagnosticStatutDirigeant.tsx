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

const DiagnosticStatutDirigeant = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('entreprise');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const [entreprise, setEntreprise] = useState({
    formeJuridique: "SARL",
    chiffreAffaires: 200000,
    benefices: 50000,
    effectifs: 5
  });

  const [dirigeant, setDirigeant] = useState({
    statutActuel: "Gérant majoritaire",
    salaire: 30000,
    dividendes: 20000,
    charges: 0
  });

  const [simulation, setSimulation] = useState({
    nouveauStatut: "Gérant majoritaire",
    nouveauSalaire: 35000,
    nouveauxDividendes: 15000
  });

  const calculateOptimisation = () => {
    const chargesSalaireSitu1 = dirigeant.salaire * 0.45;
    const chargesSalaireSitu2 = simulation.nouveauSalaire * 0.45;

    const coutTotalSitu1 = dirigeant.salaire + chargesSalaireSitu1 + dirigeant.dividendes;
    const coutTotalSitu2 = simulation.nouveauSalaire + chargesSalaireSitu2 + simulation.nouveauxDividendes;

    const economie = coutTotalSitu1 - coutTotalSitu2;

    return {
      situationActuelle: {
        salaire: dirigeant.salaire,
        charges: Math.round(chargesSalaireSitu1),
        dividendes: dirigeant.dividendes,
        total: Math.round(coutTotalSitu1)
      },
      nouvelleSimulation: {
        salaire: simulation.nouveauSalaire,
        charges: Math.round(chargesSalaireSitu2),
        dividendes: simulation.nouveauxDividendes,
        total: Math.round(coutTotalSitu2)
      },
      economie: Math.round(economie)
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculateOptimisation();
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
            <h1 className="text-2xl font-bold text-foreground">Résultats du diagnostic</h1>
            <p className="text-muted-foreground">Comparaison des statuts et rémunérations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Situation actuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Salaire brut:</span>
                  <span className="font-medium">{results.situationActuelle.salaire.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Charges sociales:</span>
                  <span className="font-medium">{results.situationActuelle.charges.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Dividendes:</span>
                  <span className="font-medium">{results.situationActuelle.dividendes.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Coût total:</span>
                  <span>{results.situationActuelle.total.toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nouvelle simulation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Salaire brut:</span>
                  <span className="font-medium">{results.nouvelleSimulation.salaire.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Charges sociales:</span>
                  <span className="font-medium">{results.nouvelleSimulation.charges.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Dividendes:</span>
                  <span className="font-medium">{results.nouvelleSimulation.dividendes.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Coût total:</span>
                  <span>{results.nouvelleSimulation.total.toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Économie réalisée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-3xl font-bold ${results.economie > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {results.economie > 0 ? '+' : ''}{results.economie.toLocaleString()} €
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {results.economie > 0 ? 'Économie annuelle' : 'Surcoût annuel'}
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
          <h1 className="text-2xl font-bold text-foreground">Diagnostic statut et rémunération du dirigeant</h1>
          <p className="text-muted-foreground">Simuler un changement de statut de dirigeant et l'arbitrage entre le salaire et les dividendes</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="entreprise">Entreprise</TabsTrigger>
          <TabsTrigger value="dirigeant">Dirigeant</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="entreprise" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Informations sur l'entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Forme juridique"
                  value={entreprise.formeJuridique}
                  onChange={(value) => setEntreprise({...entreprise, formeJuridique: value})}
                  options={[
                    { value: "SARL", label: "SARL" },
                    { value: "SAS", label: "SAS" },
                    { value: "SA", label: "SA" },
                    { value: "EURL", label: "EURL" }
                  ]}
                />
                <InputField
                  label="Chiffre d'affaires annuel (€)"
                  type="number"
                  value={entreprise.chiffreAffaires}
                  onChange={(e) => setEntreprise({...entreprise, chiffreAffaires: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Bénéfices annuels (€)"
                  type="number"
                  value={entreprise.benefices}
                  onChange={(e) => setEntreprise({...entreprise, benefices: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Nombre d'effectifs"
                  type="number"
                  value={entreprise.effectifs}
                  onChange={(e) => setEntreprise({...entreprise, effectifs: parseInt(e.target.value) || 0})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dirigeant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Situation actuelle du dirigeant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Statut actuel"
                  value={dirigeant.statutActuel}
                  onChange={(value) => setDirigeant({...dirigeant, statutActuel: value})}
                  options={[
                    { value: "Gérant majoritaire", label: "Gérant majoritaire" },
                    { value: "Gérant minoritaire", label: "Gérant minoritaire" },
                    { value: "Président SAS", label: "Président SAS" },
                    { value: "Directeur général", label: "Directeur général" }
                  ]}
                />
                <InputField
                  label="Salaire brut annuel (€)"
                  type="number"
                  value={dirigeant.salaire}
                  onChange={(e) => setDirigeant({...dirigeant, salaire: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Dividendes annuels (€)"
                  type="number"
                  value={dirigeant.dividendes}
                  onChange={(e) => setDirigeant({...dirigeant, dividendes: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Autres charges (€)"
                  type="number"
                  value={dirigeant.charges}
                  onChange={(e) => setDirigeant({...dirigeant, charges: parseFloat(e.target.value) || 0})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" />
                Nouvelle simulation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Nouveau statut"
                  value={simulation.nouveauStatut}
                  onChange={(value) => setSimulation({...simulation, nouveauStatut: value})}
                  options={[
                    { value: "Gérant majoritaire", label: "Gérant majoritaire" },
                    { value: "Gérant minoritaire", label: "Gérant minoritaire" },
                    { value: "Président SAS", label: "Président SAS" },
                    { value: "Directeur général", label: "Directeur général" }
                  ]}
                />
                <InputField
                  label="Nouveau salaire brut annuel (€)"
                  type="number"
                  value={simulation.nouveauSalaire}
                  onChange={(e) => setSimulation({...simulation, nouveauSalaire: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nouveaux dividendes annuels (€)"
                  type="number"
                  value={simulation.nouveauxDividendes}
                  onChange={(e) => setSimulation({...simulation, nouveauxDividendes: parseFloat(e.target.value) || 0})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg" className="px-8">
          <Calculator className="h-4 w-4 mr-2" />
          Calculer l'optimisation
        </Button>
      </div>
    </div>
  );
};

export default DiagnosticStatutDirigeant;