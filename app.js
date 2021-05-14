(function () {

'use strict'

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController',NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.constant('ApiBasePath',"https://davids-restaurant.herokuapp.com")
.directive('foundItems',FoundItems)

function FoundItems() {
    var ddo = {
        templateUrl: 'foundItems.html',
        scope: {
            items: '<foundItem',
            remove: '&onRemove'
        }
    }
    return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
    var ctrl1 = this;

    ctrl1.searchTerm = "";

    ctrl1.getMatchedMenuItems = function (searchTerm) {
        ctrl1.found = MenuSearchService.getMatchedMenuItems(searchTerm);
    }

    ctrl1.removeItems = function (itemIndex) {
        MenuSearchService.removeItems(itemIndex);        
    }
}

MenuSearchService.$inject = ['$http','ApiBasePath']
function MenuSearchService($http,ApiBasePath) {
    var service = this;

    var foundItems = [];

    service.getMatchedMenuItems = function getMatchedMenuItems(searchTerm) {
        foundItems = [];
        $http({
            method: 'GET',
            url: (ApiBasePath + "/menu_items.json")
        }).then(function (response) {
            if(searchTerm == "") {
                return foundItems;
            }
            searchTerm = searchTerm.toLowerCase();
            var menu = response.data;
            for (var i = 0; i < menu.menu_items.length; i++) {
                var description = menu.menu_items[i].description.toLowerCase();
                if(description.indexOf(searchTerm) != -1) {
                    foundItems.push(menu.menu_items[i]);
                }
            }
        }).catch(function (error) {
            console.log("Ups... An error occurs!! " + error);
        })
        return foundItems;
    }

    service.removeItems = function (itemIndex) {
        foundItems.splice(itemIndex,1);
    }
}
})();