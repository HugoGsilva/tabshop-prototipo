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
//   Logistics Functionality
// ==========================================
function initializeLogistics() {
    initializeOrderSelection();
    initializeShippingCalculation();
    initializeDispatchActions();
}

let selectedOrder = null;

function initializeOrderSelection() {
    const selectButtons = document.querySelectorAll('.select-order');

    selectButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const orderItem = this.closest('.order-item');
            const orderId = orderItem.getAttribute('data-order');

            // Remove selection from all orders
            document.querySelectorAll('.order-item').forEach(item => {
                item.classList.remove('selected');
                item.querySelector('.select-order').textContent = 'Selecionar';
            });

            // Select this order
            orderItem.classList.add('selected');
            this.textContent = 'Selecionado';

            // Update selected order info
            selectedOrder = {
                id: orderId,
                client: orderItem.querySelector('.order-info span').textContent,
                value: orderItem.querySelector('.order-items').textContent
            };

            // Show selected order info
            const selectedOrderInfo = document.getElementById('selectedOrderInfo');
            document.getElementById('selectedOrderId').textContent = `#${orderId}`;
            document.getElementById('selectedOrderClient').textContent = selectedOrder.client;
            document.getElementById('selectedOrderValue').textContent = selectedOrder.value;
            selectedOrderInfo.classList.remove('hidden');

            showToast(`Pedido ${orderId} selecionado`, 'success');
        });
    });
}

function initializeShippingCalculation() {
    const shippingForm = document.getElementById('shippingForm');

    shippingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!selectedOrder) {
            showToast('Selecione um pedido primeiro', 'warning');
            return;
        }

        const cep = document.getElementById('destinationCep').value.replace(/\D/g, '');

        if (cep.length !== 8) {
            showToast('Digite um CEP válido', 'warning');
            return;
        }

        // Simulate shipping calculation
        showToast('Calculando frete...', 'info');

        setTimeout(() => {
            const shippingOptions = document.getElementById('shippingOptions');
            shippingOptions.classList.remove('hidden');

            showToast('Opções de frete carregadas!', 'success');
        }, 1000);
    });
}

function initializeDispatchActions() {
    const generateLabelBtn = document.getElementById('generateLabel');
    const confirmDispatchBtn = document.getElementById('confirmDispatch');
    const carrierInputs = document.querySelectorAll('input[name="carrier"]');

    // Enable buttons when carrier is selected
    carrierInputs.forEach(input => {
        input.addEventListener('change', function () {
            generateLabelBtn.disabled = false;
            confirmDispatchBtn.disabled = false;
        });
    });

    generateLabelBtn.addEventListener('click', function () {
        if (this.disabled) return;

        const selectedCarrier = document.querySelector('input[name="carrier"]:checked');
        if (!selectedCarrier) {
            showToast('Selecione uma transportadora', 'warning');
            return;
        }

        showToast('Gerando etiqueta de envio...', 'info');

        setTimeout(() => {
            showToast('Etiqueta gerada com sucesso! Download iniciado.', 'success');
        }, 1500);
    });

    confirmDispatchBtn.addEventListener('click', function () {
        if (this.disabled) return;

        const selectedCarrier = document.querySelector('input[name="carrier"]:checked');
        if (!selectedCarrier) {
            showToast('Selecione uma transportadora', 'warning');
            return;
        }

        showToast('Confirmando despacho...', 'info');

        setTimeout(() => {
            showToast(`Pedido ${selectedOrder.id} despachado com sucesso!`, 'success');

            // Remove the order from the list
            const orderItem = document.querySelector(`[data-order="${selectedOrder.id}"]`);
            if (orderItem) {
                orderItem.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    orderItem.remove();

                    // Update pending orders count
                    const badge = document.querySelector('.approved-orders-card .badge');
                    const count = document.querySelectorAll('.order-item').length;
                    badge.textContent = `${count} pedidos`;
                }, 300);
            }

            // Reset selection
            selectedOrder = null;
            document.getElementById('selectedOrderInfo').classList.add('hidden');
            document.getElementById('shippingOptions').classList.add('hidden');
            document.getElementById('destinationCep').value = '';
            document.querySelectorAll('input[name="carrier"]').forEach(i => i.checked = false);
            generateLabelBtn.disabled = true;
            confirmDispatchBtn.disabled = true;
        }, 1500);
    });
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
