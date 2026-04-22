"use client";
import React, { useState } from "react";
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

interface ProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Profile: React.FC<ProfileProps> = ({ open, onOpenChange }) => {
  const { user, updateUser, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    if (await updateUser(formData)) {
      setIsEditing(false);
    }
  };

  const handleClose = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
    setIsEditing(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md bg-surface-card border border-white/[0.08] text-white">
        <DialogHeader>
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-codePrimary to-codeAccent text-white font-bold rounded-full text-2xl">
              {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-center">
              <DialogTitle className="text-white text-lg">{formData.name} {formData.lastName}</DialogTitle>
              <DialogDescription className="text-white/40 text-sm">
                {isEditing ? "Modifica los datos de tu cuenta" : formData.email}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-white/80 text-sm font-medium">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30 disabled:opacity-50"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-white/80 text-sm font-medium">Apellido</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
              className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30 disabled:opacity-50"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-white/80 text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30 disabled:opacity-50"
            />
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="w-full sm:w-auto text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto bg-codePrimary hover:bg-codePrimary/80 rounded-lg"
              >
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="w-full sm:w-auto text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
              >
                Cerrar
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto bg-codePrimary hover:bg-codePrimary/80 rounded-lg"
              >
                Editar perfil
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Profile;
