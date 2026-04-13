import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              ¿Estás bien<br />
              <span className="neon-text">pagado?</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl">
              Descubre tu valor de mercado como profesional tech en Chile en 30 segundos.
            </p>
          </div>

          <Link
            href="/calculadora"
            data-testid="cta-calcular"
            className="inline-block bg-neon hover:bg-neon-dim text-black font-bold px-10 py-4 rounded-full text-lg transition-all transform hover:scale-105"
          >
            Calcular mi valor →
          </Link>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-20 border-t border-gray-800">
            <div>
              <div className="text-4xl font-bold neon-text mb-2">1.407</div>
              <div className="text-sm text-gray-500">consultas realizadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold neon-text mb-2">30s</div>
              <div className="text-sm text-gray-500">tiempo promedio</div>
            </div>
            <div>
              <div className="text-4xl font-bold neon-text mb-2">8+</div>
              <div className="text-sm text-gray-500">roles tech</div>
            </div>
            <div>
              <div className="text-4xl font-bold neon-text mb-2">100%</div>
              <div className="text-sm text-gray-500">gratis y anónimo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-20">
            Todo desde<br />
            <span className="neon-text">un solo lugar.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-8 hover:border-neon/50 transition-all">
              <div className="text-5xl mb-6">💰</div>
              <h3 className="text-2xl font-bold mb-4">Rango real</h3>
              <p className="text-gray-400 leading-relaxed">
                Conoce el rango de mercado actualizado para tu rol, nivel y ubicación.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 hover:border-neon/50 transition-all">
              <div className="text-5xl mb-6">📊</div>
              <h3 className="text-2xl font-bold mb-4">Tu percentil</h3>
              <p className="text-gray-400 leading-relaxed">
                Descubre en qué posición estás comparado con el mercado tech chileno.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 hover:border-neon/50 transition-all">
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold mb-4">Insight IA</h3>
              <p className="text-gray-400 leading-relaxed">
                Recomendación personalizada generada por IA sobre cómo mejorar tu situación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-20">
            Cómo<br />
            <span className="neon-text">funciona.</span>
          </h2>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="text-3xl font-bold neon-text min-w-[60px]">01</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Completa el formulario</h3>
                <p className="text-gray-400">5 preguntas simples: cargo, nivel, años de experiencia, ubicación y sueldo actual (opcional).</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="text-3xl font-bold neon-text min-w-[60px]">02</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Obtén tu análisis</h3>
                <p className="text-gray-400">Ve el rango de mercado real, tu posición percentil y datos comparativos.</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="text-3xl font-bold neon-text min-w-[60px]">03</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Recibe recomendaciones</h3>
                <p className="text-gray-400">Insight personalizado generado por IA sobre cómo negociar o mejorar tu compensación.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            Precios para<br />
            <span className="neon-text">tu necesidad.</span>
          </h2>
          <p className="text-xl text-gray-400 mb-20 max-w-2xl">
            Comienza gratis. Accede a análisis avanzados cuando los necesites.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="glass-card rounded-2xl p-8 border-2 border-transparent hover:border-neon/30 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Gratis</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black">$0</span>
                </div>
                <p className="text-gray-400">Para explorar el mercado</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Rango de mercado completo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Percentil vs mercado</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Insight IA básico</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">100% anónimo</span>
                </li>
              </ul>

              <Link
                href="/calculadora"
                className="block w-full text-center bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-all"
              >
                Empezar gratis
              </Link>
            </div>

            {/* Informe */}
            <div className="glass-card rounded-2xl p-8 border-2 border-neon relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-neon text-black text-xs font-bold px-3 py-1 rounded-full">
                Popular
              </div>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Informe Completo</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black neon-text">$2.990</span>
                  <span className="text-gray-400">CLP</span>
                </div>
                <p className="text-gray-400">Análisis profundo una vez</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Todo lo del plan Gratis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Análisis por tipo de empresa</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Proyección salarial 1-2 años</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Comparación local vs remoto USD</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">PDF descargable</span>
                </li>
              </ul>

              <button className="block w-full text-center bg-neon hover:bg-neon-dim text-black font-bold px-6 py-3 rounded-lg transition-all">
                Obtener informe
              </button>
            </div>

            {/* Plan negociación */}
            <div className="glass-card rounded-2xl p-8 border-2 border-transparent hover:border-neon/30 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">Plan Negociación</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-black">$4.990</span>
                  <span className="text-gray-400">CLP</span>
                </div>
                <p className="text-gray-400">Para negociar con confianza</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Todo lo del Informe Completo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Script de negociación paso a paso</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Manejo de objeciones</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Email template para reunión</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-neon text-xl">✓</span>
                  <span className="text-gray-300">Checklist de preparación</span>
                </li>
              </ul>

              <button className="block w-full text-center bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-all">
                Obtener plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8">
            Empieza ahora,<br />
            <span className="neon-text">es gratis.</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Sin registro, sin tarjeta de crédito, 100% anónimo.
          </p>
          <Link
            href="/calculadora"
            className="inline-block bg-neon hover:bg-neon-dim text-black font-bold px-12 py-5 rounded-full text-xl transition-all transform hover:scale-105"
          >
            Calcular mi valor de mercado →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © 2026 Cuantovalgo.cl · Datos de mercado para profesionales tech
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-neon transition-colors">Privacidad</a>
              <a href="#" className="hover:text-neon transition-colors">Términos</a>
              <a href="#" className="hover:text-neon transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
