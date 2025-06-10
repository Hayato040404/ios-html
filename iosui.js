// iOSUI.js - iOS-like UI Library for Web
class iOSUI {
  constructor() {
    this.dialogs = []
    this.actionSheets = []
    this.toasts = []
    this.init()
  }

  init() {
    // Add base class to body
    document.body.classList.add("ios-ui")

    // Create toast container
    this.createToastContainer()
  }

  // Dialog/Alert methods
  showAlert(options = {}) {
    const { title = "", message = "", buttons = [{ text: "OK", style: "primary" }] } = options

    return new Promise((resolve) => {
      const overlay = document.createElement("div")
      overlay.className = "ios-dialog-overlay"

      const dialog = document.createElement("div")
      dialog.className = "ios-dialog"

      const content = document.createElement("div")
      content.className = "ios-dialog-content"

      if (title) {
        const titleEl = document.createElement("div")
        titleEl.className = "ios-dialog-title"
        titleEl.textContent = title
        content.appendChild(titleEl)
      }

      if (message) {
        const messageEl = document.createElement("div")
        messageEl.className = "ios-dialog-message"
        messageEl.textContent = message
        content.appendChild(messageEl)
      }

      const actions = document.createElement("div")
      actions.className = "ios-dialog-actions"

      buttons.forEach((button, index) => {
        const btn = document.createElement("button")
        btn.className = `ios-dialog-button ${button.style || ""}`
        btn.textContent = button.text
        btn.onclick = () => {
          this.hideDialog(overlay)
          resolve(index)
        }
        actions.appendChild(btn)
      })

      dialog.appendChild(content)
      dialog.appendChild(actions)
      overlay.appendChild(dialog)
      document.body.appendChild(overlay)

      // Show with animation
      setTimeout(() => overlay.classList.add("show"), 10)

      this.dialogs.push(overlay)
    })
  }

  showConfirm(options = {}) {
    const { title = "Confirm", message = "Are you sure?", confirmText = "OK", cancelText = "Cancel" } = options

    return this.showAlert({
      title,
      message,
      buttons: [
        { text: cancelText, style: "" },
        { text: confirmText, style: "primary" },
      ],
    }).then((result) => result === 1)
  }

  hideDialog(overlay) {
    overlay.classList.remove("show")
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
      }
      const index = this.dialogs.indexOf(overlay)
      if (index > -1) {
        this.dialogs.splice(index, 1)
      }
    }, 300)
  }

  // Action Sheet methods
  showActionSheet(options = {}) {
    const { title = "", message = "", buttons = [], cancelButton = { text: "Cancel" } } = options

    return new Promise((resolve) => {
      const overlay = document.createElement("div")
      overlay.className = "ios-action-sheet-overlay"

      const sheet = document.createElement("div")
      sheet.className = "ios-action-sheet"

      if (title || message) {
        const header = document.createElement("div")
        header.className = "ios-action-sheet-header"

        if (title) {
          const titleEl = document.createElement("div")
          titleEl.className = "ios-action-sheet-title"
          titleEl.textContent = title
          header.appendChild(titleEl)
        }

        if (message) {
          const messageEl = document.createElement("div")
          messageEl.className = "ios-action-sheet-message"
          messageEl.textContent = message
          header.appendChild(messageEl)
        }

        sheet.appendChild(header)
      }

      buttons.forEach((button, index) => {
        const btn = document.createElement("button")
        btn.className = `ios-action-sheet-button ${button.style || ""}`
        btn.textContent = button.text
        btn.onclick = () => {
          this.hideActionSheet(overlay)
          resolve(index)
        }
        sheet.appendChild(btn)
      })

      if (cancelButton) {
        const cancelBtn = document.createElement("button")
        cancelBtn.className = "ios-action-sheet-button cancel"
        cancelBtn.textContent = cancelButton.text
        cancelBtn.onclick = () => {
          this.hideActionSheet(overlay)
          resolve(-1)
        }
        sheet.appendChild(cancelBtn)
      }

      overlay.appendChild(sheet)
      document.body.appendChild(overlay)

      // Show with animation
      setTimeout(() => overlay.classList.add("show"), 10)

      // Close on overlay click
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          this.hideActionSheet(overlay)
          resolve(-1)
        }
      }

      this.actionSheets.push(overlay)
    })
  }

  hideActionSheet(overlay) {
    overlay.classList.remove("show")
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
      }
      const index = this.actionSheets.indexOf(overlay)
      if (index > -1) {
        this.actionSheets.splice(index, 1)
      }
    }, 300)
  }

  // Toast methods
  createToastContainer() {
    if (!document.getElementById("ios-toast-container")) {
      const container = document.createElement("div")
      container.id = "ios-toast-container"
      document.body.appendChild(container)
    }
  }

  showToast(message, duration = 2000) {
    const toast = document.createElement("div")
    toast.className = "ios-toast"
    toast.textContent = message

    document.body.appendChild(toast)

    // Show with animation
    setTimeout(() => toast.classList.add("show"), 10)

    // Hide after duration
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast)
        }
      }, 300)
    }, duration)

    this.toasts.push(toast)
  }

  // Utility methods
  createElement(tag, className, content) {
    const element = document.createElement(tag)
    if (className) element.className = className
    if (content) element.textContent = content
    return element
  }

  // List methods
  createList(items = []) {
    const list = document.createElement("div")
    list.className = "ios-list"

    items.forEach((item) => {
      const listItem = document.createElement("div")
      listItem.className = "ios-list-item"

      const content = document.createElement("div")
      content.className = "ios-list-item-content"

      if (item.title) {
        const title = document.createElement("div")
        title.className = "ios-list-item-title"
        title.textContent = item.title
        content.appendChild(title)
      }

      if (item.subtitle) {
        const subtitle = document.createElement("div")
        subtitle.className = "ios-list-item-subtitle"
        subtitle.textContent = item.subtitle
        content.appendChild(subtitle)
      }

      if (item.detail) {
        const detail = document.createElement("div")
        detail.className = "ios-list-item-detail"
        detail.textContent = item.detail
        content.appendChild(detail)
      }

      listItem.appendChild(content)

      if (item.chevron !== false) {
        const chevron = document.createElement("span")
        chevron.className = "ios-list-item-chevron"
        chevron.textContent = "›"
        listItem.appendChild(chevron)
      }

      if (item.onClick) {
        listItem.onclick = item.onClick
      }

      list.appendChild(listItem)
    })

    return list
  }

  // Card methods
  createCard(options = {}) {
    const { title, content, className } = options

    const card = document.createElement("div")
    card.className = `ios-card ${className || ""}`

    if (title) {
      const titleEl = document.createElement("div")
      titleEl.className = "ios-card-title"
      titleEl.textContent = title
      card.appendChild(titleEl)
    }

    if (content) {
      const contentEl = document.createElement("div")
      contentEl.className = "ios-card-content"
      if (typeof content === "string") {
        contentEl.textContent = content
      } else {
        contentEl.appendChild(content)
      }
      card.appendChild(contentEl)
    }

    return card
  }
}

// Global instance
window.iosUI = new iOSUI()

// Convenience methods
window.iosAlert = (title, message) => window.iosUI.showAlert({ title, message })
window.iosConfirm = (title, message) => window.iosUI.showConfirm({ title, message })
window.iosToast = (message, duration) => window.iosUI.showToast(message, duration)
window.iosActionSheet = (options) => window.iosUI.showActionSheet(options)
