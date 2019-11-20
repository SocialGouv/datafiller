#!/bin/sh

# download master version of CDTN data

SHA=`curl https://api.github.com/repos/SocialGouv/code-du-travail-numerique/commits | jq -r ".[0].sha" -`

CDTN_REGISTRY=registry.gitlab.factory.social.gouv.fr/socialgouv/code-du-travail-numerique

docker run --rm --entrypoint cat $CDTN_REGISTRY/data:$SHA /app/dump.tf.json | jq "[.[] | {source, title, slug, url}]" > ./src/dump.data.json
