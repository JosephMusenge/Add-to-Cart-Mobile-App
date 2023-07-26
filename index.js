import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

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
    // addItemToShoppingList(inputValue)

})

// Call onValue Firebase function 
onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearShoppingList();
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];
            addItemToShoppingList(currentItem);
        };
    } else {
        shoppingList.innerHTML = "No items here... yet";
    }
})


function clearShoppingList() {
    shoppingList.innerHTML = "";
}


function clearInputField() {
    inputField.value = "";
}

function addItemToShoppingList(item) {
    // shoppingList.innerHTML += `<li>${item}</li>`
    let itemID = item[0];
    let itemValue = item[1];
    let newElement = document.createElement("li");
    newElement.textContent = itemValue;
    shoppingList.append(newElement);

    newElement.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    })
}