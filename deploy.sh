#!/bin/bash

# =================================================================
# CONFIGURAÇÕES DO PROJETO
# =================================================================
IP_EC2="18.175.148.74"
CHAVE_PEM="~/.ssh/newLocalCompass.pem"
USER_EC2="ec2-user"
JAR_NAME="localCompass-0.0.1-SNAPSHOT.jar"

# Caminhos relativos a partir da raiz do projeto
PATH_BACKEND="backend/localCompass"
PATH_FRONTEND="frontend"
PASTA_DIST="dist" # Mude para 'build' se o seu projeto for React antigo

# Cores para o terminal
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}>>> 1. Iniciando Build do Backend (Spring Boot)...${NC}"
cd $PATH_BACKEND
chmod +x mvnw
./mvnw clean package -DskipTests
if [ $? -ne 0 ]; then echo -e "${RED}ERRO: Falha no build do Java!${NC}"; exit 1; fi
cd ../..

echo -e "${CYAN}>>> 2. Iniciando Build do Frontend (Node.js)...${NC}"
cd $PATH_FRONTEND
npm install
npm run build
if [ $? -ne 0 ]; then echo -e "${RED}ERRO: Falha no build do Frontend!${NC}"; exit 1; fi
cd ..

echo -e "${YELLOW}>>> 3. Preparando ambiente no servidor EC2...${NC}"
# Cria pasta temporária e garante que a pasta do Nginx existe
ssh -i $CHAVE_PEM ${USER_EC2}@${IP_EC2} "mkdir -p /home/ec2-user/deploy_temp"

echo -e "${CYAN}>>> 4. Enviando ficheiros via SCP...${NC}"
# Enviar o JAR gerado
scp -i $CHAVE_PEM ./${PATH_BACKEND}/target/$JAR_NAME ${USER_EC2}@${IP_EC2}:/home/ec2-user/deploy_temp/

# Enviar o conteúdo da pasta de build do frontend
scp -i $CHAVE_PEM -r ./${PATH_FRONTEND}/$PASTA_DIST/* ${USER_EC2}@${IP_EC2}:/home/ec2-user/deploy_temp/

echo -e "${GREEN}>>> 5. Executando comandos de deploy no servidor...${NC}"
ssh -i $CHAVE_PEM ${USER_EC2}@${IP_EC2} << EOF
    # Parar a versão anterior da app (se existir)
    sudo pkill -f '$JAR_NAME' || true
    
    # Atualizar o Frontend na pasta do Nginx
    sudo mkdir -p /var/www/html/localcompass
    sudo rm -rf /var/www/html/localcompass/*
    sudo cp -r /home/ec2-user/deploy_temp/* /var/www/html/localcompass/
    
    # Remover ficheiros estáticos da pasta home para não ocupar espaço
    # (Mantemos apenas o JAR na pasta temporária)
    sudo rm -rf /home/ec2-user/deploy_temp/assets
    sudo rm -f /home/ec2-user/deploy_temp/*.html
    sudo rm -f /home/ec2-user/deploy_temp/*.js
    
    # Iniciar o novo Backend em background
    # Usamos o Java 21 instalado anteriormente
    nohup java -jar /home/ec2-user/deploy_temp/$JAR_NAME > /home/ec2-user/log.txt 2>&1 &
    
    # Reiniciar o Nginx para aplicar mudanças
    sudo systemctl restart nginx
    
    echo "Deploy finalizado no servidor!"
EOF

echo -e "${GREEN}====================================================${NC}"
echo -e "${GREEN} DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN} Acesse em: http://$IP_EC2${NC}"
echo -e "${GREEN}====================================================${NC}"