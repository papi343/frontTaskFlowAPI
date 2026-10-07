import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UseAuth } from '../../Hooks/UseAuth';

const schema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  prenom: z.string().min(2, 'Prénom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
});

type FormData = z.infer<typeof schema>;

function Register() {
  const { register: registerAuth } = UseAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setServerError('');
      await registerAuth(data.nom, data.prenom, data.email, data.password);
      navigate('/dashboard', { replace: true });
    } catch {
      setServerError("Une erreur s'est produite. Vérifiez vos informations.");
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

          <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Créer un compte</h2>
          <p className="text-[15px] text-gray-500 mb-8">Rejoignez-nous pour organiser vos projets plus efficacement.</p>

          {serverError && (
            <div className="mb-6 px-4 py-3 bg-red-50/50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Prénom</label>
                <input
                  type="text"
                  {...register('prenom')}
                  placeholder="Jean"
                  className="w-full px-4 py-3 text-[15px] border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5 transition-all placeholder-gray-400"
                />
                {errors.prenom && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.prenom.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nom</label>
                <input
                  type="text"
                  {...register('nom')}
                  placeholder="Dupont"
                  className="w-full px-4 py-3 text-[15px] border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5 transition-all placeholder-gray-400"
                />
                {errors.nom && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.nom.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Adresse email</label>
              <input
                type="email"
                {...register('email')}
                placeholder="vous@exemple.com"
                className="w-full px-4 py-3 text-[15px] border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5 transition-all placeholder-gray-400"
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Mot de passe</label>
              <input
                type="password"
                {...register('password')}
                placeholder="8 caractères minimum"
                className="w-full px-4 py-3 text-[15px] border border-gray-200 rounded-xl bg-gray-50/50 outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5 transition-all placeholder-gray-400"
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 mt-4 bg-gray-900 text-white text-[15px] font-semibold rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:bg-gray-800 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[1px] active:translate-y-0 active:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none transition-all duration-200"
            >
              {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-8 text-center text-[15px] text-gray-500">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="font-semibold text-gray-900 hover:text-gray-700 transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual (Gradient/Image) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_left_bottom,#111827,#0f766e,#064e3b)]"></div>
          {/* Subtle grid pattern over gradient */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-30"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-lg text-white">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center mb-8 shadow-2xl">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="text-4xl font-bold mb-4 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            La collaboration<br />sans effort.
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed font-light">
            Rejoignez des milliers de professionnels qui utilisent TaskFlow pour centraliser leurs projets et booster leur productivité.
          </p>

          {/* Simple Mockup element */}
          <div className="mt-12 w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 font-bold">J</span>
              </div>
              <div>
                <p className="font-semibold text-white">Julien a terminé la tâche</p>
                <p className="text-sm text-gray-400">Refonte page d'accueil</p>
              </div>
              <div className="ml-auto text-emerald-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold">M</span>
              </div>
              <div>
                <p className="font-semibold text-white">Marie a créé un projet</p>
                <p className="text-sm text-gray-400">Campagne Marketing Q3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;