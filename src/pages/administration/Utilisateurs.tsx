import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreHorizontal, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const utilisateurs = [
  {
    id: 1,
    identifiant: "vianney.recipon@agavic.fr",
    nom: "RECIPON Vianney",
    derniereConnexion: "25/09/2025 22:32",
    sso: "",
    statut: "Administrateur",
    responsable: "",
    profil: "Profil de base",
    nombreClients: 5,
    nombreDossiers: 5,
    harvestConnect: true,
  },
];

export default function AdministrationUtilisateurs() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>
      
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un utilisateur" 
              className="pl-10 w-64"
            />
          </div>
          <Button>Ajouter un utilisateur</Button>
          <Button variant="outline">Exporter les habilitations</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border">        
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header">
              <TableHead className="font-medium">
                <div className="flex items-center space-x-1">
                  <span>Identifiant</span>
                  <ChevronUp className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-medium">Nom</TableHead>
              <TableHead className="font-medium">Dernière connexion</TableHead>
              <TableHead className="font-medium">SSO</TableHead>
              <TableHead className="font-medium">Statut</TableHead>
              <TableHead className="font-medium">Responsable</TableHead>
              <TableHead className="font-medium">Profil</TableHead>
              <TableHead className="font-medium">Nombre de clients</TableHead>
              <TableHead className="font-medium">Nombre de dossiers</TableHead>
              <TableHead className="font-medium">Harvest Connect</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {utilisateurs.map((utilisateur) => (
              <TableRow key={utilisateur.id} className="hover:bg-gray-50">
                <TableCell>
                  <a 
                    href="#" 
                    className="text-primary hover:underline text-sm"
                  >
                    {utilisateur.identifiant}
                  </a>
                </TableCell>
                <TableCell>
                  <a 
                    href="#" 
                    className="text-primary hover:underline font-medium"
                  >
                    {utilisateur.nom}
                  </a>
                </TableCell>
                <TableCell className="text-sm">{utilisateur.derniereConnexion}</TableCell>
                <TableCell className="text-sm">{utilisateur.sso}</TableCell>
                <TableCell className="text-sm">{utilisateur.statut}</TableCell>
                <TableCell className="text-sm">{utilisateur.responsable}</TableCell>
                <TableCell className="text-sm">{utilisateur.profil}</TableCell>
                <TableCell className="text-center text-sm">{utilisateur.nombreClients}</TableCell>
                <TableCell className="text-center text-sm">{utilisateur.nombreDossiers}</TableCell>
                <TableCell className="text-center">
                  {utilisateur.harvestConnect && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto"></div>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}