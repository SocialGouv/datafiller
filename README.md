# datafiller

Custom React forms to edit random data collections.

Use [Kinto](https://kinto.readthedocs.io) as a backend.

# Usage

rename and edit `docker-compose.override.(prod|dev).yml` to `docker-compose.override.yml`

```sh
docker-compose up
```

Fill the sample data with `node fixture.js` or `docker-compose exec front node fixture.js` in docker.

## Get the data back

Get a dump of the bucket `datasets` and collection `requetes` :

```sh
curl https://xxxxxx/kinto/v1/buckets/datasets/collections/requetes/records > bckp-(date +%m-%d-%y-%H-%M).json
```
