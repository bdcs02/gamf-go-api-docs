# Step 1:
FROM harbor.ibc/devops/golang/go1.22.5:alpine3.20-ci AS builder

RUN apk update && apk add --no-cache git make

WORKDIR /app
COPY src/ /app
ARG PAT
RUN git config --global \
    url."https://gitlab:${PAT}@gitlab.ibc".insteadOf \
    "https://gitlab.ibc"
RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64\
    go build -ldflags="-w -s" -o /api-doc-test-backend

# Step 2:
# you can also use scratch here, but I prefer to use alpine because it comes with basic command such as curl useful for debugging.
FROM harbor.ibc/devops/alpine-base-cert/alpine-base-cert:83214

USER root
RUN mkdir -p apidoc
RUN chown -R mainuser apidoc

COPY --from=builder /api-doc-test-backend /api-doc-test-backend
COPY src/config.yml /config.yml

USER mainuser

EXPOSE 8080

ENTRYPOINT ["/api-doc-test-backend"]
