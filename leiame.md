# use o "npm install" para instalar todas as dependências necessárias

# para levantar o servidor, execute o comando "npm run start" ou "npm run dev"
# npm run dev é para rodar o servidor em modo desenvolvimento, junto com o nodemon

# após levantar o servidor, encaminhe a porta 5000 na aba 'portas' ou 'ports' do vscode, deixe a porta como pública

# para usar o banco de dados sqlite, primeiro instale o sqlite3
# npm install sqlite3

# para visualizar o banco de dados sqlite dentro do do vscode, instale a extensão sqlite viewer
# Vá em Extensões
# Busque por: SQLite Viewer

# para fazer uma consulta no banco de dados, use o comando "sqlite3 database.sqlite" no terminal
# isso irá abrir o banco direto no terminal, exemplo de consulta: SELECT * FROM tutors;
# o resultado da consulta será exibido no terminal do sqlite
# para fechar o terminal do sqlite, use o comando CTRL+C ou .exit

# para executar uma série de consultas, use o comando ".read consultas.sql" no terminal do sqlite
# ou use o comando "sqlite3 database.sqlite < consultas.sql"

# o arquivo "consultas.sql" deve conter as consultas em ordem, para executar várias consultas, use o comando ";" para separar cada consulta

# ##############
# para o primeiro commit, use o comando "git init"
# verifique o email com o comando "git config --global user.email" < seu email
# verifique o nome com o comando "git config --global user.name" < seu nome
# adicione o projeto com o comando "git remote add origin https://github.com/usuario/repositorio.git" < repositório do projeto no github

# para fazer commits, use o comando "git add nomeDoArquivo" ou "git add ." para adicionar todos os arquivos
# para commitar o arquivo, use o comando "git commit -m "mensagem do commit""
# para enviar o commit para o github, use o comando "git push origin nomeDaBranch"

# para criar uma nova branch, use o comando "git branch nomeDaBranch"
# para mudar de uma branch para outra, use o comando "git checkout nomeDaBranch"
# para mesclar uma branch com a principal, use o comando "git merge nomeDaBranch"

# para subir a mesclagem das branchs, use o comando "git push"

# para recuperar uma branch, use o comando "git checkout nomeDaBranch"
# use o comando "git pull origin nomeDaBranch" para atualizar a branch

# se houver conflitos, use o comando "git reset --hard" para reverter as alterações