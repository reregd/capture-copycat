import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FileText, TrendingDown, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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

const DiagnosticImpotRevenu = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('situation');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // État situation fiscale
  const [situation, setSituation] = useState({
    situationFamiliale: "Célibataire",
    nombreEnfants: 0,
    nombrePersonnesCharge: 0,
    residenceFiscale: "France"
  });

  // État revenus
  const [revenus, setRevenus] = useState({
    salaires: 45000,
    pensionsRetraite: 0,
    beneficesCommerce: 0,
    beneficesAgricoles: 0,
    beneficesIndustriels: 0,
    revenusCapitaux: 0,
    revenusFonciers: 0,
    plusValues: 0,
    autresRevenus: 0
  });

  // État charges déductibles
  const [charges, setCharges] = useState([]);

  // État optimisations
  const [optimisations, setOptimisations] = useState([
    { type: "PER", montant: 0, economie: 0 },
    { type: "Déficit foncier", montant: 0, economie: 0 },
    { type: "Dons", montant: 0, economie: 0 },
    { type: "Emploi à domicile", montant: 0, economie: 0 }
  ]);

  const addCharge = () => {
    setCharges([...charges, { description: "", montant: 0 }]);
  };

  const removeCharge = (index) => {
    setCharges(charges.filter((_, i) => i !== index));
  };

  const updateCharge = (index, field, value) => {
    const newCharges = [...charges];
    newCharges[index] = { ...newCharges[index], [field]: value };
    setCharges(newCharges);
  };

  // Barème impôt 2024 (célibataire)
  const calculateImpot = (revenuImposable, nbParts) => {
    const quotientFamilial = revenuImposable / nbParts;
    let impot = 0;

    if (quotientFamilial <= 10777) {
      impot = 0;
    } else if (quotientFamilial <= 27478) {
      impot = (quotientFamilial - 10777) * 0.11;
    } else if (quotientFamilial <= 78570) {
      impot = (27478 - 10777) * 0.11 + (quotientFamilial - 27478) * 0.30;
    } else if (quotientFamilial <= 168994) {
      impot = (27478 - 10777) * 0.11 + (78570 - 27478) * 0.30 + (quotientFamilial - 78570) * 0.41;
    } else {
      impot = (27478 - 10777) * 0.11 + (78570 - 27478) * 0.30 + (168994 - 78570) * 0.41 + (quotientFamilial - 168994) * 0.45;
    }

    return Math.max(0, impot * nbParts);
  };

  const calculateNbParts = () => {
    let parts = situation.situationFamiliale === "Marié(e)" || situation.situationFamiliale === "Pacsé(e)" ? 2 : 1;
    parts += situation.nombreEnfants * 0.5;
    if (situation.nombreEnfants >= 3) {
      parts += (situation.nombreEnfants - 2) * 0.5; // Demi-part supplémentaire à partir du 3e enfant
    }
    parts += situation.nombrePersonnesCharge * 0.5;
    return parts;
  };

  const performDiagnostic = () => {
    const totalRevenus = Object.values(revenus).reduce((sum, val) => sum + val, 0);
    const totalCharges = charges.reduce((sum, charge) => sum + charge.montant, 0);
    const revenuImposable = Math.max(0, totalRevenus - totalCharges);

    const nbParts = calculateNbParts();
    const impotBrut = calculateImpot(revenuImposable, nbParts);

    // Décote pour les revenus modestes
    const plafondDecote = situation.situationFamiliale === "Marié(e)" || situation.situationFamiliale === "Pacsé(e)" ? 2906 : 1746;
    const decote = impotBrut < plafondDecote ? Math.max(0, plafondDecote - impotBrut) : 0;

    const impotNet = Math.max(0, impotBrut - decote);
    const tauxMarginal = revenuImposable <= 10777 ? 0 :
                        revenuImposable <= 27478 ? 11 :
                        revenuImposable <= 78570 ? 30 :
                        revenuImposable <= 168994 ? 41 : 45;

    // Calcul des optimisations
    const optimisationsCalculees = optimisations.map(opt => {
      let economie = 0;
      if (opt.montant > 0) {
        switch (opt.type) {
          case "PER":
            economie = opt.montant * (tauxMarginal / 100);
            break;
          case "Déficit foncier":
            economie = Math.min(opt.montant, 10700) * (tauxMarginal / 100);
            break;
          case "Dons":
            economie = opt.montant * 0.66; // 66% de réduction
            break;
          case "Emploi à domicile":
            economie = Math.min(opt.montant, 12000) * 0.50; // 50% de crédit d'impôt
            break;
        }
      }
      return { ...opt, economie: Math.round(economie) };
    });

    const totalEconomies = optimisationsCalculees.reduce((sum, opt) => sum + opt.economie, 0);

    // Données pour les graphiques
    const repartitionRevenus = [
      { name: 'Salaires', value: revenus.salaires, fill: '#3b82f6' },
      { name: 'Pensions', value: revenus.pensionsRetraite, fill: '#06b6d4' },
      { name: 'BIC', value: revenus.beneficesIndustriels, fill: '#8b5cf6' },
      { name: 'Fonciers', value: revenus.revenusFonciers, fill: '#10b981' },
      { name: 'Capitaux', value: revenus.revenusCapitaux, fill: '#f59e0b' },
      { name: 'Autres', value: revenus.autresRevenus + revenus.beneficesCommerce + revenus.beneficesAgricoles + revenus.plusValues, fill: '#ef4444' }
    ].filter(item => item.value > 0);

    return {
      totalRevenus: Math.round(totalRevenus),
      totalCharges: Math.round(totalCharges),
      revenuImposable: Math.round(revenuImposable),
      nbParts,
      impotBrut: Math.round(impotBrut),
      decote: Math.round(decote),
      impotNet: Math.round(impotNet),
      tauxMarginal,
      tauxMoyen: revenuImposable > 0 ? Math.round((impotNet / revenuImposable) * 100 * 100) / 100 : 0,
      optimisationsCalculees,
      totalEconomies: Math.round(totalEconomies),
      impotOptimise: Math.round(Math.max(0, impotNet - totalEconomies)),
      repartitionRevenus
    };
  };

  const handleCalculate = () => {
    const calculatedResults = performDiagnostic();
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
            Retour au diagnostic
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Diagnostic Impôt sur le Revenu</h1>
            <p className="text-muted-foreground">Calcul rapide de votre impôt et optimisations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Résultats principaux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Calcul de l'impôt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{results.impotNet.toLocaleString()} €</div>
                  <div className="text-sm text-gray-600">Impôt à payer</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{results.totalEconomies.toLocaleString()} €</div>
                  <div className="text-sm text-gray-600">Économies possibles</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Revenus totaux:</span>
                  <span className="font-medium">{results.totalRevenus.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Charges déductibles:</span>
                  <span className="font-medium">-{results.totalCharges.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenu imposable:</span>
                  <span className="font-medium">{results.revenuImposable.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Nombre de parts:</span>
                  <span className="font-medium">{results.nbParts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux marginal:</span>
                  <span className="font-medium">{results.tauxMarginal}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux moyen:</span>
                  <span className="font-medium">{results.tauxMoyen}%</span>
                </div>
              </div>

              {results.impotOptimise < results.impotNet && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{results.impotOptimise.toLocaleString()} €</div>
                    <div className="text-sm text-green-700">Impôt après optimisation</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Répartition des revenus */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={results.repartitionRevenus}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {results.repartitionRevenus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Optimisations */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                Optimisations fiscales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {results.optimisationsCalculees.map((opt, index) => (
                  <div key={opt.type} className="p-4 border rounded-lg">
                    <div className="font-medium text-sm mb-2">{opt.type}</div>
                    <div className="text-lg font-bold text-green-600">{opt.economie.toLocaleString()} €</div>
                    <div className="text-xs text-gray-600">sur {opt.montant.toLocaleString()} € investi</div>
                  </div>
                ))}
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
          <h1 className="text-2xl font-bold text-foreground">Diagnostic Impôt sur le Revenu</h1>
          <p className="text-muted-foreground">Calculez rapidement votre impôt et trouvez des optimisations</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="situation">Situation</TabsTrigger>
          <TabsTrigger value="revenus">Revenus</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="optimisations">Optimisations</TabsTrigger>
        </TabsList>

        <TabsContent value="situation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
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
                    { value: "Célibataire", label: "Célibataire" },
                    { value: "Marié(e)", label: "Marié(e)" },
                    { value: "Pacsé(e)", label: "Pacsé(e)" },
                    { value: "Divorcé(e)", label: "Divorcé(e)" },
                    { value: "Veuf(ve)", label: "Veuf(ve)" }
                  ]}
                />
                <SelectField
                  label="Résidence fiscale"
                  value={situation.residenceFiscale}
                  onChange={(value) => setSituation({...situation, residenceFiscale: value})}
                  options={[
                    { value: "France", label: "France" },
                    { value: "Étranger", label: "Étranger" }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nombre d'enfants à charge"
                  type="number"
                  value={situation.nombreEnfants}
                  onChange={(e) => setSituation({...situation, nombreEnfants: parseInt(e.target.value) || 0})}
                  min="0"
                  max="10"
                />
                <InputField
                  label="Autres personnes à charge"
                  type="number"
                  value={situation.nombrePersonnesCharge}
                  onChange={(e) => setSituation({...situation, nombrePersonnesCharge: parseInt(e.target.value) || 0})}
                  min="0"
                  max="5"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenus" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenus annuels 2024</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Traitements et salaires (€)"
                  type="number"
                  value={revenus.salaires}
                  onChange={(e) => setRevenus({...revenus, salaires: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Pensions de retraite (€)"
                  type="number"
                  value={revenus.pensionsRetraite}
                  onChange={(e) => setRevenus({...revenus, pensionsRetraite: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Bénéfices industriels et commerciaux (€)"
                  type="number"
                  value={revenus.beneficesIndustriels}
                  onChange={(e) => setRevenus({...revenus, beneficesIndustriels: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Bénéfices agricoles (€)"
                  type="number"
                  value={revenus.beneficesAgricoles}
                  onChange={(e) => setRevenus({...revenus, beneficesAgricoles: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Revenus fonciers (€)"
                  type="number"
                  value={revenus.revenusFonciers}
                  onChange={(e) => setRevenus({...revenus, revenusFonciers: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Revenus de capitaux mobiliers (€)"
                  type="number"
                  value={revenus.revenusCapitaux}
                  onChange={(e) => setRevenus({...revenus, revenusCapitaux: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Plus-values (€)"
                  type="number"
                  value={revenus.plusValues}
                  onChange={(e) => setRevenus({...revenus, plusValues: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Autres revenus (€)"
                  type="number"
                  value={revenus.autresRevenus}
                  onChange={(e) => setRevenus({...revenus, autresRevenus: parseFloat(e.target.value) || 0})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Charges déductibles
                <Button onClick={addCharge} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {charges.map((charge, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <InputField
                      label="Description"
                      value={charge.description}
                      onChange={(e) => updateCharge(index, 'description', e.target.value)}
                      placeholder="Ex: Frais professionnels, pension alimentaire..."
                    />
                  </div>
                  <div className="w-32">
                    <InputField
                      label="Montant (€)"
                      type="number"
                      value={charge.montant}
                      onChange={(e) => updateCharge(index, 'montant', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <Button
                    onClick={() => removeCharge(index)}
                    size="sm"
                    variant="outline"
                    className="h-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {charges.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune charge déductible ajoutée
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimisations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                Optimisations fiscales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {optimisations.map((opt, index) => (
                  <div key={opt.type} className="space-y-2">
                    <label className="text-sm font-medium">{opt.type}</label>
                    <InputField
                      label=""
                      type="number"
                      value={opt.montant}
                      onChange={(e) => {
                        const newOpts = [...optimisations];
                        newOpts[index] = { ...opt, montant: parseFloat(e.target.value) || 0 };
                        setOptimisations(newOpts);
                      }}
                      placeholder="Montant à investir"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button onClick={handleCalculate} size="lg" className="px-8">
          <Calculator className="h-4 w-4 mr-2" />
          Calculer l'impôt
        </Button>
      </div>
    </div>
  );
};

export default DiagnosticImpotRevenu;