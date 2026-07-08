import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function CreateAccountForm({ onAccountCreated }) {
    const [accountType, setAccountType] = useState("SAVINGS");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        try {
            setLoading(true);

            const response = await axiosInstance.post(
                "/accounts",
                {
                    accountType,
                }
            );

            onAccountCreated(response.data);

            setMessage("Account created successfully.");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create account."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                    <label
                        htmlFor="accountType"
                        className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                        Account Type
                    </label>

                    <select
                        id="accountType"
                        value={accountType}
                        onChange={(event) =>
                            setAccountType(event.target.value)
                        }
                        disabled={loading}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <option value="SAVINGS">
                            Savings Account
                        </option>

                        <option value="CURRENT">
                            Current Account
                        </option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Creating..."
                        : "Create Account"}
                </button>
            </div>

            {message && (
                <div
                    role="status"
                    className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                >
                    {message}
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    {error}
                </div>
            )}
        </form>
    );
}

export default CreateAccountForm;