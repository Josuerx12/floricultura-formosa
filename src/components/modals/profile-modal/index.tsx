import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileImage } from "lucide-react";
import { User } from "next-auth";
import Image from "next/image";

const ProfileModal = ({
  onClose,
  isOpen,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}) => {
  return (
    <Dialog open={isOpen} modal={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Perfil do usuário!</DialogTitle>
        </DialogHeader>

        <form className="w-full mx-auto">
          <div className="flex flex-col w-fit items-center mx-auto">
            <img
              src={user?.image ? user.image : "/no-profile.svg"}
              width={100}
              height={100}
              alt="profile pic"
              className="rounded-full"
            />

            <input
              type="file"
              id="file"
              multiple={false}
              accept="image/png, image/jpeg"
              className="hidden"
            />
            <label
              title="Alterar foto de perfil!"
              htmlFor="file"
              className="w-fit bg-primary p-2 rounded mt-3 text-sm text-primary-foreground cursor-pointer hover:text-primary hover:bg-primary-foreground duration-200 flex gap-2 items-center"
            >
              <p>Alterar foto</p>
              <FileImage size={16} />
            </label>
          </div>
          <div className="flex flex-col gap-y-4 items-center w-full">
            <label className="w-full flex-grow">
              <span className="font-semibold text-sm">Nome:</span>
              <input
                className="w-full"
                type="text"
                defaultValue={user?.name ?? "Nome do usuário não identificado!"}
                disabled
              />
            </label>

            <label className="w-full flex-grow">
              <span className="font-semibold text-sm">Email:</span>
              <input
                className="w-full"
                type="email"
                defaultValue={user?.email ?? "Email não identificado!"}
                disabled
              />
            </label>

            <label className="w-full flex-grow">
              <span className="font-semibold text-sm">Telefone:</span>
              <input
                className="w-full"
                type="tel"
                defaultValue={user?.phone ?? "Sem numero cadastrado!"}
                disabled
              />
            </label>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
