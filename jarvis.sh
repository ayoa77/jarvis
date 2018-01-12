#!/bin/sh
red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
reset=`tput sgr0`

echo "${red}-------------------Starting the install-------------------${reset}"

echo "${yellow}-------------------Starting Update-------------------${reset}"
apt-get update
echo "${green}-------------------Done Updating-------------------${reset}"

echo "${yellow}-------------------Starting Upgrade-------------------${reset}"
apt-get upgrade
echo "${green}-------------------Done Upgrading-------------------${reset}"

echo "${yellow}-------------------Installing UFW-------------------${reset}"
apt-get install ufw
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo "${green}-------------------Done Installing UFW-------------------${reset}"

echo "${yellow}-------------------Installing Fail2Ban-------------------${reset}"
apt-get install fail2ban -y
echo "${green}-------------------Done Installing Fail2Ban-------------------${reset}"

echo "${yellow}-------------------Installing MongoDB-------------------${reset}"
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.6 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
apt-get update
apt-get install -y mongodb-org
service mongod start
mongo < mongoInit.js
service mongod restart
echo "${green}-------------------Done Setting Up MongoDB-------------------${reset}"

echo "${yellow}-------------------Installing NginX-------------------${reset}"
apt-get install nginx -y
cp ./nginx ./nginx-backup
mv ./nginx /etc/nginx/sites-available/default
echo "${green}-------------------Done Installing NginX-------------------${reset}"

echo "${yellow}-------------------Installing Docker-------------------${reset}"
apt-get remove docker docker-engine docker.io
apt-get update
apt-get install \
     apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common
curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -
apt-key fingerprint 0EBFCD88
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
   $(lsb_release -cs) \
   stable"
apt-get update
apt-get install docker-ce
apt-cache madison docker-ce
echo "${green}-------------------Done Installing Docker-------------------${reset}"

echo "${yellow}-------------------Building Docker Image-------------------${reset}"
docker build -t jarvis .
docker run -d -p 3000:3000 jarvis
echo "${green}-------------------Done Building Docker Image-------------------${reset}"

echo "${yellow}-------------------Installing Redis-------------------${reset}"
apt-get update && apt-get upgrade
apt-get install software-properties-common
cat <<EOF >/etc/apt/sources.list.d/dotdeb.list
deb http://ftp.utexas.edu/dotdeb/ stable all
deb-src http://ftp.utexas.edu/dotdeb/ stable all
EOF
wget https://www.dotdeb.org/dotdeb.gpg
apt-key add dotdeb.gpg
apt-get update
apt-get install redis-server
echo "${green}-------------------Done Installing Redis-------------------${reset}"

echo "${red}-------------------Done Running the Install-------------------${reset}"
