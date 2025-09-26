import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  Plus,
  Printer,
  Calendar,
  RefreshCw,
  ArrowRightLeft,
  Edit
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const dossierData = {
  "831d03fe-1b9c-4859-a44d-bb9c1ea8e48a": {
    id: "831d03fe-1b9c-4859-a44d-bb9c1ea8e48a",
    client: {
      name: "Romain alexandre antoine BINELLI",
      age: "39 ans",
      profession: "Salarié cadre"
    },
    familySituation: {
      status: "Célibataire"
    },
    people: [],
    evaluation: "23/09/2025"
  }
};

export default function DossierFamille() {
  const { dossierId } = useParams<{ dossierId: string }>();
  const dossier = dossierData[dossierId as keyof typeof dossierData];

  if (!dossier) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">Dossier non trouvé</h1>
        <Link to="/dossiers" className="text-primary hover:underline">
          Retourner à la liste des dossiers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation des onglets principaux */}
      <div className="border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <span>Dossier</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Informations générales</DropdownMenuItem>
                <DropdownMenuItem>Documents</DropdownMenuItem>
                <DropdownMenuItem>Historique</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">Evaluation : {dossier.evaluation}</span>
            <Button variant="outline" size="sm">
              Mettre à jour O2S
            </Button>
            <Button variant="outline" size="sm">
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Transferts
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Editions
            </Button>
          </div>
        </div>

        <Tabs defaultValue="famille" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="famille">Famille</TabsTrigger>
            <TabsTrigger value="retraite">
              <div className="flex items-center space-x-1">
                <span>Retraite</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="patrimoine">
              <div className="flex items-center space-x-1">
                <span>Patrimoine & Budget</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="fiscalite">
              <div className="flex items-center space-x-1">
                <span>Fiscalité</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="prevoyance">
              <div className="flex items-center space-x-1">
                <span>Prévoyance</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="transmission">
              <div className="flex items-center space-x-1">
                <span>Transmission</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="strategies">
              <div className="flex items-center space-x-1">
                <span>Stratégies</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="famille" className="mt-6">
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-foreground">Famille</h1>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section Client */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Client</CardTitle>
                    <Button variant="outline" size="sm">
                      Accéder à la fiche client
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg">{dossier.client.name}</h3>
                      <p className="text-sm text-muted-foreground">{dossier.client.age}</p>
                      <p className="text-sm text-muted-foreground">{dossier.client.profession}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Section Liste des personnes */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Liste des personnes</CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {dossier.people.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">Aucune personne ajoutée</p>
                        <p className="text-xs">Cliquez sur "Ajouter" pour commencer</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dossier.people.map((person, index) => (
                          <div key={index} className="p-3 border rounded">
                            {/* Contenu des personnes */}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Section Situation familiale */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Situation familiale</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">{dossier.familySituation.status}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="retraite">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Retraite</h2>
              <p className="text-muted-foreground">Section en cours de développement</p>
            </div>
          </TabsContent>

          <TabsContent value="patrimoine">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Patrimoine & Budget</h2>
              <p className="text-muted-foreground">Section en cours de développement</p>
            </div>
          </TabsContent>

          <TabsContent value="fiscalite">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Fiscalité</h2>
              <p className="text-muted-foreground">Section en cours de développement</p>
            </div>
          </TabsContent>

          <TabsContent value="prevoyance">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Prévoyance</h2>
              <p className="text-muted-foreground">Section en cours de développement</p>
            </div>
          </TabsContent>

          <TabsContent value="transmission">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Transmission</h2>
              <p className="text-muted-foreground">Section en cours de développement</p>
            </div>
          </TabsContent>

          <TabsContent value="strategies">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">Stratégies</h2>
              <p className="text-muted-foreground">Section en cours de développement</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}