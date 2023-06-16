function recipeFactory(data) {
    const { id, image , name, servings, ingredients, time, description, appliance, ustensils} = data;

    const picture = `assets/images/recettes/${image}`;

    function getRecipeCardDom() {
        const card = document.createElement('div');
        card.classList.add('card');

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img-card');

        const img = document.createElement('img');
        img.classList.add('card-img-top');
        img.setAttribute('src', picture); 
        img.setAttribute('alt', name);

        const timeBadge = document.createElement('h6');
        const spanBadge = document.createElement('span');
        spanBadge.classList.add('badge');
        spanBadge.classList.add('bg-warning');

        spanBadge.innerHTML = time;
        timeBadge.appendChild(spanBadge);
        imgContainer.appendChild(timeBadge);
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        const nameRecipe = document.createElement('h2');
        nameRecipe.innerHTML = name;
        cardBody.appendChild(nameRecipe);
        const pRecipe = document.createElement('p');
        pRecipe.classList.add('p');
        pRecipe.innerHTML = 'recette';
        cardBody.appendChild(pRecipe);
        const pPreparation = document.createElement('p');
        pPreparation.classList.add('card-text');
        pPreparation.innerHTML = description;
        cardBody.appendChild(pPreparation);
        const pIngredient = document.createElement('p');
        pIngredient.classList.add('p');
        pIngredient.innerHTML = 'ingredient';
        cardBody.appendChild(pIngredient);
        const ingredientContainer = document.createElement('div');
        ingredientContainer.classList.add('row');
// Créer un élément <ul> pour la liste des ingrédients
const ingredientList = document.createElement('ul');
ingredientList.classList.add('ingredients-list');

// Parcourir les ingrédients de la recette
ingredients.forEach((ingredient) => {
  const { ingredient: name, quantity, unit = '' } = ingredient;

  // Créer un élément <li> pour chaque ingrédient
  const ingredientItem = document.createElement('li');
  ingredientItem.innerHTML = `${name}: ${quantity} ${unit}`;

  // Ajouter l'élément <li> à la liste des ingrédients
  ingredientList.appendChild(ingredientItem);
});

// Ajouter la liste des ingrédients à l'élément container
ingredientContainer.appendChild(ingredientList);


        const ingredient = document.createElement('p');
        card.appendChild(cardBody);
        // card.appendChild(nameRecipe);
        // card.appendChild(pRecipe);
        // card.appendChild(pPreparation);
        // card.appendChild(pIngredient);
        card.appendChild(ingredientContainer);
        card.appendChild(ingredient);
        return card;

    }
    return { id, image , name, servings, ingredients, time, description, appliance, ustensils, getRecipeCardDom };
}