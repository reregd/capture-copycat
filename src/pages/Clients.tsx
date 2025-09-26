import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Filter, MoreHorizontal, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const clients = [
  {
    id: 1,
    clientId: "client1",
    initials: "BR",
    initialsColor: "bg-brand-orange",
    name: "BINELLI Romain alexandre antoine",
    phone: "",
    email: "",
  },
  {
    id: 2,
    clientId: "client2",
    initials: "DP",
    initialsColor: "bg-brand-green",
    name: "DE BONNIERES Patrice",
    phone: "",
    email: "",
  },
  {
    id: 3,
    clientId: "client3",
    initials: "DJ",
    initialsColor: "bg-brand-lime",
    name: "DE FRAMOND Jean",
    phone: "",
    email: "",
  },
  {
    id: 4,
    clientId: "client4",
    initials: "KG",
    initialsColor: "bg-brand-orange",
    name: "KELLER Geoffray",
    phone: "",
    email: "kellergeoffray@hotmail.fr",
  },
  {
    id: 5,
    clientId: "client5",
    initials: "LC",
    initialsColor: "bg-brand-pink",
    name: "LASNE-PINAULT Corinne",
    phone: "",
    email: "",
  },
];

export default function Clients() {
  const [visibleColumns, setVisibleColumns] = useState({
    favori: true,
    miniature: true,
    nom: true,
    prospect: false,
    vip: false,
    lectureSeule: false,
    prive: false,
    o2s: false,
    profession: false,
    telephone: true,
    email: true,
    conseiller: false
  });

  const toggleColumn = (column: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

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
              <TableHead className="font-medium">
                <div className="flex items-center justify-between">
                  <span>Nom</span>
                  <div className="flex items-center">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L7.5 4.5H11L8.25 6.75L9.75 10.25L6 8L2.25 10.25L3.75 6.75L1 4.5H4.5L6 1Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </TableHead>
              {visibleColumns.telephone && (
                <TableHead className="font-medium">Téléphone</TableHead>
              )}
              <TableHead className="font-medium">
                <div className="flex items-center justify-between">
                  <span>E-mail</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto p-1">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm">Colonnes à afficher</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={visibleColumns.favori}
                              onCheckedChange={() => toggleColumn('favori')}
                            />
                            <label className="text-sm">Favori</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={visibleColumns.telephone}
                              onCheckedChange={() => toggleColumn('telephone')}
                            />
                            <label className="text-sm">Téléphone</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={visibleColumns.miniature}
                              onCheckedChange={() => toggleColumn('miniature')}
                            />
                            <label className="text-sm">Miniature</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={visibleColumns.email}
                              onCheckedChange={() => toggleColumn('email')}
                            />
                            <label className="text-sm">E-mail</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={visibleColumns.prospect}
                              onCheckedChange={() => toggleColumn('prospect')}
                            />
                            <label className="text-sm">Prospect</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={visibleColumns.conseiller}
                              onCheckedChange={() => toggleColumn('conseiller')}
                            />
                            <label className="text-sm">Conseiller</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={visibleColumns.vip}
                              onCheckedChange={() => toggleColumn('vip')}
                            />
                            <label className="text-sm">VIP</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={visibleColumns.lectureSeule}
                              onCheckedChange={() => toggleColumn('lectureSeule')}
                            />
                            <label className="text-sm">Lecture seule</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={visibleColumns.prive}
                              onCheckedChange={() => toggleColumn('prive')}
                            />
                            <label className="text-sm">Privé</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={visibleColumns.o2s}
                              onCheckedChange={() => toggleColumn('o2s')}
                            />
                            <label className="text-sm">O2S</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              checked={visibleColumns.profession}
                              onCheckedChange={() => toggleColumn('profession')}
                            />
                            <label className="text-sm">Profession</label>
                          </div>
                        </div>
                        <Button className="w-full" size="sm">
                          Enregistrer
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </TableHead>
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
                    <Link
                      to={`/clients/${client.clientId}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {client.name}
                    </Link>
                  </div>
                </TableCell>
                {visibleColumns.telephone && (
                  <TableCell className="text-sm">{client.phone}</TableCell>
                )}
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
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Exporter</DropdownMenuItem>
                      <DropdownMenuItem>Exporter pour l'assistance</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
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