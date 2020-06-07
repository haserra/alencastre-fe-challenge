// JavaScript source code
"use strict";

function getProducts(url) {
  return fetch(url).then(handleResponse).catch(handleError);
}

function handleResponse(response) {
  if (response.ok) return response.json();
  if (response.status === 400) {
    const error = response.text();
    throw new Error(error);
  }
  throw new Error("Network response was not ok.");
}

function handleError(error) {
  console.error("API call failed. " + error);
  throw error;
}

function createNode(element) {
  return document.createElement(element);
}

function append(parent, el) {
  return parent.appendChild(el);
}

//renders the list of products details based on the filteredResults array
function render(arr) {
  document.getElementById("num-results").innerText = "";
  let resultsList = document.getElementById("results-list");

  if (!resultsList) {
    resultsList = createNode("ul");
    resultsList.setAttribute("id", "results-list");
  } else {
    while (resultsList.lastElementChild) {
      resultsList.removeChild(resultsList.lastElementChild);
    }
  }

  if (arr.length > 0) {
    document.getElementById("num-results").innerText = `
             ${arr.length} Resultado${arr.length > 1 ? "s" : ""}
             `;
  }

  arr.map((elem) => {
    const listItem = createNode("li"),
      wrapperImage = createNode("div"),
      wrapperDescription = createNode("div");

    wrapperImage.innerHTML = `<img src="${elem.image}" alt="${elem.title}" width="50" height="50"> `;
    wrapperDescription.innerHTML = `<a href="#home">${elem.title}</a>
                                    <div>${elem.path}</div>`; // insert data fetched previously
    append(listItem, wrapperImage); // insert the li elements into the unordered list
    append(listItem, wrapperDescription);
    append(resultsList, listItem);
  });
  const rootElement = document.getElementById("results");
  append(rootElement, resultsList);
}

// all set to search
(function setSearch() {
  const productsUrl = "products.json";
  let products = [];
  const searchBox = document.getElementById("search-box");
  const outputTemp = document.getElementById("results");

  getProducts(productsUrl).then((product) => {
    products = product.items;
  });

  document.getElementById("search-box").addEventListener("keyup", searchItems);
  function searchItems(event) {
    let searchTerm = searchBox.value;
    document.getElementById("num-results").innerText = "";

    // filtering results based on the input value
    function includeSearchTerms(item) {
      const result = searchTerm.split(" ");
      let include = true;

      result.forEach((elem) => {
        if (item.title.toLowerCase().includes(elem.toLowerCase())) {
          include &= true;
        } else {
          include &= false;
        }
      });
      return include;
    }

    if (searchTerm.length >= 3) {
      let filteredResults = products.filter(includeSearchTerms);

      // implements auto-complete
      if (
        filteredResults.length >= 1 &&
        (searchBox.value.length == 3 ||
          filteredResults[0].title.includes(searchBox.value)) &&
        event.keyCode != 8 &&
        event.keyCode != 37 &&
        event.keyCode != 38 &&
        event.keyCode != 39 &&
        event.keyCode != 40 &&
        event.keyCode != 46
      ) {
        searchBox.value = filteredResults[0].title;
        searchTerm = searchBox.value;
        filteredResults = products.filter((item) =>
          item.title.includes(searchTerm)
        );
      }

      render(filteredResults);
    } else {
      // no results
      outputTemp.innerText = "";
    }
  }
})();
