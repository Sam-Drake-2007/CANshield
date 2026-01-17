export default function LandingPage() {

    return (
        <main  className="bg-black min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center">
            {/* WRITE THE CSS DIRECTLY IN the 'className' attribute, look up the equivalent CSS style on TailwindCSS' site if needed */}
            <div className="text-center">

                <h1 className="text-white text-[7rem] tracking-wide text-balance font-aqua">
                <span className="text-red-500">CAN</span>Shield
                </h1>

                <p className="text-white/80 text-[1.3rem] font-mono ">
                Realtime Canadian artic coordinated strategy simulator.
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-6">

                    <a href="#"className="text-[1.8rem] text-red-500 font-mono font-bold 
                    px-6 py-2.5 bg-white/5
                    ring-2 ring-white/15 
                    hover:bg-white/10 hover:ring-red-500 hover:cursor-pointer hover:duration-500">
                    Defend
                    </a>

                    <a href="#"className="rounded-full text-[1.2rem] text-white/80 font-mono 
                    px-3.5 py-1 bg-white/5 
                    ring-2 ring-white/15
                    hover:bg-white/10 hover:ring-white/25 hover:cursor-pointer hover:duration-500">
                    ?
                    </a>
                    
                </div>
            </div>


            
        </main>
    );
}