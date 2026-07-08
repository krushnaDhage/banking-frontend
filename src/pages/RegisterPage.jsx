import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await axiosInstance.post(
                "/auth/register",
                formData
            );

            navigate("/login", {
                replace: true,
                state: {
                    message:
                        "Registration successful. Please login.",
                },
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">

                <div className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">

                    {/* LEFT INFORMATION PANEL */}

                    <section className="hidden bg-slate-900 p-12 lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                                Secure Banking
                            </p>

                            <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight text-white">
                                Start managing your finances from one secure dashboard.
                            </h1>

                            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                                Create your banking profile, open savings
                                or current accounts, perform secure
                                transactions, and monitor account activity.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-4">
                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                                <p className="font-semibold text-white">
                                    Secure Authentication
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Passwords are protected using BCrypt
                                    hashing and JWT-based authentication.
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                                <p className="font-semibold text-white">
                                    Complete Account Management
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Create accounts, manage balances, transfer
                                    funds, and review transaction history.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* REGISTRATION FORM */}

                    <section className="border-slate-800 p-6 sm:p-10 lg:border-l lg:p-12">
                        <div className="mx-auto max-w-md">

                            <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                                Create Profile
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                                Create your account
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Register your profile to access the banking dashboard.
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-8 space-y-5"
                            >
                                {/* FULL NAME */}

                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="mb-2 block text-sm font-semibold text-slate-300"
                                    >
                                        Full Name
                                    </label>

                                    <input
                                        id="fullName"
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        autoComplete="name"
                                        placeholder="Enter your full name"
                                        disabled={loading}
                                        required
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </div>

                                {/* EMAIL */}

                                <div>
                                    <label
                                        htmlFor="registerEmail"
                                        className="mb-2 block text-sm font-semibold text-slate-300"
                                    >
                                        Email Address
                                    </label>

                                    <input
                                        id="registerEmail"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        disabled={loading}
                                        required
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </div>

                                {/* PASSWORD */}

                                <div>
                                    <label
                                        htmlFor="registerPassword"
                                        className="mb-2 block text-sm font-semibold text-slate-300"
                                    >
                                        Password
                                    </label>

                                    <input
                                        id="registerPassword"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        placeholder="Create a secure password"
                                        disabled={loading}
                                        required
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </div>

                                {/* ERROR */}

                                {error && (
                                    <div
                                        role="alert"
                                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                                    >
                                        {error}
                                    </div>
                                )}

                                {/* REGISTER BUTTON */}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Creating account..."
                                        : "Create Account"}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-slate-400">
                                Already have an account?{" "}

                                <Link
                                    to="/login"
                                    className="font-bold text-blue-400 transition hover:text-blue-300"
                                >
                                    Sign in
                                </Link>
                            </p>

                            <p className="mt-8 text-center text-xs text-slate-600">
                                Banking Transaction System
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;