install-dev:
	# Install Backend
	cd backend && npm install

	# Install Website
	cd website && npm install

	# Install End2end testing
	cd end2end && npm install

start-dev:
	# Start all Docker containers
	docker-compose --file docker-compose-dev.yml up --detach

	# Start Backend trough PM2 (a process manager)
	cd backend && nohup npm run start-dev > ../backend.log 2>&1 &

	# Start Website (with create-react-app's watch)
	cd website && nohup npm start > ../website.log 2>&1 &

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
