document.addEventListener("DOMContentLoaded", function () {

    function getById(id) {
        return document.getElementById(id);
    }

    let writingIdentifier = "noDecoLink";
    let nameOfFavoritesArray = "";
    let favoritesArray = "";
    let allWritingsArray = [];

    function createFavoritesArray() {
        favoritesArray = "";
        favoritesArray = JSON.parse(
            localStorage.getItem(nameOfFavoritesArray)
        );
    };

    function createAllWritingsArray() {
        allWritingsArray = [];
        Array.from(
            document.getElementsByClassName(writingIdentifier)
        ).forEach(function (item) {
            if (allWritingsArray.includes(item.id) === false) {
                allWritingsArray.push(item.id);
            }
        });
    }

    function createArrays() {
        createFavoritesArray();
        createAllWritingsArray();
        if (favoritesArray === null) {
            localStorage.setItem(nameOfFavoritesArray, "[]");
            favoritesArray = JSON.parse(
                localStorage.getItem(nameOfFavoritesArray)
            );
        }
    };

    // GET NAME OF FAVORITES ARRAY
    function loopMetaArray(item) {
        if (item.name === "nameOfFavoritesArray") {
            nameOfFavoritesArray = item.content;
        }
    }
    Array.from(document.getElementsByTagName("META")).forEach(loopMetaArray);

    // This debugging function will clear all items from keywordArray 
    // in localStorage. 

    // function flushFavorites() {
    //     keywordArray.forEach(function (keywordArrayItem) {
    //         let itemInStorageKeyword = (keywordArrayItem + "Favorite");
    //         console.log(localStorage.getItem(keywordArrayItem + "Favorite"));
    //         localStorage.removeItem(itemInStorageKeyword);
    //     });
    // };

    // flushFavorites();

    function appendLogic(item) {
        let documentLink = getById(item);
        let documentLinkContents = documentLink.nextSibling;
        let aTag = document.createElement("A");
        aTag.id = item;
        aTag.classList.add("noDecoLink");
        aTag.href = documentLink.href;
        let contentClone = documentLinkContents.cloneNode(true);
        let col1 = getById("favoritesColumn1");
        let col1Length = col1.childElementCount;
        let col2 = getById("favoritesColumn2");
        let col2Length = col2.childElementCount;
        let col3 = getById("favoritesColumn3");
        let col3Length = col3.childElementCount;
        if ((col1Length === col2Length) && (col2Length === col3Length)) {
            getById("favoritesColumn1").appendChild(aTag);
            getById("favoritesColumn1").appendChild(contentClone);
        } else if ((col1Length > col2Length) && (col2Length === col3Length)) {
            getById("favoritesColumn2").appendChild(aTag);
            getById("favoritesColumn2").appendChild(contentClone);
        } else if ((col1Length === col2Length) && (col2Length > col3Length)) {
            getById("favoritesColumn3").appendChild(aTag);
            getById("favoritesColumn3").appendChild(contentClone);
        }
    }

    function clearColumns() {
        let figureColumnArray = Array.from(document.getElementsByClassName("figureColumns"));

        function clearAColumn(column) {
            let columnId = column.id;
            if (columnId.includes("favoritesColumn")) {
                column.innerHTML = "";
            }
        }
        figureColumnArray.forEach(clearAColumn);
    }

    function checkForFavorites(item, index) {
        if (favoritesArray.includes(item)) {
            // REMOVE PLACEHOLDER TEXT
            if (index === 0) {
                getById("placeholderText").innerHTML = "";
            }
            let documentFavoritesButton = getById(item + "FavoriteButton");
            documentFavoritesButton.classList.remove("starDivStandby");
            documentFavoritesButton.classList.add("starDivActive");
            appendLogic(item);
        }
    };
    createArrays();
    allWritingsArray.forEach(checkForFavorites);

    function checkForStarDiv(event) {
        if (event.target.classList.contains("starDiv")) {
            let thisStarDiv = event.target;
            let keyword = event.target.id.replace("FavoriteButton", "");
            if (thisStarDiv.classList.contains("starDivStandby")) {
                thisStarDiv.classList.remove("starDivStandby");
                thisStarDiv.classList.add("starDivActive");
                // Add to favorites array, then save favorites array
                // to local storage.
                favoritesArray.push(keyword);
                localStorage.setItem(
                    nameOfFavoritesArray, JSON.stringify(favoritesArray)
                );
                appendLogic(keyword.replace("FavoriteButton", ""));
            } else if (thisStarDiv.classList.contains("starDivActive")) {
                thisStarDiv.classList.remove("starDivActive");
                thisStarDiv.classList.add("starDivStandby");
                favoritesArray.splice(
                    favoritesArray.indexOf(keyword), 1
                );
                localStorage.setItem(
                    nameOfFavoritesArray, JSON.stringify(favoritesArray)
                );
                clearColumns();
                allWritingsArray.forEach(checkForFavorites);
                getById(keyword + "FavoriteButton").classList.remove("starDivActive");
                getById(keyword + "FavoriteButton").classList.add("starDivStandby");
            }
        }
    };
    document.body.addEventListener("click", checkForStarDiv);
});