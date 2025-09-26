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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, ChevronUp, ChevronDown, Download, Lock, Star, Crown, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const sciSchema = z.object({
  denominationSociale: z.string().trim().min(1, "La dénomination sociale est obligatoire").max(255, "Maximum 255 caractères"),
  siret1: z.string().trim().min(1, "Le SIRET est obligatoire").regex(/^\d{14}$/, "Le SIRET doit contenir 14 chiffres"),
  siret2: z.string().optional(),
  codeActiviteNAF: z.string().trim().min(1, "Le code d'activité NAF est obligatoire").max(10, "Maximum 10 caractères"),
  codeRDF: z.string().trim().min(1, "Le code RDF est obligatoire"),
  favoris: z.boolean().default(false),
  vip: z.boolean().default(false),
  sciPrivee: z.boolean().default(false),
});

type SCIFormData = z.infer<typeof sciSchema>;

export default function SCI2072() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const form = useForm<SCIFormData>({
    resolver: zodResolver(sciSchema),
    defaultValues: {
      denominationSociale: "",
      siret1: "",
      siret2: "",
      codeActiviteNAF: "",
      codeRDF: "1",
      favoris: false,
      vip: false,
      sciPrivee: false,
    },
  });

  const onSubmit = (data: SCIFormData) => {
    console.log("SCI data:", data);
    setIsModalOpen(false);
    form.reset();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.reset();
  };

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
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>Ajouter une SCI</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Fiche Société Civile Immobilière</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Status Checkboxes */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="favoris"
                      {...form.register("favoris")}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="favoris" className="flex items-center space-x-1 text-sm">
                      <Star className="h-4 w-4 text-blue-600" />
                      <span>Favoris</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="vip"
                      {...form.register("vip")}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="vip" className="flex items-center space-x-1 text-sm">
                      <Crown className="h-4 w-4 text-blue-600" />
                      <span>VIP</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="sciPrivee"
                      {...form.register("sciPrivee")}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Label htmlFor="sciPrivee" className="flex items-center space-x-1 text-sm">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span>SCI privée</span>
                    </Label>
                  </div>
                </div>

                {/* Dénomination sociale */}
                <div className="space-y-2">
                  <Label htmlFor="denominationSociale">
                    Dénomination sociale <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="denominationSociale"
                    {...form.register("denominationSociale")}
                    className={form.formState.errors.denominationSociale ? "border-red-500" : ""}
                  />
                  {form.formState.errors.denominationSociale && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.denominationSociale.message}
                    </p>
                  )}
                </div>

                {/* Siret */}
                <div className="space-y-2">
                  <Label>
                    Siret <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      {...form.register("siret1")}
                      placeholder="Numéro SIRET"
                      className={`flex-1 ${form.formState.errors.siret1 ? "border-red-500" : ""}`}
                    />
                    <Input
                      {...form.register("siret2")}
                      className="w-24"
                    />
                  </div>
                  {form.formState.errors.siret1 && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.siret1.message}
                    </p>
                  )}
                </div>

                {/* Code d'activité NAF */}
                <div className="space-y-2">
                  <Label htmlFor="codeActiviteNAF">
                    Code d'activité NAF <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="codeActiviteNAF"
                    {...form.register("codeActiviteNAF")}
                    className={form.formState.errors.codeActiviteNAF ? "border-red-500" : ""}
                  />
                  {form.formState.errors.codeActiviteNAF && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.codeActiviteNAF.message}
                    </p>
                  )}
                </div>

                {/* Code RDF */}
                <div className="space-y-2">
                  <Label>
                    Code RDF <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">RF</span>
                    <Input
                      {...form.register("codeRDF")}
                      type="number"
                      min="1"
                      className={`w-24 ${form.formState.errors.codeRDF ? "border-red-500" : ""}`}
                    />
                  </div>
                  {form.formState.errors.codeRDF && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.codeRDF.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Abandonner
                  </Button>
                  <Button type="submit">
                    Enregistrer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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