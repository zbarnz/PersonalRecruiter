terraform {
  backend "local" {
    path = "secrets/terraform.tfstate"
  }
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
      image = "gcr.io/personal-recruiter-422400/personal-recruiter-autoapply:1.0.3"

      ports {
        container_port = 8080
      }
      

      env {
        name = "NODE_ENV"
        value = "local"
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