import ThemeToggle from "./ThemeToggle";

function Header (){
    return(
        <header className="w-full shadow-sm bg-blue-600 h-16 px-6 flex items-center justify-between text-white dark:bg-slate-950 dark:text-white">
            <a className="text-3xl font-semibold">Book Shelf</a>
            <ThemeToggle/>
        </header>
    )
}

export default Header;

