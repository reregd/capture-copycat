import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calculator, FileText, TrendingUp } from "lucide-react";

export default function DossierFiscalite() {
  const { dossierId } = useParams<{ dossierId: string }>();
  const [selectedYear, setSelectedYear] = useState("2042");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Fiscalité</h1>
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
        </div>
      </div>

      <Tabs defaultValue="synthese" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="synthese">Synthèse</TabsTrigger>
            <TabsTrigger value="resultats">Résultats</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Button
              variant={selectedYear === "2042" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear("2042")}
            >
              2042
            </Button>
            <Button
              variant={selectedYear === "2044" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear("2044")}
            >
              2044
            </Button>
            <Button
              variant={selectedYear === "IFI" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear("IFI")}
            >
              IFI
            </Button>
            <Button variant="outline" size="sm">
              Autres déclarations ⌄
            </Button>
          </div>
        </div>

        <TabsContent value="synthese" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Imposition totale */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>Imposition totale</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="text-primary">
                      Impôt sur le revenu
                    </Button>
                    <Button variant="ghost" size="sm">
                      Impôt sur la fortune immobilière
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-6">0 €</div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">Retenues et acomptes 2024</div>
                      <div className="text-lg font-semibold">0 €</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Solde à payer 2025</div>
                      <div className="text-lg font-semibold">0 €</div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground flex items-center space-x-1">
                    <span>Ces montants sont estimés</span>
                    <div className="w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-[8px]">?</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm font-medium mb-2">Contributions sur les hauts revenus</div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Exceptionnelle</span>
                        <div>0 €</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Différentielle</span>
                        <div>Supprimée</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Revenus de placement :</span>
                      <span className="font-medium">Aucun revenu</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenus fonciers :</span>
                      <span className="font-medium">Aucun revenu</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenus exceptionnels (quotient) :</span>
                      <Badge variant="default" className="text-xs">Non</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center text-muted-foreground">
                  <p className="text-sm">Graphique non applicable dans votre situation.</p>
                </div>
              </CardContent>
            </Card>

            {/* Taux marginal et optimisations */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Taux marginal d'imposition</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">0 %</div>
                  <div className="mt-4">
                    <div className="text-sm">Revenu imposable</div>
                    <div className="text-lg font-semibold">0 €</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Avis d'imposition</span>
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      Visualiser
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Optimisation de l'IR</span>
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      Simuler
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Evolution du barème</span>
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      Simuler
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resultats">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Résultats fiscaux</h2>
            <p className="text-muted-foreground">Détail des calculs et résultats fiscaux</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}