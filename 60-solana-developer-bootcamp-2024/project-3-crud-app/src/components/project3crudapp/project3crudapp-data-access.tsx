'use client'

import {getProject3crudappProgram, getProject3crudappProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useProject3crudappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getProject3crudappProgramId(cluster.network as Cluster), [cluster])
  const program = getProject3crudappProgram(provider)

  const accounts = useQuery({
    queryKey: ['project3crudapp', 'all', { cluster }],
    queryFn: () => program.account.project3crudapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['project3crudapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ project3crudapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useProject3crudappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useProject3crudappProgram()

  const accountQuery = useQuery({
    queryKey: ['project3crudapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.project3crudapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['project3crudapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ project3crudapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['project3crudapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ project3crudapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['project3crudapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ project3crudapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['project3crudapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ project3crudapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
