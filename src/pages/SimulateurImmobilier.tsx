import { useState, useEffect } from 'react';
import { Calendar, Calculator, Home, TrendingUp, FileText, ArrowLeft, Settings, Printer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const SimulateurImmobilier = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projet');
  const [simulationType, setSimulationType] = useState('complete');
  const [showResults, setShowResults] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // État des paramètres
  const [settings, setSettings] = useState({
    effortChoice: 'tresorerie', // 'tresorerie' ou 'epargne'
    showTRI: 'afficher', // 'afficher' ou 'masquer'
    showRendement: 'afficher' // 'afficher' ou 'masquer'
  });

  // État des options avancées
  const [advancedOptions, setAdvancedOptions] = useState({
    vacancyRate: 5, // Taux de vacance en %
    maintenanceReserve: 200, // Réserve maintenance annuelle
    taxOptimization: true,
    includeNotaryFees: true,
    projectionScenario: "standard" // 'standard', 'optimiste', 'pessimiste'
  });

  // État des notes
  const [notes, setNotes] = useState({
    projectNotes: "",
    investmentNotes: "",
    revenueNotes: ""
  });

  // État de la sauvegarde automatique
  const [lastSave, setLastSave] = useState(new Date());

  // État du projet
  const [project, setProject] = useState({
    title: "Votre simulation immobilière du 28/09/2025 à 08h51",
    recipient: "",
    location: "rue",
    device: "Foncier ordinaire",
    investmentDate: "01/10/2025",
    completionDate: "",
    duration: 10,
    durationMonths: 3,
    durationUnit: "ans"
  });

  // État de la situation fiscale
  const [taxSituation, setTaxSituation] = useState({
    familyStatus: "Marié(e)",
    incomeSource: "Métropole",
    nonResidentTax: false,
    dependents: 0,
    evolveDependents: false,
    // Nouveaux champs pour les revenus préexistants
    preexistingRevenues: {
      taxablePropertyRevenues: 0,
      otherTaxableRevenues: 0
    },
    // Nouveaux champs pour les déficits antérieurs
    previousDeficits: [
      { year: 2015, amount: 0 },
      { year: 2016, amount: 0 },
      { year: 2017, amount: 0 },
      { year: 2018, amount: 0 },
      { year: 2019, amount: 0 }
    ]
  });

  // État de l'investissement
  const [investment, setInvestment] = useState({
    acquisitionAmount: 0,
    acquisitionFees: 0,
    acquisitionFeesPercentage: 7, // Pourcentage standard des frais de notaire
    acquisitionDate: "01/10/2025",
    revaluation: 0.00,
    saleDate: "01/10/2025",
    fundCall: false,
    works: [],
    financing: {
      personalContribution: 0,
      personalContributionPercentage: 0,
      credits: [],
      savings: []
    },
    cession: {
      soldAtEnd: true,
      salePrice: 0,
      saleFees: 0,
      saleFeesPercentage: 7 // Frais d'agence standard
    },
    // NOUVEAUX CHAMPS
    propertyType: "appartement", // appartement, maison, etc.
    surface: 0,
    city: "",
    energyClass: "D" // DPE
  });

  // État des revenus et charges
  const [revenuesCharges, setRevenuesCharges] = useState({
    revenues: {
      rent: 0,
      period: "Mois",
      startDate: "01/10/2025",
      indexation: 0.00,
      indexationType: "fixe", // 'fixe' ou 'variable'
      diverseRevenues: 0,
      diverseRevenuesDescription: "",
      revenuesReceivedOn: "",
      vacancyRate: 5, // Taux de vacance
      chargesRecovered: 0 // Charges récupérables
    },
    charges: {
      propertyTax: 0,
      propertyTaxIndexation: 0.00,
      propertyTaxStartDate: "01/10/2025",
      propertyTaxExemption: false,
      propertyTaxExemptionYears: 0,
      managementFees: 0.00,
      managementFeesIndexation: 0.00,
      insurancePremiums: 0,
      insurancePremiumsIndexation: 0.00,
      coproprietyCharges: 0, // NOUVEAU
      maintenanceReserve: 0, // NOUVEAU
      diverseCharges: 0,
      diverseChargesDescription: "", // NOUVEAU
      diverseChargesIndexation: 0.00,
      nonDeductibleCharges: 0,
      nonDeductibleChargesDescription: "", // NOUVEAU
      nonDeductibleChargesIndexation: 0.00
    }
  });

  const [results, setResults] = useState(null);

  // Sauvegarde automatique
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSave(new Date());
      // Ici on pourrait ajouter la logique de sauvegarde réelle
      console.log("Simulation sauvegardée automatiquement");
    }, 30000); // Sauvegarde toutes les 30 secondes

    return () => clearInterval(timer);
  }, []);

  // Fonction de calcul des résultats
  const calculateResults = () => {
    const totalInvestment = investment.acquisitionAmount + investment.acquisitionFees;
    const monthlyRent = revenuesCharges.revenues.rent;
    const annualRent = monthlyRent * 12;
    const grossYield = totalInvestment > 0 ? (annualRent / totalInvestment) * 100 : 0;

    const annualCharges = (
      revenuesCharges.charges.propertyTax +
      (revenuesCharges.charges.managementFees / 100 * annualRent) +
      revenuesCharges.charges.insurancePremiums +
      revenuesCharges.charges.diverseCharges +
      revenuesCharges.charges.nonDeductibleCharges
    );

    const netAnnualRevenue = annualRent - annualCharges;
    const netYield = totalInvestment > 0 ? (netAnnualRevenue / totalInvestment) * 100 : 0;

    const totalRevenueOverPeriod = netAnnualRevenue * project.duration;
    const finalValue = investment.acquisitionAmount * (1 + investment.revaluation / 100) ** project.duration;
    const capitalGain = finalValue - investment.acquisitionAmount;

    const totalReturn = totalRevenueOverPeriod + capitalGain;
    const totalReturnPercentage = totalInvestment > 0 ? (totalReturn / totalInvestment) * 100 : 0;

    // Données pour les graphiques
    const evolutionData = [];
    let cumulativeIncome = 0;

    for (let year = 1; year <= project.duration; year++) {
      const yearlyRent = annualRent * Math.pow(1 + revenuesCharges.revenues.indexation / 100, year - 1);
      cumulativeIncome += yearlyRent;

      evolutionData.push({
        year: `Année ${year}`,
        revenusCumules: Math.round(cumulativeIncome),
        valeurBien: Math.round(investment.acquisitionAmount * Math.pow(1 + investment.revaluation / 100, year))
      });
    }

    return {
      totalInvestment,
      monthlyRent,
      annualRent,
      annualCharges,
      netAnnualRevenue,
      grossYield,
      netYield,
      totalRevenueOverPeriod,
      finalValue,
      capitalGain,
      totalReturn,
      totalReturnPercentage,
      evolutionData
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    setShowResults(true);
    setActiveTab('resultats');
  };

  const validateForm = () => {
    const errors = [];

    if (investment.acquisitionAmount <= 0) {
      errors.push("Le montant d'acquisition doit être supérieur à 0");
    }

    if (revenuesCharges.revenues.rent <= 0) {
      errors.push("Le loyer mensuel doit être supérieur à 0");
    }

    if (project.duration <= 0) {
      errors.push("La durée du projet doit être supérieure à 0");
    }

    return errors;
  };

  const handleCalculateWithValidation = () => {
    const errors = validateForm();

    if (errors.length > 0) {
      alert("Erreurs de validation :\n" + errors.join("\n"));
      return;
    }

    handleCalculate();
  };

  const handleSaveSettings = () => {
    // Sauvegarder les paramètres
    setShowSettingsModal(false);
  };

  const handleCancelSettings = () => {
    // Annuler les modifications et fermer le modal
    setShowSettingsModal(false);
  };

  // Fonction utilitaire pour le format de date
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "J / mm / aaaa";
    return dateString.split('/').join(' / ');
  };

  const addWork = () => {
    setInvestment(prev => ({
      ...prev,
      works: [...prev.works, { description: "", amount: 0, date: "" }]
    }));
  };

  const addCredit = () => {
    setInvestment(prev => ({
      ...prev,
      financing: {
        ...prev.financing,
        credits: [...prev.financing.credits, { amount: 0, rate: 0, duration: 0 }]
      }
    }));
  };

  const addSavings = () => {
    setInvestment(prev => ({
      ...prev,
      financing: {
        ...prev.financing,
        savings: [...prev.financing.savings, { type: "", amount: 0 }]
      }
    }));
  };


  const InputField = ({ label, type = "text", value, onChange, placeholder = "", step, className = "" }: {
    label: string;
    type?: string;
    value: any;
    onChange: any;
    placeholder?: string;
    step?: string;
    className?: string;
  }) => (
    <div className={`mb-4 ${className}`}>
      <Label className="text-sm font-medium text-gray-700 mb-1">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
        className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const SelectField = ({ label, value, onChange, options, className = "" }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    className?: string;
  }) => (
    <div className={`mb-4 ${className}`}>
      <Label className="text-sm font-medium text-gray-700 mb-1">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const ProgressIndicator = () => {
    const tabs = ['projet', 'investissement', 'revenus', 'resultats'];
    const currentIndex = tabs.indexOf(activeTab);
    const progress = ((currentIndex + 1) / tabs.length) * 100;

    return (
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progression</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const ChartSection = ({ results }) => {
    if (!results || !results.evolutionData) return null;

    const pieData = [
      { name: 'Revenus locatifs', value: results.totalRevenueOverPeriod, fill: '#3b82f6' },
      { name: 'Plus-value', value: results.capitalGain, fill: '#06b6d4' }
    ];

    return (
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des revenus cumulés</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
                <Legend />
                <Line type="monotone" dataKey="revenusCumules" stroke="#3b82f6" name="Revenus cumulés" strokeWidth={3} />
                <Line type="monotone" dataKey="valeurBien" stroke="#06b6d4" name="Valeur du bien" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition de la rentabilité</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };

  const ResultsPanel = () => {
    if (!results || !showResults) {
      return (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="mb-4">
            <TrendingUp className="mx-auto h-16 w-16 text-gray-300" />
          </div>
          <p className="text-gray-500 text-lg">Pas de résultats à afficher</p>
          <p className="text-gray-400 text-sm mt-2">Remplissez les informations et cliquez sur "Calculer"</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Investissement</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Investissement total:</span>
                  <span className="font-medium text-blue-700">{results.totalInvestment.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Loyer mensuel:</span>
                  <span className="font-medium text-blue-700">{results.monthlyRent.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenus annuels:</span>
                  <span className="font-medium text-blue-700">{results.annualRent.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Rentabilité</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Rendement brut:</span>
                  <span className="font-medium text-green-700">{results.grossYield.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rendement net:</span>
                  <span className="font-medium text-green-700">{results.netYield.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Charges annuelles:</span>
                  <span className="font-medium text-green-700">{results.annualCharges.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-500 rounded-full">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Projection</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Revenus nets sur {project.duration} ans:</span>
                  <span className="font-medium text-indigo-700">{results.totalRevenueOverPeriod.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Plus-value estimée:</span>
                  <span className="font-medium text-indigo-700">{results.capitalGain.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Valeur finale du bien:</span>
                  <span className="font-medium text-indigo-700">{results.finalValue.toLocaleString('fr-FR')} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-cyan-500 rounded-full">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Rentabilité globale</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gain total estimé:</span>
                  <span className="font-bold text-lg text-cyan-700">{results.totalReturn.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Rentabilité globale:</span>
                  <span className="font-bold text-lg text-cyan-700">{results.totalReturnPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <ChartSection results={results} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec design bleu */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 right-4">
            <Badge variant={showResults ? "default" : "secondary"} className={showResults ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"}>
              {showResults ? "Simulation calculée" : "Simulation en cours"}
            </Badge>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/simulateurs')}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </Button>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Home className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
            </div>
            <div className="text-white">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">Simulateur Immobilier</h1>
              <p className="text-blue-100 text-base md:text-lg">Simuler un investissement immobilier en location nue ou meublé</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs md:text-sm text-blue-100">Calculs en temps réel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-xs md:text-sm text-blue-100">Analyse détaillée</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
          <div className="absolute bottom-4 right-4 text-white/70 text-sm">
            Date de la simulation: 28/09/2025
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mt-4 flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="rapide"
                checked={simulationType === 'rapide'}
                onChange={(e) => setSimulationType(e.target.value)}
                className="mr-2"
              />
              Rapide (les dispositifs et saisies essentielles)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="complete"
                checked={simulationType === 'complete'}
                onChange={(e) => setSimulationType(e.target.value)}
                className="mr-2"
              />
              Complète (tous les dispositifs et saisies détaillées)
            </label>
          </div>
        </div>

        <ProgressIndicator />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Contenu principal */}
          <div className="lg:col-span-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="projet">Projet</TabsTrigger>
                <TabsTrigger value="investissement">Investissement</TabsTrigger>
                <TabsTrigger value="revenus">Revenus et charges</TabsTrigger>
                <TabsTrigger value="resultats">Résultats</TabsTrigger>
              </TabsList>

              <TabsContent value="projet">
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Home className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-bold">
                        Projet
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <InputField
                      label="Titre"
                      value={project.title}
                      onChange={(e) => setProject({...project, title: e.target.value})}
                    />

                    <InputField
                      label="À l'attention de"
                      value={project.recipient}
                      onChange={(e) => setProject({...project, recipient: e.target.value})}
                      placeholder="Veuillez renseigner le champ."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SelectField
                        label="Investissement"
                        value={project.location}
                        onChange={(value) => setProject({...project, location: value})}
                        options={[
                          { value: "rue", label: "Location nue" },
                          { value: "meublee", label: "Location meublée" },
                          { value: "colocation", label: "Colocation" }
                        ]}
                      />

                      <SelectField
                        label="Dispositif"
                        value={project.device}
                        onChange={(value) => setProject({...project, device: value})}
                        options={[
                          { value: "Foncier ordinaire", label: "Foncier ordinaire" },
                          { value: "Micro foncier", label: "Micro foncier" },
                          { value: "Pinel", label: "Pinel" },
                          { value: "Pinel Outre-mer", label: "Pinel Outre-mer" },
                          { value: "Pinel Plus", label: "Pinel Plus" },
                          { value: "Malraux", label: "Malraux" },
                          { value: "Denormandie", label: "Denormandie" },
                          { value: "Censi-Bouvard", label: "Censi-Bouvard" }
                        ]}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="Investissement réalisé le"
                        type="date"
                        value={project.investmentDate.split('/').reverse().join('-')}
                        onChange={(e) => setProject({...project, investmentDate: e.target.value.split('-').reverse().join('/')})}
                      />

                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1">Date d'achèvement</Label>
                        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded border">
                          {formatDateForDisplay(project.completionDate)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-end space-x-2">
                        <div className="flex-1">
                          <InputField
                            label="Durée du projet"
                            type="number"
                            value={project.duration}
                            onChange={(e) => setProject({...project, duration: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <span className="text-gray-600 mb-4">ans</span>
                        <div className="flex-1">
                          <InputField
                            label="et"
                            type="number"
                            value={project.durationMonths}
                            onChange={(e) => setProject({...project, durationMonths: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <span className="text-gray-600 mb-4">mois</span>
                      </div>
                      <div className="flex items-end">
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg w-full">
                          <span className="font-medium">soit un terme au :</span><br />
                          31/12/{new Date().getFullYear() + project.duration}
                        </div>
                      </div>
                    </div>

                    {/* Situation fiscale */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Situation fiscale</h3>

                      {/* Foyer fiscal */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Foyer fiscal</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <SelectField
                            label="Situation familiale"
                            value={taxSituation.familyStatus}
                            onChange={(value) => setTaxSituation({...taxSituation, familyStatus: value})}
                            options={[
                              { value: "Marié(e)", label: "Marié(e)" },
                              { value: "Célibataire", label: "Célibataire" },
                              { value: "Pacsé(e)", label: "Pacsé(e)" },
                              { value: "Divorcé(e)", label: "Divorcé(e)" }
                            ]}
                          />

                          <SelectField
                            label="Provenance des revenus"
                            value={taxSituation.incomeSource}
                            onChange={(value) => setTaxSituation({...taxSituation, incomeSource: value})}
                            options={[
                              { value: "Métropole", label: "Métropole" },
                              { value: "DOM-TOM", label: "DOM-TOM" },
                              { value: "Étranger", label: "Étranger" }
                            ]}
                          />
                        </div>
                      </div>

                      {/* Revenus préexistants */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Revenus préexistants</h4>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              label="Revenus fonciers imposables (€)"
                              type="number"
                              value={taxSituation.preexistingRevenues.taxablePropertyRevenues}
                              onChange={(e) => setTaxSituation({
                                ...taxSituation,
                                preexistingRevenues: {
                                  ...taxSituation.preexistingRevenues,
                                  taxablePropertyRevenues: parseFloat(e.target.value) || 0
                                }
                              })}
                              placeholder="Revenus fonciers actuels"
                            />
                            <InputField
                              label="Autres revenus imposables (€)"
                              type="number"
                              value={taxSituation.preexistingRevenues.otherTaxableRevenues}
                              onChange={(e) => setTaxSituation({
                                ...taxSituation,
                                preexistingRevenues: {
                                  ...taxSituation.preexistingRevenues,
                                  otherTaxableRevenues: parseFloat(e.target.value) || 0
                                }
                              })}
                              placeholder="Salaires, pensions, etc."
                            />
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Ces revenus sont utilisés pour calculer votre tranche marginale d'imposition et l'impact fiscal de votre investissement.</p>
                          </div>
                        </div>
                      </div>

                      {/* Déficits fonciers antérieurs */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Déficits fonciers antérieurs</h4>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                          <div className="text-sm text-gray-600 mb-3">
                            <p>Les déficits fonciers peuvent être reportés sur 10 ans. Saisissez vos déficits des années précédentes :</p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {taxSituation.previousDeficits.map((deficit, index) => (
                              <div key={deficit.year}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  {deficit.year}
                                </label>
                                <InputField
                                  label=""
                                  type="number"
                                  value={deficit.amount}
                                  onChange={(e) => {
                                    const newDeficits = [...taxSituation.previousDeficits];
                                    newDeficits[index] = { ...deficit, amount: parseFloat(e.target.value) || 0 };
                                    setTaxSituation({
                                      ...taxSituation,
                                      previousDeficits: newDeficits
                                    });
                                  }}
                                  placeholder="Montant (€)"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-blue-700 font-medium">Total déficits reportables :</span>
                              <span className="text-blue-800 font-bold">
                                {taxSituation.previousDeficits.reduce((total, deficit) => total + deficit.amount, 0).toLocaleString()} €
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={taxSituation.nonResidentTax}
                            onChange={(e) => setTaxSituation({...taxSituation, nonResidentTax: e.target.checked})}
                            className="mr-2"
                          />
                          Non résident fiscal
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={taxSituation.evolveDependents}
                            onChange={(e) => setTaxSituation({...taxSituation, evolveDependents: e.target.checked})}
                            className="mr-2"
                          />
                          Faire évoluer le nombre de personnes à charge pendant la simulation
                        </label>

                        <InputField
                          label="Nombre de personnes à charge"
                          type="number"
                          value={taxSituation.dependents}
                          onChange={(e) => setTaxSituation({...taxSituation, dependents: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>

                    {/* Options avancées */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Options avancées</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="Taux de vacance locative (%)"
                          type="number"
                          step="0.1"
                          value={advancedOptions.vacancyRate}
                          onChange={(e) => setAdvancedOptions({...advancedOptions, vacancyRate: parseFloat(e.target.value) || 0})}
                        />
                        <InputField
                          label="Réserve maintenance annuelle (€)"
                          type="number"
                          value={advancedOptions.maintenanceReserve}
                          onChange={(e) => setAdvancedOptions({...advancedOptions, maintenanceReserve: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={advancedOptions.taxOptimization}
                            onCheckedChange={(checked) => setAdvancedOptions({...advancedOptions, taxOptimization: checked})}
                          />
                          <Label>Optimisation fiscale active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={advancedOptions.includeNotaryFees}
                            onCheckedChange={(checked) => setAdvancedOptions({...advancedOptions, includeNotaryFees: checked})}
                          />
                          <Label>Inclure frais de notaire</Label>
                        </div>
                      </div>
                      <SelectField
                        label="Scénario de projection"
                        value={advancedOptions.projectionScenario}
                        onChange={(value) => setAdvancedOptions({...advancedOptions, projectionScenario: value})}
                        options={[
                          { value: "standard", label: "Standard" },
                          { value: "optimiste", label: "Optimiste" },
                          { value: "pessimiste", label: "Pessimiste" }
                        ]}
                        className="mt-4"
                      />
                    </div>

                    {/* Notes */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
                      <Textarea
                        placeholder="Ajoutez des notes concernant votre projet..."
                        value={notes.projectNotes}
                        onChange={(e) => setNotes({...notes, projectNotes: e.target.value})}
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="investissement">
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calculator className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-bold">
                        Investissement
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Analyse de rentabilité rapide */}
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-md font-semibold text-blue-800 mb-3">Analyse de rentabilité rapide</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center p-3 bg-white rounded border">
                          <div className="text-gray-600">Rendement brut</div>
                          <div className="text-lg font-bold text-blue-600">
                            {investment.acquisitionAmount > 0 ? ((revenuesCharges.revenues.rent * 12 / investment.acquisitionAmount) * 100).toFixed(2) : "0.00"}%
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded border">
                          <div className="text-gray-600">Cash-flow mensuel</div>
                          <div className="text-lg font-bold text-green-600">
                            {(revenuesCharges.revenues.rent - (revenuesCharges.charges.propertyTax / 12)).toFixed(0)} €
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded border">
                          <div className="text-gray-600">Effort épargne</div>
                          <div className="text-lg font-bold text-orange-600">
                            {investment.financing.personalContribution > 0 ? (investment.financing.personalContribution / (project.duration * 12)).toFixed(0) : "0"} €/mois
                          </div>
                        </div>
                        <div className="text-center p-3 bg-white rounded border">
                          <div className="text-gray-600">Leverage</div>
                          <div className="text-lg font-bold text-purple-600">
                            {investment.acquisitionAmount > 0 ? ((investment.acquisitionAmount - investment.financing.personalContribution) / investment.acquisitionAmount * 100).toFixed(1) : "0"}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bien immobilier */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bien immobilier</h3>

                      {/* Informations du bien */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de bien
                          </label>
                          <Select value={investment.propertyType} onValueChange={(value) => setInvestment({...investment, propertyType: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="appartement">Appartement</SelectItem>
                              <SelectItem value="maison">Maison</SelectItem>
                              <SelectItem value="immeuble">Immeuble</SelectItem>
                              <SelectItem value="terrain">Terrain</SelectItem>
                              <SelectItem value="garage">Garage</SelectItem>
                              <SelectItem value="local">Local commercial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <InputField
                          label="Surface (m²)"
                          type="number"
                          value={investment.surface}
                          onChange={(e) => setInvestment({...investment, surface: parseFloat(e.target.value) || 0})}
                        />

                        <InputField
                          label="Ville"
                          type="text"
                          value={investment.city}
                          onChange={(e) => setInvestment({...investment, city: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Classe énergétique
                          </label>
                          <Select value={investment.energyClass} onValueChange={(value) => setInvestment({...investment, energyClass: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A - Très économe</SelectItem>
                              <SelectItem value="B">B - Économe</SelectItem>
                              <SelectItem value="C">C - Conventional</SelectItem>
                              <SelectItem value="D">D - Peu économe</SelectItem>
                              <SelectItem value="E">E - Passoire énergétique</SelectItem>
                              <SelectItem value="F">F - Passoire énergétique</SelectItem>
                              <SelectItem value="G">G - Passoire énergétique</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-end space-x-2">
                          <div className="flex-1">
                            <InputField
                              label="Revalorisé à (%/an)"
                              type="number"
                              step="0.01"
                              value={investment.revaluation}
                              onChange={(e) => setInvestment({...investment, revaluation: parseFloat(e.target.value) || 0})}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Acquisition */}
                      <div className="border-t pt-4">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Acquisition</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Prix d'acquisition (€)"
                            type="number"
                            value={investment.acquisitionAmount}
                            onChange={(e) => {
                              const amount = parseFloat(e.target.value) || 0;
                              const fees = Math.round(amount * (investment.acquisitionFeesPercentage / 100));
                              setInvestment({
                                ...investment,
                                acquisitionAmount: amount,
                                acquisitionFees: fees
                              });
                            }}
                          />

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1">
                                <InputField
                                  label="Frais d'acquisition (%)"
                                  type="number"
                                  step="0.1"
                                  value={investment.acquisitionFeesPercentage}
                                  onChange={(e) => {
                                    const percentage = parseFloat(e.target.value) || 0;
                                    const fees = Math.round(investment.acquisitionAmount * (percentage / 100));
                                    setInvestment({
                                      ...investment,
                                      acquisitionFeesPercentage: percentage,
                                      acquisitionFees: fees
                                    });
                                  }}
                                />
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              Montant: {investment.acquisitionFees.toLocaleString()} €
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <InputField
                            label="Date d'acquisition"
                            type="date"
                            value={investment.acquisitionDate.split('/').reverse().join('-')}
                            onChange={(e) => setInvestment({...investment, acquisitionDate: e.target.value.split('-').reverse().join('/')})}
                          />

                          <div className="flex items-center space-x-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={investment.fundCall}
                                onChange={(e) => setInvestment({...investment, fundCall: e.target.checked})}
                                className="mr-2"
                              />
                              Appels de fonds
                            </label>
                          </div>
                        </div>

                        {/* Total investissement */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-700">Total investissement:</span>
                            <span className="text-lg font-bold text-blue-600">
                              {(investment.acquisitionAmount + investment.acquisitionFees).toLocaleString()} €
                            </span>
                          </div>
                          {investment.surface > 0 && (
                            <div className="flex justify-between items-center mt-1 text-sm text-gray-600">
                              <span>Prix au m²:</span>
                              <span>{Math.round((investment.acquisitionAmount + investment.acquisitionFees) / investment.surface).toLocaleString()} €/m²</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Travaux */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Travaux</h3>
                        <Button
                          onClick={addWork}
                          variant="outline"
                          size="sm"
                        >
                          Ajouter des travaux
                        </Button>
                      </div>

                      {investment.works.map((work, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded">
                          <InputField
                            label="Description"
                            value={work.description}
                            onChange={(e) => {
                              const newWorks = [...investment.works];
                              newWorks[index].description = e.target.value;
                              setInvestment({...investment, works: newWorks});
                            }}
                          />
                          <InputField
                            label="Montant (€)"
                            type="number"
                            value={work.amount}
                            onChange={(e) => {
                              const newWorks = [...investment.works];
                              newWorks[index].amount = parseFloat(e.target.value) || 0;
                              setInvestment({...investment, works: newWorks});
                            }}
                          />
                          <InputField
                            label="Date"
                            type="date"
                            value={work.date}
                            onChange={(e) => {
                              const newWorks = [...investment.works];
                              newWorks[index].date = e.target.value;
                              setInvestment({...investment, works: newWorks});
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Financement */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Financement</h3>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Apport Personnel :</span> cliquer sur le bouton "Calculer" pour afficher le montant de l'apport personnel
                        </p>
                      </div>

                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-md font-medium text-gray-700">Crédit</h4>
                          <Button
                            onClick={addCredit}
                            variant="outline"
                            size="sm"
                          >
                            Ajouter un crédit
                          </Button>
                        </div>

                        {investment.financing.credits.map((credit, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded">
                            <InputField
                              label="Montant (€)"
                              type="number"
                              value={credit.amount}
                              onChange={(e) => {
                                const newCredits = [...investment.financing.credits];
                                newCredits[index].amount = parseFloat(e.target.value) || 0;
                                setInvestment({
                                  ...investment,
                                  financing: {...investment.financing, credits: newCredits}
                                });
                              }}
                            />
                            <InputField
                              label="Taux (%)"
                              type="number"
                              step="0.01"
                              value={credit.rate}
                              onChange={(e) => {
                                const newCredits = [...investment.financing.credits];
                                newCredits[index].rate = parseFloat(e.target.value) || 0;
                                setInvestment({
                                  ...investment,
                                  financing: {...investment.financing, credits: newCredits}
                                });
                              }}
                            />
                            <InputField
                              label="Durée (ans)"
                              type="number"
                              value={credit.duration}
                              onChange={(e) => {
                                const newCredits = [...investment.financing.credits];
                                newCredits[index].duration = parseInt(e.target.value) || 0;
                                setInvestment({
                                  ...investment,
                                  financing: {...investment.financing, credits: newCredits}
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-md font-medium text-gray-700">Épargne</h4>
                          <Button
                            onClick={addSavings}
                            variant="outline"
                            size="sm"
                          >
                            Ajouter une épargne
                          </Button>
                        </div>

                        {investment.financing.savings && investment.financing.savings.map((saving, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded">
                            <SelectField
                              label="Type"
                              value={saving.type}
                              onChange={(value) => {
                                const newSavings = [...investment.financing.savings];
                                newSavings[index].type = value;
                                setInvestment({
                                  ...investment,
                                  financing: {...investment.financing, savings: newSavings}
                                });
                              }}
                              options={[
                                { value: "", label: "Sélectionner" },
                                { value: "PEL", label: "PEL" },
                                { value: "CEL", label: "CEL" },
                                { value: "Livret A", label: "Livret A" }
                              ]}
                            />
                            <InputField
                              label="Montant (€)"
                              type="number"
                              value={saving.amount}
                              onChange={(e) => {
                                const newSavings = [...investment.financing.savings];
                                newSavings[index].amount = parseFloat(e.target.value) || 0;
                                setInvestment({
                                  ...investment,
                                  financing: {...investment.financing, savings: newSavings}
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cession */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Cession</h3>

                      <div className="space-y-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={investment.cession.soldAtEnd}
                              onChange={(e) => setInvestment({
                                ...investment,
                                cession: {...investment.cession, soldAtEnd: e.target.checked}
                              })}
                              className="mr-3"
                            />
                            <span className="text-gray-700">Le bien est cédé au terme de l'opération</span>
                          </label>
                        </div>

                        {investment.cession.soldAtEnd && (
                          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                            <h4 className="text-md font-medium text-gray-700">Détails de la cession</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <InputField
                                label="Prix de vente (€)"
                                type="number"
                                value={investment.cession.salePrice}
                                onChange={(e) => {
                                  const price = parseFloat(e.target.value) || 0;
                                  const fees = Math.round(price * (investment.cession.saleFeesPercentage / 100));
                                  setInvestment({
                                    ...investment,
                                    cession: {
                                      ...investment.cession,
                                      salePrice: price,
                                      saleFees: fees
                                    }
                                  });
                                }}
                              />

                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1">
                                    <InputField
                                      label="Frais de vente (%)"
                                      type="number"
                                      step="0.1"
                                      value={investment.cession.saleFeesPercentage}
                                      onChange={(e) => {
                                        const percentage = parseFloat(e.target.value) || 0;
                                        const fees = Math.round(investment.cession.salePrice * (percentage / 100));
                                        setInvestment({
                                          ...investment,
                                          cession: {
                                            ...investment.cession,
                                            saleFeesPercentage: percentage,
                                            saleFees: fees
                                          }
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                  Montant: {investment.cession.saleFees.toLocaleString()} €
                                </div>
                              </div>
                            </div>

                            {/* Résumé de la cession */}
                            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Prix de vente:</span>
                                  <span className="font-medium">{investment.cession.salePrice.toLocaleString()} €</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Frais de vente:</span>
                                  <span className="font-medium">-{investment.cession.saleFees.toLocaleString()} €</span>
                                </div>
                                <div className="flex justify-between items-center border-t pt-2">
                                  <span className="font-medium text-gray-700">Produit net de cession:</span>
                                  <span className="text-lg font-bold text-green-600">
                                    {(investment.cession.salePrice - investment.cession.saleFees).toLocaleString()} €
                                  </span>
                                </div>

                                {/* Plus-value potentielle */}
                                {investment.acquisitionAmount > 0 && (
                                  <div className="flex justify-between items-center pt-1">
                                    <span className="text-sm text-gray-600">Plus-value brute:</span>
                                    <span className={`font-medium ${(investment.cession.salePrice - investment.cession.saleFees - investment.acquisitionAmount - investment.acquisitionFees) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {((investment.cession.salePrice - investment.cession.saleFees) - (investment.acquisitionAmount + investment.acquisitionFees)).toLocaleString()} €
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="revenus">
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-bold">
                        Revenus et charges
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Section Revenus */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenus</h3>

                      {/* Revenus locatifs */}
                      <div className="border border-gray-200 rounded-lg p-4 mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Revenus locatifs</h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputField
                            label="Loyers (€)"
                            type="number"
                            value={revenuesCharges.revenues.rent}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              revenues: {...revenuesCharges.revenues, rent: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <SelectField
                            label="Par"
                            value={revenuesCharges.revenues.period}
                            onChange={(value) => setRevenuesCharges({
                              ...revenuesCharges,
                              revenues: {...revenuesCharges.revenues, period: value}
                            })}
                            options={[
                              { value: "Mois", label: "Mois" },
                              { value: "Trimestre", label: "Trimestre" },
                              { value: "Année", label: "Année" }
                            ]}
                          />
                          <InputField
                            label="Indexation annuelle (%)"
                            type="number"
                            step="0.01"
                            value={revenuesCharges.revenues.indexation}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              revenues: {...revenuesCharges.revenues, indexation: parseFloat(e.target.value) || 0}
                            })}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <InputField
                            label="Date de début"
                            type="date"
                            value={revenuesCharges.revenues.startDate.split('/').reverse().join('-')}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              revenues: {...revenuesCharges.revenues, startDate: e.target.value.split('-').reverse().join('/')}
                            })}
                          />
                          <InputField
                            label="Taux de vacance (%)"
                            type="number"
                            step="0.1"
                            value={revenuesCharges.revenues.vacancyRate}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              revenues: {...revenuesCharges.revenues, vacancyRate: parseFloat(e.target.value) || 0}
                            })}
                          />
                        </div>

                        {/* Calcul automatique des revenus annuels nets */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Revenus bruts annuels:</span>
                              <span className="font-medium">
                                {(() => {
                                  const multiplier = revenuesCharges.revenues.period === "Mois" ? 12 :
                                                   revenuesCharges.revenues.period === "Trimestre" ? 4 : 1;
                                  return (revenuesCharges.revenues.rent * multiplier).toLocaleString();
                                })()} €
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Impact vacance ({revenuesCharges.revenues.vacancyRate}%):</span>
                              <span className="font-medium text-red-600">
                                -{(() => {
                                  const multiplier = revenuesCharges.revenues.period === "Mois" ? 12 :
                                                   revenuesCharges.revenues.period === "Trimestre" ? 4 : 1;
                                  const annualRent = revenuesCharges.revenues.rent * multiplier;
                                  return Math.round(annualRent * (revenuesCharges.revenues.vacancyRate / 100)).toLocaleString();
                                })()} €
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-2">
                              <span className="font-medium text-gray-700">Revenus nets prévisionnels:</span>
                              <span className="text-lg font-bold text-blue-600">
                                {(() => {
                                  const multiplier = revenuesCharges.revenues.period === "Mois" ? 12 :
                                                   revenuesCharges.revenues.period === "Trimestre" ? 4 : 1;
                                  const annualRent = revenuesCharges.revenues.rent * multiplier;
                                  const netRent = annualRent * (1 - revenuesCharges.revenues.vacancyRate / 100);
                                  return Math.round(netRent).toLocaleString();
                                })()} €/an
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Charges récupérables */}
                      <div className="border border-gray-200 rounded-lg p-4 mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Charges récupérables</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Montant annuel (€)"
                            type="number"
                            value={revenuesCharges.revenues.chargesRecovered}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              revenues: {...revenuesCharges.revenues, chargesRecovered: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Rendement charges récupérables
                            </label>
                            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {investment.acquisitionAmount > 0 ?
                                `${((revenuesCharges.revenues.chargesRecovered / investment.acquisitionAmount) * 100).toFixed(2)}% du prix d'acquisition` :
                                "Saisissez le prix d'acquisition"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Autres revenus */}
                      <div className="border border-gray-200 rounded-lg p-4 mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Autres revenus</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Recettes diverses (€/an)"
                            type="number"
                            value={revenuesCharges.revenues.diverseRevenues}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              revenues: {...revenuesCharges.revenues, diverseRevenues: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <Textarea
                              value={revenuesCharges.revenues.diverseRevenuesDescription}
                              onChange={(e) => setRevenuesCharges({
                                ...revenuesCharges,
                                revenues: {...revenuesCharges.revenues, diverseRevenuesDescription: e.target.value}
                              })}
                              placeholder="Parking, garage, subventions..."
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Synthèse des revenus */}
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Synthèse annuelle des revenus</h4>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Loyers nets (après vacance):</span>
                            <span className="font-medium">
                              {(() => {
                                const multiplier = revenuesCharges.revenues.period === "Mois" ? 12 :
                                                 revenuesCharges.revenues.period === "Trimestre" ? 4 : 1;
                                const annualRent = revenuesCharges.revenues.rent * multiplier;
                                const netRent = annualRent * (1 - revenuesCharges.revenues.vacancyRate / 100);
                                return Math.round(netRent).toLocaleString();
                              })()} €
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Charges récupérables:</span>
                            <span className="font-medium">{revenuesCharges.revenues.chargesRecovered.toLocaleString()} €</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Recettes diverses:</span>
                            <span className="font-medium">{revenuesCharges.revenues.diverseRevenues.toLocaleString()} €</span>
                          </div>
                          <div className="flex justify-between items-center border-t pt-2">
                            <span className="font-bold text-gray-700">Total revenus annuels:</span>
                            <span className="text-xl font-bold text-green-600">
                              {(() => {
                                const multiplier = revenuesCharges.revenues.period === "Mois" ? 12 :
                                                 revenuesCharges.revenues.period === "Trimestre" ? 4 : 1;
                                const annualRent = revenuesCharges.revenues.rent * multiplier;
                                const netRent = annualRent * (1 - revenuesCharges.revenues.vacancyRate / 100);
                                const total = netRent + revenuesCharges.revenues.chargesRecovered + revenuesCharges.revenues.diverseRevenues;
                                return Math.round(total).toLocaleString();
                              })()} €
                            </span>
                          </div>

                          {/* Rendement brut */}
                          {investment.acquisitionAmount > 0 && (
                            <div className="flex justify-between items-center pt-1 text-sm">
                              <span className="text-gray-600">Rendement brut:</span>
                              <span className="font-medium text-blue-600">
                                {(() => {
                                  const multiplier = revenuesCharges.revenues.period === "Mois" ? 12 :
                                                   revenuesCharges.revenues.period === "Trimestre" ? 4 : 1;
                                  const annualRent = revenuesCharges.revenues.rent * multiplier;
                                  const netRent = annualRent * (1 - revenuesCharges.revenues.vacancyRate / 100);
                                  const total = netRent + revenuesCharges.revenues.chargesRecovered + revenuesCharges.revenues.diverseRevenues;
                                  const rentabilite = (total / investment.acquisitionAmount) * 100;
                                  return rentabilite.toFixed(2);
                                })()}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section Charges annuelles */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Charges annuelles</h3>

                      {/* Taxes foncières */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Taxes foncières</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <InputField
                            label="Taxes foncières (€)"
                            type="number"
                            value={revenuesCharges.charges.propertyTax}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, propertyTax: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <InputField
                            label="Indexation (%)"
                            type="number"
                            step="0.01"
                            value={revenuesCharges.charges.propertyTaxIndexation}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, propertyTaxIndexation: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <InputField
                            label="Date de début"
                            type="date"
                            value={revenuesCharges.charges.propertyTaxStartDate.split('/').reverse().join('-')}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, propertyTaxStartDate: e.target.value.split('-').reverse().join('/')}
                            })}
                          />
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={revenuesCharges.charges.propertyTaxExemption}
                                onChange={(e) => setRevenuesCharges({
                                  ...revenuesCharges,
                                  charges: {...revenuesCharges.charges, propertyTaxExemption: e.target.checked}
                                })}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Exonération taxes foncières</span>
                            </label>
                            {revenuesCharges.charges.propertyTaxExemption && (
                              <InputField
                                label="Durée exonération (années)"
                                type="number"
                                value={revenuesCharges.charges.propertyTaxExemptionYears}
                                onChange={(e) => setRevenuesCharges({
                                  ...revenuesCharges,
                                  charges: {...revenuesCharges.charges, propertyTaxExemptionYears: parseInt(e.target.value) || 0}
                                })}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Frais de gestion */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Frais de gestion</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Frais de gestion (%)"
                            type="number"
                            step="0.01"
                            value={revenuesCharges.charges.managementFees}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, managementFees: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <InputField
                            label="Indexation (%)"
                            type="number"
                            step="0.01"
                            value={revenuesCharges.charges.managementFeesIndexation}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, managementFeesIndexation: parseFloat(e.target.value) || 0}
                            })}
                          />
                        </div>
                      </div>

                      {/* Primes d'assurance */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Primes d'assurance</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Primes d'assurance (€)"
                            type="number"
                            value={revenuesCharges.charges.insurancePremiums}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, insurancePremiums: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <InputField
                            label="Indexation (%)"
                            type="number"
                            step="0.01"
                            value={revenuesCharges.charges.insurancePremiumsIndexation}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, insurancePremiumsIndexation: parseFloat(e.target.value) || 0}
                            })}
                          />
                        </div>
                      </div>

                      {/* Charges de copropriété */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Charges de copropriété</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputField
                            label="Charges copropriété (€)"
                            type="number"
                            value={revenuesCharges.charges.coproprietyCharges}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, coproprietyCharges: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <InputField
                            label="Réserve maintenance (€)"
                            type="number"
                            value={revenuesCharges.charges.maintenanceReserve}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, maintenanceReserve: parseFloat(e.target.value) || 0}
                            })}
                          />
                        </div>
                      </div>

                      {/* Charges diverses */}
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Charges diverses</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputField
                            label="Charges diverses (€)"
                            type="number"
                            value={revenuesCharges.charges.diverseCharges}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, diverseCharges: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <InputField
                            label="Indexation (%)"
                            type="number"
                            step="0.01"
                            value={revenuesCharges.charges.diverseChargesIndexation}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, diverseChargesIndexation: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <Textarea
                              value={revenuesCharges.charges.diverseChargesDescription}
                              onChange={(e) => setRevenuesCharges({
                                ...revenuesCharges,
                                charges: {...revenuesCharges.charges, diverseChargesDescription: e.target.value}
                              })}
                              placeholder="Entretien, réparations, syndic..."
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Charges non déductibles */}
                      <div>
                        <h4 className="text-md font-medium text-gray-700 mb-3">Charges non déductibles</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputField
                            label="Charges non déductibles (€)"
                            type="number"
                            value={revenuesCharges.charges.nonDeductibleCharges}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, nonDeductibleCharges: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <InputField
                            label="Indexation (%)"
                            type="number"
                            step="0.01"
                            value={revenuesCharges.charges.nonDeductibleChargesIndexation}
                            onChange={(e) => setRevenuesCharges({
                              ...revenuesCharges,
                              charges: {...revenuesCharges.charges, nonDeductibleChargesIndexation: parseFloat(e.target.value) || 0}
                            })}
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <Textarea
                              value={revenuesCharges.charges.nonDeductibleChargesDescription}
                              onChange={(e) => setRevenuesCharges({
                                ...revenuesCharges,
                                charges: {...revenuesCharges.charges, nonDeductibleChargesDescription: e.target.value}
                              })}
                              placeholder="Frais de procédure, pénalités..."
                              rows={2}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Synthèse des charges annuelles */}
                    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="text-md font-semibold text-gray-800 mb-3">Synthèse des charges annuelles</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-gray-600">Taxes foncières</div>
                          <div className="font-semibold">{revenuesCharges.charges.propertyTax} €</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Frais de gestion</div>
                          <div className="font-semibold">{(revenuesCharges.revenues.rent * 12 * revenuesCharges.charges.managementFees / 100).toFixed(0)} €</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Assurances</div>
                          <div className="font-semibold">{revenuesCharges.charges.insurancePremiums} €</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Charges diverses</div>
                          <div className="font-semibold">{revenuesCharges.charges.diverseCharges} €</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm mt-3">
                        <div className="text-center">
                          <div className="text-gray-600">Copropriété</div>
                          <div className="font-semibold">{revenuesCharges.charges.coproprietyCharges} €</div>
                        </div>
                        <div className="text-center">
                          <div className="text-gray-600">Réserve maintenance</div>
                          <div className="font-semibold">{revenuesCharges.charges.maintenanceReserve} €</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total charges annuelles</span>
                          <span className="font-bold text-red-600">
                            {(
                              revenuesCharges.charges.propertyTax +
                              (revenuesCharges.revenues.rent * 12 * revenuesCharges.charges.managementFees / 100) +
                              revenuesCharges.charges.insurancePremiums +
                              revenuesCharges.charges.diverseCharges +
                              revenuesCharges.charges.coproprietyCharges +
                              revenuesCharges.charges.maintenanceReserve
                            ).toFixed(0)} €
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resultats">
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <CardTitle className="flex items-center space-x-3 text-xl">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent font-bold">
                        Résultats de la simulation
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Indicateurs clés */}
                    {results && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-sm text-purple-600 mb-1">TRI</div>
                              <div className="text-2xl font-bold text-purple-700">
                                {(results.totalReturnPercentage / project.duration).toFixed(1)}%
                              </div>
                              <div className="text-xs text-purple-500 mt-1">Taux de Rendement Interne</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-sm text-orange-600 mb-1">Cash-on-Cash</div>
                              <div className="text-2xl font-bold text-orange-700">
                                {investment.financing.personalContribution > 0 ? (results.netAnnualRevenue / investment.financing.personalContribution * 100).toFixed(1) : "0.0"}%
                              </div>
                              <div className="text-xs text-orange-500 mt-1">Rendement sur apport</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-sm text-pink-600 mb-1">Point d'équilibre</div>
                              <div className="text-2xl font-bold text-pink-700">
                                {results.annualRent > 0 ? Math.ceil(results.annualCharges / results.annualRent * 100) : "0"}%
                              </div>
                              <div className="text-xs text-pink-500 mt-1">Taux d'occupation min.</div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {/* Système d'onglets pour les résultats */}
                    {results && (
                      <Tabs defaultValue="synthese" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="synthese">Synthèse</TabsTrigger>
                          <TabsTrigger value="details">Détails</TabsTrigger>
                          <TabsTrigger value="fiscalite">Fiscalité</TabsTrigger>
                          <TabsTrigger value="projection">Projection</TabsTrigger>
                        </TabsList>

                        <TabsContent value="synthese">
                          <ResultsPanel />
                        </TabsContent>

                        <TabsContent value="details">
                          <div className="bg-white rounded-lg border p-4">
                            <h4 className="font-semibold mb-3">Détails année par année</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Année</TableHead>
                                  <TableHead>Revenus bruts</TableHead>
                                  <TableHead>Charges</TableHead>
                                  <TableHead>Revenus nets</TableHead>
                                  <TableHead>Cumul</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Array.from({length: project.duration}, (_, i) => i + 1).map((year) => (
                                  <TableRow key={year}>
                                    <TableCell>Année {year}</TableCell>
                                    <TableCell>{(results.annualRent * Math.pow(1 + revenuesCharges.revenues.indexation/100, year-1)).toFixed(0)} €</TableCell>
                                    <TableCell>{results.annualCharges.toFixed(0)} €</TableCell>
                                    <TableCell>{(results.annualRent * Math.pow(1 + revenuesCharges.revenues.indexation/100, year-1) - results.annualCharges).toFixed(0)} €</TableCell>
                                    <TableCell>{(results.netAnnualRevenue * year).toFixed(0)} €</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>

                        <TabsContent value="fiscalite">
                          <div className="bg-white rounded-lg border p-4">
                            <h4 className="font-semibold mb-3">Impact fiscal</h4>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Économie d'impôt annuelle</Label>
                                  <div className="text-lg font-bold text-green-600">
                                    {advancedOptions.taxOptimization ? (results.annualCharges * 0.3).toFixed(0) : "0"} €
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Déficit foncier potentiel</Label>
                                  <div className="text-lg font-bold text-blue-600">
                                    {Math.max(0, results.annualCharges - results.annualRent).toFixed(0)} €
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="projection">
                          <div className="bg-white rounded-lg border p-4">
                            <h4 className="font-semibold mb-3">Projection sur {project.duration} ans</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-4 bg-blue-50 rounded">
                                <div className="text-sm text-gray-600">Total revenus</div>
                                <div className="text-xl font-bold text-blue-600">{results.totalRevenueOverPeriod.toFixed(0)} €</div>
                              </div>
                              <div className="text-center p-4 bg-green-50 rounded">
                                <div className="text-sm text-gray-600">Plus-value</div>
                                <div className="text-xl font-bold text-green-600">{results.capitalGain.toFixed(0)} €</div>
                              </div>
                              <div className="text-center p-4 bg-purple-50 rounded">
                                <div className="text-sm text-gray-600">Rentabilité totale</div>
                                <div className="text-xl font-bold text-purple-600">{results.totalReturnPercentage.toFixed(1)}%</div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}

                    {!showResults && (
                      <div className="bg-gray-50 rounded-lg p-8 text-center my-8">
                        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">Pas de résultats à afficher</h3>
                        <p className="text-gray-500 text-sm">
                          Remplissez les informations nécessaires et cliquez sur "Calculer" pour voir les résultats de votre simulation.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer informatif */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border-t-4 border-blue-500 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="text-gray-600">
                <p className="text-sm font-medium">Simulation non contractuelle</p>
                <p className="text-xs text-gray-500">
                  Quentin y Hovrat - {new Date().toLocaleDateString('fr-FR')}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Dernière sauvegarde: {lastSave.toLocaleTimeString('fr-FR')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => setShowSettingsModal(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Button variant="outline" size="sm">
                <Calculator className="h-4 w-4 mr-2" />
                Calculer
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Former
              </Button>
            </div>
          </div>
        </div>

        {/* Bouton de calcul flottant */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleCalculateWithValidation}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
            size="lg"
          >
            <Calculator className="h-5 w-5" />
            <span className="font-semibold">Calculer</span>
          </Button>
        </div>

        {/* Modal des paramètres */}
        <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Paramètres</DialogTitle>
              <p className="text-sm text-gray-600 mt-2">
                Vos préférences seront appliquées à cette simulation immobilière.
              </p>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Choix de l'effort mensuel moyen */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Choix de l'effort mensuel moyen
                </h4>
                <RadioGroup
                  value={settings.effortChoice}
                  onValueChange={(value) => setSettings({...settings, effortChoice: value})}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tresorerie" id="tresorerie" />
                    <Label htmlFor="tresorerie" className="text-sm">
                      Effort de trésorerie mensuel moyen
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="epargne" id="epargne" />
                    <Label htmlFor="epargne" className="text-sm">
                      Effort d'épargne mensuel moyen
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* TRI dans les éditions et les résultats */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  TRI dans les éditions et les résultats
                </h4>
                <RadioGroup
                  value={settings.showTRI}
                  onValueChange={(value) => setSettings({...settings, showTRI: value})}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="afficher" id="tri-afficher" />
                    <Label htmlFor="tri-afficher" className="text-sm">Afficher</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masquer" id="tri-masquer" />
                    <Label htmlFor="tri-masquer" className="text-sm">Masquer</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Rendement locatif dans les éditions */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Rendement locatif dans les éditions
                </h4>
                <RadioGroup
                  value={settings.showRendement}
                  onValueChange={(value) => setSettings({...settings, showRendement: value})}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="afficher" id="rendement-afficher" />
                    <Label htmlFor="rendement-afficher" className="text-sm">Afficher</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masquer" id="rendement-masquer" />
                    <Label htmlFor="rendement-masquer" className="text-sm">Masquer</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancelSettings}>
                Annuler
              </Button>
              <Button onClick={handleSaveSettings}>
                Valider
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SimulateurImmobilier;