
function Header() {
    return (
        <header className="w-full bg-blue-500 h-12 flex items-center justify-between px-4 shadow-sm">
            <div className="text-2xl text-white font-semibold">Book Shelf</div>
            <button className="bg-white text-blue-600 px-2 py-1 rounded-md text-sm">Add Book</button>
        </header>
    )
}

export default Header;

