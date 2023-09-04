module.exports = {
    output: "dist/Trilium-MarkdownPreview.zip",
    notes: {
        title: "Markdown Preview",
        file: "src/widget.js",
        attributes: {
            "#widget": "",
            "#label:syntaxHighlighting": "promoted,single,boolean",
            "#syntaxHighlighting": "true"
        },
        children: [
            {type: "file", file: "lib/highlight.min.js"},
            {type: "file", file: "lib/marked.min.js"},
            {file: "src/styles.css"}
        ]
    }
};