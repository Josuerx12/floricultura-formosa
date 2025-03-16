"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { editUser } from "@/lib/actions/users";
import { EditUserSchema } from "@/lib/schemas-validator/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoles } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  Calendar,
  Link,
  Loader,
  Mail,
  Pen,
  PenBox,
  Phone,
  RectangleEllipsis,
  Shield,
  Text,
} from "lucide-react";
import { User } from "next-auth";
import { useState } from "react";
import { useForm } from "react-hook-form";

const UserDetailsModal = ({
  user,
  handleClose,
  isOpen,
}: {
  user: User & { createdAt: Date };
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const query = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["edit-user", user.id],
    mutationFn: editUser,
    onSuccess: (data) => {
      setIsEditing((prev) => !prev);
      handleClose();
      toast({
        title: data.message,
      });
      query.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: (err) => {
      toast({
        title: err.message,
        variant: "destructive",
      });
    },
  });

  const { register, watch, reset, setValue, handleSubmit } = useForm({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: user.name || undefined,
      email: user.email || undefined,
      role: user.role || undefined,
      phone: user.phone || undefined,
    },
  });

  async function OnSubmit(data: any) {
    await mutateAsync({ id: user.id!, data });
  }
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do banner</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(OnSubmit)}
          className="w-full mx-auto flex flex-col gap-y-5"
        >
          {!isEditing && (
            <Button
              onClick={() => setIsEditing((prev) => !prev)}
              className="w-fit bg-blue-600 hover:bg-blue-500 text-white ml-auto"
            >
              Editar <PenBox />
            </Button>
          )}

          <h4 className="text-start text-sm font-semibold">
            Veja os detalhes abaixo do usuário - ID: {user.id}
          </h4>

          <label className="flex flex-grow bg-neutral-200  p-2 gap-2 items-center rounded-3xl">
            <Text className="text-primary-foreground" size={24} />
            <input
              {...register("name")}
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="text"
              defaultValue={watch("name")}
              disabled={!isEditing}
              placeholder="Insira o nome do usuário!"
            />
          </label>

          <label className="flex flex-grow bg-neutral-200  p-2 gap-2 items-center rounded-3xl">
            <Mail className="text-primary-foreground" size={24} />
            <input
              {...register("email")}
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="email"
              defaultValue={watch("email")}
              disabled={!isEditing}
              placeholder="Insira um e-mail para o usuário!"
            />
          </label>

          <label className="flex flex-grow bg-neutral-200  p-2 gap-2 items-center rounded-3xl">
            <Phone className="text-primary-foreground" size={24} />
            <input
              {...register("phone")}
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="tel"
              defaultValue={watch("phone")}
              disabled={!isEditing}
              placeholder="Insira um e-mail para o usuário!"
            />
          </label>

          <select
            {...register("role")}
            defaultValue={user.role!}
            disabled={!isEditing}
            className="flex flex-grow bg-neutral-200  p-2 gap-2 items-center rounded-3xl"
          >
            <option value={UserRoles.USER}>Usuário</option>
            <option value={UserRoles.SELLER}>Vendedor</option>
            <option value={UserRoles.ADMIN}>Administrador</option>
          </select>

          <label className="flex flex-grow bg-neutral-200   p-2 gap-2 items-center rounded-3xl">
            <Calendar className="text-primary-foreground" size={24} />
            <input
              required
              className="w-full bg-transparent outline-none  placeholder:text-neutral-700"
              type="text"
              disabled
              defaultValue={user?.createdAt?.toLocaleString("pt-BR")}
            />
          </label>

          {isEditing && (
            <div className="flex gap-2 items-center">
              <Button
                type="submit"
                className="flex-grow"
                onClick={() => {
                  handleClose();
                  setIsEditing((prev) => !prev);
                }}
                variant={"destructive"}
              >
                <div className="flex items-center justify-center gap-2">
                  Cancelar <Ban />
                </div>
              </Button>
              <Button className="flex-grow" type="submit" variant={"secondary"}>
                <div className="flex items-center justify-center gap-2">
                  {isPending ? (
                    <>
                      <span>Editando</span> <Loader className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>Editar</span> <Pen />
                    </>
                  )}
                </div>
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
