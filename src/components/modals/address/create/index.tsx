"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  ScrollText,
  Landmark,
  Building2,
  Hash,
  BadgePlus,
  Loader,
  Plus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddressSchema } from "@/lib/schemas-validator/address.schema";
import { CreateAddressAction, getDistricts } from "@/lib/actions/address";
import { Button } from "@/components/ui/button";
import { Autocomplete } from "@/components/ui/autocomplete";
import useDebounce from "@/hooks/use-debounce";
import { SelectInput } from "@/components/select-input";

const CreateAddressModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [bairro, setBairro] = useState("");
  const [cepValue, setCepValue] = useState("");
  const debouncedCep = useDebounce(cepValue, 500);
  const [autoAddress, setAutoAddress] = useState<any>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AddressSchema),
  });

  useEffect(() => {
    if (debouncedCep && debouncedCep.length === 8) {
      fetch(`https://viacep.com.br/ws/${debouncedCep}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            setAutoAddress(data);
            if (data.localidade) setValue("city", data.localidade);
            if (data.uf) setValue("state", data.uf);
            if (data.logradouro) setValue("street", data.logradouro);
          }
        });
    }
  }, [debouncedCep]);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["createAddress"],
    mutationFn: CreateAddressAction,
    onSuccess: () => {
      setIsOpen(false);
      reset();
      queryClient.resetQueries({ queryKey: ["userAddresses"] });
    },
  });

  async function onSubmit(data: any) {
    await mutateAsync(data);
  }

  const { data } = useQuery({ queryKey: ["districts"], queryFn: getDistricts });

  const ref = useRef<HTMLFormElement | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger className="text-blue-500 my-6 font-medium text-sm drop-shadow">
        Adicionar endereço
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar novo endereço!</DialogTitle>
        </DialogHeader>

        <form
          ref={ref}
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 mx-auto"
        >
          <h4 className="text-start text-sm my-6 font-semibold">
            Preencha o campo abaixo para criar um novo endereço!
          </h4>
          <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
            <MapPin className="text-primary-foreground" size={20} />
            <input
              {...register("zipCode")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-500"
              type="text"
              placeholder="Insira o cep da sua residência!"
              value={cepValue}
              onChange={(e) => setCepValue(e.target.value.replace(/\D/g, ""))}
              maxLength={8}
            />
          </label>

          {errors.zipCode && (
            <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
          )}

          <SelectInput
            data={
              data?.map((d: any) => ({ label: d.district, value: d.id })) || []
            }
            setValue={setValue}
            inputName="bairros"
            label="Bairros"
            value={watch("delivery_fee_id")}
          />

          {errors.delivery_fee_id && (
            <p className="text-red-500 text-sm">
              {errors.delivery_fee_id.message}
            </p>
          )}

          <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
            <Landmark className="text-primary-foreground" size={20} />
            <input
              {...register("street")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-500"
              type="text"
              placeholder="Insira o nome da rua!"
              defaultValue={autoAddress?.logradouro || ""}
            />
          </label>

          {errors.street && (
            <p className="text-red-500 text-sm">{errors.street.message}</p>
          )}

          <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
            <Building2 className="text-primary-foreground" size={20} />
            <input
              {...register("number")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-500"
              type="text"
              placeholder="Insira o numero da residencia!"
            />
          </label>

          {errors.number && (
            <p className="text-red-500 text-sm">{errors.number.message}</p>
          )}

          <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
            <Landmark className="text-primary-foreground" size={24} />
            <input
              {...register("state")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-500"
              type="text"
              placeholder="Insira o nome do seu estado!"
            />
          </label>

          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}

          <label className="flex items-center gap-3 bg-neutral-100 hover:bg-neutral-200 p-3 rounded-xl transition">
            <Landmark className="text-primary-foreground" size={24} />
            <input
              {...register("city")}
              required
              className="w-full bg-transparent outline-none placeholder:text-neutral-500"
              type="text"
              placeholder="Insira o nome da sua cidade!"
            />
          </label>

          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
          <Button
            onClick={() => ref.current?.requestSubmit()}
            type="button"
            className="mt-4"
          >
            <div className="flex items-center justify-center gap-2">
              {isPending ? (
                <>
                  <span>Criando</span> <Loader className="animate-spin" />
                </>
              ) : (
                <>
                  <span>Criar</span> <Plus />
                </>
              )}
            </div>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAddressModal;
