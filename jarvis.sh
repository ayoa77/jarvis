#!/bin/sh
red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
reset=`tput sgr0`

echo "${red}-------------------Starting the install-------------------${reset}"
echo "${red}-------------------Starting the install-------------------${reset}"
echo "${red}-------------------Starting the install-------------------${reset}"

echo "${yellow}-------------------Starting Update-------------------${reset}"
echo "${yellow}-------------------Starting Update-------------------${reset}"
echo "${yellow}-------------------Starting Update-------------------${reset}"
apt-get update -y
echo "${green}-------------------Done Updating-------------------${reset}"
echo "${green}-------------------Done Updating-------------------${reset}"
echo "${green}-------------------Done Updating-------------------${reset}"

echo "${yellow}-------------------Starting Upgrade-------------------${reset}"
echo "${yellow}-------------------Starting Upgrade-------------------${reset}"
echo "${yellow}-------------------Starting Upgrade-------------------${reset}"
apt-get upgrade -y
echo "${green}-------------------Done Upgrading-------------------${reset}"
echo "${green}-------------------Done Upgrading-------------------${reset}"
echo "${green}-------------------Done Upgrading-------------------${reset}"

echo "${yellow}-------------------Installing UFW-------------------${reset}"
echo "${yellow}-------------------Installing UFW-------------------${reset}"
echo "${yellow}-------------------Installing UFW-------------------${reset}"
apt-get install ufw -y
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo "${green}-------------------Done Installing UFW-------------------${reset}"
echo "${green}-------------------Done Installing UFW-------------------${reset}"
echo "${green}-------------------Done Installing UFW-------------------${reset}"

echo "${yellow}-------------------Installing Fail2Ban-------------------${reset}"
echo "${yellow}-------------------Installing Fail2Ban-------------------${reset}"
echo "${yellow}-------------------Installing Fail2Ban-------------------${reset}"
apt-get install fail2ban -y
echo "${green}-------------------Done Installing Fail2Ban-------------------${reset}"
echo "${green}-------------------Done Installing Fail2Ban-------------------${reset}"
echo "${green}-------------------Done Installing Fail2Ban-------------------${reset}"

echo "${yellow}-------------------Installing MongoDB-------------------${reset}"
echo "${yellow}-------------------Installing MongoDB-------------------${reset}"
echo "${yellow}-------------------Installing MongoDB-------------------${reset}"
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.6 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
apt-get update
apt-get install mongodb-org -y
service mongod start
mongo < mongoInit.js
service mongod restart
systemctl enable mongod.service
echo "${green}-------------------Done Setting Up MongoDB-------------------${reset}"
echo "${green}-------------------Done Setting Up MongoDB-------------------${reset}"
echo "${green}-------------------Done Setting Up MongoDB-------------------${reset}"

echo "${yellow}-------------------Installing NginX-------------------${reset}"
echo "${yellow}-------------------Installing NginX-------------------${reset}"
echo "${yellow}-------------------Installing NginX-------------------${reset}"
apt-get install nginx -y
cp ./nginx ./nginx-backup
mv ./nginx /etc/nginx/sites-available/default
echo "${green}-------------------Done Installing NginX-------------------${reset}"
echo "${green}-------------------Done Installing NginX-------------------${reset}"
echo "${green}-------------------Done Installing NginX-------------------${reset}"

echo "${yellow}-------------------Installing Docker-------------------${reset}"
echo "${yellow}-------------------Installing Docker-------------------${reset}"
echo "${yellow}-------------------Installing Docker-------------------${reset}"
apt-get remove docker docker-engine docker.io
apt-get update -y
apt-get install -y \
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
apt-get update -y
apt-get install docker-ce -y
apt-cache madison docker-ce -y
echo "${green}-------------------Done Installing Docker-------------------${reset}"
echo "${green}-------------------Done Installing Docker-------------------${reset}"
echo "${green}-------------------Done Installing Docker-------------------${reset}"

echo "${yellow}-------------------Installing Redis-------------------${reset}"
echo "${yellow}-------------------Installing Redis-------------------${reset}"
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
echo "${green}-------------------Done Installing Redis-------------------${reset}"
echo "${green}-------------------Done Installing Redis-------------------${reset}"

echo "${yellow}-------------------Building/Running Docker Image-------------------${reset}"
echo "${yellow}-------------------Building/Running Docker Image-------------------${reset}"
echo "${yellow}-------------------Building/Running Docker Image-------------------${reset}"
docker build -t jarvis .
docker run -d -p 3000:3000 jarvis
echo "${green}-------------------Done Building/Running Docker Image-------------------${reset}"
echo "${green}-------------------Done Building/Running Docker Image-------------------${reset}"
echo "${green}-------------------Done Building/Running Docker Image-------------------${reset}"

echo "${red}-------------------Done Running the Install-------------------${reset}"
echo "${red}-------------------Done Running the Install-------------------${reset}"
echo "${red}-------------------Done Running the Install-------------------${reset}"
