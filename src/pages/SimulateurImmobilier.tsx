import { useState } from 'react';
import { Calendar, Calculator, Home, TrendingUp, FileText, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const SimulateurImmobilier = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projet');
  const [simulationType, setSimulationType] = useState('complete');
  const [showResults, setShowResults] = useState(false);

  // État du projet
  const [project, setProject] = useState({
    title: "Votre simulation immobilière du 28/09/2025 à 08h51",
    recipient: "",
    location: "rue",
    device: "Foncier ordinaire",
    investmentDate: "01/10/2025",
    completionDate: "",
    duration: 10,
    durationUnit: "ans"
  });

  // État de la situation fiscale
  const [taxSituation, setTaxSituation] = useState({
    familyStatus: "Marié(e)",
    incomeSource: "Métropole",
    nonResidentTax: false,
    dependents: 0,
    evolveDependents: false
  });

  // État de l'investissement
  const [investment, setInvestment] = useState({
    acquisitionAmount: 0,
    acquisitionFees: 0,
    revaluation: 0.00,
    saleDate: "01/10/2025",
    fundCall: false,
    works: [],
    financing: {
      personalContribution: 0,
      credits: [],
      savings: []
    },
    cession: {
      soldAtEnd: true
    }
  });

  // État des revenus et charges
  const [revenuesCharges, setRevenuesCharges] = useState({
    revenues: {
      rent: 0,
      period: "Mois",
      startDate: "01/10/2025",
      indexation: 0.00,
      diverseRevenues: 0,
      diverseRevenuesDate: ""
    },
    charges: {
      propertyTax: 0,
      taxIndexation: 0.00,
      taxStartDate: "01/10/2025",
      propertyTaxExemption: 0.00,
      exemptionDuration: 0,
      managementFees: 0.00,
      insurancePremiums: 0,
      insuranceIndexation: 0.00,
      diverseCharges: 0,
      diverseChargesIndexation: 0.00,
      nonDeductibleCharges: 0,
      nonDeductibleIndexation: 0.00
    }
  });

  const [results, setResults] = useState(null);

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
                          { value: "Pinel", label: "Loi Pinel" },
                          { value: "Malraux", label: "Loi Malraux" },
                          { value: "Denormandie", label: "Denormandie" }
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

                      <InputField
                        label="Date d'achèvement"
                        type="date"
                        value={project.completionDate}
                        onChange={(e) => setProject({...project, completionDate: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputField
                        label="Durée du projet"
                        type="number"
                        value={project.duration}
                        onChange={(e) => setProject({...project, duration: parseInt(e.target.value) || 0})}
                      />
                      <SelectField
                        label="Unité"
                        value={project.durationUnit}
                        onChange={(value) => setProject({...project, durationUnit: value})}
                        options={[
                          { value: "ans", label: "ans" },
                          { value: "mois", label: "mois" }
                        ]}
                      />
                    </div>

                    {/* Situation fiscale */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Situation fiscale</h3>

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
                    {/* Bien immobilier */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bien immobilier</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Montant d'acquisition (€)"
                          type="number"
                          value={investment.acquisitionAmount}
                          onChange={(e) => setInvestment({...investment, acquisitionAmount: parseFloat(e.target.value) || 0})}
                        />

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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <InputField
                          label="Frais d'acquisition (€)"
                          type="number"
                          value={investment.acquisitionFees}
                          onChange={(e) => setInvestment({...investment, acquisitionFees: parseFloat(e.target.value) || 0})}
                        />

                        <InputField
                          label="Vendu le"
                          type="date"
                          value={investment.saleDate.split('/').reverse().join('-')}
                          onChange={(e) => setInvestment({...investment, saleDate: e.target.value.split('-').reverse().join('/')})}
                        />
                      </div>

                      <div className="mt-4">
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

                      <InputField
                        label="Apport Personnel (€)"
                        type="number"
                        value={investment.financing.personalContribution}
                        onChange={(e) => setInvestment({
                          ...investment,
                          financing: {
                            ...investment.financing,
                            personalContribution: parseFloat(e.target.value) || 0
                          }
                        })}
                      />

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
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenus locatifs</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField
                          label="Loyer mensuel (€)"
                          type="number"
                          value={revenuesCharges.revenues.rent}
                          onChange={(e) => setRevenuesCharges({
                            ...revenuesCharges,
                            revenues: {...revenuesCharges.revenues, rent: parseFloat(e.target.value) || 0}
                          })}
                        />
                        <SelectField
                          label="Période"
                          value={revenuesCharges.revenues.period}
                          onChange={(value) => setRevenuesCharges({
                            ...revenuesCharges,
                            revenues: {...revenuesCharges.revenues, period: value}
                          })}
                          options={[
                            { value: "Mois", label: "Mensuel" },
                            { value: "Trimestre", label: "Trimestriel" },
                            { value: "Année", label: "Annuel" }
                          ]}
                        />
                        <InputField
                          label="Indexation (%/an)"
                          type="number"
                          step="0.01"
                          value={revenuesCharges.revenues.indexation}
                          onChange={(e) => setRevenuesCharges({
                            ...revenuesCharges,
                            revenues: {...revenuesCharges.revenues, indexation: parseFloat(e.target.value) || 0}
                          })}
                        />
                      </div>
                    </div>

                    {/* Section Charges */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Charges</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Taxe foncière (€/an)"
                          type="number"
                          value={revenuesCharges.charges.propertyTax}
                          onChange={(e) => setRevenuesCharges({
                            ...revenuesCharges,
                            charges: {...revenuesCharges.charges, propertyTax: parseFloat(e.target.value) || 0}
                          })}
                        />
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
                          label="Assurances (€/an)"
                          type="number"
                          value={revenuesCharges.charges.insurancePremiums}
                          onChange={(e) => setRevenuesCharges({
                            ...revenuesCharges,
                            charges: {...revenuesCharges.charges, insurancePremiums: parseFloat(e.target.value) || 0}
                          })}
                        />
                        <InputField
                          label="Charges diverses (€/an)"
                          type="number"
                          value={revenuesCharges.charges.diverseCharges}
                          onChange={(e) => setRevenuesCharges({
                            ...revenuesCharges,
                            charges: {...revenuesCharges.charges, diverseCharges: parseFloat(e.target.value) || 0}
                          })}
                        />
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
                    <ResultsPanel />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
      </div>
    </div>
  );
};

export default SimulateurImmobilier;