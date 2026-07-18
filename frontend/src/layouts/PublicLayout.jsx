import Header from '../components/Header'
import Footer from "../components/Footer"
const PublicLayout = ({children}) =>{

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <div>
                <Header/>
            </div>
            <div className=' grow flex items-center justify-center'>
                {children}
            </div>
            <div>
                <Footer/>
            </div>
        </div>
    );


}

export default PublicLayout;