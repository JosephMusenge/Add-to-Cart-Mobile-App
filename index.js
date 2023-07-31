// Import Firebase modules from the given URLs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Configure Firebase app settings with the appropriate database URL
const appSettings = {
    databaseURL: "https://shopping-list-app-3bf00-default-rtdb.firebaseio.com/"
}

// Initialize the Firebase app with the provided settings
const app = initializeApp(appSettings)
// Get a reference to the Firebase Realtime Database
const database = getDatabase(app)
// Reference to the 'shoppingList' node in the Firebase Realtime Database
const shoppingListInDB = ref(database, "shoppingList");

const inputField = document.getElementById("grocery");
const addButton = document.querySelector(".submit-btn");
const shoppingList = document.querySelector(".shopping-list");
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const container = document.querySelector(".grocery-container");
const clearBtn = document.querySelector(".clear-btn");

// Function to clear the displayed shopping list on the app
function clearShoppingList() {
    shoppingList.innerHTML = "";
}

// Function to clear the input field
function clearInputField() {
    inputField.value = "";
}


// Variables for the edit feature
let editElement;
let editFlag = false;
let editID = "";

// EVENT LISTENERS
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

// FUNCTIONS

// Function to add or edit an item in the shopping list
function addItem(e) {
  e.preventDefault();
  const value = inputField.value;

  if (value && !editFlag) {
    // Add the item to the Firebase Realtime Database
    push(shoppingListInDB, value);
    const id = new Date().getTime().toString();
    // createListItem(id, value);
    displayAlert("item added to the list", "success");
    container.classList.add("show-container");
    setBackToDefault();

// If the input field has a value and we are in the edit mode
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}

// Function to display an alert message
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // Clear the alert message after a certain time interval
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 100);
}

// Function to clear the entire shopping list
function clearItems() {
  // Clear the shopping list displayed on the webpage
  shoppingList.innerHTML = "";

  // Clear the shoppingList node in the Firebase Realtime Database
  set(shoppingListInDB, null) // set the value of the shoppingList node to null
    .then(() => {
      container.classList.remove("show-container"); // Hide the container if the shopping list is empty
      displayAlert("empty list", "danger"); 
      setBackToDefault();
    })
    .catch((error) => {
      console.error("Error clearing items from the database:", error); // Log the error to the console
    });
}

// Function to delete an item from the shopping list
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const itemID = element.dataset.id;
  shoppingList.removeChild(element);

  if (shoppingList.children.length === 0) {
    container.classList.remove("show-container");
  }

  const itemRef = ref(database, `shoppingList/${itemID}`);
  remove(itemRef).then(() => {
    displayAlert("item deleted", "success");
  }).catch((error) => {
    console.error("Error deleting item from the database:", error);
  });
}

// Function to edit an item in the shopping list
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  inputField.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  addButton.textContent = "edit";
}

// Function to set the app back to its default state
function setBackToDefault() {
  inputField.value = "";
  editFlag = false;
  editID = "";
  addButton.textContent = "submit";
}

// Function to set up the shopping list items from the database when the webpage is loaded
function setupItems() {
  // Listen for changes in the 'shoppingList' node in the Firebase Realtime Database
  onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
      const items = snapshot.val();
      clearShoppingList();

      // Loop through the items in the database and create list items on the app
      for (const itemID in items) {
        const itemValue = items[itemID];
        createListItem(itemID, itemValue);
      }

      container.classList.add("show-container");
    } else {
      // Display a message if the shopping list is empty
      shoppingList.innerHTML = "No items here... yet";
    }
  });
}

// Function to create a new list item on the app
function createListItem(id, value) {
  const element = document.createElement("article");
  element.classList.add("grocery-item");

  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
    <button type="button" class="edit-btn">
      <i class="fas fa-edit"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fas fa-trash"></i>
    </button>
    </div>`;

  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  shoppingList.appendChild(element);
}
