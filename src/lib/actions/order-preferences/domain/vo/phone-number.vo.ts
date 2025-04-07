export class PhoneNumber {
  private readonly value: string;

  constructor(phone: string) {
    const phoneRegex = /^\(?\d{2}\)?[-]?\d{4,5}[-]?\d{4}$/;

    if (!phoneRegex.test(phone)) {
      throw new Error("Número de telefone inválido.");
    }

    // Normaliza o número para um formato padrão (ex: 11999999999)
    this.value = phone.replace(/\D/g, "");
  }

  public getValue(): string {
    return this.value;
  }
}
