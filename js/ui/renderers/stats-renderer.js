export const StatsRenderHelpers = {
  renderStats(history) {
    const topFoodsContainer = document.getElementById("topFoods");
    if (!topFoodsContainer) return;

    const sortedFoods = this._calculateTopFoods(history);

    if (sortedFoods.length === 0) {
      this._renderEmptyState(topFoodsContainer);
    } else {
      this._renderFoodList(topFoodsContainer, sortedFoods);
    }
  },

  // #region Helpers

  _calculateTopFoods(history) {
    const foodCounts = {};
    history.forEach((item) => {
      foodCounts[item.food] = (foodCounts[item.food] || 0) + 1;
    });

    return Object.entries(foodCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  },

  _renderEmptyState(container) {
    container.innerHTML = `
      <div class="empty-state">
          <p>Noch keine Daten vorhanden</p>
      </div>`;
  },

  _renderFoodList(container, sortedFoods) {
    container.innerHTML = sortedFoods
      .map(([food, count], index) =>
        this._createStatItemHtml(index, food, count),
      )
      .join("");
  },

  _createStatItemHtml(index, food, count) {
    return `
      <div class="history-item">
          <div class="history-content">
              <div class="history-food">${index + 1}. ${food}</div>
              <div class="history-time">${count}x gegessen</div>
          </div>
      </div>`;
  },
  // #endregion
};
