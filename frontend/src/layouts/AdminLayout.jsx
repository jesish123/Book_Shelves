import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <Header />

            <div className="flex flex-1">
                <SideBar />

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default AdminLayout;

