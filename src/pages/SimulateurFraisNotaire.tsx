import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft, FileText } from "lucide-react";
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

const SelectField = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const SimulateurFraisNotaire = () => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const [achat, setAchat] = useState({
    prixVente: 300000,
    typeBien: "ancien",
    departement: "75", // Paris
    typeAcquereur: "premier",
    emprunt: true,
    montantEmprunt: 250000
  });

  const calculateFraisNotaire = () => {
    const { prixVente, typeBien, departement, typeAcquereur, emprunt, montantEmprunt } = achat;

    // Barème des droits de mutation à titre onéreux
    let droitsMutation = 0;

    if (typeBien === "neuf") {
      // Bien neuf : droits réduits
      droitsMutation = prixVente * 0.00715; // 0,715%
    } else {
      // Bien ancien : droits pleins
      if (prixVente <= 6500) {
        droitsMutation = 0;
      } else if (prixVente <= 17000) {
        droitsMutation = (prixVente - 6500) * 0.05;
      } else if (prixVente <= 60000) {
        droitsMutation = (17000 - 6500) * 0.05 + (prixVente - 17000) * 0.125;
      } else {
        droitsMutation = (17000 - 6500) * 0.05 + (60000 - 17000) * 0.125 + (prixVente - 60000) * 0.055;
      }

      // Majoration départementale (varie selon département)
      const tauxDepartemental = departement === "75" ? 0.031 : 0.012; // Paris vs autres
      droitsMutation += prixVente * tauxDepartemental;
    }

    // Émoluments du notaire
    let emoluments = 0;
    if (prixVente <= 6500) {
      emoluments = prixVente * 0.04837;
    } else if (prixVente <= 17000) {
      emoluments = 6500 * 0.04837 + (prixVente - 6500) * 0.02024;
    } else if (prixVente <= 60000) {
      emoluments = 6500 * 0.04837 + (17000 - 6500) * 0.02024 + (prixVente - 17000) * 0.01348;
    } else {
      emoluments = 6500 * 0.04837 + (17000 - 6500) * 0.02024 + (60000 - 17000) * 0.01348 + (prixVente - 60000) * 0.01011;
    }

    // Frais annexes (débours, formalités)
    const fraisAnnexes = 800 + (prixVente * 0.001); // Estimation

    // Frais de crédit si emprunt
    const fraisCredit = emprunt ? 150 + (montantEmprunt * 0.0005) : 0;

    // TVA sur émoluments et frais
    const tvaEmoluments = emoluments * 0.20;
    const tvaFraisAnnexes = fraisAnnexes * 0.20;
    const tvaFraisCredit = fraisCredit * 0.20;

    // Total
    const totalFrais = droitsMutation + emoluments + tvaEmoluments + fraisAnnexes + tvaFraisAnnexes + fraisCredit + tvaFraisCredit;

    return {
      droitsMutation: Math.round(droitsMutation),
      emoluments: Math.round(emoluments),
      tvaEmoluments: Math.round(tvaEmoluments),
      fraisAnnexes: Math.round(fraisAnnexes),
      tvaFraisAnnexes: Math.round(tvaFraisAnnexes),
      fraisCredit: Math.round(fraisCredit),
      tvaFraisCredit: Math.round(tvaFraisCredit),
      totalFrais: Math.round(totalFrais),
      pourcentage: Math.round((totalFrais / prixVente) * 100 * 100) / 100,
      totalAcquisition: prixVente + Math.round(totalFrais)
    };
  };

  const handleCalculate = () => {
    const results = calculateFraisNotaire();
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
          <h1 className="text-2xl font-bold">Frais de Notaire</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Estimation des frais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-6 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{results.totalFrais.toLocaleString()} €</div>
                <div className="text-sm text-gray-600">Total frais de notaire</div>
                <div className="text-lg font-medium text-red-500 mt-1">{results.pourcentage}% du prix</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Prix de vente:</span>
                  <span className="font-medium">{achat.prixVente.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de notaire:</span>
                  <span className="font-medium text-red-600">{results.totalFrais.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold">Total acquisition:</span>
                  <span className="font-bold">{results.totalAcquisition.toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Détail des frais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Droits de mutation:</span>
                <span className="font-medium">{results.droitsMutation.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between">
                <span>Émoluments notaire (HT):</span>
                <span className="font-medium">{results.emoluments.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between">
                <span>TVA sur émoluments:</span>
                <span className="font-medium">{results.tvaEmoluments.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between">
                <span>Frais annexes (HT):</span>
                <span className="font-medium">{results.fraisAnnexes.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between">
                <span>TVA frais annexes:</span>
                <span className="font-medium">{results.tvaFraisAnnexes.toLocaleString()} €</span>
              </div>
              {results.fraisCredit > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Frais crédit (HT):</span>
                    <span className="font-medium">{results.fraisCredit.toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA frais crédit:</span>
                    <span className="font-medium">{results.tvaFraisCredit.toLocaleString()} €</span>
                  </div>
                </>
              )}
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
        <h1 className="text-2xl font-bold">Simulateur Frais de Notaire</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Caractéristiques de l'acquisition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Prix de vente (€)"
              type="number"
              value={achat.prixVente}
              onChange={(e) => setAchat({...achat, prixVente: parseFloat(e.target.value) || 0})}
            />
            <SelectField
              label="Type de bien"
              value={achat.typeBien}
              onChange={(value) => setAchat({...achat, typeBien: value})}
              options={[
                { value: "ancien", label: "Bien ancien (+ 5 ans)" },
                { value: "neuf", label: "Bien neuf (- 5 ans)" }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Département"
              value={achat.departement}
              onChange={(value) => setAchat({...achat, departement: value})}
              options={[
                { value: "75", label: "Paris (75)" },
                { value: "92", label: "Hauts-de-Seine (92)" },
                { value: "93", label: "Seine-Saint-Denis (93)" },
                { value: "94", label: "Val-de-Marne (94)" },
                { value: "autre", label: "Autre département" }
              ]}
            />
            <SelectField
              label="Type d'acquéreur"
              value={achat.typeAcquereur}
              onChange={(value) => setAchat({...achat, typeAcquereur: value})}
              options={[
                { value: "premier", label: "Primo-accédant" },
                { value: "investisseur", label: "Investisseur" }
              ]}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={achat.emprunt}
                onChange={(e) => setAchat({...achat, emprunt: e.target.checked})}
                className="rounded"
              />
              <label className="text-sm font-medium">Financement par crédit immobilier</label>
            </div>

            {achat.emprunt && (
              <InputField
                label="Montant de l'emprunt (€)"
                type="number"
                value={achat.montantEmprunt}
                onChange={(e) => setAchat({...achat, montantEmprunt: parseFloat(e.target.value) || 0})}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg">
          <Calculator className="h-4 w-4 mr-2" />
          Calculer les frais
        </Button>
      </div>
    </div>
  );
};

export default SimulateurFraisNotaire;