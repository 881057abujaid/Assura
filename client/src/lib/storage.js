export const storage = {
  getUser: () => {
    try {
      const user = localStorage.getItem('assura_user')
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },

  setUser: (user) => {
    try {
      localStorage.setItem('assura_user', JSON.stringify(user))
    } catch (e) {
      console.error(e)
    }
  },

  clearUser: () => {
    try {
      localStorage.removeItem('assura_user')
    } catch (e) {
      console.error(e)
    }
  },
}
