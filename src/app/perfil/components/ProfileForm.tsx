"use client";

import { FileImage, Loader, Mail, Pencil, Phone, User2 } from "lucide-react";
import Image from "next/image";
import { User } from "next-auth";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditUserSchema } from "@/lib/schemas-validator/user.schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

const ProfileForm = ({ user }: { user: User & { createdAt: Date } }) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    },
  });

  function handleEditing() {
    setIsEditing((prev) => !prev);
  }

  const { isPending } = useMutation({
    mutationKey: ["edit-profile"],
  });

  async function onSubmit(data: z.infer<typeof EditUserSchema>) {}

  return (
    <form
      className="w-full max-w-lg mx-auto shadow-lg p-6 mb-4 rounded-md border bg-white flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col w-fit items-center mx-auto">
        <img
          src={user?.image ? user.image : "/no-profile.svg"}
          width={100}
          height={100}
          quality={100}
          alt="profile pic"
          className="rounded-full"
        />

        <input
          type="file"
          id="file"
          multiple={false}
          accept="image/png, image/jpeg"
          className="hidden"
          disabled={!isEditing}
        />
        {isEditing && (
          <label
            title="Alterar foto de perfil!"
            htmlFor="file"
            className="w-fit bg-primary p-2 rounded mt-3 text-sm text-primary-foreground cursor-pointer hover:text-primary hover:bg-primary-foreground duration-200 flex gap-2 items-center"
          >
            <p>Alterar foto</p>
            <FileImage size={16} />
          </label>
        )}
      </div>

      <div className="flex flex-col gap-4 w-full">
        <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
          <User2 className="text-primary-foreground" size={20} />
          <input
            className="w-full bg-transparent outline-none placeholder:text-neutral-500"
            type="text"
            placeholder="Nome do usuário"
            {...register("name")}
            disabled={!isEditing}
            required
          />
        </label>

        <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
          <Mail className="text-primary-foreground" size={20} />
          <input
            {...register("email")}
            className="w-full bg-transparent outline-none placeholder:text-neutral-500"
            type="email"
            placeholder="Email"
            disabled
            required
          />
        </label>

        <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
          <Phone className="text-primary-foreground" size={20} />
          <input
            className="w-full bg-transparent outline-none placeholder:text-neutral-500"
            type="tel"
            placeholder="N° Telefone não cadastrado!"
            {...register("phone")}
            disabled={!isEditing}
          />
        </label>
      </div>

      <div className="flex justify-end gap-2">
        {!isEditing ? (
          <Button
            type="button"
            className="flex items-center gap-2"
            onClick={handleEditing}
          >
            <Pencil size={16} /> Editar perfil
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleEditing}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader className="animate-spin" size={16} />
                  Salvando
                </>
              ) : (
                <>Salvar</>
              )}
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default ProfileForm;
