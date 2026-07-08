import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import axiosInstance from "../api/axiosInstance";
import { loginSuccess } from "../features/auth/authSlice";

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
            const response = await axiosInstance.post(
                "/auth/login",
                formData
            );

            dispatch(loginSuccess(response.data));

            navigate("/dashboard", {
                replace: true,
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-2">
                    <section className="hidden bg-slate-900 p-12 lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
                                Secure Banking
                            </p>

                            <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight text-white">
                                Manage your money securely and efficiently.
                            </h1>

                            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
                                Access your accounts, review transaction
                                history, deposit funds, withdraw money,
                                and transfer balances from one secure
                                dashboard.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-4">
                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                                <p className="font-semibold text-white">
                                    JWT Authentication
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Stateless API authentication and
                                    protected routes.
                                </p>
                            </div>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                                <p className="font-semibold text-white">
                                    Secure Transactions
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage deposits, withdrawals, transfers,
                                    and transaction history.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="border-slate-800 p-6 sm:p-10 lg:border-l lg:p-12">
                        <div className="mx-auto max-w-md">
                            <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                                Welcome Back
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                                Sign in to your account
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Enter your registered email and password
                                to continue.
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-8 space-y-5"
                            >
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-slate-300"
                                    >
                                        Email Address
                                    </label>

                                    <input
                                        id="email"
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

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-semibold text-slate-300"
                                    >
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        disabled={loading}
                                        required
                                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                    />
                                </div>

                                {error && (
                                    <div
                                        role="alert"
                                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                                    >
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? "Signing in..."
                                        : "Sign In"}
                                </button>
                            </form>

                            <p className="mt-6 text-center text-sm text-slate-400">
                                Don't have an account?{" "}

                                <Link
                                    to="/register"
                                    className="font-bold text-blue-400 transition hover:text-blue-300"
                                >
                                    Create an account
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

export default LoginPage;