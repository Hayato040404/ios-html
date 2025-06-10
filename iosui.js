// iOSUI.js - iOS-like UI Library for Web
class iOSUI {
  constructor() {
    this.dialogs = []
    this.actionSheets = []
    this.toasts = []
    this.banners = []
    this.notifications = []
    this.contextMenus = []
    this.modals = []
    this.popovers = []
    this.datePickers = []
    this.pickers = []
    this.language = "en"
    this.translations = {
      en: {
        "common.ok": "OK",
        "common.cancel": "Cancel",
        "common.done": "Done",
        "common.delete": "Delete",
        "common.save": "Save",
        "common.edit": "Edit",
        "common.search": "Search",
        "common.close": "Close",
        "common.back": "Back",
        "common.next": "Next",
        "common.loading": "Loading...",
        "common.error": "Error",
        "common.success": "Success",
        "common.warning": "Warning",
        "common.info": "Information",
        "dialog.confirm": "Are you sure?",
        "dialog.prompt": "Enter value",
        "dialog.alert": "Alert",
        "picker.done": "Done",
        "picker.cancel": "Cancel",
      },
      ja: {
        "common.ok": "OK",
        "common.cancel": "キャンセル",
        "common.done": "完了",
        "common.delete": "削除",
        "common.save": "保存",
        "common.edit": "編集",
        "common.search": "検索",
        "common.close": "閉じる",
        "common.back": "戻る",
        "common.next": "次へ",
        "common.loading": "読み込み中...",
        "common.error": "エラー",
        "common.success": "成功",
        "common.warning": "警告",
        "common.info": "情報",
        "dialog.confirm": "本当によろしいですか？",
        "dialog.prompt": "値を入力",
        "dialog.alert": "アラート",
        "picker.done": "完了",
        "picker.cancel": "キャンセル",
      },
    }
    this.init()
  }

  init() {
    // Add base class to body
    document.body.classList.add("ios-ui")

    // Create toast container
    this.createToastContainer()

    // Initialize pull-to-refresh
    this.initPullToRefresh()

    // Set language based on browser preference
    this.setLanguage(navigator.language.split("-")[0] || "en")
  }

  // Internationalization methods
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.language = lang
    } else {
      this.language = "en" // Default to English
    }
  }

  t(key) {
    return this.translations[this.language][key] || this.translations["en"][key] || key
  }

  addTranslations(lang, translations) {
    if (!this.translations[lang]) {
      this.translations[lang] = {}
    }

    Object.assign(this.translations[lang], translations)
  }

  // Dialog/Alert methods
  showAlert(options = {}) {
    const { title = "", message = "", buttons = [{ text: this.t("common.ok"), style: "primary" }] } = options

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
    const {
      title = this.t("dialog.confirm"),
      message = "",
      confirmText = this.t("common.ok"),
      cancelText = this.t("common.cancel"),
    } = options

    return this.showAlert({
      title,
      message,
      buttons: [
        { text: cancelText, style: "" },
        { text: confirmText, style: "primary" },
      ],
    }).then((result) => result === 1)
  }

  showPrompt(options = {}) {
    const {
      title = this.t("dialog.prompt"),
      message = "",
      placeholder = "",
      defaultValue = "",
      confirmText = this.t("common.ok"),
      cancelText = this.t("common.cancel"),
    } = options

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

      const inputContainer = document.createElement("div")
      inputContainer.style.margin = "16px 0"

      const input = document.createElement("input")
      input.className = "ios-input"
      input.type = "text"
      input.placeholder = placeholder
      input.value = defaultValue
      inputContainer.appendChild(input)
      content.appendChild(inputContainer)

      const actions = document.createElement("div")
      actions.className = "ios-dialog-actions"

      const cancelBtn = document.createElement("button")
      cancelBtn.className = "ios-dialog-button"
      cancelBtn.textContent = cancelText
      cancelBtn.onclick = () => {
        this.hideDialog(overlay)
        resolve(null)
      }
      actions.appendChild(cancelBtn)

      const confirmBtn = document.createElement("button")
      confirmBtn.className = "ios-dialog-button primary"
      confirmBtn.textContent = confirmText
      confirmBtn.onclick = () => {
        this.hideDialog(overlay)
        resolve(input.value)
      }
      actions.appendChild(confirmBtn)

      dialog.appendChild(content)
      dialog.appendChild(actions)
      overlay.appendChild(dialog)
      document.body.appendChild(overlay)

      // Show with animation
      setTimeout(() => {
        overlay.classList.add("show")
        input.focus()
      }, 10)

      this.dialogs.push(overlay)
    })
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
    const { title = "", message = "", buttons = [], cancelButton = { text: this.t("common.cancel") } } = options

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

        if (button.icon) {
          const iconSpan = document.createElement("span")
          iconSpan.textContent = button.icon
          iconSpan.style.marginRight = "8px"
          btn.appendChild(iconSpan)
        }

        const textSpan = document.createElement("span")
        textSpan.textContent = button.text
        btn.appendChild(textSpan)

        btn.onclick = () => {
          this.hideActionSheet(overlay)
          resolve(index)
          if (button.onClick) button.onClick()
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

  showToast(message, duration = 2000, position = "center") {
    const toast = document.createElement("div")
    toast.className = `ios-toast ios-toast-${position}`
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

  // Banner notification methods
  showBanner(options = {}) {
    const { title = "", message = "", icon = "", duration = 5000, onClick = null } = options

    const banner = document.createElement("div")
    banner.className = "ios-banner"

    if (onClick) {
      banner.style.cursor = "pointer"
      banner.addEventListener("click", () => {
        this.hideBanner(banner)
        onClick()
      })
    }

    const content = document.createElement("div")
    content.className = "ios-banner-content"

    if (icon) {
      const iconEl = document.createElement("div")
      iconEl.className = "ios-banner-icon"
      iconEl.textContent = icon
      banner.appendChild(iconEl)
    }

    if (title) {
      const titleEl = document.createElement("div")
      titleEl.className = "ios-banner-title"
      titleEl.textContent = title
      content.appendChild(titleEl)
    }

    if (message) {
      const messageEl = document.createElement("div")
      messageEl.className = "ios-banner-message"
      messageEl.textContent = message
      content.appendChild(messageEl)
    }

    banner.appendChild(content)

    // Add close button
    const closeBtn = document.createElement("button")
    closeBtn.className = "ios-banner-close"
    closeBtn.innerHTML = "×"
    closeBtn.onclick = (e) => {
      e.stopPropagation()
      this.hideBanner(banner)
    }
    banner.appendChild(closeBtn)

    document.body.appendChild(banner)

    // Show with animation
    setTimeout(() => banner.classList.add("show"), 10)

    // Hide after duration
    if (duration > 0) {
      setTimeout(() => {
        this.hideBanner(banner)
      }, duration)
    }

    this.banners.push(banner)
    return banner
  }

  hideBanner(banner) {
    banner.classList.remove("show")
    setTimeout(() => {
      if (banner.parentNode) {
        banner.parentNode.removeChild(banner)
      }
      const index = this.banners.indexOf(banner)
      if (index > -1) {
        this.banners.splice(index, 1)
      }
    }, 300)
  }

  // In-app notification methods
  showNotification(options = {}) {
    const { title = "", message = "", type = "default", duration = 5000, actions = [], onDismiss = null } = options

    const notification = document.createElement("div")
    notification.className = `ios-notification ios-notification-${type}`

    const content = document.createElement("div")
    content.className = "ios-notification-content"

    if (title) {
      const titleEl = document.createElement("div")
      titleEl.className = "ios-notification-title"
      titleEl.textContent = title
      content.appendChild(titleEl)
    }

    if (message) {
      const messageEl = document.createElement("div")
      messageEl.className = "ios-notification-message"
      messageEl.textContent = message
      content.appendChild(messageEl)
    }

    notification.appendChild(content)

    if (actions.length > 0) {
      const actionsContainer = document.createElement("div")
      actionsContainer.className = "ios-notification-actions"

      actions.forEach((action) => {
        const btn = document.createElement("button")
        btn.className = `ios-notification-action ${action.style || ""}`
        btn.textContent = action.text
        btn.onclick = (e) => {
          e.stopPropagation()
          this.hideNotification(notification)
          if (action.onClick) action.onClick()
        }
        actionsContainer.appendChild(btn)
      })

      notification.appendChild(actionsContainer)
    }

    document.body.appendChild(notification)

    // Show with animation
    setTimeout(() => notification.classList.add("show"), 10)

    // Hide after duration
    if (duration > 0) {
      setTimeout(() => {
        this.hideNotification(notification)
        if (onDismiss) onDismiss()
      }, duration)
    }

    this.notifications.push(notification)
    return notification
  }

  hideNotification(notification) {
    notification.classList.remove("show")
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
      const index = this.notifications.indexOf(notification)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    }, 300)
  }

  // Context menu methods
  showContextMenu(options = {}) {
    const { x = 0, y = 0, items = [] } = options

    // Hide any existing context menus
    this.contextMenus.forEach((menu) => this.hideContextMenu(menu))

    const menu = document.createElement("div")
    menu.className = "ios-context-menu"
    menu.style.left = `${x}px`
    menu.style.top = `${y}px`

    items.forEach((item) => {
      const menuItem = document.createElement("div")
      menuItem.className = `ios-context-menu-item ${item.destructive ? "destructive" : ""}`

      if (item.icon) {
        const iconEl = document.createElement("span")
        iconEl.className = "ios-context-menu-icon"
        iconEl.textContent = item.icon
        menuItem.appendChild(iconEl)
      }

      const textEl = document.createElement("span")
      textEl.className = "ios-context-menu-text"
      textEl.textContent = item.text
      menuItem.appendChild(textEl)

      menuItem.onclick = () => {
        this.hideContextMenu(menu)
        if (item.onClick) item.onClick()
      }

      menu.appendChild(menuItem)
    })

    document.body.appendChild(menu)

    // Adjust position if menu goes off screen
    const menuRect = menu.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    if (menuRect.right > windowWidth) {
      menu.style.left = `${windowWidth - menuRect.width - 10}px`
    }

    if (menuRect.bottom > windowHeight) {
      menu.style.top = `${windowHeight - menuRect.height - 10}px`
    }

    // Show with animation
    setTimeout(() => menu.classList.add("show"), 10)

    // Close on document click
    const closeHandler = (e) => {
      if (!menu.contains(e.target)) {
        this.hideContextMenu(menu)
        document.removeEventListener("click", closeHandler)
      }
    }

    setTimeout(() => {
      document.addEventListener("click", closeHandler)
    }, 10)

    this.contextMenus.push(menu)
    return menu
  }

  hideContextMenu(menu) {
    menu.classList.remove("show")
    setTimeout(() => {
      if (menu.parentNode) {
        menu.parentNode.removeChild(menu)
      }
      const index = this.contextMenus.indexOf(menu)
      if (index > -1) {
        this.contextMenus.splice(index, 1)
      }
    }, 300)
  }

  // Modal methods
  showModal(options = {}) {
    const { title = "", content = "", size = "medium", dismissible = true, onClose = null } = options

    const overlay = document.createElement("div")
    overlay.className = "ios-modal-overlay"

    const modal = document.createElement("div")
    modal.className = `ios-modal ios-modal-${size}`

    const header = document.createElement("div")
    header.className = "ios-modal-header"

    if (title) {
      const titleEl = document.createElement("div")
      titleEl.className = "ios-modal-title"
      titleEl.textContent = title
      header.appendChild(titleEl)
    }

    if (dismissible) {
      const closeBtn = document.createElement("button")
      closeBtn.className = "ios-modal-close"
      closeBtn.innerHTML = "×"
      closeBtn.onclick = () => {
        this.hideModal(overlay)
        if (onClose) onClose()
      }
      header.appendChild(closeBtn)
    }

    modal.appendChild(header)

    const contentContainer = document.createElement("div")
    contentContainer.className = "ios-modal-content"

    if (typeof content === "string") {
      contentContainer.innerHTML = content
    } else {
      contentContainer.appendChild(content)
    }

    modal.appendChild(contentContainer)
    overlay.appendChild(modal)
    document.body.appendChild(overlay)

    // Show with animation
    setTimeout(() => overlay.classList.add("show"), 10)

    // Close on overlay click if dismissible
    if (dismissible) {
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          this.hideModal(overlay)
          if (onClose) onClose()
        }
      }
    }

    this.modals.push(overlay)
    return overlay
  }

  hideModal(overlay) {
    overlay.classList.remove("show")
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
      }
      const index = this.modals.indexOf(overlay)
      if (index > -1) {
        this.modals.splice(index, 1)
      }
    }, 300)
  }

  // Popover methods
  showPopover(options = {}) {
    const { anchor, content, direction = "top", arrow = true } = options

    if (!anchor) return null

    const anchorRect = anchor.getBoundingClientRect()
    const popover = document.createElement("div")
    popover.className = `ios-popover ios-popover-${direction}`

    const contentContainer = document.createElement("div")
    contentContainer.className = "ios-popover-content"

    if (typeof content === "string") {
      contentContainer.textContent = content
    } else {
      contentContainer.appendChild(content)
    }

    popover.appendChild(contentContainer)

    if (arrow) {
      const arrowEl = document.createElement("div")
      arrowEl.className = "ios-popover-arrow"
      popover.appendChild(arrowEl)
    }

    document.body.appendChild(popover)

    // Position the popover
    const popoverRect = popover.getBoundingClientRect()
    let left, top

    switch (direction) {
      case "top":
        left = anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2
        top = anchorRect.top - popoverRect.height - 10
        break
      case "bottom":
        left = anchorRect.left + anchorRect.width / 2 - popoverRect.width / 2
        top = anchorRect.bottom + 10
        break
      case "left":
        left = anchorRect.left - popoverRect.width - 10
        top = anchorRect.top + anchorRect.height / 2 - popoverRect.height / 2
        break
      case "right":
        left = anchorRect.right + 10
        top = anchorRect.top + anchorRect.height / 2 - popoverRect.height / 2
        break
    }

    // Adjust position if popover goes off screen
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    if (left < 10) left = 10
    if (left + popoverRect.width > windowWidth - 10) left = windowWidth - popoverRect.width - 10
    if (top < 10) top = 10
    if (top + popoverRect.height > windowHeight - 10) top = windowHeight - popoverRect.height - 10

    popover.style.left = `${left}px`
    popover.style.top = `${top}px`

    // Show with animation
    setTimeout(() => popover.classList.add("show"), 10)

    // Close on document click
    const closeHandler = (e) => {
      if (!popover.contains(e.target) && e.target !== anchor) {
        this.hidePopover(popover)
        document.removeEventListener("click", closeHandler)
      }
    }

    setTimeout(() => {
      document.addEventListener("click", closeHandler)
    }, 10)

    this.popovers.push(popover)
    return popover
  }

  hidePopover(popover) {
    popover.classList.remove("show")
    setTimeout(() => {
      if (popover.parentNode) {
        popover.parentNode.removeChild(popover)
      }
      const index = this.popovers.indexOf(popover)
      if (index > -1) {
        this.popovers.splice(index, 1)
      }
    }, 300)
  }

  // Date picker methods
  showDatePicker(options = {}) {
    const { mode = "date", value = new Date(), onSelect = null, onCancel = null } = options

    const overlay = document.createElement("div")
    overlay.className = "ios-picker-overlay"

    const picker = document.createElement("div")
    picker.className = "ios-date-picker"

    const toolbar = document.createElement("div")
    toolbar.className = "ios-picker-toolbar"

    const cancelBtn = document.createElement("button")
    cancelBtn.className = "ios-picker-button"
    cancelBtn.textContent = this.t("picker.cancel")
    cancelBtn.onclick = () => {
      this.hideDatePicker(overlay)
      if (onCancel) onCancel()
    }
    toolbar.appendChild(cancelBtn)

    const titleEl = document.createElement("div")
    titleEl.className = "ios-picker-title"
    titleEl.textContent = mode === "date" ? "Select Date" : mode === "time" ? "Select Time" : "Select Date & Time"
    toolbar.appendChild(titleEl)

    const doneBtn = document.createElement("button")
    doneBtn.className = "ios-picker-button done"
    doneBtn.textContent = this.t("picker.done")
    toolbar.appendChild(doneBtn)

    picker.appendChild(toolbar)

    const pickerContent = document.createElement("div")
    pickerContent.className = "ios-picker-content"

    // Create date/time picker based on mode
    const selectedDate = new Date(value)

    let dateContainer
    let timeContainer
    const currentYear = new Date().getFullYear()

    if (mode === "date" || mode === "datetime") {
      dateContainer = document.createElement("div")
      dateContainer.className = "ios-date-columns"

      // Month column
      const monthColumn = this.createPickerColumn(
        Array.from({ length: 12 }, (_, i) => {
          const date = new Date(2000, i, 1)
          return date.toLocaleString(this.language, { month: "long" })
        }),
        selectedDate.getMonth(),
      )
      dateContainer.appendChild(monthColumn)

      // Day column
      const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate()
      const dayColumn = this.createPickerColumn(
        Array.from({ length: daysInMonth }, (_, i) => String(i + 1)),
        selectedDate.getDate() - 1,
      )
      dateContainer.appendChild(dayColumn)

      // Year column
      const yearColumn = this.createPickerColumn(
        Array.from({ length: 101 }, (_, i) => String(currentYear - 50 + i)),
        50 + (selectedDate.getFullYear() - currentYear),
      )
      dateContainer.appendChild(yearColumn)

      pickerContent.appendChild(dateContainer)
    }

    if (mode === "time" || mode === "datetime") {
      timeContainer = document.createElement("div")
      timeContainer.className = "ios-time-columns"

      // Hour column
      const hourColumn = this.createPickerColumn(
        Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")),
        selectedDate.getHours(),
      )
      timeContainer.appendChild(hourColumn)

      // Minute column
      const minuteColumn = this.createPickerColumn(
        Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")),
        selectedDate.getMinutes(),
      )
      timeContainer.appendChild(minuteColumn)

      pickerContent.appendChild(timeContainer)
    }

    picker.appendChild(pickerContent)
    overlay.appendChild(picker)
    document.body.appendChild(overlay)

    // Show with animation
    setTimeout(() => overlay.classList.add("show"), 10)

    // Handle done button click
    doneBtn.onclick = () => {
      const result = new Date(selectedDate)

      if (mode === "date" || mode === "datetime") {
        const dateColumns = dateContainer.querySelectorAll(".ios-picker-column")
        const monthIndex = this.getSelectedIndex(dateColumns[0])
        const dayIndex = this.getSelectedIndex(dateColumns[1])
        const yearIndex = this.getSelectedIndex(dateColumns[2])

        const year = currentYear - 50 + yearIndex
        const month = monthIndex
        const day = dayIndex + 1

        result.setFullYear(year)
        result.setMonth(month)
        result.setDate(day)
      }

      if (mode === "time" || mode === "datetime") {
        const timeColumns = timeContainer.querySelectorAll(".ios-picker-column")
        const hourIndex = this.getSelectedIndex(timeColumns[0])
        const minuteIndex = this.getSelectedIndex(timeColumns[1])

        result.setHours(hourIndex)
        result.setMinutes(minuteIndex)
      }

      this.hideDatePicker(overlay)
      if (onSelect) onSelect(result)
    }

    this.datePickers.push(overlay)
    return overlay
  }

  hideDatePicker(overlay) {
    overlay.classList.remove("show")
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
      }
      const index = this.datePickers.indexOf(overlay)
      if (index > -1) {
        this.datePickers.splice(index, 1)
      }
    }, 300)
  }

  // Custom picker methods
  showPicker(options = {}) {
    const { columns = [], selectedIndexes = [], onSelect = null, onCancel = null } = options

    const overlay = document.createElement("div")
    overlay.className = "ios-picker-overlay"

    const picker = document.createElement("div")
    picker.className = "ios-picker"

    const toolbar = document.createElement("div")
    toolbar.className = "ios-picker-toolbar"

    const cancelBtn = document.createElement("button")
    cancelBtn.className = "ios-picker-button"
    cancelBtn.textContent = this.t("picker.cancel")
    cancelBtn.onclick = () => {
      this.hidePicker(overlay)
      if (onCancel) onCancel()
    }
    toolbar.appendChild(cancelBtn)

    const titleEl = document.createElement("div")
    titleEl.className = "ios-picker-title"
    titleEl.textContent = " "
    toolbar.appendChild(titleEl)

    const doneBtn = document.createElement("button")
    doneBtn.className = "ios-picker-button done"
    doneBtn.textContent = this.t("picker.done")
    toolbar.appendChild(doneBtn)

    picker.appendChild(toolbar)

    const pickerContent = document.createElement("div")
    pickerContent.className = "ios-picker-content"

    // Create columns
    columns.forEach((column, colIndex) => {
      const columnEl = this.createPickerColumn(column, selectedIndexes[colIndex] || 0)
      pickerContent.appendChild(columnEl)
    })

    picker.appendChild(pickerContent)
    overlay.appendChild(picker)
    document.body.appendChild(overlay)

    // Show with animation
    setTimeout(() => overlay.classList.add("show"), 10)

    // Handle done button click
    doneBtn.onclick = () => {
      const columnEls = pickerContent.querySelectorAll(".ios-picker-column")
      const selectedIndices = Array.from(columnEls).map((col) => this.getSelectedIndex(col))
      const selectedValues = selectedIndices.map((index, colIndex) => columns[colIndex][index])

      this.hidePicker(overlay)
      if (onSelect) onSelect(selectedIndices, selectedValues)
    }

    this.pickers.push(overlay)
    return overlay
  }

  hidePicker(overlay) {
    overlay.classList.remove("show")
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
      }
      const index = this.pickers.indexOf(overlay)
      if (index > -1) {
        this.pickers.splice(index, 1)
      }
    }, 300)
  }

  createPickerColumn(items, selectedIndex = 0) {
    const column = document.createElement("div")
    column.className = "ios-picker-column"

    const itemHeight = 44 // Height of each item in pixels

    // Add padding items at top and bottom for scrolling effect
    const paddingItems = 3 // Number of padding items on each side

    // Add top padding items
    for (let i = 0; i < paddingItems; i++) {
      const item = document.createElement("div")
      item.className = "ios-picker-item padding"
      item.innerHTML = "&nbsp;"
      column.appendChild(item)
    }

    // Add actual items
    const actualItems = items.map((item, index) => {
      const itemEl = document.createElement("div")
      itemEl.className = "ios-picker-item"
      itemEl.textContent = item
      itemEl.dataset.index = index
      return itemEl
    })
    actualItems.forEach((itemEl) => column.appendChild(itemEl))

    // Add bottom padding items
    for (let i = 0; i < paddingItems; i++) {
      const item = document.createElement("div")
      item.className = "ios-picker-item padding"
      item.innerHTML = "&nbsp;"
      column.appendChild(item)
    }

    // Set initial scroll position
    setTimeout(() => {
      column.scrollTop = selectedIndex * itemHeight
    }, 0)

    // Handle scrolling
    let isDragging = false

    column.addEventListener("scroll", () => {
      if (!isDragging) return

      const scrollTop = column.scrollTop
      const index = Math.round(scrollTop / itemHeight)

      // Update selected item
      const items = column.querySelectorAll(".ios-picker-item:not(.padding)")
      items.forEach((item, i) => {
        item.classList.toggle("selected", i === index)
      })
    })

    column.addEventListener("mousedown", () => {
      isDragging = true
    })

    column.addEventListener("touchstart", () => {
      isDragging = true
    })

    const endDrag = () => {
      if (!isDragging) return
      isDragging = false

      const scrollTop = column.scrollTop
      const index = Math.round(scrollTop / itemHeight)

      // Snap to closest item
      column.scrollTo({
        top: index * itemHeight,
        behavior: "smooth",
      })
    }

    column.addEventListener("mouseup", endDrag)
    column.addEventListener("touchend", endDrag)
    document.addEventListener("mouseup", endDrag)
    document.addEventListener("touchend", endDrag)

    // Set initial selected item
    const items = column.querySelectorAll(".ios-picker-item:not(.padding)")
    if (items[selectedIndex]) {
      items[selectedIndex].classList.add("selected")
    }

    return column
  }

  getSelectedIndex(column) {
    const scrollTop = column.scrollTop
    const itemHeight = 44
    return Math.round(scrollTop / itemHeight)
  }

  // Progress indicators
  createProgressBar(options = {}) {
    const { value = 0, showPercentage = false, animated = false } = options

    const container = document.createElement("div")
    container.className = "ios-progress-container"

    const progressBar = document.createElement("div")
    progressBar.className = `ios-progress-bar ${animated ? "animated" : ""}`

    const progressFill = document.createElement("div")
    progressFill.className = "ios-progress-fill"
    progressFill.style.width = `${Math.min(100, Math.max(0, value * 100))}%`
    progressBar.appendChild(progressFill)

    container.appendChild(progressBar)

    if (showPercentage) {
      const percentage = document.createElement("div")
      percentage.className = "ios-progress-percentage"
      percentage.textContent = `${Math.round(value * 100)}%`
      container.appendChild(percentage)
    }

    return container
  }

  updateProgress(progressBar, value) {
    const fill = progressBar.querySelector(".ios-progress-fill")
    const percentage = progressBar.parentNode.querySelector(".ios-progress-percentage")

    if (fill) {
      fill.style.width = `${Math.min(100, Math.max(0, value * 100))}%`
    }

    if (percentage) {
      percentage.textContent = `${Math.round(value * 100)}%`
    }
  }

  createCircularProgress(options = {}) {
    const { value = 0, size = 40, strokeWidth = 4, showPercentage = false } = options

    const container = document.createElement("div")
    container.className = "ios-circular-progress"
    container.style.width = `${size}px`
    container.style.height = `${size}px`

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", size)
    svg.setAttribute("height", size)
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`)

    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    // Background circle
    const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    bgCircle.setAttribute("cx", size / 2)
    bgCircle.setAttribute("cy", size / 2)
    bgCircle.setAttribute("r", radius)
    bgCircle.setAttribute("fill", "none")
    bgCircle.setAttribute("stroke", "var(--ios-gray5)")
    bgCircle.setAttribute("stroke-width", strokeWidth)
    svg.appendChild(bgCircle)

    // Progress circle
    const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    progressCircle.setAttribute("cx", size / 2)
    progressCircle.setAttribute("cy", size / 2)
    progressCircle.setAttribute("r", radius)
    progressCircle.setAttribute("fill", "none")
    progressCircle.setAttribute("stroke", "var(--ios-blue)")
    progressCircle.setAttribute("stroke-width", strokeWidth)
    progressCircle.setAttribute("stroke-dasharray", circumference)
    progressCircle.setAttribute("stroke-dashoffset", circumference * (1 - value))
    progressCircle.setAttribute("transform", `rotate(-90 ${size / 2} ${size / 2})`)
    svg.appendChild(progressCircle)

    container.appendChild(svg)

    if (showPercentage) {
      const percentage = document.createElement("div")
      percentage.className = "ios-circular-percentage"
      percentage.textContent = `${Math.round(value * 100)}%`
      percentage.style.fontSize = `${size / 4}px`
      container.appendChild(percentage)
    }

    return container
  }

  updateCircularProgress(circularProgress, value) {
    const svg = circularProgress.querySelector("svg")
    const progressCircle = svg.querySelector("circle:nth-child(2)")
    const percentage = circularProgress.querySelector(".ios-circular-percentage")

    if (progressCircle) {
      const size = Number.parseInt(svg.getAttribute("width"))
      const strokeWidth = Number.parseInt(progressCircle.getAttribute("stroke-width"))
      const radius = (size - strokeWidth) / 2
      const circumference = 2 * Math.PI * radius

      progressCircle.setAttribute("stroke-dashoffset", circumference * (1 - value))
    }

    if (percentage) {
      percentage.textContent = `${Math.round(value * 100)}%`
    }
  }

  createActivityIndicator(options = {}) {
    const { size = "medium", color = "blue" } = options

    const container = document.createElement("div")
    container.className = `ios-activity-indicator ios-activity-${size} ios-activity-${color}`

    for (let i = 0; i < 12; i++) {
      const line = document.createElement("div")
      line.className = "ios-activity-line"
      line.style.transform = `rotate(${i * 30}deg)`
      line.style.animationDelay = `${i * 0.08333}s`
      container.appendChild(line)
    }

    return container
  }

  showActivityIndicator(container) {
    container.classList.add("active")
  }

  hideActivityIndicator(container) {
    container.classList.remove("active")
  }

  // Stepper methods
  createStepper(options = {}) {
    const { min = 0, max = 10, value = 0, step = 1, onChange = null } = options

    const container = document.createElement("div")
    container.className = "ios-stepper"

    const decrementBtn = document.createElement("button")
    decrementBtn.className = "ios-stepper-button ios-stepper-decrement"
    decrementBtn.textContent = "-"
    decrementBtn.disabled = value <= min
    container.appendChild(decrementBtn)

    const valueDisplay = document.createElement("div")
    valueDisplay.className = "ios-stepper-value"
    valueDisplay.textContent = value
    container.appendChild(valueDisplay)

    const incrementBtn = document.createElement("button")
    incrementBtn.className = "ios-stepper-button ios-stepper-increment"
    incrementBtn.textContent = "+"
    incrementBtn.disabled = value >= max
    container.appendChild(incrementBtn)

    // Store current value
    container.dataset.value = value
    container.dataset.min = min
    container.dataset.max = max
    container.dataset.step = step

    // Handle button clicks
    decrementBtn.addEventListener("click", () => {
      const currentValue = Number.parseFloat(container.dataset.value)
      const stepValue = Number.parseFloat(container.dataset.step)
      const minValue = Number.parseFloat(container.dataset.min)

      if (currentValue > minValue) {
        const newValue = Math.max(minValue, currentValue - stepValue)
        this.updateStepper(container, newValue)

        if (onChange) onChange(newValue)
        this.haptic("light")
      }
    })

    incrementBtn.addEventListener("click", () => {
      const currentValue = Number.parseFloat(container.dataset.value)
      const stepValue = Number.parseFloat(container.dataset.step)
      const maxValue = Number.parseFloat(container.dataset.max)

      if (currentValue < maxValue) {
        const newValue = Math.min(maxValue, currentValue + stepValue)
        this.updateStepper(container, newValue)

        if (onChange) onChange(newValue)
        this.haptic("light")
      }
    })

    return container
  }

  updateStepper(stepper, value) {
    const minValue = Number.parseFloat(stepper.dataset.min)
    const maxValue = Number.parseFloat(stepper.dataset.max)
    const decrementBtn = stepper.querySelector(".ios-stepper-decrement")
    const incrementBtn = stepper.querySelector(".ios-stepper-increment")
    const valueDisplay = stepper.querySelector(".ios-stepper-value")

    // Update value
    stepper.dataset.value = value
    valueDisplay.textContent = value

    // Update button states
    decrementBtn.disabled = value <= minValue
    incrementBtn.disabled = value >= maxValue
  }

  // Search bar methods
  createSearchBar(options = {}) {
    const {
      placeholder = this.t("common.search"),
      showCancelButton = false,
      onSearch = null,
      onCancel = null,
    } = options

    const container = document.createElement("div")
    container.className = "ios-search-bar"

    const searchContainer = document.createElement("div")
    searchContainer.className = "ios-search-input-container"

    const searchIcon = document.createElement("span")
    searchIcon.className = "ios-search-icon"
    searchIcon.textContent = "🔍"
    searchContainer.appendChild(searchIcon)

    const input = document.createElement("input")
    input.className = "ios-search-input"
    input.type = "text"
    input.placeholder = placeholder
    searchContainer.appendChild(input)

    const clearButton = document.createElement("button")
    clearButton.className = "ios-search-clear"
    clearButton.textContent = "×"
    clearButton.style.display = "none"
    clearButton.onclick = () => {
      input.value = ""
      clearButton.style.display = "none"
      input.focus()
      if (onSearch) onSearch("")
    }
    searchContainer.appendChild(clearButton)

    container.appendChild(searchContainer)

    if (showCancelButton) {
      const cancelButton = document.createElement("button")
      cancelButton.className = "ios-search-cancel"
      cancelButton.textContent = this.t("common.cancel")
      cancelButton.onclick = () => {
        input.value = ""
        clearButton.style.display = "none"
        if (onCancel) onCancel()
      }
      container.appendChild(cancelButton)
    }

    // Handle input changes
    input.addEventListener("input", () => {
      clearButton.style.display = input.value ? "block" : "none"
    })

    // Handle search submission
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(input.value)
        input.blur()
      }
    })

    return container
  }

  // Page control methods
  createPageControl(options = {}) {
    const { numberOfPages = 3, currentPage = 0, onChange = null } = options

    const container = document.createElement("div")
    container.className = "ios-page-control"

    for (let i = 0; i < numberOfPages; i++) {
      const dot = document.createElement("div")
      dot.className = `ios-page-dot ${i === currentPage ? "active" : ""}`
      dot.onclick = () => {
        this.setActivePage(container, i)
        if (onChange) onChange(i)
      }
      container.appendChild(dot)
    }

    container.dataset.currentPage = currentPage

    return container
  }

  setActivePage(pageControl, index) {
    const dots = pageControl.querySelectorAll(".ios-page-dot")

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index)
    })

    pageControl.dataset.currentPage = index
  }

  // Pull to refresh
  initPullToRefresh() {
    const pullRefreshElements = document.querySelectorAll("[data-ios-pull-to-refresh]")

    pullRefreshElements.forEach((element) => {
      const handlerName = element.getAttribute("data-ios-pull-to-refresh")
      if (!handlerName || !window[handlerName]) return

      const refreshHandler = window[handlerName]

      // Create refresh indicator
      const indicator = document.createElement("div")
      indicator.className = "ios-pull-refresh-indicator"

      const spinner = document.createElement("div")
      spinner.className = "ios-pull-refresh-spinner"
      indicator.appendChild(spinner)

      const text = document.createElement("div")
      text.className = "ios-pull-refresh-text"
      text.textContent = "Pull to refresh"
      indicator.appendChild(text)

      element.insertBefore(indicator, element.firstChild)

      // Variables for tracking pull state
      let startY = 0
      let currentY = 0
      let refreshing = false
      const threshold = 80

      // Touch start event
      element.addEventListener("touchstart", (e) => {
        if (refreshing) return

        // Only trigger if at top of scroll area
        if (element.scrollTop <= 0) {
          startY = e.touches[0].clientY
          currentY = startY
        }
      })

      // Touch move event
      element.addEventListener("touchmove", (e) => {
        if (refreshing) return

        if (element.scrollTop <= 0) {
          currentY = e.touches[0].clientY
          const pullDistance = currentY - startY

          if (pullDistance > 0) {
            // Prevent default scrolling
            e.preventDefault()

            // Calculate progress (0 to 1)
            const progress = Math.min(pullDistance / threshold, 1)

            // Update indicator
            indicator.style.transform = `translateY(${pullDistance * 0.5}px)`
            spinner.style.transform = `rotate(${progress * 360}deg)`

            // Update text based on progress
            if (progress >= 1) {
              text.textContent = "Release to refresh"
            } else {
              text.textContent = "Pull to refresh"
            }
          }
        }
      })

      // Touch end event
      element.addEventListener("touchend", () => {
        if (refreshing) return

        const pullDistance = currentY - startY

        if (pullDistance > threshold) {
          // Start refreshing
          refreshing = true

          // Show loading state
          indicator.classList.add("refreshing")
          indicator.style.transform = `translateY(${threshold * 0.5}px)`
          text.textContent = "Refreshing..."

          // Call refresh handler
          refreshHandler()
            .then(() => {
              // Reset after refresh completes
              refreshing = false
              indicator.classList.remove("refreshing")
              indicator.style.transform = "translateY(-100%)"

              // Haptic feedback
              this.haptic("success")
            })
            .catch(() => {
              // Handle error
              refreshing = false
              indicator.classList.remove("refreshing")
              indicator.style.transform = "translateY(-100%)"

              // Haptic feedback
              this.haptic("error")
            })
        } else {
          // Reset if not past threshold
          indicator.style.transform = "translateY(-100%)"
        }
      })
    })
  }

  // Haptic feedback
  haptic(type) {
    if (!window.navigator.vibrate) return

    switch (type) {
      case "light":
        window.navigator.vibrate(10)
        break
      case "medium":
        window.navigator.vibrate(20)
        break
      case "heavy":
        window.navigator.vibrate(30)
        break
      case "success":
        window.navigator.vibrate([10, 30, 10])
        break
      case "error":
        window.navigator.vibrate([30, 10, 30])
        break
      default:
        window.navigator.vibrate(10)
    }
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

      // Handle accessory type
      if (item.accessory === "chevron") {
        const chevron = document.createElement("span")
        chevron.className = "ios-list-item-chevron"
        chevron.textContent = "›"
        listItem.appendChild(chevron)
      } else if (item.accessory === "switch") {
        const switchContainer = document.createElement("div")
        switchContainer.className = "ios-list-item-accessory"

        const switchEl = this.createSwitch({
          checked: item.switchValue || false,
          onChange: (e) => {
            if (item.onSwitchChange) item.onSwitchChange(e)
          },
        })

        switchContainer.appendChild(switchEl)
        listItem.appendChild(switchContainer)
      } else if (item.accessory) {
        const accessory = document.createElement("div")
        accessory.className = "ios-list-item-accessory-text"
        accessory.textContent = item.accessory
        listItem.appendChild(accessory)
      }

      if (item.onClick) {
        listItem.style.cursor = "pointer"
        listItem.addEventListener("click", item.onClick)
      }

      list.appendChild(listItem)
    })

    return list
  }

  // Switch methods
  createSwitch(options = {}) {
    const { id, checked = false, onChange = null } = options

    const label = document.createElement("label")
    label.className = "ios-switch"

    const input = document.createElement("input")
    input.type = "checkbox"
    input.checked = checked
    if (id) input.id = id

    const slider = document.createElement("span")
    slider.className = "ios-switch-slider"

    label.appendChild(input)
    label.appendChild(slider)

    if (onChange) {
      input.addEventListener("change", (e) => {
        onChange(e)
        this.haptic("light")
      })
    }

    return label
  }

  // Segmented control methods
  createSegmentedControl(options = {}) {
    const { id, segments = [], selectedIndex = 0, onChange = null } = options

    const container = document.createElement("div")
    container.className = "ios-segmented-control"
    if (id) container.id = id

    segments.forEach((segment, index) => {
      const button = document.createElement("button")
      button.className = `ios-segment ${index === selectedIndex ? "selected" : ""}`
      button.textContent = segment
      button.dataset.index = index

      button.addEventListener("click", () => {
        // Update selected segment
        container.querySelectorAll(".ios-segment").forEach((seg) => {
          seg.classList.remove("selected")
        })
        button.classList.add("selected")

        // Call onChange handler
        if (onChange) {
          const event = new CustomEvent("change", {
            detail: {
              selectedIndex: index,
              selectedSegment: button,
            },
          })
          onChange(event)
          this.haptic("light")
        }
      })

      container.appendChild(button)
    })

    return container
  }

  // Slider methods
  createSlider(options = {}) {
    const { id, min = 0, max = 100, value = 50, step = 1, showValue = false, onChange = null } = options

    const container = document.createElement("div")
    container.className = "ios-slider-container"

    const slider = document.createElement("input")
    slider.type = "range"
    slider.className = "ios-slider"
    slider.min = min
    slider.max = max
    slider.value = value
    slider.step = step
    if (id) slider.id = id

    container.appendChild(slider)

    if (showValue) {
      const valueDisplay = document.createElement("div")
      valueDisplay.className = "ios-slider-value"
      valueDisplay.textContent = value
      container.appendChild(valueDisplay)

      slider.addEventListener("input", () => {
        valueDisplay.textContent = slider.value
      })
    }

    if (onChange) {
      slider.addEventListener("input", () => {
        onChange(Number.parseInt(slider.value))
      })

      slider.addEventListener("change", () => {
        this.haptic("light")
      })
    }

    return container
  }

  // Navigation bar methods
  createNavigationBar(options = {}) {
    const { title = "", leftButton = null, rightButton = null } = options

    const navbar = document.createElement("div")
    navbar.className = "ios-navigation-bar"

    // Left button
    const leftContainer = document.createElement("div")
    leftContainer.className = "ios-nav-left"

    if (leftButton) {
      const leftBtn = document.createElement("button")
      leftBtn.className = "ios-nav-button"
      leftBtn.textContent = leftButton.text || ""

      if (leftButton.onClick) {
        leftBtn.addEventListener("click", () => {
          leftButton.onClick()
          this.haptic("light")
        })
      }

      leftContainer.appendChild(leftBtn)
    }

    navbar.appendChild(leftContainer)

    // Title
    const titleContainer = document.createElement("div")
    titleContainer.className = "ios-nav-title"
    titleContainer.textContent = title
    navbar.appendChild(titleContainer)

    // Right button
    const rightContainer = document.createElement("div")
    rightContainer.className = "ios-nav-right"

    if (rightButton) {
      const rightBtn = document.createElement("button")
      rightBtn.className = "ios-nav-button"
      rightBtn.textContent = rightButton.text || ""

      if (rightButton.onClick) {
        rightBtn.addEventListener("click", () => {
          rightButton.onClick()
          this.haptic("light")
        })
      }

      rightContainer.appendChild(rightBtn)
    }

    navbar.appendChild(rightContainer)

    return navbar
  }

  // Tab bar methods
  createTabBar(options = {}) {
    const { tabs = [], selectedIndex = 0, onChange = null } = options

    const tabbar = document.createElement("div")
    tabbar.className = "ios-tab-bar"

    tabs.forEach((tab, index) => {
      const tabItem = document.createElement("div")
      tabItem.className = `ios-tab-item ${index === selectedIndex ? "selected" : ""}`

      if (tab.icon) {
        const icon = document.createElement("div")
        icon.className = "ios-tab-icon"
        icon.textContent = tab.icon
        tabItem.appendChild(icon)
      }

      const label = document.createElement("div")
      label.className = "ios-tab-label"
      label.textContent = tab.label
      tabItem.appendChild(label)

      if (tab.badge) {
        const badge = document.createElement("div")
        badge.className = "ios-tab-badge"
        badge.textContent = tab.badge
        tabItem.appendChild(badge)
      }

      tabItem.addEventListener("click", () => {
        // Update selected tab
        tabbar.querySelectorAll(".ios-tab-item").forEach((item) => {
          item.classList.remove("selected")
        })
        tabItem.classList.add("selected")

        // Call onChange handler
        if (onChange) {
          onChange(index, tab)
          this.haptic("light")
        }
      })

      tabbar.appendChild(tabItem)
    })

    return tabbar
  }

  // Card methods
  createCard(options = {}) {
    const { title, content, footer, className } = options

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

    if (footer) {
      const footerEl = document.createElement("div")
      footerEl.className = "ios-card-footer"
      if (typeof footer === "string") {
        footerEl.textContent = footer
      } else {
        footerEl.appendChild(footer)
      }
      card.appendChild(footerEl)
    }

    return card
  }

  // Theme methods
  setTheme(options = {}) {
    const { primaryColor, backgroundColor, textColor, borderRadius, fontFamily } = options

    const style = document.createElement("style")
    style.id = "ios-custom-theme"

    let css = ":root {\n"

    if (primaryColor) css += `  --ios-blue: ${primaryColor};\n`
    if (backgroundColor) css += `  --ios-background: ${backgroundColor};\n`
    if (textColor) css += `  --ios-text-primary: ${textColor};\n`

    css += "}\n\n"

    if (borderRadius) {
      css += `.ios-button, .ios-card, .ios-list, .ios-input, .ios-textarea {
        border-radius: ${borderRadius} !important;
      }\n\n`
    }

    if (fontFamily) {
      css += `.ios-ui {
        font-family: ${fontFamily} !important;
      }\n`
    }

    style.textContent = css

    // Remove existing custom theme
    const existingTheme = document.getElementById("ios-custom-theme")
    if (existingTheme) {
      existingTheme.remove()
    }

    document.head.appendChild(style)
  }
}

// Global instance
window.iosUI = new iOSUI()

// Convenience methods
window.iosAlert = (title, message) => window.iosUI.showAlert({ title, message })
window.iosConfirm = (title, message) => window.iosUI.showConfirm({ title, message })
window.iosPrompt = (title, message, placeholder) => window.iosUI.showPrompt({ title, message, placeholder })
window.iosToast = (message, duration) => window.iosUI.showToast(message, duration)
window.iosActionSheet = (options) => window.iosUI.showActionSheet(options)
window.iosHaptic = (type) => window.iosUI.haptic(type)
