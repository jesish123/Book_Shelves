
const BookForm = () => {

   return (
   <form className="flex flex-col justify-center max-w-lg mx-auto px-4 space-y-6 mt-6">

    <div>
        <label
            htmlFor="book-title"
            className="mb-2 text-slate-900 dark:text-slate-100 font-medium text-lg inline-block"
        >
            Book Title
        </label>
        <input
            type="text"
            id="book-title"
            placeholder="Enter Book Title"
            className="px-3.5 py-3 text-base text-slate-900 dark:text-slate-100 dark:bg-slate-800 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 dark:outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
        />
    </div>

    <div>
        <label
            htmlFor="author"
            className="mb-2 text-slate-900 dark:text-slate-100 font-medium text-lg inline-block"
        >
            Author
        </label>
        <input
            type="text"
            id="author"
            placeholder="Enter Author Name"
            className="px-3.5 py-3 text-base text-slate-900 dark:text-slate-100 dark:bg-slate-800 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 dark:outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
        />
    </div>

    <div>
        <label
            htmlFor="status"
            className="mb-2 text-slate-900 dark:text-slate-100 font-medium text-lg inline-block"
        >
            Reading Status
        </label>
        <select
            id="status"
            className="px-3.5 py-3 text-base text-slate-900 dark:text-slate-100 dark:bg-slate-800 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 dark:outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
        >
            <option>Want to Read</option>
            <option>Reading</option>
            <option>Finished</option>
        </select>
    </div>

    <div>
        <label
            htmlFor="cover"
            className="mb-2 text-slate-900 dark:text-slate-100 font-medium text-lg inline-block"
        >
            Book Cover URL
        </label>
        <input
            type="text"
            id="cover"
            placeholder="Enter Cover Image URL"
            className="px-3.5 py-3 text-base text-slate-900 dark:text-slate-100 dark:bg-slate-800 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 dark:outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
        />
    </div>

    <div>
        <label
            htmlFor="rating"
            className="mb-2 text-slate-900 dark:text-slate-100 font-medium text-lg inline-block"
        >
            Rating (Finished Books)
        </label>
        <select
            id="rating"
            className="px-3.5 py-3 text-base text-slate-900 dark:text-slate-100 dark:bg-slate-800 rounded-md bg-white w-full outline-1 -outline-offset-1 outline-slate-300 dark:outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600"
        >
            <option value="0">0 Stars</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
        </select>
    </div>

    <button
        type="submit"
        className="btn btn-active btn-accent bg-blue-500 text-white"
    >
        Add Book
    </button>

    </form>

    
   );
}



export default BookForm;