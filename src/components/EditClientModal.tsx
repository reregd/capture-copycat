import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, User, Star, Crown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ClientData {
  id: number;
  name: string;
  firstName: string;
  identifier: string;
  civility: string;
  birthDate: string;
  profession: string;
  professionLabel: string;
  birthPlace: {
    department: string;
    commune: string;
    country: string;
  };
  nationality: string;
  isProspect: boolean;
  isFavorite: boolean;
  isVIP: boolean;
  isPrivate: boolean;
  isHandicapped: boolean;
}

interface EditClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: ClientData;
  onSave: (client: ClientData) => void;
}

export function EditClientModal({
  open,
  onOpenChange,
  client,
  onSave,
}: EditClientModalProps) {
  const [formData, setFormData] = useState<ClientData>(client);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    client.birthDate ? new Date(client.birthDate) : undefined
  );

  const civilities = [
    { value: "monsieur", label: "Monsieur" },
    { value: "madame", label: "Madame" },
    { value: "mademoiselle", label: "Mademoiselle" },
  ];

  const professions = [
    { value: "salarie-cadre", label: "Salarié cadre" },
    { value: "salarie-non-cadre", label: "Salarié non cadre" },
    { value: "fonctionnaire", label: "Fonctionnaire" },
    { value: "profession-liberale", label: "Profession libérale" },
    { value: "artisan-commercant", label: "Artisan/Commerçant" },
    { value: "chef-entreprise", label: "Chef d'entreprise" },
    { value: "retraite", label: "Retraité" },
    { value: "sans-activite", label: "Sans activité" },
    { value: "etudiant", label: "Étudiant" },
  ];

  const nationalities = [
    { value: "francaise", label: "Française" },
    { value: "allemande", label: "Allemande" },
    { value: "belge", label: "Belge" },
    { value: "suisse", label: "Suisse" },
    { value: "italienne", label: "Italienne" },
    { value: "espagnole", label: "Espagnole" },
    { value: "autre", label: "Autre" },
    { value: "non-definie", label: "Non définie" },
  ];

  const countries = [
    { value: "france", label: "France" },
    { value: "belgique", label: "Belgique" },
    { value: "suisse", label: "Suisse" },
    { value: "autre", label: "Pays non défini" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedClient = {
      ...formData,
      birthDate: selectedDate ? selectedDate.toISOString() : "",
    };
    onSave(updatedClient);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData(client);
    setSelectedDate(client.birthDate ? new Date(client.birthDate) : undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Badges de statut */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="prospect"
                checked={formData.isProspect}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isProspect: !!checked })
                }
              />
              <Label htmlFor="prospect" className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Prospect</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="favorite"
                checked={formData.isFavorite}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isFavorite: !!checked })
                }
              />
              <Label htmlFor="favorite" className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>Favoris</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="vip"
                checked={formData.isVIP}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isVIP: !!checked })
                }
              />
              <Label htmlFor="vip" className="flex items-center space-x-1">
                <Crown className="h-4 w-4" />
                <span>VIP</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="private"
                checked={formData.isPrivate}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPrivate: !!checked })
                }
              />
              <Label htmlFor="private" className="flex items-center space-x-1">
                <Lock className="h-4 w-4" />
                <span>Client privé</span>
              </Label>
            </div>
          </div>

          {/* Identifiant */}
          <div>
            <Label htmlFor="identifier">Identifiant</Label>
            <Input
              id="identifier"
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
            />
          </div>

          {/* Civilité, Nom, Prénom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="civility">Civilité</Label>
              <Select
                value={formData.civility}
                onValueChange={(value) => setFormData({ ...formData, civility: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {civilities.map((civility) => (
                    <SelectItem key={civility.value} value={civility.value}>
                      {civility.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="firstName">
                Prénom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Date de naissance */}
          <div>
            <Label>
              Date de naissance <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "dd/MM/yyyy", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Professions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profession">Profession (CSP)</Label>
              <Select
                value={formData.profession}
                onValueChange={(value) => setFormData({ ...formData, profession: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((profession) => (
                    <SelectItem key={profession.value} value={profession.value}>
                      {profession.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="professionLabel">Profession (libellé)</Label>
              <Input
                id="professionLabel"
                value={formData.professionLabel}
                onChange={(e) => setFormData({ ...formData, professionLabel: e.target.value })}
              />
            </div>
          </div>

          {/* Nom de naissance */}
          <div>
            <Label htmlFor="birthName">Nom de naissance</Label>
            <Input
              id="birthName"
              placeholder=""
            />
          </div>

          {/* Lieu de naissance */}
          <div>
            <Label>Lieu de naissance</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="N° de département"
                value={formData.birthPlace.department}
                onChange={(e) => setFormData({
                  ...formData,
                  birthPlace: { ...formData.birthPlace, department: e.target.value }
                })}
              />
              <Input
                placeholder="Commune"
                value={formData.birthPlace.commune}
                onChange={(e) => setFormData({
                  ...formData,
                  birthPlace: { ...formData.birthPlace, commune: e.target.value }
                })}
              />
              <Select
                value={formData.birthPlace.country}
                onValueChange={(value) => setFormData({
                  ...formData,
                  birthPlace: { ...formData.birthPlace, country: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Nationalité */}
          <div>
            <Label htmlFor="nationality">Nationalité</Label>
            <Select
              value={formData.nationality}
              onValueChange={(value) => setFormData({ ...formData, nationality: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nationalities.map((nationality) => (
                  <SelectItem key={nationality.value} value={nationality.value}>
                    {nationality.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Personne handicapée */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="handicapped"
              checked={formData.isHandicapped}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isHandicapped: !!checked })
              }
            />
            <Label htmlFor="handicapped">Personne handicapée</Label>
          </div>

          {/* Message informatif */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-blue-700">
              Pour modifier la situation familiale et les informations du conjoint, veuillez-vous rendre dans l'écran Situation familiale du dossier de référence.
            </p>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Abandonner
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}