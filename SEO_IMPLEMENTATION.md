# SEO Implementation Guide

This document outlines the comprehensive SEO implementation for the Thapathali Campus website.

## 🚀 Features Implemented

### 1. Automatic Sitemap Generation

- **File**: `app/sitemap.ts`
- **Features**:
  - Dynamic sitemap generation
  - Automatic inclusion of all static routes
  - Dynamic content integration (events, notices, clubs)
  - Proper priority and change frequency settings
  - Automatic last modified dates

### 2. Robots.txt Configuration

- **File**: `app/robots.ts`
- **Features**:
  - Proper bot directives
  - Sitemap reference
  - Disallow sensitive routes
  - Allow important API endpoints for structured data

### 3. Comprehensive SEO Configuration

- **File**: `lib/seo.ts`
- **Features**:
  - Centralized SEO configuration
  - Page-specific SEO templates
  - Department-specific configurations
  - Structured data generators
  - Open Graph and Twitter Card optimization

### 4. Enhanced Layout with SEO Features

- **File**: `app/layout.tsx`
- **Features**:
  - Global metadata configuration
  - Google Analytics integration
  - Microsoft Clarity integration
  - Structured data injection
  - Security headers
  - Performance optimizations

### 5. PWA Manifest

- **File**: `public/manifest.json`
- **Features**:
  - Progressive Web App configuration
  - App icons and screenshots
  - Proper metadata for mobile experience

### 6. SEO Utilities

- **File**: `lib/seo-utils.ts`
- **Features**:
  - URL slug generation
  - Meta description validation
  - Keyword extraction
  - Breadcrumb generation
  - Reading time calculation
  - Content analysis tools

### 7. Dynamic Open Graph Images

- **File**: `app/api/og/route.tsx`
- **Features**:
  - Dynamic OG image generation
  - Multiple templates (default, department, event)
  - Customizable content
  - Optimized for social sharing

### 8. SEO Components

- **Files**: `components/SEO.tsx`, `components/StructuredData.tsx`
- **Features**:
  - Reusable SEO components
  - Structured data injection
  - Page-specific metadata generation

### 9. Analytics Integration

- **File**: `components/GoogleAnalytics.tsx`
- **Features**:
  - Google Analytics 4 integration
  - Custom event tracking hooks
  - Page view tracking
  - Download and outbound link tracking

### 10. SEO Dashboard

- **File**: `components/SEODashboard.tsx`
- **Features**:
  - Real-time SEO analysis
  - Score calculation
  - Issue identification
  - Recommendations

## 🛠️ Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Required
NEXT_PUBLIC_BASE_URL=https://tcioe.edu.np

# Analytics (Optional but recommended)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx

# Search Console Verification
GOOGLE_VERIFICATION_ID=your-verification-code
YANDEX_VERIFICATION_ID=your-verification-code
BING_VERIFICATION_ID=your-verification-code

# Social Media
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/tcioe.official
NEXT_PUBLIC_TWITTER_HANDLE=@tcioe_official
```

### 2. Update Page Metadata

For each page, add SEO metadata:

```tsx
import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";

export const metadata: Metadata = generateSEOMetadata({
  title: "Your Page Title",
  description: "Your page description (120-160 chars)",
  keywords: ["keyword1", "keyword2"],
  url: "/your-page-url",
});
```

### 3. Add Structured Data

Use the StructuredData component for rich snippets:

```tsx
import { StructuredData } from "@/components/StructuredData";

const schema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Event Name",
  // ... other schema properties
};

export default function YourPage() {
  return (
    <>
      <StructuredData data={schema} />
      {/* Your page content */}
    </>
  );
}
```

### 4. Track Analytics Events

Use the analytics hooks for tracking:

```tsx
import { useGoogleAnalytics } from "@/components/GoogleAnalytics";

export default function YourComponent() {
  const { trackEvent, trackDownload } = useGoogleAnalytics();

  const handleDownload = (fileName: string) => {
    trackDownload(fileName, "pdf");
  };

  return (
    <button onClick={() => handleDownload("document.pdf")}>Download</button>
  );
}
```

## 📊 SEO Checklist

### Technical SEO

- ✅ Sitemap.xml automatically generated
- ✅ Robots.txt configured
- ✅ Canonical URLs implemented
- ✅ Meta titles and descriptions
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data (Schema.org)
- ✅ Mobile-friendly design
- ✅ Fast loading times
- ✅ HTTPS enabled
- ✅ Security headers

### Content SEO

- ✅ Proper heading structure (H1, H2, H3...)
- ✅ Alt text for images
- ✅ Internal linking
- ✅ Breadcrumb navigation
- ✅ Page-specific keywords
- ✅ Meta descriptions under 160 chars
- ✅ Titles under 60 chars

### Performance SEO

- ✅ Image optimization
- ✅ Lazy loading
- ✅ Compression enabled
- ✅ Caching headers
- ✅ Minified CSS/JS
- ✅ CDN usage (when applicable)

## 🔧 Customization

### Adding New Pages

1. Create the page component
2. Add metadata using `generateSEOMetadata`
3. Update `app/sitemap.ts` if it's a new static route
4. Add structured data if applicable

### Modifying SEO Templates

Edit `lib/seo.ts` to:

- Add new page configurations in `pageSEOConfig`
- Add new department configurations in `departmentSEOConfig`
- Modify default keywords and descriptions
- Update structured data templates

### Adding New Analytics Events

Extend `components/GoogleAnalytics.tsx`:

- Add new tracking methods
- Create custom event handlers
- Implement conversion tracking

## 📈 Monitoring and Maintenance

### Tools to Use

1. **Google Search Console**: Monitor search performance
2. **Google Analytics**: Track user behavior
3. **PageSpeed Insights**: Monitor page speed
4. **Lighthouse**: Comprehensive audits
5. **Screaming Frog**: Technical SEO auditing

### Regular Tasks

1. Update sitemap when adding new content
2. Monitor Core Web Vitals
3. Check for broken links
4. Update meta descriptions for new content
5. Monitor search rankings
6. Review and update structured data

### SEO Dashboard Usage

Add the SEO dashboard to any admin page:

```tsx
import SEODashboard from "@/components/SEODashboard";

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <SEODashboard showDetails={true} />
    </div>
  );
}
```

## 🔍 Testing

### Local Testing

1. Run `npm run dev`
2. Check sitemap at `http://localhost:3000/sitemap.xml`
3. Check robots.txt at `http://localhost:3000/robots.txt`
4. Use browser dev tools to inspect meta tags
5. Test structured data with Google's Rich Results Test

### Production Testing

1. Verify sitemap accessibility
2. Test Open Graph images on social platforms
3. Run Lighthouse audits
4. Check Google Search Console for errors
5. Monitor analytics data

## 🚨 Common Issues and Solutions

### Sitemap Not Updating

- Check if dynamic content APIs are accessible
- Verify environment variables are set
- Clear Next.js cache: `rm -rf .next`

### Open Graph Images Not Loading

- Ensure the `/api/og` route is accessible
- Check image generation parameters
- Verify base URL is correct

### Analytics Not Tracking

- Confirm GA_ID is set correctly
- Check if ad blockers are interfering
- Verify tracking code implementation

### Poor SEO Scores

- Run the SEO Dashboard to identify issues
- Check meta tag implementation
- Verify structured data validity
- Optimize page loading speed

## 🎯 Next Steps

1. **Content Optimization**: Review and optimize existing content
2. **Link Building**: Implement internal linking strategy
3. **Performance**: Optimize images and implement lazy loading
4. **User Experience**: Improve navigation and site structure
5. **Monitoring**: Set up regular SEO audits and reporting

## 📚 Resources

- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Search Central](https://developers.google.com/search/docs)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

---

For questions or issues, please refer to the documentation or create an issue in the project repository.
