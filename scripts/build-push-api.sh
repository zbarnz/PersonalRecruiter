#!/bin/bash
set -e -x

VERSION=$1
COMMITHASH=$(git rev-parse --short HEAD)
PROJECTID='personal-recruiter-422400'
ARTIFACTPATH=personal-recruiter-autoapply

echo 'lgin in to glcoud'

gcloud auth login

ACCESS_TOKEN=$(gcloud auth print-access-token)

echo 'loging intow fipodocker'

docker login -u _token -p $ACCESS_TOKEN https://gcr.io
 
echo 'flibbed into docker'

docker build -t autoapply/server:$VERSION ./server

docker tag autoapply/server:$VERSION gcr.io/$PROJECTID/$ARTIFACTPATH:$VERSION
docker tag autoapply/server:$VERSION gcr.io/$PROJECTID/$ARTIFACTPATH:$COMMITHASH

docker push gcr.io/$PROJECTID/$ARTIFACTPATH:$VERSION
docker push gcr.io/$PROJECTID/$ARTIFACTPATH:$COMMITHASH

echo 'Over'