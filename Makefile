export PATH := /home/markomilicevicfr/node/bin:$(PATH)

install-dev:
	# Install Backend
	cd backend && npm install

	# Install Website
	cd website && npm install

	# Install Mobile
	cd mobile && npm install

	# Install End2end testing
	cd end2end && npm install

start-dev:
	# Start all Docker containers
	docker-compose --file docker-compose-dev.yml up --detach

	# Start Backend trough PM2 (a process manager)
	cd backend && nohup npm run start-dev > ../backend.log 2>&1 &

	# Start Website (with create-react-app's watch)
	cd website && nohup npm start > ../website.log 2>&1 &

	# Start Mobile (with create-react-app's watch)
	cd mobile && nohup npm start > ../mobile.log 2>&1 &

	# Start Static (using simple python's http server)
	cd static && nohup python3 -m http.server > ../static.log 2>&1 &

run-end2end-tests:
	# Check if dev env is running
	curl -sSf http://localhost:4001/ > /dev/null
	# Start end2end tests
	cd end2end && npm test

stop-dev:
	# Stop all Docker containers
	docker-compose --file docker-compose-dev.yml down || true

	# Stop the Backend trough PM2 (a process manager)
	cd backend && ./node_modules/.bin/pm2 stop app || true

	# Kill all remaining node processes (including all Create React Apps)
	ps -W | awk '/node/,NF=1' | xargs kill -f || true

securize-prod:
	# Install security related utilities
	sudo apt-get install fail2ban

	# Configure the firewall

	# Allow all outgoing ports (Sending mails trough SMTP, external HTTPS APIs, ...)
	sudo ufw default allow outgoing
	# Block all incoming accesses on all ports
	sudo ufw default deny incoming
	# Allow the minimal incoming (at least SSH, HTTP and HTTPS)
	sudo ufw allow ssh
	sudo ufw allow http
	sudo ufw allow https
	# Allow nginx container to access the backend
	sudo ufw allow from 172.16.0.0/12 proto tcp to any port 3001
	# Enable the firewall
	sudo ufw --force enable

	# Docker and reboot are required to be run using sudo
	echo "${USER} ALL=(ALL:ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose, /usr/sbin/reboot" | sudo tee /etc/sudoers.d/${USER}

install-prod:
	make securize-prod

	# Install all commands
	sudo apt-get install docker.io docker-compose

	# Retart everything after each restart
	echo '#!/bin/bash' > /home/markomilicevicfr/prod/cinephoria.sh
	echo 'cd /home/markomilicevicfr/prod' >> /home/markomilicevicfr/prod/cinephoria.sh
	echo 'make cleanup-prod && make build-prod && make start-prod && sleep infinity' >> /home/markomilicevicfr/prod/cinephoria.sh
	chmod +x /home/markomilicevicfr/prod/cinephoria.sh

	sudo rm /etc/systemd/system/cinephoria.service || true
	echo '[Unit]' | sudo tee -a /etc/systemd/system/cinephoria.service
	echo 'Description=Cinephoria' | sudo tee -a /etc/systemd/system/cinephoria.service
	echo 'After=docker.service' | sudo tee -a /etc/systemd/system/cinephoria.service
	echo 'BindsTo=docker.service' | sudo tee -a /etc/systemd/system/cinephoria.service
	echo 'ReloadPropagatedFrom=docker.service' | sudo tee -a /etc/systemd/system/cinephoria.service
	echo ''  | sudo tee -a /etc/systemd/system/cinephoria.service
	echo '[Service]' | sudo tee -a /etc/systemd/system/cinephoria.service
	echo 'User=markomilicevicfr' | sudo tee -a /etc/systemd/system/cinephoria.service
	echo 'Group=markomilicevicfr'  | sudo tee -a /etc/systemd/system/cinephoria.service
	echo 'ExecStart=/home/markomilicevicfr/prod/cinephoria.sh' | sudo tee -a /etc/systemd/system/cinephoria.service
	echo '' | sudo tee -a /etc/systemd/system/cinephoria.service
	echo '[Install]' | sudo tee -a /etc/systemd/system/cinephoria.service
	echo 'WantedBy=multi-user.target' | sudo tee -a /etc/systemd/system/cinephoria.service

	sudo systemctl enable cinephoria

	# Add cron for resetting at every midnight (UTC)
	# Write out current crontab
	crontab -l > mycron || true
	# Echo new cron
	echo "0 0 * * * sudo reboot" >> mycron
	# Install new cron file
	crontab mycron
	# Cleanup
	rm mycron

build-prod:
	# Build Backend
	cd backend && npm install

	# Build Website
	cd website && npm install && npm run build

	# Build Mobile
	cd mobile && npm install && npm run build

cleanup-prod:
	sudo docker system prune --all --force

start-prod:
	make cleanup-prod || true

	# Start all Docker containers
	sudo docker-compose --file docker-compose-prod.yml up --detach

	# Start Backend and save the process id
	cd backend && ./node_modules/.bin/pm2 start node --name app -- --experimental-modules app.js &

stop-prod:
	# Stop all Docker containers
	sudo docker-compose --file docker-compose-prod.yml down || true

	# Stop the Backend trough PM2 (a process manager)
	cd backend && ./node_modules/.bin/pm2 stop app || true
