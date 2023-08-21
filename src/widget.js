/**
 * This widget allows you to preview any markdown code note in real time.
 */
const TPL = `<div style="padding: 10px; border-left: 0px solid var(--main-border-color); height: 100%;">
<style></style>
<div id="markdown-preview"></div>
</div>`;

/* global highlightminjs:false markedminjs:false */


// A couple of temporary hoists
let noteId = "";
const imageCache = {};


/** @type {import("highlight.js").default} */
let hljs;
try {
    hljs = highlightminjs;
    hljs.configure({cssSelector: "#markdown-preview pre code"});
}
catch {
    // eslint-disable-next-line no-console
    console.info("highlight.min.js not found, no syntax highlighting in markdown preview.");
}

/** @type {import("marked").Marked} */
const markedjs = markedminjs;

const slugify = text => text.toLowerCase().replace(/[^\w]/g, "-");
const renderer = {
  heading(text, level) {
    const escapedText = slugify(text);
    return `<h${level}>
              <a href="${escapedText}" id="${escapedText}" class="anchor">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${level}>`;
  },
    
    image(href, title, text) {
        const found = imageCache[noteId] && imageCache[noteId][href];
        if (found) href = `api/images/${found}/${href}`;
        return `<img src="${href}" title="${title}" alt="${text}">`;
    },
};

markedjs.use({renderer});


class MarkdownPreviewWidget extends api.RightPanelWidget {
    get widgetTitle() {return "Markdown Preview";}
    get parentWidget() {return "right-pane";}

    isEnabled() {
        return super.isEnabled()
            && this.note.type === "code"
            && this.note.mime
            && this.note.mime === "text/x-markdown"
            && this.note.hasLabel("markdownPreview");
    }

    async doRenderBody() {
        this.$body.html(TPL);
        this.$preview = this.$body.find("#markdown-preview");
        this.$body.on("click", "a", this.jumpToLink.bind(this));
        await this.updateCss();
        return this.$body;
    }

    async refreshWithNote(note) {
        const {content} = await note.getNoteComplement();
        this.$preview.html(markedjs.parse(content));
        hljs?.highlightAll?.();
    }

    async entitiesReloadedEvent({loadResults}) {
        if (loadResults.isNoteContentReloaded(this.noteId)) {
            this.refresh();
        }
    }
    
    async noteSwitched() {
        if (!this.note) return;
        noteId = this.note.noteId;
        await this.getImages();
        await this.updateCss();
        await this.refresh();

        if (!this.isEnabled()) return;
        const scrollSyncStatus = this.note.getLabelValue("markdownScrollSync");
        const disableBoth = scrollSyncStatus === "none";
        const onlyLeft = scrollSyncStatus === "left";
        const onlyRight = scrollSyncStatus === "right";
        
        $("#center-pane .CodeMirror-scroll, #center-pane .component.scrolling-container").off(".mdpreview");
        $("#right-pane").off(".mdpreview");
        if (disableBoth) return;
        
        const isFullHeight = document.querySelector(".note-detail.full-height");
        const centerSelector = isFullHeight ? "#center-pane .CodeMirror-scroll" : "#center-pane .component.scrolling-container";
        const center = document.querySelector(centerSelector);
        const right = document.querySelector("#right-pane");
        if (!onlyRight) this.addSyncListener(center, right, !onlyLeft);
        if (!onlyLeft) this.addSyncListener(right, center, !onlyRight);
    }
    
    async getImages() {
        const children = await this.note.getChildNotes();
        const images = children.filter(n => n.type === "image");
        imageCache[this.note.noteId] = {};
        for (const image of images) imageCache[this.note.noteId][image.title] = image.noteId;
    }
    
    jumpToLink(ev) {
        const link = ev.target;
        const href = link.getAttribute("href");
        const isAnchorLink = href.startsWith("#");
        if (!isAnchorLink) return;
        const heading = this.$body.find(href);
        if (!heading.length) return;
        heading[0].scrollIntoView({behavior: "instant", block: "start"});
    }
    
    addSyncListener(target, other, shouldRestart = true) {
        const jTarget = $(target);
        jTarget.on("scroll.mdpreview", (ev) => {
            $(other).off("scroll.mdpreview");
            this.syncedScroll(ev.target, other);
            clearTimeout($.data(jTarget, "scrollTimer"));
            $.data(jTarget, "scrollTimer", setTimeout(() => {
                if (shouldRestart) this.addSyncListener(other, target, shouldRestart);
            }, 250));
        });
    }
    
    syncedScroll(target, other) {
        const max = target.scrollHeight - target.clientHeight;
        const current = target.scrollTop;
        const percent = current / max;
        const maxPane = other.scrollHeight - other.clientHeight;
        const newScroll = (percent * maxPane);
        other.scrollTop = newScroll;
    }
    
    async updateCss() {
        let accumulator = "";

        const globalChildren = await api.startNote.getChildNotes();
        const globalStyles = globalChildren.filter(n => n.mime == "text/css");
        for (const style of globalStyles) accumulator += await style.getContent();

        if (this.note && this.isEnabled()) {
            const localChildren = await this.note.getChildNotes();
            const localStyles = localChildren.filter(n => n.mime == "text/css");
            for (const style of localStyles) accumulator += await style.getContent();
        }

        this.$body.find("style").html(accumulator);
    }
}

module.exports = new MarkdownPreviewWidget();