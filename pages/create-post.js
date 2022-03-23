import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react'
import { useState, useRef } from 'react'
import { API, Storage } from 'aws-amplify'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
// import SimpleMDE from 'react-simplemde-editor'
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
import "easymde/dist/easymde.min.css"
import { createPost } from '../graphql/mutations'

const initialState = { title: '', content: '' }

function CreatePost() {
    const [post, setPost] = useState(initialState)
    const { title, content } = post
    const router = useRouter()

    const [image, setImage] = useState(null)
    const hiddenFileInput = useRef(null)

    function onChange(e) {
        setPost(() => ({...post, [e.target.name]: e.target.value }))
    }

    async function createNewPost() {
        if (!title || !content) return
        const id = uuid()
        post.id = id

        if(image){
            const fileName = `${image.name}_${uuid()}`
            post.coverImage = fileName
            await Storage.put(fileName, image)
        }

        await API.graphql({
            query: createPost,
            variables: { input: post },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })

        router.push(`/posts/${id}`)
    }

    const uploadImage = () => {
        hiddenFileInput.current.click()
    }

    const handleChange = (e) =>{
        const fileUploaded = e.target.files[0]
        if (!fileUploaded) return
        setImage(fileUploaded)
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
                        {
                             image && (
                               <img src={URL.createObjectURL(image)} className="my-4" />
                             )
                        }
                        <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />
                        <input
                            type="file"
                            ref={hiddenFileInput}
                            className="absolute w-0 h-0"
                            onChange={handleChange}
                        />
                        <button
                            className="bg-purple-600 text-white font-semibold px-8 py-2 rounded-lg mr-2" 
                            onClick={uploadImage}        
                        >
                            Upload Cover Image
                        </button>
                        <button
                            type="button"
                            className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
                            onClick={createNewPost}
                        >Create Post</button>
                    </div>
                )}
        </Authenticator>
    )
    
}

export default CreatePost