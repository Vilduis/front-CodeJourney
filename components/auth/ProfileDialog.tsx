"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types/user";
import AuthorAvatar from "@/components/shared/AuthorAvatar";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ProfileData = { name: string; lastName: string; email: string };

const toFormData = (user: User | null): ProfileData => ({
  name: user?.name ?? "",
  lastName: user?.lastName ?? "",
  email: user?.email ?? "",
});

const fields: { key: keyof ProfileData; label: string; type?: string; autoComplete: string }[] = [
  { key: "name", label: "Nombre", autoComplete: "given-name" },
  { key: "lastName", label: "Apellido", autoComplete: "family-name" },
  { key: "email", label: "Email", type: "email", autoComplete: "email" },
];

const ghostButton = "h-11 w-full sm:w-auto rounded-lg text-white/70 hover:bg-white/10 hover:text-white";
const primaryButton = "h-11 w-full sm:w-auto rounded-lg bg-codePrimary px-5 font-semibold hover:bg-codePrimary/80";

const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(() => toFormData(user));

  const startEditing = () => {
    setFormData(toFormData(user));
    setIsEditing(true);
  };

  const handleClose = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    if (await updateUser(formData)) setIsEditing(false);
    setIsSaving(false);
  };

  if (!user) return null;

  const current = toFormData(user);
  const fullName = `${current.name} ${current.lastName}`.trim();

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent className="w-[95vw] max-w-md">
        <DialogHeader className="items-center text-center">
          <AuthorAvatar name={current.name} className="mb-2 h-16 w-16 text-2xl" />
          <DialogTitle className="text-lg text-white">{isEditing ? "Editar perfil" : fullName}</DialogTitle>
          <DialogDescription className="text-sm text-white/65">
            {isEditing ? "Los cambios se verán en tus posts y comentarios." : current.email}
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, autoComplete }) => (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={`profile-${key}`} className="text-sm font-medium text-white/80">
                  {label}
                </Label>
                <Input
                  id={`profile-${key}`}
                  type={type}
                  autoComplete={autoComplete}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  required
                  minLength={key === "email" ? undefined : 2}
                  className="h-11"
                />
              </div>
            ))}
            <DialogFooter className="flex-col-reverse gap-2 pt-2 sm:flex-row">
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} className={ghostButton}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving} className={primaryButton}>
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <dl className="divide-y divide-white/8 rounded-lg border border-white/8">
              {fields.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-sm text-white/65">{label}</dt>
                  <dd className="truncate text-sm font-medium text-white">{current[key]}</dd>
                </div>
              ))}
            </dl>
            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
              <Button type="button" variant="ghost" onClick={handleClose} className={ghostButton}>
                Cerrar
              </Button>
              <Button type="button" onClick={startEditing} className={primaryButton}>
                Editar perfil
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
