import LinkBtn from "@/components/LinkBtn";

export default function HomePage() {
  return(
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
  )
}