Jarvis Read Me
=======
Temporary Testing Server: 172.104.79.53:3000
Live Server: jarvis.ai
## VM Setup

1. **Setup hostname**  
```$hostnamectl set-hostname example_hostname```  
2. **Edit the hosts file**  
`$nano /etc/hosts`  
change to:
```
127.0.0.1 localhost
127.0.1.1 example_hostname
```
3. **Set Timezone**  
`$dpkg-reconfigure tzdata`
4. **Add User**  
`$adduser example_user`
5. **Add user to sudo group**  
`$adduser example_user sudo`
6. **Upload your RSA SSH key**  
Log out of the VM, and on your local computer  
`$ssh-copy-id example_user@203.0.113.10`  

7. **Clone the Repo**
8. **Run jarvis.sh**  
If not logged in as root, Change jarvis.sh permission level  
`$sudo ./jarvis.sh`  
**Jarvis.sh will:**  
  Install MongoDB  
  Config MongoDB Permissions  
  Install ufw  
  Config ufw  
  Enable ufw  
  Install fail2ban  
  Install Docker  
  Build Docker Image  
  Run Docker Image  
  Install NginX  
  Config Nginx  
  Install Redis    
9. **Edit `/etc/mongod.conf`**  
add:  
`security.authorization : enabled`
10. **Edit the ./nginx file to match your server configuration**  

11. **Restart Mongod**  
`$sudo service mongod restart`
12. **If you don't trust other people on the VM (like AJ), edit `/etc/redis/redis.conf`**  
In security uncomment and then type the password:  
`requirepass passwordThatIWantToUse` 
13. Install HTTPS via letsencrypt  
`sudo apt-get install certbot -t jessie-backports`  
`sudo certbot certonly`  
14. Renew HTTPS via letsencrypt  
`sudo certbot renew`
