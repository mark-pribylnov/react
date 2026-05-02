/**
 * Puts the stats `<ul>` into the results table.
 * If the placeholder row is still present, it is filled in; otherwise a new row is appended.
 */
export function pasteStatsListIntoTable(
  tbody: HTMLTableSectionElement,
  statsList: HTMLUListElement,
  pokemonName: string
): void {
  const placeholderRow = tbody.querySelector('tr[data-placeholder="true"]');

  if (placeholderRow) {
    const row = placeholderRow as HTMLTableRowElement;
    const nameCell = row.cells[0];
    const statsCell = row.cells[1];
    if (nameCell && statsCell) {
      nameCell.textContent = pokemonName;
      statsCell.replaceChildren(statsList);
      placeholderRow.removeAttribute('data-placeholder');
    }
    return;
  }

  const row = document.createElement('tr');
  const nameTd = document.createElement('td');
  nameTd.textContent = pokemonName;
  const statsTd = document.createElement('td');
  statsTd.appendChild(statsList);
  row.append(nameTd, statsTd);
  tbody.append(row);
}
