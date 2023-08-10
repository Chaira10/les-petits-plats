// Récupère les données des recettes
function getRecipe() {
  try {
    const data = recipes; // Récupère les données des recettes 
    return data; // Retourne les données des recettes
    // console.log(data);
  } catch (error) {
    console.error(error);
  }
}

function countDisplayedRecipes() {
  const recipeContainer = document.getElementById('recipeContainer');
  const displayedRecipesCount = recipeContainer.childElementCount;
  return displayedRecipesCount;
}

// Affiche les recettes filtrées
function displayRecipe() {
  const recipesData = getRecipe();
  // console.log(recipesData);

  const recipeContainer = document.getElementById('recipeContainer');
  recipeContainer.innerHTML = '';

  // for (const recipe of recipesData) {
  //   const recipeModel = recipeFactory(recipe);
  //   const recipeCardDom = recipeModel.getRecipeCardDom();
  //   recipeContainer.appendChild(recipeCardDom);
  // }
  for (let i = 0; i < recipesData.length; i++) {
    let recipe = recipesData[i];
    const recipeModel = recipeFactory(recipe);
    const recipeCardDom = recipeModel.getRecipeCardDom();
    recipeContainer.appendChild(recipeCardDom);
  }
      // Appeler la fonction pour obtenir le nombre de recettes affichées au chargement de la page
      const displayedRecipesCount = countDisplayedRecipes();
      const textBanner = document.querySelector('.text-filter');
      const bannerText = ` ${displayedRecipesCount} recettes`;
      textBanner.innerHTML = bannerText;
    
      // console.log('Nombre de recettes affichées au chargement de la page :', displayedRecipesCount);
}


function normalizeString(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// function filterByRecipeName(recipesData, searchText) {
//   const filteredRecipes = [];
//   const normalizedSearchText = normalizeString(searchText.toLowerCase());

//   let filteredIndex = 0;
//   for (const recipe of recipesData) {
//     const normalizedRecipeName = normalizeString(recipe.name.toLowerCase());
//     if (normalizedRecipeName.indexOf(normalizedSearchText) !== -1) {
//       filteredRecipes[filteredIndex] = recipe;
//       filteredIndex++;
//     }
//   }

//   return filteredRecipes;
// }




// function filterByIngredients(recipesData, searchText) {
//   const filteredRecipes = [];
//   const normalizedSearchText = normalizeString(searchText.toLowerCase());

//   let filteredIndex = 0;
//   for (const recipe of recipesData) {
//     for (const ingredient of recipe.ingredients) {
//       const ingredientName = normalizeString(ingredient.ingredient.toLowerCase());
//       if (ingredientName.indexOf(normalizedSearchText) !== -1) {
//         filteredRecipes[filteredIndex] = recipe;
//         filteredIndex++;
//         break;
//       }
//     }
//   }

//   updateIngredientsDropdown(filteredRecipes);
//   updateApplianceDropdown(filteredRecipes);
//   updateUstensilsDropdown(filteredRecipes);
//   return filteredRecipes;
// }


// function filterByDescription(recipesData, searchText) {
//   const filteredRecipes = [];
//   const normalizedSearchText = normalizeString(searchText.toLowerCase());

//   let filteredIndex = 0;
//   for (const recipe of recipesData) {
//     const description = normalizeString(recipe.description.toLowerCase());
//     if (description.indexOf(normalizedSearchText) !== -1) {
//       filteredRecipes[filteredIndex] = recipe;
//       filteredIndex++;
//     }
//   }

//   updateIngredientsDropdown(filteredRecipes);
//   updateApplianceDropdown(filteredRecipes);
//   updateUstensilsDropdown(filteredRecipes);

//   return filteredRecipes;
// }



// function filterByAppliance(recipesData, searchText) {
//   const filteredRecipes = [];
//   const normalizedSearchText = normalizeString(searchText.toLowerCase());

//   let filteredIndex = 0;
//   for (const recipe of recipesData) {
//     const appliance = normalizeString(recipe.appliance.toLowerCase());
//     if (appliance.indexOf(normalizedSearchText) !== -1) {
//       filteredRecipes[filteredIndex] = recipe;
//       filteredIndex++;
//     }
//   }

//   updateIngredientsDropdown(filteredRecipes);
//   updateApplianceDropdown(filteredRecipes);
//   updateUstensilsDropdown(filteredRecipes);

//   return filteredRecipes;
// }



// function filterByUstensils(recipesData, searchText) {
//   const filteredRecipes = [];
//   const normalizedSearchText = normalizeString(searchText.toLowerCase());

//   let filteredIndex = 0;
//   for (const recipe of recipesData) {
//     let ustensilFound = false;
//     for (const ustensil of recipe.ustensils) {
//       const ustensilName = normalizeString(ustensil.toLowerCase());
//       if (ustensilName.indexOf(normalizedSearchText) !== -1) {
//         ustensilFound = true;
//         break;
//       }
//     }
//     if (ustensilFound) {
//       filteredRecipes[filteredIndex] = recipe;
//       filteredIndex++;
//     }
//   }

//   updateIngredientsDropdown(filteredRecipes);
//   updateApplianceDropdown(filteredRecipes);
//   updateUstensilsDropdown(filteredRecipes);

//   return filteredRecipes;
// }




function filterBySelectedItems(recipesData, selectedItems) {
  const filteredRecipes = [];
  const normalizedSelectedItems = [];
  
  for (let i = 0; i < selectedItems.length; i++) {
    normalizedSelectedItems[i] = normalizeString(selectedItems[i].toLowerCase());
  }

  for (let i = 0; i < recipesData.length; i++) {
    const recipe = recipesData[i];
    const {  ingredients,  appliance, ustensils } = recipe;
    // const normalizedName = normalizeString(name.toLowerCase());
    // const normalizedDescription = normalizeString(description.toLowerCase());
    const normalizedAppliance = normalizeString(appliance.toLowerCase());

    let found = false;
    for (let j = 0; j < normalizedSelectedItems.length; j++) {
      const item = normalizedSelectedItems[j];
      if (
        // normalizedName.indexOf(item) !== -1 ||
        ingredientsMatch(ingredients, item) ||
        // normalizedDescription.indexOf(item) !== -1 ||
        normalizedAppliance.indexOf(item) !== -1 ||
        ustensilsMatch(ustensils, item)
      ) {
        found = true;
        break;
      }
    }

    if (found) {
      filteredRecipes[filteredRecipes.length] = recipe;
    }
  }

  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);

  return filteredRecipes;
}

function ingredientsMatch(ingredients, item) {
  for (let i = 0; i < ingredients.length; i++) {
    const ingredientName = normalizeString(ingredients[i].ingredient.toLowerCase());
    if (ingredientName.indexOf(item) !== -1) {
      return true;
    }
  }
  return false;
}

function ustensilsMatch(ustensils, item) {
  for (let i = 0; i < ustensils.length; i++) {
    const ustensilName = normalizeString(ustensils[i].toLowerCase());
    if (ustensilName.indexOf(item) !== -1) {
      return true;
    }
  }
  return false;
}




function filterRecipes() {
  const searchText = normalizeString(searchInput.value.toLowerCase());
  const selectedBadges = selectedItemsContainer.querySelectorAll(".tag");
  const selectedItems = [];
  for (let i = 0; i < selectedBadges.length; i++) {
    selectedItems[i] = selectedBadges[i].textContent;
  }

  const recipesData = getRecipe();
  let filteredRecipes = [];

  if (searchText.length >= 3) {
    for (let i = 0; i < recipesData.length; i++) {
      const recipe = recipesData[i];
      const recipeName = normalizeString(recipe.name.toLowerCase());

      let ingredientMatch = false;
      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ingredientName = normalizeString(recipe.ingredients[j].ingredient.toLowerCase());
        if (ingredientName.indexOf(searchText) !== -1) {
          ingredientMatch = true;
          break;
        }
      }

      const descriptionMatch = normalizeString(recipe.description.toLowerCase()).indexOf(searchText) !== -1;
      const applianceMatch = normalizeString(recipe.appliance.toLowerCase()).indexOf(searchText) !== -1;

      let ustensilsMatch = false;
      for (let j = 0; j < recipe.ustensils.length; j++) {
        const ustensilName = normalizeString(recipe.ustensils[j].toLowerCase());
        if (ustensilName.indexOf(searchText) !== -1) {
          ustensilsMatch = true;
          break;
        }
      }

      if (recipeName.indexOf(searchText) !== -1 || ingredientMatch || descriptionMatch || applianceMatch || ustensilsMatch) {
        filteredRecipes[filteredRecipes.length] = recipe;
      }
    }
  } else {
    // Si la recherche est inférieure à 3 caractères, afficher toutes les recettes
    for (let i = 0; i < recipesData.length; i++) {
      filteredRecipes[i] = recipesData[i];
    }
  }

  if (selectedItemsContainer.children.length > 0) {
    for (let i = filteredRecipes.length - 1; i >= 0; i--) {
      const recipe = filteredRecipes[i];
      const { name, ingredients, description, appliance, ustensils } = recipe;
      const normalizedName = normalizeString(name.toLowerCase());
      const normalizedDescription = normalizeString(description.toLowerCase());
      const normalizedAppliance = normalizeString(appliance.toLowerCase());

      let found = false;
      for (let j = 0; j < selectedItems.length; j++) {
        const item = normalizeString(selectedItems[j].toLowerCase());
        if (
          normalizedName.indexOf(item) !== -1 ||
          ingredientsMatch(ingredients, item) ||
          normalizedDescription.indexOf(item) !== -1 ||
          normalizedAppliance.indexOf(item) !== -1 ||
          ustensilsMatch(ustensils, item)
        ) {
          found = true;
          break;
        }
      }

      if (!found) {
        let newFilteredRecipes = [];
        for (let j = 0; j < filteredRecipes.length; j++) {
          if (j !== i) {
            newFilteredRecipes[newFilteredRecipes.length] = filteredRecipes[j];
          }
        }
        filteredRecipes = newFilteredRecipes;
      }
    }
  }

  displayFilteredRecipes(filteredRecipes);
  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);
  // Appeler la fonction pour obtenir le nombre de recettes affichées
  const displayedRecipesCount = filteredRecipes.length;
  const textBanner = document.querySelector(".text-filter");
  const bannerText = ` ${displayedRecipesCount} recettes`;
  textBanner.innerHTML = bannerText;
}


displayRecipe(); // Affiche les recettes au chargement de la page
const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('input', filterRecipes);


const noResultsText = "Aucun résultat pour cette recherche.";
function displayFilteredRecipes(filteredRecipes) {
  const recipeContainer = document.getElementById('recipeContainer');
  recipeContainer.innerHTML = '';

  if (filteredRecipes.length === 0) {
    const noResultsDiv = document.createElement('div');
    noResultsDiv.classList.add('no-results');
    noResultsDiv.textContent = noResultsText;
    recipeContainer.appendChild(noResultsDiv);
  } else {
    for (const recipe of filteredRecipes) {
      const recipeModel = recipeFactory(recipe);
      const recipeCardDom = recipeModel.getRecipeCardDom();
      recipeContainer.appendChild(recipeCardDom);
    }
  }
}
const ingredientsDropdown = document.getElementById('ingredientList');


function generateIngredientsOptions() {
  const recipesData = getRecipe();

  const ingredientsSet = new Set();

  for (const recipe of recipesData) {
    for (const ingredient of recipe.ingredients) {
      const normalizedIngredient = normalizeString(ingredient.ingredient.toLowerCase());
      ingredientsSet.add(normalizedIngredient);
    }
  }

  const ingredientsOptions = Array.from(ingredientsSet).sort();

  const ingredientsDropdown = document.getElementById('ingredientList');
  ingredientsDropdown.innerHTML = '';
  for (const ingredient of ingredientsOptions) {
    const li = document.createElement('li');
    li.classList.add('dropdown-item');
    li.innerHTML = `${ingredient}`;
    ingredientsDropdown.appendChild(li);
  }

  const dropdowns = document.querySelectorAll('.dropdown-item');
  for (const item of dropdowns) {
    item.addEventListener('click', handleSelection);
  }
}

generateIngredientsOptions();


function updateIngredientsDropdown(filteredRecipes) {
  const ingredientsSet = new Set();
  for (const recipe of filteredRecipes) {
    for (const ingredient of recipe.ingredients) {
      const ingredientName = normalizeString(ingredient.ingredient.toLowerCase());
      ingredientsSet.add(ingredientName);
    }
  }
  // console.log("Ingredients Set:", ingredientsSet);

  const ingredientsList = ingredientsDropdown.querySelectorAll('li');
  for (const item of ingredientsList) {
    const ingredient = item.textContent.toLowerCase();
    // console.log("Current Ingredient:", ingredient);
    if (ingredientsSet.has(ingredient)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  }
  const dropdowns = document.querySelectorAll('.dropdown-item');
  for (const item of dropdowns) {
    item.addEventListener('click', handleSelection);
  }
}

const appareilsDropdown = document.getElementById('appareilList');



function generateApplianceOptions() {
  const recipesData = getRecipe();
  const appliancesSet = new Set();

  for (const recipe of recipesData) {
    appliancesSet.add(recipe.appliance.toLowerCase());
  }

  const appliancesOptions = Array.from(appliancesSet).sort();
  const appareilsDropdown = document.getElementById('appareilList');
  appareilsDropdown.innerHTML = ''; // Supprimer le contenu actuel du menu déroulant

  // Utiliser une boucle for pour construire les options du menu déroulant
  for (const appliance of appliancesOptions) {
    const li = document.createElement('li');
    li.classList.add('dropdown-item');
    li.innerHTML = `${appliance}`;
    appareilsDropdown.appendChild(li);
  }
}

generateApplianceOptions();


function updateApplianceDropdown(filteredRecipes) {
  const searchText = searchInput.value.toLowerCase();
  const applianceSet = new Set();

  for (const recipe of filteredRecipes) {
    const recipeName = normalizeString(recipe.name.toLowerCase());
    if (recipeName.indexOf(searchText) !== -1) { // Remplace .includes()
      const appliance = normalizeString(recipe.appliance.toLowerCase());
      applianceSet.add(appliance);
    }
  }

  const applianceList = appareilsDropdown.querySelectorAll('li');

  for (const item of applianceList) {
    const appliance = item.textContent.toLowerCase();
    if (applianceSet.has(appliance)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  }
  const dropdowns = document.querySelectorAll('.dropdown-item');
  for (const item of dropdowns) {
    item.addEventListener('click', handleSelection);
  }
}







const ustensilsDropdown = document.getElementById('ustensileList');

function generateUstensilsOptions() {
  const recipesData = getRecipe();

  const ustensilsSet = new Set();

  for (const recipe of recipesData) {
    for (const ustensil of recipe.ustensils) {
      ustensilsSet.add(ustensil.toLowerCase());
    }
  }

  const ustensilsOptions = Array.from(ustensilsSet).sort();

  for (const ustensil of ustensilsOptions) {
    const li = document.createElement('li');
    li.classList.add('dropdown-item');
    li.innerHTML = `${ustensil}`;
    ustensilsDropdown.appendChild(li);
  }
}

generateUstensilsOptions();

function updateUstensilsDropdown(filteredRecipes) {
  const searchText = searchInput.value.toLowerCase();

  const ustensilsSet = new Set();

  for (const recipe of filteredRecipes) {
    const recipeName = normalizeString(recipe.name.toLowerCase());
    if (recipeName.indexOf(searchText) !== -1) { 
      for (const ustensil of recipe.ustensils) {
        const normalizedUstensil = normalizeString(ustensil.toLowerCase());
        ustensilsSet.add(normalizedUstensil);
      }
    }
  }

  const ustensilsList = ustensilsDropdown.querySelectorAll('li');

  for (const item of ustensilsList) {
    const ustensil = item.textContent.toLowerCase();
    if (ustensilsSet.has(ustensil)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  }
}



function hideSelectedItems() {
  const dropdowns = document.querySelectorAll('.dropdown-item');
  for (let i = 0; i < dropdowns.length; i++) {
    const item = dropdowns[i];
    if (hasClass(item, 'selected')) {
      item.style.display = "none";
    }
  }
}

function hasClass(element, className) {
  const classes = element.className;
  let startIndex = 0;
  let endIndex = 0;
  while (endIndex < classes.length) {
    if (classes[endIndex] === ' ' || endIndex === classes.length - 1) {
      const currentClassName = classes.substring(startIndex, endIndex + 1);
      if (currentClassName.replace(/^\s+|\s+$/g, '') === className) {
        return true;
      }
      startIndex = endIndex + 1;
    }
    endIndex++;
  }
  return false;
}





const selectedItemsContainer = document.getElementById('selectedItemsContainer');


function createBadge(item) {
  const trimmedItem = item.replace(/^\s+|\s+$/g, '');
  const badge = document.createElement('span');
  badge.classList.add('badg-primary', 'me-2', 'tag');
  badge.textContent = trimmedItem;
  badge.innerHTML = `${trimmedItem}<i class="fa-solid fa-xmark ms-3"></i>`;

  // Vérifier si l'événement de clic a déjà été ajouté à l'icône de la croix
  const closeIcon = badge.querySelector('.fa-xmark');

  // Ajouter un gestionnaire d'événements de clic à l'icône de la croix
  closeIcon.addEventListener('click', () => {
    removeSelectedItem(badge);
  });

  // Ajouter la classe "selected" à l'élément de liste
  const dropdowns = document.querySelectorAll('.dropdown-item');
  for (const item of dropdowns) {
    if (item.textContent.toLowerCase() === trimmedItem.toLowerCase()) {
      item.classList.add('selected');

      // Supprimer l'écouteur d'événements de clic pour cet élément
      item.removeEventListener('click', handleSelection);

      // Masquer l'élément en définissant sa propriété display à "none"
      item.style.display = "none";
    }
  }

  selectedItemsContainer.appendChild(badge);
  filterRecipes();
  hideSelectedItems();
}


// Supprime un élément sélectionné (tag)
function removeSelectedItem(badge) {
  badge.remove(); // Supprime le badge d'élément sélectionné
  filterRecipes(); // Obtient les recettes filtrées à partir de la fonction filterRecipes()
  
  }

  function handleSelection(event) {
    const selectedItem = event.target.textContent;
  
    // Vérifier si l'élément de la liste déroulante a déjà la classe "selected"
    if (!hasClasse(event.target, 'selected')) {
      // console.log(selectedItem);
      createBadge(selectedItem);
      // Supprimer l'écouteur d'événements de clic pour cet élément
      event.target.removeEventListener('click', handleSelection);
      // Supprimer l'élément de la liste déroulante
      const li = event.target;
      li.className += ' selected'; // Ajouter la classe "selected" à l'élément
      li.style.display = "none"; // Cacher l'élément en définissant sa propriété display à "none"
    }
  
    filterRecipes();
  }
  
  function hasClasse(element, className) {
    const classes = element.className;
    let currentIndex = 0;
    let index;
    while ((index = classes.indexOf(className, currentIndex)) !== -1) {
      // Vérifier si le nom de classe trouvé est un nom de classe complet (pas un sous-ensemble d'un nom de classe)
      if (
        (index === 0 || classes[index - 1] === ' ') &&
        (index + className.length === classes.length || classes[index + className.length] === ' ')
      ) {
        return true;
      }
      currentIndex = index + 1;
    }
    return false;
  }
  

// Ajouter des écouteurs d'événements aux éléments de tous les dropdowns
const dropdowns = document.querySelectorAll('.dropdown-item');
for (let i = 0; i < dropdowns.length; i++) {
  const item = dropdowns[i];
  item.addEventListener('click', handleSelection);
}



function searchList(inputId, listId) {
  let input = document.getElementById(inputId);
  let filter = toUpperCase(input.value);
  let ul = document.getElementById(listId);
  let li = Array.from(ul.getElementsByTagName("li")); // Convertir en tableau

  for (const item of li) {
    let txtValue = item.textContent || item.innerText;
    if (indexOff(toUpperCase(txtValue), filter) > -1) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  }
}

// Fonction toUpperCase personnalisée
function toUpperCase(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode >= 97 && charCode <= 122) {
      // Si c'est une lettre minuscule (code ASCII entre 97 et 122)
      result += String.fromCharCode(charCode - 32); // Convertir en majuscule en soustrayant 32 au code ASCII
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

// Fonction indexOf personnalisée
function indexOff(str, searchValue, startIndex = 0) {
  const len = str.length;
  for (let i = startIndex; i < len; i++) {
    if (str.charAt(i) === searchValue.charAt(0)) {
      let j = 1;
      while (j < searchValue.length && str.charAt(i + j) === searchValue.charAt(j)) {
        j++;
      }
      if (j === searchValue.length) {
        return i;
      }
    }
  }
  return -1;
}




// Gestion de la recherche pour chaque liste
document.getElementById("ingredient").addEventListener("input", function() {
  searchList("ingredient", "ingredientsDropdown");
  });

  document.getElementById("appareils").addEventListener("input", function() {
    searchList("appareils", "appareilsDropdown");
    });

    document.getElementById("ustensiles").addEventListener("input", function() {
      searchList("ustensiles", "ustensilsDropdown");
      });


  // Fonction pour mesurer le temps d'exécution de la fonction filterRecipes
function testFilterRecipesPerformance() {
  // Avant l'exécution de la fonction
  const startTime = performance.now();

  // Exécution de la fonction filterRecipes
  filterRecipes();

  // Après l'exécution de la fonction
  const endTime = performance.now();
  
  // Calculer la durée d'exécution en millisecondes
  const duration = endTime - startTime;

  console.log("Durée d'exécution :", duration, "ms");
}

// // Appeler la fonction testFilterRecipesPerformance pour mesurer les performances de filterRecipes

// Fonction pour tester les performances de filterRecipes avec différentes valeurs de recherche simulées
function testFilterRecipesPerformanceWithInputValues() {
  const inputValues = ['tomate', 'tarte', 'limonade', 'soupe', 'salade'];

  inputValues.forEach((inputValue) => {
    console.log(`Recherche pour "${inputValue}":`);
    // Simuler l'entrée dans l'input avec la valeur de recherche actuelle
    simulateInput(inputValue, document.getElementById('search-bar'));

    // Mesurer les performances de filterRecipes pour la valeur de recherche actuelle
    testFilterRecipesPerformance();

    console.log('------------------------');
  });
}

// testFilterRecipesPerformance();
function simulateInput(inputValue) {
  const searchInput = document.getElementById('search-bar');
  searchInput.value = inputValue;
  const event = new Event('input', { bubbles: true });
  searchInput.dispatchEvent(event);
}

// Appeler la fonction testFilterRecipesPerformanceWithInputValues pour tester les performances avec différentes valeurs de recherche simulées
// testFilterRecipesPerformanceWithInputValues();




