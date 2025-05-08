"use client";
import { toast } from "@/hooks/use-toast";
import { signUp } from "@/lib/actions/auth";
import { UserSchema, UserType } from "@/lib/schemas-validator/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { IdCard, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BiSolidUser, BiMailSend, BiSolidPhone, BiKey } from "react-icons/bi";

const SignUpForm = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UserSchema),
  });

  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);

  const router = useRouter();

  const { mutateAsync, isPending, error } = useMutation({
    mutationKey: ["signUp"],
    mutationFn: signUp,
    onSuccess: () => {
      toast({ title: "Conta criada com sucesso!" });
      reset();
      setBirthDate(undefined);
      router.push("/login");
    },
  });

  async function OnSubmit(data: UserType) {
    await mutateAsync({ credentials: data });
  }

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return (
    <form
      ref={formRef}
      className="flex flex-col gap-4 max-w-md mx-auto w-full px-4"
      onSubmit={handleSubmit(OnSubmit)}
    >
      <label className="flex items-center gap-3 bg-neutral-200 p-3 rounded-2xl">
        <BiSolidUser className="text-primary-foreground" size={20} />
        <input
          {...register("name")}
          required
          className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm"
          type="text"
          name="name"
          placeholder="Nome completo"
        />
      </label>
      {errors?.name && (
        <p className="text-red-600 text-sm">{errors.name.message}</p>
      )}

      <label className="flex items-center gap-3 bg-neutral-200 p-3 rounded-2xl">
        <BiMailSend className="text-primary-foreground" size={20} />
        <input
          {...register("email")}
          required
          className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm"
          type="email"
          name="email"
          placeholder="E-mail"
        />
      </label>
      {errors?.email && (
        <p className="text-red-600 text-sm">{errors.email.message}</p>
      )}

      <label className="flex items-center gap-3 bg-neutral-200 p-3 rounded-2xl">
        <BiSolidPhone className="text-primary-foreground" size={20} />
        <input
          {...register("phone")}
          className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm"
          type="tel"
          name="phone"
          placeholder="Telefone"
        />
      </label>
      {errors?.phone && (
        <p className="text-red-600 text-sm">{errors.phone.message}</p>
      )}

      <label className="flex items-center gap-3 bg-neutral-200 p-3 rounded-2xl">
        <IdCard />
        <input
          {...register("document")}
          className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm"
          type="text"
          name="document"
          placeholder="CPF ou CNPJ"
        />
      </label>
      {errors?.document && (
        <p className="text-red-600 text-sm">{errors.document.message}</p>
      )}

      <label className="flex flex-col gap-3 bg-neutral-200 p-3 rounded-2xl">
        <span className="text-sm text-neutral-600">Data de nascimento</span>

        <input
          {...register("birthdate")}
          type="date"
          className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm appearance-none [&::-webkit-calendar-picker-indicator]:invert"
        />
      </label>

      <label className="flex items-center gap-3 bg-neutral-200 p-3 rounded-2xl">
        <BiKey className="text-primary-foreground" size={20} />
        <input
          {...register("password")}
          required
          className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-sm"
          type="password"
          name="password"
          placeholder="Senha"
        />
      </label>
      {errors?.password && (
        <p className="text-red-600 text-sm">{errors.password.message}</p>
      )}

      {error && (
        <p className="bg-red-800 p-3 rounded text-white text-sm">
          {error.message}
        </p>
      )}

      <p className="text-xs text-center text-neutral-600">
        Já possui uma conta?{" "}
        <Link href="/login" className="text-blue-500 underline">
          Faça login
        </Link>
      </p>

      <button
        type="submit"
        disabled={isPending}
        className="border border-primary-foreground flex items-center justify-center gap-2 hover:bg-primary-foreground hover:text-primary duration-200 py-2 w-full sm:w-fit px-6 rounded-full mx-auto text-sm"
      >
        {isPending ? (
          <>
            Fazendo cadastro <Loader className="animate-spin" size={16} />
          </>
        ) : (
          <>Fazer Cadastro</>
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
