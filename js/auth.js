// Authentication utilities
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

async function signup(name, email, password) {
  const users = Storage.get("ek_app_users") || []

  // Check if email already exists
  if (users.some((u) => u.email === email)) {
    throw new Error("Email already registered")
  }

  const passwordHash = await hashPassword(password)
  const newUser = {
    id: "u_" + Date.now(),
    name,
    email,
    passwordHash,
    isAdmin: false,
    blocked: false,
    avatar: null,
    bio: "",
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  Storage.set("ek_app_users", users)
  Storage.set("ek_app_session", { currentUserId: newUser.id })
  return newUser
}

async function login(email, password) {
  const users = Storage.get("ek_app_users") || []
  const user = users.find((u) => u.email === email)

  if (!user) {
    throw new Error("Invalid email or password")
  }

  if (user.blocked) {
    throw new Error("Account has been blocked")
  }

  const passwordHash = await hashPassword(password)
  if (passwordHash !== user.passwordHash) {
    throw new Error("Invalid email or password")
  }

  Storage.set("ek_app_session", { currentUserId: user.id })
  return user
}

function logout() {
  Storage.remove("ek_app_session")
}

function getCurrentUser() {
  const session = Storage.get("ek_app_session")
  if (!session || !session.currentUserId) {
    return null
  }

  const users = Storage.get("ek_app_users") || []
  return users.find((u) => u.id === session.currentUserId)
}

function isLoggedIn() {
  return getCurrentUser() !== null
}

function isAdmin() {
  const user = getCurrentUser()
  return user && user.isAdmin
}
