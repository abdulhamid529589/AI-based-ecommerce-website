import { createContext, useContext, useState } from 'react'
import { formatBDT, getCurrencyConfig } from '../lib/currencyFormatter'

const CurrencyContext = createContext()

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('BDT')
  const [locale, setLocale] = useState('bn-BD')

  const value = {
    currency,
    setCurrency,
    locale,
    setLocale,
    config: getCurrencyConfig(),
  }

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)

  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }

  return context
}
