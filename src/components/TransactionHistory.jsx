import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function TransactionHistory({ accountId, refreshKey }) {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axiosInstance.get(
                    `/accounts/${accountId}/transactions`,
                    {
                        params: {
                            page,
                            size: 5,
                        },
                    }
                );

                setTransactions(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load transaction history."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [accountId, page, refreshKey]);

    const handlePrevious = () => {
        setPage((currentPage) =>
            Math.max(currentPage - 1, 0)
        );
    };

    const handleNext = () => {
        setPage((currentPage) =>
            Math.min(currentPage + 1, totalPages - 1)
        );
    };

    const formatAmount = (amount) => {
        return Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const getTransactionStyle = (transactionType) => {
        switch (transactionType) {
            case "DEPOSIT":
            case "TRANSFER_IN":
                return {
                    badge:
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                    amount: "text-emerald-400",
                    sign: "+",
                };

            case "WITHDRAW":
            case "WITHDRAWAL":
            case "TRANSFER_OUT":
                return {
                    badge:
                        "border-red-500/30 bg-red-500/10 text-red-300",
                    amount: "text-red-400",
                    sign: "-",
                };

            default:
                return {
                    badge:
                        "border-slate-600 bg-slate-800 text-slate-300",
                    amount: "text-slate-200",
                    sign: "",
                };
        }
    };

    return (
        <div>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h4 className="font-bold text-white">
                        Transaction History
                    </h4>

                    <p className="mt-1 text-xs text-slate-400">
                        Recent activity for this account.
                    </p>
                </div>

                {totalPages > 0 && (
                    <span className="text-xs font-medium text-slate-500">
                        Page {page + 1} of {totalPages}
                    </span>
                )}
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                    {error}
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center py-10">
                    <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

                    <span className="ml-3 text-sm text-slate-400">
                        Loading transactions...
                    </span>
                </div>
            )}

            {!loading &&
                !error &&
                transactions.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-5 py-8 text-center">
                        <p className="text-sm font-semibold text-slate-300">
                            No transactions found
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Account activity will appear here.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                transactions.length > 0 && (
                    <>
                        {/* Desktop table */}

                        <div className="hidden overflow-x-auto rounded-xl border border-slate-800 md:block">
                            <table className="w-full text-left">
                                <thead className="bg-slate-950/70">
                                <tr className="text-xs uppercase tracking-wider text-slate-500">
                                    <th className="px-4 py-3 font-semibold">
                                        Type
                                    </th>

                                    <th className="px-4 py-3 font-semibold">
                                        Related Account
                                    </th>

                                    <th className="px-4 py-3 font-semibold">
                                        Date
                                    </th>

                                    <th className="px-4 py-3 text-right font-semibold">
                                        Amount
                                    </th>
                                </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-800">
                                {transactions.map(
                                    (transaction) => {
                                        const style =
                                            getTransactionStyle(
                                                transaction.transactionType
                                            );

                                        return (
                                            <tr
                                                key={
                                                    transaction.id
                                                }
                                                className="transition hover:bg-slate-800/40"
                                            >
                                                <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${style.badge}`}
                                                        >
                                                            {
                                                                transaction.transactionType
                                                            }
                                                        </span>
                                                </td>

                                                <td className="px-4 py-4 text-sm text-slate-400">
                                                    {transaction.relatedAccountId ??
                                                        "—"}
                                                </td>

                                                <td className="px-4 py-4 text-sm text-slate-400">
                                                    {formatDate(
                                                        transaction.createdAt
                                                    )}
                                                </td>

                                                <td
                                                    className={`px-4 py-4 text-right text-sm font-bold ${style.amount}`}
                                                >
                                                    {
                                                        style.sign
                                                    }
                                                    ₹
                                                    {formatAmount(
                                                        transaction.amount
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}

                        <div className="space-y-3 md:hidden">
                            {transactions.map(
                                (transaction) => {
                                    const style =
                                        getTransactionStyle(
                                            transaction.transactionType
                                        );

                                    return (
                                        <div
                                            key={transaction.id}
                                            className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${style.badge}`}
                                                >
                                                    {
                                                        transaction.transactionType
                                                    }
                                                </span>

                                                <p
                                                    className={`text-sm font-bold ${style.amount}`}
                                                >
                                                    {
                                                        style.sign
                                                    }
                                                    ₹
                                                    {formatAmount(
                                                        transaction.amount
                                                    )}
                                                </p>
                                            </div>

                                            <div className="mt-4 space-y-1">
                                                <p className="text-xs text-slate-400">
                                                    Related Account:{" "}
                                                    <span className="text-slate-300">
                                                        {transaction.relatedAccountId ??
                                                            "—"}
                                                    </span>
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {formatDate(
                                                        transaction.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </>
                )}

            {!loading &&
                !error &&
                totalPages > 1 && (
                    <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-5">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={page === 0}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-xs font-medium text-slate-500">
                            {page + 1} / {totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={page >= totalPages - 1}
                            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-blue-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
        </div>
    );
}

export default TransactionHistory;