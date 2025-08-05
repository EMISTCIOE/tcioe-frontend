// Suggestion Box Implementation Guide

// DEDICATED SUGGESTION PAGE (Main Implementation)
// - Location: /suggestion-box
// - Accessible from top navigation bar (next to Library and Journal)
// - Full-featured form with comprehensive layout
// - Mobile-responsive design with professional styling

// Navigation Integration:
// - Desktop: Top navigation bar with MessageSquare icon
// - Mobile: Quick Links section in mobile menu
// - Color: Orange accent to stand out from other navigation items

// Page Features:
// - Professional form layout with gradient header
// - Success/error message handling
// - Form validation and loading states
// - Additional information sections
// - Responsive design for all screen sizes

// COMPACT SUGGESTION BOX (Alternative for specific sections)
// - Still available for embedding in specific page content
// - Can be used alongside the main page for targeted feedback
// - Import: import { CompactSuggestionBox } from "@/components/compact-suggestion-box";

// Usage Examples (JSX):
// 1. Basic: <CompactSuggestionBox />
// 2. Custom: <CompactSuggestionBox title="Journal Feedback" placeholder="..." />
// 3. With layout: Place in grid columns alongside main content

// API INTEGRATION
// - Backend: https://api-staging.tcioe.edu.np/api/v1/public/website-mod/submit-feedback
// - Frontend: /api/feedback (proxy route)
// - Method: POST
// - Required fields: fullName, rollNumber, email, feedbackOrSuggestion

// STYLING
// - Uses Tailwind CSS for consistent design
// - Blue color scheme matching site theme
// - Responsive design works on all screen sizes
// - Icons from Lucide React

export {};

// API INTEGRATION
// - Backend: https://api-staging.tcioe.edu.np/api/v1/public/website-mod/submit-feedback
// - Frontend: /api/feedback (proxy route)
// - Method: POST
// - Required fields: fullName, rollNumber, email, feedbackOrSuggestion

// STYLING
// - Uses Tailwind CSS for consistent design
// - Blue color scheme matching site theme
// - Responsive design works on all screen sizes
// - Icons from Lucide React

export {};
