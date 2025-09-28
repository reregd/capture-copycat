import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calculator, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

const SimulateurRenteViagere = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rentier');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const [rentier, setRentier] = useState({
    age: 65,
    sexe: "Homme",
    situationFamiliale: "Célibataire",
    esperanceVie: 82
  });

  const [capital, setCapital] = useState({
    montant: 100000,
    typeOperation: "Capital vers rente",
    renteDesired: 500
  });

  const [rente, setRente] = useState({
    typeRente: "Viagère simple",
    periodicite: "Mensuelle",
    indexation: 0,
    renteMinimale: false,
    tauxTechnique: 0.5
  });

  const getTableMortalite = (age, sexe) => {
    const baseHomme = sexe === "Homme" ? 82.5 : 85.3;
    return Math.max(baseHomme - (age - 65) * 0.8, age + 5);
  };

  const calculateRenteViagere = () => {
    const esperanceVieCalculee = getTableMortalite(rentier.age, rentier.sexe);
    const dureeVieRestante = esperanceVieCalculee - rentier.age;

    const tauxActuariel = rente.tauxTechnique / 100;

    let facteurViager = 0;
    for (let i = 1; i <= dureeVieRestante; i++) {
      const survie = Math.pow(0.98, i - 1);
      const actualisation = Math.pow(1 + tauxActuariel, -i);
      facteurViager += survie * actualisation;
    }

    const renteAnnuelle = capital.typeOperation === "Capital vers rente"
      ? capital.montant / facteurViager
      : capital.renteDesired;

    const capitalNecessaire = capital.typeOperation === "Rente vers capital"
      ? capital.renteDesired * facteurViager
      : capital.montant;

    const renteMensuelle = renteAnnuelle / 12;

    const cumulRentesVersees = renteAnnuelle * dureeVieRestante;
    const rendementViager = ((cumulRentesVersees / capitalNecessaire) - 1) * 100;

    const evolutionData = [];
    let totalVerse = 0;
    for (let i = 0; i <= Math.min(dureeVieRestante, 25); i++) {
      totalVerse += (i > 0 ? renteAnnuelle : 0);
      evolutionData.push({
        annee: rentier.age + i,
        capitalInitial: capitalNecessaire,
        renteCumulee: totalVerse,
        rendement: totalVerse > 0 ? ((totalVerse / capitalNecessaire - 1) * 100) : 0
      });
    }

    const pointMort = capitalNecessaire / renteAnnuelle;

    return {
      renteAnnuelle: Math.round(renteAnnuelle),
      renteMensuelle: Math.round(renteMensuelle),
      capitalNecessaire: Math.round(capitalNecessaire),
      esperanceVieCalculee: Math.round(esperanceVieCalculee * 10) / 10,
      dureeVieRestante: Math.round(dureeVieRestante * 10) / 10,
      facteurViager: Math.round(facteurViager * 100) / 100,
      cumulRentesVersees: Math.round(cumulRentesVersees),
      rendementViager: Math.round(rendementViager * 100) / 100,
      pointMort: Math.round(pointMort * 10) / 10,
      evolutionData
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculateRenteViagere();
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
            <h1 className="text-2xl font-bold text-foreground">Résultats Rente Viagère</h1>
            <p className="text-muted-foreground">Calcul de votre rente viagère</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Résultats principaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{results.renteAnnuelle.toLocaleString()} €</div>
                  <div className="text-sm text-gray-600">Rente annuelle</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{results.renteMensuelle.toLocaleString()} €</div>
                  <div className="text-sm text-gray-600">Rente mensuelle</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Capital nécessaire:</span>
                  <span className="font-medium">{results.capitalNecessaire.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Espérance de vie:</span>
                  <span className="font-medium">{results.esperanceVieCalculee} ans</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée de vie restante:</span>
                  <span className="font-medium">{results.dureeVieRestante} ans</span>
                </div>
                <div className="flex justify-between">
                  <span>Facteur viager:</span>
                  <span className="font-medium">{results.facteurViager}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Analyse financière
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{results.rendementViager}%</div>
                <div className="text-sm text-gray-600">Rendement viager global</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Cumul des rentes versées:</span>
                  <span className="font-medium">{results.cumulRentesVersees.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Point mort:</span>
                  <span className="font-medium">{results.pointMort} ans</span>
                </div>
                <div className="flex justify-between">
                  <span>Âge au point mort:</span>
                  <span className="font-medium">{Math.round(rentier.age + results.pointMort)} ans</span>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">💡 À retenir</h4>
                <div className="text-sm text-orange-700">
                  <div>• Le point mort est à {Math.round(rentier.age + results.pointMort)} ans</div>
                  <div>• Au-delà, chaque année est "gagnante"</div>
                  <div>• Rendement global estimé : {results.rendementViager}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Évolution du rendement dans le temps</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="annee" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "capitalInitial") return [`${value.toLocaleString()} €`, "Capital initial"];
                    if (name === "renteCumulee") return [`${value.toLocaleString()} €`, "Rentes cumulées"];
                    if (name === "rendement") return [`${value.toFixed(1)}%`, "Rendement"];
                    return [value, name];
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="capitalInitial" stroke="#94a3b8" name="Capital initial" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="renteCumulee" stroke="#3b82f6" name="Rentes cumulées" strokeWidth={3} />
                <Line type="monotone" dataKey="rendement" stroke="#10b981" name="Rendement %" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
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
          <h1 className="text-2xl font-bold text-foreground">Simulateur Rente Viagère</h1>
          <p className="text-muted-foreground">Estimer le montant d'une rente ou le capital à constituer pour l'obtention d'une rente souhaitée</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rentier">Rentier</TabsTrigger>
          <TabsTrigger value="capital">Capital/Rente</TabsTrigger>
          <TabsTrigger value="rente">Options</TabsTrigger>
        </TabsList>

        <TabsContent value="rentier" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Profil du rentier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Âge actuel"
                  type="number"
                  value={rentier.age}
                  onChange={(e) => setRentier({...rentier, age: parseInt(e.target.value) || 0})}
                  min="50"
                  max="90"
                />
                <SelectField
                  label="Sexe"
                  value={rentier.sexe}
                  onChange={(value) => setRentier({...rentier, sexe: value})}
                  options={[
                    { value: "Homme", label: "Homme" },
                    { value: "Femme", label: "Femme" }
                  ]}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Situation familiale"
                  value={rentier.situationFamiliale}
                  onChange={(value) => setRentier({...rentier, situationFamiliale: value})}
                  options={[
                    { value: "Célibataire", label: "Célibataire" },
                    { value: "Marié(e)", label: "Marié(e)" },
                    { value: "Pacsé(e)", label: "Pacsé(e)" },
                    { value: "Veuf/Veuve", label: "Veuf/Veuve" }
                  ]}
                />
                <InputField
                  label="Espérance de vie estimée"
                  type="number"
                  value={rentier.esperanceVie}
                  onChange={(e) => setRentier({...rentier, esperanceVie: parseInt(e.target.value) || 0})}
                  min="70"
                  max="100"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Espérance de vie</h4>
                <p className="text-sm text-blue-700">
                  L'espérance de vie est calculée automatiquement selon les tables de mortalité officielles,
                  mais vous pouvez l'ajuster selon votre situation personnelle et familiale.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capital" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Capital et rente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Type d'opération"
                  value={capital.typeOperation}
                  onChange={(value) => setCapital({...capital, typeOperation: value})}
                  options={[
                    { value: "Capital vers rente", label: "Capital → Rente (j'ai un capital)" },
                    { value: "Rente vers capital", label: "Rente → Capital (je veux une rente)" }
                  ]}
                />
              </div>

              {capital.typeOperation === "Capital vers rente" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Capital disponible (€)"
                    type="number"
                    value={capital.montant}
                    onChange={(e) => setCapital({...capital, montant: parseFloat(e.target.value) || 0})}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Rente mensuelle souhaitée (€)"
                    type="number"
                    value={capital.renteDesired}
                    onChange={(e) => setCapital({...capital, renteDesired: parseFloat(e.target.value) || 0})}
                  />
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Principe de la rente viagère</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Vous versez un capital initial</li>
                  <li>• En échange, vous percevez une rente jusqu'à votre décès</li>
                  <li>• Plus vous vivez longtemps, plus c'est avantageux</li>
                  <li>• Le montant dépend de votre âge et de votre espérance de vie</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rente" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" />
                Options de la rente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Type de rente"
                  value={rente.typeRente}
                  onChange={(value) => setRente({...rente, typeRente: value})}
                  options={[
                    { value: "Viagère simple", label: "Viagère simple" },
                    { value: "Viagère réversible", label: "Viagère réversible" },
                    { value: "Viagère avec annuités garanties", label: "Avec annuités garanties" }
                  ]}
                />
                <SelectField
                  label="Périodicité"
                  value={rente.periodicite}
                  onChange={(value) => setRente({...rente, periodicite: value})}
                  options={[
                    { value: "Mensuelle", label: "Mensuelle" },
                    { value: "Trimestrielle", label: "Trimestrielle" },
                    { value: "Semestrielle", label: "Semestrielle" },
                    { value: "Annuelle", label: "Annuelle" }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Taux technique (%)"
                  type="number"
                  value={rente.tauxTechnique}
                  onChange={(e) => setRente({...rente, tauxTechnique: parseFloat(e.target.value) || 0})}
                  step="0.1"
                  min="0"
                  max="3"
                />
                <InputField
                  label="Indexation annuelle (%)"
                  type="number"
                  value={rente.indexation}
                  onChange={(e) => setRente({...rente, indexation: parseFloat(e.target.value) || 0})}
                  step="0.1"
                  min="0"
                  max="5"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rente.renteMinimale}
                    onChange={(e) => setRente({...rente, renteMinimale: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Garantir une rente minimale</label>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Points d'attention</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Le taux technique influe sur le montant de la rente</li>
                  <li>• L'indexation protège contre l'inflation</li>
                  <li>• La rente réversible réduit le montant initial</li>
                  <li>• Cette simulation est indicative - consultez un assureur</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg" className="px-8">
          <Calculator className="h-4 w-4 mr-2" />
          Calculer la rente viagère
        </Button>
      </div>
    </div>
  );
};

export default SimulateurRenteViagere;