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

- Generate your account and key
  -  - `cd substrate-node-template`
    - Sr25519 `./target/release/node-template key generate --scheme Sr25519 --password-interactive`
    - Ed25519 `./target/release/node-template key inspect --password-interactive --scheme Ed25519 {Secret phrase}`

- Create a custom chain specification
  - `./target/release/node-template build-spec --disable-default-bootnode --chain local > customSpec.json`
- Convert the chain specification to raw format
  - `./target/release/node-template build-spec --chain=customSpec.json --raw --disable-default-bootnode > customSpecRaw.json`

- Start the first node
  - `./target/release/node-template \
--base-path /tmp/node01 \
--chain ./customSpecRaw.json \
--port 30333 \
--rpc-port 9933 \
--telemetry-url "wss://telemetry.polkadot.io/submit 0" \
--validator \
--rpc-methods Unsafe \
--name MyNode01 \
--password-interactive`

- Add keys to the keystore
  - `./target/release/node-template key insert \
--base-path /tmp/node01 \
--chain ./customSpecRaw.json \
--scheme Sr25519 \
--suri "current enable donor acquire alone leave claw airport modify risk tent athlete" \
--password-interactive \
--key-type aura`

  - `./target/release/node-template key insert \
--base-path /tmp/node01 \
--chain ./customSpecRaw.json \
--scheme Ed25519 \
--suri "current enable donor acquire alone leave claw airport modify risk tent athlete" \
--password-interactive \
--key-type gran`

- verify keys `ls /tmp/node01/chains/local_testnet/keystore`


- Run Frontend
  - `cd substrate-front-end-template`
  - `yarn install`
  - `yarn start`



# Help doc
- https://github.com/LearnWithArjun/substrate-env-setup
- https://docs.substrate.io/tutorials/build-a-blockchain/build-local-blockchain/
