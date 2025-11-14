import type { Notice, NoticeCategory } from '@/types';

/**
 * Utility functions for notices
 */

/**
 * Get color class for notice category badge
 */
export function getCategoryColor(categoryName: string): string {
  const colors: Record<string, string> = {
    'Administration': 'bg-red-100 text-red-800 border-red-200',
    'Admission': 'bg-blue-100 text-blue-800 border-blue-200',
    'Examination': 'bg-green-100 text-green-800 border-green-200',
    'Event': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Department': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Society': 'bg-purple-100 text-purple-800 border-purple-200',
    'Club': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Vacancy': 'bg-orange-100 text-orange-800 border-orange-200',
    'Result': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Other': 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return colors[categoryName] || colors['Other'];
}

/**
 * Format published date
 */
export function formatNoticeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format published date for relative time
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch {
    return formatNoticeDate(dateString);
  }
}

/**
 * Extract text content from HTML description
 */
export function extractTextFromHtml(html: string, maxLength?: number): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const text = tempDiv.textContent || tempDiv.innerText || '';
  
  if (maxLength && text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  
  return text;
}

/**
 * Get file extension from URL
 */
export function getFileExtension(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();
    return extension || '';
  } catch {
    return '';
  }
}

/**
 * Check if media is downloadable document
 */
export function isDownloadableDocument(mediaType: string, fileUrl: string): boolean {
  const downloadableTypes = ['DOCUMENT'];
  const downloadableExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
  
  if (downloadableTypes.includes(mediaType)) return true;
  
  const extension = getFileExtension(fileUrl);
  return downloadableExtensions.includes(extension);
}

/**
 * Get media type icon
 */
export function getMediaTypeIcon(mediaType: string, fileUrl: string): string {
  switch (mediaType) {
    case 'IMAGE': return 'image';
    case 'VIDEO': return 'video';
    case 'DOCUMENT': {
      const extension = getFileExtension(fileUrl);
      switch (extension) {
        case 'pdf': return 'file-text';
        case 'doc':
        case 'docx': return 'file-text';
        case 'xls':
        case 'xlsx': return 'sheet';
        case 'ppt':
        case 'pptx': return 'presentation';
        default: return 'file';
      }
    }
    default: return 'file';
  }
}

/**
 * Filter notices by search term
 */
export function filterNoticesBySearch(notices: Notice[], searchTerm: string): Notice[] {
  if (!searchTerm.trim()) return notices;
  
  const term = searchTerm.toLowerCase();
  return notices.filter(notice => 
    notice.title.toLowerCase().includes(term) ||
    notice.description.toLowerCase().includes(term) ||
    notice.author.fullName.toLowerCase().includes(term) ||
    ((notice.department?.name ?? '').toLowerCase().includes(term)) ||
    notice.category.name.toLowerCase().includes(term)
  );
}

/**
 * Sort notices by different criteria
 */
export function sortNotices(notices: Notice[], sortBy: 'date' | 'title' | 'category', order: 'asc' | 'desc' = 'desc'): Notice[] {
  return [...notices].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'category':
        comparison = a.category.name.localeCompare(b.category.name);
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
}
