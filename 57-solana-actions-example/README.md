# Solana Actions Example

## API
- GET `http://localhost:3001/api/actions/memo`
- POST `http://localhost:3001/api/actions/memo`
  - Body: `{
    "account": "Your PubKey Account"
  }`

## How It Works
- GET Request:
  - When a GET request is made to /api/actions/memo, the server responds with metadata about the action, such as the icon, label, description, and title. This information can be used to display the action in a user interface.

- POST Request:
  - When a POST request is made to /api/actions/memo with a JSON body containing the user's public key (account), the server creates a transaction that includes a memo message.
  - The transaction is configured to set the compute unit price and includes an instruction for the Memo program.
  - The transaction is then serialized and returned to the client as a base64 string.
