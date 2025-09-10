document.addEventListener("DOMContentLoaded", () => {
    initializeApp()
    setupEventListeners()
    //   applySettings()

    // Load admin view if accessed directly
    if (window.location.hash === "#admin") {
        UI.showView("adminView")
        showAdminTab("users")
    }
})

function initializeApp() {
    const users = Storage.get("ek_app_users")
    if (!users || users.length === 0) {
        seedDemoData()
        return
    }

    // Check if user is logged in
    if (!isLoggedIn()) {
        UI.showModal("loginModal")
    } else {
        loadHomeView()
        updateUserProfile()
    }
}

// Admin functions
function showAdminTab(tab) {
    document.querySelectorAll(".admin-tab").forEach((t) => {
        t.classList.remove("active", "bg-brand", "text-white")
        t.classList.add("bg-gray-200", "text-gray-700")
    })

    document.querySelectorAll(".admin-content").forEach((c) => {
        c.classList.add("hidden")
    })

    if (tab === "users") {
        document.getElementById("usersTab").classList.add("active", "bg-brand", "text-white")
        document.getElementById("usersTab").classList.remove("bg-gray-200", "text-gray-700")
        document.getElementById("usersManagement").classList.remove("hidden")
        loadUsersManagement()
    } else if (tab === "courses") {
        document.getElementById("coursesTab").classList.add("active", "bg-brand", "text-white")
        document.getElementById("coursesTab").classList.remove("bg-gray-200", "text-gray-700")
        document.getElementById("coursesManagement").classList.remove("hidden")
        loadCoursesManagement()
    }

    updateAdminStats()
}


function loadUsersManagement() {
    const users = Storage.get("ek_app_users") || []
    const container = document.getElementById("usersList")
    container.innerHTML = ""

    users.forEach((user) => {
        const card = UI.createUserCard(user)
        container.appendChild(card)
    })
}

function loadCoursesManagement() {
    const courses = Storage.get("ek_app_courses") || []
    const container = document.getElementById("adminCoursesList")
    container.innerHTML = ""

    courses.forEach((course) => {
        const card = document.createElement("div")
        card.className = "bg-white rounded-xl p-4 shadow-sm border border-gray-200"

        card.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <h4 class="font-medium text-gray-900">${course.title}</h4>
                    <p class="text-sm text-gray-600">${course.type} • ${UI.formatPrice(course.price)}</p>
                    <p class="text-xs text-gray-500">${course.published ? "Published" : "Draft"}</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="editCourse('${course.id}')" class="text-sm px-3 py-1 rounded bg-blue-100 text-blue-700">Edit</button>
                    <button onclick="deleteCourse('${course.id}')" class="text-sm px-3 py-1 rounded bg-red-100 text-red-700">Delete</button>
                </div>
            </div>
        `

        container.appendChild(card)
    })
}

function editCourse(courseId) {
  // Simple course editing - could be enhanced with a proper form
  const courses = Storage.get("ek_app_courses") || []
  const course = courses.find((c) => c.id === courseId)

  if (course) {
    const newTitle = prompt("Course Title:", course.title)
    if (newTitle) {
      course.title = newTitle
      Storage.set("ek_app_courses", courses)
      loadCoursesManagement()
    }
  }
}

function updateAdminStats() {
    const users = Storage.get("ek_app_users") || []
    const courses = Storage.get("ek_app_courses") || []

    document.getElementById("totalUsers").textContent = users.length
    document.getElementById("totalCourses").textContent = courses.length
}

function toggleUserBlock(userId) {
    const users = Storage.get("ek_app_users") || []
    const user = users.find((u) => u.id === userId)

    if (user) {
        user.blocked = !user.blocked
        Storage.set("ek_app_users", users)
        loadUsersManagement()
    }
}


function setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
        item.addEventListener("click", function () {
            const viewId = this.dataset.view
            UI.showView(viewId)

            
      // Load view-specific content
      switch (viewId) {
        case "homeView":
          loadHomeView()
          break
        case "myCoursesView":
          loadMyCoursesView()
          break
        case "searchView":
          loadSearchView()
          break
        case "profileView":
          loadProfileView()
          break
      }
        })
    })

    // Auth modals
    document.getElementById("loginForm").addEventListener("submit", handleLogin)
    document.getElementById("signupForm").addEventListener("submit", handleSignup)

    // Modal controls
    document.getElementById("showSignup").addEventListener("click", () => {
        UI.showModal("signupModal")
    })

    document.getElementById("showLogin").addEventListener("click", () => {
        UI.showModal("loginModal")
    })

    document.getElementById("closeLogin").addEventListener("click", () => UI.hideModal("loginModal"))
    document.getElementById("closeSignup").addEventListener("click", () => UI.hideModal("signupModal"))
    document.getElementById("closeCourse").addEventListener("click", () => UI.hideModal("courseModal"))
    document.getElementById("closeCode").addEventListener("click", () => UI.hideModal("codeModal"))

    // Profile actions
    document.getElementById("logoutBtn").addEventListener("click", handleLogout)
    document.getElementById("adminBtn").addEventListener("click", () => UI.showView("adminView"))
    document.getElementById("settingsBtn").addEventListener("click", () => UI.showView("settingsView"))

    // Admin actions
    document.getElementById("backFromAdmin").addEventListener("click", () => UI.showView("profileView"))
    document.getElementById("usersTab").addEventListener("click", () => showAdminTab("users"))
    document.getElementById("coursesTab").addEventListener("click", () => showAdminTab("courses"))
    document.getElementById("exportUsersBtn").addEventListener("click", exportData)

    // Settings actions
    document.getElementById("backFromSettings").addEventListener("click", () => UI.showView("profileView"))
    document.getElementById("disableZoomToggle").addEventListener("change", updateSettings)
    document.getElementById("themeSelect").addEventListener("change", updateSettings)
    document.getElementById("developerToggle").addEventListener("change", toggleDeveloperMode)
    document.getElementById("downloadDataBtn").addEventListener("click", exportData)
    document.getElementById("resetDataBtn").addEventListener("click", () => {
        if (confirm("This will reset all data. Are you sure?")) {
            Storage.clear()
            seedDemoData()
        }
    })

    // Search
    document.getElementById("searchInput").addEventListener("input", handleSearch)

    // Disable interactions based on settings
    setupInteractionDisabling()
}

async function handleLogin(e) {
    e.preventDefault()

    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value

    try {
        await login(email, password)
        UI.hideModal("loginModal")
        loadHomeView()
        updateUserProfile()
    } catch (error) {
        UI.showError(error.message)
    }
}

async function handleSignup(e) {
    e.preventDefault()

    const name = document.getElementById("signupName").value
    const email = document.getElementById("signupEmail").value
    const password = document.getElementById("signupPassword").value

    try {
        await signup(name, email, password)
        UI.hideModal("signupModal")
        loadHomeView()
        updateUserProfile()
    } catch (error) {
        UI.showError(error.message)
    }
}

function handleLogout() {
    logout()
    UI.showModal("loginModal")
    UI.showView("homeView")
}

function loadHomeView() {
  const courses = Storage.get("ek_app_courses") || []
  const publishedCourses = courses.filter((c) => c.published)

  const courseList = document.getElementById("courseList")
  courseList.innerHTML = ""

  publishedCourses.forEach((course) => {
    const card = UI.createCourseCard(course)
    courseList.appendChild(card)
  })
}

function updateUserProfile() {
  const user = getCurrentUser()
  if (!user) return

  document.getElementById("userName").textContent = user.name
  document.getElementById("userEmail").textContent = user.email

  // Update avatar if available
  if (user.avatar) {
    document.getElementById("userAvatar").style.backgroundImage = `url(${user.avatar})`
    document.getElementById("userAvatar").style.backgroundSize = "cover"
  }
}

function updateSettings() {
  const settings = {
    disableZoom: document.getElementById("disableZoomToggle").checked,
    theme: document.getElementById("themeSelect").value,
  }

  Storage.set("ek_app_settings", settings)
  applySettings()
}

function toggleDeveloperMode() {
  const isEnabled = document.getElementById("developerToggle").checked
  const section = document.getElementById("developerSection")

  if (isEnabled) {
    section.classList.remove("hidden")
    updateLocalStorageDisplay()
  } else {
    section.classList.add("hidden")
  }
}


function handleSearch(e) {
  const query = e.target.value.toLowerCase()
  const courses = Storage.get("ek_app_courses") || []
  const results = courses.filter(
    (course) =>
      course.published &&
      (course.title.toLowerCase().includes(query) || course.description.toLowerCase().includes(query)),
  )

  const container = document.getElementById("searchResults")
  container.innerHTML = ""

  if (query.length === 0) {
    container.innerHTML = '<p class="text-gray-600 text-center py-8">Start typing to search courses</p>'
    return
  }

  if (results.length === 0) {
    container.innerHTML = '<p class="text-gray-600 text-center py-8">No courses found</p>'
    return
  }

  results.forEach((course) => {
    const card = UI.createCourseCard(course)
    container.appendChild(card)
  })
}

function loadSearchView() {
  // Search functionality is handled by handleSearch function
}

function applySettings() {
  const settings = Storage.get("ek_app_settings") || { disableZoom: true, theme: "light" }

  document.getElementById("disableZoomToggle").checked = settings.disableZoom
  document.getElementById("themeSelect").value = settings.theme

  // Apply theme
  if (settings.theme === "dark") {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    const users = Storage.get("ek_app_users") || []
    const filteredUsers = users.filter((u) => u.id !== userId)
    Storage.set("ek_app_users", filteredUsers)

    // Also remove user's enrollments
    const enrollments = Storage.get("ek_app_enrollments") || []
    const filteredEnrollments = enrollments.filter((e) => e.userId !== userId)
    Storage.set("ek_app_enrollments", filteredEnrollments)

    loadUsersManagement()
  }
}


function deleteCourse(courseId) {
  if (confirm("Are you sure you want to delete this course?")) {
    const courses = Storage.get("ek_app_courses") || []
    const filteredCourses = courses.filter((c) => c.id !== courseId)
    Storage.set("ek_app_courses", filteredCourses)

    // Also remove course enrollments
    const enrollments = Storage.get("ek_app_enrollments") || []
    const filteredEnrollments = enrollments.filter((e) => e.courseId !== courseId)
    Storage.set("ek_app_enrollments", filteredEnrollments)

    loadCoursesManagement()
  }
}


function updateLocalStorageDisplay() {
  const data = {
    users: Storage.get("ek_app_users") || [],
    courses: Storage.get("ek_app_courses") || [],
    enrollments: Storage.get("ek_app_enrollments") || [],
    session: Storage.get("ek_app_session") || {},
    settings: Storage.get("ek_app_settings") || {},
  }

  document.getElementById("localStorageData").textContent = JSON.stringify(data, null, 2)
}

function loadMyCoursesView() {
  const user = getCurrentUser()
  if (!user) return

  const enrollments = Storage.get("ek_app_enrollments") || []
  const courses = Storage.get("ek_app_courses") || []
  const userEnrollments = enrollments.filter((e) => e.userId === user.id)

  const container = document.getElementById("enrolledCourses")
  container.innerHTML = ""

  if (userEnrollments.length === 0) {
    container.innerHTML = '<p class="text-gray-600 text-center py-8">No enrolled courses yet</p>'
    return
  }

  userEnrollments.forEach((enrollment) => {
    const course = courses.find((c) => c.id === enrollment.courseId)
    if (course) {
      const card = UI.createCourseCard(course, false)

      // Add progress indicator
      const progressDiv = document.createElement("div")
      progressDiv.className = "px-4 pb-4"

      const completedLessons = Object.values(enrollment.progress).filter(Boolean).length
      const totalLessons = course.lessons.length
      const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

      progressDiv.innerHTML = `
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>${completedLessons}/${totalLessons} lessons</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-brand rounded-full h-2" style="width: ${progressPercent}%"></div>
                </div>
            `

      card.appendChild(progressDiv)
      container.appendChild(card)
    }
  })
}

function loadProfileView() {
  updateUserProfile()

  const user = getCurrentUser()
  if (user && user.isAdmin) {
    document.getElementById("adminBtn").classList.remove("hidden")
  } else {
    document.getElementById("adminBtn").classList.add("hidden")
  }
}
window.showCourseDetail = showCourseDetail
window.toggleUserBlock = toggleUserBlock
window.deleteUser = deleteUser
window.deleteCourse = deleteCourse
window.editCourse = editCourse
window.enrollInCourse = enrollInCourse
window.showCodeModal = showCodeModal
window.purchaseCourse = purchaseCourse
window.getCurrentUser = getCurrentUser
window.loadMyCoursesView = loadMyCoursesView

function setupInteractionDisabling() {
    // Right-click prevention
    document.addEventListener("contextmenu", (e) => {
        const settings = Storage.get("ek_app_settings") || {}
        if (settings.disableZoom) {
            e.preventDefault()
        }
    })

    // Zoom prevention
    window.addEventListener(
        "wheel",
        (e) => {
            if (e.ctrlKey) {
                const settings = Storage.get("ek_app_settings") || {}
                if (settings.disableZoom) {
                    e.preventDefault()
                }
            }
        },
        { passive: false },
    )

    // Keyboard zoom prevention
    document.addEventListener("keydown", (e) => {
        const settings = Storage.get("ek_app_settings") || {}
        if (settings.disableZoom && e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "0")) {
            e.preventDefault()
        }
    })
}