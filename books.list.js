'use strict';

window.onload = function() {
    console.log("App started");
    booksList.init();
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
        document.getElementById("saveButton").addEventListener("click", (e) => this.saveButton(e));
        this.loadDataFromStorage();
    }

    saveButton(e) {
        e.preventDefault();
        console.log(e);
        const title = document.getElementById("bookTitle").value;
        const author = document.getElementById("bookAuthor").value;

        if(title === "" || author === "") {
            console.log("NO DATA!");
            return;
        }

        this.addBook( new Book(title, author));
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
        this.books.push(book);
        ui.addBookToTable(book);
        this.saveData();
    }

    saveData() {
        storage.saveItems(this.books);
    }

    removeBookById(bookId) {
        this.books.forEach(
            (element, index) => {
                if(element.id == bookId) this.books.splice(index, 1);
            }
        );

        this.saveData();
    }
}

const booksList = new BooksList();

class UserInterface {
    addBookToTable(book) {
        const tbody = document.querySelector("#booksTable tbody");
        const tr = document.createElement("tr");
        tr.innerHTML = 
           `<td>${book.title}</td>
            <td>${book.author}</td>
            <td> <button data-book-id="${book.id}" type="button" class="btn btn-danger btn-sm delete">Remove</button> </td>`
        ;
        tbody.appendChild(tr);

        let removeButton = document.querySelector(`button.delete[data-book-id='${book.id}']`);
        removeButton.addEventListener("click", 
            (e) => this.removeBook(e)
        );

        this.clearForm();
    }

    removeBook(e) {
        const bookId = e.target.getAttribute("data-book-id");
        e.target.parentElement.parentElement.remove();
        booksList.removeBookById(bookId);
    }

    clearForm() {
        document.getElementById("bookTitle").value = "";
        document.getElementById("bookAuthor").value = "";
    }
}

const ui = new UserInterface();

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

const storage = new Storage();