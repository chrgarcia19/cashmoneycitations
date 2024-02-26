import LinkBtn from "@/components/LinkBtn";

export default function HomePage() {
  return(
    <>
      <div className="fixed w-full h-screen bg-zinc-700">
        <div className='h-screen flex items-center justify-center pb-20'>
        <div className="card w-96 bg-slate-200 shadow-xl">
            <figure className="px-10 pt-10">
              <img src="cashmoneycitations_logo.png" alt="Cash Money Citations Logo" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Welcome to Cash Money Citations!</h2>
              <div className="card-actions">
                <p>A citation generation website created by: Christian Garcia, Harris Gustafson, Thomas Hohnholt, & Hamza Faisal</p>
              </div>
            </div>
          </div>
          <div className="card w-96 bg-slate-200 shadow-xl">
            <figure className="px-10 pt-10">
              <img src="https://avatars.githubusercontent.com/u/93625102?v=4" alt="GitHub Icon" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Cash Money Citations GitHub Repository</h2>
              <div className="card-actions">
                <LinkBtn linkData="https://github.com/chrgarcia19/cashmoneycitations" text="To GitHub"/>
              </div>
            </div>
          </div>
          <div className="card w-96 bg-slate-200 shadow-xl">
          <figure className="px-10 pt-10">
            <img src="https://github.blog/wp-content/uploads/2020/07/87728232-766b4a80-c777-11ea-8f81-1d468fc360ab.png?fit=1200%2C630" alt="GitHub Icon" className="rounded-xl" />
          </figure>
          <div className="card-body items-center text-center">
            <h2 className="card-title">Cash Money Citations Project Roadmap</h2>
            <p>Note: Do not forget to change iteration to sprint when viewing the roadmap.</p>
            <div className="card-actions">
              <LinkBtn linkData="https://github.com/users/chrgarcia19/projects/2" text="To Roadmap"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}