form.addEventListener('submit', async evt => {
  evt.preventDefault();
  const termo = input.value;
  // 1) Monta a URL da API
  const url = `/api/search?q=${encodeURIComponent(termo)}`;
  // 2) Pega o token do usuário (se estiver usando JWT ou sessão)
  const token = localStorage.getItem('token');
  // 3) Chama o back‑end
  const resp = await fetch(url, {
    headers: { Authorization: 'Bearer ' + token }
  });
  const dados = await resp.json();
  // 4) Renderiza na página
  resultadosContainer.innerHTML = dados
    .map(item => `<li>${item.name}</li>`)
    .join('');
});