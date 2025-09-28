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

const DiagnosticPlusValuesImmo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bien');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const [bien, setBien] = useState({
    prixAcquisition: 200000,
    fraisAcquisition: 15000,
    travaux: 20000,
    prixCession: 280000,
    fraisCession: 8000,
    dateAcquisition: "2015-01-01",
    dateCession: "2024-01-01"
  });

  const [situation, setSituation] = useState({
    natureBien: "Résidence secondaire",
    residencePrincipale: false,
    dureeDetentionAnnees: 9,
    dureeDetentionMois: 0
  });

  const [exonerations, setExonerations] = useState({
    residencePrincipalePossible: false,
    petiteMontantPossible: false,
    expropriation: false,
    premiereVente: false
  });

  const calculatePlusValue = () => {
    const prixAcquisitionTotal = bien.prixAcquisition + bien.fraisAcquisition + bien.travaux;
    const prixCessionNet = bien.prixCession - bien.fraisCession;
    const plusValueBrute = prixCessionNet - prixAcquisitionTotal;

    const dureeDetentionTotale = situation.dureeDetentionAnnees + (situation.dureeDetentionMois / 12);

    let abattementImpotRevenu = 0;
    let abattementPrelevements = 0;

    if (dureeDetentionTotale > 2) {
      const anneesCompletes = Math.floor(dureeDetentionTotale);

      for (let i = 3; i <= Math.min(anneesCompletes, 22); i++) {
        abattementImpotRevenu += 6;
      }
      if (anneesCompletes >= 23) abattementImpotRevenu += 4;
      if (anneesCompletes >= 30) abattementImpotRevenu = 100;

      for (let i = 6; i <= Math.min(anneesCompletes, 21); i++) {
        abattementPrelevements += 1.65;
      }
      if (anneesCompletes === 22) abattementPrelevements += 1.60;
      if (anneesCompletes >= 23) abattementPrelevements += 9;
      if (anneesCompletes >= 30) abattementPrelevements = 100;
    }

    const plusValueImposableIR = plusValueBrute * (1 - abattementImpotRevenu / 100);
    const plusValueImposablePS = plusValueBrute * (1 - abattementPrelevements / 100);

    const impotRevenu = Math.max(0, plusValueImposableIR * 0.19);
    const prelevementsSociaux = Math.max(0, plusValueImposablePS * 0.172);

    const impotTotal = impotRevenu + prelevementsSociaux;
    const plusValueNette = plusValueBrute - impotTotal;

    let exonerationApplicable = null;
    if (situation.natureBien === "Résidence principale") {
      exonerationApplicable = "Résidence principale - Exonération totale";
    } else if (bien.prixCession <= 15000) {
      exonerationApplicable = "Vente de faible montant - Exonération totale";
    }

    return {
      prixAcquisitionTotal,
      prixCessionNet,
      plusValueBrute,
      dureeDetentionTotale,
      abattementImpotRevenu,
      abattementPrelevements,
      plusValueImposableIR,
      plusValueImposablePS,
      impotRevenu,
      prelevementsSociaux,
      impotTotal,
      plusValueNette,
      exonerationApplicable,
      tauxImpositionGlobal: plusValueBrute > 0 ? (impotTotal / plusValueBrute) * 100 : 0
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculatePlusValue();
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
            <h1 className="text-2xl font-bold text-foreground">Calcul de la plus-value immobilière</h1>
            <p className="text-muted-foreground">Fiscalité des plus-values immobilières</p>
          </div>
        </div>

        {results.exonerationApplicable ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600">Exonération totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600 mb-2">{results.exonerationApplicable}</div>
                <div className="text-lg text-green-700">Aucun impôt à payer</div>
                <div className="text-sm text-gray-600 mt-2">
                  Plus-value brute : {results.plusValueBrute.toLocaleString()} €
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-blue-600" />
                    Calcul de la plus-value
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Prix de cession (net):</span>
                      <span className="font-medium">{results.prixCessionNet.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prix d'acquisition (total):</span>
                      <span className="font-medium">-{results.prixAcquisitionTotal.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Plus-value brute:</span>
                      <span className="text-blue-600">{results.plusValueBrute.toLocaleString()} €</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-700">
                      <div>Durée de détention : {results.dureeDetentionTotale.toFixed(1)} ans</div>
                      <div>Abattement IR : {results.abattementImpotRevenu}%</div>
                      <div>Abattement PS : {results.abattementPrelevements.toFixed(2)}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-red-600" />
                    Imposition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{results.impotTotal.toLocaleString()} €</div>
                    <div className="text-sm text-gray-600">Total impôts et prélèvements</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Impôt sur le revenu (19%):</span>
                      <span className="font-medium text-red-600">{results.impotRevenu.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prélèvements sociaux (17,2%):</span>
                      <span className="font-medium text-red-600">{results.prelevementsSociaux.toLocaleString()} €</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Plus-value nette:</span>
                      <span className="text-green-600">{results.plusValueNette.toLocaleString()} €</span>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <div className="text-lg font-semibold text-orange-700">
                      Taux d'imposition global : {results.tauxImpositionGlobal.toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Détail des abattements pour durée de détention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-600">Impôt sur le revenu</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Plus-value brute:</span>
                        <span>{results.plusValueBrute.toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Abattement ({results.abattementImpotRevenu}%):</span>
                        <span>-{((results.plusValueBrute * results.abattementImpotRevenu) / 100).toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Base imposable:</span>
                        <span>{results.plusValueImposableIR.toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Impôt (19%):</span>
                        <span className="text-red-600">{results.impotRevenu.toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-green-600">Prélèvements sociaux</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Plus-value brute:</span>
                        <span>{results.plusValueBrute.toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Abattement ({results.abattementPrelevements.toFixed(2)}%):</span>
                        <span>-{((results.plusValueBrute * results.abattementPrelevements) / 100).toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Base imposable:</span>
                        <span>{results.plusValueImposablePS.toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Prélèvements (17,2%):</span>
                        <span className="text-red-600">{results.prelevementsSociaux.toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
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
          <h1 className="text-2xl font-bold text-foreground">Diagnostic Fiscalité des plus-values immobilières</h1>
          <p className="text-muted-foreground">Calculer la plus-value immobilière et l'impôt qui en résulte</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bien">Bien</TabsTrigger>
          <TabsTrigger value="situation">Situation</TabsTrigger>
          <TabsTrigger value="exonerations">Exonérations</TabsTrigger>
        </TabsList>

        <TabsContent value="bien" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-blue-600" />
                Informations sur le bien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Prix d'acquisition (€)"
                  type="number"
                  value={bien.prixAcquisition}
                  onChange={(e) => setBien({...bien, prixAcquisition: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Frais d'acquisition (€)"
                  type="number"
                  value={bien.fraisAcquisition}
                  onChange={(e) => setBien({...bien, fraisAcquisition: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Travaux (€)"
                  type="number"
                  value={bien.travaux}
                  onChange={(e) => setBien({...bien, travaux: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Prix de cession (€)"
                  type="number"
                  value={bien.prixCession}
                  onChange={(e) => setBien({...bien, prixCession: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Frais de cession (€)"
                  type="number"
                  value={bien.fraisCession}
                  onChange={(e) => setBien({...bien, fraisCession: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Date d'acquisition"
                  type="date"
                  value={bien.dateAcquisition}
                  onChange={(e) => setBien({...bien, dateAcquisition: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Date de cession"
                  type="date"
                  value={bien.dateCession}
                  onChange={(e) => setBien({...bien, dateCession: e.target.value})}
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Prix d'acquisition total:</span>
                    <span className="font-medium">{(bien.prixAcquisition + bien.fraisAcquisition + bien.travaux).toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prix de cession net:</span>
                    <span className="font-medium">{(bien.prixCession - bien.fraisCession).toLocaleString()} €</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Plus-value brute:</span>
                    <span>{((bien.prixCession - bien.fraisCession) - (bien.prixAcquisition + bien.fraisAcquisition + bien.travaux)).toLocaleString()} €</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="situation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Nature du bien et durée de détention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Nature du bien"
                  value={situation.natureBien}
                  onChange={(value) => setSituation({...situation, natureBien: value})}
                  options={[
                    { value: "Résidence principale", label: "Résidence principale" },
                    { value: "Résidence secondaire", label: "Résidence secondaire" },
                    { value: "Immobilier locatif", label: "Immobilier locatif" },
                    { value: "Terrain", label: "Terrain à bâtir" },
                    { value: "Local commercial", label: "Local commercial" }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Durée de détention (années)"
                  type="number"
                  value={situation.dureeDetentionAnnees}
                  onChange={(e) => setSituation({...situation, dureeDetentionAnnees: parseInt(e.target.value) || 0})}
                  min="0"
                  max="50"
                />
                <InputField
                  label="Durée de détention (mois supplémentaires)"
                  type="number"
                  value={situation.dureeDetentionMois}
                  onChange={(e) => setSituation({...situation, dureeDetentionMois: parseInt(e.target.value) || 0})}
                  min="0"
                  max="11"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Barème des abattements pour durée de détention</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <div className="font-medium mb-1">Impôt sur le revenu :</div>
                    <div>• De 6 à 21 ans : 6% par année</div>
                    <div>• 22e année : 4%</div>
                    <div>• Au-delà de 22 ans : exonération</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Prélèvements sociaux :</div>
                    <div>• De 6 à 21 ans : 1,65% par année</div>
                    <div>• 22e année : 1,60%</div>
                    <div>• De 23 à 29 ans : 9% par année</div>
                    <div>• Au-delà de 30 ans : exonération</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exonerations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Exonérations possibles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exonerations.residencePrincipalePossible}
                    onChange={(e) => setExonerations({...exonerations, residencePrincipalePossible: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Résidence principale (exonération totale)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exonerations.petiteMontantPossible}
                    onChange={(e) => setExonerations({...exonerations, petiteMontantPossible: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Cession de faible montant (&lt; 15 000 €)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exonerations.expropriation}
                    onChange={(e) => setExonerations({...exonerations, expropriation: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Expropriation pour cause d'utilité publique</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exonerations.premiereVente}
                    onChange={(e) => setExonerations({...exonerations, premiereVente: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label className="text-sm font-medium">Première vente d'un logement autre que la résidence principale</label>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">💡 Principales exonérations</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Résidence principale : exonération totale</li>
                  <li>• Cessions ≤ 15 000 € : exonération totale</li>
                  <li>• Détention ≥ 30 ans : exonération totale</li>
                  <li>• Première vente sous conditions : exonération possible</li>
                  <li>• Personnes âgées ou en situation de handicap : conditions particulières</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg" className="px-8">
          <Calculator className="h-4 w-4 mr-2" />
          Calculer la plus-value
        </Button>
      </div>
    </div>
  );
};

export default DiagnosticPlusValuesImmo;