export function buildStatsList(stats: string[]): HTMLUListElement {
  const ul = document.createElement('ul');
  for (const text of stats) {
    const li = document.createElement('li');
    li.textContent = text;
    ul.append(li);
  }
  return ul;
}
