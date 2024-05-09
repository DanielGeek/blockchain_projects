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

  - Start the second blockchain node
    - `cd substrate-node-template`
    - `./target/release/node-template \
  --base-path /tmp/bob \
  --chain local \
  --bob \
  --port 30334 \
  --rpc-port 9934 \
  --telemetry-url "wss://telemetry.polkadot.io/submit 0" \
  --validator \
  --bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWDZeojDNMmziFr8x2w1a7cHC1G1pLvWwMyifsWM1WWz5M`

- Run Frontend
  - `cd substrate-front-end-template`
  - `yarn install`
  - `yarn start`


# Help doc
- https://github.com/LearnWithArjun/substrate-env-setup
- https://docs.substrate.io/tutorials/build-a-blockchain/build-local-blockchain/
