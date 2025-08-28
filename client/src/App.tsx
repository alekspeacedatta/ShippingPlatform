import { Link } from 'react-router-dom'
import { Button } from './components/commons/Button'
import { Input } from './components/commons/Input'
function App() {
  return (
    <>
      <div className='flex gap-25 items-center h-[100vh]'>
        <form className="flex justify-center flex-col gap-[15px] bc-white rounded-[8px] w-[34vw] ml-[6%] shadow-2xl rounded-3xl p-10 bg-white"> 
          <h1>Login</h1>
            <section className='flex flex-col gap-[10px] w-[80%]'>
              <label htmlFor="">Email: </label>
              <Input type='email' placeholder='enter your email'/>
            </section>
            <section className='flex flex-col gap-[10px] w-[80%]'>
              <label htmlFor="">Password: </label>
              <Input type='password' placeholder='enter your password'/>
            </section>
            <Button type='submit' className='w-[30%]'>Login</Button>
            <p>Dont have account yet? <Link to='/register'>register</Link></p>
        </form>
        <div className=' bg-blue-600 flex flex-col justify-center w-full gap-7 h-[100vh] pl-10'>
          <h1 className='text-white text-7xl'>International</h1>
          <h1 className='text-white text-7xl'>Cargo</h1>
          <h1 className='text-white text-7xl'>Shipping</h1>
          <h1 className='text-white text-7xl'>Platform</h1>
        </div>
      </div>
    </>
  )
}

export default App
