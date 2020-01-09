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
apt-get update -y
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
cp ./nginx /etc/nginx/sites-available/default
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
apt-get update -y 
apt-get upgrade -y
apt-get install software-properties-common -y
cat <<EOF >/etc/apt/sources.list.d/dotdeb.list
deb http://ftp.utexas.edu/dotdeb/ stable all
deb-src http://ftp.utexas.edu/dotdeb/ stable all
EOF
wget https://www.dotdeb.org/dotdeb.gpg
apt-key add dotdeb.gpg
apt-get update -y
apt-get install redis-server -y
echo "${green}-------------------Done Installing Redis-------------------${reset}"
echo "${green}-------------------Done Installing Redis-------------------${reset}"
echo "${green}-------------------Done Installing Redis-------------------${reset}"

echo "${yellow}-------------------Building/Running Docker Image-------------------${reset}"
echo "${yellow}-------------------Building/Running Docker Image-------------------${reset}"
echo "${yellow}-------------------Building/Running Docker Image-------------------${reset}"
docker build -t jarvis .
docker run --restart unless-stopped -d -p 7000:7000 jarvis
service nginx restart
echo "${green}-------------------Done Building/Running Docker Image-------------------${reset}"
echo "${green}-------------------Done Building/Running Docker Image-------------------${reset}"
echo "${green}-------------------Done Building/Running Docker Image-------------------${reset}"

echo "${red}-------------------Done Running the Install-------------------${reset}"
echo "${red}-------------------Done Running the Install-------------------${reset}"
echo "${red}-------------------Done Running the Install-------------------${reset}"



  GNU nano 2.7.4                                                                             File: /etc/redis/redis.conf                                                                                       

# normal -> normal clients including MONITOR clients
# slave  -> slave clients
# pubsub -> clients subscribed to at least one pubsub channel or pattern
#
# The syntax of every client-output-buffer-limit directive is the following:
#
# client-output-buffer-limit <class> <hard limit> <soft limit> <soft seconds>
#
# A client is immediately disconnected once the hard limit is reached, or if
# the soft limit is reached and remains reached for the specified number of
# seconds (continuously).
# So for instance if the hard limit is 32 megabytes and the soft limit is
# 16 megabytes / 10 seconds, the client will get disconnected immediately
# if the size of the output buffers reach 32 megabytes, but will also get
# disconnected if the client reaches 16 megabytes and continuously overcomes
# the limit for 10 seconds.
#
# By default normal clients are not limited because they don't receive data
# without asking (in a push way), but just after a request, so only
# asynchronous clients may create a scenario where data is requested faster
# than it can read.
#
# Instead there is a default limit for pubsub and slave clients, since
# subscribers and slaves receive data in a push fashion.
#
# Both the hard or the soft limit can be disabled by setting them to zero.
client-output-buffer-limit normal 0 0 0
client-output-buffer-limit slave 256mb 64mb 60
client-output-buffer-limit pubsub 32mb 8mb 60

# Redis calls an internal function to perform many background tasks, like
# closing connections of clients in timeout, purging expired keys that are
# never requested, and so forth.
#
# Not all tasks are performed with the same frequency, but Redis checks for
# tasks to perform according to the specified "hz" value.
#
# By default "hz" is set to 10. Raising the value will use more CPU when
# Redis is idle, but at the same time will make Redis more responsive when
# there are many keys expiring at the same time, and timeouts may be
# handled with more precision.
#
# The range is between 1 and 500, however a value over 100 is usually not
# a good idea. Most users should use the default of 10 and raise this up to
# 100 only in environments where very low latency is required.
hz 10

# When a child rewrites the AOF file, if the following option is enabled

^G Get Help      ^O Write Out     ^W Where Is      ^K Cut Text      ^J Justify       ^C Cur Pos       ^Y Prev Page     M-\ First Line   M-W WhereIs Next ^^ Mark Text     M-} Indent Text  M-U Undo
^X Exit          ^R Read File     ^\ Replace       ^U Uncut Text    ^T To Spell      ^_ Go To Line    ^V Next Page     M-/ Last Line    M-] To Bracket   M-^ Copy Text    M-{ Unindent TextM-E Redo