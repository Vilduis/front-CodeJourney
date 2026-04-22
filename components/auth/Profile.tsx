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
      <DialogContent className="sm:max-w-[425px] bg-surface-card border border-white/[0.08] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Perfil</DialogTitle>
          <DialogDescription className="text-white/60">
            {isEditing
              ? "Modifica los datos de tu cuenta"
              : "Estos son los datos de tu cuenta."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-white/80 text-sm">
              Nombre
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              className="col-span-3 bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30 disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right text-white/80 text-sm">
              Apellido
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
              className="col-span-3 bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30 disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-white/80 text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              className="col-span-3 bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30 disabled:opacity-50"
            />
          </div>
        </div>
        <DialogFooter>
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-codePrimary hover:bg-codePrimary/80 rounded-lg"
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
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
              >
                Cerrar
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-codePrimary hover:bg-codePrimary/80 rounded-lg"
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
