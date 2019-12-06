#!/bin/sh

# download master version of CDTN data

SHA=2652626865dfd874432a8a6b6dac0d956eb4d70f #`curl https://api.github.com/repos/SocialGouv/code-du-travail-numerique/branches/master | jq -r ".commit.sha" -`

CDTN_REGISTRY=registry.gitlab.factory.social.gouv.fr/socialgouv/code-du-travail-numerique

docker run --rm --entrypoint cat $CDTN_REGISTRY/data:$SHA /app/dump.tf.json | jq "[.[] | {source, title, slug, url} | select((.source==\"conventions_collectives\" or .source==\"code_du_travail\") | not) ]" > ./src/dump.data.json
