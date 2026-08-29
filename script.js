// ==========================================
// COLÉGIO INOVARE
// SISTEMA DE PEDIDOS DA CANTINA
// ==========================================


// ==========================================
// PREÇOS
// ==========================================

const PRECO_SALGADO = 6.00;
const PRECO_SUCO = 3.50;
const PRECO_ACAI = 3.50;


// ==========================================
// QUANTIDADES
// ==========================================

function aumentar(produto) {

    const campo = document.getElementById("qtd-" + produto);

    if (!campo) {
        console.error("Campo de quantidade não encontrado:", produto);
        return;
    }

    let quantidade = Number(campo.textContent) || 0;

    quantidade++;

    campo.textContent = quantidade;

    // Marca o produto automaticamente
    const checkbox = document.getElementById("check-" + produto);

    if (checkbox && quantidade > 0) {
        checkbox.checked = true;
    }
}


function diminuir(produto) {

    const campo = document.getElementById("qtd-" + produto);

    if (!campo) {
        console.error("Campo de quantidade não encontrado:", produto);
        return;
    }

    let quantidade = Number(campo.textContent) || 0;

    if (quantidade > 0) {
        quantidade--;
    }

    campo.textContent = quantidade;

    // Se chegar a zero, desmarca
    const checkbox = document.getElementById("check-" + produto);

    if (checkbox && quantidade === 0) {
        checkbox.checked = false;
    }
}


// Disponibilizar para o HTML
window.aumentar = aumentar;
window.diminuir = diminuir;


// ==========================================
// ARMAZENAMENTO DOS PEDIDOS
// ==========================================

function pegarPedidos() {

    try {

        const dados = localStorage.getItem("pedidos");

        if (!dados) {
            return [];
        }

        return JSON.parse(dados);

    } catch (erro) {

        console.error("Erro ao carregar pedidos:", erro);

        return [];
    }
}


function salvarPedidos(pedidos) {

    try {

        localStorage.setItem(
            "pedidos",
            JSON.stringify(pedidos)
        );

        return true;

    } catch (erro) {

        console.error("Erro ao salvar pedidos:", erro);

        alert(
            "Não foi possível salvar o pedido neste navegador."
        );

        return false;
    }
}


// ==========================================
// CALCULAR PEDIDO
// ==========================================

function calcularPedido() {

    let total = 0;

    const itens = [];


    // ------------------------------------------
    // SALGADO
    // ------------------------------------------

    const checkSalgado =
        document.getElementById("check-salgado");

    const qtdSalgado =
        document.getElementById("qtd-salgado");


    if (checkSalgado && qtdSalgado) {

        const quantidade =
            Number(qtdSalgado.textContent) || 0;


        if (checkSalgado.checked && quantidade > 0) {

            const subtotal =
                quantidade * PRECO_SALGADO;

            total += subtotal;


            itens.push({

                produto: "Salgado",

                quantidade: quantidade,

                preco: PRECO_SALGADO,

                subtotal: subtotal
            });
        }
    }


    // ------------------------------------------
    // SUCO
    // ------------------------------------------

    const checkSuco =
        document.getElementById("check-suco");

    const qtdSuco =
        document.getElementById("qtd-suco");


    if (checkSuco && qtdSuco) {

        const quantidade =
            Number(qtdSuco.textContent) || 0;


        if (checkSuco.checked && quantidade > 0) {

            const subtotal =
                quantidade * PRECO_SUCO;

            total += subtotal;


            itens.push({

                produto: "Suco",

                quantidade: quantidade,

                preco: PRECO_SUCO,

                subtotal: subtotal
            });
        }
    }


    // ------------------------------------------
    // AÇAÍ
    // ------------------------------------------

    const checkAcai =
        document.getElementById("check-acai");

    const qtdAcai =
        document.getElementById("qtd-acai");


    if (checkAcai && qtdAcai) {

        const quantidade =
            Number(qtdAcai.textContent) || 0;


        if (checkAcai.checked && quantidade > 0) {

            const subtotal =
                quantidade * PRECO_ACAI;

            total += subtotal;


            itens.push({

                produto: "Açaí",

                quantidade: quantidade,

                preco: PRECO_ACAI,

                subtotal: subtotal
            });
        }
    }


    return {

        itens: itens,

        total: total
    };
}


// ==========================================
// FAZER PEDIDO
// ==========================================

function fazerPedido() {

    try {

        const nomeInput =
            document.getElementById("nomeAluno");

        const turmaInput =
            document.getElementById("turmaAluno");


        // ------------------------------------------
        // VERIFICAR CAMPOS
        // ------------------------------------------

        if (!nomeInput || !turmaInput) {

            alert(
                "Erro: campos do aluno não encontrados."
            );

            console.error(
                "Não encontrei nomeAluno ou turmaAluno."
            );

            return;
        }


        const nome =
            nomeInput.value.trim();

        const turma =
            turmaInput.value.trim();


        // ------------------------------------------
        // NOME
        // ------------------------------------------

        if (!nome) {

            alert(
                "Digite o nome do aluno."
            );

            nomeInput.focus();

            return;
        }


        // ------------------------------------------
        // TURMA
        // ------------------------------------------

        if (!turma) {

            alert(
                "Digite a turma."
            );

            turmaInput.focus();

            return;
        }


        // ------------------------------------------
        // CALCULAR
        // ------------------------------------------

        const resultado =
            calcularPedido();


        // ------------------------------------------
        // VERIFICAR PRODUTOS
        // ------------------------------------------

        if (
            !resultado.itens ||
            resultado.itens.length === 0
        ) {

            alert(
                "Escolha pelo menos um lanche e informe a quantidade."
            );

            return;
        }


        // ------------------------------------------
        // CRIAR PEDIDO
        // ------------------------------------------

        const pedido = {

            id: Date.now(),

            nome: nome,

            turma: turma,

            itens: resultado.itens,

            total: resultado.total,

            status: "Pendente",

            pagamento: "Aguardando pagamento",

            data:
                new Date().toLocaleString("pt-BR")
        };


        // ------------------------------------------
        // PEGAR PEDIDOS EXISTENTES
        // ------------------------------------------

        const pedidos =
            pegarPedidos();


        // ------------------------------------------
        // ADICIONAR NOVO PEDIDO
        // ------------------------------------------

        pedidos.push(pedido);


        // ------------------------------------------
        // SALVAR
        // ------------------------------------------

        const salvo =
            salvarPedidos(pedidos);


        if (!salvo) {
            return;
        }


        // ------------------------------------------
        // CONFIRMAÇÃO
        // ------------------------------------------

        alert(

            "Pedido realizado com sucesso!\n\n" +

            "Aluno: " +
            nome +

            "\nTurma: " +
            turma +

            "\nTotal: R$ " +

            resultado.total
                .toFixed(2)
                .replace(".", ",")
        );


        // ------------------------------------------
        // LIMPAR CAMPOS
        // ------------------------------------------

        nomeInput.value = "";

        turmaInput.value = "";


        // ------------------------------------------
        // DESMARCAR PRODUTOS
        // ------------------------------------------

        document
            .querySelectorAll(
                'input[name="lanche"]'
            )
            .forEach(
                function (checkbox) {

                    checkbox.checked = false;
                }
            );


        // ------------------------------------------
        // ZERAR QUANTIDADES
        // ------------------------------------------

        zerarQuantidade("salgado");

        zerarQuantidade("suco");

        zerarQuantidade("acai");


        // ------------------------------------------
        // ATUALIZAR ESTATÍSTICAS
        // ------------------------------------------

        atualizarEstatisticas();


    } catch (erro) {

        console.error(
            "Erro ao fazer pedido:",
            erro
        );

        alert(
            "Ocorreu um erro ao fazer o pedido. Veja o console para mais detalhes."
        );
    }
}


// Disponibilizar para o botão HTML
window.fazerPedido = fazerPedido;


// ==========================================
// ZERAR QUANTIDADE
// ==========================================

function zerarQuantidade(produto) {

    const campo =
        document.getElementById(
            "qtd-" + produto
        );

    if (campo) {

        campo.textContent = "0";
    }
}


// ==========================================
// MOSTRAR PEDIDOS NO ADMINISTRADOR
// ==========================================

function mostrarPedidosAdmin() {

    const lista =
        document.getElementById(
            "listaPedidos"
        );


    if (!lista) {

        console.error(
            "Elemento listaPedidos não encontrado."
        );

        return;
    }


    const pedidos =
        pegarPedidos();


    // ------------------------------------------
    // NENHUM PEDIDO
    // ------------------------------------------

    if (pedidos.length === 0) {

        lista.innerHTML =
            "<p>Nenhum pedido realizado ainda.</p>";

        atualizarEstatisticas();

        return;
    }


    lista.innerHTML = "";


    // ------------------------------------------
    // MOSTRAR PEDIDOS
    // ------------------------------------------

    pedidos
        .slice()
        .reverse()
        .forEach(
            function (pedido) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "pedido-admin";


                let itensHTML = "";


                // ------------------------------------------
                // ITENS
                // ------------------------------------------

                if (
                    pedido.itens &&
                    pedido.itens.length > 0
                ) {

                    pedido.itens.forEach(
                        function (item) {

                            itensHTML += `

                                <div>
                                    ${item.quantidade}x
                                    ${item.produto}
                                    —
                                    R$ ${Number(item.subtotal)
                                        .toFixed(2)
                                        .replace(".", ",")}
                                </div>

                            `;
                        }
                    );

                }


                // ------------------------------------------
                // STATUS
                // ------------------------------------------

                const statusClasse =
                    pedido.status === "Pago"
                        ? "status-pago"
                        : "status-pendente";


                // ------------------------------------------
                // PAGAMENTO
                // ------------------------------------------

                const pagamento =
                    pedido.pagamento ||
                    (
                        pedido.status === "Pago"
                            ? "Pagamento confirmado pelo administrador"
                            : "Aguardando pagamento"
                    );


                // ------------------------------------------
                // CARD
                // ------------------------------------------

                card.innerHTML = `

                    <h3>
                        Pedido de ${pedido.nome}
                    </h3>

                    <p>
                        <strong>Turma:</strong>
                        ${pedido.turma}
                    </p>

                    <p>
                        <strong>Data:</strong>
                        ${pedido.data}
                    </p>

                    <p>
                        <strong>Itens:</strong>
                    </p>

                    <div>
                        ${itensHTML}
                    </div>

                    <p>
                        <strong>Total:</strong>
                        R$
                        ${Number(pedido.total)
                            .toFixed(2)
                            .replace(".", ",")}
                    </p>

                    <p>
                        <strong>Pagamento:</strong>
                        ${pagamento}
                    </p>

                    <p>
                        <strong>Status:</strong>

                        <span class="${statusClasse}">
                            ${pedido.status}
                        </span>
                    </p>


                    ${
                        pedido.status !== "Pago"

                        ?

                        `
                        <button
                            type="button"
                            onclick="marcarPago(${pedido.id})"
                        >
                            🟢 Marcar como pago
                        </button>
                        `

                        :

                        `
                        <button
                            type="button"
                            disabled
                        >
                            ✅ Pagamento confirmado
                        </button>
                        `
                    }


                    <button
                        type="button"
                        onclick="excluirPedido(${pedido.id})"
                    >
                        🗑️ Excluir pedido
                    </button>


                    <hr>

                `;


                lista.appendChild(card);

            }
        );


    atualizarEstatisticas();
}


// ==========================================
// MARCAR COMO PAGO
// ==========================================

function marcarPago(id) {

    const pedidos =
        pegarPedidos();


    const pedido =
        pedidos.find(
            function (item) {

                return (
                    Number(item.id) ===
                    Number(id)
                );
            }
        );


    if (!pedido) {

        alert(
            "Pedido não encontrado."
        );

        return;
    }


    pedido.status =
        "Pago";


    pedido.pagamento =
        "Pagamento confirmado pelo administrador";


    salvarPedidos(pedidos);


    mostrarPedidosAdmin();
}


// Disponibilizar para o HTML
window.marcarPago = marcarPago;


// ==========================================
// EXCLUIR PEDIDO
// ==========================================

function excluirPedido(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este pedido?"
        );


    if (!confirmar) {

        return;
    }


    let pedidos =
        pegarPedidos();


    pedidos =
        pedidos.filter(
            function (pedido) {

                return (
                    Number(pedido.id) !==
                    Number(id)
                );
            }
        );


    salvarPedidos(pedidos);


    mostrarPedidosAdmin();
}


// Disponibilizar para o HTML
window.excluirPedido =
    excluirPedido;


// ==========================================
// ESTATÍSTICAS
// ==========================================

function atualizarEstatisticas() {

    const pedidos =
        pegarPedidos();


    const quantidade =
        document.getElementById(
            "quantidadePedidos"
        );


    const totalElemento =
        document.getElementById(
            "totalArrecadado"
        );


    const pendentes =
        document.getElementById(
            "pedidosPendentes"
        );


    const pagos =
        document.getElementById(
            "pedidosPagos"
        );


    // ------------------------------------------
    // QUANTIDADE
    // ------------------------------------------

    if (quantidade) {

        quantidade.textContent =
            pedidos.length;
    }


    // ------------------------------------------
    // TOTAL
    // ------------------------------------------

    if (totalElemento) {

        const total =
            pedidos.reduce(
                function (soma, pedido) {

                    return (
                        soma +
                        Number(pedido.total || 0)
                    );

                },
                0
            );


        totalElemento.textContent =
            "R$ " +
            total
                .toFixed(2)
                .replace(".", ",");
    }


    // ------------------------------------------
    // PENDENTES
    // ------------------------------------------

    if (pendentes) {

        const totalPendentes =
            pedidos.filter(
                function (pedido) {

                    return (
                        pedido.status ===
                        "Pendente"
                    );
                }
            ).length;


        pendentes.textContent =
            totalPendentes;
    }


    // ------------------------------------------
    // PAGOS
    // ------------------------------------------

    if (pagos) {

        const totalPagos =
            pedidos.filter(
                function (pedido) {

                    return (
                        pedido.status ===
                        "Pago"
                    );
                }
            ).length;


        pagos.textContent =
            totalPagos;
    }
}


// ==========================================
// ABRIR PAINEL ADMIN
// ==========================================

function abrirPainelAdmin() {

    const senha =
        prompt(
            "Digite a senha do administrador:"
        );


    if (senha !== "1234") {

        alert(
            "Senha incorreta."
        );

        return;
    }


    const painel =
        document.getElementById(
            "painelAdmin"
        );


    if (!painel) {

        alert(
            "Erro: painel administrativo não encontrado."
        );

        return;
    }


    painel.style.display =
        "block";


    mostrarPedidosAdmin();


    painel.scrollIntoView({
        behavior: "smooth"
    });
}


// Disponibilizar para o HTML
window.abrirPainelAdmin =
    abrirPainelAdmin;


// ==========================================
// FECHAR PAINEL ADMIN
// ==========================================

function fecharPainelAdmin() {

    const painel =
        document.getElementById(
            "painelAdmin"
        );


    if (painel) {

        painel.style.display =
            "none";
    }
}


// Disponibilizar para o HTML
window.fecharPainelAdmin =
    fecharPainelAdmin;


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Sistema da Cantina Inovare carregado."
        );


        // ------------------------------------------
        // BOTÃO FAZER PEDIDO
        // ------------------------------------------

        const botaoPedido =
            document.getElementById(
                "fazerPedido"
            );


        if (botaoPedido) {

            // Remove possíveis eventos antigos
            botaoPedido.onclick =
                null;


            // Liga o botão diretamente
            botaoPedido.addEventListener(
                "click",
                function (evento) {

                    evento.preventDefault();

                    fazerPedido();
                }
            );

        } else {

            console.error(
                "Botão #fazerPedido não encontrado."
            );
        }


        // ------------------------------------------
        // ESTATÍSTICAS
        // ------------------------------------------

        atualizarEstatisticas();

    }
);
