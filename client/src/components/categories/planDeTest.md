## Test 1: Rendu correct des éléments de catégorie

# Given:
Un ensemble de catégories

# When:
Le composant "Categories" est rendu avec les catégories fournies

# Then:
Chaque élément de catégorie est rendu correctement
Chaque élément de catégorie affiche le nom de la catégorie correspondante

## Test 2: Rendu correct des images de catégorie

# Given:
Un ensemble de catégories

# When:
Le composant "Categories" est rendu avec les catégories fournies

# Then:
Chaque élément de catégorie contient une image
Le nombre d'images correspond au nombre de catégories fournies

## Test 3: Rendu correct des liens pour les catégories

Given:
Un ensemble de catégories

When:
Le composant "Categories" est rendu avec les catégories fournies

Then:
Chaque élément de catégorie contient un lien
L'URL de chaque lien correspond à l'URL attendue pour la catégorie correspondante