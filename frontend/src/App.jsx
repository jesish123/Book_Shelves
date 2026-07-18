import Header from "./components/Header"
import Footer from "./components/Footer"
import BookCard from "./components/BookCard"
import BookForm from "./components/BookForm"

function App() {

  return (
    <>
      <Header />
      
      <div className="mt-6 px-4">
        <BookForm />
      </div>

      <div className="pt-4">
        <BookCard />
      </div>

      <Footer />
    </>
  )
}

export default App