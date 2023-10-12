.PHONY: build-production
build-production: ## Build the production docker image.
	docker compose -f docker-compose.prod.yml build

.PHONY: start-production
start-production: ## Start the production docker container.
ifdef ENV_FILE # Load environment variables from specified env file
	docker compose --env-file $(ENV_FILE) -f docker-compose.prod.yml up
else
	docker compose -f docker-compose.prod.yml up -d
endif

.PHONY: stop-production
stop-production: ## Stop the production docker container.
	docker compose -f docker-compose.prod.yml down
