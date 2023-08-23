// Cette fonction récupère les données des recettes depuis une source appelée recipes.
function getRecipe() {
  try {
    const data = recipes; // Récupère les données des recettes (insertion des datas dans le index.html)
    // console.log(data);
    return data; // Retourne les données des recettes
  } catch (error) {
    console.error(error);
  }
}
// let filteredRecipes = [];

function countDisplayedRecipes() {
  const recipeContainer = document.getElementById("recipeContainer");
  const displayedRecipesCount = recipeContainer.childElementCount;
  return displayedRecipesCount;
}

// Cette fonction affiche toutes les recettes dans le conteneur HTML avec l'ID recipeContainer.
function displayRecipe() {
  const recipesData = getRecipe(); // appelle getRecipe() pour obtenir les données des recettes.
  // console.log(recipesData);

  const recipeContainer = document.getElementById("recipeContainer"); // Élément HTML qui contiendra les cartes de recettes
  recipeContainer.innerHTML = "";
  // Efface le contenu précédent du conteneur de recettes
  // Pour chaque recette, elle crée une carte de recette à l'aide de la fonction recipeFactory() et ajoute cette carte au conteneur recipeContainer.
  recipesData.forEach((recipe) => {
    const recipeModel = recipeFactory(recipe);
    const recipeCardDom = recipeModel.getRecipeCardDom(); // Récupère la représentation DOM de la carte de recette
    recipeContainer.appendChild(recipeCardDom); // Ajoute la carte de recette au conteneur de recettes
  });
  // Appeler la fonction pour obtenir le nombre de recettes affichées au chargement de la page
  const displayedRecipesCount = countDisplayedRecipes();
  const textBanner = document.querySelector(".text-filter");
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

// Fonction pour filtrer les recettes en fonction des badges sélectionnés
function filterBySelectedItems(recipesData, selectedItems) {
  // Création d'un tableau pour stocker les recettes filtrées
  const filteredRecipes = recipesData.filter((recipe) => {
    // Vérifie si chaque élément sélectionné correspond à au moins un critère de la recette
    return selectedItems.every((item) => {
      // Normalisation de l'élément sélectionné en minuscules
      const normalizedItem = normalizeString(item.toLowerCase());
      // Renvoie true si l'élément sélectionné correspond à au moins un critère de la recette
      return (
        // Vérifie si l'élément sélectionné correspond à un ingrédient de la recette
        recipe.ingredients.some((ingredient) =>
          normalizeString(ingredient.ingredient.toLowerCase()).includes(
            normalizedItem
          )
        ) ||
        // Vérifie si l'élément sélectionné correspond à l'appareil de la recette
        normalizeString(recipe.appliance.toLowerCase()).includes(
          normalizedItem
        ) ||
        recipe.ustensils.some((ustensil) =>
          // Vérifie si l'élément sélectionné correspond à un ustensile de la recette
          normalizeString(ustensil.toLowerCase()).includes(normalizedItem)
        )
      );
    });
  });

  // Mettre à jour les ingrédients dans le menu déroulant en fonction des recettes filtrées par badge
  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);
  // Retourne le tableau des recettes filtrées
  return filteredRecipes;
}

// Fonction de filtrage des recettes
function filterRecipes() {
  // Obtenir le texte de recherche normalisé à partir de l'entrée de recherche
  const searchText = normalizeString(searchInput.value.toLowerCase());
  // Obtenir les données des recettes
  const recipesData = getRecipe();
  // Initialiser le tableau des recettes filtrées avec toutes les recettes
  let filteredRecipes = recipesData;
  // Vérifier si le texte de recherche est suffisamment long (au moins 3 caractères)
  if (searchText.length >= 3) {
    // Filtrer les recettes en fonction du texte de recherche
    filteredRecipes = recipesData.filter((recipe) => {
      // Normaliser le nom de la recette en minuscules
      const recipeName = normalizeString(recipe.name.toLowerCase());
      // Vérifier si le texte de recherche correspond au nom de la recette
      const recipeNameMatch = recipeName.includes(searchText);
      // Vérifier si le texte de recherche correspond à un ingrédient de la recette
      const ingredientMatch = recipe.ingredients.some((ingredient) => {
        const ingredientName = normalizeString(
          ingredient.ingredient.toLowerCase()
        );
        return ingredientName.includes(searchText);
      });
      // Vérifier si le texte de recherche correspond à la description de la recette
      const descriptionMatch = normalizeString(
        recipe.description.toLowerCase()
      ).includes(searchText);
      // Vérifier si le texte de recherche correspond à l'appareil de la recette
      const applianceMatch = normalizeString(
        recipe.appliance.toLowerCase()
      ).includes(searchText);
      // Vérifier si le texte de recherche correspond à un ustensile de la recette
      const ustensilsMatch = recipe.ustensils.some((ustensil) => {
        const ustensilName = normalizeString(ustensil.toLowerCase());
        return ustensilName.includes(searchText);
      });
      return (
        // Retourner true si le texte de recherche correspond à au moins un critère de la recette
        recipeNameMatch ||
        ingredientMatch ||
        descriptionMatch ||
        applianceMatch ||
        ustensilsMatch
      );
    });
  }
  // Vérifier s'il y a des éléments sélectionnés à prendre en compte
  if (selectedItemsContainer.children.length > 0) {
    // Obtenir les éléments sélectionnés normalisés
    const selectedItems = Array.from(
      selectedItemsContainer.querySelectorAll(".tag")
    ).map((badge) => normalizeString(badge.textContent.toLowerCase()));
    // Filtrer les recettes en fonction des éléments sélectionnés
    filteredRecipes = filterBySelectedItems(filteredRecipes, selectedItems);
  }
  // Afficher les recettes filtrées
  displayFilteredRecipes(filteredRecipes);
  // Mettre à jour les options du menu déroulant d'ingrédients, d'appareils et d'ustensiles
  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);
  // Obtenir le nombre de recettes affichées
  const displayedRecipesCount = filteredRecipes.length;
  // Mettre à jour le texte pour afficher le nombre de recettes
  const textBanner = document.querySelector(".text-filter");
  const bannerText = ` ${displayedRecipesCount} recettes`;
  textBanner.innerHTML = bannerText;
  // console.log('Nombre de recettes affichées :', displayedRecipesCount);
}
displayRecipe(); // Affiche les recettes au chargement de la page

// on récupère la barre de recherche avec l'ID "search-bar"
const searchInput = document.getElementById("search-bar");
// Ajoute un écouteur d'événement "input" à l'élément de recherche
// Lorsque l'utilisateur saisit du texte dans l'élément de recherche, la fonction "filterRecipes" sera appelée
searchInput.addEventListener("input", filterRecipes);

// Texte à afficher si pas de recette trouvé
const noResultsText = "Aucun résultat pour cette recherche.";
// Fonction pour afficher les recettes filtrées dans l'interface utilisateur
function displayFilteredRecipes(filteredRecipes) {
  // Obtenir la référence à l'élément HTML contenant les recettes
  const recipeContainer = document.getElementById("recipeContainer");
  // Efface le contenu précédent du conteneur de recettes
  recipeContainer.innerHTML = "";

  if (filteredRecipes.length === 0) {
    // Affiche un message lorsque le nombre de recettes filtrées est de 0
    const noResultsDiv = document.createElement("div");
    noResultsDiv.classList.add("no-results");
    noResultsDiv.textContent = noResultsText;
    recipeContainer.appendChild(noResultsDiv);
  } else {
    // Efface le contenu précédent du conteneur de recettes
    recipeContainer.innerHTML = "";
    // Parcourt les recettes filtrées et les affiche
    filteredRecipes.forEach((recipe) => {
      // Crée un modèle de recette à partir des données de la recette
      const recipeModel = recipeFactory(recipe);
      // Obtient la représentation DOM de la carte de recette à partir du modèle
      const recipeCardDom = recipeModel.getRecipeCardDom();
      // Ajoute la carte de recette au conteneur de recettes
      recipeContainer.appendChild(recipeCardDom);
    });
  }
}

// Obtenir la référence à l'élément du menu déroulant d'ingrédients
const ingredientsDropdown = document.getElementById("ingredientList");
// Fonction pour générer les options du menu déroulant d'ingrédients
function generateIngredientsOptions() {
  // Obtenir les données des recettes
  const recipesData = getRecipe();
  // Utiliser un ensemble pour stocker les ingrédients uniques
  const ingredientsSet = new Set();
  // Parcourir les données de recettes pour extraire les ingrédients uniques
  recipesData.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const normalizedIngredient = normalizeString(
        ingredient.ingredient.toLowerCase()
      );
      ingredientsSet.add(normalizedIngredient);
    });
  });
  // Convertir l'ensemble d'ingrédients en tableau et trier les options
  const ingredientsOptions = Array.from(ingredientsSet).sort();
  const ingredientsDropdown = document.getElementById("ingredientList");
  // Mettre à jour le contenu du menu déroulant d'ingrédients avec les nouvelles options
  ingredientsDropdown.innerHTML = `
      ${ingredientsOptions
        .map((e) => `<li class="dropdown-item">${e}</li>`)
        .join("")}
    `;
  // Obtenir toutes les options du menu déroulant
  const dropdowns = document.querySelectorAll(".dropdown-item");
  // Ajouter un écouteur d'événement "click" à chaque option du menu déroulant
  dropdowns.forEach((item) => {
    item.addEventListener("click", handleSelection);
  });
}
// Appel initial pour générer les options du menu déroulant d'ingrédients
generateIngredientsOptions();

// Fonction pour mettre à jour les options du menu déroulant d'ingrédients en fonction des recettes filtrées
function updateIngredientsDropdown(filteredRecipes) {
  // Utiliser un ensemble pour stocker les noms d'ingrédients uniques dans les recettes filtrées
  const ingredientsSet = new Set();
  // Parcourir les recettes filtrées pour extraire les noms d'ingrédients
  filteredRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const ingredientName = normalizeString(
        ingredient.ingredient.toLowerCase()
      );
      ingredientsSet.add(ingredientName);
    });
  });
  // Obtenir la liste des éléments d'options du menu déroulant d'ingrédients
  const ingredientsList = ingredientsDropdown.querySelectorAll("li");
  // Parcourir chaque élément de la liste des options du menu déroulant
  ingredientsList.forEach((item) => {
    // Obtenir le nom de l'ingrédient à partir de l'élément
    const ingredient = item.textContent.toLowerCase();
    // Vérifier si l'ingrédient est présent dans l'ensemble d'ingrédients uniques
    if (ingredientsSet.has(ingredient)) {
      // Afficher l'élément si l'ingrédient est présent dans les recettes filtrées
      item.style.display = "";
    } else {
      // Masquer l'élément si l'ingrédient n'est pas présent dans les recettes filtrées
      item.style.display = "none";
    }
  });
}
// Obtenir la référence à l'élément du menu déroulant d'appareils
const appareilsDropdown = document.getElementById("appareilList");
// Fonction pour générer les options du menu déroulant d'appareils
function generateApplianceOptions() {
  // Obtenir les données des recettes
  const recipesData = getRecipe();
  // Utiliser un ensemble pour stocker les noms d'appareils uniques
  const appliancesSet = new Set();
  // Parcourir les données de recettes pour extraire les noms d'appareils uniques
  recipesData.forEach((recipe) => {
    appliancesSet.add(recipe.appliance.toLowerCase());
  });
  // Convertir l'ensemble d'appareils en tableau et trier les options
  const appliancesOptions = Array.from(appliancesSet).sort();
  // Mettre à jour le contenu du menu déroulant d'appareils avec les nouvelles options
  appareilsDropdown.innerHTML = `
    ${appliancesOptions
      .map((e) => `<li class="dropdown-item">${e}</li>`)
      .join("")}`;
  // Ancienne méthode alternative pour ajouter des éléments en utilisant createElement et appendChild
  // appliancesOptions.forEach((appliance) => {
  //   const li = document.createElement('li');
  //   li.classList.add('dropdown-item');
  //   li.innerHTML = `${appliance}`;
  //   appareilsDropdown.appendChild(li);
  // });
}
// Appel initial pour générer les options du menu déroulant d'appareils
generateApplianceOptions();

// Fonction pour mettre à jour les options du menu déroulant d'appareils en fonction des recettes filtrées
function updateApplianceDropdown(filteredRecipes) {
  // Obtenir le texte de recherche à partir de l'élément de recherche
  const searchText = searchInput.value.toLowerCase();
  // Utiliser un ensemble pour stocker les noms d'appareils uniques dans les recettes filtrées
  const applianceSet = new Set();
  // Parcourir les recettes filtrées pour extraire les noms d'appareils uniques
  filteredRecipes.forEach((recipe) => {
    // Normaliser et vérifier si le nom de la recette correspond au texte de recherche
    const recipeName = normalizeString(recipe.name.toLowerCase());
    if (recipeName.includes(searchText)) {
      const appliance = normalizeString(recipe.appliance.toLowerCase());
      applianceSet.add(appliance);
    }
  });
  // Obtenir la liste des éléments d'options du menu déroulant d'appareils
  const applianceList = appareilsDropdown.querySelectorAll("li");
  // Parcourir chaque élément de la liste des options du menu déroulant d'appareils
  applianceList.forEach((item) => {
    // Obtenir le nom de l'appareil à partir de l'élément
    const appliance = item.textContent.toLowerCase();
    // Vérifier si l'appareil est présent dans l'ensemble d'appareils
    if (applianceSet.has(appliance)) {
      // Afficher l'élément si l'appareil est présent dans les recettes filtrées
      item.style.display = "";
    } else {
      // Masquer l'élément si l'appareil n'est pas présent dans les recettes filtrées
      item.style.display = "none";
    }
  });
}
// Obtenir la référence à l'élément du menu déroulant d'ustensiles
const ustensilsDropdown = document.getElementById("ustensileList");
// Fonction pour générer les options du menu déroulant d'ustensiles
function generateUstensilsOptions() {
  // Obtenir les données des recettes
  const recipesData = getRecipe();
  // Utiliser un ensemble pour stocker les noms d'ustensiles uniques
  const ustensilsSet = new Set();
  // Parcourir les données de recettes pour extraire les noms d'ustensiles uniques
  recipesData.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      ustensilsSet.add(ustensil.toLowerCase());
    });
  });
  // Convertir l'ensemble d'ustensiles en tableau et trier les options
  const ustensilsOptions = Array.from(ustensilsSet).sort();
  // Mettre à jour le contenu du menu déroulant d'ustensiles avec les nouvelles options
  ustensilsDropdown.innerHTML = `
    ${ustensilsOptions
      .map((e) => `<li class="dropdown-item">${e}</li>`)
      .join("")}`;
}
// Appel initial pour générer les options du menu déroulant d'ustensiles
generateUstensilsOptions();

// Fonction pour mettre à jour les options du menu déroulant d'ustensiles en fonction des recettes filtrées
function updateUstensilsDropdown(filteredRecipes) {
  // Obtenir le texte de recherche à partir de l'élément de recherche
  const searchText = searchInput.value.toLowerCase();
  // Utiliser un ensemble pour stocker les noms d'ustensiles uniques dans les recettes filtrées
  const ustensilsSet = new Set();
  // Parcourir les recettes filtrées pour extraire les noms d'ustensiles uniques
  filteredRecipes.forEach((recipe) => {
    // Normaliser et vérifier si le nom de la recette correspond au texte de recherche
    const recipeName = normalizeString(recipe.name.toLowerCase());
    if (recipeName.includes(searchText)) {
      recipe.ustensils.forEach((ustensil) => {
        // Normaliser et ajouter chaque ustensil à l'ensemble d'ustensiles uniques
        const normalizedUstensil = normalizeString(ustensil.toLowerCase());
        ustensilsSet.add(normalizedUstensil);
      });
    }
  });
  // Obtenir la liste des éléments d'options du menu déroulant d'ustensiles
  const ustensilsList = ustensilsDropdown.querySelectorAll("li");
  // Parcourir chaque élément de la liste des options du menu déroulant d'ustensiles
  ustensilsList.forEach((item) => {
    // Obtenir le nom de l'ustensile à partir de l'élément
    const ustensil = item.textContent.toLowerCase();
    // Vérifier si l'ustensile est présent dans l'ensemble d'ustensiles uniques
    if (ustensilsSet.has(ustensil)) {
      // Afficher l'élément si l'ustensile est présent dans les recettes filtrées
      item.style.display = "";
    } else {
      // Masquer l'élément si l'ustensile n'est pas présent dans les recettes filtrées
      item.style.display = "none";
    }
  });
}

// Fonction pour masquer les éléments sélectionnés dans les menus déroulants
function hideSelectedItems() {
  // Sélectionner tous les éléments d'options des menus déroulants
  const dropdowns = document.querySelectorAll(".dropdown-item");
  // Parcourir chaque élément d'option des menus déroulants
  dropdowns.forEach((item) => {
    // Vérifier si l'élément a la classe "selected"
    if (item.classList.contains("selected")) {
      // Masquer l'élément s'il a la classe "selected"
      item.style.display = "none";
    }
  });
}

const selectedItemsContainer = document.getElementById(
  "selectedItemsContainer"
);

// Fonction pour créer un badge à partir d'un élément sélectionné
function createBadge(item) {
  // Supprimer les espaces en début et en fin de chaîne
  const trimmedItem = item.trim();
  // Créer un élément "span" pour le badge
  const badge = document.createElement("span");
  badge.classList.add("badg-primary", "me-2", "tag");
  badge.textContent = trimmedItem;
  badge.innerHTML = `${trimmedItem}<i class="fa-solid fa-xmark ms-3"></i>`;
  // Obtenir l'icône de la croix à l'intérieur du badge
  const closeIcon = badge.querySelector(".fa-xmark");
  // Ajouter un gestionnaire d'événements de clic à l'icône de la croix
  closeIcon.addEventListener("click", () => {
    // Appeler la fonction pour supprimer l'élément sélectionné
    removeSelectedItem(badge);
  });
  // Obtenir tous les éléments d'options des menus déroulants
  const dropdowns = document.querySelectorAll(".dropdown-item");
  // Parcourir chaque élément d'option des menus déroulants
  dropdowns.forEach((item) => {
    // Vérifier si l'élément correspond à l'élément sélectionné
    if (item.textContent.toLowerCase() === trimmedItem.toLowerCase()) {
      // Ajouter la classe "selected" à l'élément de liste
      item.classList.add("selected");
      // Supprimer l'écouteur d'événements de clic pour cet élément
      item.removeEventListener("click", handleSelection);
      // Masquer l'élément en définissant sa propriété display à "none"
      item.style.display = "none";
    }
  });
  // Ajouter le badge au conteneur des éléments sélectionnés
  selectedItemsContainer.appendChild(badge);
  // Appeler la fonction pour filtrer les recettes en fonction des éléments sélectionnés
  filterRecipes();
}

// Supprime un élément sélectionné (tag)
function removeSelectedItem(badge) {
  // Obtenir tous les éléments d'options des menus déroulants
  const dropdowns = document.querySelectorAll(".dropdown-item");
  // Parcourir chaque élément d'option des menus déroulants
  dropdowns.forEach((item) => {
    // Supprimer la classe "selected" de l'élément de liste
    item.classList.remove("selected");
  });
  // Supprimer le badge de l'élément sélectionné
  badge.remove();
  // Appeler la fonction pour filtrer les recettes en fonction des éléments sélectionnés
  filterRecipes();
}
// Fonction pour gérer la sélection d'un élément dans les menus déroulants
function handleSelection(event) {
  // Obtenir le texte de l'élément sélectionné
  const selectedItem = event.target.textContent;
  // Vérifier si l'élément n'a pas déjà la classe "selected"
  if (!event.target.classList.contains("selected")) {
    // Appeler la fonction pour créer un badge à partir de l'élément sélectionné
    // console.log(selectedItem);
    createBadge(selectedItem);
    // Supprimer l'écouteur d'événements de clic pour cet élément
    event.target.removeEventListener("click", handleSelection);
    // Ajouter la classe "selected" à l'élément et le masquer
    const li = event.target;
    li.classList.add("selected");
    li.style.display = "none";
  }
  // Appeler la fonction pour filtrer les recettes en fonction des éléments sélectionnés
  filterRecipes();
}

// Ajouter des écouteurs d'événements aux éléments de tous les dropdowns
const dropdowns = document.querySelectorAll(".dropdown-item");
dropdowns.forEach((item) => {
  item.addEventListener("click", handleSelection);
});

// Fonction pour rechercher et filtrer les éléments dans une liste
function searchList(inputId, listId) {
  // Obtenir l'élément d'entrée (input) par son ID
  let input = document.getElementById(inputId);
  // Convertir le texte de recherche en majuscules pour la comparaison
  let filter = input.value.toUpperCase();
  // Obtenir la liste (ul) par son ID
  let ul = document.getElementById(listId);
  // Obtenir tous les éléments de liste (li) dans la liste
  let li = ul.getElementsByTagName("li");

  // Parcourir chaque élément de liste
  Array.from(li).forEach((item) => {
    // Obtenir le contenu textuel de l'élément de liste
    let txtValue = item.textContent || item.innerText;
    // Vérifier si le texte de l'élément de liste contient la recherche (en majuscules)
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      // Afficher l'élément si la recherche correspond
      item.style.display = "";
    } else {
      // Masquer l'élément si la recherche ne correspond pas
      item.style.display = "none";
    }
  });
}

// Gestion de la recherche pour chaque liste
document.getElementById("ingredient").addEventListener("input", function () {
  // Appeler la fonction searchList pour filtrer les éléments dans la liste d'ingrédients
  searchList("ingredient", "ingredientsDropdown");
});

document.getElementById("appareils").addEventListener("input", function () {
  // Appeler la fonction searchList pour filtrer les éléments dans la liste d'appareils
  searchList("appareils", "appareilsDropdown");
});

document.getElementById("ustensiles").addEventListener("input", function () {
  // Appeler la fonction searchList pour filtrer les éléments dans la liste d'ustensiles
  searchList("ustensiles", "ustensilsDropdown");
});



const searchIcon = document.querySelector('.search-icone');

searchInput.addEventListener('input', () => {
  if (searchInput.value.trim() === '') {
    searchIcon.style.visibility = 'visible';
  } else {
    searchIcon.style.visibility = 'hidden';
  }
});


// test performance
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
  const inputValues = ["tomate", "tarte", "limonade", "soupe", "salade"];
  inputValues.forEach((inputValue) => {
    console.log(`Recherche pour "${inputValue}":`);
    // Simuler l'entrée dans l'input avec la valeur de recherche actuelle
    simulateInput(inputValue, document.getElementById("search-bar"));
    // Mesurer les performances de filterRecipes pour la valeur de recherche actuelle
    testFilterRecipesPerformance();
    console.log("------------------------");
  });
}
// testFilterRecipesPerformance();
// Fonction pour simuler l'entrée de texte dans le champ de recherche
function simulateInput(inputValue) {
  // Obtenir l'élément du champ de recherche par son ID
  const searchInput = document.getElementById("search-bar");
  // Définir la valeur du champ de recherche avec la valeur fournie
  searchInput.value = inputValue;
  // Créer un nouvel événement "input" avec les options nécessaires
  const event = new Event("input", { bubbles: true });
  // Déclencher l'événement "input" sur le champ de recherche
  searchInput.dispatchEvent(event);
}
// Appeler la fonction testFilterRecipesPerformanceWithInputValues pour tester les performances avec différentes valeurs de recherche simulées
// testFilterRecipesPerformanceWithInputValues();
