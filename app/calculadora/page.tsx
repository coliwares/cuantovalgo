import SalaryForm from '@/components/SalaryForm';
import Link from 'next/link';

export default function CalculadoraPage() {
  return (
    <main className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-8 text-gray-400 hover:text-neon transition-colors">
            ← Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-6xl font-black mb-4">
            Calculadora <span className="neon-text">Salarial</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Completa estos 5 pasos para descubrir tu valor de mercado
          </p>
        </div>
        <SalaryForm />
      </div>
    </main>
  );
}
