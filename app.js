const booksContainer = document.getElementById("booksContainer");
const bookForm = document.getElementById("bookForm");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const bookCount = document.getElementById("bookCount");

let books = [];

// Load Books
async function loadBooks() {

    const savedBooks = localStorage.getItem("books");

    if (savedBooks) {
        books = JSON.parse(savedBooks);
        renderBooks();
        return;
    }

    const response = await fetch("books.json");
    books = await response.json();

    saveBooks();
    renderBooks();
}

// Save Books
function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

// Render Books
function renderBooks() {

    booksContainer.innerHTML = "";

    let filteredBooks = books;

    const searchValue = searchInput.value.toLowerCase();

    if (searchValue) {
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(searchValue)
        );
    }

    const selectedCategory = categoryFilter.value;

    if (selectedCategory !== "all") {
        filteredBooks = filteredBooks.filter(
            book => book.category === selectedCategory
        );
    }

    filteredBooks.forEach((book, index) => {

        const card = document.createElement("div");
        card.classList.add("book-card");

        card.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Category:</strong> ${book.category}</p>
            <p><strong>Year:</strong> ${book.year}</p>

            <button class="delete-btn" onclick="deleteBook(${index})">
                Delete
            </button>
        `;

        booksContainer.appendChild(card);
    });

    updateStats();
    updateCategories();
}

// Add Book
bookForm.addEventListener("submit", function(e){

    e.preventDefault();

    const newBook = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        category: document.getElementById("category").value,
        year: document.getElementById("year").value
    };

    books.push(newBook);

    saveBooks();
    renderBooks();

    bookForm.reset();
});

// Delete Book
function deleteBook(index){

    books.splice(index,1);

    saveBooks();
    renderBooks();
}

// Statistics
function updateStats(){
    bookCount.textContent = books.length;
}

// Categories
function updateCategories(){

    const categories = [
        ...new Set(books.map(book => book.category))
    ];

    categoryFilter.innerHTML =
        `<option value="all">All Categories</option>`;

    categories.forEach(category => {

        categoryFilter.innerHTML += `
            <option value="${category}">
                ${category}
            </option>
        `;
    });
}

// Search
searchInput.addEventListener("input", renderBooks);

// Filter
categoryFilter.addEventListener("change", renderBooks);

loadBooks();