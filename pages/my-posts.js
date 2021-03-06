import {useState, useEffect} from 'react'
import Link from 'next/link'
import {API, Auth} from 'aws-amplify'
import { postsByUsername} from '../graphql/queries'
import { deletePost as deletePostMutation} from '../graphql/mutations'


/**
 * Displays posts
 */
export default function MyPost(){
  const [posts, setPosts] = useState([])

  useEffect(() =>{
    fetchPosts()
  },[])

  // fetches post from amplify using graphql
  const fetchPosts = async () => {
      const {username } = await Auth.currentAuthenticatedUser()
    const postData = await API.graphql({
      query: postsByUsername,
      variables: {username}
    })
    setPosts(postData.data.postsByUsername.items)
  }

  async function deletePost(id) {
    await API.graphql({
      query: deletePostMutation,
      variables: { input: { id } },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    fetchPosts()
  }
  
  return (
    <div>
      <h1 className = "text-3xl font-semibold tracking-wide mt-6 mb-2">My Posts</h1>
      {
        posts.map((post, index) => (
          <Link key={index} href={`/posts/${post.id}`} passHref>
            <div className="cursor-pointer border-b border-gray-300 mt-8 pb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-500 mt-2">{post.username}</p>
              <Link href={`/edit-post/${post.id}`}><a className="text-sm  mr-4 text-blue-500">Edit Post</a></Link>
              <Link href={`/posts/${post.id}`}><a className="text-sm  mr-4 text-blue-500">View Post</a></Link>
              <button className="text-sm mr-4 text-red-500" onClick = {()=>deletePost(post.id)}>Delete Post</button>
            </div>
          </Link>
        ))
      }
    </div>
  )
}