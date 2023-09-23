import 'dotenv/config'
import Web3 from 'web3'
import chains from './chains.js'

const { ETH_RPC, BNB_RPC, MATIC_RPC, AVAX_RPC, FTM_RPC } = process.env

const web3 = {
  ETH: new Web3(ETH_RPC),
  BNB: new Web3(BNB_RPC),
  MATIC: new Web3(MATIC_RPC),
  AVAX: new Web3(AVAX_RPC),
  FTM: new Web3(FTM_RPC),
}

export default async address => {
  const isContract = {
    ETH: await web3.ETH.eth.getCode(address) !== '0x',
    BNB: await web3.BNB.eth.getCode(address) !== '0x',
    MATIC: await web3.MATIC.eth.getCode(address) !== '0x',
    AVAX: await web3.AVAX.eth.getCode(address) !== '0x',
    FTM: await web3.FTM.eth.getCode(address) !== '0x'
  }

  const activeChains = chains

  return isContract
}