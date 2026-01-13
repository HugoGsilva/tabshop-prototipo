// ==========================================
//   TabShop - Configurações Externas
//   Edite este arquivo para alterar URLs e parâmetros
// ==========================================

const CONFIG = {
    // API dos Correios (simulada - substitua pela real quando tiver contrato)
    // Documentação: https://www.correios.com.br/atendimento/developers
    correiosAPI: {
        baseUrl: "https://api.correios.com.br", // URL base da API
        calcPrecoUrl: "/preco/v1/nacional",     // Endpoint de cálculo
        timeout: 5000,                          // Timeout em ms

        // Credenciais (preencher com dados reais)
        usuario: "",
        senha: "",
        codigoEmpresa: "",

        // CEP de origem (seu armazém/centro de distribuição)
        cepOrigem: "01310-100"
    },

    // Códigos de serviço dos Correios
    servicosCorreios: {
        SEDEX: "04014",
        PAC: "04510",
        SEDEX_10: "40215",
        SEDEX_12: "40169",
        SEDEX_HOJE: "40290"
    },

    // Transportadoras alternativas (para quando não usar Correios)
    transportadoras: [
        {
            id: "sedex",
            nome: "SEDEX",
            logo: "sedex",
            // Fórmula simulada: base + (distância estimada * fator)
            precoBase: 25.00,
            fatorDistancia: 0.005,
            prazoBase: 2,
            prazoMax: 3
        },
        {
            id: "pac",
            nome: "PAC",
            logo: "pac",
            precoBase: 15.00,
            fatorDistancia: 0.003,
            prazoBase: 5,
            prazoMax: 8
        },
        {
            id: "jadlog",
            nome: "JadLog",
            logo: "jadlog",
            precoBase: 20.00,
            fatorDistancia: 0.004,
            prazoBase: 3,
            prazoMax: 5
        },
        {
            id: "azul",
            nome: "Azul Cargo",
            logo: "azul",
            precoBase: 35.00,
            fatorDistancia: 0.006,
            prazoBase: 1,
            prazoMax: 2
        }
    ],

    // Configurações de etiqueta
    etiqueta: {
        largura: "100mm",
        altura: "150mm",
        formatoData: "DD/MM/YYYY"
    },

    // Modo de simulação (true = usa valores fictícios, false = chama API real)
    modoSimulacao: true
};

// Exportar para uso global
window.CONFIG = CONFIG;
