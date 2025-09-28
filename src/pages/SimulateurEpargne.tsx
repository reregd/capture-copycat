import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft, TrendingUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InputField = ({ label, type = "text", value, onChange, step, min, max }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      step={step}
      min={min}
      max={max}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    />
  </div>
);

const SimulateurEpargne = () => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const [epargne, setEpargne] = useState({
    capitalInitial: 10000,
    versementMensuel: 300,
    tauxAnnuel: 3.5,
    dureeAnnees: 10,
    typeVersement: "mensuel"
  });

  const calculateEpargne = () => {
    const { capitalInitial, versementMensuel, tauxAnnuel, dureeAnnees } = epargne;
    const tauxMensuel = tauxAnnuel / 100 / 12;
    const nombreMois = dureeAnnees * 12;

    let capital = capitalInitial;
    const evolutionData = [];
    let totalVersements = capitalInitial;

    // Calcul mois par mois
    for (let mois = 0; mois <= nombreMois; mois++) {
      if (mois % 12 === 0) { // Enregistrer chaque année
        evolutionData.push({
          annee: mois / 12,
          capital: Math.round(capital),
          versements: Math.round(totalVersements),
          interets: Math.round(capital - totalVersements)
        });
      }

      if (mois < nombreMois) {
        capital = capital * (1 + tauxMensuel) + versementMensuel;
        totalVersements += versementMensuel;
      }
    }

    const capitalFinal = Math.round(capital);
    const totalInterets = capitalFinal - totalVersements;
    const rendementTotal = ((capitalFinal / totalVersements) - 1) * 100;

    return {
      capitalFinal,
      totalVersements: Math.round(totalVersements),
      totalInterets: Math.round(totalInterets),
      rendementTotal: Math.round(rendementTotal * 100) / 100,
      evolutionData
    };
  };

  const handleCalculate = () => {
    const results = calculateEpargne();
    setResults(results);
    setShowResults(true);
  };

  if (showResults && results) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setShowResults(false)}>
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Résultats Épargne</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Résultats de l'épargne</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{results.capitalFinal.toLocaleString()} €</div>
                  <div className="text-sm text-gray-600">Capital final</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{results.totalInterets.toLocaleString()} €</div>
                  <div className="text-sm text-gray-600">Intérêts générés</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total versements:</span>
                  <span className="font-medium">{results.totalVersements.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Rendement total:</span>
                  <span className="font-medium text-green-600">+{results.rendementTotal}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <Line type="monotone" dataKey="capital" stroke="#3b82f6" strokeWidth={3} />
                  <Line type="monotone" dataKey="versements" stroke="#06b6d4" strokeWidth={2} />
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
        <Button variant="outline" size="sm" onClick={() => navigate('/simulateurs')}>
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Simulateur Épargne</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Paramètres de l'épargne
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Capital initial (€)"
              type="number"
              value={epargne.capitalInitial}
              onChange={(e) => setEpargne({...epargne, capitalInitial: parseFloat(e.target.value) || 0})}
            />
            <InputField
              label="Versement mensuel (€)"
              type="number"
              value={epargne.versementMensuel}
              onChange={(e) => setEpargne({...epargne, versementMensuel: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Taux annuel (%)"
              type="number"
              step="0.1"
              value={epargne.tauxAnnuel}
              onChange={(e) => setEpargne({...epargne, tauxAnnuel: parseFloat(e.target.value) || 0})}
            />
            <InputField
              label="Durée (années)"
              type="number"
              value={epargne.dureeAnnees}
              onChange={(e) => setEpargne({...epargne, dureeAnnees: parseInt(e.target.value) || 0})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg">
          <Calculator className="h-4 w-4 mr-2" />
          Calculer l'épargne
        </Button>
      </div>
    </div>
  );
};

export default SimulateurEpargne;