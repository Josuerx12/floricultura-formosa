import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const WppBtn = () => {
  return (
    <Link
      href="https://wa.me/seu-numero"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 bottom-4 right-4 group flex items-center bg-green-600 p-2 md:p-4 rounded-full text-white shadow-lg transition-all duration-300 hover:bg-green-700"
    >
      <FaWhatsapp className="text-3xl" />
      <span className="hidden md:block w-0 h-0  overflow-hidden opacity-0 transition-all duration-300 group-hover:w-fit group-hover:h-fit group-hover:opacity-100 group-hover:ml-2 text-lg font-medium">
        Atendimento por WhatsApp
      </span>
    </Link>
  );
};

export default WppBtn;
