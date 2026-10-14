import { MenuItem } from '../data/menu';

/**
 * Normalizes a word by removing accents, special characters, and converting to lower case.
 */
function normalizeFirstWord(str: string): string {
  if (!str) return '';
  const firstToken = str.trim().split(/\s+/)[0] || '';
  return firstToken
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Calculates similarity between the current dish and all other dishes:
 * +3 if it has the same first word in its name (ignore case and accents)
 * +1 if same category
 * - (price difference / 100)
 * Returns the top N similar dishes.
 */
export function getSimilarDishes(currentDish: MenuItem, allDishes: MenuItem[], limit: number = 6): MenuItem[] {
  const currentFirstWord = normalizeFirstWord(currentDish.nameFr);

  const scored = allDishes
    .filter((dish) => dish.id !== currentDish.id)
    .map((dish) => {
      let score = 0;
      const otherFirstWord = normalizeFirstWord(dish.nameFr);

      // +3 if it has the same first word in its name (ignore case and accents)
      if (currentFirstWord && currentFirstWord === otherFirstWord) {
        score += 3;
      }

      // +1 if same category
      if (dish.category === currentDish.category) {
        score += 1;
      }

      // - (price difference / 100)
      const priceDiff = Math.abs(currentDish.price - dish.price);
      score -= priceDiff / 100;

      return { dish, score };
    });

  // Sort descending by similarity score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => item.dish);
}
