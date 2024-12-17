import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import store from './store/store.js'
import {Provider} from 'react-redux'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import {
  Home,
  Error,
  User,
  Login,
  Signup,
  Post,
  CreatePost,
  EditPost,
  EditProfile,
  Verification,
  UpdateEmail,
  UpdatePassword,
  Recovery,
  RecoveryTrue
} from './index.js'
import {EmailVerification} from './conponents/export.js'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<Home />} />
      <Route path='signup' element={<Signup />} />
      <Route path='login' element={<Login />} />
      <Route path='user/:userid' element={<User />} />
      <Route path='edit-profile/:userid' element={<EditProfile />} />
      <Route path='confirm-verification' element={<EmailVerification />} />
      <Route path='verify-email' element={<Verification />} />
      <Route path='create-post' element={<CreatePost />} />
      <Route path='edit-email' element={<UpdateEmail />} />
      <Route path='edit-password' element={<UpdatePassword />} />
      <Route path='recovery' element={<Recovery />} />
      <Route path='recovery-confirmation' element={<RecoveryTrue />} />
      <Route path='edit-post/:postid' element={<EditPost />} />
      <Route path='post/:postid' element={<Post />} />{/*not complete*/}
      <Route path='error' element={<Error />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
