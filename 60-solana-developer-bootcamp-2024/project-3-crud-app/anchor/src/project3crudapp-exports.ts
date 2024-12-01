// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import Project3crudappIDL from '../target/idl/project3crudapp.json'
import type { Project3crudapp } from '../target/types/project3crudapp'

// Re-export the generated IDL and type
export { Project3crudapp, Project3crudappIDL }

// The programId is imported from the program IDL.
export const PROJECT3CRUDAPP_PROGRAM_ID = new PublicKey(Project3crudappIDL.address)

// This is a helper function to get the Project3crudapp Anchor program.
export function getProject3crudappProgram(provider: AnchorProvider) {
  return new Program(Project3crudappIDL as Project3crudapp, provider)
}

// This is a helper function to get the program ID for the Project3crudapp program depending on the cluster.
export function getProject3crudappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Project3crudapp program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return PROJECT3CRUDAPP_PROGRAM_ID
  }
}
