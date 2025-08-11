import Cookies from "js-cookie"

const MOCK_USER = [
  {
    name: "admin",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "manager",
    email: "manager@test.com",
    password: "manager123",
    role: "manager",
  },
  {
    name: "applicant",
    email: "applicant@test.com",
    password: "applicant123",
    role: "applicant",
  },
]

export async function login(email, password) {
  const user = MOCK_USER.find(
    (u) => u.email === email && u.password === password
  )
  if (user) {
    Cookies.set(
      "user",
      JSON.stringify({ name: user.name, email: user.email, role: user.role }),
      { expires: 7 }
    )
    return { success: true, role: user.role }
  } else {
    return { success: false, message: "Invalid credentials" }
  }
}

export async function signup(name, email, password, role = "applicant") {
  if (MOCK_USER.find((user) => user.email === email)) {
    return { success: false, message: "email already exists" }
  }
  const newUser = { name, email, password, role: "applicant" }
  MOCK_USER.push(newUser)
  return { success: true, role }
}

export function logout() {
  Cookies.remove("user")
  return { success: true, message: "Logged out successfully" }
} 

export function getUser() {
  const user = Cookies.get("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}