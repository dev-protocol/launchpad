import { UndefinedOr } from '@devprotocol/util-ts'
import { ethers } from 'ethers'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useProvider } from '../context/walletContext'
import { isValidNetwork } from '../utils/utils'

export const CONTEXT_TOKENIZE_TOKEN_NAME_KEY = 'tokenize.tokenname';
export const CONTEXT_TOKENIZE_TOKEN_SYMBOL_KEY = 'tokenize.tokensymbol';

export type GithubFormParams = {}

export type ITokenize = {
  assetName: string
  setAssetName: Dispatch<SetStateAction<string>>
  tokenName: string
  setTokenName: Dispatch<SetStateAction<string>>
  tokenSymbol: string
  setTokenSymbol: Dispatch<SetStateAction<string>>
  personalAccessToken: string
  setPersonalAccessToken: Dispatch<SetStateAction<string>>
  isValid: boolean
  setIsValid: Dispatch<SetStateAction<boolean>>
  network: UndefinedOr<ethers.providers.Network>
  setNetwork: Dispatch<SetStateAction<UndefinedOr<ethers.providers.Network>>>
  address: string
  setAddress: Dispatch<SetStateAction<string>>
  validateForm: () => void
  agreedToTerms: boolean
  setAgreedToTerms: Dispatch<SetStateAction<boolean>>
}

const tokenize: ITokenize = {
  assetName: '',
  setAssetName: () => {},
  tokenName: '',
  setTokenName: () => {},
  tokenSymbol: '',
  setTokenSymbol: () => {},
  personalAccessToken: '',
  setPersonalAccessToken: () => {},
  isValid: false,
  setIsValid: () => {},
  network: undefined,
  setNetwork: () => {},
  address: '',
  setAddress: () => {},
  validateForm: () => {},
  agreedToTerms: false,
  setAgreedToTerms: () => {}
}

export const TokenizeContext = React.createContext({
  ...tokenize,
  tokenName: localStorage.getItem(CONTEXT_TOKENIZE_TOKEN_NAME_KEY),
  tokenSymbol: localStorage.getItem(CONTEXT_TOKENIZE_TOKEN_SYMBOL_KEY),
})

export const TokenizeProvider: React.FC = ({ children }) => {
  const [assetName, setAssetName] = useState('')
  const [tokenName, setTokenName] = useState(localStorage.getItem(CONTEXT_TOKENIZE_TOKEN_NAME_KEY) || '')
  const [tokenSymbol, setTokenSymbol] = useState(localStorage.getItem(CONTEXT_TOKENIZE_TOKEN_SYMBOL_KEY) || '')
  const [personalAccessToken, setPersonalAccessToken] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [network, setNetwork] = useState<UndefinedOr<ethers.providers.Network>>()
  const [address, setAddress] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const { ethersProvider } = useProvider()

  const setTokenNameWithStorage = (value: string) => {
    localStorage.setItem(CONTEXT_TOKENIZE_TOKEN_NAME_KEY, value)
    setTokenName(value)
    return value
  }
  const setTokenSymbolWithStorage = (value: string) => {
    localStorage.setItem(CONTEXT_TOKENIZE_TOKEN_SYMBOL_KEY, value)
    setTokenSymbol(value)
    return value
  }

  const detectNetwork = useCallback(async () => {
    if (ethersProvider) {
      const net = await ethersProvider.detectNetwork()
      setNetwork(net)
    }
  }, [ethersProvider, setNetwork])

  useEffect(() => {
    if (ethersProvider) {
      detectNetwork()
      ;(async () => {
        const userAddress = await ethersProvider.getSigner().getAddress()
        setAddress(userAddress)
      })()
    }
  }, [ethersProvider, detectNetwork])

  const validateForm = useCallback(() => {
    if (assetName.length <= 0) {
      setIsValid(false)
      return
    }

    if (tokenName.length < 3) {
      setIsValid(false)
      return
    }

    if (!isValidNetwork(network?.chainId)) {
      setIsValid(false)
      return
    }
    if (tokenSymbol.length < 3 || tokenSymbol.length > 4) {
      setIsValid(false)
      return
    }
    if (personalAccessToken.length <= 0) {
      setIsValid(false)
      return
    }

    if (!agreedToTerms) {
      setIsValid(false)
      return
    }

    setIsValid(true)
  }, [
    assetName.length,
    tokenName.length,
    tokenSymbol.length,
    personalAccessToken.length,
    agreedToTerms,
    network?.chainId
  ])

  useEffect(() => validateForm(), [assetName, tokenName, tokenSymbol, personalAccessToken, validateForm])

  return (
    <TokenizeContext.Provider
      value={{
        assetName,
        setAssetName,
        tokenName,
        setTokenName: (v: any) => setTokenNameWithStorage(v),
        tokenSymbol,
        setTokenSymbol: (v: any) => setTokenSymbolWithStorage(v),
        personalAccessToken,
        setPersonalAccessToken,
        isValid,
        setIsValid,
        network,
        setNetwork,
        address,
        setAddress,
        validateForm,
        agreedToTerms,
        setAgreedToTerms
      }}
    >
      {children}
    </TokenizeContext.Provider>
  )
}
