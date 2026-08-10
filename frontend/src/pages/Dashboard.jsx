import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import BookCard from "../components/BookCard";
import AddBookModal from "../components/AddBookModal";

const STORAGE_KEY = "books";

const getBooks = () => {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const saveBooks = (books) => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch {
        // ignore
    }
};

const Dashboard = () => {
    const [counts, setCounts] = useState({ want: 0, reading: 0, finished: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const load = () => {
            const books = getBooks() ?? [];
            const c = books.reduce(
                (acc, b) => {
                    acc[b.status] = (acc[b.status] || 0) + 1;
                    return acc;
                },
                { want: 0, reading: 0, finished: 0 }
            );
            setCounts(c);
        };

        load();
        const onStorage = () => load();
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const handleAdd = (book) => {
        const books = getBooks() ?? [];
        const next = { ...book, id: Date.now() };
        const updated = [next, ...books];
        saveBooks(updated);
        setIsModalOpen(false);
        setCounts((c) => ({ ...c, [next.status]: (c[next.status] || 0) + 1 }));
    };

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <div className="flex items-center gap-3">
                        <Link to="/books" className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700">Go to Shelves</Link>
                        <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => setIsModalOpen(true)}>Quick Add</button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border p-4">
                        <h3 className="text-sm font-medium text-slate-600">Want to Read</h3>
                        <p className="mt-2 text-2xl font-bold">{counts.want}</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                        <h3 className="text-sm font-medium text-slate-600">Reading</h3>
                        <p className="mt-2 text-2xl font-bold">{counts.reading}</p>
                    </div>
                    <div className="rounded-2xl border p-4">
                        <h3 className="text-sm font-medium text-slate-600">Finished</h3>
                        <p className="mt-2 text-2xl font-bold">{counts.finished}</p>
                    </div>
                </div>

                <AddBookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAdd} />
            </div>
        </AdminLayout>
    );
};

export default Dashboard;