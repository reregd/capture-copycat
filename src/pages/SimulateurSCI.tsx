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

const SimulateurSCI = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bien');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const [bien, setBien] = useState({
    valeur: 300000,
    loyersAnnuels: 18000,
    charges: 3000,
    travaux: 2000
  });

  const [sciIR, setSciIR] = useState({
    regimeFiscal: "IR",
    tauxImposition: 30,
    fraisGestion: 1000,
    amortissements: 8000
  });

  const [sciIS, setSciIS] = useState({
    regimeFiscal: "IS",
    tauxIS: 25,
    fraisGestion: 1000,
    amortissements: 8000,
    salaireDirigeant: 12000
  });

  const calculateSCI = () => {
    const revenuBrut = bien.loyersAnnuels;
    const chargesDeductibles = bien.charges + bien.travaux;

    const resultatsIR = {
      revenuBrut,
      charges: chargesDeductibles + sciIR.fraisGestion,
      amortissements: sciIR.amortissements,
      revenuImposable: revenuBrut - chargesDeductibles - sciIR.fraisGestion - sciIR.amortissements,
      impot: 0,
      rendementNet: 0
    };
    resultatsIR.impot = Math.max(0, resultatsIR.revenuImposable * (sciIR.tauxImposition / 100));
    resultatsIR.rendementNet = resultatsIR.revenuImposable - resultatsIR.impot;

    const resultatsIS = {
      revenuBrut,
      charges: chargesDeductibles + sciIS.fraisGestion + sciIS.salaireDirigeant,
      amortissements: sciIS.amortissements,
      resultatAvantIS: 0,
      impotSocietes: 0,
      resultatNet: 0,
      rendementNet: 0
    };
    resultatsIS.resultatAvantIS = revenuBrut - resultatsIS.charges - resultatsIS.amortissements;
    resultatsIS.impotSocietes = Math.max(0, resultatsIS.resultatAvantIS * (sciIS.tauxIS / 100));
    resultatsIS.resultatNet = resultatsIS.resultatAvantIS - resultatsIS.impotSocietes;
    resultatsIS.rendementNet = resultatsIS.resultatNet;

    const avantageIS = resultatsIS.rendementNet - resultatsIR.rendementNet;

    return {
      ir: resultatsIR,
      is: resultatsIS,
      avantageIS,
      recommandation: avantageIS > 0 ? "IS" : "IR"
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculateSCI();
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
            <h1 className="text-2xl font-bold text-foreground">Comparaison SCI IR vs IS</h1>
            <p className="text-muted-foreground">Analyse comparative des deux régimes fiscaux</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">SCI à l'Impôt sur le Revenu (IR)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Revenus locatifs:</span>
                  <span className="font-medium">{results.ir.revenuBrut.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Charges déductibles:</span>
                  <span className="font-medium">-{results.ir.charges.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Amortissements:</span>
                  <span className="font-medium">-{results.ir.amortissements.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Revenu imposable:</span>
                  <span className="font-medium">{results.ir.revenuImposable.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Impôt sur le revenu:</span>
                  <span className="font-medium text-red-600">-{results.ir.impot.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Rendement net:</span>
                  <span className="text-blue-600">{results.ir.rendementNet.toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">SCI à l'Impôt sur les Sociétés (IS)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Revenus locatifs:</span>
                  <span className="font-medium">{results.is.revenuBrut.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Charges + salaire:</span>
                  <span className="font-medium">-{results.is.charges.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Amortissements:</span>
                  <span className="font-medium">-{results.is.amortissements.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Résultat avant IS:</span>
                  <span className="font-medium">{results.is.resultatAvantIS.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Impôt sur les sociétés:</span>
                  <span className="font-medium text-red-600">-{results.is.impotSocietes.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Rendement net:</span>
                  <span className="text-green-600">{results.is.rendementNet.toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Recommandation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${results.recommandation === 'IS' ? 'text-green-600' : 'text-blue-600'}`}>
                Optez pour la SCI à l'{results.recommandation}
              </div>
              <div className={`text-lg ${results.avantageIS > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {results.avantageIS > 0 ? 'Avantage IS:' : 'Avantage IR:'} {Math.abs(results.avantageIS).toLocaleString()} € / an
              </div>
              <div className="text-sm text-gray-600 mt-4">
                {results.recommandation === 'IS'
                  ? 'L\'IS est plus avantageux pour votre situation'
                  : 'L\'IR reste plus favorable dans votre cas'
                }
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
          <h1 className="text-2xl font-bold text-foreground">Simulateur SCI</h1>
          <p className="text-muted-foreground">Comparer la location d'un immeuble dans le cadre d'une SCI à l'IR ou à l'IS</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bien">Bien immobilier</TabsTrigger>
          <TabsTrigger value="sci-ir">SCI à l'IR</TabsTrigger>
          <TabsTrigger value="sci-is">SCI à l'IS</TabsTrigger>
        </TabsList>

        <TabsContent value="bien" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Caractéristiques du bien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Valeur du bien (€)"
                  type="number"
                  value={bien.valeur}
                  onChange={(e) => setBien({...bien, valeur: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Loyers annuels (€)"
                  type="number"
                  value={bien.loyersAnnuels}
                  onChange={(e) => setBien({...bien, loyersAnnuels: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Charges annuelles (€)"
                  type="number"
                  value={bien.charges}
                  onChange={(e) => setBien({...bien, charges: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Travaux annuels (€)"
                  type="number"
                  value={bien.travaux}
                  onChange={(e) => setBien({...bien, travaux: parseFloat(e.target.value) || 0})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sci-ir" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                SCI à l'Impôt sur le Revenu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Taux d'imposition marginal (%)"
                  type="number"
                  value={sciIR.tauxImposition}
                  onChange={(e) => setSciIR({...sciIR, tauxImposition: parseFloat(e.target.value) || 0})}
                  step="0.1"
                  min="0"
                  max="45"
                />
                <InputField
                  label="Frais de gestion annuels (€)"
                  type="number"
                  value={sciIR.fraisGestion}
                  onChange={(e) => setSciIR({...sciIR, fraisGestion: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Amortissements annuels (€)"
                  type="number"
                  value={sciIR.amortissements}
                  onChange={(e) => setSciIR({...sciIR, amortissements: parseFloat(e.target.value) || 0})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sci-is" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                SCI à l'Impôt sur les Sociétés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Taux d'IS (%)"
                  type="number"
                  value={sciIS.tauxIS}
                  onChange={(e) => setSciIS({...sciIS, tauxIS: parseFloat(e.target.value) || 0})}
                  step="0.1"
                  min="15"
                  max="33.33"
                />
                <InputField
                  label="Frais de gestion annuels (€)"
                  type="number"
                  value={sciIS.fraisGestion}
                  onChange={(e) => setSciIS({...sciIS, fraisGestion: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Amortissements annuels (€)"
                  type="number"
                  value={sciIS.amortissements}
                  onChange={(e) => setSciIS({...sciIS, amortissements: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Salaire du dirigeant (€)"
                  type="number"
                  value={sciIS.salaireDirigeant}
                  onChange={(e) => setSciIS({...sciIS, salaireDirigeant: parseFloat(e.target.value) || 0})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg" className="px-8">
          <Calculator className="h-4 w-4 mr-2" />
          Comparer IR vs IS
        </Button>
      </div>
    </div>
  );
};

export default SimulateurSCI;