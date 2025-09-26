import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './quill-custom.css';

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (note: string) => void;
}

export function AddNoteModal({
  open,
  onOpenChange,
  onSave,
}: AddNoteModalProps) {
  const [noteContent, setNoteContent] = useState("Les informations collectées dans les zones de saisie libre sur les personnes doivent respecter les dispositions légales en vigueur et notamment elles doivent être adéquates, pertinentes et non excessives au regard de la finalité du traitement envisagé. Les commentaires ne doivent donc pas notamment être inappropriés, subjectifs et insultants.");

  // Configuration de la toolbar Quill pour correspondre à l'image
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }],
      ['clean']
    ],
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false
    }
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'size', 'color', 'clean'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteContent.trim()) {
      onSave(noteContent);
      setNoteContent("Les informations collectées dans les zones de saisie libre sur les personnes doivent respecter les dispositions légales en vigueur et notamment elles doivent être adéquates, pertinentes et non excessives au regard de la finalité du traitement envisagé. Les commentaires ne doivent donc pas notamment être inappropriés, subjectifs et insultants.");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setNoteContent("Les informations collectées dans les zones de saisie libre sur les personnes doivent respecter les dispositions légales en vigueur et notamment elles doivent être adéquates, pertinentes et non excessives au regard de la finalité du traitement envisagé. Les commentaires ne doivent donc pas notamment être inappropriés, subjectifs et insultants.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Notes</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Éditeur Quill */}
          <div className="min-h-[250px]">
            <ReactQuill
              theme="snow"
              value={noteContent}
              onChange={setNoteContent}
              modules={modules}
              formats={formats}
              placeholder="Saisissez votre note ici..."
              style={{ height: '200px' }}
            />
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