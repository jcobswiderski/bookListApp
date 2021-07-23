'use strict';

window.onload = function() {
    booksList.init(); // po załadowaniu wszystkich elementów dodaj listener dla przycisku Add i załaduj dane ze Storage
}

class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
        this.id = Date.now();
    }
}

class BooksList {
    constructor() {
        this.books = [];
    }

    init() {
        document.getElementById("saveButton").addEventListener("click", (e) => this.saveButtonClick(e)); // przy kliknieciu Add wywołaj metodę saveButtonClick
        this.loadDataFromStorage(); // załaduj dane z localStorage
    }

    saveButtonClick(e) {
        const title = document.getElementById("bookTitle").value; // wartość title z inputa
        const author = document.getElementById("bookAuthor").value; // wartość author z inputa

        if(title === "" || author === "") {
            console.log("NO DATA!");
            return;
        }

        e.preventDefault(); // nie przesyłaj formularza

        this.addBook( new Book(title, author)); // dodaj nowo utworzoną z danych z inputow ksiązkę funkcją addBook
    }

    loadDataFromStorage() {
        const data = storage.getItems();
        if(data == null || data == undefined) {
            return;
        }

        this.books = data;

        data.forEach( (item) => {
            ui.addBookToTable(item);
        });
    }

    addBook(book) {
        this.books.push(book); // dodaj na koniec tablicy nową książkę
        this.updateStorageData(); // nadpisz storage zaktualizowaną tablicą
        ui.addBookToTable(book); // dodaj nową książkę do tabeli
    }

    updateStorageData() {
        storage.saveItems(this.books); // nadpisz storage zaktualizowaną tablicą
    }

    removeBookById(bookId) {
        this.books.forEach(
            (element, index) => {
                if(element.id == bookId) this.books.splice(index, 1);
            }
        );

        this.updateStorageData(); // po usunięciu książki z tablicy, aktualziacja storage
    }

    moveBookUp(bookId) {
        let arr = this.books;

        for(let i=0; i<arr.length; i++) {
            if(arr[i].id == bookId) {
                if(i > 0) {
                    let temp = arr[i-1];
                    arr[i-1] = arr[i];
                    arr[i] = temp;
                    break;
                }
            }
        }
        this.updateStorageData();
        ui.removeAllBookRows();
        this.loadDataFromStorage();
    }

    moveBookDown(bookId) {
        let arr = this.books;

        for(let i=0; i<arr.length; i++) {
            if(arr[i].id == bookId) {
                if(i <= arr.length-2) {
                    let temp = arr[i+1];
                    arr[i+1] = arr[i];
                    arr[i] = temp;
                    break;
                }
            }
        }
        this.updateStorageData();
        ui.removeAllBookRows();
        this.loadDataFromStorage();
    }
}

class UserInterface {
    addBookToTable(book) {
        const tbody = document.querySelector("#booksTable tbody"); // element tbody, do którego dodamy nowy wiersz

        const tr = document.createElement("tr"); // nowy wiersz
        tr.innerHTML = 
           `<td>${book.title}</td>
            <td>${book.author}</td>
            <td> 
                <button data-book-id="${book.id}" type="button" class="btn btn-danger btn-sm delete">Remove</button> 
                <button data-book-id="${book.id}" type="button" class="btn btn-warning btn-sm up">&#9650</button> 
                <button data-book-id="${book.id}" type="button" class="btn btn-warning btn-sm down">&#9660;</button> 
            </td>`
        ;
        tbody.appendChild(tr); // dodajemy uzupełniony wiersz na koniec tabeli

        let removeButton = document.querySelector(`button.delete[data-book-id='${book.id}']`); // tymczasowy uchwyt do przycisku remove dla utworzonego wiersza
        removeButton.addEventListener("click", (e) => this.removeBook(e)); // listener przypisujacy funkcję removeBook() dla przycisku remove

        let upButton = document.querySelector(`button.up[data-book-id='${book.id}']`);
        upButton.addEventListener("click", (e) => this.arrowUp(e));

        let downButton = document.querySelector(`button.down[data-book-id='${book.id}']`);
        downButton.addEventListener("click", (e) => this.arrowDown(e));

        this.clearForm(); // po dodaniu ksiązki do tabeli czyścimy formularz
    }

    removeBook(e) {
        const bookId = e.target.getAttribute("data-book-id");
        e.target.parentElement.parentElement.remove(); // usuwamy wiersz w tabeli przechowujący daną książkę
        booksList.removeBookById(bookId); // usuwamy książkę z tablicy
    }

    removeAllBookRows() {
        const tbodyRows = document.querySelectorAll("#booksTable tbody tr");

        tbodyRows.forEach( function(elem) {
            elem.remove();
        });
    }

    arrowUp(e) {
        const bookId = e.target.getAttribute("data-book-id");
        console.log("up");
        booksList.moveBookUp(bookId);
    }

    arrowDown(e) {
        const bookId = e.target.getAttribute("data-book-id");
        console.log("down");
        booksList.moveBookDown(bookId);
    }

    clearForm() {
        document.getElementById("bookTitle").value = "";
        document.getElementById("bookAuthor").value = "";

        document.getElementsByTagName("form")[0].classList.remove("was-validated");
    }
}

class Storage {
    getItems() {
        let books = null;

        if(localStorage.getItem("books") !== null)
            books = JSON.parse(localStorage.getItem("books"));
        else
            books = [];
        
        return books;   
    }

    saveItems(books) {
        localStorage.setItem("books", JSON.stringify(books))
    }
}

const booksList = new BooksList();
const ui = new UserInterface();
const storage = new Storage();

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })();