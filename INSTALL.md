## Instalação/Configuração
Esta aplicação foi desenvolvida com **NodeJS + MongoDB**, portanto algumas configurações são necessárias para que a aplicação seja inicializada.

Os scripts que serão executados posteriormente estão prevendo uma máquina com o sistema operacional **Linux**.

### Configuração Inicial

Antes de realizar a execução dos scripts, torne-os executáveis.
```
 sudo chmod +x configure.sh start.sh 
```

O primeiro passo é executar o script `configure.sh` para que as dependências necessárias sejam instaladas na máquina.

```
 ./configure.sh
```

Após a máquina possuir os requisitos iniciais, é necessário **preencher** o arquivo `.env` localizado na **raíz** do projeto. Este arquivo é utilizado pela aplicação e tem como objetivo organizar as variáveis de ambiente.

Os valores presentes neste arquivo podem ser utilizados para rodar a aplicação **localmente**. Eu utilizei estas configurações ao longo do desenvolvimento.

### Instalação da aplicação e suas dependências

Para instalar as dependências do **NodeJS** e deixar a aplicação pronta para ser utilizada, basta executar o script `start.sh`.

```
 ./start.sh
```

Este script também realiza a criação da base de dados através de uma **migration** e realiza a inserção de um **paredão** inicial com dois candidatos para facilitar a visualização/utilização.

### Inicialização da aplicação

Para inicializar o servidor basta digitar o seguinte comando:

```
  node app.js
```

ou caso deseje inicializar em modo de desenvolvimento, basta executar o comando:

```
  npm run dev
```

### Testes

Os testes unitários/comportamentais se encontram na pasta **/tests/** e podem ser executados facilmente através do comando:

```
 npm test
```
