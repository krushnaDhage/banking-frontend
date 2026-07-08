import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function AccountActions({ account, onBalanceUpdated }) {
    const [amount, setAmount] = useState("");
    const [loadingAction, setLoadingAction] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const performTransaction = async (action) => {
        setError("");
        setMessage("");

        const numericAmount = Number(amount);

        if (!amount || numericAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        try {
            setLoadingAction(action);

            const response = await axiosInstance.patch(
                `/accounts/${account.id}/${action}`,
                {
                    amount: numericAmount,
                }
            );

            onBalanceUpdated(response.data);

            setAmount("");

            setMessage(
                action === "deposit"
                    ? "Deposit successful."
                    : "Withdrawal successful."
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                `${action} failed.`
            );
        } finally {
            setLoadingAction("");
        }
    };

    const isLoading = Boolean(loadingAction);

    return (
        <div>
            <div className="mb-4">
                <h4 className="text-sm font-bold text-white">
                    Account Actions
                </h4>

                <p className="mt-1 text-xs text-slate-400">
                    Deposit funds or withdraw from this account.
                </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                <div className="flex-1">
                    <label
                        htmlFor={`amount-${account.id}`}
                        className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                        Amount
                    </label>

                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-semibold text-slate-500">
                            ₹
                        </span>

                        <input
                            id={`amount-${account.id}`}
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(event) =>
                                setAmount(event.target.value)
                            }
                            disabled={isLoading}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-8 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:flex">
                    <button
                        type="button"
                        onClick={() =>
                            performTransaction("deposit")
                        }
                        disabled={isLoading}
                        className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loadingAction === "deposit"
                            ? "Depositing..."
                            : "Deposit"}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            performTransaction("withdraw")
                        }
                        disabled={isLoading}
                        className="rounded-lg bg-amber-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loadingAction === "withdraw"
                            ? "Withdrawing..."
                            : "Withdraw"}
                    </button>
                </div>
            </div>

            {message && (
                <div
                    role="status"
                    className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                >
                    {message}
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    {error}
                </div>
            )}
        </div>
    );
}

export default AccountActions;