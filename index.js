const StorageCtrl = (function() {

  return {
    // helper function to get data from LS
    getDataFromLS: function() {
      const itemsFromLS = localStorage.getItem('items');
      return itemsFromLS ? JSON.parse(itemsFromLS) : [];
    },

    addItemToLS: function(item) {
      // get elements from LS or create new data structure
      const items = this.getDataFromLS();

      // add item to data structure
      items.push(item);

      // add data structure do LS
      localStorage.setItem('items', JSON.stringify(items));
    },

    removeItemFromLS: function(item) {
      // get elements from LS or create new data structure
      const items = this.getDataFromLS();

      // find and delete item from data structure
      const indexToDelete = items.findIndex(el => el.id === item.id);
      items.splice(indexToDelete, 1);

      // add data structure do LS
      localStorage.setItem('items', JSON.stringify(items));

    },

    updateItemInLS: function(item) {
      // get elements from LS or create new data structure
      const items = this.getDataFromLS();

      // find item to update
      const indexToUpdate= items.findIndex(el => el.id === item.id);
      console.log(indexToUpdate)
      console.log(item[indexToUpdate])
      items[indexToUpdate] = item;

      // add data structure do LS
      localStorage.setItem('items', JSON.stringify(items));
    },

    clearItemsFromLS: function() {
      localStorage.clear();
    }
  }
})();

const DataCtrl = (function() {

  class Item {
    constructor(meal, calories) {
      this.meal = meal;
      this.calories = parseInt(calories);
    }

    // Random unique ID generator method
    addID() {
      const id = '_' + Math.random().toString(36).substr(2, 9);
      this.id = id;
    }
  }

  const state = {
    items: {},
    totalCalories: 0,
    editedItem: null
  };

  return {
    addItemToDataStructure: function(data) {

      //check if data has ID - if yes - it is updated item
      let item;
      if(data.id) {
        item = data;
        item.calories = parseInt(item.calories);
      } else {

        // if data is new > create instance of Item
        item = new Item(data.meal, data.calories);

        // Add unique ID
        item.addID();
      }

      // Add item to state
      state.items[item.id] = item;

      // Add number of calories to total
      state.totalCalories += item.calories;

      // reset edited item
      state.editedItem = null;

      return item;
    },

    getState: function() {
      return state;
    },

    setItemForEdit: function(item) {
      state.editedItem = item;
    },

    subtractFromTotalCalories: function(item) {
      state.totalCalories -= item.calories;
    },

    deleteItem: function(item) {
      // delete item from state
      delete state.items[item.id]

      // reset edited item
      state.editedItem = null;
    },

    clearState: function() {
      state.totalCalories = 0;
      state.items = {};
      state.editedItem = null;
    },

    clearEditItem: function() {
      state.editedItem = null;
    },

    // For testing only
    displayState: function() {
      console.log(state)
    }
  }
})();

const UICtrl = (function() {
  
  // UI elements
  const mealsList = document.querySelector('.items-box__meals');
  const totalCalories = document.querySelector('#total');
  const mealInput = document.querySelector('.hero-box__input--meal');
  const calorieInput = document.querySelector('.hero-box__input--calories');
  const deleteBtn = document.querySelector('.delete-btn');
  const updateBtn = document.querySelector('.update-btn');
  const backBtn = document.querySelector('.back-btn');
  const addBtn = document.querySelector('.add-btn');
  
  return {
    getInput: function() {
      return {
        meal: mealInput.value,
        calories: calorieInput.value
      }
    },

    clearInputFields: function() {
      mealInput.value = '';
      calorieInput.value = '';
    },

    addItemToUI: function(item) {
        // capitalize name of the meal
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        // Create li
        const element = `
          <li data-ID="${item.id}"><span>${capitalizeFirstLetter(item.meal)}: ${item.calories} Calories</span><a href="#" class="edit-item"><i class="fas fa-edit"></i></a></li>
        `
        // Add to UI list
        mealsList.innerHTML += element;

    },

    displayTotalCalories: function(total) {
      totalCalories.textContent = total;
    },

    displayItemForEdit: function(item) {
      mealInput.value = item.meal;
      calorieInput.value = item.calories;
    },

    updateItemInUI: function(item) {

      // capitalize name of the meal
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      //get all current items in the list
      const listItems = document.querySelectorAll("li[data-ID]");

      // search for item that was updated
      const itemToUpdate = Array.from(listItems).find(el => el.dataset.id === item.id)

      // create new updated item
      const newItem = document.createElement('li');
      newItem.setAttribute('data-ID', item.id);
      const innerContentOfItem = `
      <span>${capitalizeFirstLetter(item.meal)}: ${item.calories} Calories</span><a href="#" class="edit-item"><i class="fas fa-edit"></i></a>
      `
      newItem.innerHTML = innerContentOfItem;
      

      // replace outdated item with a new one
      mealsList.replaceChild(newItem, itemToUpdate);

    },

    deleteItemInUI: function(item) {
      //get all current items in the list
      const listItems = document.querySelectorAll("li[data-ID]");

      // search for item that was set to delete
      const itemToDelete = Array.from(listItems).find(el => el.dataset.id === item.id)

      //remove element
      mealsList.removeChild(itemToDelete);
    },

    clearUI: function() {
      mealsList.innerHTML = ''
    },

    toggleEditState: function() {
      [deleteBtn, updateBtn, backBtn].forEach(btn => btn.classList.toggle('edit-state'));
      addBtn.classList.toggle('edit-state-add');
    }
  }
})();


const AppCtrl = (function(DataCtrl, UICtrl, StorageCtrl) {
  
  function addItem() {

    // Get input from UI
    const data = UICtrl.getInput()

    if(data.meal !== "" && data.calories !== "" && !isNaN(parseInt(data.calories))) {

        // Add item do data structure
        const item = DataCtrl.addItemToDataStructure(data);

        // Add item to LS
        StorageCtrl.addItemToLS(item);

        // Refresh item UI list
        const state = DataCtrl.getState();

        UICtrl.addItemToUI(item);

        // Display total calories
        UICtrl.displayTotalCalories(state.totalCalories);

        // Clear input fields
        UICtrl.clearInputFields();
      }
  }

  function editItem(e) {
    // If clicked on edit button
    if(e.target.className === 'fas fa-edit') {

      // Grab ID of the item
      const id = e.target.parentElement.parentElement.dataset.id;

      // Get item from data structure
      const state = DataCtrl.getState()
      const item = state.items[id];

      // Set item as edited in storage
      DataCtrl.setItemForEdit(item)

      // Display item into UI input fields for edit
      UICtrl.displayItemForEdit(item);

      // toggle edit buttons
      UICtrl.toggleEditState();
    
    }
  }

  function updateItem() {
    // Get currently edited item
    const state = DataCtrl.getState();

    // subtract value of edited item
    DataCtrl.subtractFromTotalCalories(state.editedItem)

    // Get currently edited item
    let editedItem = state.editedItem;

    // Update item in edit
    let { meal, calories } = UICtrl.getInput()
    editedItem = { ...editedItem, meal, calories }
    
    // Update item in data storage
    const item = DataCtrl.addItemToDataStructure(editedItem)

    // Update item in LS
    StorageCtrl.updateItemInLS(item);

    // Refresh item UI list
    UICtrl.updateItemInUI(item);

    // Display total calories
    UICtrl.displayTotalCalories(state.totalCalories);

    // Clear input fields
    UICtrl.clearInputFields();

    // toggle edit buttons
    UICtrl.toggleEditState();
  }

  function deleteItem() {
        // Get currently edited item
        const state = DataCtrl.getState();

        // subtract value of edited item
        DataCtrl.subtractFromTotalCalories(state.editedItem)
    
        // Get currently edited item
        let editedItem = state.editedItem;

        // Delete item from the storage
        DataCtrl.deleteItem(editedItem)

        // delete item from  LS
        StorageCtrl.removeItemFromLS(editedItem);

        // Remove item from UI list
        UICtrl.deleteItemInUI(editedItem);

        // Display total calories
        UICtrl.displayTotalCalories(state.totalCalories);

        // Clear input fields
        UICtrl.clearInputFields();

        // toggle edit buttons
        UICtrl.toggleEditState();
  }

  function clearAll() {
    // Clear state
    DataCtrl.clearState();

    // Clear data from LS
    StorageCtrl.clearItemsFromLS();

    //Clear uI
    UICtrl.clearUI();

    // Get currently edited item
    const state = DataCtrl.getState();

    // Display total calories
    UICtrl.displayTotalCalories(state.totalCalories);

    // Clear input fields
    UICtrl.clearInputFields();
  }

  function backFromEditState() {
    // Clear edit item in storage
    DataCtrl.clearEditItem()

    // Clear input fields
    UICtrl.clearInputFields();

    // toggle edit buttons
    UICtrl.toggleEditState();
  }

  function displayElementsFromLS() {
    // get data form LS
    const items = StorageCtrl.getDataFromLS();

    // if there are items in LS, display each in UI
    if(items.length > 0) {
      items.forEach(item => {

        // if there are items in LS, display each in UI
        UICtrl.addItemToUI(item)

        // Add item do data structure
        DataCtrl.addItemToDataStructure(item);

      }
        
        );
    }

    // Display total calories
    const state = DataCtrl.getState();
    UICtrl.displayTotalCalories(state.totalCalories);

  }

  function loadEventListeners() {
    document.querySelector('.add-btn').addEventListener('click', addItem);
    document.querySelector('.items-box__meals').addEventListener('click', editItem)
    document.querySelector('.update-btn').addEventListener('click', updateItem)
    document.querySelector('.delete-btn').addEventListener('click', deleteItem)
    document.querySelector('.clear-btn').addEventListener('click', clearAll)
    document.querySelector('.back-btn').addEventListener('click', backFromEditState)
    document.addEventListener('DOMContentLoaded', displayElementsFromLS)
  }
  return {
    init: function() {
      loadEventListeners();
    }
  }
})(DataCtrl, UICtrl, StorageCtrl);

AppCtrl.init();