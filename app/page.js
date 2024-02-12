import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 white:bg-zinc-800/30 white:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Mint your first NFT here
         
        </p>
        
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:white:bg-gradient-to-br before:white:from-transparent before:white:to-blue-700 before:white:opacity-10 after:white:from-sky-900 after:white:via-[#0141ff] after:white:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative white:drop-shadow-[0_0_0.3rem_#ffffff70] white:invert"
          src="/art.jpg"
          alt="Artimintify"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid justify-items-center content-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
  <a
    href="/mint"
    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:white:border-neutral-700 hover:dark:bg-neutral-800 hover:white:bg-opacity-30 col-span-full lg:col-span-2"
    target="_blank"
    rel="noopener noreferrer"
  >
    <h2 className={`mb-3 text-2xl font-semibold`}>
      Mint
    </h2>
    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
      Mint NFT here
    </p>
  </a>

  {/* Other grid items here */}

  <a
    href="/all-address"
    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:white:border-neutral-700 hover:dark:bg-neutral-800/30 col-span-full lg:col-span-2"
    target="_blank"
    rel="noopener noreferrer"
  >
    <h2 className={`mb-3 text-2xl font-semibold`}>
      Users Address{" "}
      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
        -&gt;
      </span>
    </h2>
    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
      See users using our platform
    </p>
  </a>
</div>


    </main>
  );
}
