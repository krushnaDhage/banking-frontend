import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import axiosInstance from "../api/axiosInstance";

import AccountActions from "../components/AccountActions";
import TransferForm from "../components/TransferForm";
import TransactionHistory from "../components/TransactionHistory";
import CreateAccountForm from "../components/CreateAccountForm";

import { logout } from "../features/auth/authSlice";

function DashboardPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const email = useSelector((state) => state.auth.email);

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [transactionRefreshKey, setTransactionRefreshKey] =
        useState(0);

    const fetchAccounts = useCallback(async () => {
        try {
            setError("");

            const response =
                await axiosInstance.get("/accounts/my");

            setAccounts(response.data);

            return true;
        } catch (error) {
            if (error.response?.status === 401) {
                dispatch(logout());

                navigate("/login", {
                    replace: true,
                });

                return false;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load accounts."
            );

            return false;
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true);

            await fetchAccounts();

            setLoading(false);
        };

        loadDashboard();
    }, [fetchAccounts]);

    const handleLogout = () => {
        dispatch(logout());

        navigate("/login", {
            replace: true,
        });
    };

    const handleAccountUpdated = (updatedAccount) => {
        setAccounts((currentAccounts) =>
            currentAccounts.map((account) =>
                account.id === updatedAccount.id
                    ? updatedAccount
                    : account
            )
        );

        setTransactionRefreshKey(
            (currentKey) => currentKey + 1
        );
    };

    const handleTransferSuccess = async () => {
        await fetchAccounts();

        setTransactionRefreshKey(
            (currentKey) => currentKey + 1
        );
    };

    const handleAccountCreated = (newAccount) => {
        setAccounts((currentAccounts) => [
            ...currentAccounts,
            newAccount,
        ]);
    };

    const totalBalance = accounts.reduce(
        (total, account) =>
            total + Number(account.balance),
        0
    );

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

                    <p className="mt-4 text-sm font-medium text-slate-300">
                        Loading your banking dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <header className="border-b border-slate-800 bg-slate-900/80">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                            Secure Banking
                        </p>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Banking Dashboard
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Welcome, {email}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400 md:w-auto"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <section className="mb-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                        <p className="text-sm font-medium text-slate-400">
                            Total Balance
                        </p>

                        <p className="mt-2 break-words text-3xl font-bold tracking-tight text-white">
                            ₹
                            {totalBalance.toLocaleString(
                                "en-IN",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Across all your accounts
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                        <p className="text-sm font-medium text-slate-400">
                            Active Accounts
                        </p>

                        <p className="mt-2 text-3xl font-bold text-white">
                            {accounts.length}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                            Accounts linked to your profile
                        </p>
                    </div>
                </section>

                <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-white">
                            Create New Account
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Open a new savings or current account.
                        </p>
                    </div>

                    <CreateAccountForm
                        onAccountCreated={
                            handleAccountCreated
                        }
                    />
                </section>

                <section>
                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-white sm:text-2xl">
                            My Accounts
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Manage balances, transactions, deposits,
                            and withdrawals.
                        </p>
                    </div>

                    {!error && accounts.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 px-6 py-12 text-center">
                            <h3 className="font-semibold text-white">
                                No bank accounts yet
                            </h3>

                            <p className="mt-2 text-sm text-slate-400">
                                Create your first account using the
                                form above.
                            </p>
                        </div>
                    )}

                    <div className="grid gap-6">
                        {accounts.map((account) => (
                            <article
                                key={account.id}
                                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg"
                            >
                                <div className="border-b border-slate-800 p-5 sm:p-6">
                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-400">
                                                {
                                                    account.accountType
                                                }
                                            </span>

                                            <h3 className="mt-3 text-xl font-bold text-white">
                                                {
                                                    account.accountType
                                                }{" "}
                                                Account
                                            </h3>

                                            <p className="mt-2 break-all text-sm text-slate-400">
                                                Account Number:{" "}
                                                <span className="font-medium text-slate-200">
                                                    {
                                                        account.accountNumber
                                                    }
                                                </span>
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Account ID:{" "}
                                                {account.id}
                                            </p>
                                        </div>

                                        <div className="sm:text-right">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Available Balance
                                            </p>

                                            <p className="mt-2 break-words text-3xl font-bold text-emerald-400">
                                                ₹
                                                {Number(
                                                    account.balance
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

                                <div className="p-5 sm:p-6">
                                    <AccountActions
                                        account={account}
                                        onBalanceUpdated={
                                            handleAccountUpdated
                                        }
                                    />
                                </div>

                                <div className="border-t border-slate-800 p-5 sm:p-6">
                                    <TransactionHistory
                                        accountId={account.id}
                                        refreshKey={
                                            transactionRefreshKey
                                        }
                                    />
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {accounts.length > 0 && (
                    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-6">
                        <div className="mb-5">
                            <h2 className="text-xl font-bold text-white">
                                Transfer Money
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Send money securely from one of your
                                accounts.
                            </p>
                        </div>

                        <TransferForm
                            accounts={accounts}
                            onTransferSuccess={
                                handleTransferSuccess
                            }
                        />
                    </section>
                )}
            </main>

            <footer className="border-t border-slate-800 py-6">
                <p className="text-center text-xs text-slate-500">
                    Banking Transaction System
                </p>
            </footer>
        </div>
    );
}

export default DashboardPage;