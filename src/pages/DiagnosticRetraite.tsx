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

const DiagnosticRetraite = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profil');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const [profil, setProfil] = useState({
    age: 35,
    ageDebutCarriere: 25,
    ageRetraite: 67,
    statut: "Salarié",
    sexe: "Homme"
  });

  const [carriere, setCarriere] = useState({
    salaireActuel: 40000,
    evolutionSalaire: 2,
    trimestresValides: 50,
    trimestresRestants: 118
  });

  const [regimes, setRegimes] = useState({
    regimeGeneral: true,
    regimeComplementaire: true,
    regimeSupplementaire: false,
    pointsAgirc: 5000,
    pointsArrco: 8000
  });

  const calculateRetraite = () => {
    const anneesCarriere = profil.ageRetraite - profil.ageDebutCarriere;
    const trimestresTotal = carriere.trimestresValides + carriere.trimestresRestants;

    const salaireMoyenCarriere = carriere.salaireActuel * 0.75;

    const pensionBase = salaireMoyenCarriere * 0.50 * Math.min(trimestresTotal / 168, 1);

    const pensionComplementaire = (regimes.pointsAgirc * 1.3 + regimes.pointsArrco * 1.35) * 12;

    const pensionTotale = pensionBase + (regimes.regimeComplementaire ? pensionComplementaire : 0);

    const tauxRemplacement = (pensionTotale / carriere.salaireActuel) * 100;

    return {
      pensionBase: Math.round(pensionBase),
      pensionComplementaire: Math.round(pensionComplementaire),
      pensionTotale: Math.round(pensionTotale),
      tauxRemplacement: Math.round(tauxRemplacement * 100) / 100,
      anneesCarriere,
      trimestresTotal,
      salaireMoyenCarriere: Math.round(salaireMoyenCarriere)
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculateRetraite();
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
            <h1 className="text-2xl font-bold text-foreground">Estimation de votre retraite</h1>
            <p className="text-muted-foreground">Montant estimé de votre pension de retraite</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Pension de retraite estimée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{results.pensionTotale.toLocaleString()} €</div>
                <div className="text-sm text-gray-600 mt-1">Pension annuelle brute</div>
                <div className="text-lg font-semibold text-blue-500 mt-2">{Math.round(results.pensionTotale / 12).toLocaleString()} € / mois</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Pension de base:</span>
                  <span className="font-medium">{results.pensionBase.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pension complémentaire:</span>
                  <span className="font-medium">{results.pensionComplementaire.toLocaleString()} €</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center font-bold">
                    <span>Total annuel:</span>
                    <span>{results.pensionTotale.toLocaleString()} €</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">{results.tauxRemplacement}%</div>
                  <div className="text-sm text-gray-600">Taux de remplacement</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détails de la simulation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Années de carrière:</span>
                  <span className="font-medium">{results.anneesCarriere} ans</span>
                </div>
                <div className="flex justify-between">
                  <span>Trimestres validés:</span>
                  <span className="font-medium">{results.trimestresTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Salaire moyen carrière:</span>
                  <span className="font-medium">{results.salaireMoyenCarriere.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Salaire actuel:</span>
                  <span className="font-medium">{carriere.salaireActuel.toLocaleString()} €</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Cette estimation est indicative</li>
                  <li>• Les montants sont en euros constants</li>
                  <li>• La législation peut évoluer</li>
                  <li>• Consultez un conseiller pour une étude personnalisée</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
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
          <h1 className="text-2xl font-bold text-foreground">Diagnostic Retraite</h1>
          <p className="text-muted-foreground">Évaluer rapidement le montant de la pension de retraite</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="carriere">Carrière</TabsTrigger>
          <TabsTrigger value="regimes">Régimes</TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Âge actuel"
                  type="number"
                  value={profil.age}
                  onChange={(e) => setProfil({...profil, age: parseInt(e.target.value) || 0})}
                  min="18"
                  max="70"
                />
                <InputField
                  label="Âge de début de carrière"
                  type="number"
                  value={profil.ageDebutCarriere}
                  onChange={(e) => setProfil({...profil, ageDebutCarriere: parseInt(e.target.value) || 0})}
                  min="16"
                  max="30"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Âge de départ souhaité"
                  type="number"
                  value={profil.ageRetraite}
                  onChange={(e) => setProfil({...profil, ageRetraite: parseInt(e.target.value) || 0})}
                  min="60"
                  max="75"
                />
                <SelectField
                  label="Statut professionnel"
                  value={profil.statut}
                  onChange={(value) => setProfil({...profil, statut: value})}
                  options={[
                    { value: "Salarié", label: "Salarié du privé" },
                    { value: "Fonctionnaire", label: "Fonctionnaire" },
                    { value: "Indépendant", label: "Travailleur indépendant" },
                    { value: "Liberal", label: "Profession libérale" }
                  ]}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Sexe"
                  value={profil.sexe}
                  onChange={(value) => setProfil({...profil, sexe: value})}
                  options={[
                    { value: "Homme", label: "Homme" },
                    { value: "Femme", label: "Femme" }
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carriere" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Informations carrière
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Salaire annuel brut actuel (€)"
                  type="number"
                  value={carriere.salaireActuel}
                  onChange={(e) => setCarriere({...carriere, salaireActuel: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Évolution annuelle salaire (%)"
                  type="number"
                  value={carriere.evolutionSalaire}
                  onChange={(e) => setCarriere({...carriere, evolutionSalaire: parseFloat(e.target.value) || 0})}
                  step="0.1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Trimestres déjà validés"
                  type="number"
                  value={carriere.trimestresValides}
                  onChange={(e) => setCarriere({...carriere, trimestresValides: parseInt(e.target.value) || 0})}
                />
                <InputField
                  label="Trimestres restants à valider"
                  type="number"
                  value={carriere.trimestresRestants}
                  onChange={(e) => setCarriere({...carriere, trimestresRestants: parseInt(e.target.value) || 0})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regimes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" />
                Régimes de retraite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={regimes.regimeGeneral}
                    onChange={(e) => setRegimes({...regimes, regimeGeneral: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Régime général de base</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={regimes.regimeComplementaire}
                    onChange={(e) => setRegimes({...regimes, regimeComplementaire: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Régime complémentaire (Agirc-Arrco)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={regimes.regimeSupplementaire}
                    onChange={(e) => setRegimes({...regimes, regimeSupplementaire: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Régime supplémentaire</label>
                </div>
              </div>

              {regimes.regimeComplementaire && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Points Agirc acquis"
                    type="number"
                    value={regimes.pointsAgirc}
                    onChange={(e) => setRegimes({...regimes, pointsAgirc: parseInt(e.target.value) || 0})}
                  />
                  <InputField
                    label="Points Arrco acquis"
                    type="number"
                    value={regimes.pointsArrco}
                    onChange={(e) => setRegimes({...regimes, pointsArrco: parseInt(e.target.value) || 0})}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg" className="px-8">
          <Calculator className="h-4 w-4 mr-2" />
          Estimer ma retraite
        </Button>
      </div>
    </div>
  );
};

export default DiagnosticRetraite;