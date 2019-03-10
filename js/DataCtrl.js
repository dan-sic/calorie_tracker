const DataCtrl = (function() {
  class Item {
    constructor(meal, calories) {
      this.meal = meal;
      this.calories = parseInt(calories);
    }

    // Random unique ID generator method
    addID() {
      const id =
        "_" +
        Math.random()
          .toString(36)
          .substr(2, 9);
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
      if (data.id) {
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
      delete state.items[item.id];

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
      console.log(state);
    }
  };
})();
