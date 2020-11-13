# Celo Hot Wallet

_Under development_

An out-of-the-box Celo and Celo Dollar hot wallet to be used by projects that require automated processing of withdrawals.

Its goals are to be:
* **Lightweight:** small resources requirements which allows for running in machines as simple as a Raspberry Pi.
* **Containerized:** Docker configuration provided.
* **Secure:** provides mechanisms to mitigate risk of private key leak in the event of physical theft of the host machine, in physical server deployments.
* **Cloud-ready:** can be either deployed on a cloud VM or be integrated into a VPC as a remote slave in a physical machine using an SSH tunnel.

Currently, it's an initial implementation that you can start in your secure docker environment, with the SEED and PROVIDER (alfajores url) that you can call an http rest endpoint to make a cUSD transaction at /send-tx with 2 params: amount and address.
