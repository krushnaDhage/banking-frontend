import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function TransferForm({ accounts, onTransferSuccess }) {
    const [senderAccountId, setSenderAccountId] = useState("");
    const [receiverAccountId, setReceiverAccountId] = useState("");
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");

        const senderId = Number(senderAccountId);
        const receiverId = Number(receiverAccountId);
        const numericAmount = Number(amount);

        if (!senderId || !receiverId || numericAmount <= 0) {
            setError("Please enter valid transfer details.");
            return;
        }

        if (senderId === receiverId) {
            setError(
                "Sender and receiver accounts cannot be the same."
            );
            return;
        }

        try {
            setLoading(true);

            await axiosInstance.post(
                "/accounts/transfer",
                {
                    senderAccountId: senderId,
                    receiverAccountId: receiverId,
                    amount: numericAmount,
                }
            );

            await onTransferSuccess();

            setSenderAccountId("");
            setReceiverAccountId("");
            setAmount("");

            setMessage("Money transferred successfully.");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Transfer failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <div className="grid gap-5 lg:grid-cols-3">
                    {/* SENDER ACCOUNT */}

                    <div>
                        <label
                            htmlFor="senderAccount"
                            className="mb-2 block text-sm font-semibold text-slate-300"
                        >
                            From Account
                        </label>

                        <select
                            id="senderAccount"
                            value={senderAccountId}
                            onChange={(event) =>
                                setSenderAccountId(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <option value="">
                                Select sender account
                            </option>

                            {accounts.map((account) => (
                                <option
                                    key={account.id}
                                    value={account.id}
                                >
                                    {account.accountType}
                                    {" • "}
                                    {account.accountNumber}
                                    {" • ₹"}
                                    {Number(
                                        account.balance
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* RECEIVER ACCOUNT */}

                    <div>
                        <label
                            htmlFor="receiverAccount"
                            className="mb-2 block text-sm font-semibold text-slate-300"
                        >
                            Receiver Account ID
                        </label>

                        <input
                            id="receiverAccount"
                            type="number"
                            min="1"
                            placeholder="Enter receiver account ID"
                            value={receiverAccountId}
                            onChange={(event) =>
                                setReceiverAccountId(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            required
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                    </div>

                    {/* AMOUNT */}

                    <div>
                        <label
                            htmlFor="transferAmount"
                            className="mb-2 block text-sm font-semibold text-slate-300"
                        >
                            Transfer Amount
                        </label>

                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-semibold text-slate-500">
                                ₹
                            </span>

                            <input
                                id="transferAmount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(event) =>
                                    setAmount(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                                required
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-8 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            />
                        </div>
                    </div>
                </div>

                {/* TRANSFER SUMMARY */}

                {senderAccountId &&
                    receiverAccountId &&
                    Number(amount) > 0 && (
                        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                                Transfer Summary
                            </p>

                            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        From Account
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-200">
                                        #{senderAccountId}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        To Account
                                    </p>

                                    <p className="mt-1 font-semibold text-slate-200">
                                        #{receiverAccountId}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Amount
                                    </p>

                                    <p className="mt-1 font-bold text-blue-400">
                                        ₹
                                        {Number(
                                            amount
                                        ).toLocaleString(
                                            "en-IN",
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">
                        Verify the receiver account ID before
                        confirming the transfer.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Transferring..."
                            : "Transfer Money"}
                    </button>
                </div>
            </form>

            {message && (
                <div
                    role="status"
                    className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                >
                    {message}
                </div>
            )}

            {error && (
                <div
                    role="alert"
                    className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    {error}
                </div>
            )}
        </div>
    );
}

export default TransferForm;