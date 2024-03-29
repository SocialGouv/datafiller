:skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull:

<br>
<br>

<h3 align=center>DEPRECATED</h3>

<br>
<br>

:skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull:

<br>
<br>
<br>
<br>

---

# datafiller

Custom React forms to edit random data collections.

Use [Kinto](https://kinto.readthedocs.io) as a backend.

# Usage

Run Postgres + Kinto with docker-compose :

rename and edit `docker-compose.override.(prod|dev).yml` to `docker-compose.override.yml`

```sh
docker-compose up
```

Fill the sample data with `node fixture.js` or `docker-compose exec front node fixture.js` in docker.

## Dev

```
yarn

env KINTO_URL_SERVER=http://127.0.0.1:8888 yarn dev

```

## Get the data back

Get a dump of the bucket `datasets` and collection `requetes` :

```sh
curl https://xxxxxx/kinto/v1/buckets/datasets/collections/requetes/records > bckp-(date +%y-%m-%d-%H-%M).json
```

## Scripts

 - `./scripts/download-dump.sh` get latest dump from CDTN master
 - `DATAFILLER_URL=xxxx node ./scripts/fix-urls` fix datafiller urls based on current dump
