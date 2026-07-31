import { useState, useEffect } from "react"
const ThemeToggle = () => {
 const [isDarkMode, setIsDarkMode]= useState(false);

useEffect(() => {
   const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty("--color-primary", "#043E9A");  
      root.style.setProperty("--color-secondary", "#70A5FB");
    } else {
      root.style.setProperty("--color-primary", "#70A5FB"); 
      root.style.setProperty("--color-secondary","#043E9A");
    }
},[isDarkMode])

    return (
        <div>
        <button 
            onClick= {() => setIsDarkMode(!isDarkMode)}
            className="bg-primary hover:bg-secondary text-white px-6  rounded-lg  duration-300 cursor-pointer"
        >
            {isDarkMode ?'Light Mode':'Dark Mode'}
        </button>

      </div>
    )
}

export default ThemeToggle;