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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ContactData {
  civility: string;
  name: string;
  firstName: string;
  study: string;
  mobilePhone: string;
  workPhone: string;
  email: string;
  address: {
    street: string;
    postalCode: string;
    commune: string;
    country: string;
  };
}

interface ContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: {
    notaire: ContactData;
    expertComptable: ContactData;
  };
  onSave: (contacts: any) => void;
}

export function ContactsModal({
  open,
  onOpenChange,
  contacts,
  onSave,
}: ContactsModalProps) {
  const [activeTab, setActiveTab] = useState("notaire");
  const [formData, setFormData] = useState(contacts);

  const civilities = [
    { value: "", label: "" },
    { value: "monsieur", label: "Monsieur" },
    { value: "madame", label: "Madame" },
    { value: "mademoiselle", label: "Mademoiselle" },
  ];

  const countries = [
    { value: "", label: "Pays de résidence" },
    { value: "france", label: "France" },
    { value: "belgique", label: "Belgique" },
    { value: "suisse", label: "Suisse" },
    { value: "luxembourg", label: "Luxembourg" },
    { value: "autre", label: "Autre" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData(contacts);
    onOpenChange(false);
  };

  const updateContact = (contactType: "notaire" | "expertComptable", field: string, value: string, isAddress = false) => {
    setFormData(prev => ({
      ...prev,
      [contactType]: {
        ...prev[contactType],
        ...(isAddress ? {
          address: {
            ...prev[contactType].address,
            [field]: value
          }
        } : {
          [field]: value
        })
      }
    }));
  };

  const renderContactForm = (contactType: "notaire" | "expertComptable") => {
    const contact = formData[contactType];

    return (
      <div className="space-y-4">
        {/* Civilité */}
        <div>
          <Label htmlFor={`${contactType}-civility`}>Civilité</Label>
          <Select
            value={contact.civility}
            onValueChange={(value) => updateContact(contactType, "civility", value)}
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

        {/* Nom */}
        <div>
          <Label htmlFor={`${contactType}-name`}>Nom</Label>
          <Input
            id={`${contactType}-name`}
            value={contact.name}
            onChange={(e) => updateContact(contactType, "name", e.target.value)}
          />
        </div>

        {/* Prénom */}
        <div>
          <Label htmlFor={`${contactType}-firstName`}>Prénom</Label>
          <Input
            id={`${contactType}-firstName`}
            value={contact.firstName}
            onChange={(e) => updateContact(contactType, "firstName", e.target.value)}
          />
        </div>

        {/* Etude */}
        <div>
          <Label htmlFor={`${contactType}-study`}>Etude</Label>
          <Input
            id={`${contactType}-study`}
            value={contact.study}
            onChange={(e) => updateContact(contactType, "study", e.target.value)}
          />
        </div>

        {/* Téléphones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${contactType}-mobile`}>Téléphone portable</Label>
            <Input
              id={`${contactType}-mobile`}
              value={contact.mobilePhone}
              onChange={(e) => updateContact(contactType, "mobilePhone", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor={`${contactType}-work`}>Téléphone professionnel</Label>
            <Input
              id={`${contactType}-work`}
              value={contact.workPhone}
              onChange={(e) => updateContact(contactType, "workPhone", e.target.value)}
            />
          </div>
        </div>

        {/* E-mail */}
        <div>
          <Label htmlFor={`${contactType}-email`}>E-mail</Label>
          <Input
            id={`${contactType}-email`}
            type="email"
            value={contact.email}
            onChange={(e) => updateContact(contactType, "email", e.target.value)}
          />
        </div>

        {/* Adresse */}
        <div className="space-y-4">
          <Label>Adresse</Label>

          {/* Rue */}
          <Input
            placeholder="Rue"
            value={contact.address.street}
            onChange={(e) => updateContact(contactType, "street", e.target.value, true)}
          />

          {/* Code postal et Commune */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Code postal"
              value={contact.address.postalCode}
              onChange={(e) => updateContact(contactType, "postalCode", e.target.value, true)}
            />
            <Input
              placeholder="Commune"
              value={contact.address.commune}
              onChange={(e) => updateContact(contactType, "commune", e.target.value, true)}
            />
          </div>

          {/* Pays de résidence */}
          <Select
            value={contact.address.country}
            onValueChange={(value) => updateContact(contactType, "country", value, true)}
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
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contacts</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notaire">Notaire</TabsTrigger>
              <TabsTrigger value="expertComptable">Expert comptable</TabsTrigger>
            </TabsList>

            <TabsContent value="notaire" className="mt-6">
              {renderContactForm("notaire")}
            </TabsContent>

            <TabsContent value="expertComptable" className="mt-6">
              {renderContactForm("expertComptable")}
            </TabsContent>
          </Tabs>

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