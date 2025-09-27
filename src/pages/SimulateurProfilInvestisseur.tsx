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
        riskTolerance: null,
        investmentPhilosophy: null,
        riskScenario: null,
        insuranceHabits: null,
        timeManagement: null,
        housingInvestment: null,
        careerAdvice: null,
      },
      preferences: {
        horizon: "",
      },
      lossCapacity: {
        percentLoss: 0,
      },
      extraFinancial: {
        prefersESG: false,
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

  // Définition des sous-étapes pour chaque étape principale
  const getSubStepsCount = (step: number) => {
    switch (step) {
      case 1: return 4; // Connaissance et Expérience : produits, familles, instruments + résultats
      case 2: return 4; // Profil de risque : philosophie, scenarios+habitudes, autres questions + résultats
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
                    <h2 className="text-xl font-semibold mb-3">Profil de risque</h2>

                    <div className="max-w-3xl space-y-8">
                      {/* Question philosophie d'investissement */}
                      <Card>
                        <CardContent className="p-6">
                          <div>
                            <p className="font-medium mb-6 text-lg">En matière de placements financiers, pensez-vous plutôt que :</p>
                            <div className="space-y-4">
                              {[
                                ['no_risk', 'Il ne faut pas prendre de risque ; on doit placer toutes ses économies dans des placements sûrs.'],
                                ['small_risk', 'On peut placer une petite partie de ses économies sur des placements risqués.'],
                                ['important_risk', 'On peut placer une part importante de ses économies sur des actifs risqués si le gain en vaut la peine.'],
                                ['essential_risk', 'On doit placer l\'essentiel de ses économies sur des actifs risqués dès qu\'il y a des chances de gains très importants.']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-start space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="investmentPhilosophy"
                                    value={value}
                                    checked={getValue('riskProfile.investmentPhilosophy') === value}
                                    onChange={() => update('riskProfile.investmentPhilosophy', value)}
                                    className="mt-1"
                                  />
                                  <span className="text-gray-700">{label}</span>
                                </label>
                              ))}
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

                {currentStep === 2 && currentSubStep === 1 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Profil de risque</h2>
                    <p className="text-gray-700 mb-6">Continuons l'évaluation de votre profil de risque</p>

                    <div className="max-w-3xl space-y-8">
                      {/* Question scénario de risque */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Scénario d'arbitrage risque/rendement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <p className="text-blue-800 mb-3">
                                <strong>Imaginez que l'ensemble de vos économies soit investi dans un placement sans risque qui vous rapporte un revenu certain de 20 000 € par an.</strong>
                              </p>
                              <p className="text-blue-700 mb-3">
                                On vous propose de réallouer votre capital pour l'investir sur des supports risqués qui ont :
                              </p>
                              <ul className="text-blue-700 space-y-2 ml-4">
                                <li>• <strong>une chance sur deux (50 %)</strong> de vous procurer un revenu annuel double <strong>(40 000 €)</strong>;</li>
                                <li>• <strong>et une chance sur deux</strong> de vous procurer un revenu diminué d'un tiers <strong>(13 333 €)</strong>.</li>
                              </ul>
                            </div>

                            <div className="space-y-3">
                              {[
                                ['conserve', 'Je conserve le placement actuel'],
                                ['accepte', 'J\'accepte le nouveau placement']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="riskScenario"
                                    value={value}
                                    checked={getValue('riskProfile.riskScenario') === value}
                                    onChange={() => update('riskProfile.riskScenario', value)}
                                  />
                                  <span className="font-medium text-gray-700">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Questions sur les habitudes de risque */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Attitude générale face au risque</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <p className="font-medium mb-4">Êtes-vous assuré au-delà du minimum obligatoire, contre les risques concernant par exemple, le logement, la voiture, le vol, la responsabilité civile... ?</p>
                            <div className="flex space-x-4">
                              {[
                                ['oui', 'Oui'],
                                ['non', 'Non']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer flex-1">
                                  <input
                                    type="radio"
                                    name="insuranceHabits"
                                    value={value}
                                    checked={getValue('riskProfile.insuranceHabits') === value}
                                    onChange={() => update('riskProfile.insuranceHabits', value)}
                                  />
                                  <span className="font-medium text-gray-700">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium mb-4">Quand vous prenez le train ou l'avion, vous préférez arriver sur le lieu de départ :</p>
                            <div className="space-y-3">
                              {[
                                ['bien_avance', 'Bien à l\'avance'],
                                ['peu_avance', 'Un peu à l\'avance'],
                                ['dernier_moment', 'Au dernier moment']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="timeManagement"
                                    value={value}
                                    checked={getValue('riskProfile.timeManagement') === value}
                                    onChange={() => update('riskProfile.timeManagement', value)}
                                  />
                                  <span className="font-medium text-gray-700">{label}</span>
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

                {currentStep === 2 && currentSubStep === 2 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Profil de risque</h2>
                    <p className="text-gray-700 mb-6">Finalisons l'évaluation de votre profil de risque</p>

                    <div className="max-w-3xl space-y-8">
                      {/* Questions supplémentaires */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Questions complémentaires</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <p className="font-medium mb-4">En matière de logement êtes-vous d'accord avec l'affirmation suivante : L'un des premiers investissements à réaliser est de devenir propriétaire afin de s'assurer un toit au-dessus de la tête ?</p>
                            <div className="space-y-3">
                              {[
                                ['tout_accord', 'Tout à fait d\'accord'],
                                ['plutot_accord', 'Plutôt d\'accord'],
                                ['pas_accord', 'Pas du tout d\'accord']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="housingInvestment"
                                    value={value}
                                    checked={getValue('riskProfile.housingInvestment') === value}
                                    onChange={() => update('riskProfile.housingInvestment', value)}
                                  />
                                  <span className="font-medium text-gray-700">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium mb-4">Un de vos proches vous fait part de son intention d'abandonner sa situation actuelle pour une carrière risquée. Le poussez-vous dans cette voie ?</p>
                            <div className="space-y-3">
                              {[
                                ['dissuader', 'Non, j\'essaye de l\'en dissuader'],
                                ['reserves', 'Oui, mais en émettant des réserves ou des conseils de prudence'],
                                ['assurement', 'Oui, assurément']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="careerAdvice"
                                    value={value}
                                    checked={getValue('riskProfile.careerAdvice') === value}
                                    onChange={() => update('riskProfile.careerAdvice', value)}
                                  />
                                  <span className="font-medium text-gray-700">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Question réaction aux pertes */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Réaction aux fluctuations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div>
                            <Label className="text-sm mb-4 block font-medium">Si votre portefeuille perdait 20% en 6 mois, quelle serait votre réaction ?</Label>
                            <Select
                              value={form.riskProfile.riskTolerance || ""}
                              onValueChange={(value) => update('riskProfile.riskTolerance', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="-- sélectionnez --" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="very_conservative">Je vendrais la majorité</SelectItem>
                                <SelectItem value="conservative">Je sécuriserais une partie</SelectItem>
                                <SelectItem value="balanced">Je ne ferais rien</SelectItem>
                                <SelectItem value="aggressive">J'investirais davantage</SelectItem>
                              </SelectContent>
                            </Select>
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

                {currentStep === 2 && currentSubStep === 3 && (
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
                        <Button variant="outline" onClick={() => setCurrentSubStep(1)}>Modifier le profil de risque</Button>
                        <Button onClick={goNext}>Étape suivante</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Préférences de placement</h2>
                    <p className="text-gray-700 mb-6">Définissons vos objectifs d'investissement</p>

                    <div className="max-w-2xl space-y-6">
                      <div>
                        <Label htmlFor="horizon">Horizon d'investissement (années)</Label>
                        <Input
                          id="horizon"
                          type="number"
                          onChange={(e) => update('preferences.horizon', e.target.value)}
                          value={form.preferences.horizon || ''}
                          placeholder="Ex: 10"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="block mb-3">Pourcentage de capital que vous accepteriez de perdre</Label>
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={form.lossCapacity.percentLoss || 0}
                            onChange={(e) => update('lossCapacity.percentLoss', Number(e.target.value))}
                            className="w-full"
                          />
                          <div className="text-center text-lg font-semibold text-blue-600">
                            {form.lossCapacity.percentLoss || 0}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button onClick={goNext}>Suivant</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 7 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Profil investisseur extra-financier</h2>
                    <p className="text-gray-700 mb-6">Vos préférences en matière de critères ESG (Environnemental, Social et Gouvernance)</p>

                    <div className="max-w-2xl space-y-6">
                      <label className="flex items-center space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.extraFinancial.prefersESG || false}
                          onChange={(e) => update('extraFinancial.prefersESG', e.target.checked)}
                        />
                        <span>Je préfère des placements prenant en compte des critères ESG</span>
                      </label>

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button onClick={goNext}>Suivant</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 4 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Capacité à subir des pertes</h2>
                    <p className="text-gray-700 mb-6">Évaluons votre capacité financière à supporter des pertes</p>
                    <div className="max-w-3xl space-y-6">
                      <Card>
                        <CardContent className="p-6 space-y-6">
                          <div>
                            <p className="font-medium mb-4">Quelle est votre situation financière actuelle ?</p>
                            <div className="space-y-3">
                              {[
                                ['revenus_stables', 'Revenus stables et réguliers'],
                                ['revenus_variables', 'Revenus variables'],
                                ['patrimoine_important', 'Patrimoine important constitué'],
                                ['situation_precaire', 'Situation financière précaire']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="situationFinanciere"
                                    value={value}
                                    checked={getValue('capacitePertes.situationFinanciere') === value}
                                    onChange={() => update('capacitePertes.situationFinanciere', value)}
                                  />
                                  <span className="text-sm">{label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="font-medium mb-4">Quel pourcentage de perte sur votre portefeuille pourriez-vous accepter ?</p>
                            <div className="space-y-3">
                              {[
                                ['0_5', '0 à 5%'],
                                ['5_15', '5 à 15%'],
                                ['15_30', '15 à 30%'],
                                ['plus_30', 'Plus de 30%']
                              ].map(([value, label]) => (
                                <label key={value} className="flex items-center space-x-3 p-4 border rounded-lg bg-white hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="radio"
                                    name="pourcentagePerte"
                                    value={value}
                                    checked={getValue('capacitePertes.pourcentagePerte') === value}
                                    onChange={() => update('capacitePertes.pourcentagePerte', value)}
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
                    <p className="text-gray-700 mb-6">Voici un résumé de vos réponses :</p>

                    <div className="bg-gray-50 p-6 rounded-lg border max-w-4xl overflow-x-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800">
                        {JSON.stringify(form, null, 2)}
                      </pre>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                      <Button onClick={submit} className="bg-green-600 hover:bg-green-700">
                        Soumettre le questionnaire
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          localStorage.removeItem('investor_form_v1');
                          setForm(defaultForm());
                        }}
                      >
                        Réinitialiser
                      </Button>
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