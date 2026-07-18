const Footer = () => {
    return(
        <footer className="text-center bg-slate-100 text-slate-700 p-4 h-[5vh] dark:bg-slate-950 dark:text-slate-200">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - Book Shelf</p>
            </aside>
        </footer>
    )
}

export default Footer;