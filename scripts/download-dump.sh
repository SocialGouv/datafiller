#!/bin/sh

# download master version of CDTN data

#`curl https://api.github.com/repos/SocialGouv/code-du-travail-numerique/branches/master | jq -r ".commit.sha" -`
SHA=401178f48170d3603692188fe1dfcb2671555cff

CDTN_REGISTRY=registry.gitlab.factory.social.gouv.fr/socialgouv/code-du-travail-numerique

docker run --rm --entrypoint cat $CDTN_REGISTRY/data:$SHA /app/dump.tf.json | jq "[.[] | {source, title, slug, url} | select((.source==\"conventions_collectives\" or .source==\"code_du_travail\") | not) ]" > ./src/dump.data.json
