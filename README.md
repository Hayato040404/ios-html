# iOSUI.js

Beautiful iOS-like UI components for the web. Create native-looking iOS interfaces that work on any platform.

![iOSUI.js Demo](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/https___qiita-image-store.s3.ap-northeast-1.amazonaws.com_0_162131_42bd2d4d-4bbf-05f5-0d16-fdce2d867eda-tM1H77ClNM0nhvLCmcUJTMIG1sKWDI.avif)

## Features

- 📱 **iOS Design** - Pixel-perfect iOS interface components
- 🌙 **Dark Mode** - Automatic dark mode support
- 📦 **Lightweight** - Small bundle size, no dependencies
- ⚡ **Fast** - Optimized for performance
- 🎨 **Customizable** - Easy to customize and extend
- 📱 **Responsive** - Works great on all screen sizes

## Installation

### CDN

\`\`\`html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/iosui-js@1.0.0/iosui.css">
<script src="https://cdn.jsdelivr.net/npm/iosui-js@1.0.0/iosui.js"></script>
\`\`\`

### npm

\`\`\`bash
npm install iosui-js
\`\`\`

### Download

Download the latest release from [GitHub](https://github.com/yourusername/iosui-js/releases).

## Quick Start

\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="iosui.css">
</head>
<body>
    <div class="ios-container">
        <div class="ios-header">
            <h1 class="ios-header-title">My App</h1>
        </div>
        
        <div class="ios-list">
            <div class="ios-list-item">
                <div class="ios-list-item-content">
                    <div class="ios-list-item-title">Hello World</div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="iosui.js"></script>
</body>
</html>
\`\`\`

## Components

### Dialogs & Alerts

\`\`\`javascript
// Simple alert
iosAlert('Title', 'Message');

// Confirm dialog
iosConfirm('Confirm', 'Are you sure?').then(confirmed => {
    if (confirmed) {
        console.log('User confirmed');
    }
});

// Custom alert with multiple buttons
iosUI.showAlert({
    title: 'Choose Option',
    message: 'What would you like to do?',
    buttons: [
        { text: 'Cancel', style: '' },
        { text: 'Delete', style: 'destructive' },
        { text: 'Save', style: 'primary' }
    ]
}).then(buttonIndex => {
    console.log('Button clicked:', buttonIndex);
});
\`\`\`

### Action Sheets

\`\`\`javascript
iosActionSheet({
    title: 'Choose an action',
    buttons: [
        { text: 'Share' },
        { text: 'Copy' },
        { text: 'Delete', style: 'destructive' }
    ]
}).then(index => {
    console.log('Selected:', index);
});
\`\`\`

### Toast Notifications

\`\`\`javascript
// Simple toast
iosToast('Hello World!');

// Toast with custom duration
iosToast('Custom message', 5000);
\`\`\`

### Lists

\`\`\`html
<div class="ios-list">
    <div class="ios-list-item">
        <div class="ios-list-item-content">
            <div class="ios-list-item-title">Title</div>
            <div class="ios-list-item-subtitle">Subtitle</div>
            <div class="ios-list-item-detail">Detail</div>
        </div>
        <span class="ios-list-item-chevron">›</span>
    </div>
</div>
\`\`\`

### Buttons

\`\`\`html
<button class="ios-button">Primary</button>
<button class="ios-button secondary">Secondary</button>
<button class="ios-button destructive">Destructive</button>
<button class="ios-button small">Small</button>
<button class="ios-button large">Large</button>
\`\`\`

### Cards

\`\`\`html
<div class="ios-card">
    <div class="ios-card-title">Card Title</div>
    <div class="ios-card-content">Card content goes here.</div>
</div>
\`\`\`

### Form Elements

\`\`\`html
<input class="ios-input" placeholder="Text input">
<textarea class="ios-textarea" placeholder="Textarea"></textarea>
\`\`\`

### Badges

\`\`\`html
<span class="ios-badge">Default</span>
<span class="ios-badge red">Error</span>
<span class="ios-badge green">Success</span>
<span class="ios-badge orange">Warning</span>
\`\`\`

## JavaScript API

### iosUI Class

The main `iosUI` class provides methods for creating dynamic components:

\`\`\`javascript
// Create a list programmatically
const list = iosUI.createList([
    {
        title: 'Item 1',
        subtitle: 'Subtitle',
        onClick: () => console.log('Clicked!')
    }
]);

// Create a card programmatically
const card = iosUI.createCard({
    title: 'Card Title',
    content: 'Card content'
});
\`\`\`

## Customization

iOSUI.js uses CSS custom properties for easy customization:

\`\`\`css
:root {
    --ios-blue: #007AFF;
    --ios-red: #FF3B30;
    --ios-background: #F2F2F7;
    /* ... other variables */
}
\`\`\`

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- Basic components (buttons, lists, cards, dialogs)
- Dark mode support
- Toast notifications
- Action sheets
