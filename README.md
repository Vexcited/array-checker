# array-checker
Outil web permettant de vérifier des égalités entre des `modèles` et des `listes`. <br>
[Accéder à l'outil ici !](https://vexcited.github.io/array-checker)

## Explications
`Liste(s)` => À comparer <br>
`Modèle(s)` => Comparant(s)

# Filtres

## Affichage

```
eg.: (avec addition)
[1] Contient X correspondances;
[2] Contient Y correspondances; ...

eg.: (avec chaque modèle)
[1][M1] Contient X correspondances
   [M2] Contient A correspondances;
[2][M1] Contient Y correspondances
   [M2] Contient B correspondances; ...
```

## Découpage
Permet de découper les modèles et les listes à partir de la []ème valeur.
```
eg.: découpage à la 3ème valeur;

eg.: (avec le filtre affichage => addition)
[1] Contient, entre 1 et 3, X correspondances
    Contient, entre 3 et 4, Y correspondances; ...

eg.: (avec le filtre affichage => chaque modèle)
[1][M1] Contient, entre 1 et 3, X correspondances
        Contient, entre 3 et 4, A correspondances; ...
   [M2] Contient, entre 1 et 3, Y correspondances
        Contient, entre 3 et 4, B correspondances; ...
```

