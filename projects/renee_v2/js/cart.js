/* Renée — Coș pe localStorage. WP: la migrare → WC()->cart (sesiune server). */
(function(){
  var KEY = 'renee_cart_v1';
  var listeners = [];

  function read(){
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch(e){ return []; }
  }
  function write(items){
    localStorage.setItem(KEY, JSON.stringify(items));
    for (var i=0;i<listeners.length;i++){ listeners[i](items); }
    updateBadge();
  }
  function keyOf(id, variation){ return id + '|' + (variation || ''); }

  var Cart = {
    FREE_THRESHOLD: 500,
    FLAT_FEE: 40,

    items: function(){ return read(); },

    add: function(item){
      var items = read();
      var k = keyOf(item.id, item.variation);
      for (var i=0;i<items.length;i++){
        if (keyOf(items[i].id, items[i].variation) === k){
          items[i].qty += (item.qty || 1);
          write(items); return;
        }
      }
      items.push({
        id: item.id, name: item.name, price: item.price,
        variation: item.variation || '', qty: item.qty || 1, image: item.image || ''
      });
      write(items);
    },

    setQty: function(id, variation, qty){
      var items = read(), k = keyOf(id, variation);
      for (var i=0;i<items.length;i++){
        if (keyOf(items[i].id, items[i].variation) === k){
          items[i].qty = Math.max(1, qty); break;
        }
      }
      write(items);
    },

    remove: function(id, variation){
      var items = read(), k = keyOf(id, variation), out = [];
      for (var i=0;i<items.length;i++){
        if (keyOf(items[i].id, items[i].variation) !== k) out.push(items[i]);
      }
      write(out);
    },

    clear: function(){ write([]); },

    count: function(){
      var items = read(), n = 0;
      for (var i=0;i<items.length;i++){ n += items[i].qty; }
      return n;
    },

    subtotal: function(){
      var items = read(), s = 0;
      for (var i=0;i<items.length;i++){ s += items[i].price * items[i].qty; }
      return s;
    },

    shipping: function(method){
      if (method === 'pickup') return 0;
      return this.subtotal() >= this.FREE_THRESHOLD ? 0 : this.FLAT_FEE;
    },

    total: function(method){ return this.subtotal() + this.shipping(method); },

    onChange: function(fn){ listeners.push(fn); },

    updateBadge: updateBadge
  };

  function updateBadge(){
    var el = document.getElementById('cartCount');
    if (!el) return;
    var n = Cart.count();
    el.textContent = n;
    el.className = 'cart-count' + (n === 0 ? ' empty' : '');
  }

  window.Cart = Cart;
  document.addEventListener('DOMContentLoaded', updateBadge);
})();
