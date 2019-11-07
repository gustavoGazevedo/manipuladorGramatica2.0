/* Autor: Gustavo Azevedo */

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

//teste para descobrir o tipo de gramática
// globais
let [gr, glc, gsc, gi] = new Array(4).fill(true);
let novaProducao = {};
setLenght();
let producaoNome = '';
let prod = ''
let linhas = [];
let esquerda = [];
let direita = [];
let dirSimbolo = [];
let inicio = '';
let somenteTransGLC = true;
let somenteTabular = true;


//padrão para testes
window.onload = () => {
  $('#nter').val('ASDBCFTE');
  setNT('ASDBCFTE');
  $('#ter').val('asd');
  $('#terEX').val('asd120()*+i');
  setTerEX('asd120()*+i');

  /* let G =
`S > A B
B > 1 A B | &
A > F C
C > 2 F C | &
F > a S s | d`; */

/*   let G =
`S > A B
B > + A B | &
A > F C
C > * F C | &
F > ( S ) | id`; */

  let G = `E > T E'
E' > + T E' | &
T > F T'
T' > * F T' | &
F > ( E ) | id`;

  $('#prod').val(G);
  $('#si').val('E');

  setProd(G);
};

//Esses sets pegam os dados escritos nas caixas a esquerda, processam eles,
//e escrevem a gramática na caixa da direita
function setNT(nter) {
  let aux = '';
  let aws = nter.split('');
  for (let key in aws) {
    key = aws[key];
    if (/[A-Z]/g.test(key)) {
      aux += key + ', ';
    }
  }
  $('#n1').html(aux.slice(0, -2));
}

function setTer(ter) {
  let aux = '';
  let aws = ter.split('');
  for (let key in aws) {
    key = aws[key];
    if (/[a-z]/g.test(key)) {
      aux += key + ', ';
    }
  }
  $('#t1').html(aux.slice(0, -2));
}

function setSI(si) {
  $('#s1').html(si);
  $('#si').val(si);
}

function setProd(prod) {
  prod = prod.replace(/>/g, '→');
  prod = prod.replace(/&/g, 'ε');
  prod = prod.replace(/(?:\r\n|\r|\n)/g, '<br>');
  $('#p1').html(prod);
}

/* eslint-enable no-unused-vars */

// eslint-disable-next-line no-unused-vars
function runProgram() {
  //esconde os resultados anteriores
  $('#generateSentence').attr('hidden', true);
  $('#generateSentenceHR').attr('hidden', true);
  $('#glcHr').attr('hidden', true);
    $('#glcDiv').attr('hidden', true);
  //teste para descobrir o tipo de gramática
  [gr, glc, gsc, gi] = new Array(4).fill(true);
  //limpa os dados para mais facilmente poder utiliza-los no futuro
  prod = $('#prod').val();
  if (somenteTabular) {
    prod = prod.replace(/ /g, '');
  }
  linhas = prod.split('\n');
  esquerda = [];
  direita = [];
  dirSimbolo = [];
  for (const key of linhas) {
    let aux = key.split('>');
    direita.push(aux[1]);
    esquerda.push(aux[0]);
  }
  for (const key of direita) {
    let aux = key.split('|');
    for (const i of aux) {
      dirSimbolo.push(i);
    }
  }
  //fim da limpa dos dados

  //Procura se possui terminais na esquerda, se sim, não é GR nem GLC
  if (/([a-z])(.*>)/g.test(prod)) {
    gr = false;
    glc = false;
  }

  //Olha o lado esquerdo, se tiver mais de um caractere, não é GR nem GLC
  for (const key in esquerda) {
    for (const iterator of esquerda[key]) {
      if (iterator.length > 1) {
        gr = false;
        glc = false;
      }
    }
  }

  //Procura no lado direito se possui um terminal sozinho ou um terminal seguido de NT,
  //se fugir dessa regra, não é GR.
  //Procura também por vazios, se encontrar, não é GLC nem GSC
  for (const iter of dirSimbolo) {
    for (const key in iter) {
      if (
        /[A-Z]/g.test(iter.charAt(key)) &&
        !/[a-z]/g.test(iter.charAt(key - 1))
      ) {
        gr = false;
      } else if (
        /[a-z]/g.test(iter.charAt(key)) &&
        iter.charAt(key + 1) == '' &&
        iter.charAt(key - 1) != ''
      ) {
        gr = false;
      }
    }
    if (iter.includes('&')) {
      glc = false;
      gsc = false;
    }
  }

  //testa se o lado esquerdo possui o mesmo tamanho ou menor que o lado direito,
  //se não for, não é GSC
  if (gsc) {
    for (const key of linhas) {
      let [esq, dir] = key.split('>');
      let aux = dir.split('|');
      for (const i of aux) {
        if (i.length < esq.length) {
          gsc = false;
          break;
        }
      }
    }
  }

  //Testa se tem um NT na esquerda, se não tiver, não é uma produção valida
  for (const iterator of esquerda) {
    if (!/[A-Z]/g.test(iterator)) {
      gi = false;
      gsc = false;
      gr = false;
      glc = false;
    }
  }

  //Escreve o resultado na tela
  if (gr) {
    $('#typeGram').html('Gramática Regular');
    $('#typeGram').css('color', '#212529');
    glc = gsc = gi = false;
  } else if (glc) {
    $('#typeGram').html('Gramática Livre de Contexto');
    $('#typeGram').css('color', '#212529');
    gsc = gi = false;
  } else if (gsc) {
    $('#typeGram').html('Gramática Sensível de Contexto');
    $('#typeGram').css('color', '#212529');
    gi = false;
  } else if (gi) {
    $('#typeGram').html('Gramática Irrestrita');
    $('#typeGram').css('color', '#212529');
  } else {
    $('#typeGram').html('Erro: Gramática Inválida');
    $('#typeGram').css('color', 'red');
  }

  // fim teste para o tipo de gramática

  //Inicio da criação da sentença
  //Pega o valor inicial
  inicio = $('#si').val();
  let sentenca = inicio;
  let sentencas = '';
  if (somenteTransGLC && somenteTabular) {
    $('#generateSentence').attr('hidden', false);
    $('#generateSentenceHR').attr('hidden', false);
    for (const key in linhas) {
      if (esquerda[key] == inicio) {
        //Repete o processo três vezes
        for (let a = 0; a < 3; a++) {
          //Lança a função para criar a sentença com
          //os dados (inicio, opções da direita do inicio, sentença anterior)
          criaSentenca(esquerda[key], direita[key], esquerda[key]);
          sentencas =
            sentencas +
            sentenca.replace(
              /→([^→]+)→?$/g,
              sentenca.substr(sentenca.lastIndexOf('→')).replace(/&/g, '') //retira o vazio no final
            ) +
            '<br>'; //Concatena as sentenças geradas
          sentenca = inicio; //re-inicia o loop
        }
        //escreve na tela a resposta
        sentencas = `Sentenças Geradas = { <br />
          ${sentencas}
          }`;
        $('#sentencaGeradas').html(sentencas);
        break;
      }
    }
  }

  function criaSentenca(nt, t, anterior) {
    let aux = t.split('|');
    let limit = aux.length;
    //Pega uma opção da direita randomicamente e substitui
    let randT = aux[Math.floor(Math.random() * limit)];
    let nova = anterior.replace(nt, randT);
    sentenca = sentenca + ' → ' + nova;
    try {
      //testa se ainda existem NT na sentença, caso existirem,
      //escolha uma randomicamente e repete o processo
      if (/[A-Z]/g.test(nova)) {
        let NT = [];
        for (const key in esquerda) {
          if (nova.includes(esquerda[key])) {
            NT.push(key);
          }
        }
        if (NT.length != 0) {
          let rand = Math.floor(Math.random() * NT.length);
          criaSentenca(esquerda[NT[rand]], direita[NT[rand]], nova);
        } else {
          alert('Erro na produção: Não possui fim');
        }
      }
    } catch (e) {
      alert('Erro na produção: Loop infinito');
    }
  }

  // Automato Finito
  if (gr) {
    //cria a tabela
    $('#tabela').show();
    let tableHead = `<tr><th scope="col">#</th>`;
    let tableBody = `<tr>`;
    //pega o alfabeto
    let alfabeto = new Set(dirSimbolo);
    for (const i of alfabeto) {
      tableHead += `<th scope="col">${i}</th>`;
    }
    for (const i of linhas) {
      tableBody += `<th class="tableRow" scope="row">${i.split('>')[0]}</th>`;
      for (const a of alfabeto) {
        //pega os conjuntos de estados e testa eles contra o alfabeto
        let regex = new RegExp(`\\b${a}\\b`, 'g');
        if (regex.test(i)) {
          if (/[A-Z]/g.test(a)) {
            let aux = a.replace(/[a-z]/g, '').replace(/(?!^)(?!$)/g, '/');
            tableBody += `<td>${aux}</td>`;
          } else {
            tableBody += `<td>ε</td>`;
          }
        } else {
          tableBody += `<td>-</td>`;
        }
      }
      tableBody += `</tr>`;
    }
    tableHead += `</tr>`;
    //escreve na tela
    $('#tableHead').html(tableHead);
    $('#tableBody').html(tableBody);
  } else {
    $('#tabela').hide();
  }

  $('#producoes').html('');
  if ((glc || !somenteTransGLC) && somenteTabular) {
    novaProducao = {};
    setLenght();

    for (const key of linhas) {
      let aux = key.split('>');
      let aws = aux[1].split('|');
      let dirAux = [];
      for (const i of aws) {
        dirAux.push(i);
      }
      novaProducao[Object.keys(novaProducao).length] = {
        direita: dirAux,
        esquerda: aux[0]
      };
    }
    
    producaoNome = "P";
    escreveNovaProd();

    $('#glcHr').attr('hidden', false);
    $('#glcDiv').attr('hidden', false);
  }
  if (!somenteTabular) {
    analisadorTabular();
  }
}

function inuteis() {
  //retirando Símbolos inúteis
  for (let index = Object.keys(novaProducao).length - 1; index >= 0; index--) {
    let aux = novaProducao[index];
    let element = aux.esquerda;
    //se for somente um que aponta para si mesmo, retira e limpa dos outros
    if (aux.direita.length == 1 && aux.direita[0].includes(element)) {
      delete novaProducao[index];
      for (const x in novaProducao) {
        let aws = novaProducao[x];
        for (const key in aws.direita) {
          if (aws.direita[key].includes(element)) {
            delete aws.direita[key];
          }
        }
      }
    }
    // se não for o começo e não tiver como entrar nele por outro, retira
    if (element != inicio) {
      let test = true;
      for (const x in novaProducao) {
        let aws = novaProducao[x];
        if (aws.esquerda != element) {
          for (const key in aws.direita) {
            if (aws.direita[key].includes(element)) {
              test = false;
              break;
            }
          }
        }
      }
      if (test) {
        delete novaProducao[index];
      }
    }
  }
  escreveNovaProd();
}

function recurcao() {
  //pega a ultima entrada da produção para pegar o numero de linhas
  let rec = novaProducao[Object.keys(novaProducao).length - 1].esquerda.substring(1) + "'";
  for (const x in novaProducao) {
    let aws = novaProducao[x];
    for (const key in aws.direita) {
      if (aws.esquerda == aws.direita[key].substring(0, 1)) {
        novaProducao[Object.keys(novaProducao).length] = {
          esquerda: `${aws.esquerda + rec}`,
          direita: [
            aws.direita[key].substring(1),
            aws.direita[key].substring(1) + `${aws.esquerda + rec}`
          ]
        };
        delete aws.direita[key];
        for (const y in aws.direita) {
          aws.direita[y] = aws.direita[y] + `${aws.esquerda + rec}`;
        }
        rec += "'";
      }
    }
  }
  escreveNovaProd();
}

function eLivre() {
  //realizando e-livre
  for (const x in novaProducao) {
    let aws = novaProducao[x];
    for (const key in aws.direita) {
      if (aws.direita[key].includes('&')) {
        delete aws.direita[key];
        let regex = new RegExp(`\\b${aws.esquerda}\\b`, 'g');
        for (const y in aws.direita) {
          aws.direita.push(aws.direita[y].replace(regex, ''));
        }
        for (const y in novaProducao) {
          if (!aws.esquerda == novaProducao[y].esquerda) {
            for (const a in novaProducao[y].direita) {
              if (novaProducao[y].direita[a].includes(aws.esquerda)) {
                novaProducao[y].direita.push(
                  novaProducao[y].direita[a].replace(regex, '')
                );
              }
            }
          }
        }
      }
    }
  }
  escreveNovaProd();
}

function unitarios() {
  //substitui unitarios pela produção dele
  for (let index = Object.keys(novaProducao).length - 1; index >= 0; index--) {
    let aux = novaProducao[index];
    for (const key in aux.direita) {
      if (/^[A-Z]$/g.test(aux.direita[key])) {
        let aws = aux.direita[key];
        delete aux.direita[key];
        for (const x in novaProducao) {
          if (novaProducao[x].esquerda == aws) {
            for (const y in novaProducao[x].direita) {
              aux.direita.push(novaProducao[x].direita[y]);
            }
          }
        }
      }
    }
  }
  escreveNovaProd();
}

function fatoracao() {
  //testa se necessita refatoração, se precisar, cria uma nova produção e substitue na antiga
  let rec = novaProducao[Object.keys(novaProducao).length - 1].esquerda.substring(1) + "'";
  for (const x in novaProducao) {
    let aws = novaProducao[x];
    let aux2 = [];
    for (const key in aws.direita) {
      for (const y in aws.direita) {
        if (key != y) {
          if (aws.direita[key].length < 2) {
            test = aws.direita[key];
            if (test == aws.direita[y].replace(/[A-Z]/g, '')) {
              let aux = [];
              for (const a in aws.direita) {
                if (y != a) {
                  if (!aws.direita[a].includes("'")) {
                    if (test == aws.direita[a].replace(/[A-Z]/g, '')) {
                      aux.push(aws.direita[a].replace(/[a-z]/g, ''));
                      aux.push(aws.direita[y].replace(/[a-z]/g, ''));
                      aws.direita[y] = aws.direita[y].replace(
                        /[A-Z]/g,
                        `${aws.esquerda + rec}`
                      );

                      aux2.push(key);
                    }
                  }
                }
              }
              aux = aux.filter(Boolean);
              if (aux.length == 1) {
                aux.push('&');
              }
              if (aux.length != 0) {
                novaProducao[Object.keys(novaProducao).length] = {
                  esquerda: `${aws.esquerda + rec}`,
                  direita: aux
                };
                rec += "'";
              }
            }
          } else if (/[A-Z]/g.test(aws.direita[key])) {
            if (
              aws.direita[y].replace(/[A-Z]/g, '%%') ==
              aws.direita[key].replace(/[A-Z]/g, '%%')
            ) {
              let aux = [];
              for (const a in aws.direita) {
                if (y != a) {
                  if (!aws.direita[a].includes("'")) {
                    if (
                      aws.direita[y].replace(/[A-Z]/g, '%%') ==
                      aws.direita[a].replace(/[A-Z]/g, '%%')
                    ) {
                      aux.push(aws.direita[a].replace(/[a-z]/g, ''));
                      aux.push(aws.direita[y].replace(/[a-z]/g, ''));
                      aws.direita[a] = aws.direita[a].replace(
                        /[A-Z]/g,
                        `${aws.esquerda + rec}`
                      );
                      aws.direita[y] = aws.direita[y].replace(
                        /[A-Z]/g,
                        `${aws.esquerda + rec}`
                      );

                      aux2.push(key);
                    }
                  }
                }
              }
              aux = aux.filter(Boolean); //retira vazios
              if (aux.length == 1) {
                aux.push('&');
              }
              if (aux.length != 0) {
                novaProducao[Object.keys(novaProducao).length] = {
                  esquerda: `${aws.esquerda + rec}`,
                  direita: aux
                };
                rec += "'";
              }
            }
          }
        }
      }
    }
    for (const t of aux2) {
      delete aws.direita[t];
      aws.direita = aws.direita.filter(Boolean);
    }
  }
  escreveNovaProd();
}

function escreveNovaProd() {
  let test = [];
  for (const x in novaProducao) {
    let aws = novaProducao[x].esquerda + '>' + novaProducao[x].direita.join();
    if (!test.includes(aws)) {
      test.push(novaProducao[x].esquerda + '>' + novaProducao[x].direita.join());
    } else {
      delete novaProducao[x];
    }
  }
  let text = '';
  for (const element in novaProducao) {
    text += novaProducao[element].esquerda + ' > ';
    novaProducao[element].direita = novaProducao[element].direita.filter(Boolean);
    novaProducao[element].direita = [...new Set(novaProducao[element].direita.map(item => item))]
    for (const key in novaProducao[element].direita) {
      if (key < novaProducao[element].direita.length - 1) {
        text += novaProducao[element].direita[key] + ' | ';
      } else {
        text += novaProducao[element].direita[key];
      }
    }
    text += '<br />';
  }
  text = `<p class="resultGramaticas transformaGlc">
        ${producaoNome} = { <br />
        ${text}
        }
        </p>`;
  producaoNome += "'";
  text = text.replace(/&/g , 'ε');
  $('#producoes').append(text);
}

function setLenght() {
  Object.defineProperty(novaProducao, 'lenght', {
    enumerable: false, // não enumerável
    get: function countProperties() {
      var count = 0;
      var obj = novaProducao;
      for (var property in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, property)) {
          count++;
        }
      }
      return count;
    }
  });
}


// novo código cadeira de compiladores

// globais novas
let first = [],
    follow = [],
    linhasGram = [],
    analisadorTabela = [],
    terminaisUsadas = [];

function analisadorTabular() {
  //func que faz/chama toda a nova parte
  $('#tabelaHr').attr('hidden', false);
  $('#tabelaDiv').attr('hidden', false);
  //reseta os valores
  first = [];
  follow = [];
  linhasGram = [];
  linhasGram = [];
  analisadorTabela = [];
  terminaisUsadas = [];
  firstAndFollow();
  construirTabelaPreditiva();
}

function somenteTabularFunc() {
  //função para mudar o text input para o que aceita números e etc
  somenteTabular = !somenteTabular;
  if (somenteTabular) {
    $('#ter').attr('hidden', false);
    $('#terEX').attr('hidden', true);
  } else {
    $('#ter').attr('hidden', true);
    $('#terEX').attr('hidden', false);
  }
}

function setTerEX(ter) {
  // função que escreve na tela as terminais escritas
  let aux = '';
  let aws = ter.split('');
  for (let key in aws) {
    key = aws[key];
    if (/[A-Z]/g.test(key)) {
      // testa se é maiusculo, se sim muda para minusculo e substitui no input
      let regex = new RegExp(`${key}`, 'g');
      key = key.toLowerCase();
      ter = ter.replace(regex, key);
    }
    if (/[a-z1-9-+*()\[\]\/'´`"]/g.test(key)) {
      aux += key + ', ';
    }
  }
  $('#t1').html(aux.slice(0, -2));
  return ter;
}

function firstAndFollow() {
  //separa as linhas para poder trabalhar nelas
  for (const i of linhas) {
    let aux = i.split('>');
    let dir = [];
    for (const a of aux[1].split('|')) {
      let aws = [];
      for (const s of a.split(' ')) {
        if (s != '') {
          aws.push(s);
        }
      }
      dir.push(aws);
    }
    linhasGram.push({
      esquerda: aux[0].replace(/ /g, ''),
      direita: dir
    });
  }
  /* 
  -- linhasGram --
  G = {
    S > A D
    A > 1 S | &
    D > 2 A | 2
  }
  Array(3)
    0: {esquerda: "S", direita: Array(1)}
    1: {esquerda: "A", direita: Array(2)}
    2:
      direita: Array(2)
        0: Array(2)
          0: "2"
          1: "A"
        1: Array(1)
          0: "2"
      esquerda: "D"
 */
  //encontra o first
  for (const lin of linhasGram) {
    if (!/[A-Z]/g.test(lin.direita[0][0])) {
      first.push({
        esquerda: lin.esquerda,
        direita: lin.direita,
        first: []
      });
      //regra 1, procura por todos os que começam com terminais
      for (const i of lin.direita) {
        if (
          !/[A-Z]/g.test(i[0]) &&
          !first[first.length - 1].first.includes(i[0])
        ) {
          first[first.length - 1].first.push(i[0]);
        }
      }
    } else {
      first.push({
        esquerda: lin.esquerda,
        direita: lin.direita,
        first: []
      });
    }
  }
  // regra 2, decrescente, substitui as terminais pelo first necessários
  for (let i = first.length - 1; i >= 0; i--) {
    if (first[i].first.length == 0) {
      for (const a of first) {
        if (a.esquerda == first[i].direita[0][0]) {
          first[i].first = a.first;
        }
      }
    }
  }

  // follow
  //regra 1, add $ para o inicial e cria os outros follows
  for (const lin of linhasGram) {
    if (lin.esquerda == inicio) {
      follow.push({
        esquerda: lin.esquerda,
        direita: lin.direita,
        follow: ['$']
      });
    } else {
      follow.push({
        esquerda: lin.esquerda,
        direita: lin.direita,
        follow: []
      });
    }
  }
  //regra 2 e 3
  for (const lin in follow) {
    for (const aws of follow) {
      for (const a in aws.direita) {
        if (aws.direita[a][1] == follow[lin].esquerda) {
          //regra 2, se tiver 3 char e não for NT, add para o follow, se não add o first do NT para o follow menos o vazio
          if (aws.direita[a].length == 3) {
            if (!/[A-Z]/g.test(aws.direita[a][2])) {
              follow[lin].follow.push(aws.direita[a][2]);
            } else {
              for (const b of first) {
                if (b.esquerda == aws.direita[a][2]) {
                  follow[lin].follow.push(...b.first);
                  follow[lin].follow = follow[lin].follow.filter(
                    e => e !== '&'
                  );
                }
                //regra 3 se length == 3, se o first da NT possuir vazio, add o follow do NT para o follow
                if (b.first.includes('&')) {
                  if (aws.follow.length > 0) {
                    follow[lin].follow.push(...aws.follow);
                  } else {
                    follow[lin].follow.push(`FOLLOW(${aws.esquerda})`);
                  }
                }
              }
            }
          }
          // regra 3, add o follow do NT para o follow
          if (aws.direita[a].length == 2) {
            if (aws.follow.length > 0) {
              follow[lin].follow.push(...aws.follow);
            } else {
              follow[lin].follow.push(`FOLLOW(${aws.esquerda})`);
            }
          }
        }
      }
    }
  }
  //elimina possíveis duplicatas
  for (const aws of follow) {
    aws.follow = [...new Set(aws.follow)];
  }
  for (const aws of first) {
    aws.first = [...new Set(aws.first)];
  }

  // desenha ma tela
  let tableBody = `<tr>`;
  for (const i in first) {
    tableBody += `<th class="tableRow" scope="row">${first[i].esquerda}</th>`;
    let a = 0;
    if (a == 0) {
      tableBody += `<td>${first[i].first.join(', ')}`;
      a = first[i].first.length - 1;
    } else {
      tableBody += `${first[i].first[a]}</td>`;
    }

    a = 0;
    if (a == 0) {
      tableBody += `<td>${follow[i].follow.join(', ')}`;
      a = first[i].first.length - 1;
    } else {
      tableBody += `${follow[i].follow[a]}</td>`;
    }
    tableBody += `</tr><tr>`;
  }
  //escreve na tela o First Follow
  tableBody = tableBody.replace(/&/g, 'ε');
  $('#tableBodyFF').html(tableBody);
}

function construirTabelaPreditiva() {
  //pega todos os terminais usados menos o vazio
  analisadorTabela = [];
  for (const i in linhasGram) {
    for (const f of first[i].first) {
      terminaisUsadas.push(f);
    }
    for (const f of follow[i].follow) {
      terminaisUsadas.push(f);
    }
  }

  //tira as duplicatas e o vazio
  terminaisUsadas = [... new Set(terminaisUsadas)];
  terminaisUsadas = terminaisUsadas.filter(e => e !== '&');
  
  //construindo tabela
  for (const [x, lin] of linhasGram.entries()) {
    let aux = [];
    // cria uma matriz auxiliar com o nome sendo os terminais
    for (const i of terminaisUsadas) {
      aux[i] = [];
    }
    // se tiver mais de um item a direita, testa para ver se é vazio ou não, se não, add o primeiro ao primeiro first
    // e o segundo ao segundo, se sim add NT -> VAZIO para todos os follows
    // se só tiver um item a direita, testa se é vazio, se for add NT -> VAZIO para todos os follows, se não add
    // a direita para todos os firsts
    if (lin.direita.length > 1) {
      if (lin.direita[1] != '&') {
        let aws = [...first[x].first];
        aws = aws.filter(e => e !== '&');
        aux[aws[0]] = lin.direita[0];
        aux[aws[1]] = lin.direita[1];
      } else {
        let aws = [...first[x].first];
        aws = aws.filter(e => e !== '&');
        aux[aws[0]] = lin.direita[0];
        aws = [...follow[x].follow];
        for (const i of aws) {
          aux[i] = lin.direita[1];
        }
      }
    } else {
      if (lin.direita[0] != '&') {
        let aws = [...first[x].first];
        aws = aws.filter(e => e !== '&');
        for (const i of aws) {
          aux[i] = lin.direita[0];
        }
      } else {
        let aws = [...follow[x].follow];
        for (const i of aws) {
          aux[i] = lin.direita[1];
        }
      }
    }
    analisadorTabela.push({
      esquerda: lin.esquerda,
      tabela: aux
    })
  }

  /* 
  analisadorTabela = 
  0: {esquerda: "S", tabela: Array(2)}
  1:
    esquerda: "B"
      tabela: Array(0)
        $: ["&"]
        (: []
        ): ["&"]
        *: []
        +: (3) ["+", "T", "E'"]
        id: []
  2: {esquerda: "A", tabela: Array(2)}
  3: {esquerda: "C", tabela: Array(4)}  
  4: {esquerda: "F", tabela: Array(2)}
  */

  //desenha tabela  
  let tabHead = `<tr><th scope="col">NT Entrada</th>`;
  for (const ter of terminaisUsadas) {
    tabHead += `<th scope="col" style="width:">${ter}</th>`;
  }
  $("#tableHeadTA").html(tabHead);

  let tableBody = `<tr>`;
  for (const i in analisadorTabela) {
    tableBody += `<th class="tableRow" scope="row">${analisadorTabela[i].esquerda}</th>`;
    for (const a of terminaisUsadas) {
      if (analisadorTabela[i].tabela[a].length > 0) {
        tableBody += `<td style="padding-right: 25px; padding-left: 25px">${
          analisadorTabela[i].esquerda
        } → ${analisadorTabela[i].tabela[a].join('')}</td>`;
      } else {
        tableBody += `<td style="padding-right: 25px; padding-left: 25px"></td>`;
      }
    }
    tableBody += `</tr><tr>`;
  }
  //escreve na tela
  tableBody = tableBody.replace(/&/g, 'ε');
  $('#tableBodyTA').html(tableBody);
}

function runEntrada() {
  let entrada = $('#entrada').val();
  entrada = entrada.split(' ');
  entrada.push('$');
  let pilha = ['$', inicio];
  let tabelaEntrada = [];
  tabelaEntrada.push({
    pilha: pilha.join(''),
    entrada: entrada.join(''),
    saida: ''
  });
  // enquanto a pilha não chegar no final, faz um pop da pilha e pega o primeiro da fila, se o primeiro da fila for o mesmo
  // que o da pilha, le aquele item, e retira ele da fila
  while (pilha[pilha.length - 1] != '$') {
    let popPile = pilha.pop(),
      shiftQueue = entrada[0],
      saida = '';
    if (popPile == shiftQueue) {
      tabelaEntrada.push({
        pilha: pilha.join(''),
        entrada: entrada.join(''),
        saida: `lê ${shiftQueue}`
      });
      entrada.shift();
      popPile = pilha.pop();
      shiftQueue = entrada[0];
    }
    // testa por todos os itens da tabela procurando pelo NT correspondente, se achar, add para a pilha e add a saida 
    for (const i of analisadorTabela) {
      if (i.esquerda == popPile && i.tabela[shiftQueue].length > 0) {
        saida = `${i.esquerda} > ${i.tabela[shiftQueue].join('')}`;
        for (let index = i.tabela[shiftQueue].length - 1; index >= 0; index--) {
          pilha.push(i.tabela[shiftQueue][index]);
        }
      }
    }
    tabelaEntrada.push({
      pilha: pilha.join(''),
      entrada: entrada.join(''),
      saida: saida
    });
  }
  // desenha a tabela
  let tableBody = `<tr>`;
  let style = 'style="padding-right: 100px; padding-left: 100px"'
  for (const i in tabelaEntrada) {
    tableBody += `<td class="tableRow" scope="row">${i}</td>`;
    tableBody += `<td class="tableRow" ${style} scope="row">${tabelaEntrada[i].pilha}</td>`;
    tableBody += `<td class="tableRow" ${style} scope="row">${tabelaEntrada[i].entrada}</td>`;
    tableBody += `<td class="tableRow" ${style} scope="row">${tabelaEntrada[i].saida.replace(/>/g, '→')}</td>`;
    tableBody += `</tr><tr>`;
  }
  //escreve na tela
  tableBody = tableBody.replace(/&/g, 'ε');
  $('#tableBodyATB').html(tableBody);
  $('#tabelaFinal').attr('hidden', false);
}