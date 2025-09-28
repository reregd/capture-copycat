import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Calculator, FileText, ArrowLeft, Users, Building, Award, Info, Briefcase } from "lucide-react";
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

const RadioGroup = ({ label, name, value, onChange, options }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium leading-none">{label}</label>
    <div className="flex flex-wrap gap-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const DiagnosticStatutDirigeant = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('situation');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // États pour les informations personnelles et situation
  const [anneeSimulation, setAnneeSimulation] = useState('2025');
  const [situationMatrimoniale, setSituationMatrimoniale] = useState('Marié(e)');
  const [dateNaissance, setDateNaissance] = useState('');
  const [dateNaissanceConjoint, setDateNaissanceConjoint] = useState('');
  const [aDesEnfants, setADesEnfants] = useState(false);
  const [nombrePartsFiscales, setNombrePartsFiscales] = useState(2);
  const [autresRevenus, setAutresRevenus] = useState(false);
  const [economieImpots, setEconomieImpots] = useState(false);

  // États pour l'activité professionnelle
  const [statutSocial, setStatutSocial] = useState('');
  const [profession, setProfession] = useState('');
  const [remunerationAnnuelle, setRemunerationAnnuelle] = useState(0);

  // États pour les contrats
  const [epargneRetraite, setEpargneRetraite] = useState(false);
  const [contratPrevoyance, setContratPrevoyance] = useState(false);

  const [entreprise, setEntreprise] = useState({
    formeJuridique: "SARL",
    typeEntreprise: "",
    regimeFiscal: "",
    chiffreAffaires: 200000,
    benefices: 50000,
    effectifs: 5
  });

  const [dirigeant, setDirigeant] = useState({
    statutActuel: "Gérant majoritaire",
    salaire: 30000,
    dividendes: 20000,
    charges: 0
  });

  const [simulation, setSimulation] = useState({
    nouveauStatut: "Gérant majoritaire",
    nouveauSalaire: 35000,
    nouveauxDividendes: 15000
  });

  const calculateOptimisation = () => {
    // Calcul des taux de charges selon le statut
    const getTauxCharges = (statut) => {
      switch (statut) {
        case "Gérant majoritaire":
        case "TNS":
          return 0.45; // TNS
        case "Gérant minoritaire":
        case "Président SAS":
        case "Directeur général":
        case "Assimilé salarié":
          return 0.42; // Assimilé salarié
        case "Auto-entrepreneur":
          return 0.22; // Auto-entrepreneur
        default:
          return 0.45;
      }
    };

    const tauxChargesSitu1 = getTauxCharges(dirigeant.statutActuel);
    const tauxChargesSitu2 = getTauxCharges(simulation.nouveauStatut);

    const chargesSalaireSitu1 = dirigeant.salaire * tauxChargesSitu1;
    const chargesSalaireSitu2 = simulation.nouveauSalaire * tauxChargesSitu2;

    // Calcul de l'impôt sur les dividendes (flat tax 30%)
    const impotDividendesSitu1 = dirigeant.dividendes * 0.30;
    const impotDividendesSitu2 = simulation.nouveauxDividendes * 0.30;

    const coutTotalSitu1 = dirigeant.salaire + chargesSalaireSitu1 + dirigeant.dividendes + impotDividendesSitu1;
    const coutTotalSitu2 = simulation.nouveauSalaire + chargesSalaireSitu2 + simulation.nouveauxDividendes + impotDividendesSitu2;

    const economie = coutTotalSitu1 - coutTotalSitu2;

    // Calcul du revenu net disponible
    const revenuNetSitu1 = dirigeant.salaire * (1 - tauxChargesSitu1 * 0.5) + dirigeant.dividendes * 0.7; // Approximation du net
    const revenuNetSitu2 = simulation.nouveauSalaire * (1 - tauxChargesSitu2 * 0.5) + simulation.nouveauxDividendes * 0.7;

    return {
      situationActuelle: {
        statut: dirigeant.statutActuel,
        salaire: dirigeant.salaire,
        charges: Math.round(chargesSalaireSitu1),
        dividendes: dirigeant.dividendes,
        impotDividendes: Math.round(impotDividendesSitu1),
        total: Math.round(coutTotalSitu1),
        revenuNet: Math.round(revenuNetSitu1),
        tauxCharges: Math.round(tauxChargesSitu1 * 100)
      },
      nouvelleSimulation: {
        statut: simulation.nouveauStatut,
        salaire: simulation.nouveauSalaire,
        charges: Math.round(chargesSalaireSitu2),
        dividendes: simulation.nouveauxDividendes,
        impotDividendes: Math.round(impotDividendesSitu2),
        total: Math.round(coutTotalSitu2),
        revenuNet: Math.round(revenuNetSitu2),
        tauxCharges: Math.round(tauxChargesSitu2 * 100)
      },
      economie: Math.round(economie),
      gainRevenuNet: Math.round(revenuNetSitu2 - revenuNetSitu1),
      anneeSimulation,
      nombrePartsFiscales,
      entreprise: {
        formeJuridique: entreprise.formeJuridique,
        chiffreAffaires: entreprise.chiffreAffaires,
        benefices: entreprise.benefices
      }
    };
  };

  const handleCalculate = () => {
    const calculatedResults = calculateOptimisation();
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
              Retour aux paramètres
            </Button>
            <div>
              <h1 style={{ margin: '0', fontSize: '24px' }}>Diagnostic statut et rémunération</h1>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <h2 style={{ margin: '0', fontSize: '18px' }}>Simulation année {results.anneeSimulation}</h2>
                <div style={{ color: '#007bff', fontWeight: 'bold' }}>
                  Conseiller: M. Vianney Recipon
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations du foyer */}
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#007bff' }}>Informations du foyer</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            <div>Situation matrimoniale: <strong>{situationMatrimoniale}</strong></div>
            <div>Nombre de parts fiscales: <strong>{results.nombrePartsFiscales}</strong></div>
            <div>Forme juridique: <strong>{results.entreprise.formeJuridique}</strong></div>
            <div>CA annuel: <strong>{results.entreprise.chiffreAffaires.toLocaleString()} €</strong></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Situation actuelle - {results.situationActuelle.statut}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Statut social:</span>
                  <span className="font-medium">{results.situationActuelle.statut}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux de charges:</span>
                  <span className="font-medium">{results.situationActuelle.tauxCharges}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Salaire brut:</span>
                  <span className="font-medium">{results.situationActuelle.salaire.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Charges sociales:</span>
                  <span className="font-medium text-red-600">-{results.situationActuelle.charges.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Dividendes bruts:</span>
                  <span className="font-medium">{results.situationActuelle.dividendes.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Impôt dividendes (30%):</span>
                  <span className="font-medium text-red-600">-{results.situationActuelle.impotDividendes.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 text-green-600">
                  <span>Revenu net disponible:</span>
                  <span>{results.situationActuelle.revenuNet.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Coût total entreprise:</span>
                  <span>{results.situationActuelle.total.toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Nouvelle simulation - {results.nouvelleSimulation.statut}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Statut social:</span>
                  <span className="font-medium">{results.nouvelleSimulation.statut}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux de charges:</span>
                  <span className="font-medium">{results.nouvelleSimulation.tauxCharges}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Salaire brut:</span>
                  <span className="font-medium">{results.nouvelleSimulation.salaire.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Charges sociales:</span>
                  <span className="font-medium text-red-600">-{results.nouvelleSimulation.charges.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Dividendes bruts:</span>
                  <span className="font-medium">{results.nouvelleSimulation.dividendes.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Impôt dividendes (30%):</span>
                  <span className="font-medium text-red-600">-{results.nouvelleSimulation.impotDividendes.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 text-green-600">
                  <span>Revenu net disponible:</span>
                  <span>{results.nouvelleSimulation.revenuNet.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Coût total entreprise:</span>
                  <span>{results.nouvelleSimulation.total.toLocaleString()} €</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Résumé des gains */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Économie pour l'entreprise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-3xl font-bold ${results.economie > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.economie > 0 ? '+' : ''}{results.economie.toLocaleString()} €
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {results.economie > 0 ? 'Économie annuelle' : 'Surcoût annuel'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Gain de revenu net
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-3xl font-bold ${results.gainRevenuNet > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {results.gainRevenuNet > 0 ? '+' : ''}{results.gainRevenuNet.toLocaleString()} €
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {results.gainRevenuNet > 0 ? 'Gain annuel pour le dirigeant' : 'Perte annuelle pour le dirigeant'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau de comparaison détaillé */}
        <Card>
          <CardHeader>
            <CardTitle>Tableau de comparaison détaillé</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Éléments</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>Situation actuelle</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>Nouvelle simulation</th>
                    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>Différence</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>Statut social</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{results.situationActuelle.statut}</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{results.nouvelleSimulation.statut}</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>-</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>Salaire brut</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{results.situationActuelle.salaire.toLocaleString()} €</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{results.nouvelleSimulation.salaire.toLocaleString()} €</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right', color: results.nouvelleSimulation.salaire - results.situationActuelle.salaire >= 0 ? '#16a34a' : '#dc2626' }}>
                      {(results.nouvelleSimulation.salaire - results.situationActuelle.salaire) >= 0 ? '+' : ''}{(results.nouvelleSimulation.salaire - results.situationActuelle.salaire).toLocaleString()} €
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>Charges sociales</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{results.situationActuelle.charges.toLocaleString()} €</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{results.nouvelleSimulation.charges.toLocaleString()} €</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right', color: results.nouvelleSimulation.charges - results.situationActuelle.charges <= 0 ? '#16a34a' : '#dc2626' }}>
                      {(results.nouvelleSimulation.charges - results.situationActuelle.charges) >= 0 ? '+' : ''}{(results.nouvelleSimulation.charges - results.situationActuelle.charges).toLocaleString()} €
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>Dividendes</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{results.situationActuelle.dividendes.toLocaleString()} €</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{results.nouvelleSimulation.dividendes.toLocaleString()} €</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right', color: results.nouvelleSimulation.dividendes - results.situationActuelle.dividendes >= 0 ? '#16a34a' : '#dc2626' }}>
                      {(results.nouvelleSimulation.dividendes - results.situationActuelle.dividendes) >= 0 ? '+' : ''}{(results.nouvelleSimulation.dividendes - results.situationActuelle.dividendes).toLocaleString()} €
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                    <td style={{ border: '1px solid #ddd', padding: '12px' }}>Revenu net dirigeant</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{results.situationActuelle.revenuNet.toLocaleString()} €</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>{results.nouvelleSimulation.revenuNet.toLocaleString()} €</td>
                    <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right', color: results.gainRevenuNet >= 0 ? '#16a34a' : '#dc2626' }}>
                      {results.gainRevenuNet >= 0 ? '+' : ''}{results.gainRevenuNet.toLocaleString()} €
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer et actions */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={() => setShowResults(false)}
          >
            Modifier les paramètres
          </Button>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                const calculatedResults = calculateOptimisation();
                setResults(calculatedResults);
              }}
              variant="outline"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Recalculer
            </Button>
            <Button
              onClick={() => window.print()}
              variant="outline"
            >
              Imprimer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#333' }}>
      {/* Header avec style amélioré */}
      <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
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
            <h1 style={{ margin: '0', fontSize: '24px' }}>Diagnostic statut et rémunération</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                Vous souhaitez définir une répartition entre rémunération et dividendes, avec ou sans changement de statut social du dirigeant d'entreprise ?
                Renseignez les éléments ci-dessous pour mettre en avant les impacts sur le budget de l'entreprise, le revenu disponible du dirigeant, ses droits à la retraite ou encore sa couverture prévoyance.
              </p>
            </div>
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#007bff' }}>
              Client: <a href="https://www.simulation.com" style={{ color: '#007bff' }}>Conseiller: M. Vianney Recipon</a>
            </div>
          </div>
        </div>
      </div>

      {/* Section simulation */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '5px' }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#007bff' }}>Simulation</h2>
        <div className="form-group">
          <InputField
            label="Année de simulation*"
            type="text"
            value={anneeSimulation}
            onChange={(e) => setAnneeSimulation(e.target.value)}
            placeholder="2025"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="situation">Votre situation</TabsTrigger>
          <TabsTrigger value="activite">Votre activité</TabsTrigger>
          <TabsTrigger value="contrats">Vos contrats</TabsTrigger>
          <TabsTrigger value="entreprise">Votre entreprise</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="situation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Votre foyer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Votre situation matrimoniale"
                  value={situationMatrimoniale}
                  onChange={setSituationMatrimoniale}
                  options={[
                    { value: "Marié(e)", label: "Marié(e)" },
                    { value: "Célibataire", label: "Célibataire" },
                    { value: "Pacsé(e)", label: "Pacsé(e)" },
                    { value: "Divorcé(e)", label: "Divorcé(e)" },
                    { value: "Veuf/Veuve", label: "Veuf/Veuve" }
                  ]}
                />
                <InputField
                  label="Nombre de parts fiscales au sein de votre foyer"
                  type="number"
                  value={nombrePartsFiscales}
                  onChange={(e) => setNombrePartsFiscales(parseInt(e.target.value) || 1)}
                  min="1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Vous êtes né(e) le"
                  type="date"
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                />

                {(situationMatrimoniale === "Marié(e)" || situationMatrimoniale === "Pacsé(e)") && (
                  <InputField
                    label="et votre conjoint le"
                    type="date"
                    value={dateNaissanceConjoint}
                    onChange={(e) => setDateNaissanceConjoint(e.target.value)}
                  />
                )}
              </div>

              <RadioGroup
                label="Avez-vous des enfants ?"
                name="enfants"
                value={aDesEnfants ? "oui" : "non"}
                onChange={(value) => setADesEnfants(value === "oui")}
                options={[
                  { value: "oui", label: "Oui" },
                  { value: "non", label: "Non" }
                ]}
              />

              <RadioGroup
                label="Disposez-vous de revenus imposables autres que ceux liés à votre activité de dirigeant ?"
                name="autresRevenus"
                value={autresRevenus ? "oui" : "non"}
                onChange={(value) => setAutresRevenus(value === "oui")}
                options={[
                  { value: "oui", label: "Oui" },
                  { value: "non", label: "Non" }
                ]}
              />

              <RadioGroup
                label="Bénéficiez-vous d'une économie d'impôt sur cette année ?"
                name="economieImpots"
                value={economieImpots ? "oui" : "non"}
                onChange={(value) => setEconomieImpots(value === "oui")}
                options={[
                  { value: "oui", label: "Oui" },
                  { value: "non", label: "Non" }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activite" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Votre activité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Quel est votre statut social actuel ?"
                  value={statutSocial}
                  onChange={setStatutSocial}
                  options={[
                    { value: "", label: "Sélectionnez" },
                    { value: "TNS", label: "Travailleur Non Salarié (TNS)" },
                    { value: "Assimilé salarié", label: "Assimilé salarié" },
                    { value: "Portage salarial", label: "Portage salarial" },
                    { value: "Auto-entrepreneur", label: "Auto-entrepreneur" }
                  ]}
                />
                <SelectField
                  label="Quelle est votre profession actuelle ?"
                  value={profession}
                  onChange={setProfession}
                  options={[
                    { value: "", label: "Sélectionnez" },
                    { value: "Gérant", label: "Gérant" },
                    { value: "Président", label: "Président" },
                    { value: "Directeur général", label: "Directeur général" },
                    { value: "Associé", label: "Associé" }
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Rémunération annuelle soumise aux charges sociales"
                  type="number"
                  value={remunerationAnnuelle}
                  onChange={(e) => setRemunerationAnnuelle(parseFloat(e.target.value) || 0)}
                  min="0"
                />
                <InputField
                  label="Dividendes annuels actuels (€)"
                  type="number"
                  value={dirigeant.dividendes}
                  onChange={(e) => setDirigeant({...dirigeant, dividendes: parseFloat(e.target.value) || 0})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contrats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Vos contrats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                label="Disposez-vous de contrats d'épargne retraite ?"
                name="epargneRetraite"
                value={epargneRetraite ? "oui" : "non"}
                onChange={(value) => setEpargneRetraite(value === "oui")}
                options={[
                  { value: "oui", label: "Oui" },
                  { value: "non", label: "Non" }
                ]}
              />

              <RadioGroup
                label="Disposez-vous de contrats de prévoyance ?"
                name="contratPrevoyance"
                value={contratPrevoyance ? "oui" : "non"}
                onChange={(value) => setContratPrevoyance(value === "oui")}
                options={[
                  { value: "oui", label: "Oui" },
                  { value: "non", label: "Non" }
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entreprise" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Votre entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div style={{ marginBottom: '20px' }}>
                <p style={{ marginBottom: '15px' }}>Vous exercez votre activité dans une</p>
                <InputField
                  label="Type d'entreprise"
                  value={entreprise.typeEntreprise}
                  onChange={(e) => setEntreprise({...entreprise, typeEntreprise: e.target.value})}
                  placeholder="Type d'entreprise"
                />
                <p style={{ margin: '15px 0' }}>soumise à l'</p>
                <InputField
                  label="Régime fiscal"
                  value={entreprise.regimeFiscal}
                  onChange={(e) => setEntreprise({...entreprise, regimeFiscal: e.target.value})}
                  placeholder="Régime fiscal"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Forme juridique"
                  value={entreprise.formeJuridique}
                  onChange={(value) => setEntreprise({...entreprise, formeJuridique: value})}
                  options={[
                    { value: "SARL", label: "SARL" },
                    { value: "SAS", label: "SAS" },
                    { value: "SA", label: "SA" },
                    { value: "EURL", label: "EURL" },
                    { value: "SNC", label: "SNC" },
                    { value: "SASU", label: "SASU" }
                  ]}
                />
                <InputField
                  label="Chiffre d'affaires annuel (€)"
                  type="number"
                  value={entreprise.chiffreAffaires}
                  onChange={(e) => setEntreprise({...entreprise, chiffreAffaires: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Bénéfices annuels (€)"
                  type="number"
                  value={entreprise.benefices}
                  onChange={(e) => setEntreprise({...entreprise, benefices: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Nombre d'effectifs"
                  type="number"
                  value={entreprise.effectifs}
                  onChange={(e) => setEntreprise({...entreprise, effectifs: parseInt(e.target.value) || 0})}
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>
                  Accéder au détail des cotisations sociales
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-600" />
                Nouvelle simulation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Nouveau statut"
                  value={simulation.nouveauStatut}
                  onChange={(value) => setSimulation({...simulation, nouveauStatut: value})}
                  options={[
                    { value: "Gérant majoritaire", label: "Gérant majoritaire" },
                    { value: "Gérant minoritaire", label: "Gérant minoritaire" },
                    { value: "Président SAS", label: "Président SAS" },
                    { value: "Directeur général", label: "Directeur général" },
                    { value: "TNS", label: "Travailleur Non Salarié" },
                    { value: "Assimilé salarié", label: "Assimilé salarié" },
                    { value: "Auto-entrepreneur", label: "Auto-entrepreneur" }
                  ]}
                />
                <InputField
                  label="Nouveau salaire brut annuel (€)"
                  type="number"
                  value={simulation.nouveauSalaire}
                  onChange={(e) => setSimulation({...simulation, nouveauSalaire: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nouveaux dividendes annuels (€)"
                  type="number"
                  value={simulation.nouveauxDividendes}
                  onChange={(e) => setSimulation({...simulation, nouveauxDividendes: parseFloat(e.target.value) || 0})}
                />
                <InputField
                  label="Autres avantages (€)"
                  type="number"
                  value={dirigeant.charges}
                  onChange={(e) => setDirigeant({...dirigeant, charges: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px', borderLeft: '4px solid #ffc107' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>💡 Conseils d'optimisation</h4>
                <ul style={{ margin: '0', paddingLeft: '20px', color: '#856404' }}>
                  <li>Considérez l'impact sur vos droits à la retraite</li>
                  <li>Prenez en compte la couverture prévoyance</li>
                  <li>Évaluez les charges sociales selon le statut</li>
                  <li>Analysez l'optimisation fiscale globale</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <Button
          onClick={() => {
            // Synchroniser les données avant le calcul
            setDirigeant({
              ...dirigeant,
              statutActuel: statutSocial || dirigeant.statutActuel,
              salaire: remunerationAnnuelle || dirigeant.salaire
            });
            handleCalculate();
          }}
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
          Calculer l'optimisation
        </Button>
      </div>
    </div>
  );
    </div>
  );
};

export default DiagnosticStatutDirigeant;