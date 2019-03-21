# data-filler

Use custom React forms to edit random [Kinto](https://kinto.readthedocs.io) collections.

# Usage

rename and edit `docker-compose.override.(prod|dev).yml` to `docker-compose.override.yml`

```sh
docker-compose up
```

| env       | value                 | dev                   | prod   |
| --------- | --------------------- | --------------------- | ------ |
| KINTO_URL |  Url of the kinto API | http://127.0.0.1:8888 | /kinto |


