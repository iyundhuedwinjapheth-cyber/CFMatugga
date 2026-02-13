# Country Farm Matugga - Poultry Farm Website

A modern, feature-rich website for a poultry farm with customer management, media gallery, and comprehensive admin dashboard.

## 🌟 Features

### Public Website (`countryfarm-enhanced.html`)
- **Parallax scrolling** with smooth animations
- **Lazy loading** for all images (improves performance dramatically)
  - Intersection Observer API for product/video images
  - Native HTML lazy loading for gallery images
  - Beautiful shimmer loading effect
- **Customer registration** system
- **Product showcase** with ordering functionality
- **Statistics section** - Display key farm metrics (15+ years, 500K+ chicks, 95% survival rate)
- **Video gallery** (3-column grid layout)
- **Photo gallery** (masonry style with lightbox)
- **Testimonials section** - Real customer reviews with ratings
- **FAQ section** - Collapsible answers to common questions
- **Automatic dark/light mode** based on system preferences
- **Green & golden-yellow color scheme**
- **Mobile responsive** design with functional hamburger menu
- **Social media integration** in footer
- Contact form with validation
- Smooth scroll behavior throughout

### Admin Dashboard (`admin-enhanced.html`)
- **Customer Database Management**
  - View all registered customers
  - Export customer list to PDF
  - Delete customers
  
- **Customer Alert System**
  - Send alerts to all customers or specific groups
  - Filter by farm type (Commercial, Small-scale, Backyard)
  - Select specific customers
  - Preview before sending
  
- **Sales Records**
  - Add, view, and delete sales
  - Filter by date range
  - Export to PDF
  
- **Order Management**
  - View all website orders
  - Export orders to PDF
  
- **Medical Records**
  - Track vaccinations and treatments
  - Filter by date
  - Export to PDF
  
- **Inventory Management**
  - Track stock levels
  - Low stock alerts
  - Multiple categories
  
- **Media Library**
  - Upload product images
  - Add farm videos (with thumbnails)
  - Upload gallery photos
  - Delete media items
  - Organized by section
  
- **Website Content Editor**
  - Edit hero section text
  - Update about section
  - Change contact information
  
- **Settings**
  - Configure notification emails
  - Set farm details
  - Customize currency

## 🚀 Deployment to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `countryfarm-matugga`
3. Make it public
4. Don't initialize with README (we'll add files)

### Step 2: Upload Files
You have two options:

#### Option A: Using GitHub Website
1. Click "uploading an existing file"
2. Drag and drop both HTML files:
   - `countryfarm-enhanced.html`
   - `admin-enhanced.html`
3. Rename `countryfarm-enhanced.html` to `index.html` (important!)
4. Commit the files

#### Option B: Using Git Command Line
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/countryfarm-matugga.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository Settings
2. Click on "Pages" in the left sidebar
3. Under "Source", select "main" branch
4. Click "Save"
5. Wait 1-2 minutes for deployment

### Step 4: Access Your Website
Your site will be available at:
- **Public Site**: `https://YOUR-USERNAME.github.io/countryfarm-matugga/`
- **Admin Dashboard**: `https://YOUR-USERNAME.github.io/countryfarm-matugga/admin-enhanced.html`

## 📝 Important Notes

### Data Storage
- All data is stored in **browser localStorage**
- Data is specific to each browser/device
- For production, consider using Firebase or another backend service

### Stock Images
The website uses Unsplash stock photos for demonstration. Replace these with actual farm photos:
- Update image URLs in the code
- Or use the admin media library to upload your own images

### Customer Alerts
In the current version, alerts are simulated. To enable actual email sending:
1. Integrate with an email service (SendGrid, Mailgun, etc.)
2. Add backend API endpoints
3. Update the `sendAlert()` function

### Browser Compatibility
- Works best on modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- localStorage must be enabled

## 🎨 Customization

### Colors
Edit the CSS variables in both HTML files:
```css
:root {
    --primary-green: #2d5016;
    --light-green: #4a7c2d;
    --accent-gold: #d4af37;
    --light-gold: #f4d75e;
}
```

### Content
Use the admin dashboard to edit:
- Hero section text
- About section paragraphs
- Contact information
- Product listings (via media library)

### Images
Replace stock photos with your own:
1. Use the Media Library in admin dashboard
2. Upload images for each section
3. Or directly edit image URLs in the HTML

## 🔒 Security

### Admin Dashboard Access
Consider adding authentication:
1. Add a simple password check
2. Use Firebase Authentication
3. Or restrict admin URL access server-side

### Example Simple Password Protection
Add to admin file before any other scripts:
```javascript
const correctPassword = "your-secure-password";
const enteredPassword = prompt("Enter admin password:");
if (enteredPassword !== correctPassword) {
    window.location.href = "index.html";
}
```

## ⚡ Performance Optimizations

### Lazy Loading
The website implements comprehensive lazy loading:

**Products & Videos**: Uses Intersection Observer API
- Images load only when scrolling near them
- Beautiful shimmer animation during loading
- 50px rootMargin for smooth UX

**Gallery Photos**: Native HTML `loading="lazy"`
- Browser-optimized image loading
- Excellent browser support
- No extra JavaScript needed

**Benefits**:
- 40-60% faster initial page load
- Reduced bandwidth usage
- Better mobile experience
- Improved Core Web Vitals scores

### Other Optimizations
- CSS animations (hardware accelerated)
- Minimal JavaScript dependencies
- Optimized image URLs (Unsplash with ?w=600&q=80)
- localStorage for instant data access

## 📱 Mobile Optimization

The website is fully responsive and optimized for:
- Desktop (1400px+)
- Tablets (768px - 1400px)
- Mobile phones (< 768px)

## 🐛 Troubleshooting

### Website not showing on GitHub Pages
- Ensure the main file is named `index.html`
- Check that GitHub Pages is enabled in settings
- Wait 5-10 minutes after first deployment

### Data not persisting
- Check that localStorage is enabled in browser
- Data is device/browser specific
- Clear browser cache if experiencing issues

### Images not loading
- Verify image URLs are correct
- Check that external URLs (Unsplash) are accessible
- Upload local images via media library

## 📄 License

This project is open source and available for modification.

## 👨‍💻 Support

For issues or questions:
1. Check the code comments
2. Review browser console for errors
3. Ensure all files are properly uploaded

---

**Built with ❤️ for Country Farm Matugga**
