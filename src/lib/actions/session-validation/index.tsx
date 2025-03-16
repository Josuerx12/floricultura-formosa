import { UserRoles } from "@prisma/client";
import { Session } from "next-auth";

export class SessionValidation {
  session: Session;

  constructor(session?: Session | null) {
    if (!session) {
      throw new Error(
        "Você deve ta logado para executar essa ação, atualize a pagina e tente novamente."
      );
    }

    this.session = session;
  }

  IsSellerOrAdmin() {
    if (
      this.session.user.role != UserRoles.SELLER &&
      this.session.user.role != UserRoles.ADMIN
    ) {
      throw new Error("Você não tem autorização para executar essa ação.");
    }
  }

  IsAdmin() {
    if (this.session.user.role != UserRoles.ADMIN) {
      throw new Error("Você não tem autorização para executar essa ação.");
    }
  }
}
