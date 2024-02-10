export default function registerUser() {
    return (
        
        <form className="flex flex-col gap-3">
            <label>Username:
            <input className="border border-slate-500"
            type="text"
            placeholder="Username"/></label>

            <label>First Name:
            <input className="border border-slate-500"
            type="text"
            placeholder="First Name"/></label>

            <label>Last Name:
            <input className="border border-slate-500"
            type="text"
            placeholder="Last Name"/></label>

            <label>Email:
            <input className="border border-slate-500"
            type="text"
            placeholder="Email"/></label>

            <label>Password:
            <input className="border border-slate-500"
            type="password"
            placeholder="Password"/></label>

            <button className='w-full py-3 mt-8 bg-indigo-600 
            hover:bg-indigo-500 relative text-white'>Register</button>
        </form>
    )
}