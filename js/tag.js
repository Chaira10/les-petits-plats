// Élément HTML qui contient les éléments sélectionnés (tags)
const selectedItemsContainer = document.getElementById('selectedItemsContainer');

// Filtre les recettes en fonction des tags sélectionnés
function filterRecipes(recipesData) {
  // Récupère les tags sélectionnés et les convertit en minuscules
  const selectedTags = Array.from(selectedItemsContainer.querySelectorAll('.tag-filter')).map(badge => badge.getAttribute('textContent'));

  // Filtre les recettes en fonction des tags sélectionnés
  const filteredRecipes = recipes.filter(recipe => {
    const recipeTags = [
      recipe.appliance.toLowerCase(),
      ...recipe.ustensils.map(ustensil => ustensil.toLowerCase()),
      ...recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase())
    ];
    return selectedTags.every(tag => recipeTags.includes(tag.toLowerCase()));
  });
  

  return filteredRecipes; // Retourne les recettes filtrées
}

// Tableau qui contiendra les cartes de recettes
const recipeCards = [];

// Affiche les recettes filtrées
async function displayRecipe() {
  const recipesData = getRecipe(); // Récupère les données des recettes
  const filteredRecipes = filterRecipes(recipesData); // Filtre les recettes en fonction des tags sélectionnés
  console.log(recipesData);

  const recipeContainer = document.getElementById('recipeContainer'); // Élément HTML qui contiendra les cartes de recettes
  recipeContainer.innerHTML = ''; // Efface le contenu précédent du conteneur de recettes

  filteredRecipes.forEach((recipe) => {
    const recipeModel = recipeFactory(recipe);
    const recipeCardDom = recipeModel.getRecipeCardDom(); // Récupère la représentation DOM de la carte de recette
    recipeContainer.appendChild(recipeCardDom); // Ajoute la carte de recette au conteneur de recettes
  });

  const ustensilsDropdown = document.getElementById('ustensilsDropdown'); // Élément HTML du menu déroulant des ustensiles
  const appareilsDropdown = document.getElementById('appareilsDropdown'); // Élément HTML du menu déroulant des appareils
  const ingredientsDropdown = document.getElementById('ingredientsDropdown'); // Élément HTML du menu déroulant des ingrédients

  // Remplit le menu déroulant des ustensiles avec les données des recettes
  populateUstensilsDropdown(recipesData, ustensilsDropdown);
  // Remplit le menu déroulant des appareils avec les données des recettes
  populateAppareilsDropdown(recipesData, appareilsDropdown);
  // Remplit le menu déroulant des ingrédients avec les données des recettes
  populateIngredientsDropdown(recipesData, ingredientsDropdown);
}

displayRecipe(); // Affiche les recettes au chargement de la page

const searchBar = document.getElementById('search-bar');
const ingredient = document.getElementById('ingredient');
const appareil = document.getElementById('appareil');
const ustensiles = document.getElementById('ustensiles');

// Récupère tous les ustensiles uniques des recettes
function getAllUstensils(recipes) {
  const ustensilsSet = new Set();

  recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      ustensilsSet.add(ustensil);
    });
  });

  return Array.from(ustensilsSet);
}

// Remplit le menu déroulant des ustensiles avec les ustensiles des recettes
function populateUstensilsDropdown(recipesData, dropdown) {
  const ustensils = getAllUstensils(recipesData); // Récupère tous les ustensiles uniques des recettes
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

// Ajoute un élément sélectionné (tag)
function addSelectedItem(item) {
  const badge = document.createElement('span');
  badge.className = 'tag-filter ms-3';
  badge.textContent = item;
  badge.innerHTML = `${item} <i class="fa-solid fa-xmark ms-3"></i>`;
  selectedItemsContainer.appendChild(badge); // Ajoute le badge d'élément sélectionné à l'élément HTML qui contient les éléments sélectionnés
    // Sélectionne l'icône de la croix dans le badge
    const closeIcon = badge.querySelector('.fa-xmark');

    // Ajoute un gestionnaire d'événements de clic à l'icône de la croix
    closeIcon.addEventListener('click', () => {
      removeSelectedItem(badge);
    });
    displayRecipe(); // Affiche les recettes mises à jour après l'ajout d'un élément sélectionné
}

// Supprime un élément sélectionné (tag)
function removeSelectedItem(badge) {
  badge.remove(); // Supprime le badge d'élément sélectionné
  displayRecipe(); // Affiche les recettes mises à jour après la suppression d'un élément sélectionné
}

// Récupère tous les appareils uniques des recettes
function getAllAppareils(recipes) {
  const appareilsSet = new Set();

  recipes.forEach((recipe) => {
    console.log(recipe.appliance);
    appareilsSet.add(recipe.appliance);
  });

  return Array.from(appareilsSet);
}

const appareilsDropdown = document.getElementById('appareilsDropdown'); // Élément HTML du menu déroulant des appareils
// Remplit le menu déroulant des appareils avec les appareils des recettes
function populateAppareilsDropdown(recipesData, dropdown) {
  const appareils = getAllAppareils(recipesData); // Récupère tous les appareils uniques des recettes
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


// Récupère tous les ingrédients uniques des recettes
function getAllIngredients(recipes) {
  const ingredientsSet = new Set();

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      ingredientsSet.add(ingredient.ingredient);
    });
  });

  return Array.from(ingredientsSet);
}

// Remplit le menu déroulant des ingrédients avec les ingrédients des recettes
function populateIngredientsDropdown(recipesData, dropdown) {
  const ingredients = getAllIngredients(recipesData); // Récupère tous les ingrédients uniques des recettes
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