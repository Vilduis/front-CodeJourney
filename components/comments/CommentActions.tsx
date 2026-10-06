"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { revalidatePosts } from "@/app/actions";
import { updateComment, deleteComment, MIN_COMMENT_LENGTH } from "@/services/commentService";
import { getErrorMessage } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@/components/shared/MarkdownEditor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentActionsProps {
  commentId: string;
  authorId?: string;
  content: string;
}

const CommentActions = ({ commentId, authorId, content }: CommentActionsProps) => {
  const { user } = useAuth();
  const [draft, setDraft] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || user._id !== authorId) return null;

  const run = async (action: () => Promise<unknown>, success: string, failure: string) => {
    setIsSubmitting(true);
    try {
      await action();
      toast.success(success);
      await revalidatePosts();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, failure));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    const next = draft?.trim() ?? "";
    if (next.length < MIN_COMMENT_LENGTH) {
      toast.error(`El comentario debe tener al menos ${MIN_COMMENT_LENGTH} caracteres`);
      return;
    }
    if (await run(() => updateComment(commentId, next), "Comentario actualizado", "Error al actualizar el comentario")) {
      setDraft(null);
    }
  };

  const handleDelete = () =>
    run(() => deleteComment(commentId), "Comentario eliminado", "Error al eliminar el comentario");

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Editar comentario"
        className="h-11 w-11 sm:h-8 sm:w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
        onClick={() => setDraft(content)}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Eliminar comentario"
        className="h-11 w-11 sm:h-8 sm:w-8 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
        onClick={() => setConfirmingDelete(true)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      <AlertDialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar comentario?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Esta acción no se puede deshacer. El comentario será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11 rounded-lg border-white/12 bg-transparent text-white/70 hover:bg-white/10 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction className="h-11 rounded-lg bg-red-500 text-white hover:bg-red-600" onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={draft !== null} onOpenChange={(open) => !open && setDraft(null)}>
        <DialogContent className="w-[95vw] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Editar comentario</DialogTitle>
            <DialogDescription className="text-white/60">Realiza los cambios necesarios en tu comentario.</DialogDescription>
          </DialogHeader>
          <MarkdownEditor
            variant="comment"
            label="Editar comentario"
            value={draft ?? ""}
            onChange={setDraft}
            minHeight="min-h-[140px]"
          />
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="ghost"
              onClick={() => setDraft(null)}
              className="w-full sm:w-auto text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEdit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-codePrimary hover:bg-codePrimary/80 rounded-lg"
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentActions;
