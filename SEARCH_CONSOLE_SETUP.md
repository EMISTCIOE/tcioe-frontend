# How to Get Search Console Verification Codes

## Google Search Console Verification

### Step 1: Go to Google Search Console

1. Visit [Google Search Console](https://search.google.com/search-console/)
2. Sign in with your Google account

### Step 2: Add Your Property

1. Click "Add Property"
2. Choose "URL prefix" and enter your domain: `https://tcioe.edu.np`
3. Click "Continue"

### Step 3: Verify Ownership

Google will offer several verification methods. Choose **HTML meta tag**:

1. Select "HTML tag" method
2. Copy the content value from the meta tag
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```
3. Copy only the content part (YOUR_VERIFICATION_CODE)
4. Add it to your `.env.local` file:
   ```
   GOOGLE_VERIFICATION_ID=YOUR_VERIFICATION_CODE
   ```

### Alternative: HTML File Upload

1. Download the HTML file provided by Google
2. Upload it to your `public` folder
3. Verify by clicking "Verify" in Search Console

---

## Yandex Webmaster Verification

### Step 1: Go to Yandex Webmaster

1. Visit [Yandex Webmaster](https://webmaster.yandex.com/)
2. Sign in with your Yandex account (create one if needed)

### Step 2: Add Your Site

1. Click "Add site"
2. Enter your domain: `https://tcioe.edu.np`
3. Click "Add"

### Step 3: Verify Ownership

1. Choose "Meta tag" verification method
2. Copy the content value from the meta tag:
   ```html
   <meta name="yandex-verification" content="YOUR_YANDEX_CODE" />
   ```
3. Add it to your `.env.local` file:
   ```
   YANDEX_VERIFICATION_ID=YOUR_YANDEX_CODE
   ```

---

## Bing Webmaster Tools Verification

### Step 1: Go to Bing Webmaster Tools

1. Visit [Bing Webmaster Tools](https://www.bing.com/webmasters/)
2. Sign in with your Microsoft account

### Step 2: Add Your Site

1. Click "Add a site"
2. Enter your sitemap URL: `https://tcioe.edu.np/sitemap.xml`
3. Click "Add"

### Step 3: Verify Ownership

1. Choose "Add meta tag to your home page"
2. Copy the content value:
   ```html
   <meta name="msvalidate.01" content="YOUR_BING_CODE" />
   ```
3. Add it to your `.env.local` file:
   ```
   BING_VERIFICATION_ID=YOUR_BING_CODE
   ```

---

## Quick Setup Guide

### 1. Create `.env.local` file (copy from `.env.example`)

```bash
cp .env.example .env.local
```

### 2. Update the verification codes in `.env.local`

```bash
# Search Console Verification
GOOGLE_VERIFICATION_ID=your-actual-google-verification-code
YANDEX_VERIFICATION_ID=your-actual-yandex-verification-code
BING_VERIFICATION_ID=your-actual-bing-verification-code
```

### 3. Deploy your site

After adding the verification codes and deploying, go back to each search console and click "Verify"

---

## Benefits of Search Console Verification

### Google Search Console

- Monitor search performance
- Submit sitemaps
- Check indexing status
- Identify crawl errors
- Monitor Core Web Vitals
- Receive security issue alerts

### Yandex Webmaster

- Important for Russian/CIS markets
- Monitor Yandex search performance
- Submit sitemaps to Yandex
- Check indexing in Yandex

### Bing Webmaster Tools

- Monitor Bing search performance
- Submit sitemaps to Bing
- Access to Bing's SEO tools
- Important for users in certain regions

---

## Troubleshooting

### Verification Failed?

1. Make sure your site is live and accessible
2. Check that the meta tags are in the `<head>` section
3. Clear cache and try again
4. Wait a few minutes and retry verification

### Multiple Domains?

If you have multiple domains (www vs non-www), add both:

- `https://tcioe.edu.np`
- `https://www.tcioe.edu.np`

### After Verification

1. Submit your sitemap: `https://tcioe.edu.np/sitemap.xml`
2. Submit your robots.txt: `https://tcioe.edu.np/robots.txt`
3. Check for any crawl errors
4. Monitor your search performance regularly
