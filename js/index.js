// Récupère les données des recettes
function getRecipe() {
  try {
    // Récupère les données des recettes 
    const data = recipes; 
    // Retourne les données des recettes
    return data; 
    // console.log(data);
  } catch (error) {
    console.error(error);
  }
}
// Fonction pour compter le nombre de recettes affichées
function countDisplayedRecipes() {
  // Obtenir le conteneur des recettes par son ID
  const recipeContainer = document.getElementById('recipeContainer');
   // Compter le nombre d'éléments enfants dans le conteneur des recettes (nombre de cartes de recette affichées)
  const displayedRecipesCount = recipeContainer.childElementCount;
  // Retourner le nombre de recettes affichées
  return displayedRecipesCount;
}

// Fonction pour afficher les recettes
function displayRecipe() {
  // Obtenir les données de recette
  const recipesData = getRecipe();
  // console.log(recipesData);
  // Obtenir le conteneur des recettes par son ID
  const recipeContainer = document.getElementById('recipeContainer');
  // Effacer le contenu précédent du conteneur des recettes
  recipeContainer.innerHTML = '';

// Parcourir les données de recette et créer les cartes de recette correspondantes
  for (let i = 0; i < recipesData.length; i++) {
    let recipe = recipesData[i];
    // Créer une instance de recette à partir des données et obtenir le DOM de la carte de recette
    const recipeModel = recipeFactory(recipe);
    const recipeCardDom = recipeModel.getRecipeCardDom();
     // Ajouter la carte de recette au conteneur des recettes
    recipeContainer.appendChild(recipeCardDom);
  }
      // Appeler la fonction pour obtenir le nombre de recettes affichées au chargement de la page
      const displayedRecipesCount = countDisplayedRecipes();
      const textBanner = document.querySelector('.text-filter');
      const bannerText = ` ${displayedRecipesCount} recettes`;
      textBanner.innerHTML = bannerText;
    
      // console.log('Nombre de recettes affichées au chargement de la page :', displayedRecipesCount);
}


// fonction prend un texte en entrée et normalise les caractères diacritiques en caractères de base (par exemple, é -> e, ç -> c).
function normalizeString(text) {
  // Utilisation de la méthode "normalize" pour décomposer les caractères accentués en caractères de base
  // Cela permet de traiter correctement les caractères accentués et leurs équivalents non accentués
  // Utilisation d'une expression régulière pour supprimer les caractères diacritiques (accents) de la chaîne
  // La plage [\u0300-\u036f] englobe les codes Unicode des caractères diacritiques
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Fonction pour filtrer les recettes en fonction des éléments sélectionnés
function filterBySelectedItems(recipesData, selectedItems) {
  // Tableau pour stocker les recettes filtrées
  const filteredRecipes = [];
  // Tableau pour stocker les éléments sélectionnés normalisés
  const normalizedSelectedItems = [];
  // Normaliser et stocker les éléments sélectionnés en minuscules
  for (let i = 0; i < selectedItems.length; i++) {
    normalizedSelectedItems[i] = normalizeString(selectedItems[i].toLowerCase());
  }
// Parcourir les données de recette pour le filtrage
  for (let i = 0; i < recipesData.length; i++) {
    const recipe = recipesData[i];
    const {  ingredients,  appliance, ustensils } = recipe;
    // Normaliser le nom de l'appareil en minuscules
    const normalizedAppliance = normalizeString(appliance.toLowerCase());
// Initialiser une variable pour vérifier si la recette correspond
    let found = false;
    // Parcourir les éléments sélectionnés normalisés
    for (let j = 0; j < normalizedSelectedItems.length; j++) {
      const item = normalizedSelectedItems[j];
      // Vérifier si la recette correspond en termes d'ingrédients, appareil ou ustensiles
      if (
        ingredientsMatch(ingredients, item) ||
        normalizedAppliance.indexOf(item) !== -1 ||
        ustensilsMatch(ustensils, item)
      ) {
        // Si une correspondance est trouvée, marquer comme trouvée et sortir de la boucle
        found = true;
        break;
      }
    }
// Si la recette correspond, l'ajouter aux recettes filtrées
    if (found) {
      filteredRecipes[filteredRecipes.length] = recipe;
    }
  }
// Mettre à jour les listes déroulantes d'ingrédients, d'appareils et d'ustensiles
  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);
// Retourner les recettes filtrées
  return filteredRecipes;
}
// Fonction pour vérifier si un élément correspond à un ingrédient d'une recette
function ingredientsMatch(ingredients, item) {
  // Parcourir les ingrédients de la recette
  for (let i = 0; i < ingredients.length; i++) {
    // Normaliser le nom de l'ingrédient en minuscules
    const ingredientName = normalizeString(ingredients[i].ingredient.toLowerCase());
    // Vérifier si l'élément correspond à l'ingrédient
    if (ingredientName.indexOf(item) !== -1) {
      // Si une correspondance est trouvée, retourner vrai
      return true;
    }
  }
  // Si aucune correspondance n'est trouvée, retourner faux
  return false;
}
// Fonction pour vérifier si un élément correspond à l'un des ustensiles d'une recette
function ustensilsMatch(ustensils, item) {
  // Parcourir les ustensiles de la recette
  for (let i = 0; i < ustensils.length; i++) {
    // Normaliser le nom de l'ustensile en minuscules
    const ustensilName = normalizeString(ustensils[i].toLowerCase());
    // Vérifier si l'élément correspond à l'ustensile
    if (ustensilName.indexOf(item) !== -1) {
      // Si une correspondance est trouvée, retourner vrai
      return true;
    }
  }
   // Si aucune correspondance n'est trouvée, retourner faux
  return false;
}



// Fonction pour filtrer et afficher les recettes en fonction des critères de recherche et des éléments sélectionnés
function filterRecipes() {
  // Récupérer le texte de recherche normalisé en minuscules
  const searchText = normalizeString(searchInput.value.toLowerCase());
  // Récupérer les éléments sélectionnés sous forme de tableau
  const selectedBadges = selectedItemsContainer.querySelectorAll(".tag");
  const selectedItems = [];
  for (let i = 0; i < selectedBadges.length; i++) {
    selectedItems[i] = selectedBadges[i].textContent;
  }
 // Récupérer toutes les données de recette
  const recipesData = getRecipe();
   // Initialiser le tableau pour les recettes filtrées
  let filteredRecipes = [];
 // Vérifier si le texte de recherche a au moins 3 caractères
  if (searchText.length >= 3) {
    // Parcourir les données de recette pour le filtrage en fonction du texte de recherche
    for (let i = 0; i < recipesData.length; i++) {
      const recipe = recipesData[i];
      const recipeName = normalizeString(recipe.name.toLowerCase());
// Initialiser la variable pour les ingrédients

      let ingredientMatch = false;
      // Parcourir les ingrédients de la recette pour vérifier les correspondances
      for (let j = 0; j < recipe.ingredients.length; j++) {
        const ingredientName = normalizeString(recipe.ingredients[j].ingredient.toLowerCase());
        if (ingredientName.indexOf(searchText) !== -1) {
          ingredientMatch = true;
          break;
        }
      }
// Vérifier les correspondances de description et d'appareil
      const descriptionMatch = normalizeString(recipe.description.toLowerCase()).indexOf(searchText) !== -1;
      const applianceMatch = normalizeString(recipe.appliance.toLowerCase()).indexOf(searchText) !== -1;
// Initialiser la variable pour les ustensiles
      let ustensilsMatch = false;
      // Parcourir les ustensiles de la recette pour vérifier les correspondances
      for (let j = 0; j < recipe.ustensils.length; j++) {
        const ustensilName = normalizeString(recipe.ustensils[j].toLowerCase());
        if (ustensilName.indexOf(searchText) !== -1) {
          ustensilsMatch = true;
          break;
        }
      }
// Si la recette correspond à un critère de recherche, l'ajouter aux recettes filtrées
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
// Vérifier s'il y a des éléments sélectionnés
  if (selectedItemsContainer.children.length > 0) {
    // Parcourir les recettes filtrées pour vérifier les correspondances avec les éléments sélectionnés
    for (let i = filteredRecipes.length - 1; i >= 0; i--) {
      const recipe = filteredRecipes[i];
      const { name, ingredients, description, appliance, ustensils } = recipe;
      // Normaliser les propriétés de la recette en minuscules
      const normalizedName = normalizeString(name.toLowerCase());
      const normalizedDescription = normalizeString(description.toLowerCase());
      const normalizedAppliance = normalizeString(appliance.toLowerCase());
// Initialiser une variable pour vérifier si la recette correspond à au moins un élément sélectionné
      let found = false;
      // Parcourir les éléments sélectionnés pour vérifier les correspondances
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
// Si la recette ne correspond à aucun élément sélectionné, la supprimer des recettes filtrées
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
 // Afficher les recettes filtrées
  displayFilteredRecipes(filteredRecipes);
  // Mettre à jour les listes déroulantes d'ingrédients, d'appareils et d'ustensiles
  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);
  // Appeler la fonction pour obtenir le nombre de recettes affichées
  const displayedRecipesCount = filteredRecipes.length;
  const textBanner = document.querySelector(".text-filter");
  const bannerText = ` ${displayedRecipesCount} recettes`;
  textBanner.innerHTML = bannerText;
}

// Affiche les recettes au chargement de la page
displayRecipe(); 

// on récupère la barre de recherche avec l'ID "search-bar"
const searchInput = document.getElementById('search-bar');
// Ajoute un écouteur d'événement "input" à l'élément de recherche
// Lorsque l'utilisateur saisit du texte dans l'élément de recherche, la fonction "filterRecipes" sera appelée
searchInput.addEventListener('input', filterRecipes);

// Texte à afficher si pas de recette trouvé
const noResultsText = "Aucun résultat pour cette recherche.";

// Fonction pour afficher les recettes filtrées dans le conteneur de recettes
function displayFilteredRecipes(filteredRecipes) {
  // Récupérer le conteneur de recettes
  const recipeContainer = document.getElementById('recipeContainer');
  // Effacer le contenu précédent du conteneur de recettes
  recipeContainer.innerHTML = '';
 // Vérifier s'il n'y a aucune recette filtrée
  if (filteredRecipes.length === 0) {
    // Créer un élément div pour afficher le message "Aucun résultat"
    const noResultsDiv = document.createElement('div');
    noResultsDiv.classList.add('no-results');
    noResultsDiv.textContent = noResultsText;
    // Ajouter l'élément au conteneur de recettes
    recipeContainer.appendChild(noResultsDiv);
  } else {
    // Parcourir les recettes filtrées et afficher chaque recette
    for (const recipe of filteredRecipes) {
      // Créer un modèle de recette à partir des données de la recette
      const recipeModel = recipeFactory(recipe);
      // Obtenir le DOM de la carte de recette à partir du modèle
      const recipeCardDom = recipeModel.getRecipeCardDom();
      // Ajouter le DOM de la carte de recette au conteneur de recettes
      recipeContainer.appendChild(recipeCardDom);
    }
  }
}
// Récupérer l'élément de liste déroulante des ingrédients
const ingredientsDropdown = document.getElementById('ingredientList');
// Fonction pour générer les options de la liste déroulante des ingrédients
function generateIngredientsOptions() {
  // Récupérer toutes les données de recette
  const recipesData = getRecipe();
// Créer un ensemble pour stocker les ingrédients uniques
  const ingredientsSet = new Set();
// Parcourir les données de recette pour extraire les ingrédients uniques
  for (const recipe of recipesData) {
    for (const ingredient of recipe.ingredients) {
      const normalizedIngredient = normalizeString(ingredient.ingredient.toLowerCase());
      ingredientsSet.add(normalizedIngredient);
    }
  }
// Convertir l'ensemble d'ingrédients en tableau et les trier
  const ingredientsOptions = Array.from(ingredientsSet).sort();

  // Effacer le contenu précédent de la liste déroulante des ingrédients
  ingredientsDropdown.innerHTML = '';
  // Parcourir les options d'ingrédients et créer des éléments li pour chaque option
  for (const ingredient of ingredientsOptions) {
    const li = document.createElement('li');
    li.classList.add('dropdown-item');
    li.innerHTML = `${ingredient}`;
       // Ajouter l'élément li à la liste déroulante des ingrédients
    ingredientsDropdown.appendChild(li);
  }
// Récupérer tous les éléments de liste déroulante
  const dropdowns = document.querySelectorAll('.dropdown-item');
  // Parcourir les éléments et ajouter un événement de clic pour la sélection
  for (const item of dropdowns) {
    item.addEventListener('click', handleSelection);
  }
}
// Appeler la fonction pour générer les options de la liste déroulante des ingrédients
generateIngredientsOptions();

// Fonction pour mettre à jour les options de la liste déroulante des ingrédients en fonction des recettes filtrées
function updateIngredientsDropdown(filteredRecipes) {
  // Créer un ensemble pour stocker les noms d'ingrédients uniques des recettes filtrées
  const ingredientsSet = new Set();
  // Parcourir les recettes filtrées
  for (const recipe of filteredRecipes) {
    // Parcourir les ingrédients de chaque recette
    for (const ingredient of recipe.ingredients) {
      // Normaliser et ajouter le nom de l'ingrédient à l'ensemble
      const ingredientName = normalizeString(ingredient.ingredient.toLowerCase());
      ingredientsSet.add(ingredientName);
    }
  }
  // console.log("Ingredients Set:", ingredientsSet);
// Récupérer la liste d'options de la liste déroulante des ingrédients
  const ingredientsList = ingredientsDropdown.querySelectorAll('li');
  // Parcourir les éléments de la liste d'options
  for (const item of ingredientsList) {
    const ingredient = item.textContent.toLowerCase();
    // console.log("Current Ingredient:", ingredient);
    // Vérifier si l'ingrédient est présent dans l'ensemble d'ingrédients uniques des recettes filtrées
    if (ingredientsSet.has(ingredient)) {
      // Si l'ingrédient est présent, afficher l'option dans la liste déroulante
      item.style.display = "";
    } else {
      // Sinon, masquer l'option dans la liste déroulante
      item.style.display = "none";
    }
  }
  // Mettre à jour les événements de clic pour les options de la liste déroulante
  const dropdowns = document.querySelectorAll('.dropdown-item');
  for (const item of dropdowns) {
    item.addEventListener('click', handleSelection);
  }
}
// Récupérer l'élément de liste déroulante des appareils
const appareilsDropdown = document.getElementById('appareilList');
// Fonction pour générer les options de la liste déroulante des appareils
function generateApplianceOptions() {
  // Récupérer toutes les données de recette
  const recipesData = getRecipe();
  // Créer un ensemble pour stocker les noms d'appareils uniques
  const appliancesSet = new Set();
 // Parcourir les données de recette pour extraire les noms d'appareils uniques
  for (const recipe of recipesData) {
    // Ajouter le nom de l'appareil à l'ensemble (en minuscules)
    appliancesSet.add(recipe.appliance.toLowerCase());
  }
// Convertir l'ensemble d'appareils en tableau et les trier
  const appliancesOptions = Array.from(appliancesSet).sort();
  // Effacer le contenu précédent de la liste déroulante des appareils
  appareilsDropdown.innerHTML = ''; 

  // Parcourir les options d'appareils et créer des éléments li pour chaque option
  for (const appliance of appliancesOptions) {
    const li = document.createElement('li');
    li.classList.add('dropdown-item');
    li.innerHTML = `${appliance}`;
    // Ajouter l'élément li à la liste déroulante des appareils
    appareilsDropdown.appendChild(li);
  }
}
// Appeler la fonction pour générer les options de la liste déroulante des appareils
generateApplianceOptions();

// Fonction pour mettre à jour les options de la liste déroulante des appareils en fonction des recettes filtrées
function updateApplianceDropdown(filteredRecipes) {
  // Récupérer le texte de recherche de l'input de recherche
  const searchText = searchInput.value.toLowerCase();
  // Créer un ensemble pour stocker les noms d'appareils uniques
  const applianceSet = new Set();
// Parcourir les recettes filtrées
  for (const recipe of filteredRecipes) {
    // Récupérer le nom de la recette normalisé
    const recipeName = normalizeString(recipe.name.toLowerCase());
    // Vérifier si le texte de recherche est inclus dans le nom de la recette
    if (recipeName.indexOf(searchText) !== -1) { 
      // Normaliser et ajouter le nom de l'appareil à l'ensemble
      const appliance = normalizeString(recipe.appliance.toLowerCase());
      applianceSet.add(appliance);
    }
  }
// Récupérer la liste d'options de la liste déroulante des appareils
  const applianceList = appareilsDropdown.querySelectorAll('li');
// Parcourir les éléments de la liste d'options
  for (const item of applianceList) {
    const appliance = item.textContent.toLowerCase();
    // Vérifier si l'appareil est présent dans l'ensemble d'appareils uniques des recettes filtrées
    if (applianceSet.has(appliance)) {
      // Si l'appareil est présent, afficher l'option dans la liste déroulante
      item.style.display = "";
    } else {
      // Sinon, masquer l'option dans la liste déroulante
      item.style.display = "none";
    }
  }
   // Mettre à jour les événements de clic pour les options de la liste déroulante
  const dropdowns = document.querySelectorAll('.dropdown-item');
  for (const item of dropdowns) {
    item.addEventListener('click', handleSelection);
  }
}


// Récupérer l'élément de liste déroulante des ustensiles
const ustensilsDropdown = document.getElementById('ustensileList');
// Fonction pour générer les options de la liste déroulante des ustensiles
function generateUstensilsOptions() {
  // Récupérer toutes les données de recette
  const recipesData = getRecipe();
// Créer un ensemble pour stocker les noms d'ustensiles uniques
  const ustensilsSet = new Set();
// Parcourir les données de recette pour extraire les noms d'ustensiles uniques
  for (const recipe of recipesData) {
    // Parcourir la liste des ustensiles de chaque recette
    for (const ustensil of recipe.ustensils) {
      // Ajouter le nom de l'ustensile à l'ensemble (en minuscules)
      ustensilsSet.add(ustensil.toLowerCase());
    }
  }
// Convertir l'ensemble d'ustensiles en tableau et les trier
  const ustensilsOptions = Array.from(ustensilsSet).sort();
// Parcourir les options d'ustensiles et créer des éléments li pour chaque option
  for (const ustensil of ustensilsOptions) {
    const li = document.createElement('li');
    li.classList.add('dropdown-item');
    li.innerHTML = `${ustensil}`;
      // Ajouter l'élément li à la liste déroulante des ustensiles
    ustensilsDropdown.appendChild(li);
  }
}
// Appeler la fonction pour générer les options de la liste déroulante des ustensiles
generateUstensilsOptions();

// Fonction pour mettre à jour les options de la liste déroulante des ustensiles
function updateUstensilsDropdown(filteredRecipes) {
    // Obtenir le texte de recherche en minuscules
  const searchText = searchInput.value.toLowerCase();
// Créer un ensemble pour stocker les noms d'ustensiles correspondant à la recherche
  const ustensilsSet = new Set();
  // Parcourir les recettes filtrées pour lesquelles le nom de recette correspond à la recherche
  for (const recipe of filteredRecipes) {
    const recipeName = normalizeString(recipe.name.toLowerCase());
    if (recipeName.indexOf(searchText) !== -1) { 
       // Parcourir la liste des ustensiles de la recette
      for (const ustensil of recipe.ustensils) {
        // Ajouter le nom d'ustensile normalisé à l'ensemble (en minuscules)
        const normalizedUstensil = normalizeString(ustensil.toLowerCase());
        ustensilsSet.add(normalizedUstensil);
      }
    }
  }
// Récupérer la liste des options d'ustensiles
  const ustensilsList = ustensilsDropdown.querySelectorAll('li');
 // Parcourir les options d'ustensiles et mettre à jour l'affichage
  for (const item of ustensilsList) {
    const ustensil = item.textContent.toLowerCase();
    if (ustensilsSet.has(ustensil)) {
      // Si l'ustensile est dans l'ensemble, afficher l'élément
      item.style.display = "";
    } else {
      // Sinon, masquer l'élément
      item.style.display = "none";
    }
  }
}


// Fonction pour masquer les éléments sélectionnés dans la liste déroulante
function hideSelectedItems() {
    // Récupérer tous les éléments de la liste déroulante
  const dropdowns = document.querySelectorAll('.dropdown-item');
  // Parcourir tous les éléments de la liste déroulante
  for (let i = 0; i < dropdowns.length; i++) {
    const item = dropdowns[i];
     // Vérifier si l'élément a la classe 'selected'
    if (hasClass(item, 'selected')) {
      // Si oui, masquer l'élément en définissant sa propriété display à "none"
      item.style.display = "none";
    }
  }
}
// Fonction pour vérifier si un élément a une classe spécifique
function hasClass(element, className) {
   // Récupérer la liste des classes de l'élément
  const classes = element.className;
  // Initialiser les index de début et de fin pour parcourir les classes
  let startIndex = 0;
  let endIndex = 0;
  // Parcourir la liste des classes
  while (endIndex < classes.length) {
    // Vérifier si l'index actuel est un espace ou si on atteint la fin de la chaîne de classes
    if (classes[endIndex] === ' ' || endIndex === classes.length - 1) {
      // Extraire le nom de classe courant à partir de la chaîne de classes
      const currentClassName = classes.substring(startIndex, endIndex + 1);
      // Comparer le nom de classe courant avec le nom de classe recherché
      if (currentClassName.replace(/^\s+|\s+$/g, '') === className) {
        // Retourner true si la classe est trouvée
        return true;
      }
      // Mettre à jour l'index de début pour le prochain nom de classe
      startIndex = endIndex + 1;
    }
    // Passer à l'index suivant
    endIndex++;
  }
  // Si la classe n'est pas trouvée, retourner false
  return false;
}





const selectedItemsContainer = document.getElementById('selectedItemsContainer');


function createBadge(item) {
  // Supprimer les espaces en début et fin du texte de l'élément
  const trimmedItem = item.replace(/^\s+|\s+$/g, '');
   // Créer un élément de badge
  const badge = document.createElement('span');
  badge.classList.add('badg-primary', 'me-2', 'tag');
  badge.textContent = trimmedItem;
  badge.innerHTML = `${trimmedItem}<i class="fa-solid fa-xmark ms-3"></i>`;

  // ajouter la croix dans le badge
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
// Ajouter le badge au conteneur des éléments sélectionnés
  selectedItemsContainer.appendChild(badge);
  // Filtrer les recettes en fonction des éléments sélectionnés et afficher les résultats
  filterRecipes();
  // Masquer les éléments sélectionnés dans le menu déroulant
  hideSelectedItems();
}


// Supprime un élément sélectionné (tag)
function removeSelectedItem(badge) {
  badge.remove(); // Supprime le badge d'élément sélectionné
  filterRecipes(); // Obtient les recettes filtrées à partir de la fonction filterRecipes()
  
  }
// Fonction pour gérer la sélection d'un élément dans les menus déroulants
  function handleSelection(event) {
    // Obtenir le texte de l'élément sélectionné
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
   // Appeler la fonction pour filtrer les recettes en fonction des éléments sélectionnés
    filterRecipes();
  }
  
  function hasClasse(element, className) {
    // Obtenir la liste des classes de l'élément
    const classes = element.className;
    // Initialiser l'index de recherche
    let currentIndex = 0;
    let index;
    // Parcourir la liste des classes pour trouver la classe spécifique
    while ((index = classes.indexOf(className, currentIndex)) !== -1) {
      // Vérifier si le nom de classe trouvé est un nom de classe complet (pas un sous-ensemble d'un nom de classe)
      if (
        (index === 0 || classes[index - 1] === ' ') &&  // Vérifier le caractère précédent
        (index + className.length === classes.length || classes[index + className.length] === ' ') // Vérifier le caractère suivant
      ) {
        // La classe spécifique a été trouvée
        return true;
      }
      // Mettre à jour l'index de recherche pour continuer la recherche
      currentIndex = index + 1;
    }
    // La classe spécifique n'a pas été trouvée
    return false;
  }
  


const dropdowns = document.querySelectorAll('.dropdown-item');
// Parcourir la liste d'éléments ayant la classe .dropdown-item
for (let i = 0; i < dropdowns.length; i++) {
  const item = dropdowns[i];
  // Ajouter des écouteurs d'événements aux éléments de tous les dropdowns
  item.addEventListener('click', handleSelection);
}



function searchList(inputId, listId) {
  // Récupérer l'élément d'entrée de texte (input) et la valeur filtrante
  let input = document.getElementById(inputId);
  let filter = toUpperCase(input.value);
  // Récupérer la liste non filtrée et tous ses éléments de liste (li)
  let ul = document.getElementById(listId);
  let li = Array.from(ul.getElementsByTagName("li")); 
// Parcourir chaque élément de liste (li) dans la liste
  for (const item of li) {
    // Récupérer le texte de l'élément de liste
    let txtValue = item.textContent || item.innerText;
    // Comparer le texte de l'élément de liste avec le filtre en ignorante la casse
    if (indexOff(toUpperCase(txtValue), filter) > -1) {
      // Si le texte correspond au filtre, afficher l'élément
      item.style.display = "";
    } else {
       // Sinon, masquer l'élément
      item.style.display = "none";
    }
  }
}

  const searchIcon = document.querySelector('.search-icone');

  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      searchIcon.style.visibility = 'visible';
    } else {
      searchIcon.style.visibility = 'hidden';
    }
  });

// Fonction toUpperCase personnalisée
function toUpperCase(str) {
  let result = "";
   // Parcourir chaque caractère de la chaîne
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    // Vérifier si le caractère est une lettre minuscule (code ASCII entre 97 et 122)
    if (charCode >= 97 && charCode <= 122) {
      // Convertir le caractère en majuscule en soustrayant 32 au code ASCII
      result += String.fromCharCode(charCode - 32);
    } else {
      // Si ce n'est pas une lettre minuscule, ajouter le caractère tel quel
      result += str.charAt(i);
    }
  }
  return result;
}

// Fonction indexOf personnalisée
function indexOff(str, searchValue, startIndex = 0) {
  const len = str.length;
  // Parcourir la chaîne à partir de l'index de départ spécifié
  for (let i = startIndex; i < len; i++) {
    if (str.charAt(i) === searchValue.charAt(0)) {
      let j = 1;
      // Vérifier les caractères suivants pour correspondre à la sous-chaîne
      while (j < searchValue.length && str.charAt(i + j) === searchValue.charAt(j)) {
        j++;
      }
       // Si j a atteint la longueur de la sous-chaîne, cela signifie que nous avons trouvé une correspondance
      if (j === searchValue.length) {
         // Retourner l'index de début de la correspondance
        return i;
      }
    }
  }
  // Si aucune correspondance n'est trouvée, retourner -1
  return -1;
}




// Gestion de la recherche pour chaque liste
document.getElementById("ingredient").addEventListener("input", function() {
  // Appeler la fonction searchList pour filtrer les éléments dans la liste d'ingrédients
  searchList("ingredient", "ingredientsDropdown");
  });

  document.getElementById("appareils").addEventListener("input", function() {
     // Appeler la fonction searchList pour filtrer les éléments dans la liste d'appareils
    searchList("appareils", "appareilsDropdown");
    });

    document.getElementById("ustensiles").addEventListener("input", function() {
      // Appeler la fonction searchList pour filtrer les éléments dans la liste d'ustensiles
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
   // Récupérer l'élément du champ de recherche par son ID
  const searchInput = document.getElementById('search-bar');
  // Définir la valeur du champ de recherche sur la valeur souhaitée
  searchInput.value = inputValue;
  // Créer un nouvel événement 'input' (saisie)
  const event = new Event('input', { bubbles: true });
   // Déclencher l'événement 'input' sur l'élément du champ de recherche
  searchInput.dispatchEvent(event);
}

// Appeler la fonction testFilterRecipesPerformanceWithInputValues pour tester les performances avec différentes valeurs de recherche simulées
// testFilterRecipesPerformanceWithInputValues();




