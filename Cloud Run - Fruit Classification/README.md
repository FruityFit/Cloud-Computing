gcloud builds submit --tag gcr.io/fruityfit-dev/predict
gcloud run deploy --image gcr.io/fruityfit-dev/predict --platform managed