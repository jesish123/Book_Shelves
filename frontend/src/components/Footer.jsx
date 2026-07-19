const Footer = () => {
    return (
        <footer className="w-full h-16 bg-blue-600 text-white dark:bg-slate-950 dark:text-white shadow-sm flex items-center justify-center px-6">
            <p className="text-sm md:text-base">
                © {new Date().getFullYear()} Book Shelf. All Rights Reserved.
            </p>
        </footer>
    );
};

export default Footer;