import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  Plus,
  Printer,
  Calendar,
  ArrowRightLeft,
  Edit
} from "lucide-react";

// Mock data
const dossierData = {
  "831d03fe-1b9c-4859-a44d-bb9c1ea8e48a": {
    id: "831d03fe-1b9c-4859-a44d-bb9c1ea8e48a",
    client: {
      name: "Romain alexandre antoine BINELLI",
      age: "39 ans",
      profession: "Salarié cadre"
    },
    familySituation: {
      status: "Célibataire"
    },
    people: [],
    evaluation: "23/09/2025"
  }
};

export default function DossierFamille() {
  const { dossierId } = useParams<{ dossierId: string }>();
  const dossier = dossierData[dossierId as keyof typeof dossierData];

  if (!dossier) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">Dossier non trouvé</h1>
        <Link to="/dossiers" className="text-primary hover:underline">
          Retourner à la liste des dossiers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation des onglets principaux */}
      <div className="border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">Evaluation : {dossier.evaluation}</span>
            <Button variant="outline" size="sm">
              Mettre à jour O2S
            </Button>
            <Button variant="outline" size="sm">
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Transferts
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Editions
            </Button>
          </div>
        </div>

        <Tabs defaultValue="famille" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dossier">Dossier</TabsTrigger>
            <TabsTrigger value="famille">Famille</TabsTrigger>
            <TabsTrigger value="retraite">
              <div className="flex items-center space-x-1">
                <span>Retraite</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="patrimoine">
              <div className="flex items-center space-x-1">
                <span>Patrimoine & Budget</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="fiscalite">
              <div className="flex items-center space-x-1">
                <span>Fiscalité</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="prevoyance">
              <div className="flex items-center space-x-1">
                <span>Prévoyance</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="transmission">
              <div className="flex items-center space-x-1">
                <span>Transmission</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="strategies">
              <div className="flex items-center space-x-1">
                <span>Stratégies</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dossier" className="mt-6">
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-foreground">Dossier</h1>

              {/* En-tête du dossier */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Dossier créé le 23/09/2025 à 10h05</h2>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Dossier de référence
                  </Button>
                  <Button variant="outline" size="sm">
                    Modifier le titre du dossier
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section Client */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Client</CardTitle>
                    <Button variant="outline" size="sm">
                      Accéder à la fiche client
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg">{dossier.client.name}</h3>
                      <p className="text-sm text-muted-foreground">{dossier.client.age}</p>
                      <p className="text-sm text-muted-foreground">{dossier.client.profession}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Section Synthèse à rédiger */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Synthèse à rédiger</CardTitle>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-4">
                        Rédiger une synthèse du dossier en vue de l'intégrer à l'édition complète pour la remettre à votre client.
                      </p>
                      <div className="bg-gray-50 p-3 rounded text-xs">
                        <p className="font-medium mb-2">Rappel de la réglementation :</p>
                        <p>
                          Les informations collectées dans les zones de saisie libre sur les personnes doivent respecter les dispositions légales en vigueur et notamment elles doivent être adéquates, pertinentes et non excessives au regard de la finalité du traitement envisagé. Les commentaires ne doivent donc pas notamment être inappropriés, subjectifs et insultants.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section Situation familiale */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Situation familiale</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">{dossier.familySituation.status}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="famille" className="mt-6">
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-foreground">Famille</h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section Client */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Client</CardTitle>
                    <Button variant="outline" size="sm">
                      Accéder à la fiche client
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg">{dossier.client.name}</h3>
                      <p className="text-sm text-muted-foreground">{dossier.client.age}</p>
                      <p className="text-sm text-muted-foreground">{dossier.client.profession}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Section Liste des personnes */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Liste des personnes</CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {dossier.people.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">Aucune personne ajoutée</p>
                        <p className="text-xs">Cliquez sur "Ajouter" pour commencer</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dossier.people.map((person, index) => (
                          <div key={index} className="p-3 border rounded">
                            {/* Contenu des personnes */}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Section Situation familiale */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Situation familiale</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">{dossier.familySituation.status}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="retraite">
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-foreground">Retraite</h1>

              <Tabs defaultValue="synthese" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="synthese">Synthèse</TabsTrigger>
                  <TabsTrigger value="reconstitution">Reconstitution de carrière</TabsTrigger>
                  <TabsTrigger value="points">Points de retraite</TabsTrigger>
                  <TabsTrigger value="trimestres">Trimestres</TabsTrigger>
                  <TabsTrigger value="comparatif">Comparatif</TabsTrigger>
                </TabsList>

                <div className="flex items-center justify-end mt-4 space-x-3">
                  <Button variant="outline" size="sm">
                    Hypothèses
                  </Button>
                  <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                    <option value="resultats-mensuels">Résultats mensuels</option>
                    <option value="resultats-annuels">Résultats annuels</option>
                  </select>
                </div>

                <TabsContent value="synthese" className="mt-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Romain alexandre antoine BINELLI</h2>
                    <p className="text-sm text-muted-foreground">Retraite à 67 ans le 01/12/2052</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Retraite nette</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold mb-2">0 € / mois</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Activité actuelle</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <p className="text-sm text-muted-foreground">
                            Aucune période d'activité renseignée.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="reconstitution" className="mt-6">
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Reconstitution de carrière</h2>
                    <p className="text-muted-foreground">
                      Reconstitution de la carrière professionnelle pour le calcul des droits à la retraite
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="points" className="mt-6">
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Points de retraite</h2>
                    <p className="text-muted-foreground">
                      Calcul et évolution des points acquis dans les différents régimes
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="trimestres" className="mt-6">
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Trimestres</h2>
                    <p className="text-muted-foreground">
                      Nombre de trimestres cotisés et trimestres requis pour la retraite à taux plein
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="comparatif" className="mt-6">
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Comparatif</h2>
                    <p className="text-muted-foreground">
                      Comparaison des différents scénarios de départ à la retraite
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="patrimoine">
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-foreground">Patrimoine & Budget</h1>

              <Tabs defaultValue="synthese" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="synthese">Synthèse</TabsTrigger>
                  <TabsTrigger value="societes">Sociétés</TabsTrigger>
                  <TabsTrigger value="actifs">Actifs</TabsTrigger>
                  <TabsTrigger value="passifs">Passifs</TabsTrigger>
                  <TabsTrigger value="revenus">Revenus</TabsTrigger>
                  <TabsTrigger value="charges">Charges</TabsTrigger>
                  <TabsTrigger value="projection">Projection</TabsTrigger>
                </TabsList>

                <TabsContent value="synthese" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Patrimoine net */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Patrimoine net</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4">8 081 €</div>
                        <div className="flex items-end space-x-2 h-32">
                          <div className="flex flex-col items-center">
                            <div className="w-16 bg-blue-500 mb-2" style={{height: '80px'}}></div>
                            <span className="text-xs text-center">Actifs financiers<br/>8 081 €</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-16 bg-teal-500 mb-2" style={{height: '80px'}}></div>
                            <span className="text-xs text-center">Patrimoine net<br/>8 081 €</span>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-teal-500"></div>
                            <span>Patrimoine net: 8 081 €</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500"></div>
                            <span>Actifs financiers: 8 081 €</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-300"></div>
                            <span>Actifs non financiers: 0 €</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500"></div>
                            <span>Passifs: 0 €</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Actifs */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Actifs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4">8 081 €</div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Épargne retraite et salariale</span>
                              <span>8 081 €</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div className="bg-teal-500 h-4 rounded-full" style={{width: '100%'}}></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Actifs financiers */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Actifs financiers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4">8 081 €</div>
                        <div className="flex justify-center mb-4">
                          <div className="relative w-32 h-32">
                            <div className="absolute inset-0 rounded-full border-8 border-teal-500"></div>
                            <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                              <span className="text-xs text-center">100%</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-teal-500"></div>
                            <span>Épargne retraite et salariale: 8 081 €</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Revenus perçus en 2025 */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenus perçus en 2025</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">0 €</div>
                      </CardContent>
                    </Card>

                    {/* Endettement */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Endettement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">0 %</div>
                      </CardContent>
                    </Card>

                    {/* Projection patrimoniale et budgétaire */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Projection patrimoniale et budgétaire</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end space-x-1 h-32">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div className="w-full bg-teal-500 mb-1" style={{height: '60px'}}></div>
                              <span className="text-xs">{2025 + i}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          Évolution sur 10 ans
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="societes" className="mt-6">
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Sociétés</h2>
                    <p className="text-muted-foreground">
                      Gestion des participations et structures sociétaires
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="actifs" className="mt-6">
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Actifs</h2>
                    <p className="text-muted-foreground">
                      Détail des actifs financiers et non financiers
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="passifs" className="mt-6">
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Passifs</h2>
                    <p className="text-muted-foreground">
                      Détail des dettes et engagements
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="revenus" className="mt-6">
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Revenus</h2>
                    <p className="text-muted-foreground">
                      Analyse des revenus et leur évolution
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="charges" className="mt-6">
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Charges</h2>
                    <p className="text-muted-foreground">
                      Détail des charges et dépenses
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="projection" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Projection patrimoniale et budgétaire</h2>
                      <Button variant="outline" size="sm">
                        Exporter vers Excel
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>Projection sur 10 ans à partir de 2025</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        ✏️
                      </Button>
                    </div>

                    <Tabs defaultValue="patrimoine" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="patrimoine">Patrimoine</TabsTrigger>
                        <TabsTrigger value="budget">Budget</TabsTrigger>
                        <TabsTrigger value="impot">Impôt sur le revenu</TabsTrigger>
                      </TabsList>

                      <TabsContent value="patrimoine" className="mt-6">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-3 w-16 bg-gray-50">&nbsp;</th>
                                <th className="text-left p-3 w-24 bg-gray-50">&nbsp;</th>
                                <th className="text-left p-3 w-48 bg-gray-50">&nbsp;</th>
                                <th className="text-center p-3 bg-gray-50 border-l">23/09/2025</th>
                                <th className="text-center p-3 bg-gray-50">2025</th>
                                <th className="text-center p-3 bg-gray-50">2026</th>
                                <th className="text-center p-3 bg-gray-50">2027</th>
                                <th className="text-center p-3 bg-gray-50">2028</th>
                                <th className="text-center p-3 bg-gray-50">2029</th>
                                <th className="text-center p-3 bg-gray-50">2030</th>
                                <th className="text-center p-3 bg-gray-50">2031</th>
                                <th className="text-center p-3 bg-gray-50">2032</th>
                                <th className="text-center p-3 bg-gray-50">2033</th>
                                <th className="text-center p-3 bg-gray-50">2034</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    ⊖
                                  </Button>
                                </td>
                                <td className="p-3 font-medium">1</td>
                                <td className="p-3 font-medium">Actifs</td>
                                <td className="text-center p-3 border-l">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                              </tr>
                              <tr className="border-b hover:bg-gray-50">
                                <td className="p-3">
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    ⊕
                                  </Button>
                                </td>
                                <td className="p-3">&nbsp;</td>
                                <td className="p-3 pl-8">Épargne retraite et salariale</td>
                                <td className="text-center p-3 border-l">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                                <td className="text-center p-3">8 081 €</td>
                              </tr>
                              <tr className="border-b hover:bg-gray-50 bg-blue-50">
                                <td className="p-3">&nbsp;</td>
                                <td className="p-3">&nbsp;</td>
                                <td className="p-3 font-medium">Actif net</td>
                                <td className="text-center p-3 border-l font-medium">8 081 €</td>
                                <td className="text-center p-3 font-medium">8 081 €</td>
                                <td className="text-center p-3 font-medium">8 081 €</td>
                                <td className="text-center p-3 font-medium">8 081 €</td>
                                <td className="text-center p-3 font-medium">8 081 €</td>
                                <td className="text-center p-3 font-medium">8 081 €</td>
                                <td className="text-center p-3 font-medium">8 081 €</td>
                                <td className="text-center p-3 font-medium">8 081 €</td>
                                <td className="text-center p-3 font-medium">8 081 €</td>
                                <td className="text-center p-3 font-medium">8 081 €</td>
                                <td className="text-center p-3 font-medium">8 081 €</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </TabsContent>

                      <TabsContent value="budget" className="mt-6">
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Tableau des projections budgétaires</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="impot" className="mt-6">
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Tableau des projections d'impôt sur le revenu</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="fiscalite">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Fiscalité</h1>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">2042</Button>
                  <Button variant="outline" size="sm">2044</Button>
                  <Button variant="outline" size="sm">IFI</Button>
                  <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                    <option value="autres">Autres déclarations</option>
                  </select>
                </div>
              </div>

              <Tabs defaultValue="synthese" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="synthese">Synthèse</TabsTrigger>
                  <TabsTrigger value="resultats">Résultats</TabsTrigger>
                </TabsList>

                <TabsContent value="synthese" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Imposition totale - Large card spanning 2 columns */}
                    <div className="lg:col-span-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Imposition totale</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-4xl font-bold mb-6">0 €</div>

                          <Tabs defaultValue="revenu" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="revenu">Impôt sur le revenu</TabsTrigger>
                              <TabsTrigger value="fortune">Impôt sur la fortune immobilière</TabsTrigger>
                            </TabsList>

                            <TabsContent value="revenu" className="mt-4">
                              <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded">
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Retenues et acomptes 2024</p>
                                      <p className="font-semibold">0 €</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Solde à payer 2025</p>
                                      <p className="font-semibold">0 €</p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground">Ces montants sont estimés ⓘ</p>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <p className="text-sm font-medium mb-2">Contributions sur les hauts revenus ⓘ</p>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-muted-foreground">Exceptionnelle</p>
                                        <p className="font-semibold">0 €</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Différentielle Supprimée</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm">Revenus de placement :</span>
                                      <span className="text-sm">Aucun revenu</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Revenus fonciers :</span>
                                      <span className="text-sm">Aucun revenu</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm">Revenus exceptionnels (quotient) :</span>
                                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600">Non</Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="fortune" className="mt-4">
                              <div className="text-center py-8">
                                <p className="text-muted-foreground">Graphique non applicable dans votre situation.</p>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Action buttons column */}
                    <div className="space-y-6">
                      <Card className="text-center">
                        <CardContent className="pt-6">
                          <div className="mb-4">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="font-semibold mb-2">Avis d'imposition</h3>
                            <Button variant="outline" size="sm">Visualiser</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="text-center">
                        <CardContent className="pt-6">
                          <div className="mb-4">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <h3 className="font-semibold mb-2">Optimisation de l'IR</h3>
                            <Button variant="outline" size="sm">Simuler</Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="text-center">
                        <CardContent className="pt-6">
                          <div className="mb-4">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                              </svg>
                            </div>
                            <h3 className="font-semibold mb-2">Évolution du barème</h3>
                            <Button variant="outline" size="sm">Simuler</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Taux marginal d'imposition */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Taux marginal d'imposition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold mb-4">0 %</div>
                        <div className="text-sm">
                          <p className="text-muted-foreground mb-2">Revenu imposable</p>
                          <p className="font-semibold">0 €</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="resultats" className="mt-6">
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-4">Résultats</h2>
                    <p className="text-muted-foreground">
                      Détail des calculs et résultats fiscaux
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="prevoyance">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Prévoyance</h1>
                <Button variant="outline" size="sm">
                  Modifier les besoins
                </Button>
              </div>

              <Tabs defaultValue="deces" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="deces">Décès</TabsTrigger>
                  <TabsTrigger value="arret">Arrêt de travail</TabsTrigger>
                  <TabsTrigger value="invalidite">Invalidité</TabsTrigger>
                </TabsList>

                <TabsContent value="deces" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Romain alexandre antoine BINELLI</h2>
                      <p className="text-sm text-muted-foreground">En cas de décès le 01/10/2025</p>
                    </div>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            À partir des éléments renseignés dans votre dossier, Big n'a déterminé aucune garantie décès.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="arret" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Romain alexandre antoine BINELLI</h2>
                      <p className="text-sm text-muted-foreground">Garanties arrêt de travail</p>
                    </div>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            À partir des éléments renseignés dans votre dossier, Big n'a déterminé aucune garantie arrêt de travail.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="invalidite" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Romain alexandre antoine BINELLI</h2>
                      <p className="text-sm text-muted-foreground">Garanties invalidité</p>
                    </div>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            À partir des éléments renseignés dans votre dossier, Big n'a déterminé aucune garantie invalidité.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="transmission">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Transmission</h1>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
                    Hypothèses
                  </Button>
                  <Button variant="outline" size="sm">
                    Passifs et frais
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="synthese" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="synthese">Synthèse</TabsTrigger>
                  <TabsTrigger value="liberalites">Libéralités</TabsTrigger>
                  <TabsTrigger value="deces">Décès</TabsTrigger>
                </TabsList>

                <TabsContent value="synthese" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Romain alexandre antoine BINELLI</h2>
                      <p className="text-sm text-muted-foreground">Décès le 23/09/2025</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Transmission nette */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center space-x-2">
                            <CardTitle>Transmission nette</CardTitle>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-4xl font-bold mb-2">0 €</div>
                          <p className="text-sm text-muted-foreground">
                            dont 0 € d'héritage net et 0 € de capitaux décès nets
                          </p>
                        </CardContent>
                      </Card>

                      {/* Frais et prélèvements */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Frais et prélèvements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-4xl font-bold">0 €</div>
                        </CardContent>
                      </Card>

                      {/* Droits de succession */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Droits de succession</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-4xl font-bold mb-2">0 €</div>
                          <p className="text-sm text-blue-600">
                            la succession ne génère pas de droits de succession
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="liberalites" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Romain alexandre antoine BINELLI</h2>
                      <p className="text-sm text-muted-foreground">Libéralités et donations</p>
                    </div>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            Aucune libéralité ou donation renseignée dans le dossier.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="deces" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Romain alexandre antoine BINELLI</h2>
                      <p className="text-sm text-muted-foreground">Analyse au décès</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Actif successoral */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Actif successoral</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold mb-4">0 €</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Patrimoine privé</span>
                              <span>0 €</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Assurance vie</span>
                              <span>0 €</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Passif successoral */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Passif successoral</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold mb-4">0 €</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Dettes</span>
                              <span>0 €</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Frais de succession</span>
                              <span>0 €</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="strategies">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Stratégies</h1>
                <Button variant="outline" size="sm">
                  Synthèse à rédiger
                </Button>
              </div>

              <Tabs defaultValue="objectifs" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="objectifs">Objectifs & Préconisations</TabsTrigger>
                  <TabsTrigger value="profil">Profil d'investisseur</TabsTrigger>
                </TabsList>

                <TabsContent value="objectifs" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">Objectifs et préconisations</h2>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un objectif
                      </Button>
                    </div>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold mb-2 text-muted-foreground">Aucun objectif défini</h3>
                          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                            Commencez par ajouter un objectif pour établir une stratégie personnalisée.
                          </p>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter votre premier objectif
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="profil" className="mt-6">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Profil d'investisseur</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Tolérance au risque */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Tolérance au risque</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <p className="text-muted-foreground">Non défini</p>
                            <Button variant="link" size="sm" className="mt-2">
                              Évaluer le profil
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Horizon d'investissement */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Horizon d'investissement</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <p className="text-muted-foreground">Non défini</p>
                            <Button variant="link" size="sm" className="mt-2">
                              Définir l'horizon
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Allocation recommandée */}
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle>Allocation recommandée</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            </div>
                            <p className="text-muted-foreground mb-4">
                              L'allocation sera générée automatiquement après la définition du profil d'investisseur.
                            </p>
                            <Button variant="outline" size="sm">
                              Commencer l'évaluation
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}