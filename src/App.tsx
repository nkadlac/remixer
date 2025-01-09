import { useState } from 'react'
import { ClipboardIcon } from '@heroicons/react/24/outline'
import { tweetsFromPost } from './services/claude'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [tweets, setTweets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleRemix = async () => {
    if (!input.trim()) return
    
    setIsLoading(true)
    try {
      const remixed = await tweetsFromPost(input)
      setTweets(remixed.split('|||'))
    } catch (error) {
      console.error('Error remixing content:', error)
      setTweets([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Content Remixer</h1>
        
        <div className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Your Content
            </label>
            <textarea
              id="content"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your content to remix..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleRemix}
            disabled={isLoading || !input.trim()}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Remixing...' : 'Remix Content'}
          </button>

          {tweets.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Generated Tweets:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tweets.map((tweet, index) => (
                  <div 
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col"
                  >
                    <p className="text-gray-800 flex-grow">{tweet}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-gray-400 text-sm">{tweet.length}/280</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(tweet, index)}
                          className="px-2 py-1 text-sm font-medium text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
                        >
                          <ClipboardIcon className="h-4 w-4" />
                          {copiedIndex === index && <span>Copied!</span>}
                        </button>
                        <a 
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 text-sm font-medium text-[#1DA1F2] bg-white rounded-lg border border-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white gap-1.5"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          Post
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
