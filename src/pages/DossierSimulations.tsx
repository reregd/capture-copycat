import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DossierSimulations() {
  const { dossierId } = useParams<{ dossierId: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Simulations</h1>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            Nouvelle simulation
          </Button>
          <Button variant="outline" size="sm">
            Paramètres
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Retraite par capitalisation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Simulation de l'épargne retraite et des revenus de substitution
            </p>
            <Button className="w-full mt-4" variant="outline">
              Lancer la simulation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optimisation fiscale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Calcul de l'impact fiscal des différentes stratégies
            </p>
            <Button className="w-full mt-4" variant="outline">
              Lancer la simulation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transmission patrimoniale</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Simulation des droits de succession et donations
            </p>
            <Button className="w-full mt-4" variant="outline">
              Lancer la simulation
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des simulations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Aucune simulation n'a encore été effectuée</p>
            <p className="text-xs">Lancez votre première simulation ci-dessus</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}