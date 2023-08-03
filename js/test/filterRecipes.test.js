// Exemple de bloc de configuration pour tester filterRecipes()
const data = [
    {
        "id": 1,
        "image": "Recette01.jpg",
        "name" : "Limonade de Coco",
        "servings" : 1,
        "ingredients": [
            {
                "ingredient" : "Lait de coco",
                "quantity" : 400,
                "unit" : "ml"
            },
            {
                "ingredient" : "Jus de citron",
                "quantity" : 2
            },
            {
                "ingredient" : "Crème de coco",
                "quantity" : 2,
                "unit" : "cuillères à soupe"
            },
            {
                "ingredient" : "Sucre",
                "quantity" : 30,
                "unit" : "grammes"
            },
            {
                "ingredient": "Glaçons",
                "quantity" : 2,
                "unit" : ""
                
            }
        ],
        "time": 10,
        "description": "Mettre les glaçons à votre goût dans le blender, ajouter le lait, la crème de coco, le jus de 2 citrons et le sucre. Mixer jusqu'à avoir la consistence désirée",
        "appliance": "Blender",
        "ustensils": ["cuillère à Soupe", "verres", "presse citron" ]
    },
    {
        "id": 2,
        "image": "Recette02.jpg",
        "name" : "Poisson Cru à la tahitienne",
        "servings": 2,
        "ingredients": [
            {
                "ingredient" : "Thon Rouge (ou blanc)",
                "quantity" : 200,
                "unit" : "grammes"
            },
            {
                "ingredient" : "Concombre",
                "quantity" : 1
            },
            {
                "ingredient" : "Tomate",
                "quantity" : 2
            },
            {
                "ingredient" : "Carotte",
                "quantity" : 1
            },
            {
                "ingredient" : "Citron Vert",
                "quantity" : 5
            },
            {
                "ingredient" : "Lait de Coco",
                "quantity" : 100,
                "unit" : "ml"
            }
        ],
        "time": 60,
        "description": "Découper le thon en dés, mettre dans un plat et recouvrir de jus de citron vert (mieux vaut prendre un plat large et peu profond). Laisser reposer au réfrigérateur au moins 2 heures. (Si possible faites-le le soir pour le lendemain. Après avoir laissé mariner le poisson, coupez le concombre en fines rondelles sans la peau et les tomates en prenant soin de retirer les pépins. Rayer la carotte. Ajouter les légumes au poissons avec le citron cette fois ci dans un Saladier. Ajouter le lait de coco. Pour ajouter un peu plus de saveur vous pouvez ajouter 1 à 2 cuillères à soupe de Crème de coco",
        "appliance": "Saladier",
        "ustensils": ["presse citron"]
    },{
        "id": 3,
        "image": "Recette03.jpg",
        "name": "Poulet coco réunionnais",
        "servings": 4,
        "ingredients": [
            {
                "ingredient": "Poulet",
                "quantity" : 1          
            },
            {
                "ingredient": "Lait de coco",
                "quantity" : 400,
                "unit" : "ml"
            },
            {
                "ingredient": "Coulis de tomate",
                "quantity" : 25,
                "unit" : "cl"
            },
            {
                "ingredient": "Oignon",
                "quantity" : 1
            },
            {
                "ingredient": "Poivron rouge",
                "quantity": 1
            },
            {
                "ingredient": "Huile d'olive",
                "quantity": 1,
               "unit": "cuillères à soupe"
            }
        ],
        "time": 80,
        "description": "Découper le poulet en morceaux, les faire dorer dans une cocotte avec de l'huile d'olive. Salez et poivrez. Une fois doré, laisser cuire en ajoutant de l'eau. Au bout de 30 minutes, ajouter le coulis de tomate, le lait de coco ainsi que le poivron et l'oignon découpés en morceaux. Laisser cuisiner 30 minutes de plus. Servir avec du riz",
        "appliance": "Cocotte",
        "ustensils": ["couteau"]
    },{
        "id": 4,
        "image": "Recette04.jpg",
        "name": "Salade de riz",
        "servings": 4,
        "ingredients":[
            {
                "ingredient": "Riz blanc",
                "quantity": 500,
                "unit": "grammes"
            },
            {
                "ingredient": "Thon en miettes",
                "quantity": 200,
                "unit": "grammes"
            },{
                "ingredient": "Tomate",
                "quantity": 2
            },
            {
                "ingredient": "Oeuf dur",
                "quantity": 2
            },
            {
                "ingredient": "Maïs",
                "quantity": 300,
                "unit": "grammes"
            },
            {
                "ingredient": "Vinaigrette",
                "quantity": 5,
                "unit": "cl"
            }
        ],
        "time": 50,
        "description": "Faire cuire le riz. Une fois le riz cuit, le laisser refroidir. Couper les oeufs dur en quarts ou en lamelle au choix, coupez le tomates en dés, ajouter au riz les oeufs, les tomates, le poisson, le maïs et la vinaigrette. Ajouter au gout de chacun des corniches, olives etc..",
        "appliance": "Cuiseur de riz",
        "ustensils": ["saladier", "passoire"]
    },
  ];
  
  const recipes = data; // Assigner le jeu de données à la variable recipes (simulant la source de données)
  
  function getRecipe() {
    return recipes; // Cette fonction retourne le jeu de données simulé (recipes)
  }
  function normalizeString(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  // Fonction pour filtrer les recettes en fonction des badges sélectionnés
  function filterBySelectedItems(recipesData, selectedItems) {
    const filteredRecipes = recipesData.filter((recipe) => {
      return selectedItems.every((item) => {
        const normalizedItem = normalizeString(item.toLowerCase());
        return (
          normalizeString(recipe.name.toLowerCase()).includes(normalizedItem) ||
          recipe.ingredients.some((ingredient) =>
            normalizeString(ingredient.ingredient.toLowerCase()).includes(
              normalizedItem
            )
          ) ||
          normalizeString(recipe.description.toLowerCase()).includes(
            normalizedItem
          ) ||
          normalizeString(recipe.appliance.toLowerCase()).includes(
            normalizedItem
          ) ||
          recipe.ustensils.some((ustensil) =>
            normalizeString(ustensil.toLowerCase()).includes(normalizedItem)
          )
        );
      });
    });
  }
  function updateIngredientsDropdown(filteredRecipes) {
    const ingredientsSet = new Set();
    filteredRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const ingredientName = normalizeString(
          ingredient.ingredient.toLowerCase()
        );
        ingredientsSet.add(ingredientName);
      });
    });
    // console.log("Ingredients Set:", ingredientsSet);
    const ingredientsList = ingredientsDropdown.querySelectorAll("li");
    ingredientsList.forEach((item) => {
      const ingredient = item.textContent.toLowerCase();
      // console.log("Current Ingredient:", ingredient);
      if (ingredientsSet.has(ingredient)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }
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
  
    const applianceList = appareilsDropdown.querySelectorAll("li");
  
    applianceList.forEach((item) => {
      const appliance = item.textContent.toLowerCase();
      if (applianceSet.has(appliance)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }
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
  
    const ustensilsList = ustensilsDropdown.querySelectorAll("li");
  
    ustensilsList.forEach((item) => {
      const ustensil = item.textContent.toLowerCase();
      if (ustensilsSet.has(ustensil)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }
  function filterRecipes() {
    const searchText = normalizeString(searchInput.value.toLowerCase());
    const selectedBadges = selectedItemsContainer.querySelectorAll(".tag");
    const selectedItems = Array.from(selectedBadges).map(
      (badge) => badge.textContent
    );
  
    const recipesData = getRecipe();
    let filteredRecipes = recipesData;
  
    if (searchText.length >= 3) {
      filteredRecipes = recipesData.filter((recipe) => {
        const recipeName = normalizeString(recipe.name.toLowerCase());
        const ingredientMatch = recipe.ingredients.some((ingredient) => {
          const ingredientName = normalizeString(
            ingredient.ingredient.toLowerCase()
          );
          return ingredientName.includes(searchText);
        });
        const descriptionMatch = normalizeString(
          recipe.description.toLowerCase()
        ).includes(searchText);
        const applianceMatch = normalizeString(
          recipe.appliance.toLowerCase()
        ).includes(searchText);
        const ustensilsMatch = recipe.ustensils.some((ustensil) => {
          const ustensilName = normalizeString(ustensil.toLowerCase());
          return ustensilName.includes(searchText);
        });
  
        return (
          recipeName.includes(searchText) ||
          ingredientMatch ||
          descriptionMatch ||
          applianceMatch ||
          ustensilsMatch
        );
      });
    }
  
    if (selectedItemsContainer.children.length > 0) {
      const selectedItems = Array.from(
        selectedItemsContainer.querySelectorAll(".tag")
      ).map((badge) => normalizeString(badge.textContent.toLowerCase()));
  
      filteredRecipes = filterBySelectedItems(filteredRecipes, selectedItems);
    }
  
    displayFilteredRecipes(filteredRecipes);
    updateIngredientsDropdown(filteredRecipes);
    updateApplianceDropdown(filteredRecipes);
    updateUstensilsDropdown(filteredRecipes);
    // Appeler la fonction pour obtenir le nombre de recettes affichées
    const displayedRecipesCount = filteredRecipes.length;
    const textBanner = document.querySelector(".text-filter");
    const bannerText = ` ${displayedRecipesCount} recettes`;
    textBanner.innerHTML = bannerText;
    // console.log('Nombre de recettes affichées :', displayedRecipesCount);
  }
  
  