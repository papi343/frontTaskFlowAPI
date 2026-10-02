import type { z } from "zod";
import { loginShema } from "../../shemas/auth.schema";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseAuth } from "../../Hooks/UseAuth";



type loginFormData = z.infer<typeof loginShema>;
function Login() {
    const { login } = UseAuth()
    const location = useLocation();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<loginFormData>({ resolver: zodResolver(loginShema) });


    const onSubmit = async (data: loginFormData) => {

        try {
            setServerError('');
            await login(data.email, data.password);
            const from = (location.state as { from?: Location })?.from?.pathname || "/dashboard";
            navigate(from, { replace: true });
        }
        catch (error) {
            setServerError('email ou password incorect')
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">

                    connexion

                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Connectez-vous à votre compte TaskFlow.
                </p>


                {serverError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
                        <p>{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium">
                            Email
                        </label>
                        <input type="email"
                            {...register('email')}
                            className="w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2" />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium">
                            Mot de passe
                        </label>
                        <input type="password"
                            {...register('password')}
                            className="w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2" />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <button type="submit" disabled={isSubmitting}
                        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-white disabled:opacity-50">
                        {isSubmitting ? "connexion...." : "connexion"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Vous n'avez pas de compte?
                    <Link to="/register" className="font-medium text-gray-900 hover:underline">
                        Inscrivez-vous
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login;
