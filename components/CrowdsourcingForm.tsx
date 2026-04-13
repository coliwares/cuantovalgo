'use client';

import { useState } from 'react';

interface CrowdsourcingFormProps {
  role: string;
  seniority: string;
  location: string;
  currency: 'CLP' | 'USD';
}

export default function CrowdsourcingForm({
  role,
  seniority,
  location,
  currency,
}: CrowdsourcingFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    salary: '',
    yearsExp: '',
    companyType: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/submit-salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          seniority,
          location,
          salary: parseInt(formData.salary),
          currency,
          years_exp: formData.yearsExp ? parseInt(formData.yearsExp) : undefined,
          company_type: formData.companyType || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar datos');
      }

      setStatus('success');
      setFormData({ salary: '', yearsExp: '', companyType: '' });

      // Cerrar después de 3 segundos
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error submitting salary:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    }
  };

  if (!isOpen) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-neon/30 text-center">
        <div className="mb-4">
          <span className="text-4xl">🤝</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          ¿Quieres mejorar estos datos?
        </h3>
        <p className="text-gray-400 mb-4">
          Contribuye tu sueldo anónimamente y ayuda a la comunidad tech chilena a tener datos más precisos.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-neon hover:bg-neon-dim text-black font-bold px-6 py-3 rounded-lg transition-all"
          data-testid="open-crowdsourcing"
        >
          Contribuir mis datos →
        </button>
        <p className="text-xs text-gray-500 mt-3">
          100% anónimo · Sin registro · Ayuda a todos
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-8 border border-neon/30">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Contribuye tus datos
          </h3>
          <p className="text-gray-400 text-sm">
            Ayuda a mejorar la precisión de los datos para toda la comunidad
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>

      {status === 'success' ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h4 className="text-2xl font-bold text-neon mb-2">¡Gracias!</h4>
          <p className="text-gray-300">
            Tu contribución ayudará a mejorar los datos para todos.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sueldo */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Tu sueldo bruto mensual *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-4 text-gray-400 font-bold">
                {currency === 'CLP' ? '$' : 'USD'}
              </span>
              <input
                type="number"
                required
                min="0"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder={currency === 'CLP' ? '1500000' : '3000'}
                className="w-full p-4 pl-16 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-neon text-white text-lg"
                data-testid="crowdsourcing-salary"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currency === 'CLP'
                ? 'Sueldo mensual bruto en pesos chilenos'
                : 'Sueldo mensual en dólares'}
            </p>
          </div>

          {/* Años de experiencia (opcional) */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Años de experiencia (opcional)
            </label>
            <input
              type="number"
              min="0"
              max="30"
              value={formData.yearsExp}
              onChange={(e) => setFormData({ ...formData, yearsExp: e.target.value })}
              placeholder="5"
              className="w-full p-4 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-neon text-white"
              data-testid="crowdsourcing-years"
            />
          </div>

          {/* Tipo de empresa (opcional) */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Tipo de empresa (opcional)
            </label>
            <select
              value={formData.companyType}
              onChange={(e) => setFormData({ ...formData, companyType: e.target.value })}
              className="w-full p-4 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-neon text-white"
              data-testid="crowdsourcing-company"
            >
              <option value="" className="bg-black">Selecciona una opción</option>
              <option value="startup" className="bg-black">Startup</option>
              <option value="fintech" className="bg-black">Fintech</option>
              <option value="corp" className="bg-black">Corporación</option>
              <option value="agencia" className="bg-black">Agencia</option>
              <option value="consultora" className="bg-black">Consultora</option>
              <option value="otro" className="bg-black">Otro</option>
            </select>
          </div>

          {/* Error message */}
          {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-xs">
              ℹ️ <strong>100% anónimo:</strong> No guardamos tu IP, email ni ningún dato personal.
              Solo estadísticas salariales para mejorar el benchmark.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-6 py-3 border border-gray-700 rounded-lg hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="flex-1 px-6 py-3 bg-neon text-black font-bold rounded-lg hover:bg-neon-dim transition-all disabled:opacity-50"
              data-testid="submit-crowdsourcing"
            >
              {status === 'submitting' ? 'Enviando...' : 'Contribuir'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
