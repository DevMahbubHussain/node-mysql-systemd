# Deploying a Node.js Application with MySQL using systemd

### Install Node.js and npm

`sudo apt install -y nodejs`

### Created the project directory:

`mkdir -p ~/node-app`
`cd ~/node-app`

### Initialized the Node.js project:

`npm init -y`

### Installed dependencies:

`npm install express mysql2 dotenv`

### Created a .env file:

````DB_HOST=localhost
DB_USER=appuser
DB_PASSWORD=password
DB_NAME=practice_app```

### Created the application file server.js with two endpoints.

```http://localhost:3000/health```
```http://localhost:3000/users```

### Set Up MySQL Database

Install MySQL


``sudo apt update
sudo apt install mysql-server -y```


### Secure MySQL installation

```sudo mysql_secure_installation```

### Loged into MySQL as root

```sudo mysql -u root -p```

### Created a new database and user

```
CREATE DATABASE practice_app;
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON practice_app.\* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;

```

### Created a users table and insert sample data

```
USE practice_app;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO users (name, email) VALUES
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Charlie', 'charlie@example.com');

```

### Testd the application

```node server.js```

### Endpoints

```http://localhost:3000/health```
```http://localhost:3000/users```

### systemd Configuration

Created a dedicated user

```sudo useradd -m  nodeapp```

where -m: Creates the user's home directory.

### Placed Node application in /opt/ directory with proper permissions

```sudo mkdir -p /opt/nodeapp
sudo mv /root/code/node-app /opt/nodeapp/```

Here, /opt/nodeapp is the new home for this application.

### Changed ownership of the directory to the newly created nodeapp user:

```
sudo chown -R nodeapp:nodeapp /opt/nodeapp/node-app
sudo chmod -R 755 /opt/nodeapp/node-app
```


### Created a systemd Service File for this Application

Created a systemd service file for this application in /etc/systemd/system/

```sudo nano /etc/systemd/system/nodeapp.service```

### service file for Node.js app

Systemd service files are typically placed in the /etc/systemd/system/ directory.

The service file for your Node.js application will be called nodeapp.service

````

[Unit]
Description=Node.js Application
After=network.target

[Service]
[Unit]
Description=Node.js Application
After=network.target mysql.service

[Service]
ExecStart=/usr/local/nvm/versions/node/v18.16.1/bin/node /opt/nodeapp/node-app/server.js
WorkingDirectory=/opt/nodeapp/node-app
Restart=always
User=nodeapp
Group=nodeapp
Environment=PATH=/usr/bin
Environment=NODE_ENV=production
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nodeapp

[Install]
WantedBy=multi-user.target ```

`which node`
shows that Node.js is located at
`/usr/local/nvm/versions/node/v18.16.1/bin/node`

The nodeapp.service file is placed in /etc/systemd/system/.

### Enabled the Service to Start at Boot Time

Reload systemd to recognize the new service file
`sudo systemctl daemon-reload`

Enable the service to start at boot time:
`sudo systemctl enable nodeapp`

Start the service
`sudo systemctl start nodeapp`

Check the status
`sudo systemctl status nodeapp`

output:

````root@bb0003155a9e2ba9:~/code# sudo systemctl status nodeapp.service
● nodeapp.service - Node.js Application
Loaded: loaded (/etc/systemd/system/nodeapp.service; enabled; vendor preset: enabled)
Active: active (running) since Wed 2025-03-26 18:34:41 UTC; 38s ago
Main PID: 29841 (node)
Tasks: 11 (limit: 2380)
Memory: 20.6M
CGroup: /system.slice/nodeapp.service
└─29841 /usr/local/nvm/versions/node/v18.16.1/bin/node /opt/nodeapp/node-app/server.js

Mar 26 18:34:41 bb0003155a9e2ba9 systemd[1]: Started Node.js Application.
Mar 26 18:34:42 bb0003155a9e2ba9 nodeapp[29841]: Server running on port 3000
Mar 26 18:34:42 bb0003155a9e2ba9 nodeapp[29841]: Connected to MySQL database.```
````
