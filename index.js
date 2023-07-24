import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-4efbe-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const shoppingList = document.getElementById("cart-items");

addButton.addEventListener("click", function() {
    let inputValue = inputField.value;
    push(shoppingListInDB, inputValue);
    clearInputField();
    addItemToShoppingList(inputValue);

})

function clearInputField() {
    inputField.value = "";
}

function addItemToShoppingList(item) {
    shoppingList.innerHTML += `<li>${item}</li>`
}