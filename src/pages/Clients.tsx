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
import { Filter, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const clients = [
  {
    id: 1,
    initials: "BR",
    initialsColor: "bg-brand-orange",
    name: "BINELLI Romain alexandre antoine",
    phone: "",
    email: "",
  },
  {
    id: 2,
    initials: "DP",
    initialsColor: "bg-brand-green",
    name: "DE BONNIERES Patrice",
    phone: "",
    email: "",
  },
  {
    id: 3,
    initials: "DJ",
    initialsColor: "bg-brand-lime",
    name: "DE FRAMOND Jean",
    phone: "",
    email: "",
  },
  {
    id: 4,
    initials: "KG",
    initialsColor: "bg-brand-orange",
    name: "KELLER Geoffray",
    phone: "",
    email: "kellergeoffray@hotmail.fr",
  },
  {
    id: 5,
    initials: "LC",
    initialsColor: "bg-brand-pink",
    name: "LASNE-PINAULT Corinne",
    phone: "",
    email: "",
  },
];

export default function Clients() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Liste des clients</h1>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Résultats : 5 clients</span>
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filtres (0)</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <Input 
            placeholder="Rechercher un client" 
            className="w-64"
          />
          <Button>Ajouter un client</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border">        
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header">
              <TableHead className="font-medium">Nom</TableHead>
              <TableHead className="font-medium">Téléphone</TableHead>
              <TableHead className="font-medium">E-mail</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${client.initialsColor} rounded flex items-center justify-center text-white text-sm font-medium`}>
                      {client.initials}
                    </div>
                    <a 
                      href="#" 
                      className="text-primary hover:underline font-medium"
                    >
                      {client.name}
                    </a>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{client.phone}</TableCell>
                <TableCell className="text-sm">
                  {client.email && (
                    <a href={`mailto:${client.email}`} className="text-primary hover:underline">
                      {client.email}
                    </a>
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