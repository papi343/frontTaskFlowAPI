import type { z } from 'zod';
import { loginShema } from '../../shemas/auth.schema';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseAuth } from '../../Hooks/UseAuth';

type LoginFormData = z.infer<typeof loginShema>;

function Login() {
  const { login } = UseAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginShema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError('');
      await login(data.email, data.password);
      const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch {
      setServerError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 xl:p-32 relative">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-xl tracking-tight">TaskFlow</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Bon retour !</h2>
          <p className="text-[15px] text-gray-500 mb-8">Veuillez entrer vos identifiants pour vous connecter.</p>

          {serverError && (
            <div className="mb-6 px-4 py-3 bg-red-50/50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="vous@exemple.com"
                className="w-full px-4 py-3 text-[15px] border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5 transition-all placeholder-gray-400"
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
                  Mot de passe
                </label>
              </div>
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-[15px] border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5 transition-all placeholder-gray-400"
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 mt-2 bg-gray-900 text-white text-[15px] font-semibold rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:bg-gray-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[1px] active:translate-y-0 active:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none transition-all duration-200"
            >
              {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-8 text-center text-[15px] text-gray-500">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual (Gradient/Image) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right_bottom,#111827,#312e81,#4c1d95)]"></div>
          {/* Subtle grid pattern over gradient */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-lg text-white">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <h3 className="text-4xl font-bold mb-4 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Gérez vos projets<br />avec élégance.
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed font-light">
            Une interface épurée, fluide et moderne pour organiser vos tâches sans friction. Conçu pour les équipes exigeantes.
          </p>

          {/* Floating UI Elements Mockup */}
          <div className="mt-12 relative h-48 w-full">
            <div className="absolute left-0 top-0 w-64 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex gap-3 items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                </div>
                <div className="h-2 w-24 bg-white/20 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-white/10 rounded-full"></div>
                <div className="h-2 w-4/5 bg-white/10 rounded-full"></div>
              </div>
            </div>

            <div className="absolute right-4 top-12 w-64 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex gap-3 items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                </div>
                <div className="h-2 w-20 bg-white/20 rounded-full"></div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="h-6 w-16 bg-white/10 rounded-full"></div>
                <div className="h-6 w-6 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
