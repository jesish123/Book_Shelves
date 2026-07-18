import React from "react";

function BookCard() {
  return (
    <main className="p-4 pb-20 min-h-[70vh]">
      <div className="grid grid-cols-3 gap-4">

        {/* Want to Read */}
        <section>
          <h2 className="text-xl font-bold mb-3">Want to Read</h2>

          <div className="border p-3 rounded mb-3 bg-white">
            <div className="bg-gray-300 h-32 flex items-center justify-center mb-3">
              Cover
            </div>
            <h3 className="font-semibold">The Hobbit</h3>
            <p>J.R.R. Tolkien</p>
            <span className="bg-blue-500 text-white px-2 py-1 rounded">
              Want to Read
            </span>
          </div>

          <div className="border p-3 rounded bg-white">
            <div className="bg-gray-300 h-32 flex items-center justify-center mb-3">
              Cover
            </div>
            <h3 className="font-semibold">Dune</h3>
            <p>Frank Herbert</p>
            <span className="bg-blue-500 text-white px-2 py-1 rounded">
              Want to Read
            </span>
          </div>
        </section>

        {/* Reading */}
        <section>
          <h2 className="text-xl font-bold mb-3">Reading</h2>

          <div className="border p-3 rounded mb-3 bg-white">
            <div className="bg-gray-300 h-32 flex items-center justify-center mb-3">
              Cover
            </div>
            <h3 className="font-semibold">The Name of the Wind</h3>
            <p>Patrick Rothfuss</p>
            <span className="bg-yellow-500 text-white px-2 py-1 rounded">
              Reading
            </span>
          </div>

          <div className="border p-3 rounded bg-white">
            <div className="bg-gray-300 h-32 flex items-center justify-center mb-3">
              Cover
            </div>
            <h3 className="font-semibold">Project Hail Mary</h3>
            <p>Andy Weir</p>
            <span className="bg-yellow-500 text-white px-2 py-1 rounded">
              Reading
            </span>
          </div>
        </section>

        {/* Finished */}
        <section>
          <h2 className="text-xl font-bold mb-3">Finished</h2>

          <div className="border p-3 rounded mb-3 bg-white">
            <div className="bg-gray-300 h-32 flex items-center justify-center mb-3">
              Cover
            </div>
            <h3 className="font-semibold">1984</h3>
            <p>George Orwell</p>
            <span className="bg-green-500 text-white px-2 py-1 rounded">
              Finished
            </span>
            <p className="mt-2">⭐⭐⭐⭐⭐</p>
          </div>

          <div className="border p-3 rounded bg-white">
            <div className="bg-gray-300 h-32 flex items-center justify-center mb-3">
              Cover
            </div>
            <h3 className="font-semibold">To Kill a Mockingbird</h3>
            <p>Harper Lee</p>
            <span className="bg-green-500 text-white px-2 py-1 rounded">
              Finished
            </span>
            <p className="mt-2">⭐⭐⭐⭐</p>
          </div>
        </section>

      </div>
    </main>
  );
}

export default BookCard;