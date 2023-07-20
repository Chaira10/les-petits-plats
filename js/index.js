// Cette fonction récupère les données des recettes depuis une source appelée recipes.
function getRecipe() {
    try {
      const data = recipes; // Récupère les données des recettes (insertion des datas dans le index.html)
      console.log(data);
      return data; // Retourne les données des recettes
    } catch (error) {
      console.error(error);
    }
  }
  // let filteredRecipes = []; 
  
  
  
  // Cette fonction affiche toutes les recettes dans le conteneur HTML avec l'ID recipeContainer.
  function displayRecipe() {
    const recipesData = getRecipe(); // appelle getRecipe() pour obtenir les données des recettes.
    console.log(recipesData);
  
    const recipeContainer = document.getElementById('recipeContainer'); // Élément HTML qui contiendra les cartes de recettes
    recipeContainer.innerHTML = ''; 
    // Efface le contenu précédent du conteneur de recettes
    // Pour chaque recette, elle crée une carte de recette à l'aide de la fonction recipeFactory() et ajoute cette carte au conteneur recipeContainer.
    recipesData.forEach((recipe) => {
      const recipeModel = recipeFactory(recipe);
      const recipeCardDom = recipeModel.getRecipeCardDom(); // Récupère la représentation DOM de la carte de recette
      recipeContainer.appendChild(recipeCardDom); // Ajoute la carte de recette au conteneur de recettes
    });
  }
  // fonction prend un texte en entrée et normalise les caractères diacritiques en caractères de base (par exemple, é -> e, ç -> c).
  function normalizeString(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

// Fonction pour filtrer les recettes par nom
function filterByRecipeName(recipesData, searchText) {
    return recipesData.filter((recipe) => {
      const recipeName = normalizeString(recipe.name.toLowerCase());
      return recipeName.includes(searchText);
    });
  }
  
  
  

// Fonction pour filtrer les recettes par ingrédients
function filterByIngredients(recipesData, searchText) {
    const filteredRecipes = recipesData.filter((recipe) => {
      return recipe.ingredients.some((ingredient) => {
        const ingredientName = normalizeString(ingredient.ingredient.toLowerCase());
        return ingredientName.includes(searchText);
      });
    });
  
    updateIngredientsDropdown(filteredRecipes); // Mettre à jour le menu déroulant des ingrédients
    updateApplianceDropdown(filteredRecipes);
    updateUstensilsDropdown(filteredRecipes)
    return filteredRecipes; // Renvoyer les recettes filtrées
  }
  
// Fonction pour filtrer les recettes par description
function filterByDescription(recipesData, searchText) {
  const filteredRecipes = recipesData.filter((recipe) => {
    const description = normalizeString(recipe.description.toLowerCase());
    return description.includes(searchText);
  });

  updateIngredientsDropdown(filteredRecipes); // Mettre à jour le menu déroulant des ingrédients
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes)
  return filteredRecipes; // Renvoyer les recettes filtrées
}

// Fonction pour filtrer les recettes par appareil
function filterByAppliance(recipesData, searchText) {
    const filteredRecipes = recipesData.filter((recipe) => {
      const appliance = normalizeString(recipe.appliance.toLowerCase());
      return appliance.includes(searchText);
    });
  
    updateIngredientsDropdown(filteredRecipes); // Mettre à jour le menu déroulant des ingrédients
    updateApplianceDropdown(filteredRecipes);
    updateUstensilsDropdown(filteredRecipes)
    return filteredRecipes; // Renvoyer les recettes filtrées
  }
  
// Fonction pour filtrer les recettes par ustensiles
function filterByUstensils(recipesData, searchText) {
    const filteredRecipes = recipesData.filter((recipe) => {
      return recipe.ustensils.some((ustensil) => {
        const ustensilName = normalizeString(ustensil.toLowerCase());
        return ustensilName.includes(searchText);
      });
    });
  
    updateIngredientsDropdown(filteredRecipes); // Mettre à jour le menu déroulant des ingrédients
    updateApplianceDropdown(filteredRecipes);
    updateUstensilsDropdown(filteredRecipes)
    return filteredRecipes; // Renvoyer les recettes filtrées
  }

  // Fonction pour filtrer les recettes en fonction des badges sélectionnés
  function filterBySelectedItems(recipesData, selectedItems) {
    const filteredRecipes = recipesData.filter((recipe) => {
      return selectedItems.every((item) => {
        const normalizedItem = normalizeString(item.toLowerCase());
        return (
          normalizeString(recipe.name.toLowerCase()).includes(normalizedItem) ||
          recipe.ingredients.some((ingredient) =>
            normalizeString(ingredient.ingredient.toLowerCase()).includes(normalizedItem)
          ) ||
          normalizeString(recipe.description.toLowerCase()).includes(normalizedItem) ||
          normalizeString(recipe.appliance.toLowerCase()).includes(normalizedItem) ||
          recipe.ustensils.some((ustensil) => normalizeString(ustensil.toLowerCase()).includes(normalizedItem))
        );
      });
    });
  
    // Mettre à jour les ingrédients dans le menu déroulant en fonction des recettes filtrées par badge
    updateIngredientsDropdown(filteredRecipes);
    updateApplianceDropdown(filteredRecipes);
    updateUstensilsDropdown(filteredRecipes)
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
      const selectedItems = Array.from(selectedItemsContainer.querySelectorAll('.tag')).map((badge) =>
        normalizeString(badge.textContent.toLowerCase())
      );
  
      filteredRecipes = filterBySelectedItems(filteredRecipes, selectedItems);
    }
  
    displayFilteredRecipes(filteredRecipes);
    updateIngredientsDropdown(filteredRecipes);
    updateApplianceDropdown(filteredRecipes);
    updateUstensilsDropdown(filteredRecipes)
  }
  
  
  
  
  displayRecipe(); // Affiche les recettes au chargement de la page

  const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('input', filterRecipes);


function displayFilteredRecipes(filteredRecipes) {
  const recipeContainer = document.getElementById('recipeContainer');
  recipeContainer.innerHTML = ''; // Efface le contenu précédent du conteneur de recettes

  filteredRecipes.forEach((recipe) => {
    const recipeModel = recipeFactory(recipe);
    const recipeCardDom = recipeModel.getRecipeCardDom();
    recipeContainer.appendChild(recipeCardDom);
  });
}


const ingredientsDropdown = document.getElementById('ingredientList');

function generateIngredientsOptions() {
    const recipesData = getRecipe();
  
    const ingredientsSet = new Set();
  
    recipesData.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const normalizedIngredient = normalizeString(ingredient.ingredient.toLowerCase());
        ingredientsSet.add(normalizedIngredient);
      });
    });
  
    const ingredientsOptions = Array.from(ingredientsSet).sort();
  
    const ingredientsDropdown = document.getElementById('ingredientList');
    ingredientsDropdown.innerHTML = `
      ${ingredientsOptions.map(e => `<li class="dropdown-item">${e}</li>`).join('')}
    `; // Efface le contenu précédent du dropdown

    const dropdowns = document.querySelectorAll('.dropdown-item');
    dropdowns.forEach((item) => {
      item.addEventListener('click', handleSelection);
    });
  
    // ingredientsOptions.forEach((ingredient) => {
    //   const li = document.createElement('li');
    //   li.classList.add('dropdown-item');
    //   li.innerHTML = `${ingredient}`;
    //   ingredientsDropdown.appendChild(li);
    // });
  }
  
  generateIngredientsOptions();
  
  
  function updateIngredientsDropdown(filteredRecipes) {
    const ingredientsSet = new Set();
    filteredRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const ingredientName = normalizeString(ingredient.ingredient.toLowerCase());
        ingredientsSet.add(ingredientName);
      });
    });
    console.log("Ingredients Set:", ingredientsSet);
    const ingredientsList = ingredientsDropdown.querySelectorAll('li');
    ingredientsList.forEach((item) => {
      const ingredient = item.textContent.toLowerCase();
      console.log("Current Ingredient:", ingredient);
      if (ingredientsSet.has(ingredient)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }

  const appareilsDropdown = document.getElementById('appareilList');

  function generateApplianceOptions() {
    const recipesData = getRecipe();
  
    const appliancesSet = new Set();
  
    recipesData.forEach((recipe) => {
      
        appliancesSet.add(recipe.appliance.toLowerCase());
    });
  
    const appliancesOptions = Array.from(appliancesSet).sort();
    const appareilsDropdown = document.getElementById('appareilList');
    appareilsDropdown.innerHTML = `
    ${appliancesOptions.map(e => `<li class="dropdown-item">${e}</li>`).join('')}`
    // appliancesOptions.forEach((appliance) => {
    //   const li = document.createElement('li');
    //   li.classList.add('dropdown-item');
    //   li.innerHTML = `${appliance}`;
    //   appareilsDropdown.appendChild(li);
    // });
  }
  
  generateApplianceOptions();

  function updateApplianceDropdown(filteredRecipes) {
    const searchText = searchInput.value.toLowerCase();
  
    const applianceSet = new Set();
  
    filteredRecipes.forEach((recipe) => {
      const recipeName = normalizeString(recipe.name.toLowerCase());
      if (recipeName.includes(searchText)) {
        const appliance = normalizeString(recipe.appliance.toLowerCase());
        applianceSet.add(appliance);
      }
    });
    
    const applianceList = appareilsDropdown.querySelectorAll('li');
  
    applianceList.forEach((item) => {
      const appliance = item.textContent.toLowerCase();
      if (applianceSet.has(appliance)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }



  const ustensilsDropdown = document.getElementById('ustensileList');

  function generateUstensilsOptions() {
    const recipesData = getRecipe();
  
    const ustensilsSet = new Set();
  
    recipesData.forEach((recipe) => {
      recipe.ustensils.forEach((ustensil) => {
        ustensilsSet.add(ustensil.toLowerCase());
      });
    });
  
    const ustensilsOptions = Array.from(ustensilsSet).sort();
  
    ustensilsOptions.forEach((ustensil) => {
      const li = document.createElement('li');
      li.classList.add('dropdown-item');
      li.innerHTML = `${ustensil}`;
      ustensilsDropdown.appendChild(li);
    });
  }
  
  generateUstensilsOptions();

  function updateUstensilsDropdown(filteredRecipes) {
    const searchText = searchInput.value.toLowerCase();
  
    const ustensilsSet = new Set();
  
    filteredRecipes.forEach((recipe) => {
      const recipeName = normalizeString(recipe.name.toLowerCase());
      if (recipeName.includes(searchText)) {
        recipe.ustensils.forEach((ustensil) => {
          const normalizedUstensil = normalizeString(ustensil.toLowerCase());
          ustensilsSet.add(normalizedUstensil);
        });
      }
    });
  
    const ustensilsList = ustensilsDropdown.querySelectorAll('li');
  
    ustensilsList.forEach((item) => {
      const ustensil = item.textContent.toLowerCase();
      if (ustensilsSet.has(ustensil)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }

  

  // Fonction pour masquer tous les éléments ayant la classe "selected" dans le dropdown
function hideSelectedItems() {
  const dropdowns = document.querySelectorAll('.dropdown-item');
  dropdowns.forEach((item) => {
    if (item.classList.contains('selected')) {
      item.style.display = "none";
    }
  });
}

  
  

  const selectedItemsContainer = document.getElementById('selectedItemsContainer');




  function createBadge(item) {
    const trimmedItem = item.trim();
    const badge = document.createElement('span');
    badge.classList.add('badg-primary', 'me-2', 'tag', );
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
    dropdowns.forEach((item) => {
      if (item.textContent.toLowerCase() === trimmedItem.toLowerCase()) {
        item.classList.add('selected');
  
        // Supprimer l'écouteur d'événements de clic pour cet élément
        item.removeEventListener('click', handleSelection);
  
        // Masquer l'élément en définissant sa propriété display à "none"
        item.style.display = "none";
      }
    });
  
    selectedItemsContainer.appendChild(badge);
    filterRecipes();
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





// Fonction de recherche générique
function searchList(inputId, listId) {
  let input = document.getElementById(inputId);
  let filter = input.value.toUpperCase();
  let ul = document.getElementById(listId);
  let li = ul.getElementsByTagName("li");

  Array.from(li).forEach((item) => {
    let txtValue = item.textContent || item.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}


// Gestion de la recherche pour chaque liste
document.getElementById("ingredient").addEventListener("input", function() {
  searchList("ingredient", "ingredientsDropdown");
});

searchInput.addEventListener('input', function() {
    const searchText = searchInput.value.toLowerCase();
    
    if (searchText === '') {
      // updateAllDropdowns();
  
      // updateIngredientsDropdown(filteredRecipes);
      // removeSelectedItem(badge)
      // Ajouter des écouteurs d'événements aux éléments de tous les dropdowns
      // const dropdowns = document.querySelectorAll('.dropdown-item');
      // dropdowns.forEach((item) => {
      //   item.addEventListener('click', handleSelection);
      // });
  
    }
  });
