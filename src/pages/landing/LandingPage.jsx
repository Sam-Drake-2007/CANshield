export default function LandingPage() {
    return (
        <main>
            {/* WRITE THE CSS DIRECTLY IN the 'className' attribute, look up the equivalent CSS style on TailwindCSS' site if needed */}
            <div className="text-center">
                <h1 className="text-black font-bold text-[7rem] tracking-wide text-balance"><span className="text-red-500">CAN</span>Shield</h1>
                <p className="text-gray-500 text-[1.3rem]">Realtime Canadian artic coordinated strategy simulator.</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a href="#"className="rounded-sm font-bold text-[1.8rem] text-black  px-6 py-2.5 bg-red-500 ring-2 ring-black">
                    DEFEND
                    </a>
                    <a href="#"className="rounded-full font-bold text-[1.2rem] text-black  px-3.5 py-1 bg-gray-300 ring-2 ring-gray-500">
                    ?
                    </a>
                </div>
            </div>


            
        </main>
    );
}