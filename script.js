// ════════════════════════════════════
//  VELOUR — script.js
// ════════════════════════════════════

const DB_KEY      = 'velour_produtos';
const CART_KEY    = 'velour_carrinho';
const AUTH_KEY    = 'velour_auth';
const CFG_KEY     = 'velour_config';
const SESSION_KEY = 'velour_session';

// ── STORAGE ──
function getDB()    { try { return JSON.parse(localStorage.getItem(DB_KEY))   || []; } catch { return []; } }
function saveDB(d)  { localStorage.setItem(DB_KEY, JSON.stringify(d)); }
function getCart()  { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); }
function getConfig(){ try { return JSON.parse(localStorage.getItem(CFG_KEY))  || {}; } catch { return {}; } }
function saveConfig(c){ localStorage.setItem(CFG_KEY, JSON.stringify(c)); }
function getAuth()  { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; } }
function isLoggedIn(){ return sessionStorage.getItem(SESSION_KEY) === '1'; }
function uid()      { return Date.now().toString(36) + Math.random().toString(36).substr(2,5); }

// ── SEED DATA ──
function seedDB() {
  if (getDB().length > 0) return;
  const prods = [
    // Feminino
    { id:uid(), nome:'Vestido Midi Floral',     genero:'Feminino',  categoria:'Vestidos',   preco:189.90, precoAntigo:249.90, estoque:8,  emoji:'👗', imagem:'', desc:'Vestido midi com estampa floral delicada, perfeito para dias quentes.', destaque:true },
    { id:uid(), nome:'Blusa Linho Premium',      genero:'Feminino',  categoria:'Blusas',     preco:129.00, precoAntigo:null,   estoque:15, emoji:'👚', imagem:'', desc:'Blusa em linho natural com caimento impecável.', destaque:true },
    { id:uid(), nome:'Calça Palazzo Camel',      genero:'Feminino',  categoria:'Calças',     preco:219.00, precoAntigo:280.00, estoque:5,  emoji:'👖', imagem:'', desc:'Calça palazzo de alfaiataria na tendência camel da temporada.', destaque:true },
    { id:uid(), nome:'Saia Midi Plissada',       genero:'Feminino',  categoria:'Saias',      preco:159.90, precoAntigo:210.00, estoque:12, emoji:'👗', imagem:'', desc:'Saia midi plissada com movimento elegante.', destaque:false },
    { id:uid(), nome:'Conjunto Linho Rosa',      genero:'Feminino',  categoria:'Conjuntos',  preco:299.00, precoAntigo:null,   estoque:7,  emoji:'🩱', imagem:'', desc:'Conjunto de calça e blusa em linho rose.', destaque:false },
    { id:uid(), nome:'Blusa Cropped Canelada',   genero:'Feminino',  categoria:'Blusas',     preco:89.90,  precoAntigo:null,   estoque:0,  emoji:'👚', imagem:'', desc:'Blusa cropped em tecido canelado, básica e versátil.', destaque:false },
    // Masculino
    { id:uid(), nome:'Camisa Social Slim',       genero:'Masculino', categoria:'Camisas',    preco:179.00, precoAntigo:220.00, estoque:10, emoji:'👔', imagem:'', desc:'Camisa social slim fit em algodão premium, perfeita para ocasiões formais e casuais.', destaque:true },
    { id:uid(), nome:'Calça Chino Bege',         genero:'Masculino', categoria:'Calças',     preco:189.00, precoAntigo:null,   estoque:8,  emoji:'👖', imagem:'', desc:'Calça chino em tecido leve com corte moderno.', destaque:true },
    { id:uid(), nome:'Blazer Estruturado',       genero:'Masculino', categoria:'Blazers',    preco:489.00, precoAntigo:580.00, estoque:4,  emoji:'🧥', imagem:'', desc:'Blazer estruturado em lã italiana, ideal para looks sofisticados.', destaque:true },
    { id:uid(), nome:'Polo Piquê Premium',       genero:'Masculino', categoria:'Polos',      preco:149.00, precoAntigo:null,   estoque:14, emoji:'👕', imagem:'', desc:'Polo em piquê de algodão com bordado sutil no peito.', destaque:false },
    { id:uid(), nome:'Bermuda Linho Azul',       genero:'Masculino', categoria:'Bermudas',   preco:139.00, precoAntigo:170.00, estoque:6,  emoji:'🩲', imagem:'', desc:'Bermuda em linho com bolsos laterais e cadarço ajustável.', destaque:false },
    // Acessórios (Unissex)
    { id:uid(), nome:'Casaco Trench Clássico',   genero:'Unissex',   categoria:'Casacos',    preco:459.00, precoAntigo:null,   estoque:3,  emoji:'🧥', imagem:'', desc:'Trench coat atemporal que eleva qualquer look.', destaque:true },
    { id:uid(), nome:'Bolsa Tote Couro',         genero:'Unissex',   categoria:'Acessórios', preco:349.00, precoAntigo:420.00, estoque:4,  emoji:'👜', imagem:'', desc:'Bolsa tote em couro legítimo com forro interno.', destaque:false },
  ];
  saveDB(prods);
}

function ensureAuth() {
  if (!getAuth()) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user:'admin', pass:'velour2025' }));
  }
}

// ════════════════════════════════════
//  NAVIGATION
// ════════════════════════════════════

let activeGenderTab = 'Todos'; // para a loja

function showPage(name, genderFilter) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  const map = { home:0, feminino:1, masculino:2, loja:3, admin:4 };
  if (map[name] !== undefined) {
    const btns = document.querySelectorAll('nav button');
    if (btns[map[name]]) btns[map[name]].classList.add('active');
  }
  if (name === 'home')      renderHome();
  if (name === 'feminino')  renderGenderPage('Feminino');
  if (name === 'masculino') renderGenderPage('Masculino');
  if (name === 'loja') {
    if (genderFilter) activeGenderTab = genderFilter;
    renderLoja();
  }
  if (name === 'carrinho')  renderCarrinho();
  if (name === 'admin')     renderAdmin();
  updateCartBadge();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goAdmin() {
  if (isLoggedIn()) { showPage('admin'); } else { abrirLogin(); }
}

// ════════════════════════════════════
//  LOGIN
// ════════════════════════════════════

function abrirLogin() {
  document.getElementById('loginOverlay').style.display = 'flex';
  document.getElementById('loginError').textContent = '';
  document.getElementById('loginUser').value = '';
  document.getElementById('loginPass').value = '';
  setTimeout(() => document.getElementById('loginUser').focus(), 100);
}

function fecharLogin() {
  document.getElementById('loginOverlay').style.display = 'none';
}

function fazerLogin() {
  const user = document.getElementById('loginUser').value.trim();
  const pass = document.getElementById('loginPass').value;
  const auth = getAuth();
  if (user === auth.user && pass === auth.pass) {
    sessionStorage.setItem(SESSION_KEY, '1');
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('adminBadge').style.display = 'block';
    showPage('admin');
    toast('Bem-vindo, Admin! 🔓');
  } else {
    document.getElementById('loginError').textContent = '✕ Usuário ou senha incorretos.';
    document.getElementById('loginPass').value = '';
    document.getElementById('loginPass').focus();
  }
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById('adminBadge').style.display = 'none';
  showPage('home');
  toast('Sessão encerrada.');
}

// ════════════════════════════════════
//  HOME
// ════════════════════════════════════

function renderHome() {
  const prods = getDB();
  const cart  = getCart();

  document.getElementById('statsBar').innerHTML = `
    <div class="stat-card">
      <div class="stat-num">${prods.length}</div>
      <div class="stat-label">Produtos</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">${prods.filter(p=>p.genero==='Feminino').length}</div>
      <div class="stat-label">Feminino</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">${prods.filter(p=>p.genero==='Masculino').length}</div>
      <div class="stat-label">Masculino</div>
    </div>
    <div class="stat-card">
      <div class="stat-num">${cart.reduce((s,i)=>s+i.qty,0)}</div>
      <div class="stat-label">Itens no Carrinho</div>
    </div>
  `;

  const featured = prods.filter(p => p.destaque).slice(0, 4);
  document.getElementById('featuredGrid').innerHTML = featured.map(p => productCard(p)).join('');
}

// ════════════════════════════════════
//  SEÇÕES DE GÊNERO
// ════════════════════════════════════

function renderGenderPage(genero) {
  const prods = getDB().filter(p => p.genero === genero || p.genero === 'Unissex');
  const cats  = ['Todas', ...new Set(prods.map(p => p.categoria))];
  const pageId = genero === 'Feminino' ? 'page-feminino' : 'page-masculino';
  const page   = document.getElementById(pageId);
  const accentColor = genero === 'Feminino' ? 'var(--fem)' : 'var(--masc)';

  page.querySelector('.gender-filter-bar').innerHTML = cats.map(c => `
    <button class="filter-btn ${c === activeFemFilter && genero === 'Feminino' ? 'active' : ''} ${c === activeMascFilter && genero === 'Masculino' ? 'active' : ''}"
      onclick="setGenderFilter('${c}','${genero}')">${c}</button>
  `).join('');

  const activeFilter = genero === 'Feminino' ? activeFemFilter : activeMascFilter;
  const filtered = activeFilter === 'Todas' ? prods : prods.filter(p => p.categoria === activeFilter);
  page.querySelector('.gender-product-count').textContent = `${filtered.length} peça${filtered.length !== 1 ? 's' : ''}`;
  page.querySelector('.gender-products-grid').innerHTML = filtered.length
    ? filtered.map(p => productCard(p)).join('')
    : '<p style="color:var(--muted);grid-column:1/-1;padding:40px 0">Nenhum produto nesta categoria.</p>';
}

let activeFemFilter  = 'Todas';
let activeMascFilter = 'Todas';

function setGenderFilter(cat, genero) {
  if (genero === 'Feminino')  activeFemFilter  = cat;
  if (genero === 'Masculino') activeMascFilter = cat;
  renderGenderPage(genero);
}

// ════════════════════════════════════
//  LOJA GERAL
// ════════════════════════════════════

let activeFilter = 'Todos';
let activeLojaCat = 'Todas';

function renderLoja() {
  const allProds = getDB();

  // Gender tabs
  const tabsEl = document.getElementById('lojaTabs');
  tabsEl.innerHTML = `
    <button class="gender-tab ${activeGenderTab === 'Todos' ? 'active' : ''}" onclick="switchLojaTab('Todos')">Todos</button>
    <button class="gender-tab fem ${activeGenderTab === 'Feminino' ? 'active fem' : ''}" onclick="switchLojaTab('Feminino')">♀ Feminino</button>
    <button class="gender-tab masc ${activeGenderTab === 'Masculino' ? 'active masc' : ''}" onclick="switchLojaTab('Masculino')">♂ Masculino</button>
    <button class="gender-tab ${activeGenderTab === 'Unissex' ? 'active' : ''}" onclick="switchLojaTab('Unissex')">Unissex</button>
  `;

  const byGender = activeGenderTab === 'Todos' ? allProds : allProds.filter(p => p.genero === activeGenderTab);
  const cats = ['Todas', ...new Set(byGender.map(p => p.categoria))];

  document.getElementById('filterBar').innerHTML = cats.map(c =>
    `<button class="filter-btn ${c === activeLojaCat ? 'active' : ''}" onclick="setLojaFilter('${c}')">${c}</button>`
  ).join('');

  const filtered = activeLojaCat === 'Todas' ? byGender : byGender.filter(p => p.categoria === activeLojaCat);
  document.getElementById('productCount').textContent = `${filtered.length} peça${filtered.length !== 1 ? 's' : ''}`;
  document.getElementById('productsGrid').innerHTML = filtered.length
    ? filtered.map(p => productCard(p)).join('')
    : '<p style="color:var(--muted);grid-column:1/-1;padding:40px 0">Nenhum produto nesta categoria.</p>';
}

function switchLojaTab(genero) {
  activeGenderTab = genero;
  activeLojaCat   = 'Todas';
  renderLoja();
}

function setLojaFilter(cat) {
  activeLojaCat = cat;
  renderLoja();
}

// ════════════════════════════════════
//  PRODUCT CARD
// ════════════════════════════════════

function productCard(p) {
  const stockClass = p.estoque === 0 ? 'out' : p.estoque <= 3 ? 'low' : 'ok';
  const stockText  = p.estoque === 0 ? '✗ Sem estoque' : p.estoque <= 3 ? `⚠ Apenas ${p.estoque} unid.` : `✓ Em estoque (${p.estoque})`;
  const oldPrice   = p.precoAntigo ? `<span class="old-price">R$ ${p.precoAntigo.toFixed(2)}</span>` : '';
  const badge      = p.precoAntigo ? '<span class="product-badge">Promoção</span>' : '';

  const genderClass = p.genero === 'Feminino' ? 'fem' : p.genero === 'Masculino' ? 'masc' : 'unissex';
  const genderLabel = p.genero === 'Feminino' ? '♀ Feminino' : p.genero === 'Masculino' ? '♂ Masculino' : 'Unissex';
  const genderTag   = `<span class="product-gender-tag ${genderClass}">${genderLabel}</span>`;

  const imgContent = p.imagem
    ? `<img src="${p.imagem}" alt="${p.nome}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'">`
    : '';
  const emojiDisplay = p.imagem ? `<span class="emoji-fallback" style="display:none">${p.emoji}</span>` : `<span class="emoji-fallback">${p.emoji}</span>`;

  return `
    <div class="product-card">
      <div class="product-img">
        ${badge}
        ${genderTag}
        ${imgContent}
        ${emojiDisplay}
      </div>
      <div class="product-info">
        <div class="product-cat">${p.categoria}</div>
        <div class="product-name">${p.nome}</div>
        <div class="product-price">${oldPrice}R$ ${p.preco.toFixed(2)}</div>
        <div class="stock ${stockClass}">${stockText}</div>
        <button class="add-btn" ${p.estoque === 0 ? 'disabled style="opacity:.4;cursor:not-allowed"' : ''} onclick="addToCart('${p.id}')">
          ${p.estoque === 0 ? 'Indisponível' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>`;
}

// ════════════════════════════════════
//  CART
// ════════════════════════════════════

function addToCart(id) {
  const prod = getDB().find(p => p.id === id);
  if (!prod || prod.estoque === 0) return;
  let cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx >= 0) {
    if (cart[idx].qty >= prod.estoque) { toast('Estoque máximo atingido!'); return; }
    cart[idx].qty++;
  } else {
    cart.push({ id:prod.id, nome:prod.nome, preco:prod.preco, emoji:prod.emoji, imagem:prod.imagem||'', qty:1 });
  }
  saveCart(cart);
  updateCartBadge();
  toast(`"${prod.nome}" adicionado! 🛍️`);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
  renderCarrinho();
  updateCartBadge();
}

function changeQty(id, delta) {
  let cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx < 0) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart(cart);
  renderCarrinho();
  updateCartBadge();
}

let selectedPayment = 'pix';

function renderCarrinho() {
  const cart = getCart();
  const el   = document.getElementById('cartContent');

  if (cart.length === 0) {
    el.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛍️</div>
        <h3 style="font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;margin-bottom:10px">Seu carrinho está vazio</h3>
        <p style="color:var(--muted);margin:10px 0 24px">Explore nossa coleção e encontre algo especial.</p>
        <button class="hero-btn" style="font-size:11px;padding:12px 32px" onclick="showPage('loja')">Ver Coleção</button>
      </div>`;
    return;
  }

  const subtotal = cart.reduce((s,i) => s + i.qty * i.preco, 0);
  const frete    = subtotal >= 299 ? 0 : 19.90;
  const total    = subtotal + frete;
  const cfg      = getConfig();
  const pixKey   = cfg.pixKey  || 'velour@loja.com.br';
  const pixName  = cfg.pixName || 'Velour Moda';
  const qrSvg    = gerarQRSimples(pixKey + total.toFixed(2));

  el.innerHTML = `
    <div class="cart-layout">
      <div>
        <div class="section-header" style="margin-bottom:20px">
          <h2 class="section-title">Meu Carrinho</h2>
          <span class="section-subtitle">${cart.length} ite${cart.length > 1 ? 'ns' : 'm'}</span>
        </div>
        <div class="cart-items">
          ${cart.map(item => `
            <div class="cart-item">
              <div class="cart-item-thumb">
                ${item.imagem
                  ? `<img src="${item.imagem}" alt="${item.nome}" onerror="this.style.display='none'">`
                  : item.emoji}
              </div>
              <div>
                <div class="cart-item-name">${item.nome}</div>
                <div class="cart-item-price">R$ ${item.preco.toFixed(2)} / unid.</div>
                <div class="qty-ctrl">
                  <button class="qty-btn" onclick="changeQty('${item.id}',-1)">−</button>
                  <span class="qty-num">${item.qty}</span>
                  <button class="qty-btn" onclick="changeQty('${item.id}',1)">+</button>
                  <span style="color:var(--muted);font-size:12px;margin-left:8px">= R$ ${(item.qty * item.preco).toFixed(2)}</span>
                </div>
              </div>
              <button class="remove-btn" onclick="removeFromCart('${item.id}')" title="Remover">✕</button>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="order-summary">
        <div class="summary-title">Resumo do Pedido</div>
        <div class="summary-row"><span>Subtotal</span><span>R$ ${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Frete</span><span>${frete === 0 ? '🎉 Grátis' : 'R$ ' + frete.toFixed(2)}</span></div>
        ${frete > 0 ? `<div style="font-size:11px;color:var(--rose);margin-bottom:10px;text-align:right">Faltam R$ ${(299 - subtotal).toFixed(2)} para frete grátis</div>` : ''}
        <div class="summary-total"><span>Total</span><span>R$ ${total.toFixed(2)}</span></div>

        <div class="pay-tabs">
          <button class="pay-tab pix-tab ${selectedPayment === 'pix' ? 'active' : ''}" onclick="selectPayment('pix')">
            <span class="pay-icon">💠</span>PIX
          </button>
          <button class="pay-tab ${selectedPayment === 'cartao' ? 'active' : ''}" onclick="selectPayment('cartao')">
            <span class="pay-icon">💳</span>Cartão
          </button>
          <button class="pay-tab ${selectedPayment === 'boleto' ? 'active' : ''}" onclick="selectPayment('boleto')">
            <span class="pay-icon">🧾</span>Boleto
          </button>
        </div>

        <div class="pay-panel ${selectedPayment === 'pix' ? 'active' : ''}">
          <div class="pix-box">
            <div class="pix-logo">💠 Pagamento via PIX</div>
            <div class="pix-qr">${qrSvg}</div>
            <div style="font-size:11px;color:#32bcad;font-weight:600;margin-bottom:12px">R$ ${total.toFixed(2)}</div>
            <div class="pix-key-label">Chave PIX</div>
            <div class="pix-key-box">
              <span class="pix-key">${pixKey}</span>
              <button class="copy-btn" onclick="copiarPix('${pixKey}')">Copiar</button>
            </div>
            <div class="pix-info">
              👤 Favorecido: <strong>${pixName}</strong><br>
              💰 Valor: <strong>R$ ${total.toFixed(2)}</strong><br>
              ⏱ Válido por: <strong>30 minutos</strong>
            </div>
          </div>
          <button class="checkout-btn pix-confirm" onclick="finalizarPix('${total.toFixed(2)}','${pixName}','${pixKey}')">
            ✓ Já Realizei o Pagamento
          </button>
        </div>

        <div class="pay-panel card-panel ${selectedPayment === 'cartao' ? 'active' : ''}">
          <input type="text" placeholder="Nome no cartão" id="cNome" maxlength="40">
          <input type="text" placeholder="0000 0000 0000 0000" id="cNum" maxlength="19" oninput="maskCard(this)">
          <div class="card-row">
            <input type="text" placeholder="MM/AA" id="cVal" maxlength="5" oninput="maskDate(this)">
            <input type="password" placeholder="CVV" id="cCVV" maxlength="4">
          </div>
          <button class="checkout-btn" onclick="finalizarCartao()">Pagar R$ ${total.toFixed(2)}</button>
        </div>

        <div class="pay-panel ${selectedPayment === 'boleto' ? 'active' : ''}">
          <div style="background:var(--cream);border:1px solid var(--border);border-radius:4px;padding:16px;margin-bottom:10px;font-size:12px;line-height:1.9;color:var(--muted)">
            🧾 Um boleto bancário será gerado após confirmação.<br>
            📅 Vencimento: <strong style="color:var(--charcoal)">3 dias úteis</strong><br>
            💰 Valor: <strong style="color:var(--charcoal)">R$ ${total.toFixed(2)}</strong><br>
            ⚠️ Após o pagamento, confirmação em até 2 dias úteis.
          </div>
          <button class="checkout-btn" onclick="finalizarBoleto('${total.toFixed(2)}')">Gerar Boleto</button>
        </div>

        <button onclick="showPage('loja')" style="width:100%;background:none;border:none;cursor:pointer;margin-top:12px;font-size:11px;color:var(--muted);font-family:'Montserrat',sans-serif;letter-spacing:1px;padding:8px">← Continuar Comprando</button>
      </div>
    </div>`;
}

function selectPayment(method) {
  selectedPayment = method;
  renderCarrinho();
}

function copiarPix(chave) {
  navigator.clipboard.writeText(chave)
    .then(() => toast('Chave PIX copiada! 📋'))
    .catch(() => toast('Chave: ' + chave));
}

function maskCard(el) {
  let v = el.value.replace(/\D/g,'').substr(0,16);
  el.value = v.replace(/(.{4})/g,'$1 ').trim();
}

function maskDate(el) {
  let v = el.value.replace(/\D/g,'').substr(0,4);
  if (v.length >= 3) v = v.substr(0,2) + '/' + v.substr(2);
  el.value = v;
}

function finalizarPix(total, nome, chave) {
  const content = document.getElementById('checkoutModalContent');
  content.innerHTML = `
    <div class="modal-emoji">💠</div>
    <h3>Aguardando Confirmação PIX</h3>
    <p>Se ainda não pagou, utilize os dados abaixo:</p>
    <div class="modal-pix-detail">
      👤 Favorecido: <strong>${nome}</strong><br>
      🔑 Chave PIX: <strong>${chave}</strong><br>
      💰 Valor: <strong>R$ ${total}</strong>
    </div>
    <p style="font-size:11px">Após o pagamento, seu pedido será processado automaticamente.</p>
    <div class="modal-btns">
      <button class="modal-btn primary" onclick="confirmarPedido()">Confirmar Pedido</button>
      <button class="modal-btn secondary" onclick="closeModal()">Voltar</button>
    </div>`;
  document.getElementById('checkoutModal').classList.add('open');
}

function finalizarCartao() {
  const nome = (document.getElementById('cNome')||{}).value||'';
  const num  = (document.getElementById('cNum') ||{}).value||'';
  const val  = (document.getElementById('cVal') ||{}).value||'';
  const cvv  = (document.getElementById('cCVV') ||{}).value||'';
  if (!nome || num.replace(/\s/g,'').length < 16 || val.length < 5 || !cvv) {
    toast('Preencha todos os dados do cartão!'); return;
  }
  const content = document.getElementById('checkoutModalContent');
  content.innerHTML = `
    <div class="modal-emoji">✅</div>
    <h3>Pagamento Aprovado!</h3>
    <p>Seu cartão foi processado com sucesso.<br>Você receberá a confirmação por e-mail em breve.</p>
    <div class="modal-btns">
      <button class="modal-btn primary" onclick="confirmarPedido()">Continuar Comprando</button>
    </div>`;
  document.getElementById('checkoutModal').classList.add('open');
}

function finalizarBoleto(total) {
  const codigo = '0000.00001 00000.000002 00000.000003 0 ' + Date.now().toString().substr(-5);
  const content = document.getElementById('checkoutModalContent');
  content.innerHTML = `
    <div class="modal-emoji">🧾</div>
    <h3>Boleto Gerado!</h3>
    <p>Código de barras do seu boleto:</p>
    <div style="background:var(--cream);border:1px solid var(--border);border-radius:4px;padding:14px;font-size:11px;font-weight:600;letter-spacing:1px;color:var(--charcoal);margin:12px 0;word-break:break-all">${codigo}</div>
    <p style="font-size:11px">💰 Valor: <strong>R$ ${total}</strong> &nbsp;|&nbsp; 📅 Vence em 3 dias úteis</p>
    <div class="modal-btns">
      <button class="modal-btn primary" onclick="confirmarPedido()">OK, Entendido</button>
    </div>`;
  document.getElementById('checkoutModal').classList.add('open');
}

function confirmarPedido() {
  saveCart([]);
  updateCartBadge();
  closeModal();
  showPage('loja');
  toast('Pedido confirmado! Obrigado 💛');
}

function closeModal() {
  document.getElementById('checkoutModal').classList.remove('open');
}

function updateCartBadge() {
  document.getElementById('cartCount').textContent = getCart().reduce((s,i) => s + i.qty, 0);
}

// ── QR Code simples ──
function gerarQRSimples(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) { hash = ((hash << 5) - hash) + seed.charCodeAt(i); hash |= 0; }
  const size = 15;
  let cells = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inCorner = (r<3&&c<3)||(r<3&&c>size-4)||(r>size-4&&c<3);
      const onBorder = (r===0||r===size-1||c===0||c===size-1);
      let fill;
      if (inCorner || onBorder) { fill = '#000'; }
      else { const bit = (hash ^ (r*17+c*31)) & (1<<((r+c)%31)); fill = bit ? '#000' : '#fff'; }
      cells += `<rect x="${c*8}" y="${r*8}" width="8" height="8" fill="${fill}"/>`;
    }
  }
  return `<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <rect width="120" height="120" fill="white"/>${cells}</svg>`;
}

// ════════════════════════════════════
//  ADMIN
// ════════════════════════════════════

function renderAdmin() {
  if (!isLoggedIn()) { abrirLogin(); return; }
  const prods = getDB();
  const cfg   = getConfig();
  document.getElementById('pixKeyInput').value  = cfg.pixKey  || '';
  document.getElementById('pixNameInput').value = cfg.pixName || '';
  document.getElementById('adminCount').textContent = `${prods.length} produto${prods.length !== 1 ? 's' : ''}`;
  document.getElementById('adminBadge').style.display = 'block';

  document.getElementById('adminTable').innerHTML = prods.map(p => `
    <tr>
      <td>
        <div class="td-thumb">
          ${p.imagem
            ? `<img src="${p.imagem}" alt="${p.nome}" onerror="this.style.display='none'">`
            : p.emoji}
        </div>
      </td>
      <td>
        <strong>${p.nome}</strong>
        ${p.destaque ? '<span style="font-size:9px;background:var(--gold);color:var(--deep);padding:2px 8px;border-radius:2px;margin-left:8px;font-weight:700;letter-spacing:1px">DESTAQUE</span>' : ''}
        <br><span style="font-size:11px;color:var(--muted)">${p.desc ? p.desc.substr(0,50)+'...' : ''}</span>
      </td>
      <td><span style="font-size:10px;padding:3px 8px;border-radius:10px;font-weight:600;
        background:${p.genero==='Feminino'?'rgba(196,135,107,0.15)':p.genero==='Masculino'?'rgba(90,122,154,0.15)':'rgba(201,169,110,0.15)'};
        color:${p.genero==='Feminino'?'var(--fem)':p.genero==='Masculino'?'var(--masc)':'var(--gold)'}">
        ${p.genero}</span></td>
      <td><span style="background:var(--cream);padding:3px 10px;border-radius:2px;font-size:11px">${p.categoria}</span></td>
      <td>R$ ${p.preco.toFixed(2)}${p.precoAntigo ? `<br><span style="font-size:10px;color:var(--muted);text-decoration:line-through">R$ ${p.precoAntigo.toFixed(2)}</span>` : ''}</td>
      <td><span style="color:${p.estoque===0?'var(--danger)':p.estoque<=3?'var(--rose)':'var(--success)'}">${p.estoque} un.</span></td>
      <td>
        <div class="action-btns">
          <button class="edit-btn" onclick="editarProduto('${p.id}')">Editar</button>
          <button class="del-btn"  onclick="deletarProduto('${p.id}')">Excluir</button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--muted)">Nenhum produto cadastrado.</td></tr>';
}

function salvarConfigPix() {
  const cfg = getConfig();
  cfg.pixKey  = document.getElementById('pixKeyInput').value.trim();
  cfg.pixName = document.getElementById('pixNameInput').value.trim();
  saveConfig(cfg);
  toast('Configurações PIX salvas! 💠');
}

// Imagem: converte para base64 para salvar no localStorage
function previewFromUrl(url) {
  const preview = document.getElementById('imgPreview');
  const placeholder = document.getElementById('imgPlaceholder');
  if (!url) {
    preview.classList.remove('show');
    placeholder.style.display = 'flex';
    delete preview.dataset.base64;
    return;
  }
  preview.src = url;
  preview.dataset.base64 = url;
  preview.classList.add('show');
  placeholder.style.display = 'none';
  preview.onerror = () => { preview.classList.remove('show'); placeholder.style.display = 'flex'; };
}

function handleImageUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { toast('Imagem muito grande! Use até 2MB.'); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    const preview = document.getElementById('imgPreview');
    const placeholder = document.getElementById('imgPlaceholder');
    preview.src = e.target.result;
    preview.classList.add('show');
    placeholder.style.display = 'none';
    preview.dataset.base64 = e.target.result;
  };
  reader.readAsDataURL(file);
}

function salvarProduto() {
  if (!isLoggedIn()) { abrirLogin(); return; }
  const id          = document.getElementById('editId').value;
  const nome        = document.getElementById('pNome').value.trim();
  const preco       = parseFloat(document.getElementById('pPreco').value);
  const precoAntigo = parseFloat(document.getElementById('pPrecoAntigo').value) || null;
  const categoria   = document.getElementById('pCategoria').value;
  const genero      = document.getElementById('pGenero').value;
  const estoque     = parseInt(document.getElementById('pEstoque').value) || 0;
  const emoji       = document.getElementById('pEmoji').value;
  const desc        = document.getElementById('pDesc').value.trim();
  const destaque    = document.getElementById('pDestaque').value === 'true';
  const preview     = document.getElementById('imgPreview');
  const imagem      = preview.dataset.base64 || (id ? getDB().find(p=>p.id===id)?.imagem || '' : '');

  if (!nome || isNaN(preco)) { toast('Preencha nome e preço!'); return; }

  let prods = getDB();
  if (id) {
    const idx = prods.findIndex(p => p.id === id);
    if (idx >= 0) prods[idx] = { ...prods[idx], nome, preco, precoAntigo, categoria, genero, estoque, emoji, desc, destaque, imagem };
    toast('Produto atualizado! ✓');
  } else {
    prods.push({ id:uid(), nome, preco, precoAntigo, categoria, genero, estoque, emoji, desc, destaque, imagem });
    toast('Produto cadastrado! ✓');
  }

  saveDB(prods);
  limparForm();
  renderAdmin();
}

function editarProduto(id) {
  const prod = getDB().find(p => p.id === id);
  if (!prod) return;
  document.getElementById('editId').value        = prod.id;
  document.getElementById('pNome').value         = prod.nome;
  document.getElementById('pPreco').value        = prod.preco;
  document.getElementById('pPrecoAntigo').value  = prod.precoAntigo || '';
  document.getElementById('pCategoria').value    = prod.categoria;
  document.getElementById('pGenero').value       = prod.genero || 'Feminino';
  document.getElementById('pEstoque').value      = prod.estoque;
  document.getElementById('pEmoji').value        = prod.emoji;
  document.getElementById('pDesc').value         = prod.desc;
  document.getElementById('pDestaque').value     = prod.destaque ? 'true' : 'false';
  document.getElementById('formTitle').textContent = 'Editar Produto';

  const preview = document.getElementById('imgPreview');
  const placeholder = document.getElementById('imgPlaceholder');
  if (prod.imagem) {
    preview.src = prod.imagem;
    preview.dataset.base64 = prod.imagem;
    preview.classList.add('show');
    placeholder.style.display = 'none';
  } else {
    preview.classList.remove('show');
    placeholder.style.display = 'flex';
    delete preview.dataset.base64;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelarEdicao() { limparForm(); }

function limparForm() {
  ['editId','pNome','pPreco','pPrecoAntigo','pEstoque','pDesc'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('pDestaque').value = 'false';
  document.getElementById('pGenero').value   = 'Feminino';
  document.getElementById('formTitle').textContent = 'Novo Produto';
  const preview = document.getElementById('imgPreview');
  preview.classList.remove('show');
  document.getElementById('imgPlaceholder').style.display = 'flex';
  delete preview.dataset.base64;
  document.getElementById('imgFileInput').value = '';
}

function deletarProduto(id) {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return;
  saveDB(getDB().filter(p => p.id !== id));
  renderAdmin();
  toast('Produto excluído.');
}

// ════════════════════════════════════
//  TOAST
// ════════════════════════════════════

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

// ════════════════════════════════════
//  INIT
// ════════════════════════════════════

ensureAuth();
seedDB();
showPage('home');
if (isLoggedIn()) document.getElementById('adminBadge').style.display = 'block';
