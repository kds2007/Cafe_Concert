let total = 0;

// Actualizar total dinámico
function actualizarTotal() {
  total = 0;
  document.querySelectorAll('.cantidad-control').forEach(control => {
    const cantidad = parseInt(control.querySelector('.cantidad').textContent);
    const precio = parseInt(control.dataset.precio);
    total += cantidad * precio;
  });
  document.getElementById('total-container').textContent = "Total: $" + total;
}

// Botones + / -
document.querySelectorAll('.mas').forEach(btn => {
  btn.addEventListener('click', () => {
    const control = btn.parentElement;
    let cantidad = parseInt(control.querySelector('.cantidad').textContent);
    control.querySelector('.cantidad').textContent = cantidad + 1;

    // --- Animación ---
    const card = btn.closest('.card'); // Encuentra la tarjeta padre
    card.classList.add('agregado'); // Añade la clase para la animación

    // Quita la clase después de que termine la animación (400ms)
    setTimeout(() => {
      card.classList.remove('agregado');
    }, 400);
    // --- Fin Animación ---

    actualizarTotal();
  });
});

document.querySelectorAll('.menos').forEach(btn => {
  btn.addEventListener('click', () => {
    const control = btn.parentElement;
    let cantidad = parseInt(control.querySelector('.cantidad').textContent);
    if (cantidad > 0) {
      control.querySelector('.cantidad').textContent = cantidad - 1;
      actualizarTotal();
    }
  });
});

// Mostrar/ocultar alias según método de pago
const metodoPago = document.getElementById('metodo-pago');
const aliasDiv = document.getElementById('alias');

metodoPago.addEventListener('change', () => {
  aliasDiv.style.display = metodoPago.value === "MercadoPago" ? "block" : "none";
});

// Enviar pedido por WhatsApp
document.querySelector('.enviar').addEventListener('click', () => {
  const nombre = document.getElementById('nombre').value.trim();
  const mesa = document.getElementById('mesa').value.trim();
  const pago = metodoPago.value;

  if (!nombre || !mesa) {
    alert("Por favor completá tu nombre y número de mesa.");
    return;
  }

  let pedido = "";
  document.querySelectorAll('.cantidad-control').forEach(control => {
    const cantidad = parseInt(control.querySelector('.cantidad').textContent);
    const item = control.dataset.nombre;

    if (cantidad > 0) {
      // Revisa si hay un selector de sabor en la tarjeta
      const cardBody = control.closest('.card-body');
      const saborSelect = cardBody.querySelector('.sabor-select');
      let detalleItem = `${cantidad} x ${item}`;
      if (saborSelect) {
        detalleItem += ` (Sabor: ${saborSelect.value})`;
      }
      pedido += detalleItem + '\n';
    }
  });

  if (!pedido) {
    alert("Seleccioná al menos un producto.");
    return;
  }

  const aliasTexto = pago === "MercadoPago" ? "\nAlias: cofee.concert" : "";
  const mensaje = `Hola! Soy ${nombre}, mesa ${mesa}.\nMi pedido es:\n${pedido}\nTotal: $${total}\nPago con: ${pago}${aliasTexto}`;
  const url = `https://wa.me/5493764659430?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
});

actualizarTotal();
