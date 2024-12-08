// eslint-disable-next-line @typescript-eslint/quotes
export const dockerTemplate = `docker run --rm -it --name locust \
-p 8089:8089 \
-v \${PWD}:/home/locust \
--entrypoint /bin/bash \
locustio/locust:2.17.0`;
