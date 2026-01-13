// ==========================================
//   TabShop - Sistema de Logística E-commerce
//   JavaScript Functionality
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    initializeThemeToggle();
    initializeNavigation();
    initializeSidebarToggle();
    initializeForms();
    initializeLogistics();
    initializeUserDropdown();
});

// ==========================================
//   User Role Configuration
// ==========================================
const roleConfig = {
    admin: {
        name: 'Administrador',
        shortName: 'Admin',
        icon: 'fa-user-shield',
        color: '1e3a5f',
        pages: ['dashboard', 'produtos', 'vendedores', 'clientes', 'relatorios', 'logistica'],
        defaultPage: 'dashboard'
    },
    vendedor: {
        name: 'Vendedor',
        shortName: 'Vendedor',
        icon: 'fa-store',
        color: '10b981',
        pages: ['vendedores', 'produtos', 'clientes'],
        defaultPage: 'vendedores'
    },
    despachante: {
        name: 'Despachante',
        shortName: 'Despachante',
        icon: 'fa-truck',
        color: 'f59e0b',
        pages: ['logistica'],
        defaultPage: 'logistica'
    }
};

let currentRole = 'admin';

// ==========================================
//   User Dropdown Functionality
// ==========================================
function initializeUserDropdown() {
    const userProfileWrapper = document.querySelector('.user-profile-wrapper');
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDropdown = document.getElementById('userDropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // Toggle dropdown on click
    userProfileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        userProfileWrapper.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!userProfileWrapper.contains(e.target)) {
            userProfileWrapper.classList.remove('active');
        }
    });

    // Handle role selection
    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            const role = this.getAttribute('data-role');

            if (role === currentRole) {
                userProfileWrapper.classList.remove('active');
                return;
            }

            // Update active state
            dropdownItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Switch role
            switchRole(role);

            // Close dropdown
            userProfileWrapper.classList.remove('active');
        });
    });

    // Prevent dropdown link clicks from bubbling
    document.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            userProfileWrapper.classList.remove('active');

            if (this.classList.contains('logout')) {
                showToast('Saindo do sistema...', 'info');
                setTimeout(() => {
                    showToast('Você foi desconectado', 'success');
                }, 1000);
            } else {
                showToast('Configurações em breve...', 'info');
            }
        });
    });
}

function switchRole(role) {
    const config = roleConfig[role];
    if (!config) return;

    currentRole = role;

    // Update user profile display
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const sidebarMiniProfile = document.querySelector('.user-profile-mini');

    userAvatar.src = `https://ui-avatars.com/api/?name=${config.shortName}&background=${config.color}&color=fff`;
    userName.textContent = config.name;
    userRole.textContent = config.shortName;

    // Update sidebar mini profile
    if (sidebarMiniProfile) {
        sidebarMiniProfile.querySelector('img').src = `https://ui-avatars.com/api/?name=${config.shortName}&background=${config.color}&color=fff`;
        sidebarMiniProfile.querySelector('span').textContent = config.shortName;
    }

    // Update sidebar navigation visibility
    updateSidebarNavigation(config.pages);

    // Navigate to default page for this role
    navigateToPage(config.defaultPage);

    // Show notification
    showToast(`Perfil alterado para ${config.name}`, 'success');
}

function updateSidebarNavigation(allowedPages) {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        const pageName = item.getAttribute('data-page');

        if (allowedPages.includes(pageName)) {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.pointerEvents = 'auto';
        } else {
            item.style.display = 'none';
        }
    });
}

function navigateToPage(pageName) {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    // Remove active class from all nav items
    navItems.forEach(nav => nav.classList.remove('active'));

    // Find and activate the target nav item
    const targetNavItem = document.querySelector(`.nav-item[data-page="${pageName}"]`);
    if (targetNavItem) {
        targetNavItem.classList.add('active');
    }

    // Hide all pages
    pages.forEach(page => page.classList.add('hidden'));

    // Show the selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
}

// ==========================================
//   Theme Toggle (Light/Dark Mode)
// ==========================================
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('tabshop-theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', function () {
        const isDark = body.getAttribute('data-theme') === 'dark';

        if (isDark) {
            body.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('tabshop-theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('tabshop-theme', 'dark');
        }
    });
}

// ==========================================
//   Navigation Between Pages
// ==========================================
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Get the page to show
            const pageName = this.getAttribute('data-page');

            // Hide all pages
            pages.forEach(page => page.classList.add('hidden'));

            // Show the selected page
            const targetPage = document.getElementById(`${pageName}-page`);
            if (targetPage) {
                targetPage.classList.remove('hidden');
            }

            // Close sidebar on mobile
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('active');
        });
    });
}

// ==========================================
//   Sidebar Toggle (Mobile)
// ==========================================
function initializeSidebarToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', function () {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function (e) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// ==========================================
//   Form Handling
// ==========================================
function initializeForms() {
    initializeProductForm();
    initializeClientForm();
    initializeCPFMask();
    initializePhoneMask();
    initializeCEPMask();
    initializeCEPSearch();
}

function initializeProductForm() {
    const form = document.getElementById('productForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        clearFormErrors(form);

        // Validate form
        let isValid = true;

        const productName = document.getElementById('productName');
        const productPrice = document.getElementById('productPrice');
        const productCost = document.getElementById('productCost');
        const productStock = document.getElementById('productStock');
        const productUnit = document.getElementById('productUnit');

        if (!productName.value.trim()) {
            showFieldError(productName, 'Nome do produto é obrigatório');
            isValid = false;
        }

        if (!productPrice.value || parseFloat(productPrice.value) <= 0) {
            showFieldError(productPrice, 'Informe um preço válido');
            isValid = false;
        }

        if (!productCost.value || parseFloat(productCost.value) < 0) {
            showFieldError(productCost, 'Informe um custo válido');
            isValid = false;
        }

        if (!productStock.value || parseInt(productStock.value) < 0) {
            showFieldError(productStock, 'Informe um estoque válido');
            isValid = false;
        }

        if (!productUnit.value) {
            showFieldError(productUnit, 'Selecione uma unidade de medida');
            isValid = false;
        }

        if (isValid) {
            showToast('Produto cadastrado com sucesso!', 'success');
            form.reset();
        }
    });
}

function initializeClientForm() {
    const form = document.getElementById('clientForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        clearFormErrors(form);

        // Validate form
        let isValid = true;

        const clientName = document.getElementById('clientName');
        const clientCpf = document.getElementById('clientCpf');
        const clientCep = document.getElementById('clientCep');
        const clientStreet = document.getElementById('clientStreet');
        const clientNumber = document.getElementById('clientNumber');
        const clientNeighborhood = document.getElementById('clientNeighborhood');
        const clientCity = document.getElementById('clientCity');
        const clientState = document.getElementById('clientState');

        if (!clientName.value.trim()) {
            showFieldError(clientName, 'Nome é obrigatório');
            isValid = false;
        }

        if (!validateCPF(clientCpf.value)) {
            showFieldError(clientCpf, 'CPF inválido');
            isValid = false;
        }

        if (!clientCep.value || clientCep.value.length < 9) {
            showFieldError(clientCep, 'CEP é obrigatório');
            isValid = false;
        }

        if (!clientStreet.value.trim()) {
            showFieldError(clientStreet, 'Logradouro é obrigatório');
            isValid = false;
        }

        if (!clientNumber.value.trim()) {
            showFieldError(clientNumber, 'Número é obrigatório');
            isValid = false;
        }

        if (!clientNeighborhood.value.trim()) {
            showFieldError(clientNeighborhood, 'Bairro é obrigatório');
            isValid = false;
        }

        if (!clientCity.value.trim()) {
            showFieldError(clientCity, 'Cidade é obrigatória');
            isValid = false;
        }

        if (!clientState.value) {
            showFieldError(clientState, 'UF é obrigatória');
            isValid = false;
        }

        if (isValid) {
            showToast('Cliente cadastrado com sucesso!', 'success');
            form.reset();
        }
    });
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('error');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}

function clearFormErrors(form) {
    const errorGroups = form.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    });
}

// CPF Validation
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[10])) return false;

    return true;
}

// Input Masks
function initializeCPFMask() {
    const cpfInput = document.getElementById('clientCpf');

    cpfInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        }

        e.target.value = value;
    });
}

function initializePhoneMask() {
    const phoneInput = document.getElementById('clientPhone');

    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 10) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        }

        e.target.value = value;
    });
}

function initializeCEPMask() {
    const cepInputs = document.querySelectorAll('#clientCep, #destinationCep');

    cepInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 8) {
                value = value.slice(0, 8);
            }

            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d{1,3})/, '$1-$2');
            }

            e.target.value = value;
        });
    });
}

function initializeCEPSearch() {
    const cepSearchBtn = document.querySelector('.cep-search');

    cepSearchBtn.addEventListener('click', function () {
        const cepInput = document.getElementById('clientCep');
        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            showToast('Digite um CEP válido', 'warning');
            return;
        }

        // Simulate CEP search (in real app, would use ViaCEP API)
        showToast('Buscando endereço...', 'info');

        setTimeout(() => {
            // Simulated response
            document.getElementById('clientStreet').value = 'Rua Exemplo';
            document.getElementById('clientNeighborhood').value = 'Centro';
            document.getElementById('clientCity').value = 'São Paulo';
            document.getElementById('clientState').value = 'SP';

            showToast('Endereço encontrado!', 'success');
        }, 1000);
    });
}

// ==========================================
//   Logistics Functionality (Multi-Select)
// ==========================================
function initializeLogistics() {
    initializeMultiSelectOrders();
    initializeBatchActions();
    initializeRefreshPrices();
}

let selectedOrders = new Set();

function initializeMultiSelectOrders() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const orderCheckboxes = document.querySelectorAll('.order-checkbox');
    const selectAllBtn = document.getElementById('selectAllBtn');

    // Select All checkbox in table header
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function () {
            const isChecked = this.checked;
            orderCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                const row = checkbox.closest('tr');
                if (isChecked) {
                    row.classList.add('selected');
                    selectedOrders.add(row.getAttribute('data-order'));
                } else {
                    row.classList.remove('selected');
                    selectedOrders.delete(row.getAttribute('data-order'));
                }
            });
            updateBatchBar();
        });
    }

    // Individual checkboxes
    orderCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const row = this.closest('tr');
            const orderId = row.getAttribute('data-order');

            if (this.checked) {
                row.classList.add('selected');
                selectedOrders.add(orderId);
            } else {
                row.classList.remove('selected');
                selectedOrders.delete(orderId);
            }

            // Update select all checkbox state
            const allChecked = [...orderCheckboxes].every(cb => cb.checked);
            const someChecked = [...orderCheckboxes].some(cb => cb.checked);
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate = someChecked && !allChecked;
            }

            updateBatchBar();
        });
    });

    // Select All button
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', function () {
            const allSelected = selectedOrders.size === orderCheckboxes.length;

            orderCheckboxes.forEach(checkbox => {
                checkbox.checked = !allSelected;
                const row = checkbox.closest('tr');
                if (!allSelected) {
                    row.classList.add('selected');
                    selectedOrders.add(row.getAttribute('data-order'));
                } else {
                    row.classList.remove('selected');
                    selectedOrders.delete(row.getAttribute('data-order'));
                }
            });

            if (selectAllCheckbox) {
                selectAllCheckbox.checked = !allSelected;
            }

            updateBatchBar();

            this.innerHTML = allSelected
                ? '<i class="fas fa-check-double"></i> Selecionar Todos'
                : '<i class="fas fa-times"></i> Desmarcar Todos';
        });
    }
}

function updateBatchBar() {
    const count = selectedOrders.size;
    const selectedCountEl = document.getElementById('selectedCount');
    const labelCountEl = document.getElementById('labelCount');
    const totalFreightEl = document.getElementById('totalFreight');
    const generateLabelsBtn = document.getElementById('generateLabelsBtn');
    const confirmBatchDispatch = document.getElementById('confirmBatchDispatch');

    // Update count
    if (selectedCountEl) selectedCountEl.textContent = count;
    if (labelCountEl) labelCountEl.textContent = count;

    // Calculate total freight
    let totalFreight = 0;
    selectedOrders.forEach(orderId => {
        const row = document.querySelector(`tr[data-order="${orderId}"]`);
        if (row) {
            const priceEl = row.querySelector('.freight-price');
            if (priceEl) {
                totalFreight += parseFloat(priceEl.getAttribute('data-price') || 0);
            }
        }
    });

    if (totalFreightEl) {
        totalFreightEl.textContent = `R$ ${totalFreight.toFixed(2).replace('.', ',')}`;
    }

    // Enable/disable buttons
    if (generateLabelsBtn) generateLabelsBtn.disabled = count === 0;
    if (confirmBatchDispatch) confirmBatchDispatch.disabled = count === 0;
}

function initializeBatchActions() {
    const generateLabelsBtn = document.getElementById('generateLabelsBtn');
    const confirmBatchDispatch = document.getElementById('confirmBatchDispatch');

    // Generate Labels for all selected
    if (generateLabelsBtn) {
        generateLabelsBtn.addEventListener('click', function () {
            if (selectedOrders.size === 0) {
                showToast('Selecione pelo menos um pedido', 'warning');
                return;
            }

            showToast(`Gerando ${selectedOrders.size} etiqueta(s)...`, 'info');

            setTimeout(() => {
                generatePrintableLabels();
            }, 500);
        });
    }

    // Confirm Batch Dispatch
    if (confirmBatchDispatch) {
        confirmBatchDispatch.addEventListener('click', function () {
            if (selectedOrders.size === 0) {
                showToast('Selecione pelo menos um pedido', 'warning');
                return;
            }

            const count = selectedOrders.size;
            showToast(`Confirmando despacho de ${count} pedido(s)...`, 'info');

            setTimeout(() => {
                // Remove dispatched orders from table
                selectedOrders.forEach(orderId => {
                    const row = document.querySelector(`tr[data-order="${orderId}"]`);
                    if (row) {
                        row.style.animation = 'slideOut 0.3s ease forwards';
                        setTimeout(() => row.remove(), 300);
                    }
                });

                selectedOrders.clear();
                updateBatchBar();

                showToast(`${count} pedido(s) despachado(s) com sucesso!`, 'success');
            }, 1000);
        });
    }
}

function generatePrintableLabels() {
    const labelsData = [];

    selectedOrders.forEach(orderId => {
        const row = document.querySelector(`tr[data-order="${orderId}"]`);
        if (row) {
            const client = row.cells[2].textContent;
            const destination = row.cells[3].textContent.replace(/^\s*/, '');
            const items = row.cells[4].textContent;
            const value = row.cells[5].textContent;
            const carrier = row.querySelector('.carrier-select');
            const carrierName = carrier ? carrier.options[carrier.selectedIndex].text.split(' - ')[0] : 'PAC';

            labelsData.push({
                orderId: orderId,
                client: client,
                destination: destination,
                items: items,
                value: value,
                carrier: carrierName,
                date: new Date().toLocaleDateString('pt-BR')
            });
        }
    });

    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Etiquetas de Envio - TabShop</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Arial', sans-serif; padding: 20px; }
                .labels-container { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
                .shipping-label {
                    width: 100mm;
                    min-height: 140mm;
                    border: 2px solid #000;
                    padding: 15px;
                    page-break-inside: avoid;
                    background: #fff;
                }
                .label-header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }
                .label-header h1 { font-size: 18px; margin-bottom: 5px; }
                .label-header .order-id { font-size: 14px; color: #666; }
                .label-section { margin-bottom: 15px; }
                .label-section h3 { font-size: 12px; color: #666; margin-bottom: 5px; text-transform: uppercase; }
                .label-section p { font-size: 14px; font-weight: 600; }
                .barcode { text-align: center; font-family: 'Libre Barcode 39', monospace; font-size: 40px; margin: 20px 0; letter-spacing: 5px; }
                .carrier-badge { display: inline-block; background: #1e3a5f; color: #fff; padding: 5px 15px; border-radius: 4px; font-weight: bold; }
                .label-footer { text-align: center; font-size: 10px; color: #999; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc; }
                @media print {
                    body { padding: 0; }
                    .no-print { display: none; }
                    .shipping-label { page-break-after: always; margin: 0; }
                }
                .print-btn { display: block; margin: 20px auto; padding: 15px 40px; background: #1e3a5f; color: #fff; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
                .print-btn:hover { background: #2d5a8a; }
            </style>
        </head>
        <body>
            <button class="print-btn no-print" onclick="window.print()">🖨️ Imprimir Etiquetas</button>
            <div class="labels-container">
                ${labelsData.map(label => `
                    <div class="shipping-label">
                        <div class="label-header">
                            <h1>TabShop Logística</h1>
                            <span class="order-id">${label.orderId}</span>
                        </div>
                        <div class="label-section">
                            <h3>Destinatário</h3>
                            <p>${label.client}</p>
                        </div>
                        <div class="label-section">
                            <h3>Endereço</h3>
                            <p>${label.destination}</p>
                        </div>
                        <div class="label-section">
                            <h3>Conteúdo</h3>
                            <p>${label.items} • ${label.value}</p>
                        </div>
                        <div class="barcode">*${label.orderId.replace('#', '')}*</div>
                        <div class="label-section" style="text-align: center;">
                            <span class="carrier-badge">${label.carrier}</span>
                        </div>
                        <div class="label-footer">
                            Emitido em ${label.date} • TabShop Sistema de Logística
                        </div>
                    </div>
                `).join('')}
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();

    showToast(`${labelsData.length} etiqueta(s) gerada(s) - Página de impressão aberta!`, 'success');
}

function initializeRefreshPrices() {
    const refreshBtn = document.getElementById('refreshPrices');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            showToast('Atualizando preços de frete...', 'info');

            // Simulate API call to Correios
            const rows = document.querySelectorAll('#ordersTableBody tr');

            rows.forEach(row => {
                const freightPrice = row.querySelector('.freight-price');
                if (freightPrice) {
                    // Simulate price variation
                    const currentPrice = parseFloat(freightPrice.getAttribute('data-price'));
                    const variation = (Math.random() - 0.5) * 5; // +/- R$ 2.50
                    const newPrice = Math.max(15, currentPrice + variation);

                    freightPrice.setAttribute('data-price', newPrice.toFixed(2));
                    freightPrice.textContent = `R$ ${newPrice.toFixed(2).replace('.', ',')}`;

                    // Update carrier select options
                    const carrierSelect = row.querySelector('.carrier-select');
                    if (carrierSelect) {
                        const pacPrice = newPrice;
                        const sedexPrice = newPrice * 1.6;
                        const jadlogPrice = newPrice * 1.25;

                        carrierSelect.innerHTML = `
                            <option value="pac" selected>PAC - R$ ${pacPrice.toFixed(2).replace('.', ',')}</option>
                            <option value="sedex">SEDEX - R$ ${sedexPrice.toFixed(2).replace('.', ',')}</option>
                            <option value="jadlog">JadLog - R$ ${jadlogPrice.toFixed(2).replace('.', ',')}</option>
                        `;
                    }
                }
            });

            updateBatchBar();
            showToast('Preços atualizados com sucesso!', 'success');
        });
    }
}

// ==========================================
//   Toast Notifications
// ==========================================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon;
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-times-circle';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            break;
        default:
            icon = 'fa-info-circle';
    }

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ==========================================
//   Dashboard Actions (Approve Order)
// ==========================================
document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-primary.btn-sm') && e.target.textContent.includes('Aprovar')) {
        const btn = e.target.closest('.btn');
        const row = btn.closest('tr');
        const orderId = row.querySelector('td strong').textContent;

        showToast(`Aprovando pedido ${orderId}...`, 'info');

        setTimeout(() => {
            // Update badge
            const badge = row.querySelector('.badge');
            badge.className = 'badge badge-info';
            badge.textContent = 'Aprovado';

            // Change button
            btn.className = 'btn btn-outline btn-sm';
            btn.textContent = 'Ver Detalhes';

            showToast(`Pedido ${orderId} aprovado com sucesso!`, 'success');
        }, 1000);
    }
});
