# Operação Zero

Primeira entrega jogável do briefing em [docs/brief.md](docs/brief.md): FPS 3D original para navegador, em português, com uma arena industrial e uma missão local contra quatro inimigos. **É um protótipo funcional, não um jogo AAA final. Não possui multiplayer.**

## Executar

Requisitos: Node.js 22.12+ (validado com 24.19), npm e navegador desktop com WebGL2, mouse e teclado.

```sh
cd /workspace/zero
npm ci --cache /workspace/.npm-cache --no-audit --no-fund
npm run dev
```

Abra o endereço fornecido pelo Vite em seu ambiente de desenvolvimento. Clique em **Iniciar operação** para capturar o mouse. O áudio é ativado após essa interação. O ambiente de onboarding não oferece prévia web pública.

```sh
npm test
npm run build
# Com o servidor de desenvolvimento em execução e Chromium instalado:
npm run test:browser
# Opcional: servir a compilação de produção
npm run preview
```

O teste de navegador usa `/usr/bin/chromium`; outro executável pode ser definido com `CHROMIUM_PATH`. Não é necessário baixar os navegadores do Playwright. `--no-sandbox` é exclusivo do runner headless neste contêiner. Use sandbox normal para navegação cotidiana.

## Jogar

- WASD: mover; Shift: correr; Ctrl esquerdo: agachar.
- Espaço: saltar; mouse: olhar; botão esquerdo: disparar; direito: mirar.
- R: recarregar; Esc: pausar e liberar o mouse.
- Neutralize os quatro hostis em três minutos, preservando sua vida. Vitória ou derrota libera reinício.
- Configurações: sensibilidade, FOV, volume, qualidade e balanço da arma. Aplicar persiste no armazenamento local; cancelar descarta alterações; restaurar padrões prepara valores para aplicação.

## Tecnologia e arquitetura

Unreal Engine não está disponível nesta máquina. Three.js + Vite permitem executar e validar a entrega imediatamente, sem assets comerciais ou ferramentas proprietárias. Uma migração para UE5 seria um projeto separado: estes módulos JavaScript não são código C++/Blueprint compatível.

- `src/simulation.js`: regras de arma, dano, vida, tempo, colisão e partida, independentes do renderer.
- `src/ai.js`: percepção com oclusão, investigação de disparos, memória, patrulha e navegação em grade.
- `src/main.js`: cena, entrada, apresentação, integração de estados e HUD.
- `src/audio.js`: sons sintetizados de disparo, recarga e impacto, com pan e atenuação por distância para disparos inimigos. Não são gravações reais.
- `src/style.css` e `index.html`: menus, HUD e configurações.
- `tests/`: testes unitários e fluxo real de navegador.

O dano usa raycast contra cobertura antes de personagens. Cada disparo consome munição e gera um traçante a partir do cano. A recarga transfere munição da reserva; o estado de partida bloqueia dano após o encerramento. Colisões horizontais usam passos pequenos para evitar atravessar paredes. Os obstáculos desta arena não são escaláveis.

## Estado e limites

**Implementado e testado automaticamente:** cadência, consumo de munição, recarga com reserva finita, queda de dano, multiplicador de cabeça, oclusão, colisões horizontais e entre personagens, percepção/navegação básica da IA, vitória/derrota e reset das regras. O teste de navegador cobre startup WebGL, configurações persistentes, captura do mouse, disparo/recarga e dano de raycast em inimigo, movimento, salto, pausa e retomada.

**Implementado com validação visual limitada:** modelos 3D procedurais de arma/personagens/arena, recuo, mira, feedback de dano, efeitos de disparo, inclinação da arma na recarga, animação simples de pernas e sons sintetizados. Não há rig completo, IK, recarga de carregador animada ou qualidade artística final.

**Parcial:** IA usa patrulha, combate, investigação e busca com navegação; não possui coordenação de equipe, cobertura inteligente, flanqueamento ou granadas. Gráficos possuem duas opções de resolução interna/sombras; não há painel completo de hardware ou benchmark de GPU. A física é apropriada a esta arena plana, não um motor de colisão geral.

**Ainda não implementado:** rede cliente-servidor, lobby, progressão, inventário, acessórios, arsenal de 40 armas, veículos, destruição, habilidades, minimapa, modos adicionais e mapas adicionais. Não são oferecidos botões que afirmem disponibilizar esses recursos.

**Dependências futuras:** assets finais licenciados/originais, animação e áudio de produção, hardware de referência para profiling, servidor autoritativo e infraestrutura de sessão/persistência para multiplayer. Nenhuma credencial é necessária para o protótipo local.

Desempenho e conforto precisam de avaliação humana em hardware real. Testes headless com renderização por software não comprovam FPS ou qualidade gráfica em uma GPU de jogador. O relógio limita o passo a 50 ms para manter estabilidade; máquinas lentas podem executar a simulação mais devagar que tempo real.

## Próximas etapas

1. Ampliar testes de combate integrado e fluxo de vitória/derrota no navegador; validar manualmente a arena e o áudio.
2. Refinar física, movimento, rigs e animações; separar mais a apresentação de cena/controlador.
3. Introduzir inventário e armas baseadas em dados com modelos individuais.
4. Construir servidor autoritativo e testes multi-cliente antes de oferecer partidas online.
5. Expandir conteúdo e arte de acordo com as fases do briefing, sem marcar funções futuras como concluídas.
