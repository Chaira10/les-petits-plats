function getReceipe() {
    try {
        const data = recipes
        return data;
    

      } catch (error) {
        console.error(error);
      }
}
const recipeCards = [];
async function displayRecipe() {
    const recipesData = getReceipe();
    console.log(recipesData);

    const recipeContainer = document.getElementById('recipeContainer');

    recipesData.forEach((recipe) => {
        console.log(recipe);
        const recipeModel = recipeFactory(recipe);
        console.log(recipeModel);
        const recipeCardDom = recipeModel.getRecipeCardDom();
        console.log(recipeCardDom);
        recipeCards.push(recipeCardDom);
        recipeContainer.appendChild(recipeCardDom);
    });
}
displayRecipe();