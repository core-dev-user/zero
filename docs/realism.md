# Entrega incremental de imersão

A tecnologia continua sendo Three.js/Vite. Foram preservados o OBJ do revólver, os cinco equipamentos, munição/cadência/dano configurados e o arsenal gratuito por B. Não foram adicionados assets comerciais nem gravações externas.

## Implementação

- **Revólver e mãos:** as faces do OBJ foram preservadas e separadas em armação, empunhadura e região do tambor para permitir abertura lateral. Mãos segmentadas acompanham a empunhadura e o apoio na recarga. Um carregador de munições mostra somente o número de cartuchos que a reserva permite transferir. O tambor fecha quando a recarga termina; a lógica de transferência continua sendo a original.
- **Outras armas:** carregadores deslocam-se durante a recarga; a escopeta apresenta cartuchos em ciclos proporcionais à quantidade faltante. Essas animações são procedurais e não substituem rigs/animações de produção.
- **Superfícies e luz:** mapas originais gerados por código para concreto, tecido e metal; materiais com rugosidade e relevo; ambiente de reflexão leve, sombras e detalhes industriais. Sem alegação de uso de HDRI real ou textura fotográfica. A textura PNG original do revólver continua faltando.
- **Arena:** sinalização, estruturas acima da circulação e faixas de advertência. Uma cobertura baixa na lateral oeste permite passagem agachada; o jogador não consegue entrar em pé, levantar ou saltar sem espaço. A geometria nova tem representação na colisão/oclusão.
- **Movimento e câmera:** aceleração e frenagem exponenciais dependentes do tempo, suavização de altura da câmera e recuperação do recuo sem alterar permanentemente a direção de mira. A configuração de balanço continua disponível.
- **Personagens:** pivôs de osso para braços/pernas em um rig segmentado, passada dirigida por deslocamento efetivo, reação ao dano, recuo ao disparar e queda progressiva. Não é um humano escaneado nem um SkinnedMesh com deformação de pele/roupa ou IK.
- **IA:** 12 tiros e reserva de 48 por inimigo, recarga finita, reação que interrompe disparos e seleção de posições de cobertura ocultas da ameaça observada. Patrulha, investigação e busca foram preservadas. Não há coordenação de esquadrão ou cobertura perfeita em qualquer geometria.
- **Áudio:** sons sintetizados originais com perfis de disparo por arma, passos e eventos de recarga/impacto. Eventos de inimigos usam PannerNode/HRTF, distância e abafamento simples por oclusão. A percepção acústica ainda precisa de avaliação humana com fones; não há gravações de produção ou simulação acústica de salas.
- **Recursos:** geometrias antigas dos inimigos são liberadas no reinício. Detalhes estáticos são agrupados por material sem unir pivôs animados nem volumes de acerto. Mãos compartilham geometria de base; ruído de áudio é reutilizado. Modelos do arsenal continuam sendo criados sob demanda e mantidos em cache.

## Validação

`npm test` valida regras originais e adicionais: fases de recarga, aceleração independente da frequência, teto baixo, reserva da IA, posições de cobertura, agrupamento e liberação de geometria. `npm run build` valida a produção. O teste no Chromium exercita startup WebGL, dano real por raycast, abertura/fechamento do tambor, recarga e munição, persistência, movimento/salto, pausa e as cinco armas no arsenal.

Foram aprovados 19 testes de regras e a compilação de produção. A validação completa no Chromium passou após as etapas de apresentação e otimização.

Na amostra antes/depois do agrupamento e liberação de geometrias, as chamadas de desenho passaram de 270 para 150; os triângulos permaneceram em 16.927 e as geometrias registradas passaram de 736 para 263. A posição de câmera e a qualidade foram as mesmas; os inimigos possuem variação de patrulha. Esses valores não são um benchmark de FPS nem de memória em bytes.

A avaliação usa Chromium headless com SwiftShader, viewport 1280 × 800 e qualidade baixa. Os contadores de renderização são amostras de uma cena, não medição de FPS em GPU de jogador. Não foi estabelecido benchmark comparável de CPU/GPU nem meta de FPS validada em hardware real. A compilação ainda avisa sobre o tamanho do bundle; isso não impede gerar a aplicação.

## Assets e trabalho ainda necessários

1. `src/assets/pistol.png`: atlas original referenciado pelo modelo para reproduzir exatamente sua aparência. Os materiais atuais são uma alternativa procedural.
2. Um modelo humano com rig, pesos de pele, texturas PBR e animações licenciadas de locomoção/combate, além de mãos com rig de produção. Os ossos e modelos segmentados atuais são uma etapa intermediária.
3. Sons próprios gravados ou licenciados para cada arma, manipulação e ambiente, e validação de mixagem/oclusão com fones.
4. Animações refinadas de mecanismos, contato de mãos por IK, múltiplos apoios e navegação em interiores mais complexos.
5. Profiling de CPU/GPU e memória em hardware de referência, depois LOD, streaming e testes de carga proporcionais aos assets finais. A passagem agachada e percepção usam representação simplificada de colisão; não são uma física geral para qualquer mapa.

Multiplayer, progressão, veículos e arte AAA final continuam fora desta entrega. Funcionalidades futuras não foram apresentadas como concluídas.
