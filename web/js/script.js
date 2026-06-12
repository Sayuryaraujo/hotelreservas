const API_QUARTOS = "http://localhost:3000/quartos";
const API_RESERVAS = "http://localhost:3000/reservas";

let quartoParaExcluir = null;

async function renderizarQuartos() {

    const tabela = document.getElementById("quartosTable");

    if (!tabela) return;

    try {

        const resposta = await fetch(
            `${API_QUARTOS}/listar`
        );

        const quartos = await resposta.json();

        tabela.innerHTML = "";

        quartos.forEach(q => {

            tabela.innerHTML += `
                <tr>
                    <td>${q.numero}</td>
                    <td>${q.tipo}</td>

                    <td>
                        <button
                            class="btn-view"
                            onclick="verReservas(${q.id})">
                            Ver Reservas
                        </button>

                        <button
                            class="btn-delete"
                            onclick="abrirModal(${q.id})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error("Erro ao listar quartos:", erro);
    }
}

async function cadastrarQuarto() {

    const numero = document.getElementById("numero").value;
    const tipo = document.getElementById("tipo").value;

    if (!numero || !tipo) {
        alert("Preencha todos os campos");
        return;
    }

    try {

        const resposta = await fetch(
            `${API_QUARTOS}/cadastrar`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    numero: Number(numero),
                    tipo
                })
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar");
        }

        alert("Quarto cadastrado com sucesso!");

        window.location.href = "index.html";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar quarto");
    }
}

function abrirModal(id) {

    quartoParaExcluir = id;

    const modal = document.getElementById("modal");

    if (modal) {
        modal.style.display = "flex";
    }
}

function fecharModal() {

    const modal = document.getElementById("modal");

    if (modal) {
        modal.style.display = "none";
    }
}

async function excluirQuarto() {

    try {

        await fetch(
            `${API_QUARTOS}/excluir/${quartoParaExcluir}`,
            {
                method: "DELETE"
            }
        );

        fecharModal();
        renderizarQuartos();

    } catch (erro) {
        console.error(erro);
    }
}

function verReservas(id) {

    window.location.href =
        `reserva.html?quarto=${id}`;
}

async function carregarReservas() {

    const tabela = document.getElementById("reservasTable");

    if (!tabela) return;

    try {

        const resposta = await fetch(
            `${API_RESERVAS}/listar`
        );

        const reservas = await resposta.json();

        tabela.innerHTML = "";

        reservas.forEach(r => {

            tabela.innerHTML += `
                <tr>
                    <td>${r.numeroQuarto ?? ""}</td>
                    <td>${r.hospede ?? ""}</td>
                    <td>${r.entrada ?? ""}</td>
                    <td>${r.saida ?? ""}</td>

                    <td>
                        <button
                            class="btn-view"
                            onclick="editarReserva(${r.id})">
                            Editar
                        </button>

                        <button
                            class="btn-delete"
                            onclick="excluirReserva(${r.id})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error("Erro ao listar reservas:", erro);
    }
}

async function cadastrarReserva() {

    const numeroQuarto =
        document.getElementById("numeroQuarto").value;

    const hospede =
        document.getElementById("hospede").value;

    const entrada =
        document.getElementById("entrada").value;

    const saida =
        document.getElementById("saida").value;

    if (!numeroQuarto || !hospede || !entrada || !saida) {
        alert("Preencha todos os campos");
        return;
    }

    try {

        const resposta = await fetch(
            `${API_RESERVAS}/cadastrar`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    numeroQuarto,
                    hospede,
                    entrada,
                    saida
                })
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar");
        }

        alert("Reserva cadastrada com sucesso!");

        carregarReservas();

        document.getElementById("numeroQuarto").value = "";
        document.getElementById("hospede").value = "";
        document.getElementById("entrada").value = "";
        document.getElementById("saida").value = "";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao cadastrar reserva");
    }
}

async function excluirReserva(id) {

    try {

        await fetch(
            `${API_RESERVAS}/excluir/${id}`,
            {
                method: "DELETE"
            }
        );

        carregarReservas();

    } catch (erro) {
        console.error(erro);
    }
}

async function editarReserva(id) {

    try {

        const resposta = await fetch(
            `${API_RESERVAS}/buscar/${id}`
        );

        const reserva = await resposta.json();

        const numeroQuarto = prompt(
            "Número do quarto:",
            reserva.numeroQuarto
        );

        const hospede = prompt(
            "Hóspede:",
            reserva.hospede
        );

        const entrada = prompt(
            "Entrada:",
            reserva.entrada
        );

        const saida = prompt(
            "Saída:",
            reserva.saida
        );

        if (!numeroQuarto || !hospede) return;

        await fetch(
            `${API_RESERVAS}/atualizar/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    numeroQuarto,
                    hospede,
                    entrada,
                    saida
                })
            }
        );

        carregarReservas();

    } catch (erro) {
        console.error(erro);
    }
}

window.onload = () => {

    renderizarQuartos();
    carregarReservas();
};