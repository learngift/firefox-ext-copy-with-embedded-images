# Copy with Embedded Images

A Firefox extension that copies any HTML selection with all images converted to
base64 data URIs — so when you paste into a rich text editor, images appear
inline instead of showing as broken links.

## Why?

When you copy content from a web page (e.g. a Gmail message) and paste it into
a rich text editor like TinyMCE, CKEditor or Quill, images are usually lost or
show as broken links. This is because the image URLs often require
authentication (e.g. Gmail attachments) or are blocked by CORS policies.

This extension solves the problem by fetching every image in your selection
**from the page's own context** (so authentication cookies are included) and
converting them to self-contained base64 data URIs before placing the result in
your clipboard.

## Usage

1. Select any text and images on a web page
2. Right-click → **"Copy with Embedded Images"**
3. A toast notification confirms how many images were embedded
4. Paste into any rich text editor — images are fully embedded

## Permissions

- **Access your data for all websites** (`<all_urls>`): required to fetch images
  from any domain using the page's own authentication cookies. No data is sent
  to any server — everything happens locally in your browser.
- **Input data to the clipboard** (`clipboardWrite`): required to write the
  processed HTML to your clipboard.
- **contextMenus**: required to add the right-click menu entry.

## License

MIT
