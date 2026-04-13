'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserInput } from '@/types';

const ROLES = [
  { value: 'frontend', label: 'Frontend Developer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'fullstack', label: 'Fullstack Developer' },
  { value: 'qa', label: 'QA Engineer' },
  { value: 'product', label: 'Product Manager' },
  { value: 'design', label: 'UX/UI Designer' },
  { value: 'devops', label: 'DevOps Engineer' },
  { value: 'data', label: 'Data Engineer/Scientist' },
];

const SENIORITY_LEVELS = [
  { value: 'junior', label: 'Junior', years: '0-2 años' },
  { value: 'semi', label: 'Semi-Senior', years: '2-4 años' },
  { value: 'senior', label: 'Senior', years: '4-8 años' },
  { value: 'lead', label: 'Lead/Staff', years: '8+ años' },
];

const LOCATIONS = [
  { value: 'chile_local', label: 'Chile - Local (CLP)', currency: 'CLP' },
  { value: 'chile_remoto_usd', label: 'Chile - Remoto USD', currency: 'USD' },
  { value: 'latam_remoto_usd', label: 'LATAM - Remoto USD', currency: 'USD' },
];

export default function SalaryForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserInput>({
    role: '',
    seniority: '',
    yearsExp: 0,
    location: '',
    currentSalary: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1 && !formData.role) {
      newErrors.role = 'Selecciona un cargo';
    }
    if (currentStep === 2 && !formData.seniority) {
      newErrors.seniority = 'Selecciona un nivel';
    }
    if (currentStep === 3 && formData.yearsExp < 0) {
      newErrors.yearsExp = 'Ingresa años de experiencia válidos';
    }
    if (currentStep === 4 && !formData.location) {
      newErrors.location = 'Selecciona una ubicación';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    if (validateStep(step)) {
      // Construir query params
      const params = new URLSearchParams({
        role: formData.role,
        seniority: formData.seniority,
        yearsExp: formData.yearsExp.toString(),
        location: formData.location,
        ...(formData.currentSalary && { salary: formData.currentSalary.toString() }),
      });

      router.push(`/calculadora/resultado?${params.toString()}`);
    }
  };

  const getCurrency = () => {
    const loc = LOCATIONS.find((l) => l.value === formData.location);
    return loc?.currency || 'CLP';
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 mx-1 rounded-full ${
                s <= step ? 'bg-neon' : 'bg-gray-800'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-400 text-center">
          Paso {step} de 5
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 md:p-12">
        {/* Step 1: Cargo */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">¿Cuál es tu cargo?</h2>
            <select
              data-testid="role-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-4 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-neon text-white"
            >
              <option value="" className="bg-black">Selecciona tu cargo</option>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value} className="bg-black">
                  {role.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-2 text-red-400 text-sm" data-testid="role-error">
                {errors.role}
              </p>
            )}
          </div>
        )}

        {/* Step 2: Seniority */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">¿Cuál es tu nivel?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SENIORITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  data-testid={`seniority-${level.value}`}
                  onClick={() => setFormData({ ...formData, seniority: level.value })}
                  className={`p-6 border-2 rounded-xl text-left transition-all ${
                    formData.seniority === level.value
                      ? 'border-neon bg-neon/10'
                      : 'border-gray-700 hover:border-neon/50 bg-white/5'
                  }`}
                >
                  <div className="font-bold text-lg">{level.label}</div>
                  <div className="text-sm text-gray-400">{level.years}</div>
                </button>
              ))}
            </div>
            {errors.seniority && (
              <p className="mt-2 text-red-400 text-sm">{errors.seniority}</p>
            )}
          </div>
        )}

        {/* Step 3: Years of experience */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">¿Cuántos años de experiencia tienes?</h2>
            <input
              type="number"
              data-testid="years-exp"
              min="0"
              max="30"
              value={formData.yearsExp}
              onChange={(e) =>
                setFormData({ ...formData, yearsExp: parseInt(e.target.value) || 0 })
              }
              className="w-full p-4 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-neon text-white text-xl font-bold"
            />
            <div className="mt-6">
              <input
                type="range"
                min="0"
                max="15"
                value={formData.yearsExp}
                onChange={(e) =>
                  setFormData({ ...formData, yearsExp: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>0 años</span>
                <span>15+ años</span>
              </div>
            </div>
            {errors.yearsExp && (
              <p className="mt-2 text-red-400 text-sm">{errors.yearsExp}</p>
            )}
          </div>
        )}

        {/* Step 4: Location */}
        {step === 4 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">¿Dónde trabajas?</h2>
            <div className="space-y-4">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.value}
                  data-testid={`location-${loc.value.replace(/_/g, '-')}`}
                  onClick={() => setFormData({ ...formData, location: loc.value })}
                  className={`w-full p-6 border-2 rounded-xl text-left transition-all text-lg ${
                    formData.location === loc.value
                      ? 'border-neon bg-neon/10'
                      : 'border-gray-700 hover:border-neon/50 bg-white/5'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
            {errors.location && (
              <p className="mt-2 text-red-400 text-sm">{errors.location}</p>
            )}
          </div>
        )}

        {/* Step 5: Current salary (optional) */}
        {step === 5 && (
          <div>
            <h2 className="text-3xl font-bold mb-4">
              ¿Cuál es tu sueldo actual? <span className="text-gray-500 text-2xl">(opcional)</span>
            </h2>
            <p className="text-gray-400 mb-6">
              Esta información nos permite calcular tu percentil exacto vs el mercado.
            </p>
            <div className="relative">
              <span className="absolute left-4 top-4 text-gray-400 font-bold text-lg">
                {getCurrency() === 'CLP' ? '$' : 'USD'}
              </span>
              <input
                type="number"
                data-testid="current-salary"
                placeholder={getCurrency() === 'CLP' ? '1500000' : '3000'}
                value={formData.currentSalary || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentSalary: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full p-4 pl-16 bg-white/5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-neon focus:border-neon text-white text-xl font-bold"
              />
            </div>
            <p className="mt-3 text-sm text-gray-400">
              {getCurrency() === 'CLP'
                ? 'Ingresa tu sueldo bruto mensual en pesos chilenos'
                : 'Ingresa tu sueldo mensual en dólares'}
            </p>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-10">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-gray-700 rounded-lg hover:bg-white/5 transition-all"
            >
              ← Atrás
            </button>
          )}
          {step < 5 ? (
            <button
              data-testid="next-btn"
              onClick={handleNext}
              className="ml-auto px-8 py-3 bg-neon text-black font-bold rounded-lg hover:bg-neon-dim transition-all"
            >
              Siguiente →
            </button>
          ) : (
            <button
              data-testid="ver-resultado"
              onClick={handleSubmit}
              className="ml-auto px-10 py-4 bg-neon text-black font-bold rounded-lg hover:bg-neon-dim transition-all transform hover:scale-105"
            >
              Ver mi resultado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
