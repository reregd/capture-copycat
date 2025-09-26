import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DossierRetraite() {
  const { dossierId } = useParams<{ dossierId: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Retraite</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            Calculer
          </Button>
          <Button variant="outline" size="sm">
            Exporter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="synthese" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="synthese">Synthèse</TabsTrigger>
          <TabsTrigger value="regimes">Régimes</TabsTrigger>
          <TabsTrigger value="epargne">Épargne retraite</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="synthese" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Situation actuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Âge actuel</span>
                    <span className="text-sm">39 ans</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Âge de départ souhaité</span>
                    <span className="text-sm">62 ans</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Durée de cotisation</span>
                    <span className="text-sm">15 années</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenus de substitution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Régime de base</span>
                    <span className="text-sm font-semibold">1 247 €/mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Régime complémentaire</span>
                    <span className="text-sm font-semibold">823 €/mois</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-semibold">Total estimé</span>
                    <span className="text-sm font-bold text-primary">2 070 €/mois</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Taux de remplacement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pourcentage du dernier salaire reconstitué à la retraite</span>
                <span className="text-2xl font-bold text-primary">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                <div className="bg-primary h-3 rounded-full" style={{ width: "68%" }}></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regimes">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Régimes de retraite</h2>
            <p className="text-muted-foreground">Détail des différents régimes de retraite</p>
          </div>
        </TabsContent>

        <TabsContent value="epargne">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Épargne retraite</h2>
            <p className="text-muted-foreground">Produits d'épargne retraite et optimisation</p>
          </div>
        </TabsContent>

        <TabsContent value="projections">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Projections</h2>
            <p className="text-muted-foreground">Évolution des revenus et simulations</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}