// ==========================================
// CONFIGURAÇÃO DO SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://duvwemmqgdwlastmfegh.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_vlsLJ9-0Jrij35lSz3cigQ_entN7J8c";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// PREÇOS
// ==========================================

const PRECO_SALGADO = 6.00;
const PRECO_SUCO = 3.50;
const PRECO_ACAI = 3.50;


// ==========================================
// QUANTIDADES
// ==========================================

let quantidades = {
    salgado: 1,
    suco: 1,
    acai: 1
};


// ==========================================
// ALTERAR QUANTIDADE
// ==========================================

function alterarQuantidade(produto, valor) {

    quantidades[produto] += valor;

    if (quantidades[produto] < 1) {
        quantidades[produto] = 1;
    }

    if (produto === "salgado") {
        document.getElementById("qtdSalgado").textContent =
            quantidades.salgado;
    }

    if (produto === "suco") {
        document.getElementById("qtdSuco").textContent =
            quantidades.suco;
    }

    if (produto === "acai") {
        document.getElementById("qtdAcai").textContent =
            quantidades.acai;
    }

    atualizarTotal();
}


// ==========================================
// CALCULAR TOTAL
// ==========================================

function calcularTotal() {

    let total = 0;

    if (document.getElementById("checkSalgado").checked) {
        total += PRECO_SALGADO * quantidades.salgado;
    }

    if (document.getElementById("checkSuco").checked) {
        total += PRECO_SUCO * quantidades.suco;
    }

    if (document.getElementById("checkAcai").checked) {
        total += PRECO_ACAI * quantidades.acai;
    }

    return total;
}


// ==========================================
// ATUALIZAR TOTAL
// ==========================================

function atualizarTotal() {

    const total = calcularTotal();

    document.getElementById("total").textContent =
        total.toFixed(2).replace(".", ",");
}


// ==========================================
// FAZER PEDIDO
// ==========================================

async function fazerPedido() {

    const nome =
        document.getElementById("nome").value.trim();

    const turma =
        document.getElementById("turma").value.trim();

    const salgadoSelecionado =
        document.getElementById("checkSalgado").checked;

    const sucoSelecionado =
        document.getElementById("checkSuco").checked;

    const acaiSelecionado =
        document.getElementById("checkAcai").checked;


    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (!nome) {

        mostrarMensagem(
            "Digite o nome do aluno.",
            false
        );

        document.getElementById("nome").focus();

        return;
    }


    if (!turma) {

        mostrarMensagem(
            "Digite a turma.",
            false
        );

        document.getElementById("turma").focus();

        return;
    }


    if (
        !salgadoSelecionado &&
        !sucoSelecionado &&
        !acaiSelecionado
    ) {

        mostrarMensagem(
            "Selecione pelo menos um produto.",
            false
        );

        return;
    }


    // ==========================================
    // MONTAR ITENS DO PEDIDO
    // ==========================================

    const itens = [];


    if (salgadoSelecionado) {

        itens.push({
            produto: "Salgado",
            quantidade: quantidades.salgado,
            preco: PRECO_SALGADO,
            subtotal:
                PRECO_SALGADO * quantidades.salgado
        });

    }


    if (sucoSelecionado) {

        itens.push({
            produto: "Suco",
            quantidade: quantidades.suco,
            preco: PRECO_SUCO,
            subtotal:
                PRECO_SUCO * quantidades.suco
        });

    }


    if (acaiSelecionado) {

        itens.push({
            produto: "Açaí",
            quantidade: quantidades.acai,
            preco: PRECO_ACAI,
            subtotal:
                PRECO_ACAI * quantidades.acai
        });

    }


    // ==========================================
    // TOTAL
    // ==========================================

    const total = calcularTotal();


    // ==========================================
    // BOTÃO
    // ==========================================

    const botao =
        document.getElementById("botaoPedido");

    botao.disabled = true;

    botao.textContent =
        "⏳ Enviando pedido...";


    try {

        // ==========================================
        // ENVIAR PARA O SUPABASE
        // ==========================================

        const resultado =
            await supabaseClient
                .from("pedidos")
                .insert({

                    nome: nome,

                    turma: turma,

                    itens: itens,

                    total: total

                });


        // ==========================================
        // VERIFICAR ERRO
        // ==========================================

        if (resultado.error) {

            console.error(
                "Erro do Supabase:",
                resultado.error
            );

            throw resultado.error;
        }


        // ==========================================
        // SUCESSO
        // ==========================================

        mostrarMensagem(
            "✅ Pedido enviado com sucesso!",
            true
        );


        // ==========================================
        // LIMPAR FORMULÁRIO
        // ==========================================

        document.getElementById("nome").value = "";

        document.getElementById("turma").value = "";

        document.getElementById("checkSalgado").checked =
            false;

        document.getElementById("checkSuco").checked =
            false;

        document.getElementById("checkAcai").checked =
            false;


        quantidades = {

            salgado: 1,

            suco: 1,

            acai: 1

        };


        document.getElementById("qtdSalgado").textContent =
            "1";

        document.getElementById("qtdSuco").textContent =
            "1";

        document.getElementById("qtdAcai").textContent =
            "1";


        atualizarTotal();


    } catch (erro) {

        console.error(
            "Não foi possível enviar:",
            erro
        );


        mostrarMensagem(
            "❌ Não foi possível enviar o pedido. Verifique o Supabase.",
            false
        );


    } finally {

        botao.disabled = false;

        botao.textContent =
            "🛒 Fazer Pedido";

    }
}


// ==========================================
// MOSTRAR MENSAGEM
// ==========================================

function mostrarMensagem(texto, sucesso) {

    const mensagem =
        document.getElementById("mensagem");

    mensagem.textContent = texto;

    mensagem.className =
        sucesso
            ? "sucesso"
            : "erro";

    mensagem.style.display = "block";
}


// ==========================================
// PAINEL DO ADMINISTRADOR
// ==========================================

function abrirAdmin() {

    const senha =
        prompt(
            "Digite a senha do administrador:"
        );


    if (senha === "1234") {

        window.location.href =
            "admin.html";

    } else {

        alert(
            "❌ Senha incorreta."
        );

    }

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarTotal();

    }
);
