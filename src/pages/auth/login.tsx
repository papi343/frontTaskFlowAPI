import type { z } from 'zod';
import { loginSchema } from '../../shemas/auth.schema';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseAuth } from '../../Hooks/UseAuth';
import { getApiErrorMessage } from '../../Api/axios';
import { useToast } from '../../context/ToastContext';

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const { login } = UseAuth();
  const { success } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError('');
      await login(data.email, data.password);
      success('Connexion réussie ! Heureux de vous revoir.');
      const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(getApiErrorMessage(err, 'Email ou mot de passe incorrect.'));
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left Column: Authentic Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xs">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg tracking-tight">TaskFlow</span>
              <span className="ml-1 text-xs font-semibold text-slate-400">Workspace</span>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bon retour</h1>
            <p className="text-sm text-slate-500 mt-1">Connectez-vous pour accéder à vos tâches et vos projets en cours.</p>
          </div>

          {serverError && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <div className="text-xs font-medium text-rose-700 leading-relaxed">
                {serverError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="nom@entreprise.com"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all placeholder:text-slate-400 ${
                  errors.email
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                    : 'border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all placeholder:text-slate-400 ${
                    errors.password
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                      : 'border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-xs flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-semibold text-slate-900 hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: High-End Real Product Architecture Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white relative items-center justify-center p-12 overflow-hidden border-l border-slate-900">
        {/* Subtle structural grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 max-w-lg w-full space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              TaskFlow Engine 2.0
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Organisez vos projets avec précision et fluidité.
            </h2>
            <p className="mt-3 text-slate-400 text-base leading-relaxed">
              Fini les feuilles volantes et les outils surchargés. Une gestion de tâches pensée pour aller droit au but.
            </p>
          </div>

          {/* Authentic Live Workflow Preview Component */}
          <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-medium text-slate-400 ml-2">Sprint de lancement • 12 tâches</span>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                85% complété
              </span>
            </div>

            {/* Task Item 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-200 line-through">Déploiement de l'API REST v2</p>
                  <p className="text-[10px] text-slate-500">Terminé par Thomas • Il y a 2h</p>
                </div>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">Backend</span>
            </div>

            {/* Task Item 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded border border-slate-600 bg-transparent shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white">Validation des schémas d'authentification</p>
                  <p className="text-[10px] text-amber-400">En cours d'exécution</p>
                </div>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">Priorité Haute</span>
            </div>

            {/* Micro stats footer */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-[10px] flex items-center justify-center font-bold text-white ring-2 ring-slate-900">AL</div>
                  <div className="w-6 h-6 rounded-full bg-slate-600 text-[10px] flex items-center justify-center font-bold text-white ring-2 ring-slate-900">YD</div>
                </div>
                <span>2 collaborateurs actifs</span>
              </div>
              <span className="text-slate-500">Sync API temps réel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
