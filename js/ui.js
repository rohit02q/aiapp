// UI utilities and components
let activeModal = null;
class UI {
  static showModal(modalId) {
    UI.hideModal(activeModal)
    document.getElementById(modalId).classList.remove("hidden")
    activeModal = modalId;
  }

  static hideModal(modalId) {
    if(modalId !== null){
      document.getElementById(modalId).classList.add("hidden")
    }
  }

  static showView(viewId) {
    // Hide all views
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.add("hidden")
    })

    // Show target view
    document.getElementById(viewId).classList.remove("hidden")

    // Update navigation
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active", "text-brand")
      item.classList.add("text-gray-600")
    })

    const activeNav = document.querySelector(`[data-view="${viewId}"]`)
    if (activeNav) {
      activeNav.classList.add("active", "text-brand")
      activeNav.classList.remove("text-gray-600")
    }
  }

  static showError(message) {
    // Simple error display - could be enhanced with toast notifications
    alert(message)
  }

  static showSuccess(message) {
    // Simple success display - could be enhanced with toast notifications
    alert(message)
  }

  static formatPrice(price) {
    if (price === 0) return "FREE"
    return `₹${price}`
  }

  static createCourseCard(course, showActions = true) {
    const card = document.createElement("div")
    card.className = "bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"

    const typeColor =
      course.type === "free"
        ? "bg-green-100 text-green-800"
        : course.type === "locked"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-blue-100 text-blue-800"

    card.innerHTML = `
            <div class="h-32 bg-gradient-to-br from-brand to-brand-accent"></div>
            <div class="p-4">
                <div class="flex items-start justify-between mb-2">
                    <h3 class="font-semibold text-gray-900 flex-1">${course.title}</h3>
                    <span class="px-2 py-1 text-xs rounded-full ${typeColor} ml-2">${course.type.toUpperCase()}</span>
                </div>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">${course.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-lg font-bold text-brand">${UI.formatPrice(course.price)}</span>
                    ${showActions ? `<button class="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium" onclick="showCourseDetail('${course.id}')">View</button>` : ""}
                </div>
            </div>
        `

    return card
  }

  static createUserCard(user) {
    const card = document.createElement("div")
    card.className = "bg-white rounded-xl p-4 shadow-sm border border-gray-200"

    card.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                        <p class="font-medium ${user.blocked ? "text-red-600" : "text-gray-900"}">${user.name}</p>
                        <p class="text-sm text-gray-600">${user.email}</p>
                        ${user.isAdmin ? '<span class="text-xs bg-brand text-white px-2 py-1 rounded">Admin</span>' : ""}
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button onclick="toggleUserBlock('${user.id}')" class="text-sm px-3 py-1 rounded ${user.blocked ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}">
                        ${user.blocked ? "Unblock" : "Block"}
                    </button>
                    <button onclick="deleteUser('${user.id}')" class="text-sm px-3 py-1 rounded bg-red-100 text-red-700">Delete</button>
                </div>
            </div>
        `

    return card
  }
}

// Course management functions
function showCourseDetail(courseId) {
  const courses = Storage.get("ek_app_courses") || []
  const course = courses.find((c) => c.id === courseId)

  if (!course) return

  document.getElementById("courseTitle").textContent = course.title
  document.getElementById("courseDescription").textContent = course.description
  document.getElementById("coursePrice").textContent = UI.formatPrice(course.price)

  const actionsContainer = document.getElementById("courseActions")
  actionsContainer.innerHTML = ""

  const user = window.getCurrentUser() // Assuming getCurrentUser is a global function
  if (!user) {
    actionsContainer.innerHTML =
      '<button onclick=" UI.showModal(\'loginModal\')" class="w-full bg-brand text-white py-3 rounded-xl font-semibold">Login to Enroll</button>'
  } else {
    const enrollments = Storage.get("ek_app_enrollments") || []
    const isEnrolled = enrollments.some((e) => e.userId === user.id && e.courseId === courseId)

    if (isEnrolled) {
      actionsContainer.innerHTML =
        '<button class="w-full bg-green-500 text-white py-3 rounded-xl font-semibold">Enrolled ✓</button>'
    } else {
      if (course.type === "free") {
        actionsContainer.innerHTML = `<button onclick="enrollInCourse('${courseId}')" class="w-full bg-brand text-white py-3 rounded-xl font-semibold">Enroll Now</button>`
      } else if (course.type === "locked") {
        actionsContainer.innerHTML = `<button onclick="showCodeModal('${courseId}')" class="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold">Enter Code</button>`
      } else {
        actionsContainer.innerHTML = `<button onclick="purchaseCourse('${courseId}')" class="w-full bg-brand text-white py-3 rounded-xl font-semibold">Purchase ${UI.formatPrice(course.price)}</button>`
      }
    }
  }
  UI.showModal("courseModal")
}

function enrollInCourse(courseId) {
  const user = window.getCurrentUser() // Assuming getCurrentUser is a global function
  if (!user) return

  const enrollments = Storage.get("ek_app_enrollments") || []
  const newEnrollment = {
    id: "e_" + Date.now(),
    userId: user.id,
    courseId: courseId,
    purchased: false,
    enrolledAt: new Date().toISOString(),
    progress: {},
  }

  enrollments.push(newEnrollment)
  Storage.set("ek_app_enrollments", enrollments)

  UI.hideModal("courseModal")
  UI.showSuccess("Successfully enrolled in course!")
  window.loadMyCoursesView() // Assuming loadMyCoursesView is a global function
}

function showCodeModal(courseId) {
  UI.hideModal("courseModal")
  UI.showModal("codeModal")

  document.getElementById("codeForm").onsubmit = (e) => {
    e.preventDefault()
    const code = document.getElementById("courseCode").value
    const courses = Storage.get("ek_app_courses") || []
    const course = courses.find((c) => c.id === courseId)

    if (course && course.entryCode === code) {
      enrollInCourse(courseId)
      UI.hideModal("codeModal")
    } else {
      UI.showError("Invalid course code")
    }
  }
}

function purchaseCourse(courseId) {
  // Simulate purchase
  const user = window.getCurrentUser() // Assuming getCurrentUser is a global function
  if (!user) return

  const enrollments = Storage.get("ek_app_enrollments") || []
  const newEnrollment = {
    id: "e_" + Date.now(),
    userId: user.id,
    courseId: courseId,
    purchased: true,
    enrolledAt: new Date().toISOString(),
    progress: {},
  }

  enrollments.push(newEnrollment)
  Storage.set("ek_app_enrollments", enrollments)

  UI.hideModal("courseModal")
  UI.showSuccess("Course purchased successfully!")
  window.loadMyCoursesView() // Assuming loadMyCoursesView is a global function
}

