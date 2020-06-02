let configPanel = document.getElementById("config-panel")

const EditTool = {
    ...Tool,

    pointX: -1,
    pointY: -1,
    drawing: false,

    currentBox: undefined,
    hoverBox: null,

    _selection: null,
    set selection(box) {
        this._selection = box;
        if (this.selection != null) {
            let config = box[4]

            configPanel.style.display = "block";
            configPanel.style.opacity = 1;
            configPanel.querySelector("input#config-name").value = config.name;
            configPanel.querySelector("select").querySelector("option[value=" + config.type + "]").selected = true;
        } else {
            configPanel.style.opacity = 0;
        }
    },
    get selection() {
        return this._selection;
    },

    get currentConfig() {
        return {
            name: configPanel.querySelector("input#config-name").value,
            type: configPanel.querySelector("select").value
        }
    },

    onmousedown(e) {
        if (this.hoverBox == null) {
            this.pointX = e.clientX - this.canvas.offsetLeft;
            this.pointY = e.clientY - this.canvas.offsetTop;
            this.drawing = true;
        } else {
            this.selection = this.hoverBox
        }
    },

    onmousemove(e) {
        let x = e.clientX - this.canvas.offsetLeft;
        let y = e.clientY - this.canvas.offsetTop;

        let found = false
        this.hoverBox = null
        boxes.forEach((box) => {
            if ((x > box[0] && x < (box[2] + box[0])) && (y > box[1] && y < (box[3] + box[1])) && !found) {
                this.hoverBox = box;
                found = true;
            }
        });

        if (found && !this.drawing) canvas.style.cursor = "url(./assets/icons/config.png) 2 2, default";
        else canvas.style.cursor = this.cursor

        if (this.drawing) {
            this.currentBox = [this.pointX, this.pointY, x - this.pointX, y - this.pointY];

            renderBoxes()
            this.ctx.fillStyle = "#eb773440";
            this.ctx.fillRect(...this.currentBox);
            this.ctx.strokeStyle = "#eb7734";
            this.ctx.strokeRect(...this.currentBox);
        }
    },

    onmouseup() {
        if (!this.drawing || this.currentBox[2] == undefined) return;

        this.drawing = false;

        if (this.currentBox[2] < 0) {
            this.currentBox[0] += this.currentBox[2]
            this.currentBox[2] = Math.abs(this.currentBox[2])
        }
        if (this.currentBox[3] < 0) {
            this.currentBox[1] += this.currentBox[3]
            this.currentBox[3] = Math.abs(this.currentBox[3])
        }

        boxes.unshift(this.currentBox.concat([{name: "Box " + (boxes.length + 1), type: "none"}]));
        this.currentBox = undefined;

        renderBoxes();
    },

    onmouseleave() {
        if (this.drawing) this.onmouseup()
    },

    applyConfig() {
        let config = this.currentConfig

        this.selection[4].name = config.name || "Box " + (boxes.length);
        this.selection[4].type = config.type;
        this.selection = null;
        renderBoxes();
    },

    onremove() {
        this.selection = null;
    },

    cursor: "url(./assets/icons/edit.png) 2 16, default"
}