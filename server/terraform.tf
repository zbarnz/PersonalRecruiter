terraform {
  backend "local" {
    path = "deployment/terraform/terraform.tfstate"
  }
}

# So I dont have to expost my connection string inside my terraform file
variable "db_connection_string" {
  type = string
  description = "Database connection string"
  sensitive = true
}

provider "google" {
  credentials = file("secrets/gcpCreds.json")
  project     = "personal-recruiter-422400"
  region      = "us-central1"
}

resource "google_cloud_run_v2_service" "pr-service" {
  name = "pr-service"
  location = "us-central1"
  client = "terraform"
  ingress = "INGRESS_TRAFFIC_ALL"
  template {
    containers {
      image = "gcr.io/personal-recruiter-422400/personal-recruiter-autoapply:1.0.7"

      ports {
        container_port = 8080
      }
      

      env {
        name = "NODE_ENV"
        value = "production"
      }

      env {
        name = "DB_CONNECTION_STRING"
        
        value_source {
          secret_key_ref {
            secret = google_secret_manager_secret.typeorm-connection.id
            version = "latest"
          }
        }
      }

      startup_probe {
        http_get {
          port = 8080
          path = "/api/health"
        }
      }
    }
  }
}

# The below will change the cloud run instance connection 
# authentication setting to "No Auth Required" 
# its really

resource "google_cloud_run_service_iam_binding" "default" {
  location = google_cloud_run_v2_service.pr-service.location
  service  = google_cloud_run_v2_service.pr-service.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}



resource "google_secret_manager_secret" "typeorm-connection" {
  secret_id = "typeorm-connection"

  replication {
    user_managed {
      replicas {
        location = "us-central1"
      }
    }
  }
}

resource "google_secret_manager_secret_version" "typeorm-connection-version" {
  secret      = google_secret_manager_secret.typeorm-connection.id
  secret_data = base64encode(var.db_connection_string)
}

resource "google_cloud_run_domain_mapping" "default" {
  location = "us-central1"
  name     = "mygptstats.com"

  metadata {
    namespace = "personal-recruiter-422400"
  }

  spec {
    route_name = google_cloud_run_v2_service.pr-service.name
  }
}