let favorites = [];
let ratingStorage = {};

let publisherFilter = {};
let authorFilter = {};
let yearFilter = {};

let allArticul = [];
let JSONdata;

document.addEventListener("DOMContentLoaded", function() { 
  checkFavorites();
  checkRating();
  createCatalog();
  liveSearch();
  modificationOnclick();
});

function createCatalog() {
  let xhr = new XMLHttpRequest ();
  xhr.open("GET", "books.json");
  xhr.onload = function() {
    JSONdata = JSON.parse(xhr.responseText);  
    for (let key in JSONdata){
      createCart(key);
      allArticul.push(key);
    } 
    createFilter();
    favoriteOnlick();
    ratingOnClick();
  }  
  xhr.send();
}; 

function createFilter() {
  checkOption();
  let publisherSelector = document.getElementById("filter-publisher");
  let authorSelector = document.getElementById("filter-author");
  let yearSelector = document.getElementById("filter-year");
  for (let key in publisherFilter) {
    publisherSelector.innerHTML += "<option>" + key + "</option>";
  };
  for (let key in authorFilter) {
    authorSelector.innerHTML += "<option>" + key + "</option>";
  };
  for (let key in yearFilter) {
    yearSelector.innerHTML += "<option>" + key + "</option>";
  };
  
  function checkOption() {
    for (let key in JSONdata) {
      let publisherBook = JSONdata[key]["publisher"];
      if (!(publisherBook in publisherFilter)) publisherFilter[publisherBook] = [];
      publisherFilter[publisherBook].push(key);
      
      let autorBook = JSONdata[key]["author"];
      if (!(autorBook in authorFilter)) authorFilter[autorBook] = [];
      authorFilter[autorBook].push(key);

      let yearBook = JSONdata[key]["year of publishing"];
      if (!(yearBook in yearFilter)) yearFilter[yearBook] = [];
      yearFilter[yearBook].push(key);
    };
  };
};

function modificationOnclick() {
  let button = document.querySelector("#get-modification");
  button.onclick = function() {
    filterOnclick();
    sortOnclick();
  }
}

function filterOnclick() {
  let publisherValue = document.getElementById("filter-publisher").value;
  if (publisherValue === "Издательство") {
    suitablePublisherBook = allArticul;
  } else {
    suitablePublisherBook = publisherFilter[publisherValue];
  }

  let authorValue = document.getElementById("filter-author").value;
  if (authorValue === "Автор") {
    suitableAutorBook = allArticul;
  } else {
    suitableAutorBook = authorFilter[authorValue];
  }

  let yearValue = document.getElementById("filter-year").value;
  if (yearValue === "Год") {
    suitableYearBook = allArticul;
  } else {
    suitableYearBook = yearFilter[yearValue];
  }

  let intersection = suitablePublisherBook
    .filter(x => suitableYearBook.includes(x))
    .filter(x => suitableAutorBook.includes(x));

  for (let key in JSONdata) {
    let card = document.querySelector(".card[articul=\""+ key + "\"]");
    if(intersection.indexOf(key) === -1) {
      card.classList.add("hide-in-filter");
    } else {
      card.classList.remove("hide-in-filter");
    }
  }
}

function sortOnclick() {
  let sortedCatalog = [];
  for (let key in JSONdata) {
    sortedCatalog.push({"key" : key,
                        "name" : JSONdata[key]["name"],
                        "rating" : ratingStorage[key],
                        "year" : JSONdata[key]["year of publishing"]});
  }

  let methodValue = document.getElementById("sort-method").value;
  let directionValue = document.getElementById("sort-direction").value;
  if (methodValue !== "По умолчанию" && directionValue !== "По умолчанию"){
    switch (methodValue) {
      case "По алфавиту":
        if (directionValue === "По возрастанию"){
          sortedCatalog.sort((a, b) => a.name > b.name ? 1 : -1);           
        } else {
          sortedCatalog.sort((a, b) => a.name < b.name ? 1 : -1);
        }
        setOrderCatalog(sortedCatalog);
        break;
      case "По рейтингу":
        if (directionValue === "По возрастанию"){
          sortedCatalog.sort((a, b) => a.rating < b.rating ? 1 : -1);           
        } else {
          sortedCatalog.sort((a, b) => a.rating > b.rating ? 1 : -1);
        }
        setOrderCatalog(sortedCatalog);
        break;
      case "По дате издания":
        if (directionValue === "По возрастанию"){
          sortedCatalog.sort((a, b) => a.rating < b.rating ? 1 : -1);           
        } else {
          sortedCatalog.sort((a, b) => a.rating > b.rating ? 1 : -1);
        }
        setOrderCatalog(sortedCatalog);
        break;
    }
  } else {
    for(let item of sortedCatalog) {
      let card = document.querySelector(".card[articul=\""+ item["key"] + "\"]");
      card.style.order = 0;
    }
  }
};

function setOrderCatalog(sortedCatalog) {
  let count = sortedCatalog.length;
  for(let item of sortedCatalog) {
    let card = document.querySelector(".card[articul=\""+ item["key"] + "\"]");
    card.style.order = count;
    count--;
  }
}

function checkFavorites() {
  if (localStorage.getItem("favorites") != null) {
    favorites = JSON.parse(localStorage.getItem("favorites"))
  }
};

function checkRating() {
  if (localStorage.getItem("rating") != null) {
    ratingStorage = JSON.parse(localStorage.getItem("rating"))
  }
}

function ratingOnClick() {
  let plusButton = document.getElementsByClassName("rating__plus");
  [].forEach.call( plusButton, function(item) {
    item.onclick = function() {
      let articul = item.getAttribute("articul");
      if (ratingStorage[articul] < 10) ratingStorage[articul]++;
      localStorage.setItem("rating", JSON.stringify(ratingStorage));
      document.querySelector(".rating__score[articul=\""+ articul + "\"]").textContent = ratingStorage[articul];
    };
  });

  let minusButton = document.getElementsByClassName("rating__minus");
  [].forEach.call( minusButton, function(item) {
    item.onclick = function() {
      let articul = item.getAttribute("articul");
      if (ratingStorage[articul] > 1) ratingStorage[articul]--;
      localStorage.setItem("rating", JSON.stringify(ratingStorage));
      document.querySelector(".rating__score[articul=\""+ articul + "\"]").textContent = ratingStorage[articul];
    };
  });
}

function favoriteOnlick() {
  let favoritesButton = document.getElementsByClassName("card__favorites-button");
  [].forEach.call( favoritesButton, function(item) {
    item.onclick = function() {
      setFavorites(item.getAttribute("articul"));
    };
  });

  function setFavorites(articul) {
    let index = favorites.indexOf(articul);
    if (index !== -1) {
      favorites.splice(index, 1);
      document.querySelector( ".card__favorites-button[articul=\""+ articul + "\"]" ).style.color = 'black';
    } else {
      favorites.unshift(articul);
      document.querySelector( ".card__favorites-button[articul=\""+ articul + "\"]"  ).style.color = 'var(--main-bg-color)';
    };
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };
}

function createCart(key) {
  let card = document.createElement("article");
  card.setAttribute("articul", key);
  card.className = "card";

  let photoWrapper = document.createElement("div");
  photoWrapper.className = "image-book-wrapper";
  photoWrapper.setAttribute("articul", key);

  let photo = document.createElement("img");
  photo.className = "card__image-book";
  photo.src = JSONdata[key]["image"];
  photo.alt = "Книга \"" + JSONdata[key]["name"] + "\"";
  photoWrapper.append(photo);
  card.append(photoWrapper);

  let nameInform = document.createElement("div");
  nameInform.className = "name-information";
  nameInform.innerHTML += "<h2 class=\"card__book-name\">" + JSONdata[key]["name"] + "</h2>"
  nameInform.innerHTML += "<p class=\"card__book-author\">" +  JSONdata[key]["author"] + "</p>"
  card.append(nameInform);

  let additInform = document.createElement("div");
  additInform.className = "additional-information";
  
  if(ratingStorage[key] === undefined) {ratingStorage[key] = 5;}
  
  let rating = document.createElement("article");
  rating.className = "rating";
  rating.innerHTML += "<button class=\"rating__minus rating__button\" articul=\"" + key + "\">-</button>" 
  rating.innerHTML += "<p class=\"rating__score rating__button\" articul=\"" + key + "\">" +  ratingStorage[key] + "</p>"
  rating.innerHTML += "<button class=\"rating__plus rating__button\" articul=\"" + key + "\">+</button>"
  additInform.append(rating);

  let checkFavorites = document.createElement("button");
  checkFavorites.className = "card__favorites-button";
  checkFavorites.setAttribute("articul", key);
  if (favorites.indexOf(key) !== -1) {
    checkFavorites.style.color = 'var(--main-bg-color)';
  }
  checkFavorites.textContent = "ИЗБРАННОЕ";
  additInform.append(checkFavorites);
  card.append(additInform);

  document.getElementById("content").append(card);
}

function liveSearch() {
  document.querySelector("#search").oninput = function() {
    let val = this.value.trim();
    if (val !== "") {
      for (let key in JSONdata) {
        let card = document.querySelector(".card[articul=\""+ key + "\"]");
        if(JSONdata[key]["name"].search(val) === -1) {
          card.classList.add("hide-in-search");
        } else {
          card.classList.remove("hide-in-search");
        }
      }
    } else {
      for (let key in JSONdata) {
        let card = document.querySelector(".card[articul=\""+ key + "\"]");
        card.classList.remove("hide-in-search");
      }
    }
  }
}


