// import { CognitoUser } from '@aws-amplify/auth'
import { Authenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
import { useState, useEffect } from 'react'
import '@aws-amplify/ui-react/styles.css'


function Profile() {
  return(
    <Authenticator>
        {({ signOut, user }) => (
            <div>
                <h1 className="text-3xl font-semibold tracking-wide mt-6">Profile</h1>
                <h3 className="font-medium text-gray-500 my-2">Username: {user?.username}</h3>
                <p className="text-sm text-gray-500 mb-6">Email: {user?.attributes?.email}</p>
                {/* <AmplifySignOut /> */}
                <button onClick={signOut}>SignOut</button>
            </div>
        )}
    </Authenticator>
  )
}

export default Profile


//   const [user, setUser] = useState(null)
//   useEffect(() => {
//     checkUser()
//   },[])
  
//   // Check if the user is authenticated
//   async function checkUser() {
//     Auth.currentAuthenticatedUser().then((authuser)=>{
//         // console.log(authuser)
//         setUser(authuser)
//     })
//   }
//   if (!user) return(null)