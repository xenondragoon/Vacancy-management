import Cookies from "js-cookie"

export function getRole() {
  return Cookies.get("role")
}

export function logout() {
  Cookies.remove("role")
}

const MOCK_USER = [
  {
    username: "admin",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
  },
  {
    username: "manager",
    email: "manager@test.com",
    password: "manager123",
    role: "manager",
  },
  {
    username: "applicant",
    email: "applicant@test.com",
    password: "applicant123",
    role: "applicant",
  },
]

export function login(email, password) {
  const user = MOCK_USER.find(
    (u) => u.email === email && u.password === password
  )
  if (user) {
    return { success: true, role: user.role }
  } else {
    return { success: false, message: "Invalid credentials" }
  }
}

export function signup(name,email,password, role = "applicant") {
  if (MOCK_USER.find(user => u.email === email && password === password)) {
    return { success: false, message: "email already exists" }
  }
  const newUser = {name, email, password, role:'applicant' }
  MOCK_USER.push(newUser)
  return { success: true, role }
}

