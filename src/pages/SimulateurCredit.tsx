import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Calculator, TrendingUp, FileSpreadsheet, Download, Trash2, Copy, Euro, Percent, Calendar, Home } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface LoanSimulation {
  id: number;
  loanAmount: number;
  years: number;
  months: number;
  rate: number;
  insuranceRate: number;
  periodicity: string;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  totalInsurance: number;
  fraisDossier: number;
  fraisDossierType: "montant" | "pourcentage";
  fraisDossierPourcentage: number;
  schedule: Array<{
    month: number;
    mensualite: number;
    interets: number;
    capital: number;
    assurance: number;
    restant: number;
  }>;
  dateCreated: Date;
}

export default function SimulateurCredit() {
  const [loanAmount, setLoanAmount] = useState(220000);
  const [years, setYears] = useState(23);
  const [months, setMonths] = useState(2);
  const [rate, setRate] = useState(4.2);
  const [insuranceRate, setInsuranceRate] = useState(0.36);
  const [periodicity, setPeriodicity] = useState("mensuelle");
  const [results, setResults] = useState<LoanSimulation | null>(null);
  const [simulations, setSimulations] = useState<LoanSimulation[]>([]);
  const [selectedChart, setSelectedChart] = useState("amortization");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Paramètres avancés
  const [apportPersonnel, setApportPersonnel] = useState(0);
  const [fraisNotaire, setFraisNotaire] = useState(0);
  const [fraisDossier, setFraisDossier] = useState(500);
  const [fraisDossierPourcentage, setFraisDossierPourcentage] = useState(0);
  const [fraisDossierType, setFraisDossierType] = useState<"montant" | "pourcentage">("montant");
  const [garantie, setGarantie] = useState(0);
  const [differePartiel, setDifferePartiel] = useState(0);
  const [differeTotalMois, setDiffereTotalMois] = useState(0);

  // Charger les simulations depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem('loan_simulations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSimulations(parsed.map((sim: any) => ({
          ...sim,
          dateCreated: new Date(sim.dateCreated)
        })));
      } catch (error) {
        console.error('Erreur lors du chargement des simulations:', error);
      }
    }
  }, []);

  // Sauvegarder les simulations dans localStorage
  useEffect(() => {
    localStorage.setItem('loan_simulations', JSON.stringify(simulations));
  }, [simulations]);

  const calculateLoan = () => {
    const totalMonths = years * 12 + months;
    const monthlyRate = rate / 100 / 12;
    const monthlyInsurance = (loanAmount * (insuranceRate / 100)) / 12;

    // Calcul des frais de dossier
    const fraisDossierCalcules = fraisDossierType === "pourcentage"
      ? (loanAmount * fraisDossierPourcentage / 100)
      : fraisDossier;

    const periodsPerYear = periodicity === "mensuelle" ? 12 :
                          periodicity === "trimestrielle" ? 4 :
                          periodicity === "semestrielle" ? 2 : 1;
    const totalPeriods = totalMonths / (12 / periodsPerYear);
    const periodRate = (rate / 100) / periodsPerYear;

    let periodPayment;
    if (periodRate === 0) {
      periodPayment = loanAmount / totalPeriods;
    } else {
      periodPayment = (loanAmount * periodRate) / (1 - Math.pow(1 + periodRate, -totalPeriods));
    }

    const monthlyPayment = periodicity === "mensuelle" ? periodPayment :
                          periodicity === "trimestrielle" ? periodPayment / 3 :
                          periodicity === "semestrielle" ? periodPayment / 6 :
                          periodPayment / 12;
    const totalPayment = (monthlyPayment + monthlyInsurance) * totalMonths + fraisDossierCalcules;
    const totalInterest = totalPayment - loanAmount - monthlyInsurance * totalMonths - fraisDossierCalcules;
    const totalInsurance = monthlyInsurance * totalMonths;

    // Création du tableau d'amortissement
    let balance = loanAmount;
    const schedule = [];

    for (let i = 1; i <= totalMonths; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance = Math.max(0, balance - principal);

      schedule.push({
        month: i,
        mensualite: parseFloat((monthlyPayment + monthlyInsurance).toFixed(2)),
        interets: parseFloat(interest.toFixed(2)),
        capital: parseFloat(principal.toFixed(2)),
        assurance: parseFloat(monthlyInsurance.toFixed(2)),
        restant: parseFloat(balance.toFixed(2)),
      });
    }

    const simulation: LoanSimulation = {
      id: Date.now(),
      loanAmount,
      years,
      months,
      rate,
      insuranceRate,
      periodicity,
      monthlyPayment: parseFloat((monthlyPayment + monthlyInsurance).toFixed(2)),
      totalPayment: parseFloat(totalPayment.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      totalInsurance: parseFloat(totalInsurance.toFixed(2)),
      fraisDossier: parseFloat(fraisDossierCalcules.toFixed(2)),
      fraisDossierType,
      fraisDossierPourcentage,
      schedule,
      dateCreated: new Date(),
    };

    setResults(simulation);
    setSimulations((prev) => [simulation, ...prev].slice(0, 10)); // Garder max 10 simulations
  };

  const removeSimulation = (id: number) => {
    setSimulations((prev) => prev.filter((s) => s.id !== id));
  };

  const duplicateSimulation = (simulation: LoanSimulation) => {
    setLoanAmount(simulation.loanAmount);
    setYears(simulation.years);
    setMonths(simulation.months);
    setRate(simulation.rate);
    setInsuranceRate(simulation.insuranceRate);
    setPeriodicity(simulation.periodicity);
    setFraisDossierType(simulation.fraisDossierType);
    setFraisDossier(simulation.fraisDossier);
    setFraisDossierPourcentage(simulation.fraisDossierPourcentage);
  };

  const exportToCSV = (simulation: LoanSimulation) => {
    const headers = ['Mois', 'Mensualité (€)', 'Intérêts (€)', 'Capital (€)', 'Assurance (€)', 'Restant dû (€)'];
    const csvContent = [
      headers.join(','),
      ...simulation.schedule.map(row =>
        [row.month, row.mensualite, row.interets, row.capital, row.assurance, row.restant].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `simulation_credit_${simulation.id}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getCapacityColor = (ratio: number) => {
    if (ratio <= 25) return "text-green-600";
    if (ratio <= 33) return "text-orange-500";
    return "text-red-600";
  };

  const chartData = results?.schedule.filter((_, index) => index % Math.ceil(results.schedule.length / 50) === 0) || [];

  const pieData = results ? [
    { name: 'Capital', value: results.loanAmount, fill: '#3b82f6' },
    { name: 'Intérêts', value: results.totalInterest, fill: '#ef4444' },
    { name: 'Assurance', value: results.totalInsurance, fill: '#f59e0b' },
    { name: 'Frais dossier', value: results.fraisDossier, fill: '#a855f7' },
  ] : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calculator className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Simulateur de Crédit</h1>
          <p className="text-muted-foreground">Calculez votre capacité d'emprunt et optimisez votre financement</p>
        </div>
      </div>

      {/* Formulaire de simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="h-5 w-5" />
            <span>Votre projet de financement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="flex items-center space-x-2">
                <Euro className="h-4 w-4" />
                <span>Montant du prêt (€)</span>
              </Label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(+e.target.value)}
                min="1000"
                max="2000000"
                step="1000"
              />
            </div>

            <div className="flex space-x-2">
              <div className="flex-1">
                <Label className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Durée (années)</span>
                </Label>
                <Input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(+e.target.value)}
                  min="1"
                  max="30"
                />
              </div>
              <div className="flex-1">
                <Label className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Mois supplémentaires</span>
                </Label>
                <Input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(+e.target.value)}
                  min="0"
                  max="11"
                />
              </div>
            </div>

            <div>
              <Label className="flex items-center space-x-2">
                <Percent className="h-4 w-4" />
                <span>Taux du prêt (%)</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(+e.target.value)}
                min="0"
                max="20"
              />
              <div className="mt-2">
                <Slider
                  value={[rate]}
                  onValueChange={(value) => setRate(parseFloat(value[0].toFixed(2)))}
                  max={10}
                  min={0}
                  step={0.01}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label>Taux d'assurance (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={insuranceRate}
                onChange={(e) => setInsuranceRate(+e.target.value)}
                min="0"
                max="5"
              />
            </div>

            <div>
              <Label>Périodicité</Label>
              <Select value={periodicity} onValueChange={setPeriodicity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensuelle">Mensuelle</SelectItem>
                  <SelectItem value="trimestrielle">Trimestrielle</SelectItem>
                  <SelectItem value="semestrielle">Semestrielle</SelectItem>
                  <SelectItem value="annuelle">Annuelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Paramètres avancés */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-4">
              <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
              <Label>Paramètres avancés</Label>
            </div>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Apport personnel (€)</Label>
                  <Input
                    type="number"
                    value={apportPersonnel}
                    onChange={(e) => setApportPersonnel(+e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <Label>Frais de notaire (€)</Label>
                  <Input
                    type="number"
                    value={fraisNotaire}
                    onChange={(e) => setFraisNotaire(+e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <Label>Frais de dossier</Label>
                  <div className="space-y-2">
                    <Select value={fraisDossierType} onValueChange={(value: "montant" | "pourcentage") => setFraisDossierType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="montant">Montant fixe (€)</SelectItem>
                        <SelectItem value="pourcentage">Pourcentage (%)</SelectItem>
                      </SelectContent>
                    </Select>
                    {fraisDossierType === "montant" ? (
                      <Input
                        type="number"
                        value={fraisDossier}
                        onChange={(e) => setFraisDossier(+e.target.value)}
                        min="0"
                        placeholder="Montant en €"
                      />
                    ) : (
                      <Input
                        type="number"
                        step="0.01"
                        value={fraisDossierPourcentage}
                        onChange={(e) => setFraisDossierPourcentage(+e.target.value)}
                        min="0"
                        max="5"
                        placeholder="Pourcentage du montant emprunté"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <Label>Garantie (€)</Label>
                  <Input
                    type="number"
                    value={garantie}
                    onChange={(e) => setGarantie(+e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <Label>Différé partiel (mois)</Label>
                  <Input
                    type="number"
                    value={differePartiel}
                    onChange={(e) => setDifferePartiel(+e.target.value)}
                    min="0"
                    max="24"
                  />
                </div>
                <div>
                  <Label>Différé total (mois)</Label>
                  <Input
                    type="number"
                    value={differeTotalMois}
                    onChange={(e) => setDiffereTotalMois(+e.target.value)}
                    min="0"
                    max="24"
                  />
                </div>
              </div>
            )}
          </div>

          <Button onClick={calculateLoan} className="w-full md:w-auto" size="lg">
            <Calculator className="h-4 w-4 mr-2" />
            Calculer ma simulation
          </Button>
        </CardContent>
      </Card>

      {/* Résultats */}
      {results && (
        <div className="space-y-6">
          {/* Résumé des résultats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Euro className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Mensualité</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{results.monthlyPayment.toLocaleString()} €</p>
                <p className="text-xs text-muted-foreground">
                  {((results.monthlyPayment / 3500) * 100).toFixed(1)}% d'un salaire de 3 500€
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Coût total</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{results.totalPayment.toLocaleString()} €</p>
                <p className="text-xs text-muted-foreground">
                  +{((results.totalPayment / results.loanAmount - 1) * 100).toFixed(1)}% du capital emprunté
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Percent className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium">Intérêts</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{results.totalInterest.toLocaleString()} €</p>
                <p className="text-xs text-muted-foreground">
                  {((results.totalInterest / results.totalPayment) * 100).toFixed(1)}% du coût total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">Assurance</span>
                </div>
                <p className="text-2xl font-bold text-orange-600">{results.totalInsurance.toLocaleString()} €</p>
                <p className="text-xs text-muted-foreground">
                  {((results.totalInsurance / results.totalPayment) * 100).toFixed(1)}% du coût total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Frais dossier</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">{results.fraisDossier.toLocaleString()} €</p>
                <p className="text-xs text-muted-foreground">
                  {results.fraisDossierType === "pourcentage"
                    ? `${results.fraisDossierPourcentage}% du capital`
                    : "Montant fixe"
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques et tableaux */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse détaillée</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedChart} onValueChange={setSelectedChart}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="amortization">Amortissement</TabsTrigger>
                  <TabsTrigger value="evolution">Évolution</TabsTrigger>
                  <TabsTrigger value="repartition">Répartition</TabsTrigger>
                  <TabsTrigger value="tableau">Tableau</TabsTrigger>
                </TabsList>

                <TabsContent value="amortization" className="mt-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [`${Number(value).toLocaleString()} €`, name]} />
                      <Legend />
                      <Bar dataKey="capital" stackId="a" fill="#3b82f6" name="Capital" />
                      <Bar dataKey="interets" stackId="a" fill="#ef4444" name="Intérêts" />
                      <Bar dataKey="assurance" stackId="a" fill="#f59e0b" name="Assurance" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="evolution" className="mt-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString()} €`} />
                      <Legend />
                      <Line type="monotone" dataKey="restant" stroke="#8884d8" name="Capital restant dû" strokeWidth={3} />
                      <Line type="monotone" dataKey="capital" stroke="#82ca9d" name="Capital amorti cumulé" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="repartition" className="mt-6">
                  <div className="flex justify-center">
                    <ResponsiveContainer width={400} height={400}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${Number(value).toLocaleString()} €`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="tableau" className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Échéancier détaillé</h3>
                    <Button variant="outline" size="sm" onClick={() => exportToCSV(results)}>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter CSV
                    </Button>
                  </div>
                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="min-w-full border text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="border px-3 py-2 text-left">Mois</th>
                          <th className="border px-3 py-2 text-right">Mensualité (€)</th>
                          <th className="border px-3 py-2 text-right">Intérêts (€)</th>
                          <th className="border px-3 py-2 text-right">Capital (€)</th>
                          <th className="border px-3 py-2 text-right">Assurance (€)</th>
                          <th className="border px-3 py-2 text-right">Restant dû (€)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.schedule.map((row, index) => (
                          <tr key={row.month} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                            <td className="border px-3 py-2">{row.month}</td>
                            <td className="border px-3 py-2 text-right font-medium">{row.mensualite.toLocaleString()}</td>
                            <td className="border px-3 py-2 text-right text-red-600">{row.interets.toLocaleString()}</td>
                            <td className="border px-3 py-2 text-right text-blue-600">{row.capital.toLocaleString()}</td>
                            <td className="border px-3 py-2 text-right text-orange-600">{row.assurance.toLocaleString()}</td>
                            <td className="border px-3 py-2 text-right">{row.restant.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comparateur de simulations */}
      {simulations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparateur de simulations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulations.map((sim) => (
                <Card key={sim.id} className="shadow-lg border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Simulation #{sim.id.toString().slice(-4)}</span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateSimulation(sim)}
                          title="Dupliquer"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportToCSV(sim)}
                          title="Exporter"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSimulation(sim.id)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {sim.dateCreated.toLocaleDateString('fr-FR')} à {sim.dateCreated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Montant:</span>
                        <p className="font-medium">{sim.loanAmount.toLocaleString()} €</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Durée:</span>
                        <p className="font-medium">{sim.years}a {sim.months}m</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Taux:</span>
                        <p className="font-medium">{sim.rate}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Assurance:</span>
                        <p className="font-medium">{sim.insuranceRate}%</p>
                      </div>
                    </div>

                    <div className="border-t pt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-blue-600 font-medium">Mensualité:</span>
                        <span className="font-bold">{sim.monthlyPayment.toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Coût total:</span>
                        <span className="font-medium">{sim.totalPayment.toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-600">Intérêts:</span>
                        <span className="font-medium">{sim.totalInterest.toLocaleString()} €</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}