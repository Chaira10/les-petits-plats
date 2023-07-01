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

// Affiche les recettes filtrées
async function displayRecipe() {
  const recipesData = getRecipe(); // Récupère les données des recettes
  console.log(recipesData);

  const recipeContainer = document.getElementById('recipeContainer'); // Élément HTML qui contiendra les cartes de recettes
  recipeContainer.innerHTML = ''; // Efface le contenu précédent du conteneur de recettes

  recipesData.forEach((recipe) => {
    const recipeModel = recipeFactory(recipe);
    const recipeCardDom = recipeModel.getRecipeCardDom(); // Récupère la représentation DOM de la carte de recette

    recipeContainer.appendChild(recipeCardDom); // Ajoute la carte de recette au conteneur de recettes

  });

}

const searchInput = document.getElementById('search-bar');
searchInput.addEventListener('input', filterRecipes);


function filterRecipes() {
  const searchText = searchInput.value.toLowerCase(); // Obtient le texte saisi par l'utilisateur en minuscules
  const filteredRecipes = recipes.filter((recipe) => {
    const recipeName = recipe.name.toLowerCase(); // Obtient le nom de la recette en minuscules
    return recipeName.includes(searchText); // Vérifie si le nom de la recette contient le texte saisi par l'utilisateur
  });

  displayFilteredRecipes(filteredRecipes); // Affiche les recettes filtrées
}

function displayFilteredRecipes(filteredRecipes) {
  const recipeContainer = document.getElementById('recipeContainer');
  recipeContainer.innerHTML = ''; // Efface le contenu précédent du conteneur de recettes

  filteredRecipes.forEach((recipe) => {
    const recipeModel = recipeFactory(recipe);
    const recipeCardDom = recipeModel.getRecipeCardDom();
    recipeContainer.appendChild(recipeCardDom);
  });
}


displayRecipe(); // Affiche les recettes au chargement de la page
