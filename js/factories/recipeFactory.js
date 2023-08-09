function recipeFactory(data) {
    const { id, image , name, servings, ingredients, time, description, appliance, ustensils} = data;
    const picture = `assets/images/recettes/${image}`;
    function getRecipeCardDom() {
        const card = document.createElement('article');
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

        spanBadge.innerHTML = `${time}min`;
        timeBadge.appendChild(spanBadge);
        imgContainer.appendChild(timeBadge);
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const nameRecipe = document.createElement('h2');
        nameRecipe.classList.add('name-recipe');
        nameRecipe.innerHTML = name;
        cardBody.appendChild(nameRecipe);

        const pRecipe = document.createElement('p');
        pRecipe.classList.add('p');
        pRecipe.innerHTML = 'recette';
        cardBody.appendChild(pRecipe);

        const pPreparation = document.createElement('p');
        pPreparation.classList.add('card-text');
        const maxLength = 202;
        const trimedDescription = description.length > maxLength ? description.substring(0, maxLength) + "..." : description;
        pPreparation.innerHTML = trimedDescription;
        cardBody.appendChild(pPreparation);

        const pIngredient = document.createElement('p');
        pIngredient.classList.add('p');
        pIngredient.innerHTML = 'ingredients';
        cardBody.appendChild(pIngredient);

        const ingredientContainer = document.createElement('div');
        ingredientContainer.classList.add('row');
        const ingredientList = document.createElement('div');
        ingredientList.classList.add('ingredients-list');   
        ingredients.forEach((ingredient) => {
          const { ingredient: name, quantity, unit = '' } = ingredient;
          const formattedQuantity = quantity !== undefined ? `${quantity} ${unit}` : '-';
          const ingredientItem = document.createElement('div');
          ingredientItem.classList.add('ingredient-item');
          ingredientItem.innerHTML = `<p class="p-ingredient-name">${name}</p><p class="p-ingredient-quantity">${formattedQuantity}</p>`;
          ingredientList.appendChild(ingredientItem);
        });
        ingredientContainer.appendChild(ingredientList);

        cardBody.appendChild(ingredientContainer);
        card.appendChild(cardBody);
        return card;
    }
    return { id, image , name, servings, ingredients, time, description, appliance, ustensils, getRecipeCardDom };
}