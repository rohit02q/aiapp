// Storage utilities for localStorage management
class Storage {
  static get(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error("Error getting from localStorage:", error)
      return null
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error("Error setting to localStorage:", error)
      return false
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error("Error removing from localStorage:", error)
      return false
    }
  }

  static clear() {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error("Error clearing localStorage:", error)
      return false
    }
  }
}

// Function to hash passwords
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Initialize demo data
function seedDemoData() {
  // Demo users
  const users = [
    {
      id: "u_1",
      name: "Admin User",
      email: "admin@edukit.com",
      passwordHash: "", // Will be set below
      isAdmin: true,
      blocked: false,
      avatar: null,
      bio: "System Administrator",
      createdAt: new Date().toISOString(),
    },
    {
      id: "u_2",
      name: "John Doe",
      email: "john@example.com",
      passwordHash: "", // Will be set below
      isAdmin: false,
      blocked: false,
      avatar: null,
      bio: "Aspiring developer",
      createdAt: new Date().toISOString(),
    },
    {
      id: "u_3",
      name: "Jane Smith",
      email: "jane@example.com",
      passwordHash: "", // Will be set below
      isAdmin: false,
      blocked: false,
      avatar: null,
      bio: "Design enthusiast",
      createdAt: new Date().toISOString(),
    },
     {
      id: "u_4",
      name: "Rohit Kumar",
      email: "r@e",
      passwordHash: "", // Will be set below
      isAdmin: false,
      blocked: false,
      avatar: null,
      bio: "Co-Founder",
      createdAt: new Date().toISOString(),
    },
  ]

  // Demo courses
  const courses = [
    {
      id: "c_1",
      title: "JavaScript Fundamentals",
      slug: "javascript-fundamentals",
      thumbnail: null,
      description: "Learn the basics of JavaScript programming language from scratch.",
      price: 0,
      type: "free",
      entryCode: null,
      lessons: [
        { id: "l_1", title: "Introduction to JavaScript", type: "text", content: "Welcome to JavaScript!" },
        { id: "l_2", title: "Variables and Data Types", type: "text", content: "Learn about variables..." },
      ],
      createdAt: new Date().toISOString(),
      published: true,
    },
    {
      id: "c_2",
      title: "Advanced React Patterns",
      slug: "advanced-react-patterns",
      thumbnail: null,
      description: "Master advanced React patterns and best practices.",
      price: 2999,
      type: "paid",
      entryCode: null,
      lessons: [
        { id: "l_3", title: "Higher Order Components", type: "text", content: "Learn about HOCs..." },
        { id: "l_4", title: "Render Props Pattern", type: "text", content: "Understanding render props..." },
      ],
      createdAt: new Date().toISOString(),
      published: true,
    },
    {
      id: "c_3",
      title: "UI/UX Design Principles",
      slug: "ui-ux-design-principles",
      thumbnail: null,
      description: "Learn the fundamental principles of user interface and user experience design.",
      price: 0,
      type: "locked",
      entryCode: "free",
      lessons: [
        { id: "l_5", title: "Design Thinking Process", type: "text", content: "Understanding design thinking..." },
        { id: "l_6", title: "Color Theory", type: "text", content: "Learn about colors..." },
      ],
      createdAt: new Date().toISOString(),
      published: true,
    },
    {
      id: "c_4",
      title: "Python for Beginners",
      slug: "python-for-beginners",
      thumbnail: null,
      description: "Start your programming journey with Python.",
      price: 1999,
      type: "paid",
      entryCode: null,
      lessons: [
        { id: "l_7", title: "Python Basics", type: "text", content: "Introduction to Python..." },
        { id: "l_8", title: "Control Structures", type: "text", content: "If statements and loops..." },
      ],
      createdAt: new Date().toISOString(),
      published: true,
    },
    {
      id: "c_5",
      title: "Web Development Bootcamp",
      slug: "web-development-bootcamp",
      thumbnail: null,
      description: "Complete web development course covering HTML, CSS, and JavaScript.",
      price: 0,
      type: "free",
      entryCode: null,
      lessons: [
        { id: "l_9", title: "HTML Basics", type: "text", content: "Learn HTML structure..." },
        { id: "l_10", title: "CSS Styling", type: "text", content: "Style your web pages..." },
      ],
      createdAt: new Date().toISOString(),
      published: true,
    },
  ]

  // Demo enrollments
  const enrollments = [
    {
      id: "e_1",
      userId: "u_2",
      courseId: "c_1",
      purchased: false,
      enrolledAt: new Date().toISOString(),
      progress: { l_1: true, l_2: false },
    },
    {
      id: "e_2",
      userId: "u_3",
      courseId: "c_5",
      purchased: false,
      enrolledAt: new Date().toISOString(),
      progress: { l_9: true, l_10: true },
    },
  ]

  // Default settings
  const settings = {
    disableZoom: true,
    theme: "light",
  }

  // Hash passwords and store data
  Promise.all([hashPassword("admin123"), hashPassword("password123"), hashPassword("password123"),hashPassword("rohit123")]).then((hashes) => {
    users[0].passwordHash = hashes[0]
    users[1].passwordHash = hashes[1]
    users[2].passwordHash = hashes[2]
    users[3].passwordHash = hashes[3]


    Storage.set("ek_app_users", users)
    Storage.set("ek_app_courses", courses)
    Storage.set("ek_app_enrollments", enrollments)
    Storage.set("ek_app_settings", settings)

    console.log("Demo data seeded successfully")
    window.location.reload()
  })
}

// Export localStorage data
function exportData() {
  const data = {
    users: Storage.get("ek_app_users") || [],
    courses: Storage.get("ek_app_courses") || [],
    enrollments: Storage.get("ek_app_enrollments") || [],
    settings: Storage.get("ek_app_settings") || {},
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "edukit-data.json"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
