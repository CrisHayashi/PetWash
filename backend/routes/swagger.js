// Importa as bibliotecas necessárias
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuração do Swagger (OpenAPI 3.0)
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API PetShop', // Nome amigável para a documentação
      version: '1.0.0',
      description: 'Documentação completa da API REST do sistema de PetShop',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Pode ser alterado para URL de produção
        description: 'Servidor Local',
      },
    ],
    components: {
      securitySchemes: {
        // Define o esquema de autenticação JWT
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Aplica o JWT como segurança padrão em todas as rotas
      },
    ],
  },
  // Aponta para os arquivos de rotas contendo os comentários Swagger (JSDoc)
  apis: ['./routes/*.js'],
};

// Gera o objeto de especificação
const swaggerSpec = swaggerJsdoc(options);

// Exporta os middlewares do Swagger
module.exports = {
  swaggerUi,      // Interface visual (swagger-ui-express)
  swaggerSpec     // Especificação gerada a partir dos comentários
};