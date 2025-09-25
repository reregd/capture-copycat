import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const dossiers = [
  {
    id: 1,
    lastModified: "23/09/2025 10:09:40",
    creationDate: "23/09/2025 10:09:40",
    dossier: "Dossier créé le 23/09/2025 à 10h09",
    client: "LASNE-PINAULT Corinne",
  },
  {
    id: 2,
    lastModified: "23/09/2025 10:09:14",
    creationDate: "23/09/2025 10:09:14",
    dossier: "Dossier créé le 23/09/2025 à 10h09",
    client: "KELLER Geoffray",
  },
  {
    id: 3,
    lastModified: "23/09/2025 10:07:35",
    creationDate: "23/09/2025 10:07:35",
    dossier: "Dossier créé le 23/09/2025 à 10h07",
    client: "DE FRAMOND Jean",
  },
  {
    id: 4,
    lastModified: "23/09/2025 10:06:21",
    creationDate: "23/09/2025 10:06:21",
    dossier: "Dossier créé le 23/09/2025 à 10h06",
    client: "DE BONNIERES Patrice",
  },
  {
    id: 5,
    lastModified: "23/09/2025 10:05:08",
    creationDate: "23/09/2025 10:05:05",
    dossier: "Dossier créé le 23/09/2025 à 10h05",
    client: "BINELLI Romain alexandre antoine",
  },
];

export default function Dossiers() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Liste des dossiers</h1>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Résultats : 5 dossiers</span>
        <Input 
          placeholder="Rechercher un client" 
          className="w-64"
        />
      </div>

      <div className="bg-white rounded-lg border">        
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header">
              <TableHead className="font-medium">
                <div className="flex items-center space-x-1">
                  <span>Dernière modification</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-medium">Date de création</TableHead>
              <TableHead className="font-medium">Dossier</TableHead>
              <TableHead className="font-medium">Client</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dossiers.map((dossier) => (
              <TableRow key={dossier.id} className="hover:bg-gray-50">
                <TableCell className="text-sm">{dossier.lastModified}</TableCell>
                <TableCell className="text-sm">{dossier.creationDate}</TableCell>
                <TableCell>
                  <a 
                    href="#" 
                    className="text-primary hover:underline text-sm"
                  >
                    {dossier.dossier}
                  </a>
                </TableCell>
                <TableCell>
                  <a 
                    href="#" 
                    className="text-primary hover:underline text-sm"
                  >
                    {dossier.client}
                  </a>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Ouvrir</DropdownMenuItem>
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