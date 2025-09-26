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

interface EditCoordinatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinates: {
    mobile?: string;
    home?: string;
    work?: string;
    email?: string;
    address: {
      street: string;
      postalCode: string;
      city: string;
      country: string;
    };
  };
  onSave: (coordinates: any) => void;
}

export function EditCoordinatesModal({
  open,
  onOpenChange,
  coordinates,
  onSave,
}: EditCoordinatesModalProps) {
  const [formData, setFormData] = useState({
    mobile: coordinates.mobile || "",
    home: coordinates.home || "",
    work: coordinates.work || "",
    email: coordinates.email || "",
    street: coordinates.address.street || "",
    postalCode: coordinates.address.postalCode || "",
    city: coordinates.address.city || "",
    country: coordinates.address.country || "France (Métropole)",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      mobile: formData.mobile,
      home: formData.home,
      work: formData.work,
      email: formData.email,
      address: {
        street: formData.street,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
      },
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      mobile: coordinates.mobile || "",
      home: coordinates.home || "",
      work: coordinates.work || "",
      email: coordinates.email || "",
      street: coordinates.address.street || "",
      postalCode: coordinates.address.postalCode || "",
      city: coordinates.address.city || "",
      country: coordinates.address.country || "France (Métropole)",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Coordonnées</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Téléphones */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="mobile">Téléphone portable</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder=""
              />
            </div>

            <div>
              <Label htmlFor="home">Téléphone domicile</Label>
              <Input
                id="home"
                value={formData.home}
                onChange={(e) => setFormData({ ...formData, home: e.target.value })}
                placeholder=""
              />
            </div>

            <div>
              <Label htmlFor="work">Téléphone professionnel</Label>
              <Input
                id="work"
                value={formData.work}
                onChange={(e) => setFormData({ ...formData, work: e.target.value })}
                placeholder=""
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder=""
            />
          </div>

          {/* Adresse */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Adresse</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                placeholder="13 rue des vignes"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="77500"
                />
              </div>
              <div>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="CHELLES"
                />
              </div>
            </div>

            <div>
              <Select
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="France (Métropole)">France (Métropole)</SelectItem>
                  <SelectItem value="France (DOM-TOM)">France (DOM-TOM)</SelectItem>
                  <SelectItem value="Belgique">Belgique</SelectItem>
                  <SelectItem value="Suisse">Suisse</SelectItem>
                  <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
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