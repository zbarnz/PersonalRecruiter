#!/bin/bash
set -e -x

VERSION=$1
COMMITHASH=$(git rev-parse --short HEAD)
PROJECTID='personal-recruiter-422400'
ACCESS_TOKEN=$(gcloud auth print-access-token)
docker login -u _token -p $ACCESS_TOKEN
#ARTIFACTPATH='us-central1-docker.pkg.dev/'$PROJECTID'/personal-recruiter-autoapply'

docker build -t autoapply/www:$VERSION ./www

docker tag autoapply/www:$VERSION gcr.io/$PROJECTID/$ARTIFACTPATH:$VERSION
docker tag autoapply/www:$VERSION gcr.io/$PROJECTID/$ARTIFACTPATH:$COMMITHASH

docker push gcr.io/$PROJECTID/$ARTIFACTPATH:$VERSION
docker push gcr.io/$PROJECTID/$ARTIFACTPATH:$COMMITHASH