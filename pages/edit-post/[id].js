import { Authenticator } from '@aws-amplify/ui-react'
import { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
// import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
// import SimpleMDE from 'react-simplemde-editor'
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
import "easymde/dist/easymde.min.css"
import { getPost } from '../../graphql/queries'
import { updatePost } from '../../graphql/mutations'
import '@aws-amplify/ui-react/styles.css'

const initialState = { title: '', content: '' }

function EditPosts() {
    const [post, setPost] = useState(initialState)
    const router = useRouter()
    const {id} = router.query
    
    useEffect(()=>{
        const fetchPost = async () => {
            if (!id) return
            const postData = await API.graphql({query: getPost, variables: {id}})
            setPost(postData.data.getPost)
        }
        fetchPost()
    }, [id])
    
    if(!post) return null
    
    function onChange(e) {
        setPost(() => ({...post, [e.target.name]: e.target.value }))
    }
    const { title, content } = post

    async function updateCurrentPost() {
        if (!title || !content) return

        await API.graphql({
            query: updatePost,
            variables: { input: {title, content, id} },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        console.log('Post updated successfully')
        router.push(`/my-posts`)
    }

    
    return(
        <Authenticator>
                {({ signOut, user }) => (
                    <div>
                        <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new post</h1>
                        <input
                            onChange={onChange}
                            name="title"
                            placeholder="Title"
                            value={post.title}
                            className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
                        /> 
                        
                        <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
                       
                        <button
                            type="button"
                            className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
                            onClick={updateCurrentPost}
                        >Update Post</button>
                    </div>
                )}
        </Authenticator>
    )
    
}

export default EditPosts