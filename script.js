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
// CONFIGURAÇÃO DO PAGAMENTO
// ==========================================

const TEMPO_PAGAMENTO = 10 * 60;

const CHAVE_PIX =
    "ac33d16b-aa57-4f63-8a76-a6f06c7992cd";


// ==========================================
// VARIÁVEIS
// ==========================================

let contadorIntervalo = null;
let tempoRestante = TEMPO_PAGAMENTO;


// ==========================================
// BANCO DE PEDIDOS
// ==========================================

function pegarPedidos() {

    try {

        return JSON.parse(
            localStorage.getItem("pedidos")
        ) || [];

    } catch (erro) {

        console.error(
            "Erro ao carregar pedidos:",
            erro
        );

        return [];

    }

}


function salvarPedidos(pedidos) {

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );

}


// ==========================================
// QUANTIDADE DOS PRODUTOS
// ==========================================

const quantidades = {

    salgado: 0,
    suco: 0,
    acai: 0

};


function atualizarQuantidade(produto) {

    const elemento =
        document.getElementById(
            "qtd-" + produto
        );

    if (elemento) {

        elemento.textContent =
            quantidades[produto];

    }

}


function aumentar(produto) {

    if (
        quantidades[produto] === undefined
    ) {
        return;
    }

    quantidades[produto]++;

    atualizarQuantidade(produto);

    atualizarCheckbox(produto);

}


function diminuir(produto) {

    if (
        quantidades[produto] === undefined
    ) {
        return;
    }

    if (quantidades[produto] > 0) {

        quantidades[produto]--;

    }

    atualizarQuantidade(produto);

    atualizarCheckbox(produto);

}


function atualizarCheckbox(produto) {

    const checkbox =
        document.getElementById(
            "check-" + produto
        );

    if (!checkbox) {
        return;
    }

    checkbox.checked =
        quantidades[produto] > 0;

}


// ==========================================
// CHECKBOXES
// ==========================================

document.addEventListener(
    "change",
    function (evento) {

        if (
            !evento.target.matches(
                'input[name="lanche"]'
            )
        ) {
            return;
        }

        const produto =
            evento.target.value;


        if (produto === "Salgado") {

            if (evento.target.checked) {

                if (
                    quantidades.salgado === 0
                ) {

                    quantidades.salgado = 1;

                }

            } else {

                quantidades.salgado = 0;

            }

            atualizarQuantidade(
                "salgado"
            );

        }


        if (produto === "Suco") {

            if (evento.target.checked) {

                if (
                    quantidades.suco === 0
                ) {

                    quantidades.suco = 1;

                }

            } else {

                quantidades.suco = 0;

            }

            atualizarQuantidade(
                "suco"
            );

        }


        if (produto === "Açaí") {

            if (evento.target.checked) {

                if (
                    quantidades.acai === 0
                ) {

                    quantidades.acai = 1;

                }

            } else {

                quantidades.acai = 0;

            }

            atualizarQuantidade(
                "acai"
            );

        }

    }
);


// ==========================================
// CALCULAR PEDIDO
// ==========================================

function calcularPedido() {

    const itens = [];

    let total = 0;


    // SALGADO

    if (quantidades.salgado > 0) {

        const subtotal =
            quantidades.salgado *
            PRECO_SALGADO;

        itens.push({

            produto: "Salgado",

            quantidade:
                quantidades.salgado,

            preco:
                PRECO_SALGADO,

            subtotal:
                subtotal

        });

        total += subtotal;

    }


    // SUCO

    if (quantidades.suco > 0) {

        const subtotal =
            quantidades.suco *
            PRECO_SUCO;

        itens.push({

            produto: "Suco",

            quantidade:
                quantidades.suco,

            preco:
                PRECO_SUCO,

            subtotal:
                subtotal

        });

        total += subtotal;

    }


    // AÇAÍ

    if (quantidades.acai > 0) {

        const subtotal =
            quantidades.acai *
            PRECO_ACAI;

        itens.push({

            produto: "Açaí",

            quantidade:
                quantidades.acai,

            preco:
                PRECO_ACAI,

            subtotal:
                subtotal

        });

        total += subtotal;

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

    const nomeInput =
        document.getElementById(
            "nomeAluno"
        );


    const turmaInput =
        document.getElementById(
            "turmaAluno"
        );


    const nome =
        nomeInput
            ? nomeInput.value.trim()
            : "";


    const turma =
        turmaInput
            ? turmaInput.value.trim()
            : "";


    if (!nome) {

        alert(
            "Digite o nome do aluno."
        );

        return;

    }


    if (!turma) {

        alert(
            "Digite a turma."
        );

        return;

    }


    const resultado =
        calcularPedido();


    if (
        resultado.itens.length === 0
    ) {

        alert(
            "Escolha pelo menos um lanche."
        );

        return;

    }


    const pedido = {

        id: Date.now(),

        nome: nome,

        turma: turma,

        itens:
            resultado.itens,

        total:
            resultado.total,

        status:
            "Pendente",

        pagamento:
            "Aguardando pagamento",

        data:
            new Date().toLocaleString(
                "pt-BR"
            )

    };


    const pedidos =
        pegarPedidos();


    pedidos.push(pedido);


    salvarPedidos(
        pedidos
    );


    mostrarPagamento(
        resultado.total,
        pedido.id
    );


    atualizarEstatisticas();


    alert(
        "Pedido realizado com sucesso!\n\n" +
        "Aluno: " +
        nome +
        "\nTurma: " +
        turma +
        "\nTotal: R$ " +
        resultado.total
            .toFixed(2)
            .replace(".", ",") +
        "\n\nAgora faça o pagamento via Pix."
    );

}


// ==========================================
// MOSTRAR PAGAMENTO
// ==========================================

function mostrarPagamento(
    total,
    idPedido
) {

    const area =
        document.getElementById(
            "pagamentoPedido"
        );


    const valor =
        document.getElementById(
            "valorPagamento"
        );


    const pix =
        document.getElementById(
            "pixCopiaCola"
        );


    if (!area) {
        return;
    }


    area.style.display =
        "block";


    if (valor) {

        valor.textContent =
            "R$ " +
            total
                .toFixed(2)
                .replace(".", ",");

    }


    const codigoPix =
        CHAVE_PIX +
        " | PEDIDO-" +
        idPedido +
        " | VALOR-" +
        total.toFixed(2);


    if (pix) {

        pix.value =
            codigoPix;

    }


    gerarQRCode(
        codigoPix
    );


    iniciarContador(
        idPedido
    );


    area.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// ==========================================
// QR CODE
// ==========================================

function gerarQRCode(texto) {

    const qr =
        document.getElementById(
            "qrCode"
        );


    if (!qr) {
        return;
    }


    const url =
        "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" +
        encodeURIComponent(texto);


    qr.innerHTML = `

        <img
            src="${url}"
            alt="QR Code Pix"
        >

    `;

}


// ==========================================
// COPIAR PIX
// ==========================================

function copiarPix() {

    const campo =
        document.getElementById(
            "pixCopiaCola"
        );


    if (!campo) {
        return;
    }


    if (!campo.value) {

        alert(
            "Nenhum código Pix disponível."
        );

        return;

    }


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {

        navigator.clipboard
            .writeText(campo.value)
            .then(function () {

                alert(
                    "Código Pix copiado!"
                );

            })
            .catch(function () {

                campo.select();

                document.execCommand(
                    "copy"
                );

                alert(
                    "Código Pix copiado!"
                );

            });

    } else {

        campo.select();

        document.execCommand(
            "copy"
        );

        alert(
            "Código Pix copiado!"
        );

    }

}


// ==========================================
// CONTADOR DE PAGAMENTO
// ==========================================

function iniciarContador(
    idPedido
) {

    if (contadorIntervalo) {

        clearInterval(
            contadorIntervalo
        );

    }


    tempoRestante =
        TEMPO_PAGAMENTO;


    atualizarContador();


    contadorIntervalo =
        setInterval(
            function () {

                tempoRestante--;

                atualizarContador();


                if (
                    tempoRestante <= 0
                ) {

                    clearInterval(
                        contadorIntervalo
                    );

                    contadorIntervalo =
                        null;

                    pagamentoExpirado(
                        idPedido
                    );

                }

            },
            1000
        );

}


// ==========================================
// ATUALIZAR CONTADOR
// ==========================================

function atualizarContador() {

    const contador =
        document.getElementById(
            "contadorPagamento"
        );


    if (!contador) {
        return;
    }


    const minutos =
        Math.floor(
            tempoRestante / 60
        );


    const segundos =
        tempoRestante % 60;


    contador.textContent =
        String(minutos)
            .padStart(2, "0") +
        ":" +
        String(segundos)
            .padStart(2, "0");

}


// ==========================================
// PAGAMENTO EXPIRADO
// ==========================================

function pagamentoExpirado(
    idPedido
) {

    const status =
        document.getElementById(
            "statusPagamento"
        );


    if (status) {

        status.className =
            "status-pagamento status-expirado";

        status.textContent =
            "🔴 Tempo para pagamento encerrado";

    }


    const pedidos =
        pegarPedidos();


    const pedido =
        pedidos.find(
            function (item) {

                return item.id === idPedido;

            }
        );


    if (pedido) {

        pedido.status =
            "Pendente";

        pedido.pagamento =
            "Pagamento expirado";


        salvarPedidos(
            pedidos
        );

    }


    atualizarEstatisticas();

}


// ==========================================
// ADMINISTRADOR
// ==========================================

function abrirPainelAdmin() {

    const senha =
        prompt(
            "Digite a senha do administrador:"
        );


    if (
        senha !== "1234"
    ) {

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
        return;
    }


    painel.style.display =
        "block";


    mostrarPedidosAdmin();


    painel.scrollIntoView({

        behavior: "smooth"

    });

}


// ==========================================
// FECHAR ADMIN
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


// ==========================================
// MOSTRAR PEDIDOS NO ADMIN
// ==========================================

function mostrarPedidosAdmin() {

    const lista =
        document.getElementById(
            "listaPedidos"
        );


    if (!lista) {
        return;
    }


    const pedidos =
        pegarPedidos();


    if (
        pedidos.length === 0
    ) {

        lista.innerHTML = `

            <p>
                Nenhum pedido realizado ainda.
            </p>

        `;


        atualizarEstatisticas();

        return;

    }


    lista.innerHTML = "";


    pedidos.forEach(
        function (pedido) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "pedido-admin";


            let itensHTML =
                "";


            if (
                pedido.itens &&
                Array.isArray(pedido.itens)
            ) {

                pedido.itens.forEach(
                    function (item) {

                        itensHTML += `

                            <div>
                                ${item.quantidade}x
                                ${item.produto}
                                —
                                R$
                                ${Number(
                                    item.subtotal
                                )
                                    .toFixed(2)
                                    .replace(".", ",")}
                            </div>

                        `;

                    }
                );

            }


            const statusClasse =

                pedido.status === "Pago"

                    ? "status-pago"

                    : "status-pendente";


            const pagamentoTexto =
                pedido.pagamento ||
                "Aguardando pagamento";


            card.innerHTML = `

                <h3>
                    Pedido de
                    ${pedido.nome}
                </h3>

                <p>

                    <strong>
                        Turma:
                    </strong>

                    ${pedido.turma}

                </p>

                <p>

                    <strong>
                        Data:
                    </strong>

                    ${pedido.data}

                </p>

                <p>

                    <strong>
                        Itens:
                    </strong>

                </p>

                <div>
                    ${itensHTML}
                </div>

                <p>

                    <strong>
                        Total:
                    </strong>

                    R$

                    ${Number(
                        pedido.total
                    )
                        .toFixed(2)
                        .replace(".", ",")}

                </p>

                <p>

                    <strong>
                        Pagamento:
                    </strong>

                    ${pagamentoTexto}

                </p>

                <p>

                    <strong>
                        Status:
                    </strong>

                    <span
                        class="${statusClasse}"
                    >
                        ${pedido.status}
                    </span>

                </p>

               ${
    pedido.status !== "Pago"
        ? `
            <button
                type="button"
                onclick="marcarPago(${pedido.id})"
            >
                🟢 Marcar como pago
            </button>
        `
        : `
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


            lista.appendChild(
                card
            );

        }
    );


    atualizarEstatisticas();

}


// ==========================================
// MARCAR PEDIDO COMO PAGO
// ==========================================

function marcarPago(
    id
) {

    const pedidos =
        pegarPedidos();


    const pedido =
        pedidos.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!pedido) {
        return;
    }


    pedido.status =
        "Pago";


    pedido.pagamento =
        "Pagamento confirmado pelo administrador";


    salvarPedidos(
        pedidos
    );


    mostrarPedidosAdmin();

}


// ==========================================
// EXCLUIR PEDIDO
// ==========================================

function excluirPedido(
    id
) {

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

                return pedido.id !== id;

            }
        );


    salvarPedidos(
        pedidos
    );


    mostrarPedidosAdmin();

}


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


    const total =
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


    const quantidadePagos =
        pedidos.filter(
            function (pedido) {

                return pedido.status === "Pago";

            }
        ).length;


    const quantidadePendentes =
        pedidos.filter(
            function (pedido) {

                return pedido.status !== "Pago";

            }
        ).length;


    const valorTotalPago =
        pedidos.reduce(
            function (soma, pedido) {

                if (
                    pedido.status === "Pago"
                ) {

                    return (
                        soma +
                        Number(
                            pedido.total
                        )
                    );

                }

                return soma;

            },
            0
        );


    if (quantidade) {

        quantidade.textContent =
            pedidos.length;

    }


    if (pendentes) {

        pendentes.textContent =
            quantidadePendentes;

    }


    if (pagos) {

        pagos.textContent =
            quantidadePagos;

    }


    if (total) {

        total.textContent =
            "R$ " +
            valorTotalPago
                .toFixed(2)
                .replace(".", ",");

    }

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        atualizarQuantidade(
            "salgado"
        );

        atualizarQuantidade(
            "suco"
        );

        atualizarQuantidade(
            "acai"
        );

        atualizarEstatisticas();

    }
);
