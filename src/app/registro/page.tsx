import { redirect } from 'next/navigation';

// Maral cotiza sin cuentas de cliente: la ruta heredada de SYSCOM va a contacto.
export default function Registro() {
  redirect('/contacto');
}
