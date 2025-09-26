import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, AlertTriangle, Settings } from "lucide-react";

export default function DossierPrevoyance() {
  const { dossierId } = useParams<{ dossierId: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Prévoyance</h1>
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
            Modifier les besoins
          </Button>
        </div>
      </div>

      <Tabs defaultValue="deces" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deces">Décès</TabsTrigger>
          <TabsTrigger value="arret-travail">Arrêt de travail</TabsTrigger>
          <TabsTrigger value="invalidite">Invalidité</TabsTrigger>
        </TabsList>

        <TabsContent value="deces" className="mt-6">
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Romain alexandre antoine BINELLI</CardTitle>
                <p className="text-sm text-muted-foreground">En cas de décès le 01/10/2025</p>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <p className="text-sm text-blue-700">
                    À partir des éléments renseignés dans votre dossier, Big n'a déterminé aucune garantie décès.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Besoins de couverture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span>Besoins de couverture</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-2xl font-bold text-muted-foreground mb-2">Non évalués</div>
                  <p className="text-sm text-muted-foreground">
                    Renseignez vos charges et objectifs pour évaluer vos besoins
                  </p>
                  <Button className="mt-4" variant="outline" size="sm">
                    Définir les besoins
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Garanties actuelles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>Garanties actuelles</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-2xl font-bold text-muted-foreground mb-2">Aucune</div>
                  <p className="text-sm text-muted-foreground">
                    Aucune garantie décès renseignée
                  </p>
                  <Button className="mt-4" variant="outline" size="sm">
                    Ajouter une garantie
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommandations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  <span>Recommandations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-2xl font-bold text-muted-foreground mb-2">À définir</div>
                  <p className="text-sm text-muted-foreground">
                    Complétez vos informations pour obtenir des recommandations
                  </p>
                  <Button className="mt-4" variant="outline" size="sm">
                    Analyser
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Analyse détaillée</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Évaluation des besoins</h4>
                      <p className="text-sm text-muted-foreground">
                        Pour une analyse complète, renseignez vos charges courantes et vos objectifs patrimoniaux.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Garanties existantes</h4>
                      <p className="text-sm text-muted-foreground">
                        Inventoriez vos contrats de prévoyance actuels pour identifier les gaps de couverture.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Optimisation fiscale</h4>
                      <p className="text-sm text-muted-foreground">
                        Certaines garanties peuvent bénéficier d'avantages fiscaux selon votre situation.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="arret-travail">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Arrêt de travail</h2>
            <p className="text-muted-foreground">
              Analyse des garanties en cas d'arrêt de travail temporaire
            </p>
          </div>
        </TabsContent>

        <TabsContent value="invalidite">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Invalidité</h2>
            <p className="text-muted-foreground">
              Couverture en cas d'invalidité permanente
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}