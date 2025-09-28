import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calculator, FileText, ArrowLeft, Home } from "lucide-react";
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

const DiagnosticIFI = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('patrimoine');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const [patrimoine, setPatrimoine] = useState({
    residencePrincipale: 400000,
    residencesSecondaires: 200000,
    immobilierLocatif: 300000,
    terrains: 100000,
    partsSCPI: 50000,
    autresImmo: 0
  });

  const [dettes, setDettes] = useState({
    empruntResidencePrincipale: 150000,
    empruntResidenceSecondaire: 80000,
    empruntImmobilierLocatif: 120000,
    autresDettes: 0
  });

  const [situation, setSituation] = useState({
    situationFamiliale: "Marié",
    nombreEnfantsMineurs: 0,
    decotePossible: true
  });

  const calculateIFI = () => {
    const totalPatrimoineImmo = patrimoine.residencePrincipale +
                               patrimoine.residencesSecondaires +
                               patrimoine.immobilierLocatif +
                               patrimoine.terrains +
                               patrimoine.partsSCPI +
                               patrimoine.autresImmo;

    const abattementRP = Math.min(patrimoine.residencePrincipale * 0.3, 100000);

    const patrimoineNetRP = patrimoine.residencePrincipale - abattementRP - dettes.empruntResidencePrincipale;
    const patrimoineNetAutres = (patrimoine.residencesSecondaires +
                               patrimoine.immobilierLocatif +
                               patrimoine.terrains +
                               patrimoine.partsSCPI +
                               patrimoine.autresImmo) -
                               (dettes.empruntResidenceSecondaire +
                               dettes.empruntImmobilierLocatif +
                               dettes.autresDettes);

    const patrimoineNet = Math.max(0, patrimoineNetRP) + Math.max(0, patrimoineNetAutres);

    let ifi = 0;

    if (patrimoineNet > 1300000) {
      if (patrimoineNet <= 1800000) {
        ifi = (patrimoineNet - 1300000) * 0.005;
      } else if (patrimoineNet <= 2570000) {
        ifi = 500 * 0.005 + (patrimoineNet - 1800000) * 0.007;
      } else if (patrimoineNet <= 5000000) {
        ifi = 500 * 0.005 + 770000 * 0.007 + (patrimoineNet - 2570000) * 0.01;
      } else if (patrimoineNet <= 10000000) {
        ifi = 500 * 0.005 + 770000 * 0.007 + 2430000 * 0.01 + (patrimoineNet - 5000000) * 0.0125;
      } else {
        ifi = 500 * 0.005 + 770000 * 0.007 + 2430000 * 0.01 + 5000000 * 0.0125 + (patrimoineNet - 10000000) * 0.015;
      }
    }

    let decote = 0;
    if (situation.decotePossible && patrimoineNet <= 1400000 && ifi > 0) {
      decote = (17500 - (patrimoineNet - 1300000) * 0.175);
      ifi = Math.max(0, ifi - decote);
    }

    const plafonnement = Math.min(ifi, Math.max(0, (patrimoine.residencePrincipale * 0.02))); // Approximation

    return {
      totalPatrimoineImmo,
      abattementRP,
      patrimoineNet,
      ifiAvantDecote: ifi + decote,
      decote,
      ifi,
      plafonnement,
      tauxMoyen: patrimoineNet > 0 ? (ifi / patrimoineNet) * 100 : 0,
      estAssujetti: patrimoineNet > 1300000
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculateIFI();
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
            <h1 className="text-2xl font-bold text-foreground">Calcul de l'IFI</h1>
            <p className="text-muted-foreground">Impôt sur la Fortune Immobilière</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Patrimoine immobilier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.totalPatrimoineImmo.toLocaleString()} €</div>
                <div className="text-sm text-gray-600">Patrimoine immobilier brut</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Abattement résidence principale:</span>
                  <span className="font-medium text-green-600">-{results.abattementRP.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Dettes déductibles:</span>
                  <span className="font-medium text-green-600">-{(dettes.empruntResidencePrincipale + dettes.empruntResidenceSecondaire + dettes.empruntImmobilierLocatif + dettes.autresDettes).toLocaleString()} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Patrimoine net taxable:</span>
                  <span className="text-blue-600">{results.patrimoineNet.toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-red-600" />
                Calcul de l'IFI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.estAssujetti ? (
                <>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{results.ifi.toLocaleString()} €</div>
                    <div className="text-sm text-gray-600">IFI dû</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>IFI avant décote:</span>
                      <span className="font-medium">{results.ifiAvantDecote.toLocaleString()} €</span>
                    </div>
                    {results.decote > 0 && (
                      <div className="flex justify-between">
                        <span>Décote appliquée:</span>
                        <span className="font-medium text-green-600">-{results.decote.toLocaleString()} €</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Taux moyen:</span>
                      <span className="font-medium">{results.tauxMoyen.toFixed(3)}%</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">Non assujetti à l'IFI</div>
                  <div className="text-sm text-gray-600 mt-2">
                    Votre patrimoine net taxable ({results.patrimoineNet.toLocaleString()} €)
                    est inférieur au seuil de 1 300 000 €
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {results.estAssujetti && (
          <Card>
            <CardHeader>
              <CardTitle>Barème IFI 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Valeur nette taxable</th>
                      <th className="border border-gray-300 p-2 text-left">Taux</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-2">Jusqu'à 800 000 €</td>
                      <td className="border border-gray-300 p-2">0%</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">De 800 001 € à 1 300 000 €</td>
                      <td className="border border-gray-300 p-2">0,5%</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">De 1 300 001 € à 2 570 000 €</td>
                      <td className="border border-gray-300 p-2">0,7%</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">De 2 570 001 € à 5 000 000 €</td>
                      <td className="border border-gray-300 p-2">1%</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">De 5 000 001 € à 10 000 000 €</td>
                      <td className="border border-gray-300 p-2">1,25%</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-2">Au-delà de 10 000 000 €</td>
                      <td className="border border-gray-300 p-2">1,5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
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
          <h1 className="text-2xl font-bold text-foreground">Diagnostic Impôt sur la fortune immobilière</h1>
          <p className="text-muted-foreground">Effectuer un calcul rapide de l'IFI et sélectionner des investissements pour l'optimiser</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patrimoine">Patrimoine</TabsTrigger>
          <TabsTrigger value="dettes">Dettes</TabsTrigger>
          <TabsTrigger value="situation">Situation</TabsTrigger>
        </TabsList>

        <TabsContent value="patrimoine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Patrimoine immobilier
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Résidence principale (€)"
                  type="number"
                  value={patrimoine.residencePrincipale}
                  onChange={(e) => setPatrimoine({...patrimoine, residencePrincipale: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Résidences secondaires (€)"
                  type="number"
                  value={patrimoine.residencesSecondaires}
                  onChange={(e) => setPatrimoine({...patrimoine, residencesSecondaires: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Immobilier locatif (€)"
                  type="number"
                  value={patrimoine.immobilierLocatif}
                  onChange={(e) => setPatrimoine({...patrimoine, immobilierLocatif: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Terrains (€)"
                  type="number"
                  value={patrimoine.terrains}
                  onChange={(e) => setPatrimoine({...patrimoine, terrains: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Parts de SCPI (€)"
                  type="number"
                  value={patrimoine.partsSCPI}
                  onChange={(e) => setPatrimoine({...patrimoine, partsSCPI: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Autres biens immobiliers (€)"
                  type="number"
                  value={patrimoine.autresImmo}
                  onChange={(e) => setPatrimoine({...patrimoine, autresImmo: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between font-semibold">
                  <span>Total patrimoine immobilier:</span>
                  <span>{(patrimoine.residencePrincipale + patrimoine.residencesSecondaires + patrimoine.immobilierLocatif + patrimoine.terrains + patrimoine.partsSCPI + patrimoine.autresImmo).toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dettes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Dettes déductibles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Emprunt résidence principale (€)"
                  type="number"
                  value={dettes.empruntResidencePrincipale}
                  onChange={(e) => setDettes({...dettes, empruntResidencePrincipale: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Emprunt résidence secondaire (€)"
                  type="number"
                  value={dettes.empruntResidenceSecondaire}
                  onChange={(e) => setDettes({...dettes, empruntResidenceSecondaire: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Emprunt immobilier locatif (€)"
                  type="number"
                  value={dettes.empruntImmobilierLocatif}
                  onChange={(e) => setDettes({...dettes, empruntImmobilierLocatif: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Autres dettes immobilières (€)"
                  type="number"
                  value={dettes.autresDettes}
                  onChange={(e) => setDettes({...dettes, autresDettes: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between font-semibold">
                  <span>Total dettes déductibles:</span>
                  <span>{(dettes.empruntResidencePrincipale + dettes.empruntResidenceSecondaire + dettes.empruntImmobilierLocatif + dettes.autresDettes).toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="situation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" />
                Situation familiale
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Situation familiale"
                  value={situation.situationFamiliale}
                  onChange={(value) => setSituation({...situation, situationFamiliale: value})}
                  options={[
                    { value: "Marié", label: "Marié(e)" },
                    { value: "Pacsé", label: "Pacsé(e)" },
                    { value: "Célibataire", label: "Célibataire" },
                    { value: "Divorcé", label: "Divorcé(e)" },
                    { value: "Veuf", label: "Veuf/Veuve" }
                  ]}
                />
                <InputField
                  label="Nombre d'enfants mineurs"
                  type="number"
                  value={situation.nombreEnfantsMineurs}
                  onChange={(e) => setSituation({...situation, nombreEnfantsMineurs: parseInt(e.target.value) || 0})}
                  min="0"
                  max="10"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={situation.decotePossible}
                    onChange={(e) => setSituation({...situation, decotePossible: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Appliquer la décote (patrimoine entre 1,3 et 1,4 M€)</label>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Abattements et avantages</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Résidence principale : abattement de 30% (plafonné à 100 000 €)</li>
                  <li>• Seuil d'imposition : 1 300 000 €</li>
                  <li>• Décote pour les patrimoines entre 1,3 et 1,4 M€</li>
                  <li>• Plafonnement possible selon les revenus</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg" className="px-8">
          <Calculator className="h-4 w-4 mr-2" />
          Calculer l'IFI
        </Button>
      </div>
    </div>
  );
};

export default DiagnosticIFI;