const UICtrl = (function() {
  // UI elements
  const mealsList = document.querySelector(".items-box__meals");
  const totalCalories = document.querySelector("#total");
  const mealInput = document.querySelector(".hero-box__input--meal");
  const calorieInput = document.querySelector(".hero-box__input--calories");
  const deleteBtn = document.querySelector(".delete-btn");
  const updateBtn = document.querySelector(".update-btn");
  const backBtn = document.querySelector(".back-btn");
  const addBtn = document.querySelector(".add-btn");

  return {
    getInput: function() {
      return {
        meal: mealInput.value,
        calories: calorieInput.value
      };
    },

    clearInputFields: function() {
      mealInput.value = "";
      calorieInput.value = "";
    },

    addItemToUI: function(item) {
      // capitalize name of the meal
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      // Create li
      const element = `
          <li data-ID="${item.id}"><span>${capitalizeFirstLetter(item.meal)}: ${
        item.calories
      } Calories</span><a href="#" class="edit-item"><i class="fas fa-edit"></i></a></li>
        `;
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
      const itemToUpdate = Array.from(listItems).find(
        el => el.dataset.id === item.id
      );

      // create new updated item
      const newItem = document.createElement("li");
      newItem.setAttribute("data-ID", item.id);
      const innerContentOfItem = `
      <span>${capitalizeFirstLetter(item.meal)}: ${
        item.calories
      } Calories</span><a href="#" class="edit-item"><i class="fas fa-edit"></i></a>
      `;
      newItem.innerHTML = innerContentOfItem;

      // replace outdated item with a new one
      mealsList.replaceChild(newItem, itemToUpdate);
    },

    deleteItemInUI: function(item) {
      //get all current items in the list
      const listItems = document.querySelectorAll("li[data-ID]");

      // search for item that was set to delete
      const itemToDelete = Array.from(listItems).find(
        el => el.dataset.id === item.id
      );

      //remove element
      mealsList.removeChild(itemToDelete);
    },

    clearUI: function() {
      mealsList.innerHTML = "";
    },

    toggleEditState: function() {
      [deleteBtn, updateBtn, backBtn].forEach(btn =>
        btn.classList.toggle("edit-state")
      );
      addBtn.classList.toggle("edit-state-add");
    }
  };
})();
