const AppCtrl = (function(DataCtrl, UICtrl, StorageCtrl) {
  function addItem() {
    // Get input from UI
    const data = UICtrl.getInput();

    if (
      data.meal !== "" &&
      data.calories !== "" &&
      !isNaN(parseInt(data.calories))
    ) {
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
    if (e.target.className === "fas fa-edit") {
      // Grab ID of the item
      const id = e.target.parentElement.parentElement.dataset.id;

      // Get item from data structure
      const state = DataCtrl.getState();
      const item = state.items[id];

      // Set item as edited in storage
      DataCtrl.setItemForEdit(item);

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
    DataCtrl.subtractFromTotalCalories(state.editedItem);

    // Get currently edited item
    let editedItem = state.editedItem;

    // Update item in edit
    let { meal, calories } = UICtrl.getInput();
    editedItem = { ...editedItem, meal, calories };

    // Update item in data storage
    const item = DataCtrl.addItemToDataStructure(editedItem);

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
    DataCtrl.subtractFromTotalCalories(state.editedItem);

    // Get currently edited item
    let editedItem = state.editedItem;

    // Delete item from the storage
    DataCtrl.deleteItem(editedItem);

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
    DataCtrl.clearEditItem();

    // Clear input fields
    UICtrl.clearInputFields();

    // toggle edit buttons
    UICtrl.toggleEditState();
  }

  function displayElementsFromLS() {
    // get data form LS
    const items = StorageCtrl.getDataFromLS();

    // if there are items in LS, display each in UI
    if (items.length > 0) {
      items.forEach(item => {
        // if there are items in LS, display each in UI
        UICtrl.addItemToUI(item);

        // Add item do data structure
        DataCtrl.addItemToDataStructure(item);
      });
    }

    // Display total calories
    const state = DataCtrl.getState();
    UICtrl.displayTotalCalories(state.totalCalories);
  }

  function loadEventListeners() {
    document.querySelector(".add-btn").addEventListener("click", addItem);
    document
      .querySelector(".items-box__meals")
      .addEventListener("click", editItem);
    document.querySelector(".update-btn").addEventListener("click", updateItem);
    document.querySelector(".delete-btn").addEventListener("click", deleteItem);
    document.querySelector(".clear-btn").addEventListener("click", clearAll);
    document
      .querySelector(".back-btn")
      .addEventListener("click", backFromEditState);
    document.addEventListener("DOMContentLoaded", displayElementsFromLS);
  }
  return {
    init: function() {
      loadEventListeners();
    }
  };
})(DataCtrl, UICtrl, StorageCtrl);

AppCtrl.init();
