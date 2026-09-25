/* ==========================================================
   Jesbor Barbería · Finanzas
   App de una sola página, sin dependencias. Los datos se
   guardan en el navegador (localStorage).
   ========================================================== */
(function () {
  'use strict';

  const STORE_KEY = 'jesbor-barberia-v1';

  const PAY = { efectivo: 'Efectivo', tarjeta: 'Tarjeta', transferencia: 'Transferencia' };
  const EXPENSE_CATS = ['Insumos', 'Alquiler', 'Servicios (luz, agua, internet)', 'Equipo', 'Comida', 'Transporte', 'Otros'];
  const COLORS = ['#b87816', '#2f6f8f', '#7a4f9a', '#2e7d4f', '#b34a3c', '#4a5a6a', '#c0567f', '#8a6d3b'];

  /* ---------------- Iconos ---------------- */
  const ICON_PATHS = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
    wallet: '<path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
    transfer: '<path d="M17 3l4 4-4 4M3 7h18M7 21l-4-4 4-4M21 17H3"/>',
    receipt: '<path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON_PATHS[name] || '') + '</svg>';
  }
  const PAY_ICON = { efectivo: 'cash', tarjeta: 'card', transferencia: 'transfer' };

  /* ---------------- Estado ---------------- */
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  function seed() {
    return {
      version: 1,
      settings: { business: 'Jesbor Barbería', currency: '$', decimals: 2, goal: 100, theme: 'auto' },
      ui: { pay: 'efectivo', period: 'hoy', from: '', to: '' },
      services: [
        { id: uid(), name: 'Corte clásico', price: 10, color: COLORS[0] },
        { id: uid(), name: 'Degradado / Fade', price: 12, color: COLORS[1] },
        { id: uid(), name: 'Corte + Barba', price: 15, color: COLORS[2] },
        { id: uid(), name: 'Arreglo de barba', price: 6, color: COLORS[3] },
        { id: uid(), name: 'Corte de niño', price: 8, color: COLORS[4] },
        { id: uid(), name: 'Cejas / Diseño', price: 3, color: COLORS[5] }
      ],
      products: [
        { id: uid(), name: 'Cera para cabello', price: 8, cost: 4, stock: 12 },
        { id: uid(), name: 'Gel fijador', price: 5, cost: 2.5, stock: 15 },
        { id: uid(), name: 'Aceite para barba', price: 10, cost: 5, stock: 8 },
        { id: uid(), name: 'Shampoo', price: 9, cost: 4.5, stock: 6 }
      ],
      sales: [],
      expenses: []
    };
  }

  function load() {
    const base = seed();
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        return normalize(s, base);
      }
    } catch (e) { /* almacenamiento no disponible */ }
    return base;
  }

  function normalize(s, base) {
    base = base || seed();
    return {
      version: 1,
      settings: Object.assign({}, base.settings, s.settings || {}),
      ui: Object.assign({}, base.ui, s.ui || {}),
      services: Array.isArray(s.services) ? s.services : base.services,
      products: Array.isArray(s.products) ? s.products : base.products,
      sales: Array.isArray(s.sales) ? s.sales : [],
      expenses: Array.isArray(s.expenses) ? s.expenses : []
    };
  }

  let state = load();
  let storageOk = true;

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      storageOk = true;
    } catch (e) {
      if (storageOk) toast('No se pudo guardar en este navegador', { error: true });
      storageOk = false;
    }
  }

  /* ---------------- Utilidades ---------------- */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }
  function num(v) { const n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : 0; }
  function round2(n) { return Math.round(n * 100) / 100; }

  function money(n) {
    const s = state.settings;
    const v = Number(n) || 0;
    const d = Number(s.decimals) || 0;
    const str = Math.abs(v).toLocaleString('es', { minimumFractionDigits: d, maximumFractionDigits: d });
    return (v < 0 ? '-' : '') + (s.currency || '') + str;
  }
  function minus(n) { return (Number(n) ? '-' : '') + money(n); }
  function moneyShort(n) {
    const v = Math.abs(Number(n) || 0);
    const c = state.settings.currency || '';
    if (v >= 1e6) return c + (v / 1e6).toLocaleString('es', { maximumFractionDigits: 1 }) + 'M';
    if (v >= 1e4) return c + (v / 1e3).toLocaleString('es', { maximumFractionDigits: 1 }) + 'k';
    return c + v.toLocaleString('es', { maximumFractionDigits: 0 });
  }

  const pad = n => String(n).padStart(2, '0');
  function dkey(d) { const x = new Date(d); return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate()); }
  function todayKey() { return dkey(new Date()); }
  function keyToDate(k) { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); }
  function shiftKey(k, days) { const d = keyToDate(k); d.setDate(d.getDate() + days); return dkey(d); }
  function daysBetween(a, b) { return Math.round((keyToDate(b) - keyToDate(a)) / 86400000); }
  function timeOf(iso) { const d = new Date(iso); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function localInputValue(d) { d = d || new Date(); return dkey(d) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }

  const DOW = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function longDate(k) {
    const d = keyToDate(k);
    const s = d.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
  function shortDate(k) { const d = keyToDate(k); return d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3); }

  function pct(a, b) { return b ? (a / b) * 100 : 0; }

  /* ---------------- Cálculos ---------------- */
  function saleTotal(s) { return round2(num(s.price) * (num(s.qty) || 1)); }
  function saleCost(s) { return round2(num(s.cost) * (num(s.qty) || 1)); }

  function summary(from, to) {
    const inRange = x => { const k = dkey(x.at); return k >= from && k <= to; };
    const sales = state.sales.filter(inRange).sort((a, b) => b.at.localeCompare(a.at));
    const expenses = state.expenses.filter(inRange).sort((a, b) => b.at.localeCompare(a.at));
    const r = {
      from, to, sales, expenses,
      incCortes: 0, incProds: 0, income: 0, cogs: 0, exp: 0, net: 0,
      nCortes: 0, units: 0, nTickets: sales.length,
      byService: {}, byProduct: {}, byPay: {}, byHour: {}
    };
    sales.forEach(s => {
      const t = saleTotal(s), q = num(s.qty) || 1;
      r.byPay[s.pay || 'efectivo'] = (r.byPay[s.pay || 'efectivo'] || 0) + t;
      const h = new Date(s.at).getHours();
      r.byHour[h] = (r.byHour[h] || 0) + t;
      if (s.kind === 'corte') {
        r.incCortes += t; r.nCortes += q;
        const g = r.byService[s.name] || (r.byService[s.name] = { name: s.name, count: 0, total: 0, price: num(s.price) });
        g.count += q; g.total += t;
      } else {
        r.incProds += t; r.units += q;
        const c = saleCost(s);
        r.cogs += c;
        const g = r.byProduct[s.name] || (r.byProduct[s.name] = { name: s.name, count: 0, total: 0, cost: 0 });
        g.count += q; g.total += t; g.cost += c;
      }
    });
    expenses.forEach(e => { r.exp += num(e.amount); });
    r.incCortes = round2(r.incCortes); r.incProds = round2(r.incProds);
    r.income = round2(r.incCortes + r.incProds);
    r.cogs = round2(r.cogs); r.exp = round2(r.exp);
    r.net = round2(r.income - r.cogs - r.exp);
    r.avgCorte = r.nCortes ? r.incCortes / r.nCortes : 0;
    r.avgTicket = r.nTickets ? r.income / r.nTickets : 0;
    r.days = daysBetween(from, to) + 1;
    return r;
  }

  function sortedGroups(obj) { return Object.values(obj).sort((a, b) => b.total - a.total); }

  /* ---------------- Acciones de datos ---------------- */
  function addSale(data, opts) {
    opts = opts || {};
    const sale = Object.assign({ id: uid(), qty: 1, cost: 0, pay: state.ui.pay, at: new Date().toISOString(), note: '' }, data);
    // Descontar inventario si el producto lleva control de stock
    if (sale.kind === 'producto' && sale.itemId) {
      const p = state.products.find(x => x.id === sale.itemId);
      if (p && p.stock !== null && p.stock !== '' && p.stock !== undefined) {
        p.stock = Math.max(0, num(p.stock) - num(sale.qty));
      }
    }
    state.sales.push(sale);
    save();
    if (!opts.silent) {
      toast((sale.kind === 'corte' ? '✂ ' : '') + sale.name + ' · ' + money(saleTotal(sale)) + ' agregado', {
        action: 'Deshacer', onAction: () => { removeSale(sale.id, true); rerender(); }
      });
    }
    return sale;
  }

  function removeSale(id, quiet) {
    const i = state.sales.findIndex(s => s.id === id);
    if (i < 0) return;
    const sale = state.sales[i];
    if (sale.kind === 'producto' && sale.itemId) {
      const p = state.products.find(x => x.id === sale.itemId);
      if (p && p.stock !== null && p.stock !== '' && p.stock !== undefined) p.stock = num(p.stock) + num(sale.qty);
    }
    state.sales.splice(i, 1);
    save();
    if (!quiet) {
      toast('Registro eliminado', {
        action: 'Deshacer', onAction: () => {
          if (sale.kind === 'producto' && sale.itemId) {
            const p = state.products.find(x => x.id === sale.itemId);
            if (p && p.stock !== null && p.stock !== '' && p.stock !== undefined) p.stock = Math.max(0, num(p.stock) - num(sale.qty));
          }
          state.sales.push(sale); save(); rerender();
        }
      });
    }
  }

  function sellService(id) {
    const s = state.services.find(x => x.id === id);
    if (!s) return;
    addSale({ kind: 'corte', itemId: s.id, name: s.name, price: num(s.price) });
    rerender();
  }

  function sellProduct(id, qty) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    qty = qty || 1;
    const tracked = p.stock !== null && p.stock !== '' && p.stock !== undefined;
    if (tracked && num(p.stock) < qty) {
      toast('Sin stock suficiente de ' + p.name, { error: true });
      return;
    }
    addSale({ kind: 'producto', itemId: p.id, name: p.name, price: num(p.price), cost: num(p.cost), qty });
    rerender();
  }

  /* ---------------- Toast ---------------- */
  function toast(msg, opts) {
    opts = opts || {};
    const root = document.getElementById('toast-root');
    const el = document.createElement('div');
    el.className = 'toast' + (opts.error ? ' error' : '');
    el.innerHTML = icon(opts.error ? 'alert' : 'check') + '<span>' + esc(msg) + '</span>';
    if (opts.action) {
      const b = document.createElement('button');
      b.textContent = opts.action;
      b.onclick = () => { opts.onAction && opts.onAction(); el.remove(); };
      el.appendChild(b);
    }
    while (root.children.length > 2) root.firstChild.remove();
    root.appendChild(el);
    setTimeout(() => el.remove(), opts.action ? 5000 : 2600);
  }

  /* ---------------- Modal ---------------- */
  let modalCleanup = null;
  function openModal(o) {
    closeModal();
    const root = document.getElementById('modal-root');
    root.innerHTML =
      '<div class="modal-backdrop" data-close>' +
      '<form class="modal" role="dialog" aria-modal="true" aria-label="' + esc(o.title) + '" novalidate>' +
      '<div class="modal-head"><h2>' + esc(o.title) + '</h2><button type="button" class="icon-btn" data-close aria-label="Cerrar">' + icon('x') + '</button></div>' +
      '<div class="modal-body">' + o.body + '</div>' +
      '<div class="modal-foot">' +
      (o.danger ? '<button type="button" class="btn btn-danger" data-danger>' + icon('trash') + esc(o.danger) + '</button><span class="spacer"></span>' : '') +
      '<button type="button" class="btn" data-close>Cancelar</button>' +
      '<button type="submit" class="btn btn-primary">' + esc(o.submit || 'Guardar') + '</button>' +
      '</div></form></div>';
    const back = root.firstChild;
    const form = back.querySelector('form');
    back.addEventListener('click', e => {
      if (e.target === back || e.target.closest('button[data-close]')) closeModal();
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(form).entries());
      if (o.onSubmit(fd, form) !== false) { closeModal(); rerender(); }
    });
    if (o.danger) {
      form.querySelector('[data-danger]').addEventListener('click', () => {
        if (o.onDanger() !== false) { closeModal(); rerender(); }
      });
    }
    const onKey = e => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    modalCleanup = () => document.removeEventListener('keydown', onKey);
    if (o.onOpen) o.onOpen(form);
    const first = form.querySelector('input:not([type=hidden]):not([type=radio]), select');
    if (first) setTimeout(() => first.focus(), 30);
  }
  function closeModal() {
    document.getElementById('modal-root').innerHTML = '';
    if (modalCleanup) { modalCleanup(); modalCleanup = null; }
  }

  function field(label, input, hint) {
    return '<div class="field"><label>' + esc(label) + '</label>' + input + (hint ? '<span class="hint">' + esc(hint) + '</span>' : '') + '</div>';
  }
  function payOptions(sel) {
    return Object.keys(PAY).map(k => '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + PAY[k] + '</option>').join('');
  }
  function invalid(form, name, msg) {
    toast(msg, { error: true });
    const el = form.querySelector('[name="' + name + '"]');
    if (el) el.focus();
    return false;
  }

  /* ---------------- Formularios ---------------- */
  function serviceForm(id) {
    const s = state.services.find(x => x.id === id) || { name: '', price: '', color: COLORS[state.services.length % COLORS.length] };
    const swatches = '<div class="swatches">' + COLORS.map(c =>
      '<label><input type="radio" name="color" value="' + c + '"' + (c === s.color ? ' checked' : '') + '><span style="background:' + c + '"></span></label>'
    ).join('') + '</div>';
    openModal({
      title: id ? 'Editar servicio' : 'Nuevo servicio',
      body:
        field('Nombre del servicio', '<input class="input" name="name" value="' + esc(s.name) + '" placeholder="Ej. Corte degradado" maxlength="60" required>') +
        field('Precio (' + state.settings.currency + ')', '<input class="input" name="price" type="number" inputmode="decimal" step="0.01" min="0" value="' + esc(s.price) + '" placeholder="0.00" required>') +
        field('Color', swatches),
      danger: id ? 'Eliminar' : null,
      onSubmit(fd, form) {
        if (!fd.name.trim()) return invalid(form, 'name', 'Escribe el nombre del servicio');
        if (fd.price === '' || num(fd.price) < 0) return invalid(form, 'price', 'Escribe un precio válido');
        if (id) Object.assign(s, { name: fd.name.trim(), price: num(fd.price), color: fd.color || s.color });
        else state.services.push({ id: uid(), name: fd.name.trim(), price: num(fd.price), color: fd.color || COLORS[0] });
        save(); toast(id ? 'Servicio actualizado' : 'Servicio creado');
      },
      onDanger() {
        if (!confirm('¿Eliminar "' + s.name + '"? Los cortes ya registrados se conservan en el informe.')) return false;
        state.services = state.services.filter(x => x.id !== id);
        save(); toast('Servicio eliminado');
      }
    });
  }

  function productForm(id) {
    const p = state.products.find(x => x.id === id) || { name: '', price: '', cost: '', stock: '' };
    openModal({
      title: id ? 'Editar producto' : 'Nuevo producto',
      body:
        field('Nombre del producto', '<input class="input" name="name" value="' + esc(p.name) + '" placeholder="Ej. Cera mate" maxlength="60" required>') +
        '<div class="field-row">' +
        field('Precio de venta', '<input class="input" name="price" type="number" inputmode="decimal" step="0.01" min="0" value="' + esc(p.price) + '" placeholder="0.00" required>') +
        field('Costo (opcional)', '<input class="input" name="cost" type="number" inputmode="decimal" step="0.01" min="0" value="' + esc(p.cost) + '" placeholder="0.00">', 'Para calcular tu ganancia real') +
        '</div>' +
        field('Stock disponible (opcional)', '<input class="input" name="stock" type="number" inputmode="numeric" step="1" min="0" value="' + esc(p.stock == null ? '' : p.stock) + '" placeholder="Sin control de inventario">', 'Déjalo vacío si no quieres controlar inventario'),
      danger: id ? 'Eliminar' : null,
      onSubmit(fd, form) {
        if (!fd.name.trim()) return invalid(form, 'name', 'Escribe el nombre del producto');
        if (fd.price === '' || num(fd.price) < 0) return invalid(form, 'price', 'Escribe un precio válido');
        const data = { name: fd.name.trim(), price: num(fd.price), cost: num(fd.cost), stock: fd.stock === '' ? null : Math.max(0, Math.round(num(fd.stock))) };
        if (id) Object.assign(p, data); else state.products.push(Object.assign({ id: uid() }, data));
        save(); toast(id ? 'Producto actualizado' : 'Producto creado');
      },
      onDanger() {
        if (!confirm('¿Eliminar "' + p.name + '"? Las ventas ya registradas se conservan.')) return false;
        state.products = state.products.filter(x => x.id !== id);
        save(); toast('Producto eliminado');
      }
    });
  }

  function restockForm(id) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    openModal({
      title: 'Reponer: ' + p.name,
      submit: 'Agregar al stock',
      body:
        '<p class="muted" style="margin-top:0">Stock actual: <strong>' + (p.stock == null ? 'sin control' : p.stock) + '</strong></p>' +
        field('Unidades que llegaron', '<input class="input" name="qty" type="number" inputmode="numeric" min="1" step="1" value="1">') +
        '<label class="field" style="flex-direction:row;align-items:center;gap:8px"><input type="checkbox" name="asExpense" checked> Registrar la compra como gasto (' + money(num(p.cost)) + ' c/u)</label>',
      onSubmit(fd, form) {
        const q = Math.round(num(fd.qty));
        if (q <= 0) return invalid(form, 'qty', 'Escribe cuántas unidades');
        p.stock = (p.stock == null ? 0 : num(p.stock)) + q;
        if (fd.asExpense && num(p.cost) > 0) {
          state.expenses.push({ id: uid(), concept: 'Compra: ' + p.name + ' ×' + q, category: 'Insumos', amount: round2(num(p.cost) * q), at: new Date().toISOString() });
        }
        save(); toast('Stock actualizado: ' + p.stock + ' unidades');
      }
    });
  }

  function customSaleForm(kind) {
    const isCorte = kind === 'corte';
    openModal({
      title: isCorte ? 'Registrar corte personalizado' : 'Venta de producto suelto',
      submit: 'Agregar al informe',
      body:
        field(isCorte ? 'Servicio / descripción' : 'Producto', '<input class="input" name="name" placeholder="' + (isCorte ? 'Ej. Corte + tinte' : 'Ej. Peine, gorra, bebida…') + '" maxlength="60" required>') +
        '<div class="field-row">' +
        field('Precio' + (isCorte ? '' : ' unitario'), '<input class="input" name="price" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0.00" required>') +
        (isCorte
          ? field('Cantidad', '<input class="input" name="qty" type="number" inputmode="numeric" step="1" min="1" value="1">')
          : field('Cantidad', '<input class="input" name="qty" type="number" inputmode="numeric" step="1" min="1" value="1">')) +
        '</div>' +
        (isCorte ? '' : field('Costo unitario (opcional)', '<input class="input" name="cost" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0.00">', 'Lo que te costó, para calcular la ganancia')) +
        '<div class="field-row">' +
        field('Método de pago', '<select class="input" name="pay">' + payOptions(state.ui.pay) + '</select>') +
        field('Fecha y hora', '<input class="input" name="at" type="datetime-local" value="' + localInputValue() + '">') +
        '</div>' +
        field('Nota (opcional)', '<input class="input" name="note" maxlength="120" placeholder="Cliente, detalle…">'),
      onSubmit(fd, form) {
        if (!fd.name.trim()) return invalid(form, 'name', 'Escribe una descripción');
        if (fd.price === '' || num(fd.price) < 0) return invalid(form, 'price', 'Escribe un precio válido');
        // Si no se cambió la fecha propuesta, usar la hora exacta para mantener el orden
        const at = !fd.at || fd.at === localInputValue() ? new Date() : new Date(fd.at);
        addSale({
          kind, itemId: null, name: fd.name.trim(), price: num(fd.price),
          qty: Math.max(1, Math.round(num(fd.qty) || 1)), cost: num(fd.cost || 0),
          pay: fd.pay, note: fd.note || '', at: (isNaN(at) ? new Date() : at).toISOString()
        });
      }
    });
  }

  function editSaleForm(id) {
    const s = state.sales.find(x => x.id === id);
    if (!s) return;
    openModal({
      title: 'Editar registro',
      body:
        field('Descripción', '<input class="input" name="name" value="' + esc(s.name) + '" maxlength="60">') +
        '<div class="field-row">' +
        field('Precio unitario', '<input class="input" name="price" type="number" inputmode="decimal" step="0.01" min="0" value="' + esc(s.price) + '">') +
        field('Cantidad', '<input class="input" name="qty" type="number" inputmode="numeric" step="1" min="1" value="' + esc(s.qty || 1) + '"' + (s.kind === 'producto' && s.itemId ? ' disabled title="Para cambiar la cantidad elimina y vuelve a registrar"' : '') + '>') +
        '</div>' +
        '<div class="field-row">' +
        field('Método de pago', '<select class="input" name="pay">' + payOptions(s.pay) + '</select>') +
        field('Fecha y hora', '<input class="input" name="at" type="datetime-local" value="' + localInputValue(new Date(s.at)) + '">') +
        '</div>' +
        field('Nota', '<input class="input" name="note" maxlength="120" value="' + esc(s.note || '') + '">'),
      danger: 'Eliminar',
      onSubmit(fd, form) {
        if (!fd.name.trim()) return invalid(form, 'name', 'Escribe una descripción');
        s.name = fd.name.trim();
        s.price = num(fd.price);
        if (fd.qty !== undefined) s.qty = Math.max(1, Math.round(num(fd.qty) || 1));
        s.pay = fd.pay;
        s.note = fd.note || '';
        const at = new Date(fd.at);
        if (!isNaN(at)) s.at = at.toISOString();
        save(); toast('Registro actualizado');
      },
      onDanger() { removeSale(id); }
    });
  }

  function expenseForm(id) {
    const e = state.expenses.find(x => x.id === id) || { concept: '', category: EXPENSE_CATS[0], amount: '', at: new Date().toISOString() };
    openModal({
      title: id ? 'Editar gasto' : 'Nuevo gasto',
      body:
        field('Concepto', '<input class="input" name="concept" value="' + esc(e.concept) + '" placeholder="Ej. Hojas de afeitar" maxlength="80">') +
        '<div class="field-row">' +
        field('Categoría', '<select class="input" name="category">' + EXPENSE_CATS.map(c => '<option' + (c === e.category ? ' selected' : '') + '>' + esc(c) + '</option>').join('') + '</select>') +
        field('Monto', '<input class="input" name="amount" type="number" inputmode="decimal" step="0.01" min="0" value="' + esc(e.amount) + '" placeholder="0.00">') +
        '</div>' +
        field('Fecha y hora', '<input class="input" name="at" type="datetime-local" value="' + localInputValue(new Date(e.at)) + '">'),
      danger: id ? 'Eliminar' : null,
      onSubmit(fd, form) {
        if (!fd.concept.trim()) return invalid(form, 'concept', 'Escribe el concepto del gasto');
        if (num(fd.amount) <= 0) return invalid(form, 'amount', 'Escribe el monto');
        const at = new Date(fd.at);
        const data = { concept: fd.concept.trim(), category: fd.category, amount: round2(num(fd.amount)), at: (isNaN(at) ? new Date() : at).toISOString() };
        if (id) Object.assign(e, data); else state.expenses.push(Object.assign({ id: uid() }, data));
        save(); toast(id ? 'Gasto actualizado' : 'Gasto registrado');
      },
      onDanger() {
        state.expenses = state.expenses.filter(x => x.id !== id);
        save(); toast('Gasto eliminado');
      }
    });
  }

  /* ---------------- Componentes ---------------- */
  function deltaChip(now, prev, label) {
    if (!prev && !now) return '<span class="delta">Sin cambios</span>';
    if (!prev) return '<span class="delta up">▲ Nuevo</span>' + (label ? ' ' + esc(label) : '');
    const d = ((now - prev) / Math.abs(prev)) * 100;
    const cls = d > 0.5 ? 'up' : d < -0.5 ? 'down' : '';
    const arrow = d > 0.5 ? '▲' : d < -0.5 ? '▼' : '•';
    return '<span class="delta ' + cls + '">' + arrow + ' ' + Math.abs(d).toFixed(0) + '%</span>' + (label ? ' ' + esc(label) : '');
  }

  function kpi(label, value, foot, opts) {
    opts = opts || {};
    return '<div class="card kpi' + (opts.hero ? ' hero' : '') + '">' +
      '<div class="kpi-label"><span class="dot" style="background:' + (opts.color || 'var(--ink-3)') + '"></span>' + esc(label) + '</div>' +
      '<div class="kpi-value">' + value + '</div>' +
      '<div class="kpi-foot">' + (foot || '') + '</div>' +
      (opts.extra || '') + '</div>';
  }

  function saleRow(s, opts) {
    opts = opts || {};
    const qty = num(s.qty) || 1;
    return '<div class="row">' +
      '<div class="row-icon ' + (s.kind === 'producto' ? 'producto' : '') + '">' + icon(s.kind === 'producto' ? 'bag' : 'scissors') + '</div>' +
      '<div class="row-main">' +
      '<div class="row-title">' + esc(s.name) + (qty > 1 ? ' <span class="muted">×' + qty + '</span>' : '') + '</div>' +
      '<div class="row-sub"><span>' + (opts.showDate ? shortDate(dkey(s.at)) + ' · ' : '') + timeOf(s.at) + '</span><span>' + (PAY[s.pay] || 'Efectivo') + '</span>' + (s.note ? '<span>' + esc(s.note) + '</span>' : '') + '</div>' +
      '</div>' +
      '<div class="row-amount">' + money(saleTotal(s)) + '</div>' +
      (opts.noTools ? '' :
        '<button class="icon-btn" data-act="edit-sale" data-id="' + s.id + '" aria-label="Editar">' + icon('edit') + '</button>' +
        '<button class="icon-btn danger" data-act="del-sale" data-id="' + s.id + '" aria-label="Eliminar">' + icon('trash') + '</button>') +
      '</div>';
  }

  function expenseRow(e, opts) {
    opts = opts || {};
    return '<div class="row">' +
      '<div class="row-icon gasto">' + icon('receipt') + '</div>' +
      '<div class="row-main"><div class="row-title">' + esc(e.concept) + '</div>' +
      '<div class="row-sub"><span>' + (opts.showDate ? shortDate(dkey(e.at)) + ' · ' : '') + timeOf(e.at) + '</span><span>' + esc(e.category) + '</span></div></div>' +
      '<div class="row-amount neg">-' + money(e.amount) + '</div>' +
      (opts.noTools ? '' :
        '<button class="icon-btn" data-act="edit-expense" data-id="' + e.id + '" aria-label="Editar">' + icon('edit') + '</button>' +
        '<button class="icon-btn danger" data-act="del-expense" data-id="' + e.id + '" aria-label="Eliminar">' + icon('trash') + '</button>') +
      '</div>';
  }

  function emptyState(ic, text, action) {
    return '<div class="empty">' + icon(ic) + '<div>' + text + '</div>' + (action || '') + '</div>';
  }

  function paySelector() {
    return '<div class="toolbar"><span class="label">Método de pago:</span><div class="segmented" role="radiogroup" aria-label="Método de pago">' +
      Object.keys(PAY).map(k => '<button type="button" role="radio" aria-checked="' + (state.ui.pay === k) + '" class="' + (state.ui.pay === k ? 'on' : '') + '" data-act="set-pay" data-pay="' + k + '">' + icon(PAY_ICON[k]) + PAY[k] + '</button>').join('') +
      '</div></div>';
  }

  // Gráfico de barras apiladas (cortes + productos) por día
  function barChart(keys) {
    const today = todayKey();
    const data = keys.map(k => { const s = summary(k, k); return { k, c: s.incCortes, p: s.incProds, t: s.income }; });
    const max = Math.max(1, ...data.map(d => d.t));
    const niceMax = niceCeil(max);
    const W = 720, H = 240, L = 44, R = 8, T = 18, B = 34;
    const cw = (W - L - R) / data.length;
    const bw = Math.min(46, cw * 0.62);
    const y = v => T + (H - T - B) * (1 - v / niceMax);
    let g = '';
    for (let i = 0; i <= 4; i++) {
      const v = niceMax * i / 4, yy = y(v);
      g += '<line class="grid-line" x1="' + L + '" x2="' + (W - R) + '" y1="' + yy + '" y2="' + yy + '"/>';
      g += '<text class="axis-label" x="' + (L - 8) + '" y="' + (yy + 4) + '" text-anchor="end">' + esc(moneyShort(v)) + '</text>';
    }
    const showVals = data.length <= 14;
    const every = Math.ceil(data.length / 16);
    data.forEach((d, i) => {
      const x = L + cw * i + (cw - bw) / 2;
      const yc = y(d.c), yp = y(d.c + d.p);
      const title = '<title>' + esc(shortDate(d.k) + ': ' + money(d.t) + ' (cortes ' + money(d.c) + ', productos ' + money(d.p) + ')') + '</title>';
      if (d.c > 0) g += '<rect class="bar-cortes" x="' + x + '" y="' + yc + '" width="' + bw + '" height="' + (y(0) - yc) + '" rx="3">' + title + '</rect>';
      if (d.p > 0) g += '<rect class="bar-productos" x="' + x + '" y="' + yp + '" width="' + bw + '" height="' + Math.max(0, yc - yp - (d.c > 0 ? 2 : 0)) + '" rx="3">' + title + '</rect>';
      if (showVals && d.t > 0) g += '<text class="bar-label" x="' + (x + bw / 2) + '" y="' + (yp - 6) + '" text-anchor="middle">' + esc(moneyShort(d.t)) + '</text>';
      if (i % every === 0 || i === data.length - 1) {
        const dd = keyToDate(d.k);
        const lbl = data.length <= 7 ? DOW[dd.getDay()] + ' ' + dd.getDate() : String(dd.getDate());
        g += '<text class="axis-label' + (d.k === today ? ' today-label' : '') + '" x="' + (L + cw * i + cw / 2) + '" y="' + (H - 10) + '" text-anchor="middle">' + lbl + '</text>';
      }
    });
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Ingresos por día">' + g + '</svg>' +
      '<div class="legend" style="margin-top:8px"><span><i style="background:var(--c-cortes)"></i>Cortes</span><span><i style="background:var(--c-productos)"></i>Productos</span></div>';
  }
  function niceCeil(v) {
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    const n = v / p;
    const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return m * p;
  }

  function rankList(groups, total, color, fmtCount) {
    if (!groups.length) return '';
    return '<div class="rank">' + groups.map(g =>
      '<div class="rank-item"><div class="rank-top"><span>' + esc(g.name) + ' <span class="muted">· ' + fmtCount(g.count) + '</span></span><span>' + money(g.total) + '</span></div>' +
      '<div class="rank-bar"><span style="width:' + pct(g.total, total).toFixed(1) + '%;background:' + (g.color || color) + '"></span></div></div>'
    ).join('') + '</div>';
  }

  function payBreakdown(byPay, total) {
    const keys = Object.keys(PAY).filter(k => byPay[k]);
    if (!keys.length) return emptyState('wallet', 'Sin cobros todavía');
    return '<div class="rank">' + keys.map(k =>
      '<div class="rank-item"><div class="rank-top"><span>' + PAY[k] + '</span><span>' + money(byPay[k]) + ' <span class="muted">(' + pct(byPay[k], total).toFixed(0) + '%)</span></span></div>' +
      '<div class="rank-bar"><span style="width:' + pct(byPay[k], total).toFixed(1) + '%"></span></div></div>'
    ).join('') + '</div>';
  }

  /* ---------------- Vistas ---------------- */
  function viewDashboard() {
    const t = todayKey();
    const S = summary(t, t);
    const Y = summary(shiftKey(t, -1), shiftKey(t, -1));
    const W = summary(shiftKey(t, -6), t);
    const monthStart = t.slice(0, 8) + '01';
    const M = summary(monthStart, t);
    const goal = num(state.settings.goal);
    const goalPct = goal ? Math.min(100, pct(S.income, goal)) : 0;

    const hour = new Date().getHours();
    const hello = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

    const lowStock = state.products.filter(p => p.stock !== null && p.stock !== undefined && p.stock !== '' && num(p.stock) <= 3);

    const services = state.services.map(s => {
      const c = (S.byService[s.name] || {}).count || 0;
      return '<button class="quick-btn" data-act="sell-service" data-id="' + s.id + '" style="border-left:4px solid ' + esc(s.color) + '">' +
        '<span class="q-name">' + esc(s.name) + icon('plus') + '</span>' +
        '<span class="q-price">' + money(s.price) + (c ? ' · hoy ' + c : '') + '</span></button>';
    }).join('');

    const best = sortedGroups(S.byService)[0];
    const peak = Object.keys(S.byHour).sort((a, b) => S.byHour[b] - S.byHour[a])[0];

    const insights = [];
    if (S.nCortes) insights.push('Llevas <strong>' + S.nCortes + '</strong> ' + (S.nCortes === 1 ? 'corte' : 'cortes') + ' hoy con un promedio de <strong>' + money(S.avgCorte) + '</strong> por corte.');
    if (best) insights.push('El servicio que más te ha dejado hoy es <strong>' + esc(best.name) + '</strong> (' + money(best.total) + ').');
    if (peak !== undefined) insights.push('Tu hora más fuerte hoy: <strong>' + pad(peak) + ':00 – ' + pad(+peak + 1) + ':00</strong>.');
    if (goal && S.income < goal) insights.push('Te faltan <strong>' + money(goal - S.income) + '</strong> para llegar a tu meta del día.');
    if (goal && S.income >= goal) insights.push('🎉 ¡Meta del día superada por <strong>' + money(S.income - goal) + '</strong>!');
    if (W.income) insights.push('Promedio diario de los últimos 7 días: <strong>' + money(W.income / 7) + '</strong>.');
    if (lowStock.length) insights.push('Stock bajo: ' + lowStock.map(p => '<strong>' + esc(p.name) + '</strong> (' + p.stock + ')').join(', ') + '.');

    return '' +
      '<div class="page-head"><div><h1>' + hello + '</h1><p>' + longDate(t) + '</p></div>' +
      '<div class="head-actions"><a class="btn" href="#/finanzas">' + icon('chart') + 'Ver informe</a><button class="btn btn-primary" data-act="custom-corte">' + icon('plus') + 'Registrar corte</button></div></div>' +

      '<div class="grid kpis">' +
      kpi('Ingresos de hoy', money(S.income), deltaChip(S.income, Y.income, 'vs ayer'), {
        hero: true, color: '#c8892b',
        extra: goal ? '<div class="progress" title="Meta diaria"><span style="width:' + goalPct.toFixed(1) + '%"></span></div><div class="kpi-foot" style="margin-top:6px">' + goalPct.toFixed(0) + '% de la meta (' + money(goal) + ')</div>' : ''
      }) +
      kpi('Cortes realizados', '<span class="num">' + S.nCortes + '</span>', money(S.incCortes) + ' · ' + deltaChip(S.nCortes, Y.nCortes, 'vs ayer'), { color: 'var(--c-cortes)' }) +
      kpi('Productos vendidos', '<span class="num">' + S.units + '</span>', money(S.incProds) + ' · ' + deltaChip(S.incProds, Y.incProds), { color: 'var(--c-productos)' }) +
      kpi('Ganancia neta hoy', money(S.net), 'Gastos ' + money(S.exp) + ' · Costo prod. ' + money(S.cogs), { color: S.net >= 0 ? 'var(--good)' : 'var(--bad)' }) +
      '</div>' +

      '<div class="section-title">Agregar corte rápido <span class="split" style="gap:6px"><a class="btn btn-sm btn-ghost" href="#/cortes">Administrar</a></span></div>' +
      '<div class="card">' + paySelector() +
      (state.services.length ? '<div class="quick">' + services + '</div>' : emptyState('scissors', 'No tienes servicios. <a href="#/cortes">Crea uno</a>.')) +
      '</div>' +

      '<div class="grid grid-2" style="margin-top:16px">' +
      '<div class="card"><h3>Últimos 7 días <small>' + money(W.income) + ' en total</small></h3>' + barChart(Array.from({ length: 7 }, (_, i) => shiftKey(t, i - 6))) + '</div>' +
      '<div class="card"><h3>Resumen del día</h3>' +
      (insights.length ? '<div class="stack" style="gap:10px">' + insights.map(x => '<div class="note">' + x + '</div>').join('') + '</div>'
        : emptyState('sparkle', 'Aún no hay movimientos hoy.<br>Agrega tu primer corte con los botones de arriba.')) +
      '</div></div>' +

      '<div class="grid grid-3" style="margin-top:16px">' +
      '<div class="card"><h3>Servicios de hoy</h3>' + (S.nCortes ? rankList(sortedGroups(S.byService).map(g => Object.assign({ color: (state.services.find(s => s.name === g.name) || {}).color }, g)), S.incCortes, 'var(--c-cortes)', c => c + (c === 1 ? ' corte' : ' cortes')) : emptyState('scissors', 'Sin cortes registrados hoy')) + '</div>' +
      '<div class="card"><h3>Métodos de pago</h3>' + payBreakdown(S.byPay, S.income) + '</div>' +
      '<div class="card"><h3>Este mes <small>' + MONTHS[keyToDate(t).getMonth()] + '</small></h3>' +
      '<div class="pl">' +
      '<div class="pl-row"><span>Cortes (' + M.nCortes + ')</span><span>' + money(M.incCortes) + '</span></div>' +
      '<div class="pl-row"><span>Productos (' + M.units + ')</span><span>' + money(M.incProds) + '</span></div>' +
      '<div class="pl-row minus"><span>Costo de productos</span><span>' + minus(M.cogs) + '</span></div>' +
      '<div class="pl-row minus"><span>Gastos</span><span>' + minus(M.exp) + '</span></div>' +
      '<div class="pl-row total ' + (M.net >= 0 ? 'pos' : 'neg') + '"><span>Ganancia</span><span>' + money(M.net) + '</span></div>' +
      '</div></div>' +
      '</div>' +

      '<div class="section-title">Actividad de hoy <a class="btn btn-sm btn-ghost" href="#/finanzas">Ver todo</a></div>' +
      '<div class="card">' +
      (S.sales.length || S.expenses.length
        ? '<div class="list">' + mergeActivity(S.sales, S.expenses).slice(0, 8).map(x => x.concept !== undefined ? expenseRow(x) : saleRow(x)).join('') + '</div>'
        : emptyState('clock', 'Todavía no hay registros hoy')) +
      '</div>';
  }

  function mergeActivity(sales, expenses) {
    return sales.concat(expenses).sort((a, b) => b.at.localeCompare(a.at));
  }

  function viewCortes() {
    const t = todayKey();
    const S = summary(t, t);
    const cortesHoy = S.sales.filter(s => s.kind === 'corte');
    const cards = state.services.map(s => {
      const g = S.byService[s.name] || { count: 0, total: 0 };
      return '<div class="card item" style="--item-color:' + esc(s.color) + '">' +
        '<div class="item-top"><div class="item-name">' + esc(s.name) + '</div>' +
        '<div class="item-tools"><button class="icon-btn" data-act="edit-service" data-id="' + s.id + '" aria-label="Editar servicio">' + icon('edit') + '</button></div></div>' +
        '<div class="item-price">' + money(s.price) + '</div>' +
        '<div class="item-meta"><span class="chip accent">Hoy: ' + g.count + '</span>' + (g.total ? '<span class="chip">' + money(g.total) + '</span>' : '') + '</div>' +
        '<button class="btn btn-primary btn-block" data-act="sell-service" data-id="' + s.id + '">' + icon('plus') + 'Agregar corte</button>' +
        '</div>';
    }).join('');

    return '' +
      '<div class="page-head"><div><h1>Cortes</h1><p>Toca <strong>Agregar corte</strong> cada vez que termines un servicio.</p></div>' +
      '<div class="head-actions"><button class="btn" data-act="custom-corte">' + icon('edit') + 'Corte personalizado</button><button class="btn btn-primary" data-act="new-service">' + icon('plus') + 'Nuevo servicio</button></div></div>' +

      '<div class="grid kpis" style="margin-bottom:20px">' +
      kpi('Cortes hoy', '<span class="num">' + S.nCortes + '</span>', 'Promedio ' + money(S.avgCorte), { color: 'var(--c-cortes)' }) +
      kpi('Generado en cortes', money(S.incCortes), pct(S.incCortes, S.income).toFixed(0) + '% de los ingresos del día', { color: 'var(--c-cortes)' }) +
      '</div>' +

      paySelector() +
      '<div class="items">' + cards +
      '<button class="card item add-new" data-act="new-service">' + icon('plus') + '<span>Agregar servicio</span></button></div>' +

      '<div class="section-title">Cortes de hoy <span class="muted" style="text-transform:none;letter-spacing:0">' + cortesHoy.length + ' registros</span></div>' +
      '<div class="card">' + (cortesHoy.length ? '<div class="list">' + cortesHoy.map(s => saleRow(s)).join('') + '</div>' : emptyState('scissors', 'Aún no hay cortes hoy')) + '</div>';
  }

  function viewProductos() {
    const t = todayKey();
    const S = summary(t, t);
    const ventasHoy = S.sales.filter(s => s.kind === 'producto');
    const profitToday = round2(S.incProds - S.cogs);
    const invValue = state.products.reduce((a, p) => a + (p.stock == null ? 0 : num(p.stock) * num(p.cost)), 0);

    const cards = state.products.map(p => {
      const tracked = p.stock !== null && p.stock !== undefined && p.stock !== '';
      const low = tracked && num(p.stock) <= 3;
      const out = tracked && num(p.stock) <= 0;
      const g = S.byProduct[p.name] || { count: 0 };
      const margin = num(p.cost) > 0 ? pct(num(p.price) - num(p.cost), num(p.price)) : null;
      return '<div class="card item" style="--item-color:var(--c-productos)">' +
        '<div class="item-top"><div class="item-name">' + esc(p.name) + '</div>' +
        '<div class="item-tools">' +
        (tracked ? '<button class="icon-btn" data-act="restock" data-id="' + p.id + '" aria-label="Reponer stock" title="Reponer stock">' + icon('box') + '</button>' : '') +
        '<button class="icon-btn" data-act="edit-product" data-id="' + p.id + '" aria-label="Editar producto">' + icon('edit') + '</button></div></div>' +
        '<div class="item-price">' + money(p.price) + '</div>' +
        '<div class="item-meta">' +
        (tracked ? '<span class="chip ' + (low ? 'warn' : '') + '">Stock: ' + p.stock + '</span>' : '<span class="chip">Sin control de stock</span>') +
        (margin !== null ? '<span class="chip good">Margen ' + margin.toFixed(0) + '%</span>' : '') +
        (g.count ? '<span class="chip accent">Hoy: ' + g.count + '</span>' : '') +
        '</div>' +
        '<button class="btn btn-primary btn-block" data-act="sell-product" data-id="' + p.id + '"' + (out ? ' disabled style="opacity:.5;cursor:not-allowed"' : '') + '>' + icon('plus') + (out ? 'Agotado' : 'Vender') + '</button>' +
        '</div>';
    }).join('');

    return '' +
      '<div class="page-head"><div><h1>Productos</h1><p>Vende productos de tu catálogo o registra ventas sueltas.</p></div>' +
      '<div class="head-actions"><button class="btn" data-act="custom-producto">' + icon('bag') + 'Venta suelta</button><button class="btn btn-primary" data-act="new-product">' + icon('plus') + 'Nuevo producto</button></div></div>' +

      '<div class="grid kpis" style="margin-bottom:20px">' +
      kpi('Vendido hoy', money(S.incProds), S.units + (S.units === 1 ? ' unidad' : ' unidades'), { color: 'var(--c-productos)' }) +
      kpi('Ganancia en productos', money(profitToday), 'Después del costo (' + money(S.cogs) + ')', { color: 'var(--good)' }) +
      kpi('Inventario valorizado', money(invValue), state.products.length + ' productos en catálogo', { color: 'var(--ink-3)' }) +
      '</div>' +

      paySelector() +
      '<div class="items">' + cards +
      '<button class="card item add-new" data-act="new-product">' + icon('plus') + '<span>Agregar producto</span></button></div>' +

      '<div class="section-title">Ventas de hoy <span class="muted" style="text-transform:none;letter-spacing:0">' + ventasHoy.length + ' registros</span></div>' +
      '<div class="card">' + (ventasHoy.length ? '<div class="list">' + ventasHoy.map(s => saleRow(s)).join('') + '</div>' : emptyState('bag', 'Aún no hay ventas de productos hoy')) + '</div>';
  }

  function periodRange() {
    const t = todayKey();
    const u = state.ui;
    switch (u.period) {
      case 'ayer': return [shiftKey(t, -1), shiftKey(t, -1), 'Ayer · ' + longDate(shiftKey(t, -1))];
      case 'semana': return [shiftKey(t, -6), t, 'Últimos 7 días'];
      case 'mes': return [t.slice(0, 8) + '01', t, 'Este mes · ' + MONTHS[keyToDate(t).getMonth()]];
      case 'custom': {
        let f = u.from || t, to = u.to || f;
        if (to < f) { const x = f; f = to; to = x; }
        return [f, to, f === to ? longDate(f) : shortDate(f) + ' – ' + shortDate(to)];
      }
      default: return [t, t, 'Hoy · ' + longDate(t)];
    }
  }

  function viewFinanzas() {
    const [from, to, label] = periodRange();
    const S = summary(from, to);
    const multi = S.days > 1;
    const prevTo = shiftKey(from, -1), prevFrom = shiftKey(prevTo, -(S.days - 1));
    const P = summary(prevFrom, prevTo);
    const periods = { hoy: 'Hoy', ayer: 'Ayer', semana: '7 días', mes: 'Mes', custom: 'Fechas' };

    const svc = sortedGroups(S.byService);
    const prd = sortedGroups(S.byProduct);

    const svcTable = svc.length
      ? '<div class="table-wrap"><table><thead><tr><th>Servicio</th><th class="r">Cant.</th><th class="r hide-sm">Precio prom.</th><th class="r">Total</th><th class="hide-sm">% ingresos</th></tr></thead><tbody>' +
      svc.map(g => '<tr><td>' + esc(g.name) + '</td><td class="r">' + g.count + '</td><td class="r hide-sm">' + money(g.total / g.count) + '</td><td class="r">' + money(g.total) + '</td>' +
        '<td class="hide-sm"><div class="share"><div class="bar"><span style="width:' + pct(g.total, S.incCortes).toFixed(1) + '%"></span></div><small>' + pct(g.total, S.incCortes).toFixed(0) + '%</small></div></td></tr>').join('') +
      '</tbody><tfoot><tr><td>Total cortes</td><td class="r">' + S.nCortes + '</td><td class="r hide-sm">' + money(S.avgCorte) + '</td><td class="r">' + money(S.incCortes) + '</td><td class="hide-sm"></td></tr></tfoot></table></div>'
      : emptyState('scissors', 'No hay cortes en este periodo');

    const prdTable = prd.length
      ? '<div class="table-wrap"><table><thead><tr><th>Producto</th><th class="r">Unid.</th><th class="r">Ingreso</th><th class="r hide-sm">Costo</th><th class="r">Ganancia</th></tr></thead><tbody>' +
      prd.map(g => '<tr><td>' + esc(g.name) + '</td><td class="r">' + g.count + '</td><td class="r">' + money(g.total) + '</td><td class="r hide-sm">' + money(g.cost) + '</td><td class="r">' + money(g.total - g.cost) + '</td></tr>').join('') +
      '</tbody><tfoot><tr><td>Total productos</td><td class="r">' + S.units + '</td><td class="r">' + money(S.incProds) + '</td><td class="r hide-sm">' + money(S.cogs) + '</td><td class="r">' + money(S.incProds - S.cogs) + '</td></tr></tfoot></table></div>'
      : emptyState('bag', 'No hay ventas de productos en este periodo');

    const chartKeys = multi && S.days <= 62 ? Array.from({ length: S.days }, (_, i) => shiftKey(from, i)) : null;

    return '' +
      '<div class="page-head"><div><h1>Finanzas</h1><p>' + esc(label) + '</p></div>' +
      '<div class="head-actions"><button class="btn" data-act="export-csv">' + icon('download') + 'Exportar CSV</button><button class="btn" data-act="print">' + icon('printer') + 'Imprimir</button></div></div>' +

      '<div class="toolbar"><div class="segmented">' +
      Object.keys(periods).map(k => '<button type="button" class="' + (state.ui.period === k ? 'on' : '') + '" data-act="set-period" data-period="' + k + '">' + periods[k] + '</button>').join('') +
      '</div>' +
      (state.ui.period === 'custom'
        ? '<input type="date" class="input" style="width:auto" data-input="from" value="' + esc(state.ui.from || todayKey()) + '"><span class="muted">a</span><input type="date" class="input" style="width:auto" data-input="to" value="' + esc(state.ui.to || state.ui.from || todayKey()) + '">'
        : '') +
      '</div>' +

      '<div class="grid kpis">' +
      kpi('Ingresos totales', money(S.income), deltaChip(S.income, P.income, 'vs periodo anterior'), { hero: true }) +
      kpi('Cortes', money(S.incCortes), S.nCortes + (S.nCortes === 1 ? ' corte' : ' cortes') + ' · prom. ' + money(S.avgCorte), { color: 'var(--c-cortes)' }) +
      kpi('Productos', money(S.incProds), S.units + ' unid. · ganancia ' + money(S.incProds - S.cogs), { color: 'var(--c-productos)' }) +
      kpi('Ganancia neta', money(S.net), multi ? 'Promedio diario ' + money(S.net / S.days) : 'Ticket promedio ' + money(S.avgTicket), { color: S.net >= 0 ? 'var(--good)' : 'var(--bad)' }) +
      '</div>' +

      '<div class="grid grid-2" style="margin-top:16px">' +
      (chartKeys
        ? '<div class="card"><h3>Ingresos por día <small>prom. ' + money(S.income / S.days) + '/día</small></h3>' + barChart(chartKeys) + '</div>'
        : '<div class="card"><h3>Servicios realizados</h3>' + svcTable + '</div>') +
      '<div class="card"><h3>Estado de resultados</h3><div class="pl">' +
      '<div class="pl-row"><span>Ingresos por cortes</span><span>' + money(S.incCortes) + '</span></div>' +
      '<div class="pl-row"><span>Ingresos por productos</span><span>' + money(S.incProds) + '</span></div>' +
      '<div class="pl-row" style="font-weight:600"><span>Ingresos brutos</span><span>' + money(S.income) + '</span></div>' +
      '<div class="pl-row minus"><span>Costo de productos vendidos</span><span>' + minus(S.cogs) + '</span></div>' +
      '<div class="pl-row minus"><span>Gastos (' + S.expenses.length + ')</span><span>' + minus(S.exp) + '</span></div>' +
      '<div class="pl-row total ' + (S.net >= 0 ? 'pos' : 'neg') + '"><span>Ganancia neta</span><span>' + money(S.net) + '</span></div>' +
      '</div>' +
      '<h3 style="margin-top:22px">Métodos de pago</h3>' + payBreakdown(S.byPay, S.income) +
      '</div></div>' +

      (chartKeys ? '<div class="card" style="margin-top:16px"><h3>Servicios realizados</h3>' + svcTable + '</div>' : '') +
      '<div class="card" style="margin-top:16px"><h3>Productos vendidos</h3>' + prdTable + '</div>' +

      '<div class="section-title">Movimientos del periodo <span class="muted" style="text-transform:none;letter-spacing:0">' + (S.sales.length + S.expenses.length) + ' registros</span></div>' +
      '<div class="card">' +
      (S.sales.length || S.expenses.length
        ? '<div class="list">' + mergeActivity(S.sales, S.expenses).map(x => x.concept !== undefined ? expenseRow(x, { showDate: multi }) : saleRow(x, { showDate: multi })).join('') + '</div>'
        : emptyState('receipt', 'No hay movimientos en este periodo')) +
      '</div>';
  }

  function viewGastos() {
    const t = todayKey();
    const S = summary(t, t);
    const M = summary(t.slice(0, 8) + '01', t);
    const byCat = {};
    M.expenses.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + num(e.amount); });
    const cats = Object.keys(byCat).sort((a, b) => byCat[b] - byCat[a]);
    const recent = state.expenses.slice().sort((a, b) => b.at.localeCompare(a.at)).slice(0, 60);

    return '' +
      '<div class="page-head"><div><h1>Gastos</h1><p>Registra lo que sale para conocer tu ganancia real.</p></div></div>' +

      '<div class="grid kpis" style="margin-bottom:16px">' +
      kpi('Gastos de hoy', money(S.exp), S.expenses.length + ' registros', { color: 'var(--c-gastos)' }) +
      kpi('Gastos del mes', money(M.exp), M.expenses.length + ' registros', { color: 'var(--c-gastos)' }) +
      kpi('Ganancia del mes', money(M.net), 'Ingresos ' + money(M.income), { color: M.net >= 0 ? 'var(--good)' : 'var(--bad)' }) +
      '</div>' +

      '<div class="card"><h3>Agregar gasto</h3>' +
      '<form class="inline-form" id="expense-inline" novalidate>' +
      field('Concepto', '<input class="input" name="concept" placeholder="Ej. Navajas, alquiler…" maxlength="80">') +
      field('Categoría', '<select class="input" name="category">' + EXPENSE_CATS.map(c => '<option>' + esc(c) + '</option>').join('') + '</select>') +
      field('Monto', '<input class="input" name="amount" type="number" inputmode="decimal" step="0.01" min="0" placeholder="0.00">') +
      field('Fecha', '<input class="input" name="date" type="date" value="' + t + '">') +
      '<button class="btn btn-primary" type="submit">' + icon('plus') + 'Agregar</button>' +
      '</form></div>' +

      '<div class="grid grid-2" style="margin-top:16px">' +
      '<div class="card"><h3>Historial de gastos</h3>' +
      (recent.length ? '<div class="list">' + recent.map(e => expenseRow(e, { showDate: true })).join('') + '</div>' : emptyState('receipt', 'No has registrado gastos')) +
      '</div>' +
      '<div class="card"><h3>Por categoría <small>este mes</small></h3>' +
      (cats.length ? rankList(cats.map(c => ({ name: c, total: byCat[c], count: M.expenses.filter(e => e.category === c).length })), M.exp, 'var(--c-gastos)', c => c + (c === 1 ? ' gasto' : ' gastos')) : emptyState('wallet', 'Sin gastos este mes')) +
      '</div></div>';
  }

  function viewAjustes() {
    const s = state.settings;
    return '' +
      '<div class="page-head"><div><h1>Ajustes</h1><p>Configura tu negocio y administra tus datos.</p></div></div>' +

      '<div class="grid grid-2-even">' +
      '<div class="card"><h3>Mi negocio</h3>' +
      '<form id="settings-form" novalidate>' +
      field('Nombre del negocio', '<input class="input" name="business" value="' + esc(s.business) + '" maxlength="40">') +
      '<div class="field-row">' +
      field('Símbolo de moneda', '<input class="input" name="currency" value="' + esc(s.currency) + '" maxlength="5" placeholder="$, €, S/, Bs…">') +
      field('Decimales', '<select class="input" name="decimals"><option value="0"' + (+s.decimals === 0 ? ' selected' : '') + '>Sin decimales</option><option value="2"' + (+s.decimals === 2 ? ' selected' : '') + '>2 decimales</option></select>') +
      '</div>' +
      field('Meta de ingresos diaria', '<input class="input" name="goal" type="number" inputmode="decimal" min="0" step="1" value="' + esc(s.goal) + '">', 'Se muestra como barra de progreso en el Dashboard. 0 para ocultarla.') +
      field('Tema', '<select class="input" name="theme"><option value="auto"' + (s.theme === 'auto' ? ' selected' : '') + '>Automático</option><option value="light"' + (s.theme === 'light' ? ' selected' : '') + '>Claro</option><option value="dark"' + (s.theme === 'dark' ? ' selected' : '') + '>Oscuro</option></select>') +
      '<button class="btn btn-primary" type="submit">' + icon('check') + 'Guardar cambios</button>' +
      '</form></div>' +

      '<div class="stack">' +
      '<div class="card"><h3>Catálogo</h3>' +
      '<div class="list">' +
      '<div class="row"><div class="row-icon">' + icon('scissors') + '</div><div class="row-main"><div class="row-title">Servicios</div><div class="row-sub">' + state.services.length + ' servicios configurados</div></div><a class="btn btn-sm" href="#/cortes">Administrar</a></div>' +
      '<div class="row"><div class="row-icon producto">' + icon('bag') + '</div><div class="row-main"><div class="row-title">Productos</div><div class="row-sub">' + state.products.length + ' productos en catálogo</div></div><a class="btn btn-sm" href="#/productos">Administrar</a></div>' +
      '<div class="row"><div class="row-icon gasto">' + icon('receipt') + '</div><div class="row-main"><div class="row-title">Gastos</div><div class="row-sub">' + state.expenses.length + ' gastos registrados</div></div><a class="btn btn-sm" href="#/gastos">Administrar</a></div>' +
      '</div></div>' +

      '<div class="card"><h3>Copia de seguridad</h3>' +
      '<p class="muted" style="margin-top:0">Tus datos se guardan en este navegador. Descarga una copia regularmente o para pasarlos a otro dispositivo.</p>' +
      '<div class="head-actions"><button class="btn" data-act="backup">' + icon('download') + 'Descargar copia</button><button class="btn" data-act="restore">' + icon('upload') + 'Restaurar copia</button></div>' +
      '</div>' +

      '<div class="card danger-zone"><h3>Zona de peligro</h3>' +
      '<p class="muted" style="margin-top:0">' + state.sales.length + ' ventas y ' + state.expenses.length + ' gastos registrados.</p>' +
      '<div class="head-actions"><button class="btn btn-danger" data-act="clear-records">' + icon('trash') + 'Borrar registros</button><button class="btn btn-danger" data-act="reset-all">' + icon('trash') + 'Restablecer todo</button></div>' +
      '</div>' +
      '</div></div>';
  }

  /* ---------------- Router ---------------- */
  const ROUTES = {
    dashboard: { title: 'Dashboard', icon: 'dashboard', view: viewDashboard },
    cortes: { title: 'Cortes', icon: 'scissors', view: viewCortes },
    productos: { title: 'Productos', icon: 'bag', view: viewProductos },
    finanzas: { title: 'Finanzas', icon: 'chart', view: viewFinanzas },
    gastos: { title: 'Gastos', icon: 'wallet', view: viewGastos },
    ajustes: { title: 'Ajustes', icon: 'settings', view: viewAjustes }
  };

  function currentRoute() {
    const r = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    return ROUTES[r] ? r : 'dashboard';
  }

  function renderNav(active) {
    const links = Object.keys(ROUTES).map(k =>
      '<a href="#/' + k + '" class="' + (k === active ? 'active' : '') + '"' + (k === active ? ' aria-current="page"' : '') + '>' + icon(ROUTES[k].icon) + '<span>' + ROUTES[k].title + '</span></a>'
    ).join('');
    document.getElementById('nav').innerHTML = links;
    document.getElementById('bottom-nav').innerHTML = links;
    const t = todayKey();
    document.getElementById('sidebar-foot').innerHTML = 'Ingresos de hoy<strong>' + money(summary(t, t).income) + '</strong>';
    document.querySelectorAll('[data-bind="business"]').forEach(el => { el.textContent = state.settings.business || 'Mi Barbería'; });
    document.title = ROUTES[active].title + ' · ' + (state.settings.business || 'Barbería');
  }

  function applyTheme() {
    const th = state.settings.theme;
    if (th === 'light' || th === 'dark') document.documentElement.setAttribute('data-theme', th);
    else document.documentElement.removeAttribute('data-theme');
  }

  let lastRoute = null;
  function render() {
    const r = currentRoute();
    applyTheme();
    renderNav(r);
    const main = document.getElementById('view');
    main.innerHTML = ROUTES[r].view();
    bindView(r);
    if (lastRoute !== r) { window.scrollTo(0, 0); lastRoute = r; }
  }
  function rerender() {
    const y = window.scrollY;
    render();
    window.scrollTo(0, y);
  }

  function bindView(r) {
    if (r === 'gastos') {
      const f = document.getElementById('expense-inline');
      f.addEventListener('submit', e => {
        e.preventDefault();
        const fd = Object.fromEntries(new FormData(f).entries());
        if (!fd.concept.trim()) return invalid(f, 'concept', 'Escribe el concepto del gasto');
        if (num(fd.amount) <= 0) return invalid(f, 'amount', 'Escribe el monto');
        const now = new Date();
        let at = now;
        if (fd.date && fd.date !== dkey(now)) { at = keyToDate(fd.date); at.setHours(12, 0, 0, 0); }
        state.expenses.push({ id: uid(), concept: fd.concept.trim(), category: fd.category, amount: round2(num(fd.amount)), at: at.toISOString() });
        save(); toast('Gasto registrado'); rerender();
        const c = document.querySelector('#expense-inline [name=concept]'); if (c) c.focus();
      });
    }
    if (r === 'ajustes') {
      const f = document.getElementById('settings-form');
      f.addEventListener('submit', e => {
        e.preventDefault();
        const fd = Object.fromEntries(new FormData(f).entries());
        Object.assign(state.settings, {
          business: fd.business.trim() || 'Mi Barbería',
          currency: fd.currency.trim(),
          decimals: +fd.decimals,
          goal: Math.max(0, num(fd.goal)),
          theme: fd.theme
        });
        save(); toast('Ajustes guardados'); rerender();
      });
    }
    if (r === 'finanzas') {
      document.querySelectorAll('[data-input]').forEach(inp => {
        inp.addEventListener('change', () => {
          state.ui[inp.dataset.input] = inp.value;
          save(); rerender();
        });
      });
    }
  }

  /* ---------------- Exportar / respaldo ---------------- */
  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportCsv() {
    const [from, to] = periodRange();
    const S = summary(from, to);
    const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const rows = [['Fecha', 'Hora', 'Tipo', 'Concepto', 'Cantidad', 'Precio unitario', 'Total', 'Costo', 'Metodo de pago', 'Nota']];
    mergeActivity(S.sales, S.expenses).slice().reverse().forEach(x => {
      if (x.concept !== undefined) rows.push([dkey(x.at), timeOf(x.at), 'Gasto', x.concept + ' (' + x.category + ')', 1, -num(x.amount), -num(x.amount), '', '', '']);
      else rows.push([dkey(x.at), timeOf(x.at), x.kind === 'corte' ? 'Corte' : 'Producto', x.name, num(x.qty) || 1, num(x.price), saleTotal(x), saleCost(x), PAY[x.pay] || '', x.note || '']);
    });
    rows.push([]);
    rows.push(['', '', '', 'Ingresos cortes', '', '', S.incCortes]);
    rows.push(['', '', '', 'Ingresos productos', '', '', S.incProds]);
    rows.push(['', '', '', 'Costo productos', '', '', -S.cogs]);
    rows.push(['', '', '', 'Gastos', '', '', -S.exp]);
    rows.push(['', '', '', 'Ganancia neta', '', '', S.net]);
    const csv = '﻿' + rows.map(r => r.map(q).join(',')).join('\r\n');
    download('informe_' + from + (from !== to ? '_a_' + to : '') + '.csv', csv, 'text/csv;charset=utf-8');
    toast('Informe exportado');
  }

  function backup() {
    download('respaldo_barberia_' + todayKey() + '.json', JSON.stringify(state, null, 2), 'application/json');
    toast('Copia descargada');
  }

  document.getElementById('import-file').addEventListener('change', e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || !Array.isArray(data.sales) || !Array.isArray(data.services)) throw new Error('formato');
        if (!confirm('Esto reemplazará todos los datos actuales por los de la copia. ¿Continuar?')) return;
        state = normalize(data);
        save(); toast('Copia restaurada'); render();
      } catch (err) {
        toast('El archivo no es una copia válida', { error: true });
      }
    };
    reader.readAsText(file);
  });

  /* ---------------- Eventos globales ---------------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const id = el.dataset.id;
    switch (el.dataset.act) {
      case 'sell-service': sellService(id); break;
      case 'sell-product': sellProduct(id); break;
      case 'new-service': serviceForm(); break;
      case 'edit-service': serviceForm(id); break;
      case 'new-product': productForm(); break;
      case 'edit-product': productForm(id); break;
      case 'restock': restockForm(id); break;
      case 'custom-corte': customSaleForm('corte'); break;
      case 'custom-producto': customSaleForm('producto'); break;
      case 'edit-sale': editSaleForm(id); break;
      case 'del-sale': removeSale(id); rerender(); break;
      case 'edit-expense': expenseForm(id); break;
      case 'del-expense': {
        const ex = state.expenses.find(x => x.id === id);
        state.expenses = state.expenses.filter(x => x.id !== id);
        save(); rerender();
        if (ex) toast('Gasto eliminado', { action: 'Deshacer', onAction: () => { state.expenses.push(ex); save(); rerender(); } });
        break;
      }
      case 'set-pay': state.ui.pay = el.dataset.pay; save(); rerender(); break;
      case 'set-period':
        state.ui.period = el.dataset.period;
        if (state.ui.period === 'custom' && !state.ui.from) { state.ui.from = todayKey(); state.ui.to = todayKey(); }
        save(); rerender(); break;
      case 'export-csv': exportCsv(); break;
      case 'print': window.print(); break;
      case 'backup': backup(); break;
      case 'restore': document.getElementById('import-file').click(); break;
      case 'clear-records':
        if (confirm('¿Borrar todas las ventas y gastos? Se conservan tus servicios y productos. Esta acción no se puede deshacer.')) {
          state.sales = []; state.expenses = []; save(); toast('Registros borrados'); rerender();
        }
        break;
      case 'reset-all':
        if (confirm('¿Restablecer toda la aplicación? Se borrarán servicios, productos, ventas, gastos y ajustes.')) {
          state = seed(); save(); toast('Aplicación restablecida'); render();
        }
        break;
    }
  });

  window.addEventListener('hashchange', render);
  window.addEventListener('storage', e => { if (e.key === STORE_KEY) { state = load(); rerender(); } });

  // Si la app queda abierta pasada la medianoche, refrescar las métricas del día
  let dayShown = todayKey();
  setInterval(() => { if (todayKey() !== dayShown) { dayShown = todayKey(); if (!document.querySelector('.modal')) rerender(); } }, 60000);

  render();
})();
