# 🌿 Weekly Meal Planner
(co-written with Claude)

A healthy simple quick-cook meal planner. Build your week from a recipe bank, then generate a shopping list.

**Live demo**: once deployed, your URL will be `https://yourusername.github.io/meal-planner`

---

## Files

```
meal-planner/
├── index.html      ← entry point, loads everything
├── app.js          ← the app
├── recipes.csv     ← your recipe bank — edit this!
└── README.md
```

---

## Deploying to GitHub Pages

1. **Create a new GitHub repo** — call it `meal-planner` (or anything you like)

2. **Upload all four files** — drag and drop them into the repo on github.com, or use git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/meal-planner.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repo on GitHub
   - Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: **main** / **(root)**
   - Click Save

4. **Wait ~60 seconds**, then visit `https://yourusername.github.io/meal-planner`

---

## Running locally

Just run a Python server in the folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`

---

## Adding or editing recipes

Open `recipes.csv` in Excel, Numbers, or any text editor. One row per recipe.

| Column | What it means |
|--------|---------------|
| `type` | `breakfast`, `lunch`, `dinner`, or `pudding` |
| `id` | Unique ID — e.g. `d12`, `b6` |
| `name` | Recipe name shown in the app |
| `weekend_only` | `true` or `false` (currently unused — all meals show every day) |
| `desc` | Short description shown when browsing |
| `ingredients` | Ingredients separated by `\|` — e.g. `Eggs\|Spinach\|Olive oil` |

### Example new row
```
dinner,d12,My New Recipe,false,"Butter beans + garlic + lemon. 10 mins.","Tinned butter beans|Garlic|Lemon|Olive oil"
```

After editing, just push to GitHub — Pages updates automatically within a minute or two.

---

## Adding a new ingredient category to the shopping list

In `app.js`, find the `CATEGORIES` object near the top and add your ingredient to the relevant list, or create a new category:

```js
"🆕 My New Category": ["my ingredient", "another ingredient"],
```

Ingredient matching is case-insensitive.
