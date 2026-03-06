import React, { useState, useEffect } from 'react'

export default function HomePage() {
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [showTagDropdown, setShowTagDropdown] = useState(false)
  const [allTags, setAllTags] = useState([])
  const [expandedItem, setExpandedItem] = useState(null)
  const [detailData, setDetailData] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showGoToTop, setShowGoToTop] = useState(false)

  useEffect(() => {
    fetchHomeData()

    // Scroll listener untuk Go to Top button
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowGoToTop(true)
      } else {
        setShowGoToTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchHomeData = async () => {
    try {
      const response = await fetch('https://api-lynkio.vercel.app/api/home')
      const data = await response.json()
      if (data.success) {
        setHomeData(data.data)

        // Extract all unique tags
        const tags = new Set()
        Object.values(data.data.sections).flat().forEach(item => {
          item.filterTags?.forEach(tag => tags.add(tag))
        })
        setAllTags(Array.from(tags).sort())
      }
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDetailData = async (slug) => {
    if (expandedItem === slug) {
      setExpandedItem(null)
      setDetailData(null)
      return
    }

    try {
      setLoadingDetail(true)
      setExpandedItem(slug)
      const response = await fetch(`https://api-lynkio.vercel.app/api/site/${slug}`)
      const data = await response.json()
      if (data.success) {
        setDetailData(data.data)
      }
    } catch (error) {
      console.error('Error fetching detail data:', error)
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleTagSelect = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag)
    setShowTagDropdown(false)
    setExpandedItem(null)
    setDetailData(null)
  }

  const getTagIcon = (tag) => {
    if (tag.includes('DDL')) return 'ri-download-line'
    if (tag.includes('MULT')) return 'ri-global-line'
    if (tag.includes('LOGIN')) return 'ri-lock-line'
    if (tag.includes('RAW')) return 'ri-file-code-line'
    if (tag.includes('Self-host')) return 'ri-server-line'
    if (tag.includes('Modern')) return 'ri-mac-line'
    if (tag.includes('Dub')) return 'ri-headphone-line'
    if (tag.includes('Old reliable')) return 'ri-timer-line'
    if (tag.includes('Simple')) return 'ri-pencil-line'
    return 'ri-price-tag-3-line'
  }

  const filterItems = (items) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTag = !selectedTag || item.filterTags?.includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // SKELETON COMPONENT
  const SkeletonCard = () => (
    <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl overflow-hidden animate-pulse">
      <div className="p-3">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-4 bg-indigo-200 rounded"></div>
          <div className="w-5 h-5 bg-indigo-200 rounded-full"></div>
          <div className="flex-1 h-4 bg-indigo-200 rounded"></div>
          <div className="w-5 h-5 bg-indigo-200 rounded"></div>
        </div>
      </div>
    </div>
  )

  const SkeletonSection = () => (
    <div className="break-inside-avoid mb-6">
      <div className="h-6 w-32 bg-indigo-200 rounded mb-2 animate-pulse"></div>
      <div className="space-y-2">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header skeleton */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-indigo-100">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center justify-between h-12">
              <div className="h-6 w-24 bg-indigo-200 rounded animate-pulse"></div>
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block w-64 h-8 bg-indigo-200 rounded-lg animate-pulse"></div>
                <div className="w-20 h-8 bg-indigo-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content skeleton */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Last Update skeleton */}
          <div className="mb-6 bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-indigo-100">
            <div className="h-4 w-64 bg-indigo-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-48 bg-indigo-200 rounded animate-pulse"></div>
          </div>

          {/* Masonry grid skeleton */}
          <div className="columns-1 sm:columns-2 gap-6">
            <SkeletonSection />
            <SkeletonSection />
            <SkeletonSection />
            <SkeletonSection />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-indigo-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Logo on left */}
            <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Lynkio
            </h1>

            {/* Search and Filter on right */}
            <div className="flex items-center space-x-2">
              {/* Search - Desktop */}
              <div className="relative hidden sm:block">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 text-sm"></i>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-9 pr-4 py-1.5 bg-white border border-indigo-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 placeholder:text-indigo-200"
                />
              </div>

              {/* Search - Mobile Icon */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className="sm:hidden p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg"
              >
                <i className="ri-search-line text-xl"></i>
              </button>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowTagDropdown(!showTagDropdown)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-indigo-100 rounded-lg text-sm text-indigo-600 hover:bg-indigo-50"
                >
                  <i className="ri-filter-3-line"></i>
                  <span className="hidden sm:inline">{selectedTag || 'Filter'}</span>
                  <i className={`ri-arrow-${showTagDropdown ? 'up' : 'down'}-s-line text-indigo-300 hidden sm:inline`}></i>
                </button>

                {showTagDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setShowTagDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-sm border border-indigo-100 rounded-lg shadow-lg z-30">
                      <div className="p-2 max-h-96 overflow-y-auto">
                        <button
                          onClick={() => handleTagSelect('')}
                          className="w-full text-left px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          All Tags
                        </button>
                        {allTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleTagSelect(tag)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center space-x-2 ${selectedTag === tag
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'text-indigo-600 hover:bg-indigo-50'
                              }`}
                          >
                            <i className={getTagIcon(tag)}></i>
                            <span>{tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Input */}
          {showMobileSearch && (
            <div className="sm:hidden py-3 border-t border-indigo-100">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 text-sm"></i>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-indigo-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 placeholder:text-indigo-200"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Last Update Info */}
        <div className="mb-6 text-sm text-indigo-700 bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-indigo-100">
          <p className="font-medium">Curated toplist of everything Otaku culture</p>
          <p className="text-xs text-indigo-400 mt-1 flex items-center">
            <i className="ri-time-line mr-1"></i>
            Last update: {homeData?.meta.lastUpdate} • {homeData?.meta.totalItems} items
          </p>
        </div>

        {/* MASONRY GRID - PINTEREST STYLE */}
        <div className="columns-1 sm:columns-2 gap-6">
          {homeData && Object.entries(homeData.sections).map(([sectionName, items]) => {
            const filteredItems = filterItems(items)
            if (filteredItems.length === 0) return null

            // Warna berbeda per section
            const sectionColors = {
              'STREAMING': 'border-l-4 border-l-blue-400',
              'DONGHUA': 'border-l-4 border-l-emerald-400',
              'MANGA': 'border-l-4 border-l-amber-400',
              'NOVEL': 'border-l-4 border-l-purple-400',
              'DRAMA': 'border-l-4 border-l-pink-400',
              'GAMES': 'border-l-4 border-l-indigo-400',
              'APPS': 'border-l-4 border-l-cyan-400',
              'DOWNLOAD': 'border-l-4 border-l-orange-400',
              'MUSIC': 'border-l-4 border-l-rose-400',
            }

            return (
              <div
                key={sectionName}
                className="break-inside-avoid mb-6"
              >
                {/* Section Title dengan aksen warna */}
                <h2 className={`text-sm font-semibold mb-2 px-1 py-1 bg-gradient-to-r from-white to-transparent rounded-r-lg ${sectionColors[sectionName] || 'border-l-4 border-l-gray-400'
                  }`}>
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {sectionName}
                  </span>
                  <span className="ml-2 text-xs text-indigo-400">
                    ({filteredItems.length})
                  </span>
                </h2>

                {/* Items Container */}
                <div className="space-y-2">
                  {filteredItems.map((item) => (
                    <div
                      key={item.slug}
                      className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
                      onClick={() => fetchDetailData(item.slug)}
                    >
                      {/* Card Header */}
                      <div className="p-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-medium text-indigo-300 w-6">#{item.rank}</span>
                          <img
                            src={item.icon}
                            alt={item.title}
                            className="w-5 h-5 rounded object-cover ring-1 ring-indigo-100"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = 'https://via.placeholder.com/20?text='
                            }}
                          />
                          <span className="text-sm text-indigo-900 flex-1 font-medium">{item.title}</span>
                          <i className={`ri-arrow-${expandedItem === item.slug ? 'up' : 'down'}-s-line text-indigo-300 text-lg`}></i>
                        </div>
                      </div>

                      {/* Detail Panel */}
                      {expandedItem === item.slug && (
                        <div className="border-t border-indigo-100 p-3 bg-gradient-to-br from-indigo-50 to-purple-50">
                          {loadingDetail ? (
                            <div className="text-sm text-indigo-300">Loading details...</div>
                          ) : detailData && (
                            <div className="space-y-3">
                              {/* Note */}
                              {detailData.details.note && (
                                <div className="text-sm text-indigo-600 bg-white/50 p-2 rounded-lg">
                                  <i className="ri-information-line mr-1 text-indigo-400"></i>
                                  {detailData.details.note}
                                </div>
                              )}

                              {/* Links */}
                              <div>
                                {/* Main Link */}
                                <div className="flex items-start mb-2">
                                  <span className="text-xs font-medium text-indigo-400 w-16">Main:</span>
                                  <a
                                    href={detailData.links.main.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 bg-white px-2 py-1 rounded-lg"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <i className="ri-external-link-line mr-1"></i>
                                    {detailData.links.main.title}
                                  </a>
                                </div>

                                {/* Alternative Links */}
                                {detailData.links.alternatives?.length > 0 && (
                                  <div className="flex items-start">
                                    <span className="text-xs font-medium text-indigo-400 w-16">Alt:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {detailData.links.alternatives.map((alt, idx) => (
                                        <a
                                          key={idx}
                                          href={alt.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center px-2 py-1 bg-white text-xs text-indigo-600 rounded-lg hover:bg-indigo-100"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <i className="ri-link mr-1"></i>
                                          {alt.text || 'Link'}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Screenshots */}
                              {detailData.media?.screenshots?.length > 0 && (
                                <div>
                                  <h5 className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-2">Screenshots</h5>
                                  <div className="grid grid-cols-3 gap-2">
                                    {detailData.media.screenshots.slice(0, 3).map((ss, idx) => (
                                      <img
                                        key={idx}
                                        src={ss.url}
                                        alt={`Screenshot ${idx + 1}`}
                                        className="rounded-lg border border-indigo-200 w-full h-auto object-contain bg-white"
                                        loading="lazy"
                                      />
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* GO TO TOP BUTTON */}
      {showGoToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm border border-indigo-200 rounded-full shadow-lg hover:shadow-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 group"
          aria-label="Go to top"
        >
          <i className="ri-arrow-up-s-line text-xl text-indigo-400 group-hover:text-indigo-600"></i>
        </button>
      )}
    </div>
  )
}