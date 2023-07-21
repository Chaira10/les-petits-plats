// Récupère les données des recettes
function getRecipe() {
  try {
    const data = recipes; // Récupère les données des recettes (assumant que la variable 'recipes' est définie ailleurs)
    return data; // Retourne les données des recettes
    console.log(data);
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
  console.log(recipesData);

  const recipeContainer = document.getElementById('recipeContainer');
  recipeContainer.innerHTML = '';

  for (const recipe of recipesData) {
    const recipeModel = recipeFactory(recipe);
    const recipeCardDom = recipeModel.getRecipeCardDom();
    recipeContainer.appendChild(recipeCardDom);
  }
      // Appeler la fonction pour obtenir le nombre de recettes affichées au chargement de la page
      const displayedRecipesCount = countDisplayedRecipes();
      const textBanner = document.querySelector('.text-filter');
      const bannerText = ` ${displayedRecipesCount} recettes`;
      textBanner.innerHTML = bannerText;
    
      console.log('Nombre de recettes affichées au chargement de la page :', displayedRecipesCount);
}


function normalizeString(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filterByRecipeName(recipesData, searchText) {
  const filteredRecipes = [];
  for (const recipe of recipesData) {
    const recipeName = normalizeString(recipe.name.toLowerCase());
    if (recipeName.includes(searchText)) {
      filteredRecipes.push(recipe);
    }
  }
  return filteredRecipes;
}



function filterByIngredients(recipesData, searchText) {
  const filteredRecipes = [];
  for (const recipe of recipesData) {
    for (const ingredient of recipe.ingredients) {
      const ingredientName = normalizeString(ingredient.ingredient.toLowerCase());
      if (ingredientName.includes(searchText)) {
        filteredRecipes.push(recipe);
        break;
      }
    }
  }
  
  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);

  return filteredRecipes;
}



function filterByDescription(recipesData, searchText) {
  const filteredRecipes = [];
  for (const recipe of recipesData) {
    const description = normalizeString(recipe.description.toLowerCase());
    if (description.includes(searchText)) {
      filteredRecipes.push(recipe);
    }
  }

  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);

  return filteredRecipes;
}


function filterByAppliance(recipesData, searchText) {
  const filteredRecipes = [];
  for (const recipe of recipesData) {
    const appliance = normalizeString(recipe.appliance.toLowerCase());
    if (appliance.includes(searchText)) {
      filteredRecipes.push(recipe);
    }
  }

  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);

  return filteredRecipes;
}



function filterByUstensils(recipesData, searchText) {
  const filteredRecipes = [];
  for (const recipe of recipesData) {
    for (const ustensil of recipe.ustensils) {
      const ustensilName = normalizeString(ustensil.toLowerCase());
      if (ustensilName.includes(searchText)) {
        filteredRecipes.push(recipe);
        break;
      }
    }
  }

  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);

  return filteredRecipes;
}



function filterBySelectedItems(recipesData, selectedItems) {
  const filteredRecipes = [];
  for (const recipe of recipesData) {
    const normalizedItems = selectedItems.map((item) => normalizeString(item.toLowerCase()));
    const { name, ingredients, description, appliance, ustensils } = recipe;
    const normalizedName = normalizeString(name.toLowerCase());
    const normalizedDescription = normalizeString(description.toLowerCase());
    const normalizedAppliance = normalizeString(appliance.toLowerCase());

    if (
      normalizedItems.some(
        (item) =>
          normalizedName.includes(item) ||
          ingredients.some((ingredient) => normalizeString(ingredient.ingredient.toLowerCase()).includes(item)) ||
          normalizedDescription.includes(item) ||
          normalizedAppliance.includes(item) ||
          ustensils.some((ustensil) => normalizeString(ustensil.toLowerCase()).includes(item))
      )
    ) {
      filteredRecipes.push(recipe);
    }
  }

  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);

  return filteredRecipes;
}


function filterRecipes() {
  const searchText = normalizeString(searchInput.value.toLowerCase());
  const selectedBadges = selectedItemsContainer.querySelectorAll('.tag');
  const selectedItems = Array.from(selectedBadges).map((badge) => badge.textContent);

  const recipesData = getRecipe();
  let filteredRecipes = recipesData;

  if (searchText.length >= 3) {
    filteredRecipes = filterByRecipeName(filteredRecipes, searchText);
  }

  if (selectedItemsContainer.children.length > 0) {
    const normalizedSelectedItems = selectedItems.map((item) => normalizeString(item.toLowerCase()));
    filteredRecipes = filterBySelectedItems(filteredRecipes, normalizedSelectedItems);
  }

  displayFilteredRecipes(filteredRecipes);
  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);
      // Appeler la fonction pour obtenir le nombre de recettes affichées au chargement de la page
      const displayedRecipesCount = countDisplayedRecipes();
      const textBanner = document.querySelector('.text-filter');
      const bannerText = ` ${displayedRecipesCount} recettes`;
      textBanner.innerHTML = bannerText;
    
      console.log('Nombre de recettes affichées au chargement de la page :', displayedRecipesCount);
}


displayRecipe(); // Affiche les recettes au chargement de la page


const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('input', filterRecipes);



function displayFilteredRecipes(filteredRecipes) {
  const recipeContainer = document.getElementById('recipeContainer');
  recipeContainer.innerHTML = '';

  for (const recipe of filteredRecipes) {
    const recipeModel = recipeFactory(recipe);
    const recipeCardDom = recipeModel.getRecipeCardDom();
    recipeContainer.appendChild(recipeCardDom);
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
  console.log("Ingredients Set:", ingredientsSet);

  const ingredientsList = ingredientsDropdown.querySelectorAll('li');
  for (const item of ingredientsList) {
    const ingredient = item.textContent.toLowerCase();
    console.log("Current Ingredient:", ingredient);
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
  appareilsDropdown.innerHTML = `
    ${appliancesOptions.map(e => `<li class="dropdown-item">${e}</li>`).join('')}`;
}

generateApplianceOptions();

function updateApplianceDropdown(filteredRecipes) {
  const searchText = searchInput.value.toLowerCase();
  const applianceSet = new Set();

  for (const recipe of filteredRecipes) {
    const recipeName = normalizeString(recipe.name.toLowerCase());
    if (recipeName.includes(searchText)) {
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
    if (recipeName.includes(searchText)) {
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
  for (const item of dropdowns) {
    if (item.classList.contains('selected')) {
      item.style.display = "none";
    }
  }
}



const selectedItemsContainer = document.getElementById('selectedItemsContainer');


function createBadge(item) {
  const trimmedItem = item.trim();
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
    if (!event.target.classList.contains('selected')) {
      console.log(selectedItem);
      createBadge(selectedItem);
      // Supprimer l'écouteur d'événements de clic pour cet élément
      event.target.removeEventListener('click', handleSelection);
      // Supprimer l'élément de la liste déroulante
      const li = event.target;
      li.classList.add('selected'); // Ajouter la classe "selected" à l'élément
      li.style.display = "none"; // Cacher l'élément en définissant sa propriété display à "none"
    }
    
    filterRecipes();
    }

    // Ajouter des écouteurs d'événements aux éléments de tous les dropdowns
const dropdowns = document.querySelectorAll('.dropdown-item');
dropdowns.forEach((item) => {
item.addEventListener('click', handleSelection);
});


function searchList(inputId, listId) {
  let input = document.getElementById(inputId);
  let filter = input.value.toUpperCase();
  let ul = document.getElementById(listId);
  let li = Array.from(ul.getElementsByTagName("li")); // Convertir en tableau

  for (const item of li) {
    let txtValue = item.textContent || item.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  }
}



// Gestion de la recherche pour chaque liste
document.getElementById("ingredient").addEventListener("input", function() {
  searchList("ingredient", "ingredientsDropdown");
  });
