function recipeFactory(data) {
  // Extraire les propriétés de données
  const {
    id,
    image,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
  } = data;
  // Chemin vers l'image de la recette
  const picture = `assets/images/recettes/${image}`;
  // Méthode pour obtenir le DOM de la carte de recette
  function getRecipeCardDom() {
    // Créer un élément "article" pour la carte de recette
    const card = document.createElement("article");
    card.classList.add("card");
    // Créer un conteneur pour l'image
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-card");
    // Créer l'élément image avec des attributs src et alt
    const img = document.createElement("img");
    img.classList.add("card-img-top");
    img.setAttribute("src", picture);
    img.setAttribute("alt", name);
    // Créer un badge pour le temps de préparation
    const timeBadge = document.createElement("h6");
    const spanBadge = document.createElement("span");
    spanBadge.classList.add("badge");
    spanBadge.classList.add("bg-warning");
    // Ajouter le badge de temps et l'image à imgContainer
    spanBadge.innerHTML = `${time}min`;
    timeBadge.appendChild(spanBadge);
    imgContainer.appendChild(timeBadge);
    imgContainer.appendChild(img);
    card.appendChild(imgContainer);
    // Créer le corps de la carte
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Créer le nom de la recette
    const nameRecipe = document.createElement("h2");
    nameRecipe.classList.add("name-recipe");
    nameRecipe.innerHTML = name;
    cardBody.appendChild(nameRecipe);
    // Créer le texte "recette" (non explicite ici)
    const pRecipe = document.createElement("p");
    pRecipe.classList.add("p");
    pRecipe.innerHTML = "recette";
    cardBody.appendChild(pRecipe);
    // Créer la description de la recette
    const pPreparation = document.createElement("p");
    pPreparation.classList.add("card-text");
    const maxLength = 202;
    const trimedDescription =
      description.length > maxLength
        ? description.substring(0, maxLength) + "..."
        : description;
    pPreparation.innerHTML = trimedDescription;
    cardBody.appendChild(pPreparation);
    // Créer le texte "ingrédients" (non explicite ici)
    const pIngredient = document.createElement("p");
    pIngredient.classList.add("p");
    pIngredient.innerHTML = "ingredients";
    cardBody.appendChild(pIngredient);
    // Créer un conteneur pour les ingrédients
    const ingredientContainer = document.createElement("div");
    ingredientContainer.classList.add("row");
    const ingredientList = document.createElement("div");
    ingredientList.classList.add("ingredients-list");
    // Parcourir les ingrédients et les ajouter à ingredientList
    ingredients.forEach((ingredient) => {
      const { ingredient: name, quantity, unit = "" } = ingredient;
      const formattedQuantity =
        quantity !== undefined ? `${quantity} ${unit}` : "-";
      const ingredientItem = document.createElement("div");
      ingredientItem.classList.add("ingredient-item");
      ingredientItem.innerHTML = `<p class="p-ingredient-name">${name}</p><p class="p-ingredient-quantity">${formattedQuantity}</p>`;
      ingredientList.appendChild(ingredientItem);
    });
    // Ajouter ingredientList au conteneur des ingrédients
    ingredientContainer.appendChild(ingredientList);
    // Ajouter ingredientContainer au corps de la carte
    cardBody.appendChild(ingredientContainer);
    card.appendChild(cardBody);
    // Retourner l'élément complet de la carte de recette
    return card;
  }
  // Retourner un objet contenant toutes les propriétés de données et la méthode getRecipeCardDom
  return {
    id,
    image,
    name,
    servings,
    ingredients,
    time,
    description,
    appliance,
    ustensils,
    getRecipeCardDom,
  };
}