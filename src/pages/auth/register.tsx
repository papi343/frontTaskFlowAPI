import type { z } from 'zod';
import { registerSchema } from '../../shemas/auth.schema';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseAuth } from '../../Hooks/UseAuth';
import { getApiErrorMessage } from '../../Api/axios';
import { useToast } from '../../context/ToastContext';

type RegisterFormData = z.infer<typeof registerSchema>;

function Register() {
  const { register: registerAuth } = UseAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError('');
      await registerAuth(data.nom, data.prenom, data.email, data.password);
      success('Votre compte a été créé avec succès ! Bienvenue.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(getApiErrorMessage(err, "Une erreur s'est produite lors de l'inscription."));
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left Column: Register Form */}
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
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Créer un compte</h1>
            <p className="text-sm text-slate-500 mt-1">Rejoignez TaskFlow pour gérer vos projets avec simplicité et rigueur.</p>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="prenom" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Prénom
                </label>
                <input
                  id="prenom"
                  type="text"
                  autoComplete="given-name"
                  {...register('prenom')}
                  placeholder="Jean"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all placeholder:text-slate-400 ${
                    errors.prenom
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                      : 'border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10'
                  }`}
                />
                {errors.prenom && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.prenom.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="nom" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nom
                </label>
                <input
                  id="nom"
                  type="text"
                  autoComplete="family-name"
                  {...register('nom')}
                  placeholder="Dupont"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 outline-none transition-all placeholder:text-slate-400 ${
                    errors.nom
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10'
                      : 'border-slate-200 focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-900/10'
                  }`}
                />
                {errors.nom && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{errors.nom.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="jean.dupont@entreprise.com"
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
                  autoComplete="new-password"
                  {...register('password')}
                  placeholder="Au moins 6 caractères"
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
                  <span>Création du compte...</span>
                </>
              ) : (
                <span>Créer mon compte</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="font-semibold text-slate-900 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Editorial Architecture & Security */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white relative items-center justify-center p-12 overflow-hidden border-l border-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="relative z-10 max-w-lg w-full space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 mb-4">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Espace collaboratif
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Votre tableau de bord, configuré en quelques secondes.
            </h2>
            <p className="mt-3 text-slate-400 text-base leading-relaxed">
              Créez vos projets, découpez-les en tâches limpides et suivez votre progression sans configuration complexe.
            </p>
          </div>

          {/* Feature checklist */}
          <div className="grid grid-cols-1 gap-4 pt-2">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Gestion de projets instantanée</h3>
                <p className="text-xs text-slate-400 mt-0.5">Regroupez et filtrez vos tâches par projet sans friction.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Notifications intelligentes</h3>
                <p className="text-xs text-slate-400 mt-0.5">Soyez informé en direct des avancées importantes sans être submergé.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;