import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, TrendingUp, Plus, FileText } from "lucide-react";

export default function DossierStrategies() {
  const { dossierId } = useParams<{ dossierId: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Stratégies</h1>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">Evaluation : 23/09/2025</span>
          <Button variant="outline" size="sm">
            Mettre à jour O2S
          </Button>
          <Button variant="outline" size="sm">
            Transferts
          </Button>
          <Button variant="outline" size="sm">
            Editions
          </Button>
          <Button variant="outline" size="sm">
            Synthèse à rédiger
          </Button>
        </div>
      </div>

      <Tabs defaultValue="objectifs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="objectifs">Objectifs & Préconisations</TabsTrigger>
          <TabsTrigger value="profil">Profil d'investisseur</TabsTrigger>
        </TabsList>

        <TabsContent value="objectifs" className="mt-6">
          <div className="space-y-6">
            {/* Section Objectifs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Objectifs et préconisations</span>
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un objectif
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Aucun objectif défini</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Commencez par définir les objectifs patrimoniaux de votre client pour pouvoir établir des préconisations personnalisées.
                  </p>
                  <div className="space-y-3">
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" size="sm">
                        Optimisation fiscale
                      </Button>
                      <Button variant="outline" size="sm">
                        Préparation retraite
                      </Button>
                      <Button variant="outline" size="sm">
                        Constitution épargne
                      </Button>
                      <Button variant="outline" size="sm">
                        Transmission patrimoine
                      </Button>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button variant="outline" size="sm">
                        Acquisition immobilière
                      </Button>
                      <Button variant="outline" size="sm">
                        Protection famille
                      </Button>
                      <Button variant="outline" size="sm">
                        Diversification placements
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Préconisations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Préconisations stratégiques</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Les préconisations apparaîtront automatiquement une fois les objectifs définis et l'analyse patrimoniale complétée.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section Suivi des recommandations */}
            <Card>
              <CardHeader>
                <CardTitle>Suivi des recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">Aucune recommandation en cours de suivi</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Actions suggérées :</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Compléter l'analyse patrimoniale (actifs, passifs, revenus)</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Définir le profil de risque et les objectifs d'investissement</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>Analyser la situation fiscale et les optimisations possibles</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Évaluer les besoins de prévoyance et de transmission</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profil">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil d'investisseur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Profil non évalué</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Réalisez un questionnaire d'évaluation pour déterminer le profil de risque de votre client.
                  </p>
                  <Button>
                    Démarrer l'évaluation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Horizon d'investissement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="text-2xl font-bold text-muted-foreground">Non défini</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tolérance au risque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="text-2xl font-bold text-muted-foreground">Non évaluée</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Capacité financière</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="text-2xl font-bold text-muted-foreground">À analyser</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations d'allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">
                    Les recommandations d'allocation d'actifs seront générées après l'évaluation du profil d'investisseur.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}