/**
 * MISSÃO MARTE: O Resgate dos Recursos
 * Trabalho de Conclusão de Curso - Licenciatura em Matemática - UNIVESP 2026
 * 
 * GRUPO:
 * Antonio Antunes Junior
 * Clayton dos Santos Barbosa
 * Eduardo Bernardo de Oliveira
 * Giovani Machado de Lima
 * Priscilla Santiago Zamorra
 * Rodrigo Aires de Medeiros Correa
 * Sergio Eric Reis de Oliveira
 * Vitor Correa Uberti
 * 
 * PROJETO: Missão Marte - Gamificação no Ensino de Função Afim
 * ORIENTAÇÃO: Prof. Aliel Minatti Andrade
 * 
 * Este código foi desenvolvido com suporte de IA (Google Gemini)
 * Todos os prompts utilizados estão documentados no Diário de Bordo do projeto
 * 
 * VERSÃO SIMPLIFICADA: Apenas Nível 1
 */

// ===== ESTADO GLOBAL DO JOGO =====
const GameState = {
    nivelAtual: 1,
    niveisCompletos: [false], // Apenas nível 1
    progresso: {
        nivel1: { 
            tentativas: 0, 
            concluido: false,
            erros: [] 
        }
    },
    statusBase: {
        energia: false,
        oxigenio: false,
        comunicacao: false
    },
    nomeCadete: ''
};

/**
 * Função utilitária para converter valores com vírgula para ponto
 */
function converterValorDecimal(valor) {
    if (typeof valor !== 'string') return valor;
    const valorLimpo = valor.replace(',', '.').trim();
    return parseFloat(valorLimpo);
}

/**
 * Função auxiliar para registrar erros com detalhes
 */
function registrarErro(nivel, dadosErro) {
    if (!GameState.progresso[nivel]) return;
    if (GameState.progresso[nivel].erros.length < 10) {
        GameState.progresso[nivel].erros.push({
            timestamp: new Date().toLocaleTimeString(),
            ...dadosErro
        });
    }
    console.log(`🔴 ERRO [${nivel}]:`, dadosErro);
}

// Elementos DOM
const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const telaFinalizacao = document.getElementById('tela-finalizacao');
const btnIniciar = document.getElementById('btn-iniciar');
const nivelContainer = document.getElementById('nivel-container');
const nivelAtualSpan = document.getElementById('nivel-atual');
const nomeCadeteInput = document.getElementById('nome-cadete');

// ===== FUNÇÕES DE INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Missão Marte iniciada!');
    telaInicial.classList.add('active');
    telaJogo.classList.remove('active');
    telaFinalizacao.classList.remove('active');
    
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
    document.getElementById('data-atual').textContent = dataFormatada;
    
    if (nomeCadeteInput) {
        nomeCadeteInput.addEventListener('input', (e) => {
            GameState.nomeCadete = e.target.value;
        });
    }
});

btnIniciar.addEventListener('click', iniciarMissao);

function iniciarMissao() {
    console.log('🎮 Missão iniciada pelo cadete!');
    
    telaInicial.classList.remove('active');
    telaJogo.classList.add('active');
    telaFinalizacao.classList.remove('active');
    
    resetGameState();
    carregarNivel(1);
}

function resetGameState() {
    GameState.nivelAtual = 1;
    GameState.niveisCompletos = [false];
    GameState.progresso = {
        nivel1: { tentativas: 0, concluido: false, erros: [] }
    };
    GameState.statusBase = { energia: false, oxigenio: false, comunicacao: false };
    atualizarLEDs();
}

function carregarNivel(nivel) {
    GameState.nivelAtual = nivel;
    nivelAtualSpan.textContent = nivel;
    nivelContainer.innerHTML = '';
    
    if (nivel === 1) {
        carregarNivel1();
    } else {
        console.error('Nível inválido');
    }
}

function atualizarLEDs() {
    const ledEnergia = document.querySelector('.led-energia');
    const ledOxigenio = document.querySelector('.led-oxigenio');
    const ledComunicacao = document.querySelector('.led-comunicacao');
    
    if (ledEnergia) ledEnergia.className = `status-led led-energia ${GameState.statusBase.energia ? 'ativo' : ''}`;
    if (ledOxigenio) ledOxigenio.className = `status-led led-oxigenio ${GameState.statusBase.oxigenio ? 'ativo' : ''}`;
    if (ledComunicacao) ledComunicacao.className = `status-led led-comunicacao ${GameState.statusBase.comunicacao ? 'ativo' : ''}`;
}

// ===== FUNÇÃO DE RELATÓRIO DIAGNÓSTICO =====
function gerarRelatorioDiagnostico() {
    const data = new Date();
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR');
    const nomeCadete = GameState.nomeCadete || 'NÃO INFORMADO';
    
    function analisarErros(nivel, erros) {
        if (erros.length === 0) return "Nenhum erro registrado.";
        
        let analise = `Erros cometidos (${erros.length}):\n`;
        
        if (nivel === 'nivel1') {
            const errosA = erros.filter(e => e.tipo === 'coeficiente_a').length;
            const errosB = erros.filter(e => e.tipo === 'coeficiente_b').length;
            const errosAmbos = erros.filter(e => e.tipo === 'ambos').length;
            
            if (errosA > 0) analise += `  • Coeficiente a (taxa de variação) errado: ${errosA}x\n`;
            if (errosB > 0) analise += `  • Coeficiente b (valor inicial) errado: ${errosB}x\n`;
            if (errosAmbos > 0) analise += `  • Ambos coeficientes errados: ${errosAmbos}x\n`;
        }
        
        return analise;
    }
    
    function gerarDiagnostico(nivel, tentativas, concluido, erros) {
        const diagnosticos = {
            nivel1: {
                sucesso: '✓ Domina a construção da lei de formação a partir de tabelas. Compreende a relação entre coeficiente angular (taxa de variação) e coeficiente linear (valor inicial).',
                incompleto: '✗ Dificuldade em identificar os coeficientes a e b a partir de dados tabulares. Necessita praticar o cálculo da taxa de variação (Δy/Δx) e a leitura do valor inicial.'
            }
        };
        
        if (concluido) {
            return diagnosticos[nivel].sucesso;
        } else if (tentativas > 0) {
            return diagnosticos[nivel].incompleto;
        } else {
            return '⚪ Nível não iniciado.';
        }
    }
    
    const totalTentativas = GameState.progresso.nivel1.tentativas;
    const niveisConcluidos = GameState.niveisCompletos[0] ? 1 : 0;
    
    let relatorio = `================================================================================
                        MISSÃO MARTE - RELATÓRIO DIAGNÓSTICO
================================================================================

INFORMAÇÕES DO CADETE
--------------------------------------------------------------------------------
Nome: ${nomeCadete}
Data: ${dataFormatada}
Hora: ${horaFormatada}
Status da Missão: ${niveisConcluidos === 1 ? 'SUCESSO - Missão Cumprida' : 'EM ANDAMENTO'}

================================================================================
DESEMPENHO POR NÍVEL
================================================================================

NÍVEL 1 - Vazamento no Módulo de Combustível
────────────────────────────────────────────────────────────────────────────────
• Tentativas: ${GameState.progresso.nivel1.tentativas}
• Concluído: ${GameState.progresso.nivel1.concluido ? 'SIM ✓' : 'NÃO ✗'}
• Diagnóstico: ${gerarDiagnostico('nivel1', GameState.progresso.nivel1.tentativas, GameState.progresso.nivel1.concluido, GameState.progresso.nivel1.erros)}
• Análise de Erros:
${analisarErros('nivel1', GameState.progresso.nivel1.erros)}

================================================================================
RESUMO GERAL
================================================================================
Níveis Completados: ${niveisConcluidos}/1
Total de Tentativas: ${totalTentativas}
Média de Tentativas por Nível: ${totalTentativas.toFixed(1)}
Total de Erros Registrados: ${GameState.progresso.nivel1.erros.length}

STATUS DOS SISTEMAS DA BASE:
• Energia: ${GameState.statusBase.energia ? 'RESTAURADA ✓' : 'OFFLINE ✗'}
• Oxigênio: ${GameState.statusBase.oxigenio ? 'RESTAURADO ✓' : 'OFFLINE ✗'}
• Comunicação: ${GameState.statusBase.comunicacao ? 'RESTAURADA ✓' : 'OFFLINE ✗'}

================================================================================
                        FIM DO RELATÓRIO DIAGNÓSTICO
================================================================================

Este relatório foi gerado automaticamente pelo sistema "Missão Marte: O Resgate dos Recursos"
Trabalho de Conclusão de Curso - Licenciatura em Matemática - UNIVESP 2026

Equipe: Antonio, Clayton, Eduardo, Giovani, Priscilla, Rodrigo, Sergio, Vitor
`;
    
    return relatorio;
}

// ===== FUNÇÃO PARA ATUALIZAR ESTATÍSTICAS NA TELA DE FINALIZAÇÃO =====
function atualizarEstatisticasFinais() {
    document.getElementById('tentativas-n1').textContent = `${GameState.progresso.nivel1.tentativas} tentativas`;
    
    const elementoNivel1 = document.getElementById('est-nivel1');
    const statusEl = document.getElementById('status-n1');
    const diagEl = document.getElementById('diagnostico-n1');
    
    if (GameState.progresso.nivel1.concluido) {
        elementoNivel1.className = 'estatistica-nivel concluido';
        statusEl.innerHTML = '✅ Concluído';
        statusEl.className = 'nivel-status concluido';
        diagEl.innerHTML = '✓ Domina: Construção da lei de formação a partir de tabelas';
    } else if (GameState.progresso.nivel1.tentativas > 0) {
        elementoNivel1.className = 'estatistica-nivel parcial';
        statusEl.innerHTML = '⚠️ Em andamento';
        statusEl.className = 'nivel-status parcial';
        diagEl.innerHTML = '✗ Em desenvolvimento: Construção da lei de formação a partir de tabelas';
    } else {
        elementoNivel1.className = 'estatistica-nivel incompleto';
        statusEl.innerHTML = '⚪ Não iniciado';
        statusEl.className = 'nivel-status incompleto';
        diagEl.innerHTML = 'Aguardando início do nível';
    }
    
    const totalTentativas = GameState.progresso.nivel1.tentativas;
    const niveisCompletos = GameState.niveisCompletos[0] ? 1 : 0;
    
    document.getElementById('total-niveis').textContent = `${niveisCompletos}/1`;
    document.getElementById('total-tentativas').textContent = totalTentativas;
    document.getElementById('status-missao').textContent = niveisCompletos === 1 ? 'SUCESSO' : 'EM ANDAMENTO';
}

// ===== FUNÇÃO PARA MOSTRAR TELA DE FINALIZAÇÃO =====
function mostrarTelaFinalizacao() {
    atualizarEstatisticasFinais();
    
    telaJogo.classList.remove('active');
    telaFinalizacao.classList.add('active');
    
    const btnBaixar = document.getElementById('btn-baixar-relatorio');
    const btnJogarNovamente = document.getElementById('btn-jogar-novamente');
    const btnVoltarInicio = document.getElementById('btn-voltar-inicio');
    
    const novoBtnBaixar = btnBaixar.cloneNode(true);
    const novoBtnJogar = btnJogarNovamente.cloneNode(true);
    const novoBtnVoltar = btnVoltarInicio.cloneNode(true);
    
    btnBaixar.parentNode.replaceChild(novoBtnBaixar, btnBaixar);
    btnJogarNovamente.parentNode.replaceChild(novoBtnJogar, btnJogarNovamente);
    btnVoltarInicio.parentNode.replaceChild(novoBtnVoltar, btnVoltarInicio);
    
    novoBtnBaixar.addEventListener('click', baixarRelatorio);
    novoBtnJogar.addEventListener('click', () => {
        resetGameState();
        telaFinalizacao.classList.remove('active');
        telaJogo.classList.add('active');
        carregarNivel(1);
    });
    
    novoBtnVoltar.addEventListener('click', () => {
        resetGameState();
        telaFinalizacao.classList.remove('active');
        telaInicial.classList.add('active');
    });
}

// ===== FUNÇÃO PARA BAIXAR RELATÓRIO USANDO BLOB =====
function baixarRelatorio() {
    const relatorio = gerarRelatorioDiagnostico();
    const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const data = new Date();
    const dataStr = data.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = GameState.nomeCadete 
        ? `missao-marte-${GameState.nomeCadete}-${dataStr}.txt`
        : `missao-marte-relatorio-${dataStr}.txt`;
    
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    const btnBaixar = document.getElementById('btn-baixar-relatorio');
    const textoOriginal = btnBaixar.innerHTML;
    btnBaixar.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">RELATÓRIO BAIXADO!</span>';
    
    setTimeout(() => {
        btnBaixar.innerHTML = textoOriginal;
    }, 2000);
}

// ===== NÍVEL 1 (Único nível) =====
function carregarNivel1() {
    GameState.progresso.nivel1.tentativas++;
    
    const dadosTabela = [
        { tempo: 0, pressao: 100 },
        { tempo: 1, pressao: 97 },
        { tempo: 2, pressao: 94 },
        { tempo: 3, pressao: 91 }
    ];
    
    const coeficienteEsperadoA = -3;
    const coeficienteEsperadoB = 100;
    
    const nivelHTML = `
        <div class="nivel-card" id="nivel1">
            <div class="nivel-header">
                <div class="nivel-titulo">
                    <span class="nivel-numero">NÍVEL 1</span>
                    <h2>⚡ O Vazamento no Módulo de Combustível</h2>
                </div>
                <div class="nivel-status" id="status-nivel1">
                    <span class="status-indicator">⚠️ MISSÃO CRÍTICA</span>
                </div>
            </div>
            
            <div class="missao-briefing">
                <p class="comandante-fala">
                    "Cadete, o Módulo de Combustível sofreu uma ruptura. O tanque principal está perdendo pressão. 
                    Os sensores enviaram dados, mas o sistema de alerta principal está offline. 
                    Precisamos da lei de formação que descreve essa perda para ativar os protocolos de segurança."
                </p>
            </div>
            
            <div class="dados-container">
                <h3 class="dados-titulo">📊 DADOS DOS SENSORES</h3>
                <div class="tabela-container">
                    <table class="tabela-dados">
                        <thead>
                            <tr>
                                <th>Tempo (s)</th>
                                <th>Pressão (psi)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dadosTabela.map(item => `
                                <tr>
                                    <td>${item.tempo}</td>
                                    <td>${item.pressao}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="dica-calculo">
                    <p>💡 <strong>Dica do Comandante:</strong> Observe como a pressão muda a cada segundo. 
                    A taxa de variação (coeficiente <strong>a</strong>) é constante? 
                    Qual o valor inicial (coeficiente <strong>b</strong>) quando t = 0?</p>
                </div>
            </div>
            
            <div class="interacao-container">
                <h3 class="interacao-titulo">🔧 ATIVAR PROTOCOLO DE SEGURANÇA</h3>
                
                <div class="form-container">
                    <div class="campo-coeficiente">
                        <label for="coef-a">Coeficiente <strong>a</strong> (taxa de variação):</label>
                        <input type="text" id="coef-a" class="coef-input" inputmode="numeric" pattern="-?[0-9]*\.?[0-9]*" placeholder="0">
                    </div>
                    
                    <div class="campo-coeficiente">
                        <label for="coef-b">Coeficiente <strong>b</strong> (valor inicial):</label>
                        <input type="text" id="coef-b" class="coef-input" inputmode="numeric" pattern="-?[0-9]*\.?[0-9]*" placeholder="0">
                    </div>
                    
                    <div class="funcao-preview">
                        <p>Lei de formação: <span id="funcao-formatada">f(x) = <span class="variavel-a">_</span>x + <span class="variavel-b">_</span></span></p>
                    </div>
                    
                    <div class="botoes-acao">
                        <button id="btn-verificar-n1" class="btn-missao" style="max-width: 200px;">ATIVAR PROTOCOLO</button>
                        <button id="btn-limpar-n1" class="btn-secundario">LIMPAR</button>
                    </div>
                </div>
            </div>
            
            <div id="feedback-nivel1" class="feedback-container hidden">
                <div class="feedback-conteudo">
                    <span class="feedback-icone" id="feedback-icone-n1"></span>
                    <p id="feedback-mensagem-n1"></p>
                </div>
                <button id="btn-avancar-n1" class="btn-avancar hidden">🚀 FINALIZAR MISSÃO</button>
            </div>
        </div>
    `;
    
    nivelContainer.innerHTML = nivelHTML;
    configurarNivel1(coeficienteEsperadoA, coeficienteEsperadoB);
}

function configurarNivel1(aEsperado, bEsperado) {
    const inputA = document.getElementById('coef-a');
    const inputB = document.getElementById('coef-b');
    const btnVerificar = document.getElementById('btn-verificar-n1');
    const btnLimpar = document.getElementById('btn-limpar-n1');
    const btnAvancar = document.getElementById('btn-avancar-n1');
    const spanA = document.querySelector('.variavel-a');
    const spanB = document.querySelector('.variavel-b');
    const feedbackContainer = document.getElementById('feedback-nivel1');
    const feedbackIcone = document.getElementById('feedback-icone-n1');
    const feedbackMensagem = document.getElementById('feedback-mensagem-n1');
    
    let nivelConcluido = false;
    
    function atualizarPreview() {
        const valA = inputA.value.trim() === '' ? '_' : inputA.value;
        const valB = inputB.value.trim() === '' ? '_' : inputB.value;
        spanA.textContent = valA;
        spanB.textContent = valB;
    }
    
    inputA.addEventListener('input', atualizarPreview);
    inputB.addEventListener('input', atualizarPreview);
    
    btnLimpar.addEventListener('click', () => {
        inputA.value = '';
        inputB.value = '';
        atualizarPreview();
        feedbackContainer.classList.add('hidden');
        inputA.classList.remove('erro', 'sucesso');
        inputB.classList.remove('erro', 'sucesso');
    });
    
    btnVerificar.addEventListener('click', () => {
        if (nivelConcluido) return;
        
        const valA = converterValorDecimal(inputA.value);
        const valB = converterValorDecimal(inputB.value);
        
        if (isNaN(valA) || isNaN(valB)) {
            GameState.progresso.nivel1.tentativas++;
            console.log(`Nível 1 - Tentativa ${GameState.progresso.nivel1.tentativas}: Campos incompletos`);
            
            feedbackContainer.classList.remove('hidden');
            feedbackIcone.innerHTML = '⚠️';
            feedbackContainer.style.borderLeftColor = 'var(--alert-red)';
            feedbackContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            
            if (isNaN(valA) && isNaN(valB)) {
                feedbackMensagem.textContent = 'Preencha ambos os coeficientes, Cadete!';
            } else if (isNaN(valA)) {
                feedbackMensagem.textContent = 'Digite o coeficiente a (taxa de variação)!';
            } else {
                feedbackMensagem.textContent = 'Digite o coeficiente b (valor inicial)!';
            }
            
            setTimeout(() => {
                if (!nivelConcluido) feedbackContainer.classList.add('hidden');
            }, 3000);
            
            return;
        }
        
        GameState.progresso.nivel1.tentativas++;
        console.log(`Nível 1 - Tentativa ${GameState.progresso.nivel1.tentativas}: a=${valA}, b=${valB}`);
        
        const aCorreto = Math.abs(valA - aEsperado) < 0.01;
        const bCorreto = Math.abs(valB - bEsperado) < 0.01;
        
        if (aCorreto && bCorreto) {
            nivelConcluido = true;
            GameState.progresso.nivel1.concluido = true;
            GameState.niveisCompletos[0] = true;
            GameState.statusBase.energia = true;
            atualizarLEDs();
            
            inputA.classList.add('sucesso');
            inputB.classList.add('sucesso');
            
            feedbackIcone.innerHTML = '🏆';
            feedbackContainer.style.borderLeftColor = 'var(--success-green)';
            feedbackContainer.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            feedbackMensagem.textContent = '✅ PROTOCOLO ATIVADO! A pressão está estabilizada. Parabéns, Cadete. A função f(x) = -3x + 100 descreve perfeitamente o vazamento.';
            feedbackContainer.classList.remove('hidden');
            btnAvancar.classList.remove('hidden');
            
        } else {
            // Registrar erro
            if (!aCorreto && !bCorreto) {
                registrarErro('nivel1', {
                    tipo: 'ambos',
                    valorA: valA,
                    valorB: valB,
                    esperadoA: aEsperado,
                    esperadoB: bEsperado
                });
            } else if (!aCorreto) {
                registrarErro('nivel1', {
                    tipo: 'coeficiente_a',
                    valorA: valA,
                    esperadoA: aEsperado
                });
            } else if (!bCorreto) {
                registrarErro('nivel1', {
                    tipo: 'coeficiente_b',
                    valorB: valB,
                    esperadoB: bEsperado
                });
            }
            
            let mensagemErro = '❌ A lei de formação está incorreta. ';
            
            if (!aCorreto && !bCorreto) {
                mensagemErro += 'Ambos os coeficientes estão errados. ';
                inputA.classList.add('erro');
                inputB.classList.add('erro');
            } else if (!aCorreto) {
                mensagemErro += 'O coeficiente a (taxa de variação) está incorreto. ';
                inputA.classList.add('erro');
                inputB.classList.remove('erro');
            } else if (!bCorreto) {
                mensagemErro += 'O coeficiente b (valor inicial) está incorreto. ';
                inputB.classList.add('erro');
                inputA.classList.remove('erro');
            }
            
            mensagemErro += 'Verifique seus cálculos na tabela. Lembre-se: a é a taxa de variação e b é o valor inicial.';
            
            feedbackIcone.innerHTML = '⚠️';
            feedbackContainer.style.borderLeftColor = 'var(--alert-red)';
            feedbackContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            feedbackMensagem.textContent = mensagemErro;
            feedbackContainer.classList.remove('hidden');
            btnAvancar.classList.add('hidden');
            
            setTimeout(() => {
                if (!nivelConcluido) {
                    feedbackContainer.classList.add('hidden');
                    inputA.classList.remove('erro');
                    inputB.classList.remove('erro');
                }
            }, 3000);
        }
    });
    
    btnAvancar.addEventListener('click', () => {
        mostrarTelaFinalizacao();
    });
}

// Exportar funções para uso global
window.GameState = GameState;
window.carregarNivel = carregarNivel;
window.gerarRelatorioDiagnostico = gerarRelatorioDiagnostico;