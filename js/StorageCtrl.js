const StorageCtrl = (function() {
  return {
    // helper function to get data from LS
    getDataFromLS: function() {
      const itemsFromLS = localStorage.getItem("items");
      return itemsFromLS ? JSON.parse(itemsFromLS) : [];
    },

    addItemToLS: function(item) {
      // get elements from LS or create new data structure
      const items = this.getDataFromLS();

      // add item to data structure
      items.push(item);

      // add data structure do LS
      localStorage.setItem("items", JSON.stringify(items));
    },

    removeItemFromLS: function(item) {
      // get elements from LS or create new data structure
      const items = this.getDataFromLS();

      // find and delete item from data structure
      const indexToDelete = items.findIndex(el => el.id === item.id);
      items.splice(indexToDelete, 1);

      // add data structure do LS
      localStorage.setItem("items", JSON.stringify(items));
    },

    updateItemInLS: function(item) {
      // get elements from LS or create new data structure
      const items = this.getDataFromLS();

      // find item to update
      const indexToUpdate = items.findIndex(el => el.id === item.id);
      console.log(indexToUpdate);
      console.log(item[indexToUpdate]);
      items[indexToUpdate] = item;

      // add data structure do LS
      localStorage.setItem("items", JSON.stringify(items));
    },

    clearItemsFromLS: function() {
      localStorage.clear();
    }
  };
})();
