// Récupère les données des recettes
function getRecipe() {
  try {
    const data = recipes; // Récupère les données des recettes (insertion des datas dans le index.html)
    console.log(data);
    return data; // Retourne les données des recettes
  } catch (error) {
    console.error(error);
  }
}




// Affiche les recettes filtrées
function displayRecipe() {
  const recipesData = getRecipe(); // Récupère les données des recettes
  console.log(recipesData);

  const recipeContainer = document.getElementById('recipeContainer'); // Élément HTML qui contiendra les cartes de recettes
  recipeContainer.innerHTML = ''; 
  // Efface le contenu précédent du conteneur de recettes
  // updateDropdownOptions(recipesData);

  recipesData.forEach((recipe) => {
    const recipeModel = recipeFactory(recipe);
    const recipeCardDom = recipeModel.getRecipeCardDom(); // Récupère la représentation DOM de la carte de recette
    recipeContainer.appendChild(recipeCardDom); // Ajoute la carte de recette au conteneur de recettes
    // updateIngredientsDropdown(recipesData);
    // updateApplianceDropdown(recipesData);
    // updateUstensilsDropdown(recipesData);
  });
    // updateIngredientsDropdown(recipesData);
    // updateApplianceDropdown(recipesData);
    // updateUstensilsDropdown(recipesData);
}



function normalizeString(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


// Filtrer les recettes en fonction des badges sélectionnés
function filterRecipes() {
  const searchText = normalizeString(searchInput.value.toLowerCase());
  
  // Vérifie si le texte saisi a au moins trois caractères
  if (searchText.length >= 3) {
    const recipesData = getRecipe(); // Récupère les données des recettes

    const filteredRecipes = recipesData.filter((recipe) => {
      // Recherche dans le nom de la recette
      const recipeName = normalizeString(recipe.name.toLowerCase());
      if (recipeName.includes(searchText)) {
        return true;
      }

      // Recherche dans les ingrédients
      const ingredientsMatch = recipe.ingredients.some((ingredient) => {
        const ingredientName = normalizeString(ingredient.ingredient.toLowerCase());
        return ingredientName.includes(searchText);
      });
      if (ingredientsMatch) {
        return true;
      }

      // Recherche dans la description
      const description = normalizeString(recipe.description.toLowerCase());
      if (description.includes(searchText)) {
        return true;
      }

      // Recherche dans l'appareil
      const appliance = normalizeString(recipe.appliance.toLowerCase());
      if (appliance.includes(searchText)) {
        return true;
      }

      // Recherche dans les ustensiles
      const ustensilsMatch = recipe.ustensils.some((ustensil) => {
        const ustensilName = normalizeString(ustensil.toLowerCase());

        return ustensilName.includes(searchText);
      });

      if (ustensilsMatch) {
        return true;
      }
      return false;
    });

    

    // Filtrer les recettes en fonction des badges sélectionnés
    const selectedBadges = selectedItemsContainer.querySelectorAll('.tag');
    const selectedItems = Array.from(selectedBadges).map((badge) => badge.textContent);
    const filteredRecipesWithSelectedItems = filteredRecipes.filter((recipe) => {
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

    displayFilteredRecipes(filteredRecipesWithSelectedItems);
  } else if (searchText.length === 0 && selectedItemsContainer.children.length > 0) {
    const selectedItems = Array.from(selectedItemsContainer.querySelectorAll('.tag')).map((badge) =>
      normalizeString(badge.textContent.toLowerCase())
    );



    const recipesData = getRecipe();
    const filteredRecipesWithSelectedItems = recipesData.filter((recipe) => {
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

    displayFilteredRecipes(filteredRecipesWithSelectedItems);
  } else if (searchText.length === 0 && selectedItemsContainer.children.length === 0) {
    recipeContainer.innerHTML = '';
    displayRecipe();
  }
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
  updateIngredientsDropdown(filteredRecipes);
  updateApplianceDropdown(filteredRecipes);
  updateUstensilsDropdown(filteredRecipes);
}




const ingredientsDropdown = document.getElementById('ingredientsDropdown');
const appareilsDropdown = document.getElementById('appareilsDropdown');
const ustensilsDropdown = document.getElementById('ustensilsDropdown');

function generateIngredientsOptions() {
  const recipesData = getRecipe();

  const ingredientsSet = new Set();

  recipesData.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      ingredientsSet.add(ingredient.ingredient.toLowerCase());
    });
  });

  const ingredientsOptions = Array.from(ingredientsSet).sort();

  ingredientsOptions.forEach((ingredient) => {
    const li = document.createElement('li');
    li.classList.add('dropdown-item');
    li.innerHTML = `${ingredient}`;
    ingredientsDropdown.appendChild(li);
  });
}

generateIngredientsOptions();


function updateIngredientsDropdown(filteredRecipes) {
  const searchText = searchInput.value.toLowerCase();

  const ingredientsSet = new Set();

  filteredRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      ingredientsSet.add(ingredient.ingredient.toLowerCase());
    });
  });

  const ingredientsList = ingredientsDropdown.querySelectorAll('li');

  ingredientsList.forEach((item) => {
    const ingredient = item.textContent.toLowerCase();
    if (searchText === '' || ingredientsSet.has(ingredient)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}






function generateApplianceOptions() {
  const recipesData = getRecipe();

  const appliancesSet = new Set();

  recipesData.forEach((recipe) => {
    appliancesSet.add(recipe.appliance.toLowerCase());
  });

  const appliancesOptions = Array.from(appliancesSet).sort();

  appliancesOptions.forEach((appliance) => {
    const li = document.createElement('li');
    li.classList.add('dropdown-item');
    li.innerHTML = `${appliance}`;
    appareilsDropdown.appendChild(li);
  });
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
// searchInput.addEventListener('input', updateApplianceDropdown);


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







// searchInput.addEventListener('input', updateUstensilsDropdown);



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
  

  selectedItemsContainer.appendChild(badge);
  filterRecipes();
}


// Supprime un élément sélectionné (tag)
function removeSelectedItem(badge) {
  badge.remove(); // Supprime le badge d'élément sélectionné
  filterRecipes();
}

function handleSelection(event) {
  const selectedItem = event.target.textContent;
  console.log(selectedItem);
  createBadge(selectedItem);
  // Supprimer l'élément de la liste déroulante
  const li = event.target;
  li.style.display = "none";

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

document.getElementById("appareils").addEventListener("input", function() {
  searchList("appareils", "appareilsDropdown");
});

document.getElementById("ustensiles").addEventListener("input", function() {
  searchList("ustensiles", "ustensilsDropdown");
});


function autocompleteSearch() {
  const searchText = searchInput.value.toLowerCase();
  const recipesData = getRecipe();

  // Vérifie si le texte saisi a au moins deux caractères
  if (searchText.length >= 1) {
    const filteredRecipes = recipesData.filter((recipe) => {
      const recipeName = normalizeString(recipe.name.toLowerCase());
      return recipeName.includes(searchText);
    });

    const recipeNames = filteredRecipes.map((recipe) => recipe.name.toLowerCase());

    const autocompleteDropdown = document.getElementById('autocompleteDropdown');
    autocompleteDropdown.innerHTML = ''; // Efface le contenu précédent du dropdown

    recipeNames.forEach((name) => {
      if (name.includes(searchText)) {
        const li = document.createElement('li');
        li.textContent = name;
        li.addEventListener('click', () => {
          searchInput.value = name;
          autocompleteDropdown.innerHTML = ''; // Efface le dropdown après avoir sélectionné une suggestion
          filterRecipes(); // Appel de la fonction filterRecipes pour mettre à jour les recettes filtrées
        });
        autocompleteDropdown.appendChild(li);
      }
    });
  } else {
    // Si la saisie comporte moins de deux caractères, efface le dropdown
    const autocompleteDropdown = document.getElementById('autocompleteDropdown');
    autocompleteDropdown.innerHTML = '';
  }
}


// let filteredRecipes = filterRecipes();
// Ajoutez cet événement à votre code existant
searchInput.addEventListener('input', autocompleteSearch);

searchInput.addEventListener('input', function() {
  const searchText = searchInput.value.toLowerCase();
  
  if (searchText === '') {
    //location.reload();
   /* $(document).ready(function(){
      $("#autoreloa").load(window.location.href + " #autoreloa" );
    });*/
    let counter = 0;
    if (counter == 0) {
      var span;
      span = document.getElementById("autoreloa");
      span.innerHTML = counter;
    }
    ingredientsDropdown.innerHTML = ''; // Effacer la liste existante
    generateIngredientsOptions(); // Générer la liste complète des ingrédients
    // updateIngredientsDropdown(filteredRecipes);
    removeSelectedItem(badge)
  }
    // Effectuer la mise à jour en fonction du texte de recherche actuel
    // updateIngredientsDropdown(filteredRecipes);
  
});