# Trilium-MarkdownPreview
A widget for trilium notes for live previewing markdown files with support for anchors, images, and sync scroll.

## Why?
I know Trilium isn't a markdown editor, but I still use markdown for other things like my GitHub READMEs and I like storing everything in one place--Trilium. The only problem was, I couldn't preview my markdown files, and that's super helpful to have before I go pushing a commit. After looking, I couldn't find an existing widget for it, so I decided to make my own.

## Preview
<!-- https://raw.githubusercontent.com/rauenzi/Trilium-MarkdownPreview/blob/main/LICENSE -->
![Banner](https://github.com/rauenzi/Trilium-MarkdownPreview/assets/6865942/93194c61-eee3-49fd-8ed8-970f1476539c)


## Features

- Preview markdown notes in real time
- Global and per-note styles
- Embed local images
- Clickable in-page anchor links
- Syncable scrollbars
- GFM-compliant with tables and more


## Installation

1. Create a new code note with `JS Frontend` type. Copy and paste [widget.js](https://github.com/rauenzi/Trilium-MarkdownPreview/blob/main/src/widget.js) into the note.
    - Be sure to add the `#widget` attribute to the note
1. Attach the [marked.min.js](https://github.com/rauenzi/Trilium-MarkdownPreview/blob/main/lib/marked.min.js) file to the note either via drag-n-drop or import.
1. (optional) Create one (or more) child code notes of `CSS` type and fill it with any global markdown styles.

### Syntax Highlighting (optional)
If you want your codeblocks to have syntax highlighting, follow these steps:

1. Attach the [highlight.min.js](https://github.com/rauenzi/Trilium-MarkdownPreview/blob/main/lib/highlight.min.js) file to the note either via drag-n-drop or import.
1. (optional) Attach the pre-made syntax styles from [styles.css](https://github.com/rauenzi/Trilium-MarkdownPreview/blob/main/src/styles.css) as a child note of the [main widget](#installation).


## Usage

Create a code note with markdown type. Then, to make a note previewable, simply add the `#markdownPreview` attribute to it. (You may have to switch notes afterward for the preview to appear.)

After that, just start writing in markdown on the code editor side. You'll see the preview update with you as you go.

If you're going to add any images or styles to the note, it can be annoying to see the preview cards at the bottom. You can hide those by adding the `#hideChildrenOverview` native to Trilium.

### Images
#### Local

To use a local image, attach the image as a child of the markdown note. You can then simply refer to it by filename.

#### Remote

Remote images can be attached just like any other image using the full url.

### Anchor Links

The actual heading anchors are created automatically and match GFM style. That means for complex headings you can have multiple `-` in a row. e.g. `Heading (subtext)` becomes `#heading--subtext-`.

From there you can create anchor links by linking them as `[link text](#heading-name)` replacing any special characters (and spaces) with `-`.

### Scroll Sync

By default, MarkdownPreview will try to keep the scroll bars in sync no matter which side you are scrolling. The widget is not perfect at keeping them exactly at the same place contextually because the rendering can be so different.

#### Disabling

You can disable the sync entirely by adding the `#markdownScrollSync` attribute with `none` as the value. You can also disable each side separately with `left` or `right`. For instance, if you want the preview to automatically scroll as you scroll the source, but not the other way around, then use `#markdownScrollSync=left`.

### Styling

Both the global and local styles are picked up and reapplied on note switch, so no need to keep reloading if you are tinkering with your styles!
#### Global
As mentioned in the [installation](#installation) section, any `CSS` note that is a child to the widget code will automatically be picked up and applied.

#### Local
Local styles are specific to the markdown note. Just make a `CSS` note as a child of the markdown note and it'll be picked up!

## Showcase

### Anchors
https://github.com/rauenzi/Trilium-MarkdownPreview/assets/6865942/dbf35c96-cd2e-4265-85bf-9cc977d44b18

### Local Styles
https://github.com/rauenzi/Trilium-MarkdownPreview/assets/6865942/1d41cbc7-c4f8-41ab-8ab3-6b7fb2bfa75b

### ScrollSync
https://github.com/rauenzi/Trilium-MarkdownPreview/assets/6865942/9ece0241-5f6a-4cbc-b911-26b0f95b7dff

### ScrollSync=left
https://github.com/rauenzi/Trilium-MarkdownPreview/assets/6865942/c58e6ab1-0ad8-4714-8aa8-e972a61c20db

