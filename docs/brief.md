# PROJETO: OPERAÇÃO ZERO — FPS AAA TÁTICO, REALISTA E MULTIPLAYER

## 1. SUA FUNÇÃO E MISSÃO

Atue como uma equipe completa de desenvolvimento de jogos AAA, reunindo as funções de:

- Game director e game designer sênior.
- Desenvolvedor especialista em FPS e física de combate.
- Programador de gameplay, IA, networking e multiplayer.
- Artista técnico especializado em personagens, armas, animações e ambientes realistas.
- Especialista em áudio 3D, efeitos sonoros e mixagem.
- Designer de interfaces, HUD, menus, inventários e sistemas de progressão.
- Especialista em otimização, testes e arquitetura de software.

Desenvolva um FPS original, extremamente imersivo, moderno, responsivo e funcional, com referências às melhores características de Valorant, Apex Legends, Fortnite, GTA VI, Call of Duty e Battlefield.

Essas referências devem servir apenas como inspiração para qualidade, ritmo, profundidade e variedade. Não copie personagens, mapas, nomes, modelos, sons, logotipos, interfaces ou conteúdos proprietários. Crie identidade visual e sistemas próprios.

O objetivo não é produzir uma demonstração visual ou uma tela que apenas pareça um jogo. O objetivo é construir um jogo jogável, com sistemas integrados, combate consistente, movimentação fluida, conteúdo expansível e uma estrutura técnica sustentável.

## 2. REGRA FUNDAMENTAL: FUNCIONALIDADE REAL

Antes de desenvolver, examine o projeto existente e identifique a tecnologia, os arquivos, as dependências e os sistemas disponíveis.

Se o projeto estiver vazio, escolha uma tecnologia adequada a um FPS 3D de alta qualidade. Priorize Unreal Engine 5 com C++, Blueprints, Enhanced Input, sistemas de animação, replicação de rede e ferramentas de criação de ambientes. Se o ambiente de execução exigir outra tecnologia, explique a escolha e suas limitações.

Não reconstrua um projeto existente sem necessidade. Não apague funcionalidades que já funcionam.

Regras obrigatórias:

1. Não crie botões decorativos que não executam ações.
2. Não simule multiplayer real com jogadores controlados localmente.
3. Não apresente inimigos parados como inteligência artificial completa.
4. Não use imagens estáticas como substitutos permanentes de armas, personagens ou ambientes 3D.
5. Não crie animações que não estejam conectadas ao estado real do personagem.
6. Não exiba munição, vida, inventário ou habilidades com valores desconectados da lógica do jogo.
7. Não use o mesmo modelo genérico para representar todo o arsenal.
8. Não deixe objetos atravessarem paredes, pisos, jogadores ou outros objetos sem justificativa física.
9. Não apresente recursos futuros como recursos concluídos.
10. Não esconda erros com elementos visuais ou mensagens falsas.

Cada sistema deve ter lógica, estados, entradas, saídas, regras e testes.

Quando uma funcionalidade depender de servidor, serviço externo, assets ainda inexistentes ou infraestrutura indisponível, implemente a parte que for possível, identifique a dependência e informe claramente o que ainda falta.

## 3. IDENTIDADE VISUAL E QUALIDADE GRÁFICA

Crie uma identidade visual original com atmosfera militar contemporânea, operações especiais, conflitos urbanos, instalações industriais, zonas de guerra e ambientes naturais detalhados.

A direção artística deve combinar:

- Modelos 3D com proporções realistas.
- Materiais PBR de alta qualidade.
- Iluminação global e sombras coerentes.
- Reflexos e superfícies com propriedades físicas convincentes.
- Vegetação, terrenos, estruturas e interiores detalhados.
- Animações naturais, com peso, inércia e contato com o ambiente.
- Partículas de poeira, fumaça, chuva, faíscas, fragmentos e detritos.
- Efeitos de luz de disparos, impactos e explosões.
- Ambientes com profundidade, escala e leitura visual clara.
- Pós-processamento configurável, sem prejudicar a visibilidade competitiva.

Use iluminação dinâmica, Lumen, Nanite e Virtual Shadow Maps quando a plataforma e o projeto suportarem esses recursos. Não os habilite indiscriminadamente se causarem problemas de desempenho.

A qualidade precisa ser consistente entre personagens, armas, cenários, efeitos e interface. Não misture modelos realistas com personagens de aparência simplificada ou efeitos visivelmente provisórios na versão apresentada como final.

Implemente níveis de detalhe, carregamento progressivo, culling, streaming de ambientes e configurações gráficas adequadas ao hardware.

## 4. CÂMERA, PERSPECTIVA E CONTROLES

O jogo deve utilizar perspectiva em primeira pessoa durante o combate principal.

A câmera precisa apresentar:

- Controle preciso de mouse e teclado.
- Sensibilidade configurável.
- Campo de visão ajustável.
- Movimento de câmera coerente com a movimentação.
- Balanço de arma controlado.
- Reação visual a disparos, impactos e explosões.
- Transições suaves entre estados de movimentação.
- Animação de inspeção e troca de armas.
- Opções para reduzir balanço, tremor e efeitos que causem desconforto.

O movimento da câmera nunca deve prejudicar desnecessariamente a precisão ou esconder informações importantes.

Permita primeira pessoa durante o combate e terceira pessoa em menus, inspeção de personagens ou outros modos quando apropriado.

## 5. SISTEMA COMPLETO DE MOVIMENTAÇÃO

Crie um sistema de movimentação responsivo, com aceleração, desaceleração, atrito e limites coerentes.

Inclua:

- Caminhar.
- Correr.
- Sprint tático.
- Agachar.
- Deslizar, com velocidade, atrito e recuperação controlados.
- Saltar.
- Escalar obstáculos baixos.
- Transpor barreiras.
- Subir escadas.
- Interagir com portas e objetos.
- Movimentar-se em terrenos inclinados.
- Nadar quando o mapa exigir.
- Movimentar-se enquanto mira.
- Transições de postura.
- Animações de início, execução e encerramento de cada movimento.

Movimentos avançados, como escalada de estruturas, corrida em paredes ou mecânicas de mobilidade extrema, devem ser implementados apenas quando combinarem com o equilíbrio do jogo.

A movimentação precisa respeitar a geometria do mapa, a colisão, a gravidade, a velocidade e a postura.

Não permita que o jogador atravesse paredes, ganhe velocidade infinita, salte de maneira inconsistente ou explore falhas simples de colisão.

Crie estados de movimentação claros e impeça combinações incompatíveis.

## 6. COMBATE E BALÍSTICA

O combate deve ser responsivo, legível, consistente e satisfatório.

Implemente:

- Disparos com raycast ou projéteis físicos, conforme a arma.
- Cadência específica para cada arma.
- Tempo de saque e troca.
- Recuo vertical e horizontal.
- Recuperação de recuo.
- Dispersão em movimento e durante saltos.
- Precisão diferente ao mirar e disparar sem mirar.
- Distância efetiva e queda de dano.
- Penetração de materiais quando aplicável.
- Impactos diferentes em metal, concreto, madeira, vidro, terra e água.
- Dano por região corporal.
- Reação dos personagens a impactos.
- Interrupção de ações por dano quando aplicável.
- Supressão visual e sonora equilibrada.
- Explosões com alcance, cobertura e dano apropriados.
- Registro consistente dos acertos.
- Feedback claro de eliminações e assistências.

O dano deve ser calculado por uma única lógica central e validado no servidor durante partidas online.

Os projéteis, os efeitos de disparo e os impactos visuais devem corresponder ao disparo real. Não produza rastros que saiam de uma posição diferente do cano da arma nem efeitos que apareçam sem um evento correspondente.

## 7. ARSENAL EXTENSO E DIFERENCIADO

Crie uma arquitetura de armas baseada em dados, com estatísticas, animações, modelos, sons e comportamentos individuais.

Categorias obrigatórias:

- Pistolas.
- Submetralhadoras.
- Fuzis de assalto.
- Fuzis de batalha.
- Fuzis de precisão.
- Escopetas.
- Metralhadoras leves.
- Armas de apoio.
- Armas especiais.
- Equipamentos não letais, quando apropriado.

Prepare uma base expansível para pelo menos 40 armas originais, mas não invente que todas estão prontas se apenas algumas estiverem implementadas.

Cada arma precisa possuir:

- Modelo 3D próprio.
- Silhueta reconhecível.
- Animações de equipar, disparar, recarregar, inspecionar e guardar.
- Som específico de disparo.
- Som de mecanismo.
- Recuo próprio.
- Cadência própria.
- Capacidade de carregador.
- Reserva de munição.
- Tempo de recarga.
- Dano e alcance.
- Dispersão e precisão.
- Peso e influência na movimentação.
- Modos de disparo compatíveis.
- Acessórios permitidos.
- Interface e ícone próprios.
- Animações de mãos e interação com os acessórios.

As estatísticas devem gerar diferenças perceptíveis no jogo. Uma escopeta não pode se comportar como um fuzil com outro modelo.

Organize as armas em configurações de dados para facilitar o balanceamento sem duplicar código.

## 8. PERSONALIZAÇÃO PROFUNDA DE ARMAS

Crie um armeiro interativo, em que o jogador possa visualizar a arma em 3D, girá-la, aproximar a câmera e inspecionar os componentes.

Categorias de acessórios:

- Miras ópticas.
- Miras holográficas.
- Miras de precisão.
- Canos e compensadores.
- Supressores.
- Empunhaduras.
- Coronha.
- Carregadores.
- Módulos de laser.
- Lanternas.
- Acessórios compatíveis com cada plataforma.

A instalação de um acessório deve alterar a arma real, não apenas seu ícone.

Exemplos:

- Uma mira altera a visualização ao mirar.
- Um supressor modifica o perfil sonoro e pode afetar outros atributos de acordo com o balanceamento.
- Uma empunhadura pode alterar o comportamento do recuo.
- Um carregador ampliado muda a capacidade e a animação correspondente.
- Uma coronha pode alterar estabilidade, mobilidade ou ergonomia.

Crie compatibilidade explícita entre armas e acessórios. Não permita combinações impossíveis.

Inclua skins, camuflagens, materiais, acabamentos, adesivos, amuletos e opções cosméticas. Cosméticos não devem conceder vantagens competitivas ocultas.

## 9. MIRA, HUD E LEITURA DO COMBATE

Implemente uma interface de combate completa, clara e configurável.

Elementos:

- Mira central.
- Indicador de vida.
- Escudo ou armadura, quando utilizados pelo modo.
- Munição atual e reserva.
- Arma equipada.
- Habilidades e seus tempos de recarga.
- Indicadores de interação.
- Marcadores de objetivos.
- Estado dos companheiros.
- Informações de eliminações.
- Alertas de granadas e ameaças.
- Direção de dano recebido.
- Estado da partida.
- Informações contextuais do modo de jogo.

Crie configurações independentes para cor, tamanho, opacidade, espessura, distância entre elementos e formato da mira.

Permita configurar mira estática ou dinâmica, com opções para mostrar ou ocultar indicadores de disparo e movimento.

Inclua perfis de HUD, escala de interface e suporte a diferentes resoluções e proporções de tela.

Nenhum elemento importante pode ficar cortado, sobreposto ou fora da área visível. Todos os elementos devem respeitar âncoras, margens, escalas e regras de adaptação.

## 10. MINIMAPA E SISTEMA DE NAVEGAÇÃO

Crie um minimapa funcional, conectado à geometria real do mapa.

Ele deve mostrar, conforme as regras da partida:

- Posição e orientação do jogador.
- Companheiros de equipe.
- Objetivos.
- Pontos de interesse.
- Marcadores colocados pelos jogadores.
- Zonas perigosas.
- Veículos e outros elementos relevantes.
- Informações de visibilidade permitidas pelo modo.

Inclua zoom, rotação opcional, transparência, tamanho ajustável e configurações de posição.

O minimapa não pode revelar automaticamente inimigos que estejam fora das condições legítimas de detecção. Use regras de visibilidade, informações de equipe e recursos específicos do modo.

Permita abrir um mapa ampliado, marcar locais e compartilhar marcações com a equipe.

## 11. HABILIDADES E ESPECIALIZAÇÕES

Crie um sistema de habilidades com funções táticas próprias, sem transformar todos os personagens em cópias uns dos outros.

Especializações sugeridas:

- Assalto: mobilidade e pressão ofensiva.
- Reconhecimento: informação, rastreamento e detecção limitada.
- Suporte: recuperação, proteção e recursos de equipe.
- Engenharia: dispositivos, fortificações e contramedidas.
- Controle: bloqueio de áreas e restrição de movimentação.
- Precisão: observação e combate a distância.
- Demolição: destruição de obstáculos e controle de posições.

Cada especialização deve possuir habilidades passivas, habilidades ativas e uma habilidade de alto impacto, conforme o equilíbrio do jogo.

Inclua custos, cargas, tempos de recarga, alcance, duração, contramedidas e limites de uso.

Habilidades devem ter animações, efeitos, sons e feedback visual próprios. O jogador precisa compreender o que aconteceu e como responder.

Crie árvores de progressão que liberem escolhas e estilos de jogo, sem conceder vantagens irreversíveis que destruam o equilíbrio competitivo.

As habilidades devem respeitar colisões, regras de equipe e autoridade do servidor.

## 12. INVENTÁRIO, EQUIPAMENTOS E LOOT

Implemente inventário funcional, com gerenciamento real dos itens.

Inclua:

- Armas equipadas.
- Armas secundárias.
- Munição.
- Granadas.
- Equipamentos táticos.
- Consumíveis.
- Proteções.
- Acessórios.
- Itens encontrados no mapa.
- Itens específicos de determinados modos.

Permita recolher, equipar, descartar, trocar, inspecionar e comparar itens.

Implemente limites de capacidade quando o modo exigir, regras para itens incompatíveis e feedback visual para ações inválidas.

O inventário deve ser sincronizado com o estado real do jogador. Um item não pode aparecer duplicado, desaparecer sem motivo ou ser utilizado após ter sido removido.

Em modos com loot, crie distribuição controlada, raridades e tabelas de surgimento específicas por mapa.

## 13. MAPAS, AMBIENTAÇÃO E DESTRUIÇÃO

Desenvolva mapas originais de diferentes escalas.

Prepare os seguintes conceitos:

1. Distrito urbano denso, com ruas, becos, prédios e interiores.
2. Complexo industrial, com galpões, passarelas e máquinas.
3. Base militar, com hangares, corredores e áreas externas.
4. Região costeira, com portos, armazéns e áreas abertas.
5. Região montanhosa, com vegetação, estradas e postos avançados.
6. Área metropolitana ampla, com zonas comerciais, residenciais e industriais.
7. Instalação de pesquisa, com corredores, laboratórios e sistemas de segurança.
8. Mapa competitivo compacto, construído para confrontos táticos e objetivos.

Cada mapa precisa de identidade visual, rotas alternativas, pontos de cobertura, áreas de combate próximo e distante, locais de interesse e pontos de surgimento equilibrados.

Crie interiores navegáveis e evite prédios que aparentem ser acessíveis, mas sejam apenas fachadas, quando sua aparência sugerir o contrário.

Implemente destruição seletiva e controlada: vidros quebráveis, portas danificáveis, coberturas destrutíveis, objetos físicos e estruturas específicas que possam sofrer danos.

A destruição deve ter limites claros, desempenho previsível e regras consistentes em multiplayer. Não exija que todo edifício seja completamente destrutível.

Inclua ciclos de iluminação e clima quando apropriado, com chuva, neblina, vento, poeira, superfícies molhadas e efeitos ambientais coerentes.

Os efeitos climáticos não podem criar vantagens injustas sem estarem previstos nas regras da partida.

## 14. MODOS DE JOGO

Implemente uma arquitetura que permita adicionar modos sem reconstruir os sistemas principais.

Modos planejados:

**Competitivo tático**
- Duas equipes.
- Rodadas.
- Objetivos de ataque e defesa.
- Economia de equipamentos, quando aplicável.
- Regras de vitória e desempate.
- Classificação competitiva.

**Mata-mata em equipe**
- Eliminações por equipe.
- Pontuação individual e coletiva.
- Ressurgimento controlado.
- Limite de tempo ou pontuação.

**Dominação**
- Captura e manutenção de zonas.
- Pontuação por controle.
- Regras de desempate.

**Conquista em larga escala**
- Equipes maiores.
- Múltiplos objetivos.
- Veículos quando suportados.
- Combate em diferentes distâncias.
- Reforços e ressurgimentos.

**Battle royale**
- Entrada em uma área extensa.
- Distribuição de equipamentos.
- Zona de jogo progressivamente reduzida.
- Loot e sobrevivência.
- Regras para solos, duplas e esquadrões, quando implementadas.

**Extração**
- Coleta de recursos.
- Objetivos opcionais.
- Extração sob risco.
- Persistência de itens conforme as regras do modo.

**Cooperativo PvE**
- Missões contra inimigos controlados por IA.
- Objetivos em etapas.
- Eventos durante as missões.
- Dificuldade progressiva.
- Recompensas e extração quando apropriado.

**Treinamento**
- Campo de tiro.
- Alvos estáticos e móveis.
- Testes de recuo.
- Configuração de equipamentos.
- Exercícios de movimentação.

Cada modo precisa de condições de vitória, regras de surgimento, contagem de tempo, pontuação, encerramento e reinício. Um modo só pode ser marcado como implementado depois que puder ser jogado.

## 15. MULTIPLAYER ONLINE E COOPERATIVO

Projete o jogo para multiplayer real, com arquitetura cliente-servidor.

Implemente progressivamente:

- Criação e entrada em partidas.
- Lobby.
- Formação de grupos.
- Convites.
- Seleção de modo e mapa.
- Sincronização de jogadores.
- Movimento replicado.
- Estado de armas e munição.
- Dano e eliminações validados pelo servidor.
- Ressurgimento.
- Objetivos compartilhados.
- Pontuação.
- Reconexão quando suportada.
- Tratamento de desconexões.
- Encerramento e retorno ao lobby.
- Proteções básicas contra manipulação do cliente.

O servidor deve ser a autoridade sobre eventos competitivos importantes, incluindo dano, inventário, munição, resultados e recompensas.

Implemente interpolação, previsão de movimento e compensação de latência quando adequadas à arquitetura.

Não confunda jogar contra bots com jogar contra pessoas reais.

Se não houver infraestrutura online disponível, construa primeiro uma sessão local de testes e a arquitetura preparada para rede. Declare explicitamente que o multiplayer online ainda depende de servidor e infraestrutura.

O modo cooperativo deve permitir que jogadores completem objetivos juntos, compartilhem informações e interajam com o mesmo estado de missão.

## 16. INTELIGÊNCIA ARTIFICIAL DOS INIMIGOS

Crie inimigos com comportamento contextual, não apenas alvos que correm em direção ao jogador.

A IA deve ser capaz de:

- Detectar jogadores por visão e audição.
- Investigar sons.
- Procurar cobertura.
- Alternar entre patrulha, suspeita, combate e busca.
- Comunicar ameaças a aliados.
- Reposicionar-se.
- Recuar quando necessário.
- Flanquear de forma limitada e coerente.
- Recarregar.
- Escolher equipamentos compatíveis com sua função.
- Respeitar obstáculos e rotas navegáveis.
- Reagir a granadas e explosões.
- Perder o contato com o jogador.
- Retomar a patrulha quando a ameaça desaparecer.

Crie diferentes perfis de inimigos: infantaria, reconhecimento, suporte, unidades pesadas e especialistas, conforme o modo.

Use navegação, percepção, árvores de comportamento ou máquinas de estados apropriadas à tecnologia.

A dificuldade deve mudar a qualidade das decisões, a coordenação e a pressão exercida. Não deve depender apenas de aumentar a vida ou conceder precisão impossível.

Impeça que a IA enxergue através de paredes sem uma habilidade específica ou informação legítima.

## 17. ANIMAÇÕES, SPRITES, RIGS E MOVIMENTO

Priorize modelos 3D, esqueletos, rigs e animações coerentes com um FPS realista.

Crie ou integre animações específicas para:

- Locomoção em diferentes velocidades.
- Mudanças de postura.
- Saltos e aterrissagens.
- Escalada e transposição.
- Disparo e recuo.
- Mira com diferentes acessórios.
- Recarga tática e completa.
- Troca de armas.
- Inspeção de equipamentos.
- Uso de habilidades.
- Reações a dano.
- Eliminação.
- Interações com portas e objetos.
- Entrada e saída de veículos, quando houver.

Use blending entre animações, sincronização entre braços e arma, IK para mãos e pés, controle de contato e transições adequadas.

As mãos devem segurar a arma nos pontos corretos. O carregador, o ferrolho e outros mecanismos devem acompanhar a animação compatível com a arma.

Evite poses rígidas, braços desconectados, deslizamento dos pés, membros atravessando objetos e movimentos instantâneos.

Use animações de terceiros apenas quando as licenças permitirem e quando elas se integrarem corretamente ao rig e à direção artística.

Se o termo “sprites” se referir a elementos 2D, use-os para ícones, marcadores, efeitos pontuais e interface. Não substitua personagens 3D realistas por sprites simplificados no combate principal.

## 18. VEÍCULOS E TRANSPORTE

Prepare suporte para veículos terrestres e outros transportes adequados aos mapas.

Inclua, quando implementados:

- Entrada e saída.
- Controles próprios.
- Física e colisões.
- Aceleração, frenagem e direção.
- Câmera.
- Sons do motor.
- Danos.
- Estados de destruição.
- Ocupantes e sincronização online.
- Regras de surgimento e reaparecimento.

Os veículos devem ter utilidade real no mapa e não funcionar apenas como objetos decorativos.

## 19. SISTEMA DE SOM E ÁUDIO ESPACIAL

O áudio deve ser uma parte essencial da experiência.

Crie sistemas de som para:

- Disparos por categoria de arma.
- Ecos em espaços fechados.
- Reverberação específica por ambiente.
- Sons abafados por paredes.
- Passos em diferentes materiais.
- Corrida, salto e aterrissagem.
- Recarga e manipulação de armas.
- Impactos em materiais.
- Explosões e detritos.
- Veículos.
- Ambientes naturais e urbanos.
- Alertas, objetivos e comunicações.
- Interfaces e menus.

Implemente áudio espacial, atenuação por distância, oclusão, reverberação e posicionamento coerente das fontes.

Diferencie sons próximos e distantes. Um disparo dentro de um corredor não deve soar igual a um disparo em um campo aberto.

Crie mixagens diferentes para gameplay competitivo, imersão e acessibilidade.

Use gravações licenciadas ou sons originais. Não afirme que os sons são gravações reais se forem sintetizados.

Inclua controles separados de volume para efeitos, ambiente, música, voz e interface.

## 20. MENU PRINCIPAL E NAVEGAÇÃO COMPLETA

Crie um menu principal com apresentação profissional e identidade própria.

Seções:

- Jogar.
- Multiplayer.
- Cooperativo.
- Treinamento.
- Arsenal.
- Personalização.
- Operadores ou personagens.
- Progressão.
- Missões.
- Passe de temporada, se houver.
- Estatísticas.
- Amigos.
- Grupo.
- Configurações.
- Acessibilidade.
- Créditos.
- Sair.

O menu deve possuir transições suaves, hierarquia visual clara, sons de interação e estados de carregamento.

Os botões precisam abrir telas reais, preservar seleções e retornar corretamente à tela anterior.

A interface não pode apresentar modos, jogadores online, itens desbloqueados ou estatísticas inventadas.

Crie uma tela de carregamento com dicas contextuais e informações reais sobre o mapa e o modo selecionados.

## 21. PERSONALIZAÇÃO DE PERSONAGENS

Permita personalizar a aparência dos personagens com:

- Uniformes.
- Capacetes.
- Coletes.
- Luvas.
- Calçados.
- Equipamentos visuais.
- Camuflagens.
- Emblemas.
- Identificadores.
- Animações cosméticas.
- Poses de apresentação.

Os itens precisam respeitar o modelo e o esqueleto do personagem, sem atravessar o corpo ou se desconectar durante as animações.

Crie um sistema de desbloqueio por progressão e desafios. A aparência não deve modificar hitboxes ou oferecer vantagens competitivas escondidas.

## 22. PROGRESSÃO, MISSÕES E RECOMPENSAS

Implemente progressão persistente quando houver armazenamento disponível.

Inclua:

- Nível de jogador.
- Experiência.
- Estatísticas.
- Desafios diários e semanais.
- Missões por modo.
- Desbloqueios de equipamentos.
- Domínio individual de armas.
- Conquistas.
- Histórico de partidas.
- Recompensas cosméticas.
- Registro de resultados.

Cada recompensa deve ser vinculada a uma condição real. Não conceda experiência repetidamente por eventos duplicados nem permita que o cliente determine sozinho as recompensas competitivas.

Prepare uma estrutura de temporadas e eventos sem exigir que todos estejam ativos na primeira versão.

## 23. RANKED E COMPETIÇÃO

Crie uma estrutura de classificação que possa ser usada em modos competitivos.

Inclua:

- Divisões e patentes.
- Avaliação de desempenho.
- Resultados de partidas.
- Histórico.
- Classificação de amigos.
- Regras de abandono.
- Penalidades configuráveis.
- Proteção contra manipulação de resultados.
- Separação entre partidas casuais e competitivas.

Não atribua classificação competitiva real sem resultados de partidas válidos e persistidos.

A classificação deve considerar o resultado da equipe e um sistema de pontuação documentado. Evite recompensar comportamentos que prejudiquem os objetivos da equipe.

## 24. CONFIGURAÇÕES AVANÇADAS

Crie uma área de configurações completa, com persistência das preferências.

### Controles
- Remapeamento de teclas.
- Sensibilidade horizontal e vertical.
- Multiplicador ao mirar.
- Inversão dos eixos.
- Alternância ou manutenção de teclas pressionadas.
- Configurações de controle compatíveis com gamepads.
- Zona morta.
- Vibração.
- Sensibilidade por tipo de mira, quando suportada.

### Gráficos
- Resolução.
- Modo janela, tela cheia e janela sem bordas.
- Limite de FPS.
- Sincronização vertical.
- Qualidade de texturas.
- Sombras.
- Iluminação.
- Efeitos.
- Pós-processamento.
- Distância de visão.
- Escala de resolução.
- Upscaling compatível com a plataforma.
- Desfoque de movimento.
- Campo de visão.
- Brilho e contraste.

### Áudio
- Volume geral.
- Música.
- Efeitos.
- Ambiente.
- Voz.
- Interface.
- Perfil de áudio espacial, quando suportado.

### Interface e acessibilidade
- Escala do HUD.
- Tamanho dos textos.
- Cores da interface.
- Opções de daltonismo.
- Legendas.
- Indicadores visuais de áudio.
- Redução de tremor e movimento de câmera.
- Intensidade de efeitos visuais.
- Opções para reduzir flashes.
- Alternativas para informações exclusivamente sonoras.

Inclua botões para aplicar, cancelar e restaurar padrões. Mudanças de resolução precisam de confirmação e reversão automática caso a tela fique inutilizável.

Os atalhos não podem entrar em conflito sem aviso. Permita restaurar uma tecla individual ou todo o perfil.

## 25. DESEMPENHO E OTIMIZAÇÃO

O jogo deve ser escalável para diferentes configurações de hardware.

Implemente:

- Profiling de CPU e GPU.
- Gerenciamento de memória.
- Streaming de recursos.
- Níveis de detalhe.
- Culling.
- Pooling de objetos quando apropriado.
- Limites de partículas.
- Otimização de animações.
- Carregamento assíncrono.
- Tratamento de travamentos.
- Monitoramento de FPS e latência.
- Configurações de qualidade.

Não use a quantidade de efeitos na tela como substituto de qualidade gráfica.

Evite carregar todos os mapas, modelos e sons simultaneamente. Use carregamento por necessidade.

Crie metas de desempenho mensuráveis para o hardware de referência, sem prometer FPS que não tenham sido testados.

## 26. ARQUITETURA DO PROJETO

Separe os sistemas em módulos com responsabilidades claras.

Estruture, conforme a tecnologia:

- Core e gerenciamento de partidas.
- Player Controller.
- Character e movimentação.
- Sistema de armas.
- Dano e saúde.
- Inventário.
- Habilidades.
- Interações.
- IA.
- Mapas e navegação.
- Objetivos e modos.
- HUD.
- Menus.
- Áudio.
- Multiplayer.
- Progressão.
- Persistência.
- Configurações.
- Telemetria e testes.

Use configurações baseadas em dados para armas, personagens, habilidades, itens, mapas e modos.

Evite um único arquivo gigantesco que controle o jogo inteiro.

Mantenha separação entre lógica, apresentação, dados e comunicação de rede.

Implemente tratamento de erros, logs úteis, validação de dados e testes automatizados para as regras essenciais.

## 27. TESTES OBRIGATÓRIOS

Crie uma lista verificável de testes.

### Combate
- Disparar consome munição.
- Recarregar restaura a capacidade correta.
- O dano respeita a arma e a distância.
- Os impactos correspondem aos acertos.
- Trocar armas preserva o estado correto.

### Movimentação
- Não atravessar paredes.
- Não ficar preso em geometria comum.
- Saltos e aterrissagens funcionam.
- Posturas não quebram colisões.
- Animações acompanham os estados reais.

### Interface
- Todos os botões executam suas ações.
- Nenhum texto essencial fica cortado.
- Menus abrem e fecham corretamente.
- Configurações permanecem salvas.
- O HUD reflete o estado verdadeiro do jogo.

### IA
- Inimigos detectam ameaças conforme as regras.
- A navegação respeita os obstáculos.
- A IA não dispara continuamente contra paredes.
- Estados de combate e busca são consistentes.

### Multiplayer
- Jogadores compartilham o estado correto.
- Dano e munição são validados.
- Desconexões não corrompem a partida.
- Resultados não são duplicados.
- Clientes não podem conceder a si mesmos recompensas.

### Desempenho
- Monitorar FPS, memória e tempos de carregamento.
- Testar cenas com diferentes quantidades de inimigos.
- Identificar gargalos antes de aumentar a complexidade.

Registre quais testes passaram, falharam ou ainda não foram executados.

## 28. ORDEM DE DESENVOLVIMENTO

Não tente desenvolver todos os sistemas simultaneamente sem uma base funcional.

Siga esta sequência:

**Fase 1 — Fundação técnica**
- Identificar tecnologia e estrutura.
- Criar projeto executável.
- Configurar controles.
- Criar um ambiente de teste.
- Implementar movimentação e câmera.
- Validar colisões e desempenho inicial.

**Fase 2 — Combate**
- Implementar uma arma funcional.
- Criar disparo, recuo, dano e recarga.
- Criar um inimigo funcional.
- Implementar vida, morte e reinício.
- Criar efeitos e sons sincronizados.

**Fase 3 — Sistemas centrais**
- Inventário.
- Troca de armas.
- Equipamentos.
- HUD.
- Interações.
- Habilidades básicas.
- IA e objetivos.

**Fase 4 — Primeiro modo completo**
- Uma arena original.
- Duas equipes ou jogadores e bots.
- Regras de partida.
- Pontuação.
- Vitória e derrota.
- Reinício confiável.

**Fase 5 — Multiplayer**
- Replicação.
- Sessões.
- Sincronização.
- Autoridade do servidor.
- Testes de latência.
- Reconexão e encerramento.

**Fase 6 — Conteúdo**
- Mais armas.
- Mais personagens.
- Mais mapas.
- Mais modos.
- Veículos.
- Destruição seletiva.
- Cooperativo e progressão.

**Fase 7 — Apresentação AAA**
- Animações finais.
- Materiais e iluminação.
- Áudio espacial.
- Efeitos ambientais.
- Menus finais.
- Personalização.
- Polimento visual.

**Fase 8 — Otimização e validação**
- Corrigir falhas.
- Medir desempenho.
- Testar configurações.
- Corrigir problemas de interface.
- Validar multiplayer.
- Documentar limitações e pendências.

A ordem pode ser ajustada quando uma dependência técnica exigir, mas não pule a validação dos sistemas fundamentais.

## 29. DIRETRIZES DE IMPLEMENTAÇÃO PARA A IA

Trabalhe diretamente nos arquivos reais do projeto sempre que o ambiente permitir.

Antes de modificar arquivos:

1. Inspecione a estrutura.
2. Identifique os pontos de entrada.
3. Localize sistemas já existentes.
4. Planeje alterações compatíveis.
5. Evite duplicar funcionalidades.
6. Preserve o que já funciona.

Após cada conjunto de alterações:

1. Compile ou execute o projeto quando possível.
2. Analise os erros.
3. Corrija regressões.
4. Execute os testes disponíveis.
5. Atualize a documentação.
6. Informe o estado real da implementação.

Se um recurso for grande demais para uma única etapa, construa primeiro uma versão mínima funcional e depois expanda. Não substitua a implementação por uma descrição do que deveria existir.

Não pare depois de criar um plano. Comece implementando a primeira etapa que possa ser concluída e validada no ambiente disponível.

## 30. CRITÉRIOS DE ACEITAÇÃO

Uma funcionalidade só será considerada concluída quando:

- Estiver implementada no projeto.
- Estiver conectada aos sistemas relevantes.
- Puder ser utilizada por meio da interface ou dos controles.
- Apresentar resultados coerentes.
- Não quebrar funcionalidades existentes.
- Passar pelos testes pertinentes.
- Tiver suas dependências documentadas.

Classifique os recursos como:

- Implementado e testado.
- Implementado, mas não testado.
- Parcialmente implementado.
- Bloqueado por dependência.
- Ainda não implementado.

Nunca confunda essas categorias.

## 31. PRIMEIRA ENTREGA

Comece analisando o ambiente e identificando a tecnologia real.

Depois, apresente um diagnóstico técnico curto, contendo:

- Tecnologia identificada ou escolhida.
- Estado atual do projeto.
- Sistemas existentes que podem ser aproveitados.
- Dependências necessárias.
- Principais riscos técnicos.
- Primeira etapa de implementação.

Em seguida, implemente a primeira versão jogável, com:

- Personagem em primeira pessoa.
- Movimentação funcional.
- Câmera responsiva.
- Uma arma 3D com disparo e recarga.
- Munição e dano reais.
- Um inimigo funcional.
- Uma arena 3D original.
- HUD conectado ao gameplay.
- Sons de disparo, recarga e impacto.
- Tela de pausa.
- Configurações básicas de sensibilidade, áudio e gráficos.
- Condição de vitória ou derrota e opção de reiniciar.

Essa primeira versão precisa ser realmente executável e jogável. Não finja que todos os modos, armas ou recursos online já estão prontos.

Depois de validar essa base, continue expandindo o projeto em etapas até construir o FPS completo.

**OBJETIVO FINAL:** um FPS original com qualidade visual elevada, movimentação refinada, combate consistente, arsenal profundo, ambientes imersivos, IA convincente, menus profissionais, personalização ampla e infraestrutura preparada para partidas online. Priorize sistemas que funcionem juntos em vez de uma enorme quantidade de recursos desconectados.