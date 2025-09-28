import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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

const SimulateurCapaciteAcquisition = () => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const [situation, setSituation] = useState({
    revenus: 4500,
    chargesExistantes: 500,
    apportPersonnel: 50000,
    tauxEndettement: 35,
    tauxCredit: 3.5,
    dureeCredit: 25,
    fraisNotaire: 7
  });

  const calculateCapacite = () => {
    const { revenus, chargesExistantes, apportPersonnel, tauxEndettement, tauxCredit, dureeCredit, fraisNotaire } = situation;

    // Capacité d'endettement mensuelle
    const capaciteEndettement = (revenus * tauxEndettement / 100) - chargesExistantes;

    // Calcul de la capacité d'emprunt
    const tauxMensuel = tauxCredit / 100 / 12;
    const nombreMensualites = dureeCredit * 12;

    const capaciteEmprunt = capaciteEndettement * ((1 - Math.pow(1 + tauxMensuel, -nombreMensualites)) / tauxMensuel);

    // Prix maximum du bien
    const fraisTotal = fraisNotaire / 100;
    const prixMaxBien = (capaciteEmprunt + apportPersonnel) / (1 + fraisTotal);

    // Répartition du financement
    const montantFrais = prixMaxBien * fraisTotal;
    const montantTotal = prixMaxBien + montantFrais;

    return {
      capaciteEndettement: Math.round(capaciteEndettement),
      capaciteEmprunt: Math.round(capaciteEmprunt),
      prixMaxBien: Math.round(prixMaxBien),
      montantFrais: Math.round(montantFrais),
      montantTotal: Math.round(montantTotal),
      mensualiteMax: Math.round(capaciteEndettement),
      tauxEffortFinancement: Math.round((capaciteEndettement / revenus) * 100 * 100) / 100
    };
  };

  const handleCalculate = () => {
    const results = calculateCapacite();
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
          <h1 className="text-2xl font-bold">Capacité d'Acquisition</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Votre capacité d'acquisition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{results.prixMaxBien.toLocaleString()} €</div>
                <div className="text-sm text-gray-600">Prix maximum du bien</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Capacité d'emprunt:</span>
                  <span className="font-medium">{results.capaciteEmprunt.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Apport personnel:</span>
                  <span className="font-medium">{situation.apportPersonnel.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais d'acquisition:</span>
                  <span className="font-medium">{results.montantFrais.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Montant total:</span>
                  <span className="font-bold">{results.montantTotal.toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détails du financement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{results.mensualiteMax.toLocaleString()} €</div>
                  <div className="text-sm text-gray-600">Mensualité max</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-xl font-bold text-orange-600">{results.tauxEffortFinancement}%</div>
                  <div className="text-sm text-gray-600">Taux d'effort</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Revenus mensuels:</span>
                  <span className="font-medium">{situation.revenus.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Charges existantes:</span>
                  <span className="font-medium">{situation.chargesExistantes.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacité d'endettement:</span>
                  <span className="font-medium">{results.capaciteEndettement.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée du crédit:</span>
                  <span className="font-medium">{situation.dureeCredit} ans</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux du crédit:</span>
                  <span className="font-medium">{situation.tauxCredit}%</span>
                </div>
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
        <Button variant="outline" size="sm" onClick={() => navigate('/simulateurs')}>
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Simulateur Capacité d'Acquisition</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            Vos revenus et charges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Revenus mensuels nets (€)"
              type="number"
              value={situation.revenus}
              onChange={(e) => setSituation({...situation, revenus: parseFloat(e.target.value) || 0})}
            />
            <InputField
              label="Charges existantes mensuelles (€)"
              type="number"
              value={situation.chargesExistantes}
              onChange={(e) => setSituation({...situation, chargesExistantes: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Apport personnel (€)"
              type="number"
              value={situation.apportPersonnel}
              onChange={(e) => setSituation({...situation, apportPersonnel: parseFloat(e.target.value) || 0})}
            />
            <InputField
              label="Taux d'endettement max (%)"
              type="number"
              step="1"
              value={situation.tauxEndettement}
              onChange={(e) => setSituation({...situation, tauxEndettement: parseFloat(e.target.value) || 0})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              label="Taux du crédit (%)"
              type="number"
              step="0.1"
              value={situation.tauxCredit}
              onChange={(e) => setSituation({...situation, tauxCredit: parseFloat(e.target.value) || 0})}
            />
            <InputField
              label="Durée du crédit (années)"
              type="number"
              value={situation.dureeCredit}
              onChange={(e) => setSituation({...situation, dureeCredit: parseInt(e.target.value) || 0})}
            />
            <InputField
              label="Frais de notaire (%)"
              type="number"
              step="0.1"
              value={situation.fraisNotaire}
              onChange={(e) => setSituation({...situation, fraisNotaire: parseFloat(e.target.value) || 0})}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg">
          <Calculator className="h-4 w-4 mr-2" />
          Calculer ma capacité
        </Button>
      </div>
    </div>
  );
};

export default SimulateurCapaciteAcquisition;