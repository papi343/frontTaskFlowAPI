
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { registerShema } from "../../shemas/auth.schema";
import { UseAuth } from "../../Hooks/UseAuth";
import { Link, useNavigate } from "react-router-dom";

type registerFormData = z.infer<typeof registerShema>;

function Register() {
    const { register: registerAuth } = UseAuth();
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const {
        register: registerRHF,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<registerFormData>({
        resolver: zodResolver(registerShema),
    });

    const onSubmit = async (data: registerFormData) => {
        try {
            setServerError('');
            await registerAuth(data.name, data.email, data.password);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            setServerError("une erreur se produite ")
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">
                    Créer un compte
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                    Rejoignez TaskFlow.
                </p>

                {serverError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 space-y-5">
                    <div>
                        <label htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700">
                            Nom complet
                        </label>
                        <input type="text"
                            {...registerRHF("name")}
                            className="w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2" />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input type="email"
                            {...registerRHF('email')}
                            className="w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2" />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                            Mot de pass
                        </label>
                        <input type="password"
                            {...registerRHF("password")}
                            className="w-full rounded-lg border px-4 py-2.5 outline-none focus:ring-2"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <button type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-indigo-600 text-white py-2.5 hover:bg-indigo-700 disabled:opacity-50">
                            {isSubmitting ? "Creation..." : "Creer un compte"}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    vous avez deja un compte ?
                    <Link to="/login" className="font-medium text-gray-900 underline">
                        connecter vous
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default Register;