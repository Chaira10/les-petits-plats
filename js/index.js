function getRecipe() {
  try {
    const data = recipes;
    return data;
  } catch (error) {
    console.error(error);
  }
}

const recipeCards = [];
async function displayRecipe() {
  const recipesData = getRecipe();
  console.log(recipesData);

  const recipeContainer = document.getElementById('recipeContainer');

  recipesData.forEach((recipe) => {
    console.log(recipe.ustensils);
    const recipeModel = recipeFactory(recipe);
    console.log(recipeModel);
    const recipeCardDom = recipeModel.getRecipeCardDom();
    console.log(recipeCardDom);
    recipeCards.push(recipeCardDom);
    recipeContainer.appendChild(recipeCardDom);
  });

  const ustensilsDropdown = document.getElementById('ustensilsDropdown');
  const appareilsDropdown = document.getElementById('appareilsDropdown');
  const ingredientsDropdown = document.getElementById('ingredientsDropdown');

  populateUstensilsDropdown(recipesData, ustensilsDropdown);
  populateAppareilsDropdown(recipesData, appareilsDropdown);
  populateIngredientsDropdown(recipesData, ingredientsDropdown);
}

displayRecipe();

const searchBar = document.getElementById('search-bar');
const ingredient = document.getElementById('ingredient');
const appareil = document.getElementById('appareil');
const ustensiles = document.getElementById('ustensiles');

function getAllUstensils(recipes) {
  const ustensilsSet = new Set();

  recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      ustensilsSet.add(ustensil);
    });
  });

  return Array.from(ustensilsSet);
}

function populateUstensilsDropdown(recipes, dropdown) {
  const ustensils = getAllUstensils(recipes);
  const selectedItemsContainer = document.getElementById('selectedItemsContainer');

  ustensils.forEach((ustensil) => {
    const li = document.createElement('li');
    li.className = 'dropdown-item';
    li.textContent = ustensil;
    
    li.addEventListener('click', () => {
      addSelectedItem(ustensil);
    });
    dropdown.appendChild(li);
  });
}

function addSelectedItem(item) {
  const badge = document.createElement('span');
  badge.className = 'tag-filter ms-3';
  badge.textContent = item;
  badge.innerHTML = `${item} <i class="fa-solid fa-xmark ms-3"></i>`;
  selectedItemsContainer.appendChild(badge);
    // Sélectionner l'icône de la croix dans le badge
    const closeIcon = badge.querySelector('.fa-xmark');

    // Ajouter un gestionnaire d'événements de clic à l'icône de la croix
    closeIcon.addEventListener('click', () => {
      removeSelectedItem(badge);
    });
}

function removeSelectedItem(badge) {
  badge.remove();
}

function getAllAppareils(recipes) {
  const appareilsSet = new Set();

  recipes.forEach((recipe) => {
    console.log(recipe.appliance);
    appareilsSet.add(recipe.appliance);
  });

  return Array.from(appareilsSet);
}

const appareilsDropdown = document.getElementById('appareilsDropdown');
function populateAppareilsDropdown(recipes, dropdown) {
  const appareils = getAllAppareils(recipes);
  const selectedItemsContainer = document.getElementById('selectedItemsContainer');

  appareils.forEach((appareil) => {
    const li = document.createElement('li');
    li.className = 'dropdown-item';
    li.textContent = appareil;
    li.addEventListener('click', () => {
      addSelectedItem(appareil);
    });
    dropdown.appendChild(li);
  });
}


function getAllIngredients(recipes) {
  const ingredientsSet = new Set();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      ingredientsSet.add(ingredient.ingredient);
    });
  });

  return Array.from(ingredientsSet);
}

function populateIngredientsDropdown(recipes, dropdown) {
  const ingredients = getAllIngredients(recipes);
  const selectedItemsContainer = document.getElementById('selectedItemsContainer');

  ingredients.forEach((ingredient) => {
    const li = document.createElement('li');
    li.className = 'dropdown-item';
    li.textContent = ingredient;
    li.addEventListener('click', () => {
      addSelectedItem(ingredient);
    });
    dropdown.appendChild(li);
  });
}
