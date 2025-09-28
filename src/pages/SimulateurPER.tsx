import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Calculator, FileText, Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Composant InputField réutilisable
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

const SimulateurPER = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profil');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // État du profil
  const [profil, setProfil] = useState({
    age: 35,
    ageRetraite: 67,
    situationFamiliale: "Célibataire",
    nombreEnfants: 0,
    revenuAnnuel: 50000,
    trancheMarginal: 30
  });

  // État du PER
  const [per, setPer] = useState({
    typeContrat: "PER individuel",
    capitalInitial: 0,
    versementAnnuel: 3000,
    plafondDeduction: 10000,
    rendementAnnuel: 4.5,
    fraisEntree: 0,
    fraisGestion: 0.8,
    fraisSortie: 0
  });

  // État sortie
  const [sortie, setSortie] = useState({
    typeSortie: "rente",
    pourcentageRente: 100,
    fiscaliteRente: "réduite",
    capitalLibre: 0
  });

  // Calculs
  const calculatePER = () => {
    const anneesEpargne = profil.ageRetraite - profil.age;
    const rendementNet = (per.rendementAnnuel - per.fraisGestion) / 100;

    // Capital constitué
    let capitalFinal = per.capitalInitial;
    for (let i = 0; i < anneesEpargne; i++) {
      capitalFinal = (capitalFinal + per.versementAnnuel) * (1 + rendementNet);
    }

    // Économie fiscale annuelle
    const economieFiscale = Math.min(per.versementAnnuel, per.plafondDeduction) * (profil.trancheMarginal / 100);

    // Montant de la rente
    const montantRente = capitalFinal * 0.04; // Approximation 4% par an

    // Données pour le graphique
    const evolutionData = [];
    let capital = per.capitalInitial;
    let totalVersements = per.capitalInitial;

    for (let i = 0; i <= anneesEpargne; i++) {
      evolutionData.push({
        annee: profil.age + i,
        capital: Math.round(capital),
        versements: Math.round(totalVersements),
        economiesFiscales: Math.round(economieFiscale * i)
      });

      if (i < anneesEpargne) {
        capital = (capital + per.versementAnnuel) * (1 + rendementNet);
        totalVersements += per.versementAnnuel;
      }
    }

    return {
      capitalFinal: Math.round(capitalFinal),
      economieFiscaleAnnuelle: Math.round(economieFiscale),
      economieFiscaleTotale: Math.round(economieFiscale * anneesEpargne),
      montantRente: Math.round(montantRente),
      anneesEpargne,
      evolutionData,
      totalVersements: Math.round(per.versementAnnuel * anneesEpargne + per.capitalInitial)
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculatePER();
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
            <h1 className="text-2xl font-bold text-foreground">Résultats PER</h1>
            <p className="text-muted-foreground">Analyse de votre Plan d'Épargne Retraite</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Résultats principaux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Résultats de l'épargne
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{results.capitalFinal.toLocaleString()} €</div>
                  <div className="text-sm text-gray-600">Capital constitué</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{results.montantRente.toLocaleString()} €</div>
                  <div className="text-sm text-gray-600">Rente annuelle</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Durée d'épargne:</span>
                  <span className="font-medium">{results.anneesEpargne} ans</span>
                </div>
                <div className="flex justify-between">
                  <span>Total versements:</span>
                  <span className="font-medium">{results.totalVersements.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Économie fiscale annuelle:</span>
                  <span className="font-medium text-green-600">{results.economieFiscaleAnnuelle.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Économie fiscale totale:</span>
                  <span className="font-medium text-green-600">{results.economieFiscaleTotale.toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graphique évolution */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution du capital</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.evolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="annee" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
                  <Legend />
                  <Line type="monotone" dataKey="capital" stroke="#3b82f6" name="Capital constitué" strokeWidth={3} />
                  <Line type="monotone" dataKey="versements" stroke="#06b6d4" name="Versements cumulés" strokeWidth={2} />
                  <Line type="monotone" dataKey="economiesFiscales" stroke="#10b981" name="Économies fiscales" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
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
          <h1 className="text-2xl font-bold text-foreground">Simulateur PER</h1>
          <p className="text-muted-foreground">Estimez l'incidence de la mise en place d'un PER et de sa sortie</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="per">PER</TabsTrigger>
          <TabsTrigger value="sortie">Sortie</TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Profil de l'épargnant
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
                  max="67"
                />
                <InputField
                  label="Âge de départ à la retraite"
                  type="number"
                  value={profil.ageRetraite}
                  onChange={(e) => setProfil({...profil, ageRetraite: parseInt(e.target.value) || 0})}
                  min="60"
                  max="75"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Situation familiale"
                  value={profil.situationFamiliale}
                  onChange={(value) => setProfil({...profil, situationFamiliale: value})}
                  options={[
                    { value: "Célibataire", label: "Célibataire" },
                    { value: "Marié(e)", label: "Marié(e)" },
                    { value: "Pacsé(e)", label: "Pacsé(e)" },
                    { value: "Divorcé(e)", label: "Divorcé(e)" }
                  ]}
                />
                <InputField
                  label="Nombre d'enfants à charge"
                  type="number"
                  value={profil.nombreEnfants}
                  onChange={(e) => setProfil({...profil, nombreEnfants: parseInt(e.target.value) || 0})}
                  min="0"
                  max="10"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Revenu annuel net (€)"
                  type="number"
                  value={profil.revenuAnnuel}
                  onChange={(e) => setProfil({...profil, revenuAnnuel: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Tranche marginale d'imposition (%)"
                  type="number"
                  value={profil.trancheMarginal}
                  onChange={(e) => setProfil({...profil, trancheMarginal: parseFloat(e.target.value) || 0})}
                  step="0.1"
                  min="0"
                  max="45"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="per" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Paramètres du PER
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Type de contrat"
                  value={per.typeContrat}
                  onChange={(value) => setPer({...per, typeContrat: value})}
                  options={[
                    { value: "PER individuel", label: "PER individuel" },
                    { value: "PER collectif", label: "PER collectif" },
                    { value: "PER obligatoire", label: "PER obligatoire" }
                  ]}
                />
                <InputField
                  label="Capital initial (€)"
                  type="number"
                  value={per.capitalInitial}
                  onChange={(e) => setPer({...per, capitalInitial: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Versement annuel (€)"
                  type="number"
                  value={per.versementAnnuel}
                  onChange={(e) => setPer({...per, versementAnnuel: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Plafond de déduction (€)"
                  type="number"
                  value={per.plafondDeduction}
                  onChange={(e) => setPer({...per, plafondDeduction: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Rendement annuel (%)"
                  type="number"
                  value={per.rendementAnnuel}
                  onChange={(e) => setPer({...per, rendementAnnuel: parseFloat(e.target.value) || 0})}
                  step="0.1"
                />
                <InputField
                  label="Frais de gestion (%)"
                  type="number"
                  value={per.fraisGestion}
                  onChange={(e) => setPer({...per, fraisGestion: parseFloat(e.target.value) || 0})}
                  step="0.1"
                />
                <InputField
                  label="Frais d'entrée (%)"
                  type="number"
                  value={per.fraisEntree}
                  onChange={(e) => setPer({...per, fraisEntree: parseFloat(e.target.value) || 0})}
                  step="0.1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sortie" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-600" />
                Modalités de sortie
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Type de sortie"
                  value={sortie.typeSortie}
                  onChange={(value) => setSortie({...sortie, typeSortie: value})}
                  options={[
                    { value: "rente", label: "Rente viagère" },
                    { value: "capital", label: "Capital" },
                    { value: "mixte", label: "Mixte (rente + capital)" }
                  ]}
                />
                {sortie.typeSortie === "mixte" && (
                  <InputField
                    label="Pourcentage en rente (%)"
                    type="number"
                    value={sortie.pourcentageRente}
                    onChange={(e) => setSortie({...sortie, pourcentageRente: parseFloat(e.target.value) || 0})}
                    min="0"
                    max="100"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Fiscalité de la rente"
                  value={sortie.fiscaliteRente}
                  onChange={(value) => setSortie({...sortie, fiscaliteRente: value})}
                  options={[
                    { value: "réduite", label: "Fiscalité réduite" },
                    { value: "normale", label: "Fiscalité normale" }
                  ]}
                />
                {sortie.typeSortie === "mixte" && (
                  <InputField
                    label="Capital libre souhaité (€)"
                    type="number"
                    value={sortie.capitalLibre}
                    onChange={(e) => setSortie({...sortie, capitalLibre: parseFloat(e.target.value) || 0})}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg" className="px-8">
          <Calculator className="h-4 w-4 mr-2" />
          Calculer le PER
        </Button>
      </div>
    </div>
  );
};

export default SimulateurPER;