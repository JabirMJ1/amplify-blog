import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import {useState, useEffect} from 'react'
import '@aws-amplify/ui-react/styles.css'

function profile() {
    const [user, setUser] = useState(null)

    useEffect(()=>{
        checkUser()
    },[])

    // check if an authenticated user is present
    const checkUser = async () => {
        const user = await Auth.currentAuthenticatedUser()
        setUser(user)
    }

    if(!user) return null

    return(
            <div>
                <h1 className="text-3xl font-semibold tracking-wide mt-6">Profile</h1>
                <h3 className="font-medium text-gray-500 my-2">Username: {user.username}</h3>
                <p className="text-sm text-gray-500 mb-6">Email: {user.attributes.email}</p>
                <AmplifySignOut/>
            </div>
    )
}

export default withAuthenticator(profile)