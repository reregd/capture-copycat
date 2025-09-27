import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart } from 'recharts';
import { ArrowLeft, Plus, Settings, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Rachat {
  id: number;
  typeRachat: string;
  montantBrut: string;
  dateDebut: string;
  dateFin: string;
}

interface Versement {
  id: number;
  typeVersement: string;
  montantBrut: string;
  dateDebut: string;
  dateFin: string;
}

interface ProjectionDetaillee {
  annee: number;
  capitalFin: number;
  rachats: number;
  interets: number;
  impot: number;
  prelevementsSociaux: number;
  fiscaliteTotale: number;
}

export default function SimulateurAssuranceVie() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    client: "",
    situation: "",
    contratType: "",
    assureur: "",
    objectif: "",
    valeurRachat: "",
    typeContrat: "",
    limiteContrat: "",
    versementInitial: "10000",
    dateDebut: "2025-09-01",
    caseSortie: "",
    ageVersements: "",
    versementMensuel: "",
    tauxRendement: "",
    fraisGestion: "",
    compteEpargne: "Oui"
  });

  const [rachats, setRachats] = useState<Rachat[]>([{ id: 1, typeRachat: "", montantBrut: "", dateDebut: "", dateFin: "" }]);
  const [versements, setVersements] = useState<Versement[]>([{ id: 1, typeVersement: "mensuel", montantBrut: "100", dateDebut: "", dateFin: "" }]);
  const [modalitesGestion, setModalitesGestion] = useState({
    modeGestion: "Libre",
    contratInvesti: false,
    unitesCompte: 30,
    fondsEuros: 70,
    tauxRendementDebut: "1,89",
    compositionAllocation: 50,
    tauxRendementFondsEuros: "1,20",
    tauxRendementUnitesCompte: "3,50"
  });
  const [parametres, setParametres] = useState({
    tauxRevalorisation: { fondsEuros: "1,2", unitesCompte: "3,5" },
    fraisGestion: { fondsEuros: "0,75", unitesCompte: "0,9" },
    fraisVersements: { initial: "1", periodiques: "1", exceptionnels: "1" },
    indexationAnnuelle: "0",
    natureFlux: { versements: "", rachats: "" }
  });

  const addRachat = () => setRachats([...rachats, { id: rachats.length + 1, typeRachat: "", montantBrut: "", dateDebut: "", dateFin: "" }]);
  const updateRachat = (id: number, field: keyof Rachat, value: string) => setRachats(rachats.map(r => r.id === id ? { ...r, [field]: value } : r));
  const addVersement = () => setVersements([...versements, { id: versements.length + 1, typeVersement: "", montantBrut: "", dateDebut: "", dateFin: "" }]);
  const updateVersement = (id: number, field: keyof Versement, value: string) => setVersements(versements.map(v => v.id === id ? { ...v, [field]: value } : v));

  // ====== Fonction de simulation optimisée avec fiscalité détaillée ======
  function simulateProjectionOptimisee(
    versementInitial: number,
    dateDebut: Date,
    dureeAnnees: number,
    tauxFondsEuros: number,
    tauxUC: number,
    pourcentageFondsEuros: number,
    pourcentageUC: number,
    fraisFondsEuros: number,
    fraisUC: number,
    versements: Versement[],
    rachats: Rachat[],
    indexationAnnuelle: number,
    abattementAnnuel: number,
    PFU: boolean
  ): ProjectionDetaillee[] {
    const projections: ProjectionDetaillee[] = [];
    let capital = versementInitial;
    let cumulImpot = 0;
    let cumulPS = 0;

    for (let an = 1; an <= dureeAnnees; an++) {
      // ====== Calcul rendement net ======
      const rendementFondsEuros = (tauxFondsEuros - fraisFondsEuros) / 100;
      const rendementUC = (tauxUC - fraisUC) / 100;
      const rendement = (rendementFondsEuros * pourcentageFondsEuros + rendementUC * pourcentageUC) / 100;

      // ====== Intérêts annuels ======
      const interets = capital * rendement;

      // ====== Versements annuels indexés ======
      let versementsAnnee = 0;
      versements.forEach(v => {
        let montant = parseFloat(v.montantBrut || "0");
        if (v.typeVersement === "mensuel") montant *= 12;
        if (v.typeVersement === "trimestriel") montant *= 4;
        if (v.typeVersement === "annuel") montant *= 1;
        // indexation annuelle
        montant *= Math.pow(1 + indexationAnnuelle / 100, an - 1);
        versementsAnnee += montant;
      });

      capital += versementsAnnee;

      // ====== Rachats annuels ======
      let rachatsAnnee = 0;
      rachats.forEach(r => {
        let montant = parseFloat(r.montantBrut || "0");
        rachatsAnnee += montant;
      });

      // proportionnel aux intérêts
      const proportionInterets = interets / (capital + interets || 1);
      const interetsRaches = rachatsAnnee * proportionInterets;

      // ====== Fiscalité ======
      let interetsImposables = Math.max(interetsRaches - abattementAnnuel, 0);
      let impot = 0, ps = 0;
      if (rachatsAnnee > 0) {
        impot = PFU ? interetsImposables * 0.128 : interetsImposables * 0.30;
        ps = interetsRaches * 0.172;
      }
      cumulImpot += impot;
      cumulPS += ps;

      // ====== Capital fin d'année ======
      capital = capital + interets - rachatsAnnee - impot - ps;

      projections.push({
        annee: dateDebut.getFullYear() + an,
        capitalFin: capital,
        rachats: rachatsAnnee,
        interets,
        impot,
        prelevementsSociaux: ps,
        fiscaliteTotale: impot + ps
      });
    }

    return projections;
  }

  // ====== Données pour graphiques ======
  const duree = 10; // durée en années
  const initial = parseFloat(formData.versementInitial || "0");
  const dateDebut = new Date(formData.dateDebut || "2025-09-01");

  const projectionsBrut = simulateProjectionOptimisee(
    initial, dateDebut, duree,
    parseFloat(modalitesGestion.tauxRendementFondsEuros.replace(",", ".")),
    parseFloat(modalitesGestion.tauxRendementUnitesCompte.replace(",", ".")),
    modalitesGestion.fondsEuros, modalitesGestion.unitesCompte,
    parseFloat(parametres.fraisGestion.fondsEuros.replace(",", ".")),
    parseFloat(parametres.fraisGestion.unitesCompte.replace(",", ".")),
    versements, [], parseFloat(parametres.indexationAnnuelle || "0"),
    0, true
  );

  const projectionsNet = simulateProjectionOptimisee(
    initial, dateDebut, duree,
    parseFloat(modalitesGestion.tauxRendementFondsEuros.replace(",", ".")),
    parseFloat(modalitesGestion.tauxRendementUnitesCompte.replace(",", ".")),
    modalitesGestion.fondsEuros, modalitesGestion.unitesCompte,
    parseFloat(parametres.fraisGestion.fondsEuros.replace(",", ".")),
    parseFloat(parametres.fraisGestion.unitesCompte.replace(",", ".")),
    versements, rachats, parseFloat(parametres.indexationAnnuelle || "0"),
    4600, true
  );

  const chartData = projectionsBrut.map((p, i) => ({
    annee: p.annee,
    brut: Math.round(p.capitalFin),
    net: Math.round(projectionsNet[i]?.capitalFin || 0),
    interets: Math.round(projectionsNet[i]?.interets || 0),
    rachats: Math.round(projectionsNet[i]?.rachats || 0),
    impot: Math.round(projectionsNet[i]?.impot || 0),
    prelevementsSociaux: Math.round(projectionsNet[i]?.prelevementsSociaux || 0),
    fiscaliteTotale: Math.round(projectionsNet[i]?.fiscaliteTotale || 0)
  }));

  // Données pour le graphique de répartition fiscale
  const fiscaliteData = [
    { name: 'Capital net', value: chartData[chartData.length - 1]?.net || 0, color: '#16a34a' },
    { name: 'Impôts', value: chartData.reduce((sum, d) => sum + d.impot, 0), color: '#dc2626' },
    { name: 'Prélèvements sociaux', value: chartData.reduce((sum, d) => sum + d.prelevementsSociaux, 0), color: '#ea580c' }
  ];

  // Données pour l'évolution des composants
  const composantsData = chartData.map(d => ({
    annee: d.annee,
    capital: d.net,
    interetsCumules: chartData.slice(0, chartData.indexOf(d) + 1).reduce((sum, item) => sum + item.interets, 0)
  }));


  // ====== JSX ======
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-2xl border border-blue-200">
          <Button variant="ghost" size="sm" onClick={() => navigate("/simulateurs")} className="hover:bg-blue-100 flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Simulateur Assurance Vie
            </h1>
            <p className="text-sm sm:text-base text-blue-600 mt-1">Simulez l'évolution de votre contrat avec fiscalité détaillée</p>
          </div>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
        {/* Formulaire principal */}
        <div className="2xl:col-span-2 space-y-6 lg:space-y-8">
          <Tabs defaultValue="votre-projet" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="votre-projet">Votre projet</TabsTrigger>
              <TabsTrigger value="resultats-detailles">Résultats détaillés</TabsTrigger>
            </TabsList>

            <TabsContent value="votre-projet" className="space-y-6">
              {/* Situation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Situation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Date de naissance</Label>
                    <div className="flex gap-1 items-center">
                      <Input
                        placeholder="jj"
                        className="w-16"
                        maxLength={2}
                      />
                      <span>/</span>
                      <Input
                        placeholder="mm"
                        className="w-16"
                        maxLength={2}
                      />
                      <span>/</span>
                      <Input
                        placeholder="aaaa"
                        className="w-20"
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Encours des contrats d'assurance vie et de capitalisation détenus</Label>
                    <div className="space-y-3 mt-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">Lié aux primes versées avant le 27/09/2017</Label>
                        <div className="flex gap-2">
                          <Input />
                          <span className="flex items-center">€</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Lié aux primes versées à compter du 27/09/2017</Label>
                        <div className="flex gap-2">
                          <Input />
                          <span className="flex items-center">€</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Vous connaissez votre fiscalité</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label className="text-sm">Choix de la fiscalité</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="forfaitaire">Prélèvement forfaitaire</SelectItem>
                            <SelectItem value="bareme">Barème progressif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm">Abattement maximum disponible</Label>
                        <div className="flex gap-2">
                          <Input />
                          <span className="flex items-center">€</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Définition du projet */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Définition du projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Objectif</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un objectif" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="constitution">Constitution de capital</SelectItem>
                          <SelectItem value="complement">Complément de retraite</SelectItem>
                          <SelectItem value="transmission">Transmission</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Valeur recherchée</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="capital">Capital final</SelectItem>
                          <SelectItem value="versement">Versement nécessaire</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type de produit</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Assurance vie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assurance-vie">Assurance vie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Libellé du produit</Label>
                      <Input placeholder="Assurance vie" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Investissement en</Label>
                      <div className="flex gap-1 items-center">
                        <Input
                          placeholder="01"
                          className="w-16"
                          maxLength={2}
                        />
                        <span>/</span>
                        <Input
                          placeholder="09"
                          className="w-16"
                          maxLength={2}
                        />
                        <span>/</span>
                        <Input
                          placeholder="2025"
                          className="w-20"
                          maxLength={4}
                          value={formData.dateDebut ? new Date(formData.dateDebut).getFullYear() : "2025"}
                          onChange={(e) => setFormData({...formData, dateDebut: `${e.target.value}-09-01`})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Horizon de placement</Label>
                      <div className="flex gap-2 items-center">
                        <Input className="w-20" value={duree} readOnly />
                        <span>ans</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Versements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Versements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Versement initial brut</Label>
                    <div className="flex gap-2 items-center mt-2">
                      <Input
                        value={formData.versementInitial}
                        onChange={(e) => setFormData({...formData, versementInitial: e.target.value})}
                      />
                      <span>€</span>
                      <span className="text-sm text-muted-foreground">à la date du 01/09/2025</span>
                    </div>
                  </div>

                  {versements.map((versement) => (
                    <div key={versement.id} className="space-y-4 p-4 border rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Type de versement</Label>
                          <Select
                            value={versement.typeVersement}
                            onValueChange={(value) => updateVersement(versement.id, 'typeVersement', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mensuel">Mensuel</SelectItem>
                              <SelectItem value="trimestriel">Trimestriel</SelectItem>
                              <SelectItem value="annuel">Annuel</SelectItem>
                              <SelectItem value="exceptionnel">Exceptionnel</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Montant brut</Label>
                          <Input
                            value={versement.montantBrut}
                            onChange={(e) => updateVersement(versement.id, 'montantBrut', e.target.value)}
                            placeholder="Montant en €"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Date de début</Label>
                          <div className="flex gap-1 items-center">
                            <Input
                              placeholder="jj"
                              className="w-16"
                              maxLength={2}
                            />
                            <span>/</span>
                            <Input
                              placeholder="mm"
                              className="w-16"
                              maxLength={2}
                            />
                            <span>/</span>
                            <Input
                              placeholder="aaaa"
                              className="w-20"
                              maxLength={4}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Date de fin</Label>
                          <div className="flex gap-1 items-center">
                            <Input
                              placeholder="jj"
                              className="w-16"
                              maxLength={2}
                            />
                            <span>/</span>
                            <Input
                              placeholder="mm"
                              className="w-16"
                              maxLength={2}
                            />
                            <span>/</span>
                            <Input
                              placeholder="aaaa"
                              className="w-20"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVersement}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un versement
                  </Button>
                </CardContent>
              </Card>

              {/* Rachats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rachats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {rachats.map((rachat) => (
                    <div key={rachat.id} className="space-y-4 p-4 border rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Type de rachat</Label>
                          <Select
                            value={rachat.typeRachat}
                            onValueChange={(value) => updateRachat(rachat.id, 'typeRachat', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="partiel">Rachat partiel</SelectItem>
                              <SelectItem value="total">Rachat total</SelectItem>
                              <SelectItem value="programme">Rachat programmé</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Montant brut</Label>
                          <Input
                            value={rachat.montantBrut}
                            onChange={(e) => updateRachat(rachat.id, 'montantBrut', e.target.value)}
                            placeholder="Montant en €"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Date de début</Label>
                          <div className="flex gap-1 items-center">
                            <Input
                              placeholder="jj"
                              className="w-16"
                              maxLength={2}
                            />
                            <span>/</span>
                            <Input
                              placeholder="mm"
                              className="w-16"
                              maxLength={2}
                            />
                            <span>/</span>
                            <Input
                              placeholder="aaaa"
                              className="w-20"
                              maxLength={4}
                              value={rachat.dateDebut}
                              onChange={(e) => updateRachat(rachat.id, 'dateDebut', e.target.value)}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Date de fin</Label>
                          <div className="flex gap-1 items-center">
                            <Input
                              placeholder="jj"
                              className="w-16"
                              maxLength={2}
                            />
                            <span>/</span>
                            <Input
                              placeholder="mm"
                              className="w-16"
                              maxLength={2}
                            />
                            <span>/</span>
                            <Input
                              placeholder="aaaa"
                              className="w-20"
                              maxLength={4}
                              value={rachat.dateFin}
                              onChange={(e) => updateRachat(rachat.id, 'dateFin', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addRachat}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un rachat
                  </Button>
                </CardContent>
              </Card>

              {/* Modalités de gestion */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg">Modalités de gestion</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Paramètres</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 max-h-[600px] overflow-y-auto">
                        {/* Taux de revalorisation nets de frais de gestion */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Taux de revalorisation nets de frais de gestion</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Taux de rendement des fonds euros</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={parametres.tauxRevalorisation.fondsEuros}
                                  onChange={(e) => setParametres({
                                    ...parametres,
                                    tauxRevalorisation: {
                                      ...parametres.tauxRevalorisation,
                                      fondsEuros: e.target.value
                                    }
                                  })}
                                />
                                <span className="flex items-center">%</span>
                              </div>
                            </div>
                            <div>
                              <Label>Taux de rendement des Unités de Compte</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={parametres.tauxRevalorisation.unitesCompte}
                                  onChange={(e) => setParametres({
                                    ...parametres,
                                    tauxRevalorisation: {
                                      ...parametres.tauxRevalorisation,
                                      unitesCompte: e.target.value
                                    }
                                  })}
                                />
                                <span className="flex items-center">%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Frais de gestion */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Frais de gestion</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Frais de gestion des fonds euros</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={parametres.fraisGestion.fondsEuros}
                                  onChange={(e) => setParametres({
                                    ...parametres,
                                    fraisGestion: {
                                      ...parametres.fraisGestion,
                                      fondsEuros: e.target.value
                                    }
                                  })}
                                />
                                <span className="flex items-center">%</span>
                              </div>
                            </div>
                            <div>
                              <Label>Frais de gestion des Unités de Compte</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={parametres.fraisGestion.unitesCompte}
                                  onChange={(e) => setParametres({
                                    ...parametres,
                                    fraisGestion: {
                                      ...parametres.fraisGestion,
                                      unitesCompte: e.target.value
                                    }
                                  })}
                                />
                                <span className="flex items-center">%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Frais sur versements */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Frais sur versements</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Frais sur versement initial</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={parametres.fraisVersements.initial}
                                  onChange={(e) => setParametres({
                                    ...parametres,
                                    fraisVersements: {
                                      ...parametres.fraisVersements,
                                      initial: e.target.value
                                    }
                                  })}
                                />
                                <span className="flex items-center">%</span>
                              </div>
                            </div>
                            <div>
                              <Label>Frais sur versements périodiques</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={parametres.fraisVersements.periodiques}
                                  onChange={(e) => setParametres({
                                    ...parametres,
                                    fraisVersements: {
                                      ...parametres.fraisVersements,
                                      periodiques: e.target.value
                                    }
                                  })}
                                />
                                <span className="flex items-center">%</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label>Frais sur versements exceptionnels</Label>
                            <div className="flex gap-2 w-1/2">
                              <Input
                                value={parametres.fraisVersements.exceptionnels}
                                onChange={(e) => setParametres({
                                  ...parametres,
                                  fraisVersements: {
                                    ...parametres.fraisVersements,
                                    exceptionnels: e.target.value
                                  }
                                })}
                              />
                              <span className="flex items-center">%</span>
                            </div>
                          </div>
                        </div>

                        {/* Autres caractéristiques */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Autres caractéristiques</h3>
                          <div>
                            <Label>Indexation annuelle des versements périodiques</Label>
                            <div className="flex gap-2 items-center mt-2">
                              <span>Au taux de</span>
                              <Input
                                className="w-20"
                                value={parametres.indexationAnnuelle}
                                onChange={(e) => setParametres({
                                  ...parametres,
                                  indexationAnnuelle: e.target.value
                                })}
                              />
                              <span>%</span>
                            </div>
                          </div>
                        </div>

                        {/* Choix de la nature des flux */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Choix de la nature des flux</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Nature des versements</Label>
                              <Select
                                value={parametres.natureFlux.versements}
                                onValueChange={(value) => setParametres({
                                  ...parametres,
                                  natureFlux: {
                                    ...parametres.natureFlux,
                                    versements: value
                                  }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bruts">Bruts</SelectItem>
                                  <SelectItem value="nets">Nets</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Nature des rachats</Label>
                              <Select
                                value={parametres.natureFlux.rachats}
                                onValueChange={(value) => setParametres({
                                  ...parametres,
                                  natureFlux: {
                                    ...parametres.natureFlux,
                                    rachats: value
                                  }
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bruts">Bruts</SelectItem>
                                  <SelectItem value="nets">Nets</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline">Abandonner</Button>
                          <Button>Enregistrer</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mode de gestion de l'allocation */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Label className="text-sm font-medium">Mode de gestion de l'allocation</Label>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">{modalitesGestion.modeGestion}</div>

                    <div className="flex items-center space-x-2 mb-4">
                      <Switch
                        checked={modalitesGestion.contratInvesti}
                        onCheckedChange={(checked) => setModalitesGestion({
                          ...modalitesGestion,
                          contratInvesti: checked
                        })}
                      />
                      <Label className="text-sm">Contrat investi en fonds euro-croissance</Label>
                    </div>
                  </div>

                  {/* Répartition et graphique */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Unités de compte</Label>
                          <div className="flex gap-2">
                            <Input
                              value={modalitesGestion.unitesCompte}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setModalitesGestion({
                                  ...modalitesGestion,
                                  unitesCompte: value,
                                  fondsEuros: 100 - value
                                });
                              }}
                            />
                            <span className="flex items-center px-3 text-sm">%</span>
                          </div>
                        </div>
                        <div>
                          <Label>Fonds euros</Label>
                          <div className="flex gap-2">
                            <Input
                              value={modalitesGestion.fondsEuros}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setModalitesGestion({
                                  ...modalitesGestion,
                                  fondsEuros: value,
                                  unitesCompte: 100 - value
                                });
                              }}
                            />
                            <span className="flex items-center px-3 text-sm">%</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Taux de rendement net des fonds euros</span>
                          <div className="text-sm text-muted-foreground">{modalitesGestion.tauxRendementFondsEuros} %</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Taux de rendement net des unités de compte</span>
                          <div className="text-sm text-muted-foreground">{modalitesGestion.tauxRendementUnitesCompte} %</div>
                        </div>
                      </div>
                    </div>

                    {/* Graphique circulaire */}
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="w-48 h-48">
                          <svg className="w-full h-full" viewBox="0 0 200 200">
                            {/* Cercle de fond */}
                            <circle
                              cx="100"
                              cy="100"
                              r="80"
                              fill="none"
                              stroke="#f3f4f6"
                              strokeWidth="20"
                            />

                            {/* Segment Fonds euros */}
                            <circle
                              cx="100"
                              cy="100"
                              r="80"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="20"
                              strokeDasharray={`${(modalitesGestion.fondsEuros / 100) * 502.65} 502.65`}
                              strokeDashoffset="0"
                              transform="rotate(-90 100 100)"
                            />

                            {/* Segment Unités de compte */}
                            <circle
                              cx="100"
                              cy="100"
                              r="80"
                              fill="none"
                              stroke="#60a5fa"
                              strokeWidth="20"
                              strokeDasharray={`${(modalitesGestion.unitesCompte / 100) * 502.65} 502.65`}
                              strokeDashoffset={`-${(modalitesGestion.fondsEuros / 100) * 502.65}`}
                              transform="rotate(-90 100 100)"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Légendes en dessous du graphique */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
                            <span className="text-sm">Fonds euros</span>
                          </div>
                          <div className="font-semibold text-blue-600">{modalitesGestion.fondsEuros} %</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                            <span className="text-sm">Unités de compte</span>
                          </div>
                          <div className="font-semibold text-blue-400">{modalitesGestion.unitesCompte} %</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resultats-detailles" className="space-y-6">
              {/* Métriques de synthèse */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-green-700">Capital final net</div>
                    <div className="text-2xl font-bold text-green-800">
                      {(chartData[chartData.length - 1]?.net || 0).toLocaleString()} €
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-blue-700">Intérêts cumulés</div>
                    <div className="text-2xl font-bold text-blue-800">
                      {chartData.reduce((sum, d) => sum + d.interets, 0).toLocaleString()} €
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-red-700">Fiscalité totale</div>
                    <div className="text-2xl font-bold text-red-800">
                      {chartData.reduce((sum, d) => sum + d.fiscaliteTotale, 0).toLocaleString()} €
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="text-sm font-medium text-purple-700">Taux effectif</div>
                    <div className="text-2xl font-bold text-purple-800">
                      {(((chartData[chartData.length - 1]?.net || 0) / initial - 1) * 100 / duree).toFixed(1)}% /an
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Graphiques d'analyse */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Évolution du capital avec zone */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Évolution du capital</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250} className="min-h-[200px]">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorBrut" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="annee" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          formatter={(value) => [`${value.toLocaleString()}€`, '']}
                          labelStyle={{ color: '#1e293b' }}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="brut" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBrut)" name="Capital brut" />
                        <Area type="monotone" dataKey="net" stroke="#16a34a" fillOpacity={1} fill="url(#colorNet)" name="Capital net" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Répartition fiscale finale */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Répartition fiscale finale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250} className="min-h-[200px]">
                      <PieChart>
                        <Pie
                          data={fiscaliteData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          labelLine={false}
                        >
                          {fiscaliteData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value.toLocaleString()}€`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Évolution annuelle des intérêts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Intérêts et fiscalité par année</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250} className="min-h-[200px]">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="annee" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          formatter={(value) => [`${value.toLocaleString()}€`, '']}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="interets" fill="#3b82f6" name="Intérêts" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="impot" fill="#dc2626" name="Impôts" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="prelevementsSociaux" fill="#ea580c" name="Prélèvements sociaux" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Évolution des composants */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Composition du capital</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250} className="min-h-[200px]">
                      <AreaChart data={composantsData}>
                        <defs>
                          <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0.2}/>
                          </linearGradient>
                          <linearGradient id="colorInterets" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="annee" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          formatter={(value) => [`${value.toLocaleString()}€`, '']}
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="capital" stackId="1" stroke="#16a34a" fill="url(#colorCapital)" name="Capital net" />
                        <Area type="monotone" dataKey="interetsCumules" stackId="1" stroke="#3b82f6" fill="url(#colorInterets)" name="Intérêts cumulés" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Tableau détaillé amélioré */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Détail annuel complet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                          <th className="border border-slate-200 p-3 text-left font-semibold text-slate-700">Année</th>
                          <th className="border border-slate-200 p-3 text-right font-semibold text-slate-700">Capital fin</th>
                          <th className="border border-slate-200 p-3 text-right font-semibold text-blue-700">Intérêts</th>
                          <th className="border border-slate-200 p-3 text-right font-semibold text-orange-700">Rachats</th>
                          <th className="border border-slate-200 p-3 text-right font-semibold text-red-700">Impôt</th>
                          <th className="border border-slate-200 p-3 text-right font-semibold text-red-600">Prélèvements sociaux</th>
                          <th className="border border-slate-200 p-3 text-right font-semibold text-red-800">Fiscalité totale</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectionsNet.map((p, index) => (
                          <tr key={p.annee} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                            <td className="border border-slate-200 p-3 font-medium">{p.annee}</td>
                            <td className="border border-slate-200 p-3 text-right font-semibold text-green-700">
                              {Math.round(p.capitalFin).toLocaleString()} €
                            </td>
                            <td className="border border-slate-200 p-3 text-right text-blue-700">
                              {Math.round(p.interets).toLocaleString()} €
                            </td>
                            <td className="border border-slate-200 p-3 text-right text-orange-700">
                              {Math.round(p.rachats).toLocaleString()} €
                            </td>
                            <td className="border border-slate-200 p-3 text-right text-red-700">
                              {Math.round(p.impot).toLocaleString()} €
                            </td>
                            <td className="border border-slate-200 p-3 text-right text-red-600">
                              {Math.round(p.prelevementsSociaux).toLocaleString()} €
                            </td>
                            <td className="border border-slate-200 p-3 text-right font-semibold text-red-800">
                              {Math.round(p.fiscaliteTotale).toLocaleString()} €
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gradient-to-r from-slate-100 to-slate-200 font-bold">
                          <td className="border border-slate-300 p-3">TOTAL</td>
                          <td className="border border-slate-300 p-3 text-right text-green-800">
                            {Math.round(projectionsNet[projectionsNet.length - 1]?.capitalFin || 0).toLocaleString()} €
                          </td>
                          <td className="border border-slate-300 p-3 text-right text-blue-800">
                            {Math.round(projectionsNet.reduce((sum, p) => sum + p.interets, 0)).toLocaleString()} €
                          </td>
                          <td className="border border-slate-300 p-3 text-right text-orange-800">
                            {Math.round(projectionsNet.reduce((sum, p) => sum + p.rachats, 0)).toLocaleString()} €
                          </td>
                          <td className="border border-slate-300 p-3 text-right text-red-800">
                            {Math.round(projectionsNet.reduce((sum, p) => sum + p.impot, 0)).toLocaleString()} €
                          </td>
                          <td className="border border-slate-300 p-3 text-right text-red-700">
                            {Math.round(projectionsNet.reduce((sum, p) => sum + p.prelevementsSociaux, 0)).toLocaleString()} €
                          </td>
                          <td className="border border-slate-300 p-3 text-right text-red-900">
                            {Math.round(projectionsNet.reduce((sum, p) => sum + p.fiscaliteTotale, 0)).toLocaleString()} €
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panneau de résultats */}
        <div className="space-y-6 lg:space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Résultats</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250} className="min-h-[200px]">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBrutMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNetMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="annee"
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `${value}`}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value.toLocaleString()}€`,
                      name === 'brut' ? 'Sans fiscalité' : 'Avec fiscalité'
                    ]}
                    labelFormatter={(label) => `Année ${label}`}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="brut"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                    name="Sans fiscalité"
                  />
                  <Line
                    type="monotone"
                    dataKey="net"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2, fill: '#ffffff' }}
                    name="Avec fiscalité"
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-4 text-center mt-4">
                <div>
                  <h3 className="text-lg font-medium">Capital brut</h3>
                  <p className="text-xl font-bold text-blue-600">{chartData[chartData.length - 1]?.brut.toLocaleString() || 0} €</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Capital net</h3>
                  <p className="text-xl font-bold text-green-600">{chartData[chartData.length - 1]?.net.toLocaleString() || 0} €</p>
                </div>
              </div>

              <div className="text-center mt-2 text-red-600 font-semibold">
                Impact fiscal cumulé : {((chartData[chartData.length - 1]?.brut || 0) - (chartData[chartData.length - 1]?.net || 0)).toLocaleString()} €
              </div>
            </CardContent>
          </Card>

          {/* Nouvelles analyses graphiques */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 xl:gap-8">
            {/* Analyse de performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  Analyse de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250} className="min-h-[200px]">
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="annee" stroke="#64748b" fontSize={11} />
                    <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} />
                    <Tooltip
                      formatter={(value, name) => [`${value.toLocaleString()}€`, name]}
                      labelFormatter={(label) => `Année ${label}`}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area yAxisId="left" type="monotone" dataKey="interets" stackId="1" stroke="#8b5cf6" fill="url(#performanceGradient)" name="Intérêts" />
                    <Bar yAxisId="right" dataKey="fiscaliteTotale" fill="#ef4444" name="Fiscalité" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Analyse des risques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  Répartition des Flux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250} className="min-h-[200px]">
                  <RadarChart data={[
                    {
                      subject: 'Rendement',
                      A: Math.min(100, ((parseFloat(modalitesGestion.tauxRendementFondsEuros) || 1.2) / 5) * 100),
                      fullMark: 100
                    },
                    {
                      subject: 'Liquidité',
                      A: rachats.length > 0 ? 85 : 95,
                      fullMark: 100
                    },
                    {
                      subject: 'Fiscalité',
                      A: Math.max(20, 100 - ((projectionsNet.reduce((sum, p) => sum + p.fiscaliteTotale, 0) / Math.max(1, projectionsNet.reduce((sum, p) => sum + p.capitalFin, 0))) * 500)),
                      fullMark: 100
                    },
                    {
                      subject: 'Diversification',
                      A: modalitesGestion.unitesCompte || 30,
                      fullMark: 100
                    },
                    {
                      subject: 'Horizon',
                      A: Math.min(100, (10 / 30) * 100),
                      fullMark: 100
                    }
                  ]}>
                    <PolarGrid gridType="polygon" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <PolarRadiusAxis angle={0} domain={[0, 100]} tick={false} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Évaluation multifactorielle du contrat
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Indicateurs de performance avancés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                Indicateurs de Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-3 lg:p-4 rounded-lg border border-blue-200">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-blue-700">
                    {((Math.pow((chartData[chartData.length - 1]?.net || 0) / Math.max(1, parseFloat(formData.versementInitial) || 100000), 1 / 10) - 1) * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-blue-600 mt-1">Rendement annuel moyen</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 sm:p-3 lg:p-4 rounded-lg border border-green-200">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-green-700">
                    {((chartData[chartData.length - 1]?.net || 0) / Math.max(1, parseFloat(formData.versementInitial) || 100000) * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-green-600 mt-1">Rendement total</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-2 sm:p-3 lg:p-4 rounded-lg border border-orange-200">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-orange-700">
                    {(((chartData[chartData.length - 1]?.brut || 0) - (chartData[chartData.length - 1]?.net || 0)) / Math.max(1, chartData[chartData.length - 1]?.brut || 0) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-orange-600 mt-1">Taux d'imposition effectif</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-2 sm:p-3 lg:p-4 rounded-lg border border-purple-200">
                  <div className="text-base sm:text-lg lg:text-xl font-bold text-purple-700 break-words">
                    {Math.max(0, chartData[chartData.length - 1]?.net || 0) > (parseFloat(formData.versementInitial) || 100000) ? '+' : ''}{((chartData[chartData.length - 1]?.net || 0) - (parseFloat(formData.versementInitial) || 100000)).toLocaleString()}€
                  </div>
                  <div className="text-xs text-purple-600 mt-1">Plus-value nette</div>
                </div>
              </div>

              {/* Graphique de comparaison temporelle */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-4">Évolution comparative des gains</h4>
                <ResponsiveContainer width="100%" height={180} className="min-h-[150px]">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gainsBruts" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="gainsNets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="fiscalite" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="annee" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`} />
                    <Tooltip
                      formatter={(value, name) => [`${value.toLocaleString()}€`, name]}
                      labelFormatter={(label) => `Année ${label}`}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="interets" stackId="1" stroke="#10b981" fill="url(#gainsNets)" name="Gains nets" />
                    <Area type="monotone" dataKey="fiscaliteTotale" stackId="2" stroke="#ef4444" fill="url(#fiscalite)" name="Fiscalité" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
}