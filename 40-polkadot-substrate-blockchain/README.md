# Substrate node template and Substrate front-end template
# Commands to use
- Run backend node
  - `cd substrate-node-template`
  - `./target/release/node-template --dev`
- Start the first blockchain node
    - `cd substrate-node-template`
    - `./target/release/node-template \
  --base-path /tmp/alice \
  --chain local \
  --alice \
  --port 30333 \
  --rpc-port 9933 \
  --telemetry-url "wss://telemetry.polkadot.io/submit 0" \
  --validator`

- Run Frontend
  - `cd substrate-front-end-template`
  - `yarn install`
  - `yarn start`


# Help doc
- https://github.com/LearnWithArjun/substrate-env-setup
- https://docs.substrate.io/tutorials/build-a-blockchain/build-local-blockchain/
