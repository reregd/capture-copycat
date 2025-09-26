import { Link } from "react-router-dom";
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
                  <Link
                    to="/dossiers/831d03fe-1b9c-4859-a44d-bb9c1ea8e48a/famille"
                    className="text-primary hover:underline text-sm"
                  >
                    {file.file}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    to="/clients/client1"
                    className="text-primary hover:underline text-sm"
                  >
                    {file.client}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Informations section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Informations</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-foreground mb-1">26/09/2025 - Maintenance de l'onglet « Portail fiscal »</div>
                <p className="text-sm text-muted-foreground">
                  Le portail fiscal, la télédéclaration ainsi que la gestion des comptes dans la section « Administration » sont actuellement 
                  indisponibles en raison d'une opération de maintenance en cours.
                </p>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground mb-1">04/07/2025 - Nos équipes travaillent actuellement sur l'ajout du calcul de la CDHR.</div>
                <p className="text-sm text-muted-foreground">
                  Nous finalisons nos échanges avec la DGFIP afin d'obtenir les dernières informations nous permettant de traiter ce nouveau calcul de manière optimale (notamment sur la gestion 
                  des revenus exceptionnels). Nous vous revenons au plus vite pour vous donner une visibilité plus précise pour cette contribution 
                  dont l'acompte sera collecté entre le 1er et 15 décembre prochain.
                </p>
              </div>
            </div>
          </div>

          {/* Contacter l'assistance section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Contacter l'assistance</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm">par email :</span>
                <a href="mailto:assist@harvest.fr" className="text-primary hover:underline text-sm">assist@harvest.fr</a>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">par téléphone :</span>
                <span className="text-sm font-medium">01 55 82 07 07</span>
              </div>
            </div>
          </div>

          {/* Documents à télécharger section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Documents à télécharger</h2>
            <div className="space-y-3">
              <div className="text-sm">
                Afin de permettre une <strong>étude patrimoniale complète et précise</strong>, téléchargez la{" "}
                <a href="#" className="text-primary hover:underline">liste des pièces et informations à fournir</a>{" "}
                et transmettez-la à vos clients.
              </div>
              <div className="text-sm">
                Le <strong>Document de collecte d'informations</strong> PDF remplissable : une façon rapide de créer un client.{" "}
                <a href="#" className="text-primary hover:underline">Téléchargez-le !</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Mises à jour section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Mises à jour</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-sm">
                  Consultez les{" "}
                  <a href="#" className="text-primary hover:underline">fonctionnalités à venir</a>{" "}
                  <span className="text-muted-foreground">(mis à jour le 15/09/2025)</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-sm">
                  Consultez{" "}
                  <a href="#" className="text-primary hover:underline">l'historique des mises à jour</a>
                </span>
              </div>
            </div>
          </div>

          {/* Prise en main section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Prise en main (tutos)</h2>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                <div className="w-12 h-8 bg-gray-300 rounded"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-1">Réaliser un bilan patrimonial en quelques minutes</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Créez votre client, analysez ses données, et restituez-lui vos conclusions.
                </p>
                <a href="#" className="text-primary hover:underline text-sm">Voir tous les tutos</a>
              </div>
            </div>
          </div>

          {/* Aides, FAQ section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Aides, FAQ, Trucs & astuces, Webinaires</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-sm">
                  l'aide{" "}
                  <a href="#" className="text-primary hover:underline">utilisateur</a>{" "}
                  pour découvrir les fonctionnalités de Big
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-sm">
                  l'aide{" "}
                  <a href="#" className="text-primary hover:underline">patrimoniale</a>{" "}
                  pour consulter les informations réglementaires
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-sm">
                  les{" "}
                  <a href="#" className="text-primary hover:underline">FAQ</a>{" "}
                  pour vos questions d'utilisation
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-sm">
                  les{" "}
                  <a href="#" className="text-primary hover:underline">trucs & astuces</a>{" "}
                  pour gagner du temps dans vos saisies
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                <span className="text-sm">
                  les{" "}
                  <a href="#" className="text-primary hover:underline">webinaires</a>{" "}
                  en replay
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}