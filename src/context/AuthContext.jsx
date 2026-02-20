import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getToken,
  setToken,
  setStoredUser,
  getStoredUser,
  auth,
  user as userApi,
} from '../api/client'

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [loading, setLoading] = useState(!!getToken())

  const login = useCallback(async (email, password) => {
    const { user: u, token } = await auth.login(email, password)
    setToken(token)
    setStoredUser(u)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (email, password) => {
    const data = await auth.register(email, password)
    if (data.needVerification && data.email) {
      return { needVerification: true, email: data.email }
    }
    setToken(data.token)
    setStoredUser(data.user)
    setUser(data.user)
    return data.user
  }, [])

  const verifyEmail = useCallback(async (email, code) => {
    const { user: u, token } = await auth.verifyEmail(email, code)
    setToken(token)
    setStoredUser(u)
    setUser(u)
    return u
  }, [])

  const resetPassword = useCallback(async (email, code, newPassword) => {
    const { user: u, token } = await auth.resetPassword(email, code, newPassword)
    setToken(token)
    setStoredUser(u)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setStoredUser(null)
    setUser(null)
  }, [])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    userApi
      .getMe()
      .then(({ user: u }) => {
        setStoredUser(u)
        setUser(u)
      })
      .catch(() => {
        setToken(null)
        setStoredUser(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token: getToken(),
        loading,
        login,
        register,
        verifyEmail,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
