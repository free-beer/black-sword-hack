/**
 * This function can be called to initialize all collapsible widgets within a
 * section of HTML. The container parameter defaults to the entire document if
 * not explicitly stated.
 */
export function initializeCollapsibles(container=document) {
    let widgets = container.querySelectorAll(".collapsible-widget");

    for(var i = 0; i < widgets.length; i++) {
        let widget   = widgets[i];
        let toggle   = widget.querySelector(".collapsible-widget-toggle");
        let target   = widget.querySelector(".collapsible-widget-target");
        let expanded = (widget.dataset.expanded === "true");
        let icons    = toggle.querySelectorAll(".collapsible-widget-icon");

        toggle.addEventListener("click", (e) => onCollapsibleToggleClicked(e, toggle, target));
        if(expanded) {
            icons[0].classList.add("bsh-hidden");
            icons[1].classList.remove("bsh-hidden");
            target.classList.remove("bsh-hidden");
        } else {
            icons[0].classList.remove("bsh-hidden");
            icons[1].classList.add("bsh-hidden");
            target.classList.add("bsh-hidden");
        }
    }
}

function onCollapsibleToggleClicked(event, toggle, container) {
    let icons = toggle.querySelectorAll(".collapsible-widget-icon");

    if(container.classList.contains("bsh-hidden")) {
        container.classList.remove("bsh-hidden");
        icons[0].classList.add("bsh-hidden");
        icons[1].classList.remove("bsh-hidden");
    } else {
        container.classList.add("bsh-hidden");
        icons[0].classList.remove("bsh-hidden");
        icons[1].classList.add("bsh-hidden");
    }
}
