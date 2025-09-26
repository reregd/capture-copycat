import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calculator, FileText, TrendingUp, AlertCircle } from "lucide-react";

export default function DossierTransmission() {
  const { dossierId } = useParams<{ dossierId: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Transmission</h1>
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
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Hypothèses
            </Button>
            <Button variant="outline" size="sm">
              Passifs et frais
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="synthese" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="synthese">Synthèse</TabsTrigger>
          <TabsTrigger value="liberalites">Libéralités</TabsTrigger>
          <TabsTrigger value="deces">Décès</TabsTrigger>
        </TabsList>

        <TabsContent value="synthese" className="mt-6">
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Romain alexandre antoine BINELLI</CardTitle>
                <p className="text-sm text-muted-foreground">Décès le 23/09/2025</p>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transmission nette */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Transmission nette</span>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-4">0 €</div>
                <p className="text-sm text-muted-foreground mb-6">
                  dont 0 € d'héritage net et 0 € de capitaux décès nets
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Répartition par bénéficiaire</h4>
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">Aucun bénéficiaire défini</p>
                      <Button className="mt-2" variant="outline" size="sm">
                        Définir les bénéficiaires
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Frais et prélèvements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Frais et prélèvements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-6">0 €</div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Frais de succession</div>
                      <div className="text-lg">0 €</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Droits de succession</div>
                      <div className="text-lg">0 €</div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>la succession ne génère pas de droits de succession</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patrimoine transmissible */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patrimoine transmissible</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8 081 €</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Valeur du patrimoine au décès
                </p>
              </CardContent>
            </Card>

            {/* Passifs à déduire */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Passifs à déduire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0 €</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Dettes et frais déductibles
                </p>
              </CardContent>
            </Card>

            {/* Actif net successoral */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actif net successoral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8 081 €</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Base de calcul des droits
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Optimisations possibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Donations du vivant</h4>
                      <p className="text-sm text-muted-foreground">
                        Profitez des abattements renouvelables tous les 15 ans pour réduire les droits futurs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Assurance-vie</h4>
                      <p className="text-sm text-muted-foreground">
                        Optimisez la transmission via l'assurance-vie pour bénéficier d'abattements spécifiques.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-medium">Démembrement</h4>
                      <p className="text-sm text-muted-foreground">
                        Considérez les stratégies de démembrement pour optimiser la transmission.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="liberalites">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Libéralités</h2>
            <p className="text-muted-foreground">
              Gestion des donations et libéralités
            </p>
          </div>
        </TabsContent>

        <TabsContent value="deces">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Simulation de décès</h2>
            <p className="text-muted-foreground">
              Calculs détaillés en cas de décès
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}