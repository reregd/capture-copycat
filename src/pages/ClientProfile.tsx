import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Edit,
  FileText,
  Plus,
  MoreHorizontal,
  Contact,
  StickyNote,
  Camera,
  Lock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditCoordinatesModal } from "@/components/EditCoordinatesModal";
import { AddNoteModal } from "@/components/AddNoteModal";
import { EditClientModal } from "@/components/EditClientModal";
import { ContactsModal } from "@/components/ContactsModal";

// Mock data - à remplacer par des vraies données
const clientData = {
  "client1": {
    id: 1,
    initials: "BR",
    initialsColor: "bg-brand-orange",
    name: "BINELLI",
    firstName: "Romain alexandre antoine",
    fullName: "Romain alexandre antoine BINELLI",
    age: "39 ans le 26/09/2025",
    profession: "salarie-cadre",
    professionLabel: "Salarié cadre",
    situationFamiliale: "Célibataire",
    identifier: "",
    civility: "monsieur",
    birthDate: "1985-11-14",
    birthPlace: {
      department: "",
      commune: "",
      country: "france"
    },
    nationality: "francaise",
    isProspect: false,
    isFavorite: false,
    isVIP: false,
    isPrivate: true,
    isHandicapped: false,
    coordinates: {
      mobile: "",
      home: "",
      work: "",
      email: "",
      address: {
        street: "13 rue des vignes",
        postalCode: "77500",
        city: "Chelles",
        country: "France (Métropole)"
      }
    },
    dossiers: [
      {
        id: "02S",
        title: "Dossier créé le 23/09/2025 à 10h05",
        subtitle: "Modifié le 23/09/2025 10:05:08",
        type: "reference",
        status: "active"
      }
    ],
    notes: [],
    contacts: {
      notaire: {
        civility: "monsieur",
        name: "",
        firstName: "",
        study: "",
        mobilePhone: "",
        workPhone: "",
        email: "",
        address: {
          street: "",
          postalCode: "",
          commune: "",
          country: "non-defini"
        }
      },
      expertComptable: {
        civility: "monsieur",
        name: "",
        firstName: "",
        study: "",
        mobilePhone: "",
        workPhone: "",
        email: "",
        address: {
          street: "",
          postalCode: "",
          commune: "",
          country: "non-defini"
        }
      }
    }
  }
};

export default function ClientProfile() {
  const { clientId } = useParams<{ clientId: string }>();
  const client = clientData[clientId as keyof typeof clientData];
  const [isEditCoordinatesOpen, setIsEditCoordinatesOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [notes, setNotes] = useState<string[]>(client?.notes || []);
  const [clientInfo, setClientInfo] = useState(client);
  const [contacts, setContacts] = useState(client?.contacts || {
    notaire: {
      civility: "monsieur",
      name: "",
      firstName: "",
      study: "",
      mobilePhone: "",
      workPhone: "",
      email: "",
      address: { street: "", postalCode: "", commune: "", country: "non-defini" }
    },
    expertComptable: {
      civility: "monsieur",
      name: "",
      firstName: "",
      study: "",
      mobilePhone: "",
      workPhone: "",
      email: "",
      address: { street: "", postalCode: "", commune: "", country: "non-defini" }
    }
  });
  const [coordinates, setCoordinates] = useState(client?.coordinates || {
    mobile: "",
    home: "",
    work: "",
    email: "",
    address: {
      street: "",
      postalCode: "",
      city: "",
      country: "France (Métropole)"
    }
  });

  const handleSaveCoordinates = (newCoordinates: any) => {
    setCoordinates(newCoordinates);
    // Ici vous pourrez ajouter la logique pour sauvegarder en base de données
  };

  const handleAddNote = (note: string) => {
    const newNote = `${new Date().toLocaleDateString()} - ${note}`;
    setNotes([...notes, newNote]);
    // Ici vous pourrez ajouter la logique pour sauvegarder en base de données
  };

  const handleSaveClient = (updatedClient: any) => {
    setClientInfo(updatedClient);
    // Ici vous pourrez ajouter la logique pour sauvegarder en base de données
  };

  const handleSaveContacts = (updatedContacts: any) => {
    setContacts(updatedContacts);
    // Ici vous pourrez ajouter la logique pour sauvegarder en base de données
  };

  if (!client) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">Client non trouvé</h1>
        <Link to="/clients" className="text-primary hover:underline">
          Retourner à la liste des clients
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/clients" className="text-primary hover:underline">
            ← Romain alexandre antoine...
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/dossiers/831d03fe-1b9c-4859-a44d-bb9c1ea8e48a/famille">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Ouvrir fiche client détaillée
            </Button>
          </Link>
          <Button variant="outline" size="sm">Exporter</Button>
          <Button variant="outline" size="sm">Exporter pour l'assistance</Button>
          <Button variant="outline" size="sm">Supprimer</Button>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-foreground">Fiche client</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Client Info */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">{clientInfo?.fullName || client.name}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsContactsOpen(true)}
              >
                <Contact className="h-4 w-4 mr-2" />
                Contacts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditClientOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="flex flex-col items-center space-y-3">
                <div className={`w-24 h-24 ${client.initialsColor} rounded flex items-center justify-center text-white text-2xl font-medium`}>
                  {client.initials}
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Camera className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Lock className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Âge</h4>
                  <p className="text-sm">{client.age}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Profession</h4>
                  <p className="text-sm">{clientInfo?.professionLabel || client.professionLabel}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Situation familiale</h4>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm">{client.situationFamiliale}</p>
                    <Button variant="ghost" size="sm" className="h-auto p-1">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Coordonnées */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Coordonnées</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditCoordinatesOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="flex items-start space-x-2 mb-4">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Adresse</h4>
                    <p className="text-sm">{coordinates.address.street}</p>
                    <p className="text-sm">{coordinates.address.postalCode} {coordinates.address.city}</p>
                    <p className="text-sm">{coordinates.address.country}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="w-32 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-blue-500">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  Afficher la localisation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Dossiers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Dossiers</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un dossier
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {client.dossiers.map((dossier) => (
                <div key={dossier.id} className="flex items-center justify-between p-3 border-l-4 border-primary bg-blue-50 rounded-r">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/dossiers/831d03fe-1b9c-4859-a44d-bb9c1ea8e48a/famille`}
                        className="text-primary hover:underline font-medium"
                      >
                        {dossier.title}
                      </Link>
                      <Badge variant="secondary" className="text-xs">
                        {dossier.id}
                      </Badge>
                      {dossier.type === "reference" && (
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Dossier de référence
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{dossier.subtitle}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Modifier</DropdownMenuItem>
                      <DropdownMenuItem>Dupliquer</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section Notes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notes</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddNoteOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une note
            </Button>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune note pour le moment</p>
                <p className="text-xs">Cliquez sur "Ajouter une note" pour commencer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note, index) => (
                  <div key={index} className="p-3 border rounded bg-yellow-50">
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: note }} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de modification des coordonnées */}
      <EditCoordinatesModal
        open={isEditCoordinatesOpen}
        onOpenChange={setIsEditCoordinatesOpen}
        coordinates={coordinates}
        onSave={handleSaveCoordinates}
      />

      {/* Modal d'ajout de note */}
      <AddNoteModal
        open={isAddNoteOpen}
        onOpenChange={setIsAddNoteOpen}
        onSave={handleAddNote}
      />

      {/* Modal de modification client */}
      {clientInfo && (
        <EditClientModal
          open={isEditClientOpen}
          onOpenChange={setIsEditClientOpen}
          client={clientInfo}
          onSave={handleSaveClient}
        />
      )}

      {/* Modal de contacts */}
      <ContactsModal
        open={isContactsOpen}
        onOpenChange={setIsContactsOpen}
        contacts={contacts}
        onSave={handleSaveContacts}
      />
    </div>
  );
}