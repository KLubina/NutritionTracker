export const ExportService = {
  exportHistoryToCsv(history) {
    if (history.length === 0) {
      alert("Keine Daten zum Exportieren vorhanden!");
      return;
    }

    const csvContent = this._generateCsv(history);
    this._downloadCsv(csvContent);
  },

  // --- Helpers ---

  _generateCsv(history) {
    const csvHeader = "Datum,Uhrzeit,Gericht\n";
    const csvData = this._formatHistoryData(history);
    return csvHeader + csvData;
  },

  _formatHistoryData(history) {
    return history
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((item) => this._formatCsvRow(item))
      .join("\n");
  },

  _formatCsvRow(item) {
    const date = new Date(item.timestamp).toLocaleDateString("de-DE");
    const time = item.time;
    const food = `"${item.food.replace(/"/g, '""')}"`;
    return `${date},${time},${food}`;
  },

  _downloadCsv(csvContent) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      this._triggerDownload(link, blob);
    }
  },

  _triggerDownload(link, blob) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `essen-tracker-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
