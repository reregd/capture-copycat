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
import { Filter, ChevronUp, ChevronDown, Download, Lock } from "lucide-react";

export default function SCI2072() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        Liste des Sociétés Civiles Immobilières - Déclaration n°2072
      </h1>
      
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filtres (0)</span>
        </Button>
        
        <div className="flex items-center space-x-3">
          <Input 
            placeholder="Filtrer par nom de SCI" 
            className="w-64"
          />
          <Button>Ajouter une SCI</Button>
          <Button variant="outline">Importer une SCI</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 bg-gray-50 border-b flex items-center justify-end space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Utilisateurs</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Groupes</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Profils</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Votre structure</span>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header">
              <TableHead className="font-medium">
                <div className="flex items-center space-x-1">
                  <span>Dénomination sociale</span>
                  <ChevronUp className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-medium">
                <div className="flex items-center space-x-1">
                  <span>SIRET</span>
                  <ChevronUp className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="font-medium">Téléphone</TableHead>
              <TableHead className="font-medium">E-mail</TableHead>
              <TableHead className="w-16">
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <Lock className="h-4 w-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Aucun élément
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}