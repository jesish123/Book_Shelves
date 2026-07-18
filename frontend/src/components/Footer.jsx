const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-blue-500 text-white p-2 text-center text-sm shadow-inner z-10">
            <div>Copyright © {new Date().getFullYear()} - Book Shelf</div>
        </footer>
    )
}

export default Footer;