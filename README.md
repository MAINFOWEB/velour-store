# VELOUR — Loja de Moda

> Loja virtual de roupas com seções feminina e masculina, carrinho de compras e painel administrativo. Desenvolvida em HTML, CSS e JavaScript puro, sem frameworks ou dependências externas.

---

## 📸 Visão Geral

O projeto é uma loja virtual completa e funcional que roda diretamente no navegador, usando `localStorage` para persistência de dados. Ideal para lojas pequenas que precisam de uma vitrine online simples e elegante.

---

## ✨ Funcionalidades

### 🛍️ Loja
- Página inicial com hero, banner de gênero e produtos em destaque
- **Seção Feminina** com hero próprio e filtros por categoria
- **Seção Masculina** com hero próprio e filtros por categoria
- Coleção geral com abas: Todos / Feminino / Masculino / Unissex
- Cards de produto com imagem, badge de promoção e tag de gênero
- Controle de estoque (disponível / últimas unidades / esgotado)

### 🛒 Carrinho
- Adicionar, remover e ajustar quantidade de produtos
- Cálculo automático de frete grátis acima de R$ 299
- Miniatura da imagem do produto no carrinho

### 💳 Pagamento
- **PIX** — exibe chave, QR code simulado e confirmação
- **Cartão de crédito** — formulário com máscara de número e validade
- **Boleto bancário** — geração de código simulado

### 🔧 Painel Admin
- Login com autenticação via `sessionStorage`
- Cadastro e edição de produtos
- Upload de imagem por arquivo ou URL
- Configuração da chave PIX e nome do recebedor
- Tabela de produtos com ações de editar e excluir

---

## 🗂️ Estrutura de Arquivos

```
velour/
├── index.html   # Estrutura HTML e páginas
├── style.css    # Estilização completa
└── script.js    # Lógica, dados e interações
```
---

## 🎨 Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura e semântica |
| CSS3 | Layout, animações e responsividade |
| JavaScript (ES6+) | Lógica, estado e persistência |
| localStorage / sessionStorage | Banco de dados e sessão no navegador |
| Google Fonts | Tipografia (Cormorant Garamond + Montserrat) |

---

## 📦 Dados e Persistência

Todos os dados são armazenados no `localStorage` do navegador:

| Chave | Conteúdo |
|---|---|
| `velour_produtos` | Catálogo de produtos |
| `velour_carrinho` | Itens no carrinho |
| `velour_auth` | Credenciais do admin |
| `velour_config` | Configuração PIX |
| `velour_session` | Sessão do admin |

> Os dados persistem entre sessões no mesmo navegador. Para resetar, limpe o `localStorage` pelo DevTools (`Application → Local Storage → Clear`).

---

## 🖼️ Imagens dos Produtos

No painel admin, cada produto aceita:
- **Upload de arquivo** — imagem convertida para base64 e salva localmente (recomendado até 2MB)
- **URL externa** — link direto de qualquer imagem na web

Se nenhuma imagem for fornecida, o produto exibe um emoji como ícone de fallback.

---

## 📱 Responsividade

O layout se adapta a diferentes tamanhos de tela:
- **Desktop** — grid de 4 colunas, sidebar no admin e carrinho
- **Tablet** — grid reduzido, banner de gênero em coluna única
- **Mobile** — navegação simplificada, layout em coluna única

---

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit suas alterações: `git commit -m 'feat: minha feature'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
