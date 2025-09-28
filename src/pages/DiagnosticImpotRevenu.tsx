import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, FileText, TrendingDown, ArrowLeft, Plus, Trash2, Info, CheckCircle, X } from "lucide-react";
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
  const [currentYear, setCurrentYear] = useState(2024);
  const [compareYear, setCompareYear] = useState(2023);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState([]);

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

  // Barèmes d'impôts par année
  const taxBrackets = {
    2024: [
      { min: 0, max: 10777, rate: 0, label: "0%" },
      { min: 10777, max: 27478, rate: 11, label: "11%" },
      { min: 27478, max: 78570, rate: 30, label: "30%" },
      { min: 78570, max: 168994, rate: 41, label: "41%" },
      { min: 168994, max: Infinity, rate: 45, label: "45%" }
    ],
    2023: [
      { min: 0, max: 10225, rate: 0, label: "0%" },
      { min: 10225, max: 26070, rate: 11, label: "11%" },
      { min: 26070, max: 74545, rate: 30, label: "30%" },
      { min: 74545, max: 160336, rate: 41, label: "41%" },
      { min: 160336, max: Infinity, rate: 45, label: "45%" }
    ]
  };

  // Dispositifs fiscaux disponibles
  const fiscalDevices = [
    {
      id: 'per',
      name: 'Plan Épargne Retraite (PER)',
      description: 'Déduction fiscale sur les versements',
      maxAmount: 32909,
      reductionRate: 'TMI'
    },
    {
      id: 'deficitFoncier',
      name: 'Déficit foncier',
      description: 'Imputation des déficits fonciers',
      maxAmount: 10700,
      reductionRate: 'TMI'
    },
    {
      id: 'dons',
      name: 'Dons aux associations',
      description: 'Réduction d\'impôt de 66%',
      maxAmount: 20000,
      reductionRate: 66
    },
    {
      id: 'emploiDomicile',
      name: 'Emploi à domicile',
      description: 'Crédit d\'impôt de 50%',
      maxAmount: 12000,
      reductionRate: 50
    },
    {
      id: 'investissement',
      name: 'Investissement locatif',
      description: 'Dispositif Pinel/Denormandie',
      maxAmount: 300000,
      reductionRate: 12
    },
    {
      id: 'fcpi',
      name: 'FCPI/FIP',
      description: 'Réduction d\'impôt de 18%',
      maxAmount: 12000,
      reductionRate: 18
    }
  ];

  // Calcul impôt avec barème dynamique
  const calculateImpot = (revenuImposable, nbParts, year = 2024) => {
    const brackets = taxBrackets[year];
    const quotientFamilial = revenuImposable / nbParts;
    let impot = 0;

    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i];
      if (quotientFamilial > bracket.min) {
        const taxableInBracket = Math.min(quotientFamilial, bracket.max) - bracket.min;
        impot += taxableInBracket * (bracket.rate / 100);
      }
    }

    return Math.max(0, impot * nbParts);
  };

  // Calcul du taux marginal
  const calculateMarginalRate = (revenuImposable, year = 2024) => {
    const brackets = taxBrackets[year];
    for (let i = brackets.length - 1; i >= 0; i--) {
      if (revenuImposable > brackets[i].min) {
        return brackets[i].rate;
      }
    }
    return 0;
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
    const impotBrut = calculateImpot(revenuImposable, nbParts, currentYear);

    // Décote pour les revenus modestes
    const plafondDecote = situation.situationFamiliale === "Marié(e)" || situation.situationFamiliale === "Pacsé(e)" ? 2906 : 1746;
    const decote = impotBrut < plafondDecote ? Math.max(0, plafondDecote - impotBrut) : 0;

    const impotNet = Math.max(0, impotBrut - decote);
    const tauxMarginal = calculateMarginalRate(revenuImposable, currentYear);

    // Simulation des tranches d'imposition
    const tranchesSimulation = taxBrackets[currentYear].map(bracket => {
      const quotientFamilial = revenuImposable / nbParts;
      const isInBracket = quotientFamilial > bracket.min && quotientFamilial <= bracket.max;
      const taxableInBracket = isInBracket ?
        Math.min(quotientFamilial, bracket.max) - bracket.min :
        quotientFamilial > bracket.max ? bracket.max - bracket.min : 0;

      return {
        ...bracket,
        isActive: isInBracket,
        taxableAmount: taxableInBracket * nbParts,
        taxOwed: taxableInBracket * (bracket.rate / 100) * nbParts
      };
    });

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

    // Calcul de comparaison avec l'année précédente si demandé
    let comparison = null;
    if (showComparison) {
      const impotBrutPrecedent = calculateImpot(revenuImposable, nbParts, compareYear);
      const decotePrecedente = impotBrutPrecedent < plafondDecote ? Math.max(0, plafondDecote - impotBrutPrecedent) : 0;
      const impotNetPrecedent = Math.max(0, impotBrutPrecedent - decotePrecedente);

      comparison = {
        year: compareYear,
        impotNet: Math.round(impotNetPrecedent),
        difference: Math.round(impotNet - impotNetPrecedent),
        percentage: impotNetPrecedent > 0 ? Math.round(((impotNet - impotNetPrecedent) / impotNetPrecedent) * 100) : 0
      };
    }

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
      repartitionRevenus,
      tranchesSimulation,
      comparison,
      currentYear
    };
  };

  const handleCalculate = () => {
    const calculatedResults = performDiagnostic();
    setResults(calculatedResults);
    setShowResults(true);
  };

  if (showResults && results) {
    return (
      <div className="space-y-6" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#333' }}>
        {/* Header avec style amélioré */}
        <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
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
              <h1 style={{ margin: '0', fontSize: '24px' }}>Diagnostic Impôt sur le Revenu</h1>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <h2 style={{ margin: '0', fontSize: '18px' }}>Année {results.currentYear}</h2>
                <div style={{ color: '#007bff', fontWeight: 'bold' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center gap-2"
                  >
                    <Info className="h-4 w-4" />
                    {showComparison ? 'Masquer' : 'Afficher'} la comparaison
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section des éléments d'imposition */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Revenu imposable</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{results.revenuImposable.toLocaleString()} €</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Nombre de parts</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{results.nbParts}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Taux marginal</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{results.tauxMarginal}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Impôt calculé</span>
            <span style={{ fontWeight: 'bold', fontSize: '18px', color: results.impotNet > 0 ? '#dc2626' : '#16a34a' }}>
              {results.impotNet.toLocaleString()} €
            </span>
          </div>
        </div>

        {/* Tableau des tranches d'imposition */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
            Simulation par tranches d'imposition
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f8f9fa' }}>Tranche</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f8f9fa' }}>Taux</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f8f9fa' }}>Montant imposable</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f8f9fa' }}>Impôt dû</th>
              </tr>
            </thead>
            <tbody>
              {results.tranchesSimulation.map((tranche, index) => (
                <tr key={index} style={{ backgroundColor: tranche.isActive ? '#e8f5e8' : 'transparent' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {index === 0 ?
                      `Jusqu'à ${tranche.max.toLocaleString()} €` :
                      index === results.tranchesSimulation.length - 1 ?
                      `Au-delà de ${tranche.min.toLocaleString()} €` :
                      `De ${tranche.min.toLocaleString()} € à ${tranche.max.toLocaleString()} €`
                    }
                    {tranche.isActive && <span style={{ color: 'green', fontWeight: 'bold', marginLeft: '8px' }}>✓</span>}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{tranche.label}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {tranche.taxableAmount > 0 ? `${Math.round(tranche.taxableAmount).toLocaleString()} €` : '-'}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {tranche.taxOwed > 0 ? `${Math.round(tranche.taxOwed).toLocaleString()} €` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparaison avec année précédente */}
        {showComparison && results.comparison && (
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ fontSize: '16px', marginBottom: '15px' }}>Comparaison {results.comparison.year} vs {results.currentYear}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{results.comparison.impotNet.toLocaleString()} €</div>
                <div>Impôt {results.comparison.year}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{results.impotNet.toLocaleString()} €</div>
                <div>Impôt {results.currentYear}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: results.comparison.difference > 0 ? '#dc2626' : '#16a34a'
                }}>
                  {results.comparison.difference > 0 ? '+' : ''}{results.comparison.difference.toLocaleString()} €
                </div>
                <div>Différence ({results.comparison.percentage > 0 ? '+' : ''}{results.comparison.percentage}%)</div>
              </div>
            </div>
          </div>
        )}

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

        {/* Section dispositifs fiscaux */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
            Dispositifs fiscaux disponibles
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {fiscalDevices.map((device) => (
              <div
                key={device.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: selectedDevices.includes(device.id) ? '#e8f5e8' : 'white'
                }}
                onClick={() => {
                  if (selectedDevices.includes(device.id)) {
                    setSelectedDevices(selectedDevices.filter(id => id !== device.id));
                  } else {
                    setSelectedDevices([...selectedDevices, device.id]);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedDevices.includes(device.id)}
                  onChange={() => {}}
                  style={{ marginRight: '10px' }}
                />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{device.name}</div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>{device.description}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    Plafond: {device.maxAmount.toLocaleString()} € |
                    Réduction: {typeof device.reductionRate === 'string' ? device.reductionRate : `${device.reductionRate}%`}
                  </div>
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>#{device.id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Détails du calcul */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
            Détails du calcul
          </h3>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span>Revenus bruts totaux:</span>
              <span>{results.totalRevenus.toLocaleString()} €</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span>(-) Charges déductibles:</span>
              <span>-{results.totalCharges.toLocaleString()} €</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span>= Revenu net imposable:</span>
              <span style={{ fontWeight: 'bold' }}>{results.revenuImposable.toLocaleString()} €</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span>Quotient familial ({results.nbParts} parts):</span>
              <span>{Math.round(results.revenuImposable / results.nbParts).toLocaleString()} €</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span>Impôt brut:</span>
              <span>{results.impotBrut.toLocaleString()} €</span>
            </div>
            {results.decote > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span>(-) Décote:</span>
                <span style={{ color: '#16a34a' }}>-{results.decote.toLocaleString()} €</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '2px solid #333', fontWeight: 'bold' }}>
              <span>= Impôt net à payer:</span>
              <span style={{ color: results.impotNet > 0 ? '#dc2626' : '#16a34a' }}>
                {results.impotNet.toLocaleString()} €
              </span>
            </div>
            {results.totalEconomies > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <span>(-) Économies fiscales possibles:</span>
                  <span style={{ color: '#16a34a' }}>-{results.totalEconomies.toLocaleString()} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '2px solid #16a34a', fontWeight: 'bold' }}>
                  <span>= Impôt après optimisation:</span>
                  <span style={{ color: '#16a34a' }}>{results.impotOptimise.toLocaleString()} €</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          <Button
            variant="outline"
            onClick={() => setShowResults(false)}
            style={{
              backgroundColor: '#f8f9fa',
              border: '1px solid #ddd',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Précédent
          </Button>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                const calculatedResults = performDiagnostic();
                setResults(calculatedResults);
              }}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Recalculer
            </Button>
            <Button
              onClick={() => window.print()}
              variant="outline"
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Imprimer
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px',
          borderTop: '1px solid #eee',
          paddingTop: '10px'
        }}>
          <p>
            Les calculs présentés sont indicatifs et basés sur la législation en vigueur pour l'année {results.currentYear}.
            Pour une étude personnalisée, consultez un conseiller fiscal.
          </p>
          <p style={{ marginTop: '5px', fontSize: '12px' }}>
            © 2025 Diagnostic Impôt sur le Revenu - Tous droits réservés
          </p>
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
              {/* Options de comparaison */}
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-medium mb-3">Options de calcul</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <SelectField
                    label="Année d'imposition"
                    value={currentYear.toString()}
                    onChange={(value) => setCurrentYear(parseInt(value))}
                    options={[
                      { value: "2024", label: "2024" },
                      { value: "2023", label: "2023" }
                    ]}
                  />
                  <SelectField
                    label="Année de comparaison"
                    value={compareYear.toString()}
                    onChange={(value) => setCompareYear(parseInt(value))}
                    options={[
                      { value: "2023", label: "2023" },
                      { value: "2024", label: "2024" }
                    ]}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Affichage</label>
                    <div className="flex gap-2">
                      <Button
                        variant={showComparison ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowComparison(!showComparison)}
                        className="flex-1"
                      >
                        Comparaison
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

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
        <Button
          onClick={handleCalculate}
          size="lg"
          className="px-8"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'block',
            margin: '20px auto'
          }}
        >
          <Calculator className="h-4 w-4 mr-2" />
          Calculer l'impôt
        </Button>
      </div>
    </div>
  );
};

export default DiagnosticImpotRevenu;