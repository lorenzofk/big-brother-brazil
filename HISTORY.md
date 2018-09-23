## Proposta de Solução

A **stack** utilizada para resolução do desafio proposto foi a seguinte:

+ **NodeJS**
+ **Express**
+ **MongoDB**
+ **Mocha + Chai**

Embora nunca houvesse trabalhado com esta **stack** decidi utilizá-la pelos requisitos solicitados no projeto.

Pela necessidade de explorar a escalabilidade e performance da aplicação, optei por desenvolver o back-end com **NodeJS** pelo fato dele utilizar operações de entrada e saída (I/O) assíncronas e não bloqueantes.

Acredito que juntamente com o **NodeJS** o **MongoDB** seja uma boa solução para armazenamentos dos dados devido ao grande fluxo de requisições (alta carga de escrita) que a aplicação receberá.

Utilizei **Mocha** e **Chai** para realizar a escrita e automatização de testes unitários e testes de aceitação.

O framework **Express** foi utilizado para desenvolver de maneira rápida a estrutura da aplicação web e da **API** do sistema.

### Arquitetura e organização do projeto

A aplicação foi dividida em camadas com responsabilidades específicas. 

Implementei baseado no padrão **MVC** e utilizei o padrão **Repositório** para exposição dos métodos que manipulam os objetos que representam o dado em si.

O desenvolvimento da inferface web (**views**) foi realizado com **HTML + CSS + JS** e auxiliado pela **engine** de template chamada **EJS** (Embedded JavaScript Template).

O **schema** definido para os documentos que serão persistidos na base de dados são simples.

```
   {
      "name": "Nome do paredão",
      "isOpen": "Flag que define o status do paredão"
      "startsAt": "Data de início do paredão",
      "endsAt": "Data do término do paredão",
      "totalOfVotes": "Total de votos acumulado",
      "participants: [
          {
            "name": "Nome do participante,
            "totalOfVotes": "Total de votos",
            "votes": [
                "createdAt": "Hora do voto"
            ]
          }
      ]
   }
```

Interessante comentar que este modelo foi melhorado no desenvolvimento da solução.

Inicialmente eu estava realizando todas as consultas com agregações em cima dos sub-documentos do **schema**. Não era performático pois a medida que o  documento ia crescendo o custo para retornar a informação ia crescendo também.

A decisão final foi criar o campo `totalOfVotes` dentro do documento principal e no sub-documento `participants`. Este campo é incrementado sempre que há um voto computado no sistema e torna muito mais eficiente as consultas posteriores. 


### Testes Realizados

Os testes unitários e de aceitação estão localizados no diretório **/test** e podem ser executados seguindo as instruções contidas no arquivo **INSTALL.md**.

Os testes de carga foram realizados em uma plataforma em nuvem chamado **Heroku**. 

Utilizei o **loader.io** para configurar e executar estes testes. Nas imagens abaixo estão 3 exemplos executados na aplicação.

Os três testes simulados foram executados durante um período de **30** segundos.

![400 votos/seg](/public/img/logo.png "400 votos/seg")

O primeiro teste foi simulado com **400** clientes votando por segundo. Todos os votos foram computados com sucesso e não houve erros na execução.

![500 votos/seg](/public/img/logo.png "500 votos/seg")

No segundo teste foi simulado um total de **500** clientes simultâneos realizando votos a cada segundo. 

Embora todos os votos tenham sido computados corretamente, foi possível observar que o tempo de resposta aumentou bastante comparado ao primeiro teste.

![1000 votos/seg](/public/img/logo.png "1000 votos/seg")

O terceiro teste não foi tão performático quanto o esperado. Foram simulados ***1000*** clientes votando a cada segundo.

Houveram algumas falhas na computação de votos devido ao tempo limite de espera que especifiquei na configuração do teste.

### Deploy

O deploy que eu realizei foi utilizando o **Heroku Client**. Após ter uma conta configurada na plataforma e o **client** instalado basta realizar os seguintes passos:

+ `heroku login (realizar o login)`
+ `heroku create nome-aplicacao`
+ `git push heroku master (supondo que exista um repositório **git** configurado)`

Após o build ser concluído execute o seguinte comando para realizar a criação inicial da base de dados e popular o paredão inicial.

`heroku run cd database & migrate-mongo up`

### Melhorias
Docker
GoLang?
Cache
### URLS + LIVE