// URL de la API
const API_URL = 'http://localhost:4000/api/products';
const MOVEMENTS_API_URL = 'http://localhost:4000/api/movements';

// Elementos del DOM
const inventoryTable = document.getElementById('inventoryTable').querySelector('tbody');
const movementsTable = document.getElementById('movementsTable').querySelector('tbody');

//Modals
const addProductModal = document.getElementById('addProductModal');
const deleteProductModal = document.getElementById('deleteProductModal');
const editProductModal = document.getElementById('editProductModal');

// Botones
const addProductBtn = document.getElementById('addProductBtn');
const deleteProductBtn = document.getElementById('deleteProductBtn');
const editProductBtn = document.getElementById('editProductBtn'); 
const closeAddProductModal = document.getElementById('closeAddProductModal');
const closeDeleteProductModal = document.getElementById('closeDeleteProductModal');
const closeEditProductModal = document.getElementById('closeEditProductModal');

const filterBtn = document.getElementById('filterMovementsBtn');
const tableContainer = document.getElementById('movementsTableContainer');


//  Estado inicial al cargar la app
tableContainer.style.display = 'none';
filterBtn.textContent = 'Buscar';




addProductBtn.addEventListener('click', () => {
  addProductModal.classList.remove('hidden');
    addProductModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

//Cerrar modal de agregar productos
closeAddProductModal.addEventListener('click', () => {
  addProductModal.classList.add('hidden');
});

// Mostrar modal para borrar productos
deleteProductBtn.addEventListener('click', () => {
  deleteProductModal.classList.remove('hidden');
    deleteProductModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

//Cerrar modal de eliminar prdocutos
closeDeleteProductModal.addEventListener('click', () => {
  deleteProductModal.classList.add('hidden');
});

// Mostrar modal de edición
editProductBtn.addEventListener('click', () => {
  editProductModal.classList.remove('hidden');
  editProductModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
  loadProductsForEdit();
  document.getElementById('editProductForm').classList.remove('hidden');
});

// **CERRAR MODAL DE EDICIÓN**
closeEditProductModal.addEventListener('click', () => {
  editProductModal.classList.add('hidden');
});

// **CARGAR PRODUCTOS EN EL SELECT DE EDICIÓN**
async function loadProductsForEdit() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener los productos');
    const products = await response.json();

    const editProductSelect = document.getElementById('editProductSelect');
    editProductSelect.innerHTML = '<option value="">Seleccione un producto</option>';

    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = product.nombre;
      editProductSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar productos para edición:', error);
  }
}

// **CARGAR DATOS DEL PRODUCTO SELECCIONADO**
document.getElementById('editProductSelect').addEventListener('change', async () => {
  const productId = document.getElementById('editProductSelect').value;
  if (!productId) return;

  try {
    const response = await fetch(`${API_URL}/${productId}`);
    if (!response.ok) throw new Error('Error al obtener los datos del producto');
    const product = await response.json();

  
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editCodigo').value = product.codigo;
    document.getElementById('editProductName').value = product.nombre;
    document.getElementById('editCategory').value = product.categoria;
    document.getElementById('editCostPrice').value = product.precio_costo;
    document.getElementById('editSalePrice').value = product.precio_venta;
  } catch (error) {
    console.error('Error al cargar datos del producto:', error);
  }
});

// **ACTUALIZAR PRODUCTO**
document.getElementById('editProductForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const productId = document.getElementById('editProductId').value;
  const updatedProduct = {
    nombre: document.getElementById('editProductName').value,
    codigo: document.getElementById('editCodigo').value.trim(),
    categoria: document.getElementById('editCategory').value,
    precio_costo: parseFloat(document.getElementById('editCostPrice').value),
    precio_venta: parseFloat(document.getElementById('editSalePrice').value),
  }

  try {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) throw new Error('Error al actualizar el producto');

    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Producto actualizado correctamente.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });

    editProductModal.classList.add('hidden');
    fetchProducts();
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    alert('Ocurrió un error al actualizar el producto');
  }
});

// **CARGAR PRODUCTOS Y MOVIMIENTOS AL INICIO**
fetchProducts();
fetchMovements();


// Obtener productos del inventario
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener los productos');
    const products = await response.json();
    renderProducts(products);
    populateProductSelect(products); 
  } catch (error) {
    console.error('Error:', error);
  }
}

// Renderizar productos en la tabla de inventario
function renderProducts(products) {
  inventoryTable.innerHTML = '';
  products.forEach(product => {
    const row = document.createElement('tr');
    if (product.stock <= 2) row.classList.add('low-stock');
    row.innerHTML = `
      <td>${product.nombre}</td>
      <td>${product.categoria}</td>
      <td>${product.codigo}</td>
      <td>${product.precio_costo.toFixed(2)}</td>
      <td>${product.precio_venta.toFixed(2)}</td>
      <td>${product.stock}</td>

    `;
    inventoryTable.appendChild(row);
  });
}

// Obtener movimientos
async function fetchMovements() {
  try {
    const response = await fetch(MOVEMENTS_API_URL);
    if (!response.ok) throw new Error('Error al obtener los movimientos');
    const movements = await response.json();
    renderMovements(movements);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Renderizar movimientos en la tabla
function renderMovements(movements) {
  movementsTable.innerHTML = ''; 
  movements.forEach(movement => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${movement.Product ? movement.Product.nombre : 'Desconocido'}</td>
      <td>${movement.tipo}</td>
      <td>${movement.cantidad}</td>
      <td>${new Date(movement.fecha).toLocaleString()}</td>
      <td>${movement.descripcion || 'Sin descripción'}</td>
    `;
    movementsTable.appendChild(row);
  });
}

// Registrar movimientos (evento del formulario)
document.getElementById('registerMovementForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const productId = document.getElementById('productSelect').value;
  const productName = document.getElementById('productSelect').selectedOptions[0].textContent;
  const type = document.getElementById('movementType').value;
  const quantity = Math.abs(parseInt(document.getElementById('quantity').value, 10));
  const description = document.getElementById('description').value.trim();

  if (!productId || !type || !quantity || isNaN(quantity)) {
    alert('Por favor completa todos los campos.');
    return;
  }

  Swal.fire({
    title: '¿Confirmar Registro?',
    html: `
      <p><strong>Producto:</strong> ${productName}</p>
      <p><strong>Tipo:</strong> ${type}</p>
      <p><strong>Cantidad:</strong> ${quantity}</p>
      <p><strong>Descripción:</strong> ${description || 'Sin descripción'}</p>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'btn-confirmar'
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${MOVEMENTS_API_URL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_producto: productId,
            tipo: type,
            cantidad: quantity,
            descripcion: description || null
          }),
        });

        if (!response.ok) throw new Error('Error al registrar el movimiento');

        Swal.fire({
          icon: 'success',
          title: '¡Movimiento registrado!',
          text: 'Se registró correctamente.',
          timer: 2000,
          showConfirmButton: false
        });

        fetchMovements();
        fetchProducts();

        document.getElementById('movementType').value = 'entrada';
        document.getElementById('quantity').value = '';
        document.getElementById('description').value = '';

      } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Ocurrió un error al registrar el movimiento.', 'error');
      }
    }
  });
});


fetchProducts();
fetchMovements();


// Rellenar el selector de productos
function populateProductSelect(products) {
  const productSelect = document.getElementById('productSelect');
  productSelect.innerHTML = '';
  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = product.nombre;
    productSelect.appendChild(option);
  });
}

// Función para llenar el selector de productos en el modal de eliminar
async function populateDeleteProductSelect() {
  const deleteProductSelect = document.getElementById('deleteProductSelect');
  deleteProductSelect.innerHTML = '';

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener los productos');
    const products = await response.json();

    // Agregar opciones al selector
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id; 
      option.textContent = product.nombre;
      deleteProductSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error al llenar el selector de productos para eliminar:', error);
  }
}

// Llamar a la función al abrir el modal de eliminar producto
deleteProductBtn.addEventListener('click', () => {
  populateDeleteProductSelect();
  deleteProductModal.classList.remove('hidden');
  deleteProductModal.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Lógica para eliminar un producto seleccionado
document.getElementById('confirmDeleteProductBtn').addEventListener('click', async () => {
  const deleteProductSelect = document.getElementById('deleteProductSelect');
  const productId = deleteProductSelect.value;

  if (!productId) {
    alert('Por favor, selecciona un producto válido para eliminar.');
    return;
  }

   const selectedName = deleteProductSelect.options[deleteProductSelect.selectedIndex].textContent;


  Swal.fire({
    title: '¿Estás seguro?',
    html: `<p>El producto <strong>${selectedName}</strong> será eliminado permanentemente.</p>`,
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminarlo',
    cancelButtonText: 'Cancelar',
    customClass: {
      confirmButton: 'btn-confirmar'
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/${productId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el producto.');
        }


        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El producto fue eliminado correctamente.',
          timer: 2000,
          showConfirmButton: false
        });

        deleteProductModal.classList.add('hidden');
        fetchProducts();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        Swal.fire('Error', 'Ocurrió un error al intentar eliminar el producto.', 'error');
      }
    }
  });
});

document.getElementById('addProductForm').addEventListener('submit', async (event) => {
  event.preventDefault(); 

  // Obtener los valores de los campos del formulario
  const name = document.getElementById('productName').value;
 const codigo = document.getElementById('codigo').value.trim();
  const category = document.getElementById('category').value;
  const costPrice = parseFloat(document.getElementById('costPrice').value);
  const salePrice = parseFloat(document.getElementById('salePrice').value);
  const stock = parseInt(document.getElementById('stock').value, 10);

  // Crear el objeto con los datos del producto
  const newProduct = {
    nombre: name,
    codigo: codigo,
    categoria: category,
    precio_costo: costPrice,
    precio_venta: salePrice,
    stock,
  };

  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) throw new Error('Error al registrar el producto');


    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Producto registrado correctamente.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
    document.getElementById('addProductModal').classList.add('hidden');
    fetchProducts();
  } catch (error) {
    console.error('Error:', error);
    alert('Ocurrió un error al registrar el producto');
  }
});

const productFilter = document.getElementById('productFilter');

// Función para obtener y llenar el filtro de productos
async function fetchProductsForFilter() {
  try {
    const response = await fetch(API_URL); 
    if (!response.ok) throw new Error('Error al obtener los productos');
    const products = await response.json();

    // Llenar el selector con las opciones de productos
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = product.nombre;
      productFilter.appendChild(option);
    });
  } catch (error) {
    console.error('Error al llenar el filtro de productos:', error);
  }
}

fetchProducts();
fetchMovements();
fetchProductsForFilter();

document.getElementById('filterMovementsBtn').addEventListener('click', async () => {
  const tableContainer = document.getElementById('movementsTableContainer');
  const filterBtn = document.getElementById('filterMovementsBtn');

  //  Si ya está visible, ocultarlo
  if (tableContainer.style.display === 'block') {
    tableContainer.style.display = 'none';
    filterBtn.textContent = 'Buscar';
    return;
  }

  //  Si está oculto, aplicar el filtro y mostrar
  const productId = document.getElementById('productFilter').value;
  const startDate = document.getElementById('startDate').value;
  const endDateInput = document.getElementById('endDate').value;

  let query = new URLSearchParams();

  let endDate = null;
  if (endDateInput) {
    const endDateTime = new Date(endDateInput);
    endDateTime.setHours(23, 59, 59, 999);
    endDate = endDateTime.toLocaleString('sv-SE').replace(' ', 'T');
  }

  if (startDate) query.append('fecha_inicio', new Date(startDate).toISOString());
  if (endDate) query.append('fecha_fin', endDate);
  if (productId) query.append('producto', productId);

  try {
    const response = await fetch(`${MOVEMENTS_API_URL}?${query}`);
    if (!response.ok) throw new Error('Error al filtrar los movimientos');
    const movements = await response.json();

    const tbody = document.querySelector('#movementsTable tbody');
    tbody.innerHTML = ''; 

    if (movements.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No se encontraron movimientos.</td></tr>';
    } else {
      renderMovements(movements);
    }

    //  Mostrar la tabla y cambiar texto del botón
    tableContainer.style.display = 'block';
    filterBtn.textContent = 'Ocultar historial';
    tableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    console.error('Error al filtrar movimientos:', error);
  }
});

document.getElementById('movementsTableContainer').style.display = 'none';

document.getElementById('productFilter').addEventListener('change', () => {
  const tableContainer = document.getElementById('movementsTableContainer');
  const filterBtn = document.getElementById('filterMovementsBtn');

  // Ocultar el historial si estaba visible
  tableContainer.style.display = 'none';

  // Reiniciar el botón a "Buscar"
  filterBtn.textContent = 'Buscar';
});

document.getElementById('startDate').addEventListener('change', () => {
  tableContainer.style.display = 'none';
  filterBtn.textContent = 'Buscar';
});

document.getElementById('endDate').addEventListener('change', () => {
  tableContainer.style.display = 'none';
  filterBtn.textContent = 'Buscar';
});
