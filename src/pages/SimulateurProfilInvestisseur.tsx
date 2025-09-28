import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SimulateurProfilInvestisseur() {
  const navigate = useNavigate();

  const steps = [
    "Introduction",
    "Connaissance et Expérience",
    "Profil de risque",
    "Préférences de placement",
    "Capacité à subir des pertes",
    "Profil investisseur extra-financier",
    "Récapitulatif",
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [form, setForm] = useState(() => {
    try {
      const raw = localStorage.getItem("investor_form_v1");
      return raw ? JSON.parse(raw) : defaultForm();
    } catch (e) {
      return defaultForm();
    }
  });

  useEffect(() => {
    localStorage.setItem("investor_form_v1", JSON.stringify(form));
  }, [form]);

  function defaultForm() {
    return {
      intro: {
        realisePour: "",
        representePar: "",
        understood: false,
      },
      knowledgeProducts: {
        comptesEpargne: false,
        assuranceVie: false,
        comptesTitres: false,
        epargneRetraite: false,
        epargneSalariale: false,
        capitalInvestissement: false,
        preferNotAnswerProducts: false,
      },
      managementModes: {
        direct: false,
        conseille: false,
        sousMandat: false,
        preferNotAnswerManagement: false,
      },
      familiesKnowledge: {
        assuranceVie: null,
        peaEtTitres: null,
        epargneRetraiteEtEntreprise: null,
      },
      detailedKnowledge: {
        assuranceVie: {
          clauseBeneficiaire: null,
          typeContrat: null,
        },
        peaTitres: {
          fiscaliteVente: null,
          typesProduits: null,
        },
        epargneRetraite: {
          blocage: null,
        },
      },
      instrumentsFinanciers: {
        fondsEurosObligatairesActions: null,
        defiscalisationImmobilier: null,
        produitsLevier: null,
        fondsEuros: {
          connaissance: null,
          operations: null,
        },
        produitsMonetaires: {
          connaissance: null,
          operations: null,
        },
        produitsObligataires: {
          connaissance: null,
          operations: null,
        },
        produitsActions: {
          connaissance: null,
          operations: null,
        },
        montantTransaction: null,
        pertesSubies: null,
      },
      riskProfile: {
        placementChoice: null,
        riskTolerance: null,
        investmentPhilosophy: null,
        riskScenario: null,
        riskScenario2: null,
        insuranceHabits: null,
        timeManagement: null,
        housingInvestment: null,
        careerAdvice: null,
      },
      preferences: {
        horizon: "",
        investmentHorizon: null,
        objectivesNotSuitable: {
          preservationCapital: false,
          capitalGrowth: false,
          income: false,
          hedging: false,
          leverage: false,
          noneAllSuitable: false,
        },
        personalInfo: {
          birthDate: {
            day: "",
            month: "",
            year: "",
          },
          householdMembers: "",
          dependentsOutsideHousehold: "",
          retirementTiming: null,
        },
        financial: {
          annualIncome: null,
          monthlySavings: null,
        },
        wealth: {
          realEstateWealth: null,
          financialWealth: null,
        },
        debtAndCharges: {
          monthlyDebtPayments: null,
          monthlyFixedCharges: null,
        },
        housingSituation: {
          housingStatus: null,
          emergencyCapacity: null,
        },
        incomeOutlook: {
          futureIncomeExpectation: null,
        },
      },
      lossCapacity: {
        percentLoss: 0,
      },
      extraFinancial: {
        prefersESG: false,
        specifyDurabilityPreferences: null,
        extraFinancialApproaches: {
          environmentalActivities: false,
          environmentalSocialObjective: false,
          negativeImpacts: false,
        },
        investmentAllocation: {
          environmentalSocialPercentage: null,
        },
      },
    };
  }

  function update(path: string, value: any) {
    setForm((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let o = next;
      for (let i = 0; i < keys.length - 1; i++) {
        o = o[keys[i]] = o[keys[i]] || {};
      }
      o[keys[keys.length - 1]] = value;
      return next;
    });
  }

  function toggle(path: string) {
    const current = getValue(path);
    update(path, !current);
  }

  function getValue(path: string) {
    const keys = path.split(".");
    let o = form;
    for (let k of keys) {
      if (!o) return undefined;
      o = o[k];
    }
    return o;
  }

  // Évaluation de la capacité à subir des pertes
  const evaluateLossCapacity = () => {
    // Cette fonction évalue la capacité à subir des pertes basée sur tous les critères financiers
    // Pour l'exemple, nous retournons 'faible' comme indiqué dans la spécification
    // Dans une vraie application, cela serait calculé basé sur tous les paramètres financiers
    return 'faible';
  };

  // Évaluation de la sensibilité extra-financière
  const evaluateExtraFinancialSensitivity = () => {
    // Cette fonction évalue la sensibilité extra-financière basée sur les réponses
    // Pour l'exemple, nous retournons 'moderee' comme indiqué dans la spécification
    // Dans une vraie application, cela serait calculé basé sur les réponses aux questions ESG
    return 'moderee';
  };

  // Définition des sous-étapes pour chaque étape principale
  const getSubStepsCount = (step: number) => {
    switch (step) {
      case 1: return 4; // Connaissance et Expérience : produits, familles, instruments + résultats
      case 2: return 6; // Profil de risque : placements, scenario1, scenario2, habitudes, logement+carrière, résultats
      case 3: return 9; // Préférences de placement : objectifs, horizon, capacité pertes, revenus+épargne, patrimoine, dettes+charges, logement+urgence, perspectives revenus, résultats
      case 4: return 4; // Profil extra-financier : préférences durabilité, détails, allocation pourcentage, résultats
      default: return 1;
    }
  };

  function goNext() {
    const subStepsCount = getSubStepsCount(currentStep);
    if (currentSubStep < subStepsCount - 1) {
      setCurrentSubStep(s => s + 1);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1);
      setCurrentSubStep(0);
    }
  }

  function goPrev() {
    if (currentSubStep > 0) {
      setCurrentSubStep(s => s - 1);
    } else if (currentStep > 0) {
      setCurrentStep(s => s - 1);
      const prevStepSubSteps = getSubStepsCount(currentStep - 1);
      setCurrentSubStep(prevStepSubSteps - 1);
    }
  }

  function evaluateKnowledgeLevel() {
    let score = 0;
    let maxScore = 0;

    // Évaluation basée sur les réponses correctes
    const correctAnswers = {
      'detailedKnowledge.assuranceVie.clauseBeneficiaire': 'clause_designate',
      'detailedKnowledge.assuranceVie.typeContrat': 'av_beneficiaires',
      'detailedKnowledge.peaTitres.fiscaliteVente': 'pea_impot',
      'detailedKnowledge.peaTitres.typesProduits': 'pea_actions_euro',
      'detailedKnowledge.epargneRetraite.blocage': 'per_bloque',
      'instrumentsFinanciers.fondsEuros.connaissance': 'garantis_capital',
      'instrumentsFinanciers.produitsMonetaires.connaissance': 'tcn_bons',
      'instrumentsFinanciers.produitsObligataires.connaissance': 'performance_taux',
      'instrumentsFinanciers.produitsActions.connaissance': 'sante_financiere'
    };

    Object.entries(correctAnswers).forEach(([path, correctAnswer]) => {
      maxScore++;
      if (getValue(path) === correctAnswer) {
        score++;
      }
    });

    // Calcul du pourcentage
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

    if (percentage >= 80) return 'experienced';
    if (percentage >= 50) return 'informed';
    return 'novice';
  }

  function getKnowledgeStatus(productType: string) {
    switch (productType) {
      case 'assuranceVie':
        const avClause = getValue('detailedKnowledge.assuranceVie.clauseBeneficiaire');
        const avType = getValue('detailedKnowledge.assuranceVie.typeContrat');
        if (avClause === 'clause_designate' && avType === 'av_beneficiaires') return 'validated';
        if (avClause && avType && (avClause !== 'clause_designate' || avType !== 'av_beneficiaires')) return 'invalidated';
        return 'not_verified';

      case 'peaTitres':
        const peaFiscalite = getValue('detailedKnowledge.peaTitres.fiscaliteVente');
        const peaProduits = getValue('detailedKnowledge.peaTitres.typesProduits');
        if (peaFiscalite === 'pea_impot' && peaProduits === 'pea_actions_euro') return 'validated';
        if (peaFiscalite && peaProduits && (peaFiscalite !== 'pea_impot' || peaProduits !== 'pea_actions_euro')) return 'invalidated';
        return 'not_verified';

      case 'epargneRetraite':
        const perBlocage = getValue('detailedKnowledge.epargneRetraite.blocage');
        if (perBlocage === 'per_bloque') return 'validated';
        if (perBlocage && perBlocage !== 'per_bloque') return 'invalidated';
        return 'not_verified';

      default:
        return 'not_verified';
    }
  }

  function evaluateRiskProfile() {
    let riskScore = 0;

    // Score basé sur la philosophie d'investissement (0-4 points)
    const philosophy = getValue('riskProfile.investmentPhilosophy');
    if (philosophy === 'no_risk') riskScore += 0;
    else if (philosophy === 'small_risk') riskScore += 1;
    else if (philosophy === 'important_risk') riskScore += 3;
    else if (philosophy === 'essential_risk') riskScore += 4;

    // Score basé sur le scénario d'arbitrage (0-2 points)
    const scenario = getValue('riskProfile.riskScenario');
    if (scenario === 'conserve') riskScore += 0;
    else if (scenario === 'accepte') riskScore += 2;

    // Score basé sur l'assurance (0-1 point)
    const insurance = getValue('riskProfile.insuranceHabits');
    if (insurance === 'oui') riskScore += 0;
    else if (insurance === 'non') riskScore += 1;

    // Score basé sur la gestion du temps (0-2 points)
    const timeManagement = getValue('riskProfile.timeManagement');
    if (timeManagement === 'bien_avance') riskScore += 0;
    else if (timeManagement === 'peu_avance') riskScore += 1;
    else if (timeManagement === 'dernier_moment') riskScore += 2;

    // Score basé sur le logement (0-2 points)
    const housing = getValue('riskProfile.housingInvestment');
    if (housing === 'tout_accord') riskScore += 0;
    else if (housing === 'plutot_accord') riskScore += 1;
    else if (housing === 'pas_accord') riskScore += 2;

    // Score basé sur les conseils de carrière (0-2 points)
    const career = getValue('riskProfile.careerAdvice');
    if (career === 'dissuader') riskScore += 0;
    else if (career === 'reserves') riskScore += 1;
    else if (career === 'assurement') riskScore += 2;

    // Score basé sur la réaction aux pertes (0-3 points)
    const tolerance = getValue('riskProfile.riskTolerance');
    if (tolerance === 'very_conservative') riskScore += 0;
    else if (tolerance === 'conservative') riskScore += 1;
    else if (tolerance === 'balanced') riskScore += 2;
    else if (tolerance === 'aggressive') riskScore += 3;

    // Classification du profil (score total sur 16)
    if (riskScore <= 3) return 'securitaire';
    if (riskScore <= 6) return 'defensif';
    if (riskScore <= 10) return 'equilibre';
    if (riskScore <= 13) return 'dynamique';
    return 'offensif';
  }

  function submit() {
    console.log("Submit payload:", form);
    alert("Questionnaire soumis (voir console). Récapitulatif affiché.");
    setCurrentStep(steps.length - 1);
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-50">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-2xl border border-blue-200 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/simulateurs")} className="hover:bg-blue-100 flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Profil Investisseur Complet
            </h1>
            <p className="text-sm sm:text-base text-blue-600 mt-1">Évaluer les préférences de placement financier en matière de durabilité ou critères ESG</p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="xl:col-span-1">
            <CardHeader>
              <CardTitle>Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {steps.map((label, idx) => (
                  <li key={label} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          idx === currentStep
                            ? 'bg-blue-600 text-white'
                            : idx < currentStep
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-500 border'
                        }`}
                      >
                        {idx < currentStep ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className={`text-sm font-medium ${idx === currentStep ? 'text-blue-800' : 'text-gray-600'}`}>
                        {label}
                      </div>
                      {idx === currentStep && getSubStepsCount(idx) > 1 && (
                        <div className="mt-2 flex space-x-1">
                          {Array.from({ length: getSubStepsCount(idx) }, (_, subIdx) => (
                            <div
                              key={subIdx}
                              className={`w-2 h-2 rounded-full ${
                                subIdx === currentSubStep ? 'bg-blue-400' : subIdx < currentSubStep ? 'bg-green-400' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Main content */}
          <div className="xl:col-span-3">
            <Card>
              <CardContent className="p-6 lg:p-10">
                {currentStep === 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Introduction</h2>
                    <p className="text-gray-600 mb-6">
                      Ce questionnaire permet à chaque individu de déterminer son profil d'investisseur, pour le guider vers des solutions de
                      placement adaptées.
                    </p>

                    <div className="space-y-6 max-w-xl">
                      <div>
                        <Label htmlFor="realisePour">Réalisé pour</Label>
                        <Input
                          id="realisePour"
                          type="text"
                          value={form.intro.realisePour}
                          onChange={(e) => update('intro.realisePour', e.target.value)}
                          placeholder="Ex: nom du client"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="representePar">Représenté par</Label>
                        <Input
                          id="representePar"
                          type="text"
                          value={form.intro.representePar}
                          onChange={(e) => update('intro.representePar', e.target.value)}
                          placeholder="Ex: conseiller"
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          id="understood"
                          type="checkbox"
                          checked={form.intro.understood}
                          onChange={(e) => update('intro.understood', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="understood">Je comprends l'objectif de ce questionnaire</Label>
                      </div>

                      <div className="pt-4">
                        <Button
                          disabled={!form.intro.understood}
                          onClick={goNext}
                          className={form.intro.understood ? '' : 'opacity-50 cursor-not-allowed'}
                        >
                          Lancer le questionnaire →
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 1 && currentSubStep === 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Connaissance & expérience</h2>

                    <div className="max-w-4xl space-y-6">
                      <div>
                        <p className="text-gray-700 mb-4">Parmi les produits suivants, cochez ceux que vous détenez ou avez détenus au cours des 12 derniers mois :</p>

                        <div className="grid grid-cols-1 gap-3">
                          {[
                            ['comptesEpargne', "Des comptes et livrets d'épargne (livret A, LDDS, PEL, CEL...)"],
                            ['assuranceVie', "Un ou plusieurs contrats d'assurance-vie ou de capitalisation."],
                            ['comptesTitres', "Un ou plusieurs comptes titres (compte titres ordinaire, PEA...)"],
                            ['epargneRetraite', "Un ou plusieurs produits d'Epargne Retraite (PER, PERP, Madelin...)"],
                            ['epargneSalariale', "Un ou plusieurs produits d'Epargne Salariale (PEE, PEI)."],
                            ['capitalInvestissement', "Un ou plusieurs produits de capital investissement (FIP, FCPI...) ou des SCPI."]
                          ].map(([key, label]) => (
                            <label key={key} className="flex items-start space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={getValue(`knowledgeProducts.${key}`)}
                                onChange={() => toggle(`knowledgeProducts.${key}`)}
                                className="mt-1"
                              />
                              <span className="text-sm text-gray-700">{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-700 mb-4">A quels modes de gestion avez-vous eu recours ?</p>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            ['direct','Gestion directe, vous vous occupez vous-même de votre gestion.'],
                            ['conseille','Gestion conseillée, vous êtes conseillé par votre conseiller financier.'],
                            ['sousMandat','Gestion sous mandat, votre gestion est déléguée à un organisme.']
                          ].map(([key, label]) => (
                            <label key={key} className="flex items-start space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={getValue(`managementModes.${key}`)}
                                onChange={() => toggle(`managementModes.${key}`)}
                                className="mt-1"
                              />
                              <span className="text-sm text-gray-700">{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button onClick={goNext}>Suivant</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 1 && currentSubStep === 1 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Connaissance & expérience</h2>
                    <h3 className="text-lg font-medium mb-4">Connaissez-vous les familles de produits suivantes ?</h3>
                    <p className="text-gray-600 mb-6">Si oui, sélectionnez les affirmations avec lesquelles vous êtes d'accord.</p>

                    <div className="max-w-4xl space-y-8">
                      {/* Assurance-vie et capitalisation */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Assurance-vie et capitalisation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                            <div className="text-sm font-medium">Connaissez-vous cette famille de produits ?</div>
                            <div className="flex space-x-2">
                              <Button
                                variant={getValue('familiesKnowledge.assuranceVie') === true ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('familiesKnowledge.assuranceVie', true)}
                              >
                                Oui
                              </Button>
                              <Button
                                variant={getValue('familiesKnowledge.assuranceVie') === false ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('familiesKnowledge.assuranceVie', false)}
                              >
                                Non
                              </Button>
                            </div>
                          </div>

                          {getValue('familiesKnowledge.assuranceVie') === true && (
                            <div className="space-y-6 ml-4 border-l-2 border-blue-200 pl-6">
                              <div>
                                <p className="font-medium mb-3">Affirmeriez-vous plutôt :</p>
                                <div className="space-y-2">
                                  {[
                                    ['clause_designate', 'La clause bénéficiaire permet de désigner les bénéficiaires en cas de décès du souscripteur.'],
                                    ['clause_rachat', 'La clause bénéficiaire permet de définir les bénéficiaires en cas de rachat du contrat.'],
                                    ['clause_conditions', 'La clause bénéficiaire permet de définir les conditions que doivent remplir mes héritiers pour pouvoir percevoir le capital investi.'],
                                    ['clause_unknown', 'Je ne sais pas.']
                                  ].map(([value, label]) => (
                                    <label key={value} className="flex items-start space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="clauseBeneficiaire"
                                        value={value}
                                        checked={getValue('detailedKnowledge.assuranceVie.clauseBeneficiaire') === value}
                                        onChange={() => update('detailedKnowledge.assuranceVie.clauseBeneficiaire', value)}
                                        className="mt-1"
                                      />
                                      <span className="text-sm text-gray-700">{label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="font-medium mb-3">Affirmeriez-vous plutôt :</p>
                                <div className="space-y-2">
                                  {[
                                    ['cap_beneficiaires', 'Sur un contrat de capitalisation je désigne des bénéficiaires.'],
                                    ['av_beneficiaires', 'Sur un contrat d\'assurance vie je désigne des bénéficiaires.'],
                                    ['liste_restreinte', 'La liste des bénéficiaires d\'un contrat de capitalisation ou d\'un contrat d\'assurance-vie est restreinte à la liste des héritiers de l\'assuré.'],
                                    ['type_unknown', 'Je ne sais pas.']
                                  ].map(([value, label]) => (
                                    <label key={value} className="flex items-start space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="typeContrat"
                                        value={value}
                                        checked={getValue('detailedKnowledge.assuranceVie.typeContrat') === value}
                                        onChange={() => update('detailedKnowledge.assuranceVie.typeContrat', value)}
                                        className="mt-1"
                                      />
                                      <span className="text-sm text-gray-700">{label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* PEA et comptes-titres */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">PEA et comptes-titres</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                            <div className="text-sm font-medium">Connaissez-vous cette famille de produits ?</div>
                            <div className="flex space-x-2">
                              <Button
                                variant={getValue('familiesKnowledge.peaEtTitres') === true ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('familiesKnowledge.peaEtTitres', true)}
                              >
                                Oui
                              </Button>
                              <Button
                                variant={getValue('familiesKnowledge.peaEtTitres') === false ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('familiesKnowledge.peaEtTitres', false)}
                              >
                                Non
                              </Button>
                            </div>
                          </div>

                          {getValue('familiesKnowledge.peaEtTitres') === true && (
                            <div className="space-y-6 ml-4 border-l-2 border-green-200 pl-6">
                              <div>
                                <p className="font-medium mb-3">Affirmeriez-vous plutôt :</p>
                                <div className="space-y-2">
                                  {[
                                    ['compte_titres_impot', 'Sur le compte titre, si je vends une action pour en acheter une autre, je ne paye pas d\'impôt.'],
                                    ['pea_impot', 'Sur le PEA, si je vends une action pour en acheter une autre, je ne paye pas d\'impôt.'],
                                    ['pea_5ans', 'Après 5 ans, les dividendes et plus-values dégagées par le PEA sont exonérés d\'impôt et des prélèvements sociaux contrairement au compte titre.'],
                                    ['fiscalite_unknown', 'Je ne sais pas.']
                                  ].map(([value, label]) => (
                                    <label key={value} className="flex items-start space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="fiscaliteVente"
                                        value={value}
                                        checked={getValue('detailedKnowledge.peaTitres.fiscaliteVente') === value}
                                        onChange={() => update('detailedKnowledge.peaTitres.fiscaliteVente', value)}
                                        className="mt-1"
                                      />
                                      <span className="text-sm text-gray-700">{label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="font-medium mb-3">Affirmeriez-vous plutôt :</p>
                                <div className="space-y-2">
                                  {[
                                    ['pea_diversifie', 'Sur le PEA, je peux acheter des actions, obligations, immeubles...'],
                                    ['compte_titres_75', 'Le compte-titres doit être investi à 75 % au moins en actions d\'entreprises cotées en dehors de l\'Union européenne.'],
                                    ['pea_actions_euro', 'Sur le PEA, je peux acheter des actions européennes.'],
                                    ['produits_unknown', 'Je ne sais pas.']
                                  ].map(([value, label]) => (
                                    <label key={value} className="flex items-start space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="typesProduits"
                                        value={value}
                                        checked={getValue('detailedKnowledge.peaTitres.typesProduits') === value}
                                        onChange={() => update('detailedKnowledge.peaTitres.typesProduits', value)}
                                        className="mt-1"
                                      />
                                      <span className="text-sm text-gray-700">{label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Épargne retraite et entreprise */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Épargne retraite et entreprise</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                            <div className="text-sm font-medium">Connaissez-vous cette famille de produits ?</div>
                            <div className="flex space-x-2">
                              <Button
                                variant={getValue('familiesKnowledge.epargneRetraiteEtEntreprise') === true ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('familiesKnowledge.epargneRetraiteEtEntreprise', true)}
                              >
                                Oui
                              </Button>
                              <Button
                                variant={getValue('familiesKnowledge.epargneRetraiteEtEntreprise') === false ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('familiesKnowledge.epargneRetraiteEtEntreprise', false)}
                              >
                                Non
                              </Button>
                            </div>
                          </div>

                          {getValue('familiesKnowledge.epargneRetraiteEtEntreprise') === true && (
                            <div className="space-y-6 ml-4 border-l-2 border-purple-200 pl-6">
                              <div>
                                <p className="font-medium mb-3">Affirmeriez-vous plutôt :</p>
                                <div className="space-y-2">
                                  {[
                                    ['per_bloque', 'Le Plan d\'Épargne Retraite est un placement dont les sommes investies sont normalement bloquées jusqu\'au départ à la retraite.'],
                                    ['per_libre', 'Le Plan d\'Épargne Retraite est un placement dont les sommes versées peuvent être retirées à tout moment.'],
                                    ['per_sans_fiscalite', 'Le Plan d\'Épargne Retraite permet de recevoir un capital ou des revenus sans aucune fiscalité au départ en retraite.'],
                                    ['per_unknown', 'Je ne sais pas.']
                                  ].map(([value, label]) => (
                                    <label key={value} className="flex items-start space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="blocage"
                                        value={value}
                                        checked={getValue('detailedKnowledge.epargneRetraite.blocage') === value}
                                        onChange={() => update('detailedKnowledge.epargneRetraite.blocage', value)}
                                        className="mt-1"
                                      />
                                      <span className="text-sm text-gray-700">{label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button onClick={goNext}>Suivant</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 1 && currentSubStep === 2 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Connaissance & expérience</h2>
                    <h3 className="text-lg font-medium mb-4">Connaissez-vous ou avez-vous réalisé des opérations au cours des 12 derniers mois sur les instruments financiers suivants ?</h3>
                    <p className="text-gray-600 mb-6">Si oui, cochez ceux dont vous connaissez le fonctionnement.</p>

                    <div className="max-w-4xl space-y-8">
                      {/* Fonds euros, produits monétaires, obligataires et actions */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Fonds euros, produits monétaires, obligataires et actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                            <div className="text-sm font-medium">Connaissez-vous cette famille de produits ?</div>
                            <div className="flex space-x-2">
                              <Button
                                variant={getValue('instrumentsFinanciers.fondsEurosObligatairesActions') === true ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('instrumentsFinanciers.fondsEurosObligatairesActions', true)}
                              >
                                Oui
                              </Button>
                              <Button
                                variant={getValue('instrumentsFinanciers.fondsEurosObligatairesActions') === false ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('instrumentsFinanciers.fondsEurosObligatairesActions', false)}
                              >
                                Non
                              </Button>
                            </div>
                          </div>

                          {getValue('instrumentsFinanciers.fondsEurosObligatairesActions') === true && (
                            <div className="space-y-8 ml-4 border-l-2 border-blue-200 pl-6">
                              {/* Fonds euros */}
                              <div className="bg-blue-50 p-6 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-4">Fonds euros</h4>
                                <div className="space-y-4">
                                  <div>
                                    <p className="font-medium mb-3">Affirmeriez-vous plutôt :</p>
                                    <div className="space-y-2">
                                      {[
                                        ['baisse_marches', 'En cas de baisse des marchés financiers, votre investissement en fonds euros va subir la même évolution.'],
                                        ['garantis_capital', 'Les fonds en euros sont composés essentiellement d\'investissements obligataires garantis par la compagnie vous assurant de ne pas perdre votre capital.'],
                                        ['rendement_long_terme', 'A long terme, les rendements des fonds euros sont plus élevés que ceux des unités de compte.'],
                                        ['fonds_unknown', 'Je ne sais pas.']
                                      ].map(([value, label]) => (
                                        <label key={value} className="flex items-start space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                          <input
                                            type="radio"
                                            name="fondsEurosConnaissance"
                                            value={value}
                                            checked={getValue('instrumentsFinanciers.fondsEuros.connaissance') === value}
                                            onChange={() => update('instrumentsFinanciers.fondsEuros.connaissance', value)}
                                            className="mt-1"
                                          />
                                          <span className="text-sm text-gray-700">{label}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-medium mb-3">Opérations réalisées au cours des 12 derniers mois :</p>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        ['aucune', 'Aucune'],
                                        ['1_5', 'De 1 à 5'],
                                        ['plus_5', 'Plus de 5']
                                      ].map(([value, label]) => (
                                        <Button
                                          key={value}
                                          variant={getValue('instrumentsFinanciers.fondsEuros.operations') === value ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => update('instrumentsFinanciers.fondsEuros.operations', value)}
                                        >
                                          {label}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Produits monétaires */}
                              <div className="bg-green-50 p-6 rounded-lg">
                                <h4 className="font-semibold text-green-800 mb-4">Produits monétaires</h4>
                                <p className="text-sm text-green-600 mb-4">(Fonds monétaires, OPC monétaires)</p>
                                <div className="space-y-4">
                                  <div>
                                    <p className="font-medium mb-3">Affirmeriez-vous plutôt :</p>
                                    <div className="space-y-2">
                                      {[
                                        ['tcn_bons', 'Les fonds monétaires sont composés principalement de titres de créances négociables (TCN), de bons du trésor, ainsi que d\'obligations à court terme.'],
                                        ['long_terme', 'L\'investissement sur des OPC monétaires est parfaitement adapté pour un investissement de long terme.'],
                                        ['capital_garanti', 'En investissant sur des fonds monétaires, le capital est garanti.'],
                                        ['monetaire_unknown', 'Je ne sais pas.']
                                      ].map(([value, label]) => (
                                        <label key={value} className="flex items-start space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                          <input
                                            type="radio"
                                            name="monetaireConnaissance"
                                            value={value}
                                            checked={getValue('instrumentsFinanciers.produitsMonetaires.connaissance') === value}
                                            onChange={() => update('instrumentsFinanciers.produitsMonetaires.connaissance', value)}
                                            className="mt-1"
                                          />
                                          <span className="text-sm text-gray-700">{label}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-medium mb-3">Opérations réalisées au cours des 12 derniers mois :</p>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        ['aucune', 'Aucune'],
                                        ['1_5', 'De 1 à 5'],
                                        ['plus_5', 'Plus de 5']
                                      ].map(([value, label]) => (
                                        <Button
                                          key={value}
                                          variant={getValue('instrumentsFinanciers.produitsMonetaires.operations') === value ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => update('instrumentsFinanciers.produitsMonetaires.operations', value)}
                                        >
                                          {label}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Produits obligataires */}
                              <div className="bg-orange-50 p-6 rounded-lg">
                                <h4 className="font-semibold text-orange-800 mb-4">Produits obligataires</h4>
                                <p className="text-sm text-orange-600 mb-4">(Obligations, fonds obligataires, OPC obligataires, titres de créance… à l'exception de ceux qui comportent un instrument dérivé)</p>
                                <div className="space-y-4">
                                  <div>
                                    <p className="font-medium mb-3">Affirmeriez-vous plutôt :</p>
                                    <div className="space-y-2">
                                      {[
                                        ['defaut_inexistant', 'Les obligations sont des dettes d\'Etat ou d\'entreprise pour lesquelles le défaut de remboursement des organismes emprunteurs est inexistant.'],
                                        ['taux_eleve_risque_faible', 'Pour une obligation, un taux d\'intérêt élevé indique un risque faible.'],
                                        ['performance_taux', 'La performance d\'un fonds obligataire varie avec les évolutions des taux d\'intérêt.'],
                                        ['obligataire_unknown', 'Je ne sais pas.']
                                      ].map(([value, label]) => (
                                        <label key={value} className="flex items-start space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                          <input
                                            type="radio"
                                            name="obligataireConnaissance"
                                            value={value}
                                            checked={getValue('instrumentsFinanciers.produitsObligataires.connaissance') === value}
                                            onChange={() => update('instrumentsFinanciers.produitsObligataires.connaissance', value)}
                                            className="mt-1"
                                          />
                                          <span className="text-sm text-gray-700">{label}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-medium mb-3">Opérations réalisées au cours des 12 derniers mois :</p>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        ['aucune', 'Aucune'],
                                        ['1_5', 'De 1 à 5'],
                                        ['plus_5', 'Plus de 5']
                                      ].map(([value, label]) => (
                                        <Button
                                          key={value}
                                          variant={getValue('instrumentsFinanciers.produitsObligataires.operations') === value ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => update('instrumentsFinanciers.produitsObligataires.operations', value)}
                                        >
                                          {label}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Produits actions */}
                              <div className="bg-purple-50 p-6 rounded-lg">
                                <h4 className="font-semibold text-purple-800 mb-4">Produits actions</h4>
                                <p className="text-sm text-purple-600 mb-4">(Actions, fonds en actions, OPC actions... admis à la négociation sur un marché règlementé à l'exception de ceux qui comportent un instrument dérivé)</p>
                                <div className="space-y-4">
                                  <div>
                                    <p className="font-medium mb-3">Affirmeriez-vous plutôt :</p>
                                    <div className="space-y-2">
                                      {[
                                        ['court_terme', 'Les actions répondent à un investissement à court terme.'],
                                        ['sante_financiere', 'Les variations du cours de l\'action dépendent de la santé financière de l\'entreprise et de son environnement économique.'],
                                        ['dividendes_obligatoires', 'Avec des actions, l\'investisseur bénéficie de revenus réguliers car les entreprises ont l\'obligation de verser des dividendes aux actionnaires.'],
                                        ['actions_unknown', 'Je ne sais pas.']
                                      ].map(([value, label]) => (
                                        <label key={value} className="flex items-start space-x-3 p-3 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                          <input
                                            type="radio"
                                            name="actionsConnaissance"
                                            value={value}
                                            checked={getValue('instrumentsFinanciers.produitsActions.connaissance') === value}
                                            onChange={() => update('instrumentsFinanciers.produitsActions.connaissance', value)}
                                            className="mt-1"
                                          />
                                          <span className="text-sm text-gray-700">{label}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-medium mb-3">Opérations réalisées au cours des 12 derniers mois :</p>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        ['aucune', 'Aucune'],
                                        ['1_5', 'De 1 à 5'],
                                        ['plus_5', 'Plus de 5']
                                      ].map(([value, label]) => (
                                        <Button
                                          key={value}
                                          variant={getValue('instrumentsFinanciers.produitsActions.operations') === value ? "default" : "outline"}
                                          size="sm"
                                          onClick={() => update('instrumentsFinanciers.produitsActions.operations', value)}
                                        >
                                          {label}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Défiscalisation, immobilier et produits structurés */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Défiscalisation, immobilier et produits structurés</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                            <div className="text-sm font-medium">Connaissez-vous cette famille de produits ?</div>
                            <div className="flex space-x-2">
                              <Button
                                variant={getValue('instrumentsFinanciers.defiscalisationImmobilier') === true ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('instrumentsFinanciers.defiscalisationImmobilier', true)}
                              >
                                Oui
                              </Button>
                              <Button
                                variant={getValue('instrumentsFinanciers.defiscalisationImmobilier') === false ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('instrumentsFinanciers.defiscalisationImmobilier', false)}
                              >
                                Non
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Produits à effet de levier et produits boursiers */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Produits à effet de levier et produits boursiers</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                            <div className="text-sm font-medium">Connaissez-vous cette famille de produits ?</div>
                            <div className="flex space-x-2">
                              <Button
                                variant={getValue('instrumentsFinanciers.produitsLevier') === true ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('instrumentsFinanciers.produitsLevier', true)}
                              >
                                Oui
                              </Button>
                              <Button
                                variant={getValue('instrumentsFinanciers.produitsLevier') === false ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('instrumentsFinanciers.produitsLevier', false)}
                              >
                                Non
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Questions complémentaires */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Expérience transactionnelle</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <p className="font-medium mb-4">Quel montant de transaction (versement, arbitrage, retrait) avez-vous effectué sur ces 12 derniers mois ?</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[
                                ['aucun', 'Aucun'],
                                ['inferieur_3000', 'Inférieur ou égal à 3 000 euros'],
                                ['entre_3000_10000', 'Entre 3 000 et 10 000 euros'],
                                ['superieur_10000', 'Supérieur à 10 000 euros']
                              ].map(([value, label]) => (
                                <Button
                                  key={value}
                                  variant={getValue('instrumentsFinanciers.montantTransaction') === value ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => update('instrumentsFinanciers.montantTransaction', value)}
                                  className="justify-start"
                                >
                                  {label}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium mb-4">Avez-vous déjà subi des pertes sur vos placements financiers ?</p>
                            <div className="flex space-x-3">
                              <Button
                                variant={getValue('instrumentsFinanciers.pertesSubies') === true ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('instrumentsFinanciers.pertesSubies', true)}
                              >
                                Oui
                              </Button>
                              <Button
                                variant={getValue('instrumentsFinanciers.pertesSubies') === false ? "default" : "outline"}
                                size="sm"
                                onClick={() => update('instrumentsFinanciers.pertesSubies', false)}
                              >
                                Non
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button onClick={goNext}>Étape suivante</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 1 && currentSubStep === 3 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Résultats</h2>
                    <h3 className="text-lg font-medium mb-6">Connaissance et expérience des marchés financiers</h3>

                    <div className="max-w-4xl space-y-8">
                      {/* Niveau de connaissance global */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-center space-x-6 mb-6">
                            {['novice', 'informed', 'experienced'].map((level) => {
                              const isActive = evaluateKnowledgeLevel() === level;
                              const labels = {
                                novice: 'Novice',
                                informed: 'Informé',
                                experienced: 'Expérimenté'
                              };
                              return (
                                <div
                                  key={level}
                                  className={`px-6 py-3 rounded-lg border-2 font-semibold ${
                                    isActive
                                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                                      : 'border-gray-200 bg-gray-50 text-gray-500'
                                  }`}
                                >
                                  {labels[level as keyof typeof labels]}
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                            <p className="text-blue-800">
                              <strong>Votre profil est {evaluateKnowledgeLevel() === 'informed' ? 'informé' : evaluateKnowledgeLevel() === 'experienced' ? 'expérimenté' : 'novice'}.</strong>{' '}
                              {evaluateKnowledgeLevel() === 'informed' &&
                                'Vous êtes plutôt à l\'aise avec les produits les plus simples et connaissez certains produits financiers plus complexes sans toutefois en maîtriser précisément tous leurs mécanismes.'
                              }
                              {evaluateKnowledgeLevel() === 'experienced' &&
                                'Vous maîtrisez bien les mécanismes des produits financiers et êtes à l\'aise avec les investissements complexes.'
                              }
                              {evaluateKnowledgeLevel() === 'novice' &&
                                'Vous découvrez les produits financiers et devriez privilégier les placements simples et sécurisés.'
                              }
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Connaissance selon le type de produit */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Connaissance selon le type de produit</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Connaissance validée */}
                          {[
                            { key: 'assuranceVie', label: 'Assurance-vie et capitalisation' },
                            { key: 'peaTitres', label: 'PEA et comptes-titres' },
                            { key: 'epargneRetraite', label: 'Épargne retraite et entreprise' }
                          ].filter(product => getKnowledgeStatus(product.key) === 'validated').length > 0 && (
                            <div>
                              <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                Connaissance validée avec le questionnaire
                              </h4>
                              <div className="space-y-2 ml-5">
                                {[
                                  { key: 'assuranceVie', label: 'Assurance-vie et capitalisation' },
                                  { key: 'peaTitres', label: 'PEA et comptes-titres' },
                                  { key: 'epargneRetraite', label: 'Épargne retraite et entreprise' }
                                ].filter(product => getKnowledgeStatus(product.key) === 'validated').map(product => (
                                  <div key={product.key} className="text-green-600">• {product.label}</div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Connaissance invalidée */}
                          {[
                            { key: 'assuranceVie', label: 'Assurance-vie et capitalisation' },
                            { key: 'peaTitres', label: 'PEA et comptes-titres' },
                            { key: 'epargneRetraite', label: 'Épargne retraite et entreprise' }
                          ].filter(product => getKnowledgeStatus(product.key) === 'invalidated').length > 0 && (
                            <div>
                              <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                Connaissance invalidée avec le questionnaire
                              </h4>
                              <div className="space-y-2 ml-5">
                                {[
                                  { key: 'assuranceVie', label: 'Assurance-vie et capitalisation' },
                                  { key: 'peaTitres', label: 'PEA et comptes-titres' },
                                  { key: 'epargneRetraite', label: 'Épargne retraite et entreprise' }
                                ].filter(product => getKnowledgeStatus(product.key) === 'invalidated').map(product => (
                                  <div key={product.key} className="text-red-600">• {product.label}</div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Connaissance non vérifiée */}
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                              Connaissance non vérifiée avec le questionnaire
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-5">
                              {[
                                'Fonds euros',
                                'Produits monétaires',
                                'Produits obligataires',
                                'Produits actions',
                                'SCPI',
                                'OPCI',
                                'Capital investissement ou Private equity',
                                'Produits structurés',
                                'SOFICA',
                                'Produits obligataires complexes',
                                'Produits actions complexes',
                                'Tracker',
                                'CFD (contrats sur la différence)',
                                'Futures',
                                'Options',
                                'Warrants',
                                'Turbos',
                                'Certificats à gestion active (AMC)',
                                'Cryptomonnaies'
                              ].map(product => (
                                <div key={product} className="text-gray-600 text-sm">• {product}</div>
                              ))}
                            </div>
                          </div>

                          {/* Ajout des produits validés/invalidés dans non vérifiée selon les réponses aux instruments financiers */}
                          {[
                            { key: 'assuranceVie', label: 'Assurance-vie et capitalisation' },
                            { key: 'peaTitres', label: 'PEA et comptes-titres' },
                            { key: 'epargneRetraite', label: 'Épargne retraite et entreprise' }
                          ].filter(product => getKnowledgeStatus(product.key) === 'not_verified').length > 0 && (
                            <div className="ml-5">
                              {[
                                { key: 'assuranceVie', label: 'Assurance-vie et capitalisation' },
                                { key: 'peaTitres', label: 'PEA et comptes-titres' },
                                { key: 'epargneRetraite', label: 'Épargne retraite et entreprise' }
                              ].filter(product => getKnowledgeStatus(product.key) === 'not_verified').map(product => (
                                <div key={product.key} className="text-gray-600 text-sm">• {product.label}</div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="flex items-center justify-between pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button variant="outline">Modifier la connaissance et expérience</Button>
                        <Button onClick={goNext}>Étape suivante</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 2 && currentSubStep === 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Profil investisseur</h2>
                    <h3 className="text-lg font-medium mb-4">Profil de risque</h3>
                    <p className="text-gray-600 mb-6">
                      Le graphique ci-dessous présente 3 placements. Pour chacun d'eux, sont représentées les estimations de rendement annuel (en %) sur une période de 8 ans, de la plus pessimiste à la plus optimiste.
                    </p>

                    <div className="max-w-4xl space-y-8">
                      {/* En-têtes des hypothèses */}
                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div></div>
                        <div className="text-center font-semibold text-red-600 bg-red-50 p-3 rounded">
                          Hypothèse pessimiste
                        </div>
                        <div className="text-center font-semibold text-yellow-600 bg-yellow-50 p-3 rounded">
                          Hypothèse moyenne
                        </div>
                        <div className="text-center font-semibold text-green-600 bg-green-50 p-3 rounded">
                          Hypothèse optimale
                        </div>
                      </div>

                      {/* Placement A */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-4 gap-4 items-center">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  name="placementChoice"
                                  value="placement_a"
                                  checked={getValue('riskProfile.placementChoice') === 'placement_a'}
                                  onChange={() => update('riskProfile.placementChoice', 'placement_a')}
                                  className="w-5 h-5"
                                />
                                <div>
                                  <h4 className="font-bold text-lg text-blue-700">Placement A</h4>
                                  <p className="text-sm text-gray-600 mt-2">
                                    Vous souhaitez limiter au maximum le risque de vos investissements, quitte à en limiter la performance.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-red-100 p-4 rounded-lg">
                                <span className="text-2xl font-bold text-red-700">1,5%</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-yellow-100 p-4 rounded-lg">
                                <span className="text-2xl font-bold text-yellow-700">2,5%</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-green-100 p-4 rounded-lg">
                                <span className="text-2xl font-bold text-green-700">3,5%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Placement B */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-4 gap-4 items-center">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  name="placementChoice"
                                  value="placement_b"
                                  checked={getValue('riskProfile.placementChoice') === 'placement_b'}
                                  onChange={() => update('riskProfile.placementChoice', 'placement_b')}
                                  className="w-5 h-5"
                                />
                                <div>
                                  <h4 className="font-bold text-lg text-orange-700">Placement B</h4>
                                  <p className="text-sm text-gray-600 mt-2">
                                    Vous acceptez un risque modéré afin de dynamiser la performance de vos placements.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-red-100 p-4 rounded-lg">
                                <span className="text-2xl font-bold text-red-700">-1%</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-yellow-100 p-4 rounded-lg">
                                <span className="text-2xl font-bold text-yellow-700">4%</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-green-100 p-4 rounded-lg">
                                <span className="text-2xl font-bold text-green-700">9%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Placement C */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-4 gap-4 items-center">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <input
                                  type="radio"
                                  name="placementChoice"
                                  value="placement_c"
                                  checked={getValue('riskProfile.placementChoice') === 'placement_c'}
                                  onChange={() => update('riskProfile.placementChoice', 'placement_c')}
                                  className="w-5 h-5"
                                />
                                <div>
                                  <h4 className="font-bold text-lg text-red-700">Placement C</h4>
                                  <p className="text-sm text-gray-600 mt-2">
                                    Vous recherchez une très bonne performance, et acceptez de voir votre capital fluctuer à la baisse durant la durée de votre placement.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-red-100 p-4 rounded-lg">
                                <span className="text-2xl font-bold text-red-700">-5%</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-yellow-100 p-4 rounded-lg">
                                <span className="text-2xl font-bold text-yellow-700">6%</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="bg-green-100 p-4 rounded-lg">
                                <span className="text-2xl font-bold text-green-700">15%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={!getValue('riskProfile.placementChoice')}
                          className={!getValue('riskProfile.placementChoice') ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 2 && currentSubStep === 1 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Profil investisseur</h2>
                    <h3 className="text-lg font-medium mb-6">Profil de risque</h3>

                    <div className="max-w-3xl space-y-8">
                      {/* Question scénario de risque */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="space-y-6">
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                              <p className="text-blue-800 mb-4 text-lg">
                                <strong>Imaginez que l'ensemble de vos économies soit investi dans un placement sans risque qui vous rapporte un revenu certain de 20 000 € par an.</strong>
                              </p>
                              <p className="text-blue-700 mb-4">
                                On vous propose de réallouer votre capital pour l'investir sur des supports risqués qui ont :
                              </p>
                              <ul className="text-blue-700 space-y-3 ml-6">
                                <li className="flex items-start">
                                  <span className="font-bold mr-2">•</span>
                                  <span><strong>une chance sur deux (50 %)</strong> de vous procurer un revenu annuel double <strong>(40 000 €)</strong>;</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="font-bold mr-2">•</span>
                                  <span><strong>et une chance sur deux</strong> de vous procurer un revenu diminué d'un tiers <strong>(13 333 €)</strong>.</span>
                                </li>
                              </ul>
                            </div>

                            <div className="space-y-4">
                              {[
                                ['conserve', 'Je conserve le placement actuel'],
                                ['accepte', 'J\'accepte le nouveau placement']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="riskScenario"
                                    value={value}
                                    checked={getValue('riskProfile.riskScenario') === value}
                                    onChange={() => update('riskProfile.riskScenario', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800 text-lg">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={!getValue('riskProfile.riskScenario')}
                          className={!getValue('riskProfile.riskScenario') ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 2 && currentSubStep === 2 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Profil de risque</h2>

                    <div className="max-w-3xl space-y-8">
                      {/* Deuxième question scénario de risque */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="space-y-6">
                            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                              <p className="text-orange-800 mb-4 text-lg">
                                <strong>Le placement que vous envisagiez n'est plus disponible.</strong>
                              </p>
                              <p className="text-orange-700 mb-4">
                                On vous propose de réallouer votre capital pour l'investir sur d'autres supports qui ont :
                              </p>
                              <ul className="text-orange-700 space-y-3 ml-6">
                                <li className="flex items-start">
                                  <span className="font-bold mr-2">•</span>
                                  <span><strong>une chance sur deux (50 %)</strong> de vous procurer un revenu annuel double <strong>(40 000 €)</strong>;</span>
                                </li>
                                <li className="flex items-start">
                                  <span className="font-bold mr-2">•</span>
                                  <span><strong>et une chance sur deux</strong> de vous procurer un revenu diminué de moitié <strong>(10 000 €)</strong>.</span>
                                </li>
                              </ul>
                            </div>

                            <div className="space-y-4">
                              {[
                                ['conserve', 'Je conserve le placement actuel'],
                                ['accepte', 'J\'accepte le nouveau placement']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="riskScenario2"
                                    value={value}
                                    checked={getValue('riskProfile.riskScenario2') === value}
                                    onChange={() => update('riskProfile.riskScenario2', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800 text-lg">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={!getValue('riskProfile.riskScenario2')}
                          className={!getValue('riskProfile.riskScenario2') ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 2 && currentSubStep === 3 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Profil de risque</h2>

                    <div className="max-w-3xl space-y-8">
                      {/* Questions sur les habitudes de risque */}
                      <Card>
                        <CardContent className="p-6 space-y-8">
                          <div>
                            <p className="font-medium mb-6 text-lg">Êtes-vous assuré au-delà du minimum obligatoire, contre les risques concernant par exemple, le logement, la voiture, le vol, la responsabilité civile... ?</p>
                            <div className="space-y-4">
                              {[
                                ['oui', 'Oui'],
                                ['non', 'Non']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="insuranceHabits"
                                    value={value}
                                    checked={getValue('riskProfile.insuranceHabits') === value}
                                    onChange={() => update('riskProfile.insuranceHabits', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800 text-lg">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium mb-6 text-lg">Quand vous prenez le train ou l'avion, vous préférez arriver sur le lieu de départ :</p>
                            <div className="space-y-4">
                              {[
                                ['bien_avance', 'Bien à l\'avance'],
                                ['peu_avance', 'Un peu à l\'avance'],
                                ['dernier_moment', 'Au dernier moment']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="timeManagement"
                                    value={value}
                                    checked={getValue('riskProfile.timeManagement') === value}
                                    onChange={() => update('riskProfile.timeManagement', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800 text-lg">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={!getValue('riskProfile.insuranceHabits') || !getValue('riskProfile.timeManagement')}
                          className={(!getValue('riskProfile.insuranceHabits') || !getValue('riskProfile.timeManagement')) ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 2 && currentSubStep === 4 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Profil de risque</h2>

                    <div className="max-w-3xl space-y-8">
                      <Card>
                        <CardContent className="p-6 space-y-8">
                          <div>
                            <p className="font-medium mb-6 text-lg">En matière de logement êtes-vous d'accord avec l'affirmation suivante : L'un des premiers investissements à réaliser est de devenir propriétaire afin de s'assurer un toit au-dessus de la tête ?</p>
                            <div className="space-y-4">
                              {[
                                ['tout_accord', 'Tout à fait d\'accord'],
                                ['plutot_accord', 'Plutôt d\'accord'],
                                ['pas_accord', 'Pas du tout d\'accord']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="housingInvestment"
                                    value={value}
                                    checked={getValue('riskProfile.housingInvestment') === value}
                                    onChange={() => update('riskProfile.housingInvestment', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800 text-lg">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium mb-6 text-lg">Un de vos proches vous fait part de son intention d'abandonner sa situation actuelle pour une carrière risquée. Le poussez-vous dans cette voie ?</p>
                            <div className="space-y-4">
                              {[
                                ['dissuader', 'Non, j\'essaye de l\'en dissuader'],
                                ['reserves', 'Oui, mais en émettant des réserves ou des conseils de prudence'],
                                ['assurement', 'Oui, assurément']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="careerAdvice"
                                    value={value}
                                    checked={getValue('riskProfile.careerAdvice') === value}
                                    onChange={() => update('riskProfile.careerAdvice', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800 text-lg">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={!getValue('riskProfile.housingInvestment') || !getValue('riskProfile.careerAdvice')}
                          className={(!getValue('riskProfile.housingInvestment') || !getValue('riskProfile.careerAdvice')) ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 2 && currentSubStep === 5 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Résultats</h2>
                    <h3 className="text-lg font-medium mb-6">Profil de risque</h3>

                    <div className="max-w-4xl space-y-8">
                      {/* Profils de risque */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-center space-x-4 mb-6 flex-wrap gap-y-4">
                            {['securitaire', 'defensif', 'equilibre', 'dynamique', 'offensif'].map((profile) => {
                              const isActive = evaluateRiskProfile() === profile;
                              const labels = {
                                securitaire: 'Sécuritaire',
                                defensif: 'Défensif',
                                equilibre: 'Équilibré',
                                dynamique: 'Dynamique',
                                offensif: 'Offensif'
                              };
                              const colors = {
                                securitaire: 'border-green-500 bg-green-50 text-green-700',
                                defensif: 'border-blue-500 bg-blue-50 text-blue-700',
                                equilibre: 'border-yellow-500 bg-yellow-50 text-yellow-700',
                                dynamique: 'border-orange-500 bg-orange-50 text-orange-700',
                                offensif: 'border-red-500 bg-red-50 text-red-700'
                              };
                              return (
                                <div
                                  key={profile}
                                  className={`px-4 py-3 rounded-lg border-2 font-semibold text-sm ${
                                    isActive
                                      ? colors[profile as keyof typeof colors]
                                      : 'border-gray-200 bg-gray-50 text-gray-500'
                                  }`}
                                >
                                  {labels[profile as keyof typeof labels]}
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                            <p className="text-blue-800">
                              <strong>Votre profil est {
                                evaluateRiskProfile() === 'securitaire' ? 'sécuritaire' :
                                evaluateRiskProfile() === 'defensif' ? 'défensif' :
                                evaluateRiskProfile() === 'equilibre' ? 'équilibré' :
                                evaluateRiskProfile() === 'dynamique' ? 'dynamique' : 'offensif'
                              }.</strong>{' '}
                              {evaluateRiskProfile() === 'securitaire' &&
                                'Vous privilégiez la sécurité et la préservation du capital. Vous préférez des placements garantis même si les rendements sont faibles.'
                              }
                              {evaluateRiskProfile() === 'defensif' &&
                                'Vous acceptez un risque limité pour améliorer légèrement vos rendements. Vous préférez la stabilité avec de petites opportunités de gains.'
                              }
                              {evaluateRiskProfile() === 'equilibre' &&
                                'Vous souhaitez maîtriser le degré de risque de vos placements tout en acceptant des fluctuations raisonnables de la valeur de votre capital pour en améliorer les performances.'
                              }
                              {evaluateRiskProfile() === 'dynamique' &&
                                'Vous acceptez des risques importants pour obtenir des rendements plus élevés. Vous tolérez bien les fluctuations de votre capital.'
                              }
                              {evaluateRiskProfile() === 'offensif' &&
                                'Vous recherchez la performance maximale et acceptez des risques élevés. Vous investissez principalement sur des supports volatils.'
                              }
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center justify-between pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button variant="outline" onClick={() => setCurrentSubStep(0)}>Modifier le profil de risque</Button>
                        <Button onClick={goNext}>Étape suivante</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && currentSubStep === 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Préférences de placement</h2>
                    <p className="text-gray-700 mb-6">Parmi les objectifs d'investissement suivants, cochez ceux qui <strong>ne vous conviennent pas</strong> (plusieurs réponses possibles) :</p>

                    <div className="max-w-4xl space-y-6">
                      {/* Préservation du capital */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <label className="flex items-start space-x-4 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={getValue('preferences.objectivesNotSuitable.preservationCapital')}
                              onChange={() => {
                                // Si on coche un objectif spécifique, décocher "Aucun"
                                if (!getValue('preferences.objectivesNotSuitable.preservationCapital')) {
                                  update('preferences.objectivesNotSuitable.noneAllSuitable', false);
                                }
                                toggle('preferences.objectivesNotSuitable.preservationCapital');
                              }}
                              className="w-5 h-5 mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-blue-700 mb-2">Préservation du capital</h3>
                              <p className="text-gray-700">
                                Stratégie d'investissement prudente dont l'objectif principal est de préserver le capital et d'éviter les pertes au sein d'un portefeuille. Cette stratégie ne permet pas d'investir sur le marché action.
                              </p>
                            </div>
                          </label>
                        </CardContent>
                      </Card>

                      {/* Croissance du capital */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <label className="flex items-start space-x-4 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={getValue('preferences.objectivesNotSuitable.capitalGrowth')}
                              onChange={() => {
                                if (!getValue('preferences.objectivesNotSuitable.capitalGrowth')) {
                                  update('preferences.objectivesNotSuitable.noneAllSuitable', false);
                                }
                                toggle('preferences.objectivesNotSuitable.capitalGrowth');
                              }}
                              className="w-5 h-5 mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-green-700 mb-2">Croissance du capital</h3>
                              <p className="text-gray-700">
                                Stratégie d'investissement dont l'objectif principal est d'augmenter le capital avec en contrepartie un risque de perte plus élevé. Cette stratégie permet de s'exposer plus ou moins sur le marché des actions.
                              </p>
                            </div>
                          </label>
                        </CardContent>
                      </Card>

                      {/* Revenus */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <label className="flex items-start space-x-4 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={getValue('preferences.objectivesNotSuitable.income')}
                              onChange={() => {
                                if (!getValue('preferences.objectivesNotSuitable.income')) {
                                  update('preferences.objectivesNotSuitable.noneAllSuitable', false);
                                }
                                toggle('preferences.objectivesNotSuitable.income');
                              }}
                              className="w-5 h-5 mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-purple-700 mb-2">Revenus</h3>
                              <p className="text-gray-700">
                                Cette stratégie privilégie les placements qui procurent des revenus (dividendes, coupons, autres revenus distribués...).
                              </p>
                            </div>
                          </label>
                        </CardContent>
                      </Card>

                      {/* Hedging */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <label className="flex items-start space-x-4 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={getValue('preferences.objectivesNotSuitable.hedging')}
                              onChange={() => {
                                if (!getValue('preferences.objectivesNotSuitable.hedging')) {
                                  update('preferences.objectivesNotSuitable.noneAllSuitable', false);
                                }
                                toggle('preferences.objectivesNotSuitable.hedging');
                              }}
                              className="w-5 h-5 mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-orange-700 mb-2">Hedging (couverture de risque)</h3>
                              <p className="text-gray-700">
                                Une stratégie de Hedging est une stratégie de couverture. Elle consiste à couvrir une position ouverte par une autre position opposée. C'est un objectif de placement adapté uniquement aux investisseurs expérimentés.
                              </p>
                            </div>
                          </label>
                        </CardContent>
                      </Card>

                      {/* Exposition à effet de levier */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <label className="flex items-start space-x-4 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={getValue('preferences.objectivesNotSuitable.leverage')}
                              onChange={() => {
                                if (!getValue('preferences.objectivesNotSuitable.leverage')) {
                                  update('preferences.objectivesNotSuitable.noneAllSuitable', false);
                                }
                                toggle('preferences.objectivesNotSuitable.leverage');
                              }}
                              className="w-5 h-5 mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-red-700 mb-2">Exposition à effet de levier</h3>
                              <p className="text-gray-700">
                                Stratégie d'investissement qui vous permet, contre couverture, de prendre plus de positions sur les marchés que votre investissement réel. Les gains sont potentiellement élevés mais en contrepartie vous risquez de perdre plus que la somme réellement investie.
                              </p>
                            </div>
                          </label>
                        </CardContent>
                      </Card>

                      {/* Aucun - tous conviennent */}
                      <Card className="border-2 border-blue-500 bg-blue-50 hover:border-blue-600 transition-colors">
                        <CardContent className="p-6">
                          <label className="flex items-start space-x-4 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={getValue('preferences.objectivesNotSuitable.noneAllSuitable')}
                              onChange={() => {
                                // Si on coche "Aucun", décocher tous les autres
                                if (!getValue('preferences.objectivesNotSuitable.noneAllSuitable')) {
                                  update('preferences.objectivesNotSuitable.preservationCapital', false);
                                  update('preferences.objectivesNotSuitable.capitalGrowth', false);
                                  update('preferences.objectivesNotSuitable.income', false);
                                  update('preferences.objectivesNotSuitable.hedging', false);
                                  update('preferences.objectivesNotSuitable.leverage', false);
                                }
                                toggle('preferences.objectivesNotSuitable.noneAllSuitable');
                              }}
                              className="w-5 h-5 mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-blue-800 mb-2">Aucun, tous les objectifs d'investissement proposés peuvent me convenir</h3>
                            </div>
                          </label>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button onClick={goNext}>Suivant</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && currentSubStep === 1 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Préférences de placement</h2>
                    <p className="text-gray-700 mb-6">
                      Vous avez sans doute des projets à court, moyen et/ou long terme (conserver une épargne de précaution, financer les études de vos enfants, préparer votre retraite ou la transmission de vos biens).
                    </p>
                    <p className="text-gray-700 mb-8 font-medium">
                      Sur ces projets, quel est votre horizon de placement le plus long ?
                    </p>

                    <div className="max-w-3xl space-y-6">
                      {/* Placement très court terme */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <label className="flex items-start space-x-4 cursor-pointer">
                            <input
                              type="radio"
                              name="investmentHorizon"
                              value="very_short"
                              checked={getValue('preferences.investmentHorizon') === 'very_short'}
                              onChange={() => update('preferences.investmentHorizon', 'very_short')}
                              className="w-5 h-5 mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-red-700 mb-2">Placement très court terme</h3>
                              <p className="text-gray-700">Inférieur à 1 an.</p>
                            </div>
                          </label>
                        </CardContent>
                      </Card>

                      {/* Placement court terme */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <label className="flex items-start space-x-4 cursor-pointer">
                            <input
                              type="radio"
                              name="investmentHorizon"
                              value="short"
                              checked={getValue('preferences.investmentHorizon') === 'short'}
                              onChange={() => update('preferences.investmentHorizon', 'short')}
                              className="w-5 h-5 mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-orange-700 mb-2">Placement court terme</h3>
                              <p className="text-gray-700">Inférieur à 3 ans.</p>
                            </div>
                          </label>
                        </CardContent>
                      </Card>

                      {/* Placement moyen terme */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <label className="flex items-start space-x-4 cursor-pointer">
                            <input
                              type="radio"
                              name="investmentHorizon"
                              value="medium"
                              checked={getValue('preferences.investmentHorizon') === 'medium'}
                              onChange={() => update('preferences.investmentHorizon', 'medium')}
                              className="w-5 h-5 mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-yellow-700 mb-2">Placement moyen terme</h3>
                              <p className="text-gray-700">Inférieur à 5 ans.</p>
                            </div>
                          </label>
                        </CardContent>
                      </Card>

                      {/* Placement long terme */}
                      <Card className="border-2 hover:border-blue-300 transition-colors">
                        <CardContent className="p-6">
                          <label className="flex items-start space-x-4 cursor-pointer">
                            <input
                              type="radio"
                              name="investmentHorizon"
                              value="long"
                              checked={getValue('preferences.investmentHorizon') === 'long'}
                              onChange={() => update('preferences.investmentHorizon', 'long')}
                              className="w-5 h-5 mt-1"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-green-700 mb-2">Placement long terme</h3>
                              <p className="text-gray-700">Supérieur à 5 ans.</p>
                            </div>
                          </label>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={!getValue('preferences.investmentHorizon')}
                          className={!getValue('preferences.investmentHorizon') ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && currentSubStep === 2 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Profil investisseur</h2>
                    <h3 className="text-lg font-medium mb-6">Capacité à subir des pertes</h3>

                    <div className="max-w-3xl space-y-8">
                      <Card>
                        <CardContent className="p-6 space-y-8">
                          {/* Date de naissance */}
                          <div>
                            <Label className="text-base font-medium mb-4 block">Veuillez indiquer votre date de naissance :</Label>
                            <div className="flex items-center space-x-2">
                              <div className="flex flex-col">
                                <Label className="text-sm text-gray-600 mb-1">jj</Label>
                                <Input
                                  type="text"
                                  maxLength={2}
                                  value={getValue('preferences.personalInfo.birthDate.day') || ''}
                                  onChange={(e) => update('preferences.personalInfo.birthDate.day', e.target.value)}
                                  placeholder="01"
                                  className="w-16 text-center"
                                />
                              </div>
                              <span className="text-gray-500 mt-6">/</span>
                              <div className="flex flex-col">
                                <Label className="text-sm text-gray-600 mb-1">mm</Label>
                                <Input
                                  type="text"
                                  maxLength={2}
                                  value={getValue('preferences.personalInfo.birthDate.month') || ''}
                                  onChange={(e) => update('preferences.personalInfo.birthDate.month', e.target.value)}
                                  placeholder="12"
                                  className="w-16 text-center"
                                />
                              </div>
                              <span className="text-gray-500 mt-6">/</span>
                              <div className="flex flex-col">
                                <Label className="text-sm text-gray-600 mb-1">aaaa</Label>
                                <Input
                                  type="text"
                                  maxLength={4}
                                  value={getValue('preferences.personalInfo.birthDate.year') || ''}
                                  onChange={(e) => update('preferences.personalInfo.birthDate.year', e.target.value)}
                                  placeholder="1990"
                                  className="w-20 text-center"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Nombre de personnes dans le foyer fiscal */}
                          <div>
                            <Label htmlFor="householdMembers" className="text-base font-medium mb-4 block">
                              Nombre de personnes dans votre foyer fiscal :
                            </Label>
                            <Input
                              id="householdMembers"
                              type="number"
                              min="1"
                              value={getValue('preferences.personalInfo.householdMembers') || ''}
                              onChange={(e) => update('preferences.personalInfo.householdMembers', e.target.value)}
                              placeholder="2"
                              className="w-24"
                            />
                          </div>

                          {/* Nombre de personnes à charge en dehors du foyer fiscal */}
                          <div>
                            <Label htmlFor="dependentsOutside" className="text-base font-medium mb-4 block">
                              Nombre de personnes à charge en dehors du foyer fiscal :
                            </Label>
                            <Input
                              id="dependentsOutside"
                              type="number"
                              min="0"
                              value={getValue('preferences.personalInfo.dependentsOutsideHousehold') || ''}
                              onChange={(e) => update('preferences.personalInfo.dependentsOutsideHousehold', e.target.value)}
                              placeholder="0"
                              className="w-24"
                            />
                          </div>

                          {/* Timing de la retraite */}
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              Dans combien de temps avez-vous prévu de partir à la retraite ?
                            </Label>
                            <div className="space-y-4">
                              {[
                                ['already_retired', 'Je suis déjà à la retraite'],
                                ['less_than_5', 'Dans moins de 5 ans'],
                                ['more_than_5', 'Dans plus de 5 ans']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="retirementTiming"
                                    value={value}
                                    checked={getValue('preferences.personalInfo.retirementTiming') === value}
                                    onChange={() => update('preferences.personalInfo.retirementTiming', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={
                            !getValue('preferences.personalInfo.birthDate.day') ||
                            !getValue('preferences.personalInfo.birthDate.month') ||
                            !getValue('preferences.personalInfo.birthDate.year') ||
                            !getValue('preferences.personalInfo.householdMembers') ||
                            getValue('preferences.personalInfo.dependentsOutsideHousehold') === '' ||
                            !getValue('preferences.personalInfo.retirementTiming')
                          }
                          className={
                            (!getValue('preferences.personalInfo.birthDate.day') ||
                            !getValue('preferences.personalInfo.birthDate.month') ||
                            !getValue('preferences.personalInfo.birthDate.year') ||
                            !getValue('preferences.personalInfo.householdMembers') ||
                            getValue('preferences.personalInfo.dependentsOutsideHousehold') === '' ||
                            !getValue('preferences.personalInfo.retirementTiming')) ? 'opacity-50 cursor-not-allowed' : ''
                          }
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && currentSubStep === 3 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Capacité à subir des pertes</h2>

                    <div className="max-w-3xl space-y-8">
                      <Card>
                        <CardContent className="p-6 space-y-8">
                          {/* Revenus nets annuels */}
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              Quels sont les revenus nets annuels de votre foyer ?
                            </Label>
                            <div className="space-y-3">
                              {[
                                ['less_25k', 'Inférieur à 25 000 €'],
                                ['25k_50k', 'Entre 25 000 € et 50 000 €'],
                                ['50k_75k', 'Entre 50 000 € et 75 000 €'],
                                ['75k_100k', 'Entre 75 000 € et 100 000 €'],
                                ['100k_150k', 'Entre 100 000 € et 150 000 €'],
                                ['150k_300k', 'Entre 150 000 € et 300 000 €'],
                                ['more_300k', 'Plus de 300 000 €']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="annualIncome"
                                    value={value}
                                    checked={getValue('preferences.financial.annualIncome') === value}
                                    onChange={() => update('preferences.financial.annualIncome', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Épargne mensuelle */}
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              Combien épargnez-vous chaque mois ?
                            </Label>
                            <div className="space-y-3">
                              {[
                                ['no_savings', 'Je n\'épargne pas'],
                                ['0_500', 'Entre 0 et 500 €'],
                                ['500_1000', 'Entre 500 et 1 000 €'],
                                ['1000_2000', 'Entre 1 000 € et 2 000 €'],
                                ['more_2000', 'Plus de 2 000 €']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="monthlySavings"
                                    value={value}
                                    checked={getValue('preferences.financial.monthlySavings') === value}
                                    onChange={() => update('preferences.financial.monthlySavings', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={
                            !getValue('preferences.financial.annualIncome') ||
                            !getValue('preferences.financial.monthlySavings')
                          }
                          className={
                            (!getValue('preferences.financial.annualIncome') ||
                            !getValue('preferences.financial.monthlySavings')) ? 'opacity-50 cursor-not-allowed' : ''
                          }
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && currentSubStep === 4 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Capacité à subir des pertes</h2>

                    <div className="max-w-3xl space-y-8">
                      <Card>
                        <CardContent className="p-6 space-y-8">
                          {/* Patrimoine immobilier */}
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              A combien estimez-vous votre patrimoine immobilier net ?
                            </Label>
                            <div className="space-y-3">
                              {[
                                ['no_real_estate', 'Je n\'ai pas de patrimoine immobilier'],
                                ['less_100k', 'Moins de 100 000 €'],
                                ['100k_300k', 'Entre 100 000 € et 300 000 €'],
                                ['300k_500k', 'Entre 300 000 € et 500 000 €'],
                                ['500k_1m', 'Entre 500 000 € et 1 000 000 €'],
                                ['more_1m', 'Plus de 1 000 000 €']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="realEstateWealth"
                                    value={value}
                                    checked={getValue('preferences.wealth.realEstateWealth') === value}
                                    onChange={() => update('preferences.wealth.realEstateWealth', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Patrimoine financier */}
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              A combien estimez-vous votre patrimoine financier (hors immobilier) ?
                            </Label>
                            <div className="space-y-3">
                              {[
                                ['less_20k', 'Moins de 20 000 €'],
                                ['20k_50k', 'Entre 20 000 € et 50 000 €'],
                                ['50k_200k', 'Entre 50 000 € et 200 000 €'],
                                ['more_200k', 'Plus de 200 000 €']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="financialWealth"
                                    value={value}
                                    checked={getValue('preferences.wealth.financialWealth') === value}
                                    onChange={() => update('preferences.wealth.financialWealth', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={
                            !getValue('preferences.wealth.realEstateWealth') ||
                            !getValue('preferences.wealth.financialWealth')
                          }
                          className={
                            (!getValue('preferences.wealth.realEstateWealth') ||
                            !getValue('preferences.wealth.financialWealth')) ? 'opacity-50 cursor-not-allowed' : ''
                          }
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && currentSubStep === 5 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Capacité à subir des pertes</h2>

                    <div className="max-w-3xl space-y-8">
                      <Card>
                        <CardContent className="p-6 space-y-8">
                          {/* Remboursements d'emprunts */}
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              Quel montant d'emprunt remboursez-vous chaque mois ?
                            </Label>
                            <div className="space-y-3">
                              {[
                                ['no_debt', 'Je ne suis pas endetté(e)'],
                                ['less_500', 'Moins de 500 €'],
                                ['500_1000', 'Entre 500 et 1 000 €'],
                                ['1000_2000', 'Entre 1 000 € et 2 000 €'],
                                ['more_2000', 'Plus de 2 000 €']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="monthlyDebtPayments"
                                    value={value}
                                    checked={getValue('preferences.debtAndCharges.monthlyDebtPayments') === value}
                                    onChange={() => update('preferences.debtAndCharges.monthlyDebtPayments', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Charges fixes mensuelles */}
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              Quel est le montant de vos autres charges fixes mensuelles ?
                            </Label>
                            <div className="space-y-3">
                              {[
                                ['less_1000', 'Moins de 1 000 €'],
                                ['1000_2000', 'Entre 1 000 € et 2 000 €'],
                                ['2000_5000', 'Entre 2 000 € et 5 000 €'],
                                ['more_5000', 'Plus de 5 000 €']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="monthlyFixedCharges"
                                    value={value}
                                    checked={getValue('preferences.debtAndCharges.monthlyFixedCharges') === value}
                                    onChange={() => update('preferences.debtAndCharges.monthlyFixedCharges', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={
                            !getValue('preferences.debtAndCharges.monthlyDebtPayments') ||
                            !getValue('preferences.debtAndCharges.monthlyFixedCharges')
                          }
                          className={
                            (!getValue('preferences.debtAndCharges.monthlyDebtPayments') ||
                            !getValue('preferences.debtAndCharges.monthlyFixedCharges')) ? 'opacity-50 cursor-not-allowed' : ''
                          }
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && currentSubStep === 6 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Capacité à subir des pertes</h2>

                    <div className="max-w-3xl space-y-8">
                      <Card>
                        <CardContent className="p-6 space-y-8">
                          {/* Situation d'habitation */}
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              Concernant votre habitation principale, quelle est votre situation actuelle ?
                            </Label>
                            <div className="space-y-3">
                              {[
                                ['tenant', 'Locataire'],
                                ['accommodated_free', 'Hébergé(e) à titre gratuit'],
                                ['owner_mortgage_5plus', 'Propriétaire et mon emprunt finit dans plus de 5 ans'],
                                ['owner_mortgage_5minus', 'Propriétaire et mon emprunt finit dans moins de 5 ans'],
                                ['owner_no_mortgage', 'Propriétaire sans remboursement d\'emprunt']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="housingStatus"
                                    value={value}
                                    checked={getValue('preferences.housingSituation.housingStatus') === value}
                                    onChange={() => update('preferences.housingSituation.housingStatus', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Capacité d'urgence */}
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              Vos revenus et liquidités vous permettraient-ils de faire face à une dépense exceptionnelle et imprévue ?
                            </Label>
                            <div className="space-y-3">
                              {[
                                ['yes', 'Oui'],
                                ['no', 'Non'],
                                ['dont_know', 'Je ne sais pas']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="emergencyCapacity"
                                    value={value}
                                    checked={getValue('preferences.housingSituation.emergencyCapacity') === value}
                                    onChange={() => update('preferences.housingSituation.emergencyCapacity', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={
                            !getValue('preferences.housingSituation.housingStatus') ||
                            !getValue('preferences.housingSituation.emergencyCapacity')
                          }
                          className={
                            (!getValue('preferences.housingSituation.housingStatus') ||
                            !getValue('preferences.housingSituation.emergencyCapacity')) ? 'opacity-50 cursor-not-allowed' : ''
                          }
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && currentSubStep === 7 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Capacité à subir des pertes</h2>

                    <div className="max-w-3xl space-y-8">
                      <Card>
                        <CardContent className="p-6">
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              Estimez-vous que vos revenus :
                            </Label>
                            <div className="space-y-4">
                              {[
                                ['increase_regularly', 'Vont augmenter régulièrement dans le temps'],
                                ['remain_stable', 'Devraient rester à peu près stables'],
                                ['decrease_irregular', 'Pourraient baisser ou être irréguliers'],
                                ['dont_know', 'Je ne sais pas']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-4 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="futureIncomeExpectation"
                                    value={value}
                                    checked={getValue('preferences.incomeOutlook.futureIncomeExpectation') === value}
                                    onChange={() => update('preferences.incomeOutlook.futureIncomeExpectation', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={!getValue('preferences.incomeOutlook.futureIncomeExpectation')}
                          className={!getValue('preferences.incomeOutlook.futureIncomeExpectation') ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && currentSubStep === 8 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Résultats</h2>
                    <h3 className="text-lg font-medium mb-6">Capacité à subir des pertes</h3>

                    <div className="max-w-4xl space-y-8">
                      {/* Badges de capacité à subir des pertes */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-center space-x-4 mb-6 flex-wrap gap-y-4">
                            {['tres_faible', 'faible', 'moyenne', 'elevee', 'tres_elevee'].map((capacity) => {
                              const isActive = evaluateLossCapacity() === capacity;
                              const labels = {
                                tres_faible: 'Très faible',
                                faible: 'Faible',
                                moyenne: 'Moyenne',
                                elevee: 'Élevée',
                                tres_elevee: 'Très élevée'
                              };
                              const colors = {
                                tres_faible: 'border-red-600 bg-red-50 text-red-700',
                                faible: 'border-orange-500 bg-orange-50 text-orange-700',
                                moyenne: 'border-yellow-500 bg-yellow-50 text-yellow-700',
                                elevee: 'border-green-500 bg-green-50 text-green-700',
                                tres_elevee: 'border-emerald-600 bg-emerald-50 text-emerald-700'
                              };
                              return (
                                <div
                                  key={capacity}
                                  className={`px-4 py-3 rounded-lg border-2 font-semibold text-sm ${
                                    isActive
                                      ? colors[capacity as keyof typeof colors]
                                      : 'border-gray-200 bg-gray-50 text-gray-500'
                                  }`}
                                >
                                  {labels[capacity as keyof typeof labels]}
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                            <p className="text-orange-800">
                              <strong>D'après votre situation financière et patrimoniale, votre capacité à subir des pertes est {
                                evaluateLossCapacity() === 'tres_faible' ? 'très faible' :
                                evaluateLossCapacity() === 'faible' ? 'faible' :
                                evaluateLossCapacity() === 'moyenne' ? 'moyenne' :
                                evaluateLossCapacity() === 'elevee' ? 'élevée' : 'très élevée'
                              }.</strong>
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center justify-between pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button variant="outline" onClick={() => setCurrentSubStep(2)}>Modifier la capacité à subir des pertes</Button>
                        <Button onClick={goNext}>Étape suivante</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 4 && currentSubStep === 0 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Votre profil investisseur extra-financier</h2>
                    <h3 className="text-lg font-medium mb-6">Comment tenir compte de vos préférences extra-financières ?</h3>

                    <div className="max-w-3xl space-y-8">
                      <Card>
                        <CardContent className="p-6">
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              Souhaitez-vous préciser vos préférences en matière de durabilité ?
                            </Label>
                            <div className="space-y-4">
                              {[
                                ['yes', 'Oui'],
                                ['no', 'Non']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="radio"
                                    name="specifyDurabilityPreferences"
                                    value={value}
                                    checked={getValue('extraFinancial.specifyDurabilityPreferences') === value}
                                    onChange={() => update('extraFinancial.specifyDurabilityPreferences', value)}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium text-gray-800 text-lg">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={!getValue('extraFinancial.specifyDurabilityPreferences')}
                          className={!getValue('extraFinancial.specifyDurabilityPreferences') ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 4 && currentSubStep === 1 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Votre profil investisseur extra-financier</h2>
                    <h3 className="text-lg font-medium mb-6">Comment tenir compte de vos préférences extra-financières ?</h3>

                    <div className="max-w-3xl space-y-8">
                      {/* Affichage de la question précédente */}
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-sm text-gray-600 mb-2">Souhaitez-vous préciser vos préférences en matière de durabilité ?</p>
                        <p className="font-medium text-gray-800">
                          {getValue('extraFinancial.specifyDurabilityPreferences') === 'yes' ? 'Oui' : 'Non'}
                        </p>
                      </div>

                      {getValue('extraFinancial.specifyDurabilityPreferences') === 'yes' ? (
                        // Contenu si "Oui" - Sélection des approches
                        <Card>
                          <CardContent className="p-6">
                            <div>
                              <Label className="text-base font-medium mb-6 block">
                                Sélectionnez une ou plusieurs approche(s) extra-financière(s) :
                              </Label>
                              <div className="space-y-4">
                                {/* Activités environnementales */}
                                <label className="flex items-start space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={getValue('extraFinancial.extraFinancialApproaches.environmentalActivities')}
                                    onChange={() => toggle('extraFinancial.extraFinancialApproaches.environmentalActivities')}
                                    className="w-5 h-5 mt-1"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-bold text-lg text-green-700 mb-2">Activités environnementales</h4>
                                    <p className="text-gray-700">
                                      Vous souhaitez investir dans des activités ayant un impact positif sur l'environnement.
                                    </p>
                                  </div>
                                </label>

                                {/* Objectif environnemental ou social */}
                                <label className="flex items-start space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={getValue('extraFinancial.extraFinancialApproaches.environmentalSocialObjective')}
                                    onChange={() => toggle('extraFinancial.extraFinancialApproaches.environmentalSocialObjective')}
                                    className="w-5 h-5 mt-1"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-bold text-lg text-blue-700 mb-2">Objectif environnemental ou social</h4>
                                    <p className="text-gray-700">
                                      Vous souhaitez que vos investissements répondent à un objectif environnemental et/ou social.
                                    </p>
                                  </div>
                                </label>

                                {/* Incidences négatives */}
                                <label className="flex items-start space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                  <input
                                    type="checkbox"
                                    checked={getValue('extraFinancial.extraFinancialApproaches.negativeImpacts')}
                                    onChange={() => toggle('extraFinancial.extraFinancialApproaches.negativeImpacts')}
                                    className="w-5 h-5 mt-1"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-bold text-lg text-orange-700 mb-2">Incidences négatives</h4>
                                    <p className="text-gray-700">
                                      Vous souhaitez sélectionner vos investissements en fonction de leur prise en compte des principales incidences négatives.
                                    </p>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        // Contenu si "Non" - Message d'information
                        <Card className="border-2 border-blue-200 bg-blue-50">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm font-bold">i</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-lg text-blue-800 mb-3">Message d'information</h4>
                                <p className="text-blue-700">
                                  En sélectionnant non, vous reconnaissez ne pas avoir d'exigence minimum concernant l'intégration de produits financiers durables à vos investissements.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button onClick={goNext}>Étape suivante</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 4 && currentSubStep === 2 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Votre profil investisseur extra-financier</h2>

                    <div className="max-w-3xl space-y-8">
                      <Card>
                        <CardContent className="p-6 space-y-6">
                          <div>
                            <Label className="text-base font-medium mb-6 block">
                              Quelle part de votre investissement souhaitez-vous consacrer à des activités contribuant à un objectif environnemental ou social ?
                            </Label>
                            <div className="space-y-4">
                              {/* 5% option */}
                              <label className="flex items-start space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                <input
                                  type="radio"
                                  name="environmentalSocialPercentage"
                                  value="5"
                                  checked={getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage') === '5'}
                                  onChange={() => update('extraFinancial.investmentAllocation.environmentalSocialPercentage', '5')}
                                  className="w-5 h-5 mt-1"
                                />
                                <div className="flex-1">
                                  <p className="text-gray-700 mb-2">
                                    Vous souhaitez y consacrer au moins 5 % de votre investissement.
                                  </p>
                                  <div className="bg-green-100 px-3 py-2 rounded-lg inline-block">
                                    <span className="text-2xl font-bold text-green-700">5 %</span>
                                  </div>
                                </div>
                              </label>

                              {/* 25% option */}
                              <label className="flex items-start space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                <input
                                  type="radio"
                                  name="environmentalSocialPercentage"
                                  value="25"
                                  checked={getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage') === '25'}
                                  onChange={() => update('extraFinancial.investmentAllocation.environmentalSocialPercentage', '25')}
                                  className="w-5 h-5 mt-1"
                                />
                                <div className="flex-1">
                                  <p className="text-gray-700 mb-2">
                                    Vous souhaitez y consacrer au moins 25 % de votre investissement.
                                  </p>
                                  <div className="bg-blue-100 px-3 py-2 rounded-lg inline-block">
                                    <span className="text-2xl font-bold text-blue-700">25 %</span>
                                  </div>
                                </div>
                              </label>

                              {/* 50% option */}
                              <label className="flex items-start space-x-4 p-5 border-2 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                <input
                                  type="radio"
                                  name="environmentalSocialPercentage"
                                  value="50"
                                  checked={getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage') === '50'}
                                  onChange={() => update('extraFinancial.investmentAllocation.environmentalSocialPercentage', '50')}
                                  className="w-5 h-5 mt-1"
                                />
                                <div className="flex-1">
                                  <p className="text-gray-700 mb-2">
                                    Vous souhaitez y consacrer au moins 50 % de votre investissement.
                                  </p>
                                  <div className="bg-purple-100 px-3 py-2 rounded-lg inline-block">
                                    <span className="text-2xl font-bold text-purple-700">50 %</span>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Information message */}
                          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                            <p className="text-blue-800 text-sm mb-2">
                              <strong>Vous avez indiqué vouloir consacrer une partie de votre investissement à des activités contribuant à un objectif environnemental ou social. Ces activités appartiennent à la catégorie SFDR.</strong>
                            </p>
                            <p className="text-blue-700 text-sm">
                              Veuillez noter que ce choix est susceptible d'impacter la liste des supports dans lesquels vous pourriez investir.
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button
                          onClick={goNext}
                          disabled={!getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage')}
                          className={!getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage') ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Étape suivante
                        </Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 4 && currentSubStep === 3 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Récapitulatif de votre profil extra-financier</h2>
                    <div className="max-w-3xl space-y-8">
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-medium mb-6">Évaluation de votre sensibilité extra-financière</h3>

                          {/* Sensibilité basée sur les réponses */}
                          <div className="mb-6">
                            <p className="text-gray-700 mb-4">
                              Sur la base de vos réponses, votre profil de sensibilité extra-financière est :
                            </p>
                            <div className="inline-block">
                              {getValue('extraFinancial.specifyDurabilityPreferences') === 'no' ? (
                                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                                  <span className="text-lg font-semibold text-gray-700">Neutre</span>
                                </div>
                              ) : (
                                getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage') === '5' ? (
                                  <div className="bg-blue-100 px-4 py-2 rounded-lg">
                                    <span className="text-lg font-semibold text-blue-700">Modérée</span>
                                  </div>
                                ) : getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage') === '25' ? (
                                  <div className="bg-green-100 px-4 py-2 rounded-lg">
                                    <span className="text-lg font-semibold text-green-700">Significative</span>
                                  </div>
                                ) : (
                                  <div className="bg-purple-100 px-4 py-2 rounded-lg">
                                    <span className="text-lg font-semibold text-purple-700">Forte</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Allocation d'investissement */}
                          {getValue('extraFinancial.specifyDurabilityPreferences') === 'yes' && (
                            <div className="bg-gray-50 p-6 rounded-lg">
                              <h4 className="font-medium mb-4">Allocation d'investissement souhaitée</h4>
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-green-600">
                                    {getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage')}%
                                  </div>
                                  <p className="text-sm text-gray-600">Activités contribuant à un objectif environnemental ou social</p>
                                </div>
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-blue-600">
                                    {100 - parseInt(getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage') || '0')}%
                                  </div>
                                  <p className="text-sm text-gray-600">Autres investissements</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Approches sélectionnées */}
                          {getValue('extraFinancial.specifyDurabilityPreferences') === 'yes' && (
                            <div className="mt-6">
                              <h4 className="font-medium mb-4">Approches de durabilité sélectionnées</h4>
                              <div className="space-y-2">
                                {getValue('extraFinancial.durabilityApproaches.exclusion') && (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm">Exclusion</span>
                                  </div>
                                )}
                                {getValue('extraFinancial.durabilityApproaches.bestInClass') && (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm">Best-in-class</span>
                                  </div>
                                )}
                                {getValue('extraFinancial.durabilityApproaches.integration') && (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm">Intégration ESG</span>
                                  </div>
                                )}
                                {getValue('extraFinancial.durabilityApproaches.thematic') && (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm">Investissement thématique</span>
                                  </div>
                                )}
                                {getValue('extraFinancial.durabilityApproaches.impact') && (
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-sm">Investissement d'impact</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="flex items-center justify-between pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button variant="outline" onClick={() => setCurrentSubStep(0)}>Modifier le profil extra-financier</Button>
                        <Button onClick={goNext}>Terminer</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 5 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Profil investisseur extra-financier</h2>
                    <p className="text-gray-700 mb-6">Évaluons vos préférences en matière d'investissement responsable</p>
                    <div className="max-w-3xl space-y-6">
                      <Card>
                        <CardContent className="p-6 space-y-6">
                          <div>
                            <p className="font-medium mb-4">Accordez-vous de l'importance aux critères ESG (Environnemental, Social, Gouvernance) dans vos investissements ?</p>
                            <div className="space-y-3">
                              {[
                                ['tres_important', 'Très important'],
                                ['important', 'Important'],
                                ['peu_important', 'Peu important'],
                                ['pas_important', 'Pas important du tout']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="criteresESG"
                                    value={value}
                                    checked={getValue('profilExtraFinancier.criteresESG') === value}
                                    onChange={() => update('profilExtraFinancier.criteresESG', value)}
                                  />
                                  <span className="text-sm">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium mb-4">Seriez-vous prêt à accepter un rendement potentiellement plus faible pour un investissement respectant vos valeurs ?</p>
                            <div className="space-y-3">
                              {[
                                ['oui_acceptable', 'Oui, tout à fait acceptable'],
                                ['oui_limite', 'Oui, dans une certaine limite'],
                                ['non_priorite', 'Non, le rendement est ma priorité'],
                                ['indifferent', 'Je suis indifférent']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="rendementValeurs"
                                    value={value}
                                    checked={getValue('profilExtraFinancier.rendementValeurs') === value}
                                    onChange={() => update('profilExtraFinancier.rendementValeurs', value)}
                                  />
                                  <span className="text-sm">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button onClick={goNext}>Suivant</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 6 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Récapitulatif</h2>
                    <div className="max-w-6xl space-y-8">

                      {/* Connaissance et expérience des marchés financiers */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Connaissance et expérience des marchés financiers</h3>

                          {/* Profil de connaissance */}
                          <div className="flex items-center justify-center space-x-4 mb-6 flex-wrap gap-y-4">
                            {['novice', 'informed', 'experienced'].map((level) => {
                              const isActive = evaluateKnowledgeLevel() === level;
                              const labels = {
                                novice: 'Novice',
                                informed: 'Informé',
                                experienced: 'Expérimenté'
                              };
                              const colors = {
                                novice: 'border-red-500 bg-red-50 text-red-700',
                                informed: 'border-blue-500 bg-blue-50 text-blue-700',
                                experienced: 'border-green-500 bg-green-50 text-green-700'
                              };
                              return (
                                <div
                                  key={level}
                                  className={`px-4 py-3 rounded-lg border-2 font-semibold text-sm ${
                                    isActive
                                      ? colors[level as keyof typeof colors]
                                      : 'border-gray-200 bg-gray-50 text-gray-500'
                                  }`}
                                >
                                  {labels[level as keyof typeof labels]}
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                            <p className="text-blue-800 text-sm">
                              <strong>Votre profil est {
                                evaluateKnowledgeLevel() === 'novice' ? 'novice' :
                                evaluateKnowledgeLevel() === 'informed' ? 'informé' : 'expérimenté'
                              }.</strong>{' '}
                              {evaluateKnowledgeLevel() === 'novice' &&
                                'Vous découvrez les marchés financiers et les produits d\'investissement. Une approche prudente et éducative est recommandée.'
                              }
                              {evaluateKnowledgeLevel() === 'informed' &&
                                'Vous êtes plutôt à l\'aise avec les produits les plus simples et connaissez certains produits financiers plus complexes sans toutefois en maîtriser précisément tous leurs mécanismes.'
                              }
                              {evaluateKnowledgeLevel() === 'experienced' &&
                                'Vous maîtrisez bien les produits financiers et comprenez leurs mécanismes. Vous pouvez accéder à une gamme étendue de produits d\'investissement.'
                              }
                            </p>
                          </div>

                          {/* Types de produits */}
                          <div className="space-y-4">
                            <h4 className="font-medium">Connaissance selon le type de produit</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <h5 className="font-medium text-green-700 mb-2">Connaissance validée avec le questionnaire</h5>
                                <ul className="space-y-1 text-gray-700">
                                  <li>• Assurance-vie et capitalisation</li>
                                  <li>• Épargne retraite et entreprise</li>
                                </ul>
                              </div>

                              <div>
                                <h5 className="font-medium text-red-700 mb-2">Connaissance invalidée avec le questionnaire</h5>
                                <ul className="space-y-1 text-gray-700">
                                  <li>• PEA et comptes-titres</li>
                                </ul>
                              </div>

                              <div className="md:col-span-2">
                                <h5 className="font-medium text-gray-700 mb-2">Connaissance non vérifiée avec le questionnaire</h5>
                                <div className="grid grid-cols-2 gap-2 text-gray-600">
                                  <ul className="space-y-1">
                                    <li>• Fonds euros</li>
                                    <li>• Produits monétaires</li>
                                    <li>• Produits obligataires</li>
                                    <li>• Produits actions</li>
                                    <li>• SCPI</li>
                                    <li>• OPCI</li>
                                    <li>• Capital investissement ou Private equity</li>
                                    <li>• Produits structurés</li>
                                    <li>• SOFICA</li>
                                    <li>• Produits obligataires complexes</li>
                                    <li>• Produits actions complexes</li>
                                  </ul>
                                  <ul className="space-y-1">
                                    <li>• Tracker</li>
                                    <li>• CFD (contrats sur la différence)</li>
                                    <li>• Futures</li>
                                    <li>• Options</li>
                                    <li>• Warrants</li>
                                    <li>• Turbos</li>
                                    <li>• Certificats à gestion active (AMC)</li>
                                    <li>• Cryptomonnaies</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end pt-4">
                            <Button variant="outline" onClick={() => {setCurrentStep(1); setCurrentSubStep(0);}}>
                              Modifier la connaissance et expérience
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Profil de risque */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Profil de risque</h3>

                          <div className="flex items-center justify-center space-x-4 mb-6 flex-wrap gap-y-4">
                            {['securitaire', 'defensif', 'equilibre', 'dynamique', 'offensif'].map((profile) => {
                              const isActive = evaluateRiskProfile() === profile;
                              const labels = {
                                securitaire: 'Sécuritaire',
                                defensif: 'Défensif',
                                equilibre: 'Équilibré',
                                dynamique: 'Dynamique',
                                offensif: 'Offensif'
                              };
                              const colors = {
                                securitaire: 'border-green-500 bg-green-50 text-green-700',
                                defensif: 'border-blue-500 bg-blue-50 text-blue-700',
                                equilibre: 'border-yellow-500 bg-yellow-50 text-yellow-700',
                                dynamique: 'border-orange-500 bg-orange-50 text-orange-700',
                                offensif: 'border-red-500 bg-red-50 text-red-700'
                              };
                              return (
                                <div
                                  key={profile}
                                  className={`px-4 py-3 rounded-lg border-2 font-semibold text-sm ${
                                    isActive
                                      ? colors[profile as keyof typeof colors]
                                      : 'border-gray-200 bg-gray-50 text-gray-500'
                                  }`}
                                >
                                  {labels[profile as keyof typeof labels]}
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                            <p className="text-blue-800 text-sm">
                              <strong>Votre profil est {
                                evaluateRiskProfile() === 'securitaire' ? 'sécuritaire' :
                                evaluateRiskProfile() === 'defensif' ? 'défensif' :
                                evaluateRiskProfile() === 'equilibre' ? 'équilibré' :
                                evaluateRiskProfile() === 'dynamique' ? 'dynamique' : 'offensif'
                              }.</strong>{' '}
                              {evaluateRiskProfile() === 'defensif' &&
                                'Vous souhaitez prendre le minimum de risques dans vos placements afin de réaliser vos projets en toute sécurité. Votre faible tolérance au risque impose la sélection de supports à faible volatilité.'
                              }
                            </p>
                          </div>

                          <div className="flex justify-end">
                            <Button variant="outline" onClick={() => {setCurrentStep(2); setCurrentSubStep(0);}}>
                              Modifier le profil de risque
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Préférences de placement */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Préférences de placement</h3>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Objectifs d'investissement exclus</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <ul className="space-y-1">
                                  {getValue('preferences.objectivesNotSuitable.preservationCapital') && <li>• Préservation du capital</li>}
                                  {getValue('preferences.objectivesNotSuitable.capitalGrowth') && <li>• Croissance du capital</li>}
                                  {getValue('preferences.objectivesNotSuitable.income') && <li>• Revenus</li>}
                                </ul>
                                <ul className="space-y-1">
                                  {getValue('preferences.objectivesNotSuitable.hedging') && <li>• Hedging (couverture de risque)</li>}
                                  {getValue('preferences.objectivesNotSuitable.leverage') && <li>• Exposition à effet de levier</li>}
                                </ul>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Horizon de placement</h4>
                              <div className="bg-gray-50 px-4 py-2 rounded-lg inline-block">
                                <span className="text-sm text-gray-700">
                                  {getValue('preferences.investmentHorizon') === 'very_short' && 'Placement très court terme'}
                                  {getValue('preferences.investmentHorizon') === 'short' && 'Placement court terme'}
                                  {getValue('preferences.investmentHorizon') === 'medium' && 'Placement moyen terme'}
                                  {getValue('preferences.investmentHorizon') === 'long' && 'Placement long terme'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end pt-4">
                            <Button variant="outline" onClick={() => {setCurrentStep(3); setCurrentSubStep(0);}}>
                              Modifier les préférences de placement
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Capacité à subir des pertes */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Capacité à subir des pertes</h3>

                          <div className="flex items-center justify-center space-x-4 mb-6 flex-wrap gap-y-4">
                            {['tres_faible', 'faible', 'moyenne', 'elevee', 'tres_elevee'].map((capacity) => {
                              const isActive = evaluateLossCapacity() === capacity;
                              const labels = {
                                tres_faible: 'Très faible',
                                faible: 'Faible',
                                moyenne: 'Moyenne',
                                elevee: 'Élevée',
                                tres_elevee: 'Très élevée'
                              };
                              const colors = {
                                tres_faible: 'border-red-500 bg-red-50 text-red-700',
                                faible: 'border-orange-500 bg-orange-50 text-orange-700',
                                moyenne: 'border-yellow-500 bg-yellow-50 text-yellow-700',
                                elevee: 'border-blue-500 bg-blue-50 text-blue-700',
                                tres_elevee: 'border-green-500 bg-green-50 text-green-700'
                              };
                              return (
                                <div
                                  key={capacity}
                                  className={`px-4 py-3 rounded-lg border-2 font-semibold text-sm ${
                                    isActive
                                      ? colors[capacity as keyof typeof colors]
                                      : 'border-gray-200 bg-gray-50 text-gray-500'
                                  }`}
                                >
                                  {labels[capacity as keyof typeof labels]}
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                            <p className="text-blue-800 text-sm">
                              <strong>D'après votre situation financière et patrimoniale, votre capacité à subir des pertes est {
                                evaluateLossCapacity() === 'tres_faible' ? 'très faible' :
                                evaluateLossCapacity() === 'faible' ? 'faible' :
                                evaluateLossCapacity() === 'moyenne' ? 'moyenne' :
                                evaluateLossCapacity() === 'elevee' ? 'élevée' : 'très élevée'
                              }.</strong>
                            </p>
                          </div>

                          <div className="flex justify-end">
                            <Button variant="outline" onClick={() => {setCurrentStep(3); setCurrentSubStep(2);}}>
                              Modifier la capacité à subir des pertes
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Sensibilité extra-financière */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">Sensibilité extra-financière</h3>

                          <div className="flex items-center justify-center space-x-4 mb-6 flex-wrap gap-y-4">
                            {['neutre', 'moderee', 'significative', 'forte'].map((sensitivity) => {
                              const currentSensitivity = getValue('extraFinancial.specifyDurabilityPreferences') === 'no' ? 'neutre' :
                                getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage') === '5' ? 'moderee' :
                                getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage') === '25' ? 'significative' : 'forte';
                              const isActive = currentSensitivity === sensitivity;
                              const labels = {
                                neutre: 'Neutre',
                                moderee: 'Modérée',
                                significative: 'Significative',
                                forte: 'Forte'
                              };
                              const colors = {
                                neutre: 'border-gray-500 bg-gray-50 text-gray-700',
                                moderee: 'border-blue-500 bg-blue-50 text-blue-700',
                                significative: 'border-green-500 bg-green-50 text-green-700',
                                forte: 'border-purple-500 bg-purple-50 text-purple-700'
                              };
                              return (
                                <div
                                  key={sensitivity}
                                  className={`px-4 py-3 rounded-lg border-2 font-semibold text-sm ${
                                    isActive
                                      ? colors[sensitivity as keyof typeof colors]
                                      : 'border-gray-200 bg-gray-50 text-gray-500'
                                  }`}
                                >
                                  {labels[sensitivity as keyof typeof labels]}
                                </div>
                              );
                            })}
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                            <p className="text-blue-800 text-sm">
                              <strong>D'après les réponses apportées au questionnaire, votre sensibilité extra-financière est {
                                getValue('extraFinancial.specifyDurabilityPreferences') === 'no' ? 'neutre' :
                                getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage') === '5' ? 'modérée' :
                                getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage') === '25' ? 'significative' : 'forte'
                              }.</strong>
                            </p>
                          </div>

                          {getValue('extraFinancial.specifyDurabilityPreferences') === 'yes' && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Objectif environnemental ou social</h4>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 mb-2">
                                      {getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage')} %
                                    </div>
                                    <p className="text-sm text-green-700">
                                      Vous souhaitez qu'au moins {getValue('extraFinancial.investmentAllocation.environmentalSocialPercentage')} % de votre investissement réponde à un objectif d'amélioration de l'environnement ou du social
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end pt-4">
                            <Button variant="outline" onClick={() => {setCurrentStep(4); setCurrentSubStep(0);}}>
                              Modifier le profil extra-financier
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Actions finales */}
                      <div className="flex items-center justify-between pt-6">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <div className="space-x-4">
                          <Button variant="outline">
                            Fermer
                          </Button>
                          <Button className="bg-green-600 hover:bg-green-700">
                            Générer le PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}