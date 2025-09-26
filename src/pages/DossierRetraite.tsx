import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DossierRetraite() {
  const { dossierId } = useParams<{ dossierId: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Retraite</h1>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">Evaluation : 23/09/2025</span>
          <Button variant="outline" size="sm">
            Mettre à jour O2S
          </Button>
          <Button variant="outline" size="sm">
            Transferts
          </Button>
          <Button variant="outline" size="sm">
            Éditions
          </Button>
        </div>
      </div>

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
          <Select defaultValue="resultats-mensuels">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="resultats-mensuels">Résultats mensuels</SelectItem>
              <SelectItem value="resultats-annuels">Résultats annuels</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="synthese" className="mt-6">
          <div className="flex justify-center">
            <img
              src="/src/image/fichedetailleretraite.png"
              alt="Fiche détaillée retraite"
              className="max-w-full h-auto"
            />
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
  );
}