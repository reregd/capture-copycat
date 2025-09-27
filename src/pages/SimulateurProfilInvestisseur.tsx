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
      riskProfile: {
        riskTolerance: null,
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

  function goNext() {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
  }

  function goPrev() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
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
                    <div className="ml-3">
                      <div className={`text-sm font-medium ${idx === currentStep ? 'text-blue-800' : 'text-gray-600'}`}>
                        {label}
                      </div>
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

                {currentStep === 1 && (
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

                {currentStep === 2 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Connaissance — familles de produits</h2>

                    <p className="text-gray-700 mb-6">Connaissez-vous les familles de produits suivantes ?</p>

                    <div className="max-w-3xl space-y-4">
                      {[
                        ['assuranceVie','Assurance-vie et capitalisation'],
                        ['peaEtTitres','PEA et comptes-titres'],
                        ['epargneRetraiteEtEntreprise','Épargne retraite et entreprise']
                      ].map(([key, label]) => (
                        <div key={key} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                          <div className="text-sm font-medium">{label}</div>
                          <div className="flex space-x-2">
                            <Button
                              variant={getValue(`familiesKnowledge.${key}`) === true ? "default" : "outline"}
                              size="sm"
                              onClick={() => update(`familiesKnowledge.${key}`, true)}
                            >
                              Oui
                            </Button>
                            <Button
                              variant={getValue(`familiesKnowledge.${key}`) === false ? "default" : "outline"}
                              size="sm"
                              onClick={() => update(`familiesKnowledge.${key}`, false)}
                            >
                              Non
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button onClick={goNext}>Suivant</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 3 && (
                  <section>
                    <h2 className="text-xl font-semibold mb-3">Profil de risque</h2>
                    <p className="text-gray-700 mb-6">Évaluons votre tolérance au risque</p>

                    <div className="max-w-2xl space-y-6">
                      <div>
                        <Label className="text-sm mb-3 block">Si votre portefeuille perdait 20% en 6 mois, quelle serait votre réaction ?</Label>
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

                      <div className="flex items-center space-x-3 pt-4">
                        <Button variant="outline" onClick={goPrev}>← Revenir</Button>
                        <Button onClick={goNext}>Suivant</Button>
                      </div>
                    </div>
                  </section>
                )}

                {currentStep === 4 && (
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

                {currentStep === 5 && (
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