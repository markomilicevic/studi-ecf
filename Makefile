install-dev:
	# Install Backend
	cd backend && npm install

	# Install Website
	cd website && npm install

start-dev:
	# Start all Docker containers
	docker-compose --file docker-compose-dev.yml up --detach

	# Start Backend trough PM2 (a process manager)
	cd backend && nohup npm run start-dev > ../backend.log 2>&1 &

	# Start Website (with create-react-app's watch)
	cd website && nohup npm start > ../website.log 2>&1 &

stop-dev:
	# Stop all Docker containers
	docker-compose --file docker-compose-dev.yml down || true

	# Stop the Backend trough PM2 (a process manager)
	cd backend && ./node_modules/.bin/pm2 stop app || true

	# Kill all remaining node processes (including all Create React Apps)
	ps -W | awk '/node/,NF=1' | xargs kill -f || true
