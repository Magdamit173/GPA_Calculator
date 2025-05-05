function confirmPopUp(dialogue, cancelDialogue, confirmDialogue, ...callbackDialogue) {
    return (async () => {
        if (active_popup) return

        let condition = false

        const popups_wrapper = document.createElement("div")
        popups_wrapper.setAttribute("class", "popups_wrapper")
        popups_wrapper.setAttribute("data-popups_wrapper", "")

        const popup_label = document.createElement("div")
        popup_label.setAttribute("class", "popup_label")
        popup_label.setAttribute("data-popup_label", "")
        popup_label.textContent = dialogue || "<empty>"

        const popup_cancel = document.createElement("button")
        popup_cancel.setAttribute("class", "popup_cancel")
        popup_cancel.setAttribute("data-popup_cancel", "")
        popup_cancel.textContent = cancelDialogue || `Cancel`

        const popup_confirm = document.createElement("button")
        popup_confirm.setAttribute("class", "popup_confirm")
        popup_confirm.setAttribute("data-popup_confirm", "")
        popup_confirm.textContent = confirmDialogue || `Confirm`

        popups_wrapper.append(popup_label)
        popups_wrapper.append(popup_cancel)
        popups_wrapper.append(popup_confirm)

        document.body.append(popups_wrapper)
        active_popup = popups_wrapper

        callbackDialogue.forEach((callback) => {
            const popup_misc = document.createElement("button")
            popup_misc.setAttribute("class", "popup_misc ")
            popup_misc.setAttribute("data-popup_misc", "")
            popup_misc.textContent = `Yes`

            popups_wrapper.append(popup_misc)

            popup_misc.addEventListener("click", () => {
                callback()
                popups_wrapper.remove()
            })
        })

        await new Promise(resolve => {
            popup_cancel.addEventListener("click", () => {
                active_popup = null
                condition = false
                popups_wrapper.remove()
                resolve()
            })

            popup_confirm.addEventListener("click", () => {
                active_popup = null
                condition = true
                popups_wrapper.remove()
                resolve()
            })
        })
        return condition
    })()
}