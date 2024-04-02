

//local imports
import MyAnimationComponent from './components/MyAnimationComponent'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
    

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <div className="flex w-full max-w-4xl">
          <div className="flex-1 m-4 p-8 bg-gray-200 rounded-lg shadow">
           Cash Money Citations
          </div>
          <div className="flex-1 m-4 p-8 bg-gray-200 rounded-lg shadow">
            <MyAnimationComponent />
          </div>
        </div>
      </main>
    </div>
  )
}
