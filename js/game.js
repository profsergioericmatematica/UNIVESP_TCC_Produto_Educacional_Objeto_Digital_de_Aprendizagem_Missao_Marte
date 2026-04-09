/**
 * MISSÃO MARTE: O Resgate dos Recursos
 * Trabalho de Conclusão de Curso - Licenciatura em Matemática - UNIVESP 2026
 * * GRUPO:
 * Antonio Antunes Junior
 * Clayton dos Santos Barbosa
 * Eduardo Bernardo de Oliveira
 * Giovani Machado de Lima
 * Priscilla Santiago Zamorra
 * Rodrigo Aires de Medeiros Correa
 * Sergio Eric Reis de Oliveira
 * Vitor Correa Uberti
 * * PROJETO: Missão Marte - Gamificação no Ensino de Função Afim
 * ORIENTAÇÃO: Prof. Raquel Mansano Gonçalves Cenciarelli
 * * Este código foi desenvolvido com suporte de IA (Google Gemini)
 * Todos os prompts utilizados estão documentados no Diário de Bordo do projeto
 */

// ===== ESTADO GLOBAL DO JOGO =====
// ===== ESTADO GLOBAL DO JOGO (VERSÃO COM HISTÓRICO DE ERROS) =====
const GameState = {
    nivelAtual: 1,
    niveisCompletos: [false, false, false, false, false],
    progresso: {
        nivel1: { 
            tentativas: 0, 
            concluido: false,
            erros: []  // Array para armazenar cada erro cometido
        },
        nivel2: { 
            tentativas: 0, 
            concluido: false,
            erros: []  // Array para armazenar cada erro cometido
        },
        nivel3: { 
            tentativas: 0, 
            concluido: false,
            erros: []  // Array para armazenar cada erro cometido
        },
        nivel4: { 
            tentativas: 0, 
            concluido: false,
            erros: []  // Array para armazenar cada erro cometido
        },
        nivel5: { 
            tentativas: 0, 
            concluido: false,
            erros: []  // Array para armazenar cada erro cometido
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
 * @param {string} valor - Valor digitado pelo usuário (ex: "-0,5" ou "2,5")
 * @returns {number} - Número convertido corretamente
 */
function converterValorDecimal(valor) {
    if (typeof valor !== 'string') return valor;
    
    // Substitui vírgula por ponto e remove espaços
    const valorLimpo = valor.replace(',', '.').trim();
    
    // Converte para número
    const numero = parseFloat(valorLimpo);
    
    // Retorna NaN se não for número válido
    return isNaN(numero) ? NaN : numero;
}

/**
 * Função auxiliar para registrar erros com detalhes
 * @param {string} nivel - Identificador do nível ('nivel1', 'nivel2', etc.)
 * @param {object} dadosErro - Informações sobre o erro cometido
 */
function registrarErro(nivel, dadosErro) {
    if (!GameState.progresso[nivel]) return;
    
    // Limitar a 10 erros por nível para não poluir o relatório
    if (GameState.progresso[nivel].erros.length < 10) {
        GameState.progresso[nivel].erros.push({
            timestamp: new Date().toLocaleTimeString(),
            ...dadosErro
        });
    }
    
    // Log para debug
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
    
    // Configurar data atual na tela de finalização
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
    document.getElementById('data-atual').textContent = dataFormatada;
    
    // Listener para o campo de nome
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
    GameState.niveisCompletos = [false, false, false, false, false];
    GameState.progresso = {
        nivel1: { tentativas: 0, concluido: false, erros: [] },
        nivel2: { tentativas: 0, concluido: false, erros: [] },
        nivel3: { tentativas: 0, concluido: false, erros: [] },
        nivel4: { tentativas: 0, concluido: false, erros: [] },
        nivel5: { tentativas: 0, concluido: false, erros: [] }
    };
    GameState.statusBase = { energia: false, oxigenio: false, comunicacao: false };
    atualizarLEDs();
}

function carregarNivel(nivel) {
    GameState.nivelAtual = nivel;
    nivelAtualSpan.textContent = nivel;
    nivelContainer.innerHTML = '';
    
    switch(nivel) {
        case 1: carregarNivel1(); break;
        case 2: carregarNivel2(); break;
        case 3: carregarNivel3(); break;
        case 4: carregarNivel4(); break;
        case 5: carregarNivel5(); break;
        default: console.error('Nível inválido');
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

// ===== FUNÇÃO DE RELATÓRIO DIAGNÓSTICO MELHORADA =====
/**
 * Função de relatório diagnóstica com detalhamento de erros
 */
function gerarRelatorioDiagnostico() {
    const data = new Date();
    const dataFormatada = data.toLocaleDateString('pt-BR');
    const horaFormatada = data.toLocaleTimeString('pt-BR');
    const nomeCadete = GameState.nomeCadete || 'NÃO INFORMADO';
    
    // Função para gerar análise dos erros
    function analisarErros(nivel, erros) {
        if (erros.length === 0) return "Nenhum erro registrado.";
        
        // Agrupar tipos de erro para identificar padrões
        const tiposErro = {};
        erros.forEach(erro => {
            const chave = erro.tipo || "desconhecido";
            tiposErro[chave] = (tiposErro[chave] || 0) + 1;
        });
        
        let analise = `Erros cometidos (${erros.length}):\n`;
        
        // Nível 1 - Erros de coeficientes
        if (nivel === 'nivel1') {
            const errosA = erros.filter(e => e.tipo === 'coeficiente_a').length;
            const errosB = erros.filter(e => e.tipo === 'coeficiente_b').length;
            const errosAmbos = erros.filter(e => e.tipo === 'ambos').length;
            
            if (errosA > 0) analise += `  • Coeficiente a (taxa de variação) errado: ${errosA}x\n`;
            if (errosB > 0) analise += `  • Coeficiente b (valor inicial) errado: ${errosB}x\n`;
            if (errosAmbos > 0) analise += `  • Ambos coeficientes errados: ${errosAmbos}x\n`;
        }
        
        // Nível 2 - Erros de alinhamento
        if (nivel === 'nivel2') {
            const distancias = erros.map(e => e.distancia).filter(d => d !== undefined);
            if (distancias.length > 0) {
                const media = (distancias.reduce((a, b) => a + b, 0) / distancias.length).toFixed(2);
                const pior = Math.max(...distancias).toFixed(2);
                const melhor = Math.min(...distancias).toFixed(2);
                analise += `  • Distância média do alvo: ${media} unidades\n`;
                analise += `  • Melhor aproximação: ${melhor} unidades\n`;
                analise += `  • Pior aproximação: ${pior} unidades\n`;
            }
        }
        
        // Nível 3 - Erros de leitura gráfica
        if (nivel === 'nivel3') {
            const errosA = erros.filter(e => e.tipo === 'coeficiente_a').length;
            const errosB = erros.filter(e => e.tipo === 'coeficiente_b').length;
            const valoresA = erros.filter(e => e.valorA !== undefined).map(e => e.valorA);
            const valoresB = erros.filter(e => e.valorB !== undefined).map(e => e.valorB);
            
            if (errosA > 0) {
                analise += `  • Coeficiente a incorreto: ${errosA}x\n`;
                if (valoresA.length > 0) {
                    const mediaA = (valoresA.reduce((a, b) => a + b, 0) / valoresA.length).toFixed(2);
                    analise += `    Média dos valores tentados: ${mediaA}\n`;
                }
            }
            if (errosB > 0) {
                analise += `  • Coeficiente b incorreto: ${errosB}x\n`;
                if (valoresB.length > 0) {
                    const mediaB = (valoresB.reduce((a, b) => a + b, 0) / valoresB.length).toFixed(2);
                    analise += `    Média dos valores tentados: ${mediaB}\n`;
                }
            }
        }
        
        // Nível 4 - Erros de precisão na raiz
        if (nivel === 'nivel4') {
            const distancias = erros.map(e => e.distancia).filter(d => d !== undefined);
            if (distancias.length > 0) {
                const media = (distancias.reduce((a, b) => a + b, 0) / distancias.length).toFixed(2);
                const pior = Math.max(...distancias).toFixed(2);
                const melhor = Math.min(...distancias).toFixed(2);
                analise += `  • Erro médio: ${media} minutos\n`;
                analise += `  • Melhor precisão: ${melhor} minutos\n`;
                analise += `  • Pior precisão: ${pior} minutos\n`;
            }
        }
        
        // Nível 5 - Erros de sistema linear
// Nível 5 - Erros de sistema linear
if (nivel === 'nivel5') {
    const errosX = erros.filter(e => e.tipo === 'coordenada_x').length;
    const errosY = erros.filter(e => e.tipo === 'coordenada_y').length;
    const errosRetaA = erros.filter(e => e.tipo === 'fora_reta_a').length;
    const errosRetaB = erros.filter(e => e.tipo === 'fora_reta_b').length;
    const errosFora = erros.filter(e => e.tipo === 'fora_das_retas').length;
    const errosAmbas = erros.filter(e => e.tipo === 'ambas_coordenadas').length;
    const errosVazios = erros.filter(e => e.tipo === 'campos_vazios').length;
    
    if (errosX > 0) analise += `  • Coordenada X incorreta: ${errosX}x\n`;
    if (errosY > 0) analise += `  • Coordenada Y incorreta: ${errosY}x\n`;
    if (errosRetaA > 0) analise += `  • Ponto fora da rota da Nave A: ${errosRetaA}x\n`;
    if (errosRetaB > 0) analise += `  • Ponto fora da rota da Nave B: ${errosRetaB}x\n`;
    if (errosFora > 0) analise += `  • Ponto fora de ambas as rotas: ${errosFora}x\n`;
    if (errosAmbas > 0) analise += `  • Ambas coordenadas erradas: ${errosAmbas}x\n`;
    if (errosVazios > 0) analise += `  • Tentativas com campos vazios: ${errosVazios}x\n`;
    
    // Se houver erros com valores específicos, mostrar médias
    const valoresX = erros.filter(e => e.x !== undefined).map(e => e.x);
    const valoresY = erros.filter(e => e.y !== undefined).map(e => e.y);
    
    if (valoresX.length > 0) {
        const mediaX = (valoresX.reduce((a, b) => a + b, 0) / valoresX.length).toFixed(2);
        analise += `  • Média dos X tentados: ${mediaX}\n`;
    }
    
    if (valoresY.length > 0) {
        const mediaY = (valoresY.reduce((a, b) => a + b, 0) / valoresY.length).toFixed(2);
        analise += `  • Média dos Y tentados: ${mediaY}\n`;
    }
}
        
        return analise;
    }
    
    // Função auxiliar para gerar diagnóstico pedagógico (mantida)
    function gerarDiagnostico(nivel, tentativas, concluido, erros) {
        const diagnosticos = {
            nivel1: {
                sucesso: '✓ Domina a construção da lei de formação a partir de tabelas. Compreende a relação entre coeficiente angular (taxa de variação) e coeficiente linear (valor inicial).',
                incompleto: '✗ Dificuldade em identificar os coeficientes a e b a partir de dados tabulares. Necessita praticar o cálculo da taxa de variação (Δy/Δx) e a leitura do valor inicial.'
            },
            nivel2: {
                sucesso: '✓ Compreende visualmente a influência dos coeficientes a (inclinação) e b (interseção com eixo Y) na forma da reta. Consegue manipular parâmetros para alcançar um ponto-alvo.',
                incompleto: '✗ Dificuldade na relação entre os coeficientes e a representação gráfica. Precisa explorar mais como o valor de a altera a inclinação e como b desloca a reta verticalmente.'
            },
            nivel3: {
                sucesso: '✓ Interpreta corretamente gráficos de funções afim, extraindo informações visuais como ponto de interseção com eixo Y, inclinação e raiz da função.',
                incompleto: '✗ Dificuldade na leitura de gráficos. Necessita praticar a identificação de pontos notáveis (onde cruza os eixos) e o cálculo visual da inclinação.'
            },
            nivel4: {
                sucesso: '✓ Domina o conceito de raiz (zero) da função afim, identificando geometricamente o ponto onde a reta cruza o eixo X com precisão.',
                incompleto: '✗ Dificuldade no conceito de raiz da função. Precisa compreender que a raiz é o valor de x que torna f(x) = 0, representado graficamente pelo ponto de intersecção com o eixo X.'
            },
            nivel5: {
                sucesso: '✓ Resolve sistemas lineares 2x2 com sucesso, compreendendo que a solução representa o ponto de intersecção entre duas retas. Aplica corretamente o método da igualdade.',
                incompleto: '✗ Dificuldade na resolução de sistemas lineares. Necessita revisar o método da igualdade e a interpretação geométrica da solução como ponto de encontro das retas.'
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
    
    // Calcular totais
    const totalTentativas = 
        GameState.progresso.nivel1.tentativas +
        GameState.progresso.nivel2.tentativas +
        GameState.progresso.nivel3.tentativas +
        GameState.progresso.nivel4.tentativas +
        GameState.progresso.nivel5.tentativas;
    
    const niveisConcluidos = GameState.niveisCompletos.filter(Boolean).length;
    
    // Montar relatório com análise de erros
    let relatorio = `================================================================================
                        MISSÃO MARTE - RELATÓRIO DIAGNÓSTICO
================================================================================

INFORMAÇÕES DO CADETE
--------------------------------------------------------------------------------
Nome: ${nomeCadete}
Data: ${dataFormatada}
Hora: ${horaFormatada}
Status da Missão: ${niveisConcluidos === 5 ? 'SUCESSO - Missão Cumprida' : 'EM ANDAMENTO'}

================================================================================
DESEMPENHO POR NÍVEL
================================================================================

NÍVEL 1 - Vazamento no Módulo de Combustível
────────────────────────────────────────────────────────────────────────────────
• Tentativas: ${GameState.progresso.nivel1.tentativas}
• Concluído: ${GameState.progresso.nivel1.concluido ? 'SIM ✓' : 'NÃO ✗'}
• Diagnóstico: ${gerarDiagnostico('nivel1', GameState.progresso.nivel1.tentativas, GameState.progresso.nivel1.concluido)}
• Análise de Erros:
${analisarErros('nivel1', GameState.progresso.nivel1.erros)}

NÍVEL 2 - Calibragem dos Painéis Solares
────────────────────────────────────────────────────────────────────────────────
• Tentativas: ${GameState.progresso.nivel2.tentativas}
• Concluído: ${GameState.progresso.nivel2.concluido ? 'SIM ✓' : 'NÃO ✗'}
• Diagnóstico: ${gerarDiagnostico('nivel2', GameState.progresso.nivel2.tentativas, GameState.progresso.nivel2.concluido)}
• Análise de Erros:
${analisarErros('nivel2', GameState.progresso.nivel2.erros)}

NÍVEL 3 - Decodificando a Mensagem do Satélite
────────────────────────────────────────────────────────────────────────────────
• Tentativas: ${GameState.progresso.nivel3.tentativas}
• Concluído: ${GameState.progresso.nivel3.concluido ? 'SIM ✓' : 'NÃO ✗'}
• Diagnóstico: ${gerarDiagnostico('nivel3', GameState.progresso.nivel3.tentativas, GameState.progresso.nivel3.concluido)}
• Análise de Erros:
${analisarErros('nivel3', GameState.progresso.nivel3.erros)}

NÍVEL 4 - Crise no Gerador de Oxigênio
────────────────────────────────────────────────────────────────────────────────
• Tentativas: ${GameState.progresso.nivel4.tentativas}
• Concluído: ${GameState.progresso.nivel4.concluido ? 'SIM ✓' : 'NÃO ✗'}
• Diagnóstico: ${gerarDiagnostico('nivel4', GameState.progresso.nivel4.tentativas, GameState.progresso.nivel4.concluido)}
• Análise de Erros:
${analisarErros('nivel4', GameState.progresso.nivel4.erros)}

NÍVEL 5 - Rotas de Colisão
────────────────────────────────────────────────────────────────────────────────
• Tentativas: ${GameState.progresso.nivel5.tentativas}
• Concluído: ${GameState.progresso.nivel5.concluido ? 'SIM ✓' : 'NÃO ✗'}
• Diagnóstico: ${gerarDiagnostico('nivel5', GameState.progresso.nivel5.tentativas, GameState.progresso.nivel5.concluido)}
• Análise de Erros:
${analisarErros('nivel5', GameState.progresso.nivel5.erros)}

================================================================================
RESUMO GERAL
================================================================================
Níveis Completados: ${niveisConcluidos}/5
Total de Tentativas: ${totalTentativas}
Média de Tentativas por Nível: ${(totalTentativas / 5).toFixed(1)}
Total de Erros Registrados: ${
    GameState.progresso.nivel1.erros.length +
    GameState.progresso.nivel2.erros.length +
    GameState.progresso.nivel3.erros.length +
    GameState.progresso.nivel4.erros.length +
    GameState.progresso.nivel5.erros.length
}

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
    // Atualizar tentativas
    document.getElementById('tentativas-n1').textContent = `${GameState.progresso.nivel1.tentativas} tentativas`;
    document.getElementById('tentativas-n2').textContent = `${GameState.progresso.nivel2.tentativas} tentativas`;
    document.getElementById('tentativas-n3').textContent = `${GameState.progresso.nivel3.tentativas} tentativas`;
    document.getElementById('tentativas-n4').textContent = `${GameState.progresso.nivel4.tentativas} tentativas`;
    document.getElementById('tentativas-n5').textContent = `${GameState.progresso.nivel5.tentativas} tentativas`;
    
    // Atualizar status e diagnóstico
    const niveis = [
        { id: 'n1', nome: 'est-nivel1', status: 'status-n1', diag: 'diagnostico-n1', progresso: GameState.progresso.nivel1 },
        { id: 'n2', nome: 'est-nivel2', status: 'status-n2', diag: 'diagnostico-n2', progresso: GameState.progresso.nivel2 },
        { id: 'n3', nome: 'est-nivel3', status: 'status-n3', diag: 'diagnostico-n3', progresso: GameState.progresso.nivel3 },
        { id: 'n4', nome: 'est-nivel4', status: 'status-n4', diag: 'diagnostico-n4', progresso: GameState.progresso.nivel4 },
        { id: 'n5', nome: 'est-nivel5', status: 'status-n5', diag: 'diagnostico-n5', progresso: GameState.progresso.nivel5 }
    ];
    
    const diagnosticos = [
        'Construção da lei de formação a partir de tabelas',
        'Influência visual dos coeficientes a e b',
        'Leitura e interpretação de gráficos',
        'Conceito de raiz (zero) da função',
        'Resolução de sistemas lineares'
    ];
    
    niveis.forEach((nivel, index) => {
        const element = document.getElementById(nivel.nome);
        const statusEl = document.getElementById(nivel.status);
        const diagEl = document.getElementById(nivel.diag);
        
        if (nivel.progresso.concluido) {
            element.className = 'estatistica-nivel concluido';
            statusEl.innerHTML = '✅ Concluído';
            statusEl.className = 'nivel-status concluido';
            diagEl.innerHTML = `✓ Domina: ${diagnosticos[index]}`;
        } else if (nivel.progresso.tentativas > 0) {
            element.className = 'estatistica-nivel parcial';
            statusEl.innerHTML = '⚠️ Em andamento';
            statusEl.className = 'nivel-status parcial';
            diagEl.innerHTML = `✗ Em desenvolvimento: ${diagnosticos[index]}`;
        } else {
            element.className = 'estatistica-nivel incompleto';
            statusEl.innerHTML = '⚪ Não iniciado';
            statusEl.className = 'nivel-status incompleto';
            diagEl.innerHTML = `Aguardando início do nível`;
        }
    });
    
    // Atualizar resumo geral
    const niveisCompletos = GameState.niveisCompletos.filter(Boolean).length;
    const totalTentativas = 
        GameState.progresso.nivel1.tentativas +
        GameState.progresso.nivel2.tentativas +
        GameState.progresso.nivel3.tentativas +
        GameState.progresso.nivel4.tentativas +
        GameState.progresso.nivel5.tentativas;
    
    document.getElementById('total-niveis').textContent = `${niveisCompletos}/5`;
    document.getElementById('total-tentativas').textContent = totalTentativas;
    document.getElementById('status-missao').textContent = niveisCompletos === 5 ? 'SUCESSO' : 'EM ANDAMENTO';
}

// ===== FUNÇÃO PARA MOSTRAR TELA DE FINALIZAÇÃO =====
function mostrarTelaFinalizacao() {
    // Atualizar estatísticas antes de mostrar
    atualizarEstatisticasFinais();
    
    // Trocar telas
    telaJogo.classList.remove('active');
    telaFinalizacao.classList.add('active');
    
    // Configurar botões
    const btnBaixar = document.getElementById('btn-baixar-relatorio');
    const btnJogarNovamente = document.getElementById('btn-jogar-novamente');
    const btnVoltarInicio = document.getElementById('btn-voltar-inicio');
    
    // Remover listeners antigos clonando os botões
    const novoBtnBaixar = btnBaixar.cloneNode(true);
    const novoBtnJogar = btnJogarNovamente.cloneNode(true);
    const novoBtnVoltar = btnVoltarInicio.cloneNode(true);
    
    btnBaixar.parentNode.replaceChild(novoBtnBaixar, btnBaixar);
    btnJogarNovamente.parentNode.replaceChild(novoBtnJogar, btnJogarNovamente);
    btnVoltarInicio.parentNode.replaceChild(novoBtnVoltar, btnVoltarInicio);
    
    // Adicionar novos listeners
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
    // Gerar conteúdo do relatório
    const relatorio = gerarRelatorioDiagnostico();
    
    // Criar Blob com o conteúdo
    const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
    
    // Criar URL do Blob
    const url = window.URL.createObjectURL(blob);
    
    // Criar link temporário para download
    const link = document.createElement('a');
    link.href = url;
    
    // Gerar nome do arquivo com data e nome do cadete
    const data = new Date();
    const dataStr = data.toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = GameState.nomeCadete 
        ? `missao-marte-${GameState.nomeCadete}-${dataStr}.txt`
        : `missao-marte-relatorio-${dataStr}.txt`;
    
    link.download = nomeArquivo;
    
    // Adicionar ao DOM, clicar e remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpar URL
    window.URL.revokeObjectURL(url);
    
    // Feedback visual
    const btnBaixar = document.getElementById('btn-baixar-relatorio');
    const textoOriginal = btnBaixar.innerHTML;
    btnBaixar.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">RELATÓRIO BAIXADO!</span>';
    
    setTimeout(() => {
        btnBaixar.innerHTML = textoOriginal;
    }, 2000);
}

// ===== NÍVEL 1 (mantido exatamente como estava) =====
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
            
            <div class="dados-container glass-panel" style="padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 12px; background: rgba(0,0,0,0.3);">
                <h3 class="dados-titulo" style="margin-bottom: 1rem; text-align: center;">📊 DADOS DOS SENSORES</h3>
                <div class="tabela-container">
                    <table class="tabela-dados" style="width: 100%; text-align: center; border-collapse: collapse; background: rgba(15,18,40,0.6); border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem;">
                        <thead style="background: rgba(6, 182, 212, 0.2); color: var(--accent-cyan);">
                            <tr>
                                <th style="padding: 12px;">Tempo (s)</th>
                                <th style="padding: 12px;">Pressão (psi)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dadosTabela.map(item => `
                                <tr style="border-top: 1px solid rgba(255,255,255,0.05);">
                                    <td style="padding: 10px;">${item.tempo}</td>
                                    <td style="padding: 10px; font-weight: bold; color: var(--alert-orange);">${item.pressao}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="dica-calculo" style="background: rgba(6, 182, 212, 0.1); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--accent-cyan);">
                    <p>💡 <strong>Dica do Comandante:</strong> Observe como a pressão muda a cada segundo. 
                    A taxa de variação (coeficiente <strong>a</strong>) é constante? 
                    Qual o valor inicial (coeficiente <strong>b</strong>) quando t = 0?</p>
                </div>
            </div>
            
            <div class="interacao-container glass-panel" style="padding: 1.5rem; border-radius: 12px;">
                <h3 class="interacao-titulo" style="text-align: center; margin-bottom: 1.5rem;">🔧 ATIVAR PROTOCOLO DE SEGURANÇA</h3>
                
                <div class="form-container">
                    <div class="form-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
                        <div class="campo-coeficiente" style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <label for="coef-a">Coeficiente <strong>a</strong> (taxa de variação):</label>
                            
                            <input type="text" id="coef-a" class="coef-input" inputmode="text" pattern="-?[0-9]*[.,]?[0-9]*" placeholder="0">                   
                        </div>
                        
                        <div class="campo-coeficiente" style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <label for="coef-b">Coeficiente <strong>b</strong> (valor inicial):</label>
                            
                            <input type="text" id="coef-b" class="coef-input" inputmode="text" pattern="-?[0-9]*[.,]?[0-9]*" placeholder="0">
                        </div>
                    </div>
                    
                    <div class="funcao-preview" style="text-align: center; padding: 1rem; background: rgba(0,0,0,0.4); border-radius: 8px; margin-bottom: 1.5rem;">
                        <p style="font-size: 1.2rem; color: var(--metallic-medium);">Lei de formação: <strong style="color: var(--accent-cyan); font-size: 1.4rem;" id="funcao-formatada">f(x) = <span class="variavel-a">_</span>x + <span class="variavel-b">_</span></strong></p>
                    </div>
                    
                    <div class="botoes-acao" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <button id="btn-verificar-n1" class="btn-missao" style="max-width: 250px; margin: 0;">ATIVAR PROTOCOLO</button>
                        <button id="btn-limpar-n1" class="btn-secundario" style="margin: 0;">LIMPAR</button>
                    </div>
                </div>
            </div>
            
            <div id="feedback-nivel1" class="feedback-container hidden">
                <div class="feedback-conteudo">
                    <span class="feedback-icone" id="feedback-icone-n1"></span>
                    <p id="feedback-mensagem-n1"></p>
                </div>
                <button id="btn-avancar-n1" class="btn-avancar hidden">AVANÇAR PARA NÍVEL 2 →</button>
            </div>
        </div>
    `;
    
    nivelContainer.innerHTML = nivelHTML;
    configurarNivel1(coeficienteEsperadoA, coeficienteEsperadoB);
}


/**
 * NÍVEL 1 - Registro de tentativas em CADA clique (corrigido)
 */
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
        // Se já concluiu, não faz nada
        if (nivelConcluido) return;
        
        // Dentro de configurarNivel1, no btnVerificar:
        const valA = converterValorDecimal(inputA.value);
        const valB = converterValorDecimal(inputB.value);
        
        // Validar preenchimento (também conta como tentativa? Vamos contar)
        if (isNaN(valA) || isNaN(valB)) {
            // 🔴 INCREMENTA TENTATIVA MESMO PARA CAMPOS VAZIOS
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
        
        // 🔴 INCREMENTA TENTATIVA PARA CADA CLIQUE (ANTES DA VALIDAÇÃO)
        GameState.progresso.nivel1.tentativas++;
        console.log(`Nível 1 - Tentativa ${GameState.progresso.nivel1.tentativas}: a=${valA}, b=${valB}`);
        
        const aCorreto = Math.abs(valA - aEsperado) < 0.01;
        const bCorreto = Math.abs(valB - bEsperado) < 0.01;
        
        if (aCorreto && bCorreto) {
            // SUCESSO
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
            
        // ===== DENTRO DO NÍVEL 1 - BLOCO DE ERRO =====
} else {
    // ERRO - Registra detalhes antes de incrementar tentativa
    const aCorreto = Math.abs(valA - aEsperado) < 0.01;
    const bCorreto = Math.abs(valB - bEsperado) < 0.01;
    
    // Registrar erro com detalhes
    let tipoErro = '';
    if (!aCorreto && !bCorreto) {
        tipoErro = 'ambos';
        registrarErro('nivel1', {
            tipo: 'ambos',
            valorA: valA,
            valorB: valB,
            esperadoA: aEsperado,
            esperadoB: bEsperado,
            diferencaA: (valA - aEsperado).toFixed(2),
            diferencaB: (valB - bEsperado).toFixed(2)
        });
    } else if (!aCorreto) {
        tipoErro = 'coeficiente_a';
        registrarErro('nivel1', {
            tipo: 'coeficiente_a',
            valorA: valA,
            esperadoA: aEsperado,
            diferenca: (valA - aEsperado).toFixed(2)
        });
    } else if (!bCorreto) {
        tipoErro = 'coeficiente_b';
        registrarErro('nivel1', {
            tipo: 'coeficiente_b',
            valorB: valB,
            esperadoB: bEsperado,
            diferenca: (valB - bEsperado).toFixed(2)
        });
    }
    
    // 🔴 INCREMENTA TENTATIVA
    GameState.progresso.nivel1.tentativas++;
    console.log(`Nível 1 - Tentativa ${GameState.progresso.nivel1.tentativas}: a=${valA}, b=${valB} (ERRO: ${tipoErro})`);
    
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
        carregarNivel(2);
    });
}

// ===== NÍVEL 2 (mantido exatamente como estava) =====
function carregarNivel2() {
    GameState.progresso.nivel2.tentativas++;
    
    const alvo = {
        x: Math.floor(Math.random() * 6) + 2,
        y: Math.floor(Math.random() * 8) + 2
    };
    
    const sliderInicialA = Math.random() * 4 - 2;
    const sliderInicialB = Math.random() * 8 - 2;
    
    const nivelHTML = `
        <div class="nivel-card" id="nivel2">
            <div class="nivel-header">
                <div class="nivel-titulo">
                    <span class="nivel-numero">NÍVEL 2</span>
                    <h2>☀️ Calibragem dos Painéis Solares</h2>
                </div>
                <div class="nivel-status" id="status-nivel2">
                    <span class="status-indicator">⚡ EMERGÊNCIA ENERGÉTICA</span>
                </div>
            </div>
            
            <div class="missao-briefing">
                <p class="comandante-fala">
                    "A tempestade desalinhou os gigantescos painéis solares da base. 
                    A geração de energia depende do ângulo de incidência solar. 
                    Você precisa reposicionar os refletores para que o feixe de luz atinja 
                    o <strong>ponto de coleta principal (${alvo.x}, ${alvo.y})</strong> no plano cartesiano."
                </p>
            </div>
            
            <div class="grafico-container" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem;">
                <canvas id="canvas-nivel2" width="600" height="400"></canvas>
                
                <div class="coords-panel" style="display: flex; justify-content: space-around; background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 8px; margin-top: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                    <div class="coord-item" style="text-align: center;">
                        <span class="coord-label" style="color: var(--metallic-medium); display: block; font-size: 0.9rem; text-transform: uppercase;">Ponto-alvo:</span>
                        <span class="coord-value" id="alvo-coords" style="font-size: 1.3rem; font-weight: bold; color: var(--alert-orange);">(${alvo.x}, ${alvo.y})</span>
                    </div>
                    <div class="coord-item" style="text-align: center;">
                        <span class="coord-label" style="color: var(--metallic-medium); display: block; font-size: 0.9rem; text-transform: uppercase;">Reta atual:</span>
                        <span class="coord-value" id="reta-equacao" style="font-size: 1.3rem; font-weight: bold; color: var(--accent-cyan);">f(x) = <span id="a-valor">0.00</span>x + <span id="b-valor">0.00</span></span>
                    </div>
                </div>
            </div>
            
            <div class="sliders-container glass-panel" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; padding: 1.5rem; margin-bottom: 1.5rem;">
                <div class="slider-item">
                    <div class="slider-header" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <label for="slider-a">Coeficiente <strong>a</strong> (inclinação):</label>
                        <span id="slider-a-value" class="slider-value" style="font-weight: bold; color: var(--accent-cyan);">0.00</span>
                    </div>
                    <input type="range" id="slider-a" class="slider" min="-4" max="4" step="0.1" value="${sliderInicialA.toFixed(1)}">
                    <div class="slider-dica" style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--metallic-medium);">
                        <span>↘️ Negativo</span>
                        <span>➡️ Zero</span>
                        <span>↗️ Positivo</span>
                    </div>
                </div>
                
                <div class="slider-item">
                    <div class="slider-header" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <label for="slider-b">Coeficiente <strong>b</strong> (altura):</label>
                        <span id="slider-b-value" class="slider-value" style="font-weight: bold; color: var(--accent-cyan);">0.00</span>
                    </div>
                    <input type="range" id="slider-b" class="slider" min="-4" max="10" step="0.1" value="${sliderInicialB.toFixed(1)}">
                    <div class="slider-dica" style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--metallic-medium);">
                        <span>⬇️ Abaixo</span>
                        <span>⚪ Interseção Y</span>
                        <span>⬆️ Acima</span>
                    </div>
                </div>
            </div>
            
            <div class="proximidade-container glass-panel" style="padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
                <div class="proximidade-header" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: bold;">
                    <span>📡 PROXIMIDADE DO ALVO</span>
                    <span id="proximidade-percentual" style="color: var(--accent-cyan);">0%</span>
                </div>
                <div class="proximidade-bar" style="height: 12px; background: rgba(0,0,0,0.5); border-radius: 6px; overflow: hidden; box-shadow: inset 0 0 5px rgba(0,0,0,0.8);">
                    <div id="proximidade-preenchimento" class="proximidade-preenchimento" style="width: 0%; height: 100%; background: var(--alert-red); transition: width 0.3s ease, background-color 0.3s ease;"></div>
                </div>
            </div>
            
            <div id="feedback-nivel2" class="feedback-container hidden">
                <div class="feedback-conteudo">
                    <span class="feedback-icone" id="feedback-icone-n2"></span>
                    <p id="feedback-mensagem-n2"></p>
                </div>
            </div>
            
            <div class="botoes-container" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button id="btn-verificar-n2" class="btn-missao" style="margin: 0; max-width: 250px;">VERIFICAR ALINHAMENTO</button>
                <button id="btn-reiniciar-n2" class="btn-secundario" style="margin: 0;">REINICIAR</button>
                <button id="btn-avancar-n2" class="btn-avancar hidden" style="margin: 0; width: auto;">AVANÇAR PARA NÍVEL 3 →</button>
            </div>
        </div>
    `;
    
    nivelContainer.innerHTML = nivelHTML;
    configurarNivel2(alvo);
}

function configurarNivel2(alvo) {
    const canvas = document.getElementById('canvas-nivel2');
    const ctx = canvas.getContext('2d');
    
    const sliderA = document.getElementById('slider-a');
    const sliderB = document.getElementById('slider-b');
    const sliderAValue = document.getElementById('slider-a-value');
    const sliderBValue = document.getElementById('slider-b-value');
    const aValorSpan = document.getElementById('a-valor');
    const bValorSpan = document.getElementById('b-valor');
    
    const proximidadePercentual = document.getElementById('proximidade-percentual');
    const proximidadePreenchimento = document.getElementById('proximidade-preenchimento');
    
    const btnVerificar = document.getElementById('btn-verificar-n2');
    const btnReiniciar = document.getElementById('btn-reiniciar-n2');
    const btnAvancar = document.getElementById('btn-avancar-n2');
    const feedbackContainer = document.getElementById('feedback-nivel2');
    const feedbackIcone = document.getElementById('feedback-icone-n2');
    const feedbackMensagem = document.getElementById('feedback-mensagem-n2');
    
    const padding = 50;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    const xMin = -2;
    const xMax = 10;
    const yMin = -4;
    const yMax = 12;
    
    function worldToCanvasX(x) {
        return padding + ((x - xMin) / (xMax - xMin)) * width;
    }
    
    function worldToCanvasY(y) {
        return canvas.height - (padding + ((y - yMin) / (yMax - yMin)) * height);
    }
    
    let nivelConcluido = false;
    
    function desenharGrafico() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(11, 14, 31, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(107, 114, 128, 0.2)';
        ctx.lineWidth = 1;
        
        for (let x = xMin; x <= xMax; x++) {
            if (x === 0) continue;
            const canvasX = worldToCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(canvasX, padding);
            ctx.lineTo(canvasX, canvas.height - padding);
            ctx.stroke();
        }
        
        for (let y = yMin; y <= yMax; y++) {
            if (y === 0) continue;
            const canvasY = worldToCanvasY(y);
            ctx.beginPath();
            ctx.moveTo(padding, canvasY);
            ctx.lineTo(canvas.width - padding, canvasY);
            ctx.stroke();
        }
        
        ctx.strokeStyle = 'var(--metallic-medium)';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(padding, worldToCanvasY(0));
        ctx.lineTo(canvas.width - padding, worldToCanvasY(0));
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(worldToCanvasX(0), padding);
        ctx.lineTo(worldToCanvasX(0), canvas.height - padding);
        ctx.stroke();
        
        ctx.fillStyle = 'var(--metallic-light)';
        ctx.font = '12px var(--font-primary)';
        ctx.textAlign = 'center';
        
        for (let x = xMin; x <= xMax; x++) {
            if (x === 0) continue;
            const canvasX = worldToCanvasX(x);
            ctx.fillText(x, canvasX, worldToCanvasY(0) + 20);
        }
        
        ctx.textAlign = 'right';
        for (let y = yMin; y <= yMax; y++) {
            if (y === 0) continue;
            const canvasY = worldToCanvasY(y);
            ctx.fillText(y, worldToCanvasX(0) - 10, canvasY + 5);
        }
        
        ctx.fillStyle = 'var(--alert-orange)';
        ctx.fillText('0', worldToCanvasX(0) - 15, worldToCanvasY(0) + 5);
        
        ctx.beginPath();
        ctx.arc(worldToCanvasX(alvo.x), worldToCanvasY(alvo.y), 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(249, 115, 22, 0.3)';
        ctx.fill();
        ctx.strokeStyle = 'var(--alert-orange)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(worldToCanvasX(alvo.x), worldToCanvasY(alvo.y), 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'var(--alert-orange)';
        ctx.fill();
        
        const a = parseFloat(sliderA.value);
        const b = parseFloat(sliderB.value);
        
        const x1 = xMin;
        const y1 = a * x1 + b;
        const x2 = xMax;
        const y2 = a * x2 + b;
        
        if (!isNaN(y1) && !isNaN(y2)) {
            ctx.beginPath();
            ctx.moveTo(worldToCanvasX(x1), worldToCanvasY(Math.max(yMin, Math.min(yMax, y1))));
            ctx.lineTo(worldToCanvasX(x2), worldToCanvasY(Math.max(yMin, Math.min(yMax, y2))));
            ctx.strokeStyle = 'var(--alert-yellow)';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            ctx.shadowColor = 'var(--alert-yellow)';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        sliderAValue.textContent = a.toFixed(2);
        sliderBValue.textContent = b.toFixed(2);
        aValorSpan.textContent = a.toFixed(2);
        bValorSpan.textContent = b.toFixed(2);
        
        const yRetaNoAlvo = a * alvo.x + b;
        const distancia = Math.abs(yRetaNoAlvo - alvo.y);
        const proximidade = Math.max(0, Math.min(100, 100 - (distancia * 20)));
        
        proximidadePercentual.textContent = `${Math.round(proximidade)}%`;
        proximidadePreenchimento.style.width = `${proximidade}%`;
        
        if (proximidade > 90) {
            proximidadePreenchimento.style.background = 'var(--success-green)';
        } else if (proximidade > 50) {
            proximidadePreenchimento.style.background = 'var(--alert-yellow)';
        } else {
            proximidadePreenchimento.style.background = 'var(--alert-red)';
        }
    }
    
    function verificarAlvo() {
        if (nivelConcluido) return;
        
        const a = parseFloat(sliderA.value);
        const b = parseFloat(sliderB.value);
        const yReta = a * alvo.x + b;
        const distancia = Math.abs(yReta - alvo.y);
        
        if (distancia <= 0.3) {
            nivelConcluido = true;
            GameState.progresso.nivel2.concluido = true;
            GameState.niveisCompletos[1] = true;
            GameState.statusBase.energia = true;
            atualizarLEDs();
            
            feedbackIcone.innerHTML = '🏆';
            feedbackContainer.style.borderLeftColor = 'var(--success-green)';
            feedbackContainer.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            feedbackMensagem.innerHTML = `✅ ALINHAMENTO CONFIRMADO! Energia sendo redirecionada. 
                Você conseguiu visualizar como a = ${a.toFixed(2)} controla a inclinação e b = ${b.toFixed(2)} define a altura da reta. 
                O ponto (${alvo.x}, ${alvo.y}) foi alcançado com sucesso!`;
            
            feedbackContainer.classList.remove('hidden');
            btnAvancar.classList.remove('hidden');
            desenharGrafico();
            
        } else {
            feedbackIcone.innerHTML = '📡';
            feedbackContainer.style.borderLeftColor = 'var(--alert-yellow)';
            feedbackContainer.style.backgroundColor = 'rgba(251, 191, 36, 0.1)';
            
            if (distancia < 1) {
                feedbackMensagem.innerHTML = `⚠️ MUITO PERTO! Distância de ${distancia.toFixed(2)} unidades. Ajuste finamente os sliders.`;
            } else {
                feedbackMensagem.innerHTML = `⚠️ AINDA DISTANTE! Distância de ${distancia.toFixed(2)} unidades. Continue ajustando a inclinação (a) e altura (b).`;
            }
            
            feedbackContainer.classList.remove('hidden');
            btnAvancar.classList.add('hidden');
            
            setTimeout(() => {
                if (!nivelConcluido) {
                    feedbackContainer.classList.add('hidden');
                }
            }, 3000);
        }
    }
    
    sliderA.addEventListener('input', () => {
        desenharGrafico();
        if (!nivelConcluido) {
            feedbackContainer.classList.add('hidden');
        }
    });
    
    sliderB.addEventListener('input', () => {
        desenharGrafico();
        if (!nivelConcluido) {
            feedbackContainer.classList.add('hidden');
        }
    });
    
    btnVerificar.addEventListener('click', verificarAlvo);
    
  btnVerificar.addEventListener('click', () => {
    if (nivelConcluido) return;
    
    // 🔴 INCREMENTA TENTATIVA PARA CADA CLIQUE
    GameState.progresso.nivel2.tentativas++;
    console.log(`Nível 2 - Tentativa ${GameState.progresso.nivel2.tentativas}: a=${parseFloat(sliderA.value)}, b=${parseFloat(sliderB.value)}`);
    
    const a = parseFloat(sliderA.value);
    const b = parseFloat(sliderB.value);
    const yReta = a * alvo.x + b;
    const distancia = Math.abs(yReta - alvo.y);
    
    if (distancia <= 0.3) {
        // SUCESSO
        nivelConcluido = true;
        GameState.progresso.nivel2.concluido = true;
        GameState.niveisCompletos[1] = true;
        GameState.statusBase.energia = true;
        atualizarLEDs();
        
        feedbackIcone.innerHTML = '🏆';
        feedbackContainer.style.borderLeftColor = 'var(--success-green)';
        feedbackContainer.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        feedbackMensagem.innerHTML = `✅ ALINHAMENTO CONFIRMADO! Energia sendo redirecionada. 
            Você conseguiu visualizar como a = ${a.toFixed(2)} controla a inclinação e b = ${b.toFixed(2)} define a altura da reta. 
            O ponto (${alvo.x}, ${alvo.y}) foi alcançado com sucesso!`;
        
        feedbackContainer.classList.remove('hidden');
        btnAvancar.classList.remove('hidden');
        desenharGrafico();
        
    
        // ===== DENTRO DO NÍVEL 2 - BLOCO DE ERRO =====
} else {
    // Registrar erro com detalhes
    registrarErro('nivel2', {
        tipo: 'alinhamento',
        a: a,
        b: b,
        distancia: distancia,
        alvoX: alvo.x,
        alvoY: alvo.y,
        yCalculado: yReta,
        diferenca: distancia
    });
    
    // 🔴 INCREMENTA TENTATIVA
    GameState.progresso.nivel2.tentativas++;
    console.log(`Nível 2 - Tentativa ${GameState.progresso.nivel2.tentativas}: a=${a}, b=${b} (distância: ${distancia.toFixed(2)})`);
    
    feedbackIcone.innerHTML = '📡';
    feedbackContainer.style.borderLeftColor = 'var(--alert-yellow)';
    feedbackContainer.style.backgroundColor = 'rgba(251, 191, 36, 0.1)';
    
    if (distancia < 1) {
        feedbackMensagem.innerHTML = `⚠️ MUITO PERTO! Distância de ${distancia.toFixed(2)} unidades. Ajuste finamente os sliders.`;
    } else {
        feedbackMensagem.innerHTML = `⚠️ AINDA DISTANTE! Distância de ${distancia.toFixed(2)} unidades. Continue ajustando a inclinação (a) e altura (b).`;
    }
    
    feedbackContainer.classList.remove('hidden');
    btnAvancar.classList.add('hidden');
    
    setTimeout(() => {
        if (!nivelConcluido) {
            feedbackContainer.classList.add('hidden');
        }
    }, 3000);
}

});
    
    btnAvancar.addEventListener('click', () => {
        carregarNivel(3);
    });
    
    desenharGrafico();
    
    let animacaoFrame;
    function animar() {
        desenharGrafico();
        animacaoFrame = requestAnimationFrame(animar);
    }
    
    const nivelAtual = document.getElementById('nivel2');
    if (nivelAtual) {
        animar();
    }
}

// ===== NÍVEL 3 (mantido exatamente como estava na versão refatorada) =====
function carregarNivel3() {
    GameState.progresso.nivel3.tentativas++;
    
    const padroes = [
        { a: 1, b: -2, descricao: "Reta crescente que cruza y em -2 e x em 2" },
        { a: 2, b: 1, descricao: "Reta íngreme que cruza y em 1" },
        { a: -1.5, b: 3, descricao: "Reta decrescente que cruza y em 3" },
        { a: 0.5, b: -1, descricao: "Reta suave que cruza y em -1" },
        { a: -0.5, b: 2, descricao: "Reta levemente decrescente" },
        { a: 1.5, b: -3, descricao: "Reta íngreme que cruza y em -3" }
    ];
    
    const padraoEscolhido = padroes[Math.floor(Math.random() * padroes.length)];
    const aEsperado = padraoEscolhido.a;
    const bEsperado = padraoEscolhido.b;
    
    const raiz = -bEsperado / aEsperado;
    
    const nivelHTML = `
        <div class="nivel-card" id="nivel3">
            <div class="nivel-header">
                <div class="nivel-titulo">
                    <span class="nivel-numero">NÍVEL 3</span>
                    <h2>🛰️ Decodificando a Mensagem do Satélite</h2>
                </div>
                <div class="nivel-status" id="status-nivel3">
                    <span class="status-indicator">📡 SINAL FRACO</span>
                </div>
            </div>
            
            <div class="missao-briefing">
                <p class="comandante-fala">
                    "Captamos um sinal fraco de um satélite de comunicação danificado. 
                    A mensagem está cifrada na forma de uma função. Recebemos apenas o gráfico da função. 
                    Para decodificar a mensagem, precisamos da sua lei de formação <strong>f(x) = ax + b</strong>. 
                    Use sua leitura gráfica para extrair os coeficientes."
                </p>
            </div>
            
            <div class="grafico-estatico-container">
                <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 12px;">
                    <canvas id="canvas-nivel3" width="800" height="500"></canvas>
                </div>
                
                <div class="controles-visualizacao" style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem; flex-wrap: wrap;">
                    <button id="btn-mostrar-pontos" class="btn-secundario ativo">📍 Mostrar Pontos</button>
                    <button id="btn-grade-fina" class="btn-secundario ativo">🔲 Grade Fina</button>
                    <button id="btn-redefinir-visual" class="btn-secundario">🔄 Redefinir</button>
                </div>
                
                <div class="dicas-leitura glass-panel" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; padding: 1.5rem; margin-top: 1.5rem; text-align: center;">
                    <div class="dica-item">
                        <span class="dica-icone" style="font-size: 1.5rem;">📌</span>
                        <span class="dica-texto" style="display: block; font-size: 0.9rem; color: var(--metallic-medium); margin-top: 0.5rem;">Onde a reta cruza o eixo Y? (coeficiente <strong>b</strong>)</span>
                        <span class="dica-valor" id="dica-b-valor" style="display: block; font-size: 1.5rem; font-weight: bold; color: var(--accent-cyan);">${bEsperado >= 0 ? '+' : ''}${bEsperado}</span>
                    </div>
                    <div class="dica-item">
                        <span class="dica-icone" style="font-size: 1.5rem;">📐</span>
                        <span class="dica-texto" style="display: block; font-size: 0.9rem; color: var(--metallic-medium); margin-top: 0.5rem;">Qual a inclinação? (coeficiente <strong>a</strong> = Δy/Δx)</span>
                        <span class="dica-valor" id="dica-a-valor" style="display: block; font-size: 1.5rem; font-weight: bold; color: var(--accent-cyan);">${aEsperado >= 0 ? '+' : ''}${aEsperado}</span>
                    </div>
                    <div class="dica-item">
                        <span class="dica-icone" style="font-size: 1.5rem;">🎯</span>
                        <span class="dica-texto" style="display: block; font-size: 0.9rem; color: var(--metallic-medium); margin-top: 0.5rem;">A reta cruza o eixo X em:</span>
                        <span style="display: block; font-size: 1.5rem; font-weight: bold; color: var(--success-green);">x = ${raiz.toFixed(1)}</span>
                    </div>
                </div>
            </div>
            
            <div class="decodificacao-container glass-panel" style="padding: 1.5rem; margin-top: 2rem;">
                <h3 class="decodificacao-titulo" style="text-align: center; margin-bottom: 1.5rem;">🔓 DECODIFICAR MENSAGEM</h3>
                
                <div class="coeficientes-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
                    <div class="coeficiente-card" id="card-a" style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; text-align: center;">
                        <div class="coeficiente-header" style="margin-bottom: 1rem;">
                            <span class="coeficiente-simbolo" style="font-size: 1.5rem; font-weight: bold; color: var(--accent-magenta); display: block;">a</span>
                            <span class="coeficiente-nome" style="color: var(--metallic-medium); font-size: 0.9rem; text-transform: uppercase;">Coeficiente Angular</span>
                        </div>
                        <div class="coeficiente-input-group" style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
                            <input type="text" id="coef-a-n3" class="coef-input" inputmode="text" pattern="-?[0-9]*[.,]?[0-9]*" placeholder="0">                            
                            <span class="coeficiente-unidade" style="font-size: 0.8rem; color: var(--metallic-dark);">inclinação</span>
                        </div>
                        <div class="coeficiente-dica" id="dica-a" style="margin-top: 1rem; font-size: 0.85rem; color: var(--metallic-medium);">
                            <span class="dica-math">a = Δy/Δx = (y₂ - y₁)/(x₂ - x₁)</span>
                        </div>
                    </div>
                    
                <div class="coeficiente-card" id="card-b" style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; text-align: center;">
                    <div class="coeficiente-header" style="margin-bottom: 1rem;">
                        <span class="coeficiente-simbolo" style="font-size: 1.5rem; font-weight: bold; color: var(--accent-magenta); display: block;">b</span>
                        <span class="coeficiente-nome" style="color: var(--metallic-medium); font-size: 0.9rem; text-transform: uppercase;">Coeficiente Linear</span>
                    </div>
                    <div class="coeficiente-input-group" style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
                        <input type="text" id="coef-b-n3" class="coef-input" inputmode="text" pattern="-?[0-9]*[.,]?[0-9]*" placeholder="0">
                        <span class="coeficiente-unidade" style="font-size: 0.8rem; color: var(--metallic-dark);">valor inicial</span>
                    </div>
                    <div class="coeficiente-dica" id="dica-b" style="margin-top: 1rem; font-size: 0.85rem; color: var(--metallic-medium);">
                        <span class="dica-math">b = f(0) = valor onde x = 0</span>
                    </div>
                </div>
                </div>
                
                <div class="funcao-preview-container" style="text-align: center; padding: 1rem; background: rgba(0,0,0,0.4); border-radius: 8px; margin-bottom: 1.5rem;">
                    <p class="funcao-preview-label" style="font-size: 1rem; color: var(--metallic-medium);">Lei de formação:</p>
                    <p class="funcao-preview-equacao" id="preview-funcao-n3" style="font-size: 1.5rem; font-weight: bold; color: var(--accent-cyan);">
                        f(x) = <span id="preview-a">_</span>x + <span id="preview-b">_</span>
                    </p>
                </div>
                
                <div class="feedback-detalhado" id="feedback-detalhado-n3" style="text-align: center; font-weight: bold; margin-bottom: 1rem;">
                    <div class="feedback-coeficiente" id="feedback-a-n3"></div>
                    <div class="feedback-coeficiente" id="feedback-b-n3"></div>
                </div>
                
                <div class="botoes-decodificar" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button id="btn-decodificar-n3" class="btn-missao" style="margin: 0; max-width: 280px;">📡 DECODIFICAR</button>
                    <button id="btn-limpar-n3" class="btn-secundario" style="margin: 0;">LIMPAR</button>
                    <button id="btn-dica-n3" class="btn-secundario" style="margin: 0;">🔍 DICA</button>
                </div>
                
                <button id="btn-avancar-n3" class="btn-avancar hidden" style="margin-top: 1.5rem;">AVANÇAR PARA NÍVEL 4 →</button>
            </div>
            
            <div id="feedback-nivel3" class="feedback-container hidden">
                <div class="feedback-conteudo">
                    <span class="feedback-icone" id="feedback-icone-n3"></span>
                    <p id="feedback-mensagem-n3"></p>
                </div>
            </div>
        </div>
    `;
    
    nivelContainer.innerHTML = nivelHTML;
    configurarNivel3(aEsperado, bEsperado, padraoEscolhido.descricao);
}

/**
 * NÍVEL 3 CORRIGIDO - Registro de tentativas em cada erro
 */
function configurarNivel3(aEsperado, bEsperado, descricao) {
    const canvas = document.getElementById('canvas-nivel3');
    const ctx = canvas.getContext('2d');
    
    const inputA = document.getElementById('coef-a-n3');
    const inputB = document.getElementById('coef-b-n3');
    const previewA = document.getElementById('preview-a');
    const previewB = document.getElementById('preview-b');
    
    const btnDecodificar = document.getElementById('btn-decodificar-n3');
    const btnLimpar = document.getElementById('btn-limpar-n3');
    const btnDica = document.getElementById('btn-dica-n3');
    const btnAvancar = document.getElementById('btn-avancar-n3');
    const btnMostrarPontos = document.getElementById('btn-mostrar-pontos');
    const btnGradeFina = document.getElementById('btn-grade-fina');
    const btnRedefinir = document.getElementById('btn-redefinir-visual');
    
    const cardA = document.getElementById('card-a');
    const cardB = document.getElementById('card-b');
    const feedbackA = document.getElementById('feedback-a-n3');
    const feedbackB = document.getElementById('feedback-b-n3');
    const feedbackContainer = document.getElementById('feedback-nivel3');
    const feedbackIcone = document.getElementById('feedback-icone-n3');
    const feedbackMensagem = document.getElementById('feedback-mensagem-n3');
    
    let mostrarPontos = true;
    let gradeFina = true;
    let nivelConcluido = false;
    
    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    const xMin = -3;
    const xMax = 5;
    const yMin = -5;
    const yMax = 7;
    
    const escalaX = width / (xMax - xMin);
    const escalaY = height / (yMax - yMin);
    const escala = Math.min(escalaX, escalaY);
    
    const graphWidth = escala * (xMax - xMin);
    const graphHeight = escala * (yMax - yMin);
    const offsetX = (canvas.width - graphWidth) / 2;
    const offsetY = (canvas.height - graphHeight) / 2;
    
    const TOLERANCIA = 0.2;
    
    function worldToCanvasX(x) {
        return offsetX + (x - xMin) * escala;
    }
    
    function worldToCanvasY(y) {
        return canvas.height - (offsetY + (y - yMin) * escala);
    }
    
    function desenharGrafico() {
        // ... (manter o código de desenho exatamente como estava)
        // Não alterar a função de desenho, apenas a lógica de validação
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0B0E1F';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if (gradeFina) {
            ctx.strokeStyle = 'rgba(107, 114, 128, 0.15)';
            ctx.lineWidth = 0.5;
            
            for (let x = xMin; x <= xMax; x += 0.5) {
                if (Math.abs(x - Math.round(x)) < 0.01) continue;
                const canvasX = worldToCanvasX(x);
                ctx.beginPath();
                ctx.moveTo(canvasX, offsetY);
                ctx.lineTo(canvasX, canvas.height - offsetY);
                ctx.stroke();
            }
            
            for (let y = yMin; y <= yMax; y += 0.5) {
                if (Math.abs(y - Math.round(y)) < 0.01) continue;
                const canvasY = worldToCanvasY(y);
                ctx.beginPath();
                ctx.moveTo(offsetX, canvasY);
                ctx.lineTo(canvas.width - offsetX, canvasY);
                ctx.stroke();
            }
        }
        
        ctx.strokeStyle = 'rgba(156, 163, 175, 0.4)';
        ctx.lineWidth = 1;
        
        for (let x = xMin; x <= xMax; x++) {
            if (x === 0) continue;
            const canvasX = worldToCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(canvasX, offsetY);
            ctx.lineTo(canvasX, canvas.height - offsetY);
            ctx.stroke();
        }
        
        for (let y = yMin; y <= yMax; y++) {
            if (y === 0) continue;
            const canvasY = worldToCanvasY(y);
            ctx.beginPath();
            ctx.moveTo(offsetX, canvasY);
            ctx.lineTo(canvas.width - offsetX, canvasY);
            ctx.stroke();
        }
        
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(offsetX, worldToCanvasY(0));
        ctx.lineTo(canvas.width - offsetX, worldToCanvasY(0));
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(worldToCanvasX(0), offsetY);
        ctx.lineTo(worldToCanvasX(0), canvas.height - offsetY);
        ctx.stroke();
        
        ctx.fillStyle = '#E5E7EB';
        ctx.font = 'bold 12px "Segoe UI", "Roboto", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let x = xMin; x <= xMax; x++) {
            const canvasX = worldToCanvasX(x);
            const canvasY = worldToCanvasY(0);
            
            ctx.fillStyle = '#0B0E1F';
            ctx.fillRect(canvasX - 12, canvasY + 5, 24, 18);
            
            ctx.fillStyle = x === 0 ? '#F97316' : '#E5E7EB';
            ctx.fillText(x, canvasX, canvasY + 18);
        }
        
        ctx.textAlign = 'right';
        for (let y = yMin; y <= yMax; y++) {
            const canvasX = worldToCanvasX(0);
            const canvasY = worldToCanvasY(y);
            
            ctx.fillStyle = '#0B0E1F';
            ctx.fillRect(canvasX - 30, canvasY - 8, 28, 18);
            
            ctx.fillStyle = y === 0 ? '#F97316' : '#E5E7EB';
            ctx.fillText(y, canvasX - 8, canvasY);
        }
        
        ctx.beginPath();
        ctx.moveTo(worldToCanvasX(xMin), worldToCanvasY(aEsperado * xMin + bEsperado));
        ctx.lineTo(worldToCanvasX(xMax), worldToCanvasY(aEsperado * xMax + bEsperado));
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        if (mostrarPontos) {
            const pontoB = { x: 0, y: bEsperado };
            desenharPontoDestaque(pontoB, '#F97316', 'b');
            
            const raiz = -bEsperado / aEsperado;
            const pontoRaiz = { x: raiz, y: 0 };
            desenharPontoDestaque(pontoRaiz, '#10B981', 'raiz');
            
            const pontoAux = { x: 1, y: aEsperado + bEsperado };
            desenharPontoDestaque(pontoAux, '#F97316', '1');
            
            const pontoAux2 = { x: 2, y: 2 * aEsperado + bEsperado };
            desenharPontoDestaque(pontoAux2, '#60A5FA', '2');
        }
        
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '12px "Segoe UI", "Roboto", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('f(x) = ' + (aEsperado >= 0 ? '+' : '') + aEsperado + 'x ' + (bEsperado >= 0 ? '+' : '') + bEsperado, offsetX + 10, offsetY + 25);
    }
    
    function desenharPontoDestaque(ponto, cor, label) {
        if (ponto.x < xMin || ponto.x > xMax || ponto.y < yMin || ponto.y > yMax) return;
        
        const canvasX = worldToCanvasX(ponto.x);
        const canvasY = worldToCanvasY(ponto.y);
        
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 10, 0, 2 * Math.PI);
        ctx.fillStyle = cor + '33';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = cor;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px "Segoe UI", "Roboto", sans-serif';
        ctx.textAlign = 'left';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.fillText(label, canvasX + 15, canvasY - 10);
        ctx.shadowBlur = 0;
    }
    
    function atualizarPreview() {
        const valA = inputA.value.trim() === '' ? '_' : converterValorDecimal(inputA.value).toFixed(2);
        const valB = inputB.value.trim() === '' ? '_' : converterValorDecimal(inputB.value).toFixed(2);
        previewA.textContent = isNaN(valA) ? '_' : valA;
        previewB.textContent = isNaN(valB) ? '_' : valB;
    }

    function validarCoeficientes() {
    // Se já concluiu, não faz nada
    if (nivelConcluido) return;
    
    const valA = converterValorDecimal(inputA.value);
    const valB = converterValorDecimal(inputB.value);
    
    cardA.classList.remove('sucesso', 'erro');
    cardB.classList.remove('sucesso', 'erro');
    feedbackA.innerHTML = '';
    feedbackB.innerHTML = '';
    
    // Validar preenchimento (também conta como tentativa)
    if (isNaN(valA) || isNaN(valB)) {
        // 🔴 INCREMENTA TENTATIVA MESMO PARA CAMPOS VAZIOS
        GameState.progresso.nivel3.tentativas++;
        console.log(`Nível 3 - Tentativa ${GameState.progresso.nivel3.tentativas}: Campos incompletos`);
        
        feedbackContainer.classList.remove('hidden');
        feedbackIcone.innerHTML = '⚠️';
        feedbackContainer.style.borderLeftColor = 'var(--alert-red)';
        feedbackContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        
        if (isNaN(valA) && isNaN(valB)) {
            feedbackMensagem.textContent = 'Preencha ambos os coeficientes, Cadete!';
        } else if (isNaN(valA)) {
            feedbackMensagem.textContent = 'Digite o coeficiente a (inclinação)!';
        } else {
            feedbackMensagem.textContent = 'Digite o coeficiente b (valor inicial)!';
        }
        
        setTimeout(() => {
            if (!nivelConcluido) feedbackContainer.classList.add('hidden');
        }, 3000);
        
        return;
    }
    
    // 🔴 INCREMENTA TENTATIVA PARA CADA CLIQUE (ANTES DA VALIDAÇÃO)
    GameState.progresso.nivel3.tentativas++;
    console.log(`Nível 3 - Tentativa ${GameState.progresso.nivel3.tentativas}: a=${valA}, b=${valB}`);
    
    const diffA = Math.abs(valA - aEsperado);
    const diffB = Math.abs(valB - bEsperado);
    
    const aCorreto = diffA <= TOLERANCIA;
    const bCorreto = diffB <= TOLERANCIA;
    
    if (aCorreto) {
        cardA.classList.add('sucesso');
        feedbackA.innerHTML = '✅ Correto!';
    } else {
        cardA.classList.add('erro');
        let dicaA = '';
        if (valA > aEsperado) {
            dicaA = '📈 Inclinação muito íngreme. Tente um valor menor.';
        } else {
            dicaA = '📉 Inclinação muito suave. Tente um valor maior.';
        }
        feedbackA.innerHTML = `❌ ${dicaA}`;
    }
    
    if (bCorreto) {
        cardB.classList.add('sucesso');
        feedbackB.innerHTML = '✅ Correto!';
    } else {
        cardB.classList.add('erro');
        let dicaB = '';
        if (valB > bEsperado) {
            dicaB = '⬆️ Reta muito alta. Onde ela cruza o eixo Y?';
        } else {
            dicaB = '⬇️ Reta muito baixa. Onde ela cruza o eixo Y?';
        }
        feedbackB.innerHTML = `❌ ${dicaB}`;
    }
    
    if (aCorreto && bCorreto) {
        // SUCESSO
        nivelConcluido = true;
        GameState.progresso.nivel3.concluido = true;
        GameState.niveisCompletos[2] = true;
        GameState.statusBase.comunicacao = true;
        atualizarLEDs();
        
        feedbackIcone.innerHTML = '🏆';
        feedbackContainer.style.borderLeftColor = 'var(--success-green)';
        feedbackContainer.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        
        const sinalA = aEsperado >= 0 ? '+' : '';
        const sinalB = bEsperado >= 0 ? '+' : '';
        
        feedbackMensagem.innerHTML = `✅ MENSAGEM DECODIFICADA! "Suprimentos a caminho. Resistam." 
            <br><br>Excelente trabalho de análise, Cadete! A função <strong>f(x) = ${sinalA}${aEsperado}x ${sinalB} ${bEsperado}</strong> foi extraída com sucesso.
            <br><br><span style="color: var(--metallic-medium);">🔍 ${descricao}</span>`;
        
        feedbackContainer.classList.remove('hidden');
        btnAvancar.classList.remove('hidden');
        
    // ===== DENTRO DO NÍVEL 3 - BLOCO DE ERRO =====
} else {
    // Registrar erro com detalhes
    if (!aCorreto && !bCorreto) {
        registrarErro('nivel3', {
            tipo: 'ambos',
            valorA: valA,
            valorB: valB,
            esperadoA: aEsperado,
            esperadoB: bEsperado
        });
    } else if (!aCorreto) {
        registrarErro('nivel3', {
            tipo: 'coeficiente_a',
            valorA: valA,
            esperadoA: aEsperado,
            diferenca: valA - aEsperado
        });
    } else if (!bCorreto) {
        registrarErro('nivel3', {
            tipo: 'coeficiente_b',
            valorB: valB,
            esperadoB: bEsperado,
            diferenca: valB - bEsperado
        });
    }
    
    // 🔴 INCREMENTA TENTATIVA
    GameState.progresso.nivel3.tentativas++;
    console.log(`Nível 3 - Tentativa ${GameState.progresso.nivel3.tentativas}: a=${valA}, b=${valB} (ERRO)`);
    
    // Feedbacks específicos (já existentes)
    if (!aCorreto) {
        let dicaA = '';
        if (valA > aEsperado) {
            dicaA = '📈 Inclinação muito íngreme. Tente um valor menor.';
        } else {
            dicaA = '📉 Inclinação muito suave. Tente um valor maior.';
        }
        feedbackA.innerHTML = `❌ ${dicaA}`;
    }
    
    if (!bCorreto) {
        let dicaB = '';
        if (valB > bEsperado) {
            dicaB = '⬆️ Reta muito alta. Onde ela cruza o eixo Y?';
        } else {
            dicaB = '⬇️ Reta muito baixa. Onde ela cruza o eixo Y?';
        }
        feedbackB.innerHTML = `❌ ${dicaB}`;
    }
    
    feedbackIcone.innerHTML = '📡';
    feedbackContainer.style.borderLeftColor = 'var(--alert-yellow)';
    feedbackContainer.style.backgroundColor = 'rgba(251, 191, 36, 0.1)';
    feedbackMensagem.textContent = 'A mensagem continua um mistério. Observe atentamente o gráfico e ajuste os coeficientes.';
    feedbackContainer.classList.remove('hidden');
    btnAvancar.classList.add('hidden');
    
    setTimeout(() => {
        if (!nivelConcluido) {
            feedbackContainer.classList.add('hidden');
        }
    }, 4000);
}
}
    
    inputA.addEventListener('input', () => {
        atualizarPreview();
        if (!nivelConcluido) {
            feedbackContainer.classList.add('hidden');
            cardA.classList.remove('erro', 'sucesso');
            cardB.classList.remove('erro', 'sucesso');
            feedbackA.innerHTML = '';
            feedbackB.innerHTML = '';
        }
    });
    
    inputB.addEventListener('input', () => {
        atualizarPreview();
        if (!nivelConcluido) {
            feedbackContainer.classList.add('hidden');
            cardA.classList.remove('erro', 'sucesso');
            cardB.classList.remove('erro', 'sucesso');
            feedbackA.innerHTML = '';
            feedbackB.innerHTML = '';
        }
    });
    
    btnDecodificar.addEventListener('click', validarCoeficientes);
    
    btnLimpar.addEventListener('click', () => {
        inputA.value = '';
        inputB.value = '';
        atualizarPreview();
        cardA.classList.remove('erro', 'sucesso');
        cardB.classList.remove('erro', 'sucesso');
        feedbackA.innerHTML = '';
        feedbackB.innerHTML = '';
        feedbackContainer.classList.add('hidden');
    });
    
    btnDica.addEventListener('click', () => {
        let dicaTexto = '';
        if (Math.random() > 0.5) {
            dicaTexto = `🔍 DICA: Observe onde a reta cruza o eixo Y. O valor é b = ${bEsperado}`;
        } else {
            dicaTexto = `🔍 DICA: Use os pontos destacados no gráfico. De (0, ${bEsperado}) até (1, ${(aEsperado + bEsperado).toFixed(1)}) a inclinação é ${aEsperado}!`;
        }
        
        feedbackIcone.innerHTML = '💡';
        feedbackContainer.style.borderLeftColor = 'var(--alert-orange)';
        feedbackContainer.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';
        feedbackMensagem.textContent = dicaTexto;
        feedbackContainer.classList.remove('hidden');
        
        setTimeout(() => {
            if (!nivelConcluido) {
                feedbackContainer.classList.add('hidden');
            }
        }, 5000);
    });
    
    btnAvancar.addEventListener('click', () => {
        carregarNivel(4);
    });
    
    btnMostrarPontos.addEventListener('click', () => {
        mostrarPontos = !mostrarPontos;
        btnMostrarPontos.classList.toggle('ativo', mostrarPontos);
        desenharGrafico();
    });
    
    btnGradeFina.addEventListener('click', () => {
        gradeFina = !gradeFina;
        btnGradeFina.classList.toggle('ativo', gradeFina);
        desenharGrafico();
    });
    
    btnRedefinir.addEventListener('click', () => {
        mostrarPontos = true;
        gradeFina = true;
        btnMostrarPontos.classList.add('ativo');
        btnGradeFina.classList.add('ativo');
        desenharGrafico();
    });
    
    desenharGrafico();
    atualizarPreview();
}

// ===== NÍVEL 4 (mantido exatamente como estava) =====
function carregarNivel4() {
    GameState.progresso.nivel4.tentativas++;
    
    const a = -2.5;
    const b = 30;
    const raizExata = -b / a;
    
    const nivelHTML = `
        <div class="nivel-card" id="nivel4">
            <div class="nivel-header">
                <div class="nivel-titulo">
                    <span class="nivel-numero">NÍVEL 4</span>
                    <h2>🫧 Crise no Gerador de Oxigênio</h2>
                </div>
                <div class="nivel-status" id="status-nivel4">
                    <span class="status-indicator">⚠️ ALERTA CRÍTICO</span>
                </div>
            </div>
            
            <div class="missao-briefing">
                <p class="comandante-fala">
                    "ALERTA CRÍTICO! O gerador de oxigênio está com uma falha. 
                    O nível de oxigênio (em litros) está caindo linearmente de acordo com a função 
                    <strong>O(t) = -2,5t + 30</strong>, onde 't' é o tempo em minutos. 
                    Precisamos saber EXATAMENTE em que momento o oxigênio chegará a zero 
                    para acionar o sistema de reserva. Encontre a raiz da função!"
                </p>
            </div>
            
            <div class="grafico-interativo-container">
                <div class="zoom-container glass-panel" style="display: flex; flex-direction: column; align-items: center; padding: 1.5rem; margin-bottom: 1.5rem;">
                    <div class="zoom-header" style="width: 100%; display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: bold;">
                        <span class="zoom-label" style="color: var(--accent-cyan);">🔍 LUPA VIRTUAL</span>
                        <span class="zoom-nivel" id="zoom-nivel" style="color: var(--alert-orange);">1x</span>
                    </div>
                    <input type="range" id="zoom-slider" class="slider zoom-slider" min="1" max="4" step="0.1" value="1">
                    <div class="zoom-dica" style="font-size: 0.85rem; color: var(--metallic-medium); margin-top: 0.5rem;">
                        <span>Arraste para aumentar a precisão</span>
                    </div>
                </div>
                
                <div class="canvas-wrapper" id="canvas-wrapper" style="position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
                    <canvas id="canvas-nivel4" width="800" height="500"></canvas>
                    
                    <div class="mira-overlay" id="mira-overlay" style="display: none; position: absolute; pointer-events: none;">
                        <div class="mira-cruz" style="width: 40px; height: 40px; border: 2px solid var(--alert-red); border-radius: 50%; position: relative;">
                            <div style="position: absolute; top: 50%; left: -10px; width: 60px; height: 2px; background: var(--alert-red);"></div>
                            <div style="position: absolute; left: 50%; top: -10px; height: 60px; width: 2px; background: var(--alert-red);"></div>
                        </div>
                    </div>
                </div>
                
                <div class="info-panel glass-panel" style="display: flex; justify-content: space-around; padding: 1.5rem; margin: 1.5rem 0; flex-wrap: wrap; gap: 1rem; text-align: center;">
                    <div class="info-item">
                        <span class="info-label" style="display: block; font-size: 0.9rem; color: var(--metallic-medium); text-transform: uppercase;">Função:</span>
                        <span class="info-valor" style="font-size: 1.3rem; font-weight: bold; color: var(--accent-cyan);">O(t) = -2,5t + 30</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label" style="display: block; font-size: 0.9rem; color: var(--metallic-medium); text-transform: uppercase;">Raiz esperada:</span>
                        <span class="info-valor" id="raiz-esperada" style="font-size: 1.3rem; font-weight: bold; color: var(--success-green);">t = 12,0 min</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label" style="display: block; font-size: 0.9rem; color: var(--metallic-medium); text-transform: uppercase;">Seu clique:</span>
                        <span class="info-valor" id="clique-info" style="font-size: 1.3rem; font-weight: bold; color: var(--alert-orange);">---</span>
                    </div>
                </div>
                
                <div class="proximidade-container glass-panel" style="padding: 1.5rem; text-align: center; margin-bottom: 1.5rem;">
                    <div class="proximidade-header" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: bold;">
                        <span>📊 PRECISÃO DO CLIQUE</span>
                        <span id="proximidade-percentual-n4" style="color: var(--accent-cyan);">0%</span>
                    </div>
                    <div class="proximidade-bar" style="height: 12px; background: rgba(0,0,0,0.5); border-radius: 6px; overflow: hidden; box-shadow: inset 0 0 5px rgba(0,0,0,0.8); margin-bottom: 0.5rem;">
                        <div id="proximidade-preenchimento-n4" class="proximidade-preenchimento" style="width: 0%; height: 100%; background: var(--alert-red); transition: width 0.3s ease, background-color 0.3s ease;"></div>
                    </div>
                    <div class="proximidade-escala" style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--metallic-medium);">
                        <span>❌ Muito longe</span>
                        <span>⚠️ Próximo</span>
                        <span>✅ Preciso</span>
                    </div>
                </div>
                
                <div class="botoes-clique" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button id="btn-verificar-n4" class="btn-missao" style="margin: 0;" disabled>🎯 VERIFICAR CLIQUE</button>
                    <button id="btn-limpar-n4" class="btn-secundario" style="margin: 0;">🔄 NOVA TENTATIVA</button>
                    <button id="btn-zoom-auto" class="btn-secundario" style="margin: 0;">🔍 ZOOM NO ALVO</button>
                </div>
                
                <button id="btn-avancar-n4" class="btn-avancar hidden" style="margin-top: 1.5rem;">AVANÇAR PARA NÍVEL 5 →</button>
            </div>
            
            <div id="feedback-nivel4" class="feedback-container hidden">
                <div class="feedback-conteudo">
                    <span class="feedback-icone" id="feedback-icone-n4"></span>
                    <p id="feedback-mensagem-n4"></p>
                </div>
            </div>
            
            <div class="historico-tentativas glass-panel" id="historico-tentativas-n4" style="padding: 1.5rem; margin-top: 2rem;">
                <h4 style="margin-bottom: 1rem; color: var(--accent-magenta);">📋 Últimas tentativas:</h4>
                <div id="lista-tentativas-n4" style="display: flex; flex-direction: column; gap: 0.5rem;"></div>
            </div>
        </div>
    `;
    
    nivelContainer.innerHTML = nivelHTML;
    configurarNivel4(a, b, raizExata);
}

function configurarNivel4(a, b, raizExata) {
    const canvas = document.getElementById('canvas-nivel4');
    const ctx = canvas.getContext('2d');
    const wrapper = document.getElementById('canvas-wrapper');
    const miraOverlay = document.getElementById('mira-overlay');
    
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomNivel = document.getElementById('zoom-nivel');
    const btnZoomAuto = document.getElementById('btn-zoom-auto');
    
    const btnVerificar = document.getElementById('btn-verificar-n4');
    const btnLimpar = document.getElementById('btn-limpar-n4');
    const btnAvancar = document.getElementById('btn-avancar-n4');
    
    const cliqueInfo = document.getElementById('clique-info');
    const proximidadePercentual = document.getElementById('proximidade-percentual-n4');
    const proximidadePreenchimento = document.getElementById('proximidade-preenchimento-n4');
    
    const feedbackContainer = document.getElementById('feedback-nivel4');
    const feedbackIcone = document.getElementById('feedback-icone-n4');
    const feedbackMensagem = document.getElementById('feedback-mensagem-n4');
    
    const historicoLista = document.getElementById('lista-tentativas-n4');
    
    let ultimoClique = null;
    let nivelConcluido = false;
    let tentativas = [];
    let zoom = 1;
    let centroZoom = { x: 12, y: 0 };
    
    const padding = 60;
    const baseWidth = canvas.width - 2 * padding;
    const baseHeight = canvas.height - 2 * padding;
    
    const xMinBase = 0;
    const xMaxBase = 20;
    const yMinBase = -5;
    const yMaxBase = 35;
    
    function getIntervalos() {
        const larguraIntervalo = (xMaxBase - xMinBase) / zoom;
        const alturaIntervalo = (yMaxBase - yMinBase) / zoom;
        
        const xMin = centroZoom.x - larguraIntervalo / 2;
        const xMax = centroZoom.x + larguraIntervalo / 2;
        const yMin = centroZoom.y - alturaIntervalo / 2;
        const yMax = centroZoom.y + alturaIntervalo / 2;
        
        return { xMin, xMax, yMin, yMax };
    }
    
    function worldToCanvasX(x) {
        const { xMin, xMax } = getIntervalos();
        return padding + ((x - xMin) / (xMax - xMin)) * baseWidth;
    }
    
    function worldToCanvasY(y) {
        const { yMin, yMax } = getIntervalos();
        return canvas.height - (padding + ((y - yMin) / (yMax - yMin)) * baseHeight);
    }
    
    function canvasToWorldX(canvasX) {
        const { xMin, xMax } = getIntervalos();
        return xMin + ((canvasX - padding) / baseWidth) * (xMax - xMin);
    }
    
    function canvasToWorldY(canvasY) {
        const { yMin, yMax } = getIntervalos();
        return yMin + ((canvas.height - canvasY - padding) / baseHeight) * (yMax - yMin);
    }
    
    const TOLERANCIA_PERFEITA = 0.2;
    const TOLERANCIA_PROXIMA = 1.0;
    
    function desenharGrafico() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0B0E1F';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const { xMin, xMax, yMin, yMax } = getIntervalos();
        
        const passoGrade = zoom > 2 ? 0.5 : 1;
        
        ctx.strokeStyle = 'rgba(107, 114, 128, 0.15)';
        ctx.lineWidth = 0.5;
        
        for (let x = Math.ceil(xMin / passoGrade) * passoGrade; x <= xMax; x += passoGrade) {
            if (Math.abs(x % 1) < 0.01 && passoGrade === 0.5) continue;
            const canvasX = worldToCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(canvasX, padding);
            ctx.lineTo(canvasX, canvas.height - padding);
            ctx.stroke();
        }
        
        for (let y = Math.ceil(yMin / passoGrade) * passoGrade; y <= yMax; y += passoGrade) {
            if (Math.abs(y % 1) < 0.01 && passoGrade === 0.5) continue;
            const canvasY = worldToCanvasY(y);
            ctx.beginPath();
            ctx.moveTo(padding, canvasY);
            ctx.lineTo(canvas.width - padding, canvasY);
            ctx.stroke();
        }
        
        ctx.strokeStyle = 'rgba(156, 163, 175, 0.4)';
        ctx.lineWidth = 1;
        
        for (let x = Math.ceil(xMin); x <= xMax; x++) {
            if (x === 0) continue;
            const canvasX = worldToCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(canvasX, padding);
            ctx.lineTo(canvasX, canvas.height - padding);
            ctx.stroke();
        }
        
        for (let y = Math.ceil(yMin); y <= yMax; y++) {
            if (y === 0) continue;
            const canvasY = worldToCanvasY(y);
            ctx.beginPath();
            ctx.moveTo(padding, canvasY);
            ctx.lineTo(canvas.width - padding, canvasY);
            ctx.stroke();
        }
        
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 2;
        
        if (yMin <= 0 && yMax >= 0) {
            ctx.beginPath();
            ctx.moveTo(padding, worldToCanvasY(0));
            ctx.lineTo(canvas.width - padding, worldToCanvasY(0));
            ctx.stroke();
        }
        
        if (xMin <= 0 && xMax >= 0) {
            ctx.beginPath();
            ctx.moveTo(worldToCanvasX(0), padding);
            ctx.lineTo(worldToCanvasX(0), canvas.height - padding);
            ctx.stroke();
        }
        
        ctx.fillStyle = '#E5E7EB';
        ctx.font = 'bold 12px "Segoe UI", "Roboto", monospace';
        ctx.textAlign = 'center';
        
        for (let x = Math.ceil(xMin); x <= xMax; x++) {
            if (x < xMin || x > xMax) continue;
            const canvasX = worldToCanvasX(x);
            const canvasY = worldToCanvasY(0);
            
            if (canvasY >= padding && canvasY <= canvas.height - padding) {
                ctx.fillStyle = '#0B0E1F';
                ctx.fillRect(canvasX - 12, canvasY + 5, 24, 18);
                ctx.fillStyle = x === 0 ? '#F97316' : '#E5E7EB';
                ctx.fillText(x.toFixed(passoGrade === 0.5 ? 1 : 0), canvasX, canvasY + 18);
            }
        }
        
        ctx.textAlign = 'right';
        for (let y = Math.ceil(yMin); y <= yMax; y++) {
            if (y < yMin || y > yMax) continue;
            const canvasX = worldToCanvasX(0);
            const canvasY = worldToCanvasY(y);
            
            if (canvasX >= padding && canvasX <= canvas.width - padding) {
                ctx.fillStyle = '#0B0E1F';
                ctx.fillRect(canvasX - 30, canvasY - 8, 28, 18);
                ctx.fillStyle = y === 0 ? '#F97316' : '#E5E7EB';
                ctx.fillText(y.toFixed(passoGrade === 0.5 ? 1 : 0), canvasX - 8, canvasY);
            }
        }
        
        ctx.beginPath();
        ctx.moveTo(worldToCanvasX(xMin), worldToCanvasY(a * xMin + b));
        ctx.lineTo(worldToCanvasX(xMax), worldToCanvasY(a * xMax + b));
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        const raizX = raizExata;
        const raizY = 0;
        
        if (raizX >= xMin && raizX <= xMax && raizY >= yMin && raizY <= yMax) {
            const canvasRaizX = worldToCanvasX(raizX);
            const canvasRaizY = worldToCanvasY(raizY);
            
            ctx.beginPath();
            ctx.arc(canvasRaizX, canvasRaizY, 12, 0, 2 * Math.PI);
            ctx.strokeStyle = '#10B981';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.beginPath();
            ctx.arc(canvasRaizX, canvasRaizY, 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#10B981';
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px "Segoe UI", "Roboto", sans-serif';
            ctx.textAlign = 'left';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 4;
            ctx.fillText('RAIZ', canvasRaizX + 20, canvasRaizY - 15);
            ctx.shadowBlur = 0;
        }
        
        if (ultimoClique) {
            const canvasCliqueX = worldToCanvasX(ultimoClique.x);
            const canvasCliqueY = worldToCanvasY(ultimoClique.y);
            
            if (canvasCliqueX >= padding && canvasCliqueX <= canvas.width - padding &&
                canvasCliqueY >= padding && canvasCliqueY <= canvas.height - padding) {
                
                ctx.strokeStyle = '#EF4444';
                ctx.lineWidth = 3;
                
                ctx.beginPath();
                ctx.moveTo(canvasCliqueX - 10, canvasCliqueY - 10);
                ctx.lineTo(canvasCliqueX + 10, canvasCliqueY + 10);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(canvasCliqueX + 10, canvasCliqueY - 10);
                ctx.lineTo(canvasCliqueX - 10, canvasCliqueY + 10);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(canvasCliqueX, canvasCliqueY, 15, 0, 2 * Math.PI);
                ctx.strokeStyle = '#EF4444';
                ctx.setLineDash([5, 5]);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    }
    
    function handleCanvasClick(event) {
        if (nivelConcluido) return;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const canvasX = (event.clientX - rect.left) * scaleX;
        const canvasY = (event.clientY - rect.top) * scaleY;
        
        if (canvasX < padding || canvasX > canvas.width - padding || 
            canvasY < padding || canvasY > canvas.height - padding) {
            return;
        }
        
        const worldX = canvasToWorldX(canvasX);
        const worldY = canvasToWorldY(canvasY);
        
        ultimoClique = { x: worldX, y: worldY };
        
        const distancia = Math.abs(worldX - raizExata);
        const precisao = Math.max(0, 100 - (distancia * 20));
        
        cliqueInfo.innerHTML = `t = ${worldX.toFixed(2)} min, O = ${worldY.toFixed(2)} L`;
        proximidadePercentual.textContent = `${Math.round(precisao)}%`;
        proximidadePreenchimento.style.width = `${precisao}%`;
        
        if (precisao > 95) {
            proximidadePreenchimento.style.background = 'var(--success-green)';
        } else if (precisao > 70) {
            proximidadePreenchimento.style.background = 'var(--alert-yellow)';
        } else {
            proximidadePreenchimento.style.background = 'var(--alert-red)';
        }
        
        btnVerificar.disabled = false;
        
        mostrarMira(canvasX, canvasY);
        
        desenharGrafico();
    }
    
    function mostrarMira(x, y) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width / canvas.width;
        const scaleY = rect.height / canvas.height;
        
        miraOverlay.style.display = 'block';
        miraOverlay.style.left = (rect.left + x * scaleX - 20) + 'px';
        miraOverlay.style.top = (rect.top + y * scaleY - 20) + 'px';
        
        setTimeout(() => {
            miraOverlay.style.display = 'none';
        }, 300);
    }
    
    function verificarClique() {
    if (!ultimoClique || nivelConcluido) return;
    
    // 🔴 INCREMENTA TENTATIVA PARA CADA CLIQUE NO BOTÃO VERIFICAR
    GameState.progresso.nivel4.tentativas++;
    console.log(`Nível 4 - Tentativa ${GameState.progresso.nivel4.tentativas}: t=${ultimoClique.x.toFixed(2)}`);
    
    const distancia = Math.abs(ultimoClique.x - raizExata);
    const erro = distancia.toFixed(2);
    
    tentativas.unshift({
        tempo: ultimoClique.x,
        distancia: distancia,
        timestamp: new Date().toLocaleTimeString()
    });
    
    if (tentativas.length > 5) tentativas.pop();
    atualizarHistorico();
    
    if (distancia <= TOLERANCIA_PERFEITA) {
        // SUCESSO
        nivelConcluido = true;
        GameState.progresso.nivel4.concluido = true;
        GameState.niveisCompletos[3] = true;
        GameState.statusBase.oxigenio = true;
        atualizarLEDs();
        
        feedbackIcone.innerHTML = '🏆';
        feedbackContainer.style.borderLeftColor = 'var(--success-green)';
        feedbackContainer.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        feedbackMensagem.innerHTML = `✅ RAIZ ENCONTRADA EM t = ${raizExata} minutos! 
            <br><br>Sistema de reserva acionado. Ótimo reflexo, Cadete! 
            <br><span style="color: var(--metallic-medium);">Você salvou a tripulação da asfixia com precisão de ${(100 - distancia*20).toFixed(1)}%.</span>`;
        
        feedbackContainer.classList.remove('hidden');
        btnAvancar.classList.remove('hidden');
        btnVerificar.disabled = true;
        
        desenharGrafico();
        
    // ===== DENTRO DO NÍVEL 4 - BLOCO DE ERRO (após o SUCESSO) =====
} else if (distancia <= TOLERANCIA_PROXIMA) {
    // Registrar erro de aproximação
    registrarErro('nivel4', {
        tipo: 'aproximado',
        cliqueX: ultimoClique.x,
        raizEsperada: raizExata,
        distancia: distancia,
        precisao: (100 - distancia*20).toFixed(1)
    });
    
    // QUASE LÁ (já incrementou a tentativa no início da função)
    feedbackIcone.innerHTML = '⚠️';
    feedbackContainer.style.borderLeftColor = 'var(--alert-yellow)';
    feedbackContainer.style.backgroundColor = 'rgba(251, 191, 36, 0.1)';
    feedbackMensagem.innerHTML = `⚠️ ALVO IMPRECISO! Erro de ${erro} minutos. 
        <br>O sistema reserva foi acionado cedo demais e desperdiçou recursos. 
        <br>A raiz é o ponto exato onde a função se anula. Tente novamente com mais precisão.`;
    
    feedbackContainer.classList.remove('hidden');
    setTimeout(() => {
        if (!nivelConcluido) feedbackContainer.classList.add('hidden');
    }, 4000);
    
} else {
    // Registrar erro distante
    registrarErro('nivel4', {
        tipo: 'distante',
        cliqueX: ultimoClique.x,
        raizEsperada: raizExata,
        distancia: distancia
    });
    
    // MUITO LONGE (já incrementou a tentativa)
    feedbackIcone.innerHTML = '❌';
    feedbackContainer.style.borderLeftColor = 'var(--alert-red)';
    feedbackContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    feedbackMensagem.innerHTML = `❌ MUITO LONGE! Erro de ${erro} minutos. 
        <br>A raiz é onde a reta cruza o eixo do tempo (O=0). 
        <br>Use o zoom para melhor precisão!`;
    
    feedbackContainer.classList.remove('hidden');
    setTimeout(() => {
        if (!nivelConcluido) feedbackContainer.classList.add('hidden');
    }, 4000);
}
    
    if (distancia > 2 && zoom < 2) {
        setTimeout(() => {
            if (!nivelConcluido) {
                feedbackIcone.innerHTML = '🔍';
                feedbackContainer.style.borderLeftColor = 'var(--alert-orange)';
                feedbackContainer.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';
                feedbackMensagem.innerHTML = '💡 DICA: Aumente o zoom para clicar com mais precisão!';
                feedbackContainer.classList.remove('hidden');
                
                setTimeout(() => {
                    if (!nivelConcluido) feedbackContainer.classList.add('hidden');
                }, 3000);
            }
        }, 500);
    }
}
    
    function atualizarHistorico() {
        if (tentativas.length === 0) {
            historicoLista.innerHTML = '<span class="historico-vazio" style="color: var(--metallic-medium); font-style: italic;">Nenhuma tentativa ainda</span>';
            return;
        }
        
        historicoLista.innerHTML = tentativas.map(t => `
            <div class="historico-item" style="display: flex; justify-content: space-between; background: rgba(0,0,0,0.3); padding: 0.5rem 1rem; border-radius: 4px; border-left: 3px solid var(--alert-yellow);">
                <span class="historico-tempo" style="color: var(--metallic-medium);">${t.timestamp}</span>
                <span class="historico-valor" style="font-weight: bold; color: var(--metallic-light);">t = ${t.tempo.toFixed(2)}</span>
                <span class="historico-erro" style="color: var(--alert-red);">erro: ${t.distancia.toFixed(2)}</span>
            </div>
        `).join('');
    }
    
    canvas.addEventListener('click', handleCanvasClick);
    
    btnVerificar.addEventListener('click', verificarClique);
    
    btnLimpar.addEventListener('click', () => {
        ultimoClique = null;
        nivelConcluido = false;
        btnVerificar.disabled = true;
        cliqueInfo.innerHTML = '---';
        proximidadePercentual.textContent = '0%';
        proximidadePreenchimento.style.width = '0%';
        feedbackContainer.classList.add('hidden');
        desenharGrafico();
    });
    
    btnZoomAuto.addEventListener('click', () => {
        zoom = 4;
        centroZoom = { x: raizExata, y: 0 };
        zoomSlider.value = zoom;
        zoomNivel.textContent = zoom.toFixed(1) + 'x';
        desenharGrafico();
    });
    
    zoomSlider.addEventListener('input', (e) => {
        zoom = parseFloat(e.target.value);
        zoomNivel.textContent = zoom.toFixed(1) + 'x';
        desenharGrafico();
    });
    
    btnAvancar.addEventListener('click', () => {
        carregarNivel(5);
    });
    
    desenharGrafico();
    atualizarHistorico();
}

// ===== NÍVEL 5 (mantido exatamente como estava, com chamada para finalização) =====
function carregarNivel5() {
    GameState.progresso.nivel5.tentativas++;
    
    const naveA = { a: 2, b: 1, nome: "Nave A", cor: "#3B82F6" };
    const naveB = { a: -1, b: 4, nome: "Nave B", cor: "#EF4444" };
    const pontoIntersecao = { x: 1, y: 3 };
    
    const nivelHTML = `
        <div class="nivel-card" id="nivel5">
            <div class="nivel-header">
                <div class="nivel-titulo">
                    <span class="nivel-numero">NÍVEL 5</span>
                    <h2>🚀 Rotas de Colisão</h2>
                </div>
                <div class="nivel-status" id="status-nivel5">
                    <span class="status-indicator">⚠️ COLISÃO IMINENTE</span>
                </div>
            </div>
            
            <div class="missao-briefing">
                <p class="comandante-fala">
                    "ÚLTIMO DESAFIO! Duas naves de carga estão retornando à base em rotas de colisão. 
                    Suas trajetórias são linhas retas no espaço, descritas pelas funções:
                    <br><br>
                    <span style="color: #3B82F6; font-weight: 700; font-size: 1.2rem;">Nave A: y = 2x + 1</span><br>
                    <span style="color: #EF4444; font-weight: 700; font-size: 1.2rem;">Nave B: y = -x + 4</span>
                    <br><br>
                    Para evitar o desastre, você deve encontrar as coordenadas <strong>(x, y)</strong> 
                    do ponto de encontro e desviar as naves. Resolva o sistema linear!"
                </p>
            </div>
            
            <div class="grafico-duas-retas">
                <div style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 12px;">
                    <canvas id="canvas-nivel5" width="800" height="500"></canvas>
                </div>
                
                <div class="legenda-naves glass-panel" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 2rem; padding: 1.5rem; margin-top: 1.5rem; border-radius: 8px;">
                    <div class="legenda-item" style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="legenda-cor" style="background: #3B82F6; width: 15px; height: 15px; display: inline-block; border-radius: 50%; box-shadow: 0 0 10px #3B82F6;"></span>
                        <span class="legenda-texto" style="font-weight: bold; color: var(--metallic-light);">Nave A: y = 2x + 1</span>
                    </div>
                    <div class="legenda-item" style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="legenda-cor" style="background: #EF4444; width: 15px; height: 15px; display: inline-block; border-radius: 50%; box-shadow: 0 0 10px #EF4444;"></span>
                        <span class="legenda-texto" style="font-weight: bold; color: var(--metallic-light);">Nave B: y = -x + 4</span>
                    </div>
                    <div class="legenda-item" style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="legenda-cor" style="background: #FBBF24; width: 15px; height: 15px; display: inline-block; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #FBBF24;"></span>
                        <span class="legenda-texto" style="font-weight: bold; color: var(--metallic-light);">Ponto de colisão</span>
                    </div>
                </div>
            </div>
            
            <div class="metodos-resolucao" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin: 2rem 0;">
                <div class="metodo-card glass-panel" id="metodo-igualdade" style="padding: 1.5rem; transition: transform 0.3s ease;">
                    <h4 style="color: var(--accent-cyan); margin-bottom: 1rem; border-bottom: 1px solid rgba(6,182,212,0.3); padding-bottom: 0.5rem;">📐 Método da Igualdade</h4>
                    <p style="color: var(--metallic-medium); margin-bottom: 1rem; font-size: 0.95rem;">Como ambas as equações estão isoladas para y, podemos igualá-las:</p>
                    <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 6px; font-family: var(--font-mono); color: var(--metallic-light);">
                        <p class="metodo-equacao" style="margin-bottom: 0.3rem;">2x + 1 = -x + 4</p>
                        <p class="metodo-equacao" style="margin-bottom: 0.3rem;">2x + x = 4 - 1</p>
                        <p class="metodo-equacao" style="margin-bottom: 0.3rem;">3x = 3</p>
                        <p class="metodo-equacao" style="color: var(--success-green); font-weight: bold;">x = 1</p>
                    </div>
                </div>
                
                <div class="metodo-card glass-panel" id="metodo-substituicao" style="padding: 1.5rem; transition: transform 0.3s ease;">
                    <h4 style="color: var(--accent-magenta); margin-bottom: 1rem; border-bottom: 1px solid rgba(217,70,239,0.3); padding-bottom: 0.5rem;">🔄 Método da Substituição</h4>
                    <p style="color: var(--metallic-medium); margin-bottom: 1rem; font-size: 0.95rem;">Substitua o valor de x encontrado em uma das equações:</p>
                    <div style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 6px; font-family: var(--font-mono); color: var(--metallic-light);">
                        <p class="metodo-equacao" style="margin-bottom: 0.5rem; color: #3B82F6;">y = 2(1) + 1 = 3</p>
                        <p class="metodo-equacao" style="margin-bottom: 0.5rem; color: var(--metallic-medium); font-size: 0.8rem; text-align: center;">ou</p>
                        <p class="metodo-equacao" style="color: #EF4444;">y = -(1) + 4 = <span style="color: var(--success-green); font-weight: bold;">3</span></p>
                    </div>
                </div>
            </div>
            
            <div class="solucao-container glass-panel" style="padding: 1.5rem;">
                <h3 class="solucao-titulo" style="text-align: center; margin-bottom: 1.5rem;">🎯 CALCULAR ROTA DE FUGA</h3>
                
                <div class="coordenadas-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
                    <div class="coordenada-card" id="card-x" style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; text-align: center;">
                        <div class="coordenada-header" style="margin-bottom: 1rem;">
                            <span class="coordenada-simbolo" style="font-size: 1.5rem; font-weight: bold; color: var(--success-green); display: block;">x</span>
                            <span class="coordenada-nome" style="color: var(--metallic-medium); font-size: 0.9rem; text-transform: uppercase;">Coordenada X</span>
                        </div>
                        <div class="coordenada-input-group" style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
                        <input type="text" id="coord-x-n5" class="coef-input" inputmode="text" pattern="-?[0-9]*[.,]?[0-9]*" placeholder="0">                         
                        <span class="coordenada-unidade" style="font-size: 0.8rem; color: var(--metallic-dark);">posição horizontal</span>
                        </div>
                    </div>
                    
                    <div class="coordenada-card" id="card-y" style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; text-align: center;">
                        <div class="coordenada-header" style="margin-bottom: 1rem;">
                            <span class="coordenada-simbolo" style="font-size: 1.5rem; font-weight: bold; color: var(--success-green); display: block;">y</span>
                            <span class="coordenada-nome" style="color: var(--metallic-medium); font-size: 0.9rem; text-transform: uppercase;">Coordenada Y</span>
                        </div>
                        <div class="coordenada-input-group" style="display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
                        <input type="text" id="coord-y-n5" class="coef-input" inputmode="text" pattern="-?[0-9]*[.,]?[0-9]*" placeholder="0">                         
                        <span class="coordenada-unidade" style="font-size: 0.8rem; color: var(--metallic-dark);">posição vertical</span>
                        </div>
                    </div>
                </div>
                
                <div class="verificacao-equacoes" style="display: flex; justify-content: space-around; background: rgba(0,0,0,0.4); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                    <div class="verificacao-item" id="verif-a" style="text-align: center;">
                        <span class="verif-label" style="display: block; color: #3B82F6; font-family: var(--font-mono); margin-bottom: 0.5rem;">Nave A: y = 2x + 1</span>
                        <span class="verif-valor" id="valor-a" style="font-size: 1.3rem; font-weight: bold; color: var(--metallic-light);">---</span>
                        <span class="verif-status" id="status-a" style="font-size: 1.2rem; margin-left: 0.5rem;"></span>
                    </div>
                    <div class="verificacao-item" id="verif-b" style="text-align: center;">
                        <span class="verif-label" style="display: block; color: #EF4444; font-family: var(--font-mono); margin-bottom: 0.5rem;">Nave B: y = -x + 4</span>
                        <span class="verif-valor" id="valor-b" style="font-size: 1.3rem; font-weight: bold; color: var(--metallic-light);">---</span>
                        <span class="verif-status" id="status-b" style="font-size: 1.2rem; margin-left: 0.5rem;"></span>
                    </div>
                </div>
                
                <div class="botoes-solucao" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button id="btn-calcular-n5" class="btn-missao" style="margin: 0; max-width: 250px;">🧮 CALCULAR ROTA</button>
                    <button id="btn-limpar-n5" class="btn-secundario" style="margin: 0;">LIMPAR</button>
                    <button id="btn-dica-n5" class="btn-secundario" style="margin: 0;">💡 DICA</button>
                </div>
                
                <button id="btn-avancar-n5" class="btn-avancar hidden" style="margin-top: 1.5rem; background: linear-gradient(45deg, var(--success-green), #0ea5e9);">🚀 FINALIZAR MISSÃO →</button>
            </div>
            
            <div id="feedback-nivel5" class="feedback-container hidden">
                <div class="feedback-conteudo">
                    <span class="feedback-icone" id="feedback-icone-n5"></span>
                    <p id="feedback-mensagem-n5"></p>
                </div>
            </div>
            
            <div class="simulador-rotas glass-panel" id="simulador-rotas" style="padding: 1.5rem; margin-top: 2rem;">
                <h4 style="color: var(--accent-cyan); margin-bottom: 0.5rem;">📡 Simulador de Rotas</h4>
                <p style="color: var(--metallic-medium); font-size: 0.9rem; margin-bottom: 1.5rem;">Arraste o slider para testar diferentes posições em X:</p>
                <div class="sliders-simulador" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; align-items: center; background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                    <div class="slider-simulador-item" style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <label style="color: var(--metallic-light); font-weight: bold;">Posição X: <span id="sim-x" style="color: var(--success-green);">1.0</span></label>
                        <input type="range" id="sim-slider-x" class="slider" min="-2" max="4" step="0.1" value="1">
                    </div>
                    <div class="slider-simulador-item" style="text-align: center;">
                        <label style="color: var(--metallic-medium); display: block; font-size: 0.9rem;">Nave A (em Y): <br><span id="sim-y-a" style="font-size: 1.5rem; font-weight: bold; color: #3B82F6;">3.0</span></label>
                    </div>
                    <div class="slider-simulador-item" style="text-align: center;">
                        <label style="color: var(--metallic-medium); display: block; font-size: 0.9rem;">Nave B (em Y): <br><span id="sim-y-b" style="font-size: 1.5rem; font-weight: bold; color: #EF4444;">3.0</span></label>
                    </div>
                </div>
                <div class="simulador-status" id="simulador-status" style="text-align: center; font-weight: bold; font-size: 1.2rem;">
                    ⚠️ As naves estão na mesma posição! Ponto de colisão!
                </div>
            </div>
        </div>
    `;
    
    nivelContainer.innerHTML = nivelHTML;
    configurarNivel5(naveA, naveB, pontoIntersecao);
}

/**
 * NÍVEL 5 CORRIGIDO - Registro de tentativas em cada erro
 */
function configurarNivel5(naveA, naveB, pontoIntersecao) {
    const canvas = document.getElementById('canvas-nivel5');
    const ctx = canvas.getContext('2d');
    
    const inputX = document.getElementById('coord-x-n5');
    const inputY = document.getElementById('coord-y-n5');
    
    const valorA = document.getElementById('valor-a');
    const valorB = document.getElementById('valor-b');
    const statusA = document.getElementById('status-a');
    const statusB = document.getElementById('status-b');
    const cardX = document.getElementById('card-x');
    const cardY = document.getElementById('card-y');
    const verifA = document.getElementById('verif-a');
    const verifB = document.getElementById('verif-b');
    
    const btnCalcular = document.getElementById('btn-calcular-n5');
    const btnLimpar = document.getElementById('btn-limpar-n5');
    const btnDica = document.getElementById('btn-dica-n5');
    const btnAvancar = document.getElementById('btn-avancar-n5');
    
    const feedbackContainer = document.getElementById('feedback-nivel5');
    const feedbackIcone = document.getElementById('feedback-icone-n5');
    const feedbackMensagem = document.getElementById('feedback-mensagem-n5');
    
    const simSlider = document.getElementById('sim-slider-x');
    const simX = document.getElementById('sim-x');
    const simYA = document.getElementById('sim-y-a');
    const simYB = document.getElementById('sim-y-b');
    const simuladorStatus = document.getElementById('simulador-status');
    
    let nivelConcluido = false;
    const TOLERANCIA = 0.1;
    
    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    
    const xMin = -3;
    const xMax = 5;
    const yMin = -3;
    const yMax = 9;
    
    function worldToCanvasX(x) {
        return padding + ((x - xMin) / (xMax - xMin)) * width;
    }
    
    function worldToCanvasY(y) {
        return canvas.height - (padding + ((y - yMin) / (yMax - yMin)) * height);
    }
    
    function desenharGrafico() {
        // Manter o código de desenho exatamente como estava
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0B0E1F';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(107, 114, 128, 0.15)';
        ctx.lineWidth = 0.5;
        
        for (let x = xMin; x <= xMax; x += 0.5) {
            if (Math.abs(x % 1) < 0.01) continue;
            const canvasX = worldToCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(canvasX, padding);
            ctx.lineTo(canvasX, canvas.height - padding);
            ctx.stroke();
        }
        
        for (let y = yMin; y <= yMax; y += 0.5) {
            if (Math.abs(y % 1) < 0.01) continue;
            const canvasY = worldToCanvasY(y);
            ctx.beginPath();
            ctx.moveTo(padding, canvasY);
            ctx.lineTo(canvas.width - padding, canvasY);
            ctx.stroke();
        }
        
        ctx.strokeStyle = 'rgba(156, 163, 175, 0.4)';
        ctx.lineWidth = 1;
        
        for (let x = xMin; x <= xMax; x++) {
            if (x === 0) continue;
            const canvasX = worldToCanvasX(x);
            ctx.beginPath();
            ctx.moveTo(canvasX, padding);
            ctx.lineTo(canvasX, canvas.height - padding);
            ctx.stroke();
        }
        
        for (let y = yMin; y <= yMax; y++) {
            if (y === 0) continue;
            const canvasY = worldToCanvasY(y);
            ctx.beginPath();
            ctx.moveTo(padding, canvasY);
            ctx.lineTo(canvas.width - padding, canvasY);
            ctx.stroke();
        }
        
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(padding, worldToCanvasY(0));
        ctx.lineTo(canvas.width - padding, worldToCanvasY(0));
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(worldToCanvasX(0), padding);
        ctx.lineTo(worldToCanvasX(0), canvas.height - padding);
        ctx.stroke();
        
        ctx.fillStyle = '#E5E7EB';
        ctx.font = 'bold 12px "Segoe UI", "Roboto", monospace';
        ctx.textAlign = 'center';
        
        for (let x = xMin; x <= xMax; x++) {
            const canvasX = worldToCanvasX(x);
            const canvasY = worldToCanvasY(0);
            
            ctx.fillStyle = '#0B0E1F';
            ctx.fillRect(canvasX - 12, canvasY + 5, 24, 18);
            ctx.fillStyle = x === 0 ? '#F97316' : '#E5E7EB';
            ctx.fillText(x, canvasX, canvasY + 18);
        }
        
        ctx.textAlign = 'right';
        for (let y = yMin; y <= yMax; y++) {
            const canvasX = worldToCanvasX(0);
            const canvasY = worldToCanvasY(y);
            
            ctx.fillStyle = '#0B0E1F';
            ctx.fillRect(canvasX - 30, canvasY - 8, 28, 18);
            ctx.fillStyle = y === 0 ? '#F97316' : '#E5E7EB';
            ctx.fillText(y, canvasX - 8, canvasY);
        }
        
        ctx.beginPath();
        ctx.moveTo(worldToCanvasX(xMin), worldToCanvasY(naveA.a * xMin + naveA.b));
        ctx.lineTo(worldToCanvasX(xMax), worldToCanvasY(naveA.a * xMax + naveA.b));
        ctx.strokeStyle = naveA.cor;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.shadowColor = naveA.cor;
        ctx.shadowBlur = 10;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(worldToCanvasX(xMin), worldToCanvasY(naveB.a * xMin + naveB.b));
        ctx.lineTo(worldToCanvasX(xMax), worldToCanvasY(naveB.a * xMax + naveB.b));
        ctx.strokeStyle = naveB.cor;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.shadowColor = naveB.cor;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        const canvasIntersecX = worldToCanvasX(pontoIntersecao.x);
        const canvasIntersecY = worldToCanvasY(pontoIntersecao.y);
        
        ctx.beginPath();
        ctx.arc(canvasIntersecX, canvasIntersecY, 15, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.beginPath();
        ctx.arc(canvasIntersecX, canvasIntersecY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#FBBF24';
        ctx.fill();
        
        ctx.shadowColor = '#FBBF24';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
        
        const simXVal = parseFloat(simSlider.value);
        const simYAVal = naveA.a * simXVal + naveA.b;
        const simYBVal = naveB.a * simXVal + naveB.b;
        
        if (!isNaN(simXVal)) {
            const canvasSimX = worldToCanvasX(simXVal);
            const canvasSimYA = worldToCanvasY(simYAVal);
            const canvasSimYB = worldToCanvasY(simYBVal);
            
            ctx.beginPath();
            ctx.arc(canvasSimX, canvasSimYA, 6, 0, 2 * Math.PI);
            ctx.fillStyle = naveA.cor;
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(canvasSimX, canvasSimYB, 6, 0, 2 * Math.PI);
            ctx.fillStyle = naveB.cor;
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    function validarSolucao() {
    // Se já concluiu, não faz nada
    if (nivelConcluido) return;
    
    const x = parseFloat(inputX.value);
    const y = parseFloat(inputY.value);
    
    cardX.classList.remove('sucesso', 'erro');
    cardY.classList.remove('sucesso', 'erro');
    verifA.classList.remove('sucesso', 'erro');
    verifB.classList.remove('sucesso', 'erro');
    statusA.innerHTML = '';
    statusB.innerHTML = '';
    
    // Validar preenchimento (também conta como tentativa)
    if (isNaN(x) || isNaN(y)) {
        GameState.progresso.nivel5.tentativas++;
        registrarErro('nivel5', {
            tipo: 'campos_vazios',
            mensagem: 'Tentativa sem preencher ambos os campos'
        });
        
        feedbackContainer.classList.remove('hidden');
        feedbackIcone.innerHTML = '⚠️';
        feedbackContainer.style.borderLeftColor = 'var(--alert-red)';
        feedbackContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        
        if (isNaN(x) && isNaN(y)) {
            feedbackMensagem.textContent = 'Preencha ambas as coordenadas, Cadete!';
        } else if (isNaN(x)) {
            feedbackMensagem.textContent = 'Digite a coordenada X!';
        } else {
            feedbackMensagem.textContent = 'Digite a coordenada Y!';
        }
        
        setTimeout(() => {
            if (!nivelConcluido) feedbackContainer.classList.add('hidden');
        }, 3000);
        
        return;
    }
    
    // INCREMENTA TENTATIVA
    GameState.progresso.nivel5.tentativas++;
    
    const yEsperadoA = naveA.a * x + naveA.b;
    const yEsperadoB = naveB.a * x + naveB.b;
    
    const diffA = Math.abs(y - yEsperadoA);
    const diffB = Math.abs(y - yEsperadoB);
    
    const naRetaA = diffA <= TOLERANCIA;
    const naRetaB = diffB <= TOLERANCIA;
    
    valorA.textContent = yEsperadoA.toFixed(2);
    valorB.textContent = yEsperadoB.toFixed(2);
    
    if (naRetaA) {
        verifA.classList.add('sucesso');
        statusA.innerHTML = '✅';
    } else {
        verifA.classList.add('erro');
        statusA.innerHTML = '❌';
    }
    
    if (naRetaB) {
        verifB.classList.add('sucesso');
        statusB.innerHTML = '✅';
    } else {
        verifB.classList.add('erro');
        statusB.innerHTML = '❌';
    }
    
    const diffX = Math.abs(x - pontoIntersecao.x);
    const diffY = Math.abs(y - pontoIntersecao.y);
    
    if (diffX <= TOLERANCIA) {
        cardX.classList.add('sucesso');
    } else {
        cardX.classList.add('erro');
    }
    
    if (diffY <= TOLERANCIA) {
        cardY.classList.add('sucesso');
    } else {
        cardY.classList.add('erro');
    }
    
    if (naRetaA && naRetaB && diffX <= TOLERANCIA && diffY <= TOLERANCIA) {
        // SUCESSO
        nivelConcluido = true;
        GameState.progresso.nivel5.concluido = true;
        GameState.niveisCompletos[4] = true;
        
        GameState.statusBase.energia = true;
        GameState.statusBase.oxigenio = true;
        GameState.statusBase.comunicacao = true;
        atualizarLEDs();
        
        feedbackIcone.innerHTML = '🏆';
        feedbackContainer.style.borderLeftColor = 'var(--success-green)';
        feedbackContainer.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        feedbackMensagem.innerHTML = `✅ CÁLCULO PERFEITO! As naves foram desviadas a tempo. 
            <br><br>Ponto de encontro em <strong>(${pontoIntersecao.x}, ${pontoIntersecao.y})</strong>. 
            <br><br><span style="color: var(--alert-yellow);">🎉 Você é um verdadeiro herói da Base Ares! Missão cumprida!</span>`;
        
        feedbackContainer.classList.remove('hidden');
        btnAvancar.classList.remove('hidden');
        
    } else {
        // ===== REGISTRO DE ERRO DETALHADO =====
        let tipoErro = '';
        let detalhesErro = {};
        
        if (!naRetaA && !naRetaB) {
            tipoErro = 'fora_das_retas';
            detalhesErro = {
                tipo: 'fora_das_retas',
                x: x,
                y: y,
                esperadoX: pontoIntersecao.x,
                esperadoY: pontoIntersecao.y,
                yEsperadoA: yEsperadoA,
                yEsperadoB: yEsperadoB,
                diffA: diffA,
                diffB: diffB
            };
        } else if (!naRetaA) {
            tipoErro = 'fora_reta_a';
            detalhesErro = {
                tipo: 'fora_reta_a',
                x: x,
                y: y,
                yEsperadoA: yEsperadoA,
                diferenca: diffA
            };
        } else if (!naRetaB) {
            tipoErro = 'fora_reta_b';
            detalhesErro = {
                tipo: 'fora_reta_b',
                x: x,
                y: y,
                yEsperadoB: yEsperadoB,
                diferenca: diffB
            };
        } else if (diffX > TOLERANCIA && diffY > TOLERANCIA) {
            tipoErro = 'ambas_coordenadas';
            detalhesErro = {
                tipo: 'ambas_coordenadas',
                x: x,
                y: y,
                esperadoX: pontoIntersecao.x,
                esperadoY: pontoIntersecao.y,
                diffX: diffX,
                diffY: diffY
            };
        } else if (diffX > TOLERANCIA) {
            tipoErro = 'coordenada_x';
            detalhesErro = {
                tipo: 'coordenada_x',
                x: x,
                esperadoX: pontoIntersecao.x,
                diferenca: diffX
            };
        } else if (diffY > TOLERANCIA) {
            tipoErro = 'coordenada_y';
            detalhesErro = {
                tipo: 'coordenada_y',
                y: y,
                esperadoY: pontoIntersecao.y,
                diferenca: diffY
            };
        } else {
            tipoErro = 'desconhecido';
            detalhesErro = {
                tipo: 'desconhecido',
                x: x,
                y: y,
                naRetaA: naRetaA,
                naRetaB: naRetaB,
                diffX: diffX,
                diffY: diffY
            };
        }
        
        // Registrar o erro
        registrarErro('nivel5', detalhesErro);
        console.log(`Nível 5 - Tentativa ${GameState.progresso.nivel5.tentativas}: (${x}, ${y}) - ERRO: ${tipoErro}`);
        
        // Feedback visual
        feedbackIcone.innerHTML = '⚠️';
        feedbackContainer.style.borderLeftColor = 'var(--alert-red)';
        feedbackContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        
        let mensagem = 'A rota de fuga calculada levaria as naves diretamente para a colisão. ';
        
        if (!naRetaA && !naRetaB) {
            mensagem += 'O ponto não está em nenhuma das rotas. ';
        } else if (!naRetaA) {
            mensagem += 'O ponto não está na rota da Nave A. ';
        } else if (!naRetaB) {
            mensagem += 'O ponto não está na rota da Nave B. ';
        }
        
        if (diffX > TOLERANCIA || diffY > TOLERANCIA) {
            mensagem += 'Verifique seus cálculos. Lembre-se: no ponto de encontro, o y da Nave A é igual ao y da Nave B.';
        }
        
        feedbackMensagem.textContent = mensagem;
        feedbackContainer.classList.remove('hidden');
        btnAvancar.classList.add('hidden');
        
        setTimeout(() => {
            if (!nivelConcluido) feedbackContainer.classList.add('hidden');
        }, 4000);
    }
}
    
    function atualizarSimulador() {
        const x = parseFloat(simSlider.value);
        simX.textContent = x.toFixed(1);
        
        const yA = naveA.a * x + naveA.b;
        const yB = naveB.a * x + naveB.b;
        
        simYA.textContent = yA.toFixed(1);
        simYB.textContent = yB.toFixed(1);
        
        if (Math.abs(yA - yB) < TOLERANCIA) {
            simuladorStatus.innerHTML = '⚠️ AS NAVES ESTÃO NA MESMA POSIÇÃO! Ponto de colisão!';
            simuladorStatus.style.color = 'var(--alert-red)';
        } else {
            simuladorStatus.innerHTML = `✅ Distância vertical: ${Math.abs(yA - yB).toFixed(2)} unidades`;
            simuladorStatus.style.color = 'var(--success-green)';
        }
        
        desenharGrafico();
    }
    
    inputX.addEventListener('input', () => {
        if (!nivelConcluido) {
            cardX.classList.remove('sucesso', 'erro');
            verifA.classList.remove('sucesso', 'erro');
            verifB.classList.remove('sucesso', 'erro');
            statusA.innerHTML = '';
            statusB.innerHTML = '';
            feedbackContainer.classList.add('hidden');
        }
    });
    
    inputY.addEventListener('input', () => {
        if (!nivelConcluido) {
            cardY.classList.remove('sucesso', 'erro');
            verifA.classList.remove('sucesso', 'erro');
            verifB.classList.remove('sucesso', 'erro');
            statusA.innerHTML = '';
            statusB.innerHTML = '';
            feedbackContainer.classList.add('hidden');
        }
    });
    
    btnCalcular.addEventListener('click', validarSolucao);
    
    btnLimpar.addEventListener('click', () => {
        inputX.value = '';
        inputY.value = '';
        cardX.classList.remove('sucesso', 'erro');
        cardY.classList.remove('sucesso', 'erro');
        verifA.classList.remove('sucesso', 'erro');
        verifB.classList.remove('sucesso', 'erro');
        statusA.innerHTML = '';
        statusB.innerHTML = '';
        valorA.textContent = '---';
        valorB.textContent = '---';
        feedbackContainer.classList.add('hidden');
    });
    
    btnDica.addEventListener('click', () => {
        feedbackIcone.innerHTML = '💡';
        feedbackContainer.style.borderLeftColor = 'var(--alert-orange)';
        feedbackContainer.style.backgroundColor = 'rgba(249, 115, 22, 0.1)';
        feedbackMensagem.innerHTML = `🔍 DICA: Use o método da igualdade! 
            <br>2x + 1 = -x + 4
            <br>2x + x = 4 - 1
            <br>3x = 3
            <br>x = 1
            <br>Depois substitua em qualquer equação para encontrar y.`;
        
        feedbackContainer.classList.remove('hidden');
        
        setTimeout(() => {
            if (!nivelConcluido) feedbackContainer.classList.add('hidden');
        }, 6000);
    });
    
    btnAvancar.addEventListener('click', () => {
        mostrarTelaFinalizacao();
    });
    
    simSlider.addEventListener('input', atualizarSimulador);
    
    desenharGrafico();
    atualizarSimulador();
    
    document.getElementById('metodo-igualdade').addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    document.getElementById('metodo-igualdade').addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    document.getElementById('metodo-substituicao').addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    document.getElementById('metodo-substituicao').addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}



// ===== FUNÇÃO AUXILIAR PARA FEEDBACK (Nível 1) =====
function mostrarFeedback(tipo, mensagem, inputA, inputB, mostrarAvancar = false) {
    const feedbackContainer = document.getElementById('feedback-nivel1');
    const feedbackIcone = document.getElementById('feedback-icone-n1');
    const feedbackMensagem = document.getElementById('feedback-mensagem-n1');
    const btnAvancar = document.getElementById('btn-avancar-n1');
    
    if (tipo === 'sucesso') {
        feedbackIcone.innerHTML = '🏆';
        feedbackContainer.style.borderLeftColor = 'var(--success-green)';
        feedbackContainer.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
    } else {
        feedbackIcone.innerHTML = '⚠️';
        feedbackContainer.style.borderLeftColor = 'var(--alert-red)';
        feedbackContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    }
    
    feedbackMensagem.textContent = mensagem;
    feedbackContainer.classList.remove('hidden');
    
    if (mostrarAvancar) {
        btnAvancar.classList.remove('hidden');
    } else {
        btnAvancar.classList.add('hidden');
    }
    
    if (tipo === 'erro') {
        setTimeout(() => {
            if (inputA) inputA.classList.remove('erro');
            if (inputB) inputB.classList.remove('erro');
        }, 3000);
    }
}

// Exportar funções para uso global
window.GameState = GameState;
window.carregarNivel = carregarNivel;
window.gerarRelatorioDiagnostico = gerarRelatorioDiagnostico;