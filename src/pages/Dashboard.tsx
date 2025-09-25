import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const recentFiles = [
  {
    id: 1,
    lastModified: "23/09/2025 10:09:40",
    file: "Dossier créé le 23/09/2025 à 10h09",
    client: "LASNE-PINAULT Corinne",
  },
  {
    id: 2,
    lastModified: "23/09/2025 10:09:14", 
    file: "Dossier créé le 23/09/2025 à 10h09",
    client: "KELLER Geoffray",
  },
  {
    id: 3,
    lastModified: "23/09/2025 10:07:35",
    file: "Dossier créé le 23/09/2025 à 10h07",
    client: "DE FRAMOND Jean",
  },
  {
    id: 4,
    lastModified: "23/09/2025 10:06:21",
    file: "Dossier créé le 23/09/2025 à 10h06",
    client: "DE BONNIERES Patrice",
  },
  {
    id: 5,
    lastModified: "23/09/2025 10:05:08",
    file: "Dossier créé le 23/09/2025 à 10h05",
    client: "BINELLI Romain alexandre antoine",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Bienvenue sur Big</h1>
        <div className="flex items-center space-x-3">
          <Button>Ajouter un client</Button>
          <Button variant="outline">Importer clients et dossiers</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Derniers dossiers consultés</h2>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header">
              <TableHead className="font-medium">Dernière modification</TableHead>
              <TableHead className="font-medium">Dossier</TableHead>
              <TableHead className="font-medium">Client</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentFiles.map((file) => (
              <TableRow key={file.id} className="hover:bg-gray-50">
                <TableCell className="text-sm">{file.lastModified}</TableCell>
                <TableCell>
                  <a 
                    href="#" 
                    className="text-primary hover:underline text-sm"
                  >
                    {file.file}
                  </a>
                </TableCell>
                <TableCell>
                  <a 
                    href="#" 
                    className="text-primary hover:underline text-sm"
                  >
                    {file.client}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}