import {useState, useEffect} from 'react'
import Link from 'next/link'
import {API} from 'aws-amplify'
import {listPosts} from '../graphql/queries'

/**
 * Displays posts
 */
export default function Home(){
  const [posts, setPosts] = useState([])

  useEffect(() =>{
    fetchPosts()
  },[])

  // fetches post from amplify using graphql
  const fetchPosts = async () => {
    const postData = await API.graphql({
      query: listPosts
    })
    setPosts(postData.data.listPosts.items)
  }

  return (
    <div>
      <h1>Posts</h1>
      {
        posts.map((post, index) => (
          <Link key={index} href={`/posts/${post.id}`} passHref>
            <div className="cursor-pointer border-b border-gray-300 mt-8 pb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-500 mt-2">{post.username}</p>
            </div>
          </Link>
        ))
      }
    </div>
  )
}