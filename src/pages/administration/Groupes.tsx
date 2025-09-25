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

const groupes = [
  {
    id: 1,
    nom: "Utilisateurs",
    partage: "Ecriture",
  },
];

export default function AdministrationGroupes() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Liste des groupes</h2>
      
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un groupe" 
              className="pl-10 w-64"
            />
          </div>
          <Button>Ajouter un groupe</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border">        
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header">
              <TableHead className="font-medium">
                <div className="flex items-center space-x-1">
                  <span>Groupes</span>
                  <ChevronUp className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-medium">
                <div className="flex items-center space-x-1">
                  <span>Partage entre membres</span>
                  <ChevronUp className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupes.map((groupe) => (
              <TableRow key={groupe.id} className="hover:bg-gray-50">
                <TableCell>
                  <a 
                    href="#" 
                    className="text-primary hover:underline font-medium"
                  >
                    {groupe.nom}
                  </a>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground italic">{groupe.partage}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
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