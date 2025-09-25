import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const consommationData = [
  { label: "Nombre de clients", max: 5, current: 5 },
  { label: "Nombre d'utilisateurs", max: 1, current: 1 },
];

export default function AdministrationStructure() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pilotage de l'activité des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Indicateurs synthétiques</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Rapport synthétique de l'activité de chaque utilisateur.
              </p>
              <Button variant="outline" size="sm">
                Définir la période à étudier
              </Button>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Indicateurs détaillés</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Rapport détaillé de chaque action réalisée.
              </p>
              <Button variant="outline" size="sm">
                Définir la période à étudier
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Paramétrage des éditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Page de couverture</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Sélectionnez un fichier pour ajouter votre logo, puis positionnez-le sur la page de couverture des éditions.
              </p>
              <div className="space-x-2">
                <Button variant="outline" size="sm">
                  Ajouter un logo sur l'édition portrait
                </Button>
                <Button variant="outline" size="sm">
                  Ajouter un logo sur l'édition paysage
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Mentions légales</h4>
              <Button variant="outline" size="sm">
                Saisir les mentions légales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consommation au 25/09/2025</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Votre consommation correspond à la facturation de l'option <strong>Big base 30 clients</strong>.
            </p>
            
            <Table>
              <TableHeader>
                <TableRow className="bg-table-header">
                  <TableHead className="font-medium">Nombre maximum*</TableHead>
                  <TableHead className="font-medium">Au 25/09/2025</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consommationData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.label}</TableCell>
                    <TableCell>{item.current}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <p className="text-xs text-muted-foreground mt-2">
              * Nombre maximum constaté sur le mois en cours.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Portail Fiscal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Définir le compte principal du Portail Fiscal pour activer les fonctionnalités de télédéclaration.
            </p>
            <Button>Associer le compte principal</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}